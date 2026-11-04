/* 11. Hafta: Tavşanın Treni (yol oluşturma: ray parçalarıyla rota kurmak).
   Boş karelere ray koy, "Hareket!"e bas; tren raylar boyunca gider.
   Ray kopuksa tren durur (hata ayıklama), yanlış istasyona giderse geri döner.
   30 bölüm: en kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "tren";

  // Harita işaretleri: S başlangıç, k/m/s istasyonlar (kırmızı/mavi/sarı),
  // # hazır ray, o ray konacak yer, T ağaç, G göl, K kaya, . çimen.
  // serbest: true ise "o" kareleri işaretli görünmez; ray her çimene konabilir.
  const B = (seviye, harita, hedef, ek = [], serbest = false) => ({ seviye, harita, hedef, ek, serbest });
  const BOLUMLER = [
    B("Çok kolay", ["T....T", "S#o#k.", "..T..."], "k"),
    B("Çok kolay", [".S.", ".#.", ".o.", ".#.", ".m."], "m"),
    B("Çok kolay", ["T.....", "S##o#s", "..T..T"], "s"),

    B("Kolay", ["..T...", "S#oo#k", "T....."], "k"),
    B("Kolay", [".S..", ".o..", ".#.T", ".o..", ".m.."], "m"),
    B("Kolay", [".T.....", "So#o#os", "....T.."], "s"),

    B("Orta", ["S#o.", "..#.", "T.k."], "k"),
    B("Orta", ["T..m", "...#", "S##o"], "m"),
    B("Orta", [".S...", ".#..T", ".oo#s"], "s"),
    B("Orta", ["S##o.", "T..o.", "...#.", "...k."], "k"),
    B("Orta", ["m...", "o..T", "ooS."], "m", ["EW"]),
    B("Orta", [".Toom", "S#oTT", "....."], "m", ["NS"]),

    B("Zor", ["S#o..", "T.o..", "..o#k"], "k", ["EW"]),
    B("Zor", ["S#o..", "GGoG.", "..o#o", "....s"], "s", ["NS"]),
    B("Zor", ["koo..", "T.o..", "..o#S"], "k", ["NS", "SE"]),
    B("Zor", ["S#o.T.", "T.o.T.", "..o#o.", "....om"], "m", ["EW"]),
    B("Zor", ["S#o...", "..o.T.", "T.o#om"], "m", ["NS", "NE"]),
    B("Zor", ["..o#o..", "..oGo..", "S#oGo#k"], "k", ["EW", "NS"]),

    B("Çok zor", ["....k", ".....", "S#o..", "..o..", "..oom"], "m", ["NS", "EW"], true),
    B("Çok zor", ["koT.T", ".o...", "To#S.", ".....", "....s"], "k", ["EW", "NS"], true),
    B("Çok zor", ["S#o.T.k", "..oTT..", "..ooooo", ".G...Tm"], "m", ["EW", "SE"], true),
    B("Çok zor", [".so....", "..o..T.", "S#o.G..", ".....k."], "s", ["NS", "EW"], true),
    B("Çok zor", ["k....m", ".T..To", "..oooo", "..#...", "..S..."], "m", ["EW", "NW"], true),
    B("Çok zor", ["...G...", "S#oGos.", "..oGo..", "..ooo..", "k......"], "s", ["EW", "NS"], true),

    B("Çok zor", ["k...oom", "...To..", "S#ooo..", "...T...", "s......"], "m", ["EW", "NS", "SE"], true),
    B("Çok zor", ["..s....", ".GG..T.", "S#o.k..", ".To....", "..oom.."], "m", ["EW", "NS", "NW"], true),
    B("Çok zor", ["S#oT..k", "..oT...", "..ooooo", "m..T..o", "...T..s"], "s", ["NS", "EW", "NE"], true),
    B("Çok zor", [".......m", ".GGGG...", "S#ooo.T.", ".GGGo...", "koooo.s."], "k", ["NS", "EW", "SE"], true),
    B("Çok zor", ["s...T..", "....T..", "S#o.Tok", "..oooo.", "m......"], "k", ["NS", "EW", "SW"], true),
    B("Çok zor", ["S#ooG..m", "..ToG...", ".T.oG.T.", "...ooooo", "k...TT.s"], "s", ["NS", "EW", "NE", "SW"], true),
  ];

  // ---------- Yön yardımcıları ----------
  const YON = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] };
  const TERS = { N: "S", S: "N", E: "W", W: "E" };
  const tur = (a, b) => [a, b].sort().join(""); // ray türü: iki ucun adı ("EW", "NS", "EN"→"EN"...)
  const TURLER = ["EW", "NS", "EN", "NW", "ES", "SW"]; // tur() sıralamasıyla aynı yazım
  const ISTASYON = { k: { renk: "#ff5a4e", ad: "Kırmızı" }, m: { renk: "#2f86e0", ad: "Mavi" }, s: { renk: "#ffc23a", ad: "Sarı" } };

  // Haritadan rota, istasyon ağızları ve gereken parçaları çıkar
  function coz(b) {
    const R = b.harita.length, C = b.harita[0].length;
    const at = (r, c) => (r >= 0 && r < R && c >= 0 && c < C ? b.harita[r][c] : null);
    let bas;
    b.harita.forEach((s, r) => [...s].forEach((ch, c) => { if (ch === "S") bas = [r, c]; }));
    // S'den başlayıp #/o zinciri boyunca hedefe yürü
    const rota = [];
    let [r, c] = bas, gelis = null, cikis0 = null;
    const ziyaret = new Set([`${r},${c}`]);
    for (let adim = 0; adim < 100; adim++) {
      const secenek = Object.entries(YON).filter(([y, [dr, dc]]) => {
        const ch = at(r + dr, c + dc);
        return !ziyaret.has(`${r + dr},${c + dc}`) && (ch === "#" || ch === "o" || ch === b.hedef);
      });
      const hedefe = rota.length ? secenek.find(([, [a, z]]) => at(r + a, c + z) === b.hedef) : null;
      const yollar = secenek.filter(([, [a, z]]) => at(r + a, c + z) !== b.hedef);
      if (!hedefe && yollar.length !== 1) (window.TREN_UYARI = window.TREN_UYARI || []).push(`${b.harita.join("/")}: ${r},${c} adımında ${yollar.length} seçenek`);
      const [y, [dr, dc]] = hedefe || yollar[0];
      if (!cikis0) cikis0 = y;
      if (rota.length) rota[rota.length - 1].cikis = y;
      r += dr; c += dc; ziyaret.add(`${r},${c}`);
      if (at(r, c) === b.hedef) { gelis = TERS[y]; break; }
      rota.push({ r, c, giris: TERS[y], hazir: at(r, c) === "#" });
    }
    rota.forEach((h) => (h.tur = tur(h.giris, h.cikis)));
    const istasyonlar = [];
    b.harita.forEach((s, rr) => [...s].forEach((ch, cc) => {
      if (!ISTASYON[ch]) return;
      let agiz = ch === b.hedef ? gelis : null;
      if (!agiz) agiz = ["W", "E", "N", "S"].find((y) => { const n = at(rr + YON[y][0], cc + YON[y][1]); return n && n !== "T" && n !== "G" && n !== "K"; });
      istasyonlar.push({ r: rr, c: cc, renk: ch, agiz });
    }));
    const gereken = {};
    rota.filter((h) => !h.hazir).forEach((h) => (gereken[h.tur] = (gereken[h.tur] || 0) + 1));
    b.ek.forEach((t) => { const k = TURLER.find((x) => x === t) || tur(t[0], t[1]); gereken[k] = (gereken[k] || 0) + 1; });
    return { R, C, bas: { r: bas[0], c: bas[1], agiz: cikis0 }, rota, istasyonlar, gereken };
  }

  // ---------- Çizimler (100x100 kare) ----------
  const KOSE = { EN: [100, 0], NW: [0, 0], ES: [100, 100], SW: [0, 100] };
  function ray(t) {
    const ray1 = "#8a8f99", trav = "#a8774a";
    let s = "";
    if (t === "EW" || t === "NS") {
      for (let i = 0; i < 6; i++) { const p = 8 + i * 17; s += t === "EW" ? `<rect x="${p}" y="22" width="8" height="56" rx="2" fill="${trav}"/>` : `<rect x="22" y="${p}" width="56" height="8" rx="2" fill="${trav}"/>`; }
      s += t === "EW" ? `<path d="M0 34 H100 M0 66 H100" stroke="${ray1}" stroke-width="6"/>` : `<path d="M34 0 V100 M66 0 V100" stroke="${ray1}" stroke-width="6"/>`;
      return s;
    }
    const [cx, cy] = KOSE[t];
    const bas = Math.atan2(50 - cy, 50 - cx) - Math.PI / 4;
    for (let i = 0; i < 5; i++) {
      const a = bas + ((i + 0.5) * Math.PI) / 10;
      s += `<line x1="${cx + Math.cos(a) * 24}" y1="${cy + Math.sin(a) * 24}" x2="${cx + Math.cos(a) * 76}" y2="${cy + Math.sin(a) * 76}" stroke="${trav}" stroke-width="8" stroke-linecap="round"/>`;
    }
    const yay = (rr) => { const a1 = bas, a2 = bas + Math.PI / 2; return `<path d="M${cx + Math.cos(a1) * rr} ${cy + Math.sin(a1) * rr} A${rr} ${rr} 0 0 1 ${cx + Math.cos(a2) * rr} ${cy + Math.sin(a2) * rr}" stroke="${ray1}" stroke-width="6" fill="none"/>`; };
    return s + yay(34) + yay(66);
  }
  const agac = `<circle cx="50" cy="40" r="30" fill="#2f9a48"/><circle cx="32" cy="54" r="18" fill="#3cae4f"/><circle cx="68" cy="54" r="18" fill="#3cae4f"/><rect x="44" y="62" width="12" height="28" rx="3" fill="#8a5a33"/>`;
  const gol = `<ellipse cx="50" cy="52" rx="44" ry="36" fill="#5ab8ea"/><path d="M24 48 q8 -6 16 0 M54 62 q8 -6 16 0" stroke="#bfe9ff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const kaya = `<path d="M14 80 L24 44 L46 30 L72 36 L88 62 L84 82 Z" fill="#9aa7b8"/><path d="M24 44 L46 30 L52 50 Z" fill="#b4bfcd"/>`;
  function istasyonCiz(renk, agiz, baslangic) {
    const r = baslangic ? "#9aa7b8" : ISTASYON[renk].renk;
    const peron = { E: `<rect x="64" y="20" width="36" height="60" fill="#d6c3a5"/>`, W: `<rect x="0" y="20" width="36" height="60" fill="#d6c3a5"/>`, N: `<rect x="20" y="0" width="60" height="36" fill="#d6c3a5"/>`, S: `<rect x="20" y="64" width="60" height="36" fill="#d6c3a5"/>` }[agiz] || "";
    return `${peron}<rect x="18" y="38" width="64" height="48" rx="4" fill="#fff4e0" stroke="#c4935f" stroke-width="3"/><path d="M10 42 L50 12 L90 42 Z" fill="${r}"/><rect x="40" y="58" width="20" height="28" rx="2" fill="#8a5a33"/><rect x="24" y="50" width="12" height="12" fill="#bfe9ff"/><rect x="64" y="50" width="12" height="12" fill="#bfe9ff"/>${baslangic ? "" : `<path d="M50 12 V0" stroke="#5a3416" stroke-width="3"/><path d="M50 0 L66 5 L50 10 Z" fill="${r}"/>`}`;
  }
  const tren = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="10" y="40" width="58" height="30" rx="6" fill="#ff5a4e"/><rect x="50" y="24" width="34" height="46" rx="5" fill="#2f86e0"/><rect x="56" y="30" width="22" height="16" rx="3" fill="#bfe9ff"/><rect x="16" y="26" width="10" height="16" fill="#2b2b3a"/><circle cx="28" cy="76" r="10" fill="#2b2b3a"/><circle cx="66" cy="76" r="10" fill="#2b2b3a"/><circle cx="28" cy="76" r="4" fill="#c9cfd8"/><circle cx="66" cy="76" r="4" fill="#c9cfd8"/><path d="M84 66 l10 6 h-10 z" fill="#2b2b3a"/>
    <ellipse cx="62" cy="14" rx="4" ry="11" fill="#f2f2f2"/><ellipse cx="72" cy="14" rx="4" ry="11" fill="#f2f2f2"/><circle cx="67" cy="38" r="9" fill="#f6f6f6"/><circle cx="64" cy="37" r="1.6" fill="#26201f"/><circle cx="70" cy="37" r="1.6" fill="#26201f"/><ellipse cx="67" cy="41" rx="1.8" ry="1.2" fill="#ff7a99"/></svg>`;
  const tavsanYuz = `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="36" cy="26" rx="10" ry="26" fill="#f2f2f2"/><ellipse cx="64" cy="26" rx="10" ry="26" fill="#f2f2f2"/><ellipse cx="36" cy="26" rx="5" ry="18" fill="#ffb7c5"/><ellipse cx="64" cy="26" rx="5" ry="18" fill="#ffb7c5"/><circle cx="50" cy="64" r="30" fill="#f6f6f6"/><circle cx="40" cy="60" r="4" fill="#26201f"/><circle cx="60" cy="60" r="4" fill="#26201f"/><ellipse cx="50" cy="70" rx="5" ry="3.5" fill="#ff7a99"/><path d="M42 78 q8 6 16 0" stroke="#5a3a3a" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;

  const stil = `
  .tr { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--mor); }
  .tr-sahne { --k: 80px; --p: 70px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 18px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .tr-sahne.dikey { flex-direction: column; gap: 10px; }
  .tr-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 10px; border-radius: 22px; background: #8fd36a; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .tr-kare { position: relative; background: #9be07a; outline: 1px solid rgba(255,255,255,.25); }
  .tr-kare:nth-child(odd) { background: #94da72; }
  .tr-kare > svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .tr-kare.yer::after { content: ""; position: absolute; inset: 8%; border: 3px dashed rgba(255,255,255,.9); border-radius: 10px; }
  .tr-kare.hedef { background: #d4e8ff !important; }
  .tr-kare.konan { cursor: pointer; }
  .tr-kare.yeni > svg { animation: tr-otur .3s cubic-bezier(.3,1.6,.5,1); }
  .tr-kare.kirik { animation: tr-yanip .35s 4; }
  @keyframes tr-otur { from { transform: scale(1.3); } }
  @keyframes tr-yanip { 50% { background: #ff8a80; } }
  .tr-tren { position: absolute; left: 10px; top: 10px; width: var(--k); height: var(--k); transition: transform .38s linear; pointer-events: none; z-index: 3; }
  .tr-tren > div { width: 100%; height: 100%; transition: transform .2s; }
  .tr-tren svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.25)); }
  .tr-tren.salla > div { animation: tr-salla .5s; }
  @keyframes tr-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .tr-yan { display: grid; justify-items: center; align-content: center; gap: 14px; min-width: 0; }
  .tr-sahne:not(.dikey) .tr-yan { flex: 1; max-width: 420px; }
  .tr-bilet { display: flex; align-items: center; gap: 10px; padding: 8px 16px 8px 8px; border-radius: 18px; background: var(--kagit); box-shadow: 0 5px 0 rgba(29,40,70,.12); font-family: var(--f-baslik); font-weight: 800; font-size: 1.1rem; }
  .tr-bilet .yuz { width: 54px; height: 54px; flex: none; }
  .tr-bilet .bilet { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 10px; color: #fff; border: 3px dashed rgba(255,255,255,.8); }
  .tr-kutu { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; padding: 12px; border-radius: 22px; border: 3px dashed var(--cizgi); background: var(--zemin-2); min-height: calc(var(--p) + 24px); box-sizing: border-box; max-width: 100%; }
  .tr-parca { position: relative; width: var(--p); height: var(--p); padding: 4px; border: 0; border-radius: 16px; background: #9be07a; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; transition: transform .15s; }
  .tr-parca svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .tr-parca b { position: absolute; top: -8px; right: -8px; min-width: 26px; height: 26px; padding: 0 6px; border-radius: 13px; background: var(--mor); color: #fff; font-size: .95rem; display: grid; place-items: center; box-sizing: border-box; }
  .tr-parca.secili { transform: translateY(-6px) scale(1.06); outline: 5px solid var(--mavi); outline-offset: 2px; }
  .tr-parca.bitti { opacity: .35; pointer-events: none; }
  .tr-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.05); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); border-radius: 12px; background: rgba(155,224,122,.85); }
  .tr-tasinan svg { width: 100%; height: 100%; display: block; }
  .tr-hareket { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 28px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.5rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .tr-hareket svg { width: 30px; height: 30px; }
  .tr-hareket:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  .tr-hareket:not(:disabled):active { transform: translateY(4px); box-shadow: 0 3px 0 #1f8a4f; }
  .tr-ipucu-yazi { margin: 0; font-weight: 800; color: var(--murekkep-2); text-align: center; min-height: 1.3em; }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("tr-stil")) {
      const st = document.createElement("style"); st.id = "tr-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="tr"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="tr-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".tr-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.seviye), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false; d.secili = null;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.cozum = coz(b);
    d.kutu = { ...d.cozum.gereken };
    d.yerlesen = {}; // "r,c" → tür (çocuğun koyduğu)
    const { R, C } = d.cozum;
    const hedefIst = ISTASYON[b.hedef];
    let kareler = "";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareler += `<div class="tr-kare" data-r="${r}" data-c="${c}"></div>`;
    d.sahne.innerHTML = `
      <div class="tr-harita" style="--C:${C}">${kareler}<div class="tr-tren"><div>${tren}</div></div></div>
      <div class="tr-yan">
        <div class="tr-bilet"><span class="yuz">${tavsanYuz}</span><span>Tavşan</span><span class="bilet" style="background:${hedefIst.renk}">${hedefIst.ad} istasyon</span></div>
        <p class="tr-ipucu-yazi">${b.serbest ? "Rayları çimene koy, treni bilet rengindeki istasyona götür" : "Boş yerlere ray koy"}</p>
        <div class="tr-kutu" aria-label="Ray parçaları"></div>
        <button class="tr-hareket" type="button">${d.api.IKON.oynat}<span>Hareket!</span></button>
      </div>`;
    d.harita = d.sahne.querySelector(".tr-harita");
    d.trenEl = d.sahne.querySelector(".tr-tren");
    d.kutuEl = d.sahne.querySelector(".tr-kutu");
    d.yazi = d.sahne.querySelector(".tr-ipucu-yazi");
    d.dugme = d.sahne.querySelector(".tr-hareket");
    d.dugme.onclick = calistir;
    haritaCiz();
    kutuCiz();
    treniKoy(d.cozum.bas.r, d.cozum.bas.c, d.cozum.bas.agiz, false);
    boyutla();
  }

  const kare = (r, c) => d.harita.querySelector(`.tr-kare[data-r="${r}"][data-c="${c}"]`);
  const hucre = (r, c) => { const s = BOLUMLER[d.idx].harita[r]; return s ? s[c] : null; };
  const konabilir = (r, c) => { const ch = hucre(r, c); return BOLUMLER[d.idx].serbest ? ch === "." || ch === "o" : ch === "o"; };

  function haritaCiz() {
    const b = BOLUMLER[d.idx], { R, C, bas, istasyonlar } = d.cozum;
    const hazir = {};
    d.cozum.rota.filter((h) => h.hazir).forEach((h) => (hazir[`${h.r},${h.c}`] = h.tur));
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const el = kare(r, c), ch = hucre(r, c), k = `${r},${c}`;
      el.className = "tr-kare";
      let ic = "";
      if (ch === "T") ic = agac; else if (ch === "G") ic = gol; else if (ch === "K") ic = kaya;
      else if (ch === "S") ic = istasyonCiz(null, bas.agiz, true);
      else if (ISTASYON[ch]) ic = istasyonCiz(ch, istasyonlar.find((s) => s.r === r && s.c === c).agiz);
      else if (hazir[k]) ic = ray(hazir[k]);
      else if (d.yerlesen[k]) { ic = ray(d.yerlesen[k]); el.classList.add("konan"); }
      if (!d.yerlesen[k] && ch === "o" && !b.serbest) el.classList.add("yer");
      el.innerHTML = ic ? `<svg viewBox="0 0 100 100">${ic}</svg>` : "";
      el.onclick = () => kareTik(r, c);
    }
  }

  function kutuCiz() {
    d.kutuEl.innerHTML = TURLER.filter((t) => d.cozum.gereken[t]).map((t) => `<button class="tr-parca${d.kutu[t] ? "" : " bitti"}${d.secili === t ? " secili" : ""}" type="button" data-tur="${t}" aria-label="Ray, ${d.kutu[t]} tane"><svg viewBox="0 0 100 100">${ray(t)}</svg><b>${d.kutu[t]}</b></button>`).join("");
    d.kutuEl.querySelectorAll(".tr-parca").forEach(parcaTasi);
  }

  function boyutla() {
    if (!d || !d.harita) return;
    const { R, C } = d.cozum;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 20;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.2;
    d.sahne.classList.toggle("dikey", dikey);
    const turSayi = TURLER.filter((t) => d.cozum.gereken[t]).length;
    let k, p;
    if (dikey) {
      p = Math.max(54, Math.min(80, (W - 30 - (turSayi - 1) * 12) / turSayi));
      const pSatir = Math.ceil(turSayi / Math.max(1, Math.floor((W - 24) / (p + 12))));
      k = Math.min((W - 20) / C, (H - 70 - 30 - 90 - pSatir * (p + 12) - 20) / R, 110);
    } else {
      p = 76;
      k = Math.min((W * 0.62 - 20) / C, (H - 20) / R, 110);
    }
    d.sahne.style.setProperty("--k", Math.max(34, Math.floor(k)) + "px");
    d.sahne.style.setProperty("--p", Math.floor(p) + "px");
    d.k = Math.max(34, Math.floor(k));
    treniKoy(d.tr.r, d.tr.c, d.tr.yon, false);
  }

  // Tren konumu: karenin sol üstü + yöne göre döndürme
  function treniKoy(r, c, yon, anim = true) {
    d.tr = { r, c, yon };
    d.trenEl.style.transition = anim ? "" : "none";
    d.trenEl.style.transform = `translate(${c * d.k || 0}px, ${r * d.k || 0}px)`;
    d.trenEl.firstElementChild.style.transform = { E: "none", W: "scaleX(-1)", N: "rotate(-90deg)", S: "rotate(90deg)" }[yon];
    if (!anim) { void d.trenEl.offsetWidth; d.trenEl.style.transition = ""; }
  }

  function parcaKoy(r, c, t) {
    if (d.calisiyor || !konabilir(r, c) || !d.kutu[t]) return false;
    const k = `${r},${c}`;
    if (d.yerlesen[k]) d.kutu[d.yerlesen[k]]++;
    d.yerlesen[k] = t;
    d.kutu[t]--;
    if (!d.kutu[t] && d.secili === t) d.secili = null;
    haritaCiz(); kutuCiz();
    kare(r, c).classList.add("yeni");
    d.api.ses.yerlesti();
    return true;
  }

  function kareTik(r, c) {
    if (d.calisiyor) return;
    const k = `${r},${c}`;
    if (d.secili && konabilir(r, c)) { parcaKoy(r, c, d.secili); return; }
    if (d.yerlesen[k]) { d.kutu[d.yerlesen[k]]++; delete d.yerlesen[k]; haritaCiz(); kutuCiz(); d.api.ses.tik(); }
  }

  function parcaTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const t = btn.dataset.tur;
    btn.addEventListener("pointerdown", (e) => {
      if (d.calisiyor || !d.kutu[t]) return;
      e.preventDefault();
      aktif = true; bx = e.clientX; by = e.clientY;
      btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) {
        ucan = document.createElement("div");
        ucan.className = "tr-tasinan";
        ucan.style.width = ucan.style.height = d.k + "px";
        ucan.innerHTML = `<svg viewBox="0 0 100 100">${ray(t)}</svg>`;
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const k = alt && alt.closest(".tr-kare");
      const uygun = k && konabilir(+k.dataset.r, +k.dataset.c) ? k : null;
      if (hedef && hedef !== uygun) hedef.classList.remove("hedef");
      hedef = uygun; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) {
        ucan.remove(); ucan = null;
        if (hedef) { hedef.classList.remove("hedef"); parcaKoy(+hedef.dataset.r, +hedef.dataset.c, t); }
        hedef = null;
      } else {
        d.secili = t;
        kutuCiz(); d.api.ses.tik();
      }
    };
    btn.addEventListener("pointerup", birak);
    btn.addEventListener("pointercancel", birak);
    btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); d.secili = t; kutuCiz(); } });
  }

  // Treni raylar boyunca yürüt
  async function calistir() {
    if (d.calisiyor) return;
    d.calisiyor = true; d.dugme.disabled = true; d.secili = null; kutuCiz();
    const benim = d.uid, b = BOLUMLER[d.idx], { bas, istasyonlar, rota } = d.cozum;
    const hazir = {};
    rota.filter((h) => h.hazir).forEach((h) => (hazir[`${h.r},${h.c}`] = h.tur));
    let r = bas.r, c = bas.c, yon = bas.agiz, sonuc = null;
    for (let adim = 0; adim < 80; adim++) {
      const nr = r + YON[yon][0], nc = c + YON[yon][1], giris = TERS[yon];
      const ch = hucre(nr, nc);
      const ist = istasyonlar.find((s) => s.r === nr && s.c === nc);
      if (ist) { sonuc = ist.agiz === giris ? { tur: "istasyon", ist, r: nr, c: nc } : { tur: "kaza", r: nr, c: nc }; break; }
      const t = hazir[`${nr},${nc}`] || d.yerlesen[`${nr},${nc}`];
      if (!ch || !t || !t.includes(giris)) { sonuc = { tur: "kaza", r: nr, c: nc, disari: !ch }; break; }
      r = nr; c = nc; yon = t.replace(giris, "");
      treniKoy(r, c, yon);
      d.api.ses.adim(adim % 8);
      await bekle(400);
      if (!d || benim !== d.uid) return;
    }
    if (sonuc && sonuc.tur === "istasyon") {
      treniKoy(sonuc.r, sonuc.c, yon);
      await bekle(450);
      if (!d || benim !== d.uid) return;
      if (sonuc.ist.renk === b.hedef) return bitir();
      d.yazi.textContent = `Burası ${ISTASYON[sonuc.ist.renk].ad.toLowerCase()} istasyon. Bilet ${ISTASYON[b.hedef].ad.toLowerCase()}!`;
      d.trenEl.classList.add("salla");
    } else {
      d.yazi.textContent = sonuc && !sonuc.disari ? "Ray burada kopuk. Doğru rayı koy!" : "Tren haritadan çıkamaz!";
      if (sonuc && !sonuc.disari && kare(sonuc.r, sonuc.c)) kare(sonuc.r, sonuc.c).classList.add("kirik");
      d.trenEl.classList.add("salla");
    }
    d.api.ses.hata();
    await bekle(1500);
    if (!d || benim !== d.uid) return;
    d.trenEl.classList.remove("salla");
    d.harita.querySelectorAll(".kirik").forEach((x) => x.classList.remove("kirik"));
    treniKoy(bas.r, bas.c, bas.agiz, false);
    // Yanlışta konan raylar kutuya döner, çocuk baştan kurar
    d.yerlesen = {}; d.kutu = { ...d.cozum.gereken }; d.secili = null;
    haritaCiz(); kutuCiz(); treniKoy(bas.r, bas.c, bas.agiz, false);
    d.calisiyor = false; d.dugme.disabled = false;
  }

  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün raylar tamam, tavşan her yere gitti!" : "Son yolculuk da tamam!") : "Tavşan istasyona vardı!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.TREN_BOLUMLER = BOLUMLER; // test için
  window.TREN_COZ = coz;

  window.Uygulama.oyunEkle(11, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d || !d.cozum) return [];
      const h = d.cozum.rota.find((x) => !x.hazir && !d.yerlesen[`${x.r},${x.c}`]);
      if (!h) return [{ el: d.sahne.querySelector(".tr-hareket") }];
      return [{ el: d.sahne.querySelector(`.tr-parca[data-tur="${h.tur}"]`), hedef: d.sahne.querySelector(`.tr-kare[data-r="${h.r}"][data-c="${h.c}"]`) }, { el: d.sahne.querySelector(".tr-hareket") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-tren" aria-hidden="true">${["EW", "EW", "SW"].map((t) => `<svg viewBox="0 0 100 100">${ray(t)}</svg>`).join("")}${tren}</div>`;
    },
  });
})();
