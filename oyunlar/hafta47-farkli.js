/* Farklı Olanı Bul (görsel algı: bir sıradaki farklı şekli bulmak).
   Kartlarda şekiller var; biri ötekilerden farklı. Farklı olana dokun.
   Fark önce renkte, sonra şekilde, boyda, yönde, aynalamada ve üstündeki nokta sayısında olur.
   Çok zor bölümlerde öteki özellikler de karışır: renkler hepsinde farklıyken farklı şekli bulmak gibi.
   Her bölüm birkaç turdan oluşur. 30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "farkli";
  const RENK = ["#ff5a4e", "#2f86e0", "#2fb36a", "#ffc23a", "#8a5cf0", "#ff8a1f"];
  const yildiz = (() => { let s = "M"; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 19 : 42; s += `${50 + r * Math.cos(a)} ${54 + r * Math.sin(a)} `; } return s + "Z"; })();
  const SEKIL = {
    daire: `<circle cx="50" cy="50" r="40"/>`,
    kare: `<rect x="12" y="12" width="76" height="76" rx="8"/>`,
    ucgen: `<path d="M50 8 L92 86 H8 Z"/>`,
    yildiz: `<path d="${yildiz}"/>`,
    kalp: `<path d="M50 88 C10 60 6 34 22 20 C34 10 46 16 50 28 C54 16 66 10 78 20 C94 34 90 60 50 88 Z"/>`,
    ok: `<path d="M8 38 H54 V16 L94 50 L54 84 V62 H8 Z"/>`,
    bayrak: `<path d="M18 8 h8 v84 h-8z M26 12 H86 L72 32 L86 52 H26 Z"/>`,
    ay: `<path d="M64 10 A42 42 0 1 0 64 90 A32 32 0 1 1 64 10 Z"/>`,
  };
  const YONLU = ["ok", "bayrak", "ay", "ucgen", "kalp"];
  const AYNALI = ["ok", "bayrak", "ay"];
  function kartSvg(o) {
    const nok = [];
    const yer = [[50, 50], [36, 50], [64, 50], [50, 34], [50, 66]];
    for (let i = 0; i < (o.nokta || 0); i++) nok.push(`<circle cx="${yer[i][0]}" cy="${yer[i][1]}" r="6" fill="#fff" stroke="none"/>`);
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><g transform="translate(50 50) rotate(${o.aci || 0}) scale(${(o.ayna ? -1 : 1) * (o.boy || 1)} ${o.boy || 1}) translate(-50 -50)"><g fill="${o.renk}" stroke="rgba(0,0,0,.18)" stroke-width="3" stroke-linejoin="round">${SEKIL[o.s]}</g>${nok.join("")}</g></svg>`;
  }
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [kart sayısı, tur, fark türleri, karışık (öteki özellikler de değişir)]
  const T = [
    [3, 2, ["renk"], 0], [3, 2, ["renk"], 0], [3, 3, ["renk", "sekil"], 0],
    [3, 3, ["sekil"], 0], [4, 3, ["sekil", "renk"], 0], [4, 3, ["boy"], 0],
    [4, 3, ["boy", "sekil"], 0], [4, 3, ["yon"], 0], [4, 3, ["yon", "boy"], 0], [5, 3, ["nokta"], 0], [5, 3, ["nokta", "yon"], 0], [5, 3, ["renk", "sekil", "boy", "yon"], 0],
    [5, 3, ["ayna"], 0], [5, 3, ["ayna", "yon"], 0], [5, 3, ["nokta", "ayna"], 0], [6, 3, ["boy", "nokta"], 0], [6, 3, ["sekil"], 1], [6, 3, ["renk", "ayna", "nokta"], 0],
    [6, 3, ["sekil"], 1], [6, 3, ["nokta"], 1], [6, 3, ["yon"], 1], [6, 3, ["ayna"], 1], [6, 4, ["sekil", "nokta"], 1], [6, 4, ["boy"], 1],
    [6, 4, ["ayna", "yon"], 1], [8, 4, ["sekil"], 1], [8, 4, ["nokta"], 1], [8, 4, ["ayna"], 1], [8, 4, ["yon", "boy"], 1], [8, 4, ["sekil", "nokta", "ayna", "yon"], 1],
  ];
  function tur(n, farklar, karisik, r) {
    const fark = farklar[Math.floor(r() * farklar.length)];
    const havuz = fark === "ayna" ? AYNALI : fark === "yon" ? YONLU : Object.keys(SEKIL);
    const temel = { s: havuz[Math.floor(r() * havuz.length)], renk: RENK[Math.floor(r() * RENK.length)], boy: 1, aci: 0, ayna: false, nokta: fark === "nokta" ? 1 + Math.floor(r() * 3) : 0 };
    const kartlar = Array.from({ length: n }, () => ({ ...temel }));
    // Karışık bölümlerde farkın dışındaki bir özellik bütün kartlarda değişir (dikkati dağıtır)
    if (karisik) kartlar.forEach((k) => { if (fark !== "renk") k.renk = RENK[Math.floor(r() * RENK.length)]; else k.boy = 0.8 + r() * 0.2; });
    const j = Math.floor(r() * n), f = kartlar[j];
    if (fark === "renk") { let c; do c = RENK[Math.floor(r() * RENK.length)]; while (c === temel.renk); f.renk = c; }
    if (fark === "sekil") { let s; do s = Object.keys(SEKIL)[Math.floor(r() * Object.keys(SEKIL).length)]; while (s === temel.s); f.s = s; }
    if (fark === "boy") { kartlar.forEach((k) => (k.boy = 1)); f.boy = karisik ? 0.72 : 0.6; }
    if (fark === "yon") f.aci = [90, 180, -90][Math.floor(r() * 3)];
    if (fark === "ayna") f.ayna = true;
    if (fark === "nokta") f.nokta = temel.nokta + (r() < 0.5 || temel.nokta === 1 ? 1 : -1);
    return { kartlar, cevap: j };
  }
  const BOLUMLER = T.map(([n, turSay, farklar, karisik], i) => {
    const r = tohumlu(4700 + i * 43);
    return { turlar: Array.from({ length: turSay }, () => tur(n, farklar, karisik, r)), grup: Uygulama.seviye(i) };
  });

  const stil = `
  .fo { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#fff6fb, #fde8f2); }
  .fo-sahne { --k: 150px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 16px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .fo-turlar { display: flex; gap: 10px; }
  .fo-turlar i { width: 22px; height: 22px; border-radius: 50%; border: 3px solid var(--cizgi); background: #fff; display: block; }
  .fo-turlar i.dolu { background: var(--yesil); border-color: var(--yesil); }
  .fo-turlar i.simdi { border-color: var(--kirmizi); transform: scale(1.2); }
  .fo-kartlar { display: grid; grid-template-columns: repeat(var(--sut), var(--k)); gap: 16px; }
  .fo-kart { width: var(--k); height: var(--k); padding: 14%; border: 0; border-radius: 24px; background: #fff; box-shadow: 0 7px 0 rgba(29,40,70,.12); cursor: pointer; transition: transform .2s; animation: fo-gel .4s cubic-bezier(.3,1.5,.5,1) both; }
  .fo-kart svg { width: 100%; height: 100%; display: block; overflow: visible; }
  .fo-kart:active { transform: translateY(3px); }
  .fo-kart.yanlis { animation: fo-salla .45s; }
  .fo-kart.dogru { outline: 6px solid var(--yesil); transform: scale(1.08) rotate(-3deg); }
  .fo-kart.soluk { opacity: .35; transition: opacity .3s; }
  @keyframes fo-gel { from { transform: scale(.4); opacity: 0; } }
  @keyframes fo-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("fo-stil")) { const st = document.createElement("style"); st.id = "fo-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="fo"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="fo-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".fo-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    d.idx = i; d.uid++; d.mesgul = false; d.tur = 0;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    turGoster();
  }
  function turGoster() {
    const b = BOLUMLER[d.idx], t = b.turlar[d.tur];
    d.sahne.innerHTML = `<div class="fo-turlar" aria-label="Turlar">${b.turlar.map((_, j) => `<i class="${j < d.tur ? "dolu" : j === d.tur ? "simdi" : ""}"></i>`).join("")}</div>
      <div class="fo-kartlar">${t.kartlar.map((k, j) => `<button class="fo-kart" type="button" data-j="${j}" aria-label="Kart" style="animation-delay:${j * 0.05}s">${kartSvg(k)}</button>`).join("")}</div>`;
    d.sahne.querySelectorAll(".fo-kart").forEach((el) => (el.onclick = () => sec(el)));
    boyutla();
  }
  function boyutla() {
    if (!d) return;
    const kartlar = d.sahne.querySelector(".fo-kartlar"); if (!kartlar) return;
    const n = BOLUMLER[d.idx].turlar[d.tur].kartlar.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24 - 50;
    if (W < 50 || H < 50) return;
    let en = 0, enSut = n;
    for (let sut = 1; sut <= n; sut++) {
      const sat = Math.ceil(n / sut), k = Math.min((W - (sut - 1) * 16) / sut, (H - (sat - 1) * 16) / sat, 190);
      if (k > en + 2) { en = k; enSut = sut; }
    }
    kartlar.style.setProperty("--sut", enSut); d.sahne.style.setProperty("--k", Math.floor(Math.max(60, en)) + "px");
  }
  async function sec(el) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid, t = b.turlar[d.tur];
    if (+el.dataset.j !== t.cevap) { el.classList.remove("yanlis"); void el.offsetWidth; el.classList.add("yanlis"); d.api.ses.hata(); return; }
    d.mesgul = true; el.classList.add("dogru");
    d.sahne.querySelectorAll(".fo-kart").forEach((x) => x !== el && x.classList.add("soluk"));
    d.api.ses.yerlesti();
    await bekle(800); if (!d || benim !== d.uid) return;
    d.tur++; d.mesgul = false;
    if (d.tur < b.turlar.length) return turGoster();
    bitir();
  }
  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Hiçbir fark gözünden kaçmadı!" : "Son farkı da buldun!") : "Farklı olanı buldun!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.FARKLI_BOLUMLER = BOLUMLER;
  window.FARKLI_DURUM = () => d && { tur: d.tur };

  window.Uygulama.oyunEkle(47, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const t = BOLUMLER[d.idx].turlar[d.tur];
      return t ? [{ el: d.sahne.querySelector(`.fo-kart[data-j="${t.cevap}"]`) }] : [];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${kartSvg({ s: "kalp", renk: "#ff5a4e" })}${kartSvg({ s: "kalp", renk: "#ff5a4e" })}${kartSvg({ s: "kalp", renk: "#2f86e0" })}</div>`; },
  });
})();
