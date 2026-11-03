/* Hangi Program? (kod okuma: hazır programlardan doğru olanı seçmek).
   Haritada arı ve çiçek var. Altta birkaç hazır program durur; arıyı çiçeğe götüren programa dokun.
   İlk bölümlerde arının yolu noktalarla çizilidir; zor bölümlerde yol görünmez, engeller vardır:
   programları kafanda çalıştırıp doğrusunu bulursun. Yanlış seçince arı o programı çalıştırır, nereye gittiğini görürsün.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "hangi";
  const YON = { u: [-1, 0], r: [0, 1], d: [1, 0], l: [0, -1] };
  const OK = {
    u: { renk: "#2fb36a", koyu: "#1f8a4f", aci: 0, ad: "yukarı" }, r: { renk: "#2f86e0", koyu: "#1f62ab", aci: 90, ad: "sağa" },
    d: { renk: "#ff8a1f", koyu: "#d96a0a", aci: 180, ad: "aşağı" }, l: { renk: "#8a5cf0", koyu: "#6a3fcc", aci: 270, ad: "sola" },
  };
  const okSvg = (y) => { const o = OK[y]; return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="3" y="3" width="94" height="94" rx="20" fill="${o.renk}"/><rect x="3" y="80" width="94" height="17" rx="8" fill="${o.koyu}" opacity=".5"/><g transform="rotate(${o.aci} 50 46)"><path d="M50 14 L80 48 H62 V80 H38 V48 H20 Z" fill="#fff"/></g></svg>`; };
  const ari = `<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="40" cy="28" rx="16" ry="22" fill="#e6f6ff" opacity=".95" transform="rotate(-25 40 28)"/><ellipse cx="62" cy="28" rx="16" ry="22" fill="#e6f6ff" opacity=".95" transform="rotate(25 62 28)"/><ellipse cx="48" cy="58" rx="32" ry="24" fill="#ffd23f"/><path d="M36 36 v44 M54 34 v48" stroke="#2b2b2b" stroke-width="9"/><circle cx="78" cy="54" r="15" fill="#2b2b2b"/><circle cx="82" cy="50" r="5" fill="#fff"/><circle cx="83" cy="50" r="2.4" fill="#26201f"/></svg>`;
  const cicek = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 56 V96" stroke="#3d9a3d" stroke-width="7"/>${[0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="50" cy="16" rx="11" ry="17" fill="#ff5d8f" transform="rotate(${i * 60} 50 36)"/>`).join("")}<circle cx="50" cy="36" r="12" fill="#ffd23f"/></svg>`;
  const tas = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 82 L22 44 L46 28 L74 36 L90 64 L86 84 Z" fill="#9aa7b8"/><path d="M22 44 L46 28 L52 50 Z" fill="#b4bfcd"/></svg>`;

  // ---------- Bölümler ----------
  const r = (() => { let s = 2525; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();
  const sec = (a) => a[Math.floor(r() * a.length)];
  const karistir = (a) => a.map((x) => [r(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  // Programı çalıştır: { yol, son, carpti }
  function calis(b, prog) {
    let [y, x] = b.bas; const yol = [[y, x]];
    for (const k of prog) {
      const ny = y + YON[k][0], nx = x + YON[k][1];
      if (ny < 0 || ny >= b.R || nx < 0 || nx >= b.C || b.engel.some(([a, c]) => a === ny && c === nx)) return { yol, son: [y, x], carpti: true };
      y = ny; x = nx; yol.push([y, x]);
    }
    return { yol, son: [y, x], carpti: false };
  }
  const dogruMu = (b, prog) => { const s = calis(b, prog); return !s.carpti && s.son[0] === b.hedef[0] && s.son[1] === b.hedef[1]; };
  function bolum({ R, C, L, secenek, yolGoster, engelSay }) {
    for (let deneme = 0; deneme < 5000; deneme++) {
      const bas = [Math.floor(r() * R), Math.floor(r() * C)];
      // Kendini kesmeyen rastgele yol
      const yol = [bas], prog = [];
      let ok = true;
      for (let i = 0; i < L; i++) {
        const [y, x] = yol[yol.length - 1];
        const adaylar = Object.keys(YON).filter((k) => { const ny = y + YON[k][0], nx = x + YON[k][1]; return ny >= 0 && ny < R && nx >= 0 && nx < C && !yol.some(([a, c]) => a === ny && c === nx); });
        if (!adaylar.length) { ok = false; break; }
        const k = sec(adaylar); prog.push(k); yol.push([y + YON[k][0], x + YON[k][1]]);
      }
      if (!ok) continue;
      const hedef = yol[yol.length - 1];
      if (Math.abs(hedef[0] - bas[0]) + Math.abs(hedef[1] - bas[1]) < Math.min(L, 2)) continue;
      // Engeller yolun dışında
      const bos = [];
      for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) if (!yol.some(([a, c]) => a === y && c === x)) bos.push([y, x]);
      const engel = karistir(bos).slice(0, engelSay);
      const b = { R, C, bas, hedef, engel, yolGoster };
      // Yanıltıcı programlar: bir oku değiştir, iki oku yer değiştir, bir ok eksik/fazla
      const yanlis = new Set();
      for (let t = 0; t < 200 && yanlis.size < secenek - 1; t++) {
        const p = [...prog], tur = Math.floor(r() * 3), i = Math.floor(r() * p.length);
        if (tur === 0) p[i] = sec(Object.keys(YON).filter((k) => k !== p[i]));
        else if (tur === 1 && p.length > 1) { const j = (i + 1) % p.length; [p[i], p[j]] = [p[j], p[i]]; }
        else if (p.length > 1) p.splice(i, 1);
        if (p.join("") === prog.join("") || dogruMu(b, p)) continue;
        yanlis.add(p.join(""));
      }
      if (yanlis.size < secenek - 1) continue;
      return { ...b, programlar: karistir([prog.join(""), ...yanlis]), dogru: prog.join("") };
    }
    throw new Error("bölüm kurulamadı");
  }
  const T = [
    [3, 3, 1, 2, true, 0], [3, 3, 2, 2, true, 0], [3, 4, 2, 2, true, 0],
    [4, 4, 3, 3, true, 0], [4, 4, 3, 3, true, 1], [4, 4, 3, 3, true, 1],
    [4, 4, 4, 3, true, 1], [4, 5, 4, 3, true, 2], [4, 5, 4, 3, true, 2], [5, 5, 5, 3, true, 2], [5, 5, 5, 3, true, 3], [5, 5, 5, 3, true, 3],
    [4, 4, 3, 3, false, 2], [4, 4, 4, 3, false, 2], [4, 5, 4, 3, false, 3], [5, 5, 4, 3, false, 3], [5, 5, 5, 3, false, 3], [5, 5, 5, 3, false, 4],
    [5, 5, 5, 3, false, 4], [5, 5, 6, 3, false, 4], [5, 5, 6, 3, false, 5], [5, 6, 6, 3, false, 5], [5, 6, 6, 4, false, 5], [5, 6, 7, 3, false, 5],
    [5, 6, 7, 4, false, 6], [6, 6, 7, 3, false, 6], [6, 6, 7, 4, false, 6], [6, 6, 8, 3, false, 7], [6, 6, 8, 4, false, 7], [6, 6, 8, 4, false, 8],
  ];
  const BOLUMLER = T.map(([R, C, L, secenek, yolGoster, engelSay], i) => ({ ...bolum({ R, C, L, secenek, yolGoster, engelSay }), grup: Uygulama.seviye(i) }));

  // ---------- Oyun ----------
  const stil = `
  .hp { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .hp-sahne { --k: 70px; --p: 46px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 24px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .hp-sahne.dikey { flex-direction: column; gap: 12px; justify-content: safe center; }
  .hp-harita { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 8px; border-radius: 20px; background: #8fd36a; box-shadow: 0 8px 0 rgba(29,40,70,.12); flex: none; }
  .hp-kare { position: relative; background: #9be07a; outline: 1px solid rgba(255,255,255,.3); }
  .hp-kare:nth-child(odd) { background: #94da72; }
  .hp-kare > svg { position: absolute; inset: 8%; width: 84%; height: 84%; }
  .hp-kare.iz::after { content: ""; position: absolute; left: 50%; top: 50%; width: 20%; height: 20%; margin: -10%; border-radius: 50%; background: #fff; opacity: .85; }
  .hp-kare.gezdi::before { content: ""; position: absolute; inset: 34%; border-radius: 50%; background: rgba(255,210,63,.9); }
  .hp-kare.carpti { animation: hp-yanip .3s 4; }
  @keyframes hp-yanip { 50% { background: #ff8a80; } }
  .hp-ari { position: absolute; left: 8px; top: 8px; width: var(--k); height: var(--k); transition: transform .32s ease-in-out; pointer-events: none; z-index: 3; }
  .hp-ari svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 2px rgba(0,0,0,.2)); }
  .hp-secenekler { display: grid; gap: 12px; }
  .hp-prog { display: flex; align-items: center; gap: 6px; padding: 10px 14px; border: 0; border-radius: 20px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.12); cursor: pointer; min-height: calc(var(--p) + 20px); }
  .hp-prog .harf { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: #eef2f8; font-family: var(--f-baslik); font-weight: 800; color: #6b7690; flex: none; margin-right: 4px; }
  .hp-prog svg { width: var(--p); height: var(--p); flex: none; }
  .hp-prog:active { transform: translateY(3px); }
  .hp-prog.simdi { outline: 5px solid var(--sari); }
  .hp-prog.yanlis { opacity: .4; outline: 4px solid var(--kirmizi); }
  .hp-prog.dogru { outline: 5px solid var(--yesil); background: #e6f8ec; }
  .hp-prog:disabled { cursor: default; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("hp-stil")) { const st = document.createElement("style"); st.id = "hp-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="hp"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="hp-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".hp-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    let kareler = "";
    for (let y = 0; y < b.R; y++) for (let x = 0; x < b.C; x++) kareler += `<div class="hp-kare" data-r="${y}" data-c="${x}"></div>`;
    d.sahne.innerHTML = `
      <div class="hp-harita" style="--C:${b.C}">${kareler}<div class="hp-ari">${ari}</div></div>
      <div class="hp-secenekler" aria-label="Programlar">${b.programlar.map((p, j) => `<button class="hp-prog" type="button" data-j="${j}" aria-label="${String.fromCharCode(65 + j)} programı: ${[...p].map((k) => OK[k].ad).join(", ")}"><span class="harf">${String.fromCharCode(65 + j)}</span>${[...p].map(okSvg).join("")}</button>`).join("")}</div>`;
    d.harita = d.sahne.querySelector(".hp-harita");
    d.ariEl = d.sahne.querySelector(".hp-ari");
    d.sahne.querySelectorAll(".hp-prog").forEach((el) => (el.onclick = () => sec_(+el.dataset.j)));
    haritaCiz();
    boyutla();
  }
  const kareEl = (y, x) => d.harita.querySelector(`.hp-kare[data-r="${y}"][data-c="${x}"]`);
  function haritaCiz() {
    const b = BOLUMLER[d.idx];
    d.harita.querySelectorAll(".hp-kare").forEach((el) => { el.innerHTML = ""; el.classList.remove("iz", "gezdi", "carpti"); });
    b.engel.forEach(([y, x]) => (kareEl(y, x).innerHTML = tas));
    kareEl(...b.hedef).innerHTML = cicek;
    if (b.yolGoster) calis(b, [...b.dogru]).yol.slice(1, -1).forEach(([y, x]) => kareEl(y, x).classList.add("iz"));
    ariKoy(...b.bas, false);
  }
  function boyutla() {
    if (!d || !d.harita) return;
    const b = BOLUMLER[d.idx], enUzun = Math.max(...b.programlar.map((p) => p.length));
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H;
    d.sahne.classList.toggle("dikey", dikey);
    let p = Math.max(30, Math.min(56, Math.floor((dikey ? W - 80 : W * 0.5 - 90) / (enUzun * 1.15))));
    const secH = b.programlar.length * (p + 32);
    let k = dikey ? Math.min((W - 20) / b.C, (H - secH - 40) / b.R, 100) : Math.min((W * 0.45) / b.C, (H - 20) / b.R, 100);
    d.k = Math.max(34, Math.floor(k));
    d.sahne.style.setProperty("--k", d.k + "px");
    d.sahne.style.setProperty("--p", p + "px");
    ariKoy(...(d.yer || b.bas), false);
  }
  function ariKoy(y, x, anim = true) {
    d.yer = [y, x];
    d.ariEl.style.transition = anim ? "" : "none";
    d.ariEl.style.transform = `translate(${x * d.k}px, ${y * d.k}px)`;
    if (!anim) { void d.ariEl.offsetWidth; d.ariEl.style.transition = ""; }
  }

  async function sec_(j) {
    if (d.calisiyor) return;
    d.calisiyor = true;
    const benim = d.uid, b = BOLUMLER[d.idx], prog = b.programlar[j];
    const btn = d.sahne.querySelectorAll(".hp-prog")[j];
    btn.classList.add("simdi");
    d.api.ses.tik();
    const s = calis(b, [...prog]);
    for (let q = 1; q < s.yol.length; q++) {
      kareEl(...s.yol[q - 1]).classList.add("gezdi");
      ariKoy(...s.yol[q]);
      d.api.ses.adim(q % 8);
      await bekle(380);
      if (!d || benim !== d.uid) return;
    }
    if (s.carpti) {
      const k = prog[s.yol.length - 1], [y, x] = s.son, ny = y + YON[k][0], nx = x + YON[k][1];
      ariKoy(y + YON[k][0] * 0.3, x + YON[k][1] * 0.3);
      await bekle(220);
      if (!d || benim !== d.uid) return;
      ariKoy(y, x);
      const e = kareEl(ny, nx); if (e) e.classList.add("carpti");
    }
    btn.classList.remove("simdi");
    if (prog === b.dogru) {
      btn.classList.add("dogru");
      d.api.ses.yerlesti();
      await bekle(600);
      if (!d || benim !== d.uid) return;
      return bitir();
    }
    btn.classList.add("yanlis"); btn.disabled = true;
    d.api.ses.hata();
    await bekle(1200);
    if (!d || benim !== d.uid) return;
    haritaCiz();
    d.calisiyor = false;
  }
  function bitir() {
    d.calisiyor = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün programları okudun!" : "Son programı da buldun!") : "Doğru programı buldun!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.HANGI_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(25, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const b = BOLUMLER[d.idx], j = b.programlar.indexOf(b.dogru);
      return [{ el: d.sahne.querySelector(".hp-ari") }, { el: kareEl(...b.hedef) }, { el: d.sahne.querySelectorAll(".hp-prog")[j] }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${ari}<b style="font:800 1.4rem var(--f-baslik);color:#6b7690">?</b>${okSvg("r")}${okSvg("u")}</div>`; },
  });
})();
