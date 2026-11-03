/* Uğur Böceği Yaprağa (kodlamaya ilk adım: önce doğrudan kumanda, sonra plan).
   Çayırda uğur böceği ve yeşil bir yaprak var. İlk bölümlerde ok kartına dokununca böcek hemen bir kare gider
   (oyuncak arabayı kumandayla sürmek gibi). Sonraki bölümlerde kartlar önce şeride dizilir, "Başla"ya basınca böcek
   planı sırayla uygular. Çok zor bölümlerde yaprağa gitmeden önce çiy damlalarını da toplar. Engel yok;
   çayırın dışına çıkamaz. 30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "ugur";
  const YON = { y: [-1, 0], s: [0, 1], a: [1, 0], l: [0, -1] };
  const ACI = { y: 0, s: 90, a: 180, l: 270 };
  const KART = {
    y: { ad: "Yukarı", renk: "#2fb36a", koyu: "#1f8a4f" }, l: { ad: "Sola", renk: "#8a5cf0", koyu: "#6a3fcc" },
    a: { ad: "Aşağı", renk: "#ff8a1f", koyu: "#d96a0a" }, s: { ad: "Sağa", renk: "#2f86e0", koyu: "#1f62ab" },
  };
  const kartSvg = (k) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${KART[k].renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${KART[k].koyu}" opacity=".5"/><g transform="rotate(${ACI[k]} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g></svg>`;
  // Yukarı bakan uğur böceği
  const bocek = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M38 20 Q30 6 22 8 M62 20 Q70 6 78 8" stroke="#26201f" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="22" cy="8" r="4" fill="#26201f"/><circle cx="78" cy="8" r="4" fill="#26201f"/><path d="M22 50 h-10 M22 64 h-12 M24 78 h-10 M78 50 h10 M78 64 h12 M76 78 h10" stroke="#26201f" stroke-width="4" stroke-linecap="round"/><ellipse cx="50" cy="60" rx="30" ry="34" fill="#e8332a"/><path d="M50 28 V94" stroke="#26201f" stroke-width="3"/><circle cx="36" cy="50" r="6" fill="#26201f"/><circle cx="64" cy="50" r="6" fill="#26201f"/><circle cx="34" cy="72" r="5.5" fill="#26201f"/><circle cx="66" cy="72" r="5.5" fill="#26201f"/><circle cx="50" cy="84" r="4" fill="#26201f"/><path d="M28 30 Q50 12 72 30 Q50 38 28 30 Z" fill="#26201f"/><circle cx="42" cy="25" r="3.5" fill="#fff"/><circle cx="58" cy="25" r="3.5" fill="#fff"/><ellipse cx="38" cy="44" rx="6" ry="9" fill="#fff" opacity=".25"/></svg>`;
  const yaprak = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 92 C14 76 10 34 50 8 C90 34 86 76 50 92 Z" fill="#3fc47a" stroke="#2a9a5a" stroke-width="3"/><path d="M50 92 V18 M50 40 L34 30 M50 54 L32 44 M50 68 L34 60 M50 40 L66 30 M50 54 L68 44 M50 68 L66 60" stroke="#2a9a5a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
  const damla = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12 C66 38 76 52 76 66 A26 26 0 0 1 24 66 C24 52 34 38 50 12 Z" fill="#7cc5ff" stroke="#3b9be6" stroke-width="3"/><ellipse cx="40" cy="62" rx="6" ry="10" fill="#fff" opacity=".7"/></svg>`;
  const cicek = (renk) => `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="${renk}"><circle cx="50" cy="36" r="10"/><circle cx="64" cy="50" r="10"/><circle cx="50" cy="64" r="10"/><circle cx="36" cy="50" r="10"/></g><circle cx="50" cy="50" r="8" fill="#ffd34d"/></svg>`;

  // ---------- Bölüm üretimi ----------
  const rnd = (() => { let s = 3939; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const sec = (a) => a[Math.floor(rnd() * a.length)];
  // En kısa plan: önce damlalar (herhangi sırada), sonra yaprak
  function coz(b, izin = "yals") {
    const tam = (1 << b.damla.length) - 1, di = (r, c) => b.damla.findIndex(([a, e]) => a === r && e === c);
    const q = [[b.bas[0], b.bas[1], 0, ""]], gor = new Set([`${b.bas},0`]);
    while (q.length) {
      const [r, c, m, p] = q.shift();
      if (m === tam && r === b.hedef[0] && c === b.hedef[1]) return p;
      for (const k of izin) {
        const nr = r + YON[k][0], nc = c + YON[k][1];
        if (nr < 0 || nr >= b.R || nc < 0 || nc >= b.C) continue;
        let nm = m; const j = di(nr, nc); if (j >= 0) nm |= 1 << j;
        const key = `${nr},${nc},${nm}`;
        if (gor.has(key)) continue;
        gor.add(key); q.push([nr, nc, nm, p + k]);
      }
    }
    return null;
  }
  function uret([plan, R, C, izin, min, max, damlaSay]) {
    for (let deneme = 0; deneme < 20000; deneme++) {
      const yer = () => [Math.floor(rnd() * R), Math.floor(rnd() * C)];
      const bas = yer(), hedef = yer(), damlalar = [];
      for (let q = 0; q < damlaSay; q++) damlalar.push(yer());
      const tum = [bas, hedef, ...damlalar].map(String);
      if (new Set(tum).size !== tum.length) continue;
      const b = { plan, R, C, izin, bas, hedef, damla: damlalar };
      const cz = coz(b, izin);
      if (!cz || cz.length < min || cz.length > max) continue;
      // Az yönlü bölümlerde verilen her yön kullanılsın; çok yönlüde en az iki yön
      const kullan = new Set(cz);
      if (izin.length <= 2 ? kullan.size !== izin.length : kullan.size < 2) continue;
      // Damla yoldan sapmayı gerektirsin (yaprakla aynı doğrultuda kalmasın)
      if (damlaSay && coz({ ...b, damla: [] }, izin).length === cz.length) continue;
      b.cicek = [];
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (!tum.includes(String([r, c])) && rnd() < 0.18) b.cicek.push([r, c, sec(["#ff7ab8", "#ffffff", "#ffd34d"])]);
      return { ...b, cozum: cz };
    }
    throw new Error("bölüm kurulamadı");
  }
  // [plan mı, satır, sütun, izinli yönler, en kısa aralığı, damla]
  const T = [
    [0, 1, 4, "s", 3, 3, 0], [0, 1, 5, "s", 4, 4, 0], [0, 3, 3, "a", 2, 2, 0],
    [0, 3, 3, "sa", 3, 4, 0], [0, 3, 4, "ly", 3, 4, 0], [0, 4, 4, "yals", 4, 5, 0],
    [1, 1, 4, "s", 2, 3, 0], [1, 3, 3, "sa", 2, 3, 0], [1, 3, 4, "sa", 3, 4, 0], [1, 3, 4, "ly", 3, 4, 0], [1, 4, 4, "yals", 4, 4, 0], [1, 4, 4, "yals", 4, 5, 0],
    [1, 4, 5, "yals", 5, 5, 0], [1, 4, 5, "yals", 5, 6, 0], [1, 4, 5, "yals", 6, 6, 0], [1, 4, 5, "yals", 4, 5, 1], [1, 4, 5, "yals", 5, 6, 1], [1, 4, 5, "yals", 6, 6, 1],
    [1, 5, 5, "yals", 6, 6, 1], [1, 5, 5, "yals", 6, 7, 1], [1, 5, 5, "yals", 6, 7, 1], [1, 5, 5, "yals", 7, 7, 1], [1, 5, 5, "yals", 6, 7, 2], [1, 5, 5, "yals", 7, 7, 2],
    [1, 5, 5, "yals", 7, 8, 1], [1, 5, 5, "yals", 7, 8, 2], [1, 5, 5, "yals", 7, 8, 2], [1, 5, 5, "yals", 8, 8, 2], [1, 5, 5, "yals", 8, 8, 2], [1, 5, 5, "yals", 8, 8, 2],
  ];
  const BOLUMLER = T.map((t, i) => ({ ...uret(t), grup: Uygulama.seviye(i), ek: i < 12 ? 1 : 2 }));

  // ---------- Oyun ----------
  const stil = `
  .ub { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f0f9e8, #e1f2d6); }
  .ub-sahne { --k: 90px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 24px; padding: 8px 16px 16px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .ub-sahne.dikey { flex-direction: column; gap: 12px; justify-content: safe center; overflow-y: auto; }
  .ub-cayir { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 10px; border-radius: 24px; background: #8fd36a; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .ub-kare { position: relative; }
  .ub-kare::before { content: ""; position: absolute; inset: 5%; border-radius: 26%; background: #a3dc80; }
  .ub-kare > svg { position: absolute; inset: 10%; width: 80%; height: 80%; z-index: 1; }
  .ub-kare.cicek > svg { inset: 30%; width: 40%; height: 40%; opacity: .85; }
  .ub-kare.damla > svg { inset: 24%; width: 52%; height: 52%; transition: transform .3s, opacity .3s; }
  .ub-kare.alindi > svg { transform: scale(1.5) translateY(-16px); opacity: 0; }
  .ub-kare.iz::after { content: ""; position: absolute; left: 42%; top: 42%; width: 16%; height: 16%; border-radius: 50%; background: rgba(255,255,255,.75); }
  .ub-kare.hedef > svg { animation: ub-nefes 1.6s ease-in-out infinite; }
  @keyframes ub-nefes { 50% { transform: scale(1.08); } }
  .ub-kare.hedef.vardi > svg { animation: ub-nefes .4s ease-in-out 3; }
  .ub-bocek { position: absolute; left: 10px; top: 10px; width: var(--k); height: var(--k); transition: transform .45s ease-in-out; pointer-events: none; z-index: 3; }
  .ub-bocek > div { position: absolute; inset: 12%; transition: transform .3s ease-in-out; }
  .ub-bocek svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.25)); }
  .ub-bocek.uzgun svg { animation: ub-salla .5s 2; }
  @keyframes ub-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  .ub-yan { display: grid; justify-items: center; gap: 14px; }
  .ub-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: min(100%, 520px); box-sizing: border-box; }
  .ub-yer { width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); cursor: pointer; }
  .ub-yer.dolu { border: 0; background: none; }
  .ub-yer svg { width: 100%; height: 100%; display: block; }
  .ub-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .ub-yer.hata { outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; animation: ub-salla .5s 2; }
  .ub-yer.hedefte { border-color: var(--mavi); background: #d4e8ff; }
  .ub-alt { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .ub-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 10px; }
  .ub-oklar.tek { display: flex; }
  .ub-oklar .ub-kart[data-k="y"] { grid-column: 2; grid-row: 1; } .ub-oklar .ub-kart[data-k="l"] { grid-column: 1; grid-row: 2; } .ub-oklar .ub-kart[data-k="a"] { grid-column: 2; grid-row: 2; } .ub-oklar .ub-kart[data-k="s"] { grid-column: 3; grid-row: 2; }
  .ub-kart { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 6px 0 rgba(29,40,70,.16); cursor: pointer; touch-action: none; }
  .ub-kart:active { transform: translateY(4px); box-shadow: 0 2px 0 rgba(29,40,70,.16); }
  .ub-kart svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .ub-sahne.dogrudan .ub-kart { animation: ub-nefes 1.6s ease-in-out infinite; }
  .ub-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); }
  .ub-tasinan svg { width: 100%; height: 100%; display: block; }
  .ub-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .ub-calistir svg { width: 30px; height: 30px; }
  .ub-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ub-stil")) { const st = document.createElement("style"); st.id = "ub-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ub"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ub-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ub-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); } }); }

  function cayirHtml(b) {
    let s = "";
    for (let r = 0; r < b.R; r++) for (let c = 0; c < b.C; c++) {
      const ci = b.cicek.find(([a, e]) => a === r && e === c);
      if (r === b.hedef[0] && c === b.hedef[1]) s += `<div class="ub-kare hedef" data-z="${r},${c}">${yaprak}</div>`;
      else if (b.damla.some(([a, e]) => a === r && e === c)) s += `<div class="ub-kare damla" data-z="${r},${c}">${damla}</div>`;
      else s += `<div class="ub-kare${ci ? " cicek" : ""}" data-z="${r},${c}">${ci ? cicek(ci[2]) : ""}</div>`;
    }
    return s + `<div class="ub-bocek"><div>${bocek}</div></div>`;
  }
  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.program = []; d.yer = [...b.bas]; d.aci = ACI[b.cozum[0]]; d.alinan = new Set();
    d.yerSayi = b.plan ? Math.min(12, b.cozum.length + b.ek) : 0;
    const kartlar = ["y", "l", "a", "s"].filter((k) => b.izin.includes(k));
    d.sahne.classList.toggle("dogrudan", !b.plan);
    d.sahne.innerHTML = `
      <div class="ub-cayir" style="--C:${b.C}">${cayirHtml(b)}</div>
      <div class="ub-yan">
        ${b.plan ? `<div class="ub-program" aria-label="Plan">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="ub-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. adım"></div>`).join("")}</div>` : ""}
        <div class="ub-alt">
          <div class="ub-oklar${kartlar.length < 4 ? " tek" : ""}" aria-label="Ok kartları">${kartlar.map((k) => `<button class="ub-kart" type="button" data-k="${k}" aria-label="${KART[k].ad}">${kartSvg(k)}</button>`).join("")}</div>
          ${b.plan ? `<button class="ub-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Başla</span></button>` : ""}
        </div>
      </div>`;
    d.cayir = d.sahne.querySelector(".ub-cayir");
    d.bocek = d.sahne.querySelector(".ub-bocek");
    d.programEl = d.sahne.querySelector(".ub-program");
    d.dugme = d.sahne.querySelector(".ub-calistir");
    if (d.dugme) d.dugme.onclick = calistir;
    if (d.programEl) d.programEl.querySelectorAll(".ub-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".ub-kart").forEach((btn) => (b.plan ? kartTasi(btn) : (btn.onclick = () => dogrudanGit(btn.dataset.k))));
    programCiz();
    boyutla();
  }
  const kareEl = (r, c) => d.cayir.querySelector(`.ub-kare[data-z="${r},${c}"]`);
  function programCiz() {
    if (!d.programEl) return;
    d.programEl.querySelectorAll(".ub-yer").forEach((y, j) => { y.className = "ub-yer" + (j < d.program.length ? " dolu" : ""); y.innerHTML = j < d.program.length ? kartSvg(d.program[j]) : ""; });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }
  function boyutla() {
    if (!d || !d.cayir) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.1;
    d.sahne.classList.toggle("dikey", dikey);
    const p = Math.max(52, Math.min(80, Math.floor((dikey ? W - 30 : W * 0.4) / Math.min(Math.max(d.yerSayi, 4), 6) - 10)));
    const satir = d.yerSayi ? Math.ceil(d.yerSayi / Math.max(1, Math.floor(((dikey ? W : W * 0.4) - 24) / (p + 8)))) : 0;
    const k = dikey ? Math.min((W - 24) / b.C, (H - satir * (p + 8) - 2 * p - 120) / b.R, 120) : Math.min((W * 0.55 - 24) / b.C, (H - 24) / b.R, 130);
    d.k = Math.max(44, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px"); d.sahne.style.setProperty("--p", p + "px");
    bocekKoy(...d.yer, d.aci, false);
  }
  function bocekKoy(r, c, aci, anim = true) {
    d.yer = [r, c]; d.aci = aci;
    const g = d.bocek.firstElementChild;
    d.bocek.style.transition = anim ? "" : "none"; g.style.transition = anim ? "" : "none";
    d.bocek.style.transform = `translate(${c * d.k}px, ${r * d.k}px)`;
    g.style.transform = `rotate(${aci}deg)`;
    if (!anim) { void d.bocek.offsetWidth; d.bocek.style.transition = ""; g.style.transition = ""; }
  }
  const donAci = (eski, yeni) => eski + ((((yeni - eski) % 360) + 540) % 360) - 180;

  // Tek adım: döner, gider; çayırın dışına çıkamaz. Sonuç: "tamam" | "duvar"
  async function adim(k, benim) {
    const b = BOLUMLER[d.idx];
    let [r, c] = d.yer, aci = d.aci;
    if (ACI[k] !== ((aci % 360) + 360) % 360) { aci = donAci(aci, ACI[k]); bocekKoy(r, c, aci); await bekle(240); if (!d || benim !== d.uid) return null; }
    const nr = r + YON[k][0], nc = c + YON[k][1];
    if (nr < 0 || nr >= b.R || nc < 0 || nc >= b.C) {
      bocekKoy(r + YON[k][0] * 0.3, c + YON[k][1] * 0.3, aci); await bekle(220); if (!d || benim !== d.uid) return null;
      bocekKoy(r, c, aci); d.api.ses.hata(); return "duvar";
    }
    kareEl(r, c).classList.add("iz");
    bocekKoy(nr, nc, aci);
    await bekle(460); if (!d || benim !== d.uid) return null;
    const dm = b.damla.findIndex(([a, e]) => a === nr && e === nc);
    if (dm >= 0 && !d.alinan.has(dm)) { d.alinan.add(dm); kareEl(nr, nc).classList.add("alindi"); d.api.ses.ton(990, 0.15); }
    return "tamam";
  }
  const vardi = () => { const b = BOLUMLER[d.idx]; return d.yer[0] === b.hedef[0] && d.yer[1] === b.hedef[1] && d.alinan.size === b.damla.length; };

  // Doğrudan kumanda: karta dokununca böcek hemen gider
  async function dogrudanGit(k) {
    if (d.calisiyor) return;
    d.calisiyor = true; d.api.ses.adim(0);
    const benim = d.uid, s = await adim(k, benim);
    if (!d || benim !== d.uid || s === null) return;
    // Verilen oklarla yaprağa artık ulaşılamıyorsa böcek üzülür ve başa döner
    const b = BOLUMLER[d.idx];
    if (!vardi() && !coz({ ...b, bas: d.yer, damla: b.damla.filter((_, q) => !d.alinan.has(q)) }, b.izin)) {
      d.bocek.classList.add("uzgun"); d.api.ses.hata();
      await bekle(1100); if (!d || benim !== d.uid) return;
      d.cayir.innerHTML = cayirHtml(b); d.bocek = d.cayir.querySelector(".ub-bocek");
      d.alinan = new Set(); d.yer = [...b.bas]; d.aci = ACI[b.cozum[0]]; boyutla();
    }
    d.calisiyor = false;
    if (vardi()) { d.calisiyor = true; kareEl(...BOLUMLER[d.idx].hedef).classList.add("vardi"); d.api.ses.yerlesti(); await bekle(500); if (!d || benim !== d.uid) return; bitir(); }
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
      if (!ucan) { ucan = document.createElement("div"); ucan.className = "ub-tasinan"; const rr = btn.getBoundingClientRect(); ucan.style.width = ucan.style.height = rr.width + "px"; ucan.innerHTML = kartSvg(k); document.body.appendChild(ucan); }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY), yer = alt && alt.closest(".ub-yer");
      if (hedef && hedef !== yer) hedef.classList.remove("hedefte");
      hedef = yer || null; if (hedef) hedef.classList.add("hedefte");
    });
    const birak = () => { if (!aktif) return; aktif = false; if (ucan) { ucan.remove(); ucan = null; if (hedef) { hedef.classList.remove("hedefte"); kartKoy(k, +hedef.dataset.j); } hedef = null; } else kartKoy(k); };
    btn.addEventListener("pointerup", birak); btn.addEventListener("pointercancel", birak);
  }
  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, b = BOLUMLER[d.idx], yerler = [...d.programEl.querySelectorAll(".ub-yer")];
    let hata = -1;
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((e, q) => e.classList.toggle("simdi", q === j));
      d.api.ses.adim(j % 8);
      const s = await adim(d.program[j], benim);
      if (s === null) return;
      if (s === "duvar") { hata = j; break; }
      if (vardi()) break;
    }
    yerler.forEach((e) => e.classList.remove("simdi"));
    if (vardi()) { kareEl(...b.hedef).classList.add("vardi"); d.api.ses.yerlesti(); await bekle(600); if (!d || benim !== d.uid) return; return bitir(); }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.bocek.classList.add("uzgun"); d.api.ses.hata();
    await bekle(1500);
    if (!d || benim !== d.uid) return;
    d.bocek.classList.remove("uzgun"); yerler.forEach((e) => e.classList.remove("hata"));
    d.cayir.innerHTML = cayirHtml(b); d.bocek = d.cayir.querySelector(".ub-bocek");
    d.alinan = new Set(); d.yer = [...b.bas]; boyutla();
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Uğur böceği bütün yapraklara ulaştı!" : "Son yaprağa da ulaştı!") : "Uğur böceği yaprağa ulaştı!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.UGUR_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(39, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const b = BOLUMLER[d.idx];
      // Doğrudan kumandada: böcek → sıradaki doğru karta dokun. Planda: ilk iki kartı şeride taşı, sonra Başla.
      if (!b.plan) { const kalan = coz({ ...b, bas: d.yer, damla: b.damla.filter((_, q) => !d.alinan.has(q)) }, b.izin) || ""; return [{ el: d.bocek }, ...(kalan ? [{ el: d.sahne.querySelector(`.ub-kart[data-k="${kalan[0]}"]`) }] : [])]; }
      const sol = [...b.cozum].slice(0, 2);
      return [{ el: d.bocek }, ...sol.map((k, j) => ({ el: d.sahne.querySelector(`.ub-kart[data-k="${k}"]`), hedef: d.sahne.querySelector(`.ub-yer[data-j="${j}"]`) })), { el: d.dugme }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${bocek}${kartSvg("s")}${yaprak}</div>`; },
  });
})();
