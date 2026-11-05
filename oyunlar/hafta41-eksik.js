/* Eksik Parça (parça-bütün: resmin kayıp parçasını bulmak).
   Resimde bir (çok zorda iki) kare boşluk var. Altta birkaç parça durur; doğru parçaya dokununca boşluğa uçar.
   Çeldiriciler aynı resmin başka yerlerinden alınır; zor bölümlerden itibaren doğru parçanın döndürülmüş
   ya da aynalanmış hâli de çeldirici olur. Resimler js/resimler.js içinden.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "eksik";
  const R = () => window.RESIMLER;
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [ızgara, boşluk, seçenek sayısı, dönük çeldirici]
  const T = [
    [3, 1, 2, 0], [3, 1, 2, 0], [3, 1, 3, 0],
    [3, 1, 3, 0], [3, 1, 3, 0], [4, 1, 3, 0],
    [4, 1, 3, 0], [4, 1, 4, 0], [4, 1, 4, 0], [4, 1, 4, 0], [4, 1, 4, 0], [5, 1, 4, 0],
    [4, 1, 4, 1], [4, 1, 4, 1], [5, 1, 4, 1], [5, 1, 4, 1], [5, 1, 5, 1], [5, 1, 5, 1],
    [4, 2, 4, 0], [4, 2, 4, 0], [4, 2, 5, 0], [5, 2, 5, 0], [5, 2, 5, 1], [5, 2, 5, 1],
    [5, 2, 6, 1], [5, 2, 6, 1], [5, 2, 6, 1], [6, 2, 6, 1], [6, 2, 6, 1], [6, 2, 6, 1],
  ];
  const BOLUMLER = T.map(([g, bos, n, don], i) => ({ g, bos, n, don, resim: (i * 11 + 5) % 30, tohum: 7000 + i * 53, grup: Uygulama.seviye(i) }));

  // Hücrelerin renk çeşitliliği: boşluklar ilginç yerlere gelsin
  const puanOnbellek = {};
  function hucrePuanlari(b) {
    const anahtar = `${b.resim},${b.g}`;
    if (puanOnbellek[anahtar]) return Promise.resolve(puanOnbellek[anahtar]);
    return new Promise((coz) => {
      const img = new Image();
      const yedek = () => Array(b.g * b.g).fill(1);
      img.onload = () => {
        let p = yedek();
        try {
          const N = 120, c = document.createElement("canvas"); c.width = c.height = N;
          const gx = c.getContext("2d"); gx.drawImage(img, 0, 0, N, N);
          const v = gx.getImageData(0, 0, N, N).data, w = N / b.g;
          p = p.map((_, h) => {
            const x0 = Math.floor((h % b.g) * w), y0 = Math.floor(Math.floor(h / b.g) * w), renk = new Set();
            for (let y = y0; y < y0 + w; y += 2) for (let x = x0; x < x0 + w; x += 2) { const o = (y * N + x) * 4; renk.add(`${v[o] >> 5},${v[o + 1] >> 5},${v[o + 2] >> 5}`); }
            return renk.size;
          });
        } catch (e) {}
        puanOnbellek[anahtar] = p; coz(p);
      };
      img.onerror = () => coz(yedek());
      img.src = R()[b.resim].src;
    });
  }
  async function kur(b) {
    const r = tohumlu(b.tohum), p = await hucrePuanlari(b);
    const sirali = p.map((v, h) => [v + r() * 2, h]).sort((x, y) => y[0] - x[0]).map((x) => x[1]);
    // Boşluklar: en ilginç hücrelerden, birbirine bitişik olmasın
    const bosluk = [];
    for (const h of sirali) {
      if (bosluk.length >= b.bos) break;
      if (bosluk.every((q) => Math.abs((q % b.g) - (h % b.g)) + Math.abs(Math.floor(q / b.g) - Math.floor(h / b.g)) > 1)) bosluk.push(h);
    }
    // Seçenekler: doğru parçalar + başka yerlerden parçalar + dönük/aynalı hâller
    const parca = bosluk.map((h) => ({ h, don: 0, ayna: false, dogru: true }));
    const cel = [];
    if (b.don) bosluk.forEach((h) => cel.push({ h, don: r() < 0.5 ? 90 : 180, ayna: false }, { h, don: 0, ayna: true }));
    sirali.filter((h) => !bosluk.includes(h)).slice(0, 8).forEach((h) => cel.push({ h, don: 0, ayna: false }));
    const kalan = b.n - parca.length;
    const celSec = (b.don ? [...cel.slice(0, Math.min(2, kalan - 1)), ...cel.slice(b.bos * 2)] : cel).slice(0, kalan);
    const secenek = [...parca, ...celSec].map((x) => [r(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
    return { bosluk, secenek };
  }

  const stil = `
  .ep { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eef6ff, #e1eefc); }
  .ep-sahne { --r: 360px; --s: 100px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 28px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .ep-sahne.dikey { flex-direction: column; gap: 16px; justify-content: safe center; }
  .ep-resim { position: relative; width: var(--r); height: var(--r); border-radius: 18px; background-size: cover; box-shadow: 0 8px 0 rgba(29,40,70,.14); outline: 6px solid #fff; flex: none; }
  .ep-bosluk { position: absolute; background: #fff; box-shadow: inset 0 0 0 4px #9fb7d4; border-radius: 6px; background-image: repeating-linear-gradient(45deg, #eef3fa 0 8px, #fff 8px 16px); }
  .ep-bosluk.dolu { background-image: none; box-shadow: none; animation: ep-pir .45s; }
  @keyframes ep-pir { 50% { transform: scale(1.12); } }
  .ep-secenekler { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; max-width: calc(var(--s) * 3 + 40px); }
  .ep-parca { position: relative; width: var(--s); height: var(--s); padding: 0; border: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 0 rgba(29,40,70,.16); outline: 4px solid #fff; cursor: pointer; background: #fff; transition: opacity .3s, transform .15s; }
  .ep-parca > i { position: absolute; inset: 0; background-repeat: no-repeat; }
  .ep-parca:active { transform: translateY(3px); }
  .ep-parca.yanlis { opacity: .25; animation: ep-salla .45s; pointer-events: none; }
  .ep-parca.gitti { opacity: 0; pointer-events: none; }
  @keyframes ep-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .ep-ucan { position: fixed; z-index: 40; border-radius: 10px; overflow: hidden; transition: all .45s ease-in-out; pointer-events: none; }
  .ep-ucan > i { position: absolute; inset: 0; background-repeat: no-repeat; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ep-stil")) { const st = document.createElement("style"); st.id = "ep-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ep"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ep-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ep-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  // Parçanın görüntüsü: resmin h hücresi, döndürülmüş ya da aynalanmış olabilir
  const parcaStil = (b, p) => {
    const src = R()[b.resim].src, x = p.h % b.g, y = Math.floor(p.h / b.g), pos = b.g > 1 ? 100 / (b.g - 1) : 0;
    return `background-image:url('${src}');background-size:${b.g * 100}% ${b.g * 100}%;background-position:${x * pos}% ${y * pos}%;transform:rotate(${p.don}deg)${p.ayna ? " scaleX(-1)" : ""}`;
  };
  async function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.dolan = new Set();
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const benim = d.uid;
    d.sahne.innerHTML = "";
    const k = await kur(b);
    if (!d || benim !== d.uid) return;
    d.kurulum = k;
    const src = R()[b.resim].src, w = 100 / b.g;
    d.sahne.innerHTML = `
      <div class="ep-resim" style="background-image:url('${src}')">${k.bosluk.map((h) => `<div class="ep-bosluk" data-h="${h}" style="left:${(h % b.g) * w}%;top:${Math.floor(h / b.g) * w}%;width:${w}%;height:${w}%"></div>`).join("")}</div>
      <div class="ep-secenekler">${k.secenek.map((p, j) => `<button class="ep-parca" type="button" data-j="${j}" aria-label="Parça"><i style="${parcaStil(b, p)}"></i></button>`).join("")}</div>`;
    d.sahne.querySelectorAll(".ep-parca").forEach((el) => { el.onclick = () => sec(el); Uygulama.surukleBirak(el, { hedef: ".ep-resim", birak: () => sec(el), izin: () => !d.mesgul }); });
    boyutla();
  }
  function boyutla() {
    if (!d || !d.kurulum) return;
    const n = d.kurulum.secenek.length, sut = Math.min(3, n), sat = Math.ceil(n / sut);
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.05;
    d.sahne.classList.toggle("dikey", dikey);
    let r, s;
    if (dikey) { s = Math.min((W - 28 - (sut - 1) * 14) / sut, 120); r = Math.min(W - 12, H - sat * (s + 14) - 30); }
    else { r = Math.min(H - 12, W * 0.55); s = Math.min((W - r - 80 - (sut - 1) * 14) / sut, (H - (sat - 1) * 14) / sat, 150); }
    d.sahne.style.setProperty("--r", Math.floor(Math.max(180, r)) + "px");
    d.sahne.style.setProperty("--s", Math.floor(Math.max(64, s)) + "px");
  }
  async function sec(el) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid, p = d.kurulum.secenek[+el.dataset.j];
    const hedefH = p.don === 0 && !p.ayna && d.kurulum.bosluk.includes(p.h) && !d.dolan.has(p.h) ? p.h : null;
    if (hedefH === null) { el.classList.add("yanlis"); d.api.ses.hata(); return; }
    d.mesgul = true;
    // Parça boşluğa uçar
    const hedef = d.sahne.querySelector(`.ep-bosluk[data-h="${hedefH}"]`), a = el.getBoundingClientRect(), z = hedef.getBoundingClientRect();
    const ucan = document.createElement("div");
    ucan.className = "ep-ucan"; ucan.innerHTML = el.innerHTML;
    Object.assign(ucan.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
    document.body.appendChild(ucan); el.classList.add("gitti");
    void ucan.offsetWidth;
    Object.assign(ucan.style, { left: z.left + "px", top: z.top + "px", width: z.width + "px", height: z.height + "px", borderRadius: "0" });
    await bekle(480);
    ucan.remove();
    if (!d || benim !== d.uid) return;
    hedef.classList.add("dolu"); hedef.style.background = "none"; hedef.style.boxShadow = "none";
    d.dolan.add(hedefH); d.api.ses.yerlesti();
    d.mesgul = false;
    if (d.dolan.size === d.kurulum.bosluk.length) { d.mesgul = true; await bekle(700); if (!d || benim !== d.uid) return; bitir(); }
  }
  function bitir() {
    d.mesgul = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün resimler tamamlandı!" : "Son resim de tamam!") : "Resim tamamlandı!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.EKSIK_BOLUMLER = BOLUMLER;
  window.EKSIK_DURUM = () => d && d.kurulum;

  window.Uygulama.oyunEkle(41, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d || !d.kurulum) return [];
      const j = d.kurulum.secenek.findIndex((p) => p.dogru && !d.dolan.has(p.h));
      if (j < 0) return [];
      return [{ el: d.sahne.querySelector(`.ep-bosluk[data-h="${d.kurulum.secenek[j].h}"]`) }, { el: d.sahne.querySelector(`.ep-parca[data-j="${j}"]`) }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { const s = R()[3].src; return `<div class="mini" aria-hidden="true" style="display:block;position:relative;width:74px;height:74px;border-radius:12px;background:url('${s}') center / cover;transform:rotate(-4deg)"><span style="position:absolute;left:38%;top:30%;width:34%;height:34%;background:repeating-linear-gradient(45deg,#eef3fa 0 5px,#fff 5px 10px);box-shadow:inset 0 0 0 3px #9fb7d4;border-radius:4px"></span></div>`; },
  });
})();
