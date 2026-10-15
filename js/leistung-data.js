/*
  LEISTUNGSÜBERSICHT – so viel Leistung holt CARDENO aus dem Fahrzeug.
  Klickt jemand auf der Seite «Leistungssteigerung» auf ein Modell, erscheint dieses Modell
  mit Serie und Stage 1 / 2 / 3. Modelle ohne Eintrag zeigen: «Die genauen Werte nenne ich dir persönlich.»

  Aufbau:  "marke/modell": [ { Motorisierung 1 }, { Motorisierung 2 }, … ]
    "marke/modell" = Marke und Modell in Kleinbuchstaben, Umlaute ohne Punkte, Leerzeichen als «-»
                     (z. B. "bmw/3er", "volkswagen/golf-gti", "audi/a4", "mercedes-benz/c-klasse")
    motor : Name der Motorisierung (Generation, Motor)
    jahre : Baujahre
    serie : { ps: 193, nm: 280 }    Serienwerte
    s1, s2, s3 : { ps: 216, nm: 310 }    Werte nach Stage 1 / 2 / 3.  Stufe nicht angeboten: weglassen.
    beispiel : true   zeigt den Hinweis «Beispielwerte». Bei echten Werten die Zeile einfach löschen.

  ACHTUNG: Die Werte unten sind nur BEISPIELE, damit man die Darstellung sieht. Vor dem Livegang
  durch die echten Werte von CARDENO ersetzen oder löschen.
*/
window.CARDENO_POWER = {
  "bmw/3er": [
    { motor: "E36 328i, 2.8 Benziner", jahre: "1995–1998", beispiel: true,
      serie: { ps: 193, nm: 280 }, s1: { ps: 216, nm: 310 }, s2: { ps: 228, nm: 322 } },
    { motor: "E46 330d, 3.0 Diesel", jahre: "2003–2005", beispiel: true,
      serie: { ps: 204, nm: 410 }, s1: { ps: 245, nm: 480 }, s2: { ps: 265, nm: 520 } }
  ],
  "volkswagen/golf-gti": [
    { motor: "Golf 7 GTI, 2.0 TSI", jahre: "2013–2016", beispiel: true,
      serie: { ps: 220, nm: 350 }, s1: { ps: 265, nm: 400 }, s2: { ps: 300, nm: 440 }, s3: { ps: 340, nm: 480 } }
  ],
  "audi/a4": [
    { motor: "B8 2.0 TDI", jahre: "2008–2011", beispiel: true,
      serie: { ps: 143, nm: 320 }, s1: { ps: 180, nm: 400 } }
  ]
};
