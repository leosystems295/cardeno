/* CARDENO – Skripte (Navigation, Kontaktdaten, Marken & Modelle, Formulare) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var CFG = window.CARDENO_CONFIG || {};
  var BRANDS = window.CARDENO_BRANDS || [];
  var slug = window.CARDENO_SLUG || function (s) { return s; };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function find(id) { for (var i = 0; i < BRANDS.length; i++) if (BRANDS[i].id === id) return BRANDS[i]; return null; }

  /* ---------- Navigation (Mobile) ---------- */
  var toggle = $(".nav-toggle");
  var nav = $("#hauptnavigation");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schliessen" : "Menü öffnen");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { toggle.click(); toggle.focus(); }
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { if (nav.classList.contains("is-open")) toggle.click(); }); });
  }

  /* ---------- Kontaktdaten aus config.js ---------- */
  var address = [CFG.strasse, [CFG.plz, CFG.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  var VALUES = {
    adresse: address,
    strasse: CFG.strasse, plzort: [CFG.plz, CFG.ort].filter(Boolean).join(" "),
    telefon: CFG.telefon, email: CFG.email, instagram: CFG.instagram, facebook: CFG.facebook,
    inhaber: CFG.inhaber, uid: CFG.uid, firma: CFG.firma,
    // Solange kein eigener Link eingetragen ist, führt der Button zur Startseite des Portals
    autoscout: CFG.autoscout || "https://www.autoscout24.ch",
    motoscout: CFG.motoscout || "https://www.motoscout24.ch"
  };
  $$("[data-c]").forEach(function (el) {
    var key = el.getAttribute("data-c");
    if (key === "oeffnungszeiten") return;
    var val = VALUES[key];
    if (!val) { el.hidden = true; return; }
    $$("[data-v]", el).forEach(function (v) { v.textContent = val; });
    if (el.hasAttribute("data-v")) el.textContent = val;
    $$("a[data-link]", el).concat(el.matches("a[data-link]") ? [el] : []).forEach(function (a) {
      var kind = a.getAttribute("data-link");
      if (kind === "tel") a.href = "tel:" + String(val).replace(/[^\d+]/g, "");
      else if (kind === "mail") a.href = "mailto:" + val;
      else a.href = val;
    });
  });
  var hoursRows = (CFG.oeffnungszeiten || []);
  $$('[data-c="oeffnungszeiten"]').forEach(function (el) {
    if (!hoursRows.length) { el.hidden = true; return; }
    var list = $("[data-hours]", el);
    if (list) list.innerHTML = hoursRows.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("");
  });
  var topbar = $(".topbar");
  if (topbar) {
    var anyVisible = $$("[data-c]", topbar).some(function (n) { return !n.hidden; });
    if (!anyVisible) topbar.hidden = true;
  }
  $$("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
  if (CFG.telefon || CFG.email || address) $$("[data-contact-empty]").forEach(function (n) { n.hidden = true; });

  /* ---------- Formulare ---------- */
  function setupForm(form) {
    var status = $(".form-status", form);
    var btn = $('button[type="submit"]', form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector('[name="website"]').value) return; // Spam-Falle
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var fd = new FormData(form);
      fd.delete("website");
      var lines = [];
      fd.forEach(function (v, k) {
        if (!v || k === "_subject" || k === "nachricht") return;
        var field = form.querySelector('[name="' + k + '"]');
        var label = (field && field.getAttribute("data-label")) || k;
        lines.push(label + ": " + v);
      });
      var message = fd.get("nachricht") || "";
      var subject = fd.get("_subject") || "Anfrage über die Website";

      function done(ok, text) {
        status.className = "form-status " + (ok ? "is-ok" : "is-error");
        status.textContent = text;
        if (btn) btn.disabled = false;
      }

      if (CFG.formEndpoint) {
        if (btn) btn.disabled = true;
        status.className = "form-status"; status.textContent = "Wird gesendet …";
        fetch(CFG.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); done(true, "Danke für deine Anfrage. Ich melde mich so rasch wie möglich bei dir."); })
          .catch(function () { done(false, "Das Senden hat nicht geklappt. Bitte versuche es später nochmals oder ruf mich an."); });
      } else if (CFG.email) {
        var body = lines.join("\n") + (message ? "\n\n" + message : "") + "\n\nFreundliche Grüsse\n" + (fd.get("name") || "");
        window.location.href = "mailto:" + CFG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        done(true, "Dein E-Mail-Programm hat sich geöffnet. Sende die vorbereitete Nachricht dort ab.");
      } else {
        done(false, "Das Formular ist noch nicht eingerichtet. Trage die E-Mail-Adresse in js/config.js ein.");
      }
    });
  }
  $$("form[data-request]").forEach(setupForm);

  /* ---------- Startseite: Stage-Auswahl im Hero (Scheinwerfer leuchten stärker) ---------- */
  var hero = $(".sh");
  if (hero) {
    var STAGE_TEXT = {
      1: "Software bei serienmässiger Hardware. Mehr Leistung, ohne Umbau am Fahrzeug.",
      2: "Software und passende Hardware, etwa Abgasanlage oder Ansaugung.",
      3: "Umfassende Optimierung für Spezialprojekte und Rennstrecke."
    };
    var stageBtns = $$(".sh__pick button", hero);
    var stageDesc = $(".sh__desc", hero);
    var setStage = function (n) {
      hero.setAttribute("data-stage", n);
      stageBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-stage") === String(n))); });
      stageDesc.textContent = STAGE_TEXT[n];
    };
    stageBtns.forEach(function (b) { b.addEventListener("click", function () { setStage(b.getAttribute("data-stage")); }); });
    window.setTimeout(function () { hero.classList.add("is-lit"); }, 900);
  }

  /* ---------- Startseite: Fahrzeug-Finder ---------- */
  var finder = $("#finder");
  if (finder && BRANDS.length) {
    var sMarke = $("#finder-marke"), sModell = $("#finder-modell");
    sMarke.innerHTML = '<option value="">Marke</option>' + BRANDS.map(function (b) { return '<option value="' + b.id + '">' + esc(b.name) + "</option>"; }).join("");
    sMarke.addEventListener("change", function () {
      var b = find(sMarke.value);
      sModell.innerHTML = '<option value="">' + (b ? "Modell (optional)" : "Modell") + "</option>" +
        (b ? b.models.map(function (m) { return '<option value="' + m.id + '">' + esc(m.name) + "</option>"; }).join("") : "");
      sModell.disabled = !b;
    });
    finder.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!sMarke.value) { sMarke.focus(); return; }
      window.location.href = "leistungssteigerung.html#" + sMarke.value + (sModell.value ? "/" + sModell.value : "");
    });
  }

  /* ---------- Leistungssteigerung: Marken & Modelle ---------- */
  var overview = $("#marken-uebersicht");
  var view = $("#marken-detail");
  if (overview && view && BRANDS.length) {
    var grid = $("#marken-grid"), sidebar = $("#marken-liste"), search = $("#marken-suche"), emptyMsg = $("#marken-leer");
    var baseTitle = document.title;

    grid.innerHTML = BRANDS.map(function (b) {
      return '<li><a class="brand-tile" href="#' + b.id + '" data-initial="' + esc(b.name.charAt(0)) + '" data-name="' + esc(b.name.toLowerCase()) + '"><strong>' + esc(b.name) + "</strong><span>" + b.models.length + " Modelle</span></a></li>";
    }).join("");
    /* Seitenliste: Marken, beim geöffneten Hersteller darunter alle Modelle (wie bei hmperformance.ch) */
    function renderSidebar(brand, modelName) {
      sidebar.innerHTML = BRANDS.map(function (b) {
        var open = !!brand && b.id === brand.id;
        var html = "<li" + (open ? ' class="is-open"' : "") + '><a href="#' + b.id + '" data-brand="' + b.id + '"' + (open ? ' aria-expanded="true"' : "") + (open && !modelName ? ' aria-current="true"' : "") + ">" + esc(b.name) + "</a>";
        if (open) {
          html += '<ul class="brand-nav__models">' + b.models.map(function (mo) {
            return '<li><a href="#' + b.id + "/" + mo.id + '" data-model="' + esc(mo.name) + '"' + (mo.name === modelName ? ' aria-current="true"' : "") + ">" + esc(mo.name) + "</a></li>";
          }).join("") + "</ul>";
        }
        return html + "</li>";
      }).join("");
      var cur = $('a[aria-current="true"]', sidebar), bA = $("li.is-open > a", sidebar);
      if (bA) {
        var base = sidebar.getBoundingClientRect().top;
        var toBrand = bA.getBoundingClientRect().top - base - 6;
        var toCur = cur ? cur.getBoundingClientRect().top - base : 0;
        // Marke oben zeigen. Liegt das gewählte Modell weiter unten, so scrollen, dass es sichtbar bleibt.
        sidebar.scrollTop += (cur && toCur - toBrand > sidebar.clientHeight - 70) ? toCur - sidebar.clientHeight / 2 : toBrand;
      }
    }
    renderSidebar(null, "");

    if (search) search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase(), n = 0;
      $$("li", grid).forEach(function (li) {
        var hit = !q || $("a", li).getAttribute("data-name").indexOf(q) !== -1;
        li.hidden = !hit; if (hit) n++;
      });
      emptyMsg.hidden = n > 0;
    });

    var form = $("#marken-formular");
    var fMarke = $("#f-marke"), fModell = $("#f-modell"), modelList = $("#modell-liste");

    /* ---------- Leistungsübersicht (Serie / Stage 1–3) ---------- */
    var power = $("#leistung");
    var POWER = window.CARDENO_POWER || {};
    var pw = { brand: null, model: null, rows: [], vi: 0, stage: 1 };
    var HINT = CFG.leistungHinweis || "Richtwerte. Die genauen Werte hängen von Motor, Baujahr, Zustand und Fahrzeug ab. Vor dem Auftrag sage ich dir ehrlich, was bei deinem Fahrzeug möglich ist.";

    function pct(a, b) { return Math.round((b - a) / a * 100); }
    function sign(n) { return (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(n); }
    var STAGES = (CFG.leistungStufen && CFG.leistungStufen.length) ? CFG.leistungStufen.slice().sort() : [1];
    function stageOf(v, k) { return STAGES.indexOf(k) >= 0 ? (v["s" + k] || null) : null; }
    function firstStage(v) { for (var i = 0; i < STAGES.length; i++) if (stageOf(v, STAGES[i])) return STAGES[i]; return 0; }

    function renderPower() {
      if (!power) return;
      if (!pw.model) { power.hidden = true; power.innerHTML = ""; return; }
      var title = pw.brand.name + " " + pw.model.name;
      var h = '<div class="power__head"><p class="kicker">Leistungsübersicht</p><h3 id="leistung-titel">' + esc(title) + "</h3></div>";
      var cta = '<button class="btn" type="button" data-power-cta><span>Anfrage für ' + esc(title) + "</span></button>";
      if (!pw.rows.length) {
        var typ = [
          ["Turbo-Diesel", "+18 bis +25 %", "+20 bis +30 %"],
          ["Turbo-Benziner", "+15 bis +25 %", "+15 bis +25 %"],
          ["Saug-Benziner", "+3 bis +7 %", "+3 bis +6 %"]
        ];
        power.innerHTML = h + '<p class="power__motor">Stage 1 · typische Werte nach Motorart</p>' +
          '<div class="power__typ">' + typ.map(function (r) {
            return '<div><h4>' + r[0] + '</h4><p><strong>' + r[1] + '</strong><span>Leistung</span></p><p><strong>' + r[2] + '</strong><span>Drehmoment</span></p></div>';
          }).join("") + "</div>" +
          '<p class="power__note">Richtwerte für Stage 1. Wie viel es bei deinem ' + esc(title) + ' genau ist, hängt von Motor, Baujahr und Zustand ab. Schick mir die Angaben zu deinem Fahrzeug, ich nenne dir die genauen Werte und sage dir ehrlich, was möglich ist.</p><div class="power__foot">' + cta + "</div>";
        power.hidden = false; return;
      }
      var v = pw.rows[pw.vi] || pw.rows[0];
      if (!stageOf(v, pw.stage)) pw.stage = firstStage(v) || 1;
      var t = stageOf(v, pw.stage), s = v.serie;

      var variants = "";
      if (pw.rows.length > 1) {
        variants = '<div class="power__variants" role="group" aria-label="Motorisierung wählen">' + pw.rows.map(function (r, i) {
          return '<button type="button" data-vi="' + i + '" aria-pressed="' + (i === pw.vi) + '">' + esc(r.motor) + "</button>";
        }).join("") + "</div>";
      } else {
        variants = '<p class="power__motor">' + esc(v.motor) + (v.jahre ? " · " + esc(v.jahre) : "") + "</p>";
      }
      var sub = pw.rows.length > 1 && v.jahre ? '<p class="power__motor">Baujahre ' + esc(v.jahre) + "</p>" : "";
      var badge = v.beispiel ? '<p class="power__badge">Beispielwerte, nicht verbindlich</p>' : "";

      var tabs = STAGES.length < 2 ? "" : '<div class="power__tabs" role="group" aria-label="Stufe wählen">' + STAGES.map(function (k) {
        var has = !!stageOf(v, k);
        return '<button type="button" data-stage="' + k + '" aria-pressed="' + (k === pw.stage) + '"' + (has ? "" : " disabled") + ">Stage " + k + "</button>";
      }).join("") + "</div>";

      var stats = '<div class="power__stats">' +
        '<div><strong>' + sign(t.ps - s.ps) + ' PS</strong><span>mehr Leistung</span></div>' +
        '<div><strong>' + sign(t.nm - s.nm) + ' Nm</strong><span>mehr Drehmoment</span></div>' +
        '<div><strong>' + sign(pct(s.ps, t.ps)) + ' %</strong><span>Leistung</span></div></div>';

      function maxOf(key) {
        var m = v.serie[key];
        for (var i = 0; i < STAGES.length; i++) { var x = stageOf(v, STAGES[i]); if (x && x[key] > m) m = x[key]; }
        return m;
      }
      function bars(label, key, unit) {
        var max = maxOf(key);
        return '<div class="power__bar"><h4>' + label + "</h4>" +
          '<div class="pb"><span>Serie</span><i><b style="width:' + (s[key] / max * 100).toFixed(1) + '%"></b></i><em>' + s[key] + " " + unit + "</em></div>" +
          '<div class="pb pb--on"><span>Stage ' + pw.stage + '</span><i><b style="width:' + (t[key] / max * 100).toFixed(1) + '%"></b></i><em>' + t[key] + " " + unit + "</em></div></div>";
      }

      var head = "<tr><th scope=\"col\"><span class=\"visually-hidden\">Wert</span></th><th scope=\"col\">Serie</th>" + STAGES.map(function (k) { return '<th scope="col"' + (k === pw.stage ? ' class="on"' : "") + ">Stage " + k + "</th>"; }).join("") + "</tr>";
      function row(label, key, unit) {
        return "<tr><th scope=\"row\">" + label + "</th><td>" + s[key] + "</td>" + STAGES.map(function (k) {
          var x = stageOf(v, k);
          return "<td" + (k === pw.stage ? ' class="on"' : "") + ">" + (x ? x[key] + (key === "ps" ? ' <small>' + sign(pct(s.ps, x.ps)) + " %</small>" : "") : "–") + "</td>";
        }).join("") + "</tr>";
      }
      var table = '<div class="power__table"><table><caption class="visually-hidden">Leistung und Drehmoment: Serie gegen Tuning, ein Strich bedeutet: Stufe auf Anfrage</caption><thead>' + head + "</thead><tbody>" + row("Leistung (PS)", "ps", "PS") + row("Drehmoment (Nm)", "nm", "Nm") + "</tbody></table></div>";

      power.innerHTML = h + badge + variants + sub + tabs + stats + '<div class="power__bars">' + bars("Leistung", "ps", "PS") + bars("Drehmoment", "nm", "Nm") + "</div>" + table +
        '<p class="power__note">' + esc(HINT) + '</p><div class="power__foot">' + cta + "</div>";
      power.hidden = false;
    }

    if (power) {
      power.addEventListener("click", function (e) {
        var b = e.target.closest("button"); if (!b) return;
        if (b.hasAttribute("data-power-cta")) { $("#anfrage").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
        if (b.hasAttribute("data-vi")) {
          pw.vi = +b.getAttribute("data-vi");
          var mo = $("#f-motor"); if (mo && pw.rows[pw.vi]) mo.value = pw.rows[pw.vi].motor;
          renderPower(); return;
        }
        if (b.hasAttribute("data-stage")) {
          pw.stage = +b.getAttribute("data-stage");
          var sel = $("#f-stufe"); if (sel) sel.value = "Stage " + pw.stage;
          renderPower();
        }
      });
    }

    function showPower(brand, name) {
      var model = brand && name ? brand.models.filter(function (m) { return m.name === name; })[0] : null;
      pw.brand = brand; pw.model = model || null; pw.vi = 0; pw.stage = 1;
      pw.rows = model ? (POWER[brand.id + "/" + model.id] || []) : [];
      if (pw.rows.length) pw.stage = firstStage(pw.rows[0]) || 1;
      renderPower();
    }
    var curBrand = null;

    function selectModel(name, scroll) {
      fModell.value = name || "";
      $$("button", modelList).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-name") === name)); });
      showPower(curBrand, name);
      renderSidebar(curBrand, name);
      var target = (power && !power.hidden) ? power : $("#anfrage");
      if (scroll) {
        var mo = curBrand && curBrand.models.filter(function (x) { return x.name === name; })[0];
        if (mo && history.replaceState) history.replaceState(null, "", "#" + curBrand.id + "/" + mo.id);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    fModell.addEventListener("change", function () {
      $$("button", modelList).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-name") === fModell.value)); });
      showPower(curBrand, fModell.value);
      renderSidebar(curBrand, fModell.value);
    });

    function route() {
      var parts = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/");
      var brand = find(parts[0]);
      if (!brand) {
        view.hidden = true; overview.hidden = false; document.title = baseTitle;
        renderSidebar(null, "");
        return;
      }
      overview.hidden = true; view.hidden = false;
      curBrand = brand; showPower(brand, "");
      $("#detail-name").textContent = brand.name;
      $("#detail-count").textContent = brand.models.length + " Modelle";
      $("#detail-brand-text").textContent = brand.name;
      fMarke.value = brand.name;
      modelList.innerHTML = brand.models.map(function (m) { return '<li><button type="button" data-name="' + esc(m.name) + '" aria-pressed="false">' + esc(m.name) + "</button></li>"; }).join("");
      fModell.innerHTML = '<option value="">Modell wählen</option>' + brand.models.map(function (m) { return '<option value="' + esc(m.name) + '">' + esc(m.name) + "</option>"; }).join("") + '<option value="Anderes Modell">Anderes Modell</option>';
      $$("button", modelList).forEach(function (b) { b.addEventListener("click", function () { selectModel(b.getAttribute("data-name"), true); }); });
      renderSidebar(brand, "");
      document.title = "Leistungssteigerung " + brand.name + " – CARDENO";
      var wanted = parts[1] ? brand.models.filter(function (m) { return m.id === parts[1]; })[0] : null;
      if (wanted) { selectModel(wanted.name, false); setTimeout(function () { (power && !power.hidden ? power : $("#anfrage")).scrollIntoView({ block: "start" }); }, 60); }
      else window.scrollTo(0, Math.min(window.scrollY, $(".tuning-section").offsetTop - 90));
    }
    window.addEventListener("hashchange", route);
    route();
  }
})();
