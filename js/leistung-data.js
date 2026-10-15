/*
  LEISTUNGSÜBERSICHT – so viel Leistung holt CARDENO aus dem Fahrzeug.

  Ablauf auf der Seite «Leistungssteigerung»:
    Marke  →  Modell  →  Generation  →  Motor  →  Leistungsübersicht (Serie gegen Stage 1)
  Modelle ohne Eintrag hier zeigen die typischen Stage-1-Richtwerte und den Anfrage-Button.

  Aufbau:
    "marke/modell": { generationen: [ { id, name, jahre, motoren: [ … ] }, … ] }

    "marke/modell" = Marke und Modell in Kleinbuchstaben, Umlaute ohne Punkte, Leerzeichen als «-»
                     (z. B. "bmw/3er", "volkswagen/golf-gti", "audi/a4", "mercedes-benz/c-klasse")
    Generation:  name  z. B. "E36"   ·   jahre  z. B. "1990–2000"
    Motor:       name      z. B. "328i"
                 art       z. B. "6 Zylinder (Benzin)"
                 hubraum   in ccm, z. B. 2793
                 jahre     z. B. "1995–1998"
                 serie     { ps: 193, nm: 280, vmax: 236 }      Serienwerte (kw ist optional, sonst wird es gerechnet)
                 s1        { ps: 216, nm: 310, vmax: 248 }      Werte nach Stage 1  (s2, s3 für Stage 2 und 3)
                 beispiel  true  zeigt den Hinweis «Beispielwerte». Bei echten Werten die Zeile löschen.

  ACHTUNG: Die Werte unten sind nur BEISPIELE, damit man die Darstellung sieht. Vor dem Livegang
  durch die echten Werte von CARDENO ersetzen oder löschen.
*/
window.CARDENO_POWER = {
  "bmw/3er": { generationen: [
    { id: "e36", name: "E36", jahre: "1990–2000", motoren: [
      { name: "328i", art: "6 Zylinder (Benzin)", hubraum: 2793, jahre: "1995–1998", beispiel: true,
        serie: { ps: 193, nm: 280, vmax: 236 }, s1: { ps: 216, nm: 310, vmax: 248 }, s2: { ps: 228, nm: 322, vmax: 252 } },
      { name: "325tds", art: "6 Zylinder (Diesel)", hubraum: 2498, jahre: "1993–1998", beispiel: true,
        serie: { ps: 143, nm: 260, vmax: 205 }, s1: { ps: 175, nm: 330, vmax: 222 } },
      { name: "M3 3.2", art: "6 Zylinder (Benzin)", hubraum: 3201, jahre: "1995–1998", beispiel: true,
        serie: { ps: 321, nm: 350, vmax: 250 }, s1: { ps: 345, nm: 375, vmax: 250 } }
    ] },
    { id: "e46", name: "E46", jahre: "1998–2006", motoren: [
      { name: "330d", art: "6 Zylinder (Diesel)", hubraum: 2926, jahre: "2003–2005", beispiel: true,
        serie: { ps: 204, nm: 410, vmax: 245 }, s1: { ps: 245, nm: 480, vmax: 250 } },
      { name: "330i", art: "6 Zylinder (Benzin)", hubraum: 2979, jahre: "2000–2005", beispiel: true,
        serie: { ps: 231, nm: 300, vmax: 250 }, s1: { ps: 247, nm: 318, vmax: 250 } }
    ] }
  ] },
  "volkswagen/golf-gti": { generationen: [
    { id: "golf-7-gti", name: "Golf 7 GTI", jahre: "2013–2020", motoren: [
      { name: "2.0 TSI", art: "4 Zylinder (Benzin, Turbo)", hubraum: 1984, jahre: "2013–2016", beispiel: true,
        serie: { ps: 220, nm: 350, vmax: 246 }, s1: { ps: 265, nm: 400, vmax: 250 }, s2: { ps: 300, nm: 440, vmax: 250 }, s3: { ps: 340, nm: 480, vmax: 250 } }
    ] }
  ] },
  "audi/a4": { generationen: [
    { id: "b8", name: "B8", jahre: "2007–2015", motoren: [
      { name: "2.0 TDI", art: "4 Zylinder (Diesel, Turbo)", hubraum: 1968, jahre: "2008–2011", beispiel: true,
        serie: { ps: 143, nm: 320, vmax: 210 }, s1: { ps: 180, nm: 400, vmax: 225 } }
    ] }
  ] }
};
