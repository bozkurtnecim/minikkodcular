/* 16. Hafta: Arıyı Çiçeğe Götür (kodlama: ok komutlarıyla program yazmak).
   Ok kartlarını şeride diz, "Çalıştır"a bas; arı komutları sırayla uygular.
   Engele çarparsa ya da çiçeklere varamazsa başa döner, program silinir (hata ayıklama).
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12 (son 6'sında birden çok çiçek). */
(function () {
  const KAYIT = "ari";

  // Harita: A arı, C çiçek, T taş, S su, . çimen
  const BOLUMLER = [
    ["....", "AC..", "...."],
    ["...", ".A.", ".C.", "..."],
    [".....", "A.C..", "....."],

    [".C.", "...", "...", ".A."],
    ["......", "..C..A"],
    ["A..", "...", "...", "C.."],

    ["..C", "...", "A.."],
    ["A..", "...", "..C"],
    ["C...", "....", "...A"],
    ["...A", "....", "C..."],
    [".A...", ".....", "....C"],
    ["C....", ".....", "....A"],

    [".....", "A.T.C", "....."],
    ["A..", "TT.", "C.."],
    ["C.T..", "..T..", "....A"],
    ["A.S..", ".SS..", "....C"],
    ["...T.C", "...T..", "A....."],
    ["A.T..", "..T.T", "....C"],

    ["AT...T.", ".CT....", "....SCS"],
    ["C......", "TTTT.T.", "A......"],
    ["A.S.S.C", "..S.S..", "......."],
    ["....T.C", ".TT....", "A...T.."],
    ["..TC.TA", "SS.....", "C......"],
    ["A.T...C", "..T.T..", "....T.."],

    ["C...C", ".....", "..A.."],
    ["C....", "..T..", "A...C"],
    ["T.A...", "......", ".C..SC", "TST..."],
    ["C.....", "..TT..", "A....C"],
    [".....T", "C.ST.T", "A..T.T", "T.TC.."],
    ["T..T.TC", "T....T.", "A.T.C.C", "......."],
  ].map((harita, i) => ({ harita, grup: Uygulama.seviye(i), ek: i < 6 ? 0 : i < 12 ? 1 : 2 }));

  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = {
    u: { renk: "#2fb36a", koyu: "#1f8a4f", ad: "Yukarı", aci: 0 },
    r: { renk: "#2f86e0", koyu: "#1f62ab", ad: "Sağa", aci: 90 },
    d: { renk: "#ff8a1f", koyu: "#d96a0a", ad: "Aşağı", aci: 180 },
    l: { renk: "#8a5cf0", koyu: "#6a3fcc", ad: "Sola", aci: 270 },
  };

  // Haritayı çöz: başlangıç, çiçekler ve bütün çiçekleri dolaşan en kısa program
  function coz(harita) {
    const R = harita.length, C = harita[0].length;
    let bas; const cicekler = [];
    harita.forEach((s, r) => [...s].forEach((ch, c) => { if (ch === "A") bas = [r, c]; if (ch === "C") cicekler.push([r, c]); }));
    const engel = (r, c) => r < 0 || r >= R || c < 0 || c >= C || harita[r][c] === "T" || harita[r][c] === "S";
    const tam = (1 << cicekler.length) - 1;
    const ci = (r, c) => cicekler.findIndex(([a, b]) => a === r && b === c);
    const kuyruk = [[bas[0], bas[1], 0, ""]], gorulen = new Set([`${bas[0]},${bas[1]},0`]);
    let enKisa = null;
    while (kuyruk.length) {
      const [r, c, m, yol] = kuyruk.shift();
      if (m === tam) { enKisa = yol; break; }
      for (const [y, [dr, dc]] of Object.entries(YON)) {
        const nr = r + dr, nc = c + dc;
        if (engel(nr, nc)) continue;
        const k = ci(nr, nc), nm = k >= 0 ? m | (1 << k) : m, key = `${nr},${nc},${nm}`;
        if (gorulen.has(key)) continue;
        gorulen.add(key); kuyruk.push([nr, nc, nm, yol + y]);
      }
    }
    return { R, C, bas, cicekler, engel, enKisa };
  }

  // ---------- Çizimler ----------
  const okSvg = (y) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${OK[y].renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${OK[y].koyu}" opacity=".5"/><g transform="rotate(${OK[y].aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g></svg>`;
  const ari = `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="40" cy="28" rx="16" ry="22" fill="#e6f6ff" opacity=".95" transform="rotate(-25 40 28)"/><ellipse cx="62" cy="28" rx="16" ry="22" fill="#e6f6ff" opacity=".95" transform="rotate(25 62 28)"/><ellipse cx="48" cy="58" rx="32" ry="24" fill="#ffd23f"/><path d="M36 36 v44 M54 34 v48" stroke="#2b2b2b" stroke-width="9"/><path d="M16 60 l-10 4 l10 4 z" fill="#2b2b2b"/><circle cx="78" cy="54" r="15" fill="#2b2b2b"/><circle cx="82" cy="50" r="5" fill="#fff"/><circle cx="83" cy="50" r="2.4" fill="#26201f"/><path d="M80 40 q4 -14 12 -14 M74 40 q-2 -14 4 -18" stroke="#2b2b2b" stroke-width="3" fill="none"/></svg>`;
  const cicekSvg = (acik) => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 56 V96" stroke="#3d9a3d" stroke-width="7"/><ellipse cx="36" cy="80" rx="12" ry="5" fill="#4fb04a" transform="rotate(-30 36 80)"/>${[0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="50" cy="16" rx="11" ry="17" fill="${acik ? "#ff5d8f" : "#ff9bc2"}" transform="rotate(${i * 60} 50 36)"/>`).join("")}<circle cx="50" cy="36" r="12" fill="#ffd23f"/>${acik ? `<path d="M80 12 l4 -8 l4 8 l-4 8 z M14 20 l3 -6 l3 6 l-3 6 z" fill="#ffd23f"/>` : ""}</svg>`;
  const tas = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 82 L22 44 L46 28 L74 36 L90 64 L86 84 Z" fill="#9aa7b8"/><path d="M22 44 L46 28 L52 50 Z" fill="#b4bfcd"/></svg>`;
  const su = `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="54" rx="44" ry="34" fill="#5ab8ea"/><path d="M26 50 q8 -6 16 0 M54 62 q8 -6 16 0" stroke="#bfe9ff" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;

  const stil = `
  .ar { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--mor); }
  .ar-sahne { --k: 80px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 20px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .ar-sahne.dikey { flex-direction: column; gap: 10px; }
  .ar-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 10px; border-radius: 22px; background: #8fd36a; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .ar-kare { position: relative; background: #9be07a; outline: 1px solid rgba(255,255,255,.3); }
  .ar-kare:nth-child(odd) { background: #94da72; }
  .ar-kare > svg { position: absolute; inset: 6%; width: 88%; height: 88%; }
  .ar-kare.iz::after { content: ""; position: absolute; left: 50%; top: 50%; width: 14%; height: 14%; margin: -7%; border-radius: 50%; background: rgba(255,210,63,.9); }
  .ar-kare.carpti { animation: ar-yanip .3s 4; }
  @keyframes ar-yanip { 50% { background: #ff8a80; } }
  .ar-ari { position: absolute; left: 10px; top: 10px; width: var(--k); height: var(--k); transition: transform .35s ease-in-out; pointer-events: none; z-index: 3; }
  .ar-ari > div { width: 100%; height: 100%; transition: transform .2s; }
  .ar-ari svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.2)); }
  .ar-ari.uc > div { animation: ar-kanat .35s ease-in-out infinite; }
  .ar-ari.uzgun > div { animation: ar-salla .5s 2; }
  @keyframes ar-kanat { 50% { transform: translateY(-6%) var(--yon, scaleX(1)); } }
  @keyframes ar-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .ar-yan { display: grid; justify-items: center; align-content: center; gap: 12px; min-width: 0; }
  .ar-sahne:not(.dikey) .ar-yan { flex: 1; max-width: 520px; }
  .ar-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: 100%; box-sizing: border-box; }
  .ar-yer { position: relative; width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); flex: none; }
  .ar-yer.dolu { border: 0; background: none; cursor: pointer; }
  .ar-yer svg { display: block; width: 100%; height: 100%; }
  .ar-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .ar-yer.hata { animation: ar-salla .5s 2; outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; }
  .ar-yer.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .ar-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; }
  .ar-ok { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .ar-ok svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .ar-ok[data-y="u"] { grid-column: 2; grid-row: 1; } .ar-ok[data-y="l"] { grid-column: 1; grid-row: 2; } .ar-ok[data-y="d"] { grid-column: 2; grid-row: 2; } .ar-ok[data-y="r"] { grid-column: 3; grid-row: 2; }
  .ar-ok:active { transform: translateY(3px); }
  .ar-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .ar-tasinan svg { width: 100%; height: 100%; display: block; }
  .ar-alt { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .ar-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .ar-calistir svg { width: 30px; height: 30px; }
  .ar-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ar-stil")) {
      const st = document.createElement("style"); st.id = "ar-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ar"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ar-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ar-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    d.program = []; d.ariYer = null; d.ariYon = null;
    const { R, C } = d.cozum;
    let kareler = "";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareler += `<div class="ar-kare" data-r="${r}" data-c="${c}"></div>`;
    d.sahne.innerHTML = `
      <div class="ar-harita" style="--C:${C}">${kareler}<div class="ar-ari"><div>${ari}</div></div></div>
      <div class="ar-yan">
        <div class="ar-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="ar-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. komut"></div>`).join("")}</div>
        <div class="ar-alt">
          <div class="ar-oklar" aria-label="Ok kartları">${["u", "l", "d", "r"].map((y) => `<button class="ar-ok" type="button" data-y="${y}" aria-label="${OK[y].ad}">${okSvg(y)}</button>`).join("")}</div>
          <button class="ar-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button>
        </div>
      </div>`;
    d.harita = d.sahne.querySelector(".ar-harita");
    d.ariEl = d.sahne.querySelector(".ar-ari");
    d.programEl = d.sahne.querySelector(".ar-program");
    d.dugme = d.sahne.querySelector(".ar-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".ar-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".ar-ok").forEach(okTasi);
    haritaCiz();
    programCiz();
    boyutla();
  }

  const kareEl = (r, c) => d.harita.querySelector(`.ar-kare[data-r="${r}"][data-c="${c}"]`);

  function haritaCiz(acilan = new Set()) {
    const { R, C } = d.cozum, h = BOLUMLER[d.idx].harita;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const ch = h[r][c], el = kareEl(r, c);
      el.innerHTML = ch === "C" ? cicekSvg(acilan.has(`${r},${c}`)) : ch === "T" ? tas : ch === "S" ? su : "";
      el.classList.remove("iz", "carpti");
    }
  }

  function programCiz() {
    d.programEl.querySelectorAll(".ar-yer").forEach((y, j) => {
      y.className = "ar-yer" + (j < d.program.length ? " dolu" : "");
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
      k = Math.min((W - 20) / C, (H - satir * (p + 8) - 24 - (2 * p + 8) - 40) / R, 110);
    } else {
      p = Math.max(52, Math.min(76, Math.floor((W * 0.42 - 24) / Math.min(d.yerSayi, 6) - 8)));
      k = Math.min((W * 0.55 - 20) / C, (H - 20) / R, 120);
    }
    d.sahne.style.setProperty("--k", Math.max(36, Math.floor(k)) + "px");
    d.sahne.style.setProperty("--p", p + "px");
    d.k = Math.max(36, Math.floor(k));
    ariKoy(...(d.ariYer || d.cozum.bas), d.ariYon || "r", false);
  }

  function ariKoy(r, c, yon, anim = true) {
    d.ariYer = [r, c]; d.ariYon = yon;
    d.ariEl.style.transition = anim ? "" : "none";
    d.ariEl.style.transform = `translate(${c * d.k}px, ${r * d.k}px)`;
    const tr = yon === "l" ? "scaleX(-1)" : "scaleX(1)";
    d.ariEl.firstElementChild.style.transform = tr;
    d.ariEl.style.setProperty("--yon", tr);
    if (!anim) { void d.ariEl.offsetWidth; d.ariEl.style.transition = ""; }
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
        ucan.className = "ar-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = okSvg(y);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const yer = alt && alt.closest(".ar-yer");
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

  // Programı çalıştır: arı komutları sırayla uygular
  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, { bas, cicekler, engel } = d.cozum;
    const yerler = [...d.programEl.querySelectorAll(".ar-yer")];
    const ziyaret = new Set();
    let [r, c] = bas, hata = -1;
    d.ariEl.classList.add("uc");
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((y, k) => y.classList.toggle("simdi", k === j));
      const yon = d.program[j], nr = r + YON[yon][0], nc = c + YON[yon][1];
      if (engel(nr, nc)) {
        // Çarpma: arı yarım adım gidip geri döner
        ariKoy(r + YON[yon][0] * 0.3, c + YON[yon][1] * 0.3, yon);
        await bekle(250);
        if (!d || benim !== d.uid) return;
        ariKoy(r, c, yon);
        const k = kareEl(nr, nc);
        if (k) k.classList.add("carpti");
        hata = j;
        break;
      }
      kareEl(r, c).classList.add("iz");
      r = nr; c = nc;
      ariKoy(r, c, yon);
      d.api.ses.adim(j % 8);
      await bekle(420);
      if (!d || benim !== d.uid) return;
      if (cicekler.some(([a, b]) => a === r && b === c) && !ziyaret.has(`${r},${c}`)) {
        ziyaret.add(`${r},${c}`);
        haritaCiz(ziyaret);
        d.api.ses.yerlesti();
        await bekle(200);
        if (!d || benim !== d.uid) return;
      }
      if (ziyaret.size === cicekler.length) break;
    }
    d.ariEl.classList.remove("uc");
    yerler.forEach((y) => y.classList.remove("simdi"));
    if (hata < 0 && ziyaret.size === cicekler.length) { await bekle(400); if (!d || benim !== d.uid) return; return bitir(); }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.ariEl.classList.add("uzgun");
    d.api.ses.hata();
    await bekle(1500);
    if (!d || benim !== d.uid) return;
    d.ariEl.classList.remove("uzgun");
    yerler.forEach((y) => y.classList.remove("hata"));
    haritaCiz();
    ariKoy(bas[0], bas[1], "r", false);
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
      mesaj: son ? (herkes ? "Bütün programları yazdın, minik kodcu!" : "Son programın da çalıştı!") : "Arı çiçeğe ulaştı!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.ARI_BOLUMLER = BOLUMLER; // test için
  window.ARI_COZ = coz;

  window.Uygulama.oyunEkle(16, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu(tam) {
      if (!d || !d.cozum || !d.cozum.enKisa) return [];
      const sol = [...d.cozum.enKisa].slice(0, tam ? undefined : 2);
      return [...sol.map((y, j) => ({ el: d.sahne.querySelector(`.ar-ok[data-y="${y}"]`), hedef: d.sahne.querySelector(`.ar-yer[data-j="${j}"]`) })), { el: d.sahne.querySelector(".ar-calistir") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true">${ari}${okSvg("r")}${okSvg("u")}${cicekSvg(true)}</div>`;
    },
  });
})();
