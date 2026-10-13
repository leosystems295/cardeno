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
  strasse: "",          // z. B. "Industriestrasse 1"
  plz: "",              // z. B. "5000"
  ort: "",              // z. B. "Aarau"

  // Kontakt
  telefon: "",          // z. B. "+41 79 123 45 67"
  email: "",            // z. B. "info@cardeno.ch"

  // Fahrzeug-Inserate: komplette Links zu den eigenen Händler-Seiten.
  // Solange hier nichts steht, führen die Buttons zur Startseite von AutoScout24 bzw. MotoScout24.
  autoscout: "",        // z. B. "https://www.autoscout24.ch/de/s/seller-12345"
  motoscout: "",        // z. B. "https://www.motoscout24.ch/de/s/seller-12345"

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
