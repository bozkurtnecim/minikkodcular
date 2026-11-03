/* 14. Hafta: Hayvan Korosu (Simon oyunu: diziyi izle, hatırla, tekrarla).
   Hayvanlar sırayla şarkı söyler; çocuk aynı sırayla hayvanlara dokunur.
   Yanlışta oyun bitmez, şarkı yeniden çalınır. Okuma gerektirmez.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "koro";

  // Hayvan, kürsü rengi ve nota (do pentatonik)
  const KORO = [
    { id: "kedi", renk: "#ff5a4e", frek: 523.25 },
    { id: "kus", renk: "#2f86e0", frek: 587.33 },
    { id: "fil", renk: "#ffc23a", frek: 659.25 },
    { id: "civciv", renk: "#2fb36a", frek: 783.99 },
    { id: "tavsan", renk: "#8a5cf0", frek: 880.0 },
    { id: "kaplumbaga", renk: "#ff8a1f", frek: 1046.5 },
  ];

  // [hayvan sayısı, dizi uzunluğu, çalma hızı (ms)]
  const B = (n, uzunluk, hiz) => ({ n, uzunluk, hiz });
  const BOLUMLER = [
    B(3, 2, 900), B(3, 2, 900), B(3, 2, 850),
    B(3, 3, 850), B(3, 3, 850), B(3, 3, 800),
    B(4, 3, 800), B(4, 3, 800), B(4, 3, 780), B(4, 4, 800), B(4, 4, 780), B(4, 4, 760),
    B(4, 4, 720), B(4, 4, 700), B(4, 5, 740), B(4, 5, 720), B(4, 5, 700), B(4, 5, 680),
    B(5, 5, 680), B(5, 5, 660), B(5, 5, 640), B(5, 6, 660), B(5, 6, 640), B(5, 6, 620),
    B(6, 5, 640), B(6, 6, 620), B(6, 6, 600), B(6, 6, 580), B(6, 7, 600), B(6, 7, 560),
  ].map((b, i) => ({ ...b, grup: Uygulama.seviye(i) }));

  // Dizide aynı hayvan art arda iki kez gelmesin (çocuk için daha anlaşılır)
  function diziUret(n, uzunluk) {
    const d = [];
    while (d.length < uzunluk) {
      const h = (Math.random() * n) | 0;
      if (h !== d[d.length - 1]) d.push(h);
    }
    return d;
  }

  const stil = `
  .kr { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--yesil); }
  .kr-sahne { --k: 150px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 10px; padding: 6px 16px 14px; overflow: hidden; user-select: none; -webkit-user-select: none; }
  .kr-ust { display: flex; align-items: center; gap: 16px; }
  .kr-durum { width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: var(--kagit); box-shadow: 0 5px 0 rgba(29,40,70,.12); }
  .kr-durum svg { width: 36px; height: 36px; }
  .kr-noktalar { display: flex; gap: 10px; }
  .kr-noktalar i { width: 22px; height: 22px; border-radius: 50%; background: var(--kagit); border: 3px solid var(--cizgi); display: block; transition: background .2s, transform .2s; }
  .kr-noktalar i.dolu { background: var(--yesil); border-color: var(--yesil); transform: scale(1.15); }
  .kr-sahnem { display: grid; grid-template-columns: repeat(var(--sutun), var(--k)); gap: 18px 22px; padding: 22px 26px 26px; border-radius: 30px; background: radial-gradient(ellipse at 50% 0, #fff6d8, #ffe6b0 70%); box-shadow: 0 8px 0 rgba(29,40,70,.12); }
  .kr-hayvan { --r: #ff5a4e; position: relative; width: var(--k); height: var(--k); padding: 0; border: 0; background: none; cursor: pointer; }
  .kr-hayvan .kursu { position: absolute; left: 6%; right: 6%; bottom: 0; height: 26%; border-radius: 50% / 40%; background: var(--r); box-shadow: inset 0 -8px 0 rgba(0,0,0,.18); transition: filter .15s, box-shadow .15s; }
  .kr-hayvan img { position: absolute; left: 14%; right: 14%; bottom: 14%; width: 72%; height: 72%; transition: transform .15s; }
  .kr-hayvan .nota { position: absolute; top: 2%; right: 6%; font-size: calc(var(--k) * .22); color: var(--r); opacity: 0; transition: opacity .15s, transform .4s; font-weight: 900; }
  .kr-hayvan.cal .kursu { filter: brightness(1.25); box-shadow: inset 0 -8px 0 rgba(0,0,0,.18), 0 0 0 8px rgba(255,255,255,.8), 0 0 26px 6px var(--r); }
  .kr-hayvan.cal img { transform: translateY(-14%) scale(1.08); }
  .kr-hayvan.cal .nota { opacity: 1; transform: translateY(-18px); }
  .kr-hayvan.yanlis img { animation: kr-salla .45s; }
  .kr-hayvan:disabled { cursor: default; }
  .kr-dugme { width: 70px; height: 70px; border: 0; border-radius: 50%; display: grid; place-items: center; background: var(--mor); color: #fff; cursor: pointer; box-shadow: 0 6px 0 rgba(29,40,70,.2); }
  .kr-dugme svg { width: 36px; height: 36px; }
  .kr-dugme:disabled { background: #b9c6d6; cursor: default; }
  @keyframes kr-salla { 20%, 60% { transform: translateX(-8px) rotate(-6deg); } 40%, 80% { transform: translateX(8px) rotate(6deg); } }
  `;

  const kulak = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><path d="M10 9a2 2 0 0 1 4 0"/></svg>`;
  const gozIkon = `<svg viewBox="0 0 24 24" fill="none" stroke="#8a5cf0" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const elIkon = `<svg viewBox="0 0 24 24" fill="none" stroke="#2fb36a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V6a1.5 1.5 0 0 1 3 0v8a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-3-4a1.5 1.5 0 0 1 2.3-2L8 14"/></svg>`;
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("kr-stil")) {
      const st = document.createElement("style"); st.id = "kr-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="kr"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="kr-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".kr-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { if (d.caliyor) return; d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.caliyor = false; d.sira = 0; d.bitti = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.dizi = diziUret(b.n, b.uzunluk);
    const koro = KORO.slice(0, b.n);
    d.sahne.innerHTML = `
      <div class="kr-ust">
        <div class="kr-durum" aria-hidden="true"></div>
        <div class="kr-noktalar" aria-label="Dizi">${d.dizi.map(() => "<i></i>").join("")}</div>
        <button class="kr-dugme" type="button" aria-label="Şarkıyı yeniden dinle">${kulak}</button>
      </div>
      <div class="kr-sahnem">${koro.map((h, j) => `<button class="kr-hayvan" type="button" data-j="${j}" style="--r:${h.renk}" aria-label="${NESNELER[h.id].ad}"><span class="kursu"></span><img src="${NESNELER[h.id].src}" alt=""><span class="nota" aria-hidden="true">♪</span></button>`).join("")}</div>`;
    d.durum = d.sahne.querySelector(".kr-durum");
    d.noktalar = [...d.sahne.querySelectorAll(".kr-noktalar i")];
    d.hayvanlar = [...d.sahne.querySelectorAll(".kr-hayvan")];
    d.dinle = d.sahne.querySelector(".kr-dugme");
    d.dinle.onclick = () => cal();
    d.hayvanlar.forEach((el) => (el.onpointerdown = (e) => { e.preventDefault(); dokun(+el.dataset.j); }));
    boyutla();
    const benim = d.uid;
    setTimeout(() => { if (d && d.uid === benim) cal(); }, 800);
  }

  function boyutla() {
    if (!d || !d.hayvanlar) return;
    const n = BOLUMLER[d.idx].n;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    let en = 0, enSutun = n;
    for (const sutun of [n, Math.ceil(n / 2), 2]) {
      const satir = Math.ceil(n / sutun);
      const k = Math.min((W - 52 - (sutun - 1) * 22) / sutun, (H - 110 - 48 - (satir - 1) * 18) / satir, 190);
      if (k > en + 4) { en = k; enSutun = sutun; }
    }
    d.sahne.style.setProperty("--k", Math.max(70, Math.floor(en)) + "px");
    d.sahne.querySelector(".kr-sahnem").style.setProperty("--sutun", enSutun);
  }

  function hayvanCal(j, sure) {
    const el = d.hayvanlar[j];
    el.classList.add("cal");
    d.api.ses.ton(KORO[j].frek, sure / 1000);
    setTimeout(() => el.classList.remove("cal"), sure * 0.75);
  }

  // Diziyi çal: önce izle, sonra çocuğun sırası
  async function cal() {
    if (d.caliyor || d.bitti) return;
    d.caliyor = true; d.dinle.disabled = true; d.sira = 0;
    d.noktalar.forEach((n) => n.classList.remove("dolu"));
    d.hayvanlar.forEach((h) => (h.disabled = true));
    d.durum.innerHTML = gozIkon;
    const benim = d.uid, hiz = BOLUMLER[d.idx].hiz;
    await bekle(300);
    for (const j of d.dizi) {
      if (!d || benim !== d.uid) return;
      hayvanCal(j, hiz * 0.8);
      await bekle(hiz);
    }
    if (!d || benim !== d.uid) return;
    d.durum.innerHTML = elIkon;
    d.hayvanlar.forEach((h) => (h.disabled = false));
    d.caliyor = false; d.dinle.disabled = false;
  }

  async function dokun(j) {
    if (d.caliyor || d.bitti) return;
    if (d.dizi[d.sira] === j) {
      hayvanCal(j, 450);
      d.noktalar[d.sira].classList.add("dolu");
      d.sira++;
      if (d.sira === d.dizi.length) {
        d.bitti = true;
        const benim = d.uid;
        await bekle(500);
        if (!d || benim !== d.uid) return;
        // Bütün koro birlikte söyler
        d.hayvanlar.forEach((_, k) => setTimeout(() => d && benim === d.uid && hayvanCal(k, 380), k * 90));
        await bekle(900);
        if (!d || benim !== d.uid) return;
        bitir();
      }
    } else {
      const el = d.hayvanlar[j];
      el.classList.remove("yanlis"); void el.offsetWidth; el.classList.add("yanlis");
      d.api.ses.hata();
      d.caliyor = true;
      d.hayvanlar.forEach((h) => (h.disabled = true));
      const benim = d.uid;
      await bekle(1100);
      if (!d || benim !== d.uid) return;
      el.classList.remove("yanlis");
      d.caliyor = false;
      cal();
    }
  }

  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün şarkıları öğrendin!" : "Son şarkı da tamam!") : "Koro çok güzel söyledi!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.KORO_BOLUMLER = BOLUMLER; // test için
  window.KORO_DURUM = () => d && { dizi: d.dizi, caliyor: d.caliyor };

  window.Uygulama.oyunEkle(14, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d || !d.dizi) return [];
      return [{ el: d.sahne.querySelector(".kr-dugme") }, ...d.dizi.slice(0, 2).map((j) => ({ el: d.sahne.querySelector(`.kr-hayvan[data-j="${j}"]`) }))];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-koro" aria-hidden="true">${KORO.slice(0, 3).map((h) => `<span style="--r:${h.renk}"><img src="${NESNELER[h.id].src}" alt=""></span>`).join("")}</div>`;
    },
  });
})();
