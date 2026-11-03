/* Yarım Resim (simetri: resmin öbür yarısını aynalayarak tamamlamak).
   Kareli kağıtta resmin bir yarısı boyalı, ortada kesik çizgili ayna çizgisi var. Renk seç, öbür yarıdaki
   karelere dokun ya da parmağını sürükle; aynı renge yeniden dokununca boya silinir. Resim aynasına
   tam uyunca kendiliğinden tamamlanır. Çok zor bölümlerin sonunda ayna yatay olur (üst yarı → alt yarı).
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "yarim";
  const RENK = { k: "#ff5a4e", s: "#ffc23a", m: "#2f86e0", y: "#2fb36a", t: "#a8693a", p: "#ff7ab8", z: "#2b2f3a", o: "#ff8a1f" };
  // Sol yarı (tek genişlikte orta sütun dahil) verilir, sağ yarı aynalanarak üretilir
  const ayna = (sol, W) => sol.map((s) => s + [...s.slice(0, Math.floor(W / 2))].reverse().join(""));
  const D = (W, sol) => ayna(sol, W);
  const TASARIM = [
    D(4, ["k.", "kk", "kk", ".k"]),
    D(4, ["m.", "mm", ".m", "m."]),
    D(4, [".y", "yy", "y.", ".y"]),
    D(5, ["..y", ".yy", "y.y", "..y", "..y"]),
    D(5, [".k.", "kkk", "kkk", ".kk", "..k"]),
    D(5, ["..k", ".kk", "kkk", "mmm", "m.."]),
    D(6, ["p..", "pp.", "ppz", "pp.", "p.."]),
    D(5, [".kk", "kkk", "ksk", "..s", "..s"]),
    D(5, ["..y", ".yy", "yyy", "..t", "..t"]),
    D(6, ["mmm", "m.s", "mmm", "m.k", "mmm"]),
    D(5, ["k.k", "kkk", ".kk", "..y", ".yy"]),
    D(5, [".ss", "s.s", "sss", "s..", ".ss"]),
    D(5, [".pp", "ppp", "sss", ".ss", ".ss", "..s"]),
    D(5, ["..s", "sss", ".ss", ".s.", "s.."]),
    D(6, ["t..", "ttt", "tst", "ttt", "tto", "ttt"]),
    D(7, ["t.t.", "tttt", "tt.t", "tttt", "tt.m"]),
    D(7, ["...k", "..mm", "..ms", ".mmm", "m.mm", "k..k"]),
    D(7, [".p.p", "pppp", ".ppy", "...y", ".y.y", "..yy"]),
    D(7, ["p...", "pp.z", "ppzz", "pp.z", "p..."]),
    D(7, ["...k", ".kkk", "kkkk", "k.k.", "...t", "...t", "..tt"]),
    D(5, ["..k", ".km", ".mm", ".mz", ".mm", "mmm", "m.k", "..k"]),
    D(7, [".m..", "..m.", ".mmm", ".msm", ".mmm", ".mkk", ".mmm"]),
    D(7, ["..zz", ".zzz", "..mm", "..mo", "..mm", ".mmm", ".mmm", "..mm"]),
    D(7, [".p..", ".p..", ".pp.", ".ppp", "ppzp", "pppp", ".ppk", "..pp"]),
  ];
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // Rastgele simetrik desen (çok zorun sonu): W x H, renkler
  function desen(W, H, renkler, tohum) {
    const r = tohumlu(tohum), yarim = Math.ceil(W / 2);
    for (;;) {
      const sol = Array.from({ length: H }, () => Array.from({ length: yarim }, () => (r() < 0.55 ? renkler[Math.floor(r() * renkler.length)] : ".")).join(""));
      const satir = ayna(sol, W);
      if (new Set(satir.join("").replace(/\./g, "")).size === renkler.length) return satir;
    }
  }
  const dondur = (satir) => satir[0].split("").map((_, c) => satir.map((s) => s[c]).join("")); // yatay ayna için çevir
  const BOLUMLER = [
    ...TASARIM.map((s) => ({ satir: s, yatay: false })),
    { satir: desen(8, 6, ["m", "s"], 11), yatay: false },
    { satir: desen(8, 7, ["k", "y", "s"], 12), yatay: false },
    { satir: dondur(D(5, ["..y", ".yy", "yyy", "..t", "..t"])), yatay: true },
    { satir: dondur(desen(7, 6, ["p", "m"], 13)), yatay: true },
    { satir: dondur(desen(8, 7, ["o", "y", "m"], 14)), yatay: true },
    { satir: dondur(desen(8, 8, ["k", "s", "m"], 15)), yatay: true },
  ].map((b, i) => {
    const H = b.satir.length, W = b.satir[0].length;
    // Verilen yarı: dikeyde sol (tekse orta sütun dahil), yatayda üst
    const verili = (r, c) => (b.yatay ? r < Math.ceil(H / 2) : c < Math.ceil(W / 2));
    return { ...b, W, H, verili, renkler: [...new Set(b.satir.join("").replace(/\./g, ""))], grup: Uygulama.seviye(i) };
  });

  const stil = `
  .yr { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#fff6f0, #fde9e1); }
  .yr-sahne { --k: 56px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 26px; padding: 8px 16px 16px; overflow: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .yr-sahne.dikey { flex-direction: column; gap: 14px; justify-content: safe center; }
  .yr-kagit { position: relative; display: grid; grid-template-columns: repeat(var(--W), var(--k)); gap: 4px; padding: 14px; border-radius: 22px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .yr-kare { width: var(--k); height: var(--k); border-radius: 8px; background: #f4f6fa; box-shadow: inset 0 0 0 2px #e1e7f0; cursor: pointer; transition: background .12s, transform .12s; }
  .yr-kare.verili { cursor: default; box-shadow: inset 0 -5px 0 rgba(0,0,0,.15); }
  .yr-kare.verili.bos { background: #f4f6fa; box-shadow: inset 0 0 0 2px #e1e7f0; opacity: .55; }
  .yr-kare.dolu { box-shadow: inset 0 -5px 0 rgba(0,0,0,.15); }
  .yr-kare.son { animation: yr-zipla .35s ease-out; }
  @keyframes yr-zipla { 40% { transform: scale(1.15); } }
  .yr-ayna { position: absolute; pointer-events: none; border: 0 dashed #8a5cf0; }
  .yr-ayna.dikey { top: 4px; bottom: 4px; width: 0; border-left-width: 4px; }
  .yr-ayna.yatay { left: 4px; right: 4px; height: 0; border-top-width: 4px; }
  .yr-kagit.tamam .yr-ayna { opacity: 0; transition: opacity .4s; }
  .yr-kagit.tamam .yr-kare { animation: yr-zipla .5s ease-out; }
  .yr-palet { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; padding: 12px; border-radius: 22px; background: rgba(255,255,255,.85); }
  .yr-renk { width: 66px; height: 66px; padding: 0; border: 0; border-radius: 50%; cursor: pointer; box-shadow: 0 5px 0 rgba(29,40,70,.16); }
  .yr-renk.secili { outline: 5px solid #1d2846; outline-offset: 3px; transform: translateY(-3px); }
  .yr-sahne.dikey .yr-palet { flex-direction: row; }
  .yr-sahne:not(.dikey) .yr-palet { flex-direction: column; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("yr-stil")) { const st = document.createElement("style"); st.id = "yr-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="yr"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="yr-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".yr-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.bitti) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.bitti = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.boya = b.satir.map((s, r) => [...s].map((ch, c) => (b.verili(r, c) ? ch : ".")));
    d.renk = b.renkler[0];
    let kareler = "";
    for (let r = 0; r < b.H; r++) for (let c = 0; c < b.W; c++) kareler += `<div class="yr-kare${b.verili(r, c) ? " verili" : ""}" data-r="${r}" data-c="${c}"></div>`;
    d.sahne.innerHTML = `
      <div class="yr-kagit" style="--W:${b.W}">${kareler}<span class="yr-ayna ${b.yatay ? "yatay" : "dikey"}"></span></div>
      <div class="yr-palet" aria-label="Renkler">${b.renkler.map((k) => `<button class="yr-renk" type="button" data-k="${k}" aria-label="Renk" style="background:${RENK[k]}"></button>`).join("")}</div>`;
    d.kagit = d.sahne.querySelector(".yr-kagit");
    d.sahne.querySelectorAll(".yr-renk").forEach((el) => (el.onclick = () => { d.renk = el.dataset.k; d.api.ses.tik(); paletCiz(); }));
    boyamaBagla();
    ciz(); paletCiz(); boyutla();
  }
  function paletCiz() { d.sahne.querySelectorAll(".yr-renk").forEach((el) => el.classList.toggle("secili", el.dataset.k === d.renk)); }
  function ciz(son) {
    const b = BOLUMLER[d.idx];
    d.kagit.querySelectorAll(".yr-kare").forEach((el) => {
      const r = +el.dataset.r, c = +el.dataset.c, ch = d.boya[r][c];
      el.style.background = ch === "." ? "" : RENK[ch];
      el.classList.toggle("dolu", ch !== ".");
      el.classList.toggle("bos", ch === "." && b.verili(r, c));
      el.classList.toggle("son", son === `${r},${c}`);
    });
  }
  function boyutla() {
    if (!d || !d.kagit) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.05;
    d.sahne.classList.toggle("dikey", dikey);
    const k = dikey ? Math.min((W - 28 - (b.W - 1) * 4) / b.W, (H - 130 - 28 - (b.H - 1) * 4) / b.H, 80) : Math.min((W - 160 - 28 - (b.W - 1) * 4) / b.W, (H - 28 - (b.H - 1) * 4) / b.H, 84);
    d.k = Math.max(28, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px");
    // Ayna çizgisi
    const a = d.kagit.querySelector(".yr-ayna"), adim = d.k + 4;
    if (b.yatay) a.style.top = 14 + (b.H / 2) * adim - 2 - 2 + "px";
    else a.style.left = 14 + (b.W / 2) * adim - 2 - 2 + "px";
  }
  function boyamaBagla() {
    let aktif = false, kip = null, son = null;
    const kareAl = (e) => { const el = document.elementFromPoint(e.clientX, e.clientY); return el && el.closest(".yr-kare:not(.verili)"); };
    const uygula = (el) => {
      if (!el || d.bitti) return;
      const r = +el.dataset.r, c = +el.dataset.c, z = `${r},${c}`;
      if (z === son) return; son = z;
      if (kip === null) kip = d.boya[r][c] === d.renk ? "sil" : "boya";
      const yeni = kip === "sil" ? "." : d.renk;
      if (d.boya[r][c] === yeni) return;
      d.boya[r][c] = yeni; d.api.ses.ton(yeni === "." ? 392 : 660, 0.08);
      ciz(z); kontrol();
    };
    d.kagit.addEventListener("pointerdown", (e) => { const el = kareAl(e); if (!el) return; e.preventDefault(); aktif = true; kip = null; son = null; uygula(el); });
    d.kagit.addEventListener("pointermove", (e) => { if (aktif) uygula(kareAl(e)); });
    const bitti = () => { aktif = false; };
    window.addEventListener("pointerup", bitti); window.addEventListener("pointercancel", bitti);
  }
  async function kontrol() {
    const b = BOLUMLER[d.idx], benim = d.uid;
    if (!b.satir.every((s, r) => [...s].every((ch, c) => d.boya[r][c] === ch))) return;
    d.bitti = true;
    await bekle(250); if (!d || benim !== d.uid) return;
    d.kagit.classList.add("tamam"); d.api.ses.yerlesti();
    await bekle(900); if (!d || benim !== d.uid) return;
    bitir();
  }
  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Ayna ustası oldun!" : "Son resim de tamam!") : "Resmin iki yarısı aynı oldu!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.YARIM_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(43, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const b = BOLUMLER[d.idx];
      for (let r = 0; r < b.H; r++) for (let c = 0; c < b.W; c++) {
        const ch = b.satir[r][c];
        if (b.verili(r, c) || d.boya[r][c] === ch) continue;
        // Aynadaki karşılığı, sonra (gerekirse) rengi, sonra kare
        const ar = b.yatay ? b.H - 1 - r : r, ac = b.yatay ? c : b.W - 1 - c;
        const kare = d.kagit.querySelector(`.yr-kare[data-r="${r}"][data-c="${c}"]`), es = d.kagit.querySelector(`.yr-kare[data-r="${ar}"][data-c="${ac}"]`);
        const adimlar = [{ el: es }];
        if (ch !== "." && d.renk !== ch) adimlar.push({ el: d.sahne.querySelector(`.yr-renk[data-k="${ch}"]`) });
        adimlar.push({ el: kare });
        return adimlar;
      }
      return [];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini" aria-hidden="true" style="display:block;width:76px;height:76px;transform:rotate(-4deg)"><svg viewBox="0 0 50 50"><rect width="50" height="50" rx="8" fill="#fff"/>${[[1, 1], [2, 1], [1, 2], [2, 2], [2, 3]].map(([x, y]) => `<rect x="${x * 8 + 1}" y="${y * 8 + 5}" width="7" height="7" rx="1.5" fill="#ff5a4e"/>`).join("")}<path d="M25 4 V46" stroke="#8a5cf0" stroke-width="2" stroke-dasharray="3 3"/>${[[3, 1], [3, 2]].map(([x, y]) => `<rect x="${x * 8 + 1}" y="${y * 8 + 5}" width="7" height="7" rx="1.5" fill="#ff5a4e" opacity=".9"/>`).join("")}</svg></div>`; },
  });
})();
