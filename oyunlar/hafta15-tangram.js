/* 15. Hafta: Tangram (parça-bütün: yedi parçayla şekil oluşturma).
   Parçayı kalıptaki yerine sürükle; parçaya dokununca 90° döner.
   30 bölüm: çok kolay 3 ve kolay 3 (2–3 parça, yönü hazır), orta 6 (döndürme başlar),
   zor 6 (döndürmeli, 7 parçaya kadar), çok zor 12 (yalnız gölge, iç çizgi yok). */
(function () {
  const KAYIT = "tangram";

  function yerTut(el) {
    const r = el.getBoundingClientRect();
    const t = document.createElement("div");
    t.style.cssText = `width:${r.width}px;height:${r.height}px;flex:none;visibility:hidden`;
    el.before(t);
    el._yerTutucu = t;
  }
  function yerBirak(el) { if (el._yerTutucu) { el._yerTutucu.remove(); el._yerTutucu = null; } }

  // ---------- Parçalar (birim: büyük kare 4x4) ----------
  // BU büyük üçgen, OU orta üçgen, KU küçük üçgen, KR kare, PR paralelkenar
  const KANON = {
    BU: [[0, 0], [4, 0], [2, 2]],
    OU: [[2, 0], [2, 2], [0, 2]],
    KU: [[0, 1], [1, 0], [1, 2]],
    KR: [[1, 0], [2, 1], [1, 2], [0, 1]],
    PR: [[0, 1], [1, 0], [1, 2], [0, 3]],
  };
  const SIM = { BU: 4, OU: 4, KU: 4, KR: 1, PR: 2 }; // kaç farklı yönü var
  const RENK = { BU: "#ff5a4e", OU: "#ffc23a", KU: "#2fb36a", KR: "#8a5cf0", PR: "#ff8a1f" };
  function dondur(pts, r) {
    let p = pts.map(([x, y]) => [x, y]);
    for (let i = 0; i < r; i++) p = p.map(([x, y]) => [-y, x]);
    const mx = Math.min(...p.map((q) => q[0])), my = Math.min(...p.map((q) => q[1]));
    return p.map(([x, y]) => [x - mx, y - my]);
  }
  const yerlesik = ([t, r, dx, dy]) => dondur(KANON[t], r).map(([x, y]) => [x + dx, y + dy]);
  const anahtar = (t, r) => `${t}:${((r % SIM[t]) + SIM[t]) % SIM[t]}`;
  const noktalar = (P) => P.map((q) => q.join(",")).join(" ");

  // Şekiller: [ad, [tür, dönüş, x, y]...]
  const S = {
    ucurtma2: ["Uçurtma", [["BU", 2, 0, 0], ["BU", 0, 0, 2]]],
    balik2: ["Balık", [["BU", 1, 0, 0], ["KU", 0, 2, 1]]],
    gemi2: ["Yelkenli", [["OU", 0, 1, 0], ["BU", 0, 0, 2]]],
    ucurtma3: ["Kuyruklu uçurtma", [["BU", 2, 0, 0], ["BU", 0, 0, 2], ["KU", 1, 1, 4]]],
    gemi3: ["Bayraklı gemi", [["OU", 0, 1, 0], ["BU", 0, 0, 2], ["KU", 2, 3, 0]]],
    kediyuz3: ["Kedi yüzü", [["BU", 0, 0, 1], ["KU", 1, 0, 0], ["KU", 1, 2, 0]]],
    mantar3: ["Mantar", [["BU", 2, 0, 0], ["KR", 0, 1, 2], ["KU", 2, 0, 2]]],
    cam3: ["Çam ağacı", [["KU", 1, 1, 0], ["BU", 2, 0, 1], ["KR", 0, 1, 3]]],
    kus4: ["Kuş", [["BU", 0, 2, 2], ["KU", 1, 5, 1], ["OU", 3, 0, 0], ["KR", 0, 3, 0]]],
    kedi4: ["Kedi", [["BU", 0, 0, 1], ["KU", 1, 0, 0], ["KU", 1, 2, 0], ["KR", 0, 1, 3]]],
    ev5: ["Ev", [["BU", 2, 0, 0], ["BU", 0, 0, 2], ["OU", 1, 0, 2], ["KU", 0, 3, 2], ["KU", 1, 2, 3]]],
    kare7: ["Büyük kare", [["BU", 0, 0, 0], ["BU", 3, 0, 0], ["OU", 0, 2, 2], ["KU", 0, 2, 1], ["KU", 1, 0, 3], ["KR", 0, 1, 2], ["PR", 0, 3, 0]]],
  };
  // [şekil, döndürme gerekir mi, gölge mi]
  const BOLUMLER = [
    ["ucurtma2", 0, 0], ["balik2", 0, 0], ["gemi2", 0, 0],
    ["ucurtma3", 0, 0], ["gemi3", 0, 0], ["kediyuz3", 0, 0],
    ["mantar3", 0, 0], ["cam3", 0, 0], ["kus4", 0, 0], ["kediyuz3", 1, 0], ["gemi3", 1, 0], ["kedi4", 1, 0],
    ["ev5", 1, 0], ["kus4", 1, 0], ["mantar3", 1, 0], ["cam3", 1, 0], ["kedi4", 1, 0], ["kare7", 1, 0],
    ["ucurtma2", 1, 1], ["balik2", 1, 1], ["gemi2", 1, 1], ["ucurtma3", 1, 1], ["gemi3", 1, 1], ["kediyuz3", 1, 1],
    ["mantar3", 1, 1], ["cam3", 1, 1], ["kus4", 1, 1], ["kedi4", 1, 1], ["ev5", 1, 1], ["kare7", 1, 1],
  ].map(([sekil, donmeli, golge], i) => ({ sekil, ad: S[sekil][0], parcalar: S[sekil][1], donmeli: !!donmeli, golge: !!golge, grup: Uygulama.seviye(i) }));

  const stil = `
  .tg { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--kirmizi); }
  .tg-sahne { --s: 400px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 18px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .tg-sahne.dikey { flex-direction: column; }
  .tg-sol { display: grid; justify-items: center; gap: 8px; flex: none; }
  .tg-baslik { margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.15rem, 3vw, 1.6rem); line-height: 1; text-align: center; }
  .tg-tahta { width: var(--s); height: var(--s); border-radius: 22px; background: var(--kagit); box-shadow: 0 8px 0 rgba(29,40,70,.1); overflow: visible; }
  .tg-yuva { fill: #eef4fa; stroke: #8fabcc; stroke-width: .05; stroke-dasharray: .14 .1; stroke-linejoin: round; pointer-events: all; }
  .tg-tahta.golge .tg-yuva { fill: #7d93ad; stroke: #7d93ad; stroke-width: .03; stroke-dasharray: none; }
  .tg-yuva.hedef { fill: #d4e8ff; stroke: var(--mavi); stroke-dasharray: none; }
  .tg-tahta.golge .tg-yuva.hedef { fill: #9fb7d4; }
  .tg-yuva.dolu { fill: none; stroke: none; pointer-events: none; }
  .tg-yuva.salla { fill: #ffe3e0; }
  .tg-yerlesen > * { stroke: #fff; stroke-width: .05; stroke-linejoin: round; pointer-events: none; animation: tg-otur .35s cubic-bezier(.3,1.6,.5,1); transform-box: fill-box; transform-origin: center; }
  .tg-tahta.tamam .tg-yerlesen { animation: tg-zipla .7s ease-in-out 2; transform-origin: 50% 90%; }
  @keyframes tg-otur { from { transform: scale(1.2); } }
  @keyframes tg-zipla { 30% { transform: translateY(-.15px) scale(1.03); } }
  .tg-sag { flex: 1; min-width: 0; align-self: stretch; display: grid; grid-template-rows: auto 1fr; gap: 8px; }
  .tg-sahne.dikey .tg-sag { width: 100%; }
  .tg-ipucu { margin: 0; text-align: center; font-weight: 800; color: var(--murekkep-2); display: flex; align-items: center; justify-content: center; gap: 8px; }
  .tg-ipucu svg { width: 26px; height: 26px; flex: none; }
  .tg-palet { display: flex; flex-wrap: wrap; align-content: center; justify-content: center; gap: 14px; padding: 14px; border-radius: 26px; border: 3px dashed var(--cizgi); background: var(--zemin-2); overflow: hidden; box-sizing: border-box; }
  .tg-palet:empty::before { content: "Şekil tamam!"; align-self: center; color: var(--murekkep-2); font-weight: 800; opacity: .6; }
  .tg-parca { min-width: 46px; min-height: 46px; display: grid; place-items: center; cursor: grab; touch-action: none; border-radius: 12px; flex: none; }
  .tg-parca svg { display: block; overflow: visible; filter: drop-shadow(0 3px 0 rgba(29,40,70,.2)); pointer-events: none; transition: transform .2s; }
  .tg-parca.donuyor svg { animation: tg-don .25s ease-out; }
  @keyframes tg-don { from { transform: rotate(-90deg); } }
  .tg-parca.surukleniyor { position: fixed; z-index: 50; cursor: grabbing; pointer-events: none; }
  .tg-parca.salla { animation: tg-salla .45s; }
  @keyframes tg-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  `;
  const donIkon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.4-5.7L20 8.6"/><path d="M20 4v4.6h-4.6"/></svg>`;
  const karistir = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("tg-stil")) {
      const st = document.createElement("style"); st.id = "tg-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="tg"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="tg-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".tg-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    d.idx = i; d.uid++; d.bitti = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const yuvalar = b.parcalar.map((p, j) => ({ j, t: p[0], k: anahtar(p[0], p[1]), P: yerlesik(p) }));
    const tum = yuvalar.flatMap((y) => y.P);
    const X0 = Math.min(...tum.map((q) => q[0])), X1 = Math.max(...tum.map((q) => q[0]));
    const Y0 = Math.min(...tum.map((q) => q[1])), Y1 = Math.max(...tum.map((q) => q[1]));
    const boy = Math.max(X1 - X0, Y1 - Y0) + 0.8;
    d.kutu = { x: X0 - (boy - (X1 - X0)) / 2, y: Y0 - (boy - (Y1 - Y0)) / 2, boy };
    d.yuvalar = yuvalar;
    // Paletteki parçalar: döndürmeli bölümlerde yanlış yönde başlar
    d.parcalar = karistir(b.parcalar.map(([t, r]) => {
      let bas = r;
      if (b.donmeli && SIM[t] > 1) { const secenek = [0, 1, 2, 3].filter((x) => anahtar(t, x) !== anahtar(t, r)); bas = secenek[(Math.random() * secenek.length) | 0]; }
      return { t, r: bas };
    }));
    d.sahne.innerHTML = `
      <div class="tg-sol">
        <h2 class="tg-baslik">${b.ad}</h2>
        <svg class="tg-tahta${b.golge ? " golge" : ""}" viewBox="${d.kutu.x} ${d.kutu.y} ${boy} ${boy}" aria-label="Tangram kalıbı">
          <g>${yuvalar.map((y) => `<polygon class="tg-yuva" data-j="${y.j}" points="${noktalar(y.P)}"/>`).join("")}</g>
          <g class="tg-yerlesen"></g>
        </svg>
      </div>
      <div class="tg-sag">
        <p class="tg-ipucu">${b.donmeli ? `${donIkon}<span>Parçaya dokun, döner</span>` : "Parçaları kalıba sürükle"}</p>
        <div class="tg-palet" aria-label="Tangram parçaları">${d.parcalar.map((_, j) => `<div class="tg-parca" data-j="${j}" role="button" tabindex="0" aria-label="Parça"></div>`).join("")}</div>
      </div>`;
    d.tahta = d.sahne.querySelector(".tg-tahta");
    d.yerlesen = d.sahne.querySelector(".tg-yerlesen");
    d.palet = d.sahne.querySelector(".tg-palet");
    d.palet.querySelectorAll(".tg-parca").forEach(tasi);
    boyutla();
  }

  function parcaCiz(el, olcek) {
    const p = d.parcalar[+el.dataset.j];
    const P = dondur(KANON[p.t], p.r);
    const w = Math.max(...P.map((q) => q[0])), h = Math.max(...P.map((q) => q[1]));
    el.innerHTML = `<svg width="${w * olcek}" height="${h * olcek}" viewBox="0 0 ${w} ${h}"><polygon points="${noktalar(P)}" fill="${RENK[p.t]}" stroke="#fff" stroke-width=".05" stroke-linejoin="round"/></svg>`;
  }

  // Tahta ve paletteki parçalar aynı ölçekte; palet sığmazsa birlikte küçülür
  function boyutla() {
    if (!d || !d.tahta) return;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 20;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.15;
    d.sahne.classList.toggle("dikey", dikey);
    const S2 = Math.floor(dikey ? Math.min(W, (H - 40) * 0.55) : Math.min(H - 40, W * 0.52));
    d.sahne.style.setProperty("--s", S2 + "px");
    d.olcek = S2 / d.kutu.boy;
    const sag = d.sahne.querySelector(".tg-sag");
    if (dikey) d.palet.style.maxHeight = Math.max(120, H - S2 - 80) + "px";
    else d.palet.style.maxHeight = "";
    let f = 1;
    const ciz = () => d.palet.querySelectorAll(".tg-parca").forEach((el) => parcaCiz(el, d.olcek * f));
    ciz();
    while (f > 0.4 && (d.palet.scrollHeight > d.palet.clientHeight + 2 || sag.scrollHeight > sag.clientHeight + 4)) { f -= 0.08; ciz(); }
    d.f = f;
  }

  function birakNokta(el, x, y) {
    const p = d.parcalar[+el.dataset.j], a = anahtar(p.t, p.r);
    const altta = document.elementsFromPoint(x, y).filter((e) => e.classList && e.classList.contains("tg-yuva") && !e.classList.contains("dolu"));
    if (!altta.length) return;
    const yuvaEl = altta.find((e) => d.yuvalar[+e.dataset.j].k === a);
    if (!yuvaEl) {
      const yanlis = altta[0];
      [el, yanlis].forEach((z) => { z.classList.remove("salla"); void z.getBoundingClientRect(); z.classList.add("salla"); });
      setTimeout(() => { el.classList.remove("salla"); yanlis.classList.remove("salla"); }, 500);
      d.api.ses.hata();
      return;
    }
    const yv = d.yuvalar[+yuvaEl.dataset.j];
    yuvaEl.classList.add("dolu");
    d.yerlesen.insertAdjacentHTML("beforeend", `<polygon points="${noktalar(yv.P)}" fill="${RENK[yv.t]}"/>`);
    el.remove();
    d.api.ses.yerlesti();
    if (!d.tahta.querySelector(".tg-yuva:not(.dolu)")) bitir();
  }

  function tasi(el) {
    let bx, by, aktif = false, hareket = false, hedef = null;
    const don = () => {
      const p = d.parcalar[+el.dataset.j];
      p.r = (p.r + 1) % 4;
      parcaCiz(el, d.olcek * d.f);
      el.classList.remove("donuyor"); void el.offsetWidth; el.classList.add("donuyor");
      d.api.ses.tik();
    };
    el.addEventListener("pointerdown", (e) => {
      if (d.bitti) return;
      e.preventDefault();
      aktif = true; hareket = false; bx = e.clientX; by = e.clientY;
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!hareket && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!hareket) { hareket = true; yerTut(el); el.classList.add("surukleniyor"); parcaCiz(el, d.olcek); }
      const s = el.querySelector("svg"), sw = +s.getAttribute("width"), sh = +s.getAttribute("height");
      el.style.left = e.clientX - Math.max(23, sw / 2) + "px";
      el.style.top = e.clientY - Math.max(23, sh / 2) + "px";
      const alt = document.elementsFromPoint(e.clientX, e.clientY).find((x) => x.classList && x.classList.contains("tg-yuva") && !x.classList.contains("dolu"));
      if (hedef && hedef !== alt) hedef.classList.remove("hedef");
      hedef = alt || null; if (hedef) hedef.classList.add("hedef");
    });
    const birak = (e) => {
      if (!aktif) return;
      aktif = false;
      if (hareket) {
        el.classList.remove("surukleniyor");
        el.style.left = el.style.top = "";
        yerBirak(el);
        if (hedef) hedef.classList.remove("hedef");
        hedef = null;
        parcaCiz(el, d.olcek * d.f);
        birakNokta(el, e.clientX, e.clientY);
      } else don();
    };
    el.addEventListener("pointerup", birak);
    el.addEventListener("pointercancel", birak);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); don(); } });
  }

  function bitir() {
    d.bitti = true;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    d.tahta.classList.add("tamam");
    const benim = d.uid;
    setTimeout(() => {
      if (!d || benim !== d.uid) return;
      navCiz();
      const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
      d.api.kutla(d.sahne, {
        mesaj: son ? (herkes ? "Bütün tangramları çözdün!" : "Son tangram da tamam!") : `${BOLUMLER[d.idx].ad} hazır!`,
        son,
        ileri: () => yukle(d.idx + 1),
        bastan: () => { d.ilerleme.bitti = []; yukle(0); },
      });
    }, 1200);
  }

  window.TANGRAM_BOLUMLER = BOLUMLER; // test için
  window.TANGRAM_DURUM = () => d && { parcalar: d.parcalar, yuvalar: d.yuvalar.map((y) => ({ j: y.j, k: y.k })), anahtar };

  window.Uygulama.oyunEkle(15, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      const el = d.sahne.querySelector(".tg-palet .tg-parca");
      if (!el) return [];
      const pc = d.parcalar[+el.dataset.j];
      const bos = [...d.sahne.querySelectorAll(".tg-yuva:not(.dolu)")].map((e) => ({ e, k: d.yuvalar[+e.dataset.j].k }));
      let n = 0;
      while (n < 4 && !bos.some((o) => o.k === anahtar(pc.t, pc.r + n))) n++;
      const h = bos.find((o) => o.k === anahtar(pc.t, pc.r + n));
      return h ? [...(n ? [{ el, kez: n }] : []), { el, hedef: h.e }] : [];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-tangram" aria-hidden="true"><svg viewBox="-.2 -.2 4.4 4.4">${S.kare7[1].map((p) => `<polygon points="${noktalar(yerlesik(p))}" fill="${RENK[p[0]]}" stroke="#fff" stroke-width=".08"/>`).join("")}</svg></div>`;
    },
  });
})();
