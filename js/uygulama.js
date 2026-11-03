/* Minik Kodcular: ana sayfa, yönlendirme, tam ekran, ses ve kayıt. */
(function () {
  // Sarmal program: 6 kavram, 6 tur, 36 hafta. Kavramlar her turda
  // biraz daha zor hâliyle tekrar gelir. Oyun dosyası oyunlar/haftaXX-*.js içinde
  // Uygulama.oyunEkle(no, {...}) ile kaydolunca kartı açılır.
  const KAVRAMLAR = [
    { ad: "Parça-bütün", renk: "var(--kirmizi)" },
    { ad: "Sıralama", renk: "var(--mavi)" },
    { ad: "Örüntü", renk: "var(--yesil)" },
    { ad: "Yön ve komut", renk: "var(--mor)" },
    { ad: "Döngü", renk: "var(--sari-koyu)" },
    { ad: "Koşul ve hata", renk: "var(--turuncu)" },
  ];
  // [ad, kavram sırası]. İlk tur kolay oyunlarla başlar, kodlama oyunları (yön, döngü) 2. turda gelir.
  const PLAN = [
    ["Yapboz", 0], ["Sırala!", 1], ["Boncuk Dizisi", 2], ["Büyükten Küçüğe", 1], ["Gölge Eşleştir", 0], ["Sınıflandır", 5],
    ["Şekillerden Resim", 0], ["Günlük Rutinim", 1], ["Renk Örüntüsü", 2], ["Dans Eden Robot", 3], ["Tavşanın Treni", 3], ["Su Boruları", 3],
    ["Minik Aşçı", 1], ["Hayvan Korosu", 2], ["Tangram", 0], ["Arıyı Çiçeğe Götür", 3], ["Tavşanın Havuçları", 3], ["Trafik Lambası", 5],
    ["Roket Gezegene", 4], ["Renkli Fırça", 3], ["Renkli Halkalar", 3], ["Ahtapotun Hazinesi", 5], ["Kule Ustası", 1], ["Şifreli Resim", 3],
    ["Hangi Program?", 3], ["Sihirli Makine", 5], ["Kalem Kaplumbağa", 3], ["Ayıklama Makinesi", 5], ["Robot Postacı", 5], ["Makas Ustası", 5],
    ["Robot Kamyonet", 3], ["Hata Avcısı", 5], ["Yapay Zekâya Öğret", 5], ["Robot Süpürge", 3], ["Kalem Tavşan", 3], ["Mezuniyet Görevi", 5], ["Dokununca Ne Olur?", 5], ["Engel Koşusu", 5], ["Uğur Böceği Yaprağa", 3], ["Yakından Bak", 0], ["Eksik Parça", 0], ["Döndür Yapboz", 0], ["Yarım Resim", 0],
  ];
  const HAFTALAR = PLAN.map(([ad, kavram], i) => ({ no: i + 1, ad, kavram, tur: Math.floor(i / 6) + 1 }));

  const oyunlar = {};
  let aktifOyun = null, aktifNo = null;

  // ---------- Kayıt (tarayıcıda, isteğe bağlı) ----------
  const kayit = {
    oku(anahtar, varsayilan) {
      try { const v = localStorage.getItem("mk:" + anahtar); return v ? JSON.parse(v) : varsayilan; } catch (e) { return varsayilan; }
    },
    yaz(anahtar, deger) {
      try { localStorage.setItem("mk:" + anahtar, JSON.stringify(deger)); } catch (e) {}
    },
  };

  // ---------- Ses (Web Audio ile üretilen kısa sesler) ----------
  let ctx = null;
  let sesAcik = kayit.oku("ses", true);
  function nota(frek, bas, sure, tip = "sine", hacim = 0.22) {
    if (!sesAcik) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      const t = ctx.currentTime + bas;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = tip; o.frequency.setValueAtTime(frek, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(hacim, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + sure);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + sure + 0.05);
    } catch (e) {}
  }
  const ses = {
    tik() { nota(520, 0, 0.08, "triangle", 0.12); },
    yerlesti() { nota(660, 0, 0.12, "sine"); nota(990, 0.07, 0.18, "sine"); },
    ton(frek, sure = 0.4) { nota(frek, 0, sure, "triangle", 0.24); nota(frek * 2, 0.02, sure * 0.6, "sine", 0.06); },
    adim(j) { nota(523 * Math.pow(2, (j * 2) / 12), 0, 0.2, "triangle", 0.18); },
    hata() { nota(220, 0, 0.18, "triangle", 0.15); nota(180, 0.1, 0.22, "triangle", 0.12); },
    kazandi() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => nota(f, i * 0.12, 0.3, "triangle", 0.2)); },
  };

  // ---------- Tam ekran ----------
  const tamEkranVar = () => !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  const tamEkranda = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  function tamEkranDegistir() {
    const el = document.documentElement;
    try {
      if (tamEkranda()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else {
        const p = (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
        if (p && p.catch) p.catch(() => {});
      }
    } catch (e) {}
  }
  function tamEkranDugmeleriniGuncelle() {
    document.querySelectorAll("[data-tam-ekran]").forEach((b) => {
      b.hidden = !tamEkranVar();
      b.innerHTML = tamEkranda() ? IKON.kucult + '<span class="etiket">Küçült</span>' : IKON.buyut + '<span class="etiket">Tam ekran</span>';
      b.setAttribute("aria-label", tamEkranda() ? "Tam ekrandan çık" : "Tam ekran yap");
    });
  }
  document.addEventListener("fullscreenchange", tamEkranDugmeleriniGuncelle);
  document.addEventListener("webkitfullscreenchange", tamEkranDugmeleriniGuncelle);

  // ---------- İkonlar ----------
  const s = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const IKON = {
    buyut: s('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
    kucult: s('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'),
    ev: s('<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    sesAcik: s('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>'),
    sesKapali: s('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>'),
    el: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10h.5V8.5a1.5 1.5 0 0 1 3 0V10h.5V9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.2a5 5 0 0 1-3.9-1.9L4.3 15a1.5 1.5 0 0 1 2.3-1.9L9 15.5z" fill="#ffd6b0" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    cevap: s('<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>'),
    kilit: s('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    oynat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>',
    ileri: s('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    geri: s('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    goz: s('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    tekrar: s('<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.6"/><path d="M4 4v4.6h4.6"/>'),
  };

  const logoSvg = `<svg class="logo-isaret" viewBox="0 0 40 40" aria-hidden="true"><rect x="2" y="2" width="17" height="17" rx="5" fill="#ff5a4e"/><rect x="21" y="2" width="17" height="17" rx="5" fill="#ffc23a"/><rect x="2" y="21" width="17" height="17" rx="5" fill="#2f86e0"/><rect x="21" y="21" width="17" height="17" rx="5" fill="#2fb36a"/><path d="M14 13l-4 4 4 4M26 13l4 4-4 4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 3)"/></svg>`;

  const kok = () => document.getElementById("uygulama");

  // ---------- Oyunların ortak parçaları ----------
  // Bölüm noktaları: kolaydan zora sıralı, yazısız. Bir bölüm bitmeden sonrakine geçilmez.
  // etiketler yalnız bölüm sayısını ve zorluk kümelerini (noktalar arası küçük boşluk) verir.
  const bolumAcik = (i, bitti) => ogretmenMi() || i === 0 || bitti.includes(i) || bitti.includes(i - 1);
  let sonBolum = null; // sesli yönerge 1. bölüme her gelişte okunur
  function bolumNoktalari(nav, { etiketler, idx, bitti, sec }) {
    if (idx === 0 && sonBolum !== 0) konus(YONERGE[aktifNo]);
    sonBolum = idx;
    let html = "", grup = null;
    etiketler.forEach((e, i) => {
      if (e !== grup) { if (grup !== null) html += "</div>"; grup = e; html += `<div class="nk-grup">`; }
      const acik = bolumAcik(i, bitti);
      const cls = ["nk-nokta", bitti.includes(i) ? "bitti" : "", i === idx ? "simdi" : "", acik ? "" : "kilitli"].join(" ");
      html += `<button class="${cls}" type="button" data-i="${i}" aria-label="${i + 1}. bölüm${acik ? "" : ", kilitli"}"${acik ? "" : " disabled"}></button>`;
    });
    nav.innerHTML = html + "</div>";
    nav.querySelectorAll("button:not(:disabled)").forEach((b) => (b.onclick = () => sec(+b.dataset.i)));
    // Eski kayıtta kilitli bir bölümde kalındıysa açık olan en ileri bölüme dön
    if (!bolumAcik(idx, bitti)) { let j = 0; while (j + 1 < etiketler.length && bolumAcik(j + 1, bitti)) j++; setTimeout(() => sec(j)); }
  }

  function konfeti(sahne) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas");
    c.className = "kt-konfeti";
    const W = (c.width = sahne.clientWidth), H = (c.height = sahne.clientHeight);
    sahne.appendChild(c);
    const g = c.getContext("2d");
    const renk = ["#ff5a4e", "#ffc23a", "#2fb36a", "#2f86e0", "#8a5cf0", "#ff7ab8"];
    const ps = Array.from({ length: 140 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.45,
      vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 6,
      a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4, s: 6 + Math.random() * 8, c: renk[(Math.random() * renk.length) | 0],
    }));
    const t0 = performance.now();
    (function kare(t) {
      g.clearRect(0, 0, W, H);
      ps.forEach((p) => { p.vy += 0.45; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
      if (t - t0 < 3200 && c.isConnected) requestAnimationFrame(kare); else c.remove();
    })(t0);
  }

  // Bölüm sonu kutlaması: yıldızlar, "Aferin!", ileri oku (son bölümde Baştan / Ana sayfa)
  function kutla(sahne, { mesaj, son, ileri, bastan }) {
    const yildiz = (g) => `<svg viewBox="0 0 24 24" style="animation-delay:${g}s"><path d="M12 2l3 6.6 7 .8-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.8z" fill="#ffc23a" stroke="#e59a00" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
    ses.kazandi();
    konfeti(sahne);
    const t = document.createElement("div");
    t.className = "kt-ortu";
    t.innerHTML = `<div class="kt-kart"><div class="kt-yildizlar">${yildiz(0.1)}${yildiz(0.25)}${yildiz(0.4)}</div>
      <h3>Aferin!</h3><p>${mesaj}</p>
      ${son
        ? `<div class="kt-satir"><button class="dugme" type="button" data-bastan>${IKON.tekrar}<span>Baştan</span></button><a class="dugme" href="#${kategoriAdresi(aktifNo)}">${IKON.ev}<span>Oyunlar</span></a></div>`
        : `<button class="kt-ileri" type="button" aria-label="Sonraki bölüm">${IKON.ileri}</button>`}</div>`;
    sahne.appendChild(t);
    const i = t.querySelector(".kt-ileri");
    if (i) { i.onclick = () => { ses.tik(); ileri(); }; i.focus({ preventScroll: true }); }
    const b = t.querySelector("[data-bastan]");
    if (b) b.onclick = bastan;
  }

  // ---------- Ana sayfa: kademe seçimi ----------
  const KADEMELER = [
    { id: "anaokulu", ad: "Anaokulu", alt: "4–6 yaş", renk: "#ff5a4e", resim: '<svg viewBox="0 0 120 100" aria-hidden="true"><rect x="10" y="58" width="34" height="34" rx="6" fill="#ff5a4e"/><text x="27" y="84" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#fff">A</text><rect x="46" y="58" width="34" height="34" rx="6" fill="#2f86e0"/><text x="63" y="84" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#fff">B</text><rect x="28" y="22" width="34" height="34" rx="6" fill="#ffc23a"/><text x="45" y="48" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#fff">C</text><circle cx="96" cy="30" r="14" fill="#2fb36a"/><path d="M84 92 l12 -30 l12 30 z" fill="#8a5cf0"/></svg>' },
    { id: "ilkokul", ad: "İlkokul", alt: "1–4. sınıf", renk: "#2f86e0", resim: '<svg viewBox="0 0 120 100" aria-hidden="true"><rect x="22" y="30" width="60" height="62" rx="12" fill="#2f86e0"/><rect x="34" y="18" width="36" height="18" rx="9" fill="none" stroke="#1f62ab" stroke-width="6"/><rect x="32" y="52" width="40" height="22" rx="6" fill="#7cc5ff"/><g transform="rotate(35 96 50)"><rect x="90" y="14" width="12" height="62" rx="3" fill="#ffc23a"/><path d="M90 76 h12 l-6 14 z" fill="#f5c9a0"/><rect x="90" y="10" width="12" height="8" rx="2" fill="#ff7ab8"/></g></svg>' },
    { id: "ortaokul", ad: "Ortaokul", alt: "5–8. sınıf", renk: "#2fb36a", resim: '<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M14 30 q22 -10 44 0 v56 q-22 -10 -44 0 z" fill="#2fb36a"/><path d="M58 30 q22 -10 44 0 v56 q-22 -10 -44 0 z" fill="#4fc983"/><path d="M58 30 v56" stroke="#1f8a4f" stroke-width="4"/><path d="M22 44 h26 M22 56 h26 M66 44 h26 M66 56 h20" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/><path d="M96 8 v18 l10 22 h-28 l10 -22 v-18" fill="#e3f0ff" stroke="#5d6878" stroke-width="3" transform="translate(4 0) scale(.9)"/></svg>' },
    { id: "lise", ad: "Lise", alt: "9–12. sınıf", renk: "#8a5cf0", resim: '<svg viewBox="0 0 120 100" aria-hidden="true"><rect x="18" y="30" width="72" height="46" rx="6" fill="#2b2f3a"/><rect x="24" y="36" width="60" height="34" rx="3" fill="#8a5cf0"/><path d="M36 46 l-6 7 l6 7 M58 46 l6 7 l-6 7 M50 44 l-6 18" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="10" y="76" width="88" height="8" rx="4" fill="#5d6878"/><path d="M84 18 l22 -8 l12 6 l-22 8 z" fill="#2b2f3a"/><path d="M94 20 v12 q10 4 16 -4 v-12" fill="#2b2f3a"/></svg>' },
  ];

  function anaSayfa() {
    document.body.classList.remove("oyunda");
    document.title = "Minik Kodcular";
    kok().innerHTML = `
      <header class="ust">
        <a class="logo" href="#">${logoSvg}<span>Minik Kodcular</span></a>
        <span class="ust-bosluk"></span>
        <button class="dugme" data-tam-ekran type="button"></button>
      </header>
      <main class="ana">
        <section class="giris tek">
          <div>
            <h1>Oyunlarla <span>kodlamaya ilk adım</span></h1>
            <p>Okuma gerektirmeyen, kolaydan zora ilerleyen kodlama oyunları. Başlamak için kademeni seç.</p>
          </div>
        </section>
        <section class="kademeler" aria-label="Kademeler">${KADEMELER.map((k) => {
          const hazir = k.id === "anaokulu";
          const say = hazir ? HAFTALAR.filter((h) => oyunlar[h.no]).length : 0;
          return `<a class="kademe${hazir ? "" : " kilitli"}" href="#${k.id}" style="--renk:${k.renk}" aria-label="${k.ad}${hazir ? "" : ", yakında"}">
            <div class="resim">${k.resim}</div>
            <div class="ad">${k.ad}</div><div class="alt">${k.alt}</div>
            <div class="durum">${hazir ? `${IKON.oynat.replace("<svg", '<svg width="16" height="16"')} ${say} oyun` : `${IKON.kilit.replace("<svg", '<svg width="16" height="16"')} Yakında`}</div></a>`;
        }).join("")}</section>
      </main>`;
    tamEkranDugmeleriniGuncelle();
    kok().querySelector("[data-tam-ekran]").onclick = tamEkranDegistir;
  }

  // Henüz oyunu olmayan kademe
  function yakindaSayfa(id) {
    const k = KADEMELER.find((x) => x.id === id);
    document.body.classList.remove("oyunda");
    document.title = `${k.ad} · Minik Kodcular`;
    kok().innerHTML = `
      <header class="ust">
        <a class="dugme kare" href="#" aria-label="Kademeler">${IKON.geri}</a>
        <a class="logo" href="#">${logoSvg}<span>Minik Kodcular</span></a>
        <span class="ust-bosluk"></span>
        <button class="dugme" data-tam-ekran type="button"></button>
      </header>
      <main class="ana"><section class="yakinda" style="--renk:${k.renk}"><div class="resim">${k.resim}</div><h1>${k.ad}</h1><p>${k.alt} için oyunlar hazırlanıyor. Çok yakında burada!</p><a class="dugme" href="#">${IKON.geri}<span>Kademelere dön</span></a></section></main>`;
    tamEkranDugmeleriniGuncelle();
    kok().querySelector("[data-tam-ekran]").onclick = tamEkranDegistir;
  }

  // ---------- Anaokulu: kategoriler ----------
  // Her kategoride 20 yer var; oyunlar kolaydan zora sıralı, kalan yerler "Yakında".
  const KATEGORI_YER = 20;
  const KATEGORILER = [
    { id: "kodlama", ad: "Kodlama Oyunları", alt: "Komut, program, hata ayıklama", renk: "#8a5cf0", oyunlar: [39, 16, 25, 17, 32, 21, 27, 24, 20, 35, 18, 37, 26, 22, 19, 30, 38, 31, 34, 33], // null: o sıra şimdilik boş // basitten karmaşığa: komut → yön → eylem → hata bulma → toplama → renk tutma → bekleme → sayılı adım → tekrar
      resim: '<svg viewBox="0 0 120 100" aria-hidden="true"><rect x="30" y="20" width="60" height="50" rx="14" fill="#8a5cf0"/><circle cx="48" cy="44" r="8" fill="#fff"/><circle cx="72" cy="44" r="8" fill="#fff"/><circle cx="48" cy="44" r="3.5" fill="#26201f"/><circle cx="72" cy="44" r="3.5" fill="#26201f"/><path d="M50 58 q10 6 20 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 20 v-10" stroke="#5d6878" stroke-width="4"/><circle cx="60" cy="8" r="5" fill="#ffc23a"/><rect x="8" y="76" width="30" height="20" rx="6" fill="#2fb36a"/><path d="M16 86 h12 M24 81 l5 5 l-5 5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="45" y="76" width="30" height="20" rx="6" fill="#2f86e0"/><path d="M60 92 v-11 M55 85 l5 -5 l5 5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="82" y="76" width="30" height="20" rx="6" fill="#ff8a1f"/><path d="M90 86 h12 M96 81 l-5 5 l5 5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>' },
    { id: "yapboz", ad: "Yapboz ve Şekiller", alt: "Parça-bütün, görsel algı", renk: "#ff5a4e", oyunlar: [1, 5, 40, 41, 42, 7, 43, 15],
      resim: '<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M20 20 h30 v10 a8 8 0 1 0 0 14 v10 h-30 z" fill="#ff5a4e"/><path d="M50 20 h30 v34 h-10 a8 8 0 1 1 -14 0 h-6 v-10 a8 8 0 1 0 0 -14 z" fill="#ffc23a"/><path d="M20 54 h30 v6 a8 8 0 1 0 14 0 v-6 h16 v30 h-60 z" fill="#2f86e0"/><path d="M88 30 l20 20 l-20 20 z" fill="#2fb36a"/></svg>' },
    { id: "siralama", ad: "Sıralama", alt: "Sıra, zaman, büyüklük", renk: "#2f86e0", oyunlar: [2, 4, 8, 13],
      resim: '<svg viewBox="0 0 120 100" aria-hidden="true"><rect x="14" y="62" width="22" height="26" rx="5" fill="#2f86e0"/><rect x="42" y="46" width="22" height="42" rx="5" fill="#2fb36a"/><rect x="70" y="30" width="22" height="58" rx="5" fill="#ffc23a"/><rect x="98" y="14" width="14" height="74" rx="5" fill="#ff5a4e"/><text x="25" y="58" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="16" fill="#2f86e0">1</text><text x="53" y="42" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="16" fill="#2fb36a">2</text><text x="81" y="26" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="16" fill="#e3a008">3</text></svg>' },
    { id: "oruntu", ad: "Örüntü ve Hafıza", alt: "Tekrar eden düzen, hatırlama", renk: "#2fb36a", oyunlar: [3, 9, 14, 10],
      resim: '<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M6 50 q54 14 108 0" stroke="#c4935f" stroke-width="5" fill="none"/><circle cx="20" cy="52" r="11" fill="#ff5a4e"/><rect x="36" y="44" width="20" height="20" rx="5" fill="#2f86e0"/><circle cx="72" cy="56" r="11" fill="#ff5a4e"/><rect x="88" y="46" width="20" height="20" rx="5" fill="#2f86e0"/><text x="98" y="32" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#2fb36a">?</text><path d="M24 28 q6 -10 12 0 M44 22 q6 -10 12 0" stroke="#8a5cf0" stroke-width="4" fill="none" stroke-linecap="round"/></svg>' },
    { id: "mantik", ad: "Mantık ve Bulmaca", alt: "Problem çözme, plan yapma", renk: "#ff8a1f", oyunlar: [6, 11, 12, 23],
      resim: '<svg viewBox="0 0 120 100" aria-hidden="true"><circle cx="60" cy="40" r="26" fill="#ffc23a"/><path d="M48 66 h24 v10 a6 6 0 0 1 -6 6 h-12 a6 6 0 0 1 -6 -6 z" fill="#9aa7b8"/><path d="M52 40 q8 -12 16 0 q-8 10 -8 18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M14 30 l10 4 M10 50 h12 M106 30 l-10 4 M110 50 h-12 M28 12 l7 8 M92 12 l-7 8" stroke="#ff8a1f" stroke-width="5" stroke-linecap="round"/></svg>' },
  ];
  const kategoriBul = (no) => KATEGORILER.find((k) => k.oyunlar.includes(no));
  const kategoriAdresi = (no) => { const k = kategoriBul(no); return k ? "anaokulu/" + k.id : "anaokulu"; };

  const ustCubuk = (geri, geriAd) => `
      <header class="ust">
        <a class="dugme kare" href="${geri}" aria-label="${geriAd}">${IKON.geri}</a>
        <a class="logo" href="#">${logoSvg}<span>Minik Kodcular</span></a>
        <span class="ust-bosluk"></span>
        <button class="dugme" data-tam-ekran type="button"></button>
      </header>`;

  function anaokuluSayfa() {
    document.body.classList.remove("oyunda");
    document.title = "Anaokulu · Minik Kodcular";
    kok().innerHTML = `${ustCubuk("#", "Kademeler")}
      <main class="ana">
        <section class="giris tek">
          <div>
            <div class="kademe-etiket">Anaokulu · 4–6 yaş</div>
            <h1>Bir <span>oyun türü</span> seç</h1>
            <p>Okuma gerektirmeyen oyunlar. Her oyunda kolaydan zora 30 bölüm vardır.</p>
          </div>
        </section>
        <section class="kategoriler" aria-label="Kategoriler">${KATEGORILER.map((k) => {
          const hazir = k.oyunlar.filter((n) => n && oyunlar[n]).length;
          return `<a class="kategori" href="#anaokulu/${k.id}" style="--renk:${k.renk}" aria-label="${k.ad}, ${hazir} oyun">
            <div class="resim">${k.resim}</div><div class="ad">${k.ad}</div><div class="alt">${k.alt}</div>
            <div class="durum">${IKON.oynat.replace("<svg", '<svg width="16" height="16"')} ${hazir} oyun</div></a>`;
        }).join("")}</section>
        <p class="not">Öğretmen notu: Her oyun ilk açıldığında bir el nasıl oynanacağını gösterir; üstteki el düğmesiyle istediğiniz an yeniden izletebilirsiniz. "Çok zor" bölümler meraklı ve hızlı ilerleyen çocuklar içindir, herkesin bitirmesi gerekmez. Oyunları akıllı tahtada tam ekran açabilirsiniz. Çocuğun ilerlemesi bu cihazdaki tarayıcıda saklanır.</p>
        <div class="sifirla-yer"><button class="dugme${ogretmenMi() ? " ogretmen-acik" : ""}" type="button" data-ogretmen>${IKON.cevap}<span>${ogretmenMi() ? "Öğretmen modu açık · Kapat" : "Öğretmen modu"}</span></button><button class="dugme" type="button" data-sifirla>${IKON.tekrar}<span>Tüm oyunları sıfırla</span></button></div>
      </main>`;
    tamEkranDugmeleriniGuncelle();
    kok().querySelector("[data-tam-ekran]").onclick = tamEkranDegistir;
    kok().querySelector("[data-sifirla]").onclick = sifirlaSor;
    kok().querySelector("[data-ogretmen]").onclick = () => (ogretmenMi() ? ogretmenKapat() : ogretmenAc());
  }

  // ---------- Öğretmen modu ----------
  // Öğretmen e-postasını yazar, Supabase bir giriş kodu gönderir; kod doğrulanınca bu cihazda öğretmen modu açılır:
  // bütün bölümler açılır ve oyunlarda "Cevabı göster" düğmesi çıkar.
  const SUPABASE_URL = "https://psmhycpnoyupyhnxhcpq.supabase.co";
  const SUPABASE_ANAHTAR = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbWh5Y3Bub3l1cHlobnhoY3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MjM3ODEsImV4cCI6MjEwOTI5OTc4MX0.S9MzEw0RZzDGwmeo7JPipWHvFji0hSsvO5vEIJ4D6BE";
  function ogretmenMi() { return !!kayit.oku("ogretmen", null); }
  let supa = null;
  function supabaseYukle() {
    if (supa) return Promise.resolve(supa);
    return new Promise((coz, red) => {
      const sc = document.createElement("script");
      sc.src = "js/vendor/supabase-2.45.4.js"; // @supabase/supabase-js 2.45.4 (MIT), siteyle birlikte gelir
      sc.onload = () => { try { supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANAHTAR); coz(supa); } catch (e) { red(e); } };
      sc.onerror = () => red(new Error("yuklenemedi"));
      document.head.appendChild(sc);
    });
  }
  function ogretmenAc() {
    const ortu = document.createElement("div");
    ortu.className = "sf-ortu";
    ortu.innerHTML = `<form class="sf-kutu og-kutu" role="dialog" aria-label="Öğretmen modu" novalidate>
        <h2>Öğretmen modu</h2>
        <p data-aciklama>E-posta adresinizi yazın, size bir giriş kodu gönderelim.</p>
        <input class="og-girdi" type="email" name="eposta" autocomplete="email" inputmode="email" placeholder="ornek@okul.k12.tr" required>
        <input class="og-girdi og-kod" type="text" name="kod" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="••••••••" hidden>
        <p class="og-hata" role="alert" hidden></p>
        <div class="kt-satir"><button class="dugme" type="button" data-vazgec>Vazgeç</button><button class="dugme og-ana" type="submit">Kod gönder</button></div>
      </form>`;
    document.body.appendChild(ortu);
    const form = ortu.querySelector("form"), eposta = form.eposta, kod = form.kod, hata = form.querySelector(".og-hata"), ana = form.querySelector(".og-ana"), aciklama = form.querySelector("[data-aciklama]");
    let asama = "eposta";
    const hataYaz = (m) => { hata.textContent = m; hata.hidden = !m; };
    const kapat = () => ortu.remove();
    ortu.addEventListener("click", (e) => { if (e.target === ortu || e.target.closest("[data-vazgec]")) kapat(); });
    eposta.focus();
    form.onsubmit = async (e) => {
      e.preventDefault(); hataYaz("");
      ana.disabled = true;
      const adres = eposta.value.trim();
      if (asama === "eposta" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(adres)) { hataYaz("Geçerli bir e-posta adresi yazın."); ana.disabled = false; return; }
      if (asama === "kod" && !/^\d{6,10}$/.test(kod.value.replace(/\s/g, ""))) { hataYaz("E-postadaki kodu yazın."); ana.disabled = false; return; }
      try {
        const sb = await supabaseYukle();
        if (asama === "eposta") {
          const { error } = await sb.auth.signInWithOtp({ email: adres, options: { shouldCreateUser: true } });
          if (error) { hataYaz(/not.authorized/i.test(error.message + error.code) ? "Bu adrese şu an kod gönderilemiyor. Site yöneticisine haber verin." : /fetch|network/i.test(error.message) ? "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin." : /rate|seconds|limit/i.test(error.message) ? "Çok sık kod istendi. Biraz bekleyip yeniden deneyin." : "Kod gönderilemedi: " + error.message); return; }
          asama = "kod"; eposta.readOnly = true; kod.hidden = false; kod.focus();
          aciklama.textContent = `${adres} adresine gelen kodu yazın. Gelen kutusunda yoksa istenmeyen klasörüne bakın.`;
          ana.textContent = "Doğrula";
        } else {
          const { error } = await sb.auth.verifyOtp({ email: eposta.value.trim(), token: kod.value.replace(/\s/g, ""), type: "email" });
          if (error) { hataYaz("Kod doğru değil ya da süresi dolmuş."); return; }
          kayit.yaz("ogretmen", { eposta: eposta.value.trim(), an: Date.now() });
          ses.yerlesti();
          form.innerHTML = `<h2>Öğretmen modu açıldı</h2><p>Bu cihazda bütün bölümler açık. Oyunlarda ${IKON.cevap.replace("<svg", '<svg width="18" height="18" style="vertical-align:-3px"')} düğmesiyle cevabı görebilirsiniz.</p><button class="dugme" type="button" data-vazgec>Tamam</button>`;
          anaokuluSayfa();
        }
      } catch (err) { hataYaz("Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin."); }
      finally { ana.disabled = false; }
    };
  }
  async function ogretmenKapat() {
    try { localStorage.removeItem("mk:ogretmen"); } catch (e) {}
    try { const sb = await supabaseYukle(); await sb.auth.signOut(); } catch (e) {}
    anaokuluSayfa();
  }

  // Bütün ilerlemeyi silmeden önce yetişkin onayı: resimdeki 4 rakamı tuşla
  function sifirlaSor() {
    const kod = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
    const resim = `<svg class="sf-resim" viewBox="0 0 240 90" aria-hidden="true"><rect width="240" height="90" rx="16" fill="#fff4c9"/>${[...Array(14)].map(() => `<circle cx="${Math.random() * 240}" cy="${Math.random() * 90}" r="${2 + Math.random() * 5}" fill="#ffd34d" opacity=".6"/>`).join("")}<path d="M10 ${30 + Math.random() * 30} Q120 ${Math.random() * 90} 230 ${30 + Math.random() * 30}" stroke="#e3a008" stroke-width="2" fill="none" opacity=".5"/>${[...kod].map((r, i) => `<text x="${42 + i * 52}" y="${62 + (Math.random() * 10 - 5)}" transform="rotate(${Math.random() * 24 - 12} ${42 + i * 52} 50)" text-anchor="middle" font-size="46" font-weight="900" font-family="var(--f-baslik)" fill="${["#ff5a4e", "#2f86e0", "#2fb36a", "#8a5cf0"][i]}">${r}</text>`).join("")}</svg>`;
    const ortu = document.createElement("div");
    ortu.className = "sf-ortu";
    ortu.innerHTML = `<div class="sf-kutu" role="dialog" aria-label="Tüm oyunları sıfırla">
        <h2>Tüm oyunlar sıfırlansın mı?</h2>
        <p>Bütün oyunlardaki ilerleme silinir. Onaylamak için resimdeki 4 rakamı yazın.</p>
        ${resim}
        <div class="sf-giris" aria-live="polite">${"<span></span>".repeat(4)}</div>
        <div class="sf-tuslar">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "sil", 0, "tamam"].map((t) => `<button type="button" data-t="${t}" class="${typeof t === "number" ? "" : "sf-" + t}" aria-label="${t === "sil" ? "Sil" : t === "tamam" ? "Vazgeç" : t}">${t === "sil" ? "⌫" : t === "tamam" ? "✕" : t}</button>`).join("")}</div>
      </div>`;
    document.body.appendChild(ortu);
    let yazilan = "";
    const goster = () => ortu.querySelectorAll(".sf-giris span").forEach((e, i) => (e.textContent = yazilan[i] || ""));
    const kapat = () => ortu.remove();
    ortu.addEventListener("click", (e) => {
      if (e.target === ortu) return kapat();
      const b = e.target.closest("[data-t]"); if (!b) return;
      const t = b.dataset.t;
      if (t === "tamam") return kapat();
      if (t === "sil") yazilan = yazilan.slice(0, -1);
      else if (yazilan.length < 4) yazilan += t;
      ses.tik(); goster();
      if (yazilan.length === 4) {
        if (yazilan === kod) {
          try { Object.keys(localStorage).filter((k) => k.startsWith("mk:") && k !== "mk:ses" && k !== "mk:ogretmen").forEach((k) => localStorage.removeItem(k)); } catch (e) {}
          ortu.querySelector(".sf-kutu").innerHTML = `<h2>Sıfırlandı</h2><p>Bütün oyunlar ilk bölümden başlayacak.</p><button class="dugme" type="button" data-t="tamam">Tamam</button>`;
          ses.yerlesti();
        } else {
          ses.hata(); const g = ortu.querySelector(".sf-giris"); g.classList.add("yanlis");
          setTimeout(() => { yazilan = ""; goster(); g.classList.remove("yanlis"); }, 600);
        }
      }
    });
  }

  function kategoriSayfa(id) {
    const kat = KATEGORILER.find((k) => k.id === id);
    if (!kat) { location.hash = "anaokulu"; return; }
    document.body.classList.remove("oyunda");
    document.title = `${kat.ad} · Minik Kodcular`;
    const kart = (no, sira) => {
      const h = HAFTALAR[no - 1], o = oyunlar[no];
      if (!o) return "";
      const ilerleme = o.ilerleme ? o.ilerleme() : null;
      return `<a class="kart acik" style="--renk:${kat.renk}" href="#hafta-${no}" aria-label="${sira}. oyun: ${h.ad}. Oyna">
        <div class="no">${sira}<small>. oyun</small></div>${o.kapak ? o.kapak() : ""}<div class="ad">${h.ad}</div>
        ${ilerleme ? `<div class="cubuk" title="${ilerleme.yapilan}/${ilerleme.toplam}"><b style="width:${(ilerleme.yapilan / ilerleme.toplam) * 100}%"></b></div>` : ""}
        <div class="durum">${IKON.oynat.replace("<svg", '<svg width="16" height="16"')} ${ilerleme ? `Oyna · ${ilerleme.yapilan}/${ilerleme.toplam}` : "Oyna"}</div></a>`;
    };
    const hazir = kat.oyunlar.filter((n) => n && oyunlar[n]);
    const bos = (sira) => `<div class="kart kilitli" style="--renk:${kat.renk}" aria-label="${sira}. oyun, yakında">
        <div class="no">${sira}<small>. oyun</small></div><div class="ad">Yeni oyun</div>
        <div class="durum">${IKON.kilit.replace("<svg", '<svg width="16" height="16"')} Yakında</div></div>`;
    kok().innerHTML = `${ustCubuk("#anaokulu", "Kategoriler")}
      <main class="ana">
        <section class="kategori-baslik" style="--renk:${kat.renk}">
          <div class="resim">${kat.resim}</div>
          <div><div class="kademe-etiket">Anaokulu</div><h1>${kat.ad}</h1><p>${kat.alt} · ${hazir.length}/${KATEGORI_YER} oyun hazır</p></div>
        </section>
        <section class="donem" aria-label="Oyunlar">
          <div class="izgara">${Array.from({ length: KATEGORI_YER }, (_, j) => { const no = kat.oyunlar[j]; return no && oyunlar[no] ? kart(no, j + 1) : bos(j + 1); }).join("")}</div>
        </section>
      </main>`;
    tamEkranDugmeleriniGuncelle();
    kok().querySelector("[data-tam-ekran]").onclick = tamEkranDegistir;
  }

  // ---------- Oyun ekranı ----------
  function oyunEkrani(no) {
    const h = HAFTALAR[no - 1], o = oyunlar[no];
    if (!h || !o) { location.hash = "anaokulu"; return; }
    aktifNo = no;
    document.body.classList.add("oyunda");
    document.title = `${h.ad} · Minik Kodcular`;
    kok().innerHTML = `
      <div class="oyun-ekrani">
        <header class="ust">
          <a class="dugme kare" href="#${kategoriAdresi(no)}" aria-label="Oyunlar">${IKON.ev}</a>
          <div class="oyun-basligi"><b>${h.ad}</b></div>
          <span class="ust-bosluk"></span>
          <div class="oyun-araclari" style="display:flex;gap:10px"></div>
          ${ogretmenMi() ? `<button class="dugme kare cevap-dugme" data-cevap type="button" aria-label="Cevabı göster">${IKON.cevap}</button>` : ""}
          <button class="dugme kare" data-nasil type="button" aria-label="Nasıl oynanır">${IKON.el}</button>
          <button class="dugme kare" data-ses type="button"></button>
          <button class="dugme" data-tam-ekran type="button"></button>
        </header>
        <div class="oyun-alani"></div>
      </div>`;
    const sesDugme = kok().querySelector("[data-ses]");
    const sesGuncelle = () => { sesDugme.innerHTML = sesAcik ? IKON.sesAcik : IKON.sesKapali; sesDugme.setAttribute("aria-label", sesAcik ? "Sesi kapat" : "Sesi aç"); };
    sesDugme.onclick = () => { sesAcik = !sesAcik; kayit.yaz("ses", sesAcik); sesGuncelle(); ses.tik(); if (!sesAcik) sus(); };
    sesGuncelle();
    tamEkranDugmeleriniGuncelle();
    kok().querySelector("[data-tam-ekran]").onclick = tamEkranDegistir;
    aktifOyun = o;
    sonBolum = null;
    o.baslat(kok().querySelector(".oyun-alani"), {
      ses, kayit, IKON, bolumNoktalari, kutla,
      araclar: kok().querySelector(".oyun-araclari"),
      anaSayfa: () => { location.hash = kategoriAdresi(no); },
    });
    const ipDugme = kok().querySelector("[data-nasil]");
    if (!o.ipucu) ipDugme.hidden = true;
    else {
      ipDugme.onclick = () => ipucuGoster(o);
      const cvp = kok().querySelector("[data-cevap]");
      if (cvp) cvp.onclick = () => ipucuGoster(o, true);
      // İlk açılışta gösterimi kendiliğinden oynat
      if (!kayit.oku("ipucu:" + no, false)) { kayit.yaz("ipucu:" + no, true); ipucuZamanla = setTimeout(() => ipucuGoster(o), 900); }
    }
  }

  // ---------- Nasıl oynanır: el gösterimi ----------
  // Oyun ipucu() ile adımlar verir: { el, hedef?, kez? }. hedef varsa el, el'i hedefe sürükler;
  // yoksa el'e dokunur (kez kadar). hedef bir öğe ya da { x, y } ekran noktası olabilir.
  // Gösterim yalnızca bir canlandırmadır, oyuna dokunmaz. Ekrana dokununca kapanır.
  let ipucuZamanla = null, ipucuTur = 0;
  const elSvg = `<svg viewBox="0 0 64 72" aria-hidden="true"><path d="M20 30V9a6 6 0 0 1 12 0v17h2v-5a6 6 0 0 1 12 0v6h2v-3a6 6 0 0 1 12 0v18c0 15-10 26-24 26h-4c-6 0-11-3-15-8L4 46a6 6 0 0 1 9-7.5l7 6.5z" fill="#ffd6b0" stroke="#5a3d2b" stroke-width="3.5" stroke-linejoin="round"/><path d="M32 40v12M46 40v12" stroke="#d9a77a" stroke-width="3" stroke-linecap="round"/></svg>`;
  const merkez = (h) => { if (!h) return null; if (h.x != null) return h; const r = h.getBoundingClientRect(); return r.width ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; };
  function ipucuKapat() {
    clearTimeout(ipucuZamanla); ipucuTur++;
    document.querySelectorAll(".ip-ortu").forEach((e) => e.remove());
  }
  // Sesli yönerge: el gösterimiyle birlikte oyunun ne istediğini Türkçe anlatır (ses açıksa)
  const YONERGE = {
    1: "Parçaları sürükle, resmi tamamla.",
    2: "Kartları doğru sıraya diz, sonra çalıştır düğmesine bas.",
    3: "Boncukların sırasına bak. Boşluğa hangi boncuk gelir? Doğru boncuğu yerine koy.",
    4: "Nesneleri büyüklüklerine göre sırayla raflara diz.",
    5: "Her resmi kendi gölgesinin üstüne götür.",
    6: "Her nesneyi doğru sepete koy.",
    7: "Şekilleri kesik çizgili yerlerine koy, resmi tamamla.",
    8: "Resimleri olduğu sıraya göre diz. Önce ne olur, sonra ne olur?",
    9: "Renklerin sırasını bul. Kovadan renk seç ve boş yerleri boya.",
    10: "Robotu dikkatlice izle ve hareketleri aklında tut. Sonra aynı dansı kartlarla kendi robotuna yaptır.",
    40: "Büyüteçteki küçük parçaya dikkatle bak. Bu parça hangi resimde? Bulup ona dokun.",
    41: "Resimde bir parça eksik. Aşağıdaki parçalardan doğru olanı bulup ona dokun.",
    42: "Resmin kareleri dönmüş. Karelere dokunarak çevir, resmi düzelt.",
    43: "Resmin yarısı boyalı. Rengi seç ve öbür yarıyı aynısı gibi boya.",
    39: "Uğur böceğini yaprağa götür. Ok kartına dokun, böcek o yöne gider. Sonraki bölümlerde önce kartları sırayla diz, sonra başla düğmesine bas.",
    11: "Boş karelere ray koy. Treni istasyona götürecek yolu kur, sonra hareket düğmesine bas.",
    12: "Borulara dokunarak çevir. Su bütün çiçeklere ulaşsın, sonra suyu aç.",
    13: "Siparişe bak. Malzemeleri tabağa alttan üste doğru sırayla koy, sonra zile bas.",
    14: "Hayvanların şarkı söyleme sırasını dinle. Sonra aynı sırayla hayvanlara dokun.",
    15: "Parçaları kalıptaki yerlerine sürükle. Parçaya dokunursan döner.",
    16: "Ok kartlarını sıraya diz. Arıyı çiçeğe götür, sonra çalıştır düğmesine bas.",
    17: "Ok kartlarıyla tavşana bütün havuçları topla, sonra onu yuvasına götür.",
    18: "Otobüsü okula götür. Işık kırmızıysa bekle kartını koy.",
    19: "Roketi yıldızları toplayarak gezegene götür. Tekrar kartıyla aynı hareketi birkaç kere yaptırabilirsin.",
    20: "Fırçayı yürüt, kovadan renk al. Tuvali örnek resmin aynısı yap.",
    21: "Fırçayı halkalara götür ve halkanın rengindeki kartla boya.",
    22: "Ahtapotu camların üstünden yürüt. Bütün altınları topla ve sandığa git.",
    23: "Halkaları çubuklar arasında taşıyarak resimdeki kuleyi kur. Büyük halka küçüğün üstüne konamaz.",
    24: "Her satırın şifresine bak. Rengi seç ve karelere dokunarak gizli resmi ortaya çıkar.",
    25: "Arıyı çiçeğe götüren programı bul ve ona dokun.",
    26: "Makineye ne girip ne çıktığına bak. Yeni eşya girince ne çıkacağını seç.",
    27: "Kaplumbağa yürüdüğü yere çizgi çizer. Silik resmi çizdirecek okları diz, sonra çiz düğmesine bas.",
    29: "Kavşaklara kartları koy. Her mektup doğru eve gitsin.",
    30: "Makas düğmelerine dokunarak yolları değiştir. Her tren kendi rengindeki istasyona gitsin, sonra başlat düğmesine bas.",
    31: "Kamyonetin baktığı yöne dikkat et. İleri, sağa dön ve sola dön kartlarıyla paketleri evlere götür.",
    32: "Programda bir hata var. Önce çalıştır, sonra yanlış çiçeğe dokunup doğrusunu koy.",
    33: "Resimleri robotun sepetlerine ayırarak robota öğret. Sonra robotu sına.",
    34: "Robotun önü gözlerinin olduğu taraf. Kartlarla robotu yürüt ve bütün tozları süpür.",
    35: "Tavşan yürüdüğü yere çizgi çizer. Kalem kartıyla rengi değiştir, resmi aynı renklerle çiz.",
    38: "Tilkiyi patikadan üzüm sepetine götür. Ok kartları bir taş yürütür. Kayada zıpla, gölde yüz, dalın altından eğil kartını kullan.",
    37: "Üstteki resimlere bak. Hangi hayvana dokununca ne olacağını kartlarla öğret, sonra oyna düğmesine bas.",
  };
  let sesler = [];
  try { const yukle = () => (sesler = speechSynthesis.getVoices()); yukle(); speechSynthesis.onvoiceschanged = yukle; } catch (e) {}
  let sonSoz = { metin: null, an: 0 };
  function konus(metin) {
    try {
      // Aynı yönerge az önce başladıysa (ilk açılıştaki el gösterimi gibi) yarıda kesip baştan okuma
      if (metin && sonSoz.metin === metin && Date.now() - sonSoz.an < 4000 && speechSynthesis.speaking) return;
      speechSynthesis.cancel();
      if (!sesAcik || !metin) return;
      sonSoz = { metin, an: Date.now() };
      const u = new SpeechSynthesisUtterance(metin);
      u.lang = "tr-TR"; u.rate = 0.92; u.pitch = 1.1;
      const tr = sesler.find((v) => /^tr/i.test(v.lang));
      if (tr) u.voice = tr;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function sus() { try { speechSynthesis.cancel(); } catch (e) {} }

  async function ipucuGoster(o, tam = false) {
    ipucuKapat();
    konus(YONERGE[aktifNo]);
    const tur = ipucuTur, bekle = (ms) => new Promise((r) => setTimeout(r, ms));
    let adimlar = [];
    try { adimlar = (o.ipucu(tam) || []).filter((a) => a && merkez(a.el)); } catch (e) { adimlar = []; }
    if (!adimlar.length) return;
    const ortu = document.createElement("div");
    ortu.className = "ip-ortu";
    ortu.innerHTML = `<div class="ip-halka"></div><div class="ip-el">${elSvg}</div>`;
    document.body.appendChild(ortu);
    ortu.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); });
    ortu.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); ipucuKapat(); });
    const el = ortu.querySelector(".ip-el"), halka = ortu.querySelector(".ip-halka");
    const git = (p, ms = 600) => { el.style.transition = `transform ${ms}ms cubic-bezier(.4,0,.2,1)`; el.style.transform = `translate(${p.x}px, ${p.y}px)`; };
    const halkaGoster = (p) => { halka.style.left = p.x + "px"; halka.style.top = p.y + "px"; halka.classList.remove("on"); void halka.offsetWidth; halka.classList.add("on"); };
    const ilk = merkez(adimlar[0].el);
    el.style.transform = `translate(${ilk.x + 80}px, ${ilk.y + 120}px)`;
    await bekle(60);
    for (let dongu = 0; dongu < 2; dongu++) {
      for (const a of adimlar) {
        const p = merkez(a.el); if (!p) continue;
        git(p); await bekle(700); if (tur !== ipucuTur) return;
        if (a.hedef) {
          const h = merkez(a.hedef); if (!h) continue;
          el.classList.add("bas"); halkaGoster(p); await bekle(250);
          let hayalet = null;
          if (a.el instanceof HTMLElement) {
            const r = a.el.getBoundingClientRect();
            hayalet = a.el.cloneNode(true);
            hayalet.className = "ip-hayalet " + a.el.className;
            Object.assign(hayalet.style, { width: r.width + "px", height: r.height + "px", left: p.x - r.width / 2 + "px", top: p.y - r.height / 2 + "px" });
            ortu.insertBefore(hayalet, el);
            hayalet.style.transform = "none";
            hayalet.style.transition = "transform 900ms cubic-bezier(.4,0,.2,1)";
          }
          if (tur !== ipucuTur) return;
          git(h, 900); if (hayalet) { void hayalet.offsetWidth; hayalet.style.transform = `translate(${h.x - p.x}px, ${h.y - p.y}px) scale(.9)`; }
          await bekle(950); if (tur !== ipucuTur) return;
          el.classList.remove("bas"); halkaGoster(h);
          await bekle(350); if (hayalet) hayalet.remove();
        } else {
          for (let k = 0; k < (a.kez || 1); k++) {
            el.classList.add("bas"); halkaGoster(p); await bekle(260);
            el.classList.remove("bas"); await bekle(260);
            if (tur !== ipucuTur) return;
          }
        }
        await bekle(250); if (tur !== ipucuTur) return;
      }
      await bekle(500); if (tur !== ipucuTur) return;
    }
    ipucuKapat();
  }

  function yonlendir() {
    ipucuKapat(); sus();
    if (aktifOyun && aktifOyun.bitir) aktifOyun.bitir();
    aktifOyun = null;
    const m = location.hash.match(/^#hafta-(\d+)$/);
    if (m) oyunEkrani(+m[1]);
    else if (location.hash === "#anaokulu") anaokuluSayfa();
    else if (location.hash.startsWith("#anaokulu/")) kategoriSayfa(location.hash.slice(10));
    else if (KADEMELER.some((k) => "#" + k.id === location.hash)) yakindaSayfa(location.hash.slice(1));
    else anaSayfa();
    window.scrollTo(0, 0);
  }

  window.Uygulama = {
    oyunEkle(no, oyun) { oyunlar[no] = oyun; },
    // Bütün oyunlarda 30 bölüm aynı düzende: 3 çok kolay, 3 kolay, 6 orta, 6 zor, 12 çok zor
    seviye(i) { return i < 3 ? "Çok kolay" : i < 6 ? "Kolay" : i < 12 ? "Orta" : i < 18 ? "Zor" : "Çok zor"; },
    baslat() { window.addEventListener("hashchange", yonlendir); yonlendir(); },
  };
})();
