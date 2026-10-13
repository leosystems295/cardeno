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
    sidebar.innerHTML = BRANDS.map(function (b) { return '<li><a href="#' + b.id + '" data-brand="' + b.id + '">' + esc(b.name) + "</a></li>"; }).join("");

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

    function selectModel(name, scroll) {
      fModell.value = name || "";
      $$("button", modelList).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-name") === name)); });
      if (scroll) $("#anfrage").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function route() {
      var parts = decodeURIComponent(location.hash.replace(/^#\/?/, "")).split("/");
      var brand = find(parts[0]);
      if (!brand) {
        view.hidden = true; overview.hidden = false; document.title = baseTitle;
        $$("a", sidebar).forEach(function (a) { a.removeAttribute("aria-current"); });
        return;
      }
      overview.hidden = true; view.hidden = false;
      $("#detail-name").textContent = brand.name;
      $("#detail-count").textContent = brand.models.length + " Modelle";
      $("#detail-brand-text").textContent = brand.name;
      fMarke.value = brand.name;
      modelList.innerHTML = brand.models.map(function (m) { return '<li><button type="button" data-name="' + esc(m.name) + '" aria-pressed="false">' + esc(m.name) + "</button></li>"; }).join("");
      fModell.innerHTML = '<option value="">Modell wählen</option>' + brand.models.map(function (m) { return '<option value="' + esc(m.name) + '">' + esc(m.name) + "</option>"; }).join("") + '<option value="Anderes Modell">Anderes Modell</option>';
      $$("button", modelList).forEach(function (b) { b.addEventListener("click", function () { selectModel(b.getAttribute("data-name"), true); }); });
      $$("a", sidebar).forEach(function (a) { if (a.getAttribute("data-brand") === brand.id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
      document.title = "Leistungssteigerung " + brand.name + " – CARDENO";
      var wanted = parts[1] ? brand.models.filter(function (m) { return m.id === parts[1]; })[0] : null;
      if (wanted) { selectModel(wanted.name, false); setTimeout(function () { $("#anfrage").scrollIntoView({ block: "start" }); }, 60); }
      else window.scrollTo(0, Math.min(window.scrollY, $(".tuning-section").offsetTop - 90));
    }
    window.addEventListener("hashchange", route);
    route();
  }
})();
