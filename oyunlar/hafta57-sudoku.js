/* Resimli Sudoku (mantık: her satırda ve her sütunda her resim bir kez).
   Tablodaki boş karelere resim koy: aşağıdan bir resim seç, sonra boş kareye dokun. Aynı satırda ya da sütunda
   aynı resim varsa o resim yanıp söner ve konmaz. Bütün kareler dolunca bölüm biter. Her bulmacanın tek çözümü vardır.
   3x3'ten 4x4'e, az boşluktan çok boşluğa. 30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "sudoku";
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const TAKIM = [["elma", "muz", "cilek", "uzum"], ["kedi", "kus", "tavsan", "balik"], ["top", "araba", "ayi", "ucurtma"], ["havuc", "misir", "brokoli", "biber"]];
  // [kenar, boş kare sayısı]
  const T = [
    [3, 1], [3, 2], [3, 3],
    [3, 3], [3, 4], [3, 5],
    [4, 3], [4, 4], [4, 5], [4, 5], [4, 6], [4, 6],
    [4, 7], [4, 7], [4, 8], [4, 8], [4, 9], [4, 9],
    [4, 9], [4, 10], [4, 10], [4, 10], [4, 11], [4, 11],
    [4, 11], [4, 12], [4, 12], [4, 12], [4, 12], [4, 12],
  ];
  function karistir(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  // Boş kareleri (-1) doldurmanın kaç yolu var (en çok 2'ye kadar say)
  function cozumSay(g, n) {
    const i = g.indexOf(-1); if (i < 0) return 1;
    const r = Math.floor(i / n), c = i % n; let say = 0;
    for (let v = 0; v < n && say < 2; v++) {
      let olur = true;
      for (let k = 0; k < n && olur; k++) if (g[r * n + k] === v || g[k * n + c] === v) olur = false;
      if (!olur) continue;
      g[i] = v; say += cozumSay(g, n); g[i] = -1;
    }
    return say;
  }
  const BOLUMLER = T.map(([n, bos], i) => {
    const r = tohumlu(5700 + i * 67);
    const sat = karistir([...Array(n).keys()], r), sut = karistir([...Array(n).keys()], r), sem = karistir([...Array(n).keys()], r);
    const cozum = []; for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) cozum.push(sem[(sat[a] + sut[b]) % n]);
    const g = cozum.slice(); let bosSay = 0;
    for (const k of karistir([...Array(n * n).keys()], r)) {
      if (bosSay >= bos) break;
      const v = g[k]; g[k] = -1;
      if (cozumSay(g.slice(), n) === 1) bosSay++; else g[k] = v;
    }
    return { n, cozum, verilen: g.map((v) => v >= 0), resimler: TAKIM[Math.floor(i / 2) % TAKIM.length].slice(0, n), grup: Uygulama.seviye(i) };
  });
  const resim = (id) => (window.NESNELER && NESNELER[id] ? `<img src="${NESNELER[id].src}" alt="">` : "");

  const stil = `
  .sd { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#fff6e8, #fbe9cf); }
  .sd-sahne { --k: 80px; --p: 70px; position: relative; flex: 1; min-height: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; align-content: safe center; gap: 20px 34px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .sd-tablo { display: grid; grid-template-columns: repeat(var(--n), var(--k)); grid-auto-rows: var(--k); gap: 6px; padding: 10px; border-radius: 22px; background: #c98a4b; box-shadow: 0 8px 0 rgba(29,40,70,.12); }
  .sd-kare { position: relative; padding: 0; border: 0; border-radius: 14px; background: #fff; cursor: pointer; }
  .sd-kare.verilen { background: #f3e2c6; cursor: default; }
  .sd-kare img { position: absolute; inset: 10%; width: 80%; height: 80%; pointer-events: none; }
  .sd-kare.yeni img { animation: sd-gel .3s cubic-bezier(.3,1.6,.5,1); }
  .sd-kare.cakisma { animation: sd-yan .5s 2; }
  .sd-kare.salla { animation: sd-salla .45s; }
  @keyframes sd-gel { from { transform: scale(.3); } }
  @keyframes sd-yan { 50% { background: #ffb3ad; } }
  @keyframes sd-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  .sd-palet { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; max-width: calc(var(--p) * 2 + 40px); }
  .sd-sahne.dikey .sd-palet { max-width: none; }
  .sd-resim { position: relative; width: var(--p); height: var(--p); padding: 0; border: 4px solid transparent; border-radius: 18px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.14); cursor: pointer; }
  .sd-resim img { position: absolute; inset: 10%; width: 80%; height: 80%; pointer-events: none; }
  .sd-resim.secili { border-color: #1d2846; transform: translateY(-4px); }
  .sd-palet.uyar .sd-resim { animation: sd-salla .45s; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("sd-stil")) { const st = document.createElement("style"); st.id = "sd-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="sd"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="sd-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".sd-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.secili = null;
    d.tablo = b.cozum.map((v, k) => (b.verilen[k] ? v : -1));
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.sahne.innerHTML = `<div class="sd-tablo" style="--n:${b.n}">${b.cozum.map((v, k) => `<button class="sd-kare${b.verilen[k] ? " verilen" : ""}" type="button" data-k="${k}" aria-label="Kare">${b.verilen[k] ? resim(b.resimler[v]) : ""}</button>`).join("")}</div>
      <div class="sd-palet">${b.resimler.map((id, v) => `<button class="sd-resim" type="button" data-v="${v}" aria-label="${NESNELER[id] ? NESNELER[id].ad : id}">${resim(id)}</button>`).join("")}</div>`;
    d.sahne.querySelectorAll(".sd-resim").forEach((el) => (el.onclick = () => { if (d.mesgul) return; d.secili = +el.dataset.v; d.api.ses.tik(); paletCiz(); }));
    d.sahne.querySelectorAll(".sd-kare:not(.verilen)").forEach((el) => (el.onclick = () => koy(+el.dataset.k)));
    paletCiz(); boyutla();
  }
  function paletCiz() { d.sahne.querySelectorAll(".sd-resim").forEach((el) => el.classList.toggle("secili", +el.dataset.v === d.secili)); }
  const kareEl = (k) => d.sahne.querySelector(`.sd-kare[data-k="${k}"]`);
  function boyutla() {
    if (!d) return;
    const n = BOLUMLER[d.idx].n, W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.1;
    d.sahne.classList.toggle("dikey", dikey);
    let k, p;
    if (dikey) { p = Math.min(84, (W - 3 * 12) / n); k = Math.min((W - 20 - (n - 1) * 6) / n, (H - p - 70 - (n - 1) * 6) / n, 120); }
    else { p = Math.min(90, (H - 40) / 3); k = Math.min((H - 20 - (n - 1) * 6) / n, (W - 2 * p - 120 - (n - 1) * 6) / n, 130); }
    d.sahne.style.setProperty("--k", Math.floor(Math.max(48, k)) + "px"); d.sahne.style.setProperty("--p", Math.floor(Math.max(50, p)) + "px");
  }
  async function koy(k) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], n = b.n, benim = d.uid;
    if (d.secili === null) { const p = d.sahne.querySelector(".sd-palet"); p.classList.remove("uyar"); void p.offsetWidth; p.classList.add("uyar"); return; }
    if (d.tablo[k] >= 0) return;
    const v = d.secili, r = Math.floor(k / n), c = k % n;
    if (v !== b.cozum[k]) {
      // Aynı satır/sütundaki aynı resim yanıp söner; yoksa kare sallanır
      const cak = [];
      for (let q = 0; q < n; q++) { if (d.tablo[r * n + q] === v) cak.push(r * n + q); if (d.tablo[q * n + c] === v) cak.push(q * n + c); }
      const el = kareEl(k);
      if (cak.length) cak.forEach((x) => { const e = kareEl(x); e.classList.remove("cakisma"); void e.offsetWidth; e.classList.add("cakisma"); });
      el.classList.remove("salla"); void el.offsetWidth; el.classList.add("salla");
      d.api.ses.hata(); return;
    }
    d.tablo[k] = v;
    const el = kareEl(k); el.innerHTML = resim(b.resimler[v]); el.classList.add("yeni"); d.api.ses.yerlesti();
    if (d.tablo.some((x) => x < 0)) return;
    d.mesgul = true; await bekle(600); if (!d || benim !== d.uid) return;
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Sudoku ustası oldun!" : "En zor tabloyu da doldurdun!") : "Tablo tamam!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.SUDOKU_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(57, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const b = BOLUMLER[d.idx], n = b.n;
      // En az boşluğu olan satırdaki ilk boş kare
      const bos = d.tablo.map((v, k) => k).filter((k) => d.tablo[k] < 0);
      if (!bos.length) return [];
      bos.sort((x, y) => d.tablo.slice(Math.floor(x / n) * n, Math.floor(x / n) * n + n).filter((v) => v < 0).length - d.tablo.slice(Math.floor(y / n) * n, Math.floor(y / n) * n + n).filter((v) => v < 0).length);
      return (tam ? bos : bos.slice(0, 1)).flatMap((k) => [{ el: d.sahne.querySelector(`.sd-resim[data-v="${b.cozum[k]}"]`) }, { el: kareEl(k) }]).slice(0, tam ? 8 : 2);
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const R = ["#ff5a4e", "#ffc23a", "#2fb36a"], g = [0, 1, 2, 1, 2, 0, 2, 0, 1];
      return `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="0 0 100 100"><rect width="100" height="100" rx="14" fill="#c98a4b"/>${g.map((v, k) => `<rect x="${6 + (k % 3) * 31}" y="${6 + Math.floor(k / 3) * 31}" width="27" height="27" rx="6" fill="#fff"/>${k === 4 ? "" : `<circle cx="${19.5 + (k % 3) * 31}" cy="${19.5 + Math.floor(k / 3) * 31}" r="9" fill="${R[v]}"/>`}`).join("")}</svg></div>`;
    },
  });
})();
