/* 5. Hafta: Gölge Eşleştir (parça-bütün: biçimi tanıma).
   Renkli nesneyi kendi gölgesine götür. 20 bölüm: 3, 4, 5 ve 6 nesne;
   son bölümlerde fazladan (eşi olmayan) gölgeler ve birbirine benzeyen biçimler var. */
(function () {
  const KAYIT = "golge";

  // Sürüklenen öğenin yerini korur; yoksa liste kısalır ve hedefler kayar
  function yerTut(el) {
    const r = el.getBoundingClientRect();
    const t = document.createElement("div");
    t.style.cssText = `width:${r.width}px;height:${r.height}px;flex:none;visibility:hidden`;
    el.before(t);
    el._yerTutucu = t;
  }
  function yerBirak(el) { if (el._yerTutucu) { el._yerTutucu.remove(); el._yerTutucu = null; } }


  // [nesneler, fazladan gölgeler]
  const BOLUMLER = [
    [["elma", "ayi", "ev"]], [["kedi", "araba", "agac"]], [["balik", "sapka", "top"]],
    [["kelebek", "gemi", "civciv"]], [["muz", "fil", "semsiye"]], [["havuc", "tavsan", "ucak"]],
    [["armut", "tavsan", "ucak", "saksi"]], [["cilek", "kus", "otobus", "kardan"]], [["uzum", "kaplumbaga", "roket", "tisort"]], [["havuc", "matruska", "bot", "ucurtma"]], [["misir", "hediye", "corap", "brokoli"]], [["patlican", "kedi", "gemi", "kup"]],
    [["elma", "portakal", "armut", "cilek", "muz"]], [["kedi", "tavsan", "ayi", "kus", "civciv"]], [["araba", "otobus", "gemi", "ucak", "roket"]], [["tisort", "corap", "sapka", "bot", "semsiye"]], [["agac", "brokoli", "saksi", "havuc", "misir"]], [["patlican", "biber", "misir", "havuc", "brokoli"]],
    [["elma", "armut", "portakal", "cilek", "uzum", "muz"], ["karpuz"]],
    [["kedi", "tavsan", "fil", "kaplumbaga", "balik", "kus"], ["kelebek"]],
    [["araba", "otobus", "gemi", "ucak", "roket", "ucurtma"], ["kup"]],
    [["kus", "civciv", "tavsan", "kedi", "ayi", "fil"], ["kaplumbaga"]],
    [["muz", "patlican", "biber", "havuc", "misir", "armut"], ["cilek"]],
    [["top", "portakal", "elma", "karpuz", "cilek", "uzum"], ["kelebek"]],
    [["ayi", "matruska", "kardan", "civciv", "ev", "hediye"], ["agac", "saksi"]],
    [["semsiye", "sapka", "tisort", "corap", "bot", "kup"], ["top", "araba"]],
    [["ucak", "roket", "ucurtma", "kelebek", "kus", "semsiye"], ["gemi", "balik"]],
    [["ev", "hediye", "kup", "otobus", "araba", "saksi"], ["agac", "matruska"]],
    [["tisort", "corap", "bot", "sapka", "semsiye", "hediye"], ["kup", "top"]],
    [["balik", "kaplumbaga", "kedi", "tavsan", "fil", "kus"], ["civciv", "ayi"]],
  ].map(([nesneler, fazla = []], i) => ({ nesneler, fazla, n: nesneler.length, grup: Uygulama.seviye(i) }));

  const stil = `
  .ge { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--kirmizi); }
  .ge-sahne { --k: 120px; --ara: 16px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 8px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .ge-baslik { margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.25rem, 3.2vw, 1.8rem); line-height: 1; text-align: center; }
  .ge-tahta { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--ara); padding: 18px; border-radius: 28px; background: var(--kagit); box-shadow: 0 8px 0 rgba(29,40,70,.1); max-width: 100%; box-sizing: border-box; }
  .ge-golge { position: relative; width: var(--k); height: var(--k); border-radius: 20px; background: #eef4fa; display: grid; place-items: center; transition: transform .15s, background .2s; }
  .ge-golge > img { width: 82%; height: 82%; filter: brightness(0); opacity: .72; pointer-events: none; -webkit-user-drag: none; }
  .ge-golge.hedef { background: #d4e8ff; transform: scale(1.06); }
  .ge-golge.dolu { background: #e3f6ea; }
  .ge-golge.dolu > img { display: none; }
  .ge-golge.salla { animation: ge-salla .45s; background: #ffe3e0; }
  .ge-golge .ge-nesne { position: absolute; inset: 9%; width: auto; height: auto; box-shadow: none; background: none; cursor: default; animation: ge-otur .4s cubic-bezier(.3,1.6,.5,1); }
  .ge-kutu { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--ara); padding: 12px 18px; border-radius: 26px; border: 3px dashed var(--cizgi); background: var(--zemin-2); min-height: calc(var(--k) + 24px); max-width: 100%; box-sizing: border-box; }
  .ge-kutu:empty::before { content: "Hepsi eşleşti!"; align-self: center; color: var(--murekkep-2); font-weight: 800; opacity: .6; }
  .ge-nesne { width: var(--k); height: var(--k); flex: none; border-radius: 20px; background: var(--kagit); box-shadow: 0 5px 0 rgba(29,40,70,.14); display: grid; place-items: center; cursor: grab; touch-action: none; transition: transform .15s; }
  .ge-nesne img { width: 82%; height: 82%; pointer-events: none; -webkit-user-drag: none; }
  .ge-nesne.secili { transform: translateY(-8px) scale(1.06); outline: 5px solid var(--mavi); outline-offset: 2px; }
  .ge-nesne.surukleniyor { position: fixed; z-index: 50; cursor: grabbing; transform: scale(1.08) rotate(-4deg); pointer-events: none; transition: none; box-shadow: 0 14px 18px rgba(29,40,70,.28); }
  .ge-nesne.salla { animation: ge-salla .45s; }
  @keyframes ge-salla { 20%, 60% { transform: translateX(-9px); } 40%, 80% { transform: translateX(9px); } }
  @keyframes ge-otur { from { transform: scale(1.4); } }
  `;

  let d = null;
  const karistir = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

  function baslat(alan, api) {
    if (!document.getElementById("ge-stil")) {
      const st = document.createElement("style"); st.id = "ge-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ge"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ge-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ge-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
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
    d.idx = i; d.uid++; d.secili = null;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const golgeler = karistir([...b.nesneler, ...b.fazla]);
    let nesneler;
    do { nesneler = karistir(b.nesneler); } while (b.n > 2 && nesneler.every((v, j) => v === golgeler[j]));
    d.sahne.innerHTML = `
      <h2 class="ge-baslik">Her resmi kendi gölgesine götür</h2>
      <div class="ge-tahta">${golgeler.map((id) => `<div class="ge-golge" data-id="${id}" role="button" tabindex="0" aria-label="${NESNELER[id].ad} gölgesi"><img src="${NESNELER[id].src}" alt=""></div>`).join("")}</div>
      <div class="ge-kutu" aria-label="Resimler">${nesneler.map((id) => `<div class="ge-nesne" data-id="${id}" role="button" tabindex="0" aria-label="${NESNELER[id].ad}"><img src="${NESNELER[id].src}" alt=""></div>`).join("")}</div>`;
    d.tahta = d.sahne.querySelector(".ge-tahta");
    d.kutu = d.sahne.querySelector(".ge-kutu");
    d.sahne.querySelectorAll(".ge-nesne").forEach(surukle);
    d.tahta.querySelectorAll(".ge-golge").forEach((g) => {
      const sec = () => { if (d.secili && !g.classList.contains("dolu")) dene(d.secili, g); };
      g.addEventListener("click", sec);
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(); } });
    });
    boyutla();
  }

  // Gölgeler ve resimler aynı boyda; satır sayısını ekrana göre seç
  function boyutla() {
    if (!d || !d.tahta) return;
    const b = BOLUMLER[d.idx], gN = b.n + b.fazla.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    const ara = W < 500 ? 10 : 16;
    let en = 0;
    // Satırlar dengeli olsun: 8 gölge 7+1 değil 4+4 dizilsin
    for (let satirG = 1; satirG <= 4; satirG++) {
      const sutun = Math.ceil(gN / satirG), satirN = Math.ceil(b.n / Math.min(sutun, b.n));
      const kG = (W - 40 - (sutun - 1) * ara) / sutun;
      const kH = (H - 50 - 60 - 30 - (satirG + satirN) * ara) / (satirG + satirN);
      const k = Math.min(kG, kH, 150);
      if (k > en) { en = k; d.enSutun = sutun; }
    }
    d.sahne.style.setProperty("--k", Math.max(48, Math.floor(en)) + "px");
    d.tahta.style.maxWidth = `calc(${d.enSutun} * (var(--k) + var(--ara)) + 36px)`;
    d.sahne.style.setProperty("--ara", ara + "px");
  }

  function secimiTemizle() {
    if (d.secili) d.secili.classList.remove("secili");
    d.secili = null;
  }

  function dene(nesne, golge) {
    secimiTemizle();
    if (nesne.dataset.id === golge.dataset.id) {
      golge.classList.add("dolu");
      golge.appendChild(nesne);
      nesne.setAttribute("tabindex", "-1");
      d.api.ses.yerlesti();
      if (!d.kutu.querySelector(".ge-nesne")) bitir();
    } else {
      [nesne, golge].forEach((el) => { el.classList.remove("salla"); void el.offsetWidth; el.classList.add("salla"); });
      setTimeout(() => { nesne.classList.remove("salla"); golge.classList.remove("salla"); }, 500);
      d.api.ses.hata();
    }
  }

  // Sürükle ya da dokun: dokunulan resim seçilir, sonra gölgeye dokunulur
  function surukle(nesne) {
    let bx, by, kx, ky, aktif = false, hareket = false, hedef = null;
    const yerinde = () => nesne.parentElement.classList.contains("ge-golge");
    nesne.addEventListener("pointerdown", (e) => {
      if (yerinde()) return;
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
      if (!hareket) { hareket = true; secimiTemizle(); yerTut(nesne); nesne.classList.add("surukleniyor"); nesne.style.width = nesne.style.height = nesne.dataset.w + "px"; }
      nesne.style.left = e.clientX - kx + "px";
      nesne.style.top = e.clientY - ky + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const g = alt && alt.closest(".ge-golge:not(.dolu)");
      if (hedef && hedef !== g) hedef.classList.remove("hedef");
      hedef = g; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (hareket) {
        nesne.classList.remove("surukleniyor");
        nesne.style.left = nesne.style.top = nesne.style.width = nesne.style.height = ""; yerBirak(nesne);
        if (hedef) { hedef.classList.remove("hedef"); dene(nesne, hedef); }
        hedef = null;
      } else sec();
    };
    const sec = () => {
      if (yerinde()) return;
      const ayni = d.secili === nesne;
      secimiTemizle();
      if (!ayni) { d.secili = nesne; nesne.classList.add("secili"); d.api.ses.tik(); }
    };
    nesne.addEventListener("pointerup", birak);
    nesne.addEventListener("pointercancel", birak);
    nesne.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(); } });
  }

  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    const benim = d.uid;
    setTimeout(() => {
      if (!d || benim !== d.uid) return;
      navCiz();
      const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
      d.api.kutla(d.sahne, {
        mesaj: son ? (herkes ? "Bütün gölgeleri buldun!" : "Son gölgeler de tamam!") : "Bütün gölgeleri buldun!",
        son,
        ileri: () => yukle(d.idx + 1),
        bastan: () => { d.ilerleme.bitti = []; yukle(0); },
      });
    }, 500);
  }

  window.GOLGE_BOLUMLER = BOLUMLER; // test için

  window.Uygulama.oyunEkle(5, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      const n = d.sahne.querySelector(".ge-kutu .ge-nesne");
      return n ? [{ el: n, hedef: d.sahne.querySelector(`.ge-golge[data-id="${n.dataset.id}"]`) }] : [];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const s = NESNELER.kedi.src;
      return `<div class="mini mini-golge" aria-hidden="true"><img src="${s}" alt=""><img src="${s}" alt="" class="gl"></div>`;
    },
  });
})();
