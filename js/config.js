/*
  ============================================================
  KONTAKTDATEN VON CARDENO – hier einmal eintragen
  ============================================================
  Alles, was hier leer bleibt, wird auf der Website automatisch ausgeblendet.
  Sobald du etwas einträgst, erscheint es überall (Kopfzeile, Fusszeile,
  Kontaktseite, Impressum, Datenschutz).
*/
window.CARDENO_CONFIG = {
  firma: "CARDENO",

  // Adresse
  strasse: "Ausserdorfweg 461",
  plz: "5325",
  ort: "Leibstadt",

  // Kontakt
  telefon: "+41 76 509 22 22",
  email: "info@cardeno.ch",

  // Fahrzeug-Inserate: komplette Links zu den eigenen Händler-Seiten.
  autoscout: "https://www.autoscout24.ch/de/s/seller-3096174",
  motoscout: "https://www.motoscout24.ch/de/s/seller-3096174",

  // Social Media (komplette Links)
  instagram: "",        // z. B. "https://www.instagram.com/…"
  facebook: "",

  // Öffnungszeiten: je Zeile ["Tage", "Zeiten"]
  oeffnungszeiten: [
    ["Besuch", "Nur nach Vereinbarung"]
  ],

  // Impressum (optional)
  inhaber: "",          // Name der verantwortlichen Person
  uid: "",              // z. B. "CHE-123.456.789"

  /*
    Kontaktformular:
    - Leer lassen: Das Formular öffnet das E-Mail-Programm mit einer fertigen Nachricht
      an die oben eingetragene E-Mail-Adresse.
    - "/api/kontakt": Die Anfragen werden direkt im Hintergrund per E-Mail gesendet. Das braucht den
      Webserver app.py (Render «Web Service»). Läuft die Seite ohne Webserver, öffnet sich automatisch
      das E-Mail-Programm als Ersatz.
    - Externer Formular-Dienst (z. B. Formspree): vollständige https-Adresse eintragen.
  */
  formEndpoint: "/api/kontakt",

  /*
    Leistungsübersicht: Welche Stufen angezeigt werden. [1] = nur Stage 1, [1, 2, 3] = alle drei.
    Für Modelle ohne Eintrag in leistung-data.js erscheinen die Richtwerte für Stage 1.
  */
  leistungStufen: [1],

  /*
    Statistik (optional): Komplette Script-URL des Statistik-Dienstes.
    Das Skript wird erst geladen, wenn Besucher im Cookie-Hinweis «Statistik» erlauben.
    Leer lassen = keine Statistik.
  */
  analytics: ""
};
