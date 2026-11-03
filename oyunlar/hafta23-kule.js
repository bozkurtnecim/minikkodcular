/* 23. Hafta: Kule Ustası (algoritma: adımları planlamak; küçük Hanoi kuleleri).
   Üç çubukta farklı boyda halkalar var. Üstteki resimdeki kuleyi kur: bir çubuğa dokun (en üstteki halka kalkar),
   başka bir çubuğa dokun (halka oraya iner). Halka sürüklenerek de taşınır. Büyük halka küçüğün üstüne konamaz.
   Noktalar en az kaç hamlede yapılabileceğini gösterir. 30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "kule";
  const RENK = ["#ff5a4e", "#ffc23a", "#2fb36a", "#2f86e0"]; // küçükten büyüğe

  // Durum: her halkanın (0 en küçük) hangi çubukta olduğu. Çubuktaki sıra boyla belirlenir.
  const kuleler = (durum) => [0, 1, 2].map((c) => durum.map((x, h) => [x, h]).filter(([x]) => x === c).map(([, h]) => h).sort((a, b) => b - a));
  function enKisa(bas, hedef) {
    const k = (s) => s.join("");
    const gor = new Map([[k(bas), 0]]), kuyruk = [bas];
    while (kuyruk.length) {
      const s = kuyruk.shift(), u = gor.get(k(s));
      if (k(s) === k(hedef)) return u;
      const kl = kuleler(s);
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
        if (a === b || !kl[a].length) continue;
        const ust = kl[a][kl[a].length - 1], alt = kl[b][kl[b].length - 1];
        if (alt != null && alt < ust) continue;
        const y = [...s]; y[ust] = b;
        if (!gor.has(k(y))) { gor.set(k(y), u + 1); kuyruk.push(y); }
      }
    }
    return -1;
  }

  // Bölümler: tohumlu rastgele başlangıç ve hedef, en kısa hamle sayısı aralıkta olacak biçimde
  const r = (() => { let s = 2727; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  function bul(n, min, max, tamTasima) {
    for (let deneme = 0; deneme < 4000; deneme++) {
      let bas, hedef;
      if (tamTasima) { const a = Math.floor(r() * 3), b = (a + 1 + Math.floor(r() * 2)) % 3; bas = Array(n).fill(a); hedef = Array(n).fill(b); }
      else { bas = Array.from({ length: n }, () => Math.floor(r() * 3)); hedef = Array.from({ length: n }, () => Math.floor(r() * 3)); }
      const u = enKisa(bas, hedef);
      if (u >= min && u <= max) return { bas, hedef, enAz: u };
    }
    throw new Error("bölüm bulunamadı");
  }
  const T = [
    [2, 1, 1], [2, 1, 2], [2, 2, 2],
    [2, 3, 3, true], [2, 2, 3], [2, 3, 3],
    [3, 2, 3], [3, 3, 3], [3, 3, 4], [3, 4, 4], [3, 4, 5], [3, 5, 5],
    [3, 5, 6], [3, 6, 6], [3, 7, 7, true], [3, 6, 7], [3, 7, 7], [3, 7, 7, true],
    [4, 4, 5], [4, 5, 5], [4, 5, 6], [4, 6, 6], [4, 6, 7], [4, 7, 7],
    [4, 7, 8], [4, 8, 8], [4, 8, 9], [4, 9, 9], [4, 9, 10], [4, 10, 11],
  ];
  const BOLUMLER = T.map(([n, a, b, tam], i) => ({ n, ...bul(n, a, b, tam), grup: Uygulama.seviye(i) }));

  const stil = `
  .ku { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f3efff, #e8e2fb); }
  .ku-sahne { --w: 200px; --hh: 30px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 16px; padding: 8px 16px 16px; overflow-y: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .ku-ust { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; }
  .ku-hedef { padding: 8px 12px; border-radius: 18px; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.1); }
  .ku-hedef svg { display: block; width: 210px; height: 74px; }
  .ku-noktalar { display: flex; flex-wrap: wrap; gap: 6px; max-width: 260px; }
  .ku-noktalar i { width: 18px; height: 18px; border-radius: 50%; border: 3px solid #b9a8ee; background: #fff; }
  .ku-noktalar i.dolu { background: #8a5cf0; border-color: #8a5cf0; }
  .ku-noktalar i.fazla { background: #ffc23a; border-color: #e3a008; }
  .ku-alan { display: flex; gap: 14px; align-items: flex-end; }
  .ku-cubuk { position: relative; width: var(--w); height: calc(var(--hh) * 5.6); display: flex; flex-direction: column-reverse; align-items: center; padding-bottom: 14px; cursor: pointer; border-radius: 18px; }
  .ku-cubuk::before { content: ""; position: absolute; bottom: 14px; width: 14px; height: calc(var(--hh) * 5); border-radius: 7px; background: #a8774a; }
  .ku-cubuk::after { content: ""; position: absolute; bottom: 0; left: 4%; right: 4%; height: 16px; border-radius: 8px; background: #8a5a33; }
  .ku-cubuk.secenek { background: rgba(138,92,240,.12); }
  .ku-cubuk.hedefte { background: rgba(47,134,224,.18); }
  .ku-halka { position: relative; z-index: 1; height: var(--hh); border-radius: calc(var(--hh) / 2); box-shadow: inset 0 -6px 0 rgba(0,0,0,.18), 0 3px 0 rgba(29,40,70,.15); transition: transform .2s; touch-action: none; }
  .ku-halka::after { content: ""; position: absolute; left: 12%; top: 18%; width: 22%; height: 22%; border-radius: 6px; background: rgba(255,255,255,.45); }
  .ku-halka.kalkti { transform: translateY(calc(var(--hh) * -1.4)); box-shadow: 0 10px 12px rgba(29,40,70,.25); }
  .ku-halka.olmaz { animation: ku-salla .45s; }
  .ku-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.05); border-radius: 999px; box-shadow: inset 0 -6px 0 rgba(0,0,0,.18), 0 10px 12px rgba(29,40,70,.3); }
  @keyframes ku-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ku-stil")) { const st = document.createElement("style"); st.id = "ku-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ku"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ku-sahne"></div></div>`;
    api.araclar.innerHTML = `<button class="dugme" type="button" data-bastan aria-label="Baştan başla">${api.IKON.tekrar}<span class="etiket">Baştan</span></button>`;
    api.araclar.querySelector("[data-bastan]").onclick = () => { if (d && !d.bitti) { d.api.ses.tik(); yukle(d.idx); } };
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ku-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { d.api.ses.tik(); yukle(i); } }); }

  // Küçük hedef resmi
  function hedefSvg(b) {
    const kl = kuleler(b.hedef), W = 210, cw = 70;
    let s = "";
    kl.forEach((kule, c) => {
      const x = c * cw + cw / 2;
      s += `<rect x="${x - 3}" y="8" width="6" height="58" rx="3" fill="#a8774a"/><rect x="${c * cw + 6}" y="64" width="${cw - 12}" height="8" rx="4" fill="#8a5a33"/>`;
      kule.forEach((h, j) => { const w = 18 + (h + 1) * (44 / b.n); s += `<rect x="${x - w / 2}" y="${52 - j * 12}" width="${w}" height="11" rx="5.5" fill="${RENK[h]}"/>`; });
    });
    return `<svg viewBox="0 0 ${W} 74" aria-label="Yapılacak kule">${s}</svg>`;
  }
  const halkaGen = (h) => `calc(var(--w) * ${(0.3 + (0.66 * (h + 1)) / BOLUMLER[d.idx].n).toFixed(3)})`;

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.bitti = false; d.secili = null; d.hamle = 0;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.durum = [...b.bas];
    d.sahne.innerHTML = `
      <div class="ku-ust"><div class="ku-hedef">${hedefSvg(b)}</div><div class="ku-noktalar" aria-label="Hamle sayısı">${"<i></i>".repeat(b.enAz)}</div></div>
      <div class="ku-alan">${[0, 1, 2].map((c) => `<div class="ku-cubuk" data-c="${c}" role="button" tabindex="0" aria-label="${c + 1}. çubuk"></div>`).join("")}</div>`;
    d.cubuklar = [...d.sahne.querySelectorAll(".ku-cubuk")];
    d.cubuklar.forEach((el) => el.addEventListener("pointerdown", (e) => cubukBas(e, +el.dataset.c)));
    ciz();
    boyutla();
  }
  function ciz() {
    const kl = kuleler(d.durum);
    d.cubuklar.forEach((el, c) => {
      el.innerHTML = kl[c].map((h) => `<div class="ku-halka" data-h="${h}" style="width:${halkaGen(h)};background:${RENK[h]}"></div>`).join("");
      el.classList.toggle("secenek", d.secili != null && d.secili !== c);
    });
    if (d.secili != null) { const ust = d.cubuklar[d.secili].lastElementChild; if (ust) ust.classList.add("kalkti"); }
    const n = d.sahne.querySelectorAll(".ku-noktalar i");
    n.forEach((x, j) => { x.classList.toggle("dolu", j < d.hamle); });
    const nk = d.sahne.querySelector(".ku-noktalar");
    nk.querySelectorAll("i.fazla").forEach((x) => x.remove());
    for (let j = BOLUMLER[d.idx].enAz; j < d.hamle; j++) nk.insertAdjacentHTML("beforeend", `<i class="fazla"></i>`);
  }
  function boyutla() {
    if (!d || !d.cubuklar) return;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 40;
    if (W < 50 || H < 50) return;
    const w = Math.max(90, Math.min(240, Math.floor((W - 28) / 3)));
    const hh = Math.max(20, Math.min(40, Math.floor((H - 130) / 6.2), Math.floor(w / 5.5)));
    d.sahne.style.setProperty("--w", w + "px");
    d.sahne.style.setProperty("--hh", hh + "px");
  }

  // Taşıma: kurala uyuyorsa halka iner, uymuyorsa sallanıp geri döner
  function tasi(a, b) {
    if (a === b) return false;
    const kl = kuleler(d.durum), ust = kl[a][kl[a].length - 1], alt = kl[b][kl[b].length - 1];
    if (ust == null) return false;
    if (alt != null && alt < ust) {
      const el = d.cubuklar[a].lastElementChild;
      d.api.ses.hata();
      if (el) { el.classList.remove("kalkti"); void el.offsetWidth; el.classList.add("olmaz"); }
      return false;
    }
    d.durum[ust] = b; d.hamle++;
    d.api.ses.adim(d.hamle % 8);
    return true;
  }
  function cubukBas(e, c) {
    if (d.bitti) return;
    e.preventDefault();
    const kl = kuleler(d.durum);
    // Halkayı sürükleme
    if (d.secili == null && kl[c].length) {
      const el = d.cubuklar[c].lastElementChild, rr = el.getBoundingClientRect();
      let ucan = null, hedef = null;
      const bx = e.clientX, by = e.clientY;
      const hareket = (ev) => {
        if (!ucan && Math.hypot(ev.clientX - bx, ev.clientY - by) < 10) return;
        if (!ucan) { ucan = document.createElement("div"); ucan.className = "ku-tasinan"; Object.assign(ucan.style, { width: rr.width + "px", height: rr.height + "px", background: el.style.background }); document.body.appendChild(ucan); el.style.visibility = "hidden"; }
        ucan.style.left = ev.clientX + "px"; ucan.style.top = ev.clientY + "px";
        const alt = document.elementFromPoint(ev.clientX, ev.clientY), cb = alt && alt.closest(".ku-cubuk");
        if (hedef && hedef !== cb) hedef.classList.remove("hedefte");
        hedef = cb || null; if (hedef) hedef.classList.add("hedefte");
      };
      const birak = () => {
        window.removeEventListener("pointermove", hareket); window.removeEventListener("pointerup", birak); window.removeEventListener("pointercancel", birak);
        if (ucan) {
          ucan.remove(); el.style.visibility = "";
          if (hedef) { hedef.classList.remove("hedefte"); const ok = tasi(c, +hedef.dataset.c); ciz(); if (ok) kontrol(); else setTimeout(ciz, 460); }
        } else { d.secili = c; d.api.ses.tik(); ciz(); }
      };
      window.addEventListener("pointermove", hareket); window.addEventListener("pointerup", birak); window.addEventListener("pointercancel", birak);
      return;
    }
    if (d.secili == null) return;
    if (d.secili === c) { d.secili = null; ciz(); return; }
    const a = d.secili;
    d.secili = null;
    const ok = tasi(a, c);
    if (ok) { ciz(); kontrol(); } else setTimeout(ciz, 460);
  }
  async function kontrol() {
    const b = BOLUMLER[d.idx];
    if (d.durum.join("") !== b.hedef.join("")) return;
    d.bitti = true;
    const benim = d.uid;
    await bekle(500);
    if (!d || benim !== d.uid) return;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün kuleleri kurdun, kule ustası!" : "Son kule de kuruldu!") : d.hamle <= b.enAz ? "En az hamleyle kurdun!" : "Kule tamam!",
      son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  // Test ve el gösterimi için: en kısa yolun ilk hamlesi
  function ilkHamle(s, hedef) {
    const u = enKisa(s, hedef);
    const kl = kuleler(s);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) {
      if (a === b || !kl[a].length) continue;
      const ust = kl[a][kl[a].length - 1], alt = kl[b][kl[b].length - 1];
      if (alt != null && alt < ust) continue;
      const y = [...s]; y[ust] = b;
      if (enKisa(y, hedef) === u - 1) return [a, b];
    }
    return null;
  }
  window.KULE_BOLUMLER = BOLUMLER;
  window.KULE_ILK = () => d && ilkHamle(d.durum, BOLUMLER[d.idx].hedef);

  window.Uygulama.oyunEkle(23, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d || d.bitti) return [];
      const h = ilkHamle(d.durum, BOLUMLER[d.idx].hedef);
      if (!h) return [];
      return [{ el: d.cubuklar[h[0]].lastElementChild, hedef: d.cubuklar[h[1]] }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="0 0 100 100" style="width:60px;height:60px"><rect x="47" y="10" width="6" height="74" rx="3" fill="#a8774a"/><rect x="34" y="34" width="32" height="14" rx="7" fill="#ff5a4e"/><rect x="26" y="50" width="48" height="14" rx="7" fill="#ffc23a"/><rect x="16" y="66" width="68" height="14" rx="7" fill="#2fb36a"/><rect x="8" y="82" width="84" height="8" rx="4" fill="#8a5a33"/></svg></div>`; },
  });
})();
