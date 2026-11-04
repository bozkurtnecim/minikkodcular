/* Ayna Ayna (uzamsal düşünme: ayna görüntüsünü bulmak).
   Solda renkli bir desen, yanında ayna var. Aynada desenin nasıl görüneceğini seçeneklerden bul.
   Çeldiriciler: desenin kendisi (aynalanmamış), baş aşağı hâli, ters dönmüş hâli ve tek kare değişmiş aynası.
   Zor bölümlerden itibaren ayna desenin altında durur (su yansıması): görüntü baş aşağı olur.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "ayna";
  const RENK = ["#ff5a4e", "#2f86e0", "#2fb36a", "#ffc23a", "#8a5cf0"];
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const yatayAyna = (g) => g.map((s) => [...s].reverse());
  const dikeyAyna = (g) => [...g].reverse().map((s) => [...s]);
  const dondur180 = (g) => dikeyAyna(yatayAyna(g));
  const anahtar = (g) => g.map((s) => s.join("")).join("/");
  // [ızgara, renk sayısı, dolu oran, seçenek sayısı, ayna yönü (y: yanda, a: altta)]
  const T = [
    [3, 1, 0.4, 2, "y"], [3, 1, 0.45, 2, "y"], [3, 2, 0.45, 3, "y"],
    [3, 2, 0.5, 3, "y"], [4, 1, 0.4, 3, "y"], [4, 2, 0.45, 3, "y"],
    [4, 2, 0.45, 4, "y"], [4, 2, 0.5, 4, "y"], [4, 3, 0.5, 4, "y"], [3, 2, 0.5, 3, "a"], [4, 2, 0.45, 3, "a"], [4, 2, 0.5, 4, "y"],
    [4, 3, 0.5, 4, "a"], [5, 2, 0.45, 4, "y"], [5, 2, 0.45, 4, "a"], [5, 3, 0.5, 4, "y"], [4, 3, 0.55, 4, "a"], [5, 3, 0.5, 4, "a"],
    [5, 3, 0.5, 4, "y"], [5, 3, 0.55, 4, "a"], [5, 3, 0.5, 5, "y"], [5, 3, 0.5, 5, "a"], [5, 4, 0.55, 5, "y"], [5, 4, 0.55, 5, "a"],
    [6, 3, 0.5, 5, "y"], [6, 3, 0.5, 5, "a"], [6, 4, 0.5, 5, "y"], [6, 4, 0.55, 5, "a"], [6, 4, 0.55, 5, "y"], [6, 4, 0.55, 5, "a"],
  ];
  const BOLUMLER = T.map(([g, rs, oran, secSay, yon], i) => {
    const r = tohumlu(5000 + i * 53);
    for (;;) {
      const izgara = Array.from({ length: g }, () => Array.from({ length: g }, () => (r() < oran ? 1 + Math.floor(r() * rs) : 0)));
      const ayna = yon === "y" ? yatayAyna(izgara) : dikeyAyna(izgara);
      // Tek kare değişmiş ayna (en ince çeldirici)
      const bozuk = ayna.map((s) => [...s]); const bx = Math.floor(r() * g), by = Math.floor(r() * g); bozuk[by][bx] = bozuk[by][bx] ? 0 : 1 + Math.floor(r() * rs);
      const aday = [ayna, izgara, yon === "y" ? dikeyAyna(izgara) : yatayAyna(izgara), dondur180(izgara), bozuk];
      const sec = aday.slice(0, 1).concat(i < 12 ? aday.slice(1, 4) : [aday[1], aday[4], aday[2], aday[3]]).slice(0, secSay);
      if (new Set(sec.map(anahtar)).size < sec.length) continue; // simetrik desen olmasın
      const sira = sec.map((x, j) => [r(), j]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
      return { g, yon, izgara, secenek: sira.map((j) => sec[j]), cevap: sira.indexOf(0), grup: Uygulama.seviye(i) };
    }
  });
  const desen = (g) => `<div class="ay-desen" style="--g:${g.length}">${g.flat().map((c) => `<i style="${c ? `background:${RENK[c - 1]}` : ""}"></i>`).join("")}</div>`;

  const stil = `
  .ay { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#eefbff, #dcf2fb); }
  .ay-sahne { --k: 34px; --s: 22px; position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: safe center; gap: 18px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .ay-ust { display: flex; align-items: center; gap: 0; padding: 14px; border-radius: 24px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.1); }
  .ay-ust.a { flex-direction: column; }
  .ay-ayna { width: 14px; align-self: stretch; margin: 0 14px; border-radius: 7px; background: linear-gradient(90deg, #bfe3ff, #fff, #9fd0f7); box-shadow: 0 0 0 2px #7fb8e6; }
  .ay-ust.a .ay-ayna { width: auto; height: 14px; margin: 14px 0; background: linear-gradient(#bfe3ff, #fff, #9fd0f7); }
  .ay-bos { width: calc(var(--k) * var(--g)); height: calc(var(--k) * var(--g)); border-radius: 10px; border: 4px dashed #9fb7d4; display: grid; place-items: center; font: 900 2rem var(--f-baslik); color: #9fb7d4; box-sizing: border-box; }
  .ay-desen { display: grid; grid-template-columns: repeat(var(--g), 1fr); gap: 3px; width: calc(var(--c, var(--k)) * var(--g)); height: calc(var(--c, var(--k)) * var(--g)); }
  .ay-desen i { border-radius: 4px; background: #eef2f8; }
  .ay-secenekler { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
  .ay-kart { --c: var(--s); padding: 12px; border: 0; border-radius: 18px; background: #fff; box-shadow: 0 6px 0 rgba(29,40,70,.14); cursor: pointer; }
  .ay-kart:active { transform: translateY(3px); }
  .ay-kart.yanlis { animation: ay-salla .45s; opacity: .45; }
  .ay-kart.dogru { outline: 6px solid var(--yesil); transform: scale(1.06); }
  .ay-ust .ay-bos.dolu { border: 0; }
  @keyframes ay-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("ay-stil")) { const st = document.createElement("style"); st.id = "ay-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="ay"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="ay-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".ay-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.bitti) return; d.api.ses.tik(); yukle(i); } }); }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.bitti = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.sahne.innerHTML = `<div class="ay-ust ${b.yon}" style="--g:${b.g}">${desen(b.izgara)}<div class="ay-ayna" aria-hidden="true"></div><div class="ay-bos">?</div></div>
      <div class="ay-secenekler">${b.secenek.map((g, j) => `<button class="ay-kart" type="button" data-j="${j}" aria-label="Seçenek">${desen(g)}</button>`).join("")}</div>`;
    d.sahne.querySelectorAll(".ay-kart").forEach((el) => (el.onclick = () => sec(el)));
    boyutla();
  }
  function boyutla() {
    if (!d) return;
    const b = BOLUMLER[d.idx], n = b.secenek.length;
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    // Üst: iki desen + ayna; alt: seçenekler (gerekirse iki satır)
    const ustGen = b.yon === "y" ? 2 : 1, ustYuk = b.yon === "y" ? 1 : 2;
    let k = Math.min((W - 90) / (b.g * ustGen), (H * 0.5 - 70) / (b.g * ustYuk), 52);
    const sat = W < 520 && n > 3 ? 2 : 1, sut = Math.ceil(n / sat);
    let s = Math.min((W - (sut - 1) * 14 - sut * 24) / (b.g * sut), (H * 0.45 - (sat - 1) * 14 - sat * 24) / (b.g * sat), 34);
    d.sahne.style.setProperty("--k", Math.floor(Math.max(14, k)) + "px"); d.sahne.style.setProperty("--s", Math.floor(Math.max(10, s)) + "px");
  }
  async function sec(el) {
    if (d.bitti) return;
    const b = BOLUMLER[d.idx], benim = d.uid, j = +el.dataset.j;
    if (j !== b.cevap) { el.classList.remove("yanlis"); void el.offsetWidth; el.classList.add("yanlis"); d.api.ses.hata(); return; }
    d.bitti = true; el.classList.add("dogru");
    const bos = d.sahne.querySelector(".ay-bos"); bos.classList.add("dolu"); bos.innerHTML = desen(b.secenek[j]);
    d.api.ses.yerlesti();
    await bekle(1000); if (!d || benim !== d.uid) return;
    bitir();
  }
  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Ayna ustası!" : "Son aynayı da çözdün!") : "Aynadaki görüntüyü buldun!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.AYNA_BOLUMLER = BOLUMLER;

  window.Uygulama.oyunEkle(50, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      return [{ el: d.sahne.querySelector(".ay-ayna") }, { el: d.sahne.querySelector(`.ay-kart[data-j="${BOLUMLER[d.idx].cevap}"]`) }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { return `<div class="mini mini-sekil" aria-hidden="true"><svg viewBox="0 0 100 70"><rect x="6" y="14" width="18" height="18" rx="3" fill="#ff5a4e"/><rect x="6" y="36" width="18" height="18" rx="3" fill="#ff5a4e"/><rect x="26" y="36" width="18" height="18" rx="3" fill="#2f86e0"/><rect x="47" y="6" width="6" height="58" rx="3" fill="#9fd0f7"/><rect x="76" y="14" width="18" height="18" rx="3" fill="#ff5a4e"/><rect x="76" y="36" width="18" height="18" rx="3" fill="#ff5a4e"/><rect x="56" y="36" width="18" height="18" rx="3" fill="#2f86e0"/></svg></div>`; },
  });
})();
