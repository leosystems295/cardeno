"""
CARDENO – Webserver für die Website mit direktem Versand der Kontaktformulare.

Das Programm macht zwei Dinge:
  1. Es liefert die Website aus (HTML, CSS, JS, Bilder).
  2. Es nimmt die Formulare unter /api/kontakt entgegen und schickt sie als E-Mail
     direkt an info@cardeno.ch (über den Hostpoint-Mailserver).

Einstellungen werden bei Render unter «Environment» eingetragen, NICHT in diese Datei:
  SMTP_USER   E-Mail-Adresse des Postfachs, z. B. info@cardeno.ch
  SMTP_PASS   Passwort dieses Postfachs
  MAIL_TO     (optional) Empfänger der Anfragen, Standard: SMTP_USER
  SMTP_HOST   (optional) Standard: asmtp.mail.hostpoint.ch
  SMTP_PORT   (optional) Standard: 587 (STARTTLS), bei 465 wird SSL verwendet
"""
import logging
import os
import re
import smtplib
import ssl
import time
from collections import defaultdict, deque
from email.message import EmailMessage
from email.utils import formataddr

from flask import Flask, abort, jsonify, request, send_from_directory

ROOT = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder=None)
app.config["MAX_CONTENT_LENGTH"] = 64 * 1024
log = logging.getLogger("cardeno")

PUBLIC_DIRS = {"css", "js", "images"}
PUBLIC_EXT = {".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico", ".txt", ".xml", ".webmanifest"}

# ---------------------------------------------------------------- Website ausliefern


def _safe_file(rel):
    rel = rel.strip("/")
    if not rel:
        rel = "index.html"
    parts = rel.split("/")
    if ".." in parts or any(p.startswith(".") for p in parts):
        return None
    if len(parts) == 1:
        # Hauptordner: nur Seiten und Dateien wie favicon, robots.txt
        cand = rel if os.path.splitext(rel)[1] else rel + ".html"
    elif parts[0] in PUBLIC_DIRS and len(parts) == 2:
        cand = rel
    else:
        return None
    if os.path.splitext(cand)[1].lower() not in PUBLIC_EXT:
        return None
    if cand in {"requirements.txt", "app.py"}:
        return None
    full = os.path.join(ROOT, cand)
    return cand if os.path.isfile(full) else None


@app.get("/", defaults={"path": ""})
@app.get("/<path:path>")
def site(path):
    cand = _safe_file(path)
    if not cand:
        abort(404)
    resp = send_from_directory(ROOT, cand)
    resp.headers["Cache-Control"] = "public, max-age=300" if cand.endswith(".html") else "public, max-age=3600"
    return resp


@app.after_request
def headers(resp):
    resp.headers.setdefault("X-Content-Type-Options", "nosniff")
    resp.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    return resp


@app.errorhandler(404)
def not_found(_e):
    if request.path.startswith("/api/"):
        return jsonify(ok=False), 404
    return (
        "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>"
        "<title>Seite nicht gefunden – CARDENO</title>"
        "<body style='margin:0;display:grid;place-items:center;min-height:100vh;background:#04060a;color:#fff;font-family:system-ui,sans-serif;text-align:center'>"
        "<div><h1>Seite nicht gefunden</h1><p><a style='color:#7db1ff' href='/'>Zur Startseite</a></p></div>",
        404,
    )


# ---------------------------------------------------------------- Formular -> E-Mail

EMAIL_RE = re.compile(r"^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s.]{2,}$")
_hits = defaultdict(deque)  # IP -> Zeitpunkte


def _too_many(ip, limit=5, window=600):
    now = time.time()
    q = _hits[ip]
    while q and now - q[0] > window:
        q.popleft()
    if len(q) >= limit:
        return True
    q.append(now)
    return False


def _clean(s, limit=2000):
    s = (s or "").replace("\r", "")
    s = "".join(ch for ch in s if ch == "\n" or ch >= " ")
    return s.strip()[:limit]


def _oneline(s, limit=200):
    return re.sub(r"\s+", " ", _clean(s, limit)).strip()


def send_mail(msg):
    """Verschickt die Nachricht. Wird in Tests ersetzt."""
    host = os.environ.get("SMTP_HOST", "asmtp.mail.hostpoint.ch")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ["SMTP_USER"]
    pw = os.environ["SMTP_PASS"]
    ctx = ssl.create_default_context()
    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=20, context=ctx) as s:
            s.login(user, pw)
            s.send_message(msg)
    else:
        with smtplib.SMTP(host, port, timeout=20) as s:
            s.starttls(context=ctx)
            s.login(user, pw)
            s.send_message(msg)


@app.post("/api/kontakt")
def kontakt():
    f = request.form
    if f.get("website"):  # Spam-Falle: Menschen sehen das Feld nicht
        return jsonify(ok=True)
    ip = (request.headers.get("X-Forwarded-For", request.remote_addr or "").split(",")[0]).strip()
    if _too_many(ip):
        return jsonify(ok=False, error="zu viele Anfragen"), 429

    name = _oneline(f.get("name"), 120)
    email = _oneline(f.get("email"), 200)
    if not name or not EMAIL_RE.match(email):
        return jsonify(ok=False, error="Angaben unvollständig"), 400

    subject = _oneline(f.get("_subject"), 120) or "Anfrage über die Website"
    summary = _clean(f.get("_zusammenfassung"), 6000)
    if not summary:
        parts = []
        for k, v in f.items():
            if k in ("website", "_subject", "_zusammenfassung") or not v.strip():
                continue
            parts.append("%s: %s" % (_oneline(k, 40), _clean(v, 1500)))
        summary = "\n".join(parts)

    to = os.environ.get("MAIL_TO") or os.environ.get("SMTP_USER", "")
    sender = os.environ.get("SMTP_USER", "")
    if not to or not sender or not os.environ.get("SMTP_PASS"):
        log.error("SMTP ist nicht eingerichtet (SMTP_USER / SMTP_PASS fehlen)")
        return jsonify(ok=False, error="Versand nicht eingerichtet"), 503

    msg = EmailMessage()
    msg["From"] = formataddr(("Website CARDENO", sender))
    msg["To"] = to
    msg["Reply-To"] = formataddr((name, email))
    msg["Subject"] = subject
    msg.set_content(summary + "\n\n--\nGesendet über das Formular auf cardeno.ch")
    try:
        send_mail(msg)
    except Exception:  # noqa: BLE001
        log.exception("E-Mail konnte nicht gesendet werden")
        return jsonify(ok=False, error="Versand fehlgeschlagen"), 502
    return jsonify(ok=True)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")), debug=False)
