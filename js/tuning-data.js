/*
  Marken & Modelle für den Bereich «Leistungssteigerung».
  Neue Marke oder neues Modell? Einfach hier eintragen, die Seite übernimmt alles automatisch.
  Aufbau:  ["Markenname", ["Modell 1", "Modell 2", ...]]
*/
(function () {
  var RAW = [
    ["Abarth", ["500 / 595", "695", "124 Spider", "Grande Punto", "Punto Evo"]],
    ["Alfa Romeo", ["MiTo", "Giulietta", "Giulia", "Stelvio", "Tonale", "4C", "Brera", "Spider", "147", "156", "159", "166"]],
    ["Alpina", ["B3", "B4", "B5", "B6", "B7", "B8", "D3", "D4", "D5", "XB7", "XD3", "XD4"]],
    ["Aston Martin", ["Vantage", "DB9", "DB11", "DBS", "DBX", "Rapide", "Vanquish"]],
    ["Audi", ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "R8", "S3", "S4", "S5", "S6", "S7", "S8", "SQ5", "SQ7", "SQ8", "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q3", "RS Q8"]],
    ["Bentley", ["Continental GT", "Flying Spur", "Bentayga", "Mulsanne", "Arnage"]],
    ["BMW", ["1er", "2er", "3er", "4er", "5er", "6er", "7er", "8er", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z3", "Z4", "M2", "M3", "M4", "M5", "M6", "M8", "X3 M", "X4 M", "X5 M", "X6 M"]],
    ["Bugatti", ["Veyron", "Chiron"]],
    ["Chevrolet", ["Camaro", "Corvette", "Cruze", "Captiva", "Aveo", "Spark", "Trax", "Silverado"]],
    ["Chrysler", ["300C", "Voyager", "Grand Voyager", "PT Cruiser", "Sebring"]],
    ["Citroën", ["C1", "C2", "C3", "C4", "C5", "DS3", "DS4", "DS5", "Berlingo", "Jumpy", "Jumper", "SpaceTourer"]],
    ["Cupra", ["Leon", "Formentor", "Ateca"]],
    ["Dacia", ["Duster", "Sandero", "Logan", "Jogger", "Lodgy", "Dokker"]],
    ["Dodge", ["Challenger", "Charger", "Durango", "Journey", "Nitro", "Viper", "Caliber", "RAM"]],
    ["DS Automobiles", ["DS 3", "DS 4", "DS 5", "DS 7", "DS 9"]],
    ["Ferrari", ["296 GTB", "F8 Tributo", "812 Superfast", "Roma", "Portofino", "California", "488 GTB", "458 Italia", "F12", "599 GTB", "430", "Purosangue"]],
    ["Fiat", ["500", "500L", "500X", "Panda", "Punto", "Grande Punto", "Tipo", "Bravo", "Doblò", "Ducato", "Freemont"]],
    ["Ford", ["Fiesta", "Focus", "Mondeo", "Kuga", "Puma", "EcoSport", "Mustang", "Ranger", "Transit", "Galaxy", "S-Max", "C-Max", "Edge", "Explorer"]],
    ["Honda", ["Civic", "Civic Type R", "Accord", "CR-V", "HR-V", "Jazz", "S2000", "NSX"]],
    ["Hyundai", ["i10", "i20", "i30", "i40", "Kona", "Tucson", "Santa Fe", "ix35", "Veloster", "Bayon", "Staria"]],
    ["Jaguar", ["XE", "XF", "XJ", "XK", "F-Type", "F-Pace", "E-Pace"]],
    ["Jeep", ["Wrangler", "Grand Cherokee", "Cherokee", "Renegade", "Compass", "Gladiator"]],
    ["Kia", ["Picanto", "Rio", "Ceed", "ProCeed", "Stonic", "Soul", "Sportage", "Sorento", "Stinger", "Optima", "Niro"]],
    ["Lamborghini", ["Gallardo", "Huracán", "Aventador", "Urus", "Murciélago", "Revuelto"]],
    ["Land Rover", ["Defender", "Discovery", "Discovery Sport", "Freelander", "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar"]],
    ["Lexus", ["CT", "IS", "GS", "LS", "RC", "LC", "UX", "NX", "RX"]],
    ["Maserati", ["Ghibli", "Quattroporte", "Levante", "GranTurismo", "GranCabrio", "Grecale", "MC20"]],
    ["Mazda", ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5", "RX-8"]],
    ["McLaren", ["12C", "540C", "570S", "600LT", "650S", "720S", "750S", "GT", "Artura", "P1"]],
    ["Mercedes-Benz", ["A-Klasse", "B-Klasse", "C-Klasse", "E-Klasse", "S-Klasse", "CLA", "CLS", "CLK", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Klasse", "SLK / SLC", "SL", "AMG GT", "SLS AMG", "A 45 AMG", "C 63 AMG", "E 63 AMG", "G 63 AMG", "V-Klasse", "Vito", "Sprinter", "Citan", "X-Klasse"]],
    ["Mini", ["Cooper", "Cooper S", "John Cooper Works", "Clubman", "Countryman", "Cabrio", "Paceman"]],
    ["Mitsubishi", ["Space Star", "Colt", "ASX", "Eclipse Cross", "Lancer", "Outlander", "Pajero", "L200"]],
    ["Nissan", ["Micra", "Note", "Juke", "Qashqai", "X-Trail", "Navara", "370Z", "GT-R", "Pulsar"]],
    ["Opel", ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Zafira", "Meriva", "Adam", "Vectra", "Vivaro", "Movano", "Combo"]],
    ["Peugeot", ["108", "207", "208", "307", "308", "407", "408", "508", "2008", "3008", "5008", "RCZ", "Partner", "Expert", "Boxer"]],
    ["Porsche", ["911", "718 Boxster", "718 Cayman", "Boxster", "Cayman", "Panamera", "Cayenne", "Macan"]],
    ["Renault", ["Twingo", "Clio", "Captur", "Mégane", "Scénic", "Kadjar", "Arkana", "Koleos", "Talisman", "Laguna", "Espace", "Kangoo", "Trafic", "Master"]],
    ["Rolls-Royce", ["Ghost", "Wraith", "Dawn", "Phantom", "Cullinan"]],
    ["Seat", ["Mii", "Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Altea", "Alhambra"]],
    ["Škoda", ["Citigo", "Fabia", "Scala", "Rapid", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Yeti"]],
    ["Smart", ["fortwo", "forfour", "Roadster"]],
    ["Subaru", ["Impreza", "WRX STI", "BRZ", "Levorg", "Legacy", "Outback", "Forester", "XV"]],
    ["Suzuki", ["Ignis", "Swift", "Baleno", "Vitara", "SX4 S-Cross", "Jimny", "Splash"]],
    ["Toyota", ["Aygo", "Yaris", "GR Yaris", "Corolla", "Auris", "Avensis", "Camry", "C-HR", "RAV4", "Land Cruiser", "Hilux", "GR86", "Supra"]],
    ["Volvo", ["C30", "C70", "S60", "S90", "V40", "V60", "V70", "V90", "XC40", "XC60", "XC70", "XC90"]],
    ["Volkswagen", ["up!", "Polo", "Golf", "Golf GTI", "Golf R", "Jetta", "Scirocco", "Passat", "Arteon", "T-Cross", "Taigo", "T-Roc", "Tiguan", "Touareg", "Touran", "Sharan", "Caddy", "Transporter (T5 / T6)", "Crafter", "Amarok", "Beetle"]]
  ];

  function slug(s) {
    return String(s)
      .toLowerCase()
      .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u")
      .replace(/é|è|ê/g, "e").replace(/á|à/g, "a").replace(/í/g, "i").replace(/š|ś/g, "s")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  window.CARDENO_SLUG = slug;
  window.CARDENO_BRANDS = RAW.map(function (b) {
    return {
      id: slug(b[0]),
      name: b[0],
      models: b[1].map(function (m) { return { id: slug(m), name: m }; })
    };
  });
})();
