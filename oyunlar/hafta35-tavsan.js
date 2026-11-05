/* Kalem Tavşan (program bir çizim üretir, kalem rengi de programın parçası).
   Tavşanın kuyruğunda kalem var: yürüdüğü her yere o anki kalem rengiyle çizgi çizer. Kalem kartı rengi değiştirir.
   Silik renkli çizimi aynı renklerle çizdirecek programı yaz. Yanlış renkle ya da fazladan çizgi çizerse başa döner.
   Aynı çizginin üstünden doğru renkle geçmek serbest. 30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "tavsan";
  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = { u: { aci: 0, ad: "Yukarı" }, r: { aci: 90, ad: "Sağa" }, d: { aci: 180, ad: "Aşağı" }, l: { aci: 270, ad: "Sola" } };
  const KALEM = { K: { renk: "#ff4b3e", ad: "Kırmızı kalem" }, M: { renk: "#2f7fe0", ad: "Mavi kalem" }, Y: { renk: "#22b05f", ad: "Yeşil kalem" } };
  const okSvg = (y) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="#5d6878"/><rect x="3" y="80" width="94" height="17" rx="8" fill="#3e4757" opacity=".5"/><g transform="rotate(${OK[y].aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g></svg>`;
  const kalemSvg = (k) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="#fff" stroke="${KALEM[k].renk}" stroke-width="6"/><g transform="rotate(45 50 50)"><rect x="40" y="14" width="20" height="52" rx="3" fill="${KALEM[k].renk}"/><rect x="40" y="14" width="20" height="10" rx="3" fill="#f3b8c8"/><path d="M40 66 L50 88 L60 66 Z" fill="#f6d7a7"/><path d="M46 79 L50 88 L54 79 Z" fill="${KALEM[k].renk}"/></g></svg>`;
  const kartSvg = (k) => (KALEM[k] ? kalemSvg(k) : okSvg(k));
  // Yukarı bakan tavşan (kulakları önde), kuyruğundaki kalemin rengi değişir
  const tavsan = (renk) => `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="56" r="40" fill="${renk}" opacity=".22"/><path d="M50 92 v-10" stroke="${renk}" stroke-width="9" stroke-linecap="round"/><ellipse cx="40" cy="14" rx="7" ry="16" fill="#f1eef6" stroke="#cfc6dc" stroke-width="2"/><ellipse cx="60" cy="14" rx="7" ry="16" fill="#f1eef6" stroke="#cfc6dc" stroke-width="2"/><ellipse cx="40" cy="14" rx="3" ry="10" fill="#f6b6c8"/><ellipse cx="60" cy="14" rx="3" ry="10" fill="#f6b6c8"/><ellipse cx="50" cy="58" rx="24" ry="26" fill="#f1eef6" stroke="#cfc6dc" stroke-width="2"/><circle cx="50" cy="36" r="15" fill="#f1eef6" stroke="#cfc6dc" stroke-width="2"/><circle cx="44" cy="33" r="2.6" fill="#26201f"/><circle cx="56" cy="33" r="2.6" fill="#26201f"/><circle cx="50" cy="40" r="2.6" fill="#f08aa6"/><circle cx="50" cy="82" r="8" fill="#fff" stroke="#cfc6dc" stroke-width="2"/></svg>`;

  // Bölüm: noktalı zemin, başlangıç ve renkli kenarlar (kenar → renk). Rastgele renkli yürüyüşten üretilir.
  const kenarAd = (a, b) => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? `${a}|${b}` : `${b}|${a}`);
  function coz(b) {
    const hedef = new Map(b.kenarlar), n = hedef.size;
    const kuyruk = [[b.bas[0], b.bas[1], "K", "", ""]], gor = new Set([`${b.bas},K,`]);
    while (kuyruk.length) {
      const [y, x, kalem, cizili, prog] = kuyruk.shift();
      for (const k of [...Object.keys(YON), ...b.kalemler]) {
        let ny = y, nx = x, nk = kalem, anahtar = cizili;
        if (YON[k]) {
          ny = y + YON[k][0]; nx = x + YON[k][1];
          if (ny < 0 || ny >= b.R || nx < 0 || nx >= b.C) continue;
          const ka = kenarAd([y, x], [ny, nx]);
          if (hedef.get(ka) !== kalem) continue;
          const set = new Set(cizili ? cizili.split(";") : []); set.add(ka);
          if (set.size === n) return prog + k;
          anahtar = [...set].sort().join(";");
        } else { if (k === kalem) continue; nk = k; }
        const key = `${ny},${nx},${nk},${anahtar}`;
        if (gor.has(key)) continue;
        gor.add(key); kuyruk.push([ny, nx, nk, anahtar, prog + k]);
      }
    }
    return null;
  }
  const rnd = (() => { let s = 3535; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  function uret(R, C, adim, parca, renkSay, min, max) {
    for (let deneme = 0; deneme < 40000; deneme++) {
      const bas = [Math.floor(rnd() * R), Math.floor(rnd() * C)];
      let [y, x] = bas; const yol = [], kul = new Set();
      for (let t = 0; t < adim; t++) {
        const ad = Object.keys(YON).filter((k) => { const ny = y + YON[k][0], nx = x + YON[k][1]; return ny >= 0 && ny < R && nx >= 0 && nx < C && !kul.has(kenarAd([y, x], [ny, nx])); });
        if (!ad.length) break;
        const k = ad[Math.floor(rnd() * ad.length)], ny = y + YON[k][0], nx = x + YON[k][1];
        kul.add(kenarAd([y, x], [ny, nx])); yol.push(kenarAd([y, x], [ny, nx])); y = ny; x = nx;
      }
      if (yol.length < adim) continue;
      // Yolu parçalara böl, her parçaya bir renk (komşu parçalar farklı)
      const kes = new Set(); while (kes.size < parca - 1) kes.add(1 + Math.floor(rnd() * (adim - 1)));
      const havuz = ["K", "M", "Y"].slice(0, renkSay);
      let renk = havuz[Math.floor(rnd() * havuz.length)];
      const kenarlar = yol.map((e, i) => { if (kes.has(i)) { const s = havuz.filter((c) => c !== renk); renk = s[Math.floor(rnd() * s.length)]; } return [e, renk]; });
      const kullanilan = new Set(kenarlar.map(([, c]) => c));
      if (kullanilan.size < Math.min(renkSay, parca)) continue;
      const b = { R, C, bas, kenarlar, kalemler: havuz };
      const cz = coz(b);
      if (!cz || cz.length < min || cz.length > max) continue;
      // Kullanılmayan kenar satır/sütunları kırp
      const nk = kenarlar.flatMap(([e]) => e.split("|").map((t) => t.split(",").map(Number)));
      const y0 = Math.min(...nk.map((q) => q[0])), x0 = Math.min(...nk.map((q) => q[1]));
      let R2 = Math.max(...nk.map((q) => q[0])) - y0 + 1, C2 = Math.max(...nk.map((q) => q[1])) - x0 + 1;
      // Tek çizgilik çizimde kâğıt çok ince kalmasın: en az 3 nokta, çizim ortada
      const oy = R2 < 3 ? Math.floor((3 - R2) / 2) : 0, ox = C2 < 3 ? Math.floor((3 - C2) / 2) : 0;
      R2 = Math.max(3, R2); C2 = Math.max(3, C2);
      const kay = (q) => [q[0] - y0 + oy, q[1] - x0 + ox];
      return { R: R2, C: C2, bas: kay(bas), kalemler: havuz, cozum: cz,
        kenarlar: kenarlar.map(([e, c]) => [e.split("|").map((t) => kay(t.split(",").map(Number))).join("|"), c]) };
    }
    throw new Error("bölüm kurulamadı");
  }
  // [satır, sütun, adım, renk parçası, renk sayısı, en kısa program aralığı]
  const T = [
    [3, 3, 2, 2, 2, 3, 3], [3, 3, 2, 2, 2, 3, 3], [3, 3, 2, 2, 2, 3, 4],
    [3, 3, 3, 2, 2, 4, 5], [3, 3, 3, 2, 2, 4, 5], [3, 4, 3, 3, 2, 5, 5],
    [3, 3, 4, 2, 2, 5, 6], [3, 4, 4, 3, 2, 6, 6], [3, 3, 4, 3, 3, 6, 7], [3, 4, 4, 3, 3, 6, 7], [4, 4, 4, 3, 3, 6, 7], [3, 4, 5, 3, 2, 7, 7],
    [3, 4, 5, 3, 3, 7, 8], [4, 4, 5, 3, 3, 7, 8], [3, 4, 5, 4, 3, 8, 8], [4, 4, 5, 3, 3, 7, 8], [3, 4, 6, 3, 3, 8, 9], [4, 4, 5, 4, 3, 8, 9],
    [4, 4, 6, 3, 3, 8, 9], [3, 4, 6, 4, 3, 9, 10], [4, 4, 6, 4, 3, 9, 10], [4, 4, 6, 3, 3, 9, 10], [4, 4, 6, 4, 3, 9, 10], [4, 4, 7, 3, 3, 9, 10],
    [4, 4, 6, 4, 3, 10, 10], [4, 4, 7, 3, 3, 10, 10], [4, 4, 6, 4, 3, 10, 10], [4, 4, 7, 3, 3, 10, 10], [4, 4, 7, 3, 3, 10, 10], [4, 4, 6, 4, 3, 10, 10],
  ];
  const BOLUMLER = T.map(([R, C, a, p, rs, mn, mx], i) => ({ ...uret(R, C, a, p, rs, mn, mx), grup: Uygulama.seviye(i), ek: i < 6 ? 1 : 2 }));

  const stil = `
  .tv { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f4f0ff, #e9e2fb); }
  .tv-sahne { --k: 90px; --p: 62px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 22px; padding: 8px 16px 16px; overflow: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .tv-sahne.dikey { flex-direction: column; gap: 10px; justify-content: safe center; }
  .tv-kagit { position: relative; padding: 24px; border-radius: 22px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .tv-kagit svg.zemin { display: block; overflow: visible; }
  .tv-kagit .hedef { stroke-width: 12; stroke-linecap: round; stroke-dasharray: 2 17; opacity: .45; }
  .tv-kagit .cizgi { stroke-width: 9; stroke-linecap: round; }
  .tv-kagit .cizgi.fazla { stroke-dasharray: 8 8; }
  .tv-kagit .carpi { stroke: #2b2f3a; stroke-width: 5; stroke-linecap: round; }
  .tv-kagit .nokta { fill: #c9d3e0; }
  .tv-kap { position: absolute; left: 0; top: 0; width: calc(var(--k) * .8); height: calc(var(--k) * .8); margin: calc(var(--k) * -.4) 0 0 calc(var(--k) * -.4); transition: transform .35s ease-in-out; pointer-events: none; z-index: 2; }
  .tv-kap > div { width: 100%; height: 100%; transition: transform .2s; }
  .tv-kap svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.2)); }
  .tv-kap.uzgun > div > svg { animation: tv-salla .5s 2; }
  @keyframes tv-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  .tv-yan { display: grid; justify-items: center; gap: 12px; }
  .tv-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: min(100%, 560px); box-sizing: border-box; }
  .tv-yer { width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); cursor: pointer; }
  .tv-yer.dolu { border: 0; background: none; }
  .tv-yer svg { width: 100%; height: 100%; display: block; }
  .tv-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .tv-yer.hata { outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; animation: tv-salla .5s 2; }
  .tv-yer.hedefte { border-color: var(--mavi); background: #d4e8ff; }
  .tv-kalemler { display: flex; flex-direction: column; gap: 8px; }
  .tv-sahne.dikey .tv-kalemler { flex-direction: row; }
  .tv-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .tv-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; }
  .tv-ok { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .tv-ok svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .tv-ok[data-y="u"] { grid-column: 2; grid-row: 1; } .tv-ok[data-y="l"] { grid-column: 1; grid-row: 2; } .tv-ok[data-y="d"] { grid-column: 2; grid-row: 2; } .tv-ok[data-y="r"] { grid-column: 3; grid-row: 2; }
  .tv-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); }
  .tv-tasinan svg { width: 100%; height: 100%; display: block; }
  .tv-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .tv-calistir svg { width: 30px; height: 30px; }
  .tv-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("tv-stil")) { const st = document.createElement("style"); st.id = "tv-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="tv"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="tv-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".tv-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    d.program = []; d.yer = null;
    d.yerSayi = Math.min(14, b.cozum.length + b.ek);
    d.kalem = "K";
    d.sahne.innerHTML = `
      <div class="tv-kagit"><svg class="zemin"></svg><div class="tv-kap"><div>${tavsan(KALEM.K.renk)}</div></div></div>
      <div class="tv-yan">
        <div class="tv-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="tv-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. komut"></div>`).join("")}</div>
        <div class="tv-alt">
          <div class="tv-oklar" aria-label="Ok kartları">${["u", "l", "d", "r"].map((y) => `<button class="tv-ok" type="button" data-y="${y}" aria-label="${OK[y].ad}">${okSvg(y)}</button>`).join("")}</div>
          <div class="tv-kalemler" aria-label="Kalem kartları">${b.kalemler.map((k) => `<button class="tv-ok tv-kalem" type="button" data-y="${k}" aria-label="${KALEM[k].ad}">${kalemSvg(k)}</button>`).join("")}</div>
          <button class="tv-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çiz</span></button>
        </div>
      </div>`;
    d.svg = d.sahne.querySelector("svg.zemin");
    d.kap = d.sahne.querySelector(".tv-kap");
    d.programEl = d.sahne.querySelector(".tv-program");
    d.dugme = d.sahne.querySelector(".tv-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".tv-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".tv-ok").forEach(okTasi);
    d.cizili = [];
    programCiz();
    boyutla();
  }
  function zeminCiz() {
    const b = BOLUMLER[d.idx], k = d.k;
    const P = (p) => [p[1] * k, p[0] * k];
    let s = "";
    b.kenarlar.forEach(([e, renk]) => { const [a, c] = e.split("|").map((t) => t.split(",").map(Number)); const [x1, y1] = P(a), [x2, y2] = P(c); s += `<line class="hedef" stroke="${KALEM[renk].renk}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; });
    d.cizili.forEach(({ a, c, fazla, renk }) => { const [x1, y1] = P(a), [x2, y2] = P(c); s += `<line class="cizgi${fazla ? " fazla" : ""}" stroke="${KALEM[renk].renk}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; if (fazla) { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, r = 9; s += `<path class="carpi" d="M${mx - r} ${my - r} L${mx + r} ${my + r} M${mx + r} ${my - r} L${mx - r} ${my + r}"/>`; } });
    for (let y = 0; y < b.R; y++) for (let x = 0; x < b.C; x++) s += `<circle class="nokta" cx="${x * k}" cy="${y * k}" r="${Math.max(4, k * 0.07)}"/>`;
    d.svg.setAttribute("width", (b.C - 1) * k); d.svg.setAttribute("height", (b.R - 1) * k);
    d.svg.setAttribute("viewBox", `0 0 ${(b.C - 1) * k} ${(b.R - 1) * k}`);
    d.svg.innerHTML = s;
  }
  function programCiz() {
    d.programEl.querySelectorAll(".tv-yer").forEach((y, j) => { y.className = "tv-yer" + (j < d.program.length ? " dolu" : ""); y.innerHTML = j < d.program.length ? kartSvg(d.program[j]) : ""; });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }
  function boyutla() {
    if (!d || !d.svg) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.1;
    d.sahne.classList.toggle("dikey", dikey);
    let p = Math.max(44, Math.min(70, Math.floor((dikey ? W - 30 : W * 0.42) / Math.min(d.yerSayi, 6) - 10)));
    const satir = Math.ceil(d.yerSayi / Math.max(1, Math.floor(((dikey ? W : W * 0.42) - 24) / (p + 8))));
    const k = dikey ? Math.min((W - 60) / Math.max(1, b.C - 1), (H - satir * (p + 8) - 3 * p - 150) / Math.max(1, b.R - 1), 130) : Math.min((W * 0.5 - 60) / Math.max(1, b.C - 1), (H - 70) / Math.max(1, b.R - 1), 140);
    d.k = Math.max(40, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px"); d.sahne.style.setProperty("--p", p + "px");
    zeminCiz();
    // Kâğıt (köşedeki karakter payıyla) ekrana sığmıyorsa küçült: karakter sol/sağ kenardan taşmasın, alttaki düğme kesilmesin
    const sigmiyor = () => {
      const s = d.sahne.getBoundingClientRect(), r = d.sahne.querySelector(".tv-kagit").getBoundingClientRect(), m = d.k * 0.45;
      return r.left - m < s.left || r.right + m > s.right || d.sahne.scrollHeight > d.sahne.clientHeight + 1 || d.sahne.scrollWidth > d.sahne.clientWidth + 1;
    };
    for (let t = 0; t < 40 && d.k > 30 && sigmiyor(); t++) { d.k -= 2; d.sahne.style.setProperty("--k", d.k + "px"); zeminCiz(); }
    kapKoy(...(d.yer || b.bas), "u", false);
  }
  function kalemKoy(k) { d.kalem = k; d.kap.firstElementChild.innerHTML = tavsan(KALEM[k].renk); }
  function kapKoy(y, x, yon, anim = true) {
    d.yer = [y, x];
    d.kap.style.transition = anim ? "" : "none";
    d.kap.style.transform = `translate(${24 + x * d.k}px, ${24 + y * d.k}px)`;
    d.kap.firstElementChild.style.transform = `rotate(${OK[yon].aci}deg)`;
    if (!anim) { void d.kap.offsetWidth; d.kap.style.transition = ""; }
  }
  function kartKoy(y, j) {
    if (d.calisiyor) return;
    if (j == null || j >= d.program.length) { if (d.program.length >= d.yerSayi) return; d.program.push(y); } else d.program[j] = y;
    programCiz(); d.api.ses.tik();
  }
  function okTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const y = btn.dataset.y;
    btn.addEventListener("pointerdown", (e) => { if (d.calisiyor) return; e.preventDefault(); aktif = true; bx = e.clientX; by = e.clientY; btn.setPointerCapture && btn.setPointerCapture(e.pointerId); });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) { ucan = document.createElement("div"); ucan.className = "tv-tasinan"; const rr = btn.getBoundingClientRect(); ucan.style.width = ucan.style.height = rr.width + "px"; ucan.innerHTML = kartSvg(y); document.body.appendChild(ucan); }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY), yer = alt && alt.closest(".tv-yer");
      if (hedef && hedef !== yer) hedef.classList.remove("hedefte");
      hedef = yer || null; if (hedef) hedef.classList.add("hedefte");
    });
    const birak = () => { if (!aktif) return; aktif = false; if (ucan) { ucan.remove(); ucan = null; if (hedef) { hedef.classList.remove("hedefte"); kartKoy(y, +hedef.dataset.j); } hedef = null; } else kartKoy(y); };
    btn.addEventListener("pointerup", birak); btn.addEventListener("pointercancel", birak);
  }

  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, b = BOLUMLER[d.idx], hedef = new Map(b.kenarlar), yerler = [...d.programEl.querySelectorAll(".tv-yer")];
    d.cizili = []; zeminCiz();
    let [y, x] = b.bas, hata = -1, yon = "u";
    const cizilen = new Set();
    kalemKoy("K");
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((e, q) => e.classList.toggle("simdi", q === j));
      const k = d.program[j];
      if (KALEM[k]) { kalemKoy(k); d.api.ses.ton(700, 0.15); await bekle(380); if (!d || benim !== d.uid) return; continue; }
      yon = k;
      const ny = y + YON[k][0], nx = x + YON[k][1];
      if (ny < 0 || ny >= b.R || nx < 0 || nx >= b.C) {
        kapKoy(y + YON[k][0] * 0.3, x + YON[k][1] * 0.3, k); await bekle(240); if (!d || benim !== d.uid) return; kapKoy(y, x, k); hata = j; break;
      }
      const ka = kenarAd([y, x], [ny, nx]), fazla = hedef.get(ka) !== d.kalem;
      kapKoy(ny, nx, k);
      await bekle(200);
      if (!d || benim !== d.uid) return;
      d.cizili.push({ a: [y, x], c: [ny, nx], fazla, renk: d.kalem }); zeminCiz();
      d.api.ses.adim(j % 8);
      y = ny; x = nx;
      await bekle(220);
      if (!d || benim !== d.uid) return;
      if (fazla) { hata = j; break; }
      cizilen.add(ka);
      if (cizilen.size === hedef.size && j === d.program.length - 1) break;
    }
    yerler.forEach((e) => e.classList.remove("simdi"));
    if (hata < 0 && cizilen.size === hedef.size) { d.api.ses.yerlesti(); await bekle(500); if (!d || benim !== d.uid) return; return bitir(); }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.kap.classList.add("uzgun"); d.api.ses.hata();
    await bekle(1600);
    if (!d || benim !== d.uid) return;
    d.kap.classList.remove("uzgun"); yerler.forEach((e) => e.classList.remove("hata"));
    d.cizili = []; zeminCiz(); kalemKoy("K"); kapKoy(...b.bas, "u", false);
    // Yanlışta program silinir, çocuk baştan kurar
    d.program = []; d.calisiyor = false; programCiz();
  }
  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün renkli çizimleri yaptın, minik ressam!" : "Son çizim de bitti!") : "Renkli çizim tamam!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.TAVSAN_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(35, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const sol = [...BOLUMLER[d.idx].cozum].slice(0, tam ? undefined : 2);
      return [{ el: d.kap }, ...sol.map((y, j) => ({ el: d.sahne.querySelector(`.tv-ok[data-y="${y}"]`), hedef: d.sahne.querySelector(`.tv-yer[data-j="${j}"]`) })), { el: d.dugme }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${tavsan(KALEM.M.renk)}<svg viewBox="0 0 60 40" style="width:56px"><path d="M6 34 V18 H24" stroke="${KALEM.K.renk}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 18 V6 H44 V20" stroke="${KALEM.M.renk}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>${kalemSvg("Y")}</div>`; },
  });
})();
