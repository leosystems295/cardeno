/*
  ============================================================
  KONTAKTDATEN VON DENO MOTORSPORT – hier einmal eintragen
  ============================================================
  Alles, was hier leer bleibt, wird auf der Website automatisch ausgeblendet.
  Sobald du etwas einträgst, erscheint es überall (Kopfzeile, Fusszeile,
  Kontaktseite, Impressum, Datenschutz).
*/
window.DENO_CONFIG = {
  firma: "Deno Motorsport",

  // Adresse
  strasse: "",          // z. B. "Industriestrasse 1"
  plz: "",              // z. B. "5000"
  ort: "",              // z. B. "Aarau"

  // Kontakt
  telefon: "",          // z. B. "+41 79 123 45 67"
  email: "",            // z. B. "info@denomotorsport.ch"

  // Social Media (komplette Links)
  instagram: "",        // z. B. "https://www.instagram.com/…"
  facebook: "",

  // Öffnungszeiten: je Zeile ["Tage", "Zeiten"]
  oeffnungszeiten: [
    // ["Montag – Freitag", "08.00 – 12.00 | 13.00 – 17.30"],
    // ["Samstag", "Nach Vereinbarung"]
  ],

  // Impressum (optional)
  inhaber: "",          // Name der verantwortlichen Person
  uid: "",              // z. B. "CHE-123.456.789"

  /*
    Kontaktformular:
    - Leer lassen: Das Formular öffnet das E-Mail-Programm mit einer fertigen Nachricht
      an die oben eingetragene E-Mail-Adresse.
    - Mit Formular-Dienst (z. B. Formspree): Endpoint-URL hier eintragen, dann werden
      Anfragen direkt im Hintergrund gesendet.
  */
  formEndpoint: ""
};
