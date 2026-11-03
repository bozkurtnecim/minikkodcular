/* Kalem Kaplumbağa (program bir çizim üretir).
   Kaplumbağanın arkasında kalem var: yürüdüğü her yere çizgi çizer. Silik çizimi aynen çizdirecek programı yaz.
   Fazladan çizgi çizerse ya da çizim eksik kalırsa başa döner, program silinir. Aynı çizginin üstünden geçmek serbest.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "kaplumbaga";
  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = {
    u: { renk: "#2fb36a", koyu: "#1f8a4f", aci: 0, ad: "Yukarı" }, r: { renk: "#2f86e0", koyu: "#1f62ab", aci: 90, ad: "Sağa" },
    d: { renk: "#ff8a1f", koyu: "#d96a0a", aci: 180, ad: "Aşağı" }, l: { renk: "#8a5cf0", koyu: "#6a3fcc", aci: 270, ad: "Sola" },
  };
  const okSvg = (y) => { const o = OK[y]; return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${o.renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${o.koyu}" opacity=".5"/><g transform="rotate(${o.aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g></svg>`; };
  const kaplumbaga = `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="18" rx="12" ry="13" fill="#7ccf6a"/><circle cx="45" cy="15" r="2.6" fill="#26201f"/><circle cx="55" cy="15" r="2.6" fill="#26201f"/><ellipse cx="24" cy="38" rx="10" ry="8" fill="#7ccf6a"/><ellipse cx="76" cy="38" rx="10" ry="8" fill="#7ccf6a"/><ellipse cx="26" cy="74" rx="10" ry="8" fill="#7ccf6a"/><ellipse cx="74" cy="74" rx="10" ry="8" fill="#7ccf6a"/><ellipse cx="50" cy="56" rx="30" ry="32" fill="#2e9b57"/><path d="M50 30 l12 12 l-6 16 h-12 l-6 -16 z M38 58 l-10 6 M62 58 l10 6 M44 72 l-4 12 M56 72 l4 12" stroke="#1f7a43" stroke-width="3" fill="#3fb06a"/><path d="M50 86 v10" stroke="#ff5a4e" stroke-width="6" stroke-linecap="round"/></svg>`;

  // Bölüm: noktalı zemin (R x C nokta), başlangıç ve çizilecek kenarlar. Çizim kaplumbağanın bir yolundan üretilir.
  const kenarAd = (a, b) => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? `${a}|${b}` : `${b}|${a}`);
  function yolCiz(bas, prog) { const yol = [bas]; let [y, x] = bas; for (const k of prog) { y += YON[k][0]; x += YON[k][1]; yol.push([y, x]); } return yol; }
  function coz(b) {
    const hedef = new Set(b.kenarlar), tum = [...hedef];
    const kuyruk = [[b.bas[0], b.bas[1], "", ""]], gor = new Set([`${b.bas},`]);
    while (kuyruk.length) {
      const [y, x, cizili, prog] = kuyruk.shift();
      for (const k of Object.keys(YON)) {
        const ny = y + YON[k][0], nx = x + YON[k][1];
        if (ny < 0 || ny >= b.R || nx < 0 || nx >= b.C) continue;
        const ka = kenarAd([y, x], [ny, nx]);
        if (!hedef.has(ka)) continue;
        const set = new Set(cizili ? cizili.split(";") : []); set.add(ka);
        const anahtar = [...set].sort().join(";");
        if (set.size === tum.length) return prog + k;
        const key = `${ny},${nx},${anahtar}`;
        if (gor.has(key)) continue;
        gor.add(key); kuyruk.push([ny, nx, anahtar, prog + k]);
      }
    }
    return null;
  }
  // Hazır şekiller: [ad, başlangıç, program]
  const S = (ad, R, C, bas, prog) => { const yol = yolCiz(bas, [...prog]); const kenarlar = [...new Set(yol.slice(1).map((p, i) => kenarAd(yol[i], p)))]; return { ad, R, C, bas, kenarlar }; };
  const SEKILLER = [
    S("Çizgi", 3, 3, [1, 0], "rr"),
    S("Dikey çizgi", 3, 3, [0, 1], "dd"),
    S("Köşe", 3, 3, [0, 0], "rd"),
    S("L harfi", 3, 3, [0, 0], "ddr"),
    S("Uzun çizgi", 3, 4, [1, 0], "rrr"),
    S("Basamak", 3, 3, [0, 0], "rdr"),
    S("Kare", 3, 3, [0, 0], "rdlu"),
    S("Merdiven", 4, 4, [3, 0], "urur"),
    S("U harfi", 3, 3, [0, 0], "ddrru"),
    S("Ters L", 3, 4, [0, 0], "rrrd"),
    S("Zikzak", 3, 4, [0, 0], "drur"),
    S("Büyük L", 4, 4, [0, 0], "dddrr"),
    S("Dikdörtgen", 3, 4, [0, 0], "rrdllu"),
    S("Uzun merdiven", 4, 4, [3, 0], "ururur"),
    S("C harfi", 3, 3, [0, 2], "llddrr"),
    S("Yılan", 3, 4, [0, 0], "rrrdlll"),
    S("Büyük kare", 4, 4, [0, 0], "rrddlluu"),
    S("Kale burcu", 3, 5, [2, 0], "urdrurd"),
    S("T harfi", 3, 3, [0, 0], "rrldd"),
    S("Artı", 3, 3, [0, 1], "ddulrr"),
    S("İki kare", 3, 4, [0, 0], "rrrdlllu"),
    S("Ev", 4, 3, [1, 0], "urdrddlluu"),
    S("Büyük U", 4, 4, [0, 0], "dddrrruuu"),
    S("Spiral", 4, 4, [0, 0], "rrrdddllluur"),
    S("Merdiven ve yer", 4, 4, [3, 0], "urururdddlll"),
    S("Şimşek", 3, 4, [0, 2], "ldrdl"),
    S("E harfi", 3, 3, [0, 2], "lldrldr"),
    S("Çatal", 3, 3, [2, 1], "uludrru"),
    S("Çerçeve", 4, 4, [0, 0], "rrrdddllluuu"),
    S("Pencere", 3, 3, [0, 0], "rrddlluurd"),
  ];
  const BOLUMLER = SEKILLER.map((b, i) => { const cz = coz(b); return { ...b, cozum: cz, grup: Uygulama.seviye(i), ek: i < 6 ? 1 : 2 }; });

  const stil = `
  .kb { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#fffaf0, #fdf0d8); }
  .kb-sahne { --k: 90px; --p: 62px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 22px; padding: 8px 16px 16px; overflow: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .kb-sahne.dikey { flex-direction: column; gap: 10px; justify-content: safe center; }
  .kb-kagit { position: relative; padding: 24px; border-radius: 22px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .kb-kagit svg.zemin { display: block; overflow: visible; }
  .kb-kagit .hedef { stroke: #d9cbb0; stroke-width: 10; stroke-linecap: round; stroke-dasharray: 2 16; }
  .kb-kagit .cizgi { stroke: #ff5a4e; stroke-width: 9; stroke-linecap: round; }
  .kb-kagit .cizgi.fazla { stroke: #2b2f3a; stroke-dasharray: 8 8; }
  .kb-kagit .nokta { fill: #c9d3e0; }
  .kb-kap { position: absolute; left: 0; top: 0; width: calc(var(--k) * .8); height: calc(var(--k) * .8); margin: calc(var(--k) * -.4) 0 0 calc(var(--k) * -.4); transition: transform .35s ease-in-out; pointer-events: none; z-index: 2; }
  .kb-kap > div { width: 100%; height: 100%; transition: transform .2s; }
  .kb-kap svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.2)); }
  .kb-kap.uzgun > div > svg { animation: kb-salla .5s 2; }
  @keyframes kb-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  .kb-yan { display: grid; justify-items: center; gap: 12px; }
  .kb-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: min(100%, 560px); box-sizing: border-box; }
  .kb-yer { width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); cursor: pointer; }
  .kb-yer.dolu { border: 0; background: none; }
  .kb-yer svg { width: 100%; height: 100%; display: block; }
  .kb-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .kb-yer.hata { outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; animation: kb-salla .5s 2; }
  .kb-yer.hedefte { border-color: var(--mavi); background: #d4e8ff; }
  .kb-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .kb-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; }
  .kb-ok { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .kb-ok svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .kb-ok[data-y="u"] { grid-column: 2; grid-row: 1; } .kb-ok[data-y="l"] { grid-column: 1; grid-row: 2; } .kb-ok[data-y="d"] { grid-column: 2; grid-row: 2; } .kb-ok[data-y="r"] { grid-column: 3; grid-row: 2; }
  .kb-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); }
  .kb-tasinan svg { width: 100%; height: 100%; display: block; }
  .kb-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .kb-calistir svg { width: 30px; height: 30px; }
  .kb-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("kb-stil")) { const st = document.createElement("style"); st.id = "kb-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="kb"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="kb-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".kb-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    d.program = []; d.yer = null;
    d.yerSayi = Math.min(14, b.cozum.length + b.ek);
    d.sahne.innerHTML = `
      <div class="kb-kagit"><svg class="zemin"></svg><div class="kb-kap"><div>${kaplumbaga}</div></div></div>
      <div class="kb-yan">
        <div class="kb-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="kb-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. komut"></div>`).join("")}</div>
        <div class="kb-alt">
          <div class="kb-oklar" aria-label="Ok kartları">${["u", "l", "d", "r"].map((y) => `<button class="kb-ok" type="button" data-y="${y}" aria-label="${OK[y].ad}">${okSvg(y)}</button>`).join("")}</div>
          <button class="kb-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çiz</span></button>
        </div>
      </div>`;
    d.svg = d.sahne.querySelector("svg.zemin");
    d.kap = d.sahne.querySelector(".kb-kap");
    d.programEl = d.sahne.querySelector(".kb-program");
    d.dugme = d.sahne.querySelector(".kb-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".kb-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".kb-ok").forEach(okTasi);
    d.cizili = [];
    programCiz();
    boyutla();
  }
  function zeminCiz() {
    const b = BOLUMLER[d.idx], k = d.k;
    const P = (p) => [p[1] * k, p[0] * k];
    let s = "";
    b.kenarlar.forEach((e) => { const [a, c] = e.split("|").map((t) => t.split(",").map(Number)); const [x1, y1] = P(a), [x2, y2] = P(c); s += `<line class="hedef" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; });
    d.cizili.forEach(({ a, c, fazla }) => { const [x1, y1] = P(a), [x2, y2] = P(c); s += `<line class="cizgi${fazla ? " fazla" : ""}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; });
    for (let y = 0; y < b.R; y++) for (let x = 0; x < b.C; x++) s += `<circle class="nokta" cx="${x * k}" cy="${y * k}" r="${Math.max(4, k * 0.07)}"/>`;
    d.svg.setAttribute("width", (b.C - 1) * k); d.svg.setAttribute("height", (b.R - 1) * k);
    d.svg.setAttribute("viewBox", `0 0 ${(b.C - 1) * k} ${(b.R - 1) * k}`);
    d.svg.innerHTML = s;
  }
  function programCiz() {
    d.programEl.querySelectorAll(".kb-yer").forEach((y, j) => { y.className = "kb-yer" + (j < d.program.length ? " dolu" : ""); y.innerHTML = j < d.program.length ? okSvg(d.program[j]) : ""; });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }
  function boyutla() {
    if (!d || !d.svg) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.1;
    d.sahne.classList.toggle("dikey", dikey);
    let p = Math.max(44, Math.min(70, Math.floor((dikey ? W - 30 : W * 0.42) / Math.min(d.yerSayi, 6) - 10)));
    const satir = Math.ceil(d.yerSayi / Math.max(1, Math.floor(((dikey ? W : W * 0.42) - 24) / (p + 8))));
    const k = dikey ? Math.min((W - 60) / Math.max(1, b.C - 1), (H - satir * (p + 8) - 2 * p - 120) / Math.max(1, b.R - 1), 130) : Math.min((W * 0.5 - 60) / Math.max(1, b.C - 1), (H - 70) / Math.max(1, b.R - 1), 140);
    d.k = Math.max(40, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px"); d.sahne.style.setProperty("--p", p + "px");
    zeminCiz();
    kapKoy(...(d.yer || b.bas), "u", false);
  }
  function kapKoy(y, x, yon, anim = true) {
    d.yer = [y, x];
    d.kap.style.transition = anim ? "" : "none";
    d.kap.style.transform = `translate(${24 + x * d.k}px, ${24 + y * d.k}px)`;
    d.kap.firstElementChild.style.transform = `rotate(${OK[yon].aci}deg)`;
    if (!anim) { void d.kap.offsetWidth; d.kap.style.transition = ""; }
  }
  function kartKoy(y, j) {
    if (d.calisiyor) return;
    if (j == null || j >= d.program.length) { if (d.program.length >= d.yerSayi) return; d.program.push(y); } else d.program[j] = y;
    programCiz(); d.api.ses.tik();
  }
  function okTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const y = btn.dataset.y;
    btn.addEventListener("pointerdown", (e) => { if (d.calisiyor) return; e.preventDefault(); aktif = true; bx = e.clientX; by = e.clientY; btn.setPointerCapture && btn.setPointerCapture(e.pointerId); });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) { ucan = document.createElement("div"); ucan.className = "kb-tasinan"; const rr = btn.getBoundingClientRect(); ucan.style.width = ucan.style.height = rr.width + "px"; ucan.innerHTML = okSvg(y); document.body.appendChild(ucan); }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY), yer = alt && alt.closest(".kb-yer");
      if (hedef && hedef !== yer) hedef.classList.remove("hedefte");
      hedef = yer || null; if (hedef) hedef.classList.add("hedefte");
    });
    const birak = () => { if (!aktif) return; aktif = false; if (ucan) { ucan.remove(); ucan = null; if (hedef) { hedef.classList.remove("hedefte"); kartKoy(y, +hedef.dataset.j); } hedef = null; } else kartKoy(y); };
    btn.addEventListener("pointerup", birak); btn.addEventListener("pointercancel", birak);
  }

  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, b = BOLUMLER[d.idx], hedef = new Set(b.kenarlar), yerler = [...d.programEl.querySelectorAll(".kb-yer")];
    d.cizili = []; zeminCiz();
    let [y, x] = b.bas, hata = -1;
    const cizilen = new Set();
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((e, q) => e.classList.toggle("simdi", q === j));
      const k = d.program[j], ny = y + YON[k][0], nx = x + YON[k][1];
      if (ny < 0 || ny >= b.R || nx < 0 || nx >= b.C) {
        kapKoy(y + YON[k][0] * 0.3, x + YON[k][1] * 0.3, k); await bekle(240); if (!d || benim !== d.uid) return; kapKoy(y, x, k); hata = j; break;
      }
      const ka = kenarAd([y, x], [ny, nx]), fazla = !hedef.has(ka);
      kapKoy(ny, nx, k);
      await bekle(200);
      if (!d || benim !== d.uid) return;
      d.cizili.push({ a: [y, x], c: [ny, nx], fazla }); zeminCiz();
      d.api.ses.adim(j % 8);
      y = ny; x = nx;
      await bekle(220);
      if (!d || benim !== d.uid) return;
      if (fazla) { hata = j; break; }
      cizilen.add(ka);
      if (cizilen.size === hedef.size && j === d.program.length - 1) break;
    }
    yerler.forEach((e) => e.classList.remove("simdi"));
    if (hata < 0 && cizilen.size === hedef.size) { d.api.ses.yerlesti(); await bekle(500); if (!d || benim !== d.uid) return; return bitir(); }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.kap.classList.add("uzgun"); d.api.ses.hata();
    await bekle(1600);
    if (!d || benim !== d.uid) return;
    d.kap.classList.remove("uzgun"); yerler.forEach((e) => e.classList.remove("hata"));
    d.cizili = []; zeminCiz(); kapKoy(...b.bas, "u", false);
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün çizimleri yaptın, minik ressam!" : "Son çizim de bitti!") : `${BOLUMLER[d.idx].ad} çizildi!`, son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.KAP_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(27, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const sol = [...BOLUMLER[d.idx].cozum].slice(0, tam ? undefined : 2);
      return [...sol.map((y, j) => ({ el: d.sahne.querySelector(`.kb-ok[data-y="${y}"]`), hedef: d.sahne.querySelector(`.kb-yer[data-j="${j}"]`) })), { el: d.dugme }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${kaplumbaga}<svg viewBox="0 0 60 40" style="width:56px"><path d="M6 34 V18 H24 V6 H44 V20" stroke="#ff5a4e" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>${okSvg("r")}</div>`; },
  });
})();
