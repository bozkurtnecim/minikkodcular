/* 19. Hafta: Roket Gezegene (döngü: tekrar kartları).
   ↻2, ↻3, ↻4 tekrar kutuları programa konur, ok kartı kutunun içine yerleşir: "sağa 3 kere" tek kutuyla yazılır.
   Programda yer az olduğu için tekrar kartı kullanmak gerekir. Roket asteroitlere çarpmadan
   yıldızları toplayıp gezegene varmalı. Çarparsa başa döner, program silinir.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "roket";

  // Harita: A roket, P gezegen, T asteroit, Y yıldız, . boşluk
  const BOLUMLER = [
    ["A..P"],
    ["P", ".", ".", "A"],
    ["A...P"],

    ["A..", "...", "..P"],
    ["....P", "T....", "A...."],
    ["A...", "TTT.", "P..."],

    ["A....", "TTTT.", "....P"],
    ["P...T", "TTT..", "....A"],
    ["A..T.", "...T.", "...TP", "....."],
    ["....P", ".TTTT", "A...."],
    ["A.Y..", "TTTT.", "P...."],
    [".Y..A", ".TTTT", "....P"],

    ["A...T.P", ".TT.T..", "...Y..."],
    ["A....T", "TTTT.T", "Y.....", "TT.TTP"],
    ["P.....", "TTTTT.", "A.Y..."],
    ["A.T...", "..T.T.", "..Y.T.", "TTT.TP"],
    ["Y....A", "TTTT.T", "P....."],
    ["A......", "TTTTTT.", "P.Y...."],

    ["A...Y", "TTTT.", "Y....", ".TTTT", "....P"],
    ["A.....", ".TTTT.", ".Y..T.", ".TT.T.", "P....Y"],
    ["Y....A", ".TTTTT", "......", "TTTTT.", "P....Y"],
    ["A..T..Y", "TT.T.T.", "...Y.T.", ".TTTTT.", "......P"],
    ["A......", "TTTTTT.", "Y.....Y", ".TTTTTT", "......P"],
    ["Y.....A", ".TTTT.T", "...Y...", "TT.TTT.", "P......"],
    ["A....T.", "TTTT.T.", "Y.....Y", "T.TTTTT", "P......"],
    ["A..Y...", ".TTTTT.", ".T...T.", ".T.P.T.", ".TTT.T.", "Y......"],
    ["A.....Y", "TTTTT.T", "......Y", ".TTTTTT", "......P"],
    ["Y..T..A", ".T.T.T.", ".T...T.", ".TTTTT.", "...Y..P"],
    ["A......Y", "TTTTTTT.", "Y.......", ".TTTTTTT", ".......P"],
    ["A..T...Y", ".T.T.TT.", ".T...T..", ".TTT.T.T", "Y....T.P"],
  ].map((harita, i) => ({ harita, grup: Uygulama.seviye(i), ek: i < 12 ? 1 : 2, tekrar: i < 6 ? [2, 3] : [2, 3, 4] }));

  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = {
    u: { renk: "#2fb36a", koyu: "#1f8a4f", ad: "Yukarı", aci: 0 },
    r: { renk: "#2f86e0", koyu: "#1f62ab", ad: "Sağa", aci: 90 },
    d: { renk: "#ff8a1f", koyu: "#d96a0a", ad: "Aşağı", aci: 180 },
    l: { renk: "#8a5cf0", koyu: "#6a3fcc", ad: "Sola", aci: 270 },
  };

  // Haritayı çöz: her komut bir yön ve tekrar sayısı; bütün yıldızları alıp gezegende biten en kısa program
  function coz(harita, tekrar = [2, 3, 4]) {
    const R = harita.length, C = harita[0].length;
    let bas, gezegen; const yildizlar = [];
    harita.forEach((s, r) => [...s].forEach((ch, c) => {
      if (ch === "A") bas = [r, c];
      if (ch === "P") gezegen = [r, c];
      if (ch === "Y") yildizlar.push([r, c]);
    }));
    const engel = (r, c) => r < 0 || r >= R || c < 0 || c >= C || harita[r][c] === "T";
    const tam = (1 << yildizlar.length) - 1;
    const yi = (r, c) => yildizlar.findIndex(([a, b]) => a === r && b === c);
    const sayilar = [1, ...tekrar];
    const kuyruk = [[bas[0], bas[1], 0, []]], gorulen = new Set([`${bas[0]},${bas[1]},0`]);
    while (kuyruk.length) {
      const [r0, c0, m0, prog] = kuyruk.shift();
      for (const [y, [dr, dc]] of Object.entries(YON)) for (const n of sayilar) {
        let r = r0, c = c0, m = m0, tamam = true, vardi = false;
        for (let k = 0; k < n; k++) {
          r += dr; c += dc;
          if (engel(r, c)) { tamam = false; break; }
          const j = yi(r, c); if (j >= 0) m |= 1 << j;
          if (m === tam && r === gezegen[0] && c === gezegen[1]) { vardi = true; break; }
        }
        if (!tamam) continue;
        const yeni = [...prog, [y, n]];
        if (vardi) return { R, C, bas, gezegen, yildizlar, engel, enKisa: yeni };
        const key = `${r},${c},${m}`;
        if (gorulen.has(key)) continue;
        gorulen.add(key); kuyruk.push([r, c, m, yeni]);
      }
    }
    return { R, C, bas, gezegen, yildizlar, engel, enKisa: null };
  }

  // ---------- Çizimler ----------
  const donguIkon = (n, renk = "#fff") => `<path d="M50 22 a24 24 0 1 1 -22 14" stroke="${renk}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M16 26 L32 44 L38 22 Z" fill="${renk}"/><text x="50" y="60" text-anchor="middle" font-family="Baloo 2, Arial Rounded MT Bold, sans-serif" font-weight="800" font-size="32" fill="${renk}">${n}</text>`;
  const okIc = (y) => { const o = OK[y]; return `<rect x="3" y="3" width="94" height="94" rx="20" fill="${o.renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${o.koyu}" opacity=".5"/><g transform="rotate(${o.aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g>`; };
  // n > 1: sarı tekrar kutusu, ok içinde (y boşsa içi kesik çizgili boş yer)
  const okSvg = (y, n = 1) => {
    if (n === 1) return `<svg viewBox="0 0 100 100" aria-hidden="true">${okIc(y)}</svg>`;
    const ic = y ? `<svg x="60" y="11" width="78" height="78" viewBox="0 0 100 100">${okIc(y)}</svg>` : `<rect x="64" y="15" width="70" height="70" rx="14" fill="#fff" stroke="#e3a008" stroke-width="4" stroke-dasharray="10 7"/>`;
    return `<svg viewBox="0 0 145 100" aria-hidden="true"><rect x="3" y="3" width="139" height="94" rx="20" fill="#fff3cf" stroke="#ffc23a" stroke-width="6"/><path d="M3 23 a20 20 0 0 1 20 -20 h33 v94 h-33 a20 20 0 0 1 -20 -20 z" fill="#ffc23a"/><g transform="translate(5 12) scale(.5)">${donguIkon("", "#5a3d12")}</g><text x="30" y="84" text-anchor="middle" font-family="Baloo 2, Arial Rounded MT Bold, sans-serif" font-weight="800" font-size="34" fill="#5a3d12">${n}</text>${ic}</svg>`;
  };
  const tekrarSvg = (n) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="#ffc23a"/><rect x="3" y="80" width="94" height="17" rx="8" fill="#e3a008" opacity=".6"/><g transform="translate(0 -2)">${donguIkon(n, "#5a3d12")}</g><g fill="#5a3d12">${Array.from({ length: n }, (_, k) => `<circle cx="${50 + (k - (n - 1) / 2) * 13}" cy="86" r="4.5"/>`).join("")}</g></svg>`;
  const roket = `<svg viewBox="0 0 100 100" aria-hidden="true"><g class="alev"><path d="M40 74 Q50 100 60 74 Z" fill="#ff8a1f"/><path d="M45 74 Q50 90 55 74 Z" fill="#ffd23f"/></g><path d="M50 6 C66 18 70 40 66 74 H34 C30 40 34 18 50 6 Z" fill="#f2f5fa"/><path d="M50 6 C58 12 63 20 65 30 H35 C37 20 42 12 50 6 Z" fill="#ff5a4e"/><circle cx="50" cy="44" r="9" fill="#7cc5ff" stroke="#5d6878" stroke-width="4"/><path d="M34 54 L20 74 L34 72 Z M66 54 L80 74 L66 72 Z" fill="#ff5a4e"/><rect x="40" y="70" width="20" height="7" rx="2" fill="#5d6878"/></svg>`;
  const gezegenSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="30" fill="#8a5cf0"/><path d="M24 40 Q50 32 76 42 M22 56 Q50 50 78 60" stroke="#b79cff" stroke-width="6" fill="none"/><circle cx="40" cy="42" r="5" fill="#6a3fcc"/><ellipse cx="50" cy="52" rx="46" ry="12" fill="none" stroke="#ffc23a" stroke-width="6" transform="rotate(-16 50 52)"/><path d="M20 30 A30 30 0 0 1 80 30" fill="none"/></svg>`;
  const asteroit = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M20 38 L34 18 L62 16 L82 32 L86 58 L70 82 L40 86 L18 66 Z" fill="#8d7b6a"/><path d="M20 38 L34 18 L62 16 L58 30 L32 40 Z" fill="#a8968a"/><circle cx="58" cy="54" r="9" fill="#6f5f52"/><circle cx="36" cy="64" r="6" fill="#6f5f52"/><circle cx="66" cy="30" r="4" fill="#6f5f52"/></svg>`;
  const yildizSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8 L61 36 L92 38 L68 58 L76 90 L50 72 L24 90 L32 58 L8 38 L39 36 Z" fill="#ffd23f" stroke="#e3a008" stroke-width="4" stroke-linejoin="round"/><circle cx="42" cy="46" r="4" fill="#26201f"/><circle cx="58" cy="46" r="4" fill="#26201f"/><path d="M42 58 q8 7 16 0" stroke="#26201f" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`;

  const stil = `
  .rk { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .rk-sahne { --k: 80px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 20px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .rk-sahne.dikey { flex-direction: column; gap: 8px; justify-content: safe center; overflow-y: auto; }
  .rk-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 10px; border-radius: 22px; flex: none; box-shadow: 0 8px 0 rgba(29,40,70,.18);
    background: radial-gradient(circle at 12% 20%, #fff 0 1.5px, transparent 2px) 0 0 / 90px 90px, radial-gradient(circle at 60% 70%, #cfe3ff 0 1px, transparent 1.5px) 0 0 / 60px 60px, radial-gradient(circle at 80% 30%, #fff 0 1px, transparent 1.5px) 0 0 / 130px 110px, linear-gradient(160deg, #1d2b5c, #2b1f5c); }
  .rk-kare { position: relative; outline: 1px dashed rgba(255,255,255,.12); }
  .rk-kare > svg { position: absolute; inset: 8%; width: 84%; height: 84%; }
  .rk-kare.iz::after { content: ""; position: absolute; left: 50%; top: 50%; width: 12%; height: 12%; margin: -6%; border-radius: 50%; background: rgba(255,210,63,.8); box-shadow: 0 0 8px #ffd23f; }
  .rk-kare.carpti { animation: rk-yanip .3s 4; }
  @keyframes rk-yanip { 50% { background: rgba(255,90,78,.6); } }
  .rk-kare.parlak > svg { animation: rk-parla 1s ease-in-out infinite; }
  @keyframes rk-parla { 50% { transform: scale(1.1); filter: drop-shadow(0 0 10px #ffd23f); } }
  .rk-roket { position: absolute; left: 10px; top: 10px; width: var(--k); height: var(--k); transition: transform .3s linear; pointer-events: none; z-index: 3; }
  .rk-roket > div { width: 100%; height: 100%; transition: transform .25s; }
  .rk-roket svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 0 6px rgba(255,255,255,.35)); }
  .rk-roket .alev { opacity: 0; transition: opacity .2s; }
  .rk-roket.ucuyor .alev { opacity: 1; animation: rk-alev .15s linear infinite; }
  @keyframes rk-alev { 50% { transform: translateY(3px); } }
  .rk-roket.uzgun > div > svg { animation: rk-salla .5s 2; }
  .rk-roket.vardi > div { transition: transform .6s, opacity .6s; transform: scale(.2) rotate(360deg); opacity: 0; }
  @keyframes rk-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .rk-yan { display: grid; justify-items: center; align-content: center; gap: 10px; min-width: 0; }
  .rk-sahne:not(.dikey) .rk-yan { flex: 1; max-width: 560px; }
  .rk-sepet { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: var(--kagit); box-shadow: 0 4px 0 rgba(29,40,70,.1); }
  .rk-sepet svg { width: 38px; height: 38px; display: block; }
  .rk-sepet .h { opacity: .3; filter: grayscale(1); transition: opacity .3s, filter .3s, transform .3s; }
  .rk-sepet .h.var { opacity: 1; filter: none; transform: scale(1.15); }
  .rk-sepet .ok { width: 22px; height: 22px; color: #6b7690; }
  .rk-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: 100%; box-sizing: border-box; }
  .rk-yer { position: relative; width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); flex: none; }
  .rk-yer.dolu { border: 0; background: none; cursor: pointer; }
  .rk-yer.dongu { width: calc(var(--p) * 1.45); }
  .rk-yer svg { display: block; width: 100%; height: 100%; }
  .rk-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .rk-yer.hata { animation: rk-salla .5s 2; outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; }
  .rk-yer.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .rk-yer.dolu.hedef { outline: 5px solid var(--mavi); outline-offset: 2px; border-radius: 16px; }
  .rk-yer .sayac { position: absolute; left: -6px; top: -10px; display: flex; gap: 3px; padding: 3px 6px; border-radius: 999px; background: #fff; box-shadow: 0 2px 0 rgba(0,0,0,.15); }
  .rk-yer .sayac i { width: 9px; height: 9px; border-radius: 50%; background: #d6dbe5; }
  .rk-yer .sayac i.on { background: #ffc23a; }
  .rk-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .rk-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; }
  .rk-tekrar { display: grid; grid-auto-flow: column; grid-template-rows: repeat(2, var(--p)); gap: 8px; padding: 8px; border-radius: 22px; background: rgba(255,194,58,.3); }
  .rk-ok { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .rk-ok svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .rk-ok[data-y="u"] { grid-column: 2; grid-row: 1; } .rk-ok[data-y="l"] { grid-column: 1; grid-row: 2; } .rk-ok[data-y="d"] { grid-column: 2; grid-row: 2; } .rk-ok[data-y="r"] { grid-column: 3; grid-row: 2; }
  .rk-ok:active { transform: translateY(3px); }
  .rk-ok.salla { animation: rk-salla .4s; }
  .rk-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .rk-tasinan svg { width: 100%; height: 100%; display: block; }
  .rk-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .rk-calistir svg { width: 30px; height: 30px; }
  .rk-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("rk-stil")) {
      const st = document.createElement("style"); st.id = "rk-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="rk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="rk-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".rk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    d.cozum = coz(b.harita, b.tekrar);
    d.yerSayi = Math.min(14, d.cozum.enKisa.length + b.ek);
    d.program = []; d.yer = null; d.yon = null;
    const { R, C, yildizlar } = d.cozum;
    let kareler = "";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareler += `<div class="rk-kare" data-r="${r}" data-c="${c}"></div>`;
    d.sahne.innerHTML = `
      <div class="rk-harita" style="--C:${C}">${kareler}<div class="rk-roket"><div>${roket}</div></div></div>
      <div class="rk-yan">
        <div class="rk-sepet" aria-hidden="true">${yildizlar.map(() => `<span class="h">${yildizSvg}</span>`).join("")}${yildizlar.length ? `<svg class="ok" viewBox="0 0 24 24"><path d="M4 12h13M12 6l6 6-6 6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ""}${gezegenSvg}</div>
        <div class="rk-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="rk-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. komut"></div>`).join("")}</div>
        <div class="rk-alt">
          <div class="rk-oklar" aria-label="Ok kartları">${["u", "l", "d", "r"].map((y) => `<button class="rk-ok" type="button" data-y="${y}" aria-label="${OK[y].ad}">${okSvg(y)}</button>`).join("")}</div>
          <div class="rk-tekrar" aria-label="Tekrar kartları">${b.tekrar.map((n) => `<button class="rk-ok" type="button" data-n="${n}" aria-label="${n} kere tekrarla">${tekrarSvg(n)}</button>`).join("")}</div>
          <button class="rk-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button>
        </div>
      </div>`;
    d.harita = d.sahne.querySelector(".rk-harita");
    d.roketEl = d.sahne.querySelector(".rk-roket");
    d.programEl = d.sahne.querySelector(".rk-program");
    d.dugme = d.sahne.querySelector(".rk-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".rk-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".rk-ok").forEach(okTasi);
    haritaCiz(new Set());
    programCiz();
    boyutla();
  }

  const kareEl = (r, c) => d.harita.querySelector(`.rk-kare[data-r="${r}"][data-c="${c}"]`);

  function haritaCiz(alinan) {
    const { R, C, yildizlar } = d.cozum, h = BOLUMLER[d.idx].harita;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const ch = h[r][c], el = kareEl(r, c);
      el.innerHTML = ch === "T" ? asteroit : ch === "P" ? gezegenSvg : ch === "Y" && !alinan.has(`${r},${c}`) ? yildizSvg : "";
      el.classList.toggle("parlak", ch === "P" && alinan.size === yildizlar.length);
    }
    d.sahne.querySelectorAll(".rk-sepet .h").forEach((s, k) => s.classList.toggle("var", k < alinan.size));
  }

  function programCiz() {
    d.programEl.querySelectorAll(".rk-yer").forEach((y, j) => {
      const k = d.program[j];
      y.className = "rk-yer" + (k ? " dolu" : "") + (k && k.n > 1 ? " dongu" : "");
      y.innerHTML = k ? okSvg(k.y, k.n) : "";
    });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }

  function boyutla() {
    if (!d || !d.harita) return;
    const { R, C } = d.cozum, nt = BOLUMLER[d.idx].tekrar.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 20;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.15;
    d.sahne.classList.toggle("dikey", dikey);
    let k, p;
    const sutun = 3 + Math.ceil(nt / 2);
    if (dikey) {
      p = Math.max(46, Math.min(72, Math.floor((W - 30) / Math.min(d.yerSayi, 6) - 8), Math.floor((W - 50) / sutun - 10)));
      const satir = Math.ceil(d.yerSayi / Math.max(1, Math.floor((W - 24) / (p + 8))));
      const altGen = sutun * (p + 8) + 40 + 180, altYuk = 2 * p + 24 + (altGen > W ? 80 : 0);
      k = Math.min((W - 20) / C, (H - satir * (p + 8) - 24 - altYuk - 40 - 100) / R, 110);
    } else {
      p = Math.max(48, Math.min(76, Math.floor((W * 0.42 - 24) / Math.min(d.yerSayi, 6) - 8), Math.floor((W * 0.42 - 40) / sutun - 10)));
      k = Math.min((W * 0.55 - 20) / C, (H - 20) / R, 120);
    }
    d.k = Math.max(36, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px");
    d.sahne.style.setProperty("--p", p + "px");
    // Hâlâ sığmıyorsa haritayı biraz küçült
    const ic = () => [...d.sahne.children].reduce((t, e) => t + e.offsetHeight, 0) + (dikey ? 8 : 0);
    for (let n = 0; dikey && n < 40 && (d.k > 36 || p > 40) && ic() > d.sahne.clientHeight - 20; n++) {
      if (d.k > 36) { d.k -= 3; d.sahne.style.setProperty("--k", d.k + "px"); }
      else { p -= 2; d.sahne.style.setProperty("--p", p + "px"); }
    }
    roketKoy(...(d.yer || d.cozum.bas), d.yon || "r", false);
  }

  function roketKoy(r, c, yon, anim = true) {
    d.yer = [r, c]; d.yon = yon;
    d.roketEl.style.transition = anim ? "" : "none";
    d.roketEl.firstElementChild.style.transition = anim ? "" : "none";
    d.roketEl.style.transform = `translate(${c * d.k}px, ${r * d.k}px)`;
    d.roketEl.firstElementChild.style.transform = `rotate(${OK[yon].aci}deg)`;
    if (!anim) { void d.roketEl.offsetWidth; d.roketEl.style.transition = ""; d.roketEl.firstElementChild.style.transition = ""; }
  }

  // Tekrar kartı: boş tekrar kutusu ekler; bir okun üstüne bırakılırsa o oku kutuya alır,
  // kutunun üstüne bırakılırsa sayısını değiştirir.
  // Ok kartı: sondaki kutunun içi boşsa içine girer, değilse yeni komut olur;
  // bir kutunun ya da okun üstüne bırakılırsa onun okunu değiştirir.
  function kartKoy(kart, j, btn) {
    if (d.calisiyor) return;
    const son = d.program[d.program.length - 1];
    const yerVar = d.program.length < d.yerSayi;
    if (j != null && j < d.program.length) {
      const k = d.program[j];
      d.program[j] = kart.n ? { y: k.y, n: kart.n } : { y: kart.y, n: k.n };
    } else if (!kart.n && son && !son.y) {
      son.y = kart.y;
    } else if (yerVar) {
      d.program.push(kart.n ? { y: null, n: kart.n } : { y: kart.y, n: 1 });
    } else {
      if (btn) { btn.classList.remove("salla"); void btn.offsetWidth; btn.classList.add("salla"); }
      return;
    }
    programCiz();
    d.api.ses.tik();
  }

  function okTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const kart = btn.dataset.n ? { n: +btn.dataset.n } : { y: btn.dataset.y };
    const svg = () => (kart.n ? tekrarSvg(kart.n) : okSvg(kart.y));
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
        ucan.className = "rk-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = svg();
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const yer = alt && alt.closest(".rk-yer");
      if (hedef && hedef !== yer) hedef.classList.remove("hedef");
      hedef = yer || null; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) {
        ucan.remove(); ucan = null;
        if (hedef) { hedef.classList.remove("hedef"); kartKoy(kart, +hedef.dataset.j, btn); }
        hedef = null;
      } else kartKoy(kart, null, btn);
    };
    btn.addEventListener("pointerup", birak);
    btn.addEventListener("pointercancel", birak);
    btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kartKoy(kart, null, btn); } });
  }

  // Programı çalıştır: her komut, tekrar sayısı kadar adım
  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, { bas, gezegen, yildizlar, engel } = d.cozum;
    const yerler = [...d.programEl.querySelectorAll(".rk-yer")];
    const alinan = new Set();
    let [r, c] = bas, hata = -1, vardi = false, adim = 0;
    d.roketEl.classList.add("ucuyor");
    dis: for (let j = 0; j < d.program.length; j++) {
      const { y, n } = d.program[j];
      yerler.forEach((e, k) => e.classList.toggle("simdi", k === j));
      if (!y) { await bekle(300); if (!d || benim !== d.uid) return; hata = j; break; } // içi boş tekrar kutusu
      const [dr, dc] = YON[y];
      const sayac = n > 1 ? document.createElement("div") : null;
      if (sayac) { sayac.className = "sayac"; sayac.innerHTML = "<i></i>".repeat(n); yerler[j].appendChild(sayac); }
      if (d.yon !== y) { roketKoy(r, c, y); await bekle(220); if (!d || benim !== d.uid) return; }
      for (let t = 0; t < n; t++) {
        if (sayac) sayac.children[t].classList.add("on");
        const nr = r + dr, nc = c + dc;
        if (engel(nr, nc)) {
          roketKoy(r + dr * 0.3, c + dc * 0.3, y);
          await bekle(220);
          if (!d || benim !== d.uid) return;
          roketKoy(r, c, y);
          const k = kareEl(nr, nc);
          if (k) k.classList.add("carpti");
          hata = j;
          break dis;
        }
        kareEl(r, c).classList.add("iz");
        r = nr; c = nc;
        roketKoy(r, c, y);
        d.api.ses.adim(adim++ % 8);
        await bekle(340);
        if (!d || benim !== d.uid) return;
        if (yildizlar.some(([a, b]) => a === r && b === c) && !alinan.has(`${r},${c}`)) {
          alinan.add(`${r},${c}`);
          haritaCiz(alinan);
          d.api.ses.yerlesti();
        }
        if (alinan.size === yildizlar.length && r === gezegen[0] && c === gezegen[1]) { vardi = true; break dis; }
      }
      if (sayac) { await bekle(120); sayac.remove(); }
    }
    d.roketEl.classList.remove("ucuyor");
    yerler.forEach((e) => { e.classList.remove("simdi"); const s = e.querySelector(".sayac"); if (s) s.remove(); });
    if (vardi) {
      d.roketEl.classList.add("vardi");
      await bekle(700);
      if (!d || benim !== d.uid) return;
      return bitir();
    }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.roketEl.classList.add("uzgun");
    d.api.ses.hata();
    await bekle(1500);
    if (!d || benim !== d.uid) return;
    d.roketEl.classList.remove("uzgun");
    yerler.forEach((e) => e.classList.remove("hata"));
    d.harita.querySelectorAll(".iz, .carpti").forEach((e) => e.classList.remove("iz", "carpti"));
    haritaCiz(new Set());
    roketKoy(bas[0], bas[1], "r", false);
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
      mesaj: son ? (herkes ? "Bütün gezegenlere uçtun, minik astronot!" : "Son programın da çalıştı!") : "Roket gezegene vardı!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.ROKET_BOLUMLER = BOLUMLER; // test için
  window.ROKET_COZ = coz;

  window.Uygulama.oyunEkle(19, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d || !d.cozum || !d.cozum.enKisa) return [];
      const [y, n] = d.cozum.enKisa[0], yer = d.sahne.querySelector('.rk-yer[data-j="0"]');
      return [...(n > 1 ? [{ el: d.sahne.querySelector(`.rk-ok[data-n="${n}"]`), hedef: yer }] : []), { el: d.sahne.querySelector(`.rk-ok[data-y="${y}"]`), hedef: yer }, { el: d.sahne.querySelector(".rk-calistir") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true">${roket}${okSvg("r", 3)}${gezegenSvg}</div>`;
    },
  });
})();
