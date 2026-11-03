/* Makas Ustası (koşul ve yol seçimi: makasları ayarla, her tren kendi istasyonuna).
   Her trenin tünelinden çıkan ray, makas noktalarında Y gibi ikiye ayrılır. Makas düğmesine dokununca
   ok öbür kola döner; kapalı kolda "girilmez" işareti durur. Trenin gideceği yol kendi renginde parlar.
   "Başlat"a basınca trenler sırayla yola çıkar; her tren kendi rengindeki istasyona varmalı.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "makas";
  const RENK = ["#ff5a4e", "#2f86e0", "#2fb36a", "#ffc23a"];
  const SAHTE = ["#a070e0", "#ff9a3c", "#ff7ab8", "#2ec4c4"];
  const r = (() => { let s = 3030; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const karistir = (a) => a.map((x) => [r(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const BOSLUK = 0.7; // ağaçlar arası boşluk (sütun)

  // Bir trenin ray ağacı: dugum = { d: derinlik, c: [sol, sağ] | null, a: sütun }
  function agacUret(catal, dMax) {
    for (let deneme = 0; deneme < 500; deneme++) {
      const n = [{ d: 0, c: null }];
      let ok = true;
      for (let f = 0; f < catal; f++) {
        const aday = n.map((x, i) => i).filter((i) => !n[i].c && n[i].d < dMax);
        if (!aday.length) { ok = false; break; }
        const i = aday[Math.floor(r() * aday.length)];
        n[i].c = [n.length, n.length + 1];
        n.push({ d: n[i].d + 1, c: null }, { d: n[i].d + 1, c: null });
      }
      if (!ok) continue;
      // Yapraklara soldan sağa sütun ver, dallar çocuklarının ortasında dursun
      let sira = 0;
      const yerlestir = (i) => { const x = n[i]; if (!x.c) return (x.a = sira++); return (x.a = (yerlestir(x.c[0]) + yerlestir(x.c[1])) / 2); };
      yerlestir(0);
      return { n, gen: sira };
    }
    throw new Error("ağaç kurulamadı");
  }
  // Makas düzenine göre yol: düğüm indeksleri
  function yolBul(agac, t, makas) {
    const yol = [0]; let i = 0;
    while (agac.n[i].c) { i = agac.n[i].c[makas.get(`${t}-${i}`) || 0]; yol.push(i); }
    return yol;
  }
  function bolum([catallar, dMax]) {
    const renkler = karistir(RENK).slice(0, catallar.length);
    let ofs = 0;
    const agaclar = catallar.map((f, t) => {
      const ag = agacUret(f, dMax);
      ag.n.forEach((x) => (x.a += ofs));
      ofs += ag.gen + BOSLUK;
      // Hedef: en derin yapraklardan biri
      const yap = ag.n.map((x, i) => i).filter((i) => !ag.n[i].c);
      const enDerin = Math.max(...yap.map((i) => ag.n[i].d));
      const adaylar = yap.filter((i) => ag.n[i].d === enDerin);
      ag.hedef = adaylar[Math.floor(r() * adaylar.length)];
      const sahte = karistir(SAHTE);
      let q = 0;
      yap.forEach((i) => (ag.n[i].renk = i === ag.hedef ? renkler[t] : sahte[q++ % sahte.length]));
      return ag;
    });
    const makasListe = agaclar.flatMap((ag, t) => ag.n.map((x, i) => (x.c ? `${t}-${i}` : null)).filter(Boolean));
    // Çözüm: hedef yolundaki makaslar
    const cozum = [];
    agaclar.forEach((ag, t) => {
      let i = ag.hedef;
      while (i !== 0) { const p = ag.n.findIndex((x) => x.c && x.c.includes(i)); cozum.unshift([`${t}-${p}`, ag.n[p].c.indexOf(i)]); i = p; }
    });
    // Başlangıç: her tren yanlış istasyona gitsin
    let bas;
    for (let deneme = 0; deneme < 200; deneme++) {
      bas = new Map(makasListe.map((m) => [m, Math.floor(r() * 2)]));
      if (agaclar.every((ag, t) => yolBul(ag, t, bas).slice(-1)[0] !== ag.hedef)) break;
    }
    return { agaclar, renkler, makasListe, cozum, bas: [...bas], U: ofs - BOSLUK, D: Math.max(...agaclar.flatMap((ag) => ag.n.map((x) => x.d))) };
  }
  // [her trenin makas sayısı, en fazla derinlik]
  const T = [
    [[1], 1], [[1], 1], [[2], 2],
    [[2], 2], [[1, 1], 1], [[3], 3],
    [[2, 1], 2], [[1, 2], 2], [[3], 2], [[2, 2], 2], [[3, 1], 3], [[2, 2], 2],
    [[3, 2], 3], [[2, 3], 3], [[4], 3], [[3, 3], 2], [[2, 2, 1], 2], [[4, 2], 3],
    [[3, 3], 3], [[2, 2, 2], 2], [[4, 3], 3], [[3, 2, 2], 3], [[4, 4], 3], [[2, 3, 2], 2],
    [[2, 2, 3], 3], [[4, 3], 4], [[3, 3, 1], 3], [[3, 2, 2], 2], [[4, 4], 4], [[3, 3, 2], 3],
  ];
  const BOLUMLER = T.map((t, i) => ({ ...bolum(t), grup: Uygulama.seviye(i) }));

  // ---------- Oyun ----------
  const tren = (renk) => `<g><rect x="-20" y="-14" width="40" height="26" rx="8" fill="${renk}" stroke="rgba(0,0,0,.25)" stroke-width="2"/><rect x="-12" y="-9" width="11" height="9" rx="2" fill="#dff1ff"/><rect x="3" y="-9" width="11" height="9" rx="2" fill="#dff1ff"/><circle cx="-10" cy="14" r="5" fill="#2b2f3a"/><circle cx="10" cy="14" r="5" fill="#2b2f3a"/></g>`;
  const stil = `
  .ms { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eef7e8, #e2f0d8); }
  .ms-sahne { position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 12px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .ms-ag { background: #cfe8bf; border-radius: 24px; box-shadow: 0 8px 0 rgba(29,40,70,.1); }
  .ms-ag svg { display: block; }
  .ms-ag .ray { stroke: #8a6a4a; stroke-width: 10; stroke-linecap: round; fill: none; }
  .ms-ag .ray.ic { stroke: #c9a67a; stroke-width: 4; stroke-dasharray: 2 9; }
  .ms-ag .ray.kapali { stroke: #b4bda8; stroke-width: 8; }
  .ms-ag .ray.parlak { stroke-width: 22; opacity: .35; }
  .ms-ag .makas { cursor: pointer; }
  .ms-ag .makas circle { fill: #fff; stroke: #5d6878; stroke-width: 4; }
  .ms-ag .makas:hover circle { fill: #fff6d0; }
  .ms-ag .makas path { fill: #5d6878; }
  .ms-ag .makas.yanar circle { stroke: var(--sari); stroke-width: 6; }
  .ms-ag .tunel path { fill: #5d6878; }
  .ms-ag .ist rect.zemin { fill: #fff; stroke: #9aa7b8; stroke-width: 3; }
  .ms-ag .isaret { font: 900 26px var(--f-baslik); }
  .ms-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .ms-calistir svg { width: 30px; height: 30px; }
  .ms-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ms-stil")) { const st = document.createElement("style"); st.id = "ms-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ms"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ms-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ms-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => { if (!d.calisiyor) ciz(); });
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.makas = new Map(b.bas);
    d.sahne.innerHTML = `<div class="ms-ag"><svg></svg></div><button class="ms-calistir" type="button">${d.api.IKON.oynat}<span>Başlat</span></button>`;
    d.svg = d.sahne.querySelector("svg");
    d.dugme = d.sahne.querySelector(".ms-calistir");
    d.dugme.onclick = calistir;
    d.svg.addEventListener("click", (e) => {
      const m = e.target.closest(".makas");
      if (!m || d.calisiyor) return;
      d.makas.set(m.dataset.m, 1 - (d.makas.get(m.dataset.m) || 0));
      d.api.ses.tik();
      ciz();
    });
    ciz();
  }

  // Soyut koordinat (a: sütun, v: ilerleme yönü) → ekran
  const nokta = (a, v) => { const u = d.pad + (a + 0.5) * d.cw, w = d.bas0 + v; return d.yatay ? [w, u] : [u, w]; };
  const vDal = (k) => d.rh * 0.9 + k * d.rh; // k derinlikteki makasın yeri
  const vSon = () => vDal(d.D - 1) + d.rh * 0.9; // istasyon önü
  const vDugum = (x) => (x.c ? vDal(x.d) : vSon());
  // Ebeveynden çocuğa ray: kısa düz, Y kıvrımı, sonra düz
  function kol(p, c) {
    const v0 = vDal(p.d), v1 = v0 + d.rh * 0.12, v2 = v0 + d.rh * 0.8, v3 = vDugum(c);
    const P = [nokta(p.a, v0), nokta(p.a, v1), nokta(p.a, (v1 + v2) / 2), nokta(c.a, (v1 + v2) / 2), nokta(c.a, v2), nokta(c.a, v3)];
    return { d: `M${P[0]} L${P[1]} C${P[2]} ${P[3]} ${P[4]} L${P[5]}`, P };
  }
  const bez = (P, t) => [0, 1].map((k) => (1 - t) ** 3 * P[1][k] + 3 * (1 - t) ** 2 * t * P[2][k] + 3 * (1 - t) * t * t * P[3][k] + t ** 3 * P[4][k]);
  function rota(ag, t) {
    const yol = yolBul(ag, t, d.makas), kok = ag.n[0];
    let s = `M${nokta(kok.a, 0)} L${nokta(kok.a, kok.c ? vDal(0) : vSon())}`;
    for (let q = 1; q < yol.length; q++) s += " " + kol(ag.n[yol[q - 1]], ag.n[yol[q]]).d.replace(/^M[^L]*/, "");
    return { s, yol };
  }

  function ciz() {
    if (!d || !d.svg) return;
    const b = BOLUMLER[d.idx];
    const Wp = d.sahne.clientWidth - 32, Hp = d.sahne.clientHeight - 100;
    if (Wp < 50 || Hp < 50) return;
    d.yatay = Hp > Wp * 1.15;
    d.D = b.D;
    const enine = d.yatay ? Hp : Wp, boyuna = d.yatay ? Wp : Hp;
    d.pad = enine < 500 ? 20 : 34;
    d.cw = Math.max(d.yatay ? 34 : 40, Math.min(130, (enine - 2 * d.pad) / b.U));
    d.sc = Math.min(1, d.cw / 80);
    const istPay = d.yatay ? 10 + 68 * d.sc : 54 * d.sc, ek = 2 * d.pad + 70 * d.sc + istPay; // tünel + istasyon payı
    d.rh = Math.max(d.yatay ? 46 : 66, Math.min(150, (boyuna - ek) / (b.D + 0.9)));
    d.bas0 = d.pad + 34 * d.sc;
    const uzun = d.bas0 + vSon() + istPay + d.pad, gen0 = b.U * d.cw + 2 * d.pad;
    const [gen, yuk] = d.yatay ? [uzun, gen0] : [gen0, uzun];
    let alt = "", ust = "";
    b.agaclar.forEach((ag, t) => {
      const renk = b.renkler[t];
      // Trenin gideceği yol kendi renginde parlasın
      alt += `<path class="ray parlak" stroke="${renk}" style="stroke:${renk}" d="${rota(ag, t).s}"/>`;
      const kok = ag.n[0], kokYol = `M${nokta(kok.a, 0)} L${nokta(kok.a, kok.c ? vDal(0) : vSon())}`;
      alt += `<path class="ray" d="${kokYol}"/><path class="ray ic" d="${kokYol}"/>`;
      // Önce kapalı kollar, sonra açık kollar (açık kol üstte kalsın)
      const kollar = ag.n.flatMap((p, i) => (p.c ? p.c.map((c, q) => ({ p, c: ag.n[c], acik: (d.makas.get(`${t}-${i}`) || 0) === q })) : []));
      kollar.filter((k) => !k.acik).forEach((k) => (alt += `<path class="ray kapali" d="${kol(k.p, k.c).d}"/>`));
      kollar.filter((k) => k.acik).forEach((k) => { const yol = kol(k.p, k.c).d; alt += `<path class="ray" d="${yol}"/><path class="ray ic" d="${yol}"/>`; });
      // Kapalı kolda girilmez işareti
      kollar.filter((k) => !k.acik).forEach((k) => {
        const [x, y] = bez(kol(k.p, k.c).P, 0.55);
        ust += `<g transform="translate(${x} ${y}) scale(${d.sc})"><circle r="12" fill="#e5483c" stroke="#fff" stroke-width="3"/><rect x="-7" y="-2.5" width="14" height="5" rx="1.5" fill="#fff"/></g>`;
      });
      // Makas düğmesi: ayrılma noktasında, ok açık kolu gösterir
      ag.n.forEach((p, i) => {
        if (!p.c) return;
        const m = `${t}-${i}`, c = ag.n[p.c[d.makas.get(m) || 0]];
        const [x, y] = nokta(p.a, vDal(p.d)), [x2, y2] = nokta(c.a, vDal(p.d) + d.rh * 0.62);
        const aci = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
        ust += `<g class="makas" data-m="${m}" role="button" aria-label="Makas" transform="translate(${x} ${y}) scale(${Math.max(0.8, d.sc)})"><circle r="19"/><path transform="rotate(${aci})" d="M13 0 L0 -11 V-5 H-12 V5 H0 V11 Z"/></g>`;
      });
      // Tünel ve tren
      const [tx, ty] = nokta(kok.a, 0);
      ust += `<g class="tunel" transform="translate(${tx} ${ty}) ${d.yatay ? "rotate(-90)" : ""} scale(${d.sc}) translate(0 -2)"><path d="M-30 16 v-20 a30 26 0 0 1 60 0 v20 z"/><path d="M-30 16 v-20 a30 26 0 0 1 60 0 v20" fill="none" stroke="${renk}" stroke-width="6"/></g>`;
      ust += `<g class="tren" data-g="${t}" transform="translate(${tx} ${ty}) scale(${d.sc})">${tren(renk)}</g>`;
      // İstasyonlar
      ag.n.forEach((x, i) => {
        if (x.c) return;
        const [sx, sy] = nokta(x.a, vSon());
        const tr = d.yatay ? `translate(${sx + 6 + 34 * d.sc} ${sy - 10 * d.sc})` : `translate(${sx} ${sy + 6})`;
        ust += `<g class="ist" data-t="${t}" data-i="${i}" transform="${tr} scale(${d.sc})"><rect class="zemin" x="-34" y="0" width="68" height="34" rx="8"/><rect x="-34" y="0" width="68" height="12" rx="6" fill="${x.renk}"/><path d="M-22 -2 v-30" stroke="#5d6878" stroke-width="4"/><path d="M-20 -32 h26 l-6 8 l6 8 h-26 z" fill="${x.renk}"/></g>`;
      });
    });
    d.svg.setAttribute("width", gen); d.svg.setAttribute("height", yuk); d.svg.setAttribute("viewBox", `0 0 ${gen} ${yuk}`);
    d.svg.innerHTML = alt + ust;
  }

  // Treni yol boyunca kaydır
  function sur(el, yolD, benim) {
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", yolD); p.setAttribute("fill", "none");
    d.svg.appendChild(p);
    const L = p.getTotalLength(), sure = Math.max(900, (L / 230) * 1000), t0 = performance.now();
    let adim = 0;
    return new Promise((res) => {
      const kare = (now) => {
        if (!d || benim !== d.uid) return res(false);
        const t = Math.min(1, (now - t0) / sure), q = p.getPointAtLength(L * t);
        el.setAttribute("transform", `translate(${q.x} ${q.y}) scale(${d.sc})`);
        const a = Math.floor(t * 6);
        if (a > adim) { adim = a; d.api.ses.adim(a % 8); }
        if (t < 1) requestAnimationFrame(kare); else { p.remove(); res(true); }
      };
      requestAnimationFrame(kare);
    });
  }

  async function calistir() {
    if (d.calisiyor) return;
    d.calisiyor = true; d.dugme.disabled = true;
    const benim = d.uid, b = BOLUMLER[d.idx];
    let hata = false;
    for (let t = 0; t < b.agaclar.length; t++) {
      const ag = b.agaclar[t], { s, yol } = rota(ag, t), el = d.svg.querySelector(`.tren[data-g="${t}"]`);
      if (!(await sur(el, s, benim))) return;
      const son = yol[yol.length - 1], [x, y] = nokta(ag.n[son].a, vSon());
      const dogru = son === ag.hedef;
      const [ix, iy] = d.yatay ? [x + 6 + 34 * d.sc, y + 46 * d.sc] : [x + 30 * d.sc, y - 12];
      d.svg.insertAdjacentHTML("beforeend", `<text class="isaret" x="${ix}" y="${iy}" fill="${dogru ? "#2fb36a" : "#ff5a4e"}">${dogru ? "✓" : "✗"}</text>`);
      if (dogru) d.api.ses.yerlesti(); else { hata = true; break; }
      await bekle(200);
      if (!d || benim !== d.uid) return;
    }
    if (!hata) { await bekle(500); if (!d || benim !== d.uid) return; return bitir(); }
    d.api.ses.hata();
    await bekle(1700);
    if (!d || benim !== d.uid) return;
    d.calisiyor = false; d.dugme.disabled = false; ciz();
  }
  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün trenler yerine ulaştı, makas ustası!" : "Son trenler de ulaştı!") : "Her tren kendi istasyonunda!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.MAKAS_BOLUMLER = BOLUMLER;
  window.MAKAS_DURUM = () => d && { makas: [...d.makas] };

  window.Uygulama.oyunEkle(30, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const b = BOLUMLER[d.idx];
      const yanlis = b.cozum.find(([m, v]) => (d.makas.get(m) || 0) !== v);
      return [{ el: d.svg.querySelector(".tren") }, ...(yanlis ? [{ el: d.svg.querySelector(`.makas[data-m="${yanlis[0]}"]`) }] : []), { el: d.dugme }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="-30 -30 60 60">${tren("#ff5a4e")}</svg><svg viewBox="0 0 100 100"><path d="M50 4 V34 C50 56 22 56 22 96 M50 34 C50 56 78 56 78 96" stroke="#8a6a4a" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="50" cy="34" r="15" fill="#fff" stroke="#5d6878" stroke-width="5"/><path transform="translate(50 34) rotate(130)" d="M10 0 L0 -8 V-4 H-9 V4 H0 V8 Z" fill="#5d6878"/><circle cx="72" cy="72" r="10" fill="#e5483c" stroke="#fff" stroke-width="3"/><rect x="65" y="69.5" width="14" height="5" rx="1.5" fill="#fff"/></svg><svg viewBox="-40 -40 80 80"><rect x="-34" y="0" width="68" height="34" rx="8" fill="#fff" stroke="#9aa7b8" stroke-width="3"/><rect x="-34" y="0" width="68" height="12" rx="6" fill="#ff5a4e"/><path d="M-22 -2 v-30" stroke="#5d6878" stroke-width="4"/><path d="M-20 -32 h26 l-6 8 l6 8 h-26 z" fill="#ff5a4e"/></svg></div>`; },
  });
})();
