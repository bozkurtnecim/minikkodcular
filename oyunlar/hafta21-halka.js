/* 21. Hafta: Renkli Halkalar (komut: yürü ve renk kartıyla boya).
   Tahtadaki her halka bir rengi gösterir. Fırçayı ok kartlarıyla halkaya götür,
   halkanın rengindeki kartla o kareyi boya. Kalemliklerin üstünden geçilmez.
   Çok zor bölümlerde bazı halkalar yanlış renge boyanmış gelir: doğru renkle yeniden boya.
   Halka olmayan kareyi boyamak yanlıştır. Bütün halkalar doğru renkte olunca bölüm biter.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "halka";

  // h: B fırça, X kalemlik (geçilmez), . kare; t: halkalar (k kırmızı, m mavi, y yeşil); b: başta boyalı halkalar
  const BOLUMLER = [
    { h: ["B.."], t: [".k."] },
    { h: ["B..", "..."], t: ["...", "m.."] },
    { h: ["B..."], t: ["..y."] },

    { h: ["B..."], t: [".kk."] },
    { h: ["...", "B..", "..."], t: ["y..", "...", "y.."] },
    { h: ["B...", "...."], t: ["....", "..mk"] },

    { h: ["B...", "....", "...."], t: [".m.y", "....", "...."] },
    { h: ["....", "....", ".B.."], t: ["..m.", "..k.", "...."] },
    { h: ["B...", "....", "...."], t: ["....", ".y.m", "...."] },
    { h: [".B..", "....", "...."], t: ["k...", "...y", "...."] },
    { h: ["B..", "...", "...", "..."], t: [".k.", ".k.", "..m", "..."] },
    { h: [".B.", "...", "...", "..."], t: ["y..", ".m.", "..y", "..."] },

    { h: ["....", "...X", "..B.", "X.X."], t: ["....", ".y..", "km..", "...."] },
    { h: ["....", "XX..", "....", ".XB."], t: ["...k", "...y", "....", "...m"] },
    { h: ["X...", "....", ".X..", ".XB."], t: ["...y", "...k", "..m.", "...."] },
    { h: ["B...", ".XX.", "...X", "...."], t: ["..k.", "y...", "m...", "...."] },
    { h: ["X.X.", "..B.", "..X.", "...X", "...."], t: ["....", "m...", "ky..", "..m.", "...."] },
    { h: ["..X.", "...X", "B...", "....", "X.X."], t: ["....", "m...", ".ky.", ".y..", "...."] },

    { h: ["X...", "X...", "X...", "...B"], t: ["....", "....", ".ym.", "km.."], b: ["....", "....", ".m..", "...."] },
    { h: ["...X", ".X..", ".X.B", "....", "X..."], t: ["....", "..km", "..y.", "...y", "...."], b: ["....", "...k", "....", "....", "...."] },
    { h: ["....", "X.X.", "..XB", "...."], t: ["..ym", "...y", ".k..", "...."], b: ["...y", "....", "....", "...."] },
    { h: [".B..", ".X..", "....", "..XX"], t: ["k...", "..y.", "y.m.", "...."], b: ["....", "....", "..k.", "...."] },
    { h: ["....", "....", "..BX", "XX.."], t: ["m...", "yk..", "k...", "...."], b: ["....", "....", "y...", "...."] },
    { h: ["....", "...B", "X...", "..XX"], t: ["y.k.", "..y.", "..m.", "...."], b: ["k...", "....", "....", "...."] },
    { h: ["....", "..BX", "...X", "...X"], t: [".kyk", "....", ".m..", "...."], b: [".m..", "....", "....", "...."] },
    { h: ["....", "XX..", "..B.", "X...", "X..."], t: ["..m.", "....", ".k..", ".my.", "...."], b: ["....", "....", "....", ".k..", "...."] },
    { h: [".X..", "XX..", "....", "..B.", "...X"], t: ["....", "..y.", "..km", "....", "..y."], b: ["....", "....", "...k", "....", "...."] },
    { h: ["....", "....", ".X.X", "...X", "B..X"], t: ["....", ".y..", "..y.", ".k..", ".m.."], b: ["....", "....", "..k.", "....", "...."] },
    { h: ["X...", ".XB.", "...X", "...X", "...."], t: ["....", "....", "..m.", "k.y.", ".k.."], b: ["....", "....", "..k.", "....", "...."] },
    { h: ["..X.", "....", ".X.B", "...X", "...X"], t: ["....", ".k..", "m.k.", "y...", "...."], b: ["....", "....", "y...", "....", "...."] },
  ].map((b, i) => ({ ...b, grup: Uygulama.seviye(i), ek: i < 6 ? 1 : 2 }));

  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = {
    u: { renk: "#2fb36a", koyu: "#1f8a4f", ad: "Yukarı", aci: 0 },
    r: { renk: "#2f86e0", koyu: "#1f62ab", ad: "Sağa", aci: 90 },
    d: { renk: "#ff8a1f", koyu: "#d96a0a", ad: "Aşağı", aci: 180 },
    l: { renk: "#8a5cf0", koyu: "#6a3fcc", ad: "Sola", aci: 270 },
  };
  const RENK = { k: "#ff4f45", m: "#2f7be0", y: "#27b35f" };
  const RENK_AD = { k: "Kırmızı", m: "Mavi", y: "Yeşil" };

  // Bölümü çöz: her halkayı doğru renge boyayan en kısa program (k / m / y = o renge boya)
  function coz(b) {
    const R = b.h.length, C = b.h[0].length;
    let bas;
    b.h.forEach((s, r) => [...s].forEach((ch, c) => { if (ch === "B") bas = [r, c]; }));
    const halkalar = [];
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (b.t[r][c] !== ".") halkalar.push([r, c]);
    const hi = (r, c) => halkalar.findIndex(([a, e]) => a === r && e === c);
    const hedef = halkalar.map(([r, c]) => b.t[r][c]).join("");
    const tuval0 = halkalar.map(([r, c]) => (b.b ? b.b[r][c] : ".")).join("");
    const engel = (r, c) => r < 0 || r >= R || c < 0 || c >= C || b.h[r][c] === "X";
    const kuyruk = [[bas[0], bas[1], tuval0, ""]], gorulen = new Set([`${bas[0]},${bas[1]},${tuval0}`]);
    let enKisa = null;
    while (kuyruk.length && enKisa == null) {
      const [r, c, tv, prog] = kuyruk.shift();
      for (const k of ["u", "r", "d", "l", "k", "m", "y"]) {
        let nr = r, nc = c, ntv = tv;
        if (YON[k]) {
          nr += YON[k][0]; nc += YON[k][1];
          if (engel(nr, nc)) continue;
        } else {
          const j = hi(r, c);
          if (j < 0 || tv[j] === k) continue;
          ntv = tv.slice(0, j) + k + tv.slice(j + 1);
        }
        const key = `${nr},${nc},${ntv}`;
        if (gorulen.has(key)) continue;
        gorulen.add(key);
        if (ntv === hedef) { enKisa = prog + k; break; }
        kuyruk.push([nr, nc, ntv, prog + k]);
      }
    }
    return { R, C, bas, halkalar, engel, enKisa };
  }

  // ---------- Çizimler ----------
  const okSvg = (y) => {
    if (RENK[y]) return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="#fff"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${RENK[y]}" opacity=".25"/><circle cx="50" cy="45" r="27" fill="${RENK[y]}"/><circle cx="40" cy="36" r="8" fill="#fff" opacity=".45"/><path d="M70 66 q8 4 6 14 q-6 -2 -9 -8 z" fill="${RENK[y]}"/></svg>`;
    const o = OK[y];
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${o.renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${o.koyu}" opacity=".5"/><g transform="rotate(${o.aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g></svg>`;
  };
  const firca = (renk) => `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="90" rx="20" ry="6" fill="rgba(0,0,0,.18)"/><rect x="41" y="4" width="18" height="50" rx="9" fill="#ffb347"/><rect x="45" y="8" width="5" height="40" rx="2.5" fill="#ffd08a"/><rect x="38" y="52" width="24" height="14" rx="4" fill="#9aa3b2"/><rect x="38" y="56" width="24" height="3" fill="#c7ccd6"/><path d="M38 66 h24 q2 18 -12 22 q-14 -4 -12 -22 z" fill="${renk ? RENK[renk] : "#efe7da"}" stroke="rgba(0,0,0,.12)" stroke-width="2"/></svg>`;
  const kalemlik = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="40" y="6" width="8" height="50" rx="3" fill="#2f7be0" transform="rotate(-10 44 30)"/><rect x="52" y="4" width="8" height="52" rx="3" fill="#27b35f" transform="rotate(8 56 30)"/><rect x="46" y="10" width="8" height="46" rx="3" fill="#ff4f45"/><path d="M26 44 h48 l-6 48 h-36 z" fill="#c8d3e6"/><path d="M26 44 h48 l-1 8 h-46 z" fill="#aab8d0"/><path d="M34 58 v26 M66 58 v26" stroke="#fff" stroke-width="4" opacity=".5"/></svg>`;
  const halkaSvg = (renk) => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="52" r="32" fill="none" stroke="${RENK[renk]}" stroke-width="9"/><circle cx="50" cy="52" r="32" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 10" opacity=".8"/></svg>`;

  const stil = `
  .hl { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .hl-sahne { --k: 80px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 20px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .hl-sahne.dikey { flex-direction: column; gap: 8px; justify-content: safe center; overflow-y: auto; }
  .hl-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); gap: 5px; padding: 10px; border-radius: 22px; background: #e9894a; box-shadow: 0 8px 0 #c96a30; flex: none; }
  .hl-kare { position: relative; border-radius: 10px; background: #f7f4ef; box-shadow: inset 0 -5px 0 #e2dcd2; }
  .hl-kare > svg { position: absolute; inset: 6%; width: 88%; height: 88%; }
  .hl-kare .boya { position: absolute; inset: 9%; border-radius: 12px 8px 14px 10px; background: var(--b); box-shadow: inset 0 -6px 0 rgba(0,0,0,.14), inset 6px 5px 0 rgba(255,255,255,.2); animation: hl-boya .3s ease-out; }
  .hl-kare .boya.yanlis::after { content: ""; position: absolute; inset: 30%; border-radius: 50%; border: 5px solid rgba(255,255,255,.85); }
  .hl-kare .boya + svg { z-index: 1; }
  .hl-kare.tamam .boya::before { content: ""; position: absolute; right: 9%; top: 9%; width: 24%; height: 24%; border-radius: 50%; background: #fff; opacity: .9; }
  @keyframes hl-boya { from { transform: scale(.3); opacity: .4; } }
  .hl-kare.carpti { animation: hl-yanip .3s 4; }
  @keyframes hl-yanip { 50% { background: #ff8a80; } }
  .hl-firca { position: absolute; left: 10px; top: 10px; width: var(--k); height: var(--k); transition: transform .38s ease-in-out; pointer-events: none; z-index: 3; }
  .hl-firca > div { width: 100%; height: 100%; }
  .hl-firca svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 3px 2px rgba(0,0,0,.2)); }
  .hl-firca.boyuyor > div { animation: hl-dokun .45s ease-in-out; }
  .hl-firca.uzgun > div { animation: hl-salla .5s 2; }
  @keyframes hl-dokun { 40% { transform: translateY(14%) scale(.92, 1.06); } }
  @keyframes hl-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .hl-yan { display: grid; justify-items: center; align-content: center; gap: 10px; min-width: 0; }
  .hl-sahne:not(.dikey) .hl-yan { flex: 1; max-width: 560px; }
  .hl-sepet { display: flex; align-items: center; gap: 4px; padding: 6px 14px; border-radius: 999px; background: var(--kagit); box-shadow: 0 4px 0 rgba(29,40,70,.1); flex-wrap: wrap; justify-content: center; }
  .hl-sepet span { width: 34px; height: 34px; display: block; transition: transform .3s; }
  .hl-sepet svg { width: 100%; height: 100%; display: block; }
  .hl-sepet span.var { transform: scale(1.12); }
  .hl-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: 100%; box-sizing: border-box; }
  .hl-yer { position: relative; width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); flex: none; }
  .hl-yer.dolu { border: 0; background: none; cursor: pointer; }
  .hl-yer svg { display: block; width: 100%; height: 100%; }
  .hl-yer.dolu svg { filter: drop-shadow(0 4px 0 rgba(29,40,70,.14)); }
  .hl-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .hl-yer.hata { animation: hl-salla .5s 2; outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; }
  .hl-yer.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .hl-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .hl-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; }
  .hl-renkler { display: grid; grid-template-columns: repeat(3, var(--p)); gap: 8px; padding: 8px; border-radius: 22px; background: #fbe6d4; }
  .hl-ok { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .hl-ok svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .hl-ok[data-y="u"] { grid-column: 2; grid-row: 1; } .hl-ok[data-y="l"] { grid-column: 1; grid-row: 2; } .hl-ok[data-y="d"] { grid-column: 2; grid-row: 2; } .hl-ok[data-y="r"] { grid-column: 3; grid-row: 2; }
  .hl-ok:active { transform: translateY(3px); }
  .hl-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .hl-tasinan svg { width: 100%; height: 100%; display: block; }
  .hl-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .hl-calistir svg { width: 30px; height: 30px; }
  .hl-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("hl-stil")) {
      const st = document.createElement("style"); st.id = "hl-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="hl"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="hl-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".hl-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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

  const ilkTuval = (b) => b.h.map((s, r) => [...s].map((ch, c) => (b.b ? b.b[r][c] : ".")));

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.cozum = coz(b);
    d.yerSayi = Math.min(14, d.cozum.enKisa.length + b.ek);
    d.program = []; d.yer = null; d.renk = "";
    d.tuval = ilkTuval(b);
    const { R, C, halkalar } = d.cozum;
    let kareler = "";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareler += `<div class="hl-kare" data-r="${r}" data-c="${c}"></div>`;
    d.sahne.innerHTML = `
      <div class="hl-harita" style="--C:${C}">${kareler}<div class="hl-firca"><div></div></div></div>
      <div class="hl-yan">
        <div class="hl-sepet" aria-hidden="true">${halkalar.map(([r, c]) => `<span data-r="${r}" data-c="${c}"></span>`).join("")}</div>
        <div class="hl-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="hl-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. komut"></div>`).join("")}</div>
        <div class="hl-alt">
          <div class="hl-oklar" aria-label="Ok kartları">${["u", "l", "d", "r"].map((y) => `<button class="hl-ok" type="button" data-y="${y}" aria-label="${OK[y].ad}">${okSvg(y)}</button>`).join("")}</div>
          <div class="hl-renkler" aria-label="Renk kartları">${["k", "m", "y"].map((y) => `<button class="hl-ok" type="button" data-y="${y}" aria-label="${RENK_AD[y]} boya">${okSvg(y)}</button>`).join("")}</div>
          <button class="hl-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button>
        </div>
      </div>`;
    d.harita = d.sahne.querySelector(".hl-harita");
    d.fircaEl = d.sahne.querySelector(".hl-firca");
    d.programEl = d.sahne.querySelector(".hl-program");
    d.dugme = d.sahne.querySelector(".hl-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".hl-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".hl-ok").forEach(okTasi);
    haritaCiz();
    fircaCiz();
    programCiz();
    boyutla();
  }

  const kareEl = (r, c) => d.harita.querySelector(`.hl-kare[data-r="${r}"][data-c="${c}"]`);

  function kareCiz(r, c) {
    const b = BOLUMLER[d.idx], el = kareEl(r, c), t = b.t[r][c], v = d.tuval[r][c];
    el.classList.toggle("tamam", t !== "." && v === t);
    el.innerHTML = b.h[r][c] === "X" ? kalemlik
      : (v !== "." ? `<div class="boya${v !== t ? " yanlis" : ""}" style="--b:${RENK[v]}"></div>` : "") + (t !== "." && v !== t ? halkaSvg(t) : "");
    const s = d.sahne.querySelector(`.hl-sepet span[data-r="${r}"][data-c="${c}"]`);
    if (s) { s.classList.toggle("var", v === t); s.innerHTML = v === t ? `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" fill="${RENK[t]}"/><path d="M32 52 l12 12 l24 -26" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` : halkaSvg(t); }
  }

  function haritaCiz() {
    const { R, C } = d.cozum;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareCiz(r, c);
  }

  function fircaCiz() { d.fircaEl.firstElementChild.innerHTML = firca(d.renk); }

  const tamam = () => { const b = BOLUMLER[d.idx]; return d.tuval.every((s, r) => s.every((v, c) => v === b.t[r][c])); };

  function programCiz() {
    d.programEl.querySelectorAll(".hl-yer").forEach((y, j) => {
      y.className = "hl-yer" + (j < d.program.length ? " dolu" : "");
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
      p = Math.max(46, Math.min(72, Math.floor((W - 30) / Math.min(d.yerSayi, 6) - 8), Math.floor((W - 60) / 6 - 10)));
      const satir = Math.ceil(d.yerSayi / Math.max(1, Math.floor((W - 24) / (p + 8))));
      k = Math.min((W - 20) / C - 5, (H - satir * (p + 8) - 24 - (2 * p + 24) - 80 - 100) / R - 5, 110);
    } else {
      p = Math.max(48, Math.min(76, Math.floor((W * 0.42 - 24) / Math.min(d.yerSayi, 6) - 8), Math.floor((W * 0.42 - 50) / 6 - 10)));
      k = Math.min((W * 0.55 - 20) / C - 5, (H - 20) / R - 5, 120);
    }
    d.k = Math.max(36, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px");
    d.sahne.style.setProperty("--p", p + "px");
    const ic = () => [...d.sahne.children].reduce((t, e) => t + e.offsetHeight, 0) + 8;
    for (let n = 0; dikey && n < 40 && (d.k > 36 || p > 40) && ic() > d.sahne.clientHeight - 20; n++) {
      if (d.k > 36) { d.k -= 3; d.sahne.style.setProperty("--k", d.k + "px"); }
      else { p -= 2; d.sahne.style.setProperty("--p", p + "px"); }
    }
    fircaKoy(...(d.yer || d.cozum.bas), false);
  }

  function fircaKoy(r, c, anim = true) {
    d.yer = [r, c];
    d.fircaEl.style.transition = anim ? "" : "none";
    d.fircaEl.style.transform = `translate(${c * (d.k + 5)}px, ${r * (d.k + 5)}px)`;
    if (!anim) { void d.fircaEl.offsetWidth; d.fircaEl.style.transition = ""; }
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
        ucan.className = "hl-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = okSvg(y);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const yer = alt && alt.closest(".hl-yer");
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

  // Programı çalıştır
  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, { engel } = d.cozum;
    const yerler = [...d.programEl.querySelectorAll(".hl-yer")];
    let [r, c] = d.cozum.bas, hata = -1, bitti = false;
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((e, k) => e.classList.toggle("simdi", k === j));
      const k = d.program[j];
      if (YON[k]) {
        const nr = r + YON[k][0], nc = c + YON[k][1];
        if (engel(nr, nc)) {
          fircaKoy(r + YON[k][0] * 0.3, c + YON[k][1] * 0.3);
          await bekle(240);
          if (!d || benim !== d.uid) return;
          fircaKoy(r, c);
          const e = d.harita.querySelector(`.hl-kare[data-r="${nr}"][data-c="${nc}"]`);
          if (e) e.classList.add("carpti");
          hata = j; break;
        }
        r = nr; c = nc;
        fircaKoy(r, c);
        d.api.ses.adim(j % 8);
        await bekle(420);
        if (!d || benim !== d.uid) return;
      } else {
        // Renk kartı: fırça o rengi alır ve durduğu kareyi boyar
        d.renk = k; fircaCiz();
        d.fircaEl.classList.remove("boyuyor"); void d.fircaEl.offsetWidth; d.fircaEl.classList.add("boyuyor");
        await bekle(200);
        if (!d || benim !== d.uid) return;
        d.tuval[r][c] = k;
        kareCiz(r, c);
        const dogru = BOLUMLER[d.idx].t[r][c] === k;
        if (dogru) d.api.ses.yerlesti(); else d.api.ses.ton(300, 0.2);
        await bekle(320);
        if (!d || benim !== d.uid) return;
        d.fircaEl.classList.remove("boyuyor");
      }
      if (tamam()) { bitti = true; break; }
    }
    yerler.forEach((e) => e.classList.remove("simdi"));
    if (bitti) { await bekle(500); if (!d || benim !== d.uid) return; return bitir(); }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.fircaEl.classList.add("uzgun");
    d.api.ses.hata();
    await bekle(1600);
    if (!d || benim !== d.uid) return;
    d.fircaEl.classList.remove("uzgun");
    yerler.forEach((e) => e.classList.remove("hata"));
    d.harita.querySelectorAll(".carpti").forEach((e) => e.classList.remove("carpti"));
    d.tuval = ilkTuval(BOLUMLER[d.idx]); d.renk = "";
    haritaCiz(); fircaCiz();
    fircaKoy(...d.cozum.bas, false);
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
      mesaj: son ? (herkes ? "Bütün halkaları boyadın, minik ressam!" : "Son halkalar da boyandı!") : "Halkalar doğru renkte!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.HALKA_BOLUMLER = BOLUMLER; // test için
  window.HALKA_COZ = coz;

  window.Uygulama.oyunEkle(21, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu(tam) {
      if (!d || !d.cozum || !d.cozum.enKisa) return [];
      const sol = [...d.cozum.enKisa].slice(0, tam ? undefined : 2);
      return [...sol.map((y, j) => ({ el: d.sahne.querySelector(`.hl-ok[data-y="${y}"]`), hedef: d.sahne.querySelector(`.hl-yer[data-j="${j}"]`) })), { el: d.sahne.querySelector(".hl-calistir") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true">${firca("k")}${halkaSvg("m")}${okSvg("k")}${okSvg("y")}</div>`;
    },
  });
})();
