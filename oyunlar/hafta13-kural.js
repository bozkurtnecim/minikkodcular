/* 13. Hafta: Kural Makinesi (koşul: eğer… ise, değilse).
   Okuma gerektirmez: kurallar renk lekesi, şekil ya da resimle; kutular ✓ ve ✗ ile.
   1–12 "makine sensin": kural verilir, çocuk her nesneyi ✓ ya da ✗ kutusuna koyar.
   13–24 "makineyi kur": ✓ kutusunda olması gerekenler soluk görünür, çocuk kuralı seçer.
   25–30 iki makine art arda: iki kural, üç kutu.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "kural";

  // Nesne jetonu: "top-kirmizi" (şekil-renk) ya da "n:elma" (kütüphaneden, kategorili)
  function nesne(j) {
    if (j.startsWith("n:")) { const n = NESNELER[j.slice(2)]; return { j, src: n.src, kat: n.kat, ad: n.ad }; }
    const [sekil, renk] = j.split("-");
    return { j, src: renkliNesne(sekil, renk), sekil, renk, ad: `${RENK_ADLARI[renk].ad} ${sekil}` };
  }
  // Kural jetonu: "renk-kirmizi", "sekil-yildiz", "kat-meyve"
  const kuralCoz = (k) => { const [tip, deger] = k.split("-"); return { tip, deger }; };
  const uyar = (n, k) => { const { tip, deger } = kuralCoz(k); return n[tip] === deger; };

  // tür: "sen" (kural verilir), "kur" (tek makine), "iki" (iki makine)
  const B = (seviye, tur, kurallar, nesneler, secenek = []) => ({ seviye, tur, kurallar, nesneler, secenek });
  const BOLUMLER = [
    B("Çok kolay", "sen", ["renk-kirmizi"], ["top-kirmizi", "top-mavi", "kalp-kirmizi", "kalp-mavi"]),
    B("Çok kolay", "sen", ["renk-mavi"], ["balon-mavi", "balon-kirmizi", "yildiz-mavi", "yildiz-kirmizi"]),
    B("Çok kolay", "sen", ["renk-sari"], ["kup-sari", "kup-yesil", "top-sari", "top-yesil"]),
    B("Kolay", "sen", ["renk-yesil"], ["balon-yesil", "balon-kirmizi", "kalp-yesil", "kalp-sari", "top-mavi"]),
    B("Kolay", "sen", ["renk-mor"], ["kup-mor", "top-mor", "yildiz-sari", "kalp-kirmizi", "balon-mavi"]),
    B("Kolay", "sen", ["renk-turuncu"], ["top-turuncu", "kalp-turuncu", "balon-pembe", "kup-mavi", "yildiz-yesil"]),
    B("Orta", "sen", ["kat-meyve"], ["n:elma", "n:kedi", "n:muz", "n:araba", "n:cilek", "n:top"]),
    B("Orta", "sen", ["kat-hayvan"], ["n:kus", "n:elma", "n:fil", "n:tisort", "n:balik", "n:havuc"]),
    B("Orta", "sen", ["kat-tasit"], ["n:ucak", "n:kedi", "n:gemi", "n:muz", "n:otobus", "n:sapka"]),
    B("Orta", "sen", ["sekil-yildiz"], ["yildiz-kirmizi", "top-kirmizi", "yildiz-mavi", "kalp-sari", "yildiz-yesil", "kup-mavi"]),
    B("Orta", "sen", ["sekil-kalp"], ["kalp-mavi", "kalp-sari", "balon-kirmizi", "kalp-mor", "top-pembe", "yildiz-mavi"]),
    B("Orta", "sen", ["sekil-top"], ["top-yesil", "balon-yesil", "top-sari", "kalp-yesil", "top-mor", "kup-sari"]),

    B("Zor", "kur", ["renk-kirmizi"], ["top-kirmizi", "kalp-kirmizi", "top-mavi", "kalp-mavi", "yildiz-kirmizi", "kup-sari"], ["renk-kirmizi", "renk-mavi", "sekil-top"]),
    B("Zor", "kur", ["sekil-yildiz"], ["yildiz-sari", "yildiz-mavi", "top-sari", "kalp-mavi", "yildiz-kirmizi", "balon-yesil"], ["sekil-yildiz", "renk-sari", "sekil-kalp"]),
    B("Zor", "kur", ["kat-meyve"], ["n:elma", "n:muz", "n:uzum", "n:kedi", "n:araba", "n:top"], ["kat-meyve", "kat-hayvan", "kat-oyuncak"]),
    B("Zor", "kur", ["renk-mavi"], ["balon-mavi", "kup-mavi", "kalp-mavi", "balon-sari", "kup-yesil", "top-kirmizi"], ["renk-mavi", "sekil-balon", "sekil-kup"]),
    B("Zor", "kur", ["kat-hayvan"], ["n:kedi", "n:fil", "n:kus", "n:tavsan", "n:elma", "n:gemi"], ["kat-hayvan", "kat-tasit", "kat-meyve"]),
    B("Zor", "kur", ["sekil-kup"], ["kup-kirmizi", "kup-sari", "kup-mor", "top-kirmizi", "kalp-sari", "balon-mor"], ["sekil-kup", "renk-kirmizi", "renk-sari"]),

    B("Çok zor", "kur", ["renk-sari"], ["yildiz-sari", "top-sari", "kalp-sari", "yildiz-mavi", "top-kirmizi", "kalp-yesil", "balon-sari"], ["renk-sari", "sekil-yildiz", "sekil-top", "renk-yesil"]),
    B("Çok zor", "kur", ["sekil-kalp"], ["kalp-kirmizi", "kalp-mavi", "kalp-sari", "top-kirmizi", "balon-mavi", "yildiz-sari", "kalp-mor"], ["sekil-kalp", "renk-kirmizi", "sekil-balon", "renk-mavi"]),
    B("Çok zor", "kur", ["kat-giysi"], ["n:sapka", "n:corap", "n:bot", "n:tisort", "n:top", "n:ayi", "n:kedi"], ["kat-giysi", "kat-oyuncak", "kat-hayvan", "kat-meyve"]),
    B("Çok zor", "kur", ["kat-sebze"], ["n:havuc", "n:brokoli", "n:misir", "n:elma", "n:cilek", "n:biber", "n:muz"], ["kat-sebze", "kat-meyve", "kat-oyuncak", "kat-hayvan"]),
    B("Çok zor", "kur", ["renk-yesil"], ["balon-yesil", "kup-yesil", "kalp-yesil", "top-yesil", "balon-mavi", "kup-sari", "yildiz-kirmizi", "top-pembe"], ["renk-yesil", "renk-mavi", "sekil-top", "sekil-kup"]),
    B("Çok zor", "kur", ["sekil-balon"], ["balon-kirmizi", "balon-mavi", "balon-sari", "top-kirmizi", "top-mavi", "kalp-sari", "balon-yesil", "kup-kirmizi"], ["sekil-balon", "sekil-top", "renk-kirmizi", "renk-mavi"]),

    B("Çok zor", "iki", ["renk-kirmizi", "renk-mavi"], ["top-kirmizi", "kalp-kirmizi", "top-mavi", "kalp-mavi", "top-sari", "kalp-sari"], ["renk-kirmizi", "renk-mavi", "sekil-top"]),
    B("Çok zor", "iki", ["kat-meyve", "kat-hayvan"], ["n:elma", "n:muz", "n:kedi", "n:kus", "n:araba", "n:top"], ["kat-meyve", "kat-hayvan", "kat-tasit"]),
    B("Çok zor", "iki", ["sekil-yildiz", "renk-mavi"], ["yildiz-mavi", "yildiz-sari", "top-mavi", "kalp-mavi", "top-sari", "kalp-kirmizi"], ["sekil-yildiz", "renk-mavi", "renk-sari", "sekil-top"]),
    B("Çok zor", "iki", ["renk-sari", "sekil-kalp"], ["kalp-sari", "top-sari", "kalp-mavi", "kalp-kirmizi", "top-mavi", "balon-kirmizi", "yildiz-sari"], ["renk-sari", "sekil-kalp", "sekil-top", "renk-kirmizi"]),
    B("Çok zor", "iki", ["kat-tasit", "kat-giysi"], ["n:araba", "n:ucak", "n:sapka", "n:corap", "n:kedi", "n:elma", "n:gemi", "n:bot"], ["kat-tasit", "kat-giysi", "kat-hayvan", "kat-meyve"]),
    B("Çok zor", "iki", ["sekil-top", "renk-kirmizi"], ["top-mavi", "top-kirmizi", "kalp-kirmizi", "balon-kirmizi", "kup-yesil", "yildiz-sari", "top-sari", "kalp-mor"], ["sekil-top", "renk-kirmizi", "sekil-balon", "renk-mavi"]),
  ];

  // Nesnenin hangi kutuya düştüğü: 0 = 1. makine ✓, 1 = 2. makine ✓ (ya da tek makinede ✗), 2 = son ✗
  function kutuBul(n, kurallar) {
    if (uyar(n, kurallar[0])) return 0;
    if (kurallar.length === 1) return 1;
    return uyar(n, kurallar[1]) ? 1 : 2;
  }

  // ---------- Kural kartı resimleri ----------
  const SEKIL_YOL = {
    top: `<circle cx="50" cy="52" r="34"/>`,
    kalp: `<path d="M50 86 C24 68 12 54 15 36 C18 20 40 16 50 32 C60 16 82 20 85 36 C88 54 76 68 50 86 Z"/>`,
    yildiz: `<polygon points="50,12 60,40 90,40 66,58 75,88 50,70 25,88 34,58 10,40 40,40"/>`,
    kup: `<rect x="18" y="20" width="64" height="64" rx="10"/>`,
    balon: `<ellipse cx="50" cy="42" rx="26" ry="31"/><path d="M50 73 Q46 84 52 94" fill="none" stroke-width="5"/>`,
  };
  function kuralResim(k) {
    const { tip, deger } = kuralCoz(k);
    if (tip === "renk") return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 12 C72 12 88 26 86 46 C84 60 92 66 88 78 C82 92 60 90 50 86 C36 92 16 88 12 72 C8 58 18 52 16 40 C14 22 30 12 50 12 Z" fill="${RENK_ADLARI[deger].c}"/><ellipse cx="36" cy="34" rx="9" ry="6" fill="#fff" opacity=".4" transform="rotate(-30 36 34)"/></svg>`;
    if (tip === "sekil") return `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="#fff" stroke="#1d2846" stroke-width="7" stroke-linejoin="round" stroke-dasharray="1 0">${SEKIL_YOL[deger]}</g></svg>`;
    return `<img src="${NESNELER[KATEGORILER[deger].ikon].src}" alt="">`;
  }
  const kuralAd = (k) => { const { tip, deger } = kuralCoz(k); return tip === "renk" ? RENK_ADLARI[deger].ad : tip === "kat" ? KATEGORILER[deger].ad : deger; };
  const tikIkon = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#2fb36a"/><path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const carpiIkon = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#ff5a4e"/><path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`;
  const MAKINE_RENK = ["#ff8a1f", "#8a5cf0"];

  const stil = `
  .km { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--turuncu); }
  .km-sahne { --k: 70px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; gap: 8px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .km-bant { position: relative; display: flex; gap: 10px; align-items: center; justify-content: flex-end; min-height: calc(var(--k) + 24px); padding: 10px 18px; border-radius: 18px; background: repeating-linear-gradient(90deg, #5d6878 0 18px, #6f7b8c 18px 36px); box-shadow: inset 0 -6px 0 rgba(0,0,0,.2); max-width: 100%; box-sizing: border-box; }
  .km-bant::after { content: ""; position: absolute; right: -14px; top: 50%; border-top: 14px solid transparent; border-bottom: 14px solid transparent; border-left: 16px solid #6f7b8c; transform: translateY(-50%); }
  .km-n { width: var(--k); height: var(--k); flex: none; display: grid; place-items: center; border-radius: 14px; background: rgba(255,255,255,.92); transition: transform .3s, opacity .3s; }
  .km-n img { width: 82%; height: 82%; display: block; pointer-events: none; -webkit-user-drag: none; }
  .km-n.siradaki { transform: scale(1.1); box-shadow: 0 0 0 4px var(--sari); }
  .km-makineler { display: flex; gap: 22px; align-items: center; justify-content: center; flex-wrap: wrap; }
  .km-makine { --m: #ff8a1f; position: relative; display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 22px; background: var(--m); box-shadow: 0 7px 0 rgba(29,40,70,.2); }
  .km-makine::before { content: ""; position: absolute; top: -12px; left: 22px; width: 22px; height: 14px; border-radius: 6px 6px 0 0; background: var(--m); filter: brightness(.85); }
  .km-pencere { width: calc(var(--k) * 1.1); height: calc(var(--k) * 1.1); border-radius: 16px; background: #e8f0f8; box-shadow: inset 0 4px 0 rgba(0,0,0,.12); display: grid; place-items: center; }
  .km-pencere img { width: 80%; height: 80%; }
  .km-kural { width: calc(var(--k) * 1.1); height: calc(var(--k) * 1.1); border-radius: 50%; background: #fff; display: grid; place-items: center; box-shadow: 0 0 0 5px rgba(255,255,255,.5); }
  .km-kural svg, .km-kural img { width: 76%; height: 76%; display: block; }
  .km-kural.bos { background: rgba(255,255,255,.35); border: 4px dashed #fff; box-shadow: none; color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: calc(var(--k) * .55); }
  .km-kural.hedef { background: #d4e8ff; }
  .km-kural.parla { animation: km-parla .5s 2; }
  .km-ok { font-size: 1.8rem; color: var(--murekkep-2); font-weight: 900; }
  .km-kutular { display: flex; gap: 14px; justify-content: center; width: 100%; }
  .km-kutu { --m: #c4935f; position: relative; flex: 1 1 0; max-width: 340px; min-width: 0; min-height: calc(var(--k) * 1.3); padding: 26px 8px 10px; border: 0; border-radius: 14px 14px 26px 26px; background: repeating-linear-gradient(90deg, rgba(0,0,0,.06) 0 6px, transparent 6px 14px), #c4935f; box-shadow: inset 0 0 0 5px var(--m), 0 6px 0 rgba(29,40,70,.14); display: flex; flex-wrap: wrap; align-content: flex-start; justify-content: center; gap: 4px; cursor: pointer; font: inherit; }
  .km-kutu > i { position: absolute; top: -18px; left: 50%; width: 40px; height: 40px; margin-left: -20px; display: block; }
  .km-kutu > i svg { width: 100%; height: 100%; display: block; }
  .km-kutu img { width: calc(var(--k) * .62); height: calc(var(--k) * .62); }
  .km-kutu img.hayal { opacity: .3; filter: grayscale(.1); }
  .km-kutu img.yeni { animation: km-dus .35s cubic-bezier(.3,1.6,.5,1); }
  .km-kutu img.yanlis { outline: 3px solid var(--kirmizi); border-radius: 8px; animation: km-salla .5s 2; }
  .km-kutu.hedef { transform: scale(1.04); }
  .km-kutu.salla { animation: km-salla .45s; }
  .km-alt { display: flex; gap: 14px; align-items: center; justify-content: center; flex-wrap: wrap; }
  .km-secenek { width: calc(var(--k) * 1.05); height: calc(var(--k) * 1.05); padding: 8px; border: 0; border-radius: 18px; background: var(--kagit); box-shadow: 0 5px 0 rgba(29,40,70,.16); cursor: grab; touch-action: none; display: grid; place-items: center; }
  .km-secenek svg, .km-secenek img { width: 100%; height: 100%; display: block; pointer-events: none; }
  .km-secenek.secili { outline: 5px solid var(--mavi); outline-offset: 2px; transform: translateY(-6px); }
  .km-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.08); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); background: #fff; border-radius: 16px; padding: 8px; box-sizing: border-box; }
  .km-tasinan svg, .km-tasinan img { width: 100%; height: 100%; display: block; }
  .km-calistir { display: inline-flex; align-items: center; gap: 10px; min-height: 64px; padding: 0 26px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.4rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .km-calistir svg { width: 30px; height: 30px; }
  .km-calistir:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  @keyframes km-dus { from { transform: translateY(-30px) scale(1.3); opacity: 0; } }
  @keyframes km-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  @keyframes km-parla { 50% { box-shadow: 0 0 0 12px rgba(255,194,58,.8); } }
  `;

  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  const karistir = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("km-stil")) {
      const st = document.createElement("style"); st.id = "km-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="km"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="km-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".km-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.seviye), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false; d.secili = null;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.nesneler = karistir(b.nesneler.map(nesne));
    d.secilen = b.kurallar.map(() => null); // "kur"/"iki" bölümlerinde çocuğun taktığı kurallar
    const iki = b.tur === "iki";
    const kutuSayi = iki ? 3 : 2;
    // Kutular: [makine sırası, ✓/✗]
    const kutular = iki ? [[0, "tik"], [1, "tik"], [1, "carpi"]] : [[0, "tik"], [0, "carpi"]];
    d.hedefKutu = d.nesneler.map((n) => kutuBul(n, b.kurallar));
    const makine = (m) => `<div class="km-makine" style="--m:${MAKINE_RENK[m]}">
        ${b.tur === "sen" ? `<div class="km-pencere"></div>` : ""}
        <div class="km-kural${b.tur === "sen" ? "" : " bos"}" data-m="${m}" aria-label="${b.tur === "sen" ? "Kural: " + kuralAd(b.kurallar[m]) : "Kural yeri"}">${b.tur === "sen" ? kuralResim(b.kurallar[m]) : "?"}</div>
      </div>`;
    d.sahne.innerHTML = `
      <div class="km-bant" aria-label="Bant">${d.nesneler.map((n, j) => `<div class="km-n" data-j="${j}"><img src="${n.src}" alt="${n.ad}"></div>`).join("")}</div>
      <div class="km-makineler">${makine(0)}${iki ? `<span class="km-ok" aria-hidden="true">→</span>${makine(1)}` : ""}</div>
      <div class="km-kutular">${kutular.map(([m, t], k) => `<button class="km-kutu" type="button" data-k="${k}" style="--m:${iki ? MAKINE_RENK[m] : t === "tik" ? "#2fb36a" : "#ff5a4e"}" aria-label="${t === "tik" ? "Evet kutusu" : "Hayır kutusu"}"><i>${t === "tik" ? tikIkon : carpiIkon}</i></button>`).join("")}</div>
      ${b.tur === "sen" ? "" : `<div class="km-alt"><div class="km-alt" aria-label="Kural kartları">${b.secenek.map((k) => `<button class="km-secenek" type="button" data-k="${k}" aria-label="Kural: ${kuralAd(k)}">${kuralResim(k)}</button>`).join("")}</div>
        <button class="km-calistir" type="button" disabled>${d.api.IKON.oynat}<span>Çalıştır</span></button></div>`}`;
    d.bant = d.sahne.querySelector(".km-bant");
    d.kutular = [...d.sahne.querySelectorAll(".km-kutu")];
    d.kuralYerleri = [...d.sahne.querySelectorAll(".km-kural")];
    if (b.tur === "sen") {
      d.pencere = d.sahne.querySelector(".km-pencere");
      d.sira = 0;
      d.kutular.forEach((k) => (k.onclick = () => sen(+k.dataset.k)));
      d.bant.querySelectorAll(".km-n").forEach((el) => nesneTasi(el));
      siradakiGoster();
    } else {
      // Olması gerekeni kutularda soluk göster
      d.nesneler.forEach((n, j) => d.kutular[d.hedefKutu[j]].insertAdjacentHTML("beforeend", `<img class="hayal" src="${n.src}" alt="">`));
      d.calistirDugme = d.sahne.querySelector(".km-calistir");
      d.calistirDugme.onclick = calistir;
      d.sahne.querySelectorAll(".km-secenek").forEach(secenekTasi);
      d.kuralYerleri.forEach((y) => (y.onclick = () => { if (d.secili) kuralTak(d.secili, +y.dataset.m); }));
    }
    boyutla();
  }

  function boyutla() {
    if (!d || !d.bant) return;
    const b = BOLUMLER[d.idx], n = d.nesneler.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight;
    if (W < 50 || H < 50) return;
    const kG = (W - 40 - (n - 1) * 10) / n;
    const satirlar = b.tur === "sen" ? 3.9 : 5.2;
    const k = Math.max(40, Math.floor(Math.min(kG, (H - 120) / satirlar, 92)));
    d.sahne.style.setProperty("--k", k + "px");
  }

  // ---------- "Makine sensin" ----------
  function siradakiGoster() {
    const els = [...d.bant.querySelectorAll(".km-n")];
    els.forEach((el) => el.classList.remove("siradaki"));
    const j = d.sira;
    if (j >= d.nesneler.length) { d.pencere.innerHTML = ""; return; }
    const el = d.bant.querySelector(`.km-n[data-j="${j}"]`);
    el.classList.add("siradaki");
    d.pencere.innerHTML = `<img src="${d.nesneler[j].src}" alt="">`;
  }

  function sen(k) {
    if (d.mesgul || d.sira >= d.nesneler.length) return;
    const j = d.sira;
    if (d.hedefKutu[j] === k) {
      d.bant.querySelector(`.km-n[data-j="${j}"]`).remove();
      d.kutular[k].insertAdjacentHTML("beforeend", `<img class="yeni" src="${d.nesneler[j].src}" alt="">`);
      d.api.ses.yerlesti();
      d.sira++;
      siradakiGoster();
      if (d.sira >= d.nesneler.length) { d.mesgul = true; setTimeout(() => d && bitir(), 500); }
    } else {
      const kutu = d.kutular[k];
      kutu.classList.remove("salla"); void kutu.offsetWidth; kutu.classList.add("salla");
      d.kuralYerleri[0].classList.remove("parla"); void d.kuralYerleri[0].offsetWidth; d.kuralYerleri[0].classList.add("parla");
      setTimeout(() => { kutu.classList.remove("salla"); }, 500);
      d.api.ses.hata();
    }
  }

  // Bantta sıradaki nesneyi kutuya sürükleme
  function nesneTasi(el) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    el.addEventListener("pointerdown", (e) => {
      if (d.mesgul || +el.dataset.j !== d.sira) return;
      e.preventDefault();
      aktif = true; bx = e.clientX; by = e.clientY;
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) {
        ucan = document.createElement("div");
        ucan.className = "km-tasinan";
        const r = el.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = el.innerHTML;
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const k = alt && alt.closest(".km-kutu");
      if (hedef && hedef !== k) hedef.classList.remove("hedef");
      hedef = k || null; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) { ucan.remove(); ucan = null; }
      if (hedef) { hedef.classList.remove("hedef"); sen(+hedef.dataset.k); }
      hedef = null;
    };
    el.addEventListener("pointerup", birak);
    el.addEventListener("pointercancel", birak);
  }

  // ---------- "Makineyi kur" ----------
  function kuralTak(k, m) {
    if (d.mesgul) return;
    if (m == null) m = d.secilen.indexOf(null);
    if (m < 0) m = d.secilen.length - 1;
    d.secilen[m] = k;
    const y = d.kuralYerleri[m];
    y.classList.remove("bos");
    y.innerHTML = kuralResim(k);
    d.sahne.querySelectorAll(".km-secenek").forEach((s) => s.classList.remove("secili"));
    d.secili = null;
    d.calistirDugme.disabled = d.secilen.some((x) => !x);
    d.api.ses.tik();
  }

  function secenekTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = null;
    const k = btn.dataset.k;
    btn.addEventListener("pointerdown", (e) => {
      if (d.mesgul) return;
      e.preventDefault();
      aktif = true; bx = e.clientX; by = e.clientY;
      btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
    });
    btn.addEventListener("pointermove", (e) => {
      if (!aktif) return;
      if (!ucan && Math.hypot(e.clientX - bx, e.clientY - by) < 8) return;
      if (!ucan) {
        ucan = document.createElement("div");
        ucan.className = "km-tasinan";
        const r = btn.getBoundingClientRect();
        ucan.style.width = ucan.style.height = r.width + "px";
        ucan.innerHTML = kuralResim(k);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      const y = alt && alt.closest(".km-kural");
      if (hedef && hedef !== y) hedef.classList.remove("hedef");
      hedef = y || null; if (hedef) hedef.classList.add("hedef");
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) {
        ucan.remove(); ucan = null;
        if (hedef) { hedef.classList.remove("hedef"); kuralTak(k, +hedef.dataset.m); }
        hedef = null;
      } else if (d.secilen.length === 1) kuralTak(k, 0);
      else {
        // İki makinede: önce kartı seç, sonra makineye dokun (ya da boş olana gider)
        if (d.secilen.includes(null)) kuralTak(k);
        else { d.secili = k; d.sahne.querySelectorAll(".km-secenek").forEach((s) => s.classList.toggle("secili", s === btn)); d.api.ses.tik(); }
      }
    };
    btn.addEventListener("pointerup", birak);
    btn.addEventListener("pointercancel", birak);
    btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); kuralTak(k); } });
  }

  async function calistir() {
    if (d.mesgul || d.secilen.some((x) => !x)) return;
    d.mesgul = true; d.calistirDugme.disabled = true;
    const benim = d.uid;
    d.kutular.forEach((k) => k.querySelectorAll("img.hayal").forEach((im) => (im.style.display = "none")));
    const yanlislar = [];
    for (let j = 0; j < d.nesneler.length; j++) {
      const el = d.bant.querySelector(`.km-n[data-j="${j}"]`);
      el.classList.add("siradaki");
      await bekle(280);
      if (!d || benim !== d.uid) return;
      const k = kutuBul(d.nesneler[j], d.secilen);
      el.style.opacity = "0";
      d.kutular[k].insertAdjacentHTML("beforeend", `<img class="yeni" data-j="${j}" src="${d.nesneler[j].src}" alt="">`);
      if (k !== d.hedefKutu[j]) yanlislar.push(j);
      d.api.ses.adim(k * 2 + (j % 3));
      await bekle(260);
      if (!d || benim !== d.uid) return;
    }
    if (!yanlislar.length) { await bekle(400); if (benim === d.uid) bitir(); return; }
    yanlislar.forEach((j) => d.sahne.querySelector(`.km-kutu img[data-j="${j}"]`).classList.add("yanlis"));
    d.api.ses.hata();
    await bekle(1700);
    if (!d || benim !== d.uid) return;
    // Başa dön: nesneler banda, soluk hedefler geri
    d.kutular.forEach((k) => { k.querySelectorAll("img:not(.hayal)").forEach((im) => im.remove()); k.querySelectorAll("img.hayal").forEach((im) => (im.style.display = "")); });
    d.bant.querySelectorAll(".km-n").forEach((el) => { el.style.opacity = ""; el.classList.remove("siradaki"); });
    d.mesgul = false; d.calistirDugme.disabled = false;
  }

  function bitir() {
    d.mesgul = false;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, {
      mesaj: son ? (herkes ? "Bütün makineleri çalıştırdın!" : "Son makine de tamam!") : "Makine doğru çalıştı!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.KURAL_BOLUMLER = BOLUMLER; // test için
  window.KURAL_KUTU = (j, kurallar) => kutuBul(nesne(j), kurallar);
  window.KURAL_DURUM = () => d && { nesneler: d.nesneler.map((n) => n.j), hedef: d.hedefKutu, sira: d.sira };

  window.Uygulama.oyunEkle(13, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-kural" aria-hidden="true">${kuralResim("renk-kirmizi")}${tikIkon}${carpiIkon}</div>`;
    },
  });
})();
