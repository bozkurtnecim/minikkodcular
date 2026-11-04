/* 4. Hafta: Büyükten Küçüğe (büyüklük sıralaması).
   20 bölüm: 3 nesne (5), 4 nesne (5), 5 nesne (5), 6 nesne (5).
   Bölümler sırayla "küçükten büyüğe" ve "büyükten küçüğe" ister.
   Bütün raflar dolunca kendiliğinden kontrol edilir; yanlış olanlar geri döner. */
(function () {
  const KAYIT = "buyukluk";

  // Sürüklenen öğenin yerini korur; yoksa liste kısalır ve hedefler kayar
  function yerTut(el) {
    const r = el.getBoundingClientRect();
    const t = document.createElement("div");
    t.style.cssText = `width:${r.width}px;height:${r.height}px;flex:none;visibility:hidden`;
    el.before(t);
    el._yerTutucu = t;
  }
  function yerBirak(el) { if (el._yerTutucu) { el._yerTutucu.remove(); el._yerTutucu = null; } }


  // [nesne, adet, yön]: "kb" küçükten büyüğe, "bk" büyükten küçüğe
  // Kütüphanede çoğul adı olmayan nesneler için
  const COGUL = { kedi: "Kediler", balik: "Balıklar", armut: "Armutlar", tavsan: "Tavşanlar", fil: "Filler", roket: "Roketler", semsiye: "Şemsiyeler", cilek: "Çilekler", kup: "Küpler", kaplumbaga: "Kaplumbağalar" };
  const BOLUMLER = [
    ["ayi", 3, "kb"], ["elma", 3, "bk"], ["top", 3, "kb"], ["civciv", 3, "bk"], ["ev", 3, "kb"], ["kedi", 3, "bk"],
    ["matruska", 4, "bk"], ["agac", 4, "kb"], ["hediye", 4, "bk"], ["kardan", 4, "kb"], ["saksi", 4, "bk"], ["balik", 4, "kb"],
    ["ayi", 5, "bk"], ["elma", 5, "kb"], ["top", 5, "bk"], ["civciv", 5, "kb"], ["ev", 5, "bk"], ["armut", 5, "kb"],
    ["matruska", 6, "kb"], ["agac", 6, "bk"], ["hediye", 6, "kb"], ["kardan", 6, "bk"], ["saksi", 6, "kb"], ["tavsan", 6, "bk"],
    ["fil", 6, "kb"], ["roket", 6, "bk"], ["semsiye", 6, "kb"], ["cilek", 6, "bk"], ["kup", 6, "kb"], ["kaplumbaga", 6, "bk"],
  ].map(([nesne, n, yon], i) => ({ nesne, n, yon, ad: NESNELER[nesne].cogul || COGUL[nesne], src: NESNELER[nesne].src, grup: Uygulama.seviye(i) }));

  // n nesne için boyut oranları (en küçük → en büyük)
  const oranlar = (n) => Array.from({ length: n }, (_, i) => 0.38 + (0.62 * i) / (n - 1));

  const stil = `
  .bs { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--mavi); }
  .bs-sahne { --k: 130px; --ara: 14px; --ic: 22px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 8px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .bs-baslik { display: flex; align-items: center; gap: 12px; margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.25rem, 3.2vw, 1.8rem); line-height: 1; text-align: center; }
  .bs-baslik img { height: 1.5em; width: auto; }
  .bs-baslik .kucuk { height: .8em; }
  .bs-raf { position: relative; display: flex; gap: var(--ara); padding: 16px var(--ic) 0; border-radius: 26px 26px 0 0; background: var(--kagit); }
  .bs-raf::after { content: ""; position: absolute; left: -8px; right: -8px; bottom: -14px; height: 16px; border-radius: 6px; background: #c4935f; box-shadow: 0 6px 0 #a8774a; }
  .bs-yuva { position: relative; width: var(--k); height: var(--k); display: flex; align-items: flex-end; justify-content: center; border-radius: 16px 16px 0 0; background: repeating-linear-gradient(180deg, transparent 0 10px, rgba(188,217,242,.35) 10px 12px); outline: 3px dashed var(--cizgi); outline-offset: -3px; }
  .bs-yuva::before { content: attr(data-no); position: absolute; top: 4px; left: 4px; width: min(28px, calc(var(--k) * .42)); height: min(28px, calc(var(--k) * .42)); border-radius: 50%; display: grid; place-items: center; background: var(--mavi); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1rem; z-index: 2; }
  .bs-yuva.hedef { outline-color: var(--mavi); outline-style: solid; background: #d4e8ff; }
  .bs-yuva.dogru { outline-color: var(--yesil); outline-style: solid; }
  .bs-yuva.dogru::before { background: var(--yesil); content: "✓"; }
  .bs-merdiven { width: 100%; height: 28px; margin-top: 16px; }
  .bs-zemin { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-end; gap: var(--ara); min-height: calc(var(--k) + 20px); padding: 10px var(--ic); border-radius: 26px; border: 3px dashed var(--cizgi); background: var(--zemin-2); box-sizing: border-box; }
  .bs-zemin:empty::before { content: "Hepsi rafta!"; align-self: center; color: var(--murekkep-2); font-weight: 800; opacity: .6; }
  .bs-nesne { width: calc(var(--k) * var(--o)); height: calc(var(--k) * var(--o)); flex: none; cursor: grab; touch-action: none; transition: transform .15s; }
  .bs-nesne img { display: block; width: 100%; height: 100%; pointer-events: none; -webkit-user-drag: none; filter: drop-shadow(0 4px 0 rgba(29,40,70,.15)); }
  .bs-nesne.surukleniyor { position: fixed; z-index: 50; cursor: grabbing; transform: scale(1.06); pointer-events: none; transition: none; }
  .bs-nesne.salla { animation: bs-salla .5s; }
  .bs-nesne.zipla { animation: bs-zipla .45s; }
  .bs-yuva.dogru .bs-nesne { cursor: default; }
  @keyframes bs-salla { 20%, 60% { transform: translateX(-9px) rotate(-5deg); } 40%, 80% { transform: translateX(9px) rotate(5deg); } }
  @keyframes bs-zipla { 40% { transform: translateY(-16px); } }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("bs-stil")) {
      const st = document.createElement("style"); st.id = "bs-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="bs"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="bs-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".bs-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { if (d.kontrol) return; d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.kontrol = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const o = oranlar(b.n);
    // Yuva j'ye gelmesi gereken boyut sırası
    d.beklenen = b.yon === "kb" ? o.map((_, j) => j) : o.map((_, j) => b.n - 1 - j);
    let sira;
    do { sira = o.map((_, j) => j).sort(() => Math.random() - 0.5); }
    while (sira.every((v, j) => v === j) || sira.every((v, j) => v === b.n - 1 - j));
    const baslik = b.yon === "kb" ? "Küçükten büyüğe sırala" : "Büyükten küçüğe sırala";
    const ikonlar = b.yon === "kb"
      ? `<img class="kucuk" src="${b.src}" alt=""><img src="${b.src}" alt="">`
      : `<img src="${b.src}" alt=""><img class="kucuk" src="${b.src}" alt="">`;
    d.sahne.innerHTML = `
      <h2 class="bs-baslik">${b.yon === "kb" ? "" : ikonlar}<span>${baslik}</span>${b.yon === "kb" ? ikonlar : ""}</h2>
      <div><div class="bs-raf">${o.map((_, j) => `<div class="bs-yuva" data-no="${j + 1}" data-yuva="${j}"></div>`).join("")}</div>
      <svg class="bs-merdiven" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="${b.yon === "kb" ? "M0 10 L100 0 L100 10 Z" : "M0 0 L100 10 L0 10 Z"}" fill="#bcd9f2"/></svg></div>
      <div class="bs-zemin" aria-label="Nesneler">${sira.map((j) => `<div class="bs-nesne" data-boy="${j}" role="button" tabindex="0" aria-label="${b.ad} ${j + 1}. boy" style="--o:${o[j].toFixed(3)}"><img src="${b.src}" alt=""></div>`).join("")}</div>`;
    d.raf = d.sahne.querySelector(".bs-raf");
    d.zemin = d.sahne.querySelector(".bs-zemin");
    d.sahne.querySelectorAll(".bs-nesne").forEach(surukle);
    boyutla();
  }

  function boyutla() {
    if (!d || !d.raf) return;
    const n = BOLUMLER[d.idx].n;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    const dar = (W - 44 - (n - 1) * 14) / n < 90;
    const ara = dar ? 6 : 14, ic = dar ? 10 : 22;
    d.sahne.style.setProperty("--ara", ara + "px");
    d.sahne.style.setProperty("--ic", ic + "px");
    const kG = (W - ic * 2 - (n - 1) * ara) / n;
    // Başlık ~50, raf + merdiven ~k+60, zemin: dar ekranda iki satır olabilir
    const zeminSatir = kG < 90 ? 2 : 1;
    const kH = (H - 50 - 60 - 40 - 30) / (1 + zeminSatir * 0.9);
    const k = Math.max(40, Math.floor(Math.min(kG, kH, 180)));
    d.sahne.style.setProperty("--k", k + "px");
    d.zemin.style.width = d.raf.offsetWidth + "px";
  }

  function yerlestir(nesne, yuva) {
    const eski = nesne.parentElement;
    if (yuva) {
      const oradaki = yuva.querySelector(".bs-nesne");
      if (oradaki && oradaki !== nesne) (eski.classList.contains("bs-yuva") ? eski : d.zemin).appendChild(oradaki);
      yuva.appendChild(nesne);
    } else d.zemin.appendChild(nesne);
    d.api.ses.tik();
    const yuvalar = [...d.raf.querySelectorAll(".bs-yuva")];
    if (yuvalar.every((y) => y.querySelector(".bs-nesne"))) kontrolEt(yuvalar);
  }

  function surukle(nesne) {
    let bx, by, kx, ky, aktif = false, hareket = false, hedef = null;
    const kilitli = () => d.kontrol || nesne.closest(".bs-yuva.dogru");
    nesne.addEventListener("pointerdown", (e) => {
      if (kilitli()) return;
      e.preventDefault();
      aktif = true; hareket = false;
      const r = nesne.getBoundingClientRect();
      bx = e.clientX; by = e.clientY; kx = e.clientX - r.left; ky = e.clientY - r.top;
      nesne.dataset.w = r.width;
      nesne.setPointerCapture && nesne.setPointerCapture(e.pointerId);
    });
    nesne.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!hareket && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!hareket) { hareket = true; yerTut(nesne); nesne.classList.add("surukleniyor"); nesne.style.width = nesne.style.height = nesne.dataset.w + "px"; }
      nesne.style.left = e.clientX - kx + "px";
      nesne.style.top = e.clientY - ky + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const y = alt && alt.closest(".bs-yuva");
      if (hedef && hedef !== y) hedef.classList.remove("hedef");
      hedef = y && !y.classList.contains("dogru") ? y : null;
      if (hedef) hedef.classList.add("hedef");
    });
    const birak = (e) => {
      if (!aktif) return;
      aktif = false;
      if (hareket) {
        nesne.classList.remove("surukleniyor");
        nesne.style.left = nesne.style.top = nesne.style.width = nesne.style.height = ""; yerBirak(nesne);
        if (hedef) { hedef.classList.remove("hedef"); yerlestir(nesne, hedef); }
        else {
          const alt = document.elementFromPoint(e.clientX, e.clientY);
          if (alt && alt.closest(".bs-zemin") && nesne.parentElement.classList.contains("bs-yuva")) yerlestir(nesne, null);
        }
        hedef = null;
      } else dokun();
    };
    // Dokunma: yerdeki nesne ilk boş rafa çıkar, raftaki nesne yere iner
    const dokun = () => {
      if (kilitli()) return;
      if (nesne.parentElement.classList.contains("bs-yuva")) yerlestir(nesne, null);
      else {
        const bos = [...d.raf.querySelectorAll(".bs-yuva")].find((y) => !y.querySelector(".bs-nesne"));
        if (bos) yerlestir(nesne, bos);
      }
    };
    nesne.addEventListener("pointerup", birak);
    nesne.addEventListener("pointercancel", birak);
    nesne.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dokun(); } });
  }

  async function kontrolEt(yuvalar) {
    d.kontrol = true;
    const benim = d.uid;
    await bekle(250);
    let hata = false;
    for (let j = 0; j < yuvalar.length; j++) {
      const y = yuvalar[j], nesne = y.querySelector(".bs-nesne");
      if (y.classList.contains("dogru")) continue;
      if (+nesne.dataset.boy === d.beklenen[j]) {
        y.classList.add("dogru");
        nesne.classList.add("zipla");
        d.api.ses.adim(j);
        setTimeout(() => nesne.classList.remove("zipla"), 480);
      } else {
        hata = true;
        nesne.classList.add("salla");
      }
      await bekle(200);
      if (!d || benim !== d.uid) return;
    }
    if (hata) {
      d.api.ses.hata();
      await bekle(500);
      if (!d || benim !== d.uid) return;
      // Yanlışta bütün nesneler yere döner, çocuk baştan dizer
      yuvalar.forEach((y) => {
        const nesne = y.querySelector(".bs-nesne");
        y.classList.remove("dogru");
        if (nesne) { nesne.classList.remove("salla"); d.zemin.appendChild(nesne); }
      });
      d.kontrol = false;
      return;
    }
    await bekle(400);
    if (!d || benim !== d.uid) return;
    bitir();
  }

  function bitir() {
    d.kontrol = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün rafları düzenledin!" : "Son raf da tamam!") : `${BOLUMLER[d.idx].ad} sıraya girdi!`,
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.BUYUKLUK_BOLUMLER = BOLUMLER; // test için

  window.Uygulama.oyunEkle(4, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      const j = [...d.sahne.querySelectorAll(".bs-yuva")].findIndex((y) => !y.querySelector(".bs-nesne"));
      if (j < 0) return [];
      return [{ el: d.sahne.querySelector(`.bs-zemin .bs-nesne[data-boy="${d.beklenen[j]}"]`), hedef: d.sahne.querySelector(`.bs-yuva[data-yuva="${j}"]`) }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const src = BOLUMLER[0].src;
      return `<div class="mini mini-boy" aria-hidden="true">${[0.45, 0.7, 1].map((o) => `<img src="${src}" alt="" style="height:${Math.round(52 * o)}px">`).join("")}</div>`;
    },
  });
})();
