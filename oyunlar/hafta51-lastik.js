/* Lastik Tahtası (şekil kopyalama: çivili tahtada lastikle şekil yapmak).
   Solda / üstte örnek tahta, ortada çocuğun tahtası. Çivilere sırayla dokununca lastik çividen çiviye gerilir.
   Örnekteki şekli aynen kopyala. Şekilde olmayan bir çizgi çekilmez (çivi sallanır). Aynı çiviye tekrar dokununca
   lastik bırakılır ve başka çividen başlanabilir. İlk bölümlerde şeklin izi tahtada soluk görünür.
   Tahta 3x3'ten 5x5'e büyür; şekiller üçgenden ok ve T'ye zorlaşır.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "lastik";
  const RENK = ["#ff5a4e", "#2f86e0", "#2fb36a", "#8a5cf0", "#ff8a1f", "#e0457b"];
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const S = {
    ucgen: [[0, 0], [2, 0], [0, 2]], kare: [[0, 0], [2, 0], [2, 2], [0, 2]], dikdortgen: [[0, 0], [2, 0], [2, 1], [0, 1]],
    ikizkenar: [[1, 0], [2, 2], [0, 2]], baklava: [[1, 0], [2, 1], [1, 2], [0, 1]], kucukKare: [[0, 0], [1, 0], [1, 1], [0, 1]],
    yamuk: [[1, 0], [2, 0], [3, 2], [0, 2]], paralel: [[1, 0], [3, 0], [2, 2], [0, 2]], ev: [[1, 0], [2, 1], [2, 3], [0, 3], [0, 1]],
    L: [[0, 0], [1, 0], [1, 2], [2, 2], [2, 3], [0, 3]], buyukUcgen: [[0, 0], [3, 0], [0, 3]], ucgenEgri: [[0, 0], [3, 1], [1, 3]],
    besgen: [[2, 0], [4, 2], [3, 4], [1, 4], [0, 2]], altigen: [[1, 0], [3, 0], [4, 2], [3, 4], [1, 4], [0, 2]],
    ok: [[2, 0], [4, 2], [3, 2], [3, 4], [1, 4], [1, 2], [0, 2]], T: [[0, 0], [3, 0], [3, 1], [2, 1], [2, 3], [1, 3], [1, 1], [0, 1]],
    yildiz: [[2, 0], [3, 1], [4, 2], [3, 3], [2, 4], [1, 3], [0, 2], [1, 1]].filter((_, i) => true),
    simsek: [[1, 0], [3, 0], [2, 2], [4, 2], [1, 4], [2, 3], [0, 3]], kalp: [[1, 0], [2, 1], [3, 0], [4, 1], [2, 4], [0, 1]],
    U: [[0, 0], [1, 0], [1, 2], [3, 2], [3, 0], [4, 0], [4, 3], [0, 3]], merdiven: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [0, 3]],
    ucak: [[2, 0], [3, 2], [4, 3], [3, 3], [2, 4], [1, 3], [0, 3], [1, 2]],
  };
  // [tahta çivi sayısı, şekil, iz görünsün mü, döndür/aynala]
  const T = [
    [3, "ucgen", 1, 0], [3, "kare", 1, 0], [3, "dikdortgen", 1, 0],
    [3, "ikizkenar", 0, 0], [3, "baklava", 0, 0], [3, "ucgen", 0, 1],
    [4, "yamuk", 1, 0], [4, "paralel", 0, 0], [4, "ev", 0, 0], [4, "kucukKare", 0, 1], [4, "L", 0, 0], [4, "buyukUcgen", 0, 1],
    [4, "ev", 0, 1], [4, "L", 0, 1], [4, "ucgenEgri", 0, 0], [4, "yamuk", 0, 1], [4, "paralel", 0, 1], [4, "ucgenEgri", 0, 1],
    [5, "besgen", 0, 0], [5, "altigen", 0, 0], [5, "ok", 0, 0], [5, "T", 0, 0], [5, "merdiven", 0, 0], [5, "U", 0, 0],
    [5, "ok", 0, 1], [5, "T", 0, 1], [5, "simsek", 0, 0], [5, "kalp", 0, 0], [5, "ucak", 0, 0], [5, "simsek", 0, 1],
  ];
  const ebob = (a, b) => (b ? ebob(b, a % b) : Math.abs(a));
  // Bir kenarı birim adımlara böl: aynı doğru üzerindeki ara çiviler de sayılsın
  function parcala(a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], g = ebob(dx, dy) || 1, sx = dx / g, sy = dy / g, out = [];
    for (let i = 0; i < g; i++) {
      const p = [a[0] + sx * i, a[1] + sy * i], q = [p[0] + sx, p[1] + sy];
      out.push(p[0] < q[0] || (p[0] === q[0] && p[1] < q[1]) ? `${p}|${q}` : `${q}|${p}`);
    }
    return out;
  }
  const BOLUMLER = T.map(([n, ad, iz, cevir], i) => {
    const r = tohumlu(5100 + i * 37);
    let k = S[ad].map((p) => p.slice());
    if (cevir) {
      const tur = 1 + Math.floor(r() * 3);
      for (let t = 0; t < tur; t++) k = k.map(([x, y]) => [-y, x]);
      if (r() < 0.5) k = k.map(([x, y]) => [-x, y]);
    }
    const mx = Math.min(...k.map((p) => p[0])), my = Math.min(...k.map((p) => p[1]));
    k = k.map(([x, y]) => [x - mx, y - my]);
    const gx = Math.max(...k.map((p) => p[0])), gy = Math.max(...k.map((p) => p[1]));
    const ox = Math.floor(r() * (n - gx)), oy = Math.floor(r() * (n - gy));
    k = k.map(([x, y]) => [x + ox, y + oy]);
    const parcalar = new Set();
    k.forEach((p, j) => parcala(p, k[(j + 1) % k.length]).forEach((s) => parcalar.add(s)));
    return { n, koseler: k, iz: !!iz, parcalar, renk: RENK[i % RENK.length], grup: Uygulama.seviye(i) };
  });

  const A = 100, M = 50;
  const vb = (n) => (n - 1) * A + 2 * M;
  const xy = ([x, y]) => [M + x * A, M + y * A];
  const yol = (k) => "M" + k.map((p) => xy(p).join(" ")).join(" L") + " Z";
  const tahta = (n, ic) => `<rect x="6" y="6" width="${vb(n) - 12}" height="${vb(n) - 12}" rx="26" fill="#f1d3a5" stroke="#c99a5b" stroke-width="8"/>${ic}`;
  const civiler = (n, tik) => { let s = ""; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const [cx, cy] = xy([x, y]); s += tik ? `<g class="lt-civi" data-p="${x},${y}"><circle cx="${cx}" cy="${cy}" r="44" fill="transparent"/><circle class="lt-bas" cx="${cx}" cy="${cy}" r="13" fill="#8a6a4a" stroke="#5d452c" stroke-width="4"/></g>` : `<circle cx="${cx}" cy="${cy}" r="11" fill="#8a6a4a"/>`; } return s; };
  const ornekSvg = (b) => `<svg viewBox="0 0 ${vb(b.n)} ${vb(b.n)}" aria-hidden="true">${tahta(b.n, `<path d="${yol(b.koseler)}" fill="${b.renk}" fill-opacity=".35" stroke="${b.renk}" stroke-width="14" stroke-linejoin="round"/>${civiler(b.n, false)}`)}</svg>`;

  const stil = `
  .lt { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f4fbef, #e5f3dc); }
  .lt-sahne { --t: 160px; --o: 300px; position: relative; flex: 1; min-height: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; align-content: safe center; gap: 18px 26px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .lt-ornek { width: var(--t); height: var(--t); padding: 8px; border-radius: 24px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.1); position: relative; }
  .lt-ornek::after { content: "👀"; position: absolute; top: -14px; left: -10px; font-size: 26px; }
  .lt-oyun { width: var(--o); height: var(--o); position: relative; }
  .lt svg { width: 100%; height: 100%; display: block; }
  .lt-civi { cursor: pointer; }
  .lt-civi.aktif .lt-bas { fill: #ffc23a; stroke: #b07a00; r: 17; }
  .lt-civi.yanlis { animation: lt-salla .45s; transform-box: fill-box; transform-origin: center; }
  @keyframes lt-salla { 20%, 60% { transform: translateX(-9px); } 40%, 80% { transform: translateX(9px); } }
  .lt-kenar { stroke-linecap: round; animation: lt-ger .25s ease-out; }
  @keyframes lt-ger { from { stroke-width: 4; } }
  .lt-dolgu { animation: lt-dol .6s ease-out both; }
  @keyframes lt-dol { from { fill-opacity: 0; } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("lt-stil")) { const st = document.createElement("style"); st.id = "lt-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="lt"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="lt-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".lt-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.aktif = null; d.cizili = new Set(); d.kenarlar = [];
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const iz = b.iz ? `<path d="${yol(b.koseler)}" fill="none" stroke="#c99a5b" stroke-width="10" stroke-dasharray="4 22" stroke-linecap="round"/>` : "";
    d.sahne.innerHTML = `<div class="lt-ornek">${ornekSvg(b)}</div>
      <div class="lt-oyun"><svg viewBox="0 0 ${vb(b.n)} ${vb(b.n)}">${tahta(b.n, `${iz}<g class="lt-dolgular"></g><g class="lt-lastik"></g>${civiler(b.n, true)}`)}</svg></div>`;
    d.sahne.querySelectorAll(".lt-civi").forEach((el) => (el.onclick = () => dokun(el)));
    boyutla();
  }
  function boyutla() {
    if (!d) return;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    let o, t;
    if (W > H * 1.15) { o = Math.min(H - 10, (W - 26) * 0.64, 560); t = Math.min(o * 0.6, W - o - 46, 300); }
    else { o = Math.min(W - 10, (H - 18) * 0.64, 560); t = Math.min(o * 0.6, H - o - 38, 300); }
    d.sahne.style.setProperty("--o", Math.floor(Math.max(180, o)) + "px"); d.sahne.style.setProperty("--t", Math.floor(Math.max(100, t)) + "px");
  }
  function salla(el) { el.classList.remove("yanlis"); void el.getBoundingClientRect(); el.classList.add("yanlis"); d.api.ses.hata(); }
  function aktifYap(p) {
    d.aktif = p;
    d.sahne.querySelectorAll(".lt-civi").forEach((el) => el.classList.toggle("aktif", el.dataset.p === (p && p.join(","))));
  }
  async function dokun(el) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid, p = el.dataset.p.split(",").map(Number);
    if (!d.aktif) {
      // Başlangıç çivisi şeklin üzerinde olmalı
      const ustunde = [...b.parcalar].some((s) => s.split("|").some((q) => q === p.join(",")));
      if (!ustunde) return salla(el);
      d.api.ses.tik(); return aktifYap(p);
    }
    if (d.aktif[0] === p[0] && d.aktif[1] === p[1]) { d.api.ses.tik(); return aktifYap(null); }
    const yeni = parcala(d.aktif, p);
    if (!yeni.every((s) => b.parcalar.has(s))) return salla(el);
    const [x1, y1] = xy(d.aktif), [x2, y2] = xy(p);
    d.sahne.querySelector(".lt-lastik").insertAdjacentHTML("beforeend", `<line class="lt-kenar" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${b.renk}" stroke-width="14"/>`);
    yeni.forEach((s) => d.cizili.add(s));
    d.kenarlar.push([d.aktif, p]);
    d.api.ses.yerlesti();
    aktifYap(p);
    if (d.cizili.size < b.parcalar.size) return;
    d.mesgul = true; aktifYap(null);
    d.sahne.querySelector(".lt-dolgular").innerHTML = `<path class="lt-dolgu" d="${yol(b.koseler)}" fill="${b.renk}" fill-opacity=".35"/>`;
    await bekle(700); if (!d || benim !== d.uid) return;
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Lastik ustası oldun!" : "En zor şekli de yaptın!") : "Şekli aynen yaptın!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.LASTIK_BOLUMLER = BOLUMLER;
  window.LASTIK_DURUM = () => d && { aktif: d.aktif, cizili: d.cizili.size };

  window.Uygulama.oyunEkle(51, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const b = BOLUMLER[d.idx], civi = (p) => ({ el: d.sahne.querySelector(`.lt-civi[data-p="${p.join(",")}"] .lt-bas`) });
      if (tam) return b.koseler.map(civi);
      if (!d.aktif) return [civi(b.koseler[0])];
      // Aktif çividen çizilmemiş bir şekil kenarı bul
      const k = b.koseler, j = k.findIndex((q) => q[0] === d.aktif[0] && q[1] === d.aktif[1]);
      if (j >= 0) for (const q of [k[(j + 1) % k.length], k[(j - 1 + k.length) % k.length]]) if (parcala(d.aktif, q).some((s) => !d.cizili.has(s))) return [civi(q)];
      return [{ el: d.sahne.querySelector(".lt-ornek") }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${ornekSvg({ n: 3, koseler: [[1, 0], [2, 2], [0, 2]], renk: "#ff5a4e" })}${ornekSvg({ n: 3, koseler: [[0, 0], [2, 0], [2, 2], [0, 2]], renk: "#2f86e0" })}</div>`; },
  });
})();
