/* Kim Nerede? (mantık: resimli ipuçlarından sonuç çıkarmak).
   Renkli evler yan yana durur. İpucu kartlarına bak, her hayvanı kendi evine yerleştir: önce hayvana, sonra eve dokun.
   İpuçları: "kedi kırmızı evde", "kedi mavi evde değil" (çarpı), "kedinin evi tavşanın evinin hemen solunda" (yan yana iki ev).
   Hepsi yerleşince kontrol edilir; yanlışsa yanlışlar sallanır ve bütün hayvanlar geri döner.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "kimnerede";
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const HAYVAN = ["kedi", "kus", "tavsan", "civciv"];
  const EV = [{ ad: "kırmızı", renk: "#ff5a4e" }, { ad: "mavi", renk: "#2f86e0" }, { ad: "sarı", renk: "#ffc23a" }, { ad: "yeşil", renk: "#2fb36a" }];
  // [ev sayısı, ipucu türleri]
  const T = [
    [2, "e"], [2, "e"], [3, "e"],
    [3, "e"], [2, "d"], [3, "ed"],
    [3, "ed"], [3, "d"], [3, "ed"], [3, "d"], [3, "es"], [3, "ds"],
    [3, "ds"], [4, "ed"], [4, "eds"], [3, "s d"], [4, "ds"], [4, "eds"],
    [4, "ds"], [4, "ds"], [4, "sd"], [4, "ds"], [4, "sd"], [4, "ds"],
    [4, "sd"], [4, "ds"], [4, "sd"], [4, "sd"], [4, "ds"], [4, "sd"],
  ];
  function karistir(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function permler(n) { if (n === 1) return [[0]]; const out = []; permler(n - 1).forEach((p) => { for (let i = 0; i <= p.length; i++) out.push([...p.slice(0, i), n - 1, ...p.slice(i)]); }); return out; }
  const uyar = (p, ip) => (ip.t === "e" ? p[ip.a] === ip.h : ip.t === "d" ? p[ip.a] !== ip.h : p[ip.b] === p[ip.a] + 1);
  const BOLUMLER = T.map(([n, turler], i) => {
    const r = tohumlu(5900 + i * 73), hepsi = permler(n);
    for (;;) {
      const cozum = karistir([...Array(n).keys()], r); // cozum[hayvan] = ev
      const aday = [];
      for (let a = 0; a < n; a++) {
        if (turler.includes("e")) aday.push({ t: "e", a, h: cozum[a] });
        if (turler.includes("d")) for (let h = 0; h < n; h++) if (h !== cozum[a]) aday.push({ t: "d", a, h });
        if (turler.includes("s")) for (let b = 0; b < n; b++) if (cozum[b] === cozum[a] + 1) aday.push({ t: "s", a, b });
      }
      // Türlerin ilki öncelikli: ilk tür adaylar önce gelir, sonra diğerleri
      const sirali = karistir(aday, r).sort((x, y) => turler.indexOf(x.t) - turler.indexOf(y.t) + (r() - 0.5) * 1.2);
      let kalan = hepsi.slice(); const ipucu = [];
      for (const ip of sirali) {
        const yeni = kalan.filter((p) => uyar(p, ip));
        if (yeni.length < kalan.length) { ipucu.push(ip); kalan = yeni; }
        if (kalan.length === 1) break;
      }
      if (kalan.length !== 1 || ipucu.length > 6) continue;
      return { n, cozum, ipucu: karistir(ipucu, r), hayvanlar: HAYVAN.slice(0, n), grup: Uygulama.seviye(i) };
    }
  });

  const img = (id) => (window.NESNELER && NESNELER[id] ? `<img src="${NESNELER[id].src}" alt="">` : "");
  const evSvg = (h, carpi) => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M10 46 L50 10 L90 46 Z" fill="#8a5a33"/><rect x="18" y="42" width="64" height="50" rx="5" fill="${EV[h].renk}"/><rect x="42" y="62" width="16" height="30" rx="3" fill="#fff" opacity=".85"/>${carpi ? `<path d="M14 14 L86 86 M86 14 L14 86" stroke="#e5352a" stroke-width="12" stroke-linecap="round"/>` : ""}</svg>`;
  const okSvg = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 20 H30 M22 11 L32 20 L22 29" stroke="#1d2846" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  function ipucuHtml(ip, b) {
    if (ip.t === "s") return `<div class="kn-ipucu yan"><div class="kn-cift"><span>${img(b.hayvanlar[ip.a])}</span><span>${img(b.hayvanlar[ip.b])}</span></div></div>`;
    return `<div class="kn-ipucu"><span class="kn-k">${img(b.hayvanlar[ip.a])}</span><span class="kn-ok">${okSvg}</span><span class="kn-k">${evSvg(ip.h, ip.t === "d")}</span></div>`;
  }

  const stil = `
  .kn { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f2fbff, #dff0fb); }
  .kn-sahne { --e: 110px; --i: 50px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 16px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .kn-ipuclari { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
  .kn-ipucu { display: flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 16px; background: #fff; box-shadow: 0 4px 0 rgba(29,40,70,.12); }
  .kn-ipucu .kn-k { width: var(--i); height: var(--i); display: block; } .kn-ipucu .kn-k img, .kn-ipucu .kn-k svg { width: 100%; height: 100%; display: block; }
  .kn-ipucu .kn-ok { width: calc(var(--i) * .55); height: calc(var(--i) * .55); } .kn-ipucu .kn-ok svg { width: 100%; height: 100%; display: block; }
  .kn-cift { display: flex; border-bottom: 6px solid #8a5a33; border-radius: 4px; }
  .kn-cift span { width: var(--i); height: var(--i); margin: 0 3px; padding: 4px; box-sizing: border-box; border-radius: 10px 10px 0 0; background: #ffe9c9; }
  .kn-cift span + span { background: #ffe9c9; } .kn-cift img { width: 100%; height: 100%; display: block; }
  .kn-evler { display: flex; justify-content: center; gap: 12px; padding: 0 8px 8px; border-bottom: 8px solid #6fbf4f; }
  .kn-ev { position: relative; width: var(--e); height: calc(var(--e) * 1.25); padding: 0; border: 0; background: none; cursor: pointer; }
  .kn-ev > svg { position: absolute; left: 0; bottom: 0; width: 100%; height: auto; }
  .kn-ev .kn-yer { position: absolute; left: 22%; right: 22%; top: 0; aspect-ratio: 1; border-radius: 50%; border: 3px dashed rgba(29,40,70,.25); background: rgba(255,255,255,.6); }
  .kn-ev .kn-yer img { width: 100%; height: 100%; display: block; }
  .kn-ev .kn-yer.dolu { border-style: solid; border-color: transparent; background: #fff; }
  .kn-ev.sec .kn-yer { border-color: #1d2846; }
  .kn-ev.yanlis .kn-yer { animation: kn-salla .45s 2; background: #ffd0cc; }
  .kn-tepsi { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; min-height: calc(var(--e) * .7); }
  .kn-hayvan { width: calc(var(--e) * .7); height: calc(var(--e) * .7); padding: 6px; box-sizing: border-box; border: 4px solid transparent; border-radius: 18px; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.14); cursor: pointer; }
  .kn-hayvan img { width: 100%; height: 100%; display: block; pointer-events: none; }
  .kn-hayvan.secili { border-color: #1d2846; transform: translateY(-4px); }
  .kn-tepsi.uyar .kn-hayvan { animation: kn-salla .45s; }
  @keyframes kn-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("kn-stil")) { const st = document.createElement("style"); st.id = "kn-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="kn"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="kn-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".kn-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.secili = null; d.yer = b.hayvanlar.map(() => -1); // yer[hayvan] = ev
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.sahne.innerHTML = `<div class="kn-ipuclari">${b.ipucu.map((ip) => ipucuHtml(ip, b)).join("")}</div>
      <div class="kn-evler">${Array.from({ length: b.n }, (_, h) => `<button class="kn-ev" type="button" data-e="${h}" aria-label="${EV[h].ad} ev"><div class="kn-yer"></div>${evSvg(h)}</button>`).join("")}</div>
      <div class="kn-tepsi"></div>`;
    d.sahne.querySelectorAll(".kn-ev").forEach((el) => (el.onclick = () => evTik(+el.dataset.e)));
    ciz(); boyutla();
  }
  function ciz() {
    const b = BOLUMLER[d.idx];
    d.sahne.querySelector(".kn-tepsi").innerHTML = b.hayvanlar.map((id, a) => (d.yer[a] < 0 ? `<button class="kn-hayvan${d.secili === a ? " secili" : ""}" type="button" data-h="${a}" aria-label="${NESNELER[id] ? NESNELER[id].ad : id}">${img(id)}</button>` : "")).join("");
    d.sahne.querySelectorAll(".kn-tepsi .kn-hayvan").forEach((el) => {
      el.onclick = () => { if (d.mesgul) return; d.secili = +el.dataset.h; d.api.ses.tik(); ciz(); };
      // Hayvan eve sürüklenebilir de
      Uygulama.surukleBirak(el, { hedef: ".kn-ev", birak: (e) => { d.secili = +el.dataset.h; evTik(+e.dataset.e); }, izin: () => !d.mesgul });
    });
    d.sahne.querySelectorAll(".kn-ev").forEach((el) => {
      const h = +el.dataset.e, a = d.yer.indexOf(h), yer = el.querySelector(".kn-yer");
      yer.innerHTML = a >= 0 ? img(b.hayvanlar[a]) : ""; yer.classList.toggle("dolu", a >= 0);
      el.classList.toggle("sec", d.secili !== null && a < 0);
    });
  }
  function boyutla() {
    if (!d) return;
    const b = BOLUMLER[d.idx], W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    // Evler + tepsi yaklaşık 2.1 ev yüksekliği; kalan yer ipuçlarına
    const e = Math.min((W - 20 - (b.n - 1) * 12) / b.n, (H - 120) / 2.9, 190);
    const kartGen = (i) => (b.ipucu.some((ip) => ip.t !== "s") ? i * 2.55 : i * 2.2) + 30;
    let i = Math.min(e * 0.6, 92);
    for (; i > 32; i -= 2) { const sat = Math.ceil(b.ipucu.length / Math.max(1, Math.floor((W + 10) / (kartGen(i) + 10)))); if (sat * (i + 22) + 10 <= H - e * 2.1 - 50) break; }
    d.sahne.style.setProperty("--e", Math.floor(Math.max(60, e)) + "px"); d.sahne.style.setProperty("--i", Math.floor(Math.max(32, i)) + "px");
  }
  async function evTik(h) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid, icindeki = d.yer.indexOf(h);
    if (d.secili === null) {
      // Evdeki hayvana dokununca tepsiye döner
      if (icindeki >= 0) { d.yer[icindeki] = -1; d.api.ses.tik(); ciz(); }
      else { const t = d.sahne.querySelector(".kn-tepsi"); t.classList.remove("uyar"); void t.offsetWidth; t.classList.add("uyar"); }
      return;
    }
    if (icindeki >= 0) d.yer[icindeki] = -1;
    d.yer[d.secili] = h; d.secili = null; d.api.ses.yerlesti(); ciz();
    if (d.yer.some((x) => x < 0)) return;
    d.mesgul = true; await bekle(450); if (!d || benim !== d.uid) return;
    const yanlis = b.cozum.map((h2, a) => (d.yer[a] !== h2 ? d.yer[a] : -1)).filter((x) => x >= 0);
    if (!yanlis.length) { d.api.ses.yerlesti(); await bekle(500); if (!d || benim !== d.uid) return; return bitir(); }
    // Yanlış evdekiler sallanır, sonra bütün hayvanlar tepsiye döner; çocuk baştan yerleştirir
    yanlis.forEach((x) => d.sahne.querySelector(`.kn-ev[data-e="${x}"]`).classList.add("yanlis"));
    d.api.ses.hata();
    await bekle(1300); if (!d || benim !== d.uid) return;
    d.sahne.querySelectorAll(".kn-ev.yanlis").forEach((e) => e.classList.remove("yanlis"));
    d.yer = b.hayvanlar.map(() => -1); d.mesgul = false; ciz();
  }
  function bitir() {
    d.mesgul = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Minik dedektif oldun!" : "En zor bilmeceyi de çözdün!") : "Herkes evine yerleşti!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.KIMNEREDE_BOLUMLER = BOLUMLER;
  window.KIMNEREDE_DURUM = () => d && { yer: d.yer.slice() };

  window.Uygulama.oyunEkle(59, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const b = BOLUMLER[d.idx], out = [];
      for (let a = 0; a < b.n && out.length < (tam ? 99 : 2); a++) {
        if (d.yer[a] === b.cozum[a]) continue;
        out.push({ el: d.sahne.querySelector(`.kn-hayvan[data-h="${a}"]`) || d.sahne.querySelector(`.kn-ev[data-e="${d.yer[a]}"]`) }, { el: d.sahne.querySelector(`.kn-ev[data-e="${b.cozum[a]}"]`) });
      }
      return out.filter((x) => x.el);
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${evSvg(0)}${evSvg(1)}${evSvg(2)}</div>`; },
  });
})();
