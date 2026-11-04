/* Çubuklarla Şekil (şekil kopyalama: kibrit çubuklarıyla örnek şekli kurmak).
   Örnek kartta çubuklardan yapılmış bir şekil var. Noktalı tahtada iki nokta arasındaki boşluğa dokununca oraya
   çubuk konur, çubuğa tekrar dokununca kalkar. Kutudaki çubuk sayısı şekle yetecek kadardır. Şekil tahtanın
   herhangi bir yerine kurulabilir. Çubuklar bitip şekil tutmazsa yanlış çubuklar kırmızı yanıp söner.
   Tek kareden başlar; iç çizgili, çok kareli şekillere doğru zorlaşır.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "cubuk";
  const RENK = ["#ff5a4e", "#2f86e0", "#2fb36a", "#8a5cf0", "#ff8a1f", "#e0457b"];
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [tahta sütun, satır (kare sayısı), şekildeki kare sayısı, iç çizgi olasılığı]
  const T = [
    [3, 3, 1, 0], [3, 3, 2, 0], [3, 3, 2, 1],
    [3, 3, 3, 0], [3, 3, 3, 1], [3, 3, 4, 0],
    [4, 3, 3, 0.5], [4, 3, 4, 0], [4, 3, 4, 1], [4, 4, 4, 0.5], [4, 4, 5, 0], [4, 4, 4, 1],
    [4, 4, 5, 0.5], [4, 4, 5, 1], [4, 4, 6, 0], [4, 4, 5, 0.5], [4, 4, 6, 0.5], [4, 4, 6, 1],
    [5, 4, 6, 0.5], [5, 4, 7, 0], [5, 4, 6, 1], [5, 4, 7, 0.5], [5, 4, 7, 1], [5, 4, 8, 0],
    [5, 5, 7, 0.5], [5, 5, 8, 0.5], [5, 5, 8, 1], [5, 5, 9, 0.3], [5, 5, 9, 0.6], [5, 5, 10, 0.5],
  ];
  const hucreKenar = ([x, y]) => [`h,${x},${y}`, `h,${x},${y + 1}`, `v,${x},${y}`, `v,${x + 1},${y}`];
  const ayir = (k) => { const [t, x, y] = k.split(","); return [t, +x, +y]; };
  const kaydir = (k, dx, dy) => { const [t, x, y] = ayir(k); return `${t},${x + dx},${y + dy}`; };
  function normal(set) {
    const l = [...set].map(ayir); if (!l.length) return "";
    const mx = Math.min(...l.map((e) => e[1])), my = Math.min(...l.map((e) => e[2]));
    return l.map(([t, x, y]) => `${t},${x - mx},${y - my}`).sort().join(";");
  }
  const BOLUMLER = T.map(([C, R, k, ic], i) => {
    const r = tohumlu(5200 + i * 41);
    const hucre = new Set(["0,0"]), yon = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let gx = 0, gy = 0;
    while (hucre.size < k) {
      const l = [...hucre].map((s) => s.split(",").map(Number)), [x, y] = l[Math.floor(r() * l.length)], [dx, dy] = yon[Math.floor(r() * 4)];
      const nx = x + dx, ny = y + dy, xs = [...l.map((p) => p[0]), nx], ys = [...l.map((p) => p[1]), ny];
      if (Math.max(...xs) - Math.min(...xs) >= C || Math.max(...ys) - Math.min(...ys) >= R) continue;
      hucre.add(`${nx},${ny}`);
    }
    let hl = [...hucre].map((s) => s.split(",").map(Number));
    const mx = Math.min(...hl.map((p) => p[0])), my = Math.min(...hl.map((p) => p[1]));
    hl = hl.map(([x, y]) => [x - mx, y - my]);
    gx = Math.max(...hl.map((p) => p[0])) + 1; gy = Math.max(...hl.map((p) => p[1])) + 1;
    const say = {};
    hl.forEach((h) => hucreKenar(h).forEach((e) => (say[e] = (say[e] || 0) + 1)));
    const kenar = Object.keys(say).filter((e) => say[e] === 1 || r() < ic).sort();
    const ox = Math.floor(r() * (C - gx + 1)), oy = Math.floor(r() * (R - gy + 1));
    return { C, R, gx, gy, sekil: kenar, kenarlar: kenar.map((e) => kaydir(e, ox, oy)), norm: normal(kenar), renk: RENK[i % RENK.length], grup: Uygulama.seviye(i) };
  });

  const A = 100, M = 40;
  const uc = (k) => { const [t, x, y] = ayir(k); return [M + x * A, M + y * A, M + (x + (t === "h")) * A, M + (y + (t === "v")) * A]; };
  const cubuk = (k, cls, renk) => { const [x1, y1, x2, y2] = uc(k); return `<g class="${cls}" data-k="${k}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#7a5230" stroke-width="20" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f4c27a" stroke-width="12" stroke-linecap="round"/><circle cx="${x1 + (x2 - x1) * 0.06}" cy="${y1 + (y2 - y1) * 0.06}" r="11" fill="${renk}"/></g>`; };
  const noktalar = (C, R) => { let s = ""; for (let y = 0; y <= R; y++) for (let x = 0; x <= C; x++) s += `<circle cx="${M + x * A}" cy="${M + y * A}" r="7" fill="#9aa7b8"/>`; return s; };
  const ornekSvg = (b) => `<svg viewBox="0 0 ${b.gx * A + 2 * M} ${b.gy * A + 2 * M}" aria-hidden="true">${noktalar(b.gx, b.gy)}${b.sekil.map((k) => cubuk(k, "", b.renk)).join("")}</svg>`;

  const stil = `
  .cb { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#fff8ec, #fbecd2); }
  .cb-sahne { --t: 160px; --o: 300px; position: relative; flex: 1; min-height: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; align-content: safe center; gap: 16px 26px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .cb-sol { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .cb-ornek { width: var(--t); height: var(--t); padding: 10px; box-sizing: border-box; border-radius: 22px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.1); position: relative; display: flex; align-items: center; justify-content: center; }
  .cb-ornek::after { content: "👀"; position: absolute; top: -14px; left: -10px; font-size: 26px; }
  .cb-ornek svg { max-width: 100%; max-height: 100%; }
  .cb-kutu { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; width: var(--t); min-height: 40px; padding: 8px; box-sizing: border-box; border-radius: 14px; background: #c98a4b; box-shadow: inset 0 -5px 0 rgba(0,0,0,.18); }
  .cb-kutu i { display: block; width: 8px; height: 30px; border-radius: 4px; background: #f4c27a; border: 2px solid #7a5230; border-top: 7px solid #ff5a4e; }
  .cb-kutu.bos { animation: cb-salla .45s; }
  .cb-tahta { width: var(--o); position: relative; }
  .cb svg { display: block; width: 100%; height: auto; }
  .cb-yuva { cursor: pointer; }
  .cb-yuva .iz { stroke: #e5d5bd; stroke-width: 8; stroke-dasharray: 2 16; stroke-linecap: round; }
  .cb-yuva:hover .iz { stroke: #c9b08c; }
  .cb-yerli { pointer-events: none; animation: cb-koy .25s ease-out; transform-box: fill-box; transform-origin: center; }
  .cb-yerli.kirmizi line:last-of-type { stroke: #ff5a4e; }
  .cb-yerli.kirmizi { animation: cb-yan .9s 2; }
  @keyframes cb-koy { from { transform: scale(1.25); opacity: 0; } }
  @keyframes cb-yan { 50% { opacity: .3; } }
  @keyframes cb-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("cb-stil")) { const st = document.createElement("style"); st.id = "cb-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="cb"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="cb-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".cb-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.konan = new Set();
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    let yuvalar = "";
    for (let y = 0; y <= b.R; y++) for (let x = 0; x <= b.C; x++) {
      if (x < b.C) yuvalar += yuva(`h,${x},${y}`);
      if (y < b.R) yuvalar += yuva(`v,${x},${y}`);
    }
    d.sahne.innerHTML = `<div class="cb-sol"><div class="cb-ornek">${ornekSvg(b)}</div><div class="cb-kutu"></div></div>
      <div class="cb-tahta"><svg viewBox="0 0 ${b.C * A + 2 * M} ${b.R * A + 2 * M}">${noktalar(b.C, b.R)}<g class="cb-yuvalar">${yuvalar}</g><g class="cb-konanlar"></g></svg></div>`;
    d.sahne.querySelectorAll(".cb-yuva").forEach((el) => (el.onclick = () => dokun(el.dataset.k)));
    kutuCiz(); boyutla();
  }
  function yuva(k) { const [x1, y1, x2, y2] = uc(k); return `<g class="cb-yuva" data-k="${k}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="transparent" stroke-width="56"/><line class="iz" x1="${x1 + (x2 - x1) * 0.15}" y1="${y1 + (y2 - y1) * 0.15}" x2="${x2 - (x2 - x1) * 0.15}" y2="${y2 - (y2 - y1) * 0.15}"/></g>`; }
  function kutuCiz() { const n = BOLUMLER[d.idx].kenarlar.length - d.konan.size; d.sahne.querySelector(".cb-kutu").innerHTML = "<i></i>".repeat(Math.max(0, n)); }
  function boyutla() {
    if (!d) return;
    const b = BOLUMLER[d.idx], oran = (b.R * A + 2 * M) / (b.C * A + 2 * M);
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    let o, t;
    if (W > H * 1.15) { o = Math.min((H - 10) / oran, (W - 26) * 0.64, 600); t = Math.min(o * 0.5, W - o - 46, 240, H - 80); }
    else { o = Math.min(W - 10, ((H - 30) * 0.6) / oran, 600); t = Math.min(o * 0.45, H - o * oran - 100, 220); }
    d.sahne.style.setProperty("--o", Math.floor(Math.max(180, o)) + "px"); d.sahne.style.setProperty("--t", Math.floor(Math.max(100, t)) + "px");
  }
  // Örnekle en çok örtüşen yerleşime göre yanlış çubukları bul
  function yanlislar() {
    const b = BOLUMLER[d.idx], hedef = new Set(b.sekil);
    let iyi = null, en = -1;
    for (let dx = -b.C; dx <= b.C; dx++) for (let dy = -b.R; dy <= b.R; dy++) {
      let s = 0; d.konan.forEach((k) => { if (hedef.has(kaydir(k, dx, dy))) s++; });
      if (s > en) { en = s; iyi = [dx, dy]; }
    }
    return [...d.konan].filter((k) => !hedef.has(kaydir(k, iyi[0], iyi[1])));
  }
  async function dokun(k) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid, g = d.sahne.querySelector(".cb-konanlar");
    if (d.konan.has(k)) { d.konan.delete(k); g.querySelector(`[data-k="${k}"]`).remove(); d.api.ses.tik(); return kutuCiz(); }
    if (d.konan.size >= b.kenarlar.length) {
      const kutu = d.sahne.querySelector(".cb-kutu"); kutu.classList.remove("bos"); void kutu.offsetWidth; kutu.classList.add("bos"); d.api.ses.hata();
      yanlislar().forEach((y) => { const el = g.querySelector(`[data-k="${y}"]`); el.classList.remove("kirmizi"); void el.getBoundingClientRect(); el.classList.add("kirmizi"); });
      return;
    }
    d.konan.add(k); g.insertAdjacentHTML("beforeend", cubuk(k, "cb-yerli", b.renk)); d.api.ses.yerlesti(); kutuCiz();
    if (d.konan.size < b.kenarlar.length) return;
    if (normal(d.konan) !== b.norm) {
      d.api.ses.hata();
      yanlislar().forEach((y) => g.querySelector(`[data-k="${y}"]`).classList.add("kirmizi"));
      return;
    }
    d.mesgul = true; await bekle(650); if (!d || benim !== d.uid) return;
    bitir();
  }
  function bitir() {
    d.mesgul = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Çubuk ustası oldun!" : "En zor şekli de kurdun!") : "Şekli çubuklarla kurdun!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.CUBUK_BOLUMLER = BOLUMLER;
  window.CUBUK_DURUM = () => d && { konan: [...d.konan] };

  window.Uygulama.oyunEkle(52, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const b = BOLUMLER[d.idx], yer = (k) => ({ el: d.sahne.querySelector(`.cb-yuva[data-k="${k}"] .iz`) });
      const yanlis = yanlislar();
      if (yanlis.length) return [{ el: d.sahne.querySelector(`.cb-konanlar [data-k="${yanlis[0]}"]`) }];
      if (tam && !d.konan.size) return b.kenarlar.map(yer);
      if (!d.konan.size) return [{ el: d.sahne.querySelector(".cb-ornek") }, yer(b.kenarlar[0])];
      // Konan çubuklara göre hizalanmış hedefte eksik olanlar
      const hedef = new Set(b.sekil); let dxy = null;
      for (let dx = -b.C; dx <= b.C && !dxy; dx++) for (let dy = -b.R; dy <= b.R && !dxy; dy++) if ([...d.konan].every((k) => hedef.has(kaydir(k, dx, dy)))) dxy = [dx, dy];
      if (!dxy) return [];
      const eksik = b.sekil.map((k) => kaydir(k, -dxy[0], -dxy[1])).filter((k) => !d.konan.has(k));
      const var_ = eksik.filter((k) => d.sahne.querySelector(`.cb-yuva[data-k="${k}"]`));
      return (tam ? var_ : var_.slice(0, 1)).map(yer);
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${ornekSvg({ gx: 2, gy: 1, sekil: ["h,0,0", "h,1,0", "h,0,1", "h,1,1", "v,0,0", "v,1,0", "v,2,0"], renk: "#ff5a4e" })}</div>`; },
  });
})();
