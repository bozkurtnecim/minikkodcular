/* 2. Hafta: Sırala! (algoritma: adımların sırası).
   20 bölüm: 3 kart (5), 4 kart (5), 5 kart (5), 6 kart (5).
   Çocuk karışık kartları 1, 2, 3… kutularına dizer ve "Çalıştır"a basar;
   program adım adım çalışır, yanlış adımda durur. */
(function () {
  const KAYIT = "sirala";

  // Sürüklenen öğenin yerini korur; yoksa liste kısalır ve hedefler kayar
  function yerTut(el) {
    const r = el.getBoundingClientRect();
    const t = document.createElement("div");
    t.style.cssText = `width:${r.width}px;height:${r.height}px;flex:none;visibility:hidden`;
    el.before(t);
    el._yerTutucu = t;
  }
  function yerBirak(el) { if (el._yerTutucu) { el._yerTutucu.remove(); el._yerTutucu = null; } }


  // ---------- Çizim yardımcıları (200x200 kart) ----------
  const svg = (ic) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">${ic}</svg>`;
  const zemin = (gok, yer, ufuk = 150) => `<rect width="200" height="200" fill="${gok}"/><rect y="${ufuk}" width="200" height="${200 - ufuk}" fill="${yer}"/>`;
  const goz = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#26201f"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.35}" fill="#fff"/>`;
  const gulus = (x, y, w = 10) => `<path d="M${x - w} ${y} q${w} ${w * 0.9} ${w * 2} 0" stroke="#26201f" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const cicekBas = (x, y, r = 10, renk = "#ff5d8f") => {
    let p = "";
    for (let i = 0; i < 6; i++) p += `<ellipse cx="0" cy="${-r}" rx="${r * 0.6}" ry="${r}" fill="${renk}" transform="rotate(${i * 60})"/>`;
    return `<g transform="translate(${x} ${y})">${p}<circle r="${r * 0.6}" fill="#ffd23f"/></g>`;
  };
  const yaprak = (x, y, a, b = 14) => `<ellipse cx="${x}" cy="${y}" rx="${b}" ry="${b * 0.45}" fill="#4fb04a" transform="rotate(${a} ${x} ${y})"/>`;
  const sap = (x, y1, y2) => `<path d="M${x} ${y1} V${y2}" stroke="#3d9a3d" stroke-width="5" stroke-linecap="round"/>`;
  const toprak = `<ellipse cx="100" cy="160" rx="70" ry="20" fill="#8a5a33"/><ellipse cx="100" cy="156" rx="60" ry="12" fill="#a06a44"/>`;
  const bulut = (x, y, s = 1, renk = "#fff") => `<g transform="translate(${x} ${y}) scale(${s})" fill="${renk}"><ellipse cx="0" cy="0" rx="22" ry="13"/><ellipse cx="18" cy="-8" rx="17" ry="15"/><ellipse cx="34" cy="2" rx="18" ry="12"/></g>`;
  const gunes = (x, y, r = 16) => `<circle cx="${x}" cy="${y}" r="${r + 7}" fill="#ffe27a"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffc928"/>`;

  // ---------- Hikâyeler: her biri adım numarasına göre çizilir ----------
  const H = {};

  H.cicek = (i) => svg(`${zemin("#d4efff", "#7ccf6a")}${gunes(170, 30, 12)}${toprak}
    ${i === 0 ? `<ellipse cx="100" cy="150" rx="8" ry="5" fill="#5a3416"/><path d="M92 136 l-6 -8 M100 132 v-10 M108 136 l6 -8" stroke="#5a3416" stroke-width="2.5" stroke-linecap="round"/>` : ""}
    ${i === 1 ? `${sap(100, 152, 118)}${yaprak(88, 122, -30, 13)}${yaprak(112, 122, 30, 13)}` : ""}
    ${i === 2 ? `${sap(100, 152, 70)}${yaprak(86, 120, -30, 16)}${yaprak(114, 108, 30, 16)}${cicekBas(100, 62, 16)}` : ""}`);

  H.civciv = (i) => {
    const yuva = `<ellipse cx="100" cy="165" rx="72" ry="22" fill="#c48b4a"/><path d="M40 160 l20 -6 M60 170 l20 -8 M120 168 l22 -8 M140 160 l18 -6" stroke="#e0b070" stroke-width="4" stroke-linecap="round"/>`;
    const yumurta = `<ellipse cx="100" cy="112" rx="38" ry="50" fill="#fffaf0" stroke="#e8dcc0" stroke-width="3"/>`;
    const catlak = `<path d="M64 112 l10 -8 l8 10 l10 -12 l10 12 l10 -10 l10 10 l12 -8" stroke="#8a6a4a" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
    const civ = `<ellipse cx="96" cy="120" rx="30" ry="26" fill="#ffd93b"/><circle cx="96" cy="84" r="22" fill="#ffe14f"/>${goz(88, 80)}${goz(104, 80)}<path d="M93 89 l10 4 l-10 4 z" fill="#ff8a1a"/><path d="M90 144 v10 M102 144 v10" stroke="#ff8a1a" stroke-width="4"/>`;
    const kabuk = `<path d="M128 160 Q126 130 150 128 Q174 130 172 160 Z" fill="#fffaf0" stroke="#e8dcc0" stroke-width="3"/><path d="M128 140 l8 -8 l8 8 l8 -10 l8 10 l8 -8 l6 6" stroke="#e8dcc0" stroke-width="3" fill="none"/>`;
    return svg(`${zemin("#fff1c9", "#f4d58a", 160)}${yuva}${i === 0 ? yumurta : ""}${i === 1 ? yumurta + catlak : ""}${i === 2 ? civ + kabuk : ""}`);
  };

  H.balon = (i) => {
    const r = [18, 34, 54][i], cy = 92 - (r - 18) * 0.4;
    return svg(`${zemin("#bfe8ff", "#8fd36a", 165)}${bulut(20, 40, 0.8)}${bulut(140, 26, 0.7)}
      <path d="M100 ${cy + r * 1.15} Q94 ${cy + r * 1.15 + 30} 100 185" stroke="#555" stroke-width="2" fill="none"/>
      <ellipse cx="100" cy="${cy}" rx="${r}" ry="${r * 1.15}" fill="#ff4d5e"/>
      <path d="M96 ${cy + r * 1.15} l4 7 l4 -7 z" fill="#d93646"/>
      <ellipse cx="${100 - r * 0.4}" cy="${cy - r * 0.45}" rx="${r * 0.18}" ry="${r * 0.32}" fill="#fff" opacity=".6"/>`);
  };

  H.bardak = (i) => {
    const f = [0, 0.5, 1][i];
    const ust = 60, alt = 168, sol = (y) => 62 + ((y - ust) / (alt - ust)) * 12, sag = (y) => 138 - ((y - ust) / (alt - ust)) * 12;
    const sy = alt - f * (alt - ust - 10);
    const su = f ? `<path d="M${sol(sy)} ${sy} L${sag(sy)} ${sy} L${sag(alt)} ${alt} L${sol(alt)} ${alt} Z" fill="#5ec4ff"/><path d="M${sol(sy) + 4} ${sy + 2} h${sag(sy) - sol(sy) - 8}" stroke="#bfe9ff" stroke-width="4"/>` : "";
    return svg(`${zemin("#fde9f0", "#f0c9a8", 172)}${su}
      <path d="M62 ${ust} L138 ${ust} L126 ${alt} L74 ${alt} Z" fill="#ffffff" fill-opacity=".35" stroke="#7aa6c9" stroke-width="4" stroke-linejoin="round"/>
      <path d="M72 70 L80 150" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`);
  };

  const kardanAdam = (i, bes) => {
    const top = Math.min(i + 1, 3);
    const yuz = bes ? i >= 3 : i >= 2;
    const sapka = bes && i >= 4;
    let k = `<circle cx="100" cy="150" r="38" fill="#fff" stroke="#d6e6f5" stroke-width="3"/>`;
    if (top >= 2) k += `<circle cx="100" cy="98" r="28" fill="#fff" stroke="#d6e6f5" stroke-width="3"/>`;
    if (top >= 3) k += `<circle cx="100" cy="58" r="20" fill="#fff" stroke="#d6e6f5" stroke-width="3"/>`;
    if (yuz) k += `${goz(93, 54, 3)}${goz(107, 54, 3)}<path d="M100 60 l14 4 l-14 3 z" fill="#ff8a1a"/><circle cx="100" cy="90" r="3.5" fill="#26201f"/><circle cx="100" cy="104" r="3.5" fill="#26201f"/><path d="M72 96 L50 80 M128 96 L150 80" stroke="#8a5a33" stroke-width="4" stroke-linecap="round"/>`;
    if (sapka) k += `<rect x="84" y="20" width="32" height="24" rx="3" fill="#2b2b3a"/><rect x="76" y="40" width="48" height="6" rx="3" fill="#2b2b3a"/><rect x="84" y="36" width="32" height="5" fill="#e43d3d"/><path d="M80 74 q20 10 40 0 l2 8 q-22 10 -44 0 z" fill="#e43d3d"/><rect x="108" y="78" width="10" height="24" rx="3" fill="#e43d3d"/>`;
    let kar = "";
    for (let j = 0; j < 12; j++) kar += `<circle cx="${(j * 47) % 200}" cy="${(j * 71) % 120}" r="2.5" fill="#fff"/>`;
    return svg(`${zemin("#9fd0f5", "#f4fbff", 170)}${kar}${k}`);
  };
  H.kardan3 = (i) => kardanAdam(i, false);
  H.kardan5 = (i) => kardanAdam(i, true);

  H.elma = (i) => {
    const arka = "#e9f8e4";
    let a = `<path d="M100 60 q-6 -16 4 -26" stroke="#7a4a24" stroke-width="5" fill="none" stroke-linecap="round"/>${yaprak(116, 40, -25, 13)}`;
    if (i < 3) {
      a += `<path d="M100 64 C70 46 38 70 44 112 C50 150 78 168 100 158 C122 168 150 150 156 112 C162 70 130 46 100 64 Z" fill="#e8312f"/><ellipse cx="72" cy="88" rx="9" ry="16" fill="#fff" opacity=".35" transform="rotate(20 72 88)"/>`;
      if (i >= 1) a += `<circle cx="160" cy="102" r="20" fill="${arka}"/><circle cx="150" cy="124" r="16" fill="${arka}"/><path d="M142 86 q-10 18 -4 50" stroke="#fff3d6" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      if (i >= 2) a += `<circle cx="40" cy="102" r="20" fill="${arka}"/><circle cx="50" cy="124" r="16" fill="${arka}"/><path d="M58 86 q10 18 4 50" stroke="#fff3d6" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    } else {
      a += `<path d="M76 66 Q100 54 124 66 Q104 80 106 110 Q104 140 124 152 Q100 166 76 152 Q96 140 94 110 Q96 80 76 66 Z" fill="#fff3d6"/><path d="M76 66 Q100 54 124 66 Q110 72 100 72 Q90 72 76 66 Z M76 152 Q100 166 124 152 Q110 146 100 146 Q90 146 76 152 Z" fill="#e8312f"/><ellipse cx="96" cy="104" rx="3" ry="5" fill="#5a3416"/><ellipse cx="104" cy="116" rx="3" ry="5" fill="#5a3416"/>`;
    }
    return svg(`<rect width="200" height="200" fill="${arka}"/><ellipse cx="100" cy="176" rx="64" ry="10" fill="#cfe8c6"/>${a}`);
  };

  H.kule = (i) => {
    const renk = ["#ff5a4e", "#2f86e0", "#ffc23a", "#2fb36a"];
    let b = "";
    for (let j = 0; j <= i; j++) b += `<rect x="64" y="${148 - j * 34}" width="72" height="32" rx="6" fill="${renk[j]}"/><circle cx="84" cy="${164 - j * 34}" r="5" fill="#fff" opacity=".5"/><circle cx="116" cy="${164 - j * 34}" r="5" fill="#fff" opacity=".5"/>`;
    return svg(`${zemin("#efe6ff", "#d8c3a5", 180)}${b}`);
  };

  H.kurbaga = (i) => {
    let k = "";
    if (i === 0) for (let j = 0; j < 9; j++) { const x = 72 + (j % 3) * 26 + (Math.floor(j / 3) % 2) * 12, y = 84 + Math.floor(j / 3) * 26; k += `<circle cx="${x}" cy="${y}" r="12" fill="#e9f6ff" opacity=".9"/><circle cx="${x}" cy="${y}" r="5" fill="#26201f"/>`; }
    if (i === 1 || i === 2) {
      k += `<path d="M110 110 Q140 96 160 116 Q140 112 112 120 Z" fill="#3a3a3a"/><ellipse cx="96" cy="112" rx="24" ry="17" fill="#3a3a3a"/>${goz(86, 106, 3.5)}`;
      if (i === 2) k += `<path d="M106 124 l8 18 l8 2 M96 126 l2 18 l8 3" stroke="#3a3a3a" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    }
    if (i === 3) k += `<ellipse cx="100" cy="150" rx="66" ry="16" fill="#3cae4f"/><ellipse cx="100" cy="122" rx="38" ry="26" fill="#78d34f"/><circle cx="82" cy="96" r="13" fill="#78d34f"/><circle cx="118" cy="96" r="13" fill="#78d34f"/>${goz(82, 95, 6)}${goz(118, 95, 6)}${gulus(100, 118, 14)}<path d="M66 140 q-16 4 -20 -4 M134 140 q16 4 20 -4" stroke="#5fbf3f" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    return svg(`<rect width="200" height="200" fill="#5ab8ea"/><path d="M0 40 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0" stroke="#9ad8f8" stroke-width="4" fill="none"/><path d="M0 180 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0" stroke="#9ad8f8" stroke-width="4" fill="none"/><path d="M10 200 Q16 140 8 100 M180 200 Q186 150 196 120" stroke="#3c8f3c" stroke-width="6" fill="none"/>${k}`);
  };

  H.ev = (i) => {
    let e = `<rect x="54" y="92" width="92" height="70" fill="#ffd28a" stroke="#c98a3a" stroke-width="3"/>`;
    if (i >= 1) e = `<path d="M44 96 L100 48 L156 96 Z" fill="#e43d3d" stroke="#a8261f" stroke-width="3" stroke-linejoin="round"/>` + e;
    if (i >= 2) e += `<rect x="88" y="118" width="24" height="44" rx="3" fill="#8a5a33"/><circle cx="106" cy="142" r="2.5" fill="#ffd23f"/>`;
    if (i >= 3) e = `<rect x="122" y="50" width="14" height="30" fill="#8a5a33"/><circle cx="134" cy="38" r="7" fill="#e6e6e6"/><circle cx="142" cy="26" r="9" fill="#efefef"/>` + e + `<rect x="62" y="104" width="20" height="20" fill="#bfe9ff" stroke="#fff" stroke-width="3"/><rect x="118" y="104" width="20" height="20" fill="#bfe9ff" stroke="#fff" stroke-width="3"/>`;
    return svg(`${zemin("#cdeeff", "#7ccf6a", 160)}${bulut(14, 30, 0.7)}${e}`);
  };

  H.yagmur = (i) => {
    const gok = ["#a9b8c9", "#8fa0b4", "#bcdcf2", "#8fd3ff"][i];
    let y = "";
    if (i === 3) ["#ff4d4d", "#ff9a1f", "#ffd93b", "#5ac85a", "#3da3ff", "#8f5cff"].forEach((c, j) => (y += `<path d="M${30 + j * 9} 160 A${70 - j * 9} ${70 - j * 9} 0 0 1 ${170 - j * 9} 160" stroke="${c}" stroke-width="9" fill="none"/>`));
    if (i >= 2) y += gunes(150, 50, 18);
    if (i <= 2) y += bulut(i === 2 ? 40 : 60, 60, i === 2 ? 1.2 : 1.6, i === 2 ? "#e9eef3" : "#7d8a9a");
    if (i === 1 || i === 2) for (let j = 0; j < (i === 1 ? 12 : 5); j++) { const x = 50 + (j * 23) % 100, yy = 90 + (j * 37) % 60; y += `<path d="M${x} ${yy} q-4 8 0 10 q4 -2 0 -10" fill="#3da3ff" stroke="#3da3ff" stroke-width="2"/>`; }
    return svg(`${zemin(gok, "#6dbd4f", 160)}${y}`);
  };

  H.kelebek = (i) => {
    const dal = `<path d="M0 60 Q80 70 200 50" stroke="#7a4a24" stroke-width="8" fill="none"/><path d="M60 66 Q40 120 90 150 Q130 120 100 70 Z" fill="#4fb04a"/><path d="M68 70 Q76 110 90 146" stroke="#3d8a33" stroke-width="3" fill="none"/>`;
    const delik = i >= 2 ? `<circle cx="72" cy="112" r="9" fill="#e6f7d9"/><circle cx="100" cy="96" r="7" fill="#e6f7d9"/>` : "";
    let k = "";
    if (i === 0) for (let j = 0; j < 5; j++) k += `<circle cx="${70 + j * 10}" cy="${116 - (j % 2) * 10}" r="7" fill="#fff8c4" stroke="#d6c060" stroke-width="2"/>`;
    const tirtil = (x, y, n, r) => { let t = ""; for (let j = 0; j < n; j++) t += `<circle cx="${x + j * r * 1.5}" cy="${y + (j % 2) * 3}" r="${r}" fill="${j % 2 ? "#7ccf3a" : "#9be35a"}"/>`; return t + `<circle cx="${x + (n - 1) * r * 1.5 + r}" cy="${y - 2}" r="${r * 1.1}" fill="#ff7a3d"/>${goz(x + (n - 1) * r * 1.5 + r + 2, y - 4, r * 0.35)}`; };
    if (i === 1) k += tirtil(70, 120, 4, 7);
    if (i === 2) k += tirtil(60, 132, 6, 9);
    if (i === 3) k += `<path d="M140 56 v12" stroke="#7a4a24" stroke-width="3"/><path d="M140 66 Q124 90 132 124 Q140 138 148 124 Q156 90 140 66 Z" fill="#b5a35a"/><path d="M132 84 q8 4 16 0 M130 100 q10 4 20 0 M132 114 q8 4 16 0" stroke="#8a7a3a" stroke-width="2.5" fill="none"/>`;
    if (i === 4) k += `<path d="M140 56 v12" stroke="#7a4a24" stroke-width="2"/><path d="M140 66 Q132 84 136 100 Q140 106 144 100 Q148 84 140 66 Z" fill="#c9bb84" opacity=".7"/><g transform="translate(130 140) scale(1.3)"><ellipse cx="-20" cy="-12" rx="20" ry="16" fill="#ff7a2f"/><ellipse cx="20" cy="-12" rx="20" ry="16" fill="#ff7a2f"/><ellipse cx="-14" cy="12" rx="13" ry="11" fill="#ffb02e"/><ellipse cx="14" cy="12" rx="13" ry="11" fill="#ffb02e"/><circle cx="-24" cy="-14" r="5" fill="#fff"/><circle cx="24" cy="-14" r="5" fill="#fff"/><rect x="-3" y="-20" width="6" height="38" rx="3" fill="#2b2240"/><path d="M-2 -20 Q-8 -32 -13 -34 M2 -20 Q8 -32 13 -34" stroke="#2b2240" stroke-width="2" fill="none"/></g>`;
    return svg(`<rect width="200" height="200" fill="#e6f7d9"/>${dal}${delik}${k}`);
  };

  H.pizza = (i) => {
    let p = `<circle cx="100" cy="104" r="70" fill="#f3d39a"/><circle cx="100" cy="104" r="70" fill="none" stroke="#d9a860" stroke-width="10"/>`;
    if (i >= 1) p += `<circle cx="100" cy="104" r="58" fill="#e8442f"/>`;
    if (i >= 2) [[80, 84], [118, 80], [124, 116], [86, 126], [100, 104], [70, 108], [108, 140]].forEach(([x, y]) => (p += `<ellipse cx="${x}" cy="${y}" rx="16" ry="12" fill="#ffe07a"/>`));
    if (i >= 3) {
      [[84, 96], [120, 98], [100, 128], [72, 124], [128, 130]].forEach(([x, y]) => (p += `<circle cx="${x}" cy="${y}" r="8" fill="#b8282a"/><circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#e26a5a"/>`));
      [[104, 82], [110, 112], [80, 140], [140, 110]].forEach(([x, y]) => (p += `<circle cx="${x}" cy="${y}" r="4.5" fill="#2b2b2b"/><circle cx="${x}" cy="${y}" r="1.8" fill="#f3d39a"/>`));
      [[90, 110], [132, 92]].forEach(([x, y]) => (p += `${yaprak(x, y, 30, 7)}`));
    }
    if (i >= 4) p += `<path d="M100 104 L170 104 A70 70 0 0 1 135 165 Z" fill="#f6efe2"/><g transform="translate(22 18)"><path d="M100 104 L170 104 A70 70 0 0 1 135 165 Z" fill="#e8442f" stroke="#d9a860" stroke-width="6"/><ellipse cx="135" cy="120" rx="12" ry="8" fill="#ffe07a"/><circle cx="145" cy="135" r="7" fill="#b8282a"/></g>`;
    return svg(`<rect width="200" height="200" fill="#f6efe2"/><path d="M0 0 h200 v200 h-200 z" fill="none"/><circle cx="100" cy="106" r="84" fill="#ffffff" stroke="#e6dccb" stroke-width="3"/>${p}`);
  };

  H.agac = (i) => {
    let a = "";
    if (i === 0) a = `<ellipse cx="100" cy="150" rx="8" ry="5" fill="#5a3416"/>`;
    if (i === 1) a = `${sap(100, 152, 128)}${yaprak(90, 128, -30, 11)}${yaprak(110, 128, 30, 11)}`;
    if (i === 2) a = `<rect x="96" y="104" width="8" height="50" fill="#8a5a33"/><circle cx="100" cy="98" r="20" fill="#4fae4f"/>`;
    if (i >= 3) {
      a = `<rect x="90" y="96" width="20" height="60" rx="4" fill="#8a5a33"/><circle cx="100" cy="70" r="40" fill="#3e9b48"/><circle cx="68" cy="92" r="26" fill="#47a851"/><circle cx="132" cy="92" r="26" fill="#47a851"/>`;
      if (i === 4) [[84, 62], [118, 60], [70, 98], [132, 96], [100, 88], [104, 44]].forEach(([x, y]) => (a += `<circle cx="${x}" cy="${y}" r="7" fill="#e43d3d"/><circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#fff" opacity=".6"/>`));
    }
    return svg(`${zemin("#d4efff", "#7ccf6a")}${gunes(30, 30, 12)}${toprak}${a}`);
  };

  H.gokkusagi = (i) => {
    let g = "";
    ["#ff4d4d", "#ff9a1f", "#ffd93b", "#5ac85a", "#3da3ff"].slice(0, i + 1).forEach((c, j) => (g += `<path d="M${22 + j * 13} 150 A${78 - j * 13} ${78 - j * 13} 0 0 1 ${178 - j * 13} 150" stroke="${c}" stroke-width="13" fill="none"/>`));
    return svg(`${zemin("#cdeeff", "#7ccf6a", 160)}${g}${bulut(6, 150, 1.1)}${bulut(146, 150, 1.1)}`);
  };

  H.kek = (i) => {
    const kase = (ic) => `${ic}<path d="M40 100 h120 Q156 160 100 160 Q44 160 40 100 Z" fill="#5ab0e8"/><path d="M40 100 h120" stroke="#3d8fcc" stroke-width="5" stroke-linecap="round"/>`;
    let k = "";
    if (i === 0) k = kase(`<ellipse cx="80" cy="96" rx="14" ry="18" fill="#fffaf0" stroke="#e8dcc0" stroke-width="2"/><path d="M110 104 Q118 70 140 60 L156 72 Q140 86 136 104 Z" fill="#f2efe8" stroke="#d6cfc0" stroke-width="2"/><text x="146" y="72" font-size="9" font-family="sans-serif" font-weight="700" fill="#b0a080" text-anchor="middle" transform="rotate(35 146 72)">UN</text>`);
    if (i === 1) k = kase(`<ellipse cx="100" cy="100" rx="58" ry="10" fill="#f7d98a"/><path d="M120 30 L104 98" stroke="#c98a3a" stroke-width="7" stroke-linecap="round"/><path d="M80 98 q10 -6 20 0 q10 6 20 0" stroke="#e8c060" stroke-width="3" fill="none"/>`);
    if (i === 2) k = `<ellipse cx="100" cy="140" rx="64" ry="16" fill="#9aa7b8"/><rect x="36" y="110" width="128" height="30" fill="#aab6c6"/><ellipse cx="100" cy="110" rx="64" ry="16" fill="#bcc7d4"/><ellipse cx="100" cy="112" rx="56" ry="12" fill="#f7d98a"/>`;
    if (i === 3) k = `<rect x="30" y="40" width="140" height="130" rx="12" fill="#e9e9ef" stroke="#b8b8c4" stroke-width="3"/><rect x="44" y="70" width="112" height="78" rx="8" fill="#ff9a3d" stroke="#6a6a7a" stroke-width="5"/><rect x="62" y="116" width="76" height="20" fill="#aab6c6"/><rect x="66" y="108" width="68" height="10" rx="4" fill="#e8b860"/><circle cx="56" cy="54" r="6" fill="#6a6a7a"/><circle cx="76" cy="54" r="6" fill="#6a6a7a"/><path d="M80 90 q6 -10 0 -16 M100 90 q6 -10 0 -16 M120 90 q6 -10 0 -16" stroke="#ffd23f" stroke-width="3" fill="none"/>`;
    if (i >= 4) {
      k = `<ellipse cx="100" cy="160" rx="76" ry="14" fill="#fff" stroke="#e0d6c6" stroke-width="3"/><path d="M44 106 h112 v46 Q100 164 44 152 Z" fill="#c9823c"/><ellipse cx="100" cy="106" rx="56" ry="14" fill="#d9944a"/><path d="M44 108 q8 14 16 0 q8 14 16 0 q8 14 16 0 q8 14 16 0 q8 14 16 0 q8 14 16 0 q8 14 16 0" fill="#fff4f0" stroke="#fff4f0" stroke-width="2"/><ellipse cx="100" cy="102" rx="54" ry="12" fill="#fff4f0"/>`;
      if (i === 5) [74, 100, 126].forEach((x, j) => (k += `<rect x="${x - 4}" y="66" width="8" height="34" rx="2" fill="${["#ff5a4e", "#2f86e0", "#2fb36a"][j]}"/><path d="M${x} 52 q-7 8 0 14 q7 -6 0 -14" fill="#ffb21a"/>`));
    }
    return svg(`<rect width="200" height="200" fill="#fff0e6"/><rect y="168" width="200" height="32" fill="#e8c9a8"/>${k}`);
  };

  H.tren = (i) => {
    const renk = ["#ff5a4e", "#ffc23a", "#2fb36a", "#2f86e0", "#8a5cf0"];
    const vw = 30, lw = 54, top = lw + i * (vw + 4);
    const sc = Math.min(1, 184 / top), x0 = (200 - top * sc) / 2;
    let t = `<rect x="0" y="40" width="${lw}" height="40" rx="5" fill="#e43d3d"/><rect x="${lw - 24}" y="16" width="22" height="30" rx="3" fill="#e43d3d"/><rect x="${lw - 20}" y="21" width="14" height="13" fill="#bfe9ff"/><rect x="8" y="22" width="10" height="20" fill="#2b2b3a"/><circle cx="12" cy="12" r="6" fill="#e6e6e6"/><circle cx="16" cy="88" r="10" fill="#2b2b3a"/><circle cx="${lw - 14}" cy="88" r="10" fill="#2b2b3a"/>`;
    for (let j = 0; j < i; j++) { const x = lw + 4 + j * (vw + 4); t += `<rect x="${x - 4}" y="64" width="6" height="4" fill="#555"/><rect x="${x}" y="48" width="${vw}" height="32" rx="4" fill="${renk[j]}"/><circle cx="${x + 8}" cy="88" r="7" fill="#2b2b3a"/><circle cx="${x + vw - 8}" cy="88" r="7" fill="#2b2b3a"/>`; }
    return svg(`${zemin("#cdeeff", "#7ccf6a", 140)}${bulut(130, 30, 0.7)}<rect y="142" width="200" height="6" fill="#8a5a33"/><path d="M0 150 h200" stroke="#6a6a7a" stroke-width="4"/>
      <g transform="translate(${x0} ${150 - 98 * sc}) scale(${sc})">${t}</g>`);
  };

  H.robot = (i) => {
    let r = `<rect x="66" y="84" width="68" height="60" rx="10" fill="#7fa8c9"/><rect x="82" y="100" width="36" height="26" rx="4" fill="#5d86a8"/><circle cx="92" cy="113" r="4" fill="#ffd23f"/><circle cx="108" cy="113" r="4" fill="#ff5a4e"/>`;
    if (i >= 1) r += `<rect x="72" y="36" width="56" height="44" rx="10" fill="#9cc0de"/><rect x="94" y="78" width="12" height="8" fill="#5d86a8"/>`;
    if (i >= 2) r += `<rect x="40" y="88" width="22" height="12" rx="6" fill="#5d86a8"/><rect x="138" y="88" width="22" height="12" rx="6" fill="#5d86a8"/><circle cx="40" cy="104" r="9" fill="#9cc0de"/><circle cx="160" cy="104" r="9" fill="#9cc0de"/>`;
    if (i >= 3) r += `<rect x="76" y="144" width="14" height="24" fill="#5d86a8"/><rect x="110" y="144" width="14" height="24" fill="#5d86a8"/><rect x="70" y="166" width="24" height="10" rx="4" fill="#3d5a78"/><rect x="106" y="166" width="24" height="10" rx="4" fill="#3d5a78"/>`;
    if (i >= 4) r += `<circle cx="88" cy="56" r="8" fill="#fff"/><circle cx="112" cy="56" r="8" fill="#fff"/><circle cx="89" cy="57" r="4" fill="#26201f"/><circle cx="113" cy="57" r="4" fill="#26201f"/><rect x="88" y="68" width="24" height="5" rx="2.5" fill="#3d5a78"/>`;
    if (i >= 5) r += `<path d="M100 36 v-14" stroke="#5d86a8" stroke-width="4"/><circle cx="100" cy="18" r="7" fill="#ff5a4e"/><circle cx="100" cy="18" r="12" fill="#ff5a4e" opacity=".25"/>`;
    return svg(`<rect width="200" height="200" fill="#efe9ff"/><rect y="176" width="200" height="24" fill="#d6ccef"/>${r}`);
  };

  H.dondurma = (i) => {
    let d = `<path d="M70 104 L100 182 L130 104 Z" fill="#e8b060"/><path d="M76 116 L120 150 M84 140 L114 118 M78 120 L104 168 M124 120 L96 168" stroke="#c98a3a" stroke-width="3"/>`;
    const top = [["#ff9bc2", 92], ["#fff3d6", 66], ["#8a5a33", 42]];
    for (let j = 0; j < Math.min(i, 3); j++) d += `<circle cx="100" cy="${top[j][1]}" r="${30 - j * 3}" fill="${top[j][0]}"/><path d="M${72 + j * 3} ${top[j][1] + 10} q7 8 14 0 q7 8 14 0 q7 8 14 0 q7 8 14 0" fill="${top[j][0]}"/>`;
    if (i >= 4) d += `<path d="M78 32 Q100 14 122 32 L122 40 Q118 54 114 40 Q108 50 104 40 Q98 58 92 40 Q86 50 82 40 Z" fill="#5a3416"/>`;
    if (i >= 5) d += `<path d="M100 14 q6 -12 16 -12" stroke="#3d8a33" stroke-width="3" fill="none"/><circle cx="100" cy="18" r="9" fill="#e8262b"/><circle cx="97" cy="15" r="2.5" fill="#fff" opacity=".7"/>`;
    return svg(`<rect width="200" height="200" fill="#dff6ff"/>${d}`);
  };

  H.bahce = (i) => {
    let b = `<rect x="20" y="130" width="160" height="40" rx="10" fill="#8a5a33"/><rect x="26" y="126" width="148" height="14" rx="7" fill="#a06a44"/>`;
    if (i <= 2) b += `<ellipse cx="100" cy="132" rx="16" ry="6" fill="#5a3416"/>`;
    if (i === 1) b += `<ellipse cx="100" cy="131" rx="6" ry="4" fill="#ffd28a"/><path d="M100 80 v30" stroke="#a06a44" stroke-width="3" stroke-dasharray="4 4"/><ellipse cx="100" cy="74" rx="6" ry="4" fill="#ffd28a" opacity=".5"/>`;
    if (i === 2) b += `<g transform="translate(118 54) rotate(-25)"><rect x="0" y="0" width="44" height="34" rx="8" fill="#2fb36a"/><path d="M0 8 L-30 -4 L-30 4 L0 18 Z" fill="#2fb36a"/><path d="M44 6 q18 0 14 22" stroke="#2fb36a" stroke-width="6" fill="none"/></g>${[0, 1, 2, 3, 4].map((j) => `<path d="M${84 + j * 7} ${88 + (j % 2) * 10} q-3 6 0 8 q3 -2 0 -8" fill="#3da3ff" stroke="#3da3ff" stroke-width="2"/>`).join("")}`;
    if (i === 3) b += `${sap(100, 132, 112)}${yaprak(91, 112, -30, 10)}${yaprak(109, 112, 30, 10)}`;
    if (i === 4) b += `${sap(100, 132, 80)}${yaprak(88, 110, -30, 13)}${yaprak(112, 100, 30, 13)}<ellipse cx="100" cy="74" rx="9" ry="13" fill="#4fb04a"/><path d="M95 66 Q100 58 105 66" fill="#ff5d8f"/>`;
    if (i === 5) b += `${sap(100, 132, 70)}${yaprak(88, 110, -30, 14)}${yaprak(112, 98, 30, 14)}${cicekBas(100, 62, 17, "#ff5d8f")}`;
    return svg(`${zemin("#d4efff", "#7ccf6a", 160)}${gunes(170, 30, 12)}${b}`);
  };


  // ---------- Yeni hikâyeler ----------
  H.buz = (i) => {
    const w = [70, 44, 0][i];
    return svg(`${zemin("#d4efff", "#e8c9a8", 150)}${gunes(165, 34, 14)}<ellipse cx="100" cy="146" rx="${40 + i * 18}" ry="${8 + i * 4}" fill="#9fd8ff" opacity="${0.5 + i * 0.2}"/>
      ${w ? `<rect x="${100 - w / 2}" y="${144 - w}" width="${w}" height="${w}" rx="${w * 0.15}" fill="#bfe6ff" stroke="#4f9ed8" stroke-width="4"/><path d="M${100 - w / 4} ${150 - w} l${w / 5} ${w / 4}" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<path d="M86 136 q4 -6 8 0 M108 140 q4 -6 8 0" stroke="#fff" stroke-width="3" fill="none"/>`}
      ${i === 1 ? `<path d="M84 104 q-3 6 0 8 q3 -2 0 -8 M118 108 q-3 6 0 8 q3 -2 0 -8" fill="#9fd8ff"/>` : ""}`);
  };

  H.yuva = (i) => {
    const yumurta = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="17" fill="#cfeeff" stroke="#9fc8e0" stroke-width="2"/><circle cx="${x - 4}" cy="${y - 4}" r="2" fill="#9fc8e0"/>`;
    const yavru = (x, y) => `<circle cx="${x}" cy="${y}" r="15" fill="#ffd93b"/>${goz(x - 5, y - 4, 2.5)}${goz(x + 5, y - 4, 2.5)}<path d="M${x - 6} ${y + 2} L${x} ${y - 2} L${x + 6} ${y + 2} L${x} ${y + 10} Z" fill="#ff8a1a"/>`;
    let ic = "";
    if (i === 1) ic = yumurta(80, 110) + yumurta(100, 106) + yumurta(120, 110);
    if (i === 2) ic = yumurta(80, 110) + yavru(100, 104) + `<path d="M86 116 l6 -6 l6 6 l6 -6 l6 6" stroke="#9fc8e0" stroke-width="2" fill="none"/>` + yumurta(120, 110);
    if (i === 3) ic = yavru(78, 106) + yavru(100, 100) + yavru(122, 106);
    return svg(`<rect width="200" height="200" fill="#d4efff"/><path d="M0 150 Q100 136 200 156" stroke="#7a4a24" stroke-width="12" fill="none"/>${yaprak(30, 140, -20, 16)}${yaprak(176, 150, 20, 16)}${ic}<path d="M46 116 Q100 160 154 116 Q150 140 100 142 Q50 140 46 116 Z" fill="#a8774a"/><path d="M50 122 q20 6 40 0 M110 124 q20 6 40 -2" stroke="#7a4a24" stroke-width="3" fill="none"/>`);
  };

  H.akvaryum = (i) => {
    let a = "";
    if (i >= 1) a += `<path d="M40 150 Q100 136 160 150 V164 H40 Z" fill="#f2d48a"/>`;
    if (i >= 2) a += `<rect x="40" y="70" width="120" height="${i >= 1 ? 80 : 94}" fill="#7fd0ff" opacity=".7"/><path d="M44 74 q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" stroke="#bfe9ff" stroke-width="3" fill="none"/>`;
    if (i >= 3) a += `<path d="M70 150 Q60 120 72 96 Q80 120 76 150 M80 150 Q92 116 84 90 Q98 118 88 150" stroke="#2fa36b" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    if (i >= 4) a += `<g transform="translate(124 110)"><path d="M14 0 L28 -10 L28 10 Z" fill="#ff8a1f"/><ellipse rx="18" ry="12" fill="#ff9a2e"/>${goz(-8, -2, 3)}</g><circle cx="110" cy="84" r="3" fill="none" stroke="#fff" stroke-width="1.5"/><circle cx="116" cy="76" r="2" fill="none" stroke="#fff" stroke-width="1.5"/>`;
    return svg(`${zemin("#fff3d6", "#e8c9a8", 170)}<rect x="30" y="164" width="140" height="10" rx="3" fill="#a8774a"/>${a}<rect x="40" y="56" width="120" height="108" rx="6" fill="none" stroke="#9fc8e0" stroke-width="5"/>`);
  };

  H.kale = (i) => {
    let k = "";
    if (i >= 0) k += `<rect x="60" y="100" width="80" height="60" fill="#b4bfcd"/>${[0, 1, 2, 3].map((j) => `<rect x="${60 + j * 22}" y="90" width="12" height="12" fill="#b4bfcd"/>`).join("")}`;
    if (i >= 1) k = `<rect x="30" y="70" width="34" height="90" fill="#9aa7b8"/><rect x="136" y="70" width="34" height="90" fill="#9aa7b8"/>` + k;
    if (i >= 2) k += `<path d="M26 72 L47 40 L68 72 Z M132 72 L153 40 L174 72 Z" fill="#ff5a4e"/>`;
    if (i >= 3) k += `<path d="M86 160 V128 Q100 112 114 128 V160 Z" fill="#8a5a33"/>`;
    if (i >= 4) k += `<path d="M47 40 V20 L64 26 L47 32 M153 40 V20 L170 26 L153 32" stroke="#5a3416" stroke-width="2" fill="#ffc23a"/><rect x="40" y="96" width="12" height="14" fill="#ffe27a"/><rect x="146" y="96" width="12" height="14" fill="#ffe27a"/>`;
    if (i >= 5) k += `<path d="M0 172 H200 V186 H0 Z" fill="#5ab8ea"/><rect x="82" y="160" width="36" height="22" fill="#c4935f"/><path d="M82 166 h36 M82 174 h36" stroke="#8a5a33" stroke-width="2"/>`;
    return svg(`${zemin("#cdeeff", "#7ccf6a", 160)}${bulut(130, 24, 0.6)}${k}`);
  };

  H.gemi = (i) => {
    let g = "";
    const deniz = i >= 4 ? `<rect y="140" width="200" height="60" fill="#3fb0e8"/><path d="M0 146 q12 -6 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0" stroke="#bfe9ff" stroke-width="3" fill="none"/>` : `<rect y="160" width="200" height="40" fill="#e8c9a8"/>`;
    const y0 = i >= 4 ? 120 : 140;
    g += `<path d="M30 ${y0} H170 L150 ${y0 + 28} H50 Z" fill="#c4935f"/><path d="M40 ${y0 + 8} H160" stroke="#8a5a33" stroke-width="3"/>`;
    if (i >= 1) g += `<rect x="97" y="${y0 - 90}" width="6" height="90" fill="#8a5a33"/>`;
    if (i >= 2) g += `<path d="M104 ${y0 - 86} L150 ${y0 - 12} H104 Z" fill="#fff" stroke="#d6e0ea" stroke-width="2"/><path d="M96 ${y0 - 70} L62 ${y0 - 12} H96 Z" fill="#ffc23a"/>`;
    if (i >= 3) g += `<path d="M103 ${y0 - 90} L124 ${y0 - 84} L103 ${y0 - 78} Z" fill="#ff5a4e"/>`;
    if (i >= 5) g += `${gunes(36, 34, 14)}<g transform="translate(160 40)"><path d="M0 0 q6 -6 12 0 q6 -6 12 0" stroke="#5a5a6a" stroke-width="2.5" fill="none"/></g>`;
    return svg(`<rect width="200" height="200" fill="#d4efff"/>${deniz}${g}`);
  };

  H.salata = (i) => {
    let m = "";
    if (i >= 1) m += [[74, 104], [92, 98], [110, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff4b8" stroke="#ffd23f" stroke-width="3"/>`).join("");
    if (i >= 2) m += [[126, 98], [84, 112]].map(([x, y]) => `<path d="M${x - 9} ${y} a9 9 0 0 1 18 0 z" fill="#e8312f"/><path d="M${x - 7} ${y - 1} h14" stroke="#fff3d6" stroke-width="3"/>`).join("");
    if (i >= 3) m += [[100, 92], [118, 112], [68, 96]].map(([x, y]) => `<path d="M${x} ${y + 9} C${x - 10} ${y + 3} ${x - 8} ${y - 7} ${x} ${y - 4} C${x + 8} ${y - 7} ${x + 10} ${y + 3} ${x} ${y + 9} Z" fill="#ec3a3f"/>`).join("");
    if (i >= 4) m += [[136, 108], [60, 108], [104, 112], [96, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#8a4fc8"/>`).join("");
    if (i >= 5) m += `<rect x="128" y="40" width="10" height="70" rx="5" fill="#b4bfcd" transform="rotate(25 133 75)"/><ellipse cx="146" cy="44" rx="10" ry="14" fill="#b4bfcd" transform="rotate(25 146 44)"/>`;
    return svg(`<rect width="200" height="200" fill="#fff0e6"/><rect y="150" width="200" height="50" fill="#e8c9a8"/><path d="M40 108 H160 Q156 160 100 160 Q44 160 40 108 Z" fill="#5ab0e8"/><g transform="translate(0 4)">${m}</g><path d="M40 112 H160 Q156 160 100 160 Q44 160 40 112 Z" fill="#5ab0e8" opacity=".0"/><path d="M42 116 Q100 126 158 116 Q156 160 100 160 Q44 160 42 116 Z" fill="#5ab0e8"/><path d="M40 108 H160" stroke="#3d8fcc" stroke-width="5" stroke-linecap="round"/>`);
  };

  H.eriyen = (i) => {
    const boy = [1, 0.85, 0.7, 0.5, 0.3, 0][i];
    let k = "";
    if (boy > 0) {
      k += `<ellipse cx="100" cy="${160 - 34 * boy}" rx="${42 * boy + 6}" ry="${34 * boy + 4}" fill="#fff" stroke="#d6e6f5" stroke-width="3"/>`;
      if (i <= 2) k += `<circle cx="100" cy="${160 - 34 * boy * 2 - 22 * boy}" r="${26 * boy}" fill="#fff" stroke="#d6e6f5" stroke-width="3"/>`;
      if (i <= 1) k += `<circle cx="100" cy="${160 - 34 * boy * 2 - 44 * boy - 14 * boy}" r="${18 * boy}" fill="#fff" stroke="#d6e6f5" stroke-width="3"/>${goz(94, 160 - 34 * boy * 2 - 58 * boy, 2.5)}${goz(106, 160 - 34 * boy * 2 - 58 * boy, 2.5)}<path d="M100 ${160 - 34 * boy * 2 - 54 * boy} l12 3 l-12 3 z" fill="#ff8a1a"/><rect x="88" y="${160 - 34 * boy * 2 - 90 * boy}" width="24" height="14" fill="#2b2b3a"/>`;
    }
    const su = `<ellipse cx="100" cy="164" rx="${30 + i * 12}" ry="${5 + i * 2}" fill="#9fd8ff" opacity=".85"/>`;
    const dusenler = i >= 2 ? `<rect x="130" y="150" width="22" height="12" fill="#2b2b3a" transform="rotate(20 141 156)"/>` + (i >= 3 ? `<path d="M50 158 l16 4 l-16 4 z" fill="#ff8a1a"/>` : "") : "";
    return svg(`${zemin("#bfe4ff", "#dfeefb", 160)}${gunes(160, 36, 10 + i * 2)}${su}${k}${dusenler}`);
  };

  H.ucurtma = (i) => {
    const ucuyor = i >= 5;
    const t = ucuyor ? "translate(30 -30) rotate(-15 100 90)" : "";
    let u = "";
    u += `<path d="M100 30 V150 M50 76 H150" stroke="#8a5a33" stroke-width="5" stroke-linecap="round"/>`;
    if (i >= 1) u = `<path d="M100 30 L150 76 L100 150 L50 76 Z" fill="#ff5a4e" opacity=".9"/><path d="M100 30 L150 76 L100 76 Z" fill="#ffc23a"/><path d="M100 76 L50 76 L100 150 Z" fill="#2f86e0"/>` + u;
    if (i >= 2) u += `<path d="M100 150 Q86 170 100 186" stroke="#555" stroke-width="2.5" fill="none"/>`;
    if (i >= 3) u += `<path d="M94 166 l-10 -6 v12 z M106 166 l10 -6 v12 z M96 182 l-10 -6 v12 z M104 182 l10 -6 v12 z" fill="#2fb36a"/>`;
    if (i >= 4) u += `<path d="M100 76 Q${ucuyor ? "60 160 10 230" : "150 140 180 190"}" stroke="#7a4a24" stroke-width="2" fill="none"/>${ucuyor ? "" : `<circle cx="180" cy="190" r="8" fill="#c4935f"/>`}`;
    return svg(`${ucuyor ? `<rect width="200" height="200" fill="#9fd8ff"/>${bulut(20, 40, 0.7)}${bulut(130, 150, 0.6)}<rect y="180" width="200" height="20" fill="#7ccf6a"/>` : `<rect width="200" height="200" fill="#fff3d6"/><rect y="170" width="200" height="30" fill="#e8c9a8"/>`}<g transform="${t}">${u}</g>`);
  };

  H.parti = (i) => {
    let p = "";
    if (i >= 1) p += [[30, 50, "#ff5a4e"], [52, 36, "#2f86e0"], [170, 46, "#ffc23a"]].map(([x, y, c]) => `<path d="M${x} ${y + 24} Q${x - 4} ${y + 46} ${x + 2} ${y + 60}" stroke="#888" stroke-width="1.5" fill="none"/><ellipse cx="${x}" cy="${y}" rx="14" ry="18" fill="${c}"/>`).join("");
    if (i >= 2) p += `<path d="M0 20 Q100 50 200 20" stroke="#8a5a33" stroke-width="2" fill="none"/>${[0, 1, 2, 3, 4, 5, 6].map((j) => `<path d="M${12 + j * 28} ${24 + Math.sin(j / 2) * 8} l12 0 l-6 16 z" fill="${["#ff5a4e", "#ffc23a", "#2fb36a", "#2f86e0", "#8a5cf0", "#ff7ab8", "#ff8a1f"][j]}"/>`).join("")}`;
    p += `<rect x="40" y="130" width="120" height="10" rx="3" fill="#c4935f"/><rect x="52" y="140" width="8" height="40" fill="#a8774a"/><rect x="140" y="140" width="8" height="40" fill="#a8774a"/>`;
    if (i >= 3) p += `<path d="M72 130 V108 H128 V130 Z" fill="#ff9bc2"/><path d="M72 108 q7 8 14 0 q7 8 14 0 q7 8 14 0 q7 8 14 0" fill="#fff"/><rect x="98" y="94" width="5" height="14" fill="#2f86e0"/><path d="M100 86 q-4 5 0 8 q4 -3 0 -8" fill="#ffb21a"/>`;
    if (i >= 4) p += `<rect x="150" y="150" width="30" height="26" fill="#8a5cf0"/><rect x="163" y="150" width="5" height="26" fill="#ffd23f"/><rect x="20" y="156" width="24" height="20" fill="#2fb36a"/><rect x="30" y="156" width="4" height="20" fill="#ff5a4e"/>`;
    if (i >= 5) p += `<g transform="translate(100 186) scale(.55)">${goz(-6, -60, 4)}</g>` + [[20, 90], [180, 100], [70, 70], [140, 74], [100, 60]].map(([x, y], j) => `<rect x="${x}" y="${y}" width="6" height="4" fill="${["#ff5a4e", "#ffc23a", "#2fb36a", "#2f86e0", "#8a5cf0"][j]}" transform="rotate(${j * 40} ${x} ${y})"/>`).join("");
    return svg(`<rect width="200" height="200" fill="#fff3fb"/><rect y="176" width="200" height="24" fill="#e8c9a8"/>${p}`);
  };

  H.kumkale = (i) => {
    let k = "";
    const kova = (x, y, ters) => ters ? `<path d="M${x - 18} ${y} L${x - 14} ${y - 30} H${x + 14} L${x + 18} ${y} Z" fill="#2f86e0"/>` : `<path d="M${x - 18} ${y - 30} L${x - 14} ${y} H${x + 14} L${x + 18} ${y - 30} Z" fill="#2f86e0"/><ellipse cx="${x}" cy="${y - 30}" rx="18" ry="5" fill="#e0b84a"/><path d="M${x - 18} ${y - 30} Q${x} ${y - 56} ${x + 18} ${y - 30}" stroke="#1f62ab" stroke-width="3" fill="none"/>`;
    if (i === 0) k += kova(100, 160, false);
    if (i === 1) k += kova(100, 160, true);
    if (i >= 2) k += `<path d="M82 160 L86 130 H114 L118 160 Z" fill="#e8c06a"/>${[0, 1, 2].map((j) => `<rect x="${86 + j * 10}" y="124" width="6" height="8" fill="#e8c06a"/>`).join("")}`;
    if (i >= 3) k += `<path d="M126 160 L129 138 H149 L152 160 Z" fill="#e8c06a"/><path d="M48 160 L51 138 H71 L74 160 Z" fill="#e8c06a"/>`;
    if (i >= 4) k += `<path d="M100 124 V104 L114 110 L100 116" fill="#ff5a4e" stroke="#8a5a33" stroke-width="2"/>`;
    if (i >= 5) k += `<path d="M30 168 Q100 180 170 168" stroke="#5ab8ea" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    if (i >= 1) k += kova(170, 172, false).replace(/#2f86e0/g, "#ff5a4e");
    return svg(`<rect width="200" height="200" fill="#bfe8ff"/>${gunes(30, 30, 12)}<rect y="96" width="200" height="30" fill="#3fb0e8"/><rect y="120" width="200" height="80" fill="#f6d98c"/>${k}`);
  };

  const BOLUMLER = [
    ["Çiçek açıyor", "cicek", 3], ["Civciv çıkıyor", "civciv", 3], ["Balon şişiyor", "balon", 3],
    ["Bardak doluyor", "bardak", 3], ["Kardan adam", "kardan3", 3], ["Buz eriyor", "buz", 3],
    ["Elma yiyorum", "elma", 4], ["Kule yapıyorum", "kule", 4], ["Kurbağa büyüyor", "kurbaga", 4], ["Ev çiziyorum", "ev", 4], ["Yağmur ve gökkuşağı", "yagmur", 4], ["Kuş yuvası", "yuva", 4],
    ["Kelebek oluyor", "kelebek", 5], ["Pizza yapıyorum", "pizza", 5], ["Ağaç büyüyor", "agac", 5], ["Kardan adam yapıyorum", "kardan5", 5], ["Gökkuşağı boyuyorum", "gokkusagi", 5], ["Akvaryum hazırlıyorum", "akvaryum", 5],
    ["Kek yapıyorum", "kek", 6], ["Tren geliyor", "tren", 6], ["Robot yapıyorum", "robot", 6], ["Dondurma", "dondurma", 6], ["Bahçe ekiyorum", "bahce", 6], ["Kale yapıyorum", "kale", 6],
    ["Gemi yapıyorum", "gemi", 6], ["Meyve salatası", "salata", 6], ["Kardan adam eriyor", "eriyen", 6], ["Uçurtma yapıyorum", "ucurtma", 6], ["Parti hazırlığı", "parti", 6], ["Kumdan kale", "kumkale", 6],
  ].map(([ad, h, n], i) => ({ ad, n, grup: Uygulama.seviye(i), kartlar: Array.from({ length: n }, (_, i) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(H[h](i))) }));

  // ---------- Oyun ----------
  const stil = `
  .sr { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .sr-seviye { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; padding: 2px 16px 6px; }
  .sr-grup { display: flex; align-items: center; gap: 5px; }
  .sr-grup span { font-family: var(--f-baslik); font-weight: 800; font-size: .9rem; color: var(--murekkep-2); margin-right: 2px; white-space: nowrap; }
  .sr-nokta { width: 18px; height: 18px; border-radius: 50%; border: 3px solid var(--cizgi); background: var(--kagit); padding: 0; cursor: pointer; }
  .sr-nokta.bitti { background: var(--mavi); border-color: var(--mavi); }
  .sr-nokta.simdi { border-color: var(--kirmizi); transform: scale(1.3); }
  .sr-sahne { --k: 140px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 10px; padding: 8px 16px 14px; touch-action: none; user-select: none; -webkit-user-select: none; overflow: hidden; }
  .sr-baslik { font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.2rem, 3vw, 1.7rem); line-height: 1; margin: 0; text-align: center; }
  .sr-program { display: grid; grid-template-columns: repeat(var(--sutun), var(--k)); gap: 14px 26px; padding: 16px 20px; border-radius: 26px; background: var(--kagit); box-shadow: 0 8px 0 rgba(29,40,70,.1); }
  .sr-yuva { position: relative; width: var(--k); height: var(--k); border-radius: 18px; border: 4px dashed var(--cizgi); background: var(--zemin); }
  .sr-yuva::before { content: attr(data-no); position: absolute; z-index: 3; top: -12px; left: -12px; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: var(--mavi); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.25rem; box-shadow: 0 3px 0 rgba(29,40,70,.2); }
  .sr-yuva:not(.ilk)::after { content: ""; position: absolute; left: -22px; top: 50%; width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 13px solid var(--cizgi); transform: translateY(-50%); }
  .sr-yuva.satir-basi::after { display: none; }
  .sr-yuva.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .sr-yuva.calisiyor { border-style: solid; border-color: var(--sari); box-shadow: 0 0 0 6px rgba(255,194,58,.45); }
  .sr-yuva.dogru { border-style: solid; border-color: var(--yesil); }
  .sr-yuva.dogru::before { background: var(--yesil); content: "✓"; }
  .sr-deste { position: relative; display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: 14px; min-height: calc(var(--k) + 26px); padding: 10px; border-radius: 26px; border: 3px dashed var(--cizgi); background: var(--zemin-2); max-width: 100%; box-sizing: border-box; }
  .sr-deste:empty::before { content: "Kartlar burada"; align-self: center; color: var(--murekkep-2); font-weight: 800; opacity: .6; }
  .sr-kart { width: var(--k); height: var(--k); border-radius: 16px; overflow: hidden; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; transition: transform .15s; flex: none; }
  .sr-yuva .sr-kart { position: absolute; inset: -4px; width: auto; height: auto; box-shadow: none; }
  .sr-kart img { display: block; width: 100%; height: 100%; pointer-events: none; -webkit-user-drag: none; }
  .sr-kart.surukleniyor { position: fixed; z-index: 50; cursor: grabbing; transform: scale(1.08) rotate(-3deg); box-shadow: 0 16px 20px rgba(29,40,70,.3); pointer-events: none; transition: none; }
  .sr-kart.zipla { animation: sr-zipla .45s; }
  .sr-kart.salla { animation: sr-salla .5s; }
  @keyframes sr-zipla { 40% { transform: translateY(-14px) scale(1.06); } }
  @keyframes sr-salla { 20%, 60% { transform: translateX(-10px) rotate(-4deg); } 40%, 80% { transform: translateX(10px) rotate(4deg); } }
  .sr-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 28px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.5rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .sr-calistir svg { width: 30px; height: 30px; }
  .sr-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  .sr-calistir:not(:disabled) { animation: sr-nabiz 1.2s ease-in-out infinite; }
  .sr-calistir:not(:disabled):active { transform: translateY(4px); box-shadow: 0 3px 0 #1f8a4f; animation: none; }
  @keyframes sr-nabiz { 50% { transform: scale(1.05); } }
  .sr-tebrik { position: absolute; inset: 0; display: grid; place-items: center; background: rgba(228,243,255,.7); z-index: 20; }
  .sr-tebrik > div { display: grid; justify-items: center; gap: 14px; padding: 22px 30px; border-radius: 28px; background: var(--kagit); box-shadow: 0 10px 0 rgba(29,40,70,.14); text-align: center; animation: sr-gel .5s cubic-bezier(.3,1.5,.5,1) both; }
  @keyframes sr-gel { from { transform: scale(.4); opacity: 0; } }
  .sr-tebrik h3 { margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(2rem, 6vw, 3rem); line-height: 1; color: var(--kirmizi); }
  .sr-tebrik p { margin: 0; font-weight: 800; color: var(--murekkep-2); font-size: 1.1rem; }
  .sr-yildizlar { display: flex; gap: 6px; }
  .sr-yildizlar svg { width: 40px; height: 40px; animation: sr-gel .5s both; }
  .sr-ileri { width: 112px; height: 112px; border-radius: 50%; border: 0; cursor: pointer; background: var(--yesil); color: #fff; box-shadow: 0 8px 0 #1f8a4f; display: grid; place-items: center; animation: sr-nabiz 1.2s ease-in-out infinite; }
  .sr-ileri svg { width: 64px; height: 64px; stroke-width: 3.2; }
  .sr-tebrik .satir { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .sr-konfeti { position: absolute; inset: 0; pointer-events: none; z-index: 21; }
  `;

  const yildiz = (g) => `<svg viewBox="0 0 24 24" style="animation-delay:${g}s"><path d="M12 2l3 6.6 7 .8-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.8z" fill="#ffc23a" stroke="#e59a00" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("sr-stil")) {
      const st = document.createElement("style"); st.id = "sr-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="sr"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="sr-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".sr-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), calisiyor: false, uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); } });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.calisiyor = false; d.uid++;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    // Karıştır: hiçbir kart doğru sırada başlamasın
    let sira;
    do { sira = b.kartlar.map((_, j) => j).sort(() => Math.random() - 0.5); } while (sira.some((v, j) => v === j) && b.n > 1);
    d.sahne.innerHTML = `
      <h2 class="sr-baslik">${b.ad}</h2>
      <div class="sr-program">${b.kartlar.map((_, j) => `<div class="sr-yuva" data-no="${j + 1}" data-yuva="${j}"></div>`).join("")}</div>
      <button class="sr-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button>
      <div class="sr-deste" aria-label="Kartlar">${sira.map((j) => `<div class="sr-kart" data-adim="${j}" role="button" tabindex="0" aria-label="Kart"><img src="${b.kartlar[j]}" alt=""></div>`).join("")}</div>`;
    d.program = d.sahne.querySelector(".sr-program");
    d.deste = d.sahne.querySelector(".sr-deste");
    d.dugme = d.sahne.querySelector(".sr-calistir");
    d.dugme.onclick = calistir;
    d.sahne.querySelectorAll(".sr-kart").forEach(surukle);
    boyutla();
  }

  // Kart boyutunu ekrana göre ayarla; dar ekranda program iki satıra iner
  function boyutla() {
    if (!d || !d.program) return;
    const n = BOLUMLER[d.idx].n;
    const W = d.sahne.clientWidth - 32, Hs = d.sahne.clientHeight;
    if (W < 50 || Hs < 50) return;
    let en = 0, enSutun = n;
    for (const sutun of [n, Math.ceil(n / 2)]) {
      const satir = Math.ceil(n / sutun);
      const kG = (W - 40 - (sutun - 1) * 26) / sutun;
      const kH = (Hs - 40 - 64 - 60 - satir * 14 - 70) / (satir * 2);
      const k = Math.min(kG, kH, 190);
      if (k > en + 8) { en = k; enSutun = sutun; }
    }
    const k = Math.max(56, Math.floor(en));
    d.sahne.style.setProperty("--k", k + "px");
    d.program.style.setProperty("--sutun", enSutun);
    d.deste.style.width = d.program.offsetWidth + "px";
    d.program.querySelectorAll(".sr-yuva").forEach((y, j) => {
      y.classList.toggle("ilk", j === 0);
      y.classList.toggle("satir-basi", j % enSutun === 0);
    });
  }

  function durumGuncelle() {
    const dolu = [...d.program.querySelectorAll(".sr-yuva")].every((y) => y.querySelector(".sr-kart"));
    d.dugme.disabled = !dolu || d.calisiyor;
  }

  function yerlestir(kart, yuva) {
    const eski = kart.parentElement;
    const oradaki = yuva ? yuva.querySelector(".sr-kart") : null;
    if (yuva) {
      if (oradaki && oradaki !== kart) {
        // Yer değiştir: oradaki kart eski yere gider
        if (eski.classList.contains("sr-yuva")) eski.appendChild(oradaki); else d.deste.appendChild(oradaki);
      }
      yuva.appendChild(kart);
    } else {
      d.deste.appendChild(kart);
    }
    d.api.ses.tik();
    durumGuncelle();
  }

  function surukle(kart) {
    let bx, by, kx, ky, hareket = false, aktif = false, hedef = null;
    kart.addEventListener("pointerdown", (e) => {
      if (d.calisiyor || kart.closest(".sr-yuva.dogru")) return;
      e.preventDefault();
      aktif = true; hareket = false;
      const r = kart.getBoundingClientRect();
      bx = e.clientX; by = e.clientY; kx = e.clientX - r.left; ky = e.clientY - r.top;
      kart.dataset.w = r.width;
      kart.setPointerCapture && kart.setPointerCapture(e.pointerId);
    });
    kart.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!hareket && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!hareket) {
        hareket = true;
        yerTut(kart); kart.classList.add("surukleniyor");
        kart.style.width = kart.style.height = kart.dataset.w + "px";
      }
      kart.style.left = e.clientX - kx + "px";
      kart.style.top = e.clientY - ky + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const y = alt && alt.closest(".sr-yuva");
      if (hedef && hedef !== y) hedef.classList.remove("hedef");
      hedef = y && !y.classList.contains("dogru") ? y : null;
      if (hedef) hedef.classList.add("hedef");
    });
    const birak = (e) => {
      if (!aktif) return;
      aktif = false;
      if (hareket) {
        kart.classList.remove("surukleniyor");
        kart.style.left = kart.style.top = kart.style.width = kart.style.height = ""; yerBirak(kart);
        if (hedef) { hedef.classList.remove("hedef"); yerlestir(kart, hedef); }
        else {
          const alt = document.elementFromPoint(e.clientX, e.clientY);
          if (alt && alt.closest(".sr-deste") && kart.parentElement.classList.contains("sr-yuva")) yerlestir(kart, null);
        }
        hedef = null;
      } else dokun();
    };
    // Dokunma: destedeki kart ilk boş kutuya gider, kutudaki kart desteye döner
    const dokun = () => {
      if (d.calisiyor || kart.closest(".sr-yuva.dogru")) return;
      if (kart.parentElement.classList.contains("sr-yuva")) yerlestir(kart, null);
      else {
        const bos = [...d.program.querySelectorAll(".sr-yuva")].find((y) => !y.querySelector(".sr-kart"));
        if (bos) yerlestir(kart, bos);
      }
    };
    kart.addEventListener("pointerup", birak);
    kart.addEventListener("pointercancel", birak);
    kart.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dokun(); } });
  }

  // Programı adım adım çalıştır
  async function calistir() {
    if (d.calisiyor) return;
    d.calisiyor = true; durumGuncelle();
    const benim = d.uid;
    const yuvalar = [...d.program.querySelectorAll(".sr-yuva")];
    for (let j = 0; j < yuvalar.length; j++) {
      const y = yuvalar[j], kart = y.querySelector(".sr-kart");
      if (y.classList.contains("dogru")) continue;
      y.classList.add("calisiyor");
      await bekle(420);
      if (!d || benim !== d.uid) return;
      y.classList.remove("calisiyor");
      if (+kart.dataset.adim === j) {
        y.classList.add("dogru");
        kart.classList.add("zipla");
        d.api.ses.adim(j);
        setTimeout(() => kart.classList.remove("zipla"), 500);
        await bekle(260);
      } else {
        kart.classList.add("salla");
        d.api.ses.hata();
        await bekle(550);
        if (!d || benim !== d.uid) return;
        kart.classList.remove("salla");
        // Hatalı adımdan sonraki kartlar desteye döner
        yuvalar.slice(j).forEach((yy) => { const k = yy.querySelector(".sr-kart"); if (k) d.deste.appendChild(k); });
        d.calisiyor = false; durumGuncelle();
        return;
      }
    }
    if (!d || benim !== d.uid) return;
    bitir();
  }

  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    d.api.ses.kazandi();
    navCiz();
    konfeti(d.sahne);
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    const t = document.createElement("div");
    t.className = "sr-tebrik";
    t.innerHTML = `<div><div class="sr-yildizlar">${yildiz(0.1)}${yildiz(0.25)}${yildiz(0.4)}</div>
      <h3>Aferin!</h3><p>Programın doğru çalıştı${son ? (herkes ? " · Bütün bölümleri bitirdin!" : " · Son bölüm bitti!") : ""}</p>
      ${son
        ? `<div class="satir"><button class="dugme" type="button" data-bastan>${d.api.IKON.tekrar}<span>Baştan</span></button><button class="dugme" type="button" data-ana>${d.api.IKON.ev}<span>Ana sayfa</span></button></div>`
        : `<button class="sr-ileri" type="button" data-ileri aria-label="Sonraki bölüm">${d.api.IKON.ileri}</button>`}</div>`;
    d.sahne.appendChild(t);
    const ileri = t.querySelector("[data-ileri]");
    if (ileri) { ileri.onclick = () => { d.api.ses.tik(); yukle(d.idx + 1); }; ileri.focus({ preventScroll: true }); }
    const bastan = t.querySelector("[data-bastan]");
    if (bastan) bastan.onclick = () => { d.ilerleme.bitti = []; yukle(0); };
    const ana = t.querySelector("[data-ana]");
    if (ana) ana.onclick = d.api.anaSayfa;
  }

  function konfeti(sahne) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas");
    c.className = "sr-konfeti";
    const W = (c.width = sahne.clientWidth), Hh = (c.height = sahne.clientHeight);
    sahne.appendChild(c);
    const g = c.getContext("2d");
    const renk = ["#ff5a4e", "#ffc23a", "#2fb36a", "#2f86e0", "#8a5cf0", "#ff7ab8"];
    const ps = Array.from({ length: 140 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: Hh * 0.45,
      vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 6,
      a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4, s: 6 + Math.random() * 8, c: renk[(Math.random() * renk.length) | 0],
    }));
    const t0 = performance.now();
    (function kare(t) {
      g.clearRect(0, 0, W, Hh);
      ps.forEach((p) => { p.vy += 0.45; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
      if (t - t0 < 3200 && c.isConnected) requestAnimationFrame(kare); else c.remove();
    })(t0);
  }

  window.SIRALA_BOLUMLER = BOLUMLER; // test ve önizleme için

  window.Uygulama.oyunEkle(2, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      const yuva = [...d.sahne.querySelectorAll(".sr-yuva")].find((y) => !y.querySelector(".sr-kart"));
      if (!yuva) return [];
      return [{ el: d.sahne.querySelector(`.sr-deste .sr-kart[data-adim="${yuva.dataset.yuva}"]`), hedef: yuva }, { el: d.sahne.querySelector(".sr-calistir") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const k = BOLUMLER[0].kartlar;
      return `<div class="mini mini-sira" aria-hidden="true">${k.map((s) => `<span style="background-image:url('${s}')"></span>`).join("")}</div>`;
    },
  });
})();
