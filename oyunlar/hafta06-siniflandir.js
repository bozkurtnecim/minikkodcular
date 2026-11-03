/* 6. Hafta: Sınıflandır (koşul: "kırmızıysa bu sepete").
   Nesneleri doğru sepete koy. 20 bölüm:
   1–5 iki renk, 6–10 iki grup (meyve, hayvan…), 11–15 üç sepet, 16–20 üç sepet ve daha çok nesne. */
(function () {
  const KAYIT = "siniflandir";

  // Sürüklenen öğenin yerini korur; yoksa liste kısalır ve hedefler kayar
  function yerTut(el) {
    const r = el.getBoundingClientRect();
    const t = document.createElement("div");
    t.style.cssText = `width:${r.width}px;height:${r.height}px;flex:none;visibility:hidden`;
    el.before(t);
    el._yerTutucu = t;
  }
  function yerBirak(el) { if (el._yerTutucu) { el._yerTutucu.remove(); el._yerTutucu = null; } }


  // [tür, sepetler, sepet başına nesne]
  const BOLUMLER = [
    ["renk", ["kirmizi", "mavi"], 3], ["renk", ["sari", "yesil"], 3], ["renk", ["mor", "turuncu"], 3],
    ["renk", ["kirmizi", "sari"], 4], ["renk", ["mavi", "turuncu"], 4], ["renk", ["pembe", "yesil"], 4],
    ["kat", ["meyve", "hayvan"], 3], ["kat", ["oyuncak", "giysi"], 3], ["kat", ["tasit", "meyve"], 4], ["kat", ["hayvan", "tasit"], 4], ["kat", ["sebze", "meyve"], 4], ["kat", ["giysi", "hayvan"], 4],
    ["renk", ["kirmizi", "mavi", "sari"], 3], ["kat", ["meyve", "hayvan", "tasit"], 3], ["kat", ["oyuncak", "giysi", "sebze"], 3], ["renk", ["yesil", "mor", "turuncu"], 3], ["kat", ["hayvan", "giysi", "meyve"], 3], ["kat", ["tasit", "sebze", "oyuncak"], 3],
    ["kat", ["meyve", "sebze", "hayvan"], 4], ["kat", ["tasit", "oyuncak", "giysi"], 4], ["renk", ["kirmizi", "mavi", "sari"], 4], ["kat", ["meyve", "tasit", "giysi"], 4],
    ["kat", ["hayvan", "oyuncak", "sebze"], 4], ["renk", ["yesil", "mor", "turuncu"], 4], ["renk", ["pembe", "mavi", "sari"], 4], ["kat", ["sebze", "giysi", "tasit"], 4],
    ["kat", ["oyuncak", "meyve", "hayvan"], 4], ["renk", ["kirmizi", "yesil", "mor"], 4], ["kat", ["meyve", "sebze", "oyuncak"], 4], ["kat", ["hayvan", "tasit", "giysi"], 4],
  ].map(([tur, sepetler, adet], i) => ({ tur, sepetler, adet, grup: Uygulama.seviye(i) }));

  const karistir = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

  // Bölümün nesnelerini üret: { src, ad, sepet }
  function nesneleriUret(b) {
    const liste = [];
    b.sepetler.forEach((s) => {
      if (b.tur === "renk") {
        karistir(RENKLI_SEKILLER).slice(0, b.adet).forEach((sk) => liste.push({ src: renkliNesne(sk, s), ad: `${RENK_ADLARI[s].ad} ${sk}`, sepet: s }));
      } else {
        karistir(Object.values(NESNELER).filter((n) => n.kat === s)).slice(0, b.adet).forEach((n) => liste.push({ src: n.src, ad: n.ad, sepet: s }));
      }
    });
    return karistir(liste);
  }

  const stil = `
  .sn { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--turuncu); }
  .sn-sahne { --k: 100px; --ara: 14px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 8px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .sn-baslik { margin: 0; font-family: var(--f-baslik); font-weight: 800; font-size: clamp(1.25rem, 3.2vw, 1.8rem); line-height: 1; text-align: center; }
  .sn-masa { display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: var(--ara); padding: 14px; border-radius: 26px; border: 3px dashed var(--cizgi); background: var(--zemin-2); min-height: calc(var(--k) + 28px); max-width: 100%; box-sizing: border-box; }
  .sn-masa:empty::before { content: "Hepsi sepette!"; align-self: center; color: var(--murekkep-2); font-weight: 800; opacity: .6; }
  .sn-nesne { width: var(--k); height: var(--k); flex: none; border-radius: 20px; background: var(--kagit); box-shadow: 0 5px 0 rgba(29,40,70,.14); display: grid; place-items: center; cursor: grab; touch-action: none; transition: transform .15s; }
  .sn-nesne img { width: 80%; height: 80%; pointer-events: none; -webkit-user-drag: none; }
  .sn-nesne.secili { transform: translateY(-8px) scale(1.06); outline: 5px solid var(--mavi); outline-offset: 2px; }
  .sn-nesne.surukleniyor { position: fixed; z-index: 50; cursor: grabbing; transform: scale(1.08) rotate(-4deg); pointer-events: none; transition: none; box-shadow: 0 14px 18px rgba(29,40,70,.28); }
  .sn-nesne.salla { animation: sn-salla .45s; }
  .sn-sepetler { display: flex; justify-content: center; gap: calc(var(--ara) * 1.6); width: 100%; }
  .sn-sepet { --c: #c4935f; position: relative; flex: 1 1 0; max-width: 300px; min-width: 0; display: grid; grid-template-rows: auto 1fr; border: 0; padding: 0; background: none; cursor: pointer; font: inherit; color: inherit; transition: transform .15s; }
  .sn-etiket { justify-self: center; display: flex; align-items: center; gap: 8px; padding: 6px 14px 6px 6px; margin-bottom: -14px; z-index: 2; border-radius: 999px; background: var(--kagit); box-shadow: 0 4px 0 rgba(29,40,70,.12); font-family: var(--f-baslik); font-weight: 800; font-size: 1.05rem; white-space: nowrap; }
  .sn-etiket img, .sn-etiket i { width: calc(var(--k) * .5); height: calc(var(--k) * .5); min-width: 34px; min-height: 34px; display: block; }
  .sn-etiket i { border-radius: 50%; background: var(--c); box-shadow: inset 0 -4px 0 rgba(0,0,0,.15); }
  .sn-govde { min-height: calc(var(--k) * 1.15); padding: 22px 10px 12px; border-radius: 14px 14px 30px 30px; background: repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 6px, transparent 6px 14px), repeating-linear-gradient(0deg, rgba(255,255,255,.12) 0 6px, transparent 6px 14px), var(--c); box-shadow: inset 0 8px 0 rgba(0,0,0,.12), 0 7px 0 rgba(29,40,70,.14); display: flex; flex-wrap: wrap; align-content: flex-start; justify-content: center; gap: 4px; }
  .sn-govde img { width: calc(var(--k) * .48); height: calc(var(--k) * .48); filter: drop-shadow(0 2px 0 rgba(0,0,0,.2)); animation: sn-dus .35s cubic-bezier(.3,1.6,.5,1); }
  .sn-sepet.hedef { transform: scale(1.05); }
  .sn-sepet.hedef .sn-govde { outline: 5px solid var(--mavi); outline-offset: 3px; }
  .sn-sepet.salla { animation: sn-salla .45s; }
  @keyframes sn-salla { 20%, 60% { transform: translateX(-9px); } 40%, 80% { transform: translateX(9px); } }
  @keyframes sn-dus { from { transform: translateY(-30px) scale(1.3); opacity: 0; } }
  `;

  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("sn-stil")) {
      const st = document.createElement("style"); st.id = "sn-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="sn"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="sn-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".sn-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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

  function sepetEtiketi(b, s) {
    if (b.tur === "renk") return { ad: RENK_ADLARI[s].ad, ikon: `<i></i>`, renk: RENK_ADLARI[s].c };
    const k = KATEGORILER[s];
    return { ad: k.ad, ikon: `<img src="${NESNELER[k.ikon].src}" alt="">`, renk: null };
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.secili = null;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.nesneler = nesneleriUret(b);
    const sepetRenk = ["#c4935f", "#b5855a", "#a8774a"];
    d.sahne.innerHTML = `
      <h2 class="sn-baslik">${b.tur === "renk" ? "Her şeyi kendi renginin sepetine koy" : "Her şeyi doğru sepete koy"}</h2>
      <div class="sn-masa" aria-label="Nesneler">${d.nesneler.map((n, j) => `<div class="sn-nesne" data-j="${j}" role="button" tabindex="0" aria-label="${n.ad}"><img src="${n.src}" alt=""></div>`).join("")}</div>
      <div class="sn-sepetler">${b.sepetler.map((s, j) => {
        const e = sepetEtiketi(b, s);
        return `<button class="sn-sepet" type="button" data-sepet="${s}" style="--c:${e.renk || sepetRenk[j]}" aria-label="${e.ad} sepeti"><span class="sn-etiket">${e.ikon}<span>${e.ad}</span></span><span class="sn-govde"></span></button>`;
      }).join("")}</div>`;
    d.masa = d.sahne.querySelector(".sn-masa");
    d.sahne.querySelectorAll(".sn-nesne").forEach(tasi);
    d.sahne.querySelectorAll(".sn-sepet").forEach((s) => (s.onclick = () => { if (d.secili) dene(d.secili, s); }));
    boyutla();
  }

  function boyutla() {
    if (!d || !d.masa) return;
    const b = BOLUMLER[d.idx], n = d.nesneler.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    const ara = W < 500 ? 8 : 14;
    let en = 0;
    for (let satir = 1; satir <= 4; satir++) {
      const sutun = Math.ceil(n / satir);
      const kG = (W - 34 - (sutun - 1) * ara) / sutun;
      // başlık ~50, sepetler ~1.7k+50, masa satır*k
      const kH = (H - 50 - 50 - 40 - (satir - 1) * ara) / (satir + 1.7);
      en = Math.max(en, Math.min(kG, kH, 130));
    }
    d.sahne.style.setProperty("--k", Math.max(46, Math.floor(en)) + "px");
    d.sahne.style.setProperty("--ara", ara + "px");
  }

  function secimiTemizle() { if (d.secili) d.secili.classList.remove("secili"); d.secili = null; }

  function dene(el, sepet) {
    secimiTemizle();
    const n = d.nesneler[+el.dataset.j];
    if (n.sepet === sepet.dataset.sepet) {
      const img = document.createElement("img");
      img.src = n.src; img.alt = n.ad;
      sepet.querySelector(".sn-govde").appendChild(img);
      el.remove();
      d.api.ses.yerlesti();
      if (!d.masa.querySelector(".sn-nesne")) bitir();
    } else {
      [el, sepet].forEach((x) => { x.classList.remove("salla"); void x.offsetWidth; x.classList.add("salla"); });
      setTimeout(() => { el.classList.remove("salla"); sepet.classList.remove("salla"); }, 500);
      d.api.ses.hata();
    }
  }

  // Sürükle ya da dokun: dokunulan nesne seçilir, sonra sepete dokunulur
  function tasi(el) {
    let bx, by, kx, ky, aktif = false, hareket = false, hedef = null;
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      aktif = true; hareket = false;
      const r = el.getBoundingClientRect();
      bx = e.clientX; by = e.clientY; kx = e.clientX - r.left; ky = e.clientY - r.top;
      el.dataset.w = r.width;
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!hareket && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!hareket) { hareket = true; secimiTemizle(); yerTut(el); el.classList.add("surukleniyor"); el.style.width = el.style.height = el.dataset.w + "px"; }
      el.style.left = e.clientX - kx + "px";
      el.style.top = e.clientY - ky + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const s = alt && alt.closest(".sn-sepet");
      if (hedef && hedef !== s) hedef.classList.remove("hedef");
      hedef = s; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (hareket) {
        el.classList.remove("surukleniyor");
        el.style.left = el.style.top = el.style.width = el.style.height = ""; yerBirak(el);
        if (hedef) { hedef.classList.remove("hedef"); dene(el, hedef); }
        hedef = null;
      } else sec();
    };
    const sec = () => {
      const ayni = d.secili === el;
      secimiTemizle();
      if (!ayni) { d.secili = el; el.classList.add("secili"); d.api.ses.tik(); }
    };
    el.addEventListener("pointerup", birak);
    el.addEventListener("pointercancel", birak);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(); } });
  }

  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    const benim = d.uid;
    setTimeout(() => {
      if (!d || benim !== d.uid) return;
      navCiz();
      const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
      d.api.kutla(d.sahne, {
        mesaj: son ? (herkes ? "Bütün sepetleri doldurdun!" : "Son sepetler de tamam!") : "Hepsi doğru sepette!",
        son,
        ileri: () => yukle(d.idx + 1),
        bastan: () => { d.ilerleme.bitti = []; yukle(0); },
      });
    }, 450);
  }

  window.SINIF_BOLUMLER = BOLUMLER; // test için
  window.SINIF_DURUM = () => d && d.nesneler; // test için

  window.Uygulama.oyunEkle(6, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu() {
      if (!d) return [];
      const n = d.sahne.querySelector(".sn-masa .sn-nesne");
      return n ? [{ el: n, hedef: d.sahne.querySelector(`.sn-sepet[data-sepet="${d.nesneler[+n.dataset.j].sepet}"]`) }] : [];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-sinif" aria-hidden="true"><img src="${NESNELER.elma.src}" alt=""><img src="${NESNELER.muz.src}" alt=""></div>`;
    },
  });
})();
