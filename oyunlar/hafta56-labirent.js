/* Labirent (problem çözme: yol bulma).
   Tavşanı havuca götür. Parmağını tavşandan başlatıp yol boyunca kaydır ya da tavşanın yanındaki kareye dokun.
   Duvarlardan geçilmez. İlk bölümlerde doğru yol noktalarla gösterilir. Labirent büyür; son bölümlerde yolda
   kilitli bir kapı vardır: önce anahtarı al, sonra kapı açılır.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "labirent";
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const YON = { K: [-1, 0, "G"], D: [0, 1, "B"], G: [1, 0, "K"], B: [0, -1, "D"] }; // kuzey, doğu, güney, batı
  // [satır, sütun, kapı-anahtar, yol izi]
  const T = [
    [2, 3, 0, 1], [3, 3, 0, 1], [3, 3, 0, 0],
    [3, 4, 0, 0], [4, 4, 0, 0], [4, 4, 0, 0],
    [4, 5, 0, 0], [5, 5, 0, 0], [5, 5, 0, 0], [5, 6, 0, 0], [5, 6, 0, 0], [6, 6, 0, 0],
    [4, 5, 1, 0], [5, 5, 1, 0], [6, 6, 0, 0], [5, 6, 1, 0], [6, 7, 0, 0], [6, 6, 1, 0],
    [6, 7, 1, 0], [7, 7, 0, 0], [7, 7, 1, 0], [7, 8, 0, 0], [6, 8, 1, 0], [7, 8, 1, 0],
    [8, 8, 0, 0], [8, 8, 1, 0], [8, 8, 1, 0], [8, 9, 1, 0], [8, 9, 1, 0], [9, 9, 1, 0],
  ];
  const anahtar = (r, c) => r + "," + c;
  function enKisa(acik, R, C, a, b, kapali) {
    const onceki = { [anahtar(...a)]: null }, q = [a];
    while (q.length) {
      const [r, c] = q.shift();
      if (r === b[0] && c === b[1]) break;
      for (const y of acik[r][c]) {
        const nr = r + YON[y][0], nc = c + YON[y][1], k = anahtar(nr, nc);
        if (k in onceki || (kapali && kapali === k)) continue;
        onceki[k] = [r, c]; q.push([nr, nc]);
      }
    }
    if (!(anahtar(...b) in onceki)) return null;
    const yol = []; let p = b;
    while (p) { yol.unshift(p); p = onceki[anahtar(...p)]; }
    return yol;
  }
  function uret([R, C, kapiVar, iz], i) {
    for (let deneme = 0; ; deneme++) {
      const r = tohumlu(5600 + i * 61 + deneme * 7919);
      const acik = Array.from({ length: R }, () => Array.from({ length: C }, () => new Set()));
      const gor = new Set([anahtar(0, 0)]), yigin = [[0, 0]];
      while (yigin.length) {
        const [cr, cc] = yigin[yigin.length - 1];
        const komsu = Object.keys(YON).filter((y) => { const nr = cr + YON[y][0], nc = cc + YON[y][1]; return nr >= 0 && nr < R && nc >= 0 && nc < C && !gor.has(anahtar(nr, nc)); });
        if (!komsu.length) { yigin.pop(); continue; }
        const y = komsu[Math.floor(r() * komsu.length)], nr = cr + YON[y][0], nc = cc + YON[y][1];
        acik[cr][cc].add(y); acik[nr][nc].add(YON[y][2]); gor.add(anahtar(nr, nc)); yigin.push([nr, nc]);
      }
      // Başlangıç bir köşe, havuç en uzak kare
      const bas = [[0, 0], [0, C - 1], [R - 1, 0], [R - 1, C - 1]][Math.floor(r() * 4)];
      let hedef = bas, enUzun = 0;
      for (let a = 0; a < R; a++) for (let b = 0; b < C; b++) { const y = enKisa(acik, R, C, bas, [a, b]); if (y.length > enUzun) { enUzun = y.length; hedef = [a, b]; } }
      const yol = enKisa(acik, R, C, bas, hedef);
      let kapi = null, anahtarYer = null;
      if (kapiVar) {
        kapi = yol[Math.floor(yol.length * 0.6)];
        const yolda = new Set(yol.map((p) => anahtar(...p)));
        let enIyi = 0;
        for (let a = 0; a < R; a++) for (let b = 0; b < C; b++) {
          if (yolda.has(anahtar(a, b))) continue;
          const y = enKisa(acik, R, C, bas, [a, b], anahtar(...kapi));
          if (y && y.length > enIyi) { enIyi = y.length; anahtarYer = [a, b]; }
        }
        if (!anahtarYer) continue;
      }
      // Çözüm: (anahtar varsa önce anahtara) sonra havuca
      const cozum = kapiVar ? [...enKisa(acik, R, C, bas, anahtarYer, anahtar(...kapi)), ...enKisa(acik, R, C, anahtarYer, hedef).slice(1)] : yol;
      return { R, C, acik: acik.map((s) => s.map((x) => [...x].join(""))), bas, hedef, kapi, anahtar: anahtarYer, iz: !!iz, yol, cozum, grup: Uygulama.seviye(i) };
    }
  }
  const BOLUMLER = T.map(uret);

  const resim = (id) => (window.NESNELER && NESNELER[id] ? `<img src="${NESNELER[id].src}" alt="">` : "");
  const anahtarSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="32" cy="50" r="20" fill="none" stroke="#e3a008" stroke-width="11"/><path d="M50 50 H88 M74 50 V66 M86 50 V62" stroke="#e3a008" stroke-width="11" stroke-linecap="round"/></svg>`;
  const kapiSvg = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="10" y="10" width="80" height="80" rx="10" fill="#a8743f"/><path d="M30 12 V88 M50 12 V88 M70 12 V88" stroke="#7a5230" stroke-width="7"/><rect x="38" y="42" width="24" height="22" rx="5" fill="#e3a008"/><circle cx="50" cy="52" r="4" fill="#7a5230"/></svg>`;

  const stil = `
  .lb { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eaf7e4, #d9efcf); }
  .lb-sahne { --k: 60px; position: relative; flex: 1; min-height: 0; display: grid; place-items: center; padding: 8px 16px 16px; overflow: hidden; user-select: none; -webkit-user-select: none; touch-action: none; }
  .lb-tahta { position: relative; display: grid; grid-template-columns: repeat(var(--C), var(--k)); grid-auto-rows: var(--k); padding: 8px; border-radius: 20px; background: #8fd36a; box-shadow: 0 8px 0 rgba(29,40,70,.12); touch-action: none; }
  .lb-kare { --d: max(3px, calc(var(--k) * .07)); position: relative; box-sizing: border-box; background: #c9edb0; }
  .lb-kare.K { border-top: var(--d) solid #3c7a2c; } .lb-kare.D { border-right: var(--d) solid #3c7a2c; } .lb-kare.G { border-bottom: var(--d) solid #3c7a2c; } .lb-kare.B { border-left: var(--d) solid #3c7a2c; }
  .lb-kare > img, .lb-kare > svg { position: absolute; inset: 14%; width: 72%; height: 72%; pointer-events: none; }
  .lb-kare.yol::after { content: ""; position: absolute; left: 43%; top: 43%; width: 14%; height: 14%; border-radius: 50%; background: rgba(255,255,255,.9); box-shadow: 0 0 0 2px rgba(60,122,44,.3); }
  .lb-kare.iz { background: #ffe9a8; }
  .lb-kare.kapi.acik > svg { opacity: .2; transition: opacity .4s; }
  .lb-kare.anahtar.alindi > svg { transform: scale(1.6) translateY(-20%); opacity: 0; transition: all .4s; }
  .lb-tavsan { position: absolute; left: 8px; top: 8px; width: var(--k); height: var(--k); pointer-events: none; transition: transform .16s ease-out; z-index: 2; }
  .lb-tavsan img { position: absolute; inset: 6%; width: 88%; height: 88%; filter: drop-shadow(0 3px 2px rgba(0,0,0,.25)); }
  .lb-tavsan .lb-cep { position: absolute; right: -6%; top: -8%; width: 42%; height: 42%; display: none; }
  .lb-tavsan.anahtarli .lb-cep { display: block; }
  .lb-tavsan.carpti img { animation: lb-salla .35s; }
  @keyframes lb-salla { 25%, 75% { transform: translateX(-12%); } 50% { transform: translateX(12%); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("lb-stil")) { const st = document.createElement("style"); st.id = "lb-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="lb"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="lb-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".lb-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.yer = [...b.bas]; d.anahtarli = !b.kapi;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const yolda = new Set(b.iz ? b.yol.map((p) => anahtar(...p)) : []);
    let h = "";
    for (let r = 0; r < b.R; r++) for (let c = 0; c < b.C; c++) {
      const duvar = ["K", "D", "G", "B"].filter((y) => !b.acik[r][c].includes(y)).join(" ");
      const k = anahtar(r, c), sinif = [duvar, yolda.has(k) ? "yol" : ""];
      let ic = "";
      if (r === b.hedef[0] && c === b.hedef[1]) ic = resim("havuc");
      else if (b.kapi && k === anahtar(...b.kapi)) { ic = kapiSvg; sinif.push("kapi"); }
      else if (b.anahtar && k === anahtar(...b.anahtar)) { ic = anahtarSvg; sinif.push("anahtar"); }
      h += `<div class="lb-kare ${sinif.join(" ")}" data-r="${r}" data-c="${c}">${ic}</div>`;
    }
    d.sahne.innerHTML = `<div class="lb-tahta" style="--C:${b.C}">${h}<div class="lb-tavsan">${resim("tavsan")}<div class="lb-cep">${anahtarSvg}</div></div></div>`;
    d.tahta = d.sahne.querySelector(".lb-tahta"); d.tavsan = d.sahne.querySelector(".lb-tavsan");
    kareEl(...d.yer).classList.add("iz");
    // Dokunma ve sürükleme: parmağın altındaki kare tavşanın komşusuysa tavşan oraya gider
    let surukle = false;
    d.tahta.onpointerdown = (e) => { if (d.mesgul) return; e.preventDefault(); surukle = true; try { d.tahta.setPointerCapture(e.pointerId); } catch (er) {} dokun(e, true); };
    d.tahta.onpointermove = (e) => { if (surukle) dokun(e, false); };
    d.tahta.onpointerup = d.tahta.onpointercancel = () => { surukle = false; };
    boyutla();
  }
  const kareEl = (r, c) => d.tahta.querySelector(`.lb-kare[data-r="${r}"][data-c="${c}"]`);
  function boyutla() {
    if (!d || !d.tahta) return;
    const b = BOLUMLER[d.idx], W = d.sahne.clientWidth - 48, H = d.sahne.clientHeight - 40;
    if (W < 50 || H < 50) return;
    d.k = Math.max(30, Math.floor(Math.min(W / b.C, H / b.R, 96)));
    d.sahne.style.setProperty("--k", d.k + "px");
    tavsanKoy(false);
  }
  function tavsanKoy(anim = true) {
    d.tavsan.style.transition = anim ? "" : "none";
    d.tavsan.style.transform = `translate(${d.yer[1] * d.k}px, ${d.yer[0] * d.k}px)`;
    d.tavsan.classList.toggle("anahtarli", !!BOLUMLER[d.idx].kapi && d.anahtarli);
    if (!anim) { void d.tavsan.offsetWidth; d.tavsan.style.transition = ""; }
  }
  function carp() { d.tavsan.classList.remove("carpti"); void d.tavsan.offsetWidth; d.tavsan.classList.add("carpti"); d.api.ses.hata(); }
  function dokun(e, ilk) {
    if (d.mesgul) return;
    const el = document.elementFromPoint(e.clientX, e.clientY), kare = el && el.closest(".lb-kare");
    if (!kare) return;
    const r = +kare.dataset.r, c = +kare.dataset.c, [yr, yc] = d.yer;
    if (r === yr && c === yc) return;
    const y = Object.keys(YON).find((k) => yr + YON[k][0] === r && yc + YON[k][1] === c);
    // Yalnız dokunuşta (sürüklemede değil) uzak kareye ya da duvara çarpınca uyar
    if (!y) { if (ilk) carp(); return; }
    git(y, ilk);
  }
  async function git(y, uyar = true) {
    const b = BOLUMLER[d.idx], [yr, yc] = d.yer;
    if (!b.acik[yr][yc].includes(y)) { if (uyar) carp(); return false; }
    const nr = yr + YON[y][0], nc = yc + YON[y][1];
    if (b.kapi && !d.anahtarli && nr === b.kapi[0] && nc === b.kapi[1]) { carp(); return false; }
    d.yer = [nr, nc]; kareEl(nr, nc).classList.add("iz"); d.api.ses.adim(((nr + nc) % 8 + 8) % 8);
    if (b.anahtar && !d.anahtarli && nr === b.anahtar[0] && nc === b.anahtar[1]) {
      d.anahtarli = true; kareEl(nr, nc).classList.add("alindi"); kareEl(...b.kapi).classList.add("acik"); d.api.ses.yerlesti();
    }
    tavsanKoy();
    if (nr === b.hedef[0] && nc === b.hedef[1]) {
      d.mesgul = true; const benim = d.uid;
      d.api.ses.yerlesti(); await bekle(500); if (!d || benim !== d.uid) return true;
      bitir();
    }
    return true;
  }
  function bitir() {
    d.mesgul = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Labirent ustası oldun!" : "En büyük labirenti de geçtin!") : "Tavşan havuca ulaştı!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.LABIRENT_BOLUMLER = BOLUMLER;
  window.LABIRENT_DURUM = () => d && { yer: d.yer, anahtarli: d.anahtarli };

  window.Uygulama.oyunEkle(56, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const b = BOLUMLER[d.idx];
      const hedef = b.kapi && !d.anahtarli ? b.anahtar : b.hedef;
      const yol = enKisa(b.acik.map((s) => s.map((x) => new Set(x))), b.R, b.C, d.yer, hedef, b.kapi && !d.anahtarli ? anahtar(...b.kapi) : null) || [];
      return yol.slice(1, tam ? undefined : 3).map((p) => ({ el: kareEl(...p) }));
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="0 0 100 100"><rect width="100" height="100" rx="14" fill="#c9edb0"/><path d="M8 8 H92 V92 H8 Z M30 8 V54 M30 74 V92 M52 30 V92 M52 30 H74 M74 30 V74 M8 30 H18 M74 74 H92" stroke="#3c7a2c" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="19" cy="84" r="7" fill="#ff8a1f"/><circle cx="84" cy="18" r="7" fill="#fff" stroke="#8a6a4a" stroke-width="3"/></svg></div>`;
    },
  });
})();
