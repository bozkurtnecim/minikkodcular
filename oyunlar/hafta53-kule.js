/* Blok Kule (uzamsal kopyalama: renkli bloklarla örnek kuleyi kurmak).
   Örnek kartta renkli bloklardan kuleler var. Alttan bir renk seç, sonra kulenin direğine dokun: blok düşer.
   Yanlış renk ya da yanlış direk olursa blok sekip geri gider. Kuleler aşağıdan yukarı kurulur.
   Tek direk ve iki renkten başlar; üç-dört direğe, beş renge ve yüksek kulelere doğru zorlaşır.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "kule";
  const RENK = ["#ff5a4e", "#2f86e0", "#ffc23a", "#2fb36a", "#8a5cf0"];
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [direk sayısı, en yüksek kule, renk sayısı, toplam blok]
  const T = [
    [1, 2, 2, 2], [1, 3, 2, 3], [1, 3, 3, 3],
    [2, 2, 2, 3], [2, 3, 2, 4], [2, 3, 3, 5],
    [2, 3, 3, 5], [2, 4, 3, 6], [3, 2, 3, 5], [3, 3, 3, 6], [2, 4, 4, 7], [3, 3, 4, 7],
    [3, 3, 4, 7], [3, 4, 4, 8], [3, 4, 4, 8], [3, 4, 5, 9], [4, 3, 4, 8], [3, 5, 4, 9],
    [3, 5, 5, 10], [4, 3, 5, 9], [4, 4, 4, 10], [4, 4, 5, 10], [3, 5, 5, 11], [4, 4, 5, 11],
    [4, 5, 5, 12], [4, 5, 5, 12], [4, 4, 5, 13], [4, 5, 5, 13], [4, 5, 5, 14], [4, 5, 5, 15],
  ];
  const BOLUMLER = T.map(([n, h, rs, top], i) => {
    const r = tohumlu(5300 + i * 43);
    const hedef = Array.from({ length: n }, () => []);
    hedef.forEach((s) => s.push(Math.floor(r() * rs))); // her direkte en az bir blok
    while (hedef.reduce((a, s) => a + s.length, 0) < top) {
      const s = hedef[Math.floor(r() * n)]; if (s.length < h) s.push(Math.floor(r() * rs));
    }
    // Kullanılan renkleri kapsa
    const renkler = Array.from({ length: rs }, (_, j) => j);
    return { hedef, renkler, h, grup: Uygulama.seviye(i) };
  });

  const blok = (c, cls = "") => `<span class="bk-blok ${cls}" style="--c:${RENK[c]}"></span>`;
  const ornekHtml = (b) => `<div class="bk-direkler kucuk">${b.hedef.map((s) => `<div class="bk-sutun" style="--h:${b.h}">${s.map((c) => blok(c)).join("")}</div>`).join("")}</div>`;

  const stil = `
  .bk { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eef6ff, #dfeefb); }
  .bk-sahne { --b: 56px; --bo: 28px; position: relative; flex: 1; min-height: 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; align-content: safe center; gap: 14px 30px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .bk-ornek { padding: 16px 16px 10px; border-radius: 22px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.1); position: relative; }
  .bk-ornek::after { content: "👀"; position: absolute; top: -14px; left: -10px; font-size: 26px; }
  .bk-sag { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  .bk-direkler { display: flex; align-items: flex-end; gap: calc(var(--b) * .35); padding: 0 10px; border-bottom: 10px solid #8a6a4a; border-radius: 4px; }
  .bk-sutun { --s: var(--b); position: relative; width: calc(var(--s) * 1.15); height: calc(var(--s) * (var(--h) + .6)); display: flex; flex-direction: column-reverse; align-items: center; padding: 0; border: 0; background: none; cursor: pointer; }
  .bk-direkler.kucuk .bk-sutun { --s: var(--bo); cursor: default; }
  .bk-sutun::before { content: ""; position: absolute; left: 50%; bottom: 0; top: 0; width: 8px; margin-left: -4px; border-radius: 4px 4px 0 0; background: #b48a5e; }
  .bk-direkler.kucuk .bk-sutun::before { width: 4px; margin-left: -2px; }
  .bk-blok { position: relative; display: block; flex: none; width: var(--s); height: var(--s); border-radius: calc(var(--s) * .18); background: var(--c); box-shadow: inset 0 calc(var(--s) * -.12) 0 rgba(0,0,0,.18), inset 0 calc(var(--s) * .08) 0 rgba(255,255,255,.35); }
  .bk-blok.dus { animation: bk-dus .32s cubic-bezier(.5,0,1,1); }
  .bk-blok.sek { position: absolute; bottom: 100%; animation: bk-sek .55s ease-out forwards; }
  @keyframes bk-dus { from { transform: translateY(-160px); } }
  @keyframes bk-sek { 0% { transform: translateY(-120px); } 45% { transform: translateY(0); } 100% { transform: translate(40px, -140px) rotate(60deg); opacity: 0; } }
  .bk-renkler { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
  .bk-renk { --s: calc(var(--b) * .95); padding: 5px; border: 4px solid transparent; border-radius: 16px; background: #fff; cursor: pointer; box-shadow: 0 5px 0 rgba(29,40,70,.12); }
  .bk-renk.secili { border-color: #1d2846; transform: translateY(-4px); }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("bk-stil")) { const st = document.createElement("style"); st.id = "bk-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="bk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="bk-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".bk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.kule = b.hedef.map(() => []); d.renk = b.renkler.length === 1 ? 0 : null;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.sahne.innerHTML = `<div class="bk-ornek">${ornekHtml(b)}</div>
      <div class="bk-sag"><div class="bk-direkler buyuk">${b.hedef.map((_, s) => `<button class="bk-sutun" type="button" data-s="${s}" style="--h:${b.h}" aria-label="Direk ${s + 1}"></button>`).join("")}</div>
      <div class="bk-renkler">${b.renkler.map((c) => `<button class="bk-renk" type="button" data-r="${c}" aria-label="Renk">${blok(c)}</button>`).join("")}</div></div>`;
    d.sahne.querySelectorAll(".bk-renk").forEach((el) => {
      el.onclick = () => { d.renk = +el.dataset.r; d.api.ses.tik(); renkCiz(); };
      // Renk bloğu direğe sürüklenebilir de
      Uygulama.surukleBirak(el, { hedef: ".bk-direkler.buyuk .bk-sutun", birak: (s) => { d.renk = +el.dataset.r; renkCiz(); birak(+s.dataset.s, s); }, izin: () => !d.mesgul });
    });
    d.sahne.querySelectorAll(".bk-direkler.buyuk .bk-sutun").forEach((el) => (el.onclick = () => birak(+el.dataset.s, el)));
    renkCiz(); boyutla();
  }
  function renkCiz() { d.sahne.querySelectorAll(".bk-renk").forEach((el) => el.classList.toggle("secili", +el.dataset.r === d.renk)); }
  function boyutla() {
    if (!d) return;
    const b = BOLUMLER[d.idx], n = b.hedef.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    // büyük direkler: genişlik n*1.5*b, yükseklik (h+.6)*b + renkler ~1.3b ; örnek yarı boy
    const yan = W > H * 1.1;
    let bb;
    if (yan) bb = Math.min((W - 80) / (n * 1.5 * 1.5 + 1), (H - 60) / (b.h + 2.2), (W - 60) / (b.renkler.length * 1.35 * 1.5));
    else bb = Math.min((W - 40) / (n * 1.5 + 0.5), (H - 110) / ((b.h + 2.2) + (b.h + 0.6) * 0.5), (W - 20) / (b.renkler.length * 1.4));
    bb = Math.max(30, Math.min(bb, 84));
    d.sahne.style.setProperty("--b", Math.floor(bb) + "px"); d.sahne.style.setProperty("--bo", Math.floor(bb * 0.5) + "px");
  }
  async function birak(s, el) {
    if (d.mesgul) return;
    const b = BOLUMLER[d.idx], benim = d.uid;
    if (d.renk === null) { d.api.ses.hata(); d.sahne.querySelector(".bk-renkler").animate([{ transform: "translateY(0)" }, { transform: "translateY(-10px)" }, { transform: "translateY(0)" }], { duration: 350, iterations: 2 }); return; }
    const h = d.kule[s].length, dogru = b.hedef[s][h] === d.renk;
    if (!dogru) {
      el.insertAdjacentHTML("beforeend", blok(d.renk, "sek"));
      const sek = el.lastElementChild; sek.style.bottom = `calc(var(--s) * ${h})`; setTimeout(() => sek.remove(), 600);
      d.api.ses.hata(); return;
    }
    d.kule[s].push(d.renk); el.insertAdjacentHTML("beforeend", blok(d.renk, "dus")); d.api.ses.yerlesti();
    if (!b.hedef.every((t, j) => t.length === d.kule[j].length)) return;
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Usta mimar oldun!" : "En yüksek kuleleri de kurdun!") : "Kuleler aynısı oldu!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.KULE_BOLUMLER = BOLUMLER;
  window.KULE_DURUM = () => d && d.kule.map((s) => s.length);

  window.Uygulama.oyunEkle(53, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const b = BOLUMLER[d.idx], s = b.hedef.findIndex((t, j) => d.kule[j].length < t.length);
      if (s < 0) return [];
      const c = b.hedef[s][d.kule[s].length], out = [];
      if (d.renk !== c) out.push({ el: d.sahne.querySelector(`.bk-renk[data-r="${c}"]`) });
      out.push({ el: d.sahne.querySelector(`.bk-direkler.buyuk .bk-sutun[data-s="${s}"]`) });
      if (!tam) out.unshift({ el: d.sahne.querySelectorAll(".bk-ornek .bk-sutun")[s] });
      return out;
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const k = [[0, 1], [2, 3, 0], [1]];
      const g = k.map((t, x) => `<rect x="${x * 34 + 19}" y="10" width="6" height="96" fill="#b48a5e"/>` + t.map((c, y) => `<rect x="${x * 34 + 7}" y="${80 - y * 30}" width="30" height="28" rx="5" fill="${RENK[c]}"/>`).join("")).join("");
      return `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="0 0 110 116">${g}<rect x="0" y="108" width="110" height="8" rx="3" fill="#8a6a4a"/></svg></div>`;
    },
  });
})();
