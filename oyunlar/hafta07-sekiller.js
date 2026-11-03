/* 7. Hafta: Şekillerden Resim (parça-bütün: şekillerle bütün oluşturma).
   Tahtadaki kesik çizgili yuvalara doğru şekli koy; resim tamamlanır.
   30 bölüm: 2–3 parça (6), 4 parça (6), 5–7 parça + şaşırtıcı (6),
   boy farkı (6), döndürülmüş üçgen + silik çizgi (6). */
(function () {
  const KAYIT = "sekiller";

  function yerTut(el) {
    const r = el.getBoundingClientRect();
    const t = document.createElement("div");
    t.style.cssText = `width:${r.width}px;height:${r.height}px;flex:none;visibility:hidden`;
    el.before(t);
    el._yerTutucu = t;
  }
  function yerBirak(el) { if (el._yerTutucu) { el._yerTutucu.remove(); el._yerTutucu = null; } }

  // ---------- Şekiller ----------
  // Parça: [tür, x, y, w, h, renk, dönüş]  tür: k kare/dikdörtgen, d daire/elips, u üçgen, y yarım daire
  // Üçgen dönüşü: 0 tepe yukarı, 90 sağa, 180 aşağı, 270 sola. Tahta 100x100 birim.
  const R = "#ff5a4e", B = "#2f86e0", Y = "#ffc23a", G = "#2fb36a", P = "#8a5cf0", O = "#ff8a1f", K = "#8a5a33",
    S = "#2b2b3a", GR = "#9aa7b8", AB = "#9fd8ff", BE = "#e4edf6", PE = "#ff7ab8", GB = "#7fa8c9";
  const koyu = (hex) => {
    const n = parseInt(hex.slice(1), 16), f = 0.72;
    return `rgb(${Math.round((n >> 16) * f)},${Math.round(((n >> 8) & 255) * f)},${Math.round((n & 255) * f)})`;
  };

  function sekilYolu(t, x, y, w, h, r = 0) {
    if (t === "k") return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) * 0.12}"/>`;
    if (t === "d") return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}"/>`;
    if (t === "y") return r === 180
      ? `<path d="M${x} ${y} H${x + w} A${w / 2} ${h} 0 0 1 ${x} ${y} Z"/>`
      : `<path d="M${x} ${y + h} A${w / 2} ${h} 0 0 1 ${x + w} ${y + h} Z"/>`;
    const n = { 0: [[w / 2, 0], [w, h], [0, h]], 90: [[0, 0], [w, h / 2], [0, h]], 180: [[0, 0], [w, 0], [w / 2, h]], 270: [[w, 0], [0, h / 2], [w, h]] }[r];
    return `<polygon points="${n.map(([a, b]) => `${x + a},${y + b}`).join(" ")}"/>`;
  }
  const anahtar = ([t, , , w, h, , r = 0]) => `${t}:${w}x${h}:${t === "u" || t === "y" ? r : 0}`;

  // [ad, parçalar, şaşırtıcılar]
  const BOLUMLER = [
    ["Ev", [["k", 20, 48, 60, 44, Y], ["u", 12, 14, 76, 36, R]]],
    ["Dondurma", [["u", 34, 46, 32, 48, O, 180], ["d", 30, 12, 40, 40, PE]]],
    ["Ağaç", [["k", 42, 60, 16, 34, K], ["d", 20, 6, 60, 58, G]]],
    ["Yelkenli", [["k", 14, 66, 72, 18, R], ["k", 46, 14, 5, 52, K], ["u", 51, 18, 32, 44, AB, 90]]],
    ["Kardan adam", [["d", 26, 48, 48, 46, BE], ["d", 34, 16, 32, 32, BE], ["u", 50, 30, 14, 8, O, 90]]],
    ["Balon", [["d", 28, 6, 44, 52, R], ["u", 45, 57, 10, 8, R, 180], ["k", 49, 65, 2.5, 30, S]]],

    ["Ev", [["k", 20, 48, 60, 44, Y], ["u", 12, 14, 76, 36, R], ["k", 44, 66, 14, 26, K], ["k", 26, 56, 12, 12, B]]],
    ["Araba", [["k", 8, 46, 84, 24, R], ["k", 26, 26, 44, 22, R], ["d", 16, 60, 22, 22, S], ["d", 62, 60, 22, 22, S]]],
    ["Roket", [["k", 38, 30, 24, 48, BE], ["u", 38, 8, 24, 22, R], ["u", 24, 60, 14, 22, R], ["u", 62, 60, 14, 22, R]]],
    ["Lokomotif", [["k", 8, 46, 50, 28, G], ["k", 56, 24, 34, 50, R], ["d", 12, 66, 22, 22, S], ["d", 60, 66, 22, 22, S]]],
    ["Balık", [["d", 14, 28, 60, 44, O], ["u", 70, 30, 26, 40, O, 270], ["d", 24, 42, 9, 9, S], ["u", 36, 14, 20, 16, O]]],
    ["Robot yüzü", [["k", 22, 18, 56, 52, GR], ["d", 32, 30, 12, 12, B], ["d", 56, 30, 12, 12, B], ["k", 36, 54, 28, 6, R]]],

    ["Ev", [["k", 20, 48, 60, 44, Y], ["u", 12, 14, 76, 36, R], ["k", 44, 66, 14, 26, K], ["k", 24, 56, 12, 12, B], ["k", 64, 56, 12, 12, B], ["k", 64, 14, 8, 20, K]], [["d", 0, 0, 18, 18, G]]],
    ["Araba", [["k", 8, 46, 84, 24, R], ["k", 26, 26, 44, 22, R], ["d", 16, 60, 22, 22, S], ["d", 62, 60, 22, 22, S], ["k", 31, 30, 15, 14, AB], ["k", 51, 30, 15, 14, AB]], [["u", 0, 0, 18, 18, Y]]],
    ["Roket", [["k", 38, 30, 24, 46, BE], ["u", 38, 8, 24, 22, R], ["u", 24, 58, 14, 22, R], ["u", 62, 58, 14, 22, R], ["d", 43, 38, 14, 14, B], ["u", 42, 76, 16, 18, O, 180]], [["k", 0, 0, 20, 20, P]]],
    ["Tren", [["k", 8, 46, 50, 28, G], ["k", 56, 24, 34, 50, R], ["k", 16, 28, 10, 18, S], ["d", 12, 66, 22, 22, S], ["d", 60, 66, 22, 22, S], ["k", 62, 30, 22, 16, AB]], [["d", 0, 0, 30, 30, Y]]],
    ["Kardan adam", [["d", 24, 60, 52, 38, BE], ["d", 30, 36, 40, 30, BE], ["d", 36, 14, 28, 26, BE], ["u", 50, 25, 12, 6, O, 90], ["k", 32, 12, 36, 5, B], ["k", 39, 0, 22, 13, B]], [["d", 0, 0, 20, 20, BE]]],
    ["Çiçek", [["k", 47, 50, 6, 44, G], ["u", 53, 66, 16, 12, G, 90], ["d", 40, 4, 20, 20, P], ["d", 40, 40, 20, 20, P], ["d", 22, 22, 20, 20, P], ["d", 58, 22, 20, 20, P], ["d", 42, 24, 16, 16, Y]], [["k", 0, 0, 16, 16, R]]],

    ["Robot", [["k", 32, 6, 36, 26, GR], ["d", 38, 12, 8, 8, B], ["d", 54, 12, 8, 8, B], ["k", 24, 34, 52, 38, GB], ["d", 44, 46, 12, 12, R], ["k", 32, 72, 12, 22, GR], ["k", 56, 72, 12, 22, GR]], [["k", 0, 0, 36, 32, GR], ["d", 0, 0, 16, 16, R]]],
    ["Yelkenli", [["k", 0, 84, 100, 12, AB], ["k", 10, 66, 80, 18, R], ["k", 48, 6, 4, 60, K], ["u", 52, 6, 12, 9, G, 90], ["u", 52, 18, 34, 46, BE, 90], ["u", 22, 26, 24, 38, Y, 270]], [["u", 0, 0, 34, 46, BE], ["u", 0, 0, 24, 38, Y, 90]]],
    ["Kedi", [["d", 30, 46, 48, 46, O], ["k", 76, 44, 7, 36, O], ["d", 14, 22, 38, 34, O], ["u", 16, 10, 12, 16, O], ["u", 38, 10, 12, 16, O], ["u", 30, 40, 7, 5, PE, 180]], [["d", 0, 0, 40, 40, O], ["u", 0, 0, 12, 16, O, 180]]],
    ["Kale", [["k", 10, 30, 22, 64, GR], ["k", 68, 30, 22, 64, GR], ["k", 32, 46, 36, 48, BE], ["u", 8, 10, 26, 20, R], ["u", 66, 10, 26, 20, R], ["y", 42, 70, 16, 24, K]], [["u", 0, 0, 26, 20, R, 180], ["k", 0, 0, 22, 40, GR]]],
    ["Uçak", [["k", 10, 42, 76, 16, BE], ["u", 86, 42, 12, 16, BE, 90], ["u", 36, 12, 28, 30, B], ["u", 36, 58, 28, 30, B, 180], ["u", 10, 22, 14, 20, R], ["d", 66, 46, 7, 7, B]], [["u", 0, 0, 28, 30, B, 90], ["k", 0, 0, 76, 10, BE]]],
    ["Elma ağacı", [["k", 0, 90, 100, 8, G], ["k", 42, 58, 16, 34, K], ["d", 14, 4, 72, 62, G], ["d", 28, 22, 12, 12, R], ["d", 56, 16, 12, 12, R], ["d", 46, 40, 12, 12, R]], [["d", 0, 0, 16, 16, R], ["d", 0, 0, 8, 8, R]]],

    ["Bahçeli ev", [["k", 14, 48, 52, 44, Y], ["u", 8, 18, 64, 32, R], ["k", 32, 66, 14, 26, K], ["k", 18, 56, 10, 10, B], ["k", 52, 56, 10, 10, B], ["k", 50, 16, 8, 18, K], ["d", 74, 4, 20, 20, O], ["k", 80, 62, 8, 30, K], ["d", 70, 36, 28, 30, G]], [["u", 0, 0, 64, 32, R, 180], ["k", 0, 0, 10, 14, B]]],
    ["Tren", [["k", 4, 34, 18, 38, R], ["k", 22, 48, 24, 24, G], ["k", 34, 34, 6, 14, S], ["k", 50, 48, 22, 24, B], ["k", 76, 48, 22, 24, Y], ["d", 6, 68, 12, 12, S], ["d", 28, 68, 12, 12, S], ["d", 54, 68, 12, 12, S], ["d", 80, 68, 12, 12, S]], [["d", 0, 0, 16, 16, S], ["k", 0, 0, 24, 22, B]]],
    ["Kelebek", [["d", 12, 14, 34, 34, P], ["d", 54, 14, 34, 34, P], ["d", 20, 48, 26, 26, Y], ["d", 54, 48, 26, 26, Y], ["k", 47, 22, 6, 54, S], ["d", 45, 13, 10, 10, S], ["k", 42, 2, 3, 12, S], ["k", 55, 2, 3, 12, S]], [["d", 0, 0, 30, 30, P], ["d", 0, 0, 20, 20, Y]]],
    ["Akvaryum", [["k", 0, 86, 100, 12, Y], ["d", 20, 32, 50, 36, B], ["u", 66, 32, 24, 36, B, 270], ["u", 34, 20, 18, 14, B], ["u", 36, 66, 14, 12, B, 180], ["d", 28, 44, 8, 8, S], ["d", 8, 6, 10, 10, AB], ["d", 22, 10, 6, 6, AB]], [["u", 0, 0, 24, 36, B, 90], ["d", 0, 0, 14, 14, AB]]],
    ["Robot", [["k", 32, 6, 36, 26, GR], ["d", 38, 12, 8, 8, B], ["d", 54, 12, 8, 8, B], ["k", 42, 24, 16, 4, R], ["k", 24, 34, 52, 36, GB], ["k", 10, 38, 14, 8, GR], ["k", 76, 38, 14, 8, GR], ["k", 32, 70, 12, 22, GR], ["k", 56, 70, 12, 22, GR]], [["k", 0, 0, 8, 14, GR], ["d", 0, 0, 12, 12, B]]],
    ["Uzay", [["k", 38, 32, 24, 42, BE], ["u", 38, 10, 24, 22, R], ["u", 24, 56, 14, 20, R], ["u", 62, 56, 14, 20, R], ["d", 43, 40, 14, 14, B], ["u", 42, 74, 16, 18, O, 180], ["d", 74, 6, 18, 18, Y], ["u", 8, 12, 9, 9, Y], ["u", 82, 70, 9, 9, Y]], [["u", 0, 0, 9, 9, Y, 180], ["u", 0, 0, 16, 18, O]]],
  ].map(([ad, parcalar, sasirtici = []], i) => ({ ad, parcalar, sasirtici, silik: i >= 24, grup: Uygulama.seviye(i) }));

  const RENKLER_RASTGELE = [R, B, Y, G, P, O, PE];

  const stil = `
  .sk { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--kirmizi); }
  .sk-sahne { --s: 400px; --f: 1; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 18px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .sk-sahne.dikey { flex-direction: column; }
  .sk-sol { display: grid; justify-items: center; gap: 8px; flex: none; }
  .sk-baslik { margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.15rem, 3vw, 1.6rem); line-height: 1; text-align: center; }
  .sk-tahta { width: var(--s); height: var(--s); border-radius: 22px; background: var(--kagit); box-shadow: 0 8px 0 rgba(29,40,70,.1); overflow: visible; }
  .sk-yuva { fill: #eef4fa; stroke: #8fabcc; stroke-width: .8; stroke-dasharray: 2.4 1.6; pointer-events: all; cursor: pointer; transition: fill .2s; }
  .sk-tahta.silik .sk-yuva { fill: #f6f9fc; stroke: #c3d3e6; stroke-dasharray: 1.2 1.8; }
  .sk-yuva.hedef { fill: #d4e8ff; stroke: var(--mavi); stroke-dasharray: none; }
  .sk-yuva.dolu { fill: none; stroke: none; pointer-events: none; }
  .sk-yuva.salla { fill: #ffe3e0; stroke: var(--kirmizi); }
  .sk-yerlesen > * { stroke-width: 1; pointer-events: none; animation: sk-otur .35s cubic-bezier(.3,1.6,.5,1); transform-box: fill-box; transform-origin: center; }
  .sk-tahta.tamam .sk-yerlesen { animation: sk-zipla .7s ease-in-out 2; transform-origin: 50% 90%; }
  @keyframes sk-otur { from { transform: scale(1.25); } }
  @keyframes sk-zipla { 30% { transform: translateY(-4px) scale(1.03); } 60% { transform: translateY(0) scale(.99); } }
  .sk-palet { flex: 1; min-width: 0; align-self: stretch; display: flex; flex-wrap: wrap; align-content: center; justify-content: center; gap: 12px; padding: 14px; border-radius: 26px; border: 3px dashed var(--cizgi); background: var(--zemin-2); overflow: hidden; box-sizing: border-box; }
  .sk-sahne.dikey .sk-palet { flex: 1; width: 100%; }
  .sk-palet:empty::before { content: "Resim tamam!"; align-self: center; color: var(--murekkep-2); font-weight: 800; opacity: .6; }
  .sk-parca { min-width: 46px; min-height: 46px; display: grid; place-items: center; cursor: grab; touch-action: none; border-radius: 12px; transition: transform .15s; flex: none; }
  .sk-parca svg { display: block; overflow: visible; filter: drop-shadow(0 3px 0 rgba(29,40,70,.2)); pointer-events: none; }
  .sk-parca.secili { transform: translateY(-6px) scale(1.06); background: rgba(47,134,224,.15); outline: 4px solid var(--mavi); }
  .sk-parca.surukleniyor { position: fixed; z-index: 50; cursor: grabbing; pointer-events: none; transition: none; }
  .sk-parca.salla { animation: sk-salla .45s; }
  @keyframes sk-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  `;

  let d = null;
  const karistir = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

  function baslat(alan, api) {
    if (!document.getElementById("sk-stil")) {
      const st = document.createElement("style"); st.id = "sk-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="sk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="sk-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".sk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    d.idx = i; d.uid++; d.secili = null; d.bitti = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    // Büyük yuvalar altta, küçükler üstte çizilir (pencere duvarın üstünde)
    d.yuvalar = b.parcalar.map((p, j) => ({ p, j, alan: p[3] * p[4] })).sort((a, c) => c.alan - a.alan);
    d.sira = {};
    d.yuvalar.forEach((y, k) => (d.sira[y.j] = k));
    const paletParcalari = karistir([
      ...b.parcalar.map((p) => p),
      ...b.sasirtici.map((p) => { const q = [...p]; q[5] = RENKLER_RASTGELE[(Math.random() * RENKLER_RASTGELE.length) | 0]; return q; }),
    ]);
    d.parcalar = paletParcalari;
    d.sahne.innerHTML = `
      <div class="sk-sol">
        <h2 class="sk-baslik">${b.ad}</h2>
        <svg class="sk-tahta${b.silik ? " silik" : ""}" viewBox="-4 -4 108 108" aria-label="Resim tahtası">
          <g class="sk-yuvalar">${d.yuvalar.map((y) => sekilYolu(y.p[0], y.p[1], y.p[2], y.p[3], y.p[4], y.p[6]).replace(/^<(\w+)/, `<$1 class="sk-yuva" data-j="${y.j}"`)).join("")}</g>
          <g class="sk-yerlesen"></g>
        </svg>
      </div>
      <div class="sk-palet" aria-label="Şekiller">${paletParcalari.map((p, j) => `<div class="sk-parca" data-j="${j}" role="button" tabindex="0" aria-label="Şekil"></div>`).join("")}</div>`;
    d.tahta = d.sahne.querySelector(".sk-tahta");
    d.yerlesen = d.sahne.querySelector(".sk-yerlesen");
    d.palet = d.sahne.querySelector(".sk-palet");
    d.palet.querySelectorAll(".sk-parca").forEach(tasi);
    d.tahta.querySelectorAll(".sk-yuva").forEach((y) => y.addEventListener("click", (e) => { if (d.secili) birakNokta(d.secili, e.clientX, e.clientY); }));
    boyutla();
  }

  // Tahta ve paletteki parçalar aynı ölçekte; palet sığmazsa hepsi birlikte küçülür
  function boyutla() {
    if (!d || !d.tahta) return;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 20;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.15;
    d.sahne.classList.toggle("dikey", dikey);
    const S = Math.floor(dikey ? Math.min(W, (H - 40) * 0.56) : Math.min(H - 40, W * 0.55));
    d.sahne.style.setProperty("--s", S + "px");
    d.olcek = S / 108;
    let f = 1;
    const ciz = () => d.palet.querySelectorAll(".sk-parca").forEach((el) => {
      const p = d.parcalar[+el.dataset.j], w = p[3] * d.olcek * f, h = p[4] * d.olcek * f;
      el.innerHTML = `<svg width="${w}" height="${h}" viewBox="${p[1]} ${p[2]} ${p[3]} ${p[4]}" overflow="visible">${sekilYolu(p[0], p[1], p[2], p[3], p[4], p[6]).replace(/^<(\w+)/, `<$1 fill="${p[5]}" stroke="${koyu(p[5])}" stroke-width="${1 / f}"`)}</svg>`;
    });
    ciz();
    while (f > 0.4 && d.palet.scrollHeight > d.palet.clientHeight + 2) { f -= 0.08; ciz(); }
    d.f = f;
  }

  function secimiTemizle() { if (d.secili) d.secili.classList.remove("secili"); d.secili = null; }

  // Bırakılan noktadaki yuvalardan şekli uyan boş olanı bul
  function birakNokta(el, x, y) {
    secimiTemizle();
    const p = d.parcalar[+el.dataset.j], a = anahtar(p);
    const altta = document.elementsFromPoint(x, y).filter((e) => e.classList && e.classList.contains("sk-yuva"));
    let yuva = altta.find((e) => !e.classList.contains("dolu") && anahtar(BOLUMLER[d.idx].parcalar[+e.dataset.j]) === a);
    if (!yuva && altta.some((e) => !e.classList.contains("dolu"))) {
      const yanlis = altta.find((e) => !e.classList.contains("dolu"));
      [el, yanlis].forEach((x2) => { x2.classList.remove("salla"); void x2.getBoundingClientRect(); x2.classList.add("salla"); });
      setTimeout(() => { el.classList.remove("salla"); yanlis.classList.remove("salla"); }, 500);
      d.api.ses.hata();
      return;
    }
    if (!yuva) return;
    const j = +yuva.dataset.j, hedef = BOLUMLER[d.idx].parcalar[j];
    yuva.classList.add("dolu");
    // Küçük parça büyüğün üstünde kalsın: yuva çizim sırasındaki yerine ekle
    const tmp = document.createElementNS("http://www.w3.org/2000/svg", "g");
    tmp.innerHTML = sekilYolu(hedef[0], hedef[1], hedef[2], hedef[3], hedef[4], hedef[6]).replace(/^<(\w+)/, `<$1 fill="${p[5]}" stroke="${koyu(p[5])}" data-sira="${d.sira[j]}"`);
    const yeni = tmp.firstElementChild;
    const sonraki = [...d.yerlesen.children].find((c) => +c.dataset.sira > d.sira[j]);
    d.yerlesen.insertBefore(yeni, sonraki || null);
    el.remove();
    d.api.ses.yerlesti();
    if (!d.tahta.querySelector(".sk-yuva:not(.dolu)")) bitir();
  }

  function tasi(el) {
    let bx, by, kx, ky, aktif = false, hareket = false, hedef = null;
    el.addEventListener("pointerdown", (e) => {
      if (d.bitti) return;
      e.preventDefault();
      aktif = true; hareket = false;
      const r = el.getBoundingClientRect();
      bx = e.clientX; by = e.clientY; kx = e.clientX - r.left; ky = e.clientY - r.top;
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!hareket && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!hareket) {
        hareket = true; secimiTemizle(); yerTut(el); el.classList.add("surukleniyor");
        // Tahtaya gelince parça gerçek boyuna döner
        const p = d.parcalar[+el.dataset.j];
        el.querySelector("svg").setAttribute("width", p[3] * d.olcek);
        el.querySelector("svg").setAttribute("height", p[4] * d.olcek);
      }
      const svgEl = el.querySelector("svg"), sw = +svgEl.getAttribute("width"), sh = +svgEl.getAttribute("height");
      el.style.left = e.clientX - Math.max(23, sw / 2) + "px";
      el.style.top = e.clientY - Math.max(23, sh / 2) + "px";
      const alt = document.elementsFromPoint(e.clientX, e.clientY).find((x) => x.classList && x.classList.contains("sk-yuva") && !x.classList.contains("dolu"));
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
        const x = e.clientX, y = e.clientY;
        boyutla();
        if (d.palet.contains(el)) birakNokta(el, x, y);
      } else sec();
    };
    const sec = () => {
      const ayni = d.secili === el;
      secimiTemizle();
      if (!ayni) { d.secili = el; el.classList.add("secili"); d.api.ses.tik(); }
    };
    el.addEventListener("pointerup", birak);
    el.addEventListener("pointercancel", birak);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(); } });
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
        mesaj: son ? (herkes ? "Bütün resimleri şekillerle yaptın!" : "Son resim de tamam!") : `${BOLUMLER[d.idx].ad} hazır!`,
        son,
        ileri: () => yukle(d.idx + 1),
        bastan: () => { d.ilerleme.bitti = []; yukle(0); },
      });
    }, 1300);
  }

  window.SEKIL_BOLUMLER = BOLUMLER; // test için
  window.SEKIL_ANAHTAR = anahtar;
  window.SEKIL_CIZ = (p) => sekilYolu(p[0], p[1], p[2], p[3], p[4], p[6]).replace(/^<(\w+)/, `<$1 fill="${p[5]}" stroke="${koyu(p[5])}"`);
  window.SEKIL_DURUM = () => d && d.parcalar;

  window.Uygulama.oyunEkle(7, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      const yuvalar = [...d.sahne.querySelectorAll(".sk-yuva:not(.dolu)")];
      for (const el of d.sahne.querySelectorAll(".sk-palet .sk-parca")) {
        const a = anahtar(d.parcalar[+el.dataset.j]);
        const y = yuvalar.find((e) => anahtar(BOLUMLER[d.idx].parcalar[+e.dataset.j]) === a);
        if (y) return [{ el, hedef: y }];
      }
      return [];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const b = BOLUMLER[6];
      return `<div class="mini mini-sekil" aria-hidden="true"><svg viewBox="0 0 100 100">${b.parcalar.map((p) => sekilYolu(p[0], p[1], p[2], p[3], p[4], p[6]).replace(/^<(\w+)/, `<$1 fill="${p[5]}"`)).join("")}</svg></div>`;
    },
  });
})();
