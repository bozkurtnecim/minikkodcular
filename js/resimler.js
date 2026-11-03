/* Yapboz resimleri: 400x400 SVG çizimler.
   Gerçek fotoğraf kullanmak için RESIMLER listesindeki bir öğeye
   src: "resimler/kedi.jpg" gibi bir yol vermek yeterli. */
(function () {
  const W = 400;

  // ---------- Yardımcı parçalar ----------
  const svg = (body, defs = "") =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="800" height="800"><defs>${defs}</defs>${body}</svg>`;

  const grad = (id, a, b, vertical = true) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

  const radial = (id, a, b) =>
    `<radialGradient id="${id}" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;

  function manzara({ gok1 = "#7cc8ff", gok2 = "#d8f1ff", tepe1 = "#7ccf6a", tepe2 = "#4fae4f", zemin = "#62bd55", ufuk = 250 } = {}) {
    return {
      defs: grad("gok", gok1, gok2),
      body: `<rect width="400" height="400" fill="url(#gok)"/>
        <ellipse cx="90" cy="${ufuk + 30}" rx="190" ry="80" fill="${tepe1}"/>
        <ellipse cx="330" cy="${ufuk + 40}" rx="200" ry="90" fill="${tepe2}"/>
        <rect y="${ufuk + 40}" width="400" height="${400 - ufuk}" fill="${zemin}"/>`,
    };
  }

  const gunes = (x, y, r = 34) => {
    let isinlar = "";
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      isinlar += `<line x1="${x + Math.cos(a) * (r + 8)}" y1="${y + Math.sin(a) * (r + 8)}" x2="${x + Math.cos(a) * (r + 22)}" y2="${y + Math.sin(a) * (r + 22)}" stroke="#ffc928" stroke-width="6" stroke-linecap="round"/>`;
    }
    return `${isinlar}<circle cx="${x}" cy="${y}" r="${r}" fill="#ffd93b"/><circle cx="${x - 8}" cy="${y - 8}" r="${r * 0.45}" fill="#ffe979"/>`;
  };

  const bulut = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff"><ellipse cx="0" cy="0" rx="34" ry="20"/><ellipse cx="28" cy="-10" rx="26" ry="22"/><ellipse cx="54" cy="2" rx="28" ry="18"/><ellipse cx="24" cy="10" rx="40" ry="14"/></g>`;

  function cicek(x, y, s = 1, renk = "#ff5d8f", orta = "#ffd23f", sap = true) {
    let p = "";
    for (let i = 0; i < 6; i++) p += `<ellipse cx="0" cy="-14" rx="9" ry="15" fill="${renk}" transform="rotate(${i * 60})"/>`;
    const st = sap ? `<path d="M0 10 Q4 40 0 70" stroke="#3d9a3d" stroke-width="5" fill="none"/><ellipse cx="10" cy="45" rx="11" ry="5" fill="#4fb04a" transform="rotate(-30 10 45)"/>` : "";
    return `<g transform="translate(${x} ${y}) scale(${s})">${st}${p}<circle r="9" fill="${orta}"/></g>`;
  }

  const lale = (x, y, s = 1, renk = "#ff4d4d") =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 10 Q-3 50 0 90" stroke="#3d9a3d" stroke-width="6" fill="none"/><path d="M0 80 Q-30 50 -18 30 Q-6 55 0 80" fill="#4fb04a"/><path d="M0 85 Q28 60 20 38 Q8 62 0 85" fill="#45a845"/><path d="M-20 -20 L-20 5 Q0 25 20 5 L20 -20 L10 -8 L0 -24 L-10 -8 Z" fill="${renk}"/><path d="M-8 -10 Q0 8 8 -10" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/></g>`;

  const cimen = (y, renk = "#3f9e3f") => {
    let g = "";
    for (let x = 4; x < 400; x += 16) g += `<path d="M${x} ${y} l4 -16 l4 16 l4 -12 l3 12" fill="${renk}"/>`;
    return g;
  };

  const agac = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-10" y="0" width="20" height="60" rx="4" fill="#8a5a33"/><circle cx="0" cy="-20" r="38" fill="#3e9b48"/><circle cx="-28" cy="0" r="26" fill="#47a851"/><circle cx="28" cy="0" r="26" fill="#47a851"/><circle cx="-12" cy="-34" r="10" fill="#e43d3d"/><circle cx="18" cy="-12" r="8" fill="#e43d3d"/></g>`;

  const kelebek = (x, y, s = 1, r1 = "#ff8a3d", r2 = "#8f5cff") =>
    `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-22" cy="-14" rx="22" ry="18" fill="${r1}"/><ellipse cx="22" cy="-14" rx="22" ry="18" fill="${r1}"/><ellipse cx="-16" cy="14" rx="14" ry="13" fill="${r2}"/><ellipse cx="16" cy="14" rx="14" ry="13" fill="${r2}"/><circle cx="-24" cy="-16" r="7" fill="#fff" opacity=".7"/><circle cx="24" cy="-16" r="7" fill="#fff" opacity=".7"/><rect x="-4" y="-24" width="8" height="48" rx="4" fill="#3b2a4a"/><path d="M-2 -24 Q-10 -40 -16 -42 M2 -24 Q10 -40 16 -42" stroke="#3b2a4a" stroke-width="2.5" fill="none"/></g>`;

  const goz = (x, y, r = 10) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + r * 0.2}" cy="${y + r * 0.1}" r="${r * 0.6}" fill="#26201f"/><circle cx="${x + r * 0.4}" cy="${y - r * 0.2}" r="${r * 0.22}" fill="#fff"/>`;

  const yanak = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="#ff8fa3" opacity=".6"/>`;

  const ari = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-6" cy="-18" rx="12" ry="16" fill="#e6f6ff" opacity=".9" transform="rotate(-20 -6 -18)"/><ellipse cx="10" cy="-18" rx="12" ry="16" fill="#e6f6ff" opacity=".9" transform="rotate(20 10 -18)"/><ellipse cx="0" cy="0" rx="24" ry="17" fill="#ffd23f"/><path d="M-8 -16 v32 M6 -16 v32" stroke="#2b2b2b" stroke-width="7"/><circle cx="22" cy="-3" r="10" fill="#2b2b2b"/><circle cx="25" cy="-5" r="3" fill="#fff"/></g>`;

  // ---------- Sahneler ----------
  function kedi() {
    const m = manzara({ gok1: "#ffb6c9", gok2: "#ffe3ec", tepe1: "#f7c6e0", tepe2: "#e8a7cf", zemin: "#c9e9a6", ufuk: 260 });
    return svg(`${m.body}${bulut(40, 70)}${bulut(270, 50, 0.8)}
      <path d="M290 320 Q360 300 340 230 Q330 200 350 190" stroke="#f39a3d" stroke-width="18" fill="none" stroke-linecap="round"/>
      <ellipse cx="220" cy="300" rx="95" ry="70" fill="#f7a64a"/>
      <ellipse cx="220" cy="320" rx="55" ry="40" fill="#ffe0b8"/>
      <path d="M150 130 L130 60 L195 105 Z M290 130 L310 60 L245 105 Z" fill="#f7a64a"/>
      <path d="M155 120 L143 78 L183 105 Z M285 120 L297 78 L257 105 Z" fill="#ffb7c5"/>
      <circle cx="220" cy="170" r="85" fill="#f7a64a"/>
      <path d="M190 95 q30 -10 60 0 M180 115 q40 -10 80 0" stroke="#d97a25" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${goz(188, 165, 16)}${goz(252, 165, 16)}
      <path d="M212 195 l8 8 l8 -8 z" fill="#ff6f8a"/>
      <path d="M220 203 q-10 14 -22 6 M220 203 q10 14 22 6" stroke="#5a3a20" stroke-width="3" fill="none"/>
      <path d="M170 200 h-50 M172 210 l-46 10 M268 200 h50 M268 210 l46 10" stroke="#5a3a20" stroke-width="2.5"/>
      ${yanak(170, 210)}${yanak(270, 210)}
      ${cicek(60, 300, 0.9, "#ff6fa8")}${cicek(370, 330, 0.8, "#9b7bff")}${cimen(400, "#9ad27a")}`, m.defs);
  }

  function kopek() {
    const m = manzara({ gok1: "#6ec3ff", gok2: "#cdeeff", ufuk: 240 });
    return svg(`${m.body}${gunes(330, 70)}${bulut(40, 60)}
      <path d="M300 300 Q350 260 330 220" stroke="#b77b45" stroke-width="16" fill="none" stroke-linecap="round"/>
      <ellipse cx="210" cy="310" rx="100" ry="70" fill="#d2955a"/>
      <ellipse cx="210" cy="330" rx="50" ry="40" fill="#f5dcc0"/>
      <circle cx="200" cy="170" r="82" fill="#d2955a"/>
      <ellipse cx="125" cy="170" rx="30" ry="62" fill="#8a5a33" transform="rotate(15 125 170)"/>
      <ellipse cx="275" cy="170" rx="30" ry="62" fill="#8a5a33" transform="rotate(-15 275 170)"/>
      <ellipse cx="235" cy="150" rx="28" ry="24" fill="#8a5a33"/>
      <ellipse cx="200" cy="205" rx="45" ry="34" fill="#f5dcc0"/>
      ${goz(170, 150, 14)}${goz(232, 150, 14)}
      <ellipse cx="200" cy="188" rx="16" ry="11" fill="#2b1d14"/>
      <path d="M200 199 v12 M200 211 q-14 12 -24 2 M200 211 q14 12 24 2" stroke="#2b1d14" stroke-width="3" fill="none"/>
      <path d="M192 222 q8 22 16 0 z" fill="#ff6f8a"/>
      <path d="M150 248 q50 20 100 0" stroke="#e43d3d" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle cx="200" cy="262" r="10" fill="#ffd23f"/>
      <g transform="translate(70 350)"><rect x="-26" y="-8" width="52" height="16" rx="8" fill="#fff"/><circle cx="-26" cy="-8" r="10" fill="#fff"/><circle cx="-26" cy="8" r="10" fill="#fff"/><circle cx="26" cy="-8" r="10" fill="#fff"/><circle cx="26" cy="8" r="10" fill="#fff"/></g>
      ${cimen(400)}`, m.defs);
  }

  function aycicegi() {
    const m = manzara({ gok1: "#4fb3ff", gok2: "#bfe8ff", tepe1: "#8fd36a", tepe2: "#6cbf55", zemin: "#5aa94b", ufuk: 270 });
    let yaprak = "";
    for (let i = 0; i < 18; i++) yaprak += `<ellipse cx="0" cy="-78" rx="20" ry="44" fill="${i % 2 ? "#ffc21a" : "#ffd84a"}" transform="rotate(${i * 20})"/>`;
    let tohum = "";
    for (let r = 10; r < 52; r += 11) for (let a = 0; a < 360; a += 360 / (r / 2.2)) tohum += `<circle cx="${Math.cos((a * Math.PI) / 180) * r}" cy="${Math.sin((a * Math.PI) / 180) * r}" r="3.4" fill="#4a2c12"/>`;
    return svg(`${m.body}${bulut(30, 60)}${bulut(290, 90, 0.7)}
      <path d="M200 240 Q190 330 200 400" stroke="#3d8a33" stroke-width="16" fill="none"/>
      <path d="M198 320 Q130 290 110 320 Q150 345 198 330" fill="#4fae4f"/>
      <path d="M202 350 Q270 320 292 352 Q250 372 202 360" fill="#45a345"/>
      <g transform="translate(200 160)">${yaprak}<circle r="58" fill="#7a4a1d"/>${tohum}</g>
      ${aycicegiKucuk(60, 290)}${aycicegiKucuk(345, 300)}${cimen(400, "#3f8f38")}`, m.defs);
  }
  function aycicegiKucuk(x, y) {
    let p = "";
    for (let i = 0; i < 12; i++) p += `<ellipse cx="0" cy="-22" rx="7" ry="14" fill="#ffc928" transform="rotate(${i * 30})"/>`;
    return `<path d="M${x} ${y} v120" stroke="#3d8a33" stroke-width="7"/><g transform="translate(${x} ${y})">${p}<circle r="15" fill="#7a4a1d"/></g>`;
  }

  function kelebekSahne() {
    const m = manzara({ gok1: "#a5e3ff", gok2: "#f0fbff", tepe1: "#b7e48c", tepe2: "#93d46e", zemin: "#86c95e", ufuk: 280 });
    return svg(`${m.body}${gunes(60, 60, 28)}${bulut(260, 50, 0.9)}
      <g transform="translate(200 190) scale(3.4)">
        <ellipse cx="-22" cy="-14" rx="22" ry="18" fill="#ff7a2f"/><ellipse cx="22" cy="-14" rx="22" ry="18" fill="#ff7a2f"/>
        <ellipse cx="-17" cy="14" rx="15" ry="13" fill="#ffb02e"/><ellipse cx="17" cy="14" rx="15" ry="13" fill="#ffb02e"/>
        <path d="M-6 -20 Q-26 -30 -40 -14 M6 -20 Q26 -30 40 -14 M-6 6 Q-18 4 -30 14 M6 6 Q18 4 30 14" stroke="#2b2240" stroke-width="1.5" fill="none"/>
        <circle cx="-30" cy="-20" r="5" fill="#fff"/><circle cx="30" cy="-20" r="5" fill="#fff"/><circle cx="-20" cy="18" r="4" fill="#2b2240"/><circle cx="20" cy="18" r="4" fill="#2b2240"/>
        <circle cx="-12" cy="-26" r="3" fill="#2b2240"/><circle cx="12" cy="-26" r="3" fill="#2b2240"/>
        <rect x="-4" y="-24" width="8" height="46" rx="4" fill="#2b2240"/><circle cy="-28" r="6" fill="#2b2240"/>
        <path d="M-2 -32 Q-10 -46 -16 -46 M2 -32 Q10 -46 16 -46" stroke="#2b2240" stroke-width="1.6" fill="none"/>
        <circle cx="-16" cy="-46" r="2" fill="#2b2240"/><circle cx="16" cy="-46" r="2" fill="#2b2240"/>
      </g>
      ${cicek(70, 320, 1.1, "#ff5d8f")}${cicek(150, 345, 0.9, "#ffd23f", "#ff7a2f")}${cicek(270, 335, 1, "#8f5cff")}${cicek(350, 315, 1.1, "#ff5d5d")}${cimen(400, "#5aa94b")}`, m.defs);
  }

  function balik() {
    let kabarcik = "";
    [[80, 80, 10], [100, 130, 6], [330, 60, 12], [310, 110, 7], [60, 200, 8]].forEach(([x, y, r]) => (kabarcik += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>`));
    return svg(`<rect width="400" height="400" fill="url(#su)"/>
      ${kabarcik}
      <path d="M0 360 Q100 330 200 360 T400 350 V400 H0 Z" fill="#f2d48a"/>
      <path d="M40 360 Q30 300 50 250 Q60 300 55 360" fill="#2fa36b"/><path d="M60 360 Q80 290 70 240 Q90 300 75 360" fill="#3cba7a"/>
      <path d="M350 360 Q340 290 360 240 Q370 300 365 360" fill="#2fa36b"/>
      <path d="M300 200 L370 140 L370 260 Z" fill="#ff8a1f"/>
      <ellipse cx="200" cy="200" rx="120" ry="85" fill="#ff9a2e"/>
      <path d="M150 122 q20 156 0 156 M210 116 q22 168 0 168" stroke="#fff" stroke-width="18" fill="none"/>
      <path d="M150 122 q20 156 0 156 M210 116 q22 168 0 168" stroke="#2b2b2b" stroke-width="4" fill="none" opacity=".3"/>
      <path d="M180 120 Q200 70 250 110 Z" fill="#ff7a1a"/>
      <path d="M180 280 Q200 320 240 285 Z" fill="#ff7a1a"/>
      ${goz(120, 180, 18)}
      <path d="M90 220 q14 8 26 0" stroke="#5a2a10" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="290" cy="340" r="10" fill="#ff6fa8"/><circle cx="300" cy="350" r="7" fill="#ff8fc0"/>`,
      grad("su", "#5fd0ff", "#1d78c9"));
  }

  function aslan() {
    const m = manzara({ gok1: "#ffb347", gok2: "#ffe8a3", tepe1: "#e9c46a", tepe2: "#d4a84f", zemin: "#e2b65a", ufuk: 270 });
    let yele = "";
    for (let i = 0; i < 16; i++) yele += `<ellipse cx="0" cy="-92" rx="34" ry="46" fill="${i % 2 ? "#c8661e" : "#a9521a"}" transform="rotate(${i * 22.5})"/>`;
    return svg(`${m.body}${gunes(320, 70, 30)}
      <g transform="translate(70 290)"><rect x="-6" y="0" width="12" height="70" fill="#7a4a24"/><ellipse cx="0" cy="-6" rx="60" ry="18" fill="#4f9a3c"/></g>
      <ellipse cx="220" cy="340" rx="110" ry="60" fill="#f2b04b"/>
      <g transform="translate(210 180)">${yele}
        <circle r="78" fill="#f7c35c"/>
        <circle cx="-56" cy="-56" r="18" fill="#f7c35c"/><circle cx="56" cy="-56" r="18" fill="#f7c35c"/>
        <circle cx="-56" cy="-56" r="9" fill="#e7924f"/><circle cx="56" cy="-56" r="9" fill="#e7924f"/>
        ${goz(-28, -12, 13)}${goz(28, -12, 13)}
        <ellipse cx="0" cy="30" rx="34" ry="26" fill="#fde3ae"/>
        <path d="M-12 14 h24 l-12 13 z" fill="#5a2c1a"/>
        <path d="M0 27 v8 M0 35 q-12 10 -20 2 M0 35 q12 10 20 2" stroke="#5a2c1a" stroke-width="3" fill="none"/>
        ${yanak(-42, 22)}${yanak(42, 22)}
      </g>${cimen(400, "#c99a3e")}`, m.defs);
  }

  function kurbaga() {
    return svg(`<rect width="400" height="400" fill="url(#gol)"/>
      <ellipse cx="80" cy="80" rx="40" ry="10" fill="#fff" opacity=".35"/><ellipse cx="320" cy="60" rx="50" ry="12" fill="#fff" opacity=".35"/>
      <path d="M20 400 Q30 260 10 160 M40 400 Q60 280 50 200 M380 400 Q360 260 390 170" stroke="#3c8f3c" stroke-width="8" fill="none"/>
      <ellipse cx="10" cy="160" rx="8" ry="26" fill="#7a4a24"/><ellipse cx="390" cy="170" rx="8" ry="26" fill="#7a4a24"/>
      <ellipse cx="200" cy="320" rx="170" ry="60" fill="#3cae4f"/>
      <path d="M200 320 L370 300 A170 60 0 0 1 360 345 Z" fill="url(#gol)"/>
      <ellipse cx="200" cy="270" rx="110" ry="60" fill="#78d34f"/>
      <ellipse cx="200" cy="290" rx="70" ry="35" fill="#c7f09a"/>
      <circle cx="145" cy="190" r="40" fill="#78d34f"/><circle cx="255" cy="190" r="40" fill="#78d34f"/>
      ${goz(145, 188, 24)}${goz(255, 188, 24)}
      <ellipse cx="200" cy="230" rx="100" ry="55" fill="#78d34f"/>
      <path d="M140 240 Q200 290 260 240" stroke="#2b5a1f" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${yanak(130, 250)}${yanak(270, 250)}
      <circle cx="185" cy="215" r="4" fill="#2b5a1f"/><circle cx="215" cy="215" r="4" fill="#2b5a1f"/>
      <path d="M110 320 q-30 10 -40 -5 q15 -15 40 0 M290 320 q30 10 40 -5 q-15 -15 -40 0" fill="#5fbf3f"/>
      ${cicek(330, 300, 0.8, "#ff9bc2", "#fff1a8", false)}
      ${kelebek(330, 100, 0.8)}`, grad("gol", "#7fd8ff", "#2e8fd1"));
  }

  function ugurBocegi() {
    const m = manzara({ gok1: "#bff0ff", gok2: "#ffffff", tepe1: "#9fe07a", tepe2: "#7ccf5e", zemin: "#6cbf50", ufuk: 300 });
    let benek = "";
    [[-40, -10, 16], [40, -10, 16], [-50, 40, 13], [50, 40, 13], [-20, 70, 11], [20, 70, 11]].forEach(([x, y, r]) => (benek += `<circle cx="${x}" cy="${y}" r="${r}" fill="#1f1a1a"/>`));
    return svg(`${m.body}${bulut(30, 50)}${bulut(260, 80, 0.8)}
      <path d="M0 330 Q120 160 400 140 Q300 300 0 360 Z" fill="#4fb04a"/>
      <path d="M10 345 Q150 220 390 150" stroke="#2f8a35" stroke-width="5" fill="none"/>
      <g transform="translate(205 225) rotate(-15)">
        <path d="M-70 -20 l-30 -12 M-74 20 l-34 2 M-66 55 l-28 18 M70 -20 l30 -12 M74 20 l34 2 M66 55 l28 18" stroke="#1f1a1a" stroke-width="7" stroke-linecap="round"/>
        <ellipse cx="0" cy="20" rx="80" ry="88" fill="#e8262b"/>
        <path d="M0 -60 V108" stroke="#1f1a1a" stroke-width="5"/>${benek}
        <ellipse cx="-30" cy="-30" rx="20" ry="10" fill="#fff" opacity=".35" transform="rotate(-30 -30 -30)"/>
        <ellipse cx="0" cy="-70" rx="48" ry="30" fill="#1f1a1a"/>
        ${goz(-18, -76, 11)}${goz(18, -76, 11)}
        <path d="M-12 -98 q-14 -30 -30 -32 M12 -98 q14 -30 30 -32" stroke="#1f1a1a" stroke-width="4" fill="none"/>
        <circle cx="-42" cy="-130" r="6" fill="#1f1a1a"/><circle cx="42" cy="-130" r="6" fill="#1f1a1a"/>
      </g>
      ${cicek(70, 340, 0.8, "#fff", "#ffd23f")}${cicek(330, 330, 0.9, "#ff9bc2")}`, m.defs);
  }

  function baykus() {
    let yildiz = "";
    [[40, 50], [110, 30], [300, 40], [360, 90], [70, 120], [250, 20]].forEach(([x, y]) => (yildiz += `<circle cx="${x}" cy="${y}" r="3" fill="#fff8c4"/>`));
    return svg(`<rect width="400" height="400" fill="url(#gece)"/>${yildiz}
      <circle cx="320" cy="80" r="36" fill="#fff4b8"/><circle cx="335" cy="70" r="36" fill="url(#gece)"/>
      <path d="M0 330 Q200 300 400 320 L400 345 Q200 330 0 355 Z" fill="#7a4a24"/>
      <path d="M300 320 q30 -30 60 -20" stroke="#7a4a24" stroke-width="10" fill="none"/>
      <ellipse cx="365" cy="295" rx="20" ry="10" fill="#4f9a3c"/>
      <path d="M130 120 L120 70 L165 105 Z M270 120 L280 70 L235 105 Z" fill="#8b5a3c"/>
      <ellipse cx="200" cy="220" rx="100" ry="120" fill="#a06a44"/>
      <ellipse cx="200" cy="250" rx="62" ry="80" fill="#e8c9a0"/>
      <path d="M170 220 q10 10 20 0 M210 220 q10 10 20 0 M160 250 q10 10 20 0 M200 250 q10 10 20 0 M220 250 q10 10 20 0 M180 280 q10 10 20 0 M210 280 q10 10 20 0" stroke="#b88a5c" stroke-width="4" fill="none"/>
      <path d="M100 210 Q70 270 120 320 Q120 250 110 210 Z M300 210 Q330 270 280 320 Q280 250 290 210 Z" fill="#7d4f30"/>
      <circle cx="160" cy="160" r="40" fill="#fff"/><circle cx="240" cy="160" r="40" fill="#fff"/>
      <circle cx="160" cy="160" r="24" fill="#ffb21a"/><circle cx="240" cy="160" r="24" fill="#ffb21a"/>
      <circle cx="162" cy="162" r="13" fill="#1f1a1a"/><circle cx="242" cy="162" r="13" fill="#1f1a1a"/>
      <circle cx="166" cy="156" r="5" fill="#fff"/><circle cx="246" cy="156" r="5" fill="#fff"/>
      <path d="M188 190 L212 190 L200 214 Z" fill="#ff9a1a"/>
      <path d="M170 330 l-8 14 M180 332 v16 M190 330 l8 14 M210 330 l-8 14 M220 332 v16 M230 330 l8 14" stroke="#ff9a1a" stroke-width="6" stroke-linecap="round"/>`,
      grad("gece", "#1b2a63", "#3d4fa3"));
  }

  function laleBahcesi() {
    const m = manzara({ gok1: "#8fd3ff", gok2: "#e9f7ff", tepe1: "#a7dd7c", tepe2: "#86cc63", zemin: "#5fae47", ufuk: 230 });
    const renk = ["#ff4d4d", "#ffd23f", "#ff7ab8", "#9b6bff", "#ff8a1f"];
    let l = "";
    for (let i = 0; i < 5; i++) l += lale(50 + i * 75, 230 + (i % 2) * 30, 1.25, renk[i]);
    for (let i = 0; i < 6; i++) l += lale(20 + i * 72, 320, 0.8, renk[(i + 2) % 5]);
    return svg(`${m.body}${gunes(80, 70, 30)}${bulut(230, 60)}
      <g transform="translate(330 170)"><rect x="-40" y="-40" width="80" height="60" fill="#fff"/><path d="M-50 -40 L0 -80 L50 -40 Z" fill="#e43d3d"/><rect x="-10" y="-10" width="20" height="30" fill="#8a5a33"/><path d="M-48 -82 v-10 l16 6 z" fill="#3d7bd9"/></g>
      ${l}`, m.defs);
  }

  function fil() {
    const m = manzara({ gok1: "#7cd0ff", gok2: "#e2f6ff", tepe1: "#a9d97a", tepe2: "#90c766", zemin: "#c9b37a", ufuk: 260 });
    return svg(`${m.body}${gunes(70, 70, 30)}${bulut(250, 50)}
      ${agac(350, 230, 0.9)}
      <ellipse cx="240" cy="270" rx="110" ry="80" fill="#9aa7b8"/>
      <rect x="160" y="300" width="36" height="70" rx="14" fill="#8a97a8"/><rect x="290" y="300" width="36" height="70" rx="14" fill="#8a97a8"/>
      <rect x="215" y="310" width="34" height="60" rx="14" fill="#9aa7b8"/>
      <path d="M345 250 q30 10 24 50" stroke="#8a97a8" stroke-width="8" fill="none"/>
      <ellipse cx="95" cy="170" rx="62" ry="78" fill="#aab6c6"/><ellipse cx="95" cy="170" rx="40" ry="55" fill="#ffb7c5"/>
      <circle cx="160" cy="180" r="76" fill="#9aa7b8"/>
      <path d="M110 205 Q80 280 120 320 Q140 330 140 310 Q115 280 140 220 Z" fill="#9aa7b8"/>
      <path d="M150 230 q-20 20 -30 10" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none"/>
      ${goz(150, 160, 13)}${goz(195, 165, 9)}${yanak(185, 200)}
      <path d="M140 132 q16 -12 30 0" stroke="#6f7b8c" stroke-width="4" fill="none"/>
      ${cicek(40, 330, 0.8, "#ff7ab8")}${cimen(400, "#a8925a")}`, m.defs);
  }

  function tavsan() {
    const m = manzara({ gok1: "#c2eaff", gok2: "#f6fcff", tepe1: "#a6e28a", tepe2: "#7fd067", zemin: "#71c35c", ufuk: 250 });
    return svg(`${m.body}${bulut(40, 50, 0.9)}${bulut(260, 70)}
      <ellipse cx="160" cy="70" rx="24" ry="70" fill="#f2f2f2" transform="rotate(-12 160 120)"/>
      <ellipse cx="240" cy="70" rx="24" ry="70" fill="#f2f2f2" transform="rotate(12 240 120)"/>
      <ellipse cx="160" cy="75" rx="11" ry="52" fill="#ffb7c5" transform="rotate(-12 160 120)"/>
      <ellipse cx="240" cy="75" rx="11" ry="52" fill="#ffb7c5" transform="rotate(12 240 120)"/>
      <ellipse cx="200" cy="310" rx="95" ry="75" fill="#fafafa"/>
      <circle cx="295" cy="320" r="24" fill="#fff"/>
      <circle cx="200" cy="190" r="78" fill="#fafafa"/>
      ${goz(172, 180, 14)}${goz(228, 180, 14)}
      <ellipse cx="200" cy="212" rx="10" ry="7" fill="#ff7a99"/>
      <path d="M200 219 v8 M200 227 q-10 10 -18 2 M200 227 q10 10 18 2" stroke="#5a3a3a" stroke-width="3" fill="none"/>
      <rect x="191" y="232" width="8" height="12" rx="2" fill="#fff" stroke="#ddd"/><rect x="201" y="232" width="8" height="12" rx="2" fill="#fff" stroke="#ddd"/>
      ${yanak(160, 215)}${yanak(240, 215)}
      <g transform="translate(90 330) rotate(-30)"><path d="M0 0 L-14 70 L14 70 Z" fill="#ff8a1f" transform="rotate(180 0 35)"/><path d="M-6 -6 l-14 -24 M0 -6 v-28 M6 -6 l14 -24" stroke="#3d9a3d" stroke-width="7" stroke-linecap="round"/></g>
      ${cicek(340, 280, 0.9, "#ffd23f", "#ff7a1f")}${cimen(400)}`, m.defs);
  }

  function penguen() {
    let kar = "";
    for (let i = 0; i < 26; i++) kar += `<circle cx="${(i * 73) % 400}" cy="${(i * 131) % 240}" r="${2 + (i % 3)}" fill="#fff"/>`;
    return svg(`<rect width="400" height="400" fill="url(#buz)"/>${kar}
      <path d="M0 230 L70 150 L130 230 Z" fill="#e4f4ff"/><path d="M90 230 L190 110 L290 230 Z" fill="#f4fbff"/><path d="M250 230 L330 160 L400 230 Z" fill="#e4f4ff"/>
      <path d="M190 110 L165 140 L180 135 L190 150 L205 132 L215 140 Z" fill="#fff"/>
      <rect y="230" width="400" height="170" fill="#ffffff"/>
      <path d="M0 300 Q200 270 400 300 V400 H0 Z" fill="#dff1ff"/>
      <ellipse cx="200" cy="270" rx="90" ry="110" fill="#22304a"/>
      <ellipse cx="200" cy="290" rx="62" ry="86" fill="#fff"/>
      <circle cx="200" cy="160" r="66" fill="#22304a"/>
      <ellipse cx="180" cy="168" rx="26" ry="30" fill="#fff"/><ellipse cx="220" cy="168" rx="26" ry="30" fill="#fff"/>
      <circle cx="182" cy="168" r="9" fill="#1f1a1a"/><circle cx="218" cy="168" r="9" fill="#1f1a1a"/>
      <circle cx="185" cy="164" r="3" fill="#fff"/><circle cx="221" cy="164" r="3" fill="#fff"/>
      <path d="M186 192 L214 192 L200 210 Z" fill="#ff9a1a"/>
      ${yanak(165, 195)}${yanak(235, 195)}
      <path d="M112 240 Q80 300 118 330 Z M288 240 Q320 300 282 330 Z" fill="#22304a"/>
      <path d="M150 236 h100 v22 h-100 z" fill="#e43d3d"/><rect x="225" y="236" width="20" height="60" fill="#e43d3d"/>
      <ellipse cx="170" cy="378" rx="26" ry="12" fill="#ff9a1a"/><ellipse cx="230" cy="378" rx="26" ry="12" fill="#ff9a1a"/>`,
      grad("buz", "#7cc6ff", "#d9f0ff"));
  }

  function ariCicek() {
    const m = manzara({ gok1: "#ffe08a", gok2: "#fff7d6", tepe1: "#b5e08a", tepe2: "#94d06a", zemin: "#7cc35a", ufuk: 250 });
    let petek = "";
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const x = 300 + c * 30 + (r % 2) * 15, y = 40 + r * 26;
      petek += `<polygon points="${x},${y - 15} ${x + 13},${y - 7} ${x + 13},${y + 7} ${x},${y + 15} ${x - 13},${y + 7} ${x - 13},${y - 7}" fill="#ffb21a" stroke="#d98a0a" stroke-width="3"/>`;
    }
    return svg(`${m.body}${petek}${bulut(30, 60, 0.8)}
      ${cicek(100, 230, 2.2, "#ff5d8f")}${cicek(270, 260, 1.8, "#8f5cff", "#ffd23f")}${cicek(60, 340, 1, "#ffd23f", "#ff7a1f")}${cicek(350, 340, 1.1, "#ff7a1f")}
      ${ari(180, 120, 1.6)}${ari(320, 180, 1.1)}${ari(70, 120, 0.9)}
      <path d="M120 120 q-20 -30 -40 0 M290 190 q-10 20 -40 10" stroke="#5a4a2a" stroke-width="2.5" stroke-dasharray="6 6" fill="none"/>${cimen(400)}`, m.defs);
  }

  function zurafa() {
    const m = manzara({ gok1: "#ffcf7a", gok2: "#fff0c9", tepe1: "#d6c070", tepe2: "#c4ad5b", zemin: "#d8bf6a", ufuk: 290 });
    let leke = "";
    [[200, 200, 14], [215, 150, 12], [225, 105, 10], [200, 250, 15], [170, 300, 18], [240, 300, 16], [205, 335, 14], [140, 330, 12], [270, 340, 12]].forEach(([x, y, r]) => (leke += `<rect x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" rx="6" fill="#b0642a" transform="rotate(20 ${x} ${y})"/>`));
    return svg(`${m.body}${gunes(330, 70, 30)}
      <g transform="translate(70 230)"><rect x="-6" y="0" width="12" height="90" fill="#7a4a24"/><ellipse cx="0" cy="-4" rx="66" ry="20" fill="#4f9a3c"/><ellipse cx="-20" cy="-18" rx="40" ry="14" fill="#5aa94b"/></g>
      <ellipse cx="200" cy="320" rx="100" ry="60" fill="#f2b64a"/>
      <rect x="120" y="340" width="22" height="70" fill="#f2b64a"/><rect x="250" y="340" width="22" height="70" fill="#f2b64a"/>
      <path d="M180 290 L200 110 L240 110 L240 290 Z" fill="#f2b64a"/>
      ${leke}
      <ellipse cx="235" cy="85" rx="55" ry="36" fill="#f2b64a" transform="rotate(-15 235 85)"/>
      <ellipse cx="275" cy="98" rx="26" ry="20" fill="#ffd28a"/>
      <circle cx="270" cy="96" r="3" fill="#5a2c1a"/><circle cx="283" cy="100" r="3" fill="#5a2c1a"/>
      <path d="M205 55 v-26 M225 50 v-26" stroke="#b0642a" stroke-width="7"/><circle cx="205" cy="27" r="8" fill="#b0642a"/><circle cx="225" cy="22" r="8" fill="#b0642a"/>
      <ellipse cx="185" cy="62" rx="16" ry="8" fill="#f2b64a" transform="rotate(-30 185 62)"/>
      ${goz(232, 72, 12)}${yanak(250, 100)}
      <path d="M200 115 q-12 60 0 175" stroke="#b0642a" stroke-width="8" fill="none"/>${cimen(400, "#b89a48")}`, m.defs);
  }

  function ayi() {
    const m = manzara({ gok1: "#9ad8ff", gok2: "#e9f8ff", tepe1: "#7fbf5a", tepe2: "#5ea845", zemin: "#5a9e44", ufuk: 240 });
    return svg(`${m.body}${bulut(40, 50)}${bulut(280, 40, 0.8)}
      ${agac(50, 210, 1)}${agac(355, 200, 0.9)}
      <ellipse cx="200" cy="315" rx="105" ry="80" fill="#8a5530"/>
      <ellipse cx="200" cy="330" rx="62" ry="52" fill="#c98f5a"/>
      <circle cx="130" cy="105" r="30" fill="#8a5530"/><circle cx="270" cy="105" r="30" fill="#8a5530"/>
      <circle cx="130" cy="105" r="16" fill="#c98f5a"/><circle cx="270" cy="105" r="16" fill="#c98f5a"/>
      <circle cx="200" cy="175" r="88" fill="#8a5530"/>
      <ellipse cx="200" cy="210" rx="44" ry="34" fill="#d9a878"/>
      ${goz(165, 160, 13)}${goz(235, 160, 13)}
      <ellipse cx="200" cy="196" rx="16" ry="11" fill="#2b1a12"/>
      <path d="M200 207 v8 M200 215 q-12 12 -22 2 M200 215 q12 12 22 2" stroke="#2b1a12" stroke-width="3" fill="none"/>
      ${yanak(150, 200)}${yanak(250, 200)}
      <g transform="translate(290 320)"><path d="M-30 -20 Q-34 30 0 34 Q34 30 30 -20 Z" fill="#e6a24a"/><rect x="-34" y="-30" width="68" height="14" rx="6" fill="#d38a2a"/><path d="M-10 -16 q4 20 0 30" stroke="#ffd23f" stroke-width="8" stroke-linecap="round"/><text x="0" y="16" font-size="14" text-anchor="middle" fill="#7a4a10" font-family="sans-serif" font-weight="700">BAL</text></g>
      <ellipse cx="270" cy="300" rx="26" ry="22" fill="#8a5530"/>
      ${cicek(70, 350, 0.8, "#fff", "#ffd23f")}${cimen(400, "#4a8a38")}`, m.defs);
  }

  function kaplumbaga() {
    let desen = "";
    [[200, 230], [160, 255], [240, 255], [170, 205], [230, 205], [200, 280]].forEach(([x, y]) => (desen += `<polygon points="${x},${y - 18} ${x + 18},${y - 6} ${x + 14},${y + 14} ${x - 14},${y + 14} ${x - 18},${y - 6}" fill="#7fbf3a" stroke="#3f7a1f" stroke-width="4"/>`));
    const m = manzara({ gok1: "#7fdcff", gok2: "#e8fbff", tepe1: "#ffe39a", tepe2: "#f7d27a", zemin: "#f7d987", ufuk: 230 });
    return svg(`${m.body}${gunes(70, 70, 28)}
      <path d="M0 250 Q100 230 200 250 T400 245 V280 H0 Z" fill="#43b5e8"/>
      <path d="M0 262 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>
      <ellipse cx="320" cy="300" rx="18" ry="34" fill="#e5785a" transform="rotate(40 320 300)"/>
      <g transform="translate(350 330)"><path d="M0 0 l8 -20 l8 20 l20 0 l-16 12 l6 20 l-18 -12 l-18 12 l6 -20 l-16 -12 z" fill="#ff8a5a"/></g>
      <ellipse cx="110" cy="290" rx="44" ry="34" fill="#9be35a"/>
      ${goz(95, 280, 12)}${goz(130, 282, 10)}
      <path d="M95 305 q12 10 26 0" stroke="#3f7a1f" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="160" cy="330" rx="24" ry="16" fill="#9be35a"/><ellipse cx="270" cy="330" rx="24" ry="16" fill="#9be35a"/>
      <path d="M300 280 l26 6 l-24 12 z" fill="#9be35a"/>
      <path d="M130 300 Q130 180 210 180 Q300 180 300 300 Z" fill="#4f9a2a"/>${desen}
      <path d="M126 300 h178" stroke="#3f7a1f" stroke-width="12" stroke-linecap="round"/>
      <circle cx="60" cy="360" r="8" fill="#fff"/><circle cx="74" cy="368" r="5" fill="#fff"/>`, m.defs);
  }

  function civciv() {
    const m = manzara({ gok1: "#b9e6ff", gok2: "#f4fbff", tepe1: "#b9e28d", tepe2: "#9bd26e", zemin: "#e8c770", ufuk: 260 });
    const kucuk = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="10" rx="34" ry="28" fill="#ffd93b"/><circle cx="0" cy="-22" r="24" fill="#ffe14f"/>${goz(-8, -26, 6)}${goz(10, -26, 6)}<path d="M-2 -16 l10 4 l-10 4 z" fill="#ff8a1a"/><path d="M-6 38 v10 M6 38 v10" stroke="#ff8a1a" stroke-width="4"/></g>`;
    return svg(`${m.body}${gunes(330, 60, 28)}${bulut(40, 50)}
      <path d="M0 300 h400 M60 300 v-70 M140 300 v-70 M260 300 v-70 M340 300 v-70 M0 250 h400" stroke="#c48b4a" stroke-width="10"/>
      <ellipse cx="200" cy="350" rx="170" ry="30" fill="#e0b85a"/>
      <path d="M50 345 l20 -10 M80 352 l25 -6 M300 345 l20 -12 M330 352 l25 -6" stroke="#f7d987" stroke-width="5"/>
      <path d="M150 340 Q140 260 200 250 Q260 260 250 340 Z" fill="#fffdf4"/>
      <path d="M150 300 l15 -18 l15 18 l15 -18 l15 18 l15 -18 l15 18 l12 -14" stroke="#e7dcc0" stroke-width="5" fill="#fffdf4"/>
      ${kucuk(200, 210, 1.6)}${kucuk(80, 300, 0.8)}${kucuk(320, 300, 0.85)}
      <path d="M172 120 l8 -20 l8 14 l8 -18 l6 22" fill="#ff5d5d"/>`, m.defs);
  }

  function gokkusagi() {
    const m = manzara({ gok1: "#8fd3ff", gok2: "#effaff", tepe1: "#a7e07c", tepe2: "#85cd5f", zemin: "#6fbf52", ufuk: 260 });
    const r = ["#ff4d4d", "#ff9a1f", "#ffd93b", "#5ac85a", "#3da3ff", "#8f5cff"];
    let k = "";
    r.forEach((c, i) => (k += `<path d="M${40 + i * 18} 280 A${160 - i * 18} ${160 - i * 18} 0 0 1 ${360 - i * 18} 280" stroke="${c}" stroke-width="18" fill="none"/>`));
    let ciceks = "";
    const cr = ["#ff5d8f", "#ffd23f", "#8f5cff", "#ff7a1f", "#fff", "#3da3ff"];
    for (let i = 0; i < 9; i++) ciceks += cicek(25 + i * 45, 320 + (i % 2) * 28, 0.85, cr[i % 6], i % 6 === 1 ? "#ff7a1f" : "#ffd23f");
    return svg(`${m.body}${k}${bulut(20, 260, 1.1)}${bulut(310, 260, 1.1)}${gunes(340, 60, 24)}${ciceks}`, m.defs);
  }

  function denizAlti() {
    const kucukBalik = (x, y, s, c, ters) => `<g transform="translate(${x} ${y}) scale(${ters ? -s : s} ${s})"><path d="M30 0 L52 -16 L52 16 Z" fill="${c}"/><ellipse rx="34" ry="22" fill="${c}"/><path d="M-6 -20 q8 20 0 40" stroke="#fff" stroke-width="6" fill="none" opacity=".7"/>${goz(-18, -4, 7)}</g>`;
    let k = "";
    [[60, 40, 6], [80, 90, 4], [330, 30, 7], [350, 80, 4], [200, 30, 5]].forEach(([x, y, r]) => (k += `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="2.5"/>`));
    return svg(`<rect width="400" height="400" fill="url(#derin)"/>
      <path d="M40 0 L120 400 L150 400 L80 0 Z M220 0 L260 400 L300 400 L250 0 Z" fill="#fff" opacity=".08"/>${k}
      <path d="M0 340 Q100 310 200 340 T400 330 V400 H0 Z" fill="#f0cf86"/>
      <path d="M30 345 Q20 260 40 200 Q50 270 45 345 M55 345 Q80 260 60 180 Q90 260 72 345" stroke="#2fa36b" stroke-width="12" fill="none" stroke-linecap="round"/>
      <g transform="translate(330 340)"><path d="M0 0 q-30 -40 -10 -80 M0 0 q10 -60 30 -70 M0 0 q30 -30 50 -40" stroke="#ff6f8a" stroke-width="14" fill="none" stroke-linecap="round"/></g>
      <g transform="translate(150 360)"><ellipse rx="30" ry="12" fill="#e9a6d6"/><path d="M-26 0 L0 -26 L26 0" fill="#f7c0e4"/><circle cx="0" cy="-6" r="7" fill="#fff"/></g>
      <g transform="translate(250 370)"><path d="M0 -20 l6 14 l16 0 l-12 10 l4 16 l-14 -9 l-14 9 l4 -16 l-12 -10 l16 0 z" fill="#ffb02e"/></g>
      ${kucukBalik(110, 120, 1.1, "#ff8a1f")}${kucukBalik(290, 160, 1.3, "#ffd23f", true)}${kucukBalik(170, 240, 0.9, "#ff5d8f")}${kucukBalik(320, 260, 0.8, "#8f5cff", true)}${kucukBalik(80, 270, 0.7, "#5ae0c0", true)}
      <g transform="translate(200 70)"><ellipse rx="44" ry="30" fill="#ff9bc2" opacity=".9"/><path d="M-30 20 q-4 40 6 60 M-10 26 q4 40 -6 60 M10 26 q-4 40 6 60 M30 20 q4 40 -6 60" stroke="#ff9bc2" stroke-width="6" fill="none"/>${goz(-14, -2, 7)}${goz(14, -2, 7)}</g>`,
      grad("derin", "#3fc2ff", "#0b4f9a"));
  }

  function ciftlik() {
    const m = manzara({ gok1: "#87ceff", gok2: "#e8f7ff", tepe1: "#9fdc74", tepe2: "#7fcb5c", zemin: "#6dbd4f", ufuk: 230 });
    return svg(`${m.body}${gunes(60, 60, 28)}${bulut(160, 40, 0.8)}
      <g transform="translate(300 170)"><rect x="-70" y="-30" width="140" height="110" fill="#d6372f"/><path d="M-82 -28 L0 -90 L82 -28 Z" fill="#a8261f"/><rect x="-26" y="20" width="52" height="60" fill="#fff"/><path d="M-26 20 l52 60 M26 20 l-52 60" stroke="#d6372f" stroke-width="6"/><rect x="-16" y="-60" width="32" height="26" fill="#fff"/></g>
      <path d="M0 290 h220 M0 320 h220 M20 280 v60 M70 280 v60 M120 280 v60 M170 280 v60 M215 280 v60" stroke="#fff" stroke-width="7"/>
      <g transform="translate(110 220)"><ellipse rx="64" ry="38" fill="#fff"/><ellipse cx="-20" cy="-8" rx="18" ry="14" fill="#2b2b2b"/><ellipse cx="22" cy="10" rx="14" ry="12" fill="#2b2b2b"/>
        <rect x="-50" y="22" width="14" height="40" fill="#fff"/><rect x="36" y="22" width="14" height="40" fill="#fff"/>
        <ellipse cx="-74" cy="-22" rx="30" ry="28" fill="#fff"/><ellipse cx="-80" cy="-4" rx="22" ry="14" fill="#ffc2c9"/>
        <circle cx="-86" cy="-4" r="3" fill="#5a3a3a"/><circle cx="-74" cy="-4" r="3" fill="#5a3a3a"/>
        ${goz(-82, -32, 7)}${goz(-62, -32, 7)}<path d="M-96 -46 l-12 -8 M-56 -46 l12 -8" stroke="#e0c8a0" stroke-width="6" stroke-linecap="round"/></g>
      <g transform="translate(250 330)"><ellipse rx="40" ry="28" fill="#ffb3c1"/><circle cx="-36" cy="-8" r="22" fill="#ffb3c1"/><ellipse cx="-50" cy="-4" rx="10" ry="8" fill="#ff8fa3"/><circle cx="-53" cy="-4" r="2" fill="#5a3a3a"/><circle cx="-47" cy="-4" r="2" fill="#5a3a3a"/>${goz(-38, -16, 5)}<path d="M38 -6 q12 -8 6 -16" stroke="#ff8fa3" stroke-width="4" fill="none"/></g>
      <g transform="translate(350 330)"><ellipse rx="22" ry="18" fill="#fff"/><circle cx="16" cy="-14" r="12" fill="#fff"/><path d="M14 -26 l4 -8 l4 8" fill="#e43d3d"/><path d="M28 -14 l8 3 l-8 3 z" fill="#ff9a1a"/>${goz(18, -16, 4)}</g>
      ${cicek(40, 360, 0.7, "#ffd23f", "#ff7a1f")}${cimen(400)}`, m.defs);
  }

  function orman() {
    const m = manzara({ gok1: "#ffc48a", gok2: "#ffeccf", tepe1: "#6aa84f", tepe2: "#4f8f3c", zemin: "#5a9a44", ufuk: 230 });
    const cam = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-8" y="40" width="16" height="30" fill="#7a4a24"/><path d="M0 -60 L40 0 L-40 0 Z M0 -30 L48 40 L-48 40 Z" fill="${c}"/></g>`;
    return svg(`${m.body}${gunes(200, 70, 30)}
      ${cam(40, 190, 1, "#2f7a3a")}${cam(110, 170, 1.2, "#357f3f")}${cam(300, 170, 1.2, "#2f7a3a")}${cam(370, 190, 1, "#357f3f")}
      <g transform="translate(200 300)">
        <path d="M60 30 Q130 10 120 -40 Q110 -10 70 0" fill="#e8702a"/><path d="M118 -40 q4 10 -6 18" stroke="#fff" stroke-width="10" fill="none"/>
        <ellipse cx="20" cy="30" rx="60" ry="40" fill="#e8702a"/><ellipse cx="10" cy="44" rx="34" ry="22" fill="#fff1e0"/>
        <path d="M-60 -60 L-50 -110 L-20 -70 Z M20 -60 L30 -110 L0 -70 Z" fill="#e8702a"/><path d="M-50 -70 L-46 -96 L-30 -74 Z M14 -70 L22 -96 L4 -74 Z" fill="#3b2a20"/>
        <circle cx="-20" cy="-40" r="44" fill="#e8702a"/>
        <path d="M-64 -30 Q-20 30 24 -30 Q-20 0 -64 -30 Z" fill="#fff1e0"/>
        ${goz(-38, -48, 9)}${goz(-2, -48, 9)}
        <ellipse cx="-20" cy="-18" rx="8" ry="6" fill="#2b1a12"/>
      </g>
      <g transform="translate(80 330)"><path d="M-4 0 v30 M4 0 v30" stroke="#f0e6d0" stroke-width="10"/><ellipse cx="0" cy="0" rx="34" ry="20" fill="#e43d3d"/><circle cx="-12" cy="-6" r="5" fill="#fff"/><circle cx="12" cy="-8" r="4" fill="#fff"/><circle cx="0" cy="4" r="4" fill="#fff"/></g>
      <g transform="translate(340 350)"><ellipse cx="0" cy="0" rx="22" ry="14" fill="#c0392b"/><circle cx="-6" cy="-4" r="3" fill="#fff"/><path d="M0 0 v24" stroke="#f0e6d0" stroke-width="8"/></g>
      ${kelebek(330, 260, 0.6, "#ffd23f", "#3da3ff")}${cimen(400, "#3f7a2f")}`, m.defs);
  }

  function papagan() {
    return svg(`<rect width="400" height="400" fill="url(#tropik)"/>
      <path d="M0 0 Q80 60 40 160 Q20 60 0 40 Z M400 0 Q300 70 360 170 Q390 80 400 50 Z" fill="#2f9a4a"/>
      <path d="M0 120 Q90 140 60 260 Q30 160 0 160 Z M400 140 Q310 170 340 280 Q380 180 400 190 Z" fill="#3cb35a"/>
      <path d="M40 300 L360 280" stroke="#8a5a33" stroke-width="18" stroke-linecap="round"/>
      <path d="M190 300 Q160 360 175 400 L215 400 Q230 360 210 300 Z" fill="#2f6fd9"/>
      <path d="M200 300 Q195 360 200 400" stroke="#ffd23f" stroke-width="8"/>
      <ellipse cx="200" cy="220" rx="62" ry="90" fill="#e8262b"/>
      <path d="M150 190 Q120 260 160 310 Q190 250 175 190 Z" fill="#ffd23f"/><path d="M150 230 Q130 280 165 315 Q180 270 168 232 Z" fill="#2f6fd9"/>
      <circle cx="210" cy="130" r="52" fill="#e8262b"/>
      <ellipse cx="225" cy="125" rx="26" ry="22" fill="#fff"/>
      <circle cx="228" cy="124" r="11" fill="#1f1a1a"/><circle cx="231" cy="120" r="4" fill="#fff"/>
      <path d="M250 135 Q300 140 280 190 Q270 165 245 160 Z" fill="#f3e2b6"/><path d="M246 160 Q265 165 270 182 Q255 175 242 172 Z" fill="#2b2b2b"/>
      <path d="M180 300 l-6 14 M196 302 v14 M214 302 l6 14" stroke="#777" stroke-width="6" stroke-linecap="round"/>
      ${cicek(70, 360, 1, "#ff7ab8", "#ffd23f", false)}${cicek(340, 350, 1.1, "#ff9a1f", "#fff", false)}
      <circle cx="320" cy="80" r="12" fill="#ffd23f"/><circle cx="335" cy="95" r="10" fill="#ffb02e"/>`,
      grad("tropik", "#7fe3c4", "#e8fff5"));
  }

  function cicekTarlasi() {
    const m = manzara({ gok1: "#b0dcff", gok2: "#f3fbff", tepe1: "#c8a8ff", tepe2: "#b08af0", zemin: "#80c965", ufuk: 190 });
    let s = "";
    const renk = ["#ff5d8f", "#ffd23f", "#8f5cff", "#ff7a1f", "#ffffff", "#3da3ff", "#ff4d4d"];
    let i = 0;
    for (let y = 250; y < 400; y += 38) for (let x = 15 + (y % 2) * 20; x < 400; x += 48) {
      s += i % 4 === 0 ? lale(x, y - 10, 0.55, renk[i % 7]) : cicek(x, y, 0.75 + (i % 3) * 0.12, renk[i % 7], renk[(i + 1) % 7] === "#ffffff" ? "#ff7a1f" : "#ffd23f");
      i++;
    }
    return svg(`${m.body}${gunes(330, 60, 28)}${bulut(30, 50)}${bulut(180, 90, 0.7)}
      <path d="M0 230 Q200 210 400 230" stroke="#6ab853" stroke-width="30" fill="none"/>
      ${s}${kelebek(110, 150, 0.9)}${kelebek(280, 170, 0.75, "#ff5d8f", "#ffd23f")}${ari(200, 120, 0.9)}`, m.defs);
  }


  function kumsal() {
    return svg(`<rect width="400" height="400" fill="url(#yaz)"/>${gunes(330, 70, 32)}${bulut(40, 60, 0.9)}
      <path d="M0 200 Q100 186 200 200 T400 196 V270 H0 Z" fill="#3fb0e8"/>
      <path d="M0 214 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" stroke="#bfe9ff" stroke-width="4" fill="none"/>
      <path d="M0 250 Q200 230 400 252 V400 H0 Z" fill="#f6d98c"/>
      <g transform="translate(300 180)"><path d="M0 0 L-40 20 H40 Z" fill="#fff"/><path d="M0 0 L0 30" stroke="#8a5a33" stroke-width="3"/><path d="M-30 30 H30 L20 44 H-20 Z" fill="#ff5a4e"/></g>
      <path d="M90 360 L90 240" stroke="#8a5a33" stroke-width="6"/><path d="M30 250 Q90 190 150 250 Q130 238 120 250 Q110 238 90 250 Q70 238 60 250 Q50 238 30 250 Z" fill="#ff5d8f"/><path d="M60 250 Q90 200 120 250" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>
      <g transform="translate(210 320)"><path d="M-30 -30 H30 L22 30 H-22 Z" fill="#2f86e0"/><path d="M-30 -30 Q0 -60 30 -30" stroke="#1f62ab" stroke-width="4" fill="none"/></g>
      <g transform="translate(290 330)"><path d="M-40 30 V-10 L-30 -24 L-20 -10 L-10 -24 L0 -10 L10 -24 L20 -10 L30 -24 L40 -10 V30 Z" fill="#e8c06a"/><rect x="-10" y="6" width="20" height="24" rx="10" fill="#c99a3e"/><path d="M0 -24 V-44 L14 -38 L0 -32" fill="#ff5a4e" stroke="#8a5a33" stroke-width="2"/></g>
      <g transform="translate(120 370)"><ellipse rx="26" ry="16" fill="#ff5a4e"/>${goz(-8, -14, 5)}${goz(8, -14, 5)}<path d="M-26 -4 q-14 -10 -6 -20 M26 -4 q14 -10 6 -20" stroke="#ff5a4e" stroke-width="7" fill="none" stroke-linecap="round"/></g>
      <g transform="translate(360 370)"><path d="M0 -16 l5 11 l12 1 l-9 8 l3 12 l-11 -6 l-11 6 l3 -12 l-9 -8 l12 -1 z" fill="#ff8a3d"/></g>
      <path d="M40 300 q6 -6 12 0 M160 290 q6 -6 12 0" stroke="#e0b84a" stroke-width="3" fill="none"/>`, grad("yaz", "#7fd0ff", "#e0f6ff"));
  }

  function uzay() {
    let yildiz = "";
    for (let i = 0; i < 40; i++) yildiz += `<circle cx="${(i * 97) % 400}" cy="${(i * 53) % 400}" r="${1 + (i % 3)}" fill="#fff" opacity="${0.5 + (i % 2) * 0.5}"/>`;
    return svg(`<rect width="400" height="400" fill="url(#uzay)"/>${yildiz}
      <circle cx="320" cy="90" r="50" fill="#ff9a3d"/><ellipse cx="320" cy="90" rx="84" ry="16" fill="none" stroke="#ffd23f" stroke-width="8" transform="rotate(-15 320 90)"/><circle cx="300" cy="74" r="10" fill="#ffb86b"/>
      <circle cx="70" cy="330" r="90" fill="#9aa7b8"/><circle cx="40" cy="300" r="16" fill="#7f8b9c"/><circle cx="100" cy="350" r="12" fill="#7f8b9c"/><circle cx="80" cy="280" r="8" fill="#7f8b9c"/>
      <g transform="translate(220 230) rotate(30)"><path d="M0 -90 C30 -60 30 20 22 50 H-22 C-30 20 -30 -60 0 -90 Z" fill="#f4f8fc"/><path d="M0 -90 C14 -78 22 -60 24 -46 H-24 C-22 -60 -14 -78 0 -90 Z" fill="#ff5a4e"/><circle cy="-14" r="14" fill="#2f86e0" stroke="#5d86a8" stroke-width="5"/><path d="M-22 20 L-46 50 L-22 46 Z M22 20 L46 50 L22 46 Z" fill="#ff5a4e"/><path d="M-16 50 Q0 100 16 50 Z" fill="#ffb21a"/><path d="M-8 50 Q0 78 8 50 Z" fill="#ffe27a"/></g>
      <g transform="translate(110 110)"><circle r="22" fill="#fff"/><rect x="-14" y="-10" width="28" height="18" rx="9" fill="#2f86e0"/><rect x="-16" y="20" width="32" height="30" rx="10" fill="#fff"/><path d="M-16 28 l-14 10 M16 28 l14 -10" stroke="#fff" stroke-width="9" stroke-linecap="round"/></g>
      <circle cx="360" cy="330" r="22" fill="#5ac85a"/><path d="M346 320 q10 -4 18 4 M352 340 q10 2 16 -6" stroke="#2fa36b" stroke-width="5" fill="none"/>`, grad("uzay", "#141c4a", "#3b2a78"));
  }

  function kisKoyu() {
    let kar = "";
    for (let i = 0; i < 36; i++) kar += `<circle cx="${(i * 61) % 400}" cy="${(i * 37) % 260}" r="${2 + (i % 3)}" fill="#fff"/>`;
    const ev = (x, y, s, renk) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-30" width="68" height="50" fill="${renk}"/><path d="M-44 -28 L0 -66 L44 -28 Z" fill="#8a5a33"/><path d="M-46 -28 L0 -68 L46 -28 L40 -24 L0 -58 L-40 -24 Z" fill="#fff"/><rect x="-10" y="-4" width="20" height="24" fill="#5a3416"/><rect x="-28" y="-20" width="14" height="14" fill="#ffe27a"/><rect x="14" y="-20" width="14" height="14" fill="#ffe27a"/></g>`;
    const cam = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-5" y="20" width="10" height="16" fill="#7a4a24"/><path d="M0 -50 L26 -14 H14 L32 10 H18 L36 32 H-36 L-18 10 H-32 L-14 -14 H-26 Z" fill="#2f7a3a"/><path d="M-14 -14 H14 M-18 10 H18" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
    return svg(`<rect width="400" height="400" fill="url(#kis)"/>${kar}
      <path d="M0 240 Q120 210 220 238 T400 230 V400 H0 Z" fill="#f4fbff"/>
      ${cam(40, 220, 1.1)}${cam(370, 210, 1)}${ev(130, 250, 1.1, "#ff8a80")}${ev(270, 240, 0.9, "#9fd8ff")}
      <circle cx="210" cy="340" r="36" fill="#fff" stroke="#d6e6f5" stroke-width="3"/><circle cx="210" cy="292" r="24" fill="#fff" stroke="#d6e6f5" stroke-width="3"/>${goz(202, 288, 3)}${goz(218, 288, 3)}<path d="M210 294 l14 4 l-14 3 z" fill="#ff8a1a"/><rect x="196" y="258" width="28" height="12" fill="#2b2b3a"/><rect x="190" y="268" width="40" height="5" fill="#2b2b3a"/><path d="M190 310 q20 10 40 0" stroke="#e43d3d" stroke-width="8" fill="none"/>
      <g transform="translate(320 350)"><rect x="-30" y="0" width="60" height="8" rx="4" fill="#c4935f"/><path d="M-30 4 q-10 -10 0 -16" stroke="#c4935f" stroke-width="5" fill="none"/>${goz(0, -10, 0)}</g>
      <path d="M60 360 q10 -8 20 0 M120 380 q10 -8 20 0" stroke="#cfe2f3" stroke-width="4" fill="none"/>`, grad("kis", "#8fb8e8", "#dcecfb"));
  }

  function panda() {
    const bambu = (x, h) => `<rect x="${x}" y="${400 - h}" width="14" height="${h}" fill="#7fbf3a"/>${[1, 2, 3, 4].filter((k) => k * 70 < h).map((k) => `<rect x="${x - 2}" y="${400 - k * 70}" width="18" height="5" fill="#5a9a2a"/>`).join("")}<ellipse cx="${x + 26}" cy="${410 - h}" rx="18" ry="6" fill="#5ac85a" transform="rotate(-30 ${x + 26} ${410 - h})"/>`;
    return svg(`<rect width="400" height="400" fill="url(#bambu)"/>${bulut(250, 50, 0.8)}
      ${bambu(20, 330)}${bambu(60, 260)}${bambu(330, 320)}${bambu(370, 250)}
      <rect y="320" width="400" height="80" fill="#6dbd4f"/>
      <ellipse cx="200" cy="300" rx="90" ry="70" fill="#fff"/>
      <ellipse cx="130" cy="330" rx="30" ry="40" fill="#2b2b3a"/><ellipse cx="270" cy="330" rx="30" ry="40" fill="#2b2b3a"/>
      <circle cx="200" cy="180" r="70" fill="#fff"/>
      <circle cx="140" cy="122" r="24" fill="#2b2b3a"/><circle cx="260" cy="122" r="24" fill="#2b2b3a"/>
      <ellipse cx="172" cy="176" rx="18" ry="24" fill="#2b2b3a" transform="rotate(20 172 176)"/><ellipse cx="228" cy="176" rx="18" ry="24" fill="#2b2b3a" transform="rotate(-20 228 176)"/>
      <circle cx="174" cy="178" r="6" fill="#fff"/><circle cx="226" cy="178" r="6" fill="#fff"/>
      <ellipse cx="200" cy="206" rx="12" ry="8" fill="#2b2b3a"/><path d="M188 220 q12 10 24 0" stroke="#2b2b3a" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${yanak(150, 210)}${yanak(250, 210)}
      <g transform="translate(270 250) rotate(-30)"><rect x="-6" y="-60" width="12" height="100" fill="#7fbf3a"/><ellipse cx="14" cy="-60" rx="18" ry="6" fill="#5ac85a"/></g>
      <ellipse cx="262" cy="270" rx="22" ry="26" fill="#2b2b3a"/>
      ${cicek(110, 370, 0.7, "#ff9bc2")}${cicek(300, 375, 0.6, "#fff", "#ffd23f")}`, grad("bambu", "#c8efc0", "#f2fff0"));
  }

  function dinozor() {
    return svg(`<rect width="400" height="400" fill="url(#dino)"/>${gunes(70, 70, 30)}
      <path d="M220 230 L280 90 L310 90 L380 230 Z" fill="#8a6a5a"/><path d="M280 90 Q295 70 310 90 L300 110 L290 104 Z" fill="#ff5a4e"/><path d="M286 60 q-10 -20 6 -30 M300 56 q14 -16 6 -34" stroke="#c9b8b0" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M0 250 Q200 220 400 250 V400 H0 Z" fill="#7cc35a"/>
      <g transform="translate(60 240)"><rect x="-6" y="-80" width="12" height="90" fill="#8a5a33" transform="rotate(8)"/><path d="M0 -84 q-40 -10 -50 10 q30 -12 50 -10 q-30 10 -36 36 q20 -24 36 -36 q30 -6 46 16 q-20 -24 -46 -16 q36 -20 50 -2 q-24 -16 -50 2 Z" fill="#3cae4f"/></g>
      <g transform="translate(200 300)">
        <path d="M70 10 Q150 0 170 -40 Q140 30 60 40 Z" fill="#5ac85a"/>
        <ellipse cx="0" cy="20" rx="90" ry="56" fill="#5ac85a"/>
        <ellipse cx="-10" cy="36" rx="60" ry="30" fill="#c7f09a"/>
        <path d="M-60 -20 Q-90 -110 -40 -130 Q0 -140 4 -100 Q0 -70 -30 -40 Z" fill="#5ac85a"/>
        <ellipse cx="-30" cy="-118" rx="44" ry="30" fill="#5ac85a"/>
        ${goz(-40, -126, 9)}<path d="M-64 -104 q20 10 36 0" stroke="#2b5a1f" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M-20 -146 l8 -14 l8 14 M0 -140 l10 -12 l6 16 M-40 -148 l6 -14 l10 12" fill="#ff8a1f"/>
        <rect x="-60" y="60" width="22" height="34" rx="8" fill="#4fae4f"/><rect x="30" y="60" width="22" height="34" rx="8" fill="#4fae4f"/>
        <circle cx="20" cy="0" r="8" fill="#4fae4f"/><circle cx="44" cy="20" r="6" fill="#4fae4f"/><circle cx="-6" cy="10" r="6" fill="#4fae4f"/>
      </g>
      <g transform="translate(340 330)"><ellipse rx="22" ry="28" fill="#fffaf0" stroke="#e8dcc0" stroke-width="3"/><path d="M-20 0 l8 -8 l8 8 l8 -8 l8 8 l8 -8" stroke="#8a6a4a" stroke-width="3" fill="none"/></g>
      ${cicek(120, 370, 0.7, "#ffd23f", "#ff7a1f")}`, grad("dino", "#ffd9a8", "#fff3e0"));
  }

  function balonlar() {
    const balon = (x, y, s, r1, r2) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 0 C-40 -50 40 -50 40 0 C40 30 14 46 8 60 H-8 C-14 46 -40 30 -40 0 Z" fill="${r1}"/><path d="M-14 -36 C-20 0 -12 40 -4 60 H4 C12 40 20 0 14 -36 C8 -44 -8 -44 -14 -36 Z" fill="${r2}"/><path d="M-8 60 L-12 76 M8 60 L12 76" stroke="#8a5a33" stroke-width="2"/><rect x="-14" y="76" width="28" height="18" rx="3" fill="#c4935f"/></g>`;
    return svg(`<rect width="400" height="400" fill="url(#bal)"/>${bulut(30, 50)}${bulut(250, 120, 0.8)}${bulut(120, 210, 0.7)}
      <path d="M0 320 Q100 290 200 316 T400 300 V400 H0 Z" fill="#7cc35a"/><path d="M0 350 Q150 330 400 350 V400 H0 Z" fill="#5fae47"/>
      ${balon(110, 120, 1.3, "#ff5a4e", "#ffc23a")}${balon(290, 70, 1, "#2f86e0", "#fff")}${balon(330, 220, 0.8, "#8a5cf0", "#ff9bc2")}${balon(200, 250, 0.6, "#2fb36a", "#ffd23f")}${balon(50, 280, 0.5, "#ff8a1f", "#fff")}
      ${agac(360, 320, 0.7)}${cicek(150, 370, 0.7, "#ff5d8f")}${cicek(260, 375, 0.6, "#ffd23f", "#ff7a1f")}`, grad("bal", "#8fd3ff", "#f0faff"));
  }

  // Seviyeler: 2x2 (3), 3x3 (3), 4x4 (6), 5x5 (6), 6x6 (12); resimler kolaydan ayrıntılıya sıralı
  const sira = [
    ["Kedi", kedi], ["Köpek", kopek], ["Ayçiçeği", aycicegi],
    ["Kelebek", kelebekSahne], ["Balık", balik], ["Aslan", aslan],
    ["Kurbağa", kurbaga], ["Uğur Böceği", ugurBocegi], ["Baykuş", baykus], ["Lale Bahçesi", laleBahcesi], ["Fil", fil], ["Tavşan", tavsan],
    ["Penguen", penguen], ["Arılar", ariCicek], ["Zürafa", zurafa], ["Ayı", ayi], ["Kaplumbağa", kaplumbaga], ["Civcivler", civciv],
    ["Gökkuşağı", gokkusagi], ["Deniz Altı", denizAlti], ["Çiftlik", ciftlik], ["Orman", orman], ["Papağan", papagan], ["Çiçek Tarlası", cicekTarlasi],
    ["Kumsal", kumsal], ["Uzay", uzay], ["Kış Köyü", kisKoyu], ["Panda", panda], ["Dinozor", dinozor], ["Balon Festivali", balonlar],
  ];
  const liste = sira.map(([ad, fn], i) => [i < 3 ? 2 : i < 6 ? 3 : i < 12 ? 4 : i < 18 ? 5 : 6, ad, fn]);


  window.RESIMLER = liste.map(([n, ad, fn]) => ({
    n,
    ad,
    src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(fn()),
  }));
})();
