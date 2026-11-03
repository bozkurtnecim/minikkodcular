/* 12. Hafta: Su Boruları (bağlantı kurma ve döndürme).
   Borulara dokunup döndür; "Suyu aç"a basınca su bağlı borulardan akar.
   Bütün çiçeklere su ulaşırsa çiçekler açar; bağlantı kopuksa su sızar.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "boru";

  // Harita: S su deposu, C ve D çiçek, # doğru duran boru, o ters duran boru,
  // x şaşırtıcı boru (yola ait değil), T taş, . boş.
  // Yol borularının ağızları komşu yol karelerine göre kendiliğinden bulunur.
  const B = (seviye, harita) => ({ seviye, harita });
  const BOLUMLER = [
    B("Çok kolay", ["S#o#C"]),
    B("Çok kolay", [".S.", ".#.", ".o.", ".C."]),
    B("Çok kolay", ["T....", "S#o#C", "....T"]),

    B("Kolay", ["So#.", "..o.", "..C."]),
    B("Kolay", ["...C", "...#", "So#o"]),
    B("Kolay", ["S#o", "..#", "..o", "..C"]),

    B("Orta", ["So#.", "..o.", "..oC"]),
    B("Orta", ["C...", "o...", "o#oS"]),
    B("Orta", [".S...", ".o...", ".oo#C"]),
    B("Orta", ["S#o..", "..o..", "..oo#", "....C"]),
    B("Orta", ["Soox", "x.o.", "..oC"]),
    B("Orta", ["..C", "x.o", "Soo"]),

    B("Zor", ["Soo.x", "x.o..", "..ooC"]),
    B("Zor", ["So#o", "xxxo", "o#oo", "Cx.."]),
    B("Zor", ["....C", "x...o", "..ooo", "x.o.x", "Soo.."]),
    B("Zor", ["S#ox.", "x.o.x", ".xo#o", "x...o", "..Coo"]),
    B("Zor", ["Soo#o", "xxx.o", "Cooo#"]),
    B("Zor", ["xSx..", "xo.xC", "xoooo"]),

    B("Çok zor", ["Sooxx", "xxoxx", "xxooo", "xxxxo", "xxxxC"]),
    B("Çok zor", ["xxooC", "xxoxx", "oooxx", "oxxxx", "Sxxxx"]),
    B("Çok zor", ["Soooxx", "xxxoxx", "xoooxx", "xoxxxx", "xoooCx"]),
    B("Çok zor", ["xxxxxC", "oooooo", "oxxxxx", "oxxxxx", "Sxxxxx"]),
    B("Çok zor", ["Sooxxx", "xxoxxx", "xxoooo", "xxxxxo", "xooooo", "xCxxxx"]),
    B("Çok zor", ["xxxxxx", "Soooxx", "xxxoxx", "xoooxx", "xoxxxx", "xoooCx"]),

    B("Çok zor", ["xxCxx", "xxoxx", "Sooxx", "xxoxx", "xxDxx"]),
    B("Çok zor", ["xxxxxC", "xxxxxo", "Sooooo", "xxxxxo", "xxxxxD"]),
    B("Çok zor", ["CxxxxD", "oxxxxo", "oooooo", "xxxoxx", "xxxoxx", "xxxSxx"]),
    B("Çok zor", ["xxCxxx", "xxoxxx", "Sooooo", "xxxxxo", "xxxDoo", "xxxxxx"]),
    B("Çok zor", ["xCxxxDx", "xoxxxox", "xoxxxox", "xooooox", "xxxSxxx"]),
    B("Çok zor", ["Soooxxx", "xxxoxxx", "xooooox", "xoxxxox", "xoxxxox", "xCxxxDx"]),
  ];

  const YON = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] };
  const TERS = { N: "S", S: "N", E: "W", W: "E" };
  const SIRA = "NESW";
  const dondur = (agiz, n) => [...agiz].map((y) => SIRA[(SIRA.indexOf(y) + n) % 4]).sort((a, b) => SIRA.indexOf(a) - SIRA.indexOf(b)).join("");
  const YOL = new Set(["S", "C", "D", "#", "o"]);

  function coz(b) {
    const R = b.harita.length, C = b.harita[0].length;
    const at = (r, c) => (r >= 0 && r < R && c >= 0 && c < C ? b.harita[r][c] : null);
    const hucreler = [];
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const ch = at(r, c);
      const agiz = YOL.has(ch) ? SIRA.split("").filter((y) => YOL.has(at(r + YON[y][0], c + YON[y][1]))).join("") : "";
      hucreler.push({ r, c, ch, agiz });
    }
    return { R, C, hucreler, at };
  }

  // ---------- Çizimler (100x100) ----------
  const KOL = { N: "M50 50 V0", E: "M50 50 H100", S: "M50 50 V100", W: "M50 50 H0" };
  const boruIc = (agiz) => `${[...agiz].map((y) => `<path d="${KOL[y]}" class="dis"/>`).join("")}<circle cx="50" cy="50" r="19" class="dis-g"/>${[...agiz].map((y) => `<path d="${KOL[y]}" class="ic"/>`).join("")}<circle cx="50" cy="50" r="12" class="ic-g"/>${[...agiz].map((y) => { const [dr, dc] = YON[y]; return `<rect x="${50 + dc * 44 - (dc ? 4 : 17)}" y="${50 + dr * 44 - (dr ? 4 : 17)}" width="${dc ? 8 : 34}" height="${dr ? 8 : 34}" rx="3" class="halka"/>`; }).join("")}`;
  const boruSvg = (agiz) => `<svg viewBox="0 0 100 100" class="boru">${boruIc(agiz)}</svg>`;
  const depo = (agiz) => `<svg viewBox="0 0 100 100"><g class="boru" style="--su:#3da3ff">${boruIc(agiz)}</g><rect x="14" y="14" width="72" height="72" rx="14" fill="#2f86e0"/><rect x="22" y="40" width="56" height="38" rx="8" fill="#5ec4ff"/><path d="M24 48 q8 -6 16 0 t16 0 t16 0" stroke="#bfe9ff" stroke-width="4" fill="none"/><rect x="40" y="6" width="20" height="12" rx="4" fill="#1f62ab"/></svg>`;
  const cicek = (agiz, acik) => `<svg viewBox="0 0 100 100"><g class="boru"${acik ? ' style="--su:#3da3ff"' : ""}>${boruIc(agiz)}</g><path d="M26 62 H74 L68 94 H32 Z" fill="#e5784a"/><rect x="22" y="56" width="56" height="10" rx="3" fill="#f08a5d"/><path d="M50 58 V${acik ? 30 : 40}" stroke="#3d9a3d" stroke-width="5"/><ellipse cx="40" cy="${acik ? 44 : 50}" rx="9" ry="4" fill="#4fb04a" transform="rotate(-30 40 46)"/>${acik
    ? `${[0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="50" cy="12" rx="7" ry="11" fill="#ff5d8f" transform="rotate(${i * 60} 50 24)"/>`).join("")}<circle cx="50" cy="24" r="7" fill="#ffd23f"/>`
    : `<ellipse cx="50" cy="36" rx="7" ry="10" fill="#7fbf3a"/><path d="M46 30 Q50 22 54 30" fill="#ff9bc2"/>`}</svg>`;
  const tas = `<svg viewBox="0 0 100 100"><path d="M14 80 L24 44 L46 30 L72 36 L88 62 L84 82 Z" fill="#9aa7b8"/><path d="M24 44 L46 30 L52 50 Z" fill="#b4bfcd"/></svg>`;
  const musluk = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10h9a4 4 0 0 1 4 4v1"/><path d="M8 6h4M10 6v4"/><path d="M17 18c0 1.5-1 2.5-1 2.5s-1-1-1-2.5 1-2.5 1-2.5 1 1 1 2.5z" fill="currentColor"/></svg>`;

  const stil = `
  .br { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--mor); }
  .br-sahne { --k: 80px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 10px; padding: 6px 16px 14px; overflow: hidden; user-select: none; -webkit-user-select: none; }
  .br-baslik { margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.15rem, 3vw, 1.6rem); line-height: 1.1; text-align: center; min-height: 1.2em; }
  .br-harita { display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 12px; border-radius: 22px; background: #f3e3c8; box-shadow: 0 8px 0 rgba(29,40,70,.12); }
  .br-kare { position: relative; border: 0; padding: 0; background: #f8ecd6; outline: 1px solid rgba(196,147,95,.25); }
  .br-kare > svg { display: block; width: 100%; height: 100%; }
  .br-kare.doner { cursor: pointer; }
  .br-kare.doner > svg { transition: transform .22s cubic-bezier(.3,1.4,.5,1); }
  .br-kare.doner:active { background: #f0dcb8; }
  .boru .dis { stroke: #7f8b9c; stroke-width: 30; }
  .boru .dis-g { fill: #7f8b9c; }
  .boru .ic { stroke: var(--su, #e4ebf3); stroke-width: 18; transition: stroke .2s; }
  .boru .ic-g { fill: var(--su, #e4ebf3); transition: fill .2s; }
  .boru .halka { fill: #5d6878; }
  .br-kare.dolu { --su: #3da3ff; }
  .br-kare.sizinti::after { content: ""; position: absolute; left: 50%; top: 50%; width: 18px; height: 18px; margin: -9px; border-radius: 50% 50% 50% 0; background: #3da3ff; transform: rotate(-45deg); animation: br-damla .6s ease-in 3; }
  @keyframes br-damla { 0% { opacity: 0; transform: translateY(-10px) rotate(-45deg); } 50% { opacity: 1; } 100% { opacity: 0; transform: translateY(24px) rotate(-45deg); } }
  .br-ac { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 28px; border: 0; border-radius: 999px; background: var(--mavi); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.5rem; box-shadow: 0 7px 0 #1f62ab; cursor: pointer; }
  .br-ac svg { width: 34px; height: 34px; }
  .br-ac:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  .br-ac:not(:disabled):active { transform: translateY(4px); box-shadow: 0 3px 0 #1f62ab; }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("br-stil")) {
      const st = document.createElement("style"); st.id = "br-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="br"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="br-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".br-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.seviye), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { if (d.akiyor) return; d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.akiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.cozum = coz(b);
    const coklu = BOLUMLER.indexOf(b) >= 24;
    // Her boru: temel ağız (doğru hâli) + dönüş sayısı
    d.borular = {};
    d.cozum.hucreler.forEach((h) => {
      if (h.ch === "#") d.borular[`${h.r},${h.c}`] = { temel: h.agiz, don: 0 };
      if (h.ch === "o") {
        const secenek = [1, 2, 3].filter((n) => dondur(h.agiz, n) !== h.agiz);
        d.borular[`${h.r},${h.c}`] = { temel: h.agiz, don: secenek[(Math.random() * secenek.length) | 0] };
      }
      if (h.ch === "x") {
        const turler = coklu ? ["NS", "NE", "NES"] : ["NS", "NE"];
        d.borular[`${h.r},${h.c}`] = { temel: turler[(Math.random() * turler.length) | 0], don: (Math.random() * 4) | 0 };
      }
    });
    const ciceksay = d.cozum.hucreler.filter((h) => h.ch === "C" || h.ch === "D").length;
    d.sahne.innerHTML = `
      <h2 class="br-baslik">${ciceksay > 1 ? "Borulara dokun, iki çiçeğe de su götür" : "Borulara dokunarak çevir, suyu çiçeğe götür"}</h2>
      <div class="br-harita" style="--C:${d.cozum.C}">${d.cozum.hucreler.map((h) => `<button class="br-kare" type="button" data-r="${h.r}" data-c="${h.c}" tabindex="${d.borular[`${h.r},${h.c}`] ? 0 : -1}" aria-label="${d.borular[`${h.r},${h.c}`] ? "Boru, çevir" : "Kare"}"></button>`).join("")}</div>
      <button class="br-ac" type="button">${musluk}<span>Suyu aç</span></button>`;
    d.harita = d.sahne.querySelector(".br-harita");
    d.baslik = d.sahne.querySelector(".br-baslik");
    d.baslikYazi = d.baslik.textContent;
    d.dugme = d.sahne.querySelector(".br-ac");
    d.dugme.onclick = suyuAc;
    d.cozum.hucreler.forEach((h) => kareCiz(h));
    boyutla();
  }

  const kareEl = (r, c) => d.harita.querySelector(`.br-kare[data-r="${r}"][data-c="${c}"]`);

  function kareCiz(h, acik = false) {
    const el = kareEl(h.r, h.c), k = `${h.r},${h.c}`, br = d.borular[k];
    el.className = "br-kare";
    if (br) {
      el.classList.add("doner");
      el.innerHTML = boruSvg(br.temel);
      el.firstElementChild.style.transform = `rotate(${br.don * 90}deg)`;
      el.onclick = () => cevir(h);
    } else if (h.ch === "S") el.innerHTML = depo(h.agiz);
    else if (h.ch === "C" || h.ch === "D") el.innerHTML = cicek(h.agiz, acik);
    else if (h.ch === "T") el.innerHTML = tas;
    else el.innerHTML = "";
  }

  function cevir(h) {
    if (d.akiyor) return;
    const br = d.borular[`${h.r},${h.c}`];
    br.don++;
    kareEl(h.r, h.c).firstElementChild.style.transform = `rotate(${br.don * 90}deg)`;
    d.api.ses.tik();
  }

  function boyutla() {
    if (!d || !d.harita) return;
    const { R, C } = d.cozum;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    const k = Math.min((W - 24) / C, (H - 50 - 80 - 50 - 24) / R, 110);
    d.sahne.style.setProperty("--k", Math.max(38, Math.floor(k)) + "px");
  }

  const agizOf = (r, c) => {
    const br = d.borular[`${r},${c}`];
    if (br) return dondur(br.temel, br.don % 4);
    const h = d.cozum.hucreler.find((x) => x.r === r && x.c === c);
    return h && (h.ch === "S" || h.ch === "C" || h.ch === "D") ? h.agiz : "";
  };

  // Suyu depodan başlatıp bağlı borular boyunca yay
  async function suyuAc() {
    if (d.akiyor) return;
    d.akiyor = true; d.dugme.disabled = true;
    const benim = d.uid, { hucreler, R, C } = d.cozum;
    const kaynak = hucreler.find((h) => h.ch === "S");
    const cicekler = hucreler.filter((h) => h.ch === "C" || h.ch === "D");
    const dolu = new Set([`${kaynak.r},${kaynak.c}`]);
    const sizinti = new Set(), ulasan = new Set();
    let sinir = [[kaynak.r, kaynak.c]];
    while (sinir.length) {
      const yeni = [];
      for (const [r, c] of sinir) {
        for (const y of agizOf(r, c)) {
          const nr = r + YON[y][0], nc = c + YON[y][1], k = `${nr},${nc}`;
          const karsi = nr >= 0 && nr < R && nc >= 0 && nc < C ? agizOf(nr, nc) : "";
          if (!karsi.includes(TERS[y])) { sizinti.add(`${r},${c}`); continue; }
          if (dolu.has(k)) continue;
          dolu.add(k);
          const h = hucreler.find((x) => x.r === nr && x.c === nc);
          if (h.ch === "C" || h.ch === "D") { ulasan.add(k); continue; }
          yeni.push([nr, nc]);
          kareEl(nr, nc).classList.add("dolu");
        }
      }
      if (yeni.length) { d.api.ses.adim(Math.min(7, dolu.size % 8)); await bekle(150); }
      if (!d || benim !== d.uid) return;
      sinir = yeni;
    }
    await bekle(200);
    if (!d || benim !== d.uid) return;
    cicekler.forEach((h) => { if (ulasan.has(`${h.r},${h.c}`)) kareCiz(h, true); });
    if (ulasan.size === cicekler.length) {
      d.api.ses.yerlesti();
      await bekle(700);
      if (!d || benim !== d.uid) return;
      return bitir();
    }
    sizinti.forEach((k) => { const [r, c] = k.split(",").map(Number); kareEl(r, c).classList.add("sizinti"); });
    d.baslik.textContent = ulasan.size ? "Bir çiçek daha susuz kaldı!" : "Su bir yerden sızıyor. Boruları çevir!";
    d.api.ses.hata();
    await bekle(1900);
    if (!d || benim !== d.uid) return;
    d.harita.querySelectorAll(".dolu, .sizinti").forEach((x) => x.classList.remove("dolu", "sizinti"));
    cicekler.forEach((h) => kareCiz(h, false));
    d.baslik.textContent = d.baslikYazi;
    d.akiyor = false; d.dugme.disabled = false;
  }

  function bitir() {
    d.akiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün çiçekler suya kavuştu!" : "Son bahçe de sulandı!") : "Çiçek açtı!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.BORU_BOLUMLER = BOLUMLER; // test için
  window.BORU_COZ = coz;
  window.BORU_DURUM = () => d && d.borular;

  window.Uygulama.oyunEkle(12, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      return [{ el: d.sahne.querySelector('.br-kare[tabindex="0"]'), kez: 2 }, { el: d.sahne.querySelector(".br-ac") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-boru" aria-hidden="true">${depo("E")}${boruSvg("EW")}${boruSvg("SW")}</div>`;
    },
  });
})();
