/* Yapay Zekâya Öğret (yapay zekâ: bilgisayar örneklerden öğrenir).
   1) Öğretme: örnek resimleri robotun sepetlerine ayır. Burada doğru-yanlış söylenmez; robot ne gösterirsen onu öğrenir.
   2) Sınav: robot yeni resimlere bakar ve en çok benzeyen örneğe göre sepet seçer.
   Yanlış öğretilen örnek varsa robot da yanılır; yanlış örnekler sepette yanıp söner, düzeltip yeniden sına.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "yapayzeka";
  const N = () => window.NESNELER;
  // Eşya: { tip: "sekil", sekil, renk } ya da { tip: "nesne", id }
  const resim = (e) => (e.tip === "sekil" ? window.renkliNesne(e.sekil, e.renk) : N()[e.id].src);
  const ozellik = (e) => (e.tip === "sekil" ? { sekil: e.sekil, renk: e.renk } : { id: e.id, kat: N()[e.id].kat });
  const anahtar = (e) => (e.tip === "sekil" ? e.sekil + "-" + e.renk : e.id);
  // Robot önce hangi özelliğin önemli olduğunu öğrenir: bir özelliğin her değeri hep aynı sepete
  // gidiyorsa o özellik önemlidir (ağırlık 1), karışıksa önemsizdir (0.2). Sonra en çok benzeyen örneklere bakar.
  function agirliklar(ogrendi) {
    const w = {};
    for (const f of ["sekil", "renk", "kat", "id"]) {
      const m = new Map();
      ogrendi.forEach(({ e, sepet }) => { const v = ozellik(e)[f]; if (v == null) return; if (!m.has(v)) m.set(v, new Set()); m.get(v).add(sepet); });
      w[f] = [...m.values()].every((s) => s.size === 1) ? 1 : 0.2;
    }
    w.id *= 3;
    return w;
  }
  function benzer(a, b, w) {
    if (a.tip !== b.tip) return 0;
    const x = ozellik(a), y = ozellik(b);
    return Object.keys(x).reduce((t, f) => t + (x[f] === y[f] ? w[f] : 0), 0);
  }
  // Robotun kararı: en benzer örneklerin çoğunluğu; berabere ise kararsız (-1)
  function tahmin(ogrendi, e) {
    const w = agirliklar(ogrendi);
    let en = -1, oy = new Map();
    ogrendi.forEach(({ e: o, sepet }) => { const s = Math.round(benzer(o, e, w) * 100); if (s > en) { en = s; oy = new Map(); } if (s === en) oy.set(sepet, (oy.get(sepet) || 0) + 1); });
    if (en <= 0) return -1;
    const sirali = [...oy].sort((a, b) => b[1] - a[1]);
    return sirali.length > 1 && sirali[0][1] === sirali[1][1] ? -1 : sirali[0][0];
  }

  // ---------- Bölümler ----------
  const r = (() => { let s = 3333; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const karistir = (a) => a.map((x) => [r(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const SEKILLER = ["balon", "kalp", "yildiz", "top", "kup"], RENKLER = ["kirmizi", "mavi", "sari", "yesil", "mor"];
  const KAT_NESNE = (kat) => Object.values(N()).filter((n) => n.kat === kat).map((n) => n.id);
  // kural: "renk" | "sekil" (iki/üç değer), ya da "kat" (nesne türleri)
  function bolum({ kural, degerler, egitim, sinav, cesit = 3 }) {
    for (let deneme = 0; deneme < 2000; deneme++) {
      let havuz, sepetOf;
      if (kural === "kat") {
        havuz = degerler.flatMap((k) => KAT_NESNE(k).map((id) => ({ tip: "nesne", id })));
        sepetOf = (e) => degerler.indexOf(N()[e.id].kat);
      } else {
        // Havuz sınav için yeni resim bırakacak kadar büyük olsun
        const n = Math.min(5, Math.max(cesit, Math.ceil((egitim + sinav) / degerler.length) + 1));
        const diger = kural === "renk" ? karistir(SEKILLER).slice(0, n) : karistir(RENKLER.filter((x) => !degerler.includes(x))).concat(RENKLER).slice(0, n);
        havuz = degerler.flatMap((v) => diger.map((o) => (kural === "renk" ? { tip: "sekil", sekil: o, renk: v } : { tip: "sekil", sekil: v, renk: o })));
        sepetOf = (e) => degerler.indexOf(kural === "renk" ? e.renk : e.sekil);
      }
      const k = karistir(havuz);
      const ogret = k.slice(0, egitim);
      // Sınavda bir kısmı öğretilenlerden, çoğu yeni
      const yeni = k.slice(egitim).slice(0, sinav - 1);
      if (yeni.length < sinav - 1) continue;
      const sina = karistir([...yeni, ogret[Math.floor(r() * ogret.length)]]);
      // Her sepette en az bir örnek; doğru öğretilince robot sınavı geçmeli
      if (degerler.some((_, s) => !ogret.some((e) => sepetOf(e) === s))) continue;
      const dogruOgrenme = ogret.map((e) => ({ e, sepet: sepetOf(e) }));
      if (!sina.every((e) => tahmin(dogruOgrenme, e) === sepetOf(e))) continue;
      return { kural, degerler, ogret, sina, dogru: ogret.map(sepetOf), sinavDogru: sina.map(sepetOf) };
    }
    throw new Error("bölüm kurulamadı");
  }
  const T = [
    { kural: "renk", degerler: ["kirmizi", "mavi"], egitim: 4, sinav: 2, cesit: 2 }, { kural: "renk", degerler: ["sari", "yesil"], egitim: 4, sinav: 2, cesit: 2 }, { kural: "renk", degerler: ["mor", "kirmizi"], egitim: 4, sinav: 3, cesit: 2 },
    { kural: "sekil", degerler: ["kalp", "yildiz"], egitim: 4, sinav: 2, cesit: 2 }, { kural: "sekil", degerler: ["top", "kup"], egitim: 5, sinav: 3, cesit: 3 }, { kural: "renk", degerler: ["mavi", "sari"], egitim: 5, sinav: 3, cesit: 3 },
    { kural: "kat", degerler: ["meyve", "hayvan"], egitim: 6, sinav: 3 }, { kural: "kat", degerler: ["tasit", "giysi"], egitim: 6, sinav: 3 }, { kural: "sekil", degerler: ["balon", "kalp"], egitim: 6, sinav: 3, cesit: 3 },
    { kural: "kat", degerler: ["sebze", "oyuncak"], egitim: 6, sinav: 3 }, { kural: "renk", degerler: ["kirmizi", "yesil"], egitim: 6, sinav: 3, cesit: 3 }, { kural: "kat", degerler: ["meyve", "tasit"], egitim: 6, sinav: 4 },
    { kural: "renk", degerler: ["kirmizi", "mavi", "sari"], egitim: 6, sinav: 3, cesit: 2 }, { kural: "sekil", degerler: ["yildiz", "top", "kalp"], egitim: 6, sinav: 3, cesit: 2 }, { kural: "kat", degerler: ["meyve", "hayvan", "tasit"], egitim: 6, sinav: 3 },
    { kural: "kat", degerler: ["sebze", "giysi", "oyuncak"], egitim: 7, sinav: 3 }, { kural: "renk", degerler: ["mor", "yesil", "sari"], egitim: 7, sinav: 4, cesit: 3 }, { kural: "sekil", degerler: ["kup", "balon", "yildiz"], egitim: 7, sinav: 4, cesit: 3 },
    { kural: "kat", degerler: ["meyve", "sebze"], egitim: 7, sinav: 4 }, { kural: "sekil", degerler: ["kalp", "top"], egitim: 6, sinav: 4, cesit: 5 }, { kural: "renk", degerler: ["mavi", "mor"], egitim: 6, sinav: 4, cesit: 5 },
    { kural: "kat", degerler: ["hayvan", "oyuncak"], egitim: 8, sinav: 4 }, { kural: "kat", degerler: ["meyve", "sebze", "hayvan"], egitim: 8, sinav: 4 }, { kural: "sekil", degerler: ["yildiz", "kup", "balon"], egitim: 8, sinav: 4, cesit: 3 },
    { kural: "renk", degerler: ["kirmizi", "sari", "yesil"], egitim: 9, sinav: 4, cesit: 3 }, { kural: "kat", degerler: ["tasit", "giysi", "oyuncak"], egitim: 9, sinav: 4 }, { kural: "kat", degerler: ["meyve", "sebze", "tasit"], egitim: 9, sinav: 5 },
    { kural: "sekil", degerler: ["top", "kalp", "kup"], egitim: 9, sinav: 5, cesit: 4 }, { kural: "kat", degerler: ["hayvan", "tasit", "giysi"], egitim: 10, sinav: 5 }, { kural: "renk", degerler: ["mavi", "yesil", "mor"], egitim: 10, sinav: 5, cesit: 4 },
  ];
  let BOLUMLER = null;
  const bolumler = () => BOLUMLER || (BOLUMLER = T.map((t, i) => ({ ...bolum(t), grup: Uygulama.seviye(i) })));

  // Sepet etiketi: rengin damlası, şeklin silüeti ya da türün simgesi
  const RENK_KOD = { kirmizi: "#ff5a4e", mavi: "#2f86e0", sari: "#ffc23a", yesil: "#2fb36a", mor: "#8a5cf0" };
  function etiket(b, s) {
    const v = b.degerler[s];
    if (b.kural === "renk") return `<svg viewBox="0 0 100 100"><path d="M50 10 C30 38 20 52 20 64 a30 30 0 0 0 60 0 C80 52 70 38 50 10 Z" fill="${RENK_KOD[v]}"/></svg>`;
    if (b.kural === "sekil") return `<img src="${window.renkliNesne(v, "beyaz" in RENK_KOD ? "beyaz" : "mavi")}" alt="" style="filter:grayscale(1) brightness(1.4) contrast(.8)">`;
    return `<img src="${N()[window.KATEGORILER[v].ikon].src}" alt="">`;
  }
  const robot = (yuz) => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 6 v12" stroke="#5d6878" stroke-width="5"/><circle cx="50" cy="6" r="6" fill="#ffc23a"/><rect x="16" y="18" width="68" height="56" rx="16" fill="#8a5cf0"/><rect x="24" y="28" width="52" height="34" rx="10" fill="#e9e2fd"/>${yuz === "dusun" ? `<circle cx="38" cy="44" r="4" fill="#26201f"/><circle cx="62" cy="44" r="4" fill="#26201f"/><path d="M42 54 h16" stroke="#26201f" stroke-width="4" stroke-linecap="round"/><g fill="#8a5cf0"><circle cx="70" cy="12" r="3"/><circle cx="80" cy="6" r="4"/></g>` : yuz === "uzgun" ? `<circle cx="38" cy="44" r="4" fill="#26201f"/><circle cx="62" cy="44" r="4" fill="#26201f"/><path d="M40 58 q10 -8 20 0" stroke="#26201f" stroke-width="4" fill="none" stroke-linecap="round"/>` : `<circle cx="38" cy="44" r="4" fill="#26201f"/><circle cx="62" cy="44" r="4" fill="#26201f"/><path d="M40 52 q10 8 20 0" stroke="#26201f" stroke-width="4" fill="none" stroke-linecap="round"/>`}<rect x="30" y="76" width="40" height="18" rx="6" fill="#6a3fcc"/></svg>`;

  // ---------- Oyun ----------
  const stil = `
  .yz { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f3efff, #e6defc); }
  .yz-sahne { --k: 70px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 12px; padding: 8px 16px 16px; overflow-y: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .yz-ust { display: flex; align-items: center; gap: 14px; }
  .yz-robot { width: calc(var(--k) * 1.3); height: calc(var(--k) * 1.3); }
  .yz-robot svg { width: 100%; height: 100%; }
  .yz-adim { display: flex; gap: 8px; }
  .yz-adim span { padding: 6px 12px; border-radius: 999px; background: #fff; font: 800 1rem var(--f-baslik); color: #b5a6e6; display: inline-flex; align-items: center; gap: 6px; }
  .yz-adim span.aktif { background: var(--mor); color: #fff; }
  .yz-adim svg { width: 22px; height: 22px; }
  .yz-sira { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; min-height: calc(var(--k) + 16px); padding: 8px; border-radius: 20px; background: rgba(255,255,255,.6); }
  .yz-kart { width: var(--k); height: var(--k); padding: 6px; border: 0; border-radius: 16px; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.14); cursor: grab; touch-action: none; display: grid; place-items: center; box-sizing: border-box; }
  .yz-kart img { width: 100%; height: 100%; pointer-events: none; }
  .yz-kart.siradaki { outline: 4px solid var(--mavi); }
  .yz-sepetler { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
  .yz-sepet { display: grid; justify-items: center; gap: 6px; min-width: calc(var(--k) * 2.6); padding: 8px 10px 12px; border-radius: 14px 14px 26px 26px; background: #e9c48f; box-shadow: inset 0 -8px 0 #c99a5c; cursor: pointer; }
  .yz-sepet .etiket { width: calc(var(--k) * .8); height: calc(var(--k) * .8); padding: 4px; border-radius: 50%; background: #fff; display: grid; place-items: center; box-sizing: border-box; }
  .yz-sepet .etiket img, .yz-sepet .etiket svg { width: 100%; height: 100%; }
  .yz-sepet .ic { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; max-width: calc(var(--k) * 3); min-height: calc(var(--k) * .6); }
  .yz-sepet .ic .k { width: calc(var(--k) * .6); height: calc(var(--k) * .6); border-radius: 10px; background: #fff; padding: 3px; box-sizing: border-box; cursor: pointer; }
  .yz-sepet .ic .k img { width: 100%; height: 100%; pointer-events: none; }
  .yz-sepet .ic .k.yanlis { animation: yz-yanip .45s 4; }
  .yz-sepet .ic .k.test { outline: 3px solid var(--mor); }
  .yz-sepet .ic .k.test.dogru { outline-color: var(--yesil); } .yz-sepet .ic .k.test.hatali { outline-color: var(--kirmizi); }
  .yz-sepet.hedefte { outline: 5px solid var(--mavi); }
  .yz-sepet.yanar { outline: 5px solid var(--sari); }
  @keyframes yz-yanip { 50% { background: #ff8a80; transform: scale(1.1); } }
  .yz-dugme { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--mor); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.3rem; box-shadow: 0 7px 0 #6a3fcc; cursor: pointer; }
  .yz-dugme svg { width: 30px; height: 30px; }
  .yz-dugme:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  .yz-sinav { display: flex; align-items: center; gap: 10px; }
  .yz-sinav .k { width: calc(var(--k) * 1.1); height: calc(var(--k) * 1.1); border-radius: 18px; background: #fff; padding: 6px; box-sizing: border-box; box-shadow: 0 5px 0 rgba(29,40,70,.14); }
  .yz-sinav .k img { width: 100%; height: 100%; }
  .yz-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); background: #fff; border-radius: 16px; padding: 6px; box-sizing: border-box; filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .yz-tasinan img { width: 100%; height: 100%; }
  `;
  const beyin = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/></svg>`;
  const soru = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01"/></svg>`;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("yz-stil")) { const st = document.createElement("style"); st.id = "yz-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="yz"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="yz-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".yz-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, bolumler().length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: bolumler().map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = bolumler()[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.yer = b.ogret.map(() => -1); // her örneğin konduğu sepet
    d.sahne.innerHTML = `
      <div class="yz-ust"><div class="yz-robot">${robot()}</div><div class="yz-adim"><span class="aktif" data-a="1">${beyin} Öğret</span><span data-a="2">${soru} Sına</span></div></div>
      <div class="yz-sira" aria-label="Örnekler"></div>
      <div class="yz-sepetler">${b.degerler.map((_, s) => `<div class="yz-sepet" data-s="${s}" role="button" aria-label="${s + 1}. sepet"><div class="etiket">${etiket(b, s)}</div><div class="ic"></div></div>`).join("")}</div>
      <button class="yz-dugme" type="button" disabled>${d.api.IKON.oynat}<span>Robotu sına</span></button>`;
    d.dugme = d.sahne.querySelector(".yz-dugme");
    d.dugme.onclick = sina;
    d.sahne.querySelectorAll(".yz-sepet").forEach((el) => (el.onclick = (e) => {
      if (d.calisiyor) return;
      const k = e.target.closest(".k");
      if (k && k.dataset.q != null) { d.yer[+k.dataset.q] = -1; ciz(); d.api.ses.tik(); return; } // sepetteki örnek geri döner
      const q = d.yer.indexOf(-1);
      if (q >= 0) { d.yer[q] = +el.dataset.s; ciz(); d.api.ses.tik(); }
    }));
    ciz();
    boyutla();
  }
  function ciz() {
    const b = bolumler()[d.idx];
    const sira = d.sahne.querySelector(".yz-sira");
    sira.innerHTML = b.ogret.map((e, q) => (d.yer[q] < 0 ? `<button class="yz-kart" type="button" data-q="${q}" aria-label="Örnek">${`<img src="${resim(e)}" alt="">`}</button>` : "")).join("");
    const ilk = sira.querySelector(".yz-kart"); if (ilk) ilk.classList.add("siradaki");
    sira.querySelectorAll(".yz-kart").forEach(kartTasi);
    d.sahne.querySelectorAll(".yz-sepet").forEach((el, s) => {
      el.querySelector(".ic").innerHTML = b.ogret.map((e, q) => (d.yer[q] === s ? `<span class="k" data-q="${q}"><img src="${resim(e)}" alt=""></span>` : "")).join("");
    });
    d.dugme.disabled = d.calisiyor || d.yer.includes(-1);
  }
  function boyutla() {
    if (!d) return;
    const b = bolumler()[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    let k = Math.max(44, Math.min(86, Math.floor(H / 7.5), Math.floor((W - 40) / (Math.min(b.ogret.length, 8) * 1.15))));
    d.sahne.style.setProperty("--k", k + "px");
    for (let q = 0; q < 30 && d.sahne.scrollHeight > d.sahne.clientHeight + 2 && k > 36; q++) { k -= 3; d.sahne.style.setProperty("--k", k + "px"); }
  }
  function kartTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const q = +btn.dataset.q;
    btn.addEventListener("pointerdown", (e) => { if (d.calisiyor) return; e.preventDefault(); aktif = true; bx = e.clientX; by = e.clientY; btn.setPointerCapture && btn.setPointerCapture(e.pointerId); });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) { ucan = document.createElement("div"); ucan.className = "yz-tasinan"; const rr = btn.getBoundingClientRect(); ucan.style.width = ucan.style.height = rr.width + "px"; ucan.innerHTML = btn.innerHTML; document.body.appendChild(ucan); }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY), sp = alt && alt.closest(".yz-sepet");
      if (hedef && hedef !== sp) hedef.classList.remove("hedefte");
      hedef = sp || null; if (hedef) hedef.classList.add("hedefte");
    });
    const birak = () => {
      if (!aktif) return; aktif = false;
      if (ucan) { ucan.remove(); ucan = null; if (hedef) { hedef.classList.remove("hedefte"); d.yer[q] = +hedef.dataset.s; ciz(); d.api.ses.tik(); } hedef = null; }
    };
    btn.addEventListener("pointerup", birak); btn.addEventListener("pointercancel", birak);
  }

  // Sınav: robot öğrendiklerine göre yeni resimleri sepetlere koyar
  async function sina() {
    if (d.calisiyor) return;
    d.calisiyor = true; ciz();
    const benim = d.uid, b = bolumler()[d.idx];
    d.sahne.querySelectorAll(".yz-adim span").forEach((s) => s.classList.toggle("aktif", s.dataset.a === "2"));
    const ogrendi = b.ogret.map((e, q) => ({ e, sepet: d.yer[q] }));
    const robotEl = d.sahne.querySelector(".yz-robot"), sira = d.sahne.querySelector(".yz-sira");
    let hata = false;
    for (let t = 0; t < b.sina.length; t++) {
      const e = b.sina[t];
      sira.innerHTML = `<div class="yz-sinav"><div class="k"><img src="${resim(e)}" alt=""></div></div>`;
      robotEl.innerHTML = robot("dusun");
      d.api.ses.ton(392, 0.2);
      await bekle(900);
      if (!d || benim !== d.uid) return;
      const s = tahmin(ogrendi, e), dogru = s === b.sinavDogru[t];
      const sepet = d.sahne.querySelector(`.yz-sepet[data-s="${s < 0 ? b.sinavDogru[t] : s}"]`);
      robotEl.innerHTML = robot(dogru ? undefined : "uzgun");
      if (s >= 0) { sepet.classList.add("yanar"); sepet.querySelector(".ic").insertAdjacentHTML("beforeend", `<span class="k test ${dogru ? "dogru" : "hatali"}"><img src="${resim(e)}" alt=""></span>`); }
      if (dogru) d.api.ses.yerlesti(); else { d.api.ses.hata(); hata = true; }
      await bekle(700);
      if (!d || benim !== d.uid) return;
      if (sepet) sepet.classList.remove("yanar");
      if (hata) break;
    }
    if (!hata) { robotEl.innerHTML = robot(); await bekle(400); if (!d || benim !== d.uid) return; return bitir(); }
    // Yanlış öğretilen örnekler yanıp söner; çocuk düzeltir
    await bekle(400);
    d.sahne.querySelectorAll(".yz-adim span").forEach((s) => s.classList.toggle("aktif", s.dataset.a === "1"));
    d.calisiyor = false; ciz();
    robotEl.innerHTML = robot("uzgun");
    b.ogret.forEach((_, q) => { if (d.yer[q] !== b.dogru[q]) { const k = d.sahne.querySelector(`.yz-sepet .k[data-q="${q}"]`); if (k) k.classList.add("yanlis"); } });
  }
  function bitir() {
    d.calisiyor = false;
    const bs = bolumler(), son = d.idx === bs.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= bs.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Robotun artık çok akıllı!" : "Son sınav da geçti!") : "Robot iyi öğrendi!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.YZ_BOLUMLER = bolumler;

  window.Uygulama.oyunEkle(33, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const b = bolumler()[d.idx], q = d.yer.indexOf(-1);
      if (q < 0) return [{ el: d.dugme }];
      return [{ el: d.sahne.querySelector(`.yz-kart[data-q="${q}"]`), hedef: d.sahne.querySelector(`.yz-sepet[data-s="${b.dogru[q]}"]`) }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: 30 };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${robot()}<img src="${N().elma.src}" alt="" style="width:30px"><img src="${N().kedi.src}" alt="" style="width:30px"></div>`; },
  });
})();
