/* Kalıbı Doldur (parça-bütün: kesik çizgili kalıbı parçalarla tam doldurmak).
   Ortada kareli bir kalıp var. Yandaki parçaları sürükleyip kalıba yerleştir; kalıp boşluksuz dolunca bölüm biter.
   Kalıba sığmayan parça geri döner. Yerleşmiş parçayı geri çekip almak için ona dokun.
   İleriki bölümlerde parçalar dönük gelir: parçaya dokununca döner.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "kalip";
  const RENK = ["#ff5a4e", "#2f86e0", "#ffc23a", "#2fb36a", "#8a5cf0", "#ff8a1f"];
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const P = {
    tek: [[0, 0]], domino: [[0, 0], [1, 0]], I3: [[0, 0], [1, 0], [2, 0]], L3: [[0, 0], [0, 1], [1, 1]],
    O4: [[0, 0], [1, 0], [0, 1], [1, 1]], I4: [[0, 0], [1, 0], [2, 0], [3, 0]], L4: [[0, 0], [0, 1], [0, 2], [1, 2]],
    T4: [[0, 0], [1, 0], [2, 0], [1, 1]], S4: [[1, 0], [2, 0], [0, 1], [1, 1]],
  };
  const T = [
    [["domino", "domino"], 0], [["I3", "domino"], 0], [["L3", "domino"], 0],
    [["L3", "L3"], 0], [["O4", "domino"], 0], [["I3", "L3", "tek"], 0],
    [["L3", "L3", "domino"], 1], [["O4", "L3"], 1], [["T4", "domino"], 1], [["L4", "L3"], 1], [["I4", "L3", "domino"], 1], [["T4", "L3"], 1],
    [["S4", "L3"], 1], [["L4", "T4"], 1], [["O4", "L4", "domino"], 1], [["T4", "S4"], 1], [["L3", "L3", "L3"], 1], [["L4", "L4", "domino"], 1],
    [["T4", "L4", "L3"], 1], [["S4", "S4", "domino"], 1], [["L4", "T4", "I3"], 1], [["O4", "T4", "L3"], 1], [["S4", "L4", "L3"], 1], [["T4", "T4", "domino"], 1],
    [["L4", "S4", "T4"], 1], [["I4", "L4", "T4"], 1], [["T4", "S4", "L4", "domino"], 1], [["L3", "L3", "T4", "L4"], 1], [["S4", "T4", "L4", "L3"], 1], [["T4", "T4", "L4", "S4"], 1],
  ];
  const norm = (h) => { const mx = Math.min(...h.map((p) => p[0])), my = Math.min(...h.map((p) => p[1])); return h.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
  const dondur = (h, n) => { for (let i = 0; i < n % 4; i++) h = norm(h.map(([x, y]) => [-y, x])); return norm(h); };
  const anahtar = (h) => norm(h).map((p) => p.join(",")).join(";");

  const BOLUMLER = T.map(([adlar, don], i) => {
    const r = tohumlu(5400 + i * 53);
    for (let deneme = 0; ; deneme++) {
      const dolu = new Set(), cozum = [];
      let tamam = true;
      adlar.forEach((ad, j) => {
        if (!tamam) return;
        const rot = Math.floor(r() * 4), h = dondur(P[ad], rot), adaylar = [];
        for (let ox = -4; ox <= 4; ox++) for (let oy = -4; oy <= 4; oy++) {
          const c = h.map(([x, y]) => [x + ox, y + oy]);
          if (c.some((p) => dolu.has(p.join(",")))) continue;
          if (j && !c.some(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => dolu.has(`${x + dx},${y + dy}`)))) continue;
          const tum = [...[...dolu].map((s) => s.split(",").map(Number)), ...c];
          const gw = Math.max(...tum.map((p) => p[0])) - Math.min(...tum.map((p) => p[0])), gh = Math.max(...tum.map((p) => p[1])) - Math.min(...tum.map((p) => p[1]));
          if (gw > 4 || gh > 4) continue;
          adaylar.push(c);
          if (!j) break;
        }
        if (!adaylar.length) { tamam = false; return; }
        const c = j ? adaylar[Math.floor(r() * adaylar.length)] : h;
        c.forEach((p) => dolu.add(p.join(",")));
        cozum.push({ ad, rot, hucre: c });
      });
      if (!tamam) continue;
      const tum = [...dolu].map((s) => s.split(",").map(Number)), mx = Math.min(...tum.map((p) => p[0])), my = Math.min(...tum.map((p) => p[1]));
      const kalip = tum.map(([x, y]) => [x - mx, y - my]);
      const gw = Math.max(...kalip.map((p) => p[0])) + 1, gh = Math.max(...kalip.map((p) => p[1])) + 1;
      const parcalar = cozum.map((c, j) => {
        const yer = c.hucre.map(([x, y]) => [x - mx, y - my]);
        const tepsiRot = don ? c.rot + 1 + Math.floor(r() * 3) : c.rot;
        return { ad: c.ad, hucre: dondur(P[c.ad], tepsiRot), renk: RENK[(j + i) % RENK.length], cozum: { gx: Math.min(...yer.map((p) => p[0])), gy: Math.min(...yer.map((p) => p[1])), hucre: norm(yer) } };
      });
      return { kalip, gw, gh, parcalar: parcalar.map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]), don: !!don, grup: Uygulama.seviye(i) };
    }
  });

  const parcaIc = (h, renk) => h.map(([x, y]) => `<i style="left:calc(var(--pc) * ${x});top:calc(var(--pc) * ${y});background:${renk}"></i>`).join("");
  const boyut = (h) => [Math.max(...h.map((p) => p[0])) + 1, Math.max(...h.map((p) => p[1])) + 1];

  const stil = `
  .kd { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#fff5f0, #fbe4da); }
  .kd-sahne { --c: 60px; --ct: 36px; position: relative; flex: 1; min-height: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; align-content: safe center; gap: 20px 34px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; touch-action: none; }
  .kd-tahta { --pc: var(--c); position: relative; flex: none; padding: 12px; border-radius: 22px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.1); }
  .kd-alan { position: relative; }
  .kd-alan > b { position: absolute; width: var(--c); height: var(--c); box-sizing: border-box; border: 3px dashed #c3a99a; border-radius: 8px; background: #fbefe8; }
  .kd-tepsi { --pc: var(--ct); display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 18px; max-width: min(100%, calc(var(--ct) * 9)); min-height: calc(var(--ct) * 2); padding: 14px; border-radius: 22px; background: rgba(255,255,255,.55); }
  .kd-parca { position: relative; flex: none; width: calc(var(--pc) * var(--w)); height: calc(var(--pc) * var(--h)); cursor: grab; touch-action: none; transition: transform .2s; }
  .kd-parca i { position: absolute; width: var(--pc); height: var(--pc); box-sizing: border-box; border: 2px solid rgba(0,0,0,.18); border-radius: calc(var(--pc) * .16); box-shadow: inset 0 calc(var(--pc) * -.1) 0 rgba(0,0,0,.15); }
  .kd-alan .kd-parca { position: absolute; left: calc(var(--c) * var(--gx)); top: calc(var(--c) * var(--gy)); cursor: pointer; }
  .kd-parca.suruk { position: fixed; z-index: 50; cursor: grabbing; filter: drop-shadow(0 10px 8px rgba(0,0,0,.25)); transition: none; }
  .kd-tut { flex: none; }
  .kd-parca.salla { animation: kd-salla .45s; }
  @keyframes kd-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .kd-parca.don-ipucu::after { content: "↻"; position: absolute; right: -12px; top: -16px; font: 900 20px/1 sans-serif; color: #1d2846; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("kd-stil")) { const st = document.createElement("style"); st.id = "kd-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="kd"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="kd-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".kd-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false;
    d.durum = b.parcalar.map((p) => ({ hucre: p.hucre, yer: null }));
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.sahne.innerHTML = `<div class="kd-tahta"><div class="kd-alan" style="width:calc(var(--c) * ${b.gw});height:calc(var(--c) * ${b.gh})">${b.kalip.map(([x, y]) => `<b style="left:calc(var(--c) * ${x});top:calc(var(--c) * ${y})"></b>`).join("")}</div></div><div class="kd-tepsi"></div>`;
    b.parcalar.forEach((_, j) => parcaCiz(j));
    boyutla();
  }
  function parcaCiz(j) {
    const b = BOLUMLER[d.idx], st = d.durum[j], [w, h] = boyut(st.hucre);
    let el = d.sahne.querySelector(`.kd-parca[data-j="${j}"]`);
    if (!el) { el = document.createElement("div"); el.className = "kd-parca"; el.dataset.j = j; el.onpointerdown = (e) => basla(e, j); }
    el.className = "kd-parca"; el.removeAttribute("style");
    el.style.setProperty("--w", w); el.style.setProperty("--h", h);
    el.innerHTML = parcaIc(st.hucre, b.parcalar[j].renk);
    if (st.yer) { el.style.setProperty("--gx", st.yer[0]); el.style.setProperty("--gy", st.yer[1]); d.sahne.querySelector(".kd-alan").appendChild(el); }
    else {
      const tepsi = d.sahne.querySelector(".kd-tepsi"), sonra = [...tepsi.children].find((x) => +x.dataset.j > j);
      tepsi.insertBefore(el, sonra || null);
    }
    return el;
  }
  function boyutla() {
    if (!d) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const tepsiHucre = b.parcalar.reduce((a, p) => a + boyut(p.hucre)[0] + 1, 0);
    let c;
    if (W > H * 1.1) c = Math.min((W * 0.5 - 30) / b.gw, (H - 40) / b.gh, 96);
    else c = Math.min((W - 30) / b.gw, (H * 0.52 - 30) / b.gh, 96);
    c = Math.max(32, Math.floor(c));
    let ct = Math.floor(c * 0.62);
    if (W <= H * 1.1) ct = Math.max(24, Math.min(ct, Math.floor((H - c * b.gh - 90) / 4.6), Math.floor((W - 30) * 2 / tepsiHucre)));
    d.sahne.style.setProperty("--c", c + "px"); d.sahne.style.setProperty("--ct", ct + "px");
  }
  function c() { return parseFloat(getComputedStyle(d.sahne).getPropertyValue("--c")); }

  function basla(e, j) {
    if (d.mesgul || e.button > 0) return;
    e.preventDefault();
    const el = e.currentTarget, r0 = el.getBoundingClientRect(), st = d.durum[j], [w, h] = boyut(st.hucre);
    const fx = ((e.clientX - r0.left) / r0.width) * w, fy = ((e.clientY - r0.top) / r0.height) * h;
    const x0 = e.clientX, y0 = e.clientY, benim = d.uid;
    let surukleniyor = false, tut = null;
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
    const tasi = (ev) => {
      if (!surukleniyor) {
        if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return;
        surukleniyor = true; st.yer = null; d.api.ses.tik();
        // Tepside yer tutucu bırak ki düzen kaymasın
        if (el.parentNode.classList.contains("kd-tepsi")) { tut = document.createElement("div"); tut.className = "kd-tut"; tut.style.width = r0.width + "px"; tut.style.height = r0.height + "px"; el.before(tut); }
        el.classList.add("suruk"); el.style.setProperty("--pc", "var(--c)");
      }
      const cc = c();
      el.style.left = ev.clientX - fx * cc + "px"; el.style.top = ev.clientY - fy * cc + "px";
    };
    const birak = (ev) => {
      el.removeEventListener("pointermove", tasi); el.removeEventListener("pointerup", birak); el.removeEventListener("pointercancel", birak);
      if (!d || benim !== d.uid) return;
      if (!surukleniyor) return dokun(j);
      const cc = c(), alan = d.sahne.querySelector(".kd-alan").getBoundingClientRect();
      const gx = Math.round((parseFloat(el.style.left) - alan.left) / cc), gy = Math.round((parseFloat(el.style.top) - alan.top) / cc);
      if (tut) tut.remove();
      if (sigar(j, gx, gy)) { st.yer = [gx, gy]; parcaCiz(j); d.api.ses.yerlesti(); kontrol(); }
      else { parcaCiz(j).classList.add("salla"); d.api.ses.hata(); }
    };
    el.addEventListener("pointermove", tasi); el.addEventListener("pointerup", birak); el.addEventListener("pointercancel", birak);
  }
  function sigar(j, gx, gy) {
    const b = BOLUMLER[d.idx], kalip = new Set(b.kalip.map((p) => p.join(","))), dolu = new Set();
    d.durum.forEach((s, k) => { if (k !== j && s.yer) s.hucre.forEach(([x, y]) => dolu.add(`${x + s.yer[0]},${y + s.yer[1]}`)); });
    return d.durum[j].hucre.every(([x, y]) => kalip.has(`${x + gx},${y + gy}`) && !dolu.has(`${x + gx},${y + gy}`));
  }
  function dokun(j) {
    const b = BOLUMLER[d.idx], st = d.durum[j];
    if (st.yer) { st.yer = null; parcaCiz(j); d.api.ses.tik(); return; }
    if (!b.don) { parcaCiz(j).classList.add("salla"); return; }
    st.hucre = dondur(st.hucre, 1); parcaCiz(j); d.api.ses.tik();
  }
  async function kontrol() {
    const b = BOLUMLER[d.idx], benim = d.uid;
    if (!d.durum.every((s) => s.yer)) return;
    // Tüm parçalar yerleşti ve hücre sayıları eşit: kalıp dolu
    d.mesgul = true; await bekle(600); if (!d || benim !== d.uid) return;
    bitir();
  }
  function bitir() {
    d.mesgul = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Kalıp ustası oldun!" : "En zor kalıbı da doldurdun!") : "Kalıp tamamen doldu!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }
  // Test ve ipucu için: j. parçanın çözüm konumu ve gereken dönme sayısı
  function hedef(j) {
    const b = BOLUMLER[d.idx], p = b.parcalar[j], st = d.durum[j];
    let don = 0; while (don < 4 && anahtar(dondur(st.hucre, don)) !== anahtar(p.cozum.hucre)) don++;
    const el = d.sahne.querySelector(`.kd-parca[data-j="${j}"]`), r0 = el.getBoundingClientRect(), [w] = boyut(st.hucre), pc = r0.width / w;
    const [cx, cy] = st.hucre[0], alan = d.sahne.querySelector(".kd-alan").getBoundingClientRect(), cc = c();
    const [tx, ty] = p.cozum.hucre[0];
    return { don, yer: !!st.yer, from: { x: r0.left + (cx + 0.5) * pc, y: r0.top + (cy + 0.5) * pc }, to: { x: alan.left + (p.cozum.gx + tx + 0.5) * cc, y: alan.top + (p.cozum.gy + ty + 0.5) * cc } };
  }

  window.KALIP_BOLUMLER = BOLUMLER;
  window.KALIP_HEDEF = (j) => d && hedef(j);
  window.KALIP_DURUM = () => d && d.durum.map((s) => s.yer);

  window.Uygulama.oyunEkle(54, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const b = BOLUMLER[d.idx];
      // Yanlış yere konmuş parça varsa onu göster
      const yanlis = d.durum.findIndex((s, j) => s.yer && (s.yer[0] !== b.parcalar[j].cozum.gx || s.yer[1] !== b.parcalar[j].cozum.gy || anahtar(s.hucre) !== anahtar(b.parcalar[j].cozum.hucre)));
      if (yanlis >= 0) return [{ el: d.sahne.querySelector(`.kd-parca[data-j="${yanlis}"]`) }];
      const j = d.durum.findIndex((s) => !s.yer); if (j < 0) return [];
      const el = d.sahne.querySelector(`.kd-parca[data-j="${j}"]`), h = hedef(j);
      if (h.don) { el.classList.add("don-ipucu"); return [{ el }]; }
      const kalipEl = [...d.sahne.querySelectorAll(".kd-alan > b")].filter((x, k) => b.parcalar[j].cozum.hucre.some(([cx, cy]) => b.kalip[k][0] === cx + b.parcalar[j].cozum.gx && b.kalip[k][1] === cy + b.parcalar[j].cozum.gy));
      return [{ el }, ...(tam ? kalipEl : kalipEl.slice(0, 1)).map((x) => ({ el: x }))];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const k = [[0, 0, 0], [1, 0, 0], [0, 1, 1], [1, 1, 1], [2, 1, 1], [2, 0, 2]];
      return `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="0 0 96 66">${k.map(([x, y, r]) => `<rect x="${x * 31 + 2}" y="${y * 31 + 2}" width="29" height="29" rx="5" fill="${RENK[r]}"/>`).join("")}</svg></div>`;
    },
  });
})();
