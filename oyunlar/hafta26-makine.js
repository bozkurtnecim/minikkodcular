/* Sihirli Makine (girdi → işlem → çıktı: makinenin kuralını bulmak).
   Üstte örnekler: makineye ne girdi, ne çıktı. Kuralı bul; yeni eşya makineye girince ne çıkacağını seç.
   Kurallar: rengi değiştirir, büyütür/küçültür, şekli değiştirir, bir tane ekler; çok zorda iki kural birden.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "makine";
  const RENK = { k: "#ff5a4e", m: "#2f86e0", s: "#ffc23a", y: "#2fb36a", p: "#ff7ab8" };
  const yildizN = (() => { const n = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 18 : 40, a = (Math.PI / 5) * i - Math.PI / 2; n.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(53 + Math.sin(a) * r).toFixed(1)}`); } return n.join(" "); })();
  function sekil(ad, renk) {
    const o = `fill="${RENK[renk]}" stroke="rgba(0,0,0,.18)" stroke-width="6" stroke-linejoin="round"`;
    if (ad === "daire") return `<circle cx="50" cy="50" r="38" ${o}/>`;
    if (ad === "kare") return `<rect x="13" y="13" width="74" height="74" rx="12" ${o}/>`;
    if (ad === "yildiz") return `<polygon points="${yildizN}" ${o}/>`;
    if (ad === "kalp") return `<path d="M50 88 C22 68 8 52 11 34 C14 16 38 12 50 30 C62 12 86 16 89 34 C92 52 78 68 50 88 Z" ${o}/>`;
    return `<polygon points="50,10 92,86 8,86" ${o}/>`;
  }
  // Eşya: { s: şekil, r: renk, b: boy (0 küçük, 1 büyük), n: adet 1-3 }
  function esyaSvg(e) {
    const boy = e.b ? 1 : 0.62, n = e.n || 1;
    const yer = n === 1 ? [[50, 50]] : n === 2 ? [[30, 50], [70, 50]] : [[50, 28], [28, 70], [72, 70]];
    const olcek = (n === 1 ? 1 : 0.5) * boy;
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${yer.map(([x, y]) => `<g transform="translate(${x} ${y}) scale(${olcek}) translate(-50 -50)">${sekil(e.s, e.r)}</g>`).join("")}</svg>`;
  }
  const ayni = (a, b) => a.s === b.s && a.r === b.r && a.b === b.b && (a.n || 1) === (b.n || 1);

  // ---------- Kurallar ----------
  const RENKLER = Object.keys(RENK), SEKILLER = ["daire", "kare", "yildiz", "kalp", "ucgen"];
  const KURAL = {
    renk: (hedefR) => ({ uygula: (e) => ({ ...e, r: hedefR }), anlamli: (e) => e.r !== hedefR }),
    buyut: () => ({ uygula: (e) => ({ ...e, b: 1 }), anlamli: (e) => !e.b }),
    kucult: () => ({ uygula: (e) => ({ ...e, b: 0 }), anlamli: (e) => e.b === 1 }),
    sekil: (hedefS) => ({ uygula: (e) => ({ ...e, s: hedefS }), anlamli: (e) => e.s !== hedefS }),
    ekle: () => ({ uygula: (e) => ({ ...e, n: (e.n || 1) + 1 }), anlamli: (e) => (e.n || 1) < 3 }),
    takas: (a, b) => ({ uygula: (e) => ({ ...e, r: e.r === a ? b : e.r === b ? a : e.r }), anlamli: (e) => e.r === a || e.r === b, renkler: [a, b] }),
  };
  const r = (() => { let s = 2626; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const sec = (a) => a[Math.floor(r() * a.length)];
  const karistir = (a) => a.map((x) => [r(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  function kuralKur(tur) {
    if (tur === "renk") return KURAL.renk(sec(RENKLER));
    if (tur === "sekil") return KURAL.sekil(sec(SEKILLER));
    if (tur === "takas") { const [a, b] = karistir(RENKLER); return KURAL.takas(a, b); }
    return KURAL[tur]();
  }
  // Eşya üret: kurala göre anlamlı (değişim görünsün)
  function esyaUret(kural, ozellik) {
    for (let t = 0; t < 200; t++) {
      const e = { s: sec(ozellik.sekiller), r: sec(ozellik.renkler), b: ozellik.boy ? (r() < 0.5 ? 1 : 0) : 1, n: ozellik.adet ? 1 + Math.floor(r() * 2) : 1 };
      if (kural.anlamli(e)) return e;
    }
    throw new Error("eşya");
  }
  function bolum({ turler, ornek, secenek, boy, adet }) {
    const kurallar = turler.map(kuralKur);
    const uygula = (e) => kurallar.reduce((x, k) => k.uygula(x), e);
    const kural = { anlamli: (e) => kurallar.every((k) => k.anlamli(e)) };
    const zorunlu = kurallar.flatMap((k) => k.renkler || []);
    const ozellik = { sekiller: karistir(SEKILLER).slice(0, 3), renkler: [...zorunlu, ...karistir(RENKLER).filter((x) => !zorunlu.includes(x))].slice(0, 4), boy: boy || turler.some((t) => t === "buyut" || t === "kucult"), adet: adet || turler.includes("ekle") };
    for (let deneme = 0; deneme < 500; deneme++) {
      const ornekler = [];
      while (ornekler.length < ornek) { const e = esyaUret(kural, ozellik); if (!ornekler.some((o) => ayni(o.gir, e))) ornekler.push({ gir: e, cik: uygula(e) }); }
      const yeni = esyaUret(kural, ozellik);
      if (ornekler.some((o) => ayni(o.gir, yeni))) continue;
      const dogru = uygula(yeni);
      // Yanıltıcılar: girdinin kendisi, kuralın yarısı, başka bir değişim
      const adaylar = [yeni, ...kurallar.map((k) => k.uygula(yeni)), { ...dogru, r: sec(RENKLER) }, { ...dogru, s: sec(SEKILLER) }, { ...dogru, b: dogru.b ? 0 : 1 }, { ...dogru, n: dogru.n === 1 ? 2 : 1 }];
      const yanlis = [];
      for (const a of karistir(adaylar)) if (!ayni(a, dogru) && !yanlis.some((y) => ayni(y, a))) yanlis.push(a);
      if (yanlis.length < secenek - 1) continue;
      return { ornekler, yeni, dogru, secenekler: karistir([dogru, ...yanlis.slice(0, secenek - 1)]) };
    }
    throw new Error("bölüm");
  }
  const T = [
    { turler: ["renk"], ornek: 2, secenek: 2 }, { turler: ["buyut"], ornek: 2, secenek: 2 }, { turler: ["renk"], ornek: 2, secenek: 2 },
    { turler: ["sekil"], ornek: 2, secenek: 3 }, { turler: ["kucult"], ornek: 2, secenek: 3 }, { turler: ["renk"], ornek: 2, secenek: 3 },
    { turler: ["ekle"], ornek: 2, secenek: 3 }, { turler: ["sekil"], ornek: 2, secenek: 3 }, { turler: ["buyut"], ornek: 2, secenek: 3, adet: true },
    { turler: ["renk"], ornek: 2, secenek: 3, boy: true }, { turler: ["ekle"], ornek: 2, secenek: 3, boy: true }, { turler: ["sekil"], ornek: 2, secenek: 3, boy: true },
    { turler: ["takas"], ornek: 3, secenek: 3 }, { turler: ["takas"], ornek: 3, secenek: 3 }, { turler: ["kucult"], ornek: 2, secenek: 4, adet: true },
    { turler: ["sekil"], ornek: 2, secenek: 4, adet: true }, { turler: ["ekle"], ornek: 2, secenek: 4, boy: true }, { turler: ["renk"], ornek: 2, secenek: 4, boy: true, adet: true },
    { turler: ["renk", "buyut"], ornek: 3, secenek: 3 }, { turler: ["sekil", "renk"], ornek: 3, secenek: 3 }, { turler: ["ekle", "renk"], ornek: 3, secenek: 3 },
    { turler: ["buyut", "sekil"], ornek: 3, secenek: 3 }, { turler: ["renk", "kucult"], ornek: 3, secenek: 4 }, { turler: ["ekle", "sekil"], ornek: 3, secenek: 4 },
    { turler: ["takas", "buyut"], ornek: 3, secenek: 4 }, { turler: ["sekil", "buyut"], ornek: 3, secenek: 4 }, { turler: ["renk", "ekle"], ornek: 3, secenek: 4, boy: true },
    { turler: ["takas", "ekle"], ornek: 3, secenek: 4 }, { turler: ["sekil", "kucult"], ornek: 3, secenek: 4, adet: true }, { turler: ["renk", "sekil"], ornek: 3, secenek: 4, boy: true },
  ];
  const BOLUMLER = T.map((t, i) => ({ ...bolum(t), grup: Uygulama.seviye(i) }));

  // ---------- Oyun ----------
  const makineSvg = (yazi) => `<svg viewBox="0 0 120 90" aria-hidden="true"><rect x="10" y="14" width="100" height="66" rx="16" fill="#8a5cf0"/><rect x="22" y="26" width="76" height="30" rx="8" fill="#b79cff"/><circle cx="36" cy="68" r="6" fill="#ffc23a"/><circle cx="56" cy="68" r="6" fill="#2fb36a"/><circle cx="76" cy="68" r="6" fill="#ff5a4e"/><path d="M60 14 v-8 M50 6 h20" stroke="#5d6878" stroke-width="5" stroke-linecap="round"/><g class="disli"><circle cx="60" cy="41" r="10" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="5 4"/></g>${yazi || ""}</svg>`;
  const ok = `<svg viewBox="0 0 40 24" aria-hidden="true"><path d="M2 12 h30 M24 4 l10 8 l-10 8" stroke="#8a5cf0" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const stil = `
  .mk { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f4f0ff, #e9e2fd); }
  .mk-sahne { --k: 80px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 14px; padding: 8px 16px 16px; overflow-y: auto; user-select: none; -webkit-user-select: none; }
  .mk-ornekler { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
  .mk-ornek, .mk-soru { display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 20px; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.1); }
  .mk-ornek .e, .mk-soru .e { width: var(--k); height: var(--k); }
  .mk-ornek .e svg, .mk-soru .e svg, .mk-sec svg { width: 100%; height: 100%; display: block; }
  .mk-ornek .mak, .mk-soru .mak { width: calc(var(--k) * .9); height: calc(var(--k) * .68); }
  .mk-ornek .mak svg, .mk-soru .mak svg { width: 100%; height: 100%; }
  .mk-ornek .ok, .mk-soru .ok { width: 30px; height: 18px; }
  .mk-soru { padding: 14px 18px; border: 4px solid #b79cff; }
  .mk-soru .e { width: calc(var(--k) * 1.2); height: calc(var(--k) * 1.2); }
  .mk-soru .mak { width: calc(var(--k) * 1.3); height: calc(var(--k) * .98); }
  .mk-soru .bos { width: calc(var(--k) * 1.2); height: calc(var(--k) * 1.2); border-radius: 18px; border: 4px dashed #b79cff; display: grid; place-items: center; font: 800 calc(var(--k) * .6)/1 var(--f-baslik); color: #b79cff; }
  .mk-soru .bos svg { width: 100%; height: 100%; }
  .mk-soru.calisiyor .mak { animation: mk-titre .12s linear 6; }
  .mk-soru.calisiyor .disli { animation: mk-don .6s linear; transform-origin: 60px 41px; }
  @keyframes mk-titre { 50% { transform: translateX(3px) rotate(1deg); } }
  @keyframes mk-don { to { transform: rotate(360deg); } }
  .mk-secenekler { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
  .mk-sec { width: calc(var(--k) * 1.25); height: calc(var(--k) * 1.25); padding: 8px; border: 0; border-radius: 22px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.14); cursor: pointer; }
  .mk-sec:active { transform: translateY(3px); }
  .mk-sec.yanlis { opacity: .35; outline: 4px solid var(--kirmizi); animation: mk-salla .45s; }
  .mk-sec.dogru { outline: 5px solid var(--yesil); background: #e6f8ec; }
  .mk-sec:disabled { cursor: default; }
  @keyframes mk-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("mk-stil")) { const st = document.createElement("style"); st.id = "mk-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="mk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="mk-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".mk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    d.sahne.innerHTML = `
      <div class="mk-ornekler" aria-label="Örnekler">${b.ornekler.map((o) => `<div class="mk-ornek"><div class="e">${esyaSvg(o.gir)}</div><span class="ok">${ok}</span><div class="mak">${makineSvg()}</div><span class="ok">${ok}</span><div class="e">${esyaSvg(o.cik)}</div></div>`).join("")}</div>
      <div class="mk-soru"><div class="e">${esyaSvg(b.yeni)}</div><span class="ok">${ok}</span><div class="mak">${makineSvg()}</div><span class="ok">${ok}</span><div class="bos">?</div></div>
      <div class="mk-secenekler" aria-label="Seçenekler">${b.secenekler.map((e, j) => `<button class="mk-sec" type="button" data-j="${j}" aria-label="${j + 1}. seçenek">${esyaSvg(e)}</button>`).join("")}</div>`;
    d.sahne.querySelectorAll(".mk-sec").forEach((el) => (el.onclick = () => sec_(+el.dataset.j)));
    boyutla();
  }
  function boyutla() {
    if (!d) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    let k = Math.max(40, Math.min(96, Math.floor(H / 6.4), Math.floor(W / (b.ornekler.length > 2 && W > 900 ? 15 : 6.2))));
    d.sahne.style.setProperty("--k", k + "px");
    for (let q = 0; q < 30 && d.sahne.scrollHeight > d.sahne.clientHeight + 2 && k > 34; q++) { k -= 3; d.sahne.style.setProperty("--k", k + "px"); }
  }
  async function sec_(j) {
    if (d.calisiyor) return;
    d.calisiyor = true;
    const benim = d.uid, b = BOLUMLER[d.idx], btn = d.sahne.querySelectorAll(".mk-sec")[j], soru = d.sahne.querySelector(".mk-soru");
    soru.classList.add("calisiyor");
    d.api.ses.ton(330, 0.3);
    await bekle(700);
    if (!d || benim !== d.uid) return;
    soru.classList.remove("calisiyor");
    if (ayni(b.secenekler[j], b.dogru)) {
      soru.querySelector(".bos").innerHTML = esyaSvg(b.dogru);
      btn.classList.add("dogru");
      d.api.ses.yerlesti();
      await bekle(700);
      if (!d || benim !== d.uid) return;
      return bitir();
    }
    btn.classList.add("yanlis"); btn.disabled = true;
    d.api.ses.hata();
    d.calisiyor = false;
  }
  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün makinelerin sırrını çözdün!" : "Son makine de çözüldü!") : "Makinenin kuralını buldun!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.MAKINE_BOLUMLER = BOLUMLER;
  window.MAKINE_DOGRU = (i) => BOLUMLER[i].secenekler.findIndex((e) => ayni(e, BOLUMLER[i].dogru));

  window.Uygulama.oyunEkle(26, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const b = BOLUMLER[d.idx], j = b.secenekler.findIndex((e) => ayni(e, b.dogru));
      return [{ el: d.sahne.querySelector(".mk-ornek") }, { el: d.sahne.querySelector(".mk-soru .e") }, { el: d.sahne.querySelectorAll(".mk-sec")[j] }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${esyaSvg({ s: "daire", r: "k", b: 1 })}<svg viewBox="0 0 120 90" style="width:44px">${makineSvg().replace(/<\/?svg[^>]*>/g, "")}</svg>${esyaSvg({ s: "daire", r: "m", b: 1 })}</div>`; },
  });
})();
