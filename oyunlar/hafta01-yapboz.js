/* 1. Hafta: Yapboz (parça-bütün ilişkisi).
   24 yapboz: 2x2 (5), 3x3 (5), 4x4 (4), 5x5 (5), 6x6 (5). Resimler js/resimler.js içinde. */
(function () {
  const TAB = 0.25; // parça çıkıntısının hücreye oranı (kenar payı)
  const KAYIT = "yapboz";

  const stil = `
  .yb { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .yb-seviye { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; padding: 2px 16px 6px; }
  .yb-grup { display: flex; align-items: center; gap: 5px; }
  .yb-grup span { font-family: var(--f-baslik); font-weight: 800; font-size: .9rem; color: var(--murekkep-2); margin-right: 2px; font-variant-numeric: tabular-nums; }
  .yb-nokta { width: 18px; height: 18px; border-radius: 50%; border: 3px solid var(--cizgi); background: var(--kagit); padding: 0; cursor: pointer; }
  .yb-nokta.bitti { background: var(--yesil); border-color: var(--yesil); }
  .yb-nokta.simdi { border-color: var(--kirmizi); transform: scale(1.3); }
  .yb-sahne { position: relative; flex: 1; min-height: 0; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .yb-tahta { position: absolute; border-radius: 10px; background: var(--kagit); box-shadow: 0 0 0 8px var(--kagit), 0 14px 0 4px rgba(29,40,70,.1); }
  .yb-hayalet { position: absolute; inset: 0; background-size: cover; border-radius: 10px; opacity: .22; transition: opacity .4s; filter: saturate(.6); }
  .yb-sahne.ipucu .yb-hayalet { opacity: .75; filter: none; }
  .yb-cizgiler { position: absolute; inset: 0; overflow: visible; pointer-events: none; transition: opacity .5s; }
  .yb-tam { position: absolute; inset: 0; background-size: cover; border-radius: 10px; opacity: 0; transition: opacity .8s .3s; pointer-events: none; }
  .yb-sahne.tamam .yb-tam { opacity: 1; }
  .yb-sahne.tamam .yb-cizgiler { opacity: 0; }
  .yb-kutu { position: absolute; border-radius: 26px; background: var(--zemin-2); border: 3px dashed var(--cizgi); }
  .yb-parca { position: absolute; pointer-events: none; will-change: left, top; filter: drop-shadow(0 4px 2px rgba(29,40,70,.28)); transition: transform .15s; }
  .yb-parca svg { display: block; overflow: visible; }
  .yb-parca .kenar { pointer-events: all; cursor: grab; }
  .yb-parca.tutulan { filter: drop-shadow(0 12px 8px rgba(29,40,70,.35)); transform: scale(1.06); }
  .yb-parca.tutulan .kenar { cursor: grabbing; }
  .yb-parca.donuyor { transition: left .35s cubic-bezier(.3,1.4,.5,1), top .35s cubic-bezier(.3,1.4,.5,1); }
  .yb-parca.yerinde { filter: none; }
  .yb-parca.yerinde .kenar { pointer-events: none; }
  .yb-parca.yerinde.pir { animation: yb-pir .35s; }
  @keyframes yb-pir { 50% { transform: scale(1.08); } }
  .yb-sahne.tamam .yb-parca { opacity: 0; transition: opacity .6s .9s; }
  .yb-sahne.tamam .kenar { stroke-opacity: 0; transition: stroke-opacity .3s; }
  .yb-konfeti { position: absolute; inset: 0; pointer-events: none; }
  .yb-tebrik { position: absolute; display: grid; justify-items: center; gap: 14px; padding: 20px 26px; border-radius: 28px; background: var(--kagit); box-shadow: 0 10px 0 rgba(29,40,70,.14); text-align: center; animation: yb-gel .5s cubic-bezier(.3,1.5,.5,1) both; z-index: 5; }
  @keyframes yb-gel { from { transform: scale(.4); opacity: 0; } }
  .yb-tebrik h3 { margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(2rem, 6vw, 3rem); line-height: 1; color: var(--kirmizi); }
  .yb-tebrik p { margin: 0; font-weight: 800; color: var(--murekkep-2); font-size: 1.1rem; }
  .yb-yildizlar { display: flex; gap: 6px; }
  .yb-yildizlar svg { width: 40px; height: 40px; animation: yb-gel .5s both; }
  .yb-ileri { width: 112px; height: 112px; border-radius: 50%; border: 0; cursor: pointer; background: var(--yesil); color: #fff; box-shadow: 0 8px 0 #1f8a4f; display: grid; place-items: center; animation: yb-nabiz 1.2s ease-in-out infinite; }
  .yb-ileri svg { width: 64px; height: 64px; stroke-width: 3.2; }
  .yb-ileri:active { transform: translateY(5px); box-shadow: 0 3px 0 #1f8a4f; }
  @keyframes yb-nabiz { 50% { transform: scale(1.08); } }
  .yb-tebrik .satir { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  `;

  // ---------- Yapboz kenarı çizimi ----------
  // Kenar A'dan B'ye; s = +1 dışa çıkıntı, -1 içe girinti, 0 düz.
  function kenar(ax, ay, bx, by, s) {
    if (!s) return ` L${bx} ${by}`;
    const dx = bx - ax, dy = by - ay;
    const nx = dy, ny = -dx; // saat yönünde dolaşırken dış normal
    const p = (u, v) => `${(ax + dx * u + nx * v * s).toFixed(2)} ${(ay + dy * u + ny * v * s).toFixed(2)}`;
    return ` L${p(0.36, 0)} C${p(0.42, 0)} ${p(0.3, 0.22)} ${p(0.5, 0.22)} C${p(0.7, 0.22)} ${p(0.58, 0)} ${p(0.64, 0)} L${bx} ${by}`;
  }
  function parcaYolu(x, y, P, k) {
    return `M${x} ${y}` + kenar(x, y, x + P, y, k.ust) + kenar(x + P, y, x + P, y + P, k.sag) +
      kenar(x + P, y + P, x, y + P, k.alt) + kenar(x, y + P, x, y, k.sol) + " Z";
  }

  // Resmi tuvale çizip tek bir JPEG'e çevirir (çok parçada akıcılık için).
  const onbellek = {};
  function resmiHazirla(src) {
    if (onbellek[src]) return Promise.resolve(onbellek[src]);
    return new Promise((coz) => {
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement("canvas");
          c.width = c.height = 900;
          const k = Math.min(img.naturalWidth || 900, img.naturalHeight || 900);
          const sx = ((img.naturalWidth || 900) - k) / 2, sy = ((img.naturalHeight || 900) - k) / 2;
          c.getContext("2d").drawImage(img, sx, sy, k, k, 0, 0, 900, 900);
          onbellek[src] = c.toDataURL("image/jpeg", 0.9);
        } catch (e) { onbellek[src] = src; }
        coz(onbellek[src]);
      };
      img.onerror = () => coz(src);
      img.src = src;
    });
  }

  const yildiz = (gecikme) => `<svg viewBox="0 0 24 24" style="animation-delay:${gecikme}s"><path d="M12 2l3 6.6 7 .8-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.8z" fill="#ffc23a" stroke="#e59a00" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

  let durum = null;

  function baslat(alan, api) {
    if (!document.getElementById("yb-stil")) {
      const st = document.createElement("style"); st.id = "yb-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const R = window.RESIMLER;
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="yb"><nav class="nk-nav" aria-label="Yapbozlar"></nav><div class="yb-sahne"></div></div>`;
    const sahne = alan.querySelector(".yb-sahne");
    const nav = alan.querySelector(".nk-nav");

    // İpucu düğmesi üst çubuğa
    api.araclar.innerHTML = `<button class="dugme" type="button" data-ipucu aria-label="Resmi göster">${api.IKON.goz}<span class="etiket">Resmi göster</span></button>`;
    const ipucu = api.araclar.querySelector("[data-ipucu]");
    let ipucuZaman;
    ipucu.onclick = () => { sahne.classList.add("ipucu"); clearTimeout(ipucuZaman); ipucuZaman = setTimeout(() => sahne.classList.remove("ipucu"), 2500); };

    durum = { alan, api, sahne, nav, ilerleme, idx: Math.min(ilerleme.son || 0, R.length - 1), parcalar: [], duzen: null, bitti: false, uid: 0 };

    const gozlemci = new ResizeObserver(() => duzenle());
    gozlemci.observe(sahne);
    durum.gozlemci = gozlemci;
    yukle(durum.idx);
  }

  function navCiz() {
    const R = window.RESIMLER, d = durum;
    d.api.bolumNoktalari(d.nav, { etiketler: R.map((r) => r.n), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { d.api.ses.tik(); yukle(i); } });
  }

  async function yukle(i) {
    const d = durum, R = window.RESIMLER;
    d.idx = i; d.bitti = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const r = R[i], n = r.n;
    const benim = ++d.uid;
    const resim = await resmiHazirla(r.src);
    if (benim !== d.uid || durum !== d) return;
    d.resim = resim; d.n = n;

    // Rastgele çıkıntı/girinti yönleri
    const yatay = [], dikey = [];
    for (let y = 0; y < n; y++) { yatay[y] = []; dikey[y] = []; for (let x = 0; x < n; x++) { yatay[y][x] = Math.random() < 0.5 ? 1 : -1; dikey[y][x] = Math.random() < 0.5 ? 1 : -1; } }
    d.parcalar = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      d.parcalar.push({
        r: y, c: x, yerinde: false, fx: null, fy: null,
        k: { ust: y === 0 ? 0 : -yatay[y - 1][x], alt: y === n - 1 ? 0 : yatay[y][x], sol: x === 0 ? 0 : -dikey[y][x - 1], sag: x === n - 1 ? 0 : dikey[y][x] },
      });
    }
    d.sahne.classList.remove("tamam", "ipucu");
    d.sahne.innerHTML = `<div class="yb-kutu"></div><div class="yb-tahta"><div class="yb-hayalet"></div><svg class="yb-cizgiler"></svg><div class="yb-tam"></div></div>`;
    d.sahne.querySelector(".yb-hayalet").style.backgroundImage = `url("${resim}")`;
    d.sahne.querySelector(".yb-tam").style.backgroundImage = `url("${resim}")`;
    d.parcalar.forEach((p) => {
      p.el = document.createElement("div");
      p.el.className = "yb-parca";
      d.sahne.appendChild(p.el);
      surukle(p);
    });
    d.duzen = null;
    duzenle(true);
  }

  // Ekran boyutuna göre tahta ve parça kutusu yerleşimi
  function duzenle(dagit) {
    const d = durum;
    if (!d || !d.parcalar.length) return;
    const W = d.sahne.clientWidth, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    const g = 16, n = d.n;
    let S, bx, by, kutu;
    if (W >= H * 1.05) {
      S = Math.min(H - 2 * g - 14, (W - 3 * g) * 0.55);
      bx = g + 8; by = (H - S) / 2 - 4;
      kutu = { x: bx + S + g + 8, y: g, w: W - (bx + S + g + 8) - g, h: H - 2 * g };
    } else {
      S = Math.min(W - 2 * g - 16, (H - 3 * g) * 0.56);
      bx = (W - S) / 2; by = g + 8;
      kutu = { x: g, y: by + S + g + 14, w: W - 2 * g, h: H - (by + S + g + 14) - g };
    }
    const P = S / n;
    d.duzen = { W, H, S, bx, by, P, kutu };

    const tahta = d.sahne.querySelector(".yb-tahta");
    Object.assign(tahta.style, { left: bx + "px", top: by + "px", width: S + "px", height: S + "px" });
    Object.assign(d.sahne.querySelector(".yb-kutu").style, { left: kutu.x + "px", top: kutu.y + "px", width: kutu.w + "px", height: kutu.h + "px" });
    d.sahne.querySelector(".yb-cizgiler").innerHTML = d.parcalar.map((p) =>
      `<path d="${parcaYolu(p.c * P, p.r * P, P, p.k)}" fill="none" stroke="#9fb7d4" stroke-width="2" stroke-dasharray="6 5"/>`).join("");

    if (dagit) dagitParcalar();
    const m = TAB * P, boy = P + 2 * m;
    d.parcalar.forEach((p, i) => {
      const id = `ybk-${d.uid}-${i}`;
      const yol = parcaYolu(m, m, P, p.k);
      p.el.style.width = p.el.style.height = boy + "px";
      p.el.innerHTML = `<svg width="${boy}" height="${boy}" viewBox="0 0 ${boy} ${boy}">
        <clipPath id="${id}"><path d="${yol}"/></clipPath>
        <image href="${d.resim}" x="${m - p.c * P}" y="${m - p.r * P}" width="${S}" height="${S}" clip-path="url(#${id})" preserveAspectRatio="xMidYMid slice"/>
        <path class="kenar" d="${yol}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="${Math.max(1.5, P * 0.025)}"/></svg>`;
      konumla(p);
    });
  }

  function dagitParcalar() {
    const d = durum, { kutu, P, W, H } = d.duzen;
    const k = d.parcalar.length;
    const sutun = Math.max(1, Math.round(Math.sqrt((k * kutu.w) / Math.max(1, kutu.h))));
    const satir = Math.ceil(k / sutun);
    const sw = kutu.w / sutun, sh = kutu.h / satir;
    const sira = d.parcalar.map((_, i) => i).sort(() => Math.random() - 0.5);
    d.parcalar.forEach((p, i) => {
      const s = sira[i];
      let x = kutu.x + ((s % sutun) + 0.5) * sw - P / 2 + (Math.random() - 0.5) * sw * 0.3;
      let y = kutu.y + (Math.floor(s / sutun) + 0.5) * sh - P / 2 + (Math.random() - 0.5) * sh * 0.3;
      x = Math.max(kutu.x + 6, Math.min(x, kutu.x + kutu.w - P - 6));
      y = Math.max(kutu.y + 6, Math.min(y, kutu.y + kutu.h - P - 6));
      p.fx = x / W; p.fy = y / H;
      p.el.style.zIndex = 1 + i;
    });
  }

  function konumla(p) {
    const { bx, by, P, W, H } = durum.duzen, m = TAB * P;
    let x, y;
    if (p.yerinde) { x = bx + p.c * P; y = by + p.r * P; }
    else {
      x = Math.max(-m, Math.min(p.fx * W, W - P - m));
      y = Math.max(-m, Math.min(p.fy * H, H - P - m));
    }
    p.el.style.left = x - m + "px";
    p.el.style.top = y - m + "px";
  }

  let enUst = 1000;
  function surukle(p) {
    let basX, basY, ilkFx, ilkFy, tutuyor = false;
    p.el.addEventListener("pointerdown", (e) => {
      const d = durum;
      if (p.yerinde || d.bitti || !d.duzen) return;
      e.preventDefault();
      tutuyor = true;
      p.el.setPointerCapture && p.el.setPointerCapture(e.pointerId);
      p.el.classList.remove("donuyor");
      p.el.classList.add("tutulan");
      p.el.style.zIndex = ++enUst;
      const { W, H } = d.duzen;
      basX = e.clientX - p.fx * W; basY = e.clientY - p.fy * H;
      ilkFx = p.fx; ilkFy = p.fy;
      d.api.ses.tik();
    });
    p.el.addEventListener("pointermove", (e) => {
      if (!tutuyor) return;
      const { W, H } = durum.duzen;
      p.fx = (e.clientX - basX) / W; p.fy = (e.clientY - basY) / H;
      konumla(p);
    });
    const birak = () => {
      if (!tutuyor) return;
      tutuyor = false;
      const d = durum, { W, H, bx, by, P, S } = d.duzen;
      p.el.classList.remove("tutulan");
      const x = p.fx * W, y = p.fy * H;
      const hx = bx + p.c * P, hy = by + p.r * P;
      if (Math.hypot(x - hx, y - hy) < P * 0.36) {
        p.yerinde = true;
        p.el.classList.add("yerinde", "pir");
        p.el.style.zIndex = 1;
        konumla(p);
        d.api.ses.yerlesti();
        if (d.parcalar.every((q) => q.yerinde)) bitir();
      } else {
        const ox = x + P / 2, oy = y + P / 2;
        if (ox > bx && ox < bx + S && oy > by && oy < by + S) {
          // Tahtada yanlış yere bırakıldı: kutudaki yerine geri dön
          d.api.ses.hata();
          p.fx = ilkFx; p.fy = ilkFy;
          p.el.classList.add("donuyor");
          konumla(p);
          setTimeout(() => p.el.classList.remove("donuyor"), 400);
        }
      }
    };
    p.el.addEventListener("pointerup", birak);
    p.el.addEventListener("pointercancel", birak);
  }

  function bitir() {
    const d = durum, R = window.RESIMLER;
    d.bitti = true;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    const son = d.idx === R.length - 1;
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    setTimeout(() => {
      if (durum !== d || !d.bitti) return;
      d.sahne.classList.add("tamam");
      d.api.ses.kazandi();
      konfeti(d.sahne);
      navCiz();
      const kart = document.createElement("div");
      kart.className = "yb-tebrik";
      const herkesBitti = d.ilerleme.bitti.length >= R.length;
      kart.innerHTML = `<div class="yb-yildizlar">${yildiz(0.1)}${yildiz(0.25)}${yildiz(0.4)}</div>
        <h3>Aferin!</h3><p>${R[d.idx].ad} tamam${son ? (herkesBitti ? " · Bütün yapbozları bitirdin!" : " · Son yapboz bitti!") : ""}</p>
        ${son
          ? `<div class="satir"><button class="dugme" type="button" data-bastan>${d.api.IKON.tekrar}<span>Baştan</span></button><button class="dugme" type="button" data-ana>${d.api.IKON.ev}<span>Ana sayfa</span></button></div>`
          : `<button class="yb-ileri" type="button" data-ileri aria-label="Sonraki yapboz">${d.api.IKON.ileri}</button>`}`;
      d.sahne.appendChild(kart);
      // Tebrik kartını tahtanın yanına (kutunun üstüne) yerleştir
      const { kutu } = d.duzen;
      const kw = kart.offsetWidth, kh = kart.offsetHeight;
      kart.style.left = Math.max(8, kutu.x + (kutu.w - kw) / 2) + "px";
      kart.style.top = Math.max(8, Math.min(kutu.y + (kutu.h - kh) / 2, d.duzen.H - kh - 8)) + "px";
      const ileri = kart.querySelector("[data-ileri]");
      if (ileri) { ileri.onclick = () => { d.api.ses.tik(); yukle(d.idx + 1); }; ileri.focus({ preventScroll: true }); }
      const bastan = kart.querySelector("[data-bastan]");
      if (bastan) bastan.onclick = () => { d.ilerleme.bitti = []; yukle(0); };
      const ana = kart.querySelector("[data-ana]");
      if (ana) ana.onclick = d.api.anaSayfa;
    }, 450);
  }

  function konfeti(sahne) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas");
    c.className = "yb-konfeti";
    const W = (c.width = sahne.clientWidth), H = (c.height = sahne.clientHeight);
    sahne.appendChild(c);
    const g = c.getContext("2d");
    const renk = ["#ff5a4e", "#ffc23a", "#2fb36a", "#2f86e0", "#8a5cf0", "#ff7ab8"];
    const ps = Array.from({ length: 140 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.45,
      vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 6,
      a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4, s: 6 + Math.random() * 8, c: renk[(Math.random() * renk.length) | 0],
    }));
    const t0 = performance.now();
    (function kare(t) {
      g.clearRect(0, 0, W, H);
      ps.forEach((p) => {
        p.vy += 0.45; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore();
      });
      if (t - t0 < 3200 && c.isConnected) requestAnimationFrame(kare); else c.remove();
    })(t0);
  }

  window.Uygulama.oyunEkle(1, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      const d = durum; if (!d || !d.parcalar) return [];
      const p = d.parcalar.find((x) => !x.yerinde), t = d.sahne.querySelector(".yb-tahta");
      if (!p || !t) return [];
      const r = t.getBoundingClientRect();
      return [{ el: p.el, hedef: { x: r.left + ((p.c + 0.5) * r.width) / d.n, y: r.top + ((p.r + 0.5) * r.height) / d.n } }];
    },
    baslat,
    bitir() { if (durum && durum.gozlemci) durum.gozlemci.disconnect(); durum = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: window.RESIMLER.length };
    },
    kapak() {
      const src = window.RESIMLER[0].src;
      const pos = ["0 0", "100% 0", "0 100%", "100% 100%"];
      return `<div class="mini" aria-hidden="true">${pos.map((p) => `<span style="background-image:url('${src}');background-position:${p}"></span>`).join("")}</div>`;
    },
  });
})();
