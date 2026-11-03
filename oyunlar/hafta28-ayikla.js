/* 28. Hafta: Ayıklama Makinesi (koşul: "eğer kırmızıysa bu sepete, değilse…").
   Banttaki eşyalar makineden tek tek geçer. Her kapının bir koşul yeri var: renk, şekil ya da "?" (değilse).
   Eşya, koşulunu tuttuğu İLK kapının sepetine düşer. Sepetlerde neyin olması gerektiği silik görünür;
   koşulları yerleştir ve "Çalıştır"a bas. Hiçbir kapıya uymayan eşya yere düşer.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12 (çok zorda kapıların sırası önemlidir). */
(function () {
  const KAYIT = "ayikla";
  const RENK = { k: "#ff5a4e", m: "#2f86e0", s: "#ffc23a", y: "#2fb36a" };
  const RENK_AD = { k: "Kırmızı", m: "Mavi", s: "Sarı", y: "Yeşil" };
  const SEKIL_AD = { daire: "Daire", kare: "Kare", yildiz: "Yıldız", kalp: "Kalp" };
  const yildizN = (() => { const n = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 18 : 40, a = (Math.PI / 5) * i - Math.PI / 2; n.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(53 + Math.sin(a) * r).toFixed(1)}`); } return n.join(" "); })();
  function sekil(ad, dolgu, kenar, ek = "") {
    const o = `fill="${dolgu}" stroke="${kenar}" stroke-width="6" stroke-linejoin="round" ${ek}`;
    if (ad === "daire") return `<circle cx="50" cy="50" r="36" ${o}/>`;
    if (ad === "kare") return `<rect x="15" y="15" width="70" height="70" rx="12" ${o}/>`;
    if (ad === "yildiz") return `<polygon points="${yildizN}" ${o}/>`;
    return `<path d="M50 86 C24 66 10 52 13 35 C16 18 38 14 50 31 C62 14 84 18 87 35 C90 52 76 66 50 86 Z" ${o}/>`;
  }
  const esyaSvg = (e) => `<svg viewBox="0 0 100 100" aria-hidden="true">${sekil(e.sekil, RENK[e.renk], "rgba(0,0,0,.18)")}<ellipse cx="38" cy="36" rx="9" ry="5" fill="#fff" opacity=".45" transform="rotate(-30 38 36)"/></svg>`;
  const kosulSvg = (k) => {
    if (k.diger) return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="#eef2f8" stroke="#9aa7b8" stroke-width="5" stroke-dasharray="9 7"/><text x="50" y="66" text-anchor="middle" font-family="Baloo 2, Arial Rounded MT Bold, sans-serif" font-weight="800" font-size="48" fill="#6b7690">?</text></svg>`;
    if (k.renk) return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 10 C30 36 20 50 20 64 a30 30 0 0 0 60 0 C80 50 70 36 50 10 Z" fill="${RENK[k.renk]}" stroke="rgba(0,0,0,.15)" stroke-width="4"/><ellipse cx="40" cy="60" rx="7" ry="11" fill="#fff" opacity=".4"/></svg>`;
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${sekil(k.sekil, "#fff", "#5d6878", 'stroke-dasharray="0"')}</svg>`;
  };
  const kosulAdi = (k) => (k.diger ? "Değilse" : k.renk ? RENK_AD[k.renk] : SEKIL_AD[k.sekil]);
  const kosulId = (k) => (k.diger ? "?" : k.renk ? "r" + k.renk : "s" + k.sekil);
  const uyar = (k, e) => k.diger || (k.renk ? e.renk === k.renk : e.sekil === k.sekil);
  // Eşyaların sepetlere dağılımı (-1: yere düştü)
  const dagit = (kosullar, esyalar) => esyalar.map((e) => kosullar.findIndex((k) => k && uyar(k, e)));

  // ---------- Bölümler ----------
  const r = (() => { let s = 2828; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const sec = (a) => a[Math.floor(r() * a.length)];
  const karistir = (a) => a.map((x) => [r(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const RENKLER = Object.keys(RENK), SEKILLER = Object.keys(SEKIL_AD);
  // tur: "renk" | "sekil" | "karma"; diger: son kapı "?" mi; sira: çok zorda sıra önemli olsun mu
  function bolum({ kapi, tur, diger, n, nRenk = 3, nSekil = 3, sira = false, sabitSekil = null }) {
    for (let deneme = 0; deneme < 3000; deneme++) {
      const renkler = karistir(RENKLER).slice(0, nRenk), sekiller = karistir(SEKILLER).slice(0, nSekil);
      const kosullar = [];
      const kosulSay = diger ? kapi - 1 : kapi;
      for (let j = 0; j < kosulSay; j++) {
        const t = tur === "karma" ? (j % 2 ? "sekil" : "renk") : tur;
        const k = t === "renk" ? { renk: renkler[j % renkler.length] } : { sekil: sekiller[j % sekiller.length] };
        if (kosullar.some((x) => kosulId(x) === kosulId(k))) continue;
        kosullar.push(k);
      }
      if (kosullar.length !== kosulSay) continue;
      if (diger) kosullar.push({ diger: true });
      const esyalar = Array.from({ length: n }, () => ({ renk: sec(renkler), sekil: sabitSekil || sec(sekiller) }));
      const dag = dagit(kosullar, esyalar);
      if (dag.includes(-1)) continue;
      if (kosullar.some((_, j) => !dag.includes(j))) continue;
      // Sıra önemli: en az bir eşya iki koşula birden uymalı (renk ve şekil)
      if (sira && !esyalar.some((e) => kosullar.filter((k) => !k.diger && uyar(k, e)).length > 1)) continue;
      // Palet: doğru koşullar + birkaç yanıltıcı
      const yanil = karistir([...renkler.map((x) => ({ renk: x })), ...sekiller.map((x) => ({ sekil: x }))].filter((k) => !kosullar.some((y) => kosulId(y) === kosulId(k)) && (tur !== "renk" || k.renk) && (tur !== "sekil" || k.sekil))).slice(0, 2);
      const palet = karistir([...kosullar, ...yanil]);
      return { kosullar, esyalar, hedef: dag, palet };
    }
    throw new Error("bölüm kurulamadı");
  }
  const T = [
    { kapi: 2, tur: "renk", diger: true, n: 3, nRenk: 2, sabitSekil: "daire" }, { kapi: 2, tur: "renk", diger: true, n: 4, nRenk: 2, sabitSekil: "kare" }, { kapi: 2, tur: "renk", diger: true, n: 4, nRenk: 3, sabitSekil: "daire" },
    { kapi: 2, tur: "sekil", diger: true, n: 4, nSekil: 2 }, { kapi: 2, tur: "sekil", diger: true, n: 5, nSekil: 3 }, { kapi: 2, tur: "renk", diger: false, n: 4, nRenk: 2 },
    { kapi: 3, tur: "renk", diger: true, n: 5 }, { kapi: 3, tur: "renk", diger: false, n: 5, nRenk: 3 }, { kapi: 3, tur: "sekil", diger: true, n: 5 },
    { kapi: 3, tur: "sekil", diger: false, n: 6, nSekil: 3 }, { kapi: 3, tur: "renk", diger: true, n: 6, nRenk: 4 }, { kapi: 3, tur: "sekil", diger: true, n: 6, nSekil: 4 },
    { kapi: 2, tur: "karma", diger: true, n: 5 }, { kapi: 3, tur: "karma", diger: true, n: 5 }, { kapi: 3, tur: "karma", diger: true, n: 6 },
    { kapi: 3, tur: "karma", diger: true, n: 6, nRenk: 4 }, { kapi: 3, tur: "karma", diger: true, n: 7 }, { kapi: 3, tur: "karma", diger: true, n: 7, nSekil: 4 },
  ];
  for (let i = 0; i < 12; i++) T.push({ kapi: i < 6 ? 3 : 4, tur: "karma", diger: i % 3 !== 2, n: 6 + (i % 3), nRenk: 3 + (i % 2), nSekil: 3, sira: true });
  const BOLUMLER = T.map((t, i) => ({ ...bolum(t), grup: Uygulama.seviye(i) }));

  // ---------- Oyun ----------
  const stil = `
  .ay { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eef3f8, #dde6f0); }
  .ay-sahne { --k: 64px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 12px; padding: 8px 16px 16px; overflow-y: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .ay-bant { display: flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 999px; background: repeating-linear-gradient(90deg, #5d6878 0 18px, #6b7688 18px 36px); box-shadow: inset 0 -6px 0 rgba(0,0,0,.2); min-height: calc(var(--k) * .8); }
  .ay-bant .e { width: calc(var(--k) * .78); height: calc(var(--k) * .78); transition: transform .3s, opacity .3s; }
  .ay-bant .e svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 3px 0 rgba(0,0,0,.25)); }
  .ay-bant .e.gitti { opacity: .2; transform: scale(.7); }
  .ay-bant .e.simdi { transform: translateY(-10px) scale(1.15); }
  .ay-kapilar { display: grid; gap: 10px; }
  .ay-kapi { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 20px; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.12); }
  .ay-kapi .no { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: var(--mor); color: #fff; font-family: var(--f-baslik); font-weight: 800; flex: none; }
  .ay-kapi.yanar { outline: 5px solid var(--sari); }
  .ay-yer { width: var(--p); height: var(--p); flex: none; border-radius: 16px; border: 3px dashed var(--cizgi); background: var(--zemin); display: grid; place-items: center; box-sizing: border-box; cursor: pointer; }
  .ay-yer.dolu { border: 3px solid #e1e7f0; background: #fff; }
  .ay-yer svg { width: 84%; height: 84%; pointer-events: none; }
  .ay-yer.siradaki { border-color: var(--mavi); background: #e3f0ff; }
  .ay-yer.hedefte { outline: 4px solid var(--mavi); }
  .ay-ok { width: 26px; height: 18px; color: #9aa7b8; flex: none; }
  .ay-sepet { position: relative; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; min-width: calc(var(--k) * 2.2); min-height: calc(var(--k) * .8); padding: 6px 10px; border-radius: 10px 10px 22px 22px; background: #e9c48f; box-shadow: inset 0 -6px 0 #c99a5c; }
  .ay-sepet .g { width: calc(var(--k) * .6); height: calc(var(--k) * .6); opacity: .3; filter: grayscale(.2); }
  .ay-sepet .g.geldi { opacity: 1; filter: none; animation: ay-dus .35s; }
  .ay-sepet .g.yanlis { opacity: 1; filter: none; outline: 3px solid var(--kirmizi); border-radius: 50%; }
  .ay-sepet .g svg { width: 100%; height: 100%; display: block; }
  .ay-yere { min-height: 40px; display: flex; gap: 6px; align-items: center; }
  .ay-yere .g { width: 44px; height: 44px; animation: ay-dus .35s; outline: 3px solid var(--kirmizi); border-radius: 50%; }
  .ay-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .ay-palet { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px; border-radius: 22px; background: rgba(255,255,255,.75); }
  .ay-kosul { width: var(--p); height: var(--p); padding: 0; border: 0; border-radius: 18px; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; display: grid; place-items: center; }
  .ay-kosul svg { width: 80%; height: 80%; pointer-events: none; }
  .ay-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); background: #fff; border-radius: 16px; display: grid; place-items: center; filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .ay-tasinan svg { width: 80%; height: 80%; }
  .ay-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .ay-calistir svg { width: 30px; height: 30px; }
  .ay-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  @keyframes ay-dus { from { transform: translateY(-20px) scale(.6); opacity: 0; } }
  `;
  const okSvg = `<svg class="ay-ok" viewBox="0 0 26 18"><path d="M2 9 h18 M14 3 l7 6 l-7 6" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ay-stil")) { const st = document.createElement("style"); st.id = "ay-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ay"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ay-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ay-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.secim = b.kosullar.map(() => null);
    d.sahne.innerHTML = `
      <div class="ay-bant" aria-label="Bant">${b.esyalar.map((e, j) => `<div class="e" data-j="${j}">${esyaSvg(e)}</div>`).join("")}</div>
      <div class="ay-kapilar">${b.kosullar.map((_, j) => `<div class="ay-kapi" data-j="${j}"><span class="no">${j + 1}</span><div class="ay-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. kapının koşulu"></div>${okSvg}<div class="ay-sepet">${b.esyalar.map((e, q) => (b.hedef[q] === j ? `<span class="g" data-q="${q}">${esyaSvg(e)}</span>` : "")).join("")}</div></div>`).join("")}</div>
      <div class="ay-yere" aria-hidden="true"></div>
      <div class="ay-alt">
        <div class="ay-palet" aria-label="Koşullar">${b.palet.map((k) => `<button class="ay-kosul" type="button" data-k="${kosulId(k)}" aria-label="${kosulAdi(k)}">${kosulSvg(k)}</button>`).join("")}</div>
        <button class="ay-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button>
      </div>`;
    d.dugme = d.sahne.querySelector(".ay-calistir");
    d.dugme.onclick = calistir;
    d.sahne.querySelectorAll(".ay-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (d.secim[j]) { d.secim[j] = null; ciz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".ay-kosul").forEach(kosulTasi);
    ciz();
    boyutla();
  }
  const paletKosul = (id) => BOLUMLER[d.idx].palet.find((k) => kosulId(k) === id);
  function ciz() {
    d.sahne.querySelectorAll(".ay-yer").forEach((y, j) => { const k = d.secim[j]; y.className = "ay-yer" + (k ? " dolu" : ""); y.innerHTML = k ? kosulSvg(k) : ""; });
    const s = d.secim.indexOf(null);
    if (s >= 0) d.sahne.querySelectorAll(".ay-yer")[s].classList.add("siradaki");
    d.dugme.disabled = d.calisiyor || s >= 0;
  }
  function boyutla() {
    if (!d) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    let k = Math.max(40, Math.min(76, Math.floor((W - 40) / (b.esyalar.length * 0.9)), Math.floor(H / (b.kosullar.length * 1.5 + 3.5))));
    let p = Math.max(46, Math.min(74, Math.floor(H / (b.kosullar.length * 1.6 + 3.2)), Math.floor(W / 7)));
    d.sahne.style.setProperty("--k", k + "px"); d.sahne.style.setProperty("--p", p + "px");
    for (let q = 0; q < 30 && d.sahne.scrollHeight > d.sahne.clientHeight + 2 && (k > 34 || p > 40); q++) {
      if (k > 34) { k -= 3; d.sahne.style.setProperty("--k", k + "px"); }
      if (p > 40) { p -= 2; d.sahne.style.setProperty("--p", p + "px"); }
    }
  }
  function koy(id, j) {
    if (d.calisiyor) return;
    if (j == null) j = d.secim.indexOf(null);
    if (j < 0) return;
    d.secim[j] = paletKosul(id); ciz(); d.api.ses.tik();
  }
  function kosulTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const id = btn.dataset.k;
    btn.addEventListener("pointerdown", (e) => { if (d.calisiyor) return; e.preventDefault(); aktif = true; bx = e.clientX; by = e.clientY; btn.setPointerCapture && btn.setPointerCapture(e.pointerId); });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) { ucan = document.createElement("div"); ucan.className = "ay-tasinan"; const rr = btn.getBoundingClientRect(); ucan.style.width = ucan.style.height = rr.width + "px"; ucan.innerHTML = kosulSvg(paletKosul(id)); document.body.appendChild(ucan); }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY), kp = alt && alt.closest(".ay-kapi"), y = kp && kp.querySelector(".ay-yer");
      if (hedef && hedef !== y) hedef.classList.remove("hedefte");
      hedef = y || null; if (hedef) hedef.classList.add("hedefte");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) { ucan.remove(); ucan = null; if (hedef) { hedef.classList.remove("hedefte"); koy(id, +hedef.dataset.j); } hedef = null; }
      else koy(id);
    };
    btn.addEventListener("pointerup", birak);
    btn.addEventListener("pointercancel", birak);
  }

  async function calistir() {
    if (d.calisiyor) return;
    d.calisiyor = true; ciz();
    const benim = d.uid, b = BOLUMLER[d.idx];
    const bantEl = [...d.sahne.querySelectorAll(".ay-bant .e")], kapiEl = [...d.sahne.querySelectorAll(".ay-kapi")], yere = d.sahne.querySelector(".ay-yere");
    let hata = false;
    for (let q = 0; q < b.esyalar.length; q++) {
      const e = b.esyalar[q];
      bantEl[q].classList.add("simdi");
      await bekle(350);
      if (!d || benim !== d.uid) return;
      // Kapıları sırayla dene
      let gitti = -1;
      for (let j = 0; j < d.secim.length; j++) {
        kapiEl[j].classList.add("yanar");
        await bekle(180);
        if (!d || benim !== d.uid) return;
        kapiEl[j].classList.remove("yanar");
        if (uyar(d.secim[j], e)) { gitti = j; break; }
      }
      bantEl[q].classList.remove("simdi"); bantEl[q].classList.add("gitti");
      if (gitti < 0) { yere.insertAdjacentHTML("beforeend", `<span class="g">${esyaSvg(e)}</span>`); hata = true; break; }
      const sepet = kapiEl[gitti].querySelector(".ay-sepet");
      const yeri = sepet.querySelector(`.g[data-q="${q}"]`);
      if (yeri) { yeri.classList.add("geldi"); d.api.ses.yerlesti(); }
      else { sepet.insertAdjacentHTML("beforeend", `<span class="g yanlis">${esyaSvg(e)}</span>`); hata = true; break; }
      await bekle(150);
    }
    if (!hata) { await bekle(400); if (!d || benim !== d.uid) return; return bitir(); }
    d.api.ses.hata();
    await bekle(1800);
    if (!d || benim !== d.uid) return;
    yere.innerHTML = "";
    d.sahne.querySelectorAll(".ay-sepet .g.yanlis").forEach((x) => x.remove());
    d.sahne.querySelectorAll(".ay-sepet .g").forEach((x) => x.classList.remove("geldi"));
    bantEl.forEach((x) => x.classList.remove("gitti", "simdi"));
    d.calisiyor = false; ciz();
  }
  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Makineyi ustaca kurdun!" : "Son ayıklama da tamam!") : "Her şey doğru sepette!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.AYIKLA_BOLUMLER = BOLUMLER;
  window.AYIKLA_COZUM = (i) => BOLUMLER[i].kosullar.map(kosulId);

  window.Uygulama.oyunEkle(28, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const j = d.secim.indexOf(null);
      if (j < 0) return [{ el: d.dugme }];
      const id = kosulId(BOLUMLER[d.idx].kosullar[j]);
      return [{ el: d.sahne.querySelectorAll(".ay-sepet")[j] }, { el: d.sahne.querySelector(`.ay-kosul[data-k="${id}"]`), hedef: d.sahne.querySelectorAll(".ay-yer")[j] }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${esyaSvg({ renk: "k", sekil: "yildiz" })}${kosulSvg({ renk: "k" })}${esyaSvg({ renk: "m", sekil: "daire" })}${kosulSvg({ diger: true })}</div>`; },
  });
})();
