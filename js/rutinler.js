/* Günlük rutin çizimleri (200x200 kart). RUTINLER[i] = { ad, kareler: [src, ...] }
   Her karede bir önceki adımın izi kalır; böylece sıra tek ve açıktır. */
(function () {
  const svg = (ic) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">${ic}</svg>`;
  const uri = (s) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
  const TEN = "#ffd9b8", TEN_K = "#e8b48a", SAC = "#7a4a24";

  const oda = (duvar = "#fdf0e0", zemin = "#e8c9a8", ufuk = 150) => `<rect width="200" height="200" fill="${duvar}"/><rect y="${ufuk}" width="200" height="${200 - ufuk}" fill="${zemin}"/>`;
  const pencere = (x, y, w, h, gok = "#bfe8ff", ic = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${gok}" stroke="#fff" stroke-width="6"/>${ic}<path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="#fff" stroke-width="4"/>`;
  const gunes = (x, y, r = 12) => `<circle cx="${x}" cy="${y}" r="${r + 5}" fill="#ffe27a"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffc928"/>`;
  const ay = (x, y, r = 12, arka = "#2c3b78") => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff4b8"/><circle cx="${x + r * 0.45}" cy="${y - r * 0.3}" r="${r}" fill="${arka}"/>`;
  const kopuk = (pts) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#cfe6f7" stroke-width="2"/>`).join("");
  const goz = (x, y, r = 3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#26201f"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.35}" fill="#fff"/>`;
  const kapaliGoz = (x, y) => `<path d="M${x - 4} ${y} q4 3 8 0" stroke="#26201f" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

  // Yakın plan yüz
  function yuz(x, y, r, { agiz = "gulus", gozler = "acik", kopukAgiz = false } = {}) {
    let a = `<circle cx="${x}" cy="${y}" r="${r}" fill="${TEN}"/><path d="M${x - r} ${y - r * 0.1} Q${x - r} ${y - r * 1.15} ${x} ${y - r * 1.05} Q${x + r} ${y - r * 1.15} ${x + r} ${y - r * 0.1} Q${x + r * 0.6} ${y - r * 0.7} ${x} ${y - r * 0.62} Q${x - r * 0.6} ${y - r * 0.7} ${x - r} ${y - r * 0.1} Z" fill="${SAC}"/>`;
    a += gozler === "acik" ? goz(x - r * 0.35, y - r * 0.05, r * 0.11) + goz(x + r * 0.35, y - r * 0.05, r * 0.11) : kapaliGoz(x - r * 0.35, y) + kapaliGoz(x + r * 0.35, y);
    a += `<ellipse cx="${x - r * 0.6}" cy="${y + r * 0.25}" rx="${r * 0.15}" ry="${r * 0.09}" fill="#ff8fa3" opacity=".6"/><ellipse cx="${x + r * 0.6}" cy="${y + r * 0.25}" rx="${r * 0.15}" ry="${r * 0.09}" fill="#ff8fa3" opacity=".6"/>`;
    if (agiz === "gulus") a += `<path d="M${x - r * 0.28} ${y + r * 0.35} q${r * 0.28} ${r * 0.28} ${r * 0.56} 0" stroke="#7a2a2a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    if (agiz === "dis") a += `<path d="M${x - r * 0.38} ${y + r * 0.3} q${r * 0.38} ${r * 0.5} ${r * 0.76} 0 z" fill="#7a2a2a"/><path d="M${x - r * 0.34} ${y + r * 0.32} h${r * 0.68} v${r * 0.1} h-${r * 0.68} z" fill="#fff"/>`;
    if (agiz === "acik") a += `<ellipse cx="${x}" cy="${y + r * 0.42}" rx="${r * 0.16}" ry="${r * 0.2}" fill="#7a2a2a"/>`;
    if (agiz === "esne") a += `<ellipse cx="${x}" cy="${y + r * 0.42}" rx="${r * 0.2}" ry="${r * 0.28}" fill="#7a2a2a"/>`;
    if (kopukAgiz) a += kopuk([[x - r * 0.25, y + r * 0.5, r * 0.12], [x + r * 0.2, y + r * 0.55, r * 0.1], [x, y + r * 0.62, r * 0.09]]);
    return a;
  }

  // Tam boy çocuk; (x, y) ayakların altı. s ölçek.
  function cocuk(x, y, s = 1, o = {}) {
    const g = o.gomlek || "#2f86e0", p = o.pantolon || "#1d2846";
    let c = "";
    const ayak = o.bot ? `<path d="M-16 -6 h12 v8 h-16 z M4 -6 h12 v8 h-12 z" fill="#ffc23a"/><rect x="-15" y="-22" width="11" height="18" fill="#ffc23a"/><rect x="4" y="-22" width="11" height="18" fill="#ffc23a"/>` : `<ellipse cx="-9" cy="-2" rx="9" ry="5" fill="#3a2a2a"/><ellipse cx="10" cy="-2" rx="9" ry="5" fill="#3a2a2a"/>`;
    c += `<rect x="-15" y="-34" width="12" height="32" rx="5" fill="${p}"/><rect x="3" y="-34" width="12" height="32" rx="5" fill="${p}"/>${ayak}`;
    if (o.pijama) c += `<path d="M-15 -28 h12 M-15 -18 h12 M3 -28 h12 M3 -18 h12" stroke="#fff" stroke-width="3" opacity=".6"/>`;
    const govdeRenk = o.yagmurluk ? "#ffc23a" : g;
    const govdeBoy = o.yagmurluk ? 44 : 38;
    c += `<rect x="-19" y="-72" width="38" height="${govdeBoy}" rx="12" fill="${govdeRenk}"/>`;
    if (o.pijama) c += `<path d="M-19 -62 h38 M-19 -50 h38" stroke="#fff" stroke-width="3" opacity=".6"/>`;
    if (o.yagmurluk) c += `<path d="M0 -70 V-30" stroke="#e59a00" stroke-width="2.5"/><circle cx="-3" cy="-56" r="2" fill="#e59a00"/><circle cx="-3" cy="-44" r="2" fill="#e59a00"/>`;
    const kolRenk = o.yagmurluk ? "#ffc23a" : g;
    const sol = o.solKol || "asagi", sag = o.sagKol || "asagi";
    const kol = (yon, isaret) => {
      const sx = isaret * 17;
      if (yon === "yukari") return `<path d="M${sx} -66 L${sx + isaret * 14} -96" stroke="${kolRenk}" stroke-width="10" stroke-linecap="round"/><circle cx="${sx + isaret * 15}" cy="-99" r="6" fill="${TEN}"/>`;
      if (yon === "one") return `<path d="M${sx} -64 L${sx + isaret * 20} -54" stroke="${kolRenk}" stroke-width="10" stroke-linecap="round"/><circle cx="${sx + isaret * 23}" cy="-53" r="6" fill="${TEN}"/>`;
      return `<path d="M${sx} -66 L${sx + isaret * 6} -38" stroke="${kolRenk}" stroke-width="10" stroke-linecap="round"/><circle cx="${sx + isaret * 6}" cy="-35" r="6" fill="${TEN}"/>`;
    };
    c += kol(sol, -1) + kol(sag, 1);
    c += `<rect x="-5" y="-80" width="10" height="10" fill="${TEN}"/>`;
    c += yuz(0, -96, 20, { agiz: o.agiz || "gulus", gozler: o.gozler || "acik" });
    if (o.kapusonlu) c += `<path d="M-23 -92 Q-24 -124 0 -124 Q24 -124 23 -92 Q18 -114 0 -114 Q-18 -114 -23 -92 Z" fill="#ffc23a"/>`;
    if (o.canta) c += `<rect x="16" y="-70" width="14" height="26" rx="5" fill="#ff5a4e"/><path d="M18 -70 q5 -8 10 0" stroke="#c9362d" stroke-width="3" fill="none"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${c}</g>`;
  }

  // İki el (yakın plan)
  function eller(x, y, s = 1, renk = TEN, ust = "") {
    const el = (dx, ayna) => `<g transform="translate(${dx} 0) scale(${ayna} 1)"><ellipse cx="0" cy="0" rx="20" ry="24" fill="${renk}"/><rect x="-18" y="-40" width="8" height="24" rx="4" fill="${renk}"/><rect x="-9" y="-46" width="8" height="30" rx="4" fill="${renk}"/><rect x="0" y="-44" width="8" height="28" rx="4" fill="${renk}"/><rect x="9" y="-38" width="8" height="22" rx="4" fill="${renk}"/><ellipse cx="22" cy="2" rx="7" ry="13" fill="${renk}" transform="rotate(-30 22 2)"/></g>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">${el(-26, -1)}${el(26, 1)}${ust}</g>`;
  }
  const lavabo = (su = false) => `<rect x="20" y="150" width="160" height="50" fill="#dfeaf5"/><path d="M30 140 H170 Q166 176 100 178 Q34 176 30 140 Z" fill="#fff" stroke="#c9d6e4" stroke-width="3"/><rect x="92" y="96" width="16" height="30" rx="4" fill="#b4bfcd"/><path d="M100 100 h30 v10 h-8" stroke="#b4bfcd" stroke-width="10" fill="none" stroke-linecap="round"/><rect x="88" y="86" width="24" height="8" rx="3" fill="#ff5a4e"/>${su ? `<path d="M122 112 Q118 130 122 150" stroke="#5ec4ff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".85"/>` : ""}`;
  const havlu = (x, y, w = 60, h = 70, renk = "#2fb36a") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${renk}"/><path d="M${x} ${y + h - 14} h${w}" stroke="#fff" stroke-width="5" opacity=".6"/>`;
  const yatak = (renk = "#8a5cf0") => `<rect x="20" y="120" width="160" height="40" rx="6" fill="#a8774a"/><rect x="14" y="96" width="14" height="70" rx="4" fill="#8a5a33"/><rect x="172" y="110" width="14" height="56" rx="4" fill="#8a5a33"/><rect x="28" y="108" width="40" height="18" rx="8" fill="#fff"/><rect x="62" y="112" width="112" height="26" rx="8" fill="${renk}"/>`;
  const lamba = (x, y, acik) => `${acik ? `<path d="M${x - 20} ${y + 20} L${x - 40} ${y + 70} L${x + 40} ${y + 70} L${x + 20} ${y + 20} Z" fill="#ffe27a" opacity=".35"/>` : ""}<rect x="${x - 3}" y="${y + 14}" width="6" height="40" fill="#8a5a33"/><path d="M${x - 16} ${y + 16} L${x - 10} ${y} H${x + 10} L${x + 16} ${y + 16} Z" fill="${acik ? "#ffd23f" : "#c9b98a"}"/><rect x="${x - 12}" y="${y + 52}" width="24" height="8" rx="3" fill="#8a5a33"/>`;
  const masa = `<rect x="10" y="130" width="180" height="12" rx="4" fill="#c4935f"/><rect x="24" y="142" width="10" height="58" fill="#a8774a"/><rect x="166" y="142" width="10" height="58" fill="#a8774a"/>`;
  const tabak = (x = 100, y = 120) => `<ellipse cx="${x}" cy="${y}" rx="56" ry="16" fill="#fff" stroke="#d6dde6" stroke-width="3"/><ellipse cx="${x}" cy="${y - 2}" rx="40" ry="10" fill="#f3f6fa"/>`;
  const ekmekDilim = (x, y, w = 70, renk = "#f6dca6") => `<path d="M${x} ${y} h${w} v-22 q0 -16 -16 -18 q-${w / 2 - 16} -10 -${w - 32} 0 q-16 2 -16 18 z" fill="#d9a860"/><path d="M${x + 5} ${y - 4} h${w - 10} v-18 q0 -12 -12 -13 q-${w / 2 - 17} -8 -${w - 34} 0 q-12 1 -12 13 z" fill="${renk}"/>`;
  const kutu = (acik = true) => `<rect x="110" y="110" width="76" height="56" rx="6" fill="#ff8a1f"/><rect x="110" y="110" width="76" height="12" fill="#e06a0a"/>${acik ? `<path d="M110 110 L96 88 L172 88 L186 110 Z" fill="#ffa64d"/>` : `<rect x="106" y="102" width="84" height="14" rx="4" fill="#ffa64d"/>`}`;
  const minikAyi = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-9" cy="-26" r="6" fill="#a86b3c"/><circle cx="9" cy="-26" r="6" fill="#a86b3c"/><circle cx="0" cy="-18" r="12" fill="#a86b3c"/><ellipse cx="0" cy="0" rx="13" ry="12" fill="#a86b3c"/>${goz(-4, -20, 1.8)}${goz(4, -20, 1.8)}<ellipse cx="0" cy="-14" rx="4" ry="3" fill="#e0b48a"/></g>`;
  const minikTop = (x, y, r = 12) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff5a4e"/><path d="M${x - r} ${y} h${r * 2}" stroke="#fff" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#c9362d" stroke-width="2"/>`;
  const minikKup = (x, y, s = 16, renk = "#2f86e0") => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="3" fill="${renk}"/><text x="${x + s / 2}" y="${y + s * 0.75}" font-size="${s * 0.7}" font-family="Arial" font-weight="900" fill="#fff" text-anchor="middle">A</text>`;
  const yagmurDamla = (n, x0 = 0, x1 = 200, y0 = 0, y1 = 120) => Array.from({ length: n }, (_, i) => {
    const x = x0 + ((i * 47) % (x1 - x0)), y = y0 + ((i * 31) % (y1 - y0));
    return `<path d="M${x} ${y} l-4 10" stroke="#5ec4ff" stroke-width="3" stroke-linecap="round"/>`;
  }).join("");
  const semsiye = (x, y) => `<path d="M${x - 40} ${y} Q${x - 38} ${y - 40} ${x} ${y - 42} Q${x + 38} ${y - 40} ${x + 40} ${y} Q${x + 30} ${y - 8} ${x + 20} ${y} Q${x + 10} ${y - 8} ${x} ${y} Q${x - 10} ${y - 8} ${x - 20} ${y} Q${x - 30} ${y - 8} ${x - 40} ${y} Z" fill="#ff5a4e"/><path d="M${x} ${y} V${y + 40}" stroke="#5a3416" stroke-width="3"/>`;

  const RUTINLER = [
    {
      ad: "El yıkama",
      kareler: [
        () => `${oda("#e8f4fd", "#dfeaf5")}${lavabo(false)}${eller(100, 128, 1.25, TEN, `<circle cx="-30" cy="-6" r="4" fill="#8a5a33"/><circle cx="-18" cy="8" r="3" fill="#8a5a33"/><circle cx="24" cy="-2" r="4" fill="#8a5a33"/><circle cx="34" cy="12" r="3" fill="#8a5a33"/>`)}`,
        () => `${oda("#e8f4fd", "#dfeaf5")}${lavabo(true)}${eller(100, 128, 1.25, TEN, `<path d="M-40 -20 q4 6 0 10 M30 -24 q4 6 0 10" stroke="#5ec4ff" stroke-width="3" fill="none"/><circle cx="-24" cy="6" r="3" fill="#8a5a33" opacity=".6"/>`)}`,
        () => `${oda("#e8f4fd", "#dfeaf5")}${lavabo(false)}<rect x="146" y="118" width="22" height="14" rx="5" fill="#ff9bc2"/>${eller(100, 128, 1.25, TEN, kopuk([[-34, -10, 9], [-20, 6, 8], [-40, 14, 7], [26, -8, 9], [38, 8, 8], [18, 14, 7], [0, -4, 7]]))}`,
        () => `${oda("#e8f4fd", "#dfeaf5")}${lavabo(true)}${eller(100, 128, 1.25, TEN, `${kopuk([[-40, 16, 5], [36, 14, 4]])}<path d="M-30 -30 q4 6 0 10 M22 -28 q4 6 0 10 M-4 -34 q4 6 0 10" stroke="#5ec4ff" stroke-width="3" fill="none"/>`)}`,
        () => `${oda("#e8f4fd", "#dfeaf5")}${havlu(40, 50, 120, 110, "#2fb36a")}${eller(100, 110, 0.8)}<path d="M40 120 Q100 90 160 120 L160 160 L40 160 Z" fill="#2fb36a"/><path d="M40 146 h120" stroke="#fff" stroke-width="5" opacity=".6"/><path d="M150 40 l6 -10 l6 10 l-6 10 z M40 40 l5 -8 l5 8 l-5 8 z" fill="#ffd23f"/>`,
      ],
    },
    {
      ad: "Diş fırçalama",
      kareler: [
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}<rect x="30" y="96" width="110" height="14" rx="7" fill="#2f86e0"/><rect x="128" y="84" width="34" height="18" rx="5" fill="#fff" stroke="#c9d6e4" stroke-width="2"/><path d="M60 110 h80" stroke="#1f62ab" stroke-width="2"/><path d="M110 60 l40 -10 l8 14 l-38 14 z" fill="#fff" stroke="#c9d6e4" stroke-width="2"/><path d="M110 60 l-12 6 l10 10 z" fill="#ff5a4e"/><path d="M134 84 q-10 -10 -14 -6" stroke="#9fd8ff" stroke-width="8" stroke-linecap="round" fill="none"/>`,
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}${yuz(100, 96, 58, { agiz: "dis", kopukAgiz: true })}<rect x="120" y="120" width="70" height="12" rx="6" fill="#2f86e0" transform="rotate(-10 120 126)"/><rect x="108" y="118" width="18" height="14" rx="4" fill="#fff" transform="rotate(-10 108 124)"/>`,
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}${yuz(100, 96, 58, { agiz: "acik", gozler: "kapali" })}<path d="M118 112 L154 112 L148 170 L124 170 Z" fill="#9fd8ff" stroke="#5d86a8" stroke-width="3" opacity=".9" transform="rotate(-20 136 140)"/><path d="M126 130 h22" stroke="#5ec4ff" stroke-width="10" transform="rotate(-20 136 140)"/>`,
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}<path d="M70 100 L130 100 L122 170 L78 170 Z" fill="#9fd8ff" stroke="#5d86a8" stroke-width="3"/><rect x="88" y="30" width="10" height="110" rx="5" fill="#2f86e0" transform="rotate(-12 93 85)"/><rect x="84" y="24" width="18" height="22" rx="4" fill="#fff" transform="rotate(-12 93 85)"/>`,
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}${yuz(100, 100, 62, { agiz: "dis" })}<path d="M150 50 l6 -12 l6 12 l-6 12 z M36 60 l5 -9 l5 9 l-5 9 z M120 150 l5 -9 l5 9 l-5 9 z" fill="#ffd23f"/>`,
      ],
    },
    {
      ad: "Uyku vakti",
      kareler: [
        () => `${oda("#ffe8d6", "#e8c9a8")}${pencere(130, 30, 52, 52, "#ff9a5a", gunes(156, 70, 10))}${cocuk(80, 186, 1, { pijama: true, gomlek: "#8a5cf0", pantolon: "#8a5cf0", solKol: "yukari", sagKol: "yukari" })}`,
        () => `${oda("#3a467e", "#5a5280")}${pencere(130, 20, 52, 52, "#2c3b78", ay(150, 44, 10))}${lamba(30, 70, true)}${yatak()}<g transform="translate(110 102)"><circle r="18" fill="${TEN}"/><path d="M-18 -2 Q-18 -22 0 -20 Q18 -22 18 -2 Q10 -14 0 -13 Q-10 -14 -18 -2 Z" fill="${SAC}"/>${goz(-6, 0, 2.5)}${goz(6, 0, 2.5)}</g><rect x="88" y="112" width="44" height="30" rx="3" fill="#ff5a4e"/><path d="M110 112 v30" stroke="#fff" stroke-width="3"/>`,
        () => `${oda("#1f2850", "#34305a")}${pencere(130, 20, 52, 52, "#1b2550", ay(150, 44, 10, "#1b2550"))}${lamba(30, 70, false)}${yatak()}<g transform="translate(110 102)"><circle r="18" fill="${TEN}"/><path d="M-18 -2 Q-18 -22 0 -20 Q18 -22 18 -2 Q10 -14 0 -13 Q-10 -14 -18 -2 Z" fill="${SAC}"/>${goz(-6, 0, 2.5)}${goz(6, 0, 2.5)}</g><rect x="60" y="140" width="30" height="8" rx="2" fill="#ff5a4e"/>`,
        () => `${oda("#1f2850", "#34305a")}${pencere(130, 20, 52, 52, "#1b2550", ay(150, 44, 10, "#1b2550"))}${lamba(30, 70, false)}${yatak()}<g transform="translate(60 102)"><circle r="18" fill="${TEN}"/><path d="M-18 -2 Q-18 -22 0 -20 Q18 -22 18 -2 Q10 -14 0 -13 Q-10 -14 -18 -2 Z" fill="${SAC}"/>${kapaliGoz(-6, 0)}${kapaliGoz(6, 0)}</g><text x="84" y="82" font-family="Arial" font-weight="900" font-size="20" fill="#fff">z</text><text x="98" y="66" font-family="Arial" font-weight="900" font-size="26" fill="#fff">Z</text><rect x="60" y="140" width="30" height="8" rx="2" fill="#ff5a4e"/>`,
      ],
    },
    {
      ad: "Günaydın",
      kareler: [
        () => `${oda("#fff3d6", "#e8c9a8")}${pencere(130, 20, 52, 52, "#bfe8ff", gunes(146, 40, 10))}${yatak("#2f86e0")}<g transform="translate(60 92)"><circle r="18" fill="${TEN}"/><path d="M-18 -2 Q-18 -22 0 -20 Q18 -22 18 -2 Q10 -14 0 -13 Q-10 -14 -18 -2 Z" fill="${SAC}"/>${kapaliGoz(-6, 0)}${kapaliGoz(6, 0)}<ellipse cx="0" cy="9" rx="4" ry="5" fill="#7a2a2a"/></g><path d="M36 100 l-10 -14 M84 100 l10 -14" stroke="${TEN}" stroke-width="8" stroke-linecap="round"/>`,
        () => `${oda("#e8f4fd", "#dfeaf5")}${lavabo(true)}${yuz(100, 70, 40, { gozler: "kapali", agiz: "acik" })}<path d="M68 104 q32 12 64 0" stroke="${TEN_K}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M76 60 q4 6 0 10 M124 60 q4 6 0 10 M100 40 q4 6 0 10" stroke="#5ec4ff" stroke-width="3" fill="none"/>`,
        () => `${oda("#fff3d6", "#e8c9a8")}<rect x="130" y="40" width="54" height="110" rx="4" fill="#c4935f"/><circle cx="174" cy="96" r="3" fill="#8a5a33"/>${cocuk(80, 186, 1, { gomlek: "#ff5a4e", pantolon: "#2f86e0", solKol: "asagi", sagKol: "one" })}`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak(100, 120)}<ellipse cx="90" cy="114" rx="14" ry="6" fill="#ffd23f"/><ellipse cx="90" cy="112" rx="8" ry="3" fill="#ff9a1f"/><circle cx="114" cy="114" r="4" fill="#2b2b2b"/><circle cx="122" cy="116" r="4" fill="#2b2b2b"/><path d="M150 84 h22 l-3 44 h-16 z" fill="#fff" stroke="#c9d6e4" stroke-width="2"/><path d="M152 96 h18 l-2 30 h-14 z" fill="#fff8e8"/>`,
        () => `${oda("#d4efff", "#7ccf6a")}${gunes(170, 30, 12)}<rect x="10" y="40" width="60" height="110" rx="4" fill="#c4935f"/><circle cx="58" cy="96" r="3" fill="#8a5a33"/>${cocuk(110, 186, 1, { gomlek: "#ff5a4e", pantolon: "#2f86e0", canta: true, sagKol: "yukari" })}`,
      ],
    },
    {
      ad: "Yağmurlu gün",
      kareler: [
        () => `${oda("#e3ecf5", "#c9b59a")}${pencere(40, 26, 120, 90, "#8fa0b4", yagmurDamla(14, 46, 154, 32, 108))}${cocuk(100, 196, 0.7, { gomlek: "#2fb36a", agiz: "acik" })}`,
        () => `${oda("#e3ecf5", "#c9b59a")}${pencere(130, 20, 52, 52, "#8fa0b4", yagmurDamla(5, 134, 178, 24, 66))}${cocuk(80, 186, 1, { gomlek: "#2fb36a", bot: true })}`,
        () => `${oda("#e3ecf5", "#c9b59a")}${pencere(130, 20, 52, 52, "#8fa0b4", yagmurDamla(5, 134, 178, 24, 66))}${cocuk(80, 186, 1, { bot: true, yagmurluk: true, kapusonlu: true })}`,
        () => `<rect width="200" height="200" fill="#a9b8c9"/><rect y="160" width="200" height="40" fill="#6dbd4f"/>${yagmurDamla(18)}${semsiye(100, 56)}${cocuk(100, 190, 0.95, { bot: true, yagmurluk: true, kapusonlu: true, sagKol: "yukari" })}`,
        () => `<rect width="200" height="200" fill="#bcdcf2"/><rect y="160" width="200" height="40" fill="#6dbd4f"/>${gunes(170, 30)}<ellipse cx="100" cy="180" rx="70" ry="12" fill="#5ab8ea"/><path d="M40 170 l-10 -14 M60 166 l-4 -16 M140 166 l4 -16 M160 170 l10 -14" stroke="#5ab8ea" stroke-width="5" stroke-linecap="round"/>${cocuk(100, 160, 0.95, { bot: true, yagmurluk: true, kapusonlu: true, solKol: "yukari", sagKol: "yukari", agiz: "dis" })}`,
      ],
    },
    {
      ad: "Resim yapıyorum",
      kareler: [
        () => `${oda("#fdf0e0", "#e8c9a8")}${masa}<rect x="44" y="58" width="112" height="76" fill="#fff" stroke="#d6dde6" stroke-width="2" transform="skewX(-6)"/><rect x="140" y="110" width="40" height="8" rx="4" fill="#2f86e0" transform="rotate(-30 160 114)"/>`,
        () => `${oda("#fdf0e0", "#e8c9a8")}${masa}<rect x="44" y="58" width="112" height="76" fill="#fff" stroke="#d6dde6" stroke-width="2" transform="skewX(-6)"/><g transform="skewX(-6)" fill="none" stroke="#2b2b3a" stroke-width="2.5"><circle cx="86" cy="82" r="10"/><path d="M110 112 l20 -24 l20 24 z M60 120 h90"/></g><rect x="140" y="110" width="40" height="8" rx="4" fill="#2f86e0" transform="rotate(-30 160 114)"/>`,
        () => `${oda("#fdf0e0", "#e8c9a8")}${masa}<rect x="44" y="58" width="112" height="76" fill="#fff" stroke="#d6dde6" stroke-width="2" transform="skewX(-6)"/><g transform="skewX(-6)" stroke="#2b2b3a" stroke-width="2.5"><circle cx="86" cy="82" r="10" fill="#ffc23a"/><path d="M110 112 l20 -24 l20 24 z" fill="#ff5a4e"/><path d="M60 120 h90" fill="none"/><rect x="60" y="112" width="90" height="8" fill="#2fb36a" stroke="none"/></g>${[["#ff5a4e", 20], ["#ffc23a", 34], ["#2fb36a", 48]].map(([c, x]) => `<rect x="${x}" y="108" width="8" height="22" rx="3" fill="${c}"/>`).join("")}`,
        () => `${oda("#fdf0e0", "#e8c9a8")}<rect x="50" y="24" width="100" height="76" fill="#fff" stroke="#c4935f" stroke-width="6"/><circle cx="80" cy="50" r="10" fill="#ffc23a"/><path d="M106 80 l18 -22 l18 22 z" fill="#ff5a4e"/><rect x="58" y="82" width="86" height="8" fill="#2fb36a"/><circle cx="100" cy="20" r="4" fill="#8a5a33"/>${cocuk(60, 196, 0.8, { gomlek: "#ffc23a", sagKol: "yukari" })}`,
      ],
    },
    {
      ad: "Kahvaltı",
      kareler: [
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}${ekmekDilim(66, 118, 54)}`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}${ekmekDilim(56, 118, 50)}<rect x="110" y="104" width="26" height="14" rx="2" fill="#fff8d0" stroke="#e6dcae"/><circle cx="144" cy="112" r="5" fill="#2b2b2b"/><circle cx="132" cy="122" r="5" fill="#2b2b2b"/>`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}${ekmekDilim(56, 118, 50)}<rect x="110" y="104" width="26" height="14" rx="2" fill="#fff8d0" stroke="#e6dcae"/><circle cx="144" cy="112" r="5" fill="#2b2b2b"/><circle cx="132" cy="122" r="5" fill="#2b2b2b"/><path d="M160 76 h24 l-3 50 h-18 z" fill="#fff" stroke="#c9d6e4" stroke-width="2"/><path d="M162 88 h20 l-2 36 h-16 z" fill="#fff8e8"/>`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}<path d="M66 118 h24 v-14 q-8 -6 -24 0 z" fill="#f6dca6"/><circle cx="110" cy="118" r="2" fill="#d9a860"/><circle cx="120" cy="114" r="2" fill="#d9a860"/><circle cx="100" cy="112" r="2" fill="#d9a860"/><path d="M160 76 h24 l-3 50 h-18 z" fill="#fff" stroke="#c9d6e4" stroke-width="2"/><path d="M162 116 h20 l-1 8 h-18 z" fill="#fff8e8"/>${yuz(40, 70, 26, { agiz: "dis" })}`,
      ],
    },
    {
      ad: "Oyuncakları topla",
      kareler: [
        () => `${oda("#eaf7e4", "#e8c9a8")}${kutu(true)}${minikAyi(40, 170)}${minikTop(84, 176)}${minikKup(52, 140, 18)}${minikKup(150, 172, 16, "#2fb36a")}`,
        () => `${oda("#eaf7e4", "#e8c9a8")}${kutu(true)}${minikAyi(148, 108, 0.9)}${minikTop(84, 176)}${minikKup(52, 140, 18)}${minikKup(150, 172, 16, "#2fb36a")}`,
        () => `${oda("#eaf7e4", "#e8c9a8")}${kutu(true)}${minikAyi(148, 108, 0.9)}${minikTop(126, 104, 10)}${minikKup(52, 140, 18)}${minikKup(150, 172, 16, "#2fb36a")}`,
        () => `${oda("#eaf7e4", "#e8c9a8")}${kutu(true)}${minikAyi(148, 108, 0.9)}${minikTop(126, 104, 10)}<rect x="160" y="94" width="14" height="14" rx="3" fill="#2f86e0"/><rect x="134" y="96" width="12" height="12" rx="3" fill="#2fb36a"/>`,
        () => `${oda("#eaf7e4", "#e8c9a8")}${kutu(false)}${cocuk(60, 190, 0.9, { gomlek: "#ff8a1f", solKol: "yukari", sagKol: "yukari", agiz: "dis" })}<path d="M20 40 l5 -9 l5 9 l-5 9 z M150 40 l6 -10 l6 10 l-6 10 z" fill="#ffd23f"/>`,
      ],
    },
    {
      ad: "Sandviç",
      kareler: [
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}${ekmekDilim(64, 118, 72)}`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}${ekmekDilim(64, 118, 72, "#ffe58a")}<rect x="150" y="104" width="34" height="6" rx="3" fill="#b4bfcd"/><path d="M150 104 l-14 4 l14 4 z" fill="#ffe58a"/>`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}${ekmekDilim(64, 118, 72, "#ffe58a")}<path d="M60 102 h80 l-6 10 h-68 z" fill="#ffd23f"/><circle cx="80" cy="106" r="2" fill="#f2b81a"/><circle cx="110" cy="105" r="2" fill="#f2b81a"/>`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}${ekmekDilim(64, 118, 72, "#ffe58a")}<path d="M60 102 h80 l-6 10 h-68 z" fill="#ffd23f"/><ellipse cx="82" cy="98" rx="14" ry="5" fill="#ff4d4d"/><ellipse cx="114" cy="98" rx="14" ry="5" fill="#ff4d4d"/><path d="M60 94 q20 -6 40 0 q20 -6 40 0" stroke="#4fb04a" stroke-width="5" fill="none"/>`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}<path d="M60 112 h80 v-10 h-80 z" fill="#ffd23f"/><path d="M58 102 q20 -6 42 0 q20 -6 42 0" stroke="#4fb04a" stroke-width="5" fill="none"/>${ekmekDilim(64, 100, 72)}`,
        () => `${oda("#fff3d6", "#e8c9a8")}${masa}${tabak()}<g transform="rotate(-10 70 110)"><path d="M40 114 h36 v-10 h-36 z" fill="#ffd23f"/><path d="M40 104 q18 -6 36 0" stroke="#4fb04a" stroke-width="5" fill="none"/>${ekmekDilim(40, 102, 36)}</g><g transform="rotate(10 130 110)"><path d="M124 114 h36 v-10 h-36 z" fill="#ffd23f"/><path d="M124 104 q18 -6 36 0" stroke="#4fb04a" stroke-width="5" fill="none"/>${ekmekDilim(124, 102, 36)}</g>`,
      ],
    },
    {
      ad: "Banyo",
      kareler: [
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}<path d="M20 100 H180 V130 Q180 170 140 170 H60 Q20 170 20 130 Z" fill="#fff" stroke="#c9d6e4" stroke-width="4"/><rect x="150" y="70" width="10" height="30" fill="#b4bfcd"/><path d="M155 72 h-18 v8" stroke="#b4bfcd" stroke-width="8" fill="none"/>`,
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}<path d="M20 100 H180 V130 Q180 170 140 170 H60 Q20 170 20 130 Z" fill="#fff" stroke="#c9d6e4" stroke-width="4"/><path d="M26 112 H174 V130 Q174 164 140 164 H60 Q26 164 26 130 Z" fill="#7fd0ff"/><rect x="150" y="70" width="10" height="30" fill="#b4bfcd"/><path d="M155 72 h-18 v8" stroke="#b4bfcd" stroke-width="8" fill="none"/><path d="M137 82 v26" stroke="#5ec4ff" stroke-width="6"/>`,
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}<path d="M20 100 H180 V130 Q180 170 140 170 H60 Q20 170 20 130 Z" fill="#fff" stroke="#c9d6e4" stroke-width="4"/><path d="M26 112 H174 V130 Q174 164 140 164 H60 Q26 164 26 130 Z" fill="#7fd0ff"/>${kopuk([[44, 106, 12], [64, 100, 14], [88, 104, 12], [112, 98, 14], [136, 104, 12], [158, 102, 11], [76, 88, 8], [124, 86, 9]])}<rect x="150" y="70" width="10" height="30" fill="#b4bfcd"/>`,
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}<path d="M20 100 H180 V130 Q180 170 140 170 H60 Q20 170 20 130 Z" fill="#fff" stroke="#c9d6e4" stroke-width="4"/><path d="M26 112 H174 V130 Q174 164 140 164 H60 Q26 164 26 130 Z" fill="#7fd0ff"/>${yuz(96, 80, 26, { agiz: "dis" })}${kopuk([[44, 106, 12], [64, 100, 14], [88, 108, 12], [112, 104, 14], [136, 104, 12], [158, 102, 11], [96, 52, 8], [110, 48, 6]])}<g transform="translate(150 96) scale(.7)"><ellipse cx="0" cy="0" rx="16" ry="12" fill="#ffd23f"/><circle cx="10" cy="-10" r="9" fill="#ffd23f"/><path d="M18 -10 l8 2 l-8 3 z" fill="#ff8a1f"/></g>`,
        () => `${oda("#e8f4fd", "#dfeaf5", 170)}<path d="M50 90 Q100 70 150 90 L160 190 H40 Z" fill="#ff7ab8"/><path d="M50 130 h104" stroke="#fff" stroke-width="5" opacity=".6"/>${yuz(100, 70, 28)}<path d="M72 60 Q72 34 100 34 Q128 34 128 60 Q118 46 100 46 Q82 46 72 60 Z" fill="#ff7ab8"/><path d="M150 40 l6 -10 l6 10 l-6 10 z M40 50 l5 -8 l5 8 l-5 8 z" fill="#ffd23f"/>`,
      ],
    },
  ];

  window.RUTINLER = RUTINLER.map((r) => ({ ad: r.ad, kareler: r.kareler.map((f) => uri(svg(f()))) }));
})();
