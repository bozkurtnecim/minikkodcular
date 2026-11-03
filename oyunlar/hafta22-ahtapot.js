/* 22. Hafta: Ahtapotun Hazinesi (sayılı komut blokları ve hata ayıklama).
   Ahtapot yalnızca cam karolardan yürür; karonun dışı sudur. Bloklar ▶ başlat bloğunun altına dizilir,
   ▶'ye dokununca program çalışır. Programdaki bloğa dokununca adım sayısı 1→2→3→4 olur.
   Bütün altınları toplayıp sandığa var. Bazı zor bölümlerde program hazır ama bozuk gelir (🔧):
   yanlış bloğu bul ve düzelt. 30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "ahtapot";

  // Harita: A ahtapot, P sandık, o karo, c altınlı karo, . su. bozuk: hazır gelen hatalı program ("r3u1" gibi)
  const BOLUMLER = [
    { harita: ["AoP"] },
    { harita: ["P", "o", "o", "A"] },
    { harita: ["Aoo", "..o", "..P"] },

    { harita: ["Aooo", "...o", "...P"] },
    { harita: ["..ooA", "..o..", "..P.."] },
    { harita: ["..Pc.", "...o.", "...o.", "Aooo."] },

    { harita: [".ooc.", ".A.P.", ".....", "....."] },
    { harita: [".oooA", ".o...", ".o...", ".ocoP"] },
    { harita: ["oooo.", "c..P.", "A....", "....."] },
    { harita: ["......", "P..ooA", "o..o..", "ooco.."] },
    { harita: ["...ooo", "...o.o", "...c.o", "Pooo.A"] },
    { harita: ["A.....", "c.ooP.", "o.o...", "ooo..."] },

    { harita: ["...coo", "...o.o", ".Aoo.o", ".....P"] },
    { harita: [".Poo.A", "...c.o", "...ooo", "......"], bozuk: "d2l3u2l2" },
    { harita: ["..oooo", "..oc.o", "..A..o", "...Poo"] },
    { harita: ["..oooo", "..o..o", "..o..o", "Aoc..P"], bozuk: "r1u3r3d3" },
    { harita: ["oooc..P", "o.o...o", "o.o...o", "A.o...o", "..ooooc"] },
    { harita: ["......", "Acoo.P", "...o.o", "...ooo"], bozuk: "r3r2r2u2" },

    { harita: [".......", "P..coo.", "o..oco.", "oooo.o.", ".....A."] },
    { harita: [".oooA..", ".o.....", ".oooc..", "...co..", "..Poo.."], bozuk: "l3d2r2l1d2l1" },
    { harita: ["..ooo..", "..o.o..", "ooo.c..", "o.c.A..", "P......"] },
    { harita: [".......", "....ooP", "ooAco..", "o...o..", "ocooo.."], bozuk: "r1r3d2r4u3r2" },
    { harita: [".......", "oooooc.", "o..o..P", "A..o..o", "...ocoo"] },
    { harita: ["..oooP.", "..o....", "..oooc.", "....co.", "..Aooo."], bozuk: "r2d2r1l3u2r3" },
    { harita: ["A....P.", "o...co.", "o.oooo.", "o.o....", "coo...."] },
    { harita: ["........", "..oooo..", "..o..ooc", "..o..ooo", "Aoo..c.o", ".......P"], bozuk: "r2u2r2d3u2r2d3" },
    { harita: [".......", "Aoo....", "..o.Poo", "cco...o", "..ooooo"] },
    { harita: [".ooc..A.", ".o.o..o.", ".o.oooo.", ".oc.....", ".ooooP..", "........"], bozuk: "d2l2u2l2d3r1d1l3" },
    { harita: [".oco.P.", "co.o.o.", ".A.o.o.", "...o.o.", "...ooo."] },
    { harita: ["......c.", "......o.", ".ooo.ooP", ".o.o.c..", ".o.ooo..", ".A......"], bozuk: "l3r2d2r2u1r1u2d2r1" },
  ].map((b, i) => ({ ...b, grup: Uygulama.seviye(i), ek: i < 6 ? 1 : 2 }));

  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = {
    u: { renk: "#2f86e0", koyu: "#1f62ab", ad: "Yukarı", aci: 0 },
    r: { renk: "#2fb36a", koyu: "#1f8a4f", ad: "Sağa", aci: 90 },
    d: { renk: "#ff8a1f", koyu: "#d96a0a", ad: "Aşağı", aci: 180 },
    l: { renk: "#8a5cf0", koyu: "#6a3fcc", ad: "Sola", aci: 270 },
  };
  const programOku = (s) => (s.match(/[urdl]\d/g) || []).map((t) => ({ y: t[0], n: +t[1] }));

  // Haritayı çöz: her blok bir yön ve 1-4 adım; bütün altınları alıp sandıkta biten en kısa program
  function coz(harita) {
    const R = harita.length, C = harita[0].length;
    let bas, sandik; const altinlar = [];
    harita.forEach((s, r) => [...s].forEach((ch, c) => {
      if (ch === "A") bas = [r, c];
      if (ch === "P") sandik = [r, c];
      if (ch === "c") altinlar.push([r, c]);
    }));
    const su = (r, c) => r < 0 || r >= R || c < 0 || c >= C || harita[r][c] === "." || harita[r][c] === " ";
    const tam = (1 << altinlar.length) - 1;
    const ai = (r, c) => altinlar.findIndex(([a, b]) => a === r && b === c);
    const kuyruk = [[bas[0], bas[1], 0, []]], gorulen = new Set([`${bas[0]},${bas[1]},0`]);
    while (kuyruk.length) {
      const [r0, c0, m0, prog] = kuyruk.shift();
      for (const [y, [dr, dc]] of Object.entries(YON)) for (let n = 1; n <= 4; n++) {
        let r = r0, c = c0, m = m0, tamam = true, vardi = false;
        for (let k = 0; k < n; k++) {
          r += dr; c += dc;
          if (su(r, c)) { tamam = false; break; }
          const j = ai(r, c); if (j >= 0) m |= 1 << j;
          if (m === tam && r === sandik[0] && c === sandik[1]) { vardi = true; break; }
        }
        if (!tamam) break;
        const yeni = [...prog, { y, n }];
        if (vardi) return { R, C, bas, sandik, altinlar, su, enKisa: yeni };
        const key = `${r},${c},${m}`;
        if (gorulen.has(key)) continue;
        gorulen.add(key); kuyruk.push([r, c, m, yeni]);
      }
    }
    return { R, C, bas, sandik, altinlar, su, enKisa: null };
  }

  // ---------- Çizimler ----------
  const blokSvg = (y, n) => {
    const o = OK[y];
    return `<svg viewBox="0 0 140 100" aria-hidden="true"><rect x="3" y="3" width="134" height="94" rx="16" fill="${o.renk}"/><rect x="3" y="80" width="134" height="17" rx="8" fill="${o.koyu}" opacity=".5"/><g transform="translate(-4 0) rotate(${o.aci} 50 46)"><path d="M50 16 L78 48 H61 V78 H39 V48 H22 Z" fill="#fff"/></g><circle cx="106" cy="47" r="24" fill="#fff"/><text x="106" y="59" text-anchor="middle" font-family="Baloo 2, Arial Rounded MT Bold, sans-serif" font-weight="800" font-size="34" fill="${o.koyu}">${n}</text></svg>`;
  };
  const okSvg = (y) => { const o = OK[y]; return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${o.renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${o.koyu}" opacity=".5"/><g transform="rotate(${o.aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g></svg>`; };
  const ahtapot = `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="#9b5de5">${[18, 32, 46, 60, 74].map((x, i) => `<path d="M${x} 56 q${i % 2 ? 4 : -4} 18 ${i < 2 ? -6 : i > 2 ? 6 : 0} 32 q6 2 8 -4 q-4 -14 2 -28 z"/>`).join("")}</g><ellipse cx="50" cy="42" rx="32" ry="30" fill="#b57bff"/><ellipse cx="40" cy="26" rx="9" ry="6" fill="#d3b1ff" opacity=".8"/><circle cx="39" cy="44" r="10" fill="#fff"/><circle cx="61" cy="44" r="10" fill="#fff"/><circle cx="41" cy="46" r="5" fill="#26201f"/><circle cx="63" cy="46" r="5" fill="#26201f"/><circle cx="42.5" cy="44" r="1.8" fill="#fff"/><circle cx="64.5" cy="44" r="1.8" fill="#fff"/><path d="M44 60 q6 6 12 0" stroke="#5a2a8a" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`;
  const altin = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,.35)" stroke="rgba(255,255,255,.9)" stroke-width="3"/><path d="M26 34 a28 28 0 0 1 18 -12" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="52" rx="20" ry="22" fill="#f5b400"/><ellipse cx="50" cy="52" rx="14" ry="16" fill="#ffd23f"/><path d="M50 42 v20" stroke="#e39b00" stroke-width="5" stroke-linecap="round"/></svg>`;
  const sandikSvg = (acik) => `<svg viewBox="0 0 100 100" aria-hidden="true">${acik ? `<path d="M14 40 L20 14 H80 L86 40 Z" fill="#a8652f"/><path d="M20 38 Q50 18 80 38" fill="#ffd23f"/><circle cx="40" cy="34" r="6" fill="#ffe680"/><circle cx="58" cy="30" r="5" fill="#ffe680"/>` : `<path d="M14 44 Q14 18 50 18 Q86 18 86 44 Z" fill="#a8652f"/><path d="M14 44 Q14 26 50 26 Q86 26 86 44" fill="none" stroke="#7a4520" stroke-width="4"/>`}<rect x="12" y="42" width="76" height="44" rx="6" fill="#8b4f24"/><rect x="12" y="42" width="76" height="8" fill="#e3a008"/><rect x="44" y="46" width="12" height="16" rx="3" fill="#ffd23f"/><path d="M24 50 v34 M76 50 v34" stroke="#e3a008" stroke-width="6"/></svg>`;
  const anahtar = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-4 4-2.3-2.3a4 4 0 0 0-5-5L4 17.4 6.6 20 2 20l0-4.6z" fill="#5d6878"/></svg>`;
  const basla = `<svg viewBox="0 0 140 70" aria-hidden="true"><path d="M3 18 a15 15 0 0 1 15 -15 h104 a15 15 0 0 1 15 15 v34 a15 15 0 0 1 -15 15 h-58 l-8 6 l-8 -6 h-30 a15 15 0 0 1 -15 -15 z" fill="#ff8a1f"/><path d="M58 18 L88 35 L58 52 Z" fill="#fff"/></svg>`;

  const stil = `
  .ah { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#5ccdf0, #2a93d5); }
  .ah .nk-nav { background: rgba(255,255,255,.55); border-radius: 0 0 18px 18px; }
  .ah-sahne { --k: 80px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 20px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .ah-sahne::before { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at 10% 80%, rgba(255,255,255,.25) 0 6px, transparent 7px), radial-gradient(circle at 14% 70%, rgba(255,255,255,.2) 0 4px, transparent 5px), radial-gradient(circle at 88% 30%, rgba(255,255,255,.22) 0 8px, transparent 9px), radial-gradient(circle at 92% 22%, rgba(255,255,255,.18) 0 4px, transparent 5px); }
  .ah-sahne.dikey { flex-direction: column; gap: 8px; justify-content: safe center; overflow-y: auto; }
  .ah-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); gap: 4px; padding: 6px; flex: none; }
  .ah-kare { position: relative; border-radius: 12px; }
  .ah-kare.karo { background: linear-gradient(150deg, rgba(225,248,255,.95), rgba(160,222,250,.85)); box-shadow: inset 0 0 0 2px rgba(255,255,255,.8), 0 4px 0 rgba(20,90,140,.25); }
  .ah-kare > svg { position: absolute; inset: 6%; width: 88%; height: 88%; }
  .ah-kare.iz::after { content: ""; position: absolute; left: 50%; top: 50%; width: 14%; height: 14%; margin: -7%; border-radius: 50%; background: rgba(155,93,229,.55); }
  .ah-kare.dustu { animation: ah-dalga .5s 3; }
  @keyframes ah-dalga { 50% { background: rgba(255,255,255,.5); border-radius: 50%; } }
  .ah-kare.parlak > svg { animation: ah-parla 1s ease-in-out infinite; }
  @keyframes ah-parla { 50% { transform: scale(1.1); filter: drop-shadow(0 0 10px #ffd23f); } }
  .ah-ahtapot { position: absolute; left: 6px; top: 6px; width: var(--k); height: var(--k); transition: transform .34s ease-in-out; pointer-events: none; z-index: 3; }
  .ah-ahtapot > div { width: 100%; height: 100%; }
  .ah-ahtapot svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 3px rgba(20,60,120,.35)); }
  .ah-ahtapot.yuzuyor > div { animation: ah-yuz .34s ease-in-out infinite; }
  .ah-ahtapot.batti > div { transition: transform .6s, opacity .6s; transform: translateY(30%) scale(.4); opacity: 0; }
  .ah-ahtapot.uzgun > div { animation: ah-salla .5s 2; }
  .ah-ahtapot.vardi > div { animation: ah-zipla .5s 2; }
  @keyframes ah-yuz { 50% { transform: translateY(-6%) scaleY(1.05); } }
  @keyframes ah-zipla { 50% { transform: translateY(-25%); } }
  @keyframes ah-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .ah-kod { display: grid; justify-items: center; align-content: start; gap: 6px; padding: 10px; border-radius: 22px; background: rgba(255,255,255,.9); box-shadow: 0 6px 0 rgba(20,90,140,.2); flex: none; }
  .ah-kod-ust { display: flex; align-items: center; gap: 6px; }
  .ah-onar { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; background: #ffe28a; }
  .ah-onar svg { width: 20px; height: 20px; }
  .ah-basla { width: calc(var(--p) * 1.4); height: calc(var(--p) * .7); padding: 0; border: 0; background: none; cursor: pointer; filter: drop-shadow(0 4px 0 #c96a00); }
  .ah-basla svg { width: 100%; height: 100%; display: block; }
  .ah-basla:disabled { filter: grayscale(.6) opacity(.6); cursor: default; }
  .ah-basla:not(:disabled) { animation: ah-nabiz 1.6s ease-in-out infinite; }
  @keyframes ah-nabiz { 50% { transform: scale(1.06); } }
  .ah-yerler { display: grid; grid-auto-flow: column; grid-template-rows: repeat(var(--sat), calc(var(--p) * .72)); gap: 6px; }
  .ah-sahne.dikey .ah-kod { width: 100%; max-width: 560px; box-sizing: border-box; }
  .ah-sahne.dikey .ah-yerler { grid-auto-flow: row; grid-template-rows: none; grid-template-columns: repeat(var(--sut), calc(var(--p) * 1.0)); }
  .ah-yer { position: relative; width: calc(var(--p) * 1.0); height: calc(var(--p) * .72); border-radius: 12px; border: 3px dashed #b5d4ea; box-sizing: border-box; background: #eef7fd; }
  .ah-yer.dolu { border: 0; background: none; cursor: pointer; touch-action: none; }
  .ah-yer svg { display: block; width: 100%; height: 100%; pointer-events: none; }
  .ah-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 14px; }
  .ah-yer.hata { animation: ah-salla .5s 2; outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 14px; }
  .ah-yer.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .ah-yer.dolu.hedef { outline: 4px solid var(--mavi); outline-offset: 2px; border-radius: 14px; }
  .ah-yer.gidiyor { opacity: .35; }
  .ah-yer .sayac { position: absolute; left: -6px; top: -10px; display: flex; gap: 3px; padding: 3px 6px; border-radius: 999px; background: #fff; box-shadow: 0 2px 0 rgba(0,0,0,.15); }
  .ah-yer .sayac i { width: 8px; height: 8px; border-radius: 50%; background: #d6dbe5; }
  .ah-yer .sayac i.on { background: #ffc23a; }
  .ah-yan { display: grid; justify-items: center; align-content: center; gap: 12px; flex: none; }
  .ah-sepet { display: flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,.9); }
  .ah-sepet span { width: 32px; height: 32px; opacity: .35; filter: grayscale(1); transition: opacity .3s, filter .3s, transform .3s; }
  .ah-sepet span.var { opacity: 1; filter: none; transform: scale(1.15); }
  .ah-sepet svg { width: 100%; height: 100%; display: block; }
  .ah-sepet .ok { width: 20px; height: 20px; color: #3b6b8f; opacity: 1; filter: none; }
  .ah-palet { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; padding: 10px; border-radius: 22px; background: rgba(255,255,255,.9); box-shadow: 0 6px 0 rgba(20,90,140,.2); }
  .ah-ok { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .ah-ok svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .ah-ok[data-y="u"] { grid-column: 2; grid-row: 1; } .ah-ok[data-y="l"] { grid-column: 1; grid-row: 2; } .ah-ok[data-y="d"] { grid-column: 2; grid-row: 2; } .ah-ok[data-y="r"] { grid-column: 3; grid-row: 2; }
  .ah-ok:active { transform: translateY(3px); }
  .ah-sil { grid-column: 3; grid-row: 1; width: var(--p); height: var(--p); border: 0; border-radius: 18px; background: #ffd9d6; color: #d6453b; cursor: pointer; box-shadow: 0 5px 0 rgba(29,40,70,.12); }
  .ah-sil svg { width: 55%; height: 55%; }
  .ah-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .ah-tasinan svg { width: 100%; height: 100%; display: block; }
  `;

  const silIkon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 5H9l-6 7 6 7h12z"/><path d="M17 9l-5 6M12 9l5 6"/></svg>`;
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ah-stil")) {
      const st = document.createElement("style"); st.id = "ah-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ah"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ah-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ah-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.cozum = coz(b.harita);
    d.program = b.bozuk ? programOku(b.bozuk) : [];
    d.yerSayi = Math.min(12, b.bozuk ? d.program.length + 1 : d.cozum.enKisa.length + b.ek);
    d.yer = null;
    const { R, C, altinlar } = d.cozum;
    let kareler = "";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareler += `<div class="ah-kare" data-r="${r}" data-c="${c}"></div>`;
    d.sahne.innerHTML = `
      <div class="ah-kod" aria-label="Program">
        <div class="ah-kod-ust">${b.bozuk ? `<span class="ah-onar" title="Bozuk programı onar">${anahtar}</span>` : ""}<button class="ah-basla" type="button" aria-label="Başlat">${basla}</button></div>
        <div class="ah-yerler">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="ah-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. blok"></div>`).join("")}</div>
      </div>
      <div class="ah-harita" style="--C:${C}">${kareler}<div class="ah-ahtapot"><div>${ahtapot}</div></div></div>
      <div class="ah-yan">
        <div class="ah-sepet" aria-hidden="true">${altinlar.map(() => `<span class="h">${altin}</span>`).join("")}${altinlar.length ? `<svg class="ok" viewBox="0 0 24 24"><path d="M4 12h13M12 6l6 6-6 6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ""}<span class="var">${sandikSvg(false)}</span></div>
        <div class="ah-palet" aria-label="Bloklar">${["u", "l", "d", "r"].map((y) => `<button class="ah-ok" type="button" data-y="${y}" aria-label="${OK[y].ad}">${okSvg(y)}</button>`).join("")}<button class="ah-sil" type="button" aria-label="Son bloğu sil">${silIkon}</button></div>
      </div>`;
    d.harita = d.sahne.querySelector(".ah-harita");
    d.ahtapotEl = d.sahne.querySelector(".ah-ahtapot");
    d.yerlerEl = d.sahne.querySelector(".ah-yerler");
    d.dugme = d.sahne.querySelector(".ah-basla");
    d.dugme.onclick = calistir;
    d.sahne.querySelector(".ah-sil").onclick = () => { if (d.calisiyor || !d.program.length) return; d.program.pop(); programCiz(); d.api.ses.tik(); };
    d.yerlerEl.querySelectorAll(".ah-yer").forEach(blokTasi);
    d.sahne.querySelectorAll(".ah-ok").forEach(okTasi);
    haritaCiz(new Set());
    programCiz();
    boyutla();
  }

  const kareEl = (r, c) => d.harita.querySelector(`.ah-kare[data-r="${r}"][data-c="${c}"]`);

  function haritaCiz(alinan) {
    const { R, C, altinlar } = d.cozum, h = BOLUMLER[d.idx].harita;
    const hepsi = alinan.size === altinlar.length;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const ch = h[r][c], el = kareEl(r, c);
      el.classList.toggle("karo", ch !== "." && ch !== " ");
      el.innerHTML = ch === "P" ? sandikSvg(hepsi) : ch === "c" && !alinan.has(`${r},${c}`) ? altin : "";
      el.classList.toggle("parlak", ch === "P" && hepsi);
    }
    d.sahne.querySelectorAll(".ah-sepet .h").forEach((s, k) => s.classList.toggle("var", k < alinan.size));
  }

  function programCiz() {
    const yerler = [...d.yerlerEl.querySelectorAll(".ah-yer")];
    yerler.forEach((y, j) => {
      const k = d.program[j];
      y.className = "ah-yer" + (k ? " dolu" : "");
      y.innerHTML = k ? blokSvg(k.y, k.n) : "";
    });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }

  function boyutla() {
    if (!d || !d.harita) return;
    const { R, C } = d.cozum;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 20;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.1;
    d.sahne.classList.toggle("dikey", dikey);
    let k, p, sat = Math.min(d.yerSayi, 6);
    if (dikey) {
      p = Math.max(46, Math.min(70, Math.floor((W - 40) / 6 - 8)));
      const sut = Math.max(1, Math.floor((W - 30) / (p + 6)));
      d.sahne.style.setProperty("--sut", sut);
      const satir = Math.ceil(d.yerSayi / sut);
      k = Math.min((W - 20) / C - 4, (H - (p * 0.7 + 30) - satir * (p * 0.72 + 6) - (2 * p + 30) - 60 - 40) / R - 4, 110);
    } else {
      // Bloklar Tynker'daki gibi tek sütun olsun; sığmazsa iki sütuna bölünür
      const tek = Math.floor((H - 70) / (d.yerSayi * 0.78 + 0.8));
      sat = tek >= 54 ? d.yerSayi : Math.ceil(d.yerSayi / 2);
      p = Math.max(48, Math.min(76, tek >= 54 ? tek : Math.floor((H - 70) / (sat * 0.78 + 0.8))));
      const sutun = Math.ceil(d.yerSayi / sat);
      const solGen = sutun * (p + 6) + 30, sagGen = 3 * p + 50;
      k = Math.min((W - solGen - sagGen - 60) / C - 4, (H - 20) / R - 4, 120);
    }
    d.sahne.style.setProperty("--sat", sat);
    d.k = Math.max(34, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px");
    d.sahne.style.setProperty("--p", p + "px");
    const ic = () => [...d.sahne.children].reduce((t, e) => t + e.offsetHeight, 0) + 16;
    for (let n = 0; dikey && n < 40 && (d.k > 34 || p > 40) && ic() > d.sahne.clientHeight - 20; n++) {
      if (d.k > 34) { d.k -= 3; d.sahne.style.setProperty("--k", d.k + "px"); }
      else { p -= 2; d.sahne.style.setProperty("--p", p + "px"); }
    }
    ahtapotKoy(...(d.yer || d.cozum.bas), false);
  }

  function ahtapotKoy(r, c, anim = true) {
    d.yer = [r, c];
    d.ahtapotEl.style.transition = anim ? "" : "none";
    d.ahtapotEl.style.transform = `translate(${c * (d.k + 4)}px, ${r * (d.k + 4)}px)`;
    if (!anim) { void d.ahtapotEl.offsetWidth; d.ahtapotEl.style.transition = ""; }
  }

  // Ok bloğu: boş yere bırakılırsa sona eklenir, bir bloğun üstüne bırakılırsa onun yönünü değiştirir
  function kartKoy(y, j) {
    if (d.calisiyor) return;
    if (j != null && j < d.program.length) d.program[j] = { y, n: d.program[j].n };
    else { if (d.program.length >= d.yerSayi) return; d.program.push({ y, n: 1 }); }
    programCiz();
    d.api.ses.tik();
  }

  const hedefYer = (x, y) => { const e = document.elementFromPoint(x, y); return e && e.closest(".ah-yer"); };

  function okTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const y = btn.dataset.y;
    btn.addEventListener("pointerdown", (e) => {
      if (d.calisiyor) return;
      e.preventDefault();
      aktif = true; bx = e.clientX; by = e.clientY;
      btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) {
        ucan = document.createElement("div");
        ucan.className = "ah-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = okSvg(y);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const yer = hedefYer(e.clientX, e.clientY);
      if (hedef && hedef !== yer) hedef.classList.remove("hedef");
      hedef = yer || null; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) {
        ucan.remove(); ucan = null;
        if (hedef) { hedef.classList.remove("hedef"); kartKoy(y, +hedef.dataset.j); }
        hedef = null;
      } else kartKoy(y);
    };
    btn.addEventListener("pointerup", birak);
    btn.addEventListener("pointercancel", birak);
    btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kartKoy(y); } });
  }

  // Programdaki blok: dokununca sayısı artar (4'ten sonra 1), dışarı sürüklenince silinir
  function blokTasi(yer) {
    let bx, by, aktif = false, ucan = null;
    const j = +yer.dataset.j;
    yer.addEventListener("pointerdown", (e) => {
      if (d.calisiyor || !d.program[j]) return;
      e.preventDefault();
      aktif = true; bx = e.clientX; by = e.clientY;
      yer.setPointerCapture && yer.setPointerCapture(e.pointerId);
    });
    yer.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 10) return;
      if (!ucan) {
        ucan = document.createElement("div");
        ucan.className = "ah-tasinan";
        const r = yer.getBoundingClientRect();
        ucan.style.width = r.width + "px"; ucan.style.height = r.height + "px";
        ucan.innerHTML = blokSvg(d.program[j].y, d.program[j].n);
        document.body.appendChild(ucan);
        yer.classList.add("gidiyor");
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
    });
    const birak = (e) => {
      if (!aktif) return;
      aktif = false;
      if (ucan) {
        ucan.remove(); ucan = null;
        yer.classList.remove("gidiyor");
        const icinde = e && e.clientX != null && document.elementFromPoint(e.clientX, e.clientY)?.closest(".ah-kod");
        if (!icinde) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); }
      } else {
        d.program[j].n = d.program[j].n % 4 + 1;
        programCiz();
        d.api.ses.ton(392 + d.program[j].n * 60, 0.15);
      }
    };
    yer.addEventListener("pointerup", birak);
    yer.addEventListener("pointercancel", () => birak(null));
    yer.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && d.program[j] && !d.calisiyor) { e.preventDefault(); d.program[j].n = d.program[j].n % 4 + 1; programCiz(); } });
  }

  // Programı çalıştır
  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, { bas, sandik, altinlar, su } = d.cozum;
    const yerler = [...d.yerlerEl.querySelectorAll(".ah-yer")];
    const alinan = new Set();
    let [r, c] = bas, hata = -1, vardi = false, adim = 0, batti = false;
    d.ahtapotEl.classList.add("yuzuyor");
    dis: for (let j = 0; j < d.program.length; j++) {
      const { y, n } = d.program[j], [dr, dc] = YON[y];
      yerler.forEach((e, k) => e.classList.toggle("simdi", k === j));
      const sayac = n > 1 ? document.createElement("div") : null;
      if (sayac) { sayac.className = "sayac"; sayac.innerHTML = "<i></i>".repeat(n); yerler[j].appendChild(sayac); }
      for (let t = 0; t < n; t++) {
        if (sayac) sayac.children[t].classList.add("on");
        const nr = r + dr, nc = c + dc;
        kareEl(r, c).classList.add("iz");
        r = nr; c = nc;
        ahtapotKoy(r, c);
        d.api.ses.adim(adim++ % 8);
        await bekle(360);
        if (!d || benim !== d.uid) return;
        if (su(r, c)) { hata = j; batti = true; const k = kareEl(r, c); if (k) k.classList.add("dustu"); break dis; }
        if (altinlar.some(([a, b]) => a === r && b === c) && !alinan.has(`${r},${c}`)) {
          alinan.add(`${r},${c}`);
          haritaCiz(alinan);
          d.api.ses.yerlesti();
        }
        if (alinan.size === altinlar.length && r === sandik[0] && c === sandik[1]) { vardi = true; break dis; }
      }
      if (sayac) { await bekle(120); sayac.remove(); }
    }
    d.ahtapotEl.classList.remove("yuzuyor");
    yerler.forEach((e) => { e.classList.remove("simdi"); const s = e.querySelector(".sayac"); if (s) s.remove(); });
    if (vardi) {
      d.ahtapotEl.classList.add("vardi");
      await bekle(1000);
      if (!d || benim !== d.uid) return;
      d.ahtapotEl.classList.remove("vardi");
      return bitir();
    }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.ahtapotEl.classList.add(batti ? "batti" : "uzgun");
    d.api.ses.hata();
    await bekle(1500);
    if (!d || benim !== d.uid) return;
    d.ahtapotEl.classList.remove("batti", "uzgun");
    yerler.forEach((e) => e.classList.remove("hata"));
    d.harita.querySelectorAll(".iz, .dustu").forEach((e) => e.classList.remove("iz", "dustu"));
    haritaCiz(new Set());
    ahtapotKoy(bas[0], bas[1], false);
    // Yanlışta program silinir, çocuk baştan kurar
    d.program = BOLUMLER[d.idx].bozuk ? programOku(BOLUMLER[d.idx].bozuk) : []; d.calisiyor = false; programCiz();
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
      mesaj: son ? (herkes ? "Bütün hazineleri buldun, minik dalgıç!" : "Son hazine de bulundu!") : BOLUMLER[d.idx].bozuk ? "Programı onardın!" : "Ahtapot hazineye vardı!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.AHTAPOT_BOLUMLER = BOLUMLER; // test için
  window.AHTAPOT_COZ = coz;
  window.AHTAPOT_OKU = programOku;

  window.Uygulama.oyunEkle(22, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu(tam) {
      if (!d || !d.cozum || !d.cozum.enKisa) return [];
      const basla = d.sahne.querySelector(".ah-basla"), ilk = d.sahne.querySelector('.ah-yer[data-j="0"]');
      if (BOLUMLER[d.idx].bozuk && !tam) return [{ el: basla }, { el: ilk }];
      const adimlar = d.cozum.enKisa.slice(0, tam ? undefined : 1).flatMap(({ y, n }, j) => {
        const yer = d.sahne.querySelector(`.ah-yer[data-j="${j}"]`) || ilk;
        return [{ el: d.sahne.querySelector(`.ah-ok[data-y="${y}"]`), hedef: yer }, ...(n > 1 ? [{ el: yer, kez: n - 1 }] : [])];
      });
      return [...adimlar, { el: basla }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true">${ahtapot}${blokSvg("r", 3).replace("<svg", '<svg style="width:48px"')}${altin}${sandikSvg(true)}</div>`;
    },
  });
})();
