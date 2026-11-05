/* Engel Koşusu (adım adım program: yön okları ve engel kartları).
   Yukarıdan görünen bahçede taşlı bir patika var; tilki patikanın başında, üzüm sepeti sonunda.
   Ok kartları tilkiyi o yöne bir taş götürür. Patikada engeller var: kayanın üstünden "Zıpla",
   gölün içinden "Yüz", alçak dalın altından "Eğil" kartıyla geçilir; bu kartlar tilkiyi baktığı yönde engelin öbür yanına götürür.
   Çimene basarsa, engele çarparsa ya da yanlış kartı kullanırsa başa döner, program silinir.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "kosu3";
  const YON = { y: [-1, 0], s: [0, 1], a: [1, 0], l: [0, -1] }; // yukarı, sağ, aşağı, sol
  const ACI = { y: 0, s: 90, a: 180, l: 270 };
  const ENGEL = { kaya: "zipla", gol: "yuz", dal: "egil" };
  const KART = {
    y: { ad: "Yukarı", renk: "#2fb36a", koyu: "#1f8a4f" },
    l: { ad: "Sola", renk: "#8a5cf0", koyu: "#6a3fcc" },
    a: { ad: "Aşağı", renk: "#ff8a1f", koyu: "#d96a0a" },
    s: { ad: "Sağa", renk: "#2f86e0", koyu: "#1f62ab" },
    zipla: { ad: "Zıpla", renk: "#fff", koyu: "#d9d2c4", ic: `<path d="M14 78 Q50 0 86 78" stroke="#2fb36a" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M72 64 L88 84 L94 58 Z" fill="#2fb36a"/><path d="M34 86 L42 66 L58 64 L66 86 Z" fill="#8f99a8"/>` },
    yuz: { ad: "Yüz", renk: "#fff", koyu: "#d9d2c4", ic: `<path d="M8 70 q10 -8 21 0 t21 0 t21 0 t21 0" stroke="#4aa8f0" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="50" cy="40" r="22" fill="none" stroke="#ff5a4e" stroke-width="11"/><path d="M50 18 v9 M50 53 v9 M28 40 h9 M63 40 h9" stroke="#fff" stroke-width="8"/>` },
    egil: { ad: "Eğil", renk: "#fff", koyu: "#d9d2c4", ic: `<rect x="6" y="14" width="12" height="30" rx="4" fill="#8a5a33"/><rect x="82" y="14" width="12" height="30" rx="4" fill="#8a5a33"/><rect x="6" y="16" width="88" height="11" rx="5.5" fill="#a86a3a"/><path d="M50 38 V64" stroke="#8a5cf0" stroke-width="10" stroke-linecap="round"/><path d="M32 58 L50 82 L68 58 Z" fill="#8a5cf0"/>` },
  };
  const okIc = (k) => `<g transform="rotate(${ACI[k]} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g>`;
  const kartSvg = (k) => `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${KART[k].renk}" stroke="${KART[k].renk === "#fff" ? "#d9d2c4" : "none"}" stroke-width="4"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${KART[k].koyu}" opacity=".5"/>${ACI[k] != null ? okIc(k) : `<g transform="translate(6 2) scale(.88)">${KART[k].ic}</g>`}</svg>`;
  // Yukarıdan görünen, yukarı bakan tilki
  const tilki = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 62 Q30 84 40 98 Q50 92 56 80 Z" fill="#ff8a1f"/><path d="M40 98 Q44 90 50 88 Q48 96 40 98 Z" fill="#fff"/><ellipse cx="50" cy="58" rx="19" ry="22" fill="#ff8a1f"/><ellipse cx="50" cy="62" rx="10" ry="12" fill="#ffe1c4"/><path d="M33 30 L30 10 L44 22 Z M67 30 L70 10 L56 22 Z" fill="#ff8a1f"/><path d="M34 26 L33 15 L41 22 Z M66 26 L67 15 L59 22 Z" fill="#5a2a0a"/><circle cx="50" cy="32" r="16" fill="#ff8a1f"/><path d="M40 34 Q50 4 60 34 Q50 40 40 34 Z" fill="#ffe1c4"/><circle cx="50" cy="13" r="3.6" fill="#26201f"/><circle cx="43" cy="30" r="3" fill="#26201f"/><circle cx="57" cy="30" r="3" fill="#26201f"/></svg>`;
  const SVG = {
    kaya: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="62" rx="36" ry="10" fill="rgba(0,0,0,.15)"/><path d="M16 64 L22 36 L44 20 L68 24 L84 42 L82 66 Z" fill="#8f99a8"/><path d="M44 20 L50 44 L68 24 M22 36 L38 50 L50 44 L84 44" stroke="#6d7787" stroke-width="3" fill="none"/></svg>`,
    gol: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="46" ry="40" fill="#4aa8f0"/><path d="M22 46 q8 -5 16 0 M56 62 q8 -5 16 0 M40 30 q6 -4 12 0" stroke="#bfe3ff" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="72" cy="34" rx="9" ry="6" fill="#3fc47a"/></svg>`,
    dal: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="66" rx="40" ry="7" fill="rgba(0,0,0,.18)"/><rect x="2" y="30" width="18" height="40" rx="6" fill="#8a5a33"/><ellipse cx="11" cy="31" rx="9" ry="5" fill="#c98a4a"/><rect x="80" y="30" width="18" height="40" rx="6" fill="#8a5a33"/><ellipse cx="89" cy="31" rx="9" ry="5" fill="#c98a4a"/><rect x="4" y="38" width="92" height="14" rx="7" fill="#a86a3a"/><path d="M14 42 H86" stroke="#c98a4a" stroke-width="3" stroke-linecap="round"/><ellipse cx="38" cy="36" rx="8" ry="5" fill="#2fb36a" transform="rotate(-20 38 36)"/><ellipse cx="62" cy="54" rx="8" ry="5" fill="#3fc47a" transform="rotate(25 62 54)"/></svg>`,
    uzum: `<svg viewBox="0 0 100 100"><path d="M50 18 q6 -10 16 -8" stroke="#2fb36a" stroke-width="5" fill="none" stroke-linecap="round"/><g fill="#8a5cf0"><circle cx="40" cy="34" r="10"/><circle cx="60" cy="34" r="10"/><circle cx="50" cy="50" r="10"/><circle cx="30" cy="50" r="9"/><circle cx="70" cy="50" r="9"/><circle cx="40" cy="66" r="9"/><circle cx="60" cy="66" r="9"/><circle cx="50" cy="80" r="8"/></g><circle cx="37" cy="31" r="3" fill="#fff" opacity=".5"/></svg>`,
    sepet: `<svg viewBox="0 0 100 100"><g fill="#8a5cf0"><circle cx="36" cy="38" r="11"/><circle cx="56" cy="34" r="11"/><circle cx="70" cy="44" r="10"/><circle cx="46" cy="50" r="11"/></g><path d="M12 50 H88 L78 90 H22 Z" fill="#c98a4a"/><path d="M16 62 H84 M20 76 H80 M36 50 L32 90 M64 50 L68 90" stroke="#8a5a33" stroke-width="3"/><path d="M12 50 H88" stroke="#8a5a33" stroke-width="6" stroke-linecap="round"/></svg>`,
    cicek: `<svg viewBox="0 0 100 100"><g fill="#ff7ab8"><circle cx="50" cy="38" r="9"/><circle cx="62" cy="50" r="9"/><circle cx="50" cy="62" r="9"/><circle cx="38" cy="50" r="9"/></g><circle cx="50" cy="50" r="7" fill="#ffd34d"/></svg>`,
    cali: `<svg viewBox="0 0 100 100"><circle cx="38" cy="56" r="20" fill="#3fa85c"/><circle cx="60" cy="48" r="22" fill="#47b866"/><circle cx="56" cy="66" r="16" fill="#3fa85c"/></svg>`,
  };

  // ---------- Bölüm üretimi ----------
  const rnd = (() => { let s = 3840; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const sec = (a) => a[Math.floor(rnd() * a.length)];
  const karistir = (a) => a.map((x) => [rnd(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const nokta = (z) => z.split(",").map(Number);
  const yonu = (p, q) => Object.keys(YON).find((k) => p[0] + YON[k][0] === q[0] && p[1] + YON[k][1] === q[1]);
  // Patikadan kartlar: engelin önünde engel kartı, diğer adımlarda ok
  function cozum(b) {
    let i = 0; const out = [];
    while (i < b.yol.length - 1) {
      const e = b.engel[b.yol[i + 1]];
      if (e) { out.push(ENGEL[e]); i += 2; } else { out.push(yonu(nokta(b.yol[i]), nokta(b.yol[i + 1]))); i += 1; }
    }
    return out;
  }
  function uret([R, C, L, donusMin, donusMax, turler, sapak]) {
    for (let deneme = 0; deneme < 40000; deneme++) {
      // Kendine değmeyen rastgele yürüyüş
      let p = [Math.floor(rnd() * R), Math.floor(rnd() * C)];
      const yol = [p], kul = new Set([String(p)]);
      let yon = sec(Object.keys(YON)), donus = 0, ok = true;
      while (yol.length < L) {
        const secenek = Object.keys(YON).filter((k) => {
          const q = [p[0] + YON[k][0], p[1] + YON[k][1]];
          if (q[0] < 0 || q[0] >= R || q[1] < 0 || q[1] >= C || kul.has(String(q))) return false;
          return Object.values(YON).every(([dr, dc]) => { const z = String([q[0] + dr, q[1] + dc]); return z === String(p) || !kul.has(z); });
        });
        if (!secenek.length) { ok = false; break; }
        const k = secenek.includes(yon) && rnd() < 0.62 ? yon : sec(secenek);
        if (yol.length > 1 && k !== yon) donus++;
        yon = k; p = [p[0] + YON[k][0], p[1] + YON[k][1]]; yol.push(p); kul.add(String(p));
      }
      if (!ok || donus < donusMin || donus > donusMax) continue;
      // Engel yeri: tilki engele düz bir çizgide gelip düz devam etsin
      const aday = [];
      for (let i = 1; i < L - 1; i++) {
        const d1 = yonu(yol[i - 1], yol[i]), d2 = yonu(yol[i], yol[i + 1]);
        if (d1 !== d2) continue;
        if (i >= 2 && yonu(yol[i - 2], yol[i - 1]) !== d1) continue;
        aday.push(i);
      }
      const engel = {}, secilen = [];
      for (const t of turler) {
        const a = aday.filter((i) => secilen.every((j) => Math.abs(i - j) >= 3));
        if (!a.length) { ok = false; break; }
        const i = sec(a); secilen.push(i); engel[String(yol[i])] = t;
      }
      if (!ok) continue;
      const b = { R, C, yol: yol.map(String), engel, bakis: yonu(yol[0], yol[1]), sapak: [] };
      // Çıkmaz sapaklar: patikadan ayrılan iki taşlık yollar
      if (sapak) {
        const yolSet = new Set(b.yol);
        const icinde = (q) => q[0] >= 0 && q[0] < R && q[1] >= 0 && q[1] < C;
        for (const i of karistir([...Array(L - 2).keys()].map((x) => x + 1))) {
          if (b.sapak.length >= sapak) break;
          if (b.engel[b.yol[i]]) continue;
          const k = sec(Object.keys(YON)), q1 = [yol[i][0] + YON[k][0], yol[i][1] + YON[k][1]], q2 = [q1[0] + YON[k][0], q1[1] + YON[k][1]];
          if (!icinde(q1) || !icinde(q2) || yolSet.has(String(q1)) || yolSet.has(String(q2))) continue;
          const dolu = new Set([...yolSet, ...b.sapak.flatMap((s) => s.taslar)]);
          const bos = (q, izin) => Object.values(YON).every(([dr, dc]) => { const z = String([q[0] + dr, q[1] + dc]); return izin.includes(z) || !dolu.has(z); });
          if (!bos(q1, [b.yol[i], String(q2)]) || !bos(q2, [String(q1)])) continue;
          b.sapak.push({ kok: b.yol[i], taslar: [String(q1), String(q2)] });
        }
        if (b.sapak.length < sapak) continue;
      }
      b.uzum = b.yol.slice(1, -1).filter((z) => !b.engel[z] && rnd() < 0.3).slice(0, 3);
      b.sus = {};
      const tumTas = new Set([...b.yol, ...b.sapak.flatMap((s) => s.taslar)]);
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (!tumTas.has(`${r},${c}`) && rnd() < 0.3) b.sus[`${r},${c}`] = sec(["cicek", "cali", "cali"]);
      b.cozum = cozum(b);
      return b;
    }
    throw new Error("bölüm kurulamadı");
  }
  // [satır, sütun, patika uzunluğu, dönüş aralığı, engeller, çıkmaz sapak]
  const T = [
    [3, 4, 3, 0, 0, [], 0], [3, 4, 4, 0, 0, ["kaya"], 0], [3, 5, 5, 0, 0, ["gol"], 0],
    [4, 4, 5, 1, 1, ["kaya"], 0], [4, 5, 6, 1, 1, ["dal"], 0], [4, 5, 6, 1, 1, ["gol"], 0],
    [4, 5, 7, 1, 2, ["kaya", "dal"], 0], [4, 5, 7, 2, 2, ["gol"], 0], [4, 5, 8, 2, 2, ["kaya", "gol"], 0], [5, 5, 8, 2, 3, ["dal", "kaya"], 0], [5, 5, 9, 2, 3, ["gol", "dal"], 0], [5, 5, 9, 3, 3, ["kaya", "gol"], 0],
    [5, 5, 10, 3, 3, ["kaya", "dal"], 1], [5, 6, 10, 3, 4, ["gol", "kaya"], 1], [5, 6, 11, 3, 4, ["dal", "gol"], 1], [5, 6, 11, 3, 4, ["kaya", "dal", "gol"], 0], [5, 6, 12, 4, 4, ["kaya", "gol"], 1], [5, 6, 12, 4, 5, ["dal", "kaya", "gol"], 1],
    [5, 6, 12, 4, 5, ["kaya", "dal", "gol"], 1], [6, 6, 12, 4, 5, ["gol", "kaya", "dal"], 1], [6, 6, 13, 4, 5, ["dal", "gol", "kaya"], 1], [6, 6, 13, 4, 5, ["kaya", "kaya", "gol"], 2], [6, 6, 13, 5, 6, ["dal", "gol", "dal"], 1], [6, 6, 14, 4, 6, ["kaya", "dal", "gol"], 2],
    [6, 6, 14, 5, 6, ["gol", "kaya", "dal"], 2], [6, 6, 14, 5, 6, ["kaya", "gol", "gol"], 2], [6, 6, 14, 5, 6, ["dal", "kaya", "gol"], 2], [6, 7, 14, 5, 7, ["kaya", "dal", "gol"], 2], [6, 7, 14, 6, 7, ["gol", "dal", "kaya"], 2], [6, 7, 14, 6, 7, ["kaya", "gol", "dal"], 2],
  ];
  const BOLUMLER = T.map((t, i) => ({ ...uret(t), grup: Uygulama.seviye(i), ek: i < 6 ? 1 : 2 }));

  // ---------- Oyun ----------
  const stil = `
  .kk { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eaf6e2, #dcefd2); }
  .kk-sahne { --k: 80px; --p: 60px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 22px; padding: 8px 16px 16px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .kk-sahne.dikey { flex-direction: column; gap: 10px; justify-content: safe center; overflow-y: auto; }
  .kk-bahce { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 8px; border-radius: 22px; background: #8fd36a; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .kk-kare { position: relative; }
  .kk-kare.tas::before { content: ""; position: absolute; inset: 9%; border-radius: 34%; background: #ead2a8; box-shadow: inset 0 -5px 0 #d1b384; z-index: 0; }
  .kk-kare .bag { position: absolute; background: #ead2a8; z-index: 0; }
  .kk-kare .bag.s { left: 60%; right: -40%; top: 36%; bottom: 36%; }
  .kk-kare .bag.a { top: 60%; bottom: -40%; left: 36%; right: 36%; }
  .kk-kare > svg { position: absolute; inset: 4%; width: 92%; height: 92%; z-index: 1; }
  .kk-kare.sus > svg { inset: 18%; width: 64%; height: 64%; opacity: .9; }
  .kk-kare > svg.uzum { inset: 24%; width: 52%; height: 52%; transition: transform .3s, opacity .3s; }
  .kk-kare > svg.uzum.alindi { transform: scale(1.6) translateY(-20px); opacity: 0; }
  .kk-kare.carpti > svg { animation: kk-yanip .3s 4; }
  .kk-kare.cimen-hata { animation: kk-cim .3s 4; border-radius: 16px; }
  @keyframes kk-yanip { 50% { filter: drop-shadow(0 0 10px #ff5a4e) brightness(1.2); } }
  @keyframes kk-cim { 50% { background: rgba(255,90,78,.45); } }
  .kk-tilki { position: absolute; left: 8px; top: 8px; width: var(--k); height: var(--k); transition: transform .42s ease-in-out; pointer-events: none; z-index: 3; }
  .kk-tilki > .ziplama { position: absolute; inset: 0; transition: transform .2s; }
  .kk-tilki .govde { position: absolute; inset: 6%; transition: transform .3s ease-in-out; }
  .kk-tilki svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 4px 2px rgba(0,0,0,.25)); }
  .kk-tilki.zipliyor > .ziplama { animation: kk-zipla .7s ease-in-out; }
  @keyframes kk-zipla { 50% { transform: scale(1.5); } }
  .kk-tilki.egik > .ziplama { transform: scale(.68); }
  .kk-tilki .simit { position: absolute; inset: 20%; border-radius: 50%; border: 6px solid #ff5a4e; box-shadow: inset 0 0 0 3px #fff; display: none; z-index: 2; }
  .kk-tilki.yuzuyor .simit { display: block; }
  .kk-tilki.yuzuyor > .ziplama { animation: kk-yuz .35s ease-in-out 2; }
  @keyframes kk-yuz { 50% { transform: rotate(8deg) scale(.95); } }
  .kk-tilki.uzgun .govde svg { animation: kk-salla .5s 2; }
  @keyframes kk-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  .kk-yan { display: grid; justify-items: center; gap: 12px; }
  .kk-program { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: min(100%, 560px); box-sizing: border-box; }
  .kk-yer { width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); cursor: pointer; }
  .kk-yer.dolu { border: 0; background: none; }
  .kk-yer svg { width: 100%; height: 100%; display: block; }
  .kk-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; border-radius: 16px; }
  .kk-yer.hata { outline: 5px solid var(--kirmizi); outline-offset: 2px; border-radius: 16px; animation: kk-salla .5s 2; }
  .kk-yer.hedefte { border-color: var(--mavi); background: #d4e8ff; }
  .kk-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .kk-oklar { display: grid; grid-template-columns: repeat(3, var(--p)); grid-template-rows: repeat(2, var(--p)); gap: 8px; }
  .kk-oklar .kk-kart[data-k="y"] { grid-column: 2; grid-row: 1; } .kk-oklar .kk-kart[data-k="l"] { grid-column: 1; grid-row: 2; } .kk-oklar .kk-kart[data-k="a"] { grid-column: 2; grid-row: 2; } .kk-oklar .kk-kart[data-k="s"] { grid-column: 3; grid-row: 2; }
  .kk-eylem { display: flex; gap: 8px; }
  .kk-kart { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .kk-kart svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .kk-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); }
  .kk-tasinan svg { width: 100%; height: 100%; display: block; }
  .kk-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .kk-calistir svg { width: 30px; height: 30px; }
  .kk-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("kk-stil")) { const st = document.createElement("style"); st.id = "kk-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="kk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="kk-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".kk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); } }); }

  // Bölümde görünen engel kartları: o bölüme kadar tanıtılmış olanlar
  function eylemler(i) {
    const s = new Set();
    BOLUMLER.slice(0, i + 1).forEach((b) => Object.values(b.engel).forEach((e) => s.add(ENGEL[e])));
    return ["zipla", "yuz", "egil"].filter((k) => s.has(k));
  }
  // İki taş arasında patika köprüsü var mı
  function bagli(b, p, q) {
    const i = b.yol.indexOf(p), j = b.yol.indexOf(q);
    if (i >= 0 && j >= 0) return Math.abs(i - j) === 1;
    return b.sapak.some((s) => { const zincir = [s.kok, ...s.taslar]; const a = zincir.indexOf(p), c = zincir.indexOf(q); return a >= 0 && c >= 0 && Math.abs(a - c) === 1; });
  }
  function bahceHtml(b) {
    const tasSet = new Set([...b.yol, ...b.sapak.flatMap((s) => s.taslar)]);
    let s = "";
    for (let r = 0; r < b.R; r++) for (let c = 0; c < b.C; c++) {
      const z = `${r},${c}`, tas = tasSet.has(z);
      let bag = "";
      if (tas && bagli(b, z, `${r},${c + 1}`)) bag += `<span class="bag s"></span>`;
      if (tas && bagli(b, z, `${r + 1},${c}`)) bag += `<span class="bag a"></span>`;
      let ic = "";
      if (b.engel[z]) {
        ic = SVG[b.engel[z]];
        const i = b.yol.indexOf(z), yatay = nokta(b.yol[i - 1])[0] === r;
        if (b.engel[z] === "dal" && yatay) ic = ic.replace("<svg", `<svg style="transform:rotate(90deg)"`);
      }
      else if (z === b.yol[b.yol.length - 1]) ic = SVG.sepet;
      else if (b.uzum.includes(z)) ic = SVG.uzum.replace("<svg", `<svg class="uzum"`);
      else if (b.sus[z]) ic = SVG[b.sus[z]];
      s += `<div class="kk-kare${tas ? " tas" : b.sus[z] ? " sus" : ""}" data-z="${z}">${bag}${ic}</div>`;
    }
    return s + `<div class="kk-tilki"><div class="ziplama"><div class="govde">${tilki}</div></div><span class="simit"></span></div>`;
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.program = []; d.yer = null; d.aci = ACI[b.bakis];
    d.yerSayi = Math.min(14, b.cozum.length + b.ek);
    const ey = eylemler(i);
    d.sahne.innerHTML = `
      <div class="kk-bahce" style="--C:${b.C}">${bahceHtml(b)}</div>
      <div class="kk-yan">
        <div class="kk-program" aria-label="Program">${Array.from({ length: d.yerSayi }, (_, j) => `<div class="kk-yer" data-j="${j}" role="button" tabindex="0" aria-label="${j + 1}. adım"></div>`).join("")}</div>
        <div class="kk-alt">
          <div class="kk-oklar" aria-label="Ok kartları">${["y", "l", "a", "s"].map((k) => `<button class="kk-kart" type="button" data-k="${k}" aria-label="${KART[k].ad}">${kartSvg(k)}</button>`).join("")}</div>
          ${ey.length ? `<div class="kk-eylem" aria-label="Engel kartları">${ey.map((k) => `<button class="kk-kart" type="button" data-k="${k}" aria-label="${KART[k].ad}">${kartSvg(k)}</button>`).join("")}</div>` : ""}
          <button class="kk-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Koş</span></button>
        </div>
      </div>`;
    d.bahce = d.sahne.querySelector(".kk-bahce");
    d.tilki = d.sahne.querySelector(".kk-tilki");
    d.programEl = d.sahne.querySelector(".kk-program");
    d.dugme = d.sahne.querySelector(".kk-calistir");
    d.dugme.onclick = calistir;
    d.programEl.querySelectorAll(".kk-yer").forEach((y) => (y.onclick = () => { if (d.calisiyor) return; const j = +y.dataset.j; if (j < d.program.length) { d.program.splice(j, 1); programCiz(); d.api.ses.tik(); } }));
    d.sahne.querySelectorAll(".kk-kart").forEach(kartTasi);
    programCiz();
    boyutla();
  }
  const kareEl = (z) => d.bahce.querySelector(`.kk-kare[data-z="${z}"]`);
  function programCiz() {
    d.programEl.querySelectorAll(".kk-yer").forEach((y, j) => { y.className = "kk-yer" + (j < d.program.length ? " dolu" : ""); y.innerHTML = j < d.program.length ? kartSvg(d.program[j]) : ""; });
    d.dugme.disabled = d.calisiyor || !d.program.length;
  }
  function boyutla() {
    if (!d || !d.bahce) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.1;
    d.sahne.classList.toggle("dikey", dikey);
    const p = Math.max(44, Math.min(68, Math.floor((dikey ? W - 30 : W * 0.42) / Math.min(d.yerSayi, 6) - 10)));
    const satir = Math.ceil(d.yerSayi / Math.max(1, Math.floor(((dikey ? W : W * 0.42) - 24) / (p + 8))));
    const k = dikey ? Math.min((W - 20) / b.C, (H - satir * (p + 8) - 2 * p - 130) / b.R, 100) : Math.min((W * 0.55 - 20) / b.C, (H - 20) / b.R, 110);
    d.k = Math.max(34, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px"); d.sahne.style.setProperty("--p", p + "px");
    // Hâlâ sığmıyorsa (telefonda alttaki düğme kesilmesin) küçült
    for (let t = 0; t < 40 && d.k > 30 && d.sahne.scrollHeight > d.sahne.clientHeight + 1; t++) { d.k -= 2; d.sahne.style.setProperty("--k", d.k + "px"); }
    tilkiKoy(...(d.yer || nokta(b.yol[0])), d.aci, false);
  }
  function tilkiKoy(r, c, aci, anim = true) {
    d.yer = [r, c]; d.aci = aci;
    const g = d.tilki.querySelector(".govde");
    d.tilki.style.transition = anim ? "" : "none"; g.style.transition = anim ? "" : "none";
    d.tilki.style.transform = `translate(${c * d.k}px, ${r * d.k}px)`;
    g.style.transform = `rotate(${aci}deg)`;
    if (!anim) { void d.tilki.offsetWidth; d.tilki.style.transition = ""; g.style.transition = ""; }
  }
  // En kısa yoldan dönüş açısı
  const donAci = (eski, yeni) => eski + ((((yeni - eski) % 360) + 540) % 360) - 180;
  function kartKoy(k, j) {
    if (d.calisiyor) return;
    if (j == null || j >= d.program.length) { if (d.program.length >= d.yerSayi) return; d.program.push(k); } else d.program[j] = k;
    programCiz(); d.api.ses.tik();
  }
  function kartTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const k = btn.dataset.k;
    btn.addEventListener("pointerdown", (e) => { if (d.calisiyor) return; e.preventDefault(); aktif = true; bx = e.clientX; by = e.clientY; btn.setPointerCapture && btn.setPointerCapture(e.pointerId); });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) { ucan = document.createElement("div"); ucan.className = "kk-tasinan"; const rr = btn.getBoundingClientRect(); ucan.style.width = ucan.style.height = rr.width + "px"; ucan.innerHTML = kartSvg(k); document.body.appendChild(ucan); }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY), yer = alt && alt.closest(".kk-yer");
      if (hedef && hedef !== yer) hedef.classList.remove("hedefte");
      hedef = yer || null; if (hedef) hedef.classList.add("hedefte");
    });
    const birak = () => { if (!aktif) return; aktif = false; if (ucan) { ucan.remove(); ucan = null; if (hedef) { hedef.classList.remove("hedefte"); kartKoy(k, +hedef.dataset.j); } hedef = null; } else kartKoy(k); };
    btn.addEventListener("pointerup", birak); btn.addEventListener("pointercancel", birak);
  }

  async function calistir() {
    if (d.calisiyor || !d.program.length) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, b = BOLUMLER[d.idx], yerler = [...d.programEl.querySelectorAll(".kk-yer")];
    const dur = () => !d || benim !== d.uid;
    const tasSet = new Set([...b.yol, ...b.sapak.flatMap((s) => s.taslar)]), hedefZ = b.yol[b.yol.length - 1];
    let [r, c] = nokta(b.yol[0]), bakis = b.bakis, aci = ACI[b.bakis], hata = -1, vardi = false;
    const alinan = new Set();
    for (let j = 0; j < d.program.length; j++) {
      yerler.forEach((e, q) => e.classList.toggle("simdi", q === j));
      const k = d.program[j];
      if (YON[k]) {
        if (k !== bakis) { aci = donAci(aci, ACI[k]); bakis = k; tilkiKoy(r, c, aci); await bekle(260); if (dur()) return; }
        const nr = r + YON[k][0], nc = c + YON[k][1], z = `${nr},${nc}`;
        if (!tasSet.has(z) || b.engel[z]) {
          // Çimene basma ya da engele çarpma
          tilkiKoy(r + YON[k][0] * 0.35, c + YON[k][1] * 0.35, aci); await bekle(260); if (dur()) return; tilkiKoy(r, c, aci);
          const e = kareEl(z); if (e) e.classList.add(b.engel[z] ? "carpti" : "cimen-hata");
          hata = j; break;
        }
        r = nr; c = nc; tilkiKoy(r, c, aci); d.api.ses.adim(j % 8);
        await bekle(440); if (dur()) return;
      } else {
        // Engel kartı: baktığı yöndeki engelin öbür yanına geçer
        const z1 = `${r + YON[bakis][0]},${c + YON[bakis][1]}`, r2 = r + 2 * YON[bakis][0], c2 = c + 2 * YON[bakis][1];
        const sinif = k === "zipla" ? "zipliyor" : k === "egil" ? "egik" : "yuzuyor";
        d.tilki.classList.add(sinif);
        if (!b.engel[z1] || ENGEL[b.engel[z1]] !== k || !tasSet.has(`${r2},${c2}`)) {
          await bekle(600); if (dur()) return;
          d.tilki.classList.remove(sinif);
          const e = kareEl(z1); if (e) e.classList.add(b.engel[z1] ? "carpti" : "cimen-hata");
          hata = j; break;
        }
        d.api.ses.ton(k === "zipla" ? 700 : k === "egil" ? 440 : 520, 0.3);
        d.tilki.style.transition = "transform .7s ease-in-out";
        r = r2; c = c2;
        d.tilki.style.transform = `translate(${c * d.k}px, ${r * d.k}px)`; d.yer = [r, c];
        await bekle(720); if (dur()) return;
        d.tilki.style.transition = "";
        d.tilki.classList.remove(sinif);
      }
      const z = `${r},${c}`;
      if (b.uzum.includes(z) && !alinan.has(z)) { alinan.add(z); const u = kareEl(z).querySelector(".uzum"); if (u) u.classList.add("alindi"); d.api.ses.ton(990, 0.12); }
      if (z === hedefZ) { vardi = true; break; }
    }
    yerler.forEach((e) => e.classList.remove("simdi"));
    if (vardi) { d.api.ses.yerlesti(); await bekle(500); if (dur()) return; return bitir(); }
    if (hata >= 0) yerler[hata].classList.add("hata");
    d.tilki.classList.add("uzgun"); d.api.ses.hata();
    await bekle(1600);
    if (dur()) return;
    yerler.forEach((e) => e.classList.remove("hata"));
    d.bahce.innerHTML = bahceHtml(b);
    d.tilki = d.bahce.querySelector(".kk-tilki");
    d.yer = null; d.aci = ACI[b.bakis];
    boyutla();
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün üzümler tilkinin, şampiyon!" : "Son sepet de bulundu!") : "Tilki üzümlere ulaştı!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.KOSU_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(38, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const sol = BOLUMLER[d.idx].cozum.slice(0, tam ? undefined : 2);
      return [{ el: d.tilki }, ...sol.map((k, j) => ({ el: d.sahne.querySelector(`.kk-kart[data-k="${k}"]`), hedef: d.sahne.querySelector(`.kk-yer[data-j="${j}"]`) })), { el: d.dugme }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${tilki}${kartSvg("s")}${kartSvg("zipla")}${SVG.sepet}</div>`; },
  });
})();
