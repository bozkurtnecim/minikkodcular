/* 18. Hafta: Trafik Lambası (koşul: kırmızıysa bekle, yeşilse geç).
   Ok kartlarıyla okul otobüsünü yoldan okula götür. Otobüs ışığın olduğu kareye girer,
   kırmızıysa orada "Bekle" kartı koy: ışıktaki her nokta bir bekleme demek, noktalar bitince ışık yeşile döner.
   Işık kırmızıyken o kareden çıkan otobüs durdurulur, program silinir. Çok zor bölümlerde duraktaki çocukları da topla.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "trafik";

  // Harita: A otobüs, P okul, # yol, . çim, G yeşil ışık, R / 2 / 3 kırmızı ışık (1-3 bekleme), C duraktaki çocuk
  const BOLUMLER = [
    ["....", "A#P.", "...."],
    ["....", "ARP.", "...."],
    [".....", "A#GP.", "....."],

    [".P.", ".#.", ".R.", ".A."],
    ["....", "PR#A", "...."],
    [".....", "AG#RP", "....."],

    ["A#R", "..#", "..P"],
    ["P..", "#..", "2#A"],
    ["A#G#", "...R", "...P"],
    ["A##.", "..R.", "..#P"],
    ["P#2#A", "#...#", "###G#"],
    ["A#R#.", "..#..", "..R#P"],

    ["P#3#A", "#...#", "#####"],
    ["A#R.", "..#.", "..2P"],
    ["P.A", "#.#", "2##"],
    ["A#2", "..#", "P#R"],
    ["P##.A", "#.R.#", "G##2#"],
    ["A#R", "..#", "P#2"],

    ["A#C#R", "....#", "....P"],
    ["C#R#A", "#....", "P...."],
    ["A#C#R#P", "......."],
    ["A#2#C", "#.#.#", "##R#P"],
    ["A#C#2#P"],
    ["A#R#.", "#.C..", "C#2#P"],
    [".....", "#....", "CC#2P", "R#A##"],
    ["......", "....22", "....#.", "A3PCC."],
    ["#A2.#", "C2P#C", "##...", "....."],
    ["#RC..", "#.#..", "3CA#.", "P...."],
    ["......", "....#.", ".R..P.", ".CA2RC"],
    ["...A#.", "...R3P", "...3#C", "....C#"],
  ].map((harita, i) => ({ harita, grup: Uygulama.seviye(i), ek: i < 6 ? 0 : 1 }));

  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = {
    u: { renk: "#2fb36a", koyu: "#1f8a4f", ad: "Yukarı", aci: 0 },
    r: { renk: "#2f86e0", koyu: "#1f62ab", ad: "Sağa", aci: 90 },
    d: { renk: "#ff8a1f", koyu: "#d96a0a", ad: "Aşağı", aci: 180 },
    l: { renk: "#8a5cf0", koyu: "#6a3fcc", ad: "Sola", aci: 270 },
  };
  const isikSayi = (ch) => (ch === "R" ? 1 : ch === "2" ? 2 : ch === "3" ? 3 : 0);

  // Haritayı çöz: bütün çocukları alıp okulda biten en kısa program ("w" = bekle)
  function coz(harita) {
    const R = harita.length, C = harita[0].length;
    let bas, okul; const cocuklar = [], isiklar = [];
    harita.forEach((s, r) => [...s].forEach((ch, c) => {
      if (ch === "A") bas = [r, c];
      if (ch === "P") okul = [r, c];
      if (ch === "C") cocuklar.push([r, c]);
      if (isikSayi(ch)) isiklar.push({ r, c, n: isikSayi(ch) });
    }));
    const yol = (r, c) => r >= 0 && r < R && c >= 0 && c < C && harita[r][c] !== ".";
    const ci = (r, c) => cocuklar.findIndex(([a, b]) => a === r && b === c);
    const ii = (r, c) => isiklar.findIndex((l) => l.r === r && l.c === c);
    const tam = (1 << cocuklar.length) - 1;
    const bas0 = [bas[0], bas[1], 0, isiklar.map((l) => l.n), ""];
    const kuyruk = [bas0], gorulen = new Set([`${bas[0]},${bas[1]},0,${bas0[3]}`]);
    let enKisa = null;
    while (kuyruk.length) {
      const [r, c, m, kalan, prog] = kuyruk.shift();
      if (m === tam && r === okul[0] && c === okul[1]) { enKisa = prog; break; }
      const ekle = (nr, nc, nm, nk, k) => {
        const key = `${nr},${nc},${nm},${nk}`;
        if (gorulen.has(key)) return;
        gorulen.add(key); kuyruk.push([nr, nc, nm, nk, prog + k]);
      };
      // Kırmızı ışığın karesindeyken tek doğru komut beklemektir
      const li = ii(r, c);
      if (li >= 0 && kalan[li] > 0) {
        ekle(r, c, m, kalan.map((n, j) => (j === li ? n - 1 : n)), "w");
        continue;
      }
      for (const [y, [dr, dc]] of Object.entries(YON)) {
        const nr = r + dr, nc = c + dc;
        if (!yol(nr, nc)) continue;
        const k = ci(nr, nc);
        ekle(nr, nc, k >= 0 ? m | (1 << k) : m, kalan, y);
      }
    }
    return { R, C, bas, okul, cocuklar, isiklar, yol, ii, enKisa };
  }

  // ---------- Çizimler ----------
  const okSvg = (y) => {
    if (y === "w") return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="#ffc23a"/><rect x="3" y="80" width="94" height="17" rx="8" fill="#e3a008" opacity=".6"/><path d="M30 16 H70 M30 78 H70" stroke="#5a3d12" stroke-width="8" stroke-linecap="round"/><path d="M34 20 H66 Q66 36 50 47 Q66 58 66 74 H34 Q34 58 50 47 Q34 36 34 20 Z" fill="#fff" stroke="#5a3d12" stroke-width="5" stroke-linejoin="round"/><path d="M41 30 H59 Q57 38 50 42 Q43 38 41 30 Z M50 56 L62 70 H38 Z" fill="#ff8a1f"/></svg>`;
    const o = OK[y];
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${o.renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${o.koyu}" opacity=".5"/><g transform="rotate(${o.aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g></svg>`;
  };
  const otobus = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="26" width="86" height="50" rx="10" fill="#ffc23a"/><path d="M80 26 h2 a10 10 0 0 1 10 10 v20 h-12 z" fill="#ffd96b"/><rect x="14" y="34" width="16" height="16" rx="3" fill="#bfe6ff"/><rect x="36" y="34" width="16" height="16" rx="3" fill="#bfe6ff"/><rect x="58" y="34" width="16" height="16" rx="3" fill="#bfe6ff"/><rect x="80" y="34" width="10" height="16" rx="3" fill="#bfe6ff"/><rect x="6" y="58" width="86" height="6" fill="#e3a008"/><rect x="88" y="64" width="6" height="6" rx="2" fill="#fff6c4"/><circle cx="26" cy="78" r="10" fill="#2b2f3a"/><circle cx="26" cy="78" r="4" fill="#9aa3b2"/><circle cx="72" cy="78" r="10" fill="#2b2f3a"/><circle cx="72" cy="78" r="4" fill="#9aa3b2"/></svg>`;
  const cocuk = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="30" y="50" width="12" height="26" rx="5" fill="#3a6fd8"/><path d="M34 46 h32 v30 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6 z" fill="#ff5a4e"/><rect x="40" y="80" width="8" height="14" rx="3" fill="#2b2f3a"/><rect x="52" y="80" width="8" height="14" rx="3" fill="#2b2f3a"/><circle cx="50" cy="30" r="16" fill="#f5c9a0"/><path d="M34 28 q2 -16 16 -16 q14 0 16 16 q-8 -6 -16 -6 q-8 0 -16 6 z" fill="#5a3d2b"/><circle cx="44" cy="31" r="2.4" fill="#26201f"/><circle cx="56" cy="31" r="2.4" fill="#26201f"/><path d="M44 38 q6 5 12 0" stroke="#a0522d" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`;
  const okulSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4 v18" stroke="#5d6878" stroke-width="3"/><path d="M51 5 h16 l-4 5 l4 5 h-16 z" fill="#ff5a4e"/><path d="M8 46 L50 20 L92 46 Z" fill="#e0533f"/><rect x="14" y="44" width="72" height="50" fill="#fff1d6"/><rect x="42" y="64" width="16" height="30" rx="3" fill="#8a5a33"/><rect x="20" y="54" width="14" height="14" rx="2" fill="#7cc5ff"/><rect x="66" y="54" width="14" height="14" rx="2" fill="#7cc5ff"/><circle cx="50" cy="40" r="7" fill="#ffc23a"/></svg>`;
  const ev = (renk) => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M16 50 L50 20 L84 50 Z" fill="${renk}"/><rect x="24" y="48" width="52" height="40" fill="#fff7e6"/><rect x="44" y="64" width="12" height="24" fill="#8a5a33"/><rect x="30" y="56" width="10" height="10" fill="#7cc5ff"/><rect x="60" y="56" width="10" height="10" fill="#7cc5ff"/></svg>`;
  const agac = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="45" y="58" width="10" height="30" rx="3" fill="#8a5a33"/><circle cx="50" cy="44" r="24" fill="#3f9a3a"/><circle cx="42" cy="36" r="8" fill="#4cae45"/></svg>`;
  const susle = (r, c) => { const k = (r * 7 + c * 13) % 5; return k === 0 ? ev("#e0533f") : k === 2 ? agac : k === 3 ? ev("#2f86e0") : k === 4 ? agac : ""; };
  // Işık direği: kalan bekleme kadar nokta; 0 ise yeşil
  const isikSvg = (kalan) => `<svg class="isik" viewBox="0 0 40 100" aria-hidden="true"><rect x="17" y="54" width="6" height="44" fill="#5d6878"/><rect x="4" y="2" width="32" height="56" rx="9" fill="#2b2f3a"/><circle cx="20" cy="17" r="10" fill="${kalan ? "#ff4b3e" : "#4a2522"}"/><circle cx="20" cy="42" r="10" fill="${kalan ? "#1d3b28" : "#3ee07a"}"/>${kalan ? `<circle cx="20" cy="17" r="13" fill="#ff4b3e" opacity=".25"/>` : `<circle cx="20" cy="42" r="13" fill="#3ee07a" opacity=".25"/>`}</svg>`;
  const noktalar = (kalan) => kalan ? `<div class="tr-nokta">${"<i></i>".repeat(kalan)}</div>` : "";

  const stil = `
  .tr { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .tr-sahne { --k: 80px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 20px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .tr-sahne.dikey { flex-direction: column; gap: 8px; }
  .tr-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 10px; border-radius: 22px; background: #8fd36a; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .tr-kare { position: relative; background: #9be07a; }
  .tr-kare.yol { background: #6b7688; }
  .tr-kare.yol::before { content: ""; position: absolute; left: 50%; top: 50%; width: 18%; height: 6%; margin: -3% -9%; border-radius: 3px; background: rgba(255,255,255,.7); }
  .tr-kare > svg { position: absolute; inset: 8%; width: 84%; height: 84%; }
  .tr-kare > svg.isik { inset: auto; right: 4%; top: 2%; width: 30%; height: 76%; z-index: 2; filter: drop-shadow(0 2px 1px rgba(0,0,0,.3)); }
  .tr-kare.isikli { box-shadow: inset 0 0 0 4px rgba(255,75,62,.65); }
  .tr-kare.isikli.yesil { box-shadow: inset 0 0 0 4px rgba(62,224,122,.75); }
  .tr-nokta { position: absolute; right: 3%; bottom: 3%; display: flex; gap: 3px; padding: 3px 5px; border-radius: 999px; background: #fff; z-index: 2; box-shadow: 0 2px 0 rgba(0,0,0,.2); }
  .tr-nokta i { display: block; width: calc(var(--k) * .1); height: calc(var(--k) * .1); border-radius: 50%; background: #ff4b3e; }
  .tr-kare.iz::after { content: ""; position: absolute; left: 50%; top: 50%; width: 14%; height: 14%; margin: -7%; border-radius: 50%; background: #ffc23a; }
  .tr-kare.carpti { animation: tr-yanip .3s 4; }
  @keyframes tr-yanip { 50% { background: #ff8a80; } }
  .tr-otobus { position: absolute; left: 10px; top: 10px; width: var(--k); height: var(--k); transition: transform .4s ease-in-out; pointer-events: none; z-index: 3; }
  .tr-otobus > div, .tr-otobus > div > div { width: 100%; height: 100%; }
  .tr-otobus svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.25)); }
  .tr-otobus.gidiyor > div > div { animation: tr-titre .2s linear infinite; }
  .tr-otobus.bekliyor > div > div { animation: tr-bekle .5s ease-in-out; }
  .tr-otobus.uzgun > div > div { animation: tr-salla .5s 2; }
  @keyframes tr-titre { 50% { transform: translateY(-2px); } }
  @keyframes tr-bekle { 30%, 70% { transform: scale(.94, 1.04); } }
  @keyframes tr-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .tr-yan { display: grid; justify-items: center; align-content: center; gap: 10px; min-width: 0; }
  .tr-sahne:not(.dikey) .tr-yan { flex: 1; max-width: 560px; }
  .tr-sepet { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: var(--kagit); box-shadow: 0 4px 0 rgba(29,40,70,.1); }
  .tr-sepet svg { width: 38px; height: 38px; display: block; }
  .tr-sepet .h { opacity: .3; filter: grayscale(1); transition: opacity .3s, filter .3s, transform .3s; }
  .tr-sepet .h.var { opacity: 1; filter: none; transform: scale(1.15); }
  .tr-sepet .ok { width: 22px; height: 22px; color: #6b7690; }
  .tr-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: 100%; box-sizing: border-box; }
  .tr-yer { position: relative; width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); flex: none; }
  .tr-yer.dolu { border: 0; background: none; cursor: pointer; }
  .tr-yer svg { display: block; width: 100%; height: 100%; }
  .tr-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .tr-yer.hata { animation: tr-salla .5s 2; outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; }
  .tr-yer.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .tr-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .tr-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; }
  .tr-bekle { display: grid; padding: 8px; border-radius: 22px; background: rgba(255,194,58,.3); }
  .tr-ok { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .tr-ok svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .tr-ok[data-y="u"] { grid-column: 2; grid-row: 1; } .tr-ok[data-y="l"] { grid-column: 1; grid-row: 2; } .tr-ok[data-y="d"] { grid-column: 2; grid-row: 2; } .tr-ok[data-y="r"] { grid-column: 3; grid-row: 2; }
  .tr-ok:active { transform: translateY(3px); }
  .tr-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .tr-tasinan svg { width: 100%; height: 100%; display: block; }
  .tr-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .tr-calistir svg { width: 30px; height: 30px; }
  .tr-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("tr-stil")) {
      const st = document.createElement("style"); st.id = "tr-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="tr"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="tr-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".tr-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.cozum = coz(b.harita);
    d.yerSayi = Math.min(14, d.cozum.enKisa.length + b.ek);
    d.program = []; d.yer = null; d.yon = null;
    const { R, C, cocuklar } = d.cozum;
    let kareler = "";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareler += `<div class="tr-kare" data-r="${r}" data-c="${c}"></div>`;
    d.sahne.innerHTML = `
      <div class="tr-harita" style="--C:${C}">${kareler}<div class="tr-otobus"><div><div>${otobus}</div></div></div></div>
      <div class="tr-yan">
        <div class="tr-sepet" aria-hidden="true">${cocuklar.map(() => `<span class="h">${cocuk}</span>`).join("")}${cocuklar.length ? `<svg class="ok" viewBox="0 0 24 24"><path d="M4 12h13M12 6l6 6-6 6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ""}${okulSvg}</div>
        <div class="tr-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="tr-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. komut"></div>`).join("")}</div>
        <div class="tr-alt">
          <div class="tr-oklar" aria-label="Ok kartları">${["u", "l", "d", "r"].map((y) => `<button class="tr-ok" type="button" data-y="${y}" aria-label="${OK[y].ad}">${okSvg(y)}</button>`).join("")}</div>
          <div class="tr-bekle"><button class="tr-ok" type="button" data-y="w" aria-label="Bekle">${okSvg("w")}</button></div>
          <button class="tr-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button>
        </div>
      </div>`;
    d.harita = d.sahne.querySelector(".tr-harita");
    d.otobusEl = d.sahne.querySelector(".tr-otobus");
    d.programEl = d.sahne.querySelector(".tr-program");
    d.dugme = d.sahne.querySelector(".tr-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".tr-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".tr-ok").forEach(okTasi);
    haritaCiz(new Set(), d.cozum.isiklar.map((l) => l.n));
    programCiz();
    boyutla();
  }

  const kareEl = (r, c) => d.harita.querySelector(`.tr-kare[data-r="${r}"][data-c="${c}"]`);

  function haritaCiz(alinan, kalan) {
    const { R, C, ii } = d.cozum, h = BOLUMLER[d.idx].harita;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const ch = h[r][c], el = kareEl(r, c), li = ii(r, c);
      const iz = el.classList.contains("iz");
      el.className = "tr-kare" + (iz ? " iz" : "") + (ch === "." ? "" : " yol") + (li >= 0 ? " isikli" + (kalan[li] ? "" : " yesil") : ch === "G" ? " isikli yesil" : "");
      el.innerHTML = ch === "." ? susle(r, c)
        : ch === "P" ? okulSvg
        : ch === "C" ? (alinan.has(`${r},${c}`) ? "" : cocuk)
        : ch === "G" ? isikSvg(0)
        : li >= 0 ? isikSvg(kalan[li]) + noktalar(kalan[li]) : "";
    }
    d.sahne.querySelectorAll(".tr-sepet .h").forEach((s, k) => s.classList.toggle("var", k < alinan.size));
  }

  function programCiz() {
    d.programEl.querySelectorAll(".tr-yer").forEach((y, j) => {
      y.className = "tr-yer" + (j < d.program.length ? " dolu" : "");
      y.innerHTML = j < d.program.length ? okSvg(d.program[j]) : "";
    });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }

  function boyutla() {
    if (!d || !d.harita) return;
    const { R, C } = d.cozum;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 20;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.15;
    d.sahne.classList.toggle("dikey", dikey);
    let k, p;
    if (dikey) {
      p = Math.max(46, Math.min(72, Math.floor((W - 30) / Math.min(d.yerSayi, 6) - 8)));
      const satir = Math.ceil(d.yerSayi / Math.max(1, Math.floor((W - 24) / (p + 8))));
      const altGen = 3 * p + 16 + 14 + p + 16 + 14 + 180, altYuk = 2 * p + 8 + (altGen > W ? 80 : 0);
      k = Math.min((W - 20) / C, (H - satir * (p + 8) - 24 - altYuk - 40 - 60) / R, 110);
    } else {
      p = Math.max(48, Math.min(76, Math.floor((W * 0.42 - 24) / Math.min(d.yerSayi, 6) - 8), Math.floor((W * 0.42 - 40) / 4 - 8)));
      k = Math.min((W * 0.55 - 20) / C, (H - 20) / R, 120);
    }
    d.k = Math.max(36, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px");
    d.sahne.style.setProperty("--p", p + "px");
    otobusKoy(...(d.yer || d.cozum.bas), d.yon || "r", false);
  }

  function otobusKoy(r, c, yon, anim = true) {
    d.yer = [r, c]; d.yon = yon;
    d.otobusEl.style.transition = anim ? "" : "none";
    d.otobusEl.style.transform = `translate(${c * d.k}px, ${r * d.k}px)`;
    d.otobusEl.firstElementChild.style.transform = yon === "l" ? "scaleX(-1)" : "";
    if (!anim) { void d.otobusEl.offsetWidth; d.otobusEl.style.transition = ""; }
  }

  function kartKoy(y, j) {
    if (d.calisiyor) return;
    if (j == null || j >= d.program.length) { if (d.program.length >= d.yerSayi) return; d.program.push(y); }
    else d.program[j] = y;
    programCiz();
    d.api.ses.tik();
  }

  function okTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const y = btn.dataset.y;
    btn.addEventListener("pointerdown", (e) => {
      if (d.calisiyor) return;
      e.preventDefault();
      aktif = true; bx = e.clientX; by = e.clientY;
      btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) {
        ucan = document.createElement("div");
        ucan.className = "tr-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = okSvg(y);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const yer = alt && alt.closest(".tr-yer");
      if (hedef && hedef !== yer) hedef.classList.remove("hedef");
      hedef = yer || null; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) {
        ucan.remove(); ucan = null;
        if (hedef) { hedef.classList.remove("hedef"); kartKoy(y, +hedef.dataset.j); }
        hedef = null;
      } else kartKoy(y);
    };
    btn.addEventListener("pointerup", birak);
    btn.addEventListener("pointercancel", birak);
    btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kartKoy(y); } });
  }

  // Programı çalıştır: otobüs komutları sırayla uygular
  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, { bas, okul, cocuklar, isiklar, yol, ii } = d.cozum;
    const yerler = [...d.programEl.querySelectorAll(".tr-yer")];
    const alinan = new Set(), kalan = isiklar.map((l) => l.n);
    let [r, c] = bas, yon = "r", hata = -1, kazandi = false;
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((y, k) => y.classList.toggle("simdi", k === j));
      const komut = d.program[j];
      if (komut === "w") {
        // Bekle: otobüsün durduğu karedeki kırmızı ışığın bir noktası söner
        d.otobusEl.classList.remove("gidiyor", "bekliyor"); void d.otobusEl.offsetWidth;
        d.otobusEl.classList.add("bekliyor");
        d.api.ses.ton(330, 0.25);
        await bekle(550);
        if (!d || benim !== d.uid) return;
        const bu = ii(r, c);
        if (bu >= 0 && kalan[bu] > 0) {
          kalan[bu]--;
          haritaCiz(alinan, kalan);
          if (!kalan[bu]) d.api.ses.yerlesti();
        }
        d.otobusEl.classList.remove("bekliyor");
        await bekle(150);
        if (!d || benim !== d.uid) return;
        continue;
      }
      yon = komut;
      const nr = r + YON[yon][0], nc = c + YON[yon][1], bu = ii(r, c), kirmizi = bu >= 0 && kalan[bu] > 0;
      if (!yol(nr, nc) || kirmizi) {
        // Yol yok ya da otobüs kırmızı ışıkta: biraz gidip durur
        d.otobusEl.classList.add("gidiyor");
        otobusKoy(r + YON[yon][0] * 0.3, c + YON[yon][1] * 0.3, yon);
        await bekle(260);
        if (!d || benim !== d.uid) return;
        otobusKoy(r, c, yon);
        const k = kirmizi ? kareEl(r, c) : kareEl(nr, nc);
        if (k) k.classList.add("carpti");
        hata = j;
        break;
      }
      kareEl(r, c).classList.add("iz");
      r = nr; c = nc;
      d.otobusEl.classList.add("gidiyor");
      otobusKoy(r, c, yon);
      d.api.ses.adim(j % 8);
      await bekle(440);
      if (!d || benim !== d.uid) return;
      if (cocuklar.some(([a, b]) => a === r && b === c) && !alinan.has(`${r},${c}`)) {
        alinan.add(`${r},${c}`);
        haritaCiz(alinan, kalan);
        d.api.ses.yerlesti();
        await bekle(250);
        if (!d || benim !== d.uid) return;
      }
      if (alinan.size === cocuklar.length && r === okul[0] && c === okul[1]) { kazandi = true; break; }
    }
    d.otobusEl.classList.remove("gidiyor", "bekliyor");
    yerler.forEach((y) => y.classList.remove("simdi"));
    if (kazandi) { await bekle(400); if (!d || benim !== d.uid) return; return bitir(); }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.otobusEl.classList.add("uzgun");
    d.api.ses.hata();
    await bekle(1500);
    if (!d || benim !== d.uid) return;
    d.otobusEl.classList.remove("uzgun");
    yerler.forEach((y) => y.classList.remove("hata"));
    haritaCiz(new Set(), isiklar.map((l) => l.n));
    d.harita.querySelectorAll(".iz").forEach((e) => e.classList.remove("iz"));
    otobusKoy(bas[0], bas[1], "r", false);
    // Yanlışta program silinir, çocuk baştan kurar
    d.program = []; d.calisiyor = false; programCiz();
  }

  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Trafik kurallarını öğrendin, minik kodcu!" : "Son programın da çalıştı!") : "Otobüs okula vardı!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.TRAFIK_BOLUMLER = BOLUMLER; // test için
  window.TRAFIK_COZ = coz;

  window.Uygulama.oyunEkle(18, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu(tam) {
      if (!d || !d.cozum || !d.cozum.enKisa) return [];
      const sol = [...d.cozum.enKisa].slice(0, tam ? undefined : 2);
      return [...sol.map((y, j) => ({ el: d.sahne.querySelector(`.tr-ok[data-y="${y}"]`), hedef: d.sahne.querySelector(`.tr-yer[data-j="${j}"]`) })), { el: d.sahne.querySelector(".tr-calistir") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true">${otobus}<svg viewBox="0 0 40 100" style="width:16px">${isikSvg(1).replace(/<svg[^>]*>|<\/svg>/g, "")}</svg>${okSvg("w")}${okulSvg}</div>`;
    },
  });
})();
