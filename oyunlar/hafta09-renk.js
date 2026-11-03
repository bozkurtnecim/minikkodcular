/* 9. Hafta: Renk Örüntüsü (örüntü: renkle boyama).
   Boya kovasından renk seç, boş nesneyi boya. 30 bölüm kolaydan zora:
   tırtıl AB (6) → çit AAB/ABB (6) → bayrak ABC (6) → karo: sıra, sütun, dama (6)
   → usta karo: çapraz, çerçeve, halka (6). */
(function () {
  const KAYIT = "renk";

  const RENK = { k: "#ff5a4e", m: "#2f86e0", s: "#ffc23a", y: "#2fb36a", o: "#8a5cf0", t: "#ff8a1f" };
  const RENK_AD = { k: "kırmızı", m: "mavi", s: "sarı", y: "yeşil", o: "mor", t: "turuncu" };

  // Tek sıra: { tema, birim, n, bos, palet }  ·  Karo: { tema: "karo", R, C, f(r, c) → renk, bos: [[r, c]], palet }
  const sira = (tema, birim, n, bos, palet) => ({ tema, birim, n, bos, palet: palet || [...new Set(birim)] });
  const karo = (R, C, renkler, f, bos, palet) => ({ tema: "karo", R, C, renkler, f, bos, palet: palet || renkler });
  const mod = (a, b) => ((a % b) + b) % b;

  const BOLUMLER = [
    sira("tirtil", ["k", "m"], 6, [5]),
    sira("tirtil", ["s", "y"], 6, [5]),
    sira("tirtil", ["m", "s"], 7, [6]),
    sira("tirtil", ["k", "y"], 7, [5, 6]),
    sira("tirtil", ["o", "s"], 8, [6, 7]),
    sira("tirtil", ["y", "k"], 8, [6, 7], ["y", "k", "m"]),

    sira("cit", ["k", "k", "m"], 9, [8]),
    sira("cit", ["s", "y", "y"], 9, [7, 8], ["s", "y", "k"]),
    sira("cit", ["m", "m", "k"], 9, [6, 7, 8], ["m", "k", "s"]),
    sira("cit", ["y", "y", "o", "o"], 10, [8, 9], ["y", "o", "k"]),
    sira("cit", ["k", "s", "s"], 10, [4, 9], ["k", "s", "m"]),
    sira("cit", ["o", "o", "y"], 10, [2, 7, 9], ["o", "y", "s"]),

    sira("bayrak", ["k", "m", "s"], 9, [8]),
    sira("bayrak", ["y", "o", "k"], 9, [7, 8]),
    sira("bayrak", ["m", "s", "y"], 10, [4, 9], ["m", "s", "y", "k"]),
    sira("bayrak", ["k", "y", "m"], 10, [2, 6, 9], ["k", "y", "m", "o"]),
    sira("bayrak", ["o", "k", "s"], 11, [1, 5, 10], ["o", "k", "s", "m"]),
    sira("bayrak", ["k", "k", "m", "s"], 12, [3, 8, 11], ["k", "m", "s", "y"]),

    karo(3, 4, ["k", "m"], (r) => r % 2, [[2, 2], [2, 3]]),
    karo(3, 4, ["s", "y"], (r, c) => c % 2, [[0, 3], [1, 3], [2, 3]]),
    karo(3, 4, ["k", "s"], (r, c) => (r + c) % 2, [[1, 3], [2, 3]]),
    karo(4, 4, ["m", "y"], (r, c) => (r + c) % 2, [[2, 3], [3, 2], [3, 3]], ["m", "y", "k"]),
    karo(4, 5, ["k", "m", "s"], (r, c) => c % 3, [[2, 4], [3, 3], [3, 4]]),
    karo(4, 4, ["o", "k"], (r, c) => (r + c) % 2, [[0, 3], [1, 1], [2, 2], [3, 0]], ["o", "k", "s"]),

    karo(4, 4, ["k", "m", "s"], (r, c) => (r + c) % 3, [[1, 3], [3, 1], [3, 3]]),
    karo(4, 5, ["y", "o", "m"], (r, c) => mod(c - r, 3), [[0, 4], [2, 2], [3, 3], [3, 4]], ["y", "o", "m", "k"]),
    karo(4, 4, ["k", "s"], (r, c) => (Math.floor(r / 2) + Math.floor(c / 2)) % 2, [[0, 3], [2, 0], [3, 2], [3, 3]], ["k", "s", "m"]),
    karo(5, 5, ["m", "s"], (r, c) => (r === 0 || c === 0 || r === 4 || c === 4 ? 0 : 1), [[0, 4], [2, 2], [4, 0], [3, 3], [1, 4]], ["m", "s", "k"]),
    karo(5, 5, ["k", "s", "y"], (r, c) => (r + c) % 3, [[0, 4], [1, 3], [2, 4], [3, 1], [4, 3], [4, 4]], ["k", "s", "y", "m"]),
    karo(5, 5, ["k", "m", "s"], (r, c) => Math.min(r, c, 4 - r, 4 - c) % 3, [[0, 2], [1, 1], [3, 1], [3, 2], [4, 4], [1, 3]], ["k", "m", "s", "y"]),
  ].map((b, i) => ({ ...b, grup: Uygulama.seviye(i) }));

  // Bölümün bütün hücreleri: [{ renk, bos }] (karoda satır satır)
  function hucreler(b) {
    if (b.tema !== "karo") return Array.from({ length: b.n }, (_, j) => ({ renk: b.birim[j % b.birim.length], bos: b.bos.includes(j) }));
    const h = [];
    for (let r = 0; r < b.R; r++) for (let c = 0; c < b.C; c++) h.push({ renk: b.renkler[b.f(r, c)], bos: b.bos.some(([a, z]) => a === r && z === c), r, c });
    return h;
  }

  // ---------- Şekiller (100x100) ----------
  function oge(tema, renk) {
    const dolu = renk ? RENK[renk] : "#ffffff";
    const kenar = renk ? "rgba(29,40,70,.25)" : "#9fb7d4";
    const kesik = renk ? "" : `stroke-dasharray="7 5"`;
    const soru = renk ? "" : `<text x="50" y="64" font-family="Baloo 2, Arial, sans-serif" font-weight="800" font-size="34" fill="#9fb7d4" text-anchor="middle">?</text>`;
    if (tema === "tirtil") return `<circle cx="50" cy="52" r="40" fill="${dolu}" stroke="${kenar}" stroke-width="5" ${kesik}/>${renk ? `<ellipse cx="36" cy="36" rx="10" ry="6" fill="#fff" opacity=".4" transform="rotate(-30 36 36)"/>` : ""}<path d="M38 92 v8 M62 92 v8" stroke="#3a2a2a" stroke-width="5" stroke-linecap="round"/>${soru}`;
    if (tema === "cit") return `<path d="M22 98 V22 L50 4 L78 22 V98 Z" fill="${dolu}" stroke="${kenar}" stroke-width="5" stroke-linejoin="round" ${kesik}/>${soru}`;
    if (tema === "bayrak") return `<path d="M10 6 H90 L50 94 Z" fill="${dolu}" stroke="${kenar}" stroke-width="5" stroke-linejoin="round" ${kesik}/>${soru.replace('y="64"', 'y="52"')}`;
    return `<rect x="4" y="4" width="92" height="92" rx="12" fill="${dolu}" stroke="${kenar}" stroke-width="5" ${kesik}/>${soru}`;
  }
  const kova = (renk) => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 30 L26 92 Q50 100 74 92 L82 30 Z" fill="#e4edf6" stroke="#b4bfcd" stroke-width="4"/><ellipse cx="50" cy="30" rx="32" ry="10" fill="${RENK[renk]}" stroke="#b4bfcd" stroke-width="4"/><path d="M30 34 Q30 58 36 62 Q42 58 40 36 Z" fill="${RENK[renk]}"/><rect x="60" y="2" width="9" height="40" rx="4" fill="#c4935f" transform="rotate(20 64 22)"/><path d="M56 34 L72 40 L66 54 Q58 56 54 48 Z" fill="${RENK[renk]}"/></svg>`;

  const stil = `
  .rk { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--yesil); }
  .rk-sahne { --k: 80px; --p: 80px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 10px; padding: 6px 16px 14px; overflow: hidden; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .rk-baslik { margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.2rem, 3vw, 1.7rem); line-height: 1; text-align: center; }
  .rk-pano { display: grid; gap: 14px; padding: 20px 24px; border-radius: 28px; background: var(--kagit); box-shadow: 0 8px 0 rgba(29,40,70,.1); }
  .rk-sira { position: relative; display: flex; align-items: flex-end; }
  .rk-pano.tirtil .rk-sira { gap: 0; }
  .rk-pano.tirtil .rk-oge { margin-left: calc(var(--k) * -.12); }
  .rk-pano.cit .rk-sira { gap: 6px; }
  .rk-pano.cit .rk-sira::before { content: ""; position: absolute; left: -10px; right: -10px; top: 40%; height: 10px; border-radius: 4px; background: #c4935f; }
  .rk-pano.bayrak .rk-sira { gap: 4px; padding-top: 8px; }
  .rk-pano.bayrak .rk-sira::before { content: ""; position: absolute; left: -12px; right: -12px; top: 6px; height: 4px; border-radius: 2px; background: #8a5a33; }
  .rk-karo { display: grid; grid-template-columns: repeat(var(--C), var(--k)); gap: 6px; }
  .rk-oge { position: relative; width: var(--k); height: var(--k); padding: 0; border: 0; background: none; cursor: pointer; flex: none; }
  .rk-oge svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .rk-oge:disabled { cursor: default; }
  .rk-oge.yeni svg { animation: rk-boya .4s cubic-bezier(.3,1.6,.5,1); }
  .rk-oge.salla { animation: rk-salla .45s; }
  .rk-oge.birim { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 14px; background: rgba(255,194,58,.25); }
  .rk-oge.dalga svg { animation: rk-dalga .5s ease-in-out; }
  .rk-bas { width: calc(var(--k) * 1.05); height: calc(var(--k) * 1.05); flex: none; margin-right: calc(var(--k) * -.08); }
  .rk-kovalar { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; padding: 12px 22px; border-radius: 26px; border: 3px dashed var(--cizgi); background: var(--zemin-2); }
  .rk-kova { width: var(--p); height: var(--p); padding: 6px; border: 0; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.14); cursor: pointer; transition: transform .15s; }
  .rk-kova svg { width: 100%; height: 100%; display: block; }
  .rk-kova.secili { transform: translateY(-10px) scale(1.08); outline: 5px solid var(--mavi); outline-offset: 3px; }
  .rk-kovalar.uyar .rk-kova { animation: rk-salla .45s; }
  .rk-kova { touch-action: none; }
  .rk-oge.hedef { transform: scale(1.12); }
  .rk-oge.hedef svg { filter: drop-shadow(0 0 6px var(--mavi)); }
  .rk-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-30%, -80%) rotate(-12deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .rk-tasinan svg { width: 100%; height: 100%; display: block; }
  @keyframes rk-boya { from { transform: scale(.6) rotate(-10deg); } }
  @keyframes rk-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  @keyframes rk-dalga { 50% { transform: translateY(-14px) rotate(8deg); } }
  `;

  const ampul = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>`;
  const tirtilBasi = `<svg class="rk-bas" viewBox="0 0 100 100" aria-hidden="true"><path d="M34 14 Q28 0 18 2 M60 12 Q66 0 76 2" stroke="#3a2a2a" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="18" cy="3" r="5" fill="#3a2a2a"/><circle cx="76" cy="3" r="5" fill="#3a2a2a"/><circle cx="48" cy="52" r="42" fill="#9be35a" stroke="rgba(29,40,70,.25)" stroke-width="5"/><circle cx="34" cy="44" r="9" fill="#fff"/><circle cx="62" cy="44" r="9" fill="#fff"/><circle cx="36" cy="46" r="5" fill="#26201f"/><circle cx="64" cy="46" r="5" fill="#26201f"/><path d="M34 66 q14 12 28 0" stroke="#26201f" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="62" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/><ellipse cx="72" cy="62" rx="7" ry="4" fill="#ff8fa3" opacity=".7"/></svg>`;
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("rk-stil")) {
      const st = document.createElement("style"); st.id = "rk-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="rk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="rk-sahne"></div></div>`;
    api.araclar.innerHTML = `<button class="dugme" type="button" data-ipucu aria-label="İpucu: tekrar eden parçayı göster">${ampul}<span class="etiket">İpucu</span></button>`;
    d = { alan, api, ilerleme, sahne: alan.querySelector(".rk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    api.araclar.querySelector("[data-ipucu]").onclick = ipucu;
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.secili = null; d.bitiyor = false; d.satir = 0;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.hucreler = hucreler(b);
    const bosSayi = d.hucreler.filter((h) => h.bos).length;
    d.sahne.innerHTML = `
      <h2 class="rk-baslik">${bosSayi > 1 ? "Boş yerleri doğru renge boya" : "Sıradaki rengi bul ve boya"}</h2>
      <div class="rk-pano ${b.tema}"></div>
      <div class="rk-kovalar" aria-label="Boya kovaları">${b.palet.map((r) => `<button class="rk-kova" type="button" data-renk="${r}" aria-label="${RENK_AD[r]} boya">${kova(r)}</button>`).join("")}</div>`;
    d.pano = d.sahne.querySelector(".rk-pano");
    d.kovalar = d.sahne.querySelector(".rk-kovalar");
    d.kovalar.querySelectorAll(".rk-kova").forEach(kovaTasi);
    boyutla(true);
  }

  function kovaSec(k) {
    d.kovalar.querySelectorAll(".rk-kova").forEach((x) => x.classList.toggle("secili", x === k));
    d.secili = k.dataset.renk;
  }

  // Kovaya dokun (seç) ya da kovayı sürükleyip boş nesnenin üstüne bırak (boya)
  function kovaTasi(k) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    k.addEventListener("pointerdown", (e) => {
      if (d.bitiyor) return;
      e.preventDefault();
      aktif = true; bx = e.clientX; by = e.clientY;
      k.setPointerCapture && k.setPointerCapture(e.pointerId);
    });
    k.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) {
        ucan = document.createElement("div");
        ucan.className = "rk-tasinan";
        const r = k.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = kova(k.dataset.renk);
        document.body.appendChild(ucan);
        kovaSec(k);
      }
      ucan.style.left = e.clientX + "px";
      ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const o = alt && alt.closest(".rk-oge:not(:disabled)");
      if (hedef && hedef !== o) hedef.classList.remove("hedef");
      hedef = o || null; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) {
        ucan.remove(); ucan = null;
        if (hedef) { hedef.classList.remove("hedef"); boya(hedef); }
        hedef = null;
      } else { kovaSec(k); d.api.ses.tik(); }
    };
    k.addEventListener("pointerup", birak);
    k.addEventListener("pointercancel", birak);
    k.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kovaSec(k); d.api.ses.tik(); } });
  }

  function panoCiz() {
    const b = BOLUMLER[d.idx];
    const ogeHTML = (h, j) => `<button class="rk-oge" type="button" data-j="${j}" ${h.bos ? `aria-label="Boş, boya"` : `disabled aria-label="${RENK_AD[h.renk]}"`}><svg viewBox="0 0 100 100">${oge(b.tema, h.bos ? null : h.renk)}</svg></button>`;
    if (b.tema === "karo") {
      d.pano.innerHTML = `<div class="rk-karo" style="--C:${b.C}">${d.hucreler.map(ogeHTML).join("")}</div>`;
    } else {
      const adet = Math.ceil(d.hucreler.length / d.satir);
      let html = "";
      for (let r = 0; r < d.satir; r++) {
        html += `<div class="rk-sira">${r === 0 && b.tema === "tirtil" ? tirtilBasi : ""}`;
        for (let j = r * adet; j < Math.min(d.hucreler.length, (r + 1) * adet); j++) html += ogeHTML(d.hucreler[j], j);
        html += `</div>`;
      }
      d.pano.innerHTML = html;
    }
    d.pano.querySelectorAll(".rk-oge:not(:disabled)").forEach((o) => (o.onclick = () => boya(o)));
  }

  function boyutla(zorla) {
    if (!d || !d.pano) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32 - 56, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    const p = Math.max(60, Math.min(96, Math.floor(W / (b.palet.length + 0.6) - 16)));
    let k, satir = 1;
    if (b.tema === "karo") {
      k = Math.min((W - (b.C - 1) * 6) / b.C, (H - 50 - p - 40 - 60 - (b.R - 1) * 6) / b.R, 88);
    } else {
      const n = d.hucreler.length + (b.tema === "tirtil" ? 1 : 0);
      k = Math.min(96, W / n);
      if (k < 58) { satir = 2; k = Math.min(96, W / Math.ceil(n / 2)); }
      k = Math.min(k, (H - 50 - p - 40 - 60 - (satir - 1) * 14) / satir);
    }
    d.sahne.style.setProperty("--k", Math.max(36, Math.floor(k)) + "px");
    d.sahne.style.setProperty("--p", p + "px");
    if (zorla || satir !== d.satir) { d.satir = satir; panoCiz(); }
  }

  function boya(o) {
    if (d.bitiyor) return;
    const j = +o.dataset.j, h = d.hucreler[j];
    if (!d.secili) {
      // Önce kova seçilmeli: kovaları hafifçe salla
      d.kovalar.classList.remove("uyar"); void d.kovalar.offsetWidth; d.kovalar.classList.add("uyar");
      setTimeout(() => d.kovalar.classList.remove("uyar"), 500);
      return;
    }
    if (d.secili === h.renk) {
      h.bos = false;
      o.disabled = true;
      o.setAttribute("aria-label", RENK_AD[h.renk]);
      o.querySelector("svg").innerHTML = oge(BOLUMLER[d.idx].tema, h.renk);
      o.classList.add("yeni");
      d.api.ses.yerlesti();
      if (!d.hucreler.some((x) => x.bos)) bitir();
    } else {
      o.classList.remove("salla"); void o.offsetWidth; o.classList.add("salla");
      setTimeout(() => o.classList.remove("salla"), 500);
      d.api.ses.hata();
    }
  }

  // İpucu: tekrar eden ilk parçayı (karoda ilk satırı) sarıyla göster
  function ipucu() {
    if (!d || d.bitiyor) return;
    const b = BOLUMLER[d.idx];
    const L = b.tema === "karo" ? b.C : b.birim.length;
    const ogeler = [...d.pano.querySelectorAll(".rk-oge")];
    ogeler.forEach((o, j) => o.classList.toggle("birim", j < L));
    d.api.ses.tik();
    clearTimeout(d.ipucuZaman);
    d.ipucuZaman = setTimeout(() => ogeler.forEach((o) => o.classList.remove("birim")), 2800);
  }

  async function bitir() {
    d.bitiyor = true;
    const benim = d.uid;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    await bekle(400);
    const ogeler = [...d.pano.querySelectorAll(".rk-oge")];
    const adim = ogeler.length > 14 ? 50 : 110;
    for (let j = 0; j < ogeler.length; j++) {
      if (!d || benim !== d.uid) return;
      ogeler[j].classList.add("dalga");
      if (j % 2 === 0) d.api.ses.adim(j % 8);
      await bekle(adim);
    }
    await bekle(450);
    if (!d || benim !== d.uid) return;
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün örüntüleri boyadın!" : "Son desen de tamam!") : "Örüntü tamam!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.RENK_BOLUMLER = BOLUMLER; // test için
  window.RENK_HUCRELER = hucreler;

  window.Uygulama.oyunEkle(9, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d || !d.hucreler) return [];
      const j = d.hucreler.findIndex((h) => h.bos);
      if (j < 0) return [];
      return [{ el: d.sahne.querySelector(`.rk-kova[data-renk="${d.hucreler[j].renk}"]`) }, { el: d.sahne.querySelector(`.rk-oge[data-j="${j}"]`) }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) { d.uid++; clearTimeout(d.ipucuZaman); } d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const renkler = ["k", "s", "k", "s", "m", "y", "m", "y", "k", "s", "k", "s"];
      return `<div class="mini mini-karo" aria-hidden="true">${renkler.map((r) => `<span style="background:${RENK[r]}"></span>`).join("")}</div>`;
    },
  });
})();
