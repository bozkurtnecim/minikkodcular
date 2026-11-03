/* 20. Hafta: Renkli Fırça (komut: yürü, boya, sil).
   Fırça boya kovasının üstüne gelince o rengi alır. "Boya" kartı durduğu kareyi boyar,
   "Sil" kartı karedeki boyayı siler. Tuvali yandaki örnek resmin aynısı yap.
   Zor bölümlerden itibaren tuvalde yanlış boyanmış kareler vardır: sil ya da doğru renkle yeniden boya.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "firca";

  // h: B fırça, K/M/S/Y boya kovası (kırmızı, mavi, sarı, yeşil), . tuval
  // t: hedef resim (k/m/s/y ya da .), b: başta boyalı kareler, renk: fırçanın baştaki rengi
  const BOLUMLER = [
    { h: ["B.."], t: [".k."], renk: "k" },
    { h: ["B..", "..."], t: ["...", "m.."], renk: "m" },
    { h: ["B..."], t: ["ss.."], renk: "s" },

    { h: ["BK.."], t: ["..k."] },
    { h: ["B..", "M..", "..."], t: ["...", "...", "m.."] },
    { h: ["B.S.."], t: ["...s."] },

    { h: ["BK...", "....."], t: ["..kk.", "....."] },
    { h: ["B..", "M..", "...", "..."], t: ["...", "...", ".m.", ".m."] },
    { h: [".Y.", "...", ".B."], t: ["..y", ".yy", "..."] },
    { h: ["...", ".B.", "..M"], t: [".mm", "..m", "..."] },
    { h: [".B.", "...", ".K."], t: ["..k", "..k", "..k"] },
    { h: ["BY..", "....", "...."], t: ["..y.", "..y.", ".yy."] },

    { h: ["B.."], t: ["..."], b: [".k."] },
    { h: ["BM..", "...."], t: ["...m", "...."], b: ["...k", "...."] },
    { h: ["B...", "K..."], t: [".k..", "...."], b: ["...m", "...."] },
    { h: ["B.S.", "...."], t: ["....", ".ss."], b: [".k..", "..m."] },
    { h: ["...", "...", "S..", ".BK"], t: ["...", "...", ".ks", "..."], b: ["...", "...", "..k", ".k."] },
    { h: ["Y.K", "...", ".B.", "..."], t: ["...", "...", "yk.", "..."], b: ["...", "...", ".k.", "..y"] },

    { h: ["K...", "B...", "...."], t: [".kk.", ".k..", ".k.."] },
    { h: ["....", "....", "....", "SKB."], t: ["....", "..kk", "..s.", "...."], b: ["....", ".m..", "..s.", "...."] },
    { h: ["..KB", "...M", "....", "...."], t: ["....", ".mk.", ".m..", "...."], b: ["....", "..k.", "....", "s..."] },
    { h: ["B...", "...K", "....", "Y..."], t: ["....", "k...", "yy..", "...."], b: ["....", "k...", "....", ".y.."] },
    { h: [".Y..", "....", "B..S", "...."], t: ["....", "....", "..y.", ".ss."], b: ["....", "....", "..y.", "...y"] },
    { h: ["..MK.", "S.B..", "....."], t: ["ms...", ".s...", "....."], b: ["m....", ".....", ".m..."] },
    { h: [".K.BM", ".....", "...S."], t: ["...s.", "...sk", "....."], b: [".....", "....k", "..y.."] },
    { h: ["..M.", "....", "...Y", "..B."], t: ["....", ".my.", "..y.", "...."], b: ["...y", ".m..", "....", "...."] },
    { h: ["B...", "....", "....", ".YS."], t: [".y..", ".ys.", "....", "...."], b: ["....", "..s.", "....", "k..."] },
    { h: ["...Y.", "..B..", "..S.M"], t: [".....", "...ss", "...m."], b: [".....", "..k..", "...s."] },
    { h: ["M....", "...BS", "K...."], t: [".s...", ".ms..", "....."], b: [".....", ".m...", "...s."] },
    { h: ["Y....", "M....", "..BK."], t: [".....", ".....", "mkk.."], b: [".....", ".k...", "....."] },
  ].map((b, i) => ({ ...b, grup: Uygulama.seviye(i), ek: i < 6 ? 1 : 2, sil: i >= 12 }));

  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = {
    u: { renk: "#2fb36a", koyu: "#1f8a4f", ad: "Yukarı", aci: 0 },
    r: { renk: "#2f86e0", koyu: "#1f62ab", ad: "Sağa", aci: 90 },
    d: { renk: "#ff8a1f", koyu: "#d96a0a", ad: "Aşağı", aci: 180 },
    l: { renk: "#8a5cf0", koyu: "#6a3fcc", ad: "Sola", aci: 270 },
  };
  const RENK = { k: "#ff5a4e", m: "#2f86e0", s: "#ffc23a", y: "#2fb36a" };
  const KOVA = { K: "k", M: "m", S: "s", Y: "y" };

  // Bölümü çöz: tuvali hedefe çeviren en kısa program (p = boya, x = sil)
  function coz(b) {
    const R = b.h.length, C = b.h[0].length;
    let bas;
    b.h.forEach((s, r) => [...s].forEach((ch, c) => { if (ch === "B") bas = [r, c]; }));
    const ilk = (r, c) => (b.b ? b.b[r][c] : ".");
    // Yalnızca hedefte ya da başta boyalı olan kareler önemlidir
    const onemli = [];
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (b.t[r][c] !== "." || ilk(r, c) !== ".") onemli.push([r, c]);
    const oi = (r, c) => onemli.findIndex(([a, e]) => a === r && e === c);
    const hedef = onemli.map(([r, c]) => b.t[r][c]).join("");
    const disarda = (r, c) => r < 0 || r >= R || c < 0 || c >= C;
    const tuval0 = onemli.map(([r, c]) => ilk(r, c)).join("");
    const komutlar = ["u", "r", "d", "l", "p"].concat(b.sil ? ["x"] : []);
    const kuyruk = [[bas[0], bas[1], b.renk || "", tuval0, ""]], gorulen = new Set([`${bas[0]},${bas[1]},${b.renk || ""},${tuval0}`]);
    let enKisa = tuval0 === hedef ? "" : null;
    while (kuyruk.length && enKisa == null) {
      const [r, c, renk, tv, prog] = kuyruk.shift();
      for (const k of komutlar) {
        let nr = r, nc = c, nrenk = renk, ntv = tv;
        if (YON[k]) {
          nr += YON[k][0]; nc += YON[k][1];
          if (disarda(nr, nc)) continue;
          const ch = b.h[nr][nc];
          if (KOVA[ch]) nrenk = KOVA[ch];
        } else {
          const j = oi(r, c);
          if (j < 0 || KOVA[b.h[r][c]]) continue;
          const yeni = k === "p" ? renk : ".";
          if (k === "p" && !renk) continue;
          if (tv[j] === yeni) continue;
          ntv = tv.slice(0, j) + yeni + tv.slice(j + 1);
        }
        const key = `${nr},${nc},${nrenk},${ntv}`;
        if (gorulen.has(key)) continue;
        gorulen.add(key);
        if (ntv === hedef) { enKisa = prog + k; break; }
        kuyruk.push([nr, nc, nrenk, ntv, prog + k]);
      }
    }
    return { R, C, bas, enKisa };
  }

  // ---------- Çizimler ----------
  const okSvg = (y) => {
    if (y === "p") return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="#ff7ab8"/><rect x="3" y="80" width="94" height="17" rx="8" fill="#d94f92" opacity=".5"/><rect x="18" y="56" width="64" height="20" rx="8" fill="#fff"/><path d="M26 60 h48" stroke="#ffd23f" stroke-width="6" stroke-linecap="round"/><g transform="rotate(35 50 40)"><rect x="44" y="6" width="12" height="34" rx="5" fill="#8a5a33"/><rect x="42" y="38" width="16" height="8" fill="#c7ccd6"/><path d="M42 46 h16 l-3 14 q-5 6 -10 0 z" fill="#ffd23f"/></g></svg>`;
    if (y === "x") return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="#9aa7b8"/><rect x="3" y="80" width="94" height="17" rx="8" fill="#6f7d90" opacity=".5"/><g transform="rotate(-30 50 50)"><rect x="18" y="34" width="64" height="32" rx="8" fill="#fff"/><rect x="18" y="34" width="26" height="32" rx="8" fill="#ff7ab8"/><rect x="36" y="34" width="8" height="32" fill="#ff7ab8"/></g><path d="M20 82 q10 -6 20 0 q10 6 20 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/></svg>`;
    const o = OK[y];
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${o.renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${o.koyu}" opacity=".5"/><g transform="rotate(${o.aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g></svg>`;
  };
  const firca = (renk) => `<svg viewBox="0 0 100 100" aria-hidden="true"><g transform="rotate(35 50 50)"><rect x="43" y="4" width="14" height="46" rx="6" fill="#8a5a33"/><rect x="44" y="8" width="5" height="38" rx="2" fill="#a8774d"/><rect x="40" y="48" width="20" height="12" rx="2" fill="#c7ccd6"/><path d="M40 60 h20 l-2 20 q-8 12 -16 0 z" fill="${renk ? RENK[renk] : "#f4efe6"}" stroke="${renk ? "rgba(0,0,0,.15)" : "#d9cfbf"}" stroke-width="2"/></g></svg>`;
  const kova = (r) => `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 34 Q50 4 78 34" stroke="#5d6878" stroke-width="5" fill="none"/><path d="M18 34 h64 l-8 56 h-48 z" fill="#e8ecf3"/><path d="M18 34 h64 l-2 12 h-60 z" fill="${RENK[r]}"/><ellipse cx="50" cy="34" rx="32" ry="8" fill="${RENK[r]}"/><path d="M60 40 q4 14 0 20" stroke="${RENK[r]}" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`;

  const stil = `
  .fr { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .fr-sahne { --k: 80px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 20px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .fr-sahne.dikey { flex-direction: column; gap: 8px; justify-content: safe center; overflow-y: auto; }
  .fr-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); gap: 4px; padding: 10px; border-radius: 22px; background: #c9a77c; box-shadow: 0 8px 0 rgba(29,40,70,.14); flex: none; }
  .fr-kare { position: relative; border-radius: 10px; background: #fffdf7; }
  .fr-kare.kovali { background: #efe3cf; }
  .fr-kare > svg { position: absolute; inset: 8%; width: 84%; height: 84%; }
  .fr-kare .hedef { position: absolute; inset: 7%; border-radius: 8px; border: 4px dashed var(--h); background: color-mix(in srgb, var(--h) 16%, transparent); box-sizing: border-box; }
  .fr-kare .boya { position: absolute; inset: 7%; border-radius: 10px 6px 12px 8px; background: var(--b); box-shadow: inset 0 -6px 0 rgba(0,0,0,.12), inset 6px 4px 0 rgba(255,255,255,.18); animation: fr-boya .3s ease-out; }
  .fr-kare .boya.tamam::after { content: ""; position: absolute; right: 8%; top: 8%; width: 22%; height: 22%; border-radius: 50%; background: #fff; opacity: .85; }
  @keyframes fr-boya { from { transform: scale(.3); opacity: .4; } }
  .fr-kare.silindi::before { content: ""; position: absolute; inset: 20%; border-radius: 50%; background: radial-gradient(#fff, transparent 70%); animation: fr-sil .4s ease-out forwards; }
  @keyframes fr-sil { to { transform: scale(2); opacity: 0; } }
  .fr-kare.carpti { animation: fr-yanip .3s 4; }
  @keyframes fr-yanip { 50% { background: #ff8a80; } }
  .fr-firca { position: absolute; left: 10px; top: 10px; width: var(--k); height: var(--k); transition: transform .38s ease-in-out; pointer-events: none; z-index: 3; }
  .fr-firca > div { width: 100%; height: 100%; }
  .fr-firca svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.25)); }
  .fr-firca.boyuyor > div { animation: fr-dokun .45s ease-in-out; }
  .fr-firca.siliyor > div { animation: fr-ovala .45s ease-in-out; }
  .fr-firca.uzgun > div { animation: fr-salla .5s 2; }
  @keyframes fr-dokun { 40% { transform: translate(-8%, 12%) rotate(-12deg); } }
  @keyframes fr-ovala { 25% { transform: translateX(-12%); } 50% { transform: translateX(12%); } 75% { transform: translateX(-12%); } }
  @keyframes fr-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .fr-yan { display: grid; justify-items: center; align-content: center; gap: 10px; min-width: 0; }
  .fr-sahne:not(.dikey) .fr-yan { flex: 1; max-width: 560px; }
  .fr-ornek { display: flex; align-items: center; gap: 10px; padding: 8px 14px; border-radius: 18px; background: var(--kagit); box-shadow: 0 4px 0 rgba(29,40,70,.1); }
  .fr-ornek .izgara { display: grid; grid-template-columns: repeat(var(--C), 18px); grid-auto-rows: 18px; gap: 2px; padding: 4px; border-radius: 8px; background: #c9a77c; }
  .fr-ornek .izgara i { border-radius: 4px; background: #fffdf7; }
  .fr-ornek .izgara i.kv { background: #efe3cf; }
  .fr-ornek .elde { width: 44px; height: 44px; }
  .fr-ornek .elde svg { width: 100%; height: 100%; display: block; }
  .fr-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: 100%; box-sizing: border-box; }
  .fr-yer { position: relative; width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); flex: none; }
  .fr-yer.dolu { border: 0; background: none; cursor: pointer; }
  .fr-yer svg { display: block; width: 100%; height: 100%; }
  .fr-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .fr-yer.hata { animation: fr-salla .5s 2; outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; }
  .fr-yer.hedef { border-color: var(--mavi); background: #d4e8ff; }
  .fr-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .fr-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; }
  .fr-araclar { display: grid; grid-template-rows: repeat(2, var(--p)); grid-auto-flow: column; gap: 8px; padding: 8px; border-radius: 22px; background: rgba(255,122,184,.2); }
  .fr-ok { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .fr-ok svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .fr-ok[data-y="u"] { grid-column: 2; grid-row: 1; } .fr-ok[data-y="l"] { grid-column: 1; grid-row: 2; } .fr-ok[data-y="d"] { grid-column: 2; grid-row: 2; } .fr-ok[data-y="r"] { grid-column: 3; grid-row: 2; }
  .fr-ok:active { transform: translateY(3px); }
  .fr-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .fr-tasinan svg { width: 100%; height: 100%; display: block; }
  .fr-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .fr-calistir svg { width: 30px; height: 30px; }
  .fr-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("fr-stil")) {
      const st = document.createElement("style"); st.id = "fr-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="fr"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="fr-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".fr-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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

  const ilkTuval = (b) => b.h.map((s, r) => [...s].map((ch, c) => (b.b ? b.b[r][c] : ".")));

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.cozum = coz(b);
    d.yerSayi = Math.min(14, d.cozum.enKisa.length + b.ek);
    d.program = []; d.yer = null; d.renk = b.renk || "";
    d.tuval = ilkTuval(b);
    const { R, C } = d.cozum;
    let kareler = "", ornek = "";
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      kareler += `<div class="fr-kare" data-r="${r}" data-c="${c}"></div>`;
      const t = b.t[r][c];
      ornek += `<i class="${KOVA[b.h[r][c]] ? "kv" : ""}" style="${t !== "." ? `background:${RENK[t]}` : ""}"></i>`;
    }
    const araclar = ["p"].concat(b.sil ? ["x"] : []);
    d.sahne.innerHTML = `
      <div class="fr-harita" style="--C:${C}">${kareler}<div class="fr-firca"><div></div></div></div>
      <div class="fr-yan">
        <div class="fr-ornek" aria-label="Örnek resim"><div class="izgara" style="--C:${C}">${ornek}</div><div class="elde" aria-hidden="true"></div></div>
        <div class="fr-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="fr-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. komut"></div>`).join("")}</div>
        <div class="fr-alt">
          <div class="fr-oklar" aria-label="Ok kartları">${["u", "l", "d", "r"].map((y) => `<button class="fr-ok" type="button" data-y="${y}" aria-label="${OK[y].ad}">${okSvg(y)}</button>`).join("")}</div>
          <div class="fr-araclar">${araclar.map((y) => `<button class="fr-ok" type="button" data-y="${y}" aria-label="${y === "p" ? "Boya" : "Sil"}">${okSvg(y)}</button>`).join("")}</div>
          <button class="fr-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button>
        </div>
      </div>`;
    d.harita = d.sahne.querySelector(".fr-harita");
    d.fircaEl = d.sahne.querySelector(".fr-firca");
    d.programEl = d.sahne.querySelector(".fr-program");
    d.dugme = d.sahne.querySelector(".fr-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".fr-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".fr-ok").forEach(okTasi);
    haritaCiz();
    fircaCiz();
    programCiz();
    boyutla();
  }

  const kareEl = (r, c) => d.harita.querySelector(`.fr-kare[data-r="${r}"][data-c="${c}"]`);

  function kareCiz(r, c) {
    const b = BOLUMLER[d.idx], ch = b.h[r][c], el = kareEl(r, c), t = b.t[r][c], v = d.tuval[r][c];
    el.classList.toggle("kovali", !!KOVA[ch]);
    el.innerHTML = KOVA[ch] ? kova(KOVA[ch])
      : (t !== "." ? `<div class="hedef" style="--h:${RENK[t]}"></div>` : "") + (v !== "." ? `<div class="boya${v === t ? " tamam" : ""}" style="--b:${RENK[v]}"></div>` : "");
  }

  function haritaCiz() {
    const { R, C } = d.cozum;
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) kareCiz(r, c);
  }

  function fircaCiz() {
    d.fircaEl.firstElementChild.innerHTML = firca(d.renk);
    const e = d.sahne.querySelector(".fr-ornek .elde");
    if (e) e.innerHTML = firca(d.renk);
  }

  const tamam = () => { const b = BOLUMLER[d.idx]; return d.tuval.every((s, r) => s.every((v, c) => KOVA[b.h[r][c]] || v === b.t[r][c])); };

  function programCiz() {
    d.programEl.querySelectorAll(".fr-yer").forEach((y, j) => {
      y.className = "fr-yer" + (j < d.program.length ? " dolu" : "");
      y.innerHTML = j < d.program.length ? okSvg(d.program[j]) : "";
    });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }

  function boyutla() {
    if (!d || !d.harita) return;
    const { R, C } = d.cozum;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 20;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.15;
    d.sahne.classList.toggle("dikey", dikey);
    let k, p;
    if (dikey) {
      p = Math.max(46, Math.min(72, Math.floor((W - 30) / Math.min(d.yerSayi, 6) - 8), Math.floor((W - 50) / 5 - 10)));
      const satir = Math.ceil(d.yerSayi / Math.max(1, Math.floor((W - 24) / (p + 8))));
      k = Math.min((W - 20) / C - 4, (H - satir * (p + 8) - 24 - (2 * p + 24) - 80 - 100) / R - 4, 110);
    } else {
      p = Math.max(48, Math.min(76, Math.floor((W * 0.42 - 24) / Math.min(d.yerSayi, 6) - 8), Math.floor((W * 0.42 - 40) / 5 - 10)));
      k = Math.min((W * 0.55 - 20) / C - 4, (H - 20) / R - 4, 120);
    }
    d.k = Math.max(36, Math.floor(k));
    d.p = p;
    d.sahne.style.setProperty("--k", d.k + "px");
    d.sahne.style.setProperty("--p", p + "px");
    const ic = () => [...d.sahne.children].reduce((t, e) => t + e.offsetHeight, 0) + 8;
    for (let n = 0; dikey && n < 40 && (d.k > 36 || p > 40) && ic() > d.sahne.clientHeight - 20; n++) {
      if (d.k > 36) { d.k -= 3; d.sahne.style.setProperty("--k", d.k + "px"); }
      else { p -= 2; d.sahne.style.setProperty("--p", p + "px"); }
    }
    fircaKoy(...(d.yer || d.cozum.bas), false);
  }

  function fircaKoy(r, c, anim = true) {
    d.yer = [r, c];
    d.fircaEl.style.transition = anim ? "" : "none";
    d.fircaEl.style.transform = `translate(${c * (d.k + 4)}px, ${r * (d.k + 4)}px)`;
    if (!anim) { void d.fircaEl.offsetWidth; d.fircaEl.style.transition = ""; }
  }

  function kartKoy(y, j) {
    if (d.calisiyor) return;
    if (j == null || j >= d.program.length) { if (d.program.length >= d.yerSayi) return; d.program.push(y); }
    else d.program[j] = y;
    programCiz();
    d.api.ses.tik();
  }

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
        ucan.className = "fr-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = okSvg(y);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const yer = alt && alt.closest(".fr-yer");
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

  function anim(sinif) {
    d.fircaEl.classList.remove("boyuyor", "siliyor"); void d.fircaEl.offsetWidth;
    d.fircaEl.classList.add(sinif);
  }

  // Programı çalıştır
  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, b = BOLUMLER[d.idx], { R, C } = d.cozum;
    const yerler = [...d.programEl.querySelectorAll(".fr-yer")];
    let [r, c] = d.cozum.bas, hata = -1, bitti = false;
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((e, k) => e.classList.toggle("simdi", k === j));
      const k = d.program[j];
      if (YON[k]) {
        const nr = r + YON[k][0], nc = c + YON[k][1];
        if (nr < 0 || nr >= R || nc < 0 || nc >= C) {
          fircaKoy(r + YON[k][0] * 0.3, c + YON[k][1] * 0.3);
          await bekle(240);
          if (!d || benim !== d.uid) return;
          fircaKoy(r, c);
          hata = j; break;
        }
        r = nr; c = nc;
        fircaKoy(r, c);
        d.api.ses.adim(j % 8);
        await bekle(420);
        if (!d || benim !== d.uid) return;
        const kv = KOVA[b.h[r][c]];
        if (kv && kv !== d.renk) { d.renk = kv; fircaCiz(); d.api.ses.yerlesti(); await bekle(200); if (!d || benim !== d.uid) return; }
      } else {
        // Boya / Sil: kovanın üstünde ya da boyasız fırçayla boyanamaz
        if (KOVA[b.h[r][c]] || (k === "p" && !d.renk)) { kareEl(r, c).classList.add("carpti"); hata = j; await bekle(200); break; }
        anim(k === "p" ? "boyuyor" : "siliyor");
        await bekle(200);
        if (!d || benim !== d.uid) return;
        d.tuval[r][c] = k === "p" ? d.renk : ".";
        kareCiz(r, c);
        if (k === "x") { const e = kareEl(r, c); e.classList.remove("silindi"); void e.offsetWidth; e.classList.add("silindi"); }
        d.api.ses.ton(k === "p" ? 660 : 300, 0.2);
        await bekle(300);
        if (!d || benim !== d.uid) return;
        d.fircaEl.classList.remove("boyuyor", "siliyor");
      }
      if (tamam()) { bitti = true; break; }
    }
    yerler.forEach((e) => e.classList.remove("simdi"));
    if (bitti) { await bekle(500); if (!d || benim !== d.uid) return; return bitir(); }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.fircaEl.classList.add("uzgun");
    d.api.ses.hata();
    await bekle(1500);
    if (!d || benim !== d.uid) return;
    d.fircaEl.classList.remove("uzgun");
    yerler.forEach((e) => e.classList.remove("hata"));
    d.harita.querySelectorAll(".carpti, .silindi").forEach((e) => e.classList.remove("carpti", "silindi"));
    d.tuval = ilkTuval(b); d.renk = b.renk || "";
    haritaCiz(); fircaCiz();
    fircaKoy(...d.cozum.bas, false);
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
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün resimleri boyadın, minik ressam!" : "Son resmin de bitti!") : "Resim aynısı oldu!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.FIRCA_BOLUMLER = BOLUMLER; // test için
  window.FIRCA_COZ = coz;

  window.Uygulama.oyunEkle(20, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu(tam) {
      if (!d || !d.cozum || !d.cozum.enKisa) return [];
      const sol = [...d.cozum.enKisa].slice(0, tam ? undefined : 2);
      return [...sol.map((y, j) => ({ el: d.sahne.querySelector(`.fr-ok[data-y="${y}"]`), hedef: d.sahne.querySelector(`.fr-yer[data-j="${j}"]`) })), { el: d.sahne.querySelector(".fr-calistir") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true">${kova("k")}${firca("m")}${okSvg("p")}${okSvg("x")}</div>`;
    },
  });
})();
