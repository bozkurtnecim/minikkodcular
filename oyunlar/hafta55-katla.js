/* Kağıt Katla (uzamsal düşünme: katlanmış kağıttaki delikler açılınca nerede olur?).
   Üstte ikiye (sonra dörde) katlanmış bir kağıt var, katlı hâlde delikler açılmış. Kesik çizgi katlanma yeri,
   soluk çerçeve kağıdın açılınca kaplayacağı yer. Kağıt açılınca hangisi gibi görünür? Doğru karta dokun.
   Doğru cevapta kağıt açılır ve deliklerin aynadaki gibi çoğaldığı görülür. Yönlü delikler (üçgen, kalp) de
   aynalanır. Tek katlamadan iki katlamaya, tek delikten çok deliğe doğru zorlaşır.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "katla";
  const KAGIT = ["#fff3c4", "#dff1ff", "#e6f8e0", "#ffe3ec", "#efe6ff"];
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const SEKIL = {
    daire: `<circle r="28"/>`, kare: `<rect x="-25" y="-25" width="50" height="50" rx="4"/>`,
    ucS: `<path d="M-22 -28 L30 0 L-22 28 Z"/>`, ucY: `<path d="M0 -30 L28 22 L-28 22 Z"/>`,
    kalp: `<path d="M0 28 C-30 8 -32 -12 -20 -22 C-11 -29 -3 -24 0 -15 C3 -24 11 -29 20 -22 C32 -12 30 8 0 28 Z"/>`,
  };
  // Simetri: bu yönde çevrilince şekil değişmez
  const SIM = { daire: [1, 1], kare: [1, 1], ucS: [0, 1], ucY: [1, 0], kalp: [1, 0] };
  const HAVUZ = [["daire"], ["daire", "kare"], ["daire", "kare", "ucS", "ucY", "kalp"]];
  // [kağıt kare sayısı, katlama (y: dikey çizgi, a: yatay çizgi, iki: dörde), delik sayısı, şekil havuzu, seçenek sayısı]
  const T = [
    [4, "y", 1, 0, 2], [4, "y", 1, 0, 2], [4, "a", 1, 0, 2],
    [4, "y", 2, 0, 3], [4, "a", 2, 1, 3], [4, "y", 2, 1, 3],
    [4, "y", 2, 2, 3], [4, "a", 2, 2, 3], [4, "y", 3, 1, 3], [4, "a", 3, 2, 3], [4, "iki", 1, 0, 3], [4, "y", 3, 2, 4],
    [6, "y", 3, 2, 4], [6, "a", 3, 2, 4], [4, "iki", 1, 2, 3], [6, "y", 4, 2, 4], [4, "iki", 2, 0, 4], [6, "a", 4, 2, 4],
    [4, "iki", 2, 2, 4], [6, "y", 4, 2, 4], [6, "iki", 2, 1, 4], [6, "a", 5, 2, 4], [6, "iki", 2, 2, 4], [6, "y", 5, 2, 4],
    [6, "iki", 3, 2, 4], [6, "a", 5, 2, 4], [6, "iki", 3, 2, 4], [6, "y", 6, 2, 4], [6, "iki", 4, 2, 4], [6, "iki", 4, 2, 4],
  ];
  const aynaY = (G, l) => l.map((h) => ({ ...h, x: G - 1 - h.x, fx: !h.fx }));
  const aynaA = (G, l) => l.map((h) => ({ ...h, y: G - 1 - h.y, fy: !h.fy }));
  function ac(G, tip, l) {
    if (tip === "y") return [...l, ...aynaY(G, l)];
    if (tip === "a") return [...l, ...aynaA(G, l)];
    const y = [...l, ...aynaY(G, l)]; return [...y, ...aynaA(G, y)];
  }
  const anahtar = (l) => l.map((h) => `${h.x},${h.y},${h.s},${SIM[h.s][0] ? 0 : +!!h.fx},${SIM[h.s][1] ? 0 : +!!h.fy}`).sort().join(";");
  const BOLUMLER = T.map(([G, tip, k, havuz, secSay], i) => {
    const r = tohumlu(5500 + i * 59), H = G / 2;
    for (;;) {
      const gw = tip === "a" ? G : H, gh = tip === "y" ? G : H, delik = [], kul = new Set();
      while (delik.length < k) {
        const x = Math.floor(r() * gw), y = Math.floor(r() * gh); if (kul.has(x + "," + y)) continue;
        kul.add(x + "," + y); delik.push({ x, y, s: HAVUZ[havuz][Math.floor(r() * HAVUZ[havuz].length)], fx: false, fy: false });
      }
      const dogru = ac(G, tip, delik), dk = anahtar(dogru);
      const kayik = (l) => l.map((h) => ({ ...h, x: tip !== "a" ? h.x + H : h.x, y: tip !== "y" ? h.y + H : h.y }));
      const adaylar = [
        delik,
        tip === "iki" ? [...delik, ...kayik(delik)] : [...delik, ...kayik(delik)],
        tip === "y" ? [...delik, ...aynaA(G, delik)] : tip === "a" ? [...delik, ...aynaY(G, delik)] : [...delik, ...aynaY(G, delik)],
        dogru.map((h) => ({ ...h, fx: false, fy: false })),
        tip === "iki" ? [...delik, ...aynaA(G, delik)] : null,
        dogru.length > 2 ? dogru.slice(0, -1) : null,
      ].filter(Boolean);
      for (let d = 0; d < 12; d++) {
        // Bir aynalı deliği başka boş kareye kaydır
        const l = dogru.map((h) => ({ ...h })), j = k + Math.floor(r() * (l.length - k)), dolu = new Set(l.map((h) => h.x + "," + h.y));
        const x = Math.floor(r() * G), y = Math.floor(r() * G); if (dolu.has(x + "," + y)) continue;
        l[j].x = x; l[j].y = y; adaylar.push(l);
      }
      const secilen = [dogru], gor = new Set([dk]);
      for (const a of adaylar) { const ak = anahtar(a); if (gor.has(ak)) continue; gor.add(ak); secilen.push(a); if (secilen.length >= secSay) break; }
      if (secilen.length < secSay) continue;
      const sira = secilen.map((_, j) => [r(), j]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
      return { G, tip, delik, dogru, secenek: sira.map((j) => secilen[j]), cevap: sira.indexOf(0), renk: KAGIT[i % KAGIT.length], grup: Uygulama.seviye(i) };
    }
  });

  const A = 100, M = 16;
  const delikSvg = (l, cls = "") => l.map((h) => `<g class="${cls}" transform="translate(${M + h.x * A + 50} ${M + h.y * A + 50}) scale(${h.fx ? -1 : 1} ${h.fy ? -1 : 1})" fill="#3a4660">${SEKIL[h.s]}</g>`).join("");
  const kagit = (G, renk, ic) => `<svg viewBox="0 0 ${G * A + 2 * M} ${G * A + 2 * M}" aria-hidden="true"><rect x="${M}" y="${M}" width="${G * A}" height="${G * A}" rx="10" fill="${renk}" stroke="rgba(0,0,0,.18)" stroke-width="4"/>${ic}</svg>`;
  function katliSvg(b) {
    const G = b.G, H = G / 2, w = (b.tip === "a" ? G : H) * A, h = (b.tip === "y" ? G : H) * A, S = G * A + 2 * M;
    const cizgi = [];
    if (b.tip !== "a") cizgi.push(`<line x1="${M + H * A}" y1="${M}" x2="${M + H * A}" y2="${M + h}"/>`);
    if (b.tip !== "y") cizgi.push(`<line x1="${M}" y1="${M + H * A}" x2="${M + w}" y2="${M + H * A}"/>`);
    const ok = [];
    if (b.tip !== "a") ok.push(`<path d="M${M + H * A + 30} ${M + h / 2} q ${H * A * 0.35} -60 ${H * A * 0.7} 0" />`);
    if (b.tip !== "y") ok.push(`<path d="M${M + w / 2} ${M + H * A + 30} q 60 ${H * A * 0.35} 0 ${H * A * 0.7}" />`);
    return `<svg viewBox="0 0 ${S} ${S}" aria-hidden="true">
      <rect class="kk-golge" x="${M}" y="${M}" width="${G * A}" height="${G * A}" rx="10" fill="none" stroke="#9aa7b8" stroke-width="6" stroke-dasharray="14 12"/>
      <rect class="kk-acik" x="${M}" y="${M}" width="${G * A}" height="${G * A}" rx="10" fill="${b.renk}" stroke="rgba(0,0,0,.18)" stroke-width="4"/>
      <g class="kk-acik">${delikSvg(b.dogru)}</g>
      <g class="kk-katli"><rect x="${M}" y="${M}" width="${w}" height="${h}" rx="10" fill="${b.renk}" stroke="rgba(0,0,0,.25)" stroke-width="4"/>${delikSvg(b.delik)}
      <g stroke="#e0457b" stroke-width="7" stroke-dasharray="16 12">${cizgi.join("")}</g>
      <g fill="none" stroke="#9aa7b8" stroke-width="7" stroke-linecap="round" marker-end="url(#kk-uc)">${ok.join("")}</g></g>
      <defs><marker id="kk-uc" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#9aa7b8"/></marker></defs></svg>`;
  }

  const stil = `
  .kk { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f2f7ff, #e2ecf9); }
  .kk-sahne { --k: 240px; --s: 120px; position: relative; flex: 1; min-height: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; align-content: safe center; gap: 18px 34px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .kk-katlanmis { width: var(--k); height: var(--k); padding: 10px; box-sizing: border-box; border-radius: 24px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.1); }
  .kk-katlanmis svg, .kk-kart svg { width: 100%; height: 100%; display: block; }
  .kk-katlanmis .kk-acik { opacity: 0; transition: opacity .6s; }
  .kk-katlanmis.acildi .kk-acik { opacity: 1; }
  .kk-katlanmis.acildi .kk-katli { opacity: 0; transition: opacity .3s; }
  .kk-secenekler { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; max-width: calc(var(--s) * 2 + 60px); }
  .kk-secenekler.genis { max-width: calc(var(--s) * 4 + 80px); }
  .kk-kart { width: var(--s); height: var(--s); padding: 8px; box-sizing: border-box; border: 0; border-radius: 18px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.14); cursor: pointer; }
  .kk-kart:active { transform: translateY(3px); }
  .kk-kart.yanlis { animation: kk-salla .45s; opacity: .45; }
  .kk-kart.dogru { outline: 6px solid var(--yesil); transform: scale(1.05); }
  @keyframes kk-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("kk-stil")) { const st = document.createElement("style"); st.id = "kk-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="kk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="kk-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".kk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.sahne.innerHTML = `<div class="kk-katlanmis">${katliSvg(b)}</div>
      <div class="kk-secenekler">${b.secenek.map((l, j) => `<button class="kk-kart" type="button" data-j="${j}" aria-label="Seçenek">${kagit(b.G, b.renk, delikSvg(l))}</button>`).join("")}</div>`;
    d.sahne.querySelectorAll(".kk-kart").forEach((el) => (el.onclick = () => sec(el)));
    boyutla();
  }
  function boyutla() {
    if (!d) return;
    const n = BOLUMLER[d.idx].secenek.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    let k, s;
    const yan = W > H * 1.1, sut = yan ? Math.min(n, 2) : Math.min(n, W > 560 ? 4 : 2), sat = Math.ceil(n / sut);
    if (yan) { k = Math.min(H - 20, W * 0.42, 420); s = Math.min((W - k - 70 - (sut - 1) * 14) / sut, (H - 10 - (sat - 1) * 14) / sat, 200); }
    else { s = Math.min((W - 10 - (sut - 1) * 14) / sut, 190); k = Math.min(W - 10, H - sat * s - (sat - 1) * 14 - 40, 400); if (k < 150) { s = Math.max(80, s - (150 - k) / sat); k = Math.min(W - 10, H - sat * s - (sat - 1) * 14 - 40); } }
    d.sahne.querySelector(".kk-secenekler").classList.toggle("genis", !yan && sut > 2);
    d.sahne.style.setProperty("--k", Math.floor(Math.max(130, k)) + "px"); d.sahne.style.setProperty("--s", Math.floor(Math.max(76, s)) + "px");
  }
  async function sec(el) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid;
    if (+el.dataset.j !== b.cevap) { el.classList.remove("yanlis"); void el.offsetWidth; el.classList.add("yanlis"); d.api.ses.hata(); return; }
    d.mesgul = true; el.classList.add("dogru"); d.sahne.querySelector(".kk-katlanmis").classList.add("acildi"); d.api.ses.yerlesti();
    await bekle(1300); if (!d || benim !== d.uid) return;
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Kağıt katlama ustası oldun!" : "En zor kağıdı da çözdün!") : "Kağıt açıldı, doğru bildin!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.KATLA_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(55, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      return [{ el: d.sahne.querySelector(".kk-katlanmis") }, { el: d.sahne.querySelector(`.kk-kart[data-j="${BOLUMLER[d.idx].cevap}"]`) }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="0 0 120 70"><rect x="2" y="6" width="28" height="56" rx="4" fill="#fff3c4" stroke="#c9a94b" stroke-width="3"/><circle cx="16" cy="22" r="7" fill="#3a4660"/><path d="M38 34 h14 m-6 -6 l6 6 l-6 6" stroke="#9aa7b8" stroke-width="4" fill="none"/><rect x="60" y="6" width="56" height="56" rx="4" fill="#fff3c4" stroke="#c9a94b" stroke-width="3"/><line x1="88" y1="6" x2="88" y2="62" stroke="#e0457b" stroke-width="3" stroke-dasharray="5 4"/><circle cx="74" cy="22" r="7" fill="#3a4660"/><circle cx="102" cy="22" r="7" fill="#3a4660"/></svg></div>`;
    },
  });
})();
