/* Şekil Avı (şekil tanıma: aynı şekli farklı renk, boy ve yönde bulmak).
   Üstte aranacak şekil ve kaç tane olduğu (boş noktalar) görünür. Karışık şekiller arasından hepsini bul ve dokun.
   İlk bölümlerde şekiller çok farklıdır; sonra boy, renk ve yön karışır, benzer şekiller (kare-dikdörtgen,
   daire-oval) gelir. Çok zor bölümlerin sonunda renk de önemlidir: "kırmızı üçgenler" gibi.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "sekilavi";
  const RENK = ["#ff5a4e", "#2f86e0", "#2fb36a", "#ffc23a", "#8a5cf0", "#ff8a1f"];
  const yildiz = (() => { let s = "M"; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 19 : 42; s += `${50 + r * Math.cos(a)} ${54 + r * Math.sin(a)} `; } return s + "Z"; })();
  const SEKIL = {
    daire: `<circle cx="50" cy="50" r="40"/>`,
    oval: `<ellipse cx="50" cy="50" rx="44" ry="28"/>`,
    kare: `<rect x="12" y="12" width="76" height="76" rx="6"/>`,
    dikdortgen: `<rect x="6" y="26" width="88" height="48" rx="6"/>`,
    ucgen: `<path d="M50 8 L92 86 H8 Z"/>`,
    yildiz: `<path d="${yildiz}"/>`,
    kalp: `<path d="M50 88 C10 60 6 34 22 20 C34 10 46 16 50 28 C54 16 66 10 78 20 C94 34 90 60 50 88 Z"/>`,
    altigen: `<path d="M28 10 H72 L94 50 L72 90 H28 L6 50 Z"/>`,
  };
  const sekilSvg = (s, renk) => `<svg viewBox="0 0 100 100" aria-hidden="true"><g fill="${renk}" stroke="rgba(0,0,0,.18)" stroke-width="3" stroke-linejoin="round">${SEKIL[s]}</g></svg>`;
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [hedef, hedef sayısı, toplam şekil, çeldirici şekiller, karışıklık (boy/yön), renk de önemli mi]
  const T = [
    ["daire", 2, 5, ["kare", "ucgen"], 0, 0], ["ucgen", 2, 6, ["daire", "kare"], 0, 0], ["kare", 3, 6, ["daire", "yildiz"], 0, 0],
    ["yildiz", 3, 7, ["daire", "kare", "ucgen"], 0, 0], ["kalp", 3, 8, ["daire", "yildiz", "kare"], 1, 0], ["ucgen", 4, 8, ["kare", "daire", "kalp"], 1, 0],
    ["daire", 4, 10, ["kare", "ucgen", "yildiz"], 1, 0], ["kare", 4, 10, ["daire", "ucgen", "kalp"], 1, 0], ["altigen", 3, 10, ["daire", "kare", "yildiz"], 1, 0], ["yildiz", 4, 11, ["kalp", "ucgen", "daire"], 1, 0], ["ucgen", 5, 12, ["kare", "altigen", "daire"], 2, 0], ["kalp", 4, 12, ["daire", "yildiz", "ucgen"], 2, 0],
    ["kare", 4, 12, ["dikdortgen", "daire", "ucgen"], 2, 0], ["daire", 4, 12, ["oval", "kare", "yildiz"], 2, 0], ["dikdortgen", 4, 13, ["kare", "oval", "ucgen"], 2, 0], ["oval", 4, 13, ["daire", "dikdortgen", "kalp"], 2, 0], ["altigen", 5, 14, ["daire", "kare", "yildiz", "ucgen"], 2, 0], ["ucgen", 5, 14, ["altigen", "kare", "yildiz", "kalp"], 2, 0],
    ["kare", 5, 15, ["dikdortgen", "altigen", "daire"], 2, 0], ["daire", 5, 15, ["oval", "altigen", "kare"], 2, 0], ["yildiz", 5, 16, ["altigen", "kalp", "ucgen", "daire"], 2, 0], ["dikdortgen", 5, 16, ["kare", "oval", "altigen"], 2, 0], ["oval", 5, 16, ["daire", "dikdortgen", "altigen"], 2, 0], ["kalp", 6, 18, ["yildiz", "daire", "ucgen", "altigen"], 2, 0],
    ["ucgen", 3, 14, ["kare", "daire", "yildiz"], 2, 1], ["daire", 3, 14, ["oval", "kare", "ucgen"], 2, 1], ["kare", 4, 16, ["dikdortgen", "daire", "altigen"], 2, 1], ["yildiz", 4, 16, ["kalp", "ucgen", "daire"], 2, 1], ["kalp", 4, 18, ["yildiz", "daire", "oval"], 2, 1], ["dikdortgen", 4, 18, ["kare", "oval", "altigen", "ucgen"], 2, 1],
  ];
  const BOLUMLER = T.map(([hedef, say, top, cel, kar, renkli], i) => {
    const r = tohumlu(4600 + i * 41);
    const hedefRenk = RENK[Math.floor(r() * RENK.length)];
    const ogeler = [];
    for (let j = 0; j < say; j++) ogeler.push({ s: hedef, renk: renkli ? hedefRenk : RENK[Math.floor(r() * RENK.length)], hedef: true });
    // Renkli bölümlerde aynı şeklin başka renkleri de çeldirici olur
    for (let j = say; j < top; j++) {
      const ayniSekil = renkli && j < say + 2;
      const s = ayniSekil ? hedef : cel[Math.floor(r() * cel.length)];
      let renk = RENK[Math.floor(r() * RENK.length)];
      if (ayniSekil) while (renk === hedefRenk) renk = RENK[Math.floor(r() * RENK.length)];
      ogeler.push({ s, renk, hedef: false });
    }
    // Yerleşim: ızgara hücrelerine dağıt, her öğe hücresinde biraz kaysın
    const sut = Math.ceil(Math.sqrt(top * 1.4)), sat = Math.ceil(top / sut);
    const hucreler = [...Array(sut * sat).keys()].map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    ogeler.forEach((o, j) => {
      const h = hucreler[j];
      o.x = ((h % sut) + 0.5 + (r() - 0.5) * 0.35) / sut; o.y = (Math.floor(h / sut) + 0.5 + (r() - 0.5) * 0.35) / sat;
      o.boy = kar ? 0.65 + r() * 0.45 : 0.9;
      o.aci = kar >= 2 && o.s !== "daire" ? Math.round((r() - 0.5) * 60) : 0;
    });
    return { hedef, say, renkli, hedefRenk, ogeler: ogeler.map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]), sut, sat, grup: Uygulama.seviye(i) };
  });

  const stil = `
  .sa { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f2f6ff, #e6edfd); }
  .sa-sahne { --w: 600px; --h: 400px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 12px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .sa-ust { display: flex; align-items: center; gap: 14px; padding: 10px 18px; border-radius: 22px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.1); }
  .sa-ust .hedef { width: 64px; height: 64px; animation: sa-nefes 1.6s ease-in-out infinite; }
  .sa-ust .hedef svg { width: 100%; height: 100%; display: block; }
  @keyframes sa-nefes { 50% { transform: scale(1.1) rotate(-6deg); } }
  .sa-noktalar { display: flex; gap: 8px; }
  .sa-noktalar i { width: 22px; height: 22px; border-radius: 50%; border: 3px solid var(--cizgi); background: #fff; display: block; }
  .sa-noktalar i.dolu { background: var(--yesil); border-color: var(--yesil); }
  .sa-alan { position: relative; width: var(--w); height: var(--h); border-radius: 26px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.1); flex: none; }
  .sa-oge { position: absolute; padding: 0; border: 0; background: none; cursor: pointer; transform: translate(-50%, -50%) rotate(var(--a)) scale(var(--b)); transition: transform .2s; }
  .sa-oge svg { width: 100%; height: 100%; display: block; }
  .sa-oge.bulundu { transform: translate(-50%, -50%) rotate(0) scale(calc(var(--b) * 1.15)); filter: drop-shadow(0 0 0 #fff) drop-shadow(0 0 8px #2fb36a); pointer-events: none; }
  .sa-oge.bulundu::after { content: "✓"; position: absolute; right: -4px; top: -4px; width: 26px; height: 26px; border-radius: 50%; background: var(--yesil); color: #fff; font: 900 17px/26px var(--f-baslik); text-align: center; }
  .sa-oge.yanlis { animation: sa-salla .45s; }
  @keyframes sa-salla { 20%, 60% { transform: translate(calc(-50% - 7px), -50%) rotate(var(--a)) scale(var(--b)); } 40%, 80% { transform: translate(calc(-50% + 7px), -50%) rotate(var(--a)) scale(var(--b)); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("sa-stil")) { const st = document.createElement("style"); st.id = "sa-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="sa"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="sa-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".sa-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.bitti) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.bitti = false; d.bulunan = 0;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    // Renk önemsizse hedef simgesi gri, önemliyse hedefin rengiyle
    d.sahne.innerHTML = `<div class="sa-ust"><div class="hedef">${sekilSvg(b.hedef, b.renkli ? b.hedefRenk : "#9aa7b8")}</div><div class="sa-noktalar">${"<i></i>".repeat(b.say)}</div></div>
      <div class="sa-alan">${b.ogeler.map((o, j) => `<button class="sa-oge" type="button" data-j="${j}" aria-label="Şekil" style="left:${o.x * 100}%;top:${o.y * 100}%;--a:${o.aci}deg;--b:${o.boy}">${sekilSvg(o.s, o.renk)}</button>`).join("")}</div>`;
    d.alan = d.sahne.querySelector(".sa-alan");
    d.alan.querySelectorAll(".sa-oge").forEach((el) => (el.onclick = () => dokun(el)));
    boyutla();
  }
  function boyutla() {
    if (!d || !d.alan) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24 - 100;
    if (W < 50 || H < 50) return;
    // Alanın en/boy oranı ızgaraya göre; telefonda dik ızgara
    const dikey = W < H;
    const sut = dikey ? b.sat : b.sut, sat = dikey ? b.sut : b.sat;
    const k = Math.min(W / sut, H / sat, 150);
    d.cevir = dikey;
    d.sahne.style.setProperty("--w", Math.floor(k * sut) + "px"); d.sahne.style.setProperty("--h", Math.floor(k * sat) + "px");
    d.alan.querySelectorAll(".sa-oge").forEach((el) => {
      const o = b.ogeler[+el.dataset.j];
      Object.assign(el.style, { left: (dikey ? o.y : o.x) * 100 + "%", top: (dikey ? o.x : o.y) * 100 + "%", width: k * 0.78 + "px", height: k * 0.78 + "px" });
    });
  }
  async function dokun(el) {
    if (d.bitti) return;
    const b = BOLUMLER[d.idx], benim = d.uid, o = b.ogeler[+el.dataset.j];
    if (!o.hedef) { el.classList.remove("yanlis"); void el.offsetWidth; el.classList.add("yanlis"); d.api.ses.hata(); return; }
    el.classList.add("bulundu");
    d.sahne.querySelectorAll(".sa-noktalar i")[d.bulunan].classList.add("dolu");
    d.bulunan++; d.api.ses.adim(d.bulunan % 8);
    if (d.bulunan === b.say) {
      d.bitti = true; d.api.ses.yerlesti();
      await bekle(800); if (!d || benim !== d.uid) return;
      bitir();
    }
  }
  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün şekilleri buldun, şekil avcısı!" : "Son av da tamam!") : "Hepsini buldun!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.SEKILAVI_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(46, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu(tam) {
      if (!d) return [];
      const kalan = [...d.alan.querySelectorAll(".sa-oge:not(.bulundu)")].filter((el) => BOLUMLER[d.idx].ogeler[+el.dataset.j].hedef);
      return [{ el: d.sahne.querySelector(".sa-ust .hedef") }, ...kalan.slice(0, tam ? undefined : 1).map((el) => ({ el }))];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-ari" aria-hidden="true">${sekilSvg("ucgen", "#2fb36a")}${sekilSvg("daire", "#ff5a4e")}${sekilSvg("ucgen", "#ffc23a")}</div>`; },
  });
})();
