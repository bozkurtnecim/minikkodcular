/* Kayan Yapboz (parça-bütün ve plan: parçaları boşluğa kaydırıp resmi tamamlamak).
   Resim karelere bölünmüş, bir kare boş. Boşluğun yanındaki kareye dokununca kare boşluğa kayar.
   Resim doğru dizilince eksik kare yerine gelir. Bölümler 2x2 ile başlar, 3x3'e çıkar; karışıklık giderek artar.
   Yandaki küçük örnek resim yol gösterir. Resimler js/resimler.js içinden.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "kayan";
  const R = () => window.RESIMLER;
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [ızgara, karıştırma hamlesi]
  const T = [
    [2, 1], [2, 2], [2, 3],
    [2, 4], [2, 5], [3, 2],
    [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8],
    [3, 9], [3, 10], [3, 11], [3, 12], [3, 13], [3, 14],
    [3, 15], [3, 16], [3, 17], [3, 18], [3, 19], [3, 20], [3, 21], [3, 22], [3, 23], [3, 24], [3, 25], [3, 26],
  ];
  // Çözülmüş hâlden geriye doğru rastgele, geri dönmeyen hamlelerle karıştır (her zaman çözülebilir)
  function karistir(g, hamle, tohum) {
    const r = tohumlu(tohum), n = g * g;
    for (;;) {
      const yer = [...Array(n).keys()]; // yer[hücre] = parça (n-1 boşluk)
      let bos = n - 1, onceki = -1;
      for (let h = 0; h < hamle; h++) {
        const kom = [bos - g, bos + g, bos % g ? bos - 1 : -1, bos % g < g - 1 ? bos + 1 : -1].filter((x) => x >= 0 && x < n && x !== onceki);
        const k = kom[Math.floor(r() * kom.length)];
        [yer[bos], yer[k]] = [yer[k], yer[bos]]; onceki = bos; bos = k;
      }
      if (yer.some((p, i) => p !== i)) return yer;
      tohum++;
    }
  }
  const BOLUMLER = T.map(([g, hamle], i) => ({ g, hamle, resim: (i * 17 + 2) % 30, yer: karistir(g, hamle, 4500 + i * 29), grup: Uygulama.seviye(i) }));

  const stil = `
  .ky2 { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eefaf3, #dff3e8); }
  .ky2-sahne { --r: 400px; --o: 120px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 28px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .ky2-sahne.dikey { flex-direction: column; gap: 14px; justify-content: safe center; }
  .ky2-tahta { position: relative; width: var(--r); height: var(--r); padding: 6px; border-radius: 20px; background: #b9e3c9; box-shadow: 0 8px 0 rgba(29,40,70,.14); flex: none; box-sizing: content-box; }
  .ky2-kare { position: absolute; padding: 0; border: 0; border-radius: 8px; background-repeat: no-repeat; cursor: pointer; transition: left .2s ease, top .2s ease; box-shadow: inset 0 0 0 2px rgba(255,255,255,.7); }
  .ky2-kare.oynar { animation: ky2-nefes 1.6s ease-in-out infinite; }
  @keyframes ky2-nefes { 50% { box-shadow: inset 0 0 0 4px #ffc23a; } }
  .ky2-kare.duz { box-shadow: none; border-radius: 0; }
  .ky2-tahta.tamam .ky2-kare { box-shadow: none; border-radius: 0; }
  .ky2-son { position: absolute; border-radius: 0; background-repeat: no-repeat; opacity: 0; transition: opacity .6s; pointer-events: none; }
  .ky2-tahta.tamam .ky2-son { opacity: 1; }
  .ky2-ornek { width: var(--o); height: var(--o); border-radius: 16px; background-size: cover; outline: 5px solid #fff; box-shadow: 0 6px 0 rgba(29,40,70,.14); flex: none; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ky2-stil")) { const st = document.createElement("style"); st.id = "ky2-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ky2"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ky2-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ky2-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.bitti) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.bitti = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.yer = [...b.yer];
    const src = R()[b.resim].src, n = b.g * b.g, pos = 100 / (b.g - 1);
    const arka = (p) => `background-image:url('${src}');background-size:${b.g * 100}% ${b.g * 100}%;background-position:${(p % b.g) * pos}% ${Math.floor(p / b.g) * pos}%`;
    d.sahne.innerHTML = `<div class="ky2-ornek" style="background-image:url('${src}')" aria-label="Örnek resim"></div>
      <div class="ky2-tahta">${[...Array(n - 1).keys()].map((p) => `<button class="ky2-kare" type="button" data-p="${p}" aria-label="Kare" style="${arka(p)}"></button>`).join("")}<div class="ky2-son" style="${arka(n - 1)}"></div></div>`;
    d.tahta = d.sahne.querySelector(".ky2-tahta");
    d.tahta.querySelectorAll(".ky2-kare").forEach((el) => (el.onclick = () => kaydir(+el.dataset.p)));
    boyutla();
  }
  function yerlestir() {
    const b = BOLUMLER[d.idx], k = d.r / b.g, bos = d.yer.indexOf(b.g * b.g - 1);
    const kom = (h) => [bos - b.g, bos + b.g].includes(h) || (Math.floor(h / b.g) === Math.floor(bos / b.g) && Math.abs(h - bos) === 1);
    d.yer.forEach((p, h) => {
      if (p === b.g * b.g - 1) return;
      const el = d.tahta.querySelector(`.ky2-kare[data-p="${p}"]`);
      Object.assign(el.style, { left: 6 + (h % b.g) * k + 2 + "px", top: 6 + Math.floor(h / b.g) * k + 2 + "px", width: k - 4 + "px", height: k - 4 + "px" });
      el.classList.toggle("oynar", !d.bitti && kom(h));
      el.classList.toggle("duz", p === h);
    });
    const son = d.tahta.querySelector(".ky2-son"), sh = b.g * b.g - 1;
    Object.assign(son.style, { left: 6 + (sh % b.g) * k + "px", top: 6 + Math.floor(sh / b.g) * k + "px", width: k + "px", height: k + "px" });
  }
  function boyutla() {
    if (!d || !d.tahta) return;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.05;
    d.sahne.classList.toggle("dikey", dikey);
    let r, o;
    if (dikey) { o = Math.min(W * 0.32, H * 0.18, 130); r = Math.min(W - 24, H - o - 40, 520); }
    else { o = Math.min(W * 0.18, H * 0.4, 180); r = Math.min(H - 24, W - o - 70, 560); }
    d.r = Math.floor(Math.max(160, r));
    d.sahne.style.setProperty("--r", d.r + "px"); d.sahne.style.setProperty("--o", Math.floor(o) + "px");
    yerlestir();
  }
  async function kaydir(p) {
    if (d.bitti) return;
    const b = BOLUMLER[d.idx], benim = d.uid, h = d.yer.indexOf(p), bos = d.yer.indexOf(b.g * b.g - 1);
    const kom = [bos - b.g, bos + b.g].includes(h) || (Math.floor(h / b.g) === Math.floor(bos / b.g) && Math.abs(h - bos) === 1);
    if (!kom) { d.api.ses.hata(); return; }
    [d.yer[h], d.yer[bos]] = [d.yer[bos], d.yer[h]];
    d.api.ses.ton(d.yer[bos] === bos ? 784 : 587, 0.1);
    yerlestir();
    if (d.yer.every((x, i) => x === i)) {
      d.bitti = true; yerlestir();
      await bekle(250); if (!d || benim !== d.uid) return;
      d.tahta.classList.add("tamam"); d.api.ses.yerlesti();
      await bekle(900); if (!d || benim !== d.uid) return;
      bitir();
    }
  }
  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün kayan yapbozlar tamam!" : "Son yapboz da tamam!") : `${R()[BOLUMLER[d.idx].resim].ad} tamamlandı!`, son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }
  // İpucu için en kısa çözüm (BFS; 3x3'te 26 hamleye kadar hızlı)
  function cozum(yer, g) {
    const n = g * g, hedef = [...Array(n).keys()].join(","), bas = yer.join(",");
    if (bas === hedef) return [];
    const onceki = new Map([[bas, null]]), q = [yer.slice()];
    while (q.length) {
      const y = q.shift(), ky = y.join(","), bos = y.indexOf(n - 1);
      for (const k of [bos - g, bos + g, bos % g ? bos - 1 : -1, bos % g < g - 1 ? bos + 1 : -1]) {
        if (k < 0 || k >= n) continue;
        const z = y.slice(); [z[bos], z[k]] = [z[k], z[bos]];
        const kz = z.join(",");
        if (onceki.has(kz)) continue;
        onceki.set(kz, [ky, y[k]]);
        if (kz === hedef) { const yol = []; let a = kz; while (onceki.get(a)) { const [o, p] = onceki.get(a); yol.unshift(p); a = o; } return yol; }
        q.push(z);
      }
    }
    return [];
  }

  window.KAYAN_BOLUMLER = BOLUMLER;
  window.KAYAN_COZUM = () => d && cozum(d.yer, BOLUMLER[d.idx].g);

  window.Uygulama.oyunEkle(45, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d || d.bitti) return [];
      const yol = cozum(d.yer, BOLUMLER[d.idx].g).slice(0, tam ? undefined : 1);
      return yol.map((p) => ({ el: d.tahta.querySelector(`.ky2-kare[data-p="${p}"]`) }));
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const s = R()[9].src, pos = ["0 0", "100% 0", "0 100%"];
      return `<div class="mini" aria-hidden="true">${pos.map((p) => `<span style="background-image:url('${s}');background-position:${p}"></span>`).join("")}<span style="background:#b9e3c9"></span></div>`;
    },
  });
})();
