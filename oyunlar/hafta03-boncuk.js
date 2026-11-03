/* 3. Hafta: Boncuk Dizisi (örüntü).
   İpteki boncuklar bir örüntüyle tekrar eder; çocuk boşluklara doğru boncuğu koyar.
   20 bölüm: AB (4), AAB/ABB (4), ABC (4), renk + şekil (4), çok boşluk (4). */
(function () {
  const KAYIT = "boncuk";

  // ---------- Boncuklar: renk + şekil ----------
  const RENK = { k: "#ff5a4e", m: "#2f86e0", s: "#ffc23a", y: "#2fb36a", o: "#8a5cf0", p: "#ff7ab8" };
  const KOYU = { k: "#c9362d", m: "#1f62ab", s: "#d89a12", y: "#1f8a4f", o: "#6a3fcc", p: "#d9508f" };
  // İlk bölümlerde her rengin kendi şekli var; renkleri ayırt edemeyen çocuk şekilden tanır.
  const VARSAYILAN_SEKIL = { k: "daire", m: "kare", s: "yildiz", y: "kalp", o: "ucgen", p: "daire" };

  const yildizNoktalari = (() => {
    const n = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 21 : 45, a = (Math.PI / 5) * i - Math.PI / 2;
      n.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(53 + Math.sin(a) * r).toFixed(1)}`);
    }
    return n.join(" ");
  })();

  function sekil(ad, dolgu, kenar) {
    const ortak = `fill="${dolgu}" stroke="${kenar}" stroke-width="5" stroke-linejoin="round"`;
    if (ad === "daire") return `<circle cx="50" cy="50" r="40" ${ortak}/>`;
    if (ad === "kare") return `<rect x="12" y="12" width="76" height="76" rx="16" ${ortak}/>`;
    if (ad === "yildiz") return `<polygon points="${yildizNoktalari}" ${ortak}/>`;
    if (ad === "kalp") return `<path d="M50 88 C22 68 8 52 11 34 C14 16 38 12 50 30 C62 12 86 16 89 34 C92 52 78 68 50 88 Z" ${ortak}/>`;
    return `<polygon points="50,10 91,84 9,84" ${ortak}/>`; // üçgen
  }

  // Jeton biçimi: "k" (kırmızı, kendi şekli) ya da "k-yildiz" (kırmızı yıldız)
  function coz(jeton) {
    const [r, s] = jeton.split("-");
    return { renk: r, sekil: s || VARSAYILAN_SEKIL[r] };
  }
  const SEKIL_AD = { daire: "daire", kare: "kare", yildiz: "yıldız", kalp: "kalp", ucgen: "üçgen" };
  const RENK_AD = { k: "kırmızı", m: "mavi", s: "sarı", y: "yeşil", o: "mor", p: "pembe" };
  function boncuk(jeton) {
    const { renk, sekil: sk } = coz(jeton);
    const delikY = sk === "ucgen" ? 60 : sk === "kalp" ? 48 : 52;
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${sekil(sk, RENK[renk], KOYU[renk])}
      <ellipse cx="34" cy="32" rx="10" ry="6" fill="#fff" opacity=".45" transform="rotate(-30 34 32)"/>
      <circle cx="50" cy="${delikY}" r="7" fill="${KOYU[renk]}"/></svg>`;
  }
  const boncukAdi = (j) => { const c = coz(j); return `${RENK_AD[c.renk]} ${SEKIL_AD[c.sekil]}`; };

  // ---------- Bölümler ----------
  // birim: tekrar eden parça, uzunluk: ipteki boncuk sayısı, bos: boş yerlerin sırası, secenek: kutudaki boncuklar
  const B = (grup, birim, uzunluk, bos, secenek) => ({ grup, birim, uzunluk, bos, secenek });
  const BOLUMLER = [
    B("AB", ["k", "m"], 8, [7], ["k", "m"]),
    B("AB", ["s", "y"], 8, [7], ["s", "y"]),
    B("AB", ["o", "k"], 8, [7], ["o", "k"]),
    B("AB", ["m", "k"], 9, [8], ["m", "k", "s"]),
    B("AB", ["y", "o"], 8, [6, 7], ["y", "o", "k"]),
    B("AB", ["s", "m"], 9, [7, 8], ["s", "m", "y"]),

    B("AAB", ["k", "k", "m"], 9, [8], ["k", "m"]),
    B("AAB", ["s", "y", "y"], 9, [8], ["s", "y", "m"]),
    B("AAB", ["m", "m", "s"], 9, [7, 8], ["m", "s", "k"]),
    B("AAB", ["k", "k", "y", "y"], 11, [9, 10], ["k", "y", "s"]),
    B("AAB", ["o", "s", "s"], 9, [6, 8], ["o", "s", "k"]),
    B("AAB", ["y", "y", "k"], 12, [5, 10, 11], ["y", "k", "m"]),

    B("ABC", ["k", "m", "s"], 9, [8], ["k", "m", "s"]),
    B("ABC", ["y", "o", "k"], 9, [7, 8], ["y", "o", "k"]),
    B("ABC", ["s", "k", "m"], 10, [9], ["s", "k", "m", "y"]),
    B("ABC", ["m", "y", "o"], 12, [10, 11], ["m", "y", "o", "k"]),
    B("ABC", ["o", "s", "k"], 12, [4, 8, 11], ["o", "s", "k", "m"]),
    B("ABC", ["k", "m", "s", "y"], 12, [10, 11], ["k", "m", "s", "y"]),

    B("Renk + şekil", ["k-yildiz", "m-daire"], 8, [7], ["k-yildiz", "m-daire", "k-daire", "m-yildiz"]),
    B("Renk + şekil", ["s-kalp", "s-kare"], 8, [7], ["s-kalp", "s-kare", "y-kalp"]),
    B("Renk + şekil", ["y-daire", "o-daire", "y-yildiz"], 9, [8], ["y-daire", "o-daire", "y-yildiz", "o-yildiz"]),
    B("Renk + şekil", ["k-kare", "k-kare", "m-kalp"], 9, [7, 8], ["k-kare", "m-kalp", "k-kalp", "m-kare"]),
    B("Renk + şekil", ["m-yildiz", "m-kalp", "s-kalp"], 9, [8], ["s-kalp", "m-kalp", "s-yildiz", "m-yildiz"]),
    B("Renk + şekil", ["o-kare", "y-daire", "y-daire"], 9, [7, 8], ["o-kare", "y-daire", "o-daire", "y-kare"]),
    B("Çok boşluk", ["k", "m"], 10, [3, 6, 9], ["k", "m", "s"]),
    B("Çok boşluk", ["y", "y", "s"], 12, [2, 5, 10, 11], ["y", "s", "m"]),
    B("Çok boşluk", ["k", "m", "s"], 12, [1, 4, 8, 11], ["k", "m", "s", "y"]),
    B("Çok boşluk", ["k-daire", "s-yildiz", "m-kalp"], 12, [5, 7, 10, 11], ["k-daire", "s-yildiz", "m-kalp", "k-yildiz", "m-daire"]),
    B("Çok boşluk", ["k", "k", "m", "s"], 12, [2, 5, 7, 10], ["k", "m", "s", "y"]),
    B("Çok boşluk", ["y-yildiz", "k-daire", "m-kare"], 12, [1, 4, 6, 9, 11], ["y-yildiz", "k-daire", "m-kare", "k-yildiz", "y-daire"]),
  ].map((b, i) => ({ ...b, desen: b.grup, grup: Uygulama.seviye(i) }));


  const stil = `
  .bk { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--yesil); }
  .bk-sahne { --k: 80px; --s: 96px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 10px; padding: 8px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .bk-baslik { margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.2rem, 3vw, 1.7rem); line-height: 1; text-align: center; }
  .bk-kolye { display: grid; gap: 18px; padding: 22px 26px; border-radius: 28px; background: var(--kagit); box-shadow: 0 8px 0 rgba(29,40,70,.1); }
  .bk-ip { position: relative; display: flex; }
  .bk-ip::before { content: ""; position: absolute; left: -14px; right: -14px; top: 50%; height: 6px; margin-top: -3px; border-radius: 3px; background: #c4935f; }
  .bk-ip:first-child::after { content: ""; position: absolute; left: -22px; top: 50%; width: 16px; height: 16px; margin-top: -8px; border-radius: 50%; background: #a8774a; }
  .bk-yer { position: relative; width: var(--k); height: var(--k); display: grid; place-items: center; border-radius: 16px; transition: background .3s; }
  .bk-yer > svg { width: 84%; height: 84%; position: relative; filter: drop-shadow(0 3px 0 rgba(29,40,70,.18)); }
  .bk-yer.birim { background: #fff1c2; }
  .bk-bos { position: relative; width: 78%; height: 78%; border-radius: 50%; border: 4px dashed var(--cizgi); background: var(--zemin); display: grid; place-items: center; font-family: var(--f-baslik); font-weight: 800; font-size: calc(var(--k) * .38); color: var(--cizgi); cursor: pointer; }
  .bk-bos.aktif { border-color: var(--mavi); color: var(--mavi); background: #d4e8ff; animation: bk-nabiz 1.1s ease-in-out infinite; }
  .bk-bos.hedef { border-style: solid; transform: scale(1.12); }
  .bk-bos.salla { animation: bk-salla .45s; border-color: var(--kirmizi); color: var(--kirmizi); }
  .bk-yer.yeni > svg { animation: bk-tak .4s cubic-bezier(.3,1.6,.5,1); }
  .bk-yer.dalga > svg { animation: bk-dalga .5s ease-in-out; }
  @keyframes bk-nabiz { 50% { transform: scale(1.08); } }
  @keyframes bk-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  @keyframes bk-tak { from { transform: scale(.3) translateY(-30px); } }
  @keyframes bk-dalga { 50% { transform: translateY(-18px) rotate(12deg); } }
  .bk-kutu { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; padding: 14px 22px; border-radius: 26px; border: 3px dashed var(--cizgi); background: var(--zemin-2); }
  .bk-secenek { width: var(--s); height: var(--s); padding: 0; border: 0; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.14); cursor: grab; display: grid; place-items: center; touch-action: none; }
  .bk-secenek svg { width: 78%; height: 78%; pointer-events: none; }
  .bk-secenek:active { transform: translateY(3px); box-shadow: 0 3px 0 rgba(29,40,70,.14); }
  .bk-secenek.salla { animation: bk-salla .45s; }
  .bk-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.1); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  `;

  const ampul = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>`;
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("bk-stil")) {
      const st = document.createElement("style"); st.id = "bk-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="bk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="bk-sahne"></div></div>`;
    api.araclar.innerHTML = `<button class="dugme" type="button" data-ipucu aria-label="İpucu: tekrar eden parçayı göster">${ampul}<span class="etiket">İpucu</span></button>`;
    d = { alan, api, ilerleme, sahne: alan.querySelector(".bk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    api.araclar.querySelector("[data-ipucu]").onclick = ipucu;
    d.gozlemci = new ResizeObserver(() => yerlesimiKur());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.bitiyor = false; d.aktif = null;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.dizi = Array.from({ length: b.uzunluk }, (_, j) => b.birim[j % b.birim.length]);
    d.dolu = d.dizi.map((_, j) => !b.bos.includes(j));
    d.satirSayisi = 0;
    d.sahne.innerHTML = `<h2 class="bk-baslik">${b.bos.length > 1 ? "Boşluklara hangi boncuklar gelir?" : "Sırada hangi boncuk var?"}</h2>
      <div class="bk-kolye"></div>
      <div class="bk-kutu" aria-label="Boncuk kutusu">${b.secenek.map((j) => `<button class="bk-secenek" type="button" data-j="${j}" aria-label="${boncukAdi(j)}">${boncuk(j)}</button>`).join("")}</div>`;
    d.kolye = d.sahne.querySelector(".bk-kolye");
    d.sahne.querySelectorAll(".bk-secenek").forEach(tasi);
    yerlesimiKur(true);
  }

  // İpi ekrana sığdır: dar ekranda iki satıra böl
  function yerlesimiKur(zorla) {
    if (!d || !d.kolye) return;
    const b = BOLUMLER[d.idx], n = b.uzunluk;
    const W = d.sahne.clientWidth - 32 - 60, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    let satir = 1, k = Math.min(96, Math.floor(W / n));
    if (k < 60) { satir = 2; k = Math.min(96, Math.floor(W / Math.ceil(n / 2))); }
    const s = Math.max(64, Math.min(110, Math.round(k * 1.15)));
    const kH = Math.floor((H - 50 - (s + 34) - 44 - 60 - (satir - 1) * 18) / satir);
    k = Math.max(40, Math.min(k, kH));
    d.sahne.style.setProperty("--k", k + "px");
    d.sahne.style.setProperty("--s", Math.min(s, Math.max(56, kH + 20)) + "px");
    if (zorla || satir !== d.satirSayisi) { d.satirSayisi = satir; ipiCiz(); }
  }

  function ipiCiz() {
    const n = d.dizi.length, satir = d.satirSayisi, adet = Math.ceil(n / satir);
    let html = "";
    for (let r = 0; r < satir; r++) {
      html += `<div class="bk-ip">`;
      for (let j = r * adet; j < Math.min(n, (r + 1) * adet); j++) {
        html += `<div class="bk-yer" data-j="${j}">${d.dolu[j] ? boncuk(d.dizi[j]) : `<div class="bk-bos" role="button" tabindex="0" aria-label="Boş yer">?</div>`}</div>`;
      }
      html += `</div>`;
    }
    d.kolye.innerHTML = html;
    d.kolye.querySelectorAll(".bk-bos").forEach((bos) => {
      bos.onclick = () => { d.aktif = +bos.parentElement.dataset.j; aktifiGoster(); d.api.ses.tik(); };
    });
    if (d.aktif == null || d.aktif < 0 || d.dolu[d.aktif]) d.aktif = d.dolu.indexOf(false);
    aktifiGoster();
  }

  function aktifiGoster() {
    d.kolye.querySelectorAll(".bk-bos").forEach((b) => b.classList.toggle("aktif", +b.parentElement.dataset.j === d.aktif));
  }

  // Boncuğu sürükle ya da dokun (dokununca seçili boşluğa gider)
  function tasi(btn) {
    let ucan = null, bx, by, aktif = false, hedef = null;
    btn.addEventListener("pointerdown", (e) => {
      if (d.bitiyor) return;
      e.preventDefault();
      aktif = true; bx = e.clientX; by = e.clientY;
      btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) {
        ucan = document.createElement("div");
        ucan.className = "bk-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width * 0.8 + "px";
        ucan.innerHTML = boncuk(btn.dataset.j);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const yer = alt && alt.closest(".bk-yer");
      const bos = yer && yer.querySelector(".bk-bos");
      if (hedef && hedef !== bos) hedef.classList.remove("hedef");
      hedef = bos; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) {
        ucan.remove(); ucan = null;
        if (hedef) { hedef.classList.remove("hedef"); dene(btn, +hedef.parentElement.dataset.j); }
        hedef = null;
      } else if (d.aktif >= 0) dene(btn, d.aktif);
    };
    btn.addEventListener("pointerup", birak);
    btn.addEventListener("pointercancel", birak);
    btn.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && d.aktif >= 0) { e.preventDefault(); dene(btn, d.aktif); } });
  }

  function dene(btn, j) {
    if (d.bitiyor || d.dolu[j]) return;
    const yer = d.kolye.querySelector(`.bk-yer[data-j="${j}"]`);
    if (btn.dataset.j === d.dizi[j]) {
      d.dolu[j] = true;
      yer.innerHTML = boncuk(d.dizi[j]);
      yer.classList.add("yeni");
      setTimeout(() => yer.classList.remove("yeni"), 450);
      d.api.ses.yerlesti();
      d.aktif = d.dolu.indexOf(false);
      aktifiGoster();
      if (d.aktif < 0) bitir();
    } else {
      const bos = yer.querySelector(".bk-bos");
      bos.classList.remove("salla"); void bos.offsetWidth; bos.classList.add("salla");
      btn.classList.remove("salla"); void btn.offsetWidth; btn.classList.add("salla");
      setTimeout(() => { bos.classList.remove("salla"); btn.classList.remove("salla"); }, 500);
      d.api.ses.hata();
    }
  }

  // İpucu: tekrar eden ilk parçayı sarıyla vurgula
  function ipucu() {
    if (!d || d.bitiyor) return;
    const L = BOLUMLER[d.idx].birim.length;
    const yerler = [...d.kolye.querySelectorAll(".bk-yer")];
    yerler.forEach((y, j) => y.classList.toggle("birim", j < L));
    d.api.ses.tik();
    clearTimeout(d.ipucuZaman);
    d.ipucuZaman = setTimeout(() => yerler.forEach((y) => y.classList.remove("birim")), 2800);
  }

  async function bitir() {
    d.bitiyor = true;
    const benim = d.uid;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    await bekle(450);
    // Kolye dalgalanır: her boncuk sırayla zıplar ve bir nota çalar
    const yerler = [...d.kolye.querySelectorAll(".bk-yer")];
    for (let j = 0; j < yerler.length; j++) {
      if (!d || benim !== d.uid) return;
      yerler[j].classList.add("dalga");
      d.api.ses.adim(j % 8);
      await bekle(130);
    }
    await bekle(450);
    if (!d || benim !== d.uid) return;
    yerler.forEach((y) => y.classList.remove("dalga"));
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün kolyeleri tamamladın!" : "Son kolye de tamam!") : "Kolye tamam!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.BONCUK_BOLUMLER = BOLUMLER; // test için

  window.Uygulama.oyunEkle(3, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      const j = d.dolu.findIndex((x) => !x);
      if (j < 0) return [];
      return [{ el: d.sahne.querySelector(`.bk-secenek[data-j="${d.dizi[j]}"]`), hedef: d.sahne.querySelector(`.bk-yer[data-j="${j}"]`) }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) { d.uid++; clearTimeout(d.ipucuZaman); } d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const dizi = ["k", "m", "k", "m", "k"];
      return `<div class="mini mini-boncuk" aria-hidden="true">${dizi.map((j) => `<span>${boncuk(j)}</span>`).join("")}</div>`;
    },
  });
})();
