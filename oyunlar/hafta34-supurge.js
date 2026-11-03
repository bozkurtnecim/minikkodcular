/* Robot Süpürge (yön kavramı: robotun gözünden düşünmek; ileri git, geri git, sağa dön, sola dön).
   Yuvarlak süpürge robotu odada bir yöne bakıyor (gözleri ve ön ışığı önünü gösterir). "İleri" baktığı yöne,
   "geri" sırtının olduğu yöne bir kare götürür; dönme kartları yerinde çevirir. Bütün tozları süpür.
   Eşyaya ya da duvara çarparsa başa döner, program silinir. 30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "supurge";
  const YON = [[-1, 0], [0, 1], [1, 0], [0, -1]]; // 0 yukarı, 1 sağ, 2 aşağı, 3 sol
  const KART = {
    i: { ad: "İleri git", renk: "#2fb36a", koyu: "#1f8a4f", ic: `<path d="M50 14 L80 48 H62 V82 H38 V48 H20 Z" fill="#fff"/>` },
    g: { ad: "Geri git", renk: "#ff8a1f", koyu: "#c9650c", ic: `<path d="M50 86 L80 52 H62 V18 H38 V52 H20 Z" fill="#fff"/>` },
    s: { ad: "Sağa dön", renk: "#2f86e0", koyu: "#1f62ab", ic: `<path d="M30 82 V52 a22 22 0 0 1 22 -22 H62" stroke="#fff" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M58 12 L84 30 L58 48 Z" fill="#fff"/>` },
    l: { ad: "Sola dön", renk: "#8a5cf0", koyu: "#6a3fcc", ic: `<path d="M70 82 V52 a22 22 0 0 0 -22 -22 H38" stroke="#fff" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M42 12 L16 30 L42 48 Z" fill="#fff"/>` },
  };
  const kartSvg = (k) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${KART[k].renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${KART[k].koyu}" opacity=".5"/>${KART[k].ic}</svg>`;
  // Yukarı bakan süpürge robotu: önünde gözler ve sarı ışık, arkasında tutamak
  const robot = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="52" r="40" fill="#5b8def"/><circle cx="50" cy="52" r="40" fill="none" stroke="#2f5fb8" stroke-width="5"/><path d="M22 30 A40 40 0 0 1 78 30 L70 36 A30 30 0 0 0 30 36 Z" fill="#ffd34d"/><circle cx="38" cy="46" r="9" fill="#fff"/><circle cx="62" cy="46" r="9" fill="#fff"/><circle cx="38" cy="43" r="4.5" fill="#1d2846"/><circle cx="62" cy="43" r="4.5" fill="#1d2846"/><path d="M40 64 q10 8 20 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="38" y="80" width="24" height="7" rx="3" fill="#2f5fb8"/></svg>`;
  const toz = (temiz) => temiz
    ? `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 22 l6 18 18 6 -18 6 -6 18 -6 -18 -18 -6 18 -6 z" fill="#ffd34d"/><path d="M76 66 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#ffe58a"/></svg>`
    : `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 40 q-14 6 -6 20 q-2 16 16 16 q8 12 22 4 q16 2 16 -14 q12 -10 0 -22 q-2 -16 -18 -14 q-10 -10 -22 0 q-12 -2 -8 10 z" fill="#a8825a" opacity=".85"/><circle cx="40" cy="50" r="4" fill="#7d5c3c"/><circle cx="60" cy="60" r="5" fill="#7d5c3c"/><circle cx="58" cy="40" r="3" fill="#7d5c3c"/></svg>`;
  const ESYA = [
    `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="30" y="56" width="40" height="34" rx="6" fill="#c9653a"/><path d="M50 58 C30 50 22 30 34 18 C40 30 46 40 50 56 C54 40 60 30 66 18 C78 30 70 50 50 58" fill="#2fb36a"/></svg>`,
    `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="10" y="40" width="80" height="44" rx="12" fill="#e0533f"/><rect x="20" y="22" width="60" height="30" rx="10" fill="#f06a55"/><rect x="6" y="44" width="16" height="36" rx="7" fill="#c9412f"/><rect x="78" y="44" width="16" height="36" rx="7" fill="#c9412f"/></svg>`,
    `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="14" y="20" width="72" height="62" rx="6" fill="#c98a4a"/><path d="M14 40 h72 M14 60 h72" stroke="#8a5a33" stroke-width="4"/><circle cx="50" cy="30" r="4" fill="#8a5a33"/><circle cx="50" cy="50" r="4" fill="#8a5a33"/><circle cx="50" cy="70" r="4" fill="#8a5a33"/></svg>`,
    `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="34" fill="#ffc23a"/><path d="M26 30 L74 70 M74 30 L26 70" stroke="#e3a008" stroke-width="5"/><circle cx="50" cy="50" r="34" fill="none" stroke="#e3a008" stroke-width="5"/></svg>`,
  ];

  // Oda: A başlangıç, T toz, # eşya, . boş zemin
  function coz(b, kartlar = "igsl") {
    const R = b.h.length, C = b.h[0].length;
    let bas; const evler = [];
    b.h.forEach((s, r) => [...s].forEach((ch, c) => { if (ch === "A") bas = [r, c]; if (ch === "T") evler.push([r, c]); }));
    const yol = (r, c) => r >= 0 && r < R && c >= 0 && c < C && b.h[r][c] !== "#";
    const tam = (1 << evler.length) - 1, ei = (r, c) => evler.findIndex(([a, e]) => a === r && e === c);
    const gor = new Set([`${bas},${b.yon},0`]), q = [[bas[0], bas[1], b.yon, 0, ""]];
    while (q.length) {
      const [r, c, y, m, p] = q.shift();
      for (const k of kartlar) {
        let nr = r, nc = c, ny = y, nm = m;
        if (k === "i" || k === "g") { const yy = k === "i" ? y : (y + 2) % 4; nr += YON[yy][0]; nc += YON[yy][1]; if (!yol(nr, nc)) continue; const j = ei(nr, nc); if (j >= 0) nm |= 1 << j; }
        else ny = (y + (k === "s" ? 1 : 3)) % 4;
        if (nm === tam) return { R, C, bas, evler, yol, enKisa: p + k };
        const key = `${nr},${nc},${ny},${nm}`;
        if (gor.has(key)) continue;
        gor.add(key); q.push([nr, nc, ny, nm, p + k]);
      }
    }
    return { R, C, bas, evler, yol, enKisa: null };
  }

  // Bölüm üretimi: rastgele eşyalı oda, başlangıç yönü ve tozlar; en kısa program uzunluğu aralıkta
  const rnd = (() => { let s = 3434; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const sec = (a) => a[Math.floor(rnd() * a.length)];
  function uret(R, C, nEv, min, max, minDonus, geri) {
    for (let deneme = 0; deneme < 40000; deneme++) {
      const g = Array.from({ length: R }, () => Array.from({ length: C }, () => (rnd() < 0.28 ? "#" : ".")));
      const bos = []; g.forEach((s, r) => s.forEach((ch, c) => ch === "." && bos.push([r, c])));
      if (bos.length < nEv + 3) continue;
      // Boş kareler birbirine bağlı olsun
      const gor = new Set([String(bos[0])]), q = [bos[0]];
      while (q.length) { const [r, c] = q.pop(); for (const [dr, dc] of YON) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nr < R && nc >= 0 && nc < C && g[nr][nc] === "." && !gor.has(`${nr},${nc}`)) { gor.add(`${nr},${nc}`); q.push([nr, nc]); } } }
      if (gor.size !== bos.length) continue;
      const secilen = []; while (secilen.length < nEv + 1) { const p = sec(bos); if (!secilen.includes(p)) secilen.push(p); }
      const [A, ...E] = secilen; g[A[0]][A[1]] = "A"; E.forEach(([a, b]) => (g[a][b] = "T"));
      const b = { h: g.map((x) => x.join("")), yon: Math.floor(rnd() * 4) };
      const z = coz(b);
      if (!z.enKisa || z.enKisa.length < min || z.enKisa.length > max) continue;
      if ((z.enKisa.match(/[sl]/g) || []).length < minDonus) continue;
      // Geri kartı gerçekten işe yarasın: onsuz çözüm daha uzun
      if (geri) { const z2 = coz(b, "isl"); if (!z.enKisa.includes("g") || (z2.enKisa && z2.enKisa.length <= z.enKisa.length)) continue; }
      b.esya = g.map((s) => s.map(() => Math.floor(rnd() * ESYA.length)));
      return b;
    }
    throw new Error("bölüm kurulamadı");
  }
  const T = [
    [3, 3, 1, 2, 2, 0, 0], [3, 3, 1, 2, 3, 1, 0], [3, 4, 1, 2, 3, 0, 1],
    [3, 4, 1, 3, 4, 1, 0], [4, 4, 1, 3, 4, 1, 1], [4, 4, 1, 4, 5, 1, 0],
    [4, 4, 2, 4, 5, 1, 0], [4, 4, 1, 5, 6, 2, 1], [4, 5, 2, 5, 6, 2, 0], [4, 5, 2, 5, 6, 1, 1], [4, 5, 2, 6, 7, 2, 0], [5, 5, 2, 6, 7, 2, 1],
    [5, 5, 2, 6, 7, 2, 1], [5, 5, 2, 7, 8, 3, 0], [5, 5, 2, 7, 8, 2, 1], [5, 5, 3, 7, 8, 2, 0], [5, 6, 3, 7, 8, 3, 1], [5, 6, 2, 8, 9, 3, 1],
    [5, 6, 3, 8, 9, 3, 0], [5, 6, 3, 8, 9, 3, 1], [5, 6, 3, 8, 9, 3, 1], [6, 6, 3, 8, 9, 3, 1], [6, 6, 3, 9, 10, 3, 1], [6, 6, 3, 9, 10, 4, 0],
    [6, 6, 3, 9, 10, 3, 1], [6, 6, 3, 9, 10, 4, 1], [6, 6, 4, 9, 10, 3, 1], [6, 6, 3, 10, 10, 4, 1], [6, 6, 4, 10, 10, 3, 1], [6, 6, 4, 10, 10, 4, 1],
  ];
  const BOLUMLER = T.map(([R, C, nEv, min, max, md, geri], i) => ({ ...uret(R, C, nEv, min, max, md, geri), grup: Uygulama.seviye(i), ek: i < 6 ? 1 : 2 }));

  // ---------- Oyun ----------
  const stil = `
  .sp { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f6efe4, #ece2d2); }
  .sp-sahne { --k: 80px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 22px; padding: 8px 16px 16px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .sp-sahne.dikey { flex-direction: column; gap: 10px; justify-content: safe center; overflow-y: auto; }
  .sp-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 8px; border-radius: 20px; background: #b08860; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .sp-kare { position: relative; background: #f3dfbf; box-shadow: inset 0 0 0 1px #e4c99f; }
  .sp-kare.esya { background: #e8d0a8; }
  .sp-kare > svg { position: absolute; inset: 6%; width: 88%; height: 88%; z-index: 1; }
  .sp-kare.carpti { animation: sp-yanip .3s 4; }
  @keyframes sp-yanip { 50% { background: #ff8a80; } }
  .sp-arac { position: absolute; left: 8px; top: 8px; width: var(--k); height: var(--k); transition: transform .4s ease-in-out; pointer-events: none; z-index: 3; }
  .sp-arac > div { width: 100%; height: 100%; transition: transform .35s ease-in-out; }
  .sp-arac svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.25)); }
  .sp-arac.uzgun svg { animation: sp-salla .5s 2; }
  @keyframes sp-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  .sp-yan { display: grid; justify-items: center; gap: 12px; }
  .sp-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: min(100%, 560px); box-sizing: border-box; }
  .sp-yer { width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); cursor: pointer; }
  .sp-yer.dolu { border: 0; background: none; }
  .sp-yer svg { width: 100%; height: 100%; display: block; }
  .sp-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .sp-yer.hata { outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; animation: sp-salla .5s 2; }
  .sp-yer.hedefte { border-color: var(--mavi); background: #d4e8ff; }
  .sp-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .sp-kartlar { display: flex; gap: 10px; }
  .sp-kart { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .sp-kart svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .sp-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); }
  .sp-tasinan svg { width: 100%; height: 100%; display: block; }
  .sp-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .sp-calistir svg { width: 30px; height: 30px; }
  .sp-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("sp-stil")) { const st = document.createElement("style"); st.id = "sp-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="sp"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="sp-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".sp-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.cozum = coz(b);
    d.yerSayi = Math.min(14, d.cozum.enKisa.length + b.ek);
    d.program = []; d.yer = null; d.aci = b.yon * 90;
    const { R, C } = d.cozum;
    let kareler = "";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareler += `<div class="sp-kare${b.h[r][c] === "#" ? " esya" : ""}" data-r="${r}" data-c="${c}">${b.h[r][c] === "#" ? ESYA[b.esya[r][c]] : ""}</div>`;
    d.sahne.innerHTML = `
      <div class="sp-harita" style="--C:${C}">${kareler}<div class="sp-arac"><div>${robot}</div></div></div>
      <div class="sp-yan">
        <div class="sp-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="sp-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. komut"></div>`).join("")}</div>
        <div class="sp-alt">
          <div class="sp-kartlar" aria-label="Kartlar">${["l", "i", "g", "s"].map((k) => `<button class="sp-kart" type="button" data-k="${k}" aria-label="${KART[k].ad}">${kartSvg(k)}</button>`).join("")}</div>
          <button class="sp-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button>
        </div>
      </div>`;
    d.harita = d.sahne.querySelector(".sp-harita");
    d.arac = d.sahne.querySelector(".sp-arac");
    d.programEl = d.sahne.querySelector(".sp-program");
    d.dugme = d.sahne.querySelector(".sp-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".sp-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".sp-kart").forEach(kartTasi);
    haritaCiz(new Set());
    programCiz();
    boyutla();
  }
  const kareEl = (r, c) => d.harita.querySelector(`.sp-kare[data-r="${r}"][data-c="${c}"]`);
  function haritaCiz(teslim) { d.cozum.evler.forEach(([r, c]) => (kareEl(r, c).innerHTML = toz(teslim.has(`${r},${c}`)))); }
  function programCiz() {
    d.programEl.querySelectorAll(".sp-yer").forEach((y, j) => { y.className = "sp-yer" + (j < d.program.length ? " dolu" : ""); y.innerHTML = j < d.program.length ? kartSvg(d.program[j]) : ""; });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }
  function boyutla() {
    if (!d || !d.harita) return;
    const { R, C } = d.cozum;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.1;
    d.sahne.classList.toggle("dikey", dikey);
    const p = Math.max(46, Math.min(72, Math.floor((dikey ? W - 30 : W * 0.42) / Math.min(d.yerSayi, 6) - 10)));
    const satir = Math.ceil(d.yerSayi / Math.max(1, Math.floor(((dikey ? W : W * 0.42) - 24) / (p + 8))));
    const k = dikey ? Math.min((W - 20) / C, (H - satir * (p + 8) - p - 140) / R, 110) : Math.min((W * 0.55 - 20) / C, (H - 20) / R, 120);
    d.k = Math.max(36, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px"); d.sahne.style.setProperty("--p", p + "px");
    aracKoy(...(d.yer || d.cozum.bas), d.aci, false);
  }
  function aracKoy(r, c, aci, anim = true) {
    d.yer = [r, c]; d.aci = aci;
    d.arac.style.transition = anim ? "" : "none";
    d.arac.firstElementChild.style.transition = anim ? "" : "none";
    d.arac.style.transform = `translate(${c * d.k}px, ${r * d.k}px)`;
    d.arac.firstElementChild.style.transform = `rotate(${aci}deg)`;
    if (!anim) { void d.arac.offsetWidth; d.arac.style.transition = ""; d.arac.firstElementChild.style.transition = ""; }
  }
  function kartKoy(k, j) {
    if (d.calisiyor) return;
    if (j == null || j >= d.program.length) { if (d.program.length >= d.yerSayi) return; d.program.push(k); } else d.program[j] = k;
    programCiz(); d.api.ses.tik();
  }
  function kartTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const k = btn.dataset.k;
    btn.addEventListener("pointerdown", (e) => { if (d.calisiyor) return; e.preventDefault(); aktif = true; bx = e.clientX; by = e.clientY; btn.setPointerCapture && btn.setPointerCapture(e.pointerId); });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) { ucan = document.createElement("div"); ucan.className = "sp-tasinan"; const rr = btn.getBoundingClientRect(); ucan.style.width = ucan.style.height = rr.width + "px"; ucan.innerHTML = kartSvg(k); document.body.appendChild(ucan); }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY), yer = alt && alt.closest(".sp-yer");
      if (hedef && hedef !== yer) hedef.classList.remove("hedefte");
      hedef = yer || null; if (hedef) hedef.classList.add("hedefte");
    });
    const birak = () => { if (!aktif) return; aktif = false; if (ucan) { ucan.remove(); ucan = null; if (hedef) { hedef.classList.remove("hedefte"); kartKoy(k, +hedef.dataset.j); } hedef = null; } else kartKoy(k); };
    btn.addEventListener("pointerup", birak); btn.addEventListener("pointercancel", birak);
  }

  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, b = BOLUMLER[d.idx], { bas, evler, yol } = d.cozum, yerler = [...d.programEl.querySelectorAll(".sp-yer")];
    const teslim = new Set();
    let [r, c] = bas, y = b.yon, aci = b.yon * 90, hata = -1, bitti = false;
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((e, q) => e.classList.toggle("simdi", q === j));
      const k = d.program[j];
      if (k === "i" || k === "g") {
        const yy = k === "i" ? y : (y + 2) % 4, nr = r + YON[yy][0], nc = c + YON[yy][1];
        if (!yol(nr, nc)) { aracKoy(r + YON[yy][0] * 0.3, c + YON[yy][1] * 0.3, aci); await bekle(240); if (!d || benim !== d.uid) return; aracKoy(r, c, aci); const e = kareEl(nr, nc); if (e) e.classList.add("carpti"); hata = j; break; }
        r = nr; c = nc; aracKoy(r, c, aci); d.api.ses.adim(j % 8);
      } else { y = (y + (k === "s" ? 1 : 3)) % 4; aci += k === "s" ? 90 : -90; aracKoy(r, c, aci); d.api.ses.ton(k === "s" ? 660 : 520, 0.15); }
      await bekle(460);
      if (!d || benim !== d.uid) return;
      if (evler.some(([a, e]) => a === r && e === c) && !teslim.has(`${r},${c}`)) { teslim.add(`${r},${c}`); haritaCiz(teslim); d.api.ses.yerlesti(); await bekle(200); if (!d || benim !== d.uid) return; }
      if (teslim.size === evler.length) { bitti = true; break; }
    }
    yerler.forEach((e) => e.classList.remove("simdi"));
    if (bitti) { await bekle(400); if (!d || benim !== d.uid) return; return bitir(); }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.arac.classList.add("uzgun"); d.api.ses.hata();
    await bekle(1600);
    if (!d || benim !== d.uid) return;
    d.arac.classList.remove("uzgun"); yerler.forEach((e) => e.classList.remove("hata"));
    d.harita.querySelectorAll(".carpti").forEach((e) => e.classList.remove("carpti"));
    haritaCiz(new Set()); aracKoy(...bas, b.yon * 90, false);
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün odalar pırıl pırıl, temizlik ustası!" : "Son oda da tertemiz!") : "Oda tertemiz oldu!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.SUPURGE_BOLUMLER = BOLUMLER;
  window.SUPURGE_COZ = coz;

  window.Uygulama.oyunEkle(34, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d || !d.cozum.enKisa) return [];
      const sol = [...d.cozum.enKisa].slice(0, tam ? undefined : 2);
      return [{ el: d.arac }, ...sol.map((k, j) => ({ el: d.sahne.querySelector(`.sp-kart[data-k="${k}"]`), hedef: d.sahne.querySelector(`.sp-yer[data-j="${j}"]`) })), { el: d.dugme }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${robot}${kartSvg("i")}${kartSvg("g")}${toz(false)}</div>`; },
  });
})();
