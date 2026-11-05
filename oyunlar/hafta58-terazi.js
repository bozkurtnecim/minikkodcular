/* Terazi (mantık: ağır-hafif karşılaştırma, sonra dengeleme).
   1) Tek terazi: aşağı inen kefedeki daha ağırdır. Ağır olana dokun.
   2) İki terazi: üç eşya. Hangisi en ağır (ağırlık simgesi) ya da en hafif (tüy simgesi)? İki teraziye birlikte bakmak gerekir.
   3) Dengeleme: sol kefede küpler var. Sağ kefeye küp ekle (kefeye dokununca son küp geri alınır); terazi düzleşince biter.
      Büyük küp iki küçük küp ağırlığındadır.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "terazi";
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const ESYA = ["hediye", "top", "ayi", "elma", "karpuz", "matruska", "saksi", "sapka", "araba", "kup"];
  function karistir(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const BOLUMLER = Array.from({ length: 30 }, (_, i) => {
    const r = tohumlu(5800 + i * 71), es = karistir(ESYA, r);
    if (i < 8) {
      // Tek terazi: iki eşya, biri ağır
      const agir = r() < 0.5 ? 0 : 1;
      return { tip: "a", esya: es.slice(0, 2), agir, cevap: agir, soru: "agir", grup: Uygulama.seviye(i) };
    }
    if (i < 18) {
      // İki terazi: ağır > orta > hafif zinciri
      const [h, m, l] = es.slice(0, 3), soru = i < 13 ? "agir" : (i % 2 ? "hafif" : "agir");
      const t1 = r() < 0.5 ? { sol: h, sag: m, agirSol: true } : { sol: m, sag: h, agirSol: false };
      const t2 = r() < 0.5 ? { sol: m, sag: l, agirSol: true } : { sol: l, sag: m, agirSol: false };
      const teraziler = r() < 0.5 ? [t1, t2] : [t2, t1], kartlar = karistir([h, m, l], r);
      return { tip: "b", teraziler, kartlar, soru, cevap: kartlar.indexOf(soru === "agir" ? h : l), grup: Uygulama.seviye(i) };
    }
    // Dengeleme
    const ileri = i >= 24, sol = [];
    const toplam = ileri ? 5 + Math.floor(r() * 6) : 2 + Math.floor(r() * 5);
    let kalan = toplam;
    while (kalan > 0) { const w = ileri && kalan >= 2 && r() < 0.6 ? 2 : 1; sol.push(w); kalan -= w; }
    return { tip: "c", sol: sol.sort((a, b) => b - a), hedef: toplam, tepsi: ileri ? [1, 2] : [1], grup: Uygulama.seviye(i) };
  });

  const src = (id) => (window.NESNELER && NESNELER[id] ? NESNELER[id].src : "");
  const kupSvg = (w, x, y, s) => w === 2
    ? `<g transform="translate(${x} ${y})"><rect x="${-s * 0.62}" y="${-s * 1.1}" width="${s * 1.24}" height="${s * 1.1}" rx="${s * 0.14}" fill="#8a5cf0" stroke="#5b3aa8" stroke-width="2.5"/><circle cx="${-s * 0.25}" cy="${-s * 0.55}" r="${s * 0.13}" fill="#fff"/><circle cx="${s * 0.25}" cy="${-s * 0.55}" r="${s * 0.13}" fill="#fff"/></g>`
    : `<g transform="translate(${x} ${y})"><rect x="${-s * 0.42}" y="${-s * 0.84}" width="${s * 0.84}" height="${s * 0.84}" rx="${s * 0.12}" fill="#ffc23a" stroke="#c9900a" stroke-width="2.5"/><circle cx="0" cy="${-s * 0.42}" r="${s * 0.13}" fill="#fff"/></g>`;
  // Terazi çizimi: sol/sag = [{esya} | {kup: w}], egim derece (artı: sağ aşağı)
  function teraziSvg(sol, sag, egim, opt = {}) {
    const cx = 160, cy = 70, L = 112, a = (egim * Math.PI) / 180;
    const uc = (yon) => [cx + yon * L * Math.cos(a), cy + yon * L * Math.sin(a)];
    const kefe = (yon, ogeler, sinif) => {
      const [x, y] = uc(yon), ky = y + 62;
      let ic = "";
      const esya = ogeler.filter((o) => o.esya), kup = ogeler.filter((o) => o.kup);
      if (esya.length) ic += esya.map((o, j) => `<image href="${src(o.esya)}" x="${x - 34 + (j - (esya.length - 1) / 2) * 50}" y="${ky - 66}" width="68" height="68"/>`).join("");
      if (kup.length) {
        // Küpleri kefeye sıra sıra diz (en çok 5 yan yana)
        const s = 22; let sx = 0, sat = 0, satirY = ky - 2;
        const satirlar = []; let cur = [];
        kup.forEach((o) => { const g = o.kup === 2 ? s * 1.3 : s * 0.9; if (sx + g > 120) { satirlar.push(cur); cur = []; sx = 0; } cur.push({ w: o.kup, g }); sx += g; });
        if (cur.length) satirlar.push(cur);
        satirlar.forEach((row) => { const gen = row.reduce((t, o) => t + o.g, 0); let px = x - gen / 2; row.forEach((o) => { ic += kupSvg(o.w, px + o.g / 2, satirY, s); px += o.g; }); satirY -= s * 1.15; sat++; });
      }
      return `<g class="${sinif || ""}"><path d="M${x} ${y} L${x - 52} ${ky} M${x} ${y} L${x + 52} ${ky}" stroke="#7a8796" stroke-width="3"/>${ic}<path d="M${x - 66} ${ky} Q${x} ${ky + 26} ${x + 66} ${ky} Z" fill="#9aa7b8" stroke="#6b7889" stroke-width="3"/>${sinif ? `<rect x="${x - 70}" y="${ky - 110}" width="140" height="140" fill="transparent"/>` : ""}</g>`;
    };
    const [x1, y1] = uc(-1), [x2, y2] = uc(1);
    return `<svg viewBox="0 0 320 250" aria-hidden="${opt.aria ? "false" : "true"}"><path d="M${cx} ${cy} L${cx - 40} 236 H${cx + 40} Z" fill="#c98a4b"/><rect x="${cx - 70}" y="232" width="140" height="12" rx="6" fill="#a8743f"/>
      <path d="M${x1} ${y1} L${x2} ${y2}" stroke="#5d6878" stroke-width="10" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="11" fill="#ffc23a" stroke="#c9900a" stroke-width="3"/>
      ${kefe(-1, sol, "")}${kefe(1, sag, opt.sagSinif)}</svg>`;
  }
  const agirSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 40 H70 L82 88 H18 Z" fill="#3a4660"/><path d="M38 40 A12 12 0 1 1 62 40" stroke="#3a4660" stroke-width="8" fill="none"/><path d="M50 52 V76 M40 66 L50 78 L60 66" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const tuySvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 84 C34 52 54 24 84 14 C80 44 60 70 30 80 Z" fill="#9ed2ff" stroke="#3b9be6" stroke-width="4"/><path d="M22 84 L66 34" stroke="#3b9be6" stroke-width="4" stroke-linecap="round"/></svg>`;

  const stil = `
  .tz { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eef4ff, #dde8fb); }
  .tz-sahne { --t: 300px; --c: 100px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 14px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .tz-teraziler { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 26px; }
  .tz-terazi { width: var(--t); }
  .tz-terazi svg { width: 100%; height: auto; display: block; overflow: visible; }
  .tz-terazi .kol { transition: transform .5s; }
  .tz-alt { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px; }
  .tz-soru { width: calc(var(--c) * .8); height: calc(var(--c) * .8); padding: calc(var(--c) * .1); box-sizing: border-box; border-radius: 50%; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.12); }
  .tz-soru svg { width: 100%; height: 100%; display: block; }
  .tz-kart, .tz-ekle { position: relative; width: var(--c); height: var(--c); padding: calc(var(--c) * .1); box-sizing: border-box; border: 0; border-radius: 20px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.14); cursor: pointer; }
  .tz-kart img, .tz-ekle svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .tz-kart.yanlis { animation: tz-salla .45s; opacity: .45; }
  .tz-kart.dogru { outline: 6px solid var(--yesil); transform: scale(1.06); }
  .tz-ekle:active { transform: translateY(3px); }
  .tz-sag { cursor: pointer; }
  @keyframes tz-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("tz-stil")) { const st = document.createElement("style"); st.id = "tz-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="tz"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="tz-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".tz-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.sag = [];
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    if (b.tip === "a") {
      const egim = b.agir === 1 ? 14 : -14;
      d.sahne.innerHTML = `<div class="tz-teraziler"><div class="tz-terazi">${teraziSvg([{ esya: b.esya[0] }], [{ esya: b.esya[1] }], egim)}</div></div>
        <div class="tz-alt"><div class="tz-soru">${agirSvg}</div>${b.esya.map((e, j) => `<button class="tz-kart" type="button" data-j="${j}" aria-label="${NESNELER[e] ? NESNELER[e].ad : e}"><img src="${src(e)}" alt=""></button>`).join("")}</div>`;
    } else if (b.tip === "b") {
      d.sahne.innerHTML = `<div class="tz-teraziler">${b.teraziler.map((t) => `<div class="tz-terazi">${teraziSvg([{ esya: t.sol }], [{ esya: t.sag }], t.agirSol ? -14 : 14)}</div>`).join("")}</div>
        <div class="tz-alt"><div class="tz-soru">${b.soru === "agir" ? agirSvg : tuySvg}</div>${b.kartlar.map((e, j) => `<button class="tz-kart" type="button" data-j="${j}" aria-label="${NESNELER[e] ? NESNELER[e].ad : e}"><img src="${src(e)}" alt=""></button>`).join("")}</div>`;
    } else {
      d.sahne.innerHTML = `<div class="tz-teraziler"><div class="tz-terazi tz-denge"></div></div>
        <div class="tz-alt">${b.tepsi.map((w) => `<button class="tz-ekle" type="button" data-w="${w}" aria-label="${w === 2 ? "Büyük küp" : "Küp"} ekle"><svg viewBox="-30 -36 60 44">${kupSvg(w, 0, 4, 26)}</svg></button>`).join("")}</div>`;
      d.sahne.querySelectorAll(".tz-ekle").forEach((el) => { el.onclick = () => ekle(+el.dataset.w); Uygulama.surukleBirak(el, { hedef: ".tz-denge", birak: () => ekle(+el.dataset.w), izin: () => !d.mesgul }); });
      dengeCiz();
    }
    d.sahne.querySelectorAll(".tz-kart").forEach((el) => (el.onclick = () => sec(el)));
    boyutla();
  }
  function dengeCiz() {
    const b = BOLUMLER[d.idx], fark = d.sag.reduce((t, w) => t + w, 0) - b.hedef;
    const egim = Math.max(-16, Math.min(16, fark * 5));
    const kutu = d.sahne.querySelector(".tz-denge");
    kutu.innerHTML = teraziSvg(b.sol.map((w) => ({ kup: w })), d.sag.map((w) => ({ kup: w })), egim, { sagSinif: "tz-sag" });
    const sag = kutu.querySelector(".tz-sag");
    sag.onclick = () => { if (d.mesgul || !d.sag.length) return; d.sag.pop(); d.api.ses.tik(); dengeCiz(); dengeKontrol(); };
  }
  function boyutla() {
    if (!d) return;
    const b = BOLUMLER[d.idx], W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const iki = b.tip === "b", kartSay = b.tip === "c" ? b.tepsi.length : (b.kartlar || b.esya).length + 0.8;
    const c = Math.min(120, (W - 20) / kartSay - 14, H * 0.2);
    let t = iki ? Math.min((W - 30) / 2, (H - c - 50) / 0.78, 380) : Math.min(W - 10, (H - c - 50) / 0.78, 520);
    if (iki && t < 200) t = Math.min(W - 10, (H - c - 60) / 1.56 / 0.78 * 0.78, 300);
    d.sahne.style.setProperty("--t", Math.floor(Math.max(170, t)) + "px"); d.sahne.style.setProperty("--c", Math.floor(Math.max(64, c)) + "px");
  }
  async function sec(el) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid;
    if (+el.dataset.j !== b.cevap) { el.classList.remove("yanlis"); void el.offsetWidth; el.classList.add("yanlis"); d.api.ses.hata(); return; }
    d.mesgul = true; el.classList.add("dogru"); d.api.ses.yerlesti();
    await bekle(800); if (!d || benim !== d.uid) return;
    bitir();
  }
  function ekle(w) {
    if (d.mesgul) return;
    if (d.sag.length >= 12) return;
    d.sag.push(w); d.api.ses.tik(); dengeCiz(); dengeKontrol();
  }
  // Terazi dengeye gelince (küp ekleyerek ya da geri alarak) bölüm biter
  async function dengeKontrol() {
    const b = BOLUMLER[d.idx], benim = d.uid;
    if (d.mesgul || d.sag.reduce((t, x) => t + x, 0) !== b.hedef) return;
    d.mesgul = true; d.api.ses.yerlesti(); await bekle(900); if (!d || benim !== d.uid) return;
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
    const b = BOLUMLER[d.idx];
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Terazi ustası oldun!" : "En zor teraziyi de dengeledin!") : b.tip === "c" ? "Terazi dengede!" : "Doğru buldun!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.TERAZI_BOLUMLER = BOLUMLER;
  window.TERAZI_DURUM = () => d && { sag: d.sag.slice() };

  window.Uygulama.oyunEkle(58, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const b = BOLUMLER[d.idx];
      if (b.tip !== "c") return [{ el: d.sahne.querySelector(".tz-teraziler") }, { el: d.sahne.querySelector(`.tz-kart[data-j="${b.cevap}"]`) }];
      const fark = b.hedef - d.sag.reduce((t, x) => t + x, 0);
      if (fark < 0) return [{ el: d.sahne.querySelector(".tz-sag") }];
      const out = [];
      let kalan = fark;
      while (kalan > 0 && out.length < (tam ? 12 : 1)) { const w = kalan >= 2 && b.tepsi.includes(2) ? 2 : 1; out.push({ el: d.sahne.querySelector(`.tz-ekle[data-w="${w}"]`) }); kalan -= w; }
      return out;
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M50 30 L40 92 H60 Z" fill="#c98a4b"/><path d="M14 22 L86 38" stroke="#5d6878" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="30" r="6" fill="#ffc23a"/><path d="M4 46 Q14 54 24 46 Z M76 62 Q86 70 96 62 Z" fill="#9aa7b8"/><path d="M14 22 L6 46 M14 22 L22 46 M86 38 L78 62 M86 38 L94 62" stroke="#7a8796" stroke-width="2"/><rect x="8" y="34" width="12" height="12" rx="2" fill="#ffc23a"/><rect x="78" y="44" width="16" height="18" rx="3" fill="#8a5cf0"/></svg></div>`;
    },
  });
})();
