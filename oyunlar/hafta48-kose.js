/* Köşe Say (şekil tanıma: köşe sayısına göre şekilleri ayırmak).
   Ortada bir şekil belirir; altta üstünde nokta (köşe sayısı) yazan vagonlar var. Şekli doğru vagona koymak için vagona dokun.
   İlk bölümlerde şeklin köşeleri parlayan noktalarla gösterilir; sonra noktalar kalkar, şekiller döner, eğilir ve
   düzensizleşir. Yuvarlak şekillerin köşesi yoktur (boş vagon). Her bölüm birkaç şekilden oluşur.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "kose";
  const RENK = ["#ff5a4e", "#2f86e0", "#2fb36a", "#ffc23a", "#8a5cf0", "#ff8a1f"];
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // Düzgün ya da düzensiz çokgen köşeleri (0 = yuvarlak)
  function sekil(n, duzensiz, r) {
    if (!n) return { daire: true, rx: 30 + r() * 12 * duzensiz, ry: 40 };
    const aci0 = -Math.PI / 2 + (r() - 0.5) * duzensiz * 1.2, k = [];
    for (let i = 0; i < n; i++) {
      const a = aci0 + (2 * Math.PI * i) / n + (r() - 0.5) * duzensiz * (Math.PI / n) * 0.9;
      const u = 40 * (1 - r() * 0.32 * duzensiz);
      k.push([50 + u * Math.cos(a), 50 + u * Math.sin(a)]);
    }
    return { k };
  }
  const svg = (s, renk, noktali) => `<svg viewBox="0 0 100 100" aria-hidden="true">${s.daire ? `<ellipse cx="50" cy="50" rx="${s.rx}" ry="${s.ry}" fill="${renk}" stroke="rgba(0,0,0,.2)" stroke-width="3"/>` : `<path d="M${s.k.map((p) => p.join(" ")).join(" L")} Z" fill="${renk}" stroke="rgba(0,0,0,.2)" stroke-width="3" stroke-linejoin="round"/>${noktali ? s.k.map(([x, y]) => `<circle class="kn" cx="${x}" cy="${y}" r="5.5" fill="#fff" stroke="#1d2846" stroke-width="2.5"/>`).join("") : ""}`}</svg>`;
  const vagonSvg = (n) => {
    const nok = Array.from({ length: n }, (_, i) => { const sat = n > 4 ? 2 : 1, sut = Math.ceil(n / sat), x = 50 + ((i % sut) - (sut - 1) / 2) * 16, y = 36 + (Math.floor(i / sut) - (sat - 1) / 2) * 15; return `<circle cx="${x}" cy="${y}" r="6" fill="#1d2846"/>`; }).join("");
    return `<svg viewBox="0 0 100 80" aria-hidden="true"><rect x="6" y="12" width="88" height="48" rx="10" fill="#fff" stroke="#9aa7b8" stroke-width="4"/>${n ? nok : `<circle cx="50" cy="36" r="12" fill="none" stroke="#9aa7b8" stroke-width="4" stroke-dasharray="4 4"/>`}<circle cx="26" cy="66" r="9" fill="#5d6878"/><circle cx="74" cy="66" r="9" fill="#5d6878"/></svg>`;
  };
  // [köşe sayıları (vagonlar), şekil sayısı, düzensizlik 0-1, noktalar görünür mü]
  const T = [
    [[3, 4], 3, 0, 1], [[3, 4], 4, 0, 1], [[0, 3, 4], 4, 0, 1],
    [[3, 4], 4, 0, 0], [[0, 3, 4], 4, 0, 0], [[3, 4, 5], 4, 0, 1],
    [[3, 4, 5], 5, 0, 0], [[0, 3, 4, 5], 5, 0.2, 0], [[3, 4, 6], 5, 0.2, 0], [[4, 5, 6], 5, 0.2, 1], [[3, 4, 5, 6], 5, 0.2, 0], [[0, 3, 4, 5, 6], 6, 0.3, 0],
    [[3, 4, 5], 5, 0.5, 0], [[4, 5, 6], 5, 0.5, 0], [[3, 4, 5, 6], 6, 0.5, 0], [[0, 3, 4, 5, 6], 6, 0.5, 0], [[4, 5, 6, 7], 6, 0.4, 1], [[3, 5, 6, 7], 6, 0.5, 0],
    [[4, 5, 6, 7], 6, 0.6, 0], [[3, 4, 5, 6, 7], 6, 0.6, 0], [[5, 6, 7, 8], 6, 0.5, 1], [[3, 4, 6, 8], 6, 0.6, 0], [[0, 4, 5, 6, 7], 7, 0.7, 0], [[5, 6, 7, 8], 7, 0.6, 0],
    [[3, 4, 5, 6, 7, 8], 7, 0.7, 0], [[4, 5, 6, 7, 8], 7, 0.8, 0], [[0, 3, 4, 5, 6, 7, 8], 7, 0.8, 0], [[5, 6, 7, 8], 8, 0.9, 0], [[3, 4, 5, 6, 7, 8], 8, 0.9, 0], [[4, 5, 6, 7, 8], 8, 1, 0],
  ];
  const BOLUMLER = T.map(([vagonlar, say, duz, noktali], i) => {
    const r = tohumlu(4800 + i * 31);
    const sekiller = Array.from({ length: say }, (_, j) => { const n = vagonlar[j < vagonlar.length ? j : Math.floor(r() * vagonlar.length)]; return { n, s: sekil(n, duz, r), renk: RENK[Math.floor(r() * RENK.length)] }; });
    return { vagonlar, noktali, sekiller: sekiller.map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]), grup: Uygulama.seviye(i) };
  });

  const stil = `
  .ks { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eef8ff, #e0f0fb); }
  .ks-sahne { --k: 200px; --v: 110px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 18px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .ks-ilerleme { display: flex; gap: 8px; }
  .ks-ilerleme i { width: 20px; height: 20px; border-radius: 50%; border: 3px solid var(--cizgi); background: #fff; display: block; }
  .ks-ilerleme i.dolu { background: var(--yesil); border-color: var(--yesil); }
  .ks-sekil { width: var(--k); height: var(--k); padding: 10px; border-radius: 30px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.1); animation: ks-gel .45s cubic-bezier(.3,1.5,.5,1) both; }
  .ks-sekil svg { width: 100%; height: 100%; display: block; overflow: visible; }
  .ks-sekil .kn { animation: ks-parla 1.2s ease-in-out infinite; }
  @keyframes ks-parla { 50% { r: 7.5; } }
  .ks-sekil.gitti { animation: ks-git .5s ease-in forwards; }
  @keyframes ks-gel { from { transform: scale(.3); opacity: 0; } }
  @keyframes ks-git { to { transform: translateY(160px) scale(.3); opacity: 0; } }
  .ks-tren { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px 14px 6px; border-bottom: 6px solid #8a6a4a; }
  .ks-vagon { width: var(--v); padding: 0; border: 0; background: none; cursor: pointer; }
  .ks-vagon svg { width: 100%; height: auto; display: block; }
  .ks-vagon:active { transform: translateY(3px); }
  .ks-vagon.yanlis { animation: ks-salla .45s; }
  .ks-vagon.dogru svg rect { fill: #e3f7ea; stroke: var(--yesil); }
  @keyframes ks-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ks-stil")) { const st = document.createElement("style"); st.id = "ks-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ks"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ks-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ks-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.sira = 0;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.sahne.innerHTML = `<div class="ks-ilerleme">${b.sekiller.map(() => "<i></i>").join("")}</div><div class="ks-yer"></div>
      <div class="ks-tren">${b.vagonlar.map((n) => `<button class="ks-vagon" type="button" data-n="${n}" aria-label="${n} köşe">${vagonSvg(n)}</button>`).join("")}</div>`;
    d.sahne.querySelectorAll(".ks-vagon").forEach((el) => (el.onclick = () => sec(el)));
    sekilGoster(); boyutla();
  }
  function sekilGoster() {
    const b = BOLUMLER[d.idx], s = b.sekiller[d.sira];
    d.sahne.querySelector(".ks-yer").innerHTML = `<div class="ks-sekil">${svg(s.s, s.renk, b.noktali)}</div>`;
  }
  function boyutla() {
    if (!d) return;
    const n = BOLUMLER[d.idx].vagonlar.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const v = Math.min((W - 30 - (n - 1) * 10) / n, 130, H * 0.22), k = Math.min(W - 20, H - v * 0.8 - 110, 300);
    d.sahne.style.setProperty("--v", Math.floor(Math.max(64, v)) + "px"); d.sahne.style.setProperty("--k", Math.floor(Math.max(120, k)) + "px");
  }
  async function sec(el) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid, s = b.sekiller[d.sira];
    if (+el.dataset.n !== s.n) { el.classList.remove("yanlis"); void el.offsetWidth; el.classList.add("yanlis"); d.api.ses.hata(); return; }
    d.mesgul = true; el.classList.add("dogru"); d.sahne.querySelector(".ks-sekil").classList.add("gitti");
    d.sahne.querySelectorAll(".ks-ilerleme i")[d.sira].classList.add("dolu"); d.api.ses.yerlesti();
    await bekle(550); if (!d || benim !== d.uid) return;
    el.classList.remove("dogru"); d.sira++; d.mesgul = false;
    if (d.sira < b.sekiller.length) return sekilGoster();
    d.mesgul = true; await bekle(300); if (!d || benim !== d.uid) return;
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Köşe ustası oldun!" : "Son tren de doldu!") : "Bütün şekiller trene bindi!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.KOSE_BOLUMLER = BOLUMLER;
  window.KOSE_DURUM = () => d && d.sira;

  window.Uygulama.oyunEkle(48, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const s = BOLUMLER[d.idx].sekiller[d.sira]; if (!s) return [];
      return [{ el: d.sahne.querySelector(".ks-sekil") }, { el: d.sahne.querySelector(`.ks-vagon[data-n="${s.n}"]`) }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { const r = tohumlu(7); return `<div class="mini mini-ari" aria-hidden="true">${svg(sekil(3, 0, r), "#2fb36a", true)}${vagonSvg(3)}${svg(sekil(4, 0, r), "#2f86e0", true)}</div>`; },
  });
})();
