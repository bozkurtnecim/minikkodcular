/* Döngü motoru: tekrar kutulu "programı tamamla" oyunları için ortak parça.
   Bölüm bir hedef dizi (ses ya da renk) ve bir program iskeleti verir:
   boş yerler ve içinde yer olan tekrar kutuları (iç içe olabilir). Çocuk yerlere jeton koyar,
   gerekirse kutunun sayısını ayarlar ve çalıştırır; açılan program hedefle aynıysa bölüm biter.
   Kullanan oyunlar: 23 Müzik Döngüsü, 25 Desen Fabrikası, 29 İç İçe Tekrar, 32 Hata Avcısı. */
(function () {
  const stil = `
  .dm { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .dm-sahne { --h: 56px; --p: 64px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 14px; padding: 8px 16px 16px; overflow-y: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .dm-hedef-kutu { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 24px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: 100%; box-sizing: border-box; }
  .dm-hedef { display: grid; grid-template-columns: repeat(var(--sutun), var(--h)); gap: 5px; }
  .dm-hucre { position: relative; width: var(--h); height: var(--h); border-radius: 12px; background: var(--zemin); display: grid; place-items: center; transition: transform .15s; }
  .dm-hucre > svg { width: 82%; height: 82%; opacity: .35; filter: grayscale(.3); transition: opacity .2s, filter .2s; }
  .dm-hucre.desen > svg { width: 100%; height: 100%; opacity: .28; }
  .dm-hucre.gizli > svg { opacity: 0; }
  .dm-hucre.gizli::after { content: "?"; position: absolute; font-family: var(--f-baslik); font-weight: 800; font-size: calc(var(--h) * .45); color: var(--cizgi); }
  .dm-hucre.cal > svg { opacity: 1; filter: none; }
  .dm-hucre.cal { transform: scale(1.1); }
  .dm-hucre.dogru { background: #d8f5e3; }
  .dm-hucre.dogru > svg { opacity: 1; filter: none; }
  .dm-hucre.dogru::after { content: none; }
  .dm-hucre.yanlis { background: #ffd9d6; outline: 4px solid var(--kirmizi); }
  .dm-hucre.yanlis > svg { opacity: 1; filter: none; }
  .dm-hucre .koy { position: absolute; inset: 0; display: grid; place-items: center; }
  .dm-hucre .koy svg { width: 82%; height: 82%; }
  .dm-hucre.desen .koy svg { width: 100%; height: 100%; }
  .dm-dinle { width: 60px; height: 60px; flex: none; border: 0; border-radius: 50%; background: var(--mor); color: #fff; display: grid; place-items: center; cursor: pointer; box-shadow: 0 5px 0 rgba(29,40,70,.2); }
  .dm-dinle svg { width: 32px; height: 32px; }
  .dm-dinle:disabled { background: #b9c6d6; }
  .dm-program { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px; padding: 12px; border-radius: 24px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); max-width: 100%; box-sizing: border-box; }
  .dm-yer { position: relative; width: var(--p); height: var(--p); border-radius: 16px; border: 3px dashed var(--cizgi); box-sizing: border-box; background: var(--zemin); display: grid; place-items: center; cursor: pointer; flex: none; }
  .dm-yer.dolu { border: 0; background: #fff; box-shadow: 0 4px 0 rgba(29,40,70,.14); }
  .dm-yer svg { width: 84%; height: 84%; pointer-events: none; }
  .dm-yer.desen svg { width: 100%; height: 100%; border-radius: 14px; }
  .dm-yer.siradaki { border-color: var(--mavi); background: #e3f0ff; }
  .dm-yer.hedefte { border-color: var(--mavi); background: #d4e8ff; outline: 4px solid var(--mavi); }
  .dm-yer.simdi { outline: 5px solid var(--sari); outline-offset: 2px; }
  .dm-yer.hata { animation: dm-salla .5s 2; outline: 5px solid var(--kirmizi); outline-offset: 2px; }
  .dm-dongu { display: flex; align-items: stretch; border-radius: 20px; background: #fff3cf; border: 4px solid #ffc23a; box-shadow: 0 4px 0 rgba(227,160,8,.3); }
  .dm-dongu > .bas { display: grid; place-items: center; align-content: center; gap: 2px; min-width: calc(var(--p) * .8); padding: 4px 6px; border-radius: 15px 0 0 15px; background: #ffc23a; color: #5a3d12; font-family: var(--f-baslik); font-weight: 800; }
  .dm-dongu > .bas svg { width: calc(var(--p) * .42); height: calc(var(--p) * .42); }
  .dm-dongu > .bas b { font-size: calc(var(--p) * .42); line-height: 1; }
  .dm-dongu > .bas i { display: flex; gap: 2px; } .dm-dongu > .bas i span { width: 7px; height: 7px; border-radius: 50%; background: #5a3d12; opacity: .8; }
  .dm-dongu > .bas.ayar { cursor: pointer; background: #ffb21a; }
  .dm-dongu > .bas.ayar::after { content: ""; width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 8px solid #5a3d12; opacity: .6; }
  .dm-dongu > .bas.hata { animation: dm-salla .5s 2; background: #ff8a80; }
  .dm-dongu > .bas.say { background: #ffe28a; }
  .dm-dongu > .ic { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px; }
  .dm-palet { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px; border-radius: 22px; background: rgba(255,255,255,.6); }
  .dm-jeton { width: var(--p); height: var(--p); padding: 0; border: 0; border-radius: 18px; background: #fff; box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; display: grid; place-items: center; }
  .dm-jeton svg { width: 84%; height: 84%; pointer-events: none; }
  .dm-jeton.desen svg { width: 100%; height: 100%; border-radius: 16px; }
  .dm-jeton:active { transform: translateY(3px); }
  .dm-alt { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; justify-content: center; }
  .dm-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .dm-calistir svg { width: 30px; height: 30px; }
  .dm-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  .dm-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08) rotate(-4deg); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); background: #fff; border-radius: 16px; display: grid; place-items: center; }
  .dm-tasinan svg { width: 84%; height: 84%; }
  .dm-onar { display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: #ffe28a; }
  .dm-onar svg { width: 24px; height: 24px; }
  @keyframes dm-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  `;

  const donguIkon = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 18 a32 32 0 1 1 -29 18" stroke="currentColor" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M8 22 L30 46 L38 16 Z" fill="currentColor"/></svg>`;
  const kulak = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><path d="M10 9a2 2 0 0 1 4 0"/></svg>`;
  const anahtar = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-4 4-2.3-2.3a4 4 0 0 0-5-5L4 17.4 6.6 20 2 20l0-4.6z" fill="#5d6878"/></svg>`;
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));

  // İskeleti (y = yer, d = tekrar kutusu) programa çevir; degerler varsa yerleri doldur.
  // Kutunun doğru sayısı n'dir; sabit değilse oyunda "bas" (yoksa 2) ile başlar.
  function programKur(yapi, degerler, cozumMu) {
    let k = 0;
    const kur = (dugumler) => dugumler.map((n) => {
      if (n.t === "y") { const v = degerler ? degerler[k] : null; k++; return { t: "y", v: v == null ? null : v }; }
      return { t: "d", n: cozumMu || n.sabit ? n.n : n.bas || 2, sabit: !!n.sabit, ic: kur(n.ic) };
    });
    return kur(yapi);
  }
  // Programı aç: { jeton, yer, kutular } listesi
  function ac(program, yol = []) {
    const out = [];
    for (const n of program) {
      if (n.t === "y") out.push({ v: n.v, yer: n, kutular: yol });
      else for (let i = 0; i < n.n; i++) out.push(...ac(n.ic, [...yol, { kutu: n, i }]));
    }
    return out;
  }
  const yerler = (program) => program.flatMap((n) => (n.t === "y" ? [n] : yerler(n.ic)));
  const kutular = (program) => program.flatMap((n) => (n.t === "d" ? [n, ...kutular(n.ic)] : []));

  function olustur(cfg) {
    const { no, kayit: KAYIT, bolumler: BOLUMLER, jetonlar: J } = cfg;
    let d = null;
    const desen = cfg.cikti === "desen";
    const jSvg = (id) => J[id].svg;

    function baslat(alan, api) {
      if (!document.getElementById("dm-stil")) {
        const st = document.createElement("style"); st.id = "dm-stil"; st.textContent = stil; document.head.appendChild(st);
      }
      const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
      alan.innerHTML = `<div class="dm"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="dm-sahne"></div></div>`;
      if (cfg.arkaPlan) alan.querySelector(".dm").style.background = cfg.arkaPlan;
      api.araclar.innerHTML = "";
      d = { alan, api, ilerleme, sahne: alan.querySelector(".dm-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
      d.idx = i; d.uid++; d.calisiyor = false; d.dinlendi = false;
      d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
      navCiz();
      d.program = programKur(b.yapi, b.hazir);
      const sut = b.sutun || Math.min(b.hedef.length, 12);
      d.sahne.innerHTML = `
        <div class="dm-hedef-kutu">${b.hazir ? `<span class="dm-onar" title="Bozuk programı onar">${anahtar}</span>` : ""}
          <div class="dm-hedef" style="--sutun:${sut}">${b.hedef.map((t, j) => `<div class="dm-hucre${desen ? " desen" : ""}${b.gizli ? " gizli" : ""}" data-j="${j}">${jSvg(t)}</div>`).join("")}</div>
          ${desen ? "" : `<button class="dm-dinle" type="button" aria-label="Şarkıyı dinle">${kulak}</button>`}
        </div>
        <div class="dm-program" aria-label="Program"></div>
        <div class="dm-alt">
          <div class="dm-palet" aria-label="Jetonlar">${b.palet.map((t) => `<button class="dm-jeton${desen ? " desen" : ""}" type="button" data-t="${t}" aria-label="${J[t].ad}">${jSvg(t)}</button>`).join("")}</div>
          <button class="dm-calistir" type="button" disabled>${d.api.IKON.oynat}<span>${desen ? "Çalıştır" : "Çal"}</span></button>
        </div>`;
      d.hedefEl = d.sahne.querySelector(".dm-hedef");
      d.programEl = d.sahne.querySelector(".dm-program");
      d.dugme = d.sahne.querySelector(".dm-calistir");
      d.dugme.onclick = calistir;
      const dinle = d.sahne.querySelector(".dm-dinle");
      if (dinle) dinle.onclick = () => hedefiCal();
      d.sahne.querySelectorAll(".dm-jeton").forEach(jetonTasi);
      programCiz();
      boyutla();
      // Gizli şarkıda önce dinlet
      if (b.gizli && !desen) { const benim = d.uid; setTimeout(() => { if (d && d.uid === benim) hedefiCal(); }, 900); }
    }

    function programCiz() {
      const b = BOLUMLER[d.idx];
      const ciz = (dugumler) => dugumler.map((n) => {
        if (n.t === "y") return `<div class="dm-yer${n.v ? " dolu" : ""}${desen ? " desen" : ""}" role="button" tabindex="0" aria-label="Yer">${n.v ? jSvg(n.v) : ""}</div>`;
        const ayar = !n.sabit;
        return `<div class="dm-dongu"><div class="bas${ayar ? " ayar" : ""}" role="${ayar ? "button" : "presentation"}" aria-label="${n.n} kere tekrarla">${donguIkon}<b>${n.n}</b><i>${"<span></span>".repeat(n.n)}</i></div><div class="ic">${ciz(n.ic)}</div></div>`;
      }).join("");
      d.programEl.innerHTML = ciz(d.program);
      // DOM öğelerini düğümlere bağla
      const yerEl = [...d.programEl.querySelectorAll(".dm-yer")], kutuEl = [...d.programEl.querySelectorAll(".dm-dongu > .bas")];
      yerler(d.program).forEach((n, k) => { n.el = yerEl[k]; n.el.onclick = () => { if (d.calisiyor || !n.v) return; n.v = null; programCiz(); d.api.ses.tik(); }; });
      kutular(d.program).forEach((n, k) => {
        n.el = kutuEl[k];
        if (!n.sabit) n.el.onclick = () => { if (d.calisiyor) return; n.n = n.n >= (b.enCok || 5) ? 2 : n.n + 1; programCiz(); d.api.ses.ton(392 + n.n * 60, 0.15); };
      });
      const siradaki = yerler(d.program).find((n) => !n.v);
      if (siradaki) siradaki.el.classList.add("siradaki");
      d.dugme.disabled = d.calisiyor || yerler(d.program).some((n) => !n.v);
    }

    function boyutla() {
      if (!d || !d.hedefEl) return;
      const b = BOLUMLER[d.idx];
      const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
      if (W < 50 || H < 50) return;
      // Şerit dar ekrana sığmıyorsa iki-üç satıra bölünür
      let sut = b.sutun || Math.min(b.hedef.length, 12);
      if (!b.sutun) for (const bol of [2, 3]) if ((W - 110) / sut - 5 < 38) sut = Math.ceil(b.hedef.length / bol);
      d.hedefEl.style.setProperty("--sutun", sut);
      const sat = Math.ceil(b.hedef.length / sut);
      let h = Math.floor(Math.min((W - (desen ? 40 : 110) - (b.hazir ? 56 : 0)) / sut - 5, (H * 0.36) / sat - 5, desen ? 70 : 64));
      d.sahne.style.setProperty("--h", Math.max(26, h) + "px");
      let p = Math.max(44, Math.min(78, Math.floor(Math.min(W / 7.5, H / 6.2))));
      d.sahne.style.setProperty("--p", p + "px");
      for (let n = 0; n < 30 && d.sahne.scrollHeight > d.sahne.clientHeight + 2 && (p > 40 || h > 24); n++) {
        if (p > 40) { p -= 3; d.sahne.style.setProperty("--p", p + "px"); }
        if (h > 24) { h -= 2; d.sahne.style.setProperty("--h", h + "px"); }
      }
    }

    // Jeton: dokununca sıradaki boş yere, sürükleyince bırakılan yere
    function koy(t, hedefYer) {
      if (d.calisiyor) return;
      const n = hedefYer || yerler(d.program).find((x) => !x.v);
      if (!n) return;
      n.v = t;
      programCiz();
      if (!desen && J[t].cal) J[t].cal(d.api); else d.api.ses.tik();
    }
    function jetonTasi(btn) {
      let bx, by, aktif = false, ucan = null, hedef = null;
      const t = btn.dataset.t;
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
          ucan.className = "dm-tasinan";
          const r = btn.getBoundingClientRect();
          ucan.style.width = ucan.style.height = r.width + "px";
          ucan.innerHTML = jSvg(t);
          document.body.appendChild(ucan);
        }
        ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
        const alt = document.elementFromPoint(e.clientX, e.clientY);
        const yer = alt && alt.closest(".dm-yer");
        if (hedef && hedef !== yer) hedef.classList.remove("hedefte");
        hedef = yer || null; if (hedef) hedef.classList.add("hedefte");
      });
      const birak = () => {
        if (!aktif) return;
        aktif = false;
        if (ucan) {
          ucan.remove(); ucan = null;
          if (hedef) { hedef.classList.remove("hedefte"); koy(t, yerler(d.program).find((n) => n.el === hedef)); }
          hedef = null;
        } else koy(t);
      };
      btn.addEventListener("pointerup", birak);
      btn.addEventListener("pointercancel", birak);
    }

    const hucreler = () => [...d.hedefEl.querySelectorAll(".dm-hucre")];

    async function hedefiCal() {
      if (d.calisiyor) return;
      d.calisiyor = true; programCiz();
      const benim = d.uid, b = BOLUMLER[d.idx], hc = hucreler();
      const dinle = d.sahne.querySelector(".dm-dinle"); if (dinle) dinle.disabled = true;
      for (let j = 0; j < b.hedef.length; j++) {
        hc[j].classList.add("cal");
        if (J[b.hedef[j]].cal) J[b.hedef[j]].cal(d.api);
        await bekle(cfg.hiz || 420);
        if (!d || benim !== d.uid) return;
        hc[j].classList.remove("cal");
      }
      if (dinle) dinle.disabled = false;
      d.calisiyor = false; programCiz();
    }

    async function calistir() {
      if (d.calisiyor) return;
      d.calisiyor = true; programCiz();
      const benim = d.uid, b = BOLUMLER[d.idx], hc = hucreler();
      hc.forEach((h) => { h.classList.remove("dogru", "yanlis"); const k = h.querySelector(".koy"); if (k) k.remove(); });
      const akis = ac(d.program);
      let hata = -1;
      for (let j = 0; j < akis.length; j++) {
        const a = akis[j];
        yerler(d.program).forEach((n) => n.el.classList.toggle("simdi", n === a.yer));
        kutular(d.program).forEach((k) => {
          const bu = a.kutular.find((x) => x.kutu === k);
          k.el.classList.toggle("say", !!bu);
          k.el.querySelectorAll("i span").forEach((s, q) => (s.style.opacity = bu ? (q <= bu.i ? 1 : 0.25) : 0.8));
        });
        if (j >= b.hedef.length) { hata = j; break; }
        const h = hc[j];
        if (desen) { h.insertAdjacentHTML("beforeend", `<div class="koy">${jSvg(a.v)}</div>`); d.api.ses.adim(j % 8); }
        else if (J[a.v].cal) J[a.v].cal(d.api);
        if (a.v === b.hedef[j]) h.classList.add("dogru");
        else { h.classList.add("yanlis"); hata = j; await bekle(200); break; }
        await bekle(cfg.hiz || 420);
        if (!d || benim !== d.uid) return;
      }
      yerler(d.program).forEach((n) => n.el.classList.remove("simdi"));
      kutular(d.program).forEach((k) => k.el.classList.remove("say"));
      if (hata < 0 && akis.length < b.hedef.length) hata = akis.length;
      if (hata < 0) { await bekle(400); if (!d || benim !== d.uid) return; return bitir(); }
      // Eksik ya da fazla: kalan hedef hücreleri kırmızı yanar
      if (hata >= akis.length) hc.slice(akis.length).forEach((h) => h.classList.add("yanlis"));
      const a = akis[Math.min(hata, akis.length - 1)];
      if (a) { if (hata < akis.length && hata < b.hedef.length) a.yer.el.classList.add("hata"); else a.kutular.forEach((k) => k.kutu.el.classList.add("hata")); }
      d.api.ses.hata();
      await bekle(1600);
      if (!d || benim !== d.uid) return;
      hc.forEach((h) => { h.classList.remove("dogru", "yanlis"); const k = h.querySelector(".koy"); if (k) k.remove(); });
      // Yanlışta program baştaki hâline döner (bozuk programlı bölümlerde bozuk hâline), çocuk baştan dener
      d.program = programKur(b.yapi, b.hazir);
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
      d.api.kutla(d.sahne, {
        mesaj: son ? (herkes ? cfg.mesajHepsi : cfg.mesajSon) : cfg.mesaj,
        son,
        ileri: () => yukle(d.idx + 1),
        bastan: () => { d.ilerleme.bitti = []; yukle(0); },
      });
    }

    // Test ve el gösterimi için: bölümün doğru doldurulmuş hâli
    function cozum(b) {
      const dolu = programKur(b.yapi, b.cozum, true);
      return { yerler: yerler(dolu).map((n) => n.v), kutular: kutular(dolu).map((n) => n.n) };
    }

    window.Uygulama.oyunEkle(no, {
      baslat,
      bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
      ipucu() {
        if (!d || !d.program) return [];
        const b = BOLUMLER[d.idx], c = cozum(b), ys = yerler(d.program);
        const j = ys.findIndex((n, k) => n.v !== c.yerler[k]);
        if (j < 0) return [{ el: d.dugme }];
        const adim = [{ el: d.sahne.querySelector(`.dm-jeton[data-t="${c.yerler[j]}"]`), hedef: ys[j].el }];
        const kutu = kutular(d.program).find((k, q) => !k.sabit && k.n !== c.kutular[q]);
        if (kutu) adim.push({ el: kutu.el, kez: 1 });
        return [...(b.gizli || !desen ? [{ el: d.sahne.querySelector(".dm-dinle") }] : []), ...adim, { el: d.dugme }];
      },
      ilerleme() {
        let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
        return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
      },
      kapak: cfg.kapak,
      // test için
      _bolumler: BOLUMLER, _cozum: cozum,
    });
    window["DM_" + no] = { BOLUMLER, cozum, durum: () => d };
  }

  // Bölüm yardımcıları ------------------------------------------------
  // İskeletten hedef diziyi üret (cozum = yerlere sırayla konacak jetonlar)
  function hedefUret(yapi, cozumDizi) {
    const p = programKur(yapi, cozumDizi, true);
    return ac(p).map((a) => a.v);
  }
  // Basit rastgele (tohumlu): bölümler her açılışta aynı olsun
  function tohum(s) { return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

  window.DonguMotoru = { olustur, hedefUret, tohum, donguIkon };
})();
