/* Pizza Paylaş (parça-bütün: eşit parçalar, yarım ve çeyrek).
   Pizzanın (sonra pastanın) bir dilimi eksik; boşluk kesik çizgiyle görünür. Aşağıdaki dilimlerden boşluğa tam uyana dokun.
   Dilimler boyuna göre değişir (yarım, üçte bir, çeyrek, altıda bir, sekizde bir); doğru boyda olan yerine oturur.
   Zor bölümlerde iki boşluk ve dikdörtgen pasta gelir. 30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "pizza";
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [şekil, dilim sayısı, boşluklar (her biri kaç dilim), seçenek kesirleri (dilim sayısı/payda)]
  const T = [
    ["pizza", 2, [1], [[1, 2], [1, 4]]], ["pizza", 4, [1], [[1, 4], [1, 2]]], ["pizza", 2, [1], [[1, 2], [1, 4], [1, 8]]],
    ["pizza", 4, [2], [[1, 2], [1, 4], [1, 8]]], ["pizza", 3, [1], [[1, 3], [1, 2], [1, 6]]], ["pizza", 4, [1], [[1, 4], [1, 3], [1, 2]]],
    ["pizza", 6, [1], [[1, 6], [1, 4], [1, 3]]], ["pizza", 8, [2], [[1, 4], [1, 8], [1, 2]]], ["pizza", 6, [2], [[1, 3], [1, 6], [1, 2], [1, 4]]], ["pizza", 8, [1], [[1, 8], [1, 6], [1, 4], [1, 3]]], ["pizza", 6, [3], [[1, 2], [1, 3], [2, 3], [1, 6]]], ["pizza", 8, [4], [[1, 2], [1, 4], [3, 8], [3, 4]]],
    ["pasta", 2, [1], [[1, 2], [1, 4], [1, 3]]], ["pasta", 4, [1], [[1, 4], [1, 2], [1, 3]]], ["pasta", 3, [1], [[1, 3], [1, 2], [1, 4], [1, 6]]], ["pizza", 4, [1, 1], [[1, 4], [1, 2], [1, 8]]], ["pasta", 6, [2], [[1, 3], [1, 6], [1, 2], [1, 4]]], ["pizza", 6, [1, 2], [[1, 6], [1, 3], [1, 2], [1, 4]]],
    ["pizza", 8, [1, 2], [[1, 8], [1, 4], [1, 2], [1, 6]]], ["pasta", 4, [1, 2], [[1, 4], [1, 2], [1, 3], [1, 6]]], ["pizza", 6, [1, 3], [[1, 6], [1, 2], [1, 3], [1, 4]]], ["pasta", 6, [1, 2], [[1, 6], [1, 3], [1, 2], [1, 4]]], ["pizza", 8, [2, 3], [[1, 4], [3, 8], [1, 2], [1, 8], [1, 3]]], ["pasta", 8, [1, 3], [[1, 8], [3, 8], [1, 4], [1, 2]]],
    ["pizza", 12, [2, 3], [[1, 6], [1, 4], [1, 3], [1, 12], [1, 2]]], ["pasta", 6, [2, 3], [[1, 3], [1, 2], [1, 6], [2, 3]]], ["pizza", 8, [2, 4], [[1, 4], [1, 2], [3, 8], [1, 8], [3, 4]]], ["pasta", 8, [2, 4], [[1, 4], [1, 2], [1, 8], [3, 8]]], ["pizza", 12, [3, 4], [[1, 4], [1, 3], [1, 6], [1, 2], [5, 12]]], ["pizza", 12, [2, 6], [[1, 6], [1, 2], [1, 3], [1, 4], [2, 3]]],
  ];
  const BOLUMLER = T.map(([sekil, n, bosluk, sec], i) => {
    const r = tohumlu(4400 + i * 37);
    // Boşlukları rastgele yere koy, çakışmasın, aralarında en az bir dilim kalsın
    let baslar;
    for (let d = 0; d < 200; d++) {
      baslar = []; let ok = true; const dolu = new Set();
      for (const k of bosluk) {
        const s = Math.floor(r() * n), hucre = Array.from({ length: k }, (_, j) => (s + j) % n);
        if (sekil === "pasta" && s + k > n) { ok = false; break; }
        const komsu = (h, y) => (sekil === "pizza" ? (h + y + n) % n : h + y);
        if (hucre.some((h) => dolu.has(h) || dolu.has(komsu(h, 1)) || dolu.has(komsu(h, -1)))) { ok = false; break; }
        hucre.forEach((h) => dolu.add(h)); baslar.push(s);
      }
      if (ok) break;
    }
    const secenek = sec.map(([p, q]) => ({ p, q })).map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    return { sekil, n, bosluklar: bosluk.map((k, j) => ({ k, bas: baslar[j], kesir: k / n })), secenek, grup: Uygulama.seviye(i) };
  });

  // ---------- Çizim ----------
  const R = 44, C = 50;
  const nok = (a, r = R) => [C + r * Math.cos(a), C + r * Math.sin(a)];
  const dilimYol = (a0, a1, r = R) => { const [x0, y0] = nok(a0, r), [x1, y1] = nok(a1, r); return `M${C} ${C} L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1} Z`; };
  const SUSLER = [[0.55, 0.35], [0.3, 0.6], [0.7, 0.75], [0.45, 0.85], [0.8, 0.45], [0.25, 0.3]];
  // Pizza dilimi (merkezden a0'dan a1'e), üstünde sucuk ve zeytin
  function pizzaDilim(a0, a1, id) {
    const yol = dilimYol(a0, a1), kenar = dilimYol(a0, a1, R).replace(/^M[^L]+L/, "M");
    let sus = "";
    SUSLER.forEach(([t, u], j) => { const a = a0 + (a1 - a0) * t, [x, y] = nok(a, R * (0.35 + u * 0.5)); sus += j % 2 ? `<circle cx="${x}" cy="${y}" r="2.6" fill="#2b2f3a"/>` : `<circle cx="${x}" cy="${y}" r="4.6" fill="#d9412f"/>`; });
    return `<g><clipPath id="${id}"><path d="${yol}"/></clipPath><path d="${yol}" fill="#ffd56b"/><g clip-path="url(#${id})">${sus}</g><path d="${yol}" fill="none" stroke="#e8a33a" stroke-width="2"/><path d="${kenar}" fill="none" stroke="#d98b2b" stroke-width="5" stroke-linecap="round"/></g>`;
  }
  // Pasta dilimi: dikdörtgen pastanın j..j+k şeridi
  const PG = 84, PY = 28, PH = 44, PX = 8;
  function pastaDilim(n, j, k) {
    const w = PG / n, x = PX + j * w, gen = w * k;
    return `<g><rect x="${x}" y="${PY}" width="${gen}" height="${PH}" fill="#f6c9d8" stroke="#e08aa6" stroke-width="2"/><rect x="${x}" y="${PY}" width="${gen}" height="12" fill="#fff4f8"/><rect x="${x}" y="${PY + 26}" width="${gen}" height="5" fill="#b8476b" opacity=".6"/>${Array.from({ length: k }, (_, q) => `<circle cx="${x + w * (q + 0.5)}" cy="${PY - 2}" r="4.5" fill="#e8312f"/>`).join("")}</g>`;
  }
  const aci = (n, j) => -Math.PI / 2 + (2 * Math.PI * j) / n;
  function butun(b, dolu) {
    let s = "";
    if (b.sekil === "pizza") {
      s += `<circle cx="50" cy="50" r="48" fill="#f3f6fb" stroke="#d6dfeb" stroke-width="2"/>`;
      for (let j = 0; j < b.n; j++) {
        const bos = b.bosluklar.findIndex((x, q) => !dolu.has(q) && ((j - x.bas + b.n) % b.n) < x.k);
        if (bos < 0) s += pizzaDilim(aci(b.n, j), aci(b.n, j + 1), `pz${j}`);
      }
      b.bosluklar.forEach((x, q) => { if (!dolu.has(q)) s += `<path class="pz-bosluk" data-q="${q}" d="${dilimYol(aci(b.n, x.bas), aci(b.n, x.bas + x.k))}" fill="#fff" stroke="#9fb7d4" stroke-width="2.5" stroke-dasharray="5 4"/>`; });
    } else {
      s += `<rect x="4" y="${PY + PH - 2}" width="92" height="10" rx="5" fill="#d6dfeb"/>`;
      for (let j = 0; j < b.n; j++) {
        const bos = b.bosluklar.findIndex((x, q) => !dolu.has(q) && j >= x.bas && j < x.bas + x.k);
        if (bos < 0) s += pastaDilim(b.n, j, 1);
      }
      b.bosluklar.forEach((x, q) => { if (!dolu.has(q)) s += `<rect class="pz-bosluk" data-q="${q}" x="${PX + (PG / b.n) * x.bas}" y="${PY}" width="${(PG / b.n) * x.k}" height="${PH}" fill="#fff" stroke="#9fb7d4" stroke-width="2.5" stroke-dasharray="5 4"/>`; });
    }
    return `<svg viewBox="0 0 100 ${b.sekil === "pizza" ? 100 : 90}" aria-hidden="true">${s}</svg>`;
  }
  // Seçenek: tek parça (kesir p/q), pizzada dilim, pastada şerit
  function parca(b, { p, q }, i) {
    if (b.sekil === "pizza") return `<svg viewBox="0 0 100 100" aria-hidden="true">${pizzaDilim(aci(q, 0), aci(q, p), `ps${i}`)}</svg>`;
    // Pastada payda dilim sayısına çevrilir (aynı genişlik ölçeği)
    return `<svg viewBox="0 0 100 90" aria-hidden="true">${pastaDilim(1, 0, 1).replace(/width="84"/g, `width="${PG * (p / q)}"`).replace(/cx="50"/, `cx="${PX + (PG * (p / q)) / 2}"`)}</svg>`;
  }

  const stil = `
  .pz { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#fff7ec, #fdeedd); }
  .pz-sahne { --r: 340px; --s: 110px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 28px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .pz-sahne.dikey { flex-direction: column; gap: 14px; justify-content: safe center; }
  .pz-butun { width: var(--r); flex: none; padding: 14px; border-radius: 50%; background: radial-gradient(#fff, #fdeedd 70%); }
  .pz-butun.pasta { border-radius: 26px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.1); }
  .pz-butun svg { width: 100%; height: auto; display: block; }
  .pz-butun .pz-bosluk { animation: pz-nefes 1.6s ease-in-out infinite; }
  @keyframes pz-nefes { 50% { stroke: #2f86e0; } }
  .pz-butun.tamam svg { animation: pz-zipla .6s ease; }
  @keyframes pz-zipla { 40% { transform: scale(1.06) rotate(-3deg); } }
  .pz-secenekler { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; max-width: calc(var(--s) * 3 + 40px); }
  .pz-parca { width: var(--s); height: var(--s); padding: 8px; border: 0; border-radius: 20px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.14); cursor: pointer; transition: transform .15s, opacity .3s; }
  .pz-parca svg { width: 100%; height: 100%; display: block; }
  .pz-parca:active { transform: translateY(3px); }
  .pz-parca.yanlis { animation: pz-salla .45s; }
  .pz-parca.gitti { opacity: 0; transform: scale(.4); pointer-events: none; }
  @keyframes pz-salla { 20%, 60% { transform: translateX(-8px) rotate(-6deg); } 40%, 80% { transform: translateX(8px) rotate(6deg); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("pz-stil")) { const st = document.createElement("style"); st.id = "pz-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="pz"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="pz-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".pz-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.dolu = new Set();
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.sahne.innerHTML = `<div class="pz-butun ${b.sekil}"></div>
      <div class="pz-secenekler">${b.secenek.map((s, j) => `<button class="pz-parca" type="button" data-j="${j}" aria-label="Parça">${parca(b, s, j)}</button>`).join("")}</div>`;
    d.butun = d.sahne.querySelector(".pz-butun");
    d.butun.innerHTML = butun(b, d.dolu);
    d.sahne.querySelectorAll(".pz-parca").forEach((el) => (el.onclick = () => sec(el)));
    boyutla();
  }
  function boyutla() {
    if (!d || !d.butun) return;
    const n = BOLUMLER[d.idx].secenek.length, sut = Math.min(3, n), sat = Math.ceil(n / sut);
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.05;
    d.sahne.classList.toggle("dikey", dikey);
    let r, s;
    if (dikey) { s = Math.min((W - 28 - (sut - 1) * 14) / sut, 120); r = Math.min(W - 40, H - sat * (s + 14) - 60, 420); }
    else { r = Math.min(H - 40, W * 0.5, 460); s = Math.min((W - r - 100 - (sut - 1) * 14) / sut, (H - (sat - 1) * 14) / sat, 140); }
    d.sahne.style.setProperty("--r", Math.floor(Math.max(170, r)) + "px");
    d.sahne.style.setProperty("--s", Math.floor(Math.max(70, s)) + "px");
  }
  // Seçilen parça boş bir boşluğa tam uyuyor mu (kesir eşit)
  async function sec(el) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid, s = b.secenek[+el.dataset.j];
    const q = b.bosluklar.findIndex((x, j) => !d.dolu.has(j) && Math.abs(x.kesir - s.p / s.q) < 1e-9);
    if (q < 0) { el.classList.remove("yanlis"); void el.offsetWidth; el.classList.add("yanlis"); d.api.ses.hata(); return; }
    d.mesgul = true;
    el.classList.add("gitti"); d.dolu.add(q);
    d.butun.innerHTML = butun(b, d.dolu); d.api.ses.yerlesti();
    // Aynı boydan başka boşluk varsa parça yeniden kullanılabilsin
    if (b.bosluklar.some((x, j) => !d.dolu.has(j) && Math.abs(x.kesir - s.p / s.q) < 1e-9)) setTimeout(() => el.classList.remove("gitti"), 400);
    await bekle(350); if (!d || benim !== d.uid) return;
    d.mesgul = false;
    if (d.dolu.size === b.bosluklar.length) {
      d.mesgul = true; d.butun.classList.add("tamam");
      await bekle(800); if (!d || benim !== d.uid) return;
      bitir();
    }
  }
  function bitir() {
    d.mesgul = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün pizzalar ve pastalar tamam, afiyet olsun!" : "Son pasta da tamam!") : BOLUMLER[d.idx].sekil === "pizza" ? "Pizza tamamlandı!" : "Pasta tamamlandı!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.PIZZA_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(44, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const b = BOLUMLER[d.idx], q = b.bosluklar.findIndex((_, j) => !d.dolu.has(j));
      if (q < 0) return [];
      const j = b.secenek.findIndex((s) => Math.abs(b.bosluklar[q].kesir - s.p / s.q) < 1e-9);
      return [{ el: d.butun.querySelector(`.pz-bosluk[data-q="${q}"]`) }, { el: d.sahne.querySelector(`.pz-parca[data-j="${j}"]`) }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-sekil" aria-hidden="true"><svg viewBox="0 0 100 100">${pizzaDilim(aci(4, 1), aci(4, 4), "kp")}<path d="${dilimYol(aci(4, 0), aci(4, 1))}" fill="#fff" stroke="#9fb7d4" stroke-width="2.5" stroke-dasharray="5 4"/></svg></div>`; },
  });
})();
