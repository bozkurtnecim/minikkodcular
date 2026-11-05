/* Dokununca Ne Olur? (olay tabanlı programlama: "dokununca" ve "zil çalınca" olayları).
   Sahnede hayvanlar var. Her hayvanın "dokununca" satırına eylem kartları konur; hayvana dokununca o kartlar
   sırayla çalışır. Üstteki film kareleri hangi hayvana dokununca ne olması gerektiğini gösterir.
   Sonraki bölümlerde bir hayvana dokununca başka hayvan hareket eder; en sonda zil kartı ve "zil çalınca" satırları gelir.
   Hayvanlara dokunup programı istediğin an deneyebilirsin. "Oyna" filmi baştan oynatır ve kontrol eder.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "dokun";
  const HAYVAN = [
    { ad: "Kedi", svg: `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 40 L26 10 L44 28 Z M78 40 L74 10 L56 28 Z" fill="#ff9a3c"/><path d="M27 34 L29 18 L39 29 Z M73 34 L71 18 L61 29 Z" fill="#ffd0b0"/><ellipse cx="50" cy="56" rx="34" ry="30" fill="#ff9a3c"/><circle cx="38" cy="52" r="5" fill="#26201f"/><circle cx="62" cy="52" r="5" fill="#26201f"/><path d="M46 62 h8 l-4 5 z" fill="#e0533f"/><path d="M50 67 q-6 6 -12 2 M50 67 q6 6 12 2" stroke="#26201f" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M18 60 h14 M18 67 h14 M68 60 h14 M68 67 h14" stroke="#8a4a1a" stroke-width="2"/></svg>` },
    { ad: "Köpek", svg: `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="54" rx="32" ry="31" fill="#c98a4a"/><ellipse cx="20" cy="46" rx="11" ry="22" fill="#8a5a33" transform="rotate(15 20 46)"/><ellipse cx="80" cy="46" rx="11" ry="22" fill="#8a5a33" transform="rotate(-15 80 46)"/><ellipse cx="50" cy="68" rx="17" ry="13" fill="#f1d6b0"/><circle cx="39" cy="48" r="5" fill="#26201f"/><circle cx="61" cy="48" r="5" fill="#26201f"/><ellipse cx="50" cy="61" rx="7" ry="5" fill="#26201f"/><path d="M50 66 v6 M50 72 q-6 4 -10 0 M50 72 q6 4 10 0" stroke="#26201f" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>` },
    { ad: "Kurbağa", svg: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="32" cy="30" r="14" fill="#5cc96a"/><circle cx="68" cy="30" r="14" fill="#5cc96a"/><circle cx="32" cy="29" r="8" fill="#fff"/><circle cx="68" cy="29" r="8" fill="#fff"/><circle cx="33" cy="30" r="4.5" fill="#26201f"/><circle cx="67" cy="30" r="4.5" fill="#26201f"/><ellipse cx="50" cy="60" rx="38" ry="28" fill="#5cc96a"/><path d="M28 64 q22 16 44 0" stroke="#2e8a3e" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="30" cy="54" r="4" fill="#ff9fb5" opacity=".7"/><circle cx="70" cy="54" r="4" fill="#ff9fb5" opacity=".7"/></svg>` },
    { ad: "Ördek", svg: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="52" r="34" fill="#ffd34d"/><path d="M28 22 q8 -14 18 -4 q4 -10 12 0" stroke="#ffd34d" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="38" cy="44" r="5" fill="#26201f"/><circle cx="62" cy="44" r="5" fill="#26201f"/><path d="M30 60 q20 -10 40 0 q-20 16 -40 0 z" fill="#ff8a1f"/><path d="M32 60 q18 5 36 0" stroke="#d96a0a" stroke-width="2.5" fill="none"/></svg>` },
  ];
  // Eylemler: z zıpla, d dön, s ses çıkar, b büyü; zil ayrı kart
  const EYLEM = {
    z: { ad: "zıplar", ic: `<path d="M50 14 L74 42 H60 V66 H40 V42 H26 Z" fill="#fff"/><path d="M22 84 H78" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`, renk: "#2fb36a" },
    d: { ad: "döner", ic: `<path d="M74 50 A24 24 0 1 1 62 29" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M56 14 L80 26 L58 42 Z" fill="#fff"/>`, renk: "#2f86e0" },
    s: { ad: "ses çıkarır", ic: `<path d="M40 70 V24 L72 16 V60" stroke="#fff" stroke-width="7" fill="none" stroke-linejoin="round"/><ellipse cx="32" cy="72" rx="11" ry="9" fill="#fff"/><ellipse cx="64" cy="62" rx="11" ry="9" fill="#fff"/>`, renk: "#8a5cf0" },
    b: { ad: "büyür", ic: `<path d="M18 18 L40 40 M82 18 L60 40 M18 82 L40 60 M82 82 L60 60" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M14 14 h18 L14 32 Z M86 14 h-18 L86 32 Z M14 86 h18 L14 68 Z M86 86 h-18 L86 68 Z" fill="#fff"/><circle cx="50" cy="50" r="10" fill="#fff"/>`, renk: "#ff8a1f" },
  };
  const ZIL_IC = `<path d="M50 14 a6 6 0 0 1 6 6 c16 4 20 18 20 34 l8 12 H16 l8 -12 c0 -16 4 -30 20 -34 a6 6 0 0 1 6 -6 z" fill="#ffd34d" stroke="#e3a008" stroke-width="4" stroke-linejoin="round"/><circle cx="50" cy="76" r="8" fill="#e3a008"/>`;
  const zilSvg = `<svg viewBox="0 0 100 100" aria-hidden="true">${ZIL_IC}</svg>`;
  const elSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M40 52 V18 a8 8 0 0 1 16 0 V46 l2 -10 a7 7 0 0 1 13 2 l-1 10 2 -6 a7 7 0 0 1 13 3 v18 c0 16 -10 26 -26 26 h-6 c-10 0 -16 -6 -22 -14 L18 66 a8 8 0 0 1 12 -10 z" fill="#ffd8b8" stroke="#26201f" stroke-width="4" stroke-linejoin="round"/></svg>`;
  // Kart: "h.e" (hayvan.eylem) ya da "zil"
  const kartSvg = (k) => {
    if (k === "zil") return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="#fff4c9" stroke="#e3a008" stroke-width="5"/><g transform="translate(14 12) scale(.72)">${ZIL_IC}</g></svg>`;
    const [h, e] = k.split(".");
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${EYLEM[e].renk}"/><g transform="translate(44 38) scale(.54)">${EYLEM[e].ic}</g><g transform="translate(4 4) scale(.46)"><circle cx="50" cy="52" r="46" fill="#fff"/>${HAYVAN[h].svg.replace(/<\/?svg[^>]*>/g, "")}</g></svg>`;
  };

  // Programı çalıştır: olay satırları { "t,h": [...], "z,h": [...] }; dokunulan hayvan → etki dizisi
  function etkiler(prog, h, n) {
    const out = [];
    for (const k of prog[`t,${h}`] || []) {
      out.push(k);
      if (k === "zil") for (let q = 0; q < n; q++) for (const z of prog[`z,${q}`] || []) out.push(z);
    }
    return out;
  }

  const rnd = (() => { let s = 3737; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const sec = (a) => a[Math.floor(rnd() * a.length)];
  const karistir = (a) => a.map((x) => [rnd(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  function uret([n, tur, L, ek]) {
    for (let deneme = 0; deneme < 5000; deneme++) {
      const hay = karistir([0, 1, 2, 3]).slice(0, n).sort((a, b) => a - b);
      const prog = {}, satirlar = [];
      const eylemSec = (sahip, onceki) => {
        const h = tur === "own" ? sahip : sec(hay);
        let k; do k = `${h}.${sec(Object.keys(EYLEM))}`; while (k === onceki);
        return k;
      };
      hay.forEach((h) => {
        satirlar.push(`t,${h}`);
        const uz = 1 + Math.floor(rnd() * L), a = [];
        for (let j = 0; j < uz; j++) a.push(eylemSec(h, a[j - 1]));
        prog[`t,${h}`] = a;
      });
      if (tur === "zil") {
        hay.forEach((h) => satirlar.push(`z,${h}`));
        // Bir ya da iki hayvanın dokunma satırına zil girsin, bir ya da iki hayvan zili dinlesin
        const calan = karistir(hay).slice(0, n > 2 && rnd() < 0.5 ? 2 : 1);
        calan.forEach((h) => { const a = prog[`t,${h}`]; if (a.length >= L) a.pop(); a.splice(Math.floor(rnd() * (a.length + 1)), 0, "zil"); });
        const dinleyen = karistir(hay).slice(0, n > 2 && rnd() < 0.4 ? 2 : 1);
        dinleyen.forEach((h) => { const a = [eylemSec(h)]; if (L > 1 && rnd() < 0.3) a.push(eylemSec(h, a[0])); prog[`z,${h}`] = a; });
        // Zil çalan hayvan kendi zilini dinlemesin (karışmasın)
        if (calan.some((h) => prog[`z,${h}`])) continue;
      }
      if (tur === "cross" && !hay.some((h) => prog[`t,${h}`].some((k) => k !== "zil" && +k.split(".")[0] !== h))) continue;
      const kartSay = Object.values(prog).flat().length;
      if (kartSay > 7) continue;
      // Film: her hayvana bir kez dokun (rastgele sıra)
      const film = karistir(hay).map((h) => ({ h, etki: etkiler(prog, h, 4) }));
      // Kart kutusu: gerekenler + çeldiriciler
      const gerek = [...new Set(Object.values(prog).flat())];
      const tum = hay.flatMap((h) => Object.keys(EYLEM).map((e) => `${h}.${e}`)).filter((k) => !gerek.includes(k));
      const kutu = [...gerek, ...karistir(tum).slice(0, ek)].sort();
      return { hay, satirlar, prog, film, kutu, L: Math.max(L, ...Object.values(prog).map((a) => a.length)) };
    }
    throw new Error("bölüm kurulamadı");
  }
  // [hayvan sayısı, tür, satır uzunluğu, çeldirici kart]
  const T = [
    [1, "own", 1, 1], [1, "own", 1, 2], [1, "own", 1, 3],
    [2, "own", 1, 1], [2, "own", 1, 2], [2, "own", 1, 2],
    [1, "own", 2, 2], [2, "own", 2, 2], [3, "own", 1, 2], [2, "own", 2, 3], [3, "own", 1, 3], [3, "own", 2, 2],
    [2, "cross", 1, 2], [2, "cross", 1, 3], [2, "cross", 2, 2], [3, "cross", 1, 2], [3, "cross", 1, 3], [2, "cross", 2, 3],
    [2, "zil", 1, 1], [2, "zil", 1, 2], [2, "zil", 2, 2], [3, "zil", 1, 2], [2, "zil", 2, 2], [3, "zil", 1, 3],
    [3, "zil", 2, 2], [3, "zil", 2, 2], [3, "zil", 1, 3], [3, "zil", 2, 3], [3, "zil", 2, 3], [3, "zil", 2, 3],
  ];
  const BOLUMLER = T.map((t, i) => ({ ...uret(t), grup: Uygulama.seviye(i) }));

  // ---------- Oyun ----------
  const stil = `
  .dk { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#fff6ec, #fde9d6); }
  .dk-sahne { --p: 60px; --h: 110px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 22px; padding: 8px 16px 16px; overflow: auto; touch-action: manipulation; user-select: none; -webkit-user-select: none; }
  .dk-sahne.dikey { flex-direction: column; gap: 12px; justify-content: safe center; }
  .dk-sol, .dk-sag { display: grid; justify-items: center; gap: 12px; }
  .dk-film { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
  .dk-kare { position: relative; display: flex; align-items: center; gap: 4px; padding: 6px 10px; border-radius: 16px; background: #fff; box-shadow: 0 4px 0 rgba(29,40,70,.1); border: 3px solid transparent; }
  .dk-kare.ok { border-color: #2fb36a; } .dk-kare.yanlis { border-color: #ff5a4e; } .dk-kare.simdi { border-color: var(--sari); }
  .dk-kare .dk-dokun { position: relative; width: calc(var(--p) * .8); height: calc(var(--p) * .8); }
  .dk-kare .dk-dokun > svg { width: 100%; height: 100%; display: block; }
  .dk-kare .dk-dokun .el { position: absolute; right: -10px; bottom: -8px; width: 58%; height: 58%; }
  .dk-kare .ok-isaret { font: 900 1.4rem var(--f-baslik); color: #9aa7b8; }
  .dk-kare .k { width: calc(var(--p) * .66); height: calc(var(--p) * .66); }
  .dk-kare .k svg { width: 100%; height: 100%; display: block; }
  .dk-kare .sonuc { position: absolute; top: -12px; right: -10px; width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; color: #fff; font: 900 18px var(--f-baslik); }
  .dk-sahnecik { position: relative; display: flex; gap: 18px; align-items: flex-end; justify-content: center; padding: 26px 22px 18px; border-radius: 24px; background: linear-gradient(#bfe3ff 0 62%, #8fd36a 62%); box-shadow: 0 8px 0 rgba(29,40,70,.12); min-width: 220px; }
  .dk-hayvan { position: relative; width: var(--h); height: var(--h); padding: 0; border: 0; background: none; cursor: pointer; }
  .dk-hayvan > div { width: 100%; height: 100%; }
  .dk-hayvan svg { width: 100%; height: 100%; display: block; filter: drop-shadow(0 5px 2px rgba(0,0,0,.18)); }
  .dk-hayvan .el { position: absolute; right: -14px; bottom: -14px; width: 55%; height: 55%; z-index: 3; pointer-events: none; animation: dk-dokun .5s; }
  @keyframes dk-dokun { from { transform: translate(20px, 20px); opacity: 0; } }
  .dk-hayvan .not { position: absolute; left: 70%; top: -20%; width: 40%; height: 40%; pointer-events: none; animation: dk-not .7s forwards; }
  @keyframes dk-not { to { transform: translate(14px, -24px); opacity: 0; } }
  .dk-a-z { animation: dk-z .5s ease-out; } @keyframes dk-z { 40% { transform: translateY(-45%); } 70% { transform: translateY(0); } 85% { transform: translateY(-8%); } }
  .dk-a-d { animation: dk-d .55s ease-in-out; } @keyframes dk-d { to { transform: rotate(360deg); } }
  .dk-a-s { animation: dk-s .5s; } @keyframes dk-s { 25% { transform: rotate(-12deg); } 75% { transform: rotate(12deg); } }
  .dk-a-b { animation: dk-b .55s; } @keyframes dk-b { 50% { transform: scale(1.45); } }
  .dk-zil { position: absolute; top: 4px; right: 10px; width: 44px; height: 44px; opacity: .25; transition: opacity .2s; }
  .dk-zil svg { width: 100%; height: 100%; display: block; }
  .dk-zil.calar { opacity: 1; animation: dk-s .25s 2; }
  .dk-program { display: grid; gap: 8px; padding: 12px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); }
  .dk-program.iki { grid-template-columns: 1fr 1fr; }
  .dk-satir { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 16px; border: 3px solid transparent; cursor: pointer; }
  .dk-satir.secili { border-color: var(--mavi); background: #e6f1ff; }
  .dk-satir.hedefte { border-color: var(--mavi); background: #d4e8ff; }
  .dk-olay { position: relative; width: calc(var(--p) * .9); height: calc(var(--p) * .9); flex: none; }
  .dk-olay > svg { width: 100%; height: 100%; display: block; }
  .dk-olay .rozet { position: absolute; right: -8px; bottom: -6px; width: 56%; height: 56%; border-radius: 50%; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,.2); }
  .dk-olay .rozet svg { width: 100%; height: 100%; display: block; }
  .dk-ok { font: 900 calc(var(--p) * .5) var(--f-baslik); color: #9aa7b8; }
  .dk-yer { width: var(--p); height: var(--p); border-radius: 14px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); }
  .dk-yer.dolu { border: 0; background: none; cursor: pointer; }
  .dk-yer svg { width: 100%; height: 100%; display: block; }
  .dk-kutu { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; max-width: min(100%, 460px); }
  .dk-kart { width: var(--p); height: var(--p); padding: 0; border: 0; background: none; border-radius: 18px; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; }
  .dk-kart svg { width: 100%; height: 100%; display: block; pointer-events: none; }
  .dk-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); }
  .dk-tasinan svg { width: 100%; height: 100%; display: block; }
  .dk-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .dk-calistir svg { width: 30px; height: 30px; }
  .dk-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("dk-stil")) { const st = document.createElement("style"); st.id = "dk-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="dk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="dk-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".dk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.calisiyor) return; d.api.ses.tik(); yukle(i); } }); }

  const kucukKart = (k) => `<div class="k">${kartSvg(k)}</div>`;
  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.calisiyor = false; d.oynayan = 0;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.prog = Object.fromEntries(b.satirlar.map((s) => [s, []]));
    d.secili = b.satirlar[0];
    const zilVar = b.satirlar.some((s) => s[0] === "z");
    d.sahne.innerHTML = `
      <div class="dk-sol">
        <div class="dk-film" aria-label="Görev">${b.film.map((f, j) => `<div class="dk-kare" data-j="${j}"><div class="dk-dokun">${HAYVAN[f.h].svg}<div class="el">${elSvg}</div></div><span class="ok-isaret">→</span>${f.etki.map(kucukKart).join("")}</div>`).join("")}</div>
        <div class="dk-sahnecik">${zilVar ? `<div class="dk-zil">${zilSvg}</div>` : ""}${b.hay.map((h) => `<button class="dk-hayvan" type="button" data-h="${h}" aria-label="${HAYVAN[h].ad}"><div>${HAYVAN[h].svg}</div></button>`).join("")}</div>
      </div>
      <div class="dk-sag">
        <div class="dk-program" aria-label="Program">${b.satirlar.map((s) => { const [t, h] = s.split(","); return `<div class="dk-satir" data-s="${s}" role="button"><div class="dk-olay">${t === "t" ? elSvg : zilSvg}<div class="rozet">${HAYVAN[h].svg}</div></div><span class="dk-ok">→</span>${Array.from({ length: b.L }, (_, j) => `<div class="dk-yer" data-j="${j}"></div>`).join("")}</div>`; }).join("")}</div>
        <div class="dk-kutu" aria-label="Kartlar">${b.kutu.map((k) => `<button class="dk-kart" type="button" data-k="${k}" aria-label="Kart">${kartSvg(k)}</button>`).join("")}</div>
        <button class="dk-calistir" type="button">${d.api.IKON.oynat}<span>Oyna</span></button>
      </div>`;
    d.dugme = d.sahne.querySelector(".dk-calistir");
    d.dugme.onclick = calistir;
    d.sahne.querySelectorAll(".dk-satir").forEach((sat) => (sat.onclick = (e) => {
      if (d.calisiyor) return;
      const yer = e.target.closest(".dk-yer.dolu");
      if (yer) { d.prog[sat.dataset.s].splice(+yer.dataset.j, 1); d.api.ses.tik(); }
      d.secili = sat.dataset.s; programCiz();
    }));
    d.sahne.querySelectorAll(".dk-hayvan").forEach((btn) => (btn.onclick = async () => {
      if (d.calisiyor || d.oynayan) return;
      d.oynayan++; const benim = d.uid;
      await dokun(+btn.dataset.h, benim);
      if (d && benim === d.uid) d.oynayan--;
    }));
    d.sahne.querySelectorAll(".dk-kart").forEach(kartTasi);
    programCiz();
    boyutla();
  }
  function programCiz() {
    const b = BOLUMLER[d.idx];
    d.sahne.querySelectorAll(".dk-satir").forEach((sat) => {
      const a = d.prog[sat.dataset.s];
      sat.classList.toggle("secili", sat.dataset.s === d.secili);
      sat.querySelectorAll(".dk-yer").forEach((y, j) => { y.className = "dk-yer" + (j < a.length ? " dolu" : ""); y.innerHTML = j < a.length ? kartSvg(a[j]) : ""; });
    });
    d.dugme.disabled = d.calisiyor || !Object.values(d.prog).some((a) => a.length) || b.L < 1;
  }
  function boyutla() {
    if (!d || !d.dugme) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.1;
    d.sahne.classList.toggle("dikey", dikey);
    const satirSay = b.satirlar.length;
    const kutuSatir = Math.ceil(b.kutu.length / 6);
    // Sağ sütun: satırlar (p + 22) + kart kutusu (p + 8) + düğme
    let p = dikey ? Math.min(60, (W - 60) / (b.L + 2.2)) : Math.min(68, (H - 130) / (satirSay * 1 + kutuSatir) - 18, (W * 0.48 - 60) / (b.L + 2.2));
    p = Math.max(44, Math.floor(p));
    const h = dikey ? Math.min(110, (W - 60) / b.hay.length - 18) : Math.min(140, (W * 0.48 - 60) / b.hay.length - 18, H * 0.32);
    // Telefonda çok satır varsa satırlar iki sütuna dizilir (alttaki kart tepsisi ekranda kalsın)
    // satır: olay simgesi + ok + L kutu + kenar boşlukları
    const satirGen = (q) => q * 0.9 + q * 0.6 + b.L * q + (b.L + 1) * 8 + 24;
    let pIki = Math.min(p, 44), iki = false;
    if (dikey && satirSay > 3) for (; pIki >= 32; pIki -= 2) if (2 * satirGen(pIki) + 40 <= W) { iki = true; break; }
    d.sahne.querySelector(".dk-program").classList.toggle("iki", iki);
    if (iki) p = pIki;
    let hh = Math.max(64, Math.floor(h));
    d.sahne.style.setProperty("--p", p + "px"); d.sahne.style.setProperty("--h", hh + "px");
    // Hâlâ sığmıyorsa (telefonda alttaki düğme kesilmesin) küçült
    for (let t = 0; t < 40 && p > 30 && d.sahne.scrollHeight > d.sahne.clientHeight + 1; t++) { if (hh > 56) hh -= 3; if (p > 34) p -= 1; d.sahne.style.setProperty("--p", p + "px"); d.sahne.style.setProperty("--h", hh + "px"); }
  }
  function kartKoy(k, s) {
    if (d.calisiyor) return;
    s = s || d.secili;
    const a = d.prog[s];
    if (!a || a.length >= BOLUMLER[d.idx].L) { d.api.ses.hata && d.api.ses.tik(); return; }
    a.push(k); d.secili = s; programCiz(); d.api.ses.tik();
  }
  function kartTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const k = btn.dataset.k;
    btn.addEventListener("pointerdown", (e) => { if (d.calisiyor) return; e.preventDefault(); aktif = true; bx = e.clientX; by = e.clientY; btn.setPointerCapture && btn.setPointerCapture(e.pointerId); });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) { ucan = document.createElement("div"); ucan.className = "dk-tasinan"; const rr = btn.getBoundingClientRect(); ucan.style.width = ucan.style.height = rr.width + "px"; ucan.innerHTML = kartSvg(k); document.body.appendChild(ucan); }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY), sat = alt && alt.closest(".dk-satir");
      if (hedef && hedef !== sat) hedef.classList.remove("hedefte");
      hedef = sat || null; if (hedef) hedef.classList.add("hedefte");
    });
    const birak = () => { if (!aktif) return; aktif = false; if (ucan) { ucan.remove(); ucan = null; if (hedef) { hedef.classList.remove("hedefte"); kartKoy(k, hedef.dataset.s); } hedef = null; } else kartKoy(k); };
    btn.addEventListener("pointerup", birak); btn.addEventListener("pointercancel", birak);
  }

  const FREK = { z: 660, d: 520, s: 0, b: 440 };
  const SES = [[880, 740], [330, 300], [260, 390], [620, 620]]; // kedi miyav, köpek hav, kurbağa vrak, ördek vak
  async function eylem(k, benim) {
    if (k === "zil") {
      const z = d.sahne.querySelector(".dk-zil");
      if (z) { z.classList.add("calar"); }
      d.api.ses.ton(1320, 0.3); await bekle(250); d.api.ses.ton(1320, 0.3);
      await bekle(350);
      if (z) z.classList.remove("calar");
      return;
    }
    const [h, e] = k.split("."), el = d.sahne.querySelector(`.dk-hayvan[data-h="${h}"] > div`);
    if (!el) { await bekle(300); return; }
    el.classList.remove("dk-a-z", "dk-a-d", "dk-a-s", "dk-a-b"); void el.offsetWidth;
    el.classList.add(`dk-a-${e}`);
    if (e === "s") {
      SES[h].forEach((f, q) => setTimeout(() => d && benim === d.uid && d.api.ses.ton(f, 0.18), q * 160));
      el.insertAdjacentHTML("beforeend", `<div class="not"><svg viewBox="0 0 100 100"><path d="M40 70 V24 L72 16 V60" stroke="#8a5cf0" stroke-width="8" fill="none"/><ellipse cx="32" cy="72" rx="12" ry="10" fill="#8a5cf0"/><ellipse cx="64" cy="62" rx="12" ry="10" fill="#8a5cf0"/></svg></div>`);
    } else d.api.ses.ton(FREK[e], 0.2);
    await bekle(620);
    el.classList.remove(`dk-a-${e}`);
    const n = el.querySelector(".not"); if (n) n.remove();
  }
  // Hayvana dokun: el görünür, programdaki etkiler sırayla oynar; etki listesini döndürür
  async function dokun(h, benim) {
    const btn = d.sahne.querySelector(`.dk-hayvan[data-h="${h}"]`);
    btn.insertAdjacentHTML("beforeend", `<div class="el">${elSvg}</div>`);
    d.api.ses.tik();
    await bekle(350);
    const etki = etkiler(d.prog, h, 4);
    for (const k of etki) { if (!d || benim !== d.uid) return null; await eylem(k, benim); }
    if (!d || benim !== d.uid) return null;
    const el = btn.querySelector(".el"); if (el) el.remove();
    return etki;
  }

  async function calistir() {
    if (d.calisiyor) return;
    d.calisiyor = true; programCiz();
    const benim = d.uid, b = BOLUMLER[d.idx], kareler = [...d.sahne.querySelectorAll(".dk-kare")];
    kareler.forEach((e) => { e.classList.remove("ok", "yanlis"); const s = e.querySelector(".sonuc"); if (s) s.remove(); });
    let hata = false;
    for (let j = 0; j < b.film.length; j++) {
      kareler.forEach((e, q) => e.classList.toggle("simdi", q === j));
      const etki = await dokun(b.film[j].h, benim);
      if (!etki) return;
      const dogru = etki.join() === b.film[j].etki.join();
      kareler[j].classList.remove("simdi");
      kareler[j].classList.add(dogru ? "ok" : "yanlis");
      kareler[j].insertAdjacentHTML("beforeend", `<span class="sonuc" style="background:${dogru ? "#2fb36a" : "#ff5a4e"}">${dogru ? "✓" : "✗"}</span>`);
      if (dogru) d.api.ses.yerlesti(); else { hata = true; break; }
      await bekle(300);
      if (!d || benim !== d.uid) return;
    }
    if (!hata) { await bekle(400); if (!d || benim !== d.uid) return; return bitir(); }
    d.api.ses.hata();
    await bekle(1500);
    if (!d || benim !== d.uid) return;
    // Yanlışta konan kartlar silinir, çocuk baştan kurar
    Object.keys(d.prog).forEach((s) => (d.prog[s] = []));
    d.calisiyor = false; programCiz();
  }
  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün hayvanlar programını öğrendi!" : "Son film de tamam!") : "Film aynen oynadı!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.DOKUN_BOLUMLER = BOLUMLER;
  window.DOKUN_DURUM = () => d && { prog: d.prog };

  window.Uygulama.oyunEkle(37, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const b = BOLUMLER[d.idx];
      // İlk eksik ya da yanlış kart
      for (const s of b.satirlar) {
        const ist = b.prog[s] || [], var_ = d.prog[s];
        for (let j = 0; j < Math.max(ist.length, var_.length); j++) {
          if (ist[j] === var_[j]) continue;
          if (j < var_.length) return [{ el: d.sahne.querySelector(`.dk-satir[data-s="${s}"] .dk-yer[data-j="${j}"]`) }, { el: d.dugme }];
          return [{ el: d.sahne.querySelector(".dk-kare") }, { el: d.sahne.querySelector(`.dk-kart[data-k="${ist[j]}"]`), hedef: d.sahne.querySelector(`.dk-satir[data-s="${s}"]`) }, { el: d.dugme }];
        }
      }
      return [{ el: d.dugme }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${elSvg}${HAYVAN[0].svg}${kartSvg("0.z")}</div>`; },
  });
})();
