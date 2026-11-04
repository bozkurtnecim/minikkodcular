/* 8. Hafta: Günlük Rutinim (sıralama: günlük işlerin adımları).
   10 rutin, üç biçimde: 1–10 kısa sırala (3–4 kart), 11–20 eksik adımı bul
   (1 ya da 2 boşluk, şaşırtıcı kartlar), 21–30 rutinin tamamını sırala (4–6 kart).
   Kutular dolunca kendiliğinden kontrol edilir; yanlış kartlar desteye döner. */
(function () {
  const KAYIT = "rutin";

  function yerTut(el) {
    const r = el.getBoundingClientRect();
    const t = document.createElement("div");
    t.style.cssText = `width:${r.width}px;height:${r.height}px;flex:none;visibility:hidden`;
    el.before(t);
    el._yerTutucu = t;
  }
  function yerBirak(el) { if (el._yerTutucu) { el._yerTutucu.remove(); el._yerTutucu = null; } }

  // L kareden n tanesini eşit aralıkla seç (ilk ve son hep var)
  const sec = (n, L) => Array.from({ length: n }, (_, k) => Math.round((k * (L - 1)) / (n - 1)));

  // Bölüm: { rutin, gosterilen: [kare sırası], bos: [kutu sırası], secenek: [[rutin, kare]] }
  const BOLUMLER = [];
  for (let i = 0; i < 10; i++) {
    const L = RUTINLER[i].kareler.length, g = sec(i < 5 ? 3 : 4, L);
    BOLUMLER.push({ tur: "sirala", grup: "Kısa", rutin: i, gosterilen: g, bos: g.map((_, k) => k), secenek: g.map((f) => [i, f]) });
  }
  for (let i = 0; i < 10; i++) {
    const L = RUTINLER[i].kareler.length, g = [...Array(L).keys()];
    const bos = i < 5 ? [Math.floor(L / 2)] : [1, L - 2];
    const sasirtici = [[(i + 3) % 10, 1], [(i + 6) % 10, 2]];
    BOLUMLER.push({ tur: "eksik", grup: i < 5 ? "Eksik adım" : "2 eksik", rutin: i, gosterilen: g, bos, secenek: [...bos.map((k) => [i, g[k]]), ...sasirtici] });
  }
  for (let i = 0; i < 10; i++) {
    const r = (i + 5) % 10, L = RUTINLER[r].kareler.length, g = [...Array(L).keys()];
    BOLUMLER.push({ tur: "sirala", grup: "Tamamı", rutin: r, gosterilen: g, bos: g.map((_, k) => k), secenek: g.map((f) => [r, f]) });
  }
  BOLUMLER.forEach((b, i) => (b.grup = Uygulama.seviye(i)));

  const stil = `
  .gr { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--mavi); }
  .gr-sahne { --k: 140px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 10px; padding: 6px 16px 14px; touch-action: none; user-select: none; -webkit-user-select: none; overflow: hidden; }
  .gr-baslik { display: grid; justify-items: center; gap: 4px; margin: 0; text-align: center; }
  .gr-baslik b { font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.25rem, 3.2vw, 1.8rem); line-height: 1; }
  .gr-baslik small { font-weight: 800; color: var(--murekkep-2); font-size: .95rem; }
  .gr-gun { display: grid; grid-template-columns: repeat(var(--sutun), var(--k)); gap: 14px 26px; padding: 16px 20px; border-radius: 26px; background: var(--kagit); box-shadow: 0 8px 0 rgba(29,40,70,.1); }
  .gr-yuva { position: relative; width: var(--k); height: var(--k); border-radius: 18px; border: 4px dashed var(--cizgi); background: var(--zemin); display: grid; place-items: center; font-family: var(--f-baslik); font-weight: 800; color: var(--cizgi); font-size: calc(var(--k) * .4); }
  .gr-yuva::before { content: attr(data-no); position: absolute; z-index: 3; top: -12px; left: -12px; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: var(--mavi); color: #fff; font-size: 1.2rem; box-shadow: 0 3px 0 rgba(29,40,70,.2); }
  .gr-yuva:not(.ilk)::after { content: ""; position: absolute; left: -22px; top: 50%; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 13px solid var(--cizgi); transform: translateY(-50%); }
  .gr-yuva.satir-basi::after { display: none; }
  .gr-yuva.sabit { border-style: solid; border-color: var(--kagit); }
  .gr-yuva.bos-yer { border-color: var(--mavi); color: var(--mavi); }
  .gr-yuva.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .gr-yuva.dogru { border-style: solid; border-color: var(--yesil); }
  .gr-yuva.dogru::before { background: var(--yesil); content: "✓"; }
  .gr-deste { display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: 14px; min-height: calc(var(--k) + 26px); padding: 10px; border-radius: 26px; border: 3px dashed var(--cizgi); background: var(--zemin-2); max-width: 100%; box-sizing: border-box; }
  .gr-deste:empty::before { content: "Kartlar burada"; align-self: center; color: var(--murekkep-2); font-weight: 800; opacity: .6; }
  .gr-kart { width: var(--k); height: var(--k); border-radius: 16px; overflow: hidden; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; transition: transform .15s; flex: none; }
  .gr-yuva .gr-kart { position: absolute; inset: -4px; width: auto; height: auto; box-shadow: none; }
  .gr-yuva.sabit .gr-kart { cursor: default; }
  .gr-kart img { display: block; width: 100%; height: 100%; pointer-events: none; -webkit-user-drag: none; }
  .gr-kart.surukleniyor { position: fixed; z-index: 50; cursor: grabbing; transform: scale(1.08) rotate(-3deg); box-shadow: 0 16px 20px rgba(29,40,70,.3); pointer-events: none; transition: none; }
  .gr-kart.zipla { animation: gr-zipla .45s; }
  .gr-kart.salla { animation: gr-salla .5s; }
  @keyframes gr-zipla { 40% { transform: translateY(-14px) scale(1.06); } }
  @keyframes gr-salla { 20%, 60% { transform: translateX(-10px) rotate(-4deg); } 40%, 80% { transform: translateX(10px) rotate(4deg); } }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  const karistir = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("gr-stil")) {
      const st = document.createElement("style"); st.id = "gr-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="gr"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="gr-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".gr-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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

  const kareSrc = ([r, f]) => RUTINLER[r].kareler[f];
  const kimlik = ([r, f]) => `${r}:${f}`;

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.kontrol = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    let deste = karistir(b.secenek);
    // Sıralama bölümünde kartlar baştan doğru sırada gelmesin
    if (b.tur === "sirala") while (deste.every((s, k) => s[1] === b.gosterilen[k])) deste = karistir(b.secenek);
    const rutin = RUTINLER[b.rutin];
    d.sahne.innerHTML = `
      <h2 class="gr-baslik"><b>${rutin.ad}</b><small>${b.tur === "eksik" ? (b.bos.length > 1 ? "Eksik iki adımı bul" : "Eksik adımı bul") : "Adımları sırayla diz"}</small></h2>
      <div class="gr-gun">${b.gosterilen.map((f, k) => b.bos.includes(k)
        ? `<div class="gr-yuva bos-yer" data-no="${k + 1}" data-yuva="${k}" data-bekle="${kimlik([b.rutin, f])}">${b.tur === "eksik" ? "?" : ""}</div>`
        : `<div class="gr-yuva sabit" data-no="${k + 1}"><div class="gr-kart"><img src="${kareSrc([b.rutin, f])}" alt=""></div></div>`).join("")}</div>
      <div class="gr-deste" aria-label="Kartlar">${deste.map((s) => `<div class="gr-kart" data-kim="${kimlik(s)}" role="button" tabindex="0" aria-label="Kart"><img src="${kareSrc(s)}" alt=""></div>`).join("")}</div>`;
    d.gun = d.sahne.querySelector(".gr-gun");
    d.deste = d.sahne.querySelector(".gr-deste");
    d.deste.querySelectorAll(".gr-kart").forEach(surukle);
    boyutla();
  }

  function boyutla() {
    if (!d || !d.gun) return;
    const n = BOLUMLER[d.idx].gosterilen.length, desteN = d.deste.children.length || BOLUMLER[d.idx].secenek.length;
    const W = d.sahne.clientWidth - 32, Hs = d.sahne.clientHeight;
    if (W < 50 || Hs < 50) return;
    let en = 0, enSutun = n;
    for (const sutun of [n, Math.ceil(n / 2)]) {
      const satir = Math.ceil(n / sutun);
      const kG = (W - 40 - (sutun - 1) * 26) / sutun;
      const desteSatir = Math.ceil(desteN / Math.max(1, Math.floor((W - 20) / (Math.min(kG, 180) + 14))));
      const kH = (Hs - 60 - 40 - satir * 14 - 40) / (satir + Math.min(desteSatir, 2));
      const k = Math.min(kG, kH, 180);
      if (k > en + 8) { en = k; enSutun = sutun; }
    }
    d.sahne.style.setProperty("--k", Math.max(56, Math.floor(en)) + "px");
    d.gun.style.setProperty("--sutun", enSutun);
    d.gun.querySelectorAll(".gr-yuva").forEach((y, j) => { y.classList.toggle("ilk", j === 0); y.classList.toggle("satir-basi", j % enSutun === 0); });
    d.deste.style.width = d.gun.offsetWidth + "px";
  }

  const bosYuvalar = () => [...d.gun.querySelectorAll(".gr-yuva.bos-yer")];

  function yerlestir(kart, yuva) {
    const eski = kart.parentElement;
    if (yuva) {
      const oradaki = yuva.querySelector(".gr-kart");
      if (oradaki && oradaki !== kart) (eski.classList.contains("gr-yuva") ? eski : d.deste).appendChild(oradaki);
      yuva.textContent = "";
      yuva.appendChild(kart);
    } else {
      d.deste.appendChild(kart);
      if (eski.classList.contains("gr-yuva") && BOLUMLER[d.idx].tur === "eksik") eski.textContent = "?";
    }
    if (eski.classList.contains("gr-yuva") && !eski.querySelector(".gr-kart") && BOLUMLER[d.idx].tur === "eksik") eski.textContent = "?";
    d.api.ses.tik();
    if (bosYuvalar().every((y) => y.querySelector(".gr-kart"))) kontrolEt();
  }

  function surukle(kart) {
    let bx, by, kx, ky, aktif = false, hareket = false, hedef = null;
    const kilitli = () => d.kontrol || kart.closest(".gr-yuva.dogru");
    kart.addEventListener("pointerdown", (e) => {
      if (kilitli()) return;
      e.preventDefault();
      aktif = true; hareket = false;
      const r = kart.getBoundingClientRect();
      bx = e.clientX; by = e.clientY; kx = e.clientX - r.left; ky = e.clientY - r.top;
      kart.dataset.w = r.width;
      kart.setPointerCapture && kart.setPointerCapture(e.pointerId);
    });
    kart.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!hareket && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!hareket) { hareket = true; yerTut(kart); kart.classList.add("surukleniyor"); kart.style.width = kart.style.height = kart.dataset.w + "px"; }
      kart.style.left = e.clientX - kx + "px";
      kart.style.top = e.clientY - ky + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const y = alt && alt.closest(".gr-yuva.bos-yer:not(.dogru)");
      if (hedef && hedef !== y) hedef.classList.remove("hedef");
      hedef = y || null; if (hedef) hedef.classList.add("hedef");
    });
    const birak = (e) => {
      if (!aktif) return;
      aktif = false;
      if (hareket) {
        kart.classList.remove("surukleniyor");
        kart.style.left = kart.style.top = kart.style.width = kart.style.height = ""; yerBirak(kart);
        if (hedef) { hedef.classList.remove("hedef"); yerlestir(kart, hedef); }
        else {
          const alt = document.elementFromPoint(e.clientX, e.clientY);
          if (alt && alt.closest(".gr-deste") && kart.parentElement.classList.contains("gr-yuva")) yerlestir(kart, null);
        }
        hedef = null;
      } else dokun();
    };
    // Dokunma: destedeki kart ilk boş kutuya gider, kutudaki kart desteye döner
    const dokun = () => {
      if (kilitli()) return;
      if (kart.parentElement.classList.contains("gr-yuva")) yerlestir(kart, null);
      else {
        const bos = bosYuvalar().find((y) => !y.querySelector(".gr-kart"));
        if (bos) yerlestir(kart, bos);
      }
    };
    kart.addEventListener("pointerup", birak);
    kart.addEventListener("pointercancel", birak);
    kart.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); dokun(); } });
  }

  async function kontrolEt() {
    d.kontrol = true;
    const benim = d.uid;
    await bekle(250);
    let hata = false;
    const yuvalar = bosYuvalar();
    for (let j = 0; j < yuvalar.length; j++) {
      const y = yuvalar[j], kart = y.querySelector(".gr-kart");
      if (y.classList.contains("dogru")) continue;
      if (kart.dataset.kim === y.dataset.bekle) {
        y.classList.add("dogru");
        kart.classList.add("zipla");
        d.api.ses.adim(+y.dataset.yuva);
        setTimeout(() => kart.classList.remove("zipla"), 480);
      } else {
        hata = true;
        kart.classList.add("salla");
      }
      await bekle(220);
      if (!d || benim !== d.uid) return;
    }
    if (hata) {
      d.api.ses.hata();
      await bekle(500);
      if (!d || benim !== d.uid) return;
      // Yanlışta bütün kartlar desteye döner, çocuk baştan dizer
      yuvalar.forEach((y) => {
        const kart = y.querySelector(".gr-kart");
        y.classList.remove("dogru");
        if (kart) { kart.classList.remove("salla"); d.deste.appendChild(kart); if (BOLUMLER[d.idx].tur === "eksik") y.textContent = "?"; }
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
      mesaj: son ? (herkes ? "Bütün rutinleri sıraladın!" : "Son rutin de tamam!") : `${RUTINLER[BOLUMLER[d.idx].rutin].ad} tamam!`,
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.RUTIN_BOLUMLER = BOLUMLER; // test için

  window.Uygulama.oyunEkle(8, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      const yuva = [...d.sahne.querySelectorAll(".gr-yuva")].find((y) => !y.querySelector(".gr-kart") && y.dataset.bekle);
      return yuva ? [{ el: d.sahne.querySelector(`.gr-deste .gr-kart[data-kim="${yuva.dataset.bekle}"]`), hedef: yuva }] : [];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const k = RUTINLER[1].kareler;
      return `<div class="mini mini-sira" aria-hidden="true">${[k[0], k[1], k[4]].map((s) => `<span style="background-image:url('${s}')"></span>`).join("")}</div>`;
    },
  });
})();
