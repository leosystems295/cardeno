/* CARDENO – Cookie-Hinweis
   Speichert die Auswahl nur im Browser (localStorage, Schlüssel "cardeno-consent").
   Statistik-Skript: In js/config.js unter "analytics" die Script-URL eintragen.
   Es wird erst geladen, wenn die Person "Statistik" erlaubt hat. */
(function () {
  "use strict";
  var KEY = "cardeno-consent";
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;
  var CFG = window.CARDENO_CONFIG || {};
  var banner = null, modal = null, lastFocus = null;

  function read() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY));
      if (d && d.v === 1 && typeof d.statistik === "boolean" && Date.now() - d.ts < MAX_AGE) return d;
    } catch (e) {}
    return null;
  }
  function write(statistik) {
    var d = { v: 1, statistik: !!statistik, ts: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
    return d;
  }
  function apply(d) {
    window.cardenoConsent = { statistik: d.statistik };
    try { document.dispatchEvent(new CustomEvent("cardeno:consent", { detail: window.cardenoConsent })); } catch (e) {}
    if (d.statistik && CFG.analytics && !document.getElementById("cardeno-analytics")) {
      var s = document.createElement("script");
      s.id = "cardeno-analytics"; s.async = true; s.src = CFG.analytics;
      document.head.appendChild(s);
    }
  }
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html) n.innerHTML = html;
    return n;
  }
  function close(node) { if (node && node.parentNode) node.parentNode.removeChild(node); }

  function decide(statistik) {
    apply(write(statistik));
    close(banner); banner = null;
    closeModal();
  }

  function showBanner() {
    if (banner) return;
    banner = el("section", { "class": "ck", role: "region", "aria-label": "Cookie-Hinweis" },
      '<h2 class="ck__title">Cookies und Datenschutz</h2>' +
      '<p class="ck__text">Diese Website funktioniert auch ohne Zusatz-Cookies. Mit Ihrer Erlaubnis nutzen wir zusätzlich Statistik, um die Seite zu verbessern. Mehr dazu in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>' +
      '<div class="ck__btns">' +
        '<button type="button" class="btn" data-ck="all"><span>Alle akzeptieren</span></button>' +
        '<button type="button" class="btn btn--ghost" data-ck="necessary"><span>Nur notwendige</span></button>' +
      '</div>' +
      '<button type="button" class="ck__link" data-ck="settings">Einstellungen</button>');
    banner.addEventListener("click", function (e) {
      var t = e.target.closest("[data-ck]"); if (!t) return;
      var a = t.getAttribute("data-ck");
      if (a === "all") decide(true);
      else if (a === "necessary") decide(false);
      else openModal();
    });
    document.body.appendChild(banner);
  }

  function openModal() {
    if (modal) return;
    lastFocus = document.activeElement;
    var cur = read();
    var statText = CFG.analytics
      ? "Hilft uns zu verstehen, wie die Website genutzt wird. Wird nur mit Ihrer Erlaubnis geladen."
      : "Zurzeit setzt diese Website keine Statistik ein. Ihre Wahl gilt, falls wir später eine einbinden.";
    modal = el("div", { "class": "ck-modal" },
      '<div class="ck-modal__bg" data-ck-close></div>' +
      '<div class="ck-modal__box" role="dialog" aria-modal="true" aria-labelledby="ck-m-title">' +
        '<h2 id="ck-m-title">Cookie-Einstellungen</h2>' +
        '<div class="ck-row"><div><strong>Notwendig</strong><p>Damit die Website funktioniert und Ihre Auswahl hier gemerkt wird. Immer aktiv.</p></div>' +
          '<label class="ck-switch"><input type="checkbox" checked disabled><span class="ck-switch__ui" aria-hidden="true"></span><span class="visually-hidden">Notwendig, immer aktiv</span></label></div>' +
        '<div class="ck-row"><div><strong>Statistik</strong><p>' + statText + '</p></div>' +
          '<label class="ck-switch"><input type="checkbox" id="ck-stat"' + (cur && cur.statistik ? " checked" : "") + '><span class="ck-switch__ui" aria-hidden="true"></span><span class="visually-hidden">Statistik erlauben</span></label></div>' +
        '<div class="ck-modal__btns">' +
          '<button type="button" class="btn" data-ck-save><span>Auswahl speichern</span></button>' +
          '<button type="button" class="btn btn--ghost" data-ck-all><span>Alle akzeptieren</span></button>' +
        '</div>' +
      '</div>');
    modal.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-ck-close")) closeModal();
      else if (e.target.closest("[data-ck-save]")) decide(document.getElementById("ck-stat").checked);
      else if (e.target.closest("[data-ck-all]")) decide(true);
    });
    modal.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key !== "Tab") return;
      var f = Array.prototype.slice.call(modal.querySelectorAll("button, input:not([disabled]), a[href]"));
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    document.body.appendChild(modal);
    document.documentElement.classList.add("ck-lock");
    var b = modal.querySelector("[data-ck-save]"); if (b) b.focus();
  }
  function closeModal() {
    if (!modal) return;
    close(modal); modal = null;
    document.documentElement.classList.remove("ck-lock");
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-cookie-settings]");
    if (t) { e.preventDefault(); openModal(); }
  });

  var saved = read();
  if (saved) apply(saved); else showBanner();
})();
