/* 17. Hafta: Tavşanın Havuçları (kodlama: ok komutlarıyla program yazmak).
   Tavşan bütün havuçları toplayıp yuvasına dönmeli. Zor bölümlerden itibaren
   "zıpla" kartları gelir: tavşan çalının ya da gölün üstünden atlar, ağacın üstünden atlayamaz.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "havuc";

  // Harita: A tavşan, H havuç, Y yuva, K çalı, S göl, G ağaç, . çimen
  const BOLUMLER = [
    ["....", ".AY.", "...."],
    [".Y.", "...", ".A."],
    ["....", "A..Y", "...."],

    ["....", "AH.Y", "...."],
    [".Y.", ".H.", "...", ".A."],
    [".....", "Y.H.A", "....."],

    ["A.H", "...", "..Y"],
    ["Y..", "...", "H.A"],
    ["A.K.", "..K.", "H...", "...Y"],
    ["Y...K", "....K", "..H.A"],
    ["..H", ".K.", "A.Y"],
    ["A.K..", "..K.Y", "H...."],

    ["..S..", "A.S.Y", "..S.."],
    ["YH.K.", "...K.", "...GA"],
    [".K..Y", "AGG..", ".K..H", ".K..."],
    ["..SH.", "..S..", "A.GGY"],
    ["A..GY", "...K.", "...KH"],
    ["..S.Y", "..SA.", "H.G..", "..S.."],

    [".S.K...", "AS.K..H", ".SYK..H"],
    [".H..K..", "....KH.", "Y.GAK.."],
    [".K..K.", "HK..G.", ".K.AKH", ".K.YK."],
    ["AYG.K.", "..K.K.", "H.K.KH", ".GK.K."],
    ["HS..KY.", ".G..K.H", ".SA.K.."],
    [".S...H.", "HS.....", ".SA.Y..", ".G....."],
    ["...S..", "G..S.A", "...S.Y", ".HHG.."],
    [".KAG..", "GK.G..", ".G.K.H", "HK.G.Y"],
    ["...S.H", "..AG..", ".Y.S..", "..HS.."],
    [".K.HK.", ".K..KY", "HK..K.", ".K..KA"],
    [".S...KH", ".SY..K.", ".S...K.", ".GAH.K."],
    [".SY.S..", ".S..S.G", "HSA.S..", ".S..SH."],
  ].map((harita, i) => ({ harita, grup: Uygulama.seviye(i), ek: i < 6 ? 0 : i < 12 ? 1 : 2, zipla: i >= 12 }));

  // Küçük harf: bir adım, büyük harf: iki kare zıpla
  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = {
    u: { renk: "#2fb36a", koyu: "#1f8a4f", ad: "Yukarı", aci: 0 },
    r: { renk: "#2f86e0", koyu: "#1f62ab", ad: "Sağa", aci: 90 },
    d: { renk: "#ff8a1f", koyu: "#d96a0a", ad: "Aşağı", aci: 180 },
    l: { renk: "#8a5cf0", koyu: "#6a3fcc", ad: "Sola", aci: 270 },
  };

  // Haritayı çöz: bütün havuçları toplayıp yuvada biten en kısa program
  function coz(harita, zipla) {
    const R = harita.length, C = harita[0].length;
    let bas, yuva; const havuclar = [];
    harita.forEach((s, r) => [...s].forEach((ch, c) => {
      if (ch === "A") bas = [r, c];
      if (ch === "Y") yuva = [r, c];
      if (ch === "H") havuclar.push([r, c]);
    }));
    const disarda = (r, c) => r < 0 || r >= R || c < 0 || c >= C;
    const engel = (r, c) => disarda(r, c) || "KSG".includes(harita[r][c]);
    // Zıplama yalnızca çalının ya da gölün üstünden olur (çimen ve ağaç üstünden olmaz)
    const atlanir = (r, c) => !disarda(r, c) && "KS".includes(harita[r][c]);
    const tam = (1 << havuclar.length) - 1;
    const hi = (r, c) => havuclar.findIndex(([a, b]) => a === r && b === c);
    const kuyruk = [[bas[0], bas[1], 0, ""]], gorulen = new Set([`${bas[0]},${bas[1]},0`]);
    const komutlar = Object.keys(YON).concat(zipla ? Object.keys(YON).map((y) => y.toUpperCase()) : []);
    let enKisa = null;
    while (kuyruk.length) {
      const [r, c, m, yol] = kuyruk.shift();
      if (m === tam && r === yuva[0] && c === yuva[1]) { enKisa = yol; break; }
      for (const y of komutlar) {
        const [dr, dc] = YON[y.toLowerCase()], n = y === y.toUpperCase() ? 2 : 1;
        if (n === 2 && !atlanir(r + dr, c + dc)) continue;
        const nr = r + dr * n, nc = c + dc * n;
        if (engel(nr, nc)) continue;
        const k = hi(nr, nc), nm = k >= 0 ? m | (1 << k) : m, key = `${nr},${nc},${nm}`;
        if (gorulen.has(key)) continue;
        gorulen.add(key); kuyruk.push([nr, nc, nm, yol + y]);
      }
    }
    return { R, C, bas, yuva, havuclar, engel, atlanir, enKisa };
  }

  // ---------- Çizimler ----------
  const okSvg = (y) => {
    const o = OK[y.toLowerCase()], zip = y !== y.toLowerCase();
    const ic = zip
      ? `<g transform="rotate(${o.aci} 50 46)" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M24 44 L50 18 L76 44"/><path d="M24 74 L50 48 L76 74"/></g>`
      : `<g transform="rotate(${o.aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g>`;
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${o.renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${o.koyu}" opacity=".5"/>${ic}</svg>`;
  };
  const tavsan = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="18" cy="64" r="9" fill="#fff"/><ellipse cx="40" cy="86" rx="13" ry="6" fill="#dcdcdc"/><ellipse cx="44" cy="66" rx="27" ry="21" fill="#f4f4f4"/><ellipse cx="62" cy="86" rx="12" ry="6" fill="#e6e6e6"/><ellipse cx="62" cy="22" rx="7" ry="19" fill="#f4f4f4" transform="rotate(-14 62 22)"/><ellipse cx="62" cy="22" rx="3.5" ry="13" fill="#ffb7c5" transform="rotate(-14 62 22)"/><ellipse cx="77" cy="24" rx="7" ry="19" fill="#f4f4f4" transform="rotate(14 77 24)"/><ellipse cx="77" cy="24" rx="3.5" ry="13" fill="#ffb7c5" transform="rotate(14 77 24)"/><circle cx="70" cy="48" r="18" fill="#f6f6f6"/><circle cx="76" cy="45" r="3.8" fill="#26201f"/><circle cx="77.2" cy="43.8" r="1.2" fill="#fff"/><ellipse cx="87" cy="52" rx="3.6" ry="2.8" fill="#ff7a99"/><circle cx="74" cy="56" r="3.5" fill="#ffc6d3" opacity=".8"/></svg>`;
  const havuc = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 30 Q38 10 30 14 M50 30 Q50 6 56 6 M50 30 Q64 12 72 18" stroke="#3d9a3d" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M34 32 Q50 24 66 32 L53 92 Q50 98 47 92 Z" fill="#ff8a1f"/><path d="M40 46 h9 M46 60 h9 M44 74 h7" stroke="#d96a0a" stroke-width="4" stroke-linecap="round"/></svg>`;
  const yuvaSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="64" rx="46" ry="30" fill="#b07a4a"/><ellipse cx="50" cy="58" rx="38" ry="22" fill="#c48d58"/><ellipse cx="50" cy="64" rx="27" ry="17" fill="#3b2716"/><path d="M14 84 q4 -10 8 0 M78 86 q4 -10 8 0" stroke="#3d9a3d" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  const cali = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="30" cy="62" r="22" fill="#3f9a3a"/><circle cx="70" cy="62" r="22" fill="#3f9a3a"/><circle cx="50" cy="44" r="26" fill="#4cae45"/><circle cx="40" cy="38" r="5" fill="#ff5d8f"/><circle cx="62" cy="54" r="5" fill="#ff5d8f"/><circle cx="30" cy="64" r="4" fill="#ff5d8f"/></svg>`;
  const su = `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="54" rx="44" ry="34" fill="#5ab8ea"/><path d="M26 50 q8 -6 16 0 M54 62 q8 -6 16 0" stroke="#bfe9ff" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  const agacSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="42" y="58" width="16" height="38" rx="4" fill="#8a5a33"/><circle cx="50" cy="36" r="30" fill="#2e7d32"/><circle cx="34" cy="50" r="18" fill="#2e7d32"/><circle cx="66" cy="50" r="18" fill="#2e7d32"/><circle cx="40" cy="26" r="9" fill="#43a047"/></svg>`;

  const stil = `
  .tv { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .tv-sahne { --k: 80px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 20px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .tv-sahne.dikey { flex-direction: column; gap: 8px; }
  .tv-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 10px; border-radius: 22px; background: #8fd36a; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .tv-kare { position: relative; background: #9be07a; outline: 1px solid rgba(255,255,255,.3); }
  .tv-kare:nth-child(odd) { background: #94da72; }
  .tv-kare > svg { position: absolute; inset: 6%; width: 88%; height: 88%; }
  .tv-kare.kapali > svg { filter: grayscale(.7); opacity: .55; }
  .tv-kare.acik > svg { animation: tv-parla 1s ease-in-out infinite; }
  @keyframes tv-parla { 50% { transform: scale(1.08); filter: drop-shadow(0 0 8px #ffd23f); } }
  .tv-kare.iz::after { content: ""; position: absolute; left: 50%; top: 58%; width: 16%; height: 10%; margin: -5% -8%; border-radius: 50%; background: rgba(255,255,255,.75); }
  .tv-kare.carpti { animation: tv-yanip .3s 4; }
  @keyframes tv-yanip { 50% { background: #ff8a80; } }
  .tv-tavsan { position: absolute; left: 10px; top: 10px; width: var(--k); height: var(--k); transition: transform .4s ease-in-out; pointer-events: none; z-index: 3; }
  .tv-tavsan.uzun { transition-duration: .6s; }
  .tv-tavsan > div { width: 100%; height: 100%; }
  .tv-tavsan > div > div { width: 100%; height: 100%; }
  .tv-tavsan svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.2)); }
  .tv-tavsan.hop > div > div { animation: tv-hop .4s ease-out; }
  .tv-tavsan.hop-buyuk > div > div { animation: tv-hopb .6s ease-out; }
  .tv-tavsan.uzgun > div > div { animation: tv-salla .5s 2; }
  .tv-tavsan.girdi > div > div { transition: transform .5s, opacity .5s; transform: translateY(30%) scale(.2); opacity: 0; }
  @keyframes tv-hop { 50% { transform: translateY(-28%); } }
  @keyframes tv-hopb { 50% { transform: translateY(-85%) scale(1.1); } }
  @keyframes tv-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .tv-yan { display: grid; justify-items: center; align-content: center; gap: 10px; min-width: 0; }
  .tv-sahne:not(.dikey) .tv-yan { flex: 1; max-width: 560px; }
  .tv-sepet { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: var(--kagit); box-shadow: 0 4px 0 rgba(29,40,70,.1); }
  .tv-sepet svg { width: 38px; height: 38px; display: block; }
  .tv-sepet .h { opacity: .3; filter: grayscale(1); transition: opacity .3s, filter .3s, transform .3s; }
  .tv-sepet .h.var { opacity: 1; filter: none; transform: scale(1.15); }
  .tv-sepet .ok { width: 22px; height: 22px; color: var(--murekkep-2, #6b7690); }
  .tv-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: 100%; box-sizing: border-box; }
  .tv-yer { position: relative; width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); flex: none; }
  .tv-yer.dolu { border: 0; background: none; cursor: pointer; }
  .tv-yer svg { display: block; width: 100%; height: 100%; }
  .tv-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .tv-yer.hata { animation: tv-salla .5s 2; outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; }
  .tv-yer.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .tv-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .tv-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; }
  .tv-oklar.zipla { padding: 6px; margin: -6px; border-radius: 22px; background: rgba(255,210,63,.35); }
  .tv-ok { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .tv-ok svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .tv-ok[data-y="u"], .tv-ok[data-y="U"] { grid-column: 2; grid-row: 1; } .tv-ok[data-y="l"], .tv-ok[data-y="L"] { grid-column: 1; grid-row: 2; }
  .tv-ok[data-y="d"], .tv-ok[data-y="D"] { grid-column: 2; grid-row: 2; } .tv-ok[data-y="r"], .tv-ok[data-y="R"] { grid-column: 3; grid-row: 2; }
  .tv-ok:active { transform: translateY(3px); }
  .tv-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .tv-tasinan svg { width: 100%; height: 100%; display: block; }
  .tv-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .tv-calistir svg { width: 30px; height: 30px; }
  .tv-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("tv-stil")) {
      const st = document.createElement("style"); st.id = "tv-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="tv"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="tv-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".tv-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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

  const okGrubu = (zip) => `<div class="tv-oklar${zip ? " zipla" : ""}" aria-label="${zip ? "Zıpla kartları" : "Ok kartları"}">${["u", "l", "d", "r"].map((y) => (zip ? y.toUpperCase() : y)).map((y) => `<button class="tv-ok" type="button" data-y="${y}" aria-label="${OK[y.toLowerCase()].ad}${zip ? " zıpla" : ""}">${okSvg(y)}</button>`).join("")}</div>`;

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.cozum = coz(b.harita, b.zipla);
    d.yerSayi = Math.min(14, d.cozum.enKisa.length + b.ek);
    d.program = []; d.yer = null; d.yon = null;
    const { R, C, havuclar } = d.cozum;
    let kareler = "";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareler += `<div class="tv-kare" data-r="${r}" data-c="${c}"></div>`;
    d.sahne.innerHTML = `
      <div class="tv-harita" style="--C:${C}">${kareler}<div class="tv-tavsan"><div><div>${tavsan}</div></div></div></div>
      <div class="tv-yan">
        <div class="tv-sepet" aria-hidden="true">${havuclar.map(() => `<span class="h">${havuc}</span>`).join("")}${havuclar.length ? `<svg class="ok" viewBox="0 0 24 24"><path d="M4 12h13M12 6l6 6-6 6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ""}${yuvaSvg}</div>
        <div class="tv-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="tv-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. komut"></div>`).join("")}</div>
        <div class="tv-alt">
          ${okGrubu(false)}${b.zipla ? okGrubu(true) : ""}
          <button class="tv-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button>
        </div>
      </div>`;
    d.harita = d.sahne.querySelector(".tv-harita");
    d.tavsanEl = d.sahne.querySelector(".tv-tavsan");
    d.programEl = d.sahne.querySelector(".tv-program");
    d.dugme = d.sahne.querySelector(".tv-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".tv-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".tv-ok").forEach(okTasi);
    haritaCiz(new Set());
    programCiz();
    boyutla();
  }

  const kareEl = (r, c) => d.harita.querySelector(`.tv-kare[data-r="${r}"][data-c="${c}"]`);

  function haritaCiz(toplanan) {
    const { R, C, havuclar } = d.cozum, h = BOLUMLER[d.idx].harita;
    const hepsi = toplanan.size === havuclar.length;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const ch = h[r][c], el = kareEl(r, c);
      el.innerHTML = ch === "H" ? (toplanan.has(`${r},${c}`) ? "" : havuc) : ch === "Y" ? yuvaSvg : ch === "K" ? cali : ch === "S" ? su : ch === "G" ? agacSvg : "";
      el.classList.remove("iz", "carpti");
      el.classList.toggle("kapali", ch === "Y" && !hepsi);
    }
    d.sahne.querySelectorAll(".tv-sepet .h").forEach((s, k) => s.classList.toggle("var", k < toplanan.size));
  }

  function programCiz() {
    d.programEl.querySelectorAll(".tv-yer").forEach((y, j) => {
      y.className = "tv-yer" + (j < d.program.length ? " dolu" : "");
      y.innerHTML = j < d.program.length ? okSvg(d.program[j]) : "";
    });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }

  function boyutla() {
    if (!d || !d.harita) return;
    const { R, C } = d.cozum, zip = BOLUMLER[d.idx].zipla;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 20;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.15;
    d.sahne.classList.toggle("dikey", dikey);
    let k, p;
    if (dikey) {
      p = Math.max(46, Math.min(72, Math.floor((W - 30) / Math.min(d.yerSayi, 6) - 8)));
      if (zip) p = Math.min(p, Math.floor((W - 60) / 6 - 8));
      const satir = Math.ceil(d.yerSayi / Math.max(1, Math.floor((W - 24) / (p + 8))));
      const altGen = (zip ? 2 : 1) * (3 * p + 16) + 14 + 180, altYuk = 2 * p + 8 + (altGen > W ? 80 : 0);
      k = Math.min((W - 20) / C, (H - satir * (p + 8) - 24 - altYuk - 40 - 60) / R, 110);
    } else {
      const sutun = zip ? 6 : 3;
      p = Math.max(48, Math.min(76, Math.floor((W * 0.42 - 24) / Math.min(d.yerSayi, 6) - 8), Math.floor((W * 0.42 - 30) / sutun - 8)));
      k = Math.min((W * 0.55 - 20) / C, (H - 20) / R, 120);
    }
    d.k = Math.max(36, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px");
    d.sahne.style.setProperty("--p", p + "px");
    tavsanKoy(...(d.yer || d.cozum.bas), d.yon || "r", false);
  }

  function tavsanKoy(r, c, yon, anim = true) {
    d.yer = [r, c]; d.yon = yon;
    d.tavsanEl.style.transition = anim ? "" : "none";
    d.tavsanEl.style.transform = `translate(${c * d.k}px, ${r * d.k}px)`;
    d.tavsanEl.firstElementChild.style.transform = yon === "l" ? "scaleX(-1)" : "";
    if (!anim) { void d.tavsanEl.offsetWidth; d.tavsanEl.style.transition = ""; }
  }

  function zipAnim(sinif) {
    d.tavsanEl.classList.remove("hop", "hop-buyuk", "uzun");
    void d.tavsanEl.offsetWidth;
    d.tavsanEl.classList.add(sinif);
    if (sinif === "hop-buyuk") d.tavsanEl.classList.add("uzun");
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
        ucan.className = "tv-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = okSvg(y);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const yer = alt && alt.closest(".tv-yer");
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

  // Programı çalıştır: tavşan komutları sırayla uygular
  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, { bas, yuva, havuclar, engel, atlanir } = d.cozum;
    const yerler = [...d.programEl.querySelectorAll(".tv-yer")];
    const toplanan = new Set();
    let [r, c] = bas, hata = -1, kazandi = false;
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((y, k) => y.classList.toggle("simdi", k === j));
      const komut = d.program[j], yon = komut.toLowerCase(), n = komut === yon ? 1 : 2;
      const [dr, dc] = YON[yon], nr = r + dr * n, nc = c + dc * n;
      if (engel(nr, nc) || (n === 2 && !atlanir(r + dr, c + dc))) {
        // Çarpma: tavşan biraz gidip geri döner
        const vurulan = n === 2 && !atlanir(r + dr, c + dc) ? [r + dr, c + dc] : [nr, nc];
        zipAnim("hop");
        tavsanKoy(r + dr * 0.3, c + dc * 0.3, yon);
        await bekle(260);
        if (!d || benim !== d.uid) return;
        tavsanKoy(r, c, yon);
        const k = kareEl(...vurulan);
        if (k) k.classList.add("carpti");
        hata = j;
        break;
      }
      kareEl(r, c).classList.add("iz");
      r = nr; c = nc;
      zipAnim(n === 2 ? "hop-buyuk" : "hop");
      tavsanKoy(r, c, yon);
      if (n === 2) d.api.ses.ton(392, 0.5); else d.api.ses.adim(j % 8);
      await bekle(n === 2 ? 640 : 440);
      if (!d || benim !== d.uid) return;
      if (havuclar.some(([a, b]) => a === r && b === c) && !toplanan.has(`${r},${c}`)) {
        toplanan.add(`${r},${c}`);
        haritaCiz(toplanan);
        d.api.ses.yerlesti();
        if (toplanan.size === havuclar.length) kareEl(...yuva).classList.add("acik");
        await bekle(200);
        if (!d || benim !== d.uid) return;
      }
      if (toplanan.size === havuclar.length && r === yuva[0] && c === yuva[1]) { kazandi = true; break; }
    }
    d.tavsanEl.classList.remove("hop", "hop-buyuk", "uzun");
    yerler.forEach((y) => y.classList.remove("simdi"));
    if (kazandi) {
      d.tavsanEl.classList.add("girdi");
      await bekle(700);
      if (!d || benim !== d.uid) return;
      return bitir();
    }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.tavsanEl.classList.add("uzgun");
    d.api.ses.hata();
    await bekle(1500);
    if (!d || benim !== d.uid) return;
    d.tavsanEl.classList.remove("uzgun");
    yerler.forEach((y) => y.classList.remove("hata"));
    haritaCiz(new Set());
    tavsanKoy(bas[0], bas[1], "r", false);
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
      mesaj: son ? (herkes ? "Bütün havuçlar yuvada, minik kodcu!" : "Son programın da çalıştı!") : "Tavşan yuvasına döndü!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.TAVSAN_BOLUMLER = BOLUMLER; // test için
  window.TAVSAN_COZ = coz;

  window.Uygulama.oyunEkle(17, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu(tam) {
      if (!d || !d.cozum || !d.cozum.enKisa) return [];
      const sol = [...d.cozum.enKisa].slice(0, tam ? undefined : 2);
      return [...sol.map((y, j) => ({ el: d.sahne.querySelector(`.tv-ok[data-y="${y}"]`), hedef: d.sahne.querySelector(`.tv-yer[data-j="${j}"]`) })), { el: d.sahne.querySelector(".tv-calistir") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true">${tavsan}${okSvg("r")}${okSvg("R")}${havuc}</div>`;
    },
  });
})();
