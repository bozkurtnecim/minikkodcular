/* Robot Postacı (koşullu karar: "mavi zarfsa ✓ yoluna, değilse ✗ yoluna").
   Yolda kavşaklar var; her kavşağa bir koşul kartı koy (zarf rengi ya da pul şekli). Mektuplar sırayla yola çıkar:
   koşulu tutan mektup ✓ yoluna, tutmayan ✗ yoluna gider. Evlerin posta kutusunda gelmesi gereken mektuplar silik görünür.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12 (çok zorda kavşağın arkasında kavşak). */
(function () {
  const KAYIT = "postaci";
  const RENK = { k: "#ff5a4e", m: "#2f86e0", s: "#ffc23a", y: "#2fb36a" };
  const RENK_AD = { k: "Kırmızı", m: "Mavi", s: "Sarı", y: "Yeşil" };
  const SEKIL_AD = { daire: "Daire pul", yildiz: "Yıldız pul", kalp: "Kalp pul" };
  const pul = (s, x, y, b) => {
    if (s === "daire") return `<circle cx="${x}" cy="${y}" r="${b}" fill="#fff" stroke="#5d6878" stroke-width="3"/>`;
    if (s === "kalp") return `<path d="M${x} ${y + b} C${x - b * 1.4} ${y} ${x - b} ${y - b * 1.2} ${x} ${y - b * .3} C${x + b} ${y - b * 1.2} ${x + b * 1.4} ${y} ${x} ${y + b} Z" fill="#fff" stroke="#5d6878" stroke-width="3"/>`;
    const n = []; for (let i = 0; i < 10; i++) { const rr = i % 2 ? b * .45 : b, a = (Math.PI / 5) * i - Math.PI / 2; n.push(`${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`); }
    return `<polygon points="${n.join(" ")}" fill="#fff" stroke="#5d6878" stroke-width="3" stroke-linejoin="round"/>`;
  };
  const zarf = (m) => `<svg viewBox="0 0 100 80" aria-hidden="true"><rect x="4" y="8" width="92" height="64" rx="8" fill="${RENK[m.r]}"/><path d="M4 14 L50 46 L96 14" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="5"/>${pul(m.s, 76, 30, 12)}</svg>`;
  const kosulSvg = (k) => k.renk
    ? `<svg viewBox="0 0 100 80" aria-hidden="true"><rect x="4" y="8" width="92" height="64" rx="8" fill="${RENK[k.renk]}"/><path d="M4 14 L50 46 L96 14" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="5"/></svg>`
    : `<svg viewBox="0 0 100 80" aria-hidden="true"><rect x="4" y="8" width="92" height="64" rx="8" fill="#eef2f8" stroke="#c9d3e0" stroke-width="3"/>${pul(k.sekil, 50, 40, 22)}</svg>`;
  const kosulId = (k) => (k.renk ? "r" + k.renk : "s" + k.sekil);
  const uyar = (k, m) => (k.renk ? m.r === k.renk : m.s === k.sekil);
  const EV_RENK = ["#ffb38a", "#9fd3ff", "#b8e6a0", "#e2c4ff"];
  const ev = (i) => `<svg viewBox="0 0 100 90" aria-hidden="true"><path d="M8 44 L50 8 L92 44 Z" fill="#e0533f"/><rect x="16" y="42" width="68" height="44" fill="${EV_RENK[i]}"/><rect x="42" y="58" width="16" height="28" fill="#8a5a33"/><text x="50" y="36" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="18" fill="#fff">${"ABCD"[i]}</text></svg>`;

  // Ağaç: { t: "k", j: kavşak no, evet, hayir } ya da { t: "e", i: ev no }
  const YAPI = {
    tek: () => ({ t: "k", j: 0, evet: { t: "e", i: 0 }, hayir: { t: "e", i: 1 } }),
    zincir: () => ({ t: "k", j: 0, evet: { t: "e", i: 0 }, hayir: { t: "k", j: 1, evet: { t: "e", i: 1 }, hayir: { t: "e", i: 2 } } }),
    agac: () => ({ t: "k", j: 0, evet: { t: "k", j: 1, evet: { t: "e", i: 0 }, hayir: { t: "e", i: 1 } }, hayir: { t: "k", j: 2, evet: { t: "e", i: 2 }, hayir: { t: "e", i: 3 } } }),
  };
  const kavsakSay = { tek: 1, zincir: 2, agac: 3 }, evSay = { tek: 2, zincir: 3, agac: 4 };
  // Mektubun gittiği ev ve geçtiği kavşaklar
  function gonder(agac, kosullar, m) {
    const yol = []; let n = agac;
    while (n.t === "k") { const ev_ = uyar(kosullar[n.j], m); yol.push({ j: n.j, evet: ev_ }); n = ev_ ? n.evet : n.hayir; }
    return { ev: n.i, yol };
  }

  const r = (() => { let s = 2929; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const sec = (a) => a[Math.floor(r() * a.length)];
  const karistir = (a) => a.map((x) => [r(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const RENKLER = Object.keys(RENK), SEKILLER = Object.keys(SEKIL_AD);
  // turler: her kavşak için "renk" ya da "sekil"
  function bolum({ yapi, turler, n, nRenk = 3, nSekil = 2 }) {
    for (let deneme = 0; deneme < 4000; deneme++) {
      const renkler = karistir(RENKLER).slice(0, nRenk), sekiller = karistir(SEKILLER).slice(0, nSekil);
      const kosullar = turler.map((t) => (t === "renk" ? { renk: sec(renkler) } : { sekil: sec(sekiller) }));
      if (new Set(kosullar.map(kosulId)).size < (yapi === "agac" ? 2 : kosullar.length)) continue;
      const agac = YAPI[yapi]();
      const mektuplar = Array.from({ length: n }, () => ({ r: sec(renkler), s: sec(sekiller) }));
      const hedef = mektuplar.map((m) => gonder(agac, kosullar, m).ev);
      if (new Set(hedef).size < evSay[yapi]) continue;
      const yanil = karistir([...renkler.map((x) => ({ renk: x })), ...sekiller.map((x) => ({ sekil: x }))].filter((k) => !kosullar.some((y) => kosulId(y) === kosulId(k)))).slice(0, 2);
      const palet = [...new Map([...kosullar, ...yanil].map((k) => [kosulId(k), k])).values()];
      return { yapi, kosullar, mektuplar, hedef, palet: karistir(palet) };
    }
    throw new Error("bölüm kurulamadı");
  }
  const T = [
    { yapi: "tek", turler: ["renk"], n: 3, nRenk: 2, nSekil: 1 }, { yapi: "tek", turler: ["renk"], n: 4, nRenk: 2, nSekil: 1 }, { yapi: "tek", turler: ["renk"], n: 4, nRenk: 3, nSekil: 1 },
    { yapi: "tek", turler: ["sekil"], n: 4, nRenk: 1 }, { yapi: "tek", turler: ["sekil"], n: 4, nRenk: 2 }, { yapi: "tek", turler: ["renk"], n: 5, nRenk: 3, nSekil: 2 },
    { yapi: "zincir", turler: ["renk", "renk"], n: 4, nSekil: 1 }, { yapi: "zincir", turler: ["renk", "renk"], n: 5, nSekil: 1 }, { yapi: "zincir", turler: ["sekil", "sekil"], n: 5, nRenk: 1, nSekil: 3 },
    { yapi: "zincir", turler: ["renk", "renk"], n: 5, nRenk: 4, nSekil: 1 }, { yapi: "zincir", turler: ["sekil", "sekil"], n: 6, nRenk: 2, nSekil: 3 }, { yapi: "zincir", turler: ["renk", "renk"], n: 6, nRenk: 3, nSekil: 2 },
    { yapi: "zincir", turler: ["renk", "sekil"], n: 5 }, { yapi: "zincir", turler: ["sekil", "renk"], n: 5 }, { yapi: "zincir", turler: ["renk", "sekil"], n: 6 },
    { yapi: "zincir", turler: ["sekil", "renk"], n: 6, nRenk: 4 }, { yapi: "zincir", turler: ["renk", "sekil"], n: 7, nSekil: 3 }, { yapi: "zincir", turler: ["sekil", "renk"], n: 7, nSekil: 3 },
  ];
  for (let i = 0; i < 12; i++) T.push({ yapi: "agac", turler: i % 2 ? ["sekil", "renk", "renk"] : ["renk", "sekil", "sekil"], n: 5 + (i % 3), nRenk: 2 + (i % 2), nSekil: 2 + (i >= 6 ? 1 : 0) });
  const BOLUMLER = T.map((t, i) => ({ ...bolum(t), grup: Uygulama.seviye(i) }));

  // ---------- Oyun ----------
  const stil = `
  .pc { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eaf6ff, #f6fbff); }
  .pc-sahne { --k: 70px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 12px; padding: 8px 16px 16px; overflow-y: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .pc-canta { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 20px; background: #8a5a33; box-shadow: inset 0 -6px 0 rgba(0,0,0,.2); flex-wrap: wrap; justify-content: center; }
  .pc-canta .m { width: calc(var(--k) * .8); height: calc(var(--k) * .64); transition: transform .3s, opacity .3s; }
  .pc-canta .m svg, .pc-kutu .m svg { width: 100%; height: 100%; display: block; }
  .pc-canta .m.simdi { transform: translateY(-10px) scale(1.15); }
  .pc-canta .m.gitti { opacity: .25; transform: scale(.7); }
  .pc-agac { display: flex; flex-direction: column; align-items: center; }
  .pc-kavsak { position: relative; display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 18px; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.12); }
  .pc-kavsak.yanar { outline: 5px solid var(--sari); }
  .pc-kavsak .soru { font: 800 1.3rem var(--f-baslik); color: #6b7690; }
  .pc-yer { width: var(--p); height: calc(var(--p) * .8); border-radius: 12px; border: 3px dashed var(--cizgi); background: var(--zemin); display: grid; place-items: center; cursor: pointer; box-sizing: border-box; }
  .pc-yer.dolu { border: 3px solid #e1e7f0; background: #fff; }
  .pc-yer svg { width: 88%; height: 88%; pointer-events: none; }
  .pc-yer.siradaki { border-color: var(--mavi); background: #e3f0ff; }
  .pc-yer.hedefte { outline: 4px solid var(--mavi); }
  .pc-kollar { display: flex; gap: 14px; margin-top: 8px; align-items: flex-start; }
  .pc-kol { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .pc-kol > .etiket { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font: 900 1.2rem var(--f-baslik); color: #fff; box-shadow: 0 3px 0 rgba(0,0,0,.15); }
  .pc-kol.evet > .etiket { background: var(--yesil); } .pc-kol.hayir > .etiket { background: var(--kirmizi); }
  .pc-kol.yanar > .etiket { outline: 4px solid var(--sari); transform: scale(1.15); }
  .pc-ev { display: grid; justify-items: center; gap: 4px; padding: 6px; border-radius: 16px; background: rgba(255,255,255,.7); }
  .pc-ev > svg { width: calc(var(--k) * .95); height: calc(var(--k) * .86); }
  .pc-kutu { display: flex; flex-wrap: wrap; justify-content: center; gap: 3px; max-width: calc(var(--k) * 1.9); min-height: calc(var(--k) * .36); padding: 4px; border-radius: 10px; background: #5d6878; }
  .pc-kutu .m { width: calc(var(--k) * .5); height: calc(var(--k) * .4); opacity: .35; filter: grayscale(.3); }
  .pc-kutu .m.geldi { opacity: 1; filter: none; animation: pc-dus .35s; }
  .pc-kutu .m.yanlis { opacity: 1; filter: none; outline: 3px solid var(--kirmizi); border-radius: 4px; }
  @keyframes pc-dus { from { transform: translateY(-14px) scale(.6); opacity: 0; } }
  .pc-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .pc-palet { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px; border-radius: 22px; background: rgba(255,255,255,.8); }
  .pc-kosul { width: var(--p); height: var(--p); padding: 0; border: 0; border-radius: 18px; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; display: grid; place-items: center; }
  .pc-kosul svg { width: 84%; height: 84%; pointer-events: none; }
  .pc-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); background: #fff; border-radius: 16px; display: grid; place-items: center; filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .pc-tasinan svg { width: 84%; height: 84%; }
  .pc-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .pc-calistir svg { width: 30px; height: 30px; }
  .pc-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("pc-stil")) { const st = document.createElement("style"); st.id = "pc-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="pc"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="pc-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".pc-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); } }); }

  function agacHtml(n, b) {
    if (n.t === "e") return `<div class="pc-ev" data-ev="${n.i}">${ev(n.i)}<div class="pc-kutu">${b.mektuplar.map((m, q) => (b.hedef[q] === n.i ? `<span class="m" data-q="${q}">${zarf(m)}</span>` : "")).join("")}</div></div>`;
    return `<div class="pc-agac"><div class="pc-kavsak" data-j="${n.j}"><span class="soru">?</span><div class="pc-yer" data-j="${n.j}" role="button" tabindex="0" aria-label="${n.j + 1}. kavşağın koşulu"></div></div>
      <div class="pc-kollar"><div class="pc-kol evet" data-j="${n.j}"><span class="etiket">✓</span>${agacHtml(n.evet, b)}</div><div class="pc-kol hayir" data-j="${n.j}"><span class="etiket">✗</span>${agacHtml(n.hayir, b)}</div></div></div>`;
  }
  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.agac = YAPI[b.yapi]();
    d.secim = b.kosullar.map(() => null);
    d.sahne.innerHTML = `
      <div class="pc-canta" aria-label="Mektuplar">${b.mektuplar.map((m, q) => `<span class="m" data-q="${q}">${zarf(m)}</span>`).join("")}</div>
      ${agacHtml(d.agac, b)}
      <div class="pc-alt">
        <div class="pc-palet" aria-label="Koşullar">${b.palet.map((k) => `<button class="pc-kosul" type="button" data-k="${kosulId(k)}" aria-label="${k.renk ? RENK_AD[k.renk] + " zarf" : SEKIL_AD[k.sekil]}">${kosulSvg(k)}</button>`).join("")}</div>
        <button class="pc-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Gönder</span></button>
      </div>`;
    d.dugme = d.sahne.querySelector(".pc-calistir");
    d.dugme.onclick = calistir;
    d.sahne.querySelectorAll(".pc-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (d.secim[j]) { d.secim[j] = null; ciz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".pc-kosul").forEach(kosulTasi);
    ciz();
    boyutla();
  }
  const yerEl = (j) => d.sahne.querySelector(`.pc-yer[data-j="${j}"]`);
  const paletKosul = (id) => BOLUMLER[d.idx].palet.find((k) => kosulId(k) === id);
  function ciz() {
    d.secim.forEach((k, j) => { const y = yerEl(j); y.className = "pc-yer" + (k ? " dolu" : ""); y.innerHTML = k ? kosulSvg(k) : ""; });
    const s = d.secim.indexOf(null);
    if (s >= 0) yerEl(s).classList.add("siradaki");
    d.dugme.disabled = d.calisiyor || s >= 0;
  }
  function boyutla() {
    if (!d) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const ev_ = evSay[b.yapi];
    let k = Math.max(40, Math.min(90, Math.floor((W - 40) / (ev_ * 2.2)), Math.floor(H / 7.5)));
    let p = Math.max(46, Math.min(74, Math.floor(W / 7.5), Math.floor(H / 9)));
    d.sahne.style.setProperty("--k", k + "px"); d.sahne.style.setProperty("--p", p + "px");
    for (let q = 0; q < 30 && (d.sahne.scrollHeight > d.sahne.clientHeight + 2 || d.sahne.scrollWidth > d.sahne.clientWidth + 2) && (k > 32 || p > 40); q++) {
      if (k > 32) { k -= 3; d.sahne.style.setProperty("--k", k + "px"); }
      if (p > 40) { p -= 2; d.sahne.style.setProperty("--p", p + "px"); }
    }
  }
  function koy(id, j) {
    if (d.calisiyor) return;
    if (j == null) j = d.secim.indexOf(null);
    if (j < 0) return;
    d.secim[j] = paletKosul(id); ciz(); d.api.ses.tik();
  }
  function kosulTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const id = btn.dataset.k;
    btn.addEventListener("pointerdown", (e) => { if (d.calisiyor) return; e.preventDefault(); aktif = true; bx = e.clientX; by = e.clientY; btn.setPointerCapture && btn.setPointerCapture(e.pointerId); });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) { ucan = document.createElement("div"); ucan.className = "pc-tasinan"; const rr = btn.getBoundingClientRect(); ucan.style.width = ucan.style.height = rr.width + "px"; ucan.innerHTML = kosulSvg(paletKosul(id)); document.body.appendChild(ucan); }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY), kv = alt && alt.closest(".pc-kavsak"), y = kv && kv.querySelector(".pc-yer");
      if (hedef && hedef !== y) hedef.classList.remove("hedefte");
      hedef = y || null; if (hedef) hedef.classList.add("hedefte");
    });
    const birak = () => { if (!aktif) return; aktif = false; if (ucan) { ucan.remove(); ucan = null; if (hedef) { hedef.classList.remove("hedefte"); koy(id, +hedef.dataset.j); } hedef = null; } else koy(id); };
    btn.addEventListener("pointerup", birak); btn.addEventListener("pointercancel", birak);
  }

  async function calistir() {
    if (d.calisiyor) return;
    d.calisiyor = true; ciz();
    const benim = d.uid, b = BOLUMLER[d.idx], canta = [...d.sahne.querySelectorAll(".pc-canta .m")];
    let hata = false;
    for (let q = 0; q < b.mektuplar.length; q++) {
      canta[q].classList.add("simdi");
      await bekle(300);
      if (!d || benim !== d.uid) return;
      const g = gonder(d.agac, d.secim, b.mektuplar[q]);
      for (const adim of g.yol) {
        const kv = d.sahne.querySelector(`.pc-kavsak[data-j="${adim.j}"]`), kol = d.sahne.querySelector(`.pc-kol.${adim.evet ? "evet" : "hayir"}[data-j="${adim.j}"]`);
        kv.classList.add("yanar"); await bekle(260); if (!d || benim !== d.uid) return; kv.classList.remove("yanar");
        kol.classList.add("yanar"); d.api.ses.ton(adim.evet ? 660 : 440, 0.15); await bekle(220); if (!d || benim !== d.uid) return; kol.classList.remove("yanar");
      }
      canta[q].classList.remove("simdi"); canta[q].classList.add("gitti");
      const kutu = d.sahne.querySelector(`.pc-ev[data-ev="${g.ev}"] .pc-kutu`), yeri = kutu.querySelector(`.m[data-q="${q}"]`);
      if (yeri) { yeri.classList.add("geldi"); d.api.ses.yerlesti(); }
      else { kutu.insertAdjacentHTML("beforeend", `<span class="m yanlis">${zarf(b.mektuplar[q])}</span>`); hata = true; break; }
      await bekle(150);
    }
    if (!hata) { await bekle(400); if (!d || benim !== d.uid) return; return bitir(); }
    d.api.ses.hata();
    await bekle(1800);
    if (!d || benim !== d.uid) return;
    d.sahne.querySelectorAll(".pc-kutu .m.yanlis").forEach((x) => x.remove());
    d.sahne.querySelectorAll(".pc-kutu .m").forEach((x) => x.classList.remove("geldi"));
    canta.forEach((x) => x.classList.remove("gitti", "simdi"));
    d.calisiyor = false; ciz();
  }
  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün mektuplar sahibine ulaştı!" : "Son mektuplar da ulaştı!") : "Mektuplar doğru evlere gitti!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.POSTACI_BOLUMLER = BOLUMLER;
  window.POSTACI_COZUM = (i) => BOLUMLER[i].kosullar.map(kosulId);

  window.Uygulama.oyunEkle(29, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const j = d.secim.indexOf(null);
      if (j < 0) return [{ el: d.dugme }];
      const id = kosulId(BOLUMLER[d.idx].kosullar[j]);
      return [{ el: d.sahne.querySelector(".pc-ev") }, { el: d.sahne.querySelector(`.pc-kosul[data-k="${id}"]`), hedef: yerEl(j) }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${zarf({ r: "m", s: "yildiz" })}<svg viewBox="0 0 100 90" style="width:40px">${ev(0).replace(/<\/?svg[^>]*>/g, "")}</svg>${zarf({ r: "k", s: "kalp" })}</div>`; },
  });
})();
