/* Gizli Şekil (şekil tanıma: iç içe geçmiş çizgilerin arasında şekli görmek).
   Üstte birbirinin üstüne çizilmiş şekil çizgileri var. Altta birkaç şekil kartı; bunlardan yalnız biri resimde saklı.
   Saklı olana dokununca resimdeki yeri renklenir. Şekiller bölümler ilerledikçe çoğalır, döner, boyları değişir
   ve benzer şekiller (kare-dikdörtgen, daire-oval) seçeneklere girer.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "gizli";
  const yildiz = (() => { let s = "M"; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 19 : 42; s += `${50 + r * Math.cos(a)} ${54 + r * Math.sin(a)} `; } return s + "Z"; })();
  const SEKIL = {
    daire: `<circle cx="50" cy="50" r="40"/>`, oval: `<ellipse cx="50" cy="50" rx="44" ry="26"/>`,
    kare: `<rect x="12" y="12" width="76" height="76"/>`, dikdortgen: `<rect x="6" y="28" width="88" height="44"/>`,
    ucgen: `<path d="M50 8 L92 86 H8 Z"/>`, yildiz: `<path d="${yildiz}"/>`,
    kalp: `<path d="M50 88 C10 60 6 34 22 20 C34 10 46 16 50 28 C54 16 66 10 78 20 C94 34 90 60 50 88 Z"/>`,
    altigen: `<path d="M28 10 H72 L94 50 L72 90 H28 L6 50 Z"/>`, ok: `<path d="M8 38 H54 V16 L94 50 L54 84 V62 H8 Z"/>`,
  };
  const BENZER = { kare: "dikdortgen", dikdortgen: "kare", daire: "oval", oval: "daire", altigen: "daire", yildiz: "kalp" };
  const RENK = ["#ff5a4e", "#2f86e0", "#2fb36a", "#ffc23a", "#8a5cf0", "#ff8a1f"];
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [resimdeki şekil sayısı, seçenek sayısı, dönme, benzer çeldirici]
  const T = [
    [1, 2, 0, 0], [2, 2, 0, 0], [2, 3, 0, 0],
    [3, 3, 0, 0], [3, 3, 0, 0], [3, 3, 1, 0],
    [3, 4, 1, 0], [4, 3, 1, 0], [4, 4, 1, 0], [4, 4, 1, 0], [4, 4, 1, 1], [5, 4, 1, 0],
    [4, 4, 1, 1], [5, 4, 1, 1], [5, 4, 1, 1], [5, 4, 1, 1], [6, 4, 1, 1], [6, 4, 1, 1],
    [5, 5, 1, 1], [6, 5, 1, 1], [6, 5, 1, 1], [6, 5, 1, 1], [7, 5, 1, 1], [7, 5, 1, 1],
    [7, 5, 1, 1], [7, 6, 1, 1], [8, 5, 1, 1], [8, 6, 1, 1], [8, 6, 1, 1], [9, 6, 1, 1],
  ];
  const BOLUMLER = T.map(([n, secSay, don, benzer], i) => {
    const r = tohumlu(4900 + i * 47), turler = Object.keys(SEKIL);
    for (;;) {
      const karisik = turler.map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
      const cevap = karisik[0];
      // Resimde: cevap + (çeldirici olmayan) başka şekiller; seçeneklerde cevap + resimde olmayanlar
      const resimde = [cevap];
      let disari = karisik.slice(1);
      if (benzer && BENZER[cevap]) disari = [BENZER[cevap], ...disari.filter((x) => x !== BENZER[cevap])];
      const secenek = [cevap, ...disari.slice(0, secSay - 1)];
      const kalan = turler.filter((x) => !secenek.includes(x));
      while (resimde.length < n) resimde.push(kalan.length ? kalan[Math.floor(r() * kalan.length)] : cevap);
      if (resimde.length < n) continue;
      const parcalar = resimde.map((s, j) => ({ s, x: 22 + r() * 56, y: 22 + r() * 56, boy: (n >= 7 ? 0.36 : 0.42) + r() * (n >= 7 ? 0.24 : 0.3), aci: don && s !== "daire" ? Math.round((r() - 0.5) * 70) : 0, cevap: j === 0 }));
      return { parcalar: parcalar.map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]), secenek: secenek.map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]), cevap, renk: RENK[Math.floor(r() * RENK.length)], grup: Uygulama.seviye(i) };
    }
  });
  const parcaSvg = (p, cls) => `<g class="${cls}" transform="translate(${p.x} ${p.y}) rotate(${p.aci}) scale(${p.boy}) translate(-50 -50)">${SEKIL[p.s]}</g>`;
  const kartSvg = (s, renk) => `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="${renk}" stroke="rgba(0,0,0,.2)" stroke-width="3" stroke-linejoin="round">${SEKIL[s]}</g></svg>`;

  const stil = `
  .gz { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f6f2ff, #ebe4fb); }
  .gz-sahne { --r: 360px; --s: 110px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 28px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .gz-sahne.dikey { flex-direction: column; gap: 16px; justify-content: safe center; }
  .gz-resim { width: var(--r); height: var(--r); padding: 12px; border-radius: 26px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; box-sizing: border-box; }
  .gz-resim svg { width: 100%; height: 100%; display: block; overflow: visible; }
  .gz-resim .p { fill: none; stroke: #4a5568; stroke-width: 4; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
  .gz-resim .p.bulundu { fill: var(--rk); fill-opacity: .55; stroke: var(--rk); stroke-width: 6; transition: all .4s; }
  .gz-secenekler { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; max-width: calc(var(--s) * 3 + 40px); }
  .gz-kart { width: var(--s); height: var(--s); box-sizing: border-box; padding: calc(var(--s) * .14); border: 0; border-radius: 22px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.14); cursor: pointer; }
  .gz-kart svg { width: 100%; height: 100%; display: block; }
  .gz-kart:active { transform: translateY(3px); }
  .gz-kart.yanlis { animation: gz-salla .45s; opacity: .45; }
  .gz-kart.dogru { outline: 6px solid var(--yesil); transform: scale(1.06); }
  @keyframes gz-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("gz-stil")) { const st = document.createElement("style"); st.id = "gz-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="gz"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="gz-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".gz-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    d.sahne.innerHTML = `<div class="gz-resim" style="--rk:${b.renk}"><svg viewBox="0 0 100 100" aria-label="Resim">${b.parcalar.map((p) => parcaSvg(p, "p" + (p.cevap ? " cevap" : ""))).join("")}</svg></div>
      <div class="gz-secenekler">${b.secenek.map((s) => `<button class="gz-kart" type="button" data-s="${s}" aria-label="Şekil">${kartSvg(s, b.renk)}</button>`).join("")}</div>`;
    d.sahne.querySelectorAll(".gz-kart").forEach((el) => (el.onclick = () => sec(el)));
    boyutla();
  }
  function boyutla() {
    if (!d) return;
    const n = BOLUMLER[d.idx].secenek.length, sut = Math.min(3, n), sat = Math.ceil(n / sut);
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.05;
    d.sahne.classList.toggle("dikey", dikey);
    let r, s;
    if (dikey) { s = Math.min((W - 28 - (sut - 1) * 14) / sut, 120); r = Math.min(W - 20, H - sat * (s + 14) - 30, 460); }
    else { r = Math.min(H - 20, W * 0.52, 520); s = Math.min((W - r - 80 - (sut - 1) * 14) / sut, (H - (sat - 1) * 14) / sat, 150); }
    d.sahne.style.setProperty("--r", Math.floor(Math.max(180, r)) + "px"); d.sahne.style.setProperty("--s", Math.floor(Math.max(64, s)) + "px");
  }
  async function sec(el) {
    if (d.bitti) return;
    const b = BOLUMLER[d.idx], benim = d.uid;
    if (el.dataset.s !== b.cevap) { el.classList.remove("yanlis"); void el.offsetWidth; el.classList.add("yanlis"); d.api.ses.hata(); return; }
    d.bitti = true; el.classList.add("dogru");
    d.sahne.querySelectorAll(".gz-resim .cevap").forEach((p) => p.classList.add("bulundu"));
    d.api.ses.yerlesti();
    await bekle(1100); if (!d || benim !== d.uid) return;
    bitir();
  }
  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Hiçbir şekil senden saklanamaz!" : "Son saklı şekli de buldun!") : "Saklı şekli buldun!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.GIZLI_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(49, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      return [{ el: d.sahne.querySelector(".gz-resim") }, { el: d.sahne.querySelector(`.gz-kart[data-s="${BOLUMLER[d.idx].cevap}"]`) }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-sekil" aria-hidden="true"><svg viewBox="0 0 100 100"><g fill="none" stroke="#4a5568" stroke-width="4">${parcaSvg({ s: "daire", x: 40, y: 45, boy: 0.6, aci: 0 }, "")}${parcaSvg({ s: "ucgen", x: 60, y: 55, boy: 0.6, aci: 10 }, "")}${parcaSvg({ s: "kare", x: 50, y: 40, boy: 0.45, aci: -15 }, "")}</g></svg></div>`; },
  });
})();
