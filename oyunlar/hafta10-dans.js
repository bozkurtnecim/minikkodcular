/* 10. Hafta: Dans Eden Robot (komut dizisi = program).
   Okuma gerektirmez: kartlarda yazı yok, her hareketin kendi rengi ve resmi var.
   Örnek robotun dansını izle, aynı dansı kartlarla kendi robotuna yaptır.
   30 bölüm: çok kolay 3 ve kolay 3 (kartlar açık), orta 6 (kartlar dans
   bitince kapanır), zor 6 ve çok zor 12 (kart yok, yalnız dansı izle). */
(function () {
  const KAYIT = "dans";

  const HAREKET = {
    zipla: { renk: "#ffc23a", koyu: "#d89a12", ad: "Zıpla" },
    alkis: { renk: "#ff8a1f", koyu: "#d96a0a", ad: "Alkışla" },
    don: { renk: "#2fb36a", koyu: "#1f8a4f", ad: "Dön" },
    kollar: { renk: "#2f86e0", koyu: "#1f62ab", ad: "Kollar yukarı" },
    egil: { renk: "#8a5cf0", koyu: "#6a3fcc", ad: "Eğil" },
  };
  const ADLAR = Object.keys(HAREKET);

  const B = (seviye, dans, gosterim) => ({ seviye, dans, gosterim });
  const BOLUMLER = [
    B("Çok kolay", ["zipla", "alkis"], "acik"),
    B("Çok kolay", ["kollar", "egil"], "acik"),
    B("Çok kolay", ["don", "zipla"], "acik"),
    B("Kolay", ["alkis", "zipla", "kollar"], "acik"),
    B("Kolay", ["egil", "don", "alkis"], "acik"),
    B("Kolay", ["kollar", "zipla", "egil"], "acik"),

    B("Orta", ["zipla", "zipla", "alkis"], "kapanir"),
    B("Orta", ["don", "kollar", "egil"], "kapanir"),
    B("Orta", ["alkis", "egil", "alkis"], "kapanir"),
    B("Orta", ["kollar", "don", "zipla", "alkis"], "kapanir"),
    B("Orta", ["egil", "zipla", "egil", "zipla"], "kapanir"),
    B("Orta", ["alkis", "kollar", "don", "egil"], "kapanir"),

    B("Zor", ["zipla", "alkis", "don"], "gizli"),
    B("Zor", ["kollar", "kollar", "egil", "zipla"], "gizli"),
    B("Zor", ["don", "alkis", "alkis", "kollar"], "gizli"),
    B("Zor", ["egil", "kollar", "zipla", "don"], "gizli"),
    B("Zor", ["alkis", "zipla", "egil", "kollar", "don"], "gizli"),
    B("Zor", ["zipla", "don", "zipla", "don", "alkis"], "gizli"),

    B("Çok zor", ["kollar", "egil", "kollar", "egil", "zipla"], "gizli"),
    B("Çok zor", ["alkis", "alkis", "don", "alkis", "alkis"], "gizli"),
    B("Çok zor", ["don", "zipla", "egil", "alkis", "kollar"], "gizli"),
    B("Çok zor", ["zipla", "zipla", "kollar", "zipla", "zipla", "kollar"], "gizli"),
    B("Çok zor", ["egil", "don", "alkis", "egil", "don", "alkis"], "gizli"),
    B("Çok zor", ["kollar", "alkis", "zipla", "egil", "don", "kollar"], "gizli"),
    B("Çok zor", ["alkis", "kollar", "alkis", "kollar", "don", "don"], "gizli"),
    B("Çok zor", ["zipla", "egil", "zipla", "egil", "zipla", "alkis"], "gizli"),
    B("Çok zor", ["don", "kollar", "egil", "zipla", "alkis", "don"], "gizli"),
    B("Çok zor", ["egil", "egil", "alkis", "zipla", "zipla", "kollar", "don"], "gizli"),
    B("Çok zor", ["kollar", "zipla", "alkis", "kollar", "zipla", "alkis", "egil"], "gizli"),
    B("Çok zor", ["don", "alkis", "egil", "kollar", "zipla", "egil", "don"], "gizli"),
  ];

  // ---------- Kart resimleri (yazısız) ----------
  const kucukRobot = (ic) => `<g fill="#fff">${ic}</g>`;
  const IKON = {
    zipla: kucukRobot(`<rect x="38" y="30" width="24" height="22" rx="5"/><rect x="34" y="54" width="32" height="24" rx="6"/><path d="M40 78 l-6 10 M60 78 l6 10" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M50 22 V6 M42 13 L50 5 L58 13" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 96 h52" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`),
    alkis: kucukRobot(`<path d="M30 70 C22 50 30 30 42 28 L48 60 Z"/><path d="M70 70 C78 50 70 30 58 28 L52 60 Z"/><path d="M50 18 V8 M34 22 L28 14 M66 22 L72 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/><rect x="40" y="70" width="20" height="20" rx="5"/>`),
    don: `<path d="M50 18 A32 32 0 1 1 20 40" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M8 34 L22 46 L30 28 Z" fill="#fff"/><rect x="40" y="38" width="20" height="18" rx="4" fill="#fff"/><rect x="38" y="58" width="24" height="18" rx="5" fill="#fff"/>`,
    kollar: kucukRobot(`<rect x="38" y="34" width="24" height="22" rx="5"/><rect x="34" y="58" width="32" height="26" rx="6"/><path d="M34 62 L18 30 M66 62 L82 30" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="16" cy="26" r="6"/><circle cx="84" cy="26" r="6"/><path d="M42 84 v10 M58 84 v10" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`),
    egil: kucukRobot(`<rect x="30" y="44" width="24" height="22" rx="5" transform="rotate(30 42 55)"/><rect x="48" y="50" width="28" height="22" rx="6"/><path d="M54 72 l-6 18 M70 72 l4 18" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M28 12 V30 M20 23 L28 31 L36 23" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  };
  const kart = (h) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" rx="18" fill="${HAREKET[h].renk}"/><rect x="2" y="84" width="96" height="14" rx="7" fill="${HAREKET[h].koyu}" opacity=".5"/>${IKON[h]}</svg>`;
  const kartArka = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" rx="18" fill="#c3d3e6"/><text x="50" y="68" font-family="Baloo 2, Arial, sans-serif" font-weight="800" font-size="52" fill="#fff" text-anchor="middle">?</text></svg>`;

  // Robot: kollar ve gövde ayrı gruplarda; CSS animasyonlarla oynatılır
  const robot = (renk, koyu) => `<svg viewBox="0 0 120 170" class="dr-robot" aria-hidden="true">
    <ellipse cx="60" cy="164" rx="36" ry="5" fill="rgba(29,40,70,.15)" class="golge"/>
    <g class="beden">
      <g class="bacak"><rect x="40" y="118" width="14" height="36" rx="6" fill="${koyu}"/><rect x="66" y="118" width="14" height="36" rx="6" fill="${koyu}"/><rect x="34" y="148" width="24" height="10" rx="5" fill="#3d4a5c"/><rect x="62" y="148" width="24" height="10" rx="5" fill="#3d4a5c"/></g>
      <g class="ust">
        <g class="kol-sol"><rect x="14" y="70" width="14" height="40" rx="7" fill="${koyu}"/><circle cx="21" cy="112" r="8" fill="#c9d6e4"/></g>
        <g class="kol-sag"><rect x="92" y="70" width="14" height="40" rx="7" fill="${koyu}"/><circle cx="99" cy="112" r="8" fill="#c9d6e4"/></g>
        <rect x="28" y="66" width="64" height="56" rx="14" fill="${renk}"/><rect x="42" y="80" width="36" height="22" rx="6" fill="#fff" opacity=".85"/><circle cx="52" cy="91" r="4" fill="#ff5a4e"/><circle cx="68" cy="91" r="4" fill="#ffc23a"/>
        <rect x="54" y="56" width="12" height="12" fill="${koyu}"/>
        <rect x="32" y="14" width="56" height="44" rx="14" fill="${renk}"/><circle cx="48" cy="36" r="8" fill="#fff"/><circle cx="72" cy="36" r="8" fill="#fff"/><circle cx="49" cy="37" r="4" fill="#26201f"/><circle cx="73" cy="37" r="4" fill="#26201f"/><path d="M50 48 q10 6 20 0" stroke="#26201f" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M60 14 V4" stroke="${koyu}" stroke-width="4"/><circle cx="60" cy="4" r="5" fill="#ff5a4e" class="anten"/>
      </g>
    </g></svg>`;

  const stil = `
  .dr { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--mor); }
  .dr-sahne { --k: 84px; --rb: 150px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 8px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .dr-sahneler { display: flex; gap: 24px; align-items: flex-end; justify-content: center; }
  .dr-kosk { display: grid; justify-items: center; gap: 8px; }
  .dr-kosk .dr-robot { width: var(--rb); height: calc(var(--rb) * 1.42); overflow: visible; display: block; }
  .dr-kosk.ornek { padding: 8px 14px 0; border-radius: 26px 26px 12px 12px; background: radial-gradient(ellipse at 50% 0, rgba(255,226,122,.55), transparent 70%); }
  .dr-dugmeler { display: flex; gap: 12px; }
  .dr-dugme { width: 64px; height: 64px; border: 0; border-radius: 50%; display: grid; place-items: center; color: #fff; cursor: pointer; box-shadow: 0 6px 0 rgba(29,40,70,.2); }
  .dr-dugme svg { width: 34px; height: 34px; }
  .dr-dugme.izle { background: var(--mor); }
  .dr-dugme.oynat { background: var(--yesil); width: 76px; height: 76px; }
  .dr-dugme:disabled { background: #b9c6d6; cursor: default; }
  .dr-dugme:not(:disabled):active { transform: translateY(4px); box-shadow: 0 2px 0 rgba(29,40,70,.2); }
  .dr-serit { display: flex; gap: 10px; padding: 10px 14px; border-radius: 20px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); }
  .dr-serit.ornek-serit { background: rgba(255,255,255,.6); box-shadow: none; padding: 6px 10px; gap: 6px; }
  .dr-serit.ornek-serit .dr-yer { width: calc(var(--k) * .62); height: calc(var(--k) * .62); }
  .dr-yer { position: relative; width: var(--k); height: var(--k); border-radius: 16px; border: 4px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); flex: none; }
  .dr-yer.dolu { border: 0; background: none; cursor: pointer; }
  .dr-yer svg { display: block; width: 100%; height: 100%; }
  .dr-yer.simdi { outline: 5px solid var(--sari); outline-offset: 3px; border-radius: 18px; }
  .dr-yer.dogru::after { content: "✓"; position: absolute; top: -10px; right: -10px; width: 26px; height: 26px; border-radius: 50%; background: var(--yesil); color: #fff; font-weight: 900; display: grid; place-items: center; font-size: 15px; }
  .dr-yer.yanlis { animation: dr-salla .5s 2; }
  .dr-yer.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .dr-palet { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; padding: 10px 16px; border-radius: 22px; border: 3px dashed var(--cizgi); background: var(--zemin-2); }
  .dr-kart { width: var(--k); height: var(--k); padding: 0; border: 0; background: none; cursor: grab; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); touch-action: none; }
  .dr-kart svg { display: block; width: 100%; height: 100%; pointer-events: none; }
  .dr-kart:active { transform: translateY(3px); }
  .dr-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .dr-tasinan svg { width: 100%; height: 100%; display: block; }
  @keyframes dr-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  .dr-robot .beden, .dr-robot .ust, .dr-robot .kol-sol, .dr-robot .kol-sag, .dr-robot .golge { transform-box: view-box; }
  .dr-robot .kol-sol { transform-origin: 21px 72px; } .dr-robot .kol-sag { transform-origin: 99px 72px; }
  .dr-robot .beden { transform-origin: 60px 160px; } .dr-robot .ust { transform-origin: 60px 118px; } .dr-robot .golge { transform-origin: 60px 164px; }
  .h-zipla .beden { animation: dr-zipla .7s ease-in-out; } .h-zipla .golge { animation: dr-golge .7s ease-in-out; }
  .h-alkis .kol-sol { animation: dr-alkis-sol .7s ease-in-out; } .h-alkis .kol-sag { animation: dr-alkis-sag .7s ease-in-out; }
  .h-don .beden { animation: dr-don .7s ease-in-out; }
  .h-kollar .kol-sol { animation: dr-kol-sol .7s ease-in-out; } .h-kollar .kol-sag { animation: dr-kol-sag .7s ease-in-out; }
  .h-egil .ust { animation: dr-egil .7s ease-in-out; }
  .h-uzgun .ust { animation: dr-uzgun .8s ease-in-out; }
  @keyframes dr-zipla { 40% { transform: translateY(-38px); } 70% { transform: translateY(0) scaleY(.92); } }
  @keyframes dr-golge { 40% { transform: scale(.6); opacity: .5; } }
  @keyframes dr-alkis-sol { 25%, 75% { transform: rotate(-70deg); } 50% { transform: rotate(-40deg); } }
  @keyframes dr-alkis-sag { 25%, 75% { transform: rotate(70deg); } 50% { transform: rotate(40deg); } }
  @keyframes dr-don { 50% { transform: scaleX(-1); } }
  @keyframes dr-kol-sol { 30%, 70% { transform: rotate(160deg); } }
  @keyframes dr-kol-sag { 30%, 70% { transform: rotate(-160deg); } }
  @keyframes dr-egil { 30%, 70% { transform: rotate(28deg) translateY(6px); } }
  @keyframes dr-uzgun { 25%, 75% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
  `;

  const gozIkon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const oynatIkon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>`;
  const NOTA = { zipla: 0, alkis: 2, don: 4, kollar: 5, egil: 7 };
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("dr-stil")) {
      const st = document.createElement("style"); st.id = "dr-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="dr"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="dr-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".dr-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.seviye), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.program = b.dans.map(() => null);
    d.sahne.innerHTML = `
      <div class="dr-sahneler">
        <div class="dr-kosk ornek">${robot("#a07cf5", "#6a3fcc")}
          ${b.gosterim === "gizli" ? "" : `<div class="dr-serit ornek-serit">${b.dans.map((h) => `<div class="dr-yer dolu" data-h="${h}">${kart(h)}</div>`).join("")}</div>`}
        </div>
        <div class="dr-dugmeler" style="flex-direction:column;align-self:center"><button class="dr-dugme izle" type="button" aria-label="Örnek dansı izle">${gozIkon}</button></div>
        <div class="dr-kosk benim">${robot("#5aa8f0", "#1f62ab")}</div>
      </div>
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;justify-content:center">
        <div class="dr-serit program">${d.program.map((_, j) => `<div class="dr-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. adım"></div>`).join("")}</div>
        <button class="dr-dugme oynat" type="button" aria-label="Robotu oynat">${oynatIkon}</button>
      </div>
      <div class="dr-palet" aria-label="Hareket kartları">${ADLAR.map((h) => `<button class="dr-kart" type="button" data-h="${h}" aria-label="${HAREKET[h].ad}">${kart(h)}</button>`).join("")}</div>`;
    d.ornek = d.sahne.querySelector(".ornek .dr-robot");
    d.benim = d.sahne.querySelector(".benim .dr-robot");
    d.ornekSerit = d.sahne.querySelector(".ornek-serit");
    d.serit = d.sahne.querySelector(".program");
    d.izleDugme = d.sahne.querySelector(".izle");
    d.oynatDugme = d.sahne.querySelector(".oynat");
    d.izleDugme.onclick = () => ornekDans();
    d.oynatDugme.onclick = oynat;
    d.serit.querySelectorAll(".dr-yer").forEach((y) => (y.onclick = () => { if (d.mesgul) return; const j = +y.dataset.j; if (d.program[j]) { d.program[j] = null; seritCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".dr-kart").forEach(kartTasi);
    seritCiz();
    boyutla();
    // Bölüm açılınca örnek robot dansını bir kez gösterir
    const benimUid = d.uid;
    setTimeout(() => { if (d && d.uid === benimUid) ornekDans(); }, 700);
  }

  function seritCiz() {
    d.serit.querySelectorAll(".dr-yer").forEach((y, j) => {
      y.className = "dr-yer" + (d.program[j] ? " dolu" : "");
      y.innerHTML = d.program[j] ? kart(d.program[j]) : "";
    });
    d.oynatDugme.disabled = d.mesgul || d.program.some((h) => !h);
  }

  function boyutla() {
    if (!d || !d.serit) return;
    const n = BOLUMLER[d.idx].dans.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    const kG = Math.min((W - 30 - (n - 1) * 10 - (W > 700 ? 100 : 0)) / n, (W - 34 - 4 * 12) / 5);
    const k = Math.max(44, Math.floor(Math.min(kG, 96, (H - 40) / 6.2)));
    const rb = Math.max(80, Math.floor(Math.min((W - 140) / 2.4, (H - k * 2.6 - 70) / 1.42 - (BOLUMLER[d.idx].gosterim === "gizli" ? 0 : k * 0.7), 170)));
    d.sahne.style.setProperty("--k", k + "px");
    d.sahne.style.setProperty("--rb", rb + "px");
  }

  function hareketYap(rb, h) {
    rb.classList.remove(...ADLAR.map((a) => "h-" + a), "h-uzgun");
    void rb.getBoundingClientRect();
    rb.classList.add("h-" + h);
  }

  async function ornekDans() {
    if (d.mesgul) return;
    d.mesgul = true; d.izleDugme.disabled = true; seritCiz();
    const benim = d.uid, b = BOLUMLER[d.idx];
    const yerler = d.ornekSerit ? [...d.ornekSerit.querySelectorAll(".dr-yer")] : [];
    // "kapanır" bölümlerde kartlar dans sırasında görünür, sonra kapanır
    if (b.gosterim === "kapanir") yerler.forEach((y, j) => (y.innerHTML = kart(b.dans[j])));
    await bekle(200);
    for (let j = 0; j < b.dans.length; j++) {
      if (!d || benim !== d.uid) return;
      yerler.forEach((y, k) => y.classList.toggle("simdi", k === j));
      hareketYap(d.ornek, b.dans[j]);
      d.api.ses.adim(NOTA[b.dans[j]]);
      await bekle(850);
    }
    if (!d || benim !== d.uid) return;
    yerler.forEach((y) => y.classList.remove("simdi"));
    if (b.gosterim === "kapanir") yerler.forEach((y) => (y.innerHTML = kartArka));
    d.mesgul = false; d.izleDugme.disabled = false; seritCiz();
  }

  function kartKoy(h, j) {
    if (d.mesgul) return;
    if (j == null) j = d.program.indexOf(null);
    if (j < 0) return;
    d.program[j] = h;
    seritCiz();
    d.api.ses.adim(NOTA[h]);
  }

  function kartTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const h = btn.dataset.h;
    btn.addEventListener("pointerdown", (e) => {
      if (d.mesgul) return;
      e.preventDefault();
      aktif = true; bx = e.clientX; by = e.clientY;
      btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) {
        ucan = document.createElement("div");
        ucan.className = "dr-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = kart(h);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const y = alt && alt.closest(".program .dr-yer");
      if (hedef && hedef !== y) hedef.classList.remove("hedef");
      hedef = y || null; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) {
        ucan.remove(); ucan = null;
        if (hedef) { hedef.classList.remove("hedef"); kartKoy(h, +hedef.dataset.j); }
        hedef = null;
      } else kartKoy(h);
    };
    btn.addEventListener("pointerup", birak);
    btn.addEventListener("pointercancel", birak);
    btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kartKoy(h); } });
  }

  // Çocuğun programını oynat, örnekle karşılaştır
  async function oynat() {
    if (d.mesgul || d.program.some((h) => !h)) return;
    d.mesgul = true; d.izleDugme.disabled = true; seritCiz();
    const benim = d.uid, b = BOLUMLER[d.idx];
    const yerler = [...d.serit.querySelectorAll(".dr-yer")];
    let ilkYanlis = -1;
    for (let j = 0; j < d.program.length; j++) {
      if (!d || benim !== d.uid) return;
      yerler.forEach((y, k) => y.classList.toggle("simdi", k === j));
      hareketYap(d.benim, d.program[j]);
      d.api.ses.adim(NOTA[d.program[j]]);
      if (d.program[j] === b.dans[j]) yerler[j].classList.add("dogru");
      else if (ilkYanlis < 0) ilkYanlis = j;
      await bekle(850);
    }
    if (!d || benim !== d.uid) return;
    yerler.forEach((y) => y.classList.remove("simdi"));
    if (ilkYanlis < 0) {
      // İki robot birlikte dans eder
      hareketYap(d.ornek, "zipla"); hareketYap(d.benim, "zipla");
      await bekle(800);
      if (!d || benim !== d.uid) return;
      return bitir();
    }
    hareketYap(d.benim, "uzgun");
    yerler.forEach((y, j) => { if (d.program[j] !== b.dans[j]) y.classList.add("yanlis"); });
    d.api.ses.hata();
    await bekle(1300);
    if (!d || benim !== d.uid) return;
    yerler.forEach((y) => y.classList.remove("yanlis", "dogru"));
    // Yanlışta program silinir, çocuk baştan kurar
    d.program = b.dans.map(() => null);
    d.mesgul = false; d.izleDugme.disabled = false; seritCiz();
  }

  function bitir() {
    d.mesgul = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün dansları öğrendin!" : "Son dans da tamam!") : "Robotlar aynı dansı yaptı!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.DANS_BOLUMLER = BOLUMLER; // test için

  window.Uygulama.oyunEkle(10, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      const b = BOLUMLER[d.idx];
      return [{ el: d.sahne.querySelector(".dr-dugme.izle") }, { el: d.sahne.querySelector(`.dr-kart[data-h="${b.dans[0]}"]`), hedef: d.sahne.querySelector('.dr-yer[data-j="0"]') }, { el: d.sahne.querySelector(".dr-dugme.oynat") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-dans" aria-hidden="true">${["zipla", "alkis", "kollar"].map(kart).join("")}</div>`;
    },
  });
})();
