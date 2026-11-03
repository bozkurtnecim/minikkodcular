/* Yakından Bak (parça-bütün: küçük bir ayrıntıdan bütünü tanımak).
   Büyüteçte bir resmin küçük bir parçası görünür. İlk bölümlerde bu parçanın hangi resme ait olduğu seçilir;
   zor bölümlerden itibaren resim büyük gösterilir, çocuk parçanın resmin neresinde olduğunu bulup oraya dokunur.
   Büyüteç bölümler ilerledikçe daha küçük bir parçayı gösterir. Resimler js/resimler.js içinden.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "yakindan";
  const R = () => window.RESIMLER;
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [kip, seçenek sayısı, büyüteçteki parçanın resme oranı]
  const T = [
    ["sec", 3, 0.42], ["sec", 3, 0.4], ["sec", 3, 0.38],
    ["sec", 3, 0.32], ["sec", 4, 0.3], ["sec", 4, 0.3],
    ["sec", 4, 0.26], ["sec", 4, 0.24], ["sec", 5, 0.24], ["sec", 5, 0.22], ["sec", 5, 0.2], ["sec", 6, 0.2],
    ["bul", 0, 0.32], ["bul", 0, 0.3], ["bul", 0, 0.28], ["bul", 0, 0.26], ["bul", 0, 0.25], ["bul", 0, 0.24],
    ["bul", 0, 0.22], ["bul", 0, 0.22], ["bul", 0, 0.2], ["bul", 0, 0.2], ["bul", 0, 0.19], ["bul", 0, 0.18],
    ["bul", 0, 0.18], ["bul", 0, 0.17], ["bul", 0, 0.16], ["bul", 0, 0.16], ["bul", 0, 0.15], ["bul", 0, 0.15],
  ];
  const BOLUMLER = T.map(([kip, n, f], i) => {
    const r = tohumlu(4000 + i * 97);
    const resim = (i * 7 + 3) % 30;
    const digerleri = [...Array(30).keys()].filter((x) => x !== resim).map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    const secenek = kip === "sec" ? [resim, ...digerleri.slice(0, n - 1)].map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]) : [];
    return { kip, f, resim, secenek, tohum: 5000 + i * 131, grup: Uygulama.seviye(i) };
  });

  // Resmin "ilginç" (renkçe çeşitli) bir bölgesini seç: boş gökyüzü ya da düz çimen çıkmasın
  const bolgeOnbellek = {};
  function bolgeSec(b) {
    const anahtar = `${b.resim},${b.f},${b.tohum}`;
    if (bolgeOnbellek[anahtar]) return Promise.resolve(bolgeOnbellek[anahtar]);
    const r = tohumlu(b.tohum);
    const adaylar = Array.from({ length: 40 }, () => [b.f / 2 + r() * (1 - b.f), b.f / 2 + r() * (1 - b.f)]);
    return new Promise((coz) => {
      const img = new Image();
      img.onload = () => {
        let sonuc = adaylar[0];
        try {
          const N = 120, c = document.createElement("canvas"); c.width = c.height = N;
          const g = c.getContext("2d"); g.drawImage(img, 0, 0, N, N);
          const v = g.getImageData(0, 0, N, N).data;
          const puan = ([x, y]) => {
            const x0 = Math.round((x - b.f / 2) * N), y0 = Math.round((y - b.f / 2) * N), w = Math.max(2, Math.round(b.f * N));
            const renk = new Set(); let t = 0, t2 = 0, n = 0;
            for (let yy = y0; yy < y0 + w; yy += 2) for (let xx = x0; xx < x0 + w; xx += 2) {
              const o = (yy * N + xx) * 4, l = v[o] * 0.3 + v[o + 1] * 0.59 + v[o + 2] * 0.11;
              renk.add(`${v[o] >> 5},${v[o + 1] >> 5},${v[o + 2] >> 5}`); t += l; t2 += l * l; n++;
            }
            return Math.sqrt(Math.max(0, t2 / n - (t / n) ** 2)) + renk.size * 4;
          };
          sonuc = adaylar.map((a) => [puan(a), a]).sort((p, q) => q[0] - p[0])[Math.floor(r() * 3)][1];
        } catch (e) {}
        bolgeOnbellek[anahtar] = sonuc; coz(sonuc);
      };
      img.onerror = () => coz(adaylar[0]);
      img.src = R()[b.resim].src;
    });
  }

  const buyutec = `<svg class="sap" viewBox="0 0 100 100" aria-hidden="true"><path d="M70 70 L94 94" stroke="#8a5a33" stroke-width="14" stroke-linecap="round"/></svg>`;
  const stil = `
  .yk { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#fff7ec, #fdeedd); }
  .yk-sahne { --b: 220px; --s: 120px; --r: 360px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 28px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .yk-sahne.dikey { flex-direction: column; gap: 16px; justify-content: safe center; }
  .yk-buyutec { position: relative; width: var(--b); height: var(--b); flex: none; }
  .yk-buyutec .cam { position: absolute; inset: 0; border-radius: 50%; border: 10px solid #5d6878; box-shadow: 0 8px 0 rgba(29,40,70,.15), inset 0 0 0 4px rgba(255,255,255,.6); background-repeat: no-repeat; background-color: #fff; overflow: hidden; }
  .yk-buyutec .cam::after { content: ""; position: absolute; left: 14%; top: 10%; width: 30%; height: 18%; border-radius: 50%; background: rgba(255,255,255,.35); transform: rotate(-30deg); }
  .yk-buyutec .sap { position: absolute; left: 62%; top: 62%; width: 52%; height: 52%; }
  .yk-secenekler { display: grid; grid-template-columns: repeat(var(--sut), var(--s)); gap: 14px; }
  .yk-secenek { width: var(--s); height: var(--s); padding: 0; border: 0; border-radius: 20px; background-size: cover; box-shadow: 0 6px 0 rgba(29,40,70,.16); cursor: pointer; outline: 4px solid #fff; transition: transform .15s, opacity .3s; }
  .yk-secenek:active { transform: translateY(3px); }
  .yk-secenek.yanlis { opacity: .3; animation: yk-salla .45s; pointer-events: none; }
  .yk-secenek.dogru { outline: 6px solid var(--yesil); transform: scale(1.08); }
  @keyframes yk-salla { 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
  .yk-resim { position: relative; width: var(--r); height: var(--r); border-radius: 22px; background-size: cover; box-shadow: 0 8px 0 rgba(29,40,70,.14); outline: 6px solid #fff; cursor: pointer; flex: none; }
  .yk-resim .isaret { position: absolute; border-radius: 50%; pointer-events: none; transform: translate(-50%, -50%); }
  .yk-resim .isaret.yanlis { width: 44px; height: 44px; display: grid; place-items: center; color: #fff; background: var(--kirmizi); font: 900 26px var(--f-baslik); animation: yk-sol .9s forwards; }
  @keyframes yk-sol { 70% { opacity: 1; } to { opacity: 0; transform: translate(-50%, -50%) scale(.6); } }
  .yk-resim .isaret.dogru { border: 6px solid var(--yesil); box-shadow: 0 0 0 4px #fff; animation: yk-gel .4s ease-out both; }
  @keyframes yk-gel { from { transform: translate(-50%, -50%) scale(1.6); opacity: 0; } }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("yk-stil")) { const st = document.createElement("style"); st.id = "yk-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="yk"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="yk-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".yk-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { if (d.bitti) return; d.api.ses.tik(); yukle(i); } }); }

  async function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.bitti = false; d.bolge = null;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const benim = d.uid;
    const src = R()[b.resim].src;
    d.sahne.innerHTML = `<div class="yk-buyutec"><div class="cam" style="background-image:url('${src}')"></div>${buyutec}</div>${
      b.kip === "sec"
        ? `<div class="yk-secenekler" style="--sut:${b.secenek.length > 4 ? 3 : b.secenek.length === 4 ? 2 : b.secenek.length}">${b.secenek.map((x) => `<button class="yk-secenek" type="button" data-r="${x}" aria-label="${R()[x].ad}" style="background-image:url('${R()[x].src}')"></button>`).join("")}</div>`
        : `<div class="yk-resim" role="button" aria-label="Resim" style="background-image:url('${src}')"></div>`
    }`;
    d.cam = d.sahne.querySelector(".cam");
    if (b.kip === "sec") d.sahne.querySelectorAll(".yk-secenek").forEach((el) => (el.onclick = () => sec(el)));
    else d.sahne.querySelector(".yk-resim").onclick = (e) => bul(e);
    boyutla();
    const bolge = await bolgeSec(b);
    if (!d || benim !== d.uid) return;
    d.bolge = bolge;
    camCiz();
  }
  function camCiz() {
    if (!d.bolge) return;
    const b = BOLUMLER[d.idx], [x, y] = d.bolge, olcek = 100 / b.f;
    d.cam.style.backgroundSize = `${olcek}% ${olcek}%`;
    // Bölgenin merkezi camın ortasına gelsin
    const px = ((x - b.f / 2) / (1 - b.f)) * 100, py = ((y - b.f / 2) / (1 - b.f)) * 100;
    d.cam.style.backgroundPosition = `${px}% ${py}%`;
  }
  function boyutla() {
    if (!d || !d.cam) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.05;
    d.sahne.classList.toggle("dikey", dikey);
    let buy, s = 0, r = 0;
    if (b.kip === "sec") {
      const n = b.secenek.length, sut = n > 4 ? 3 : n === 4 ? 2 : n, sat = Math.ceil(n / sut);
      if (dikey) { buy = Math.min(W * 0.55, H * 0.36, 260); s = Math.min((W - (sut - 1) * 14) / sut, (H - buy - 30 - (sat - 1) * 14) / sat, 170); }
      else { buy = Math.min(W * 0.32, H * 0.7, 300); s = Math.min((W - buy - 60 - (sut - 1) * 14) / sut, (H - (sat - 1) * 14) / sat, 190); }
    } else {
      if (dikey) { buy = Math.min(W * 0.45, H * 0.28, 200); r = Math.min(W - 12, H - buy - 30); }
      else { buy = Math.min(W * 0.28, H * 0.55, 260); r = Math.min(W - buy - 60, H - 12); }
    }
    d.sahne.style.setProperty("--b", Math.floor(buy) + "px");
    d.sahne.style.setProperty("--s", Math.floor(Math.max(70, s)) + "px");
    d.sahne.style.setProperty("--r", Math.floor(Math.max(200, r)) + "px");
  }

  async function sec(el) {
    if (d.bitti) return;
    const b = BOLUMLER[d.idx], benim = d.uid;
    if (+el.dataset.r === b.resim) {
      d.bitti = true; el.classList.add("dogru"); d.api.ses.yerlesti();
      await bekle(700); if (!d || benim !== d.uid) return;
      bitir();
    } else { el.classList.add("yanlis"); d.api.ses.hata(); }
  }
  async function bul(e) {
    if (d.bitti || !d.bolge) return;
    const b = BOLUMLER[d.idx], benim = d.uid, el = d.sahne.querySelector(".yk-resim"), rr = el.getBoundingClientRect();
    const x = (e.clientX - rr.left) / rr.width, y = (e.clientY - rr.top) / rr.height;
    const [bx, by] = d.bolge, tol = b.f * 0.6;
    if (Math.abs(x - bx) <= tol && Math.abs(y - by) <= tol) {
      d.bitti = true;
      el.insertAdjacentHTML("beforeend", `<span class="isaret dogru" style="left:${bx * 100}%;top:${by * 100}%;width:${b.f * 100}%;height:${b.f * 100}%"></span>`);
      d.api.ses.yerlesti();
      await bekle(900); if (!d || benim !== d.uid) return;
      bitir();
    } else {
      el.insertAdjacentHTML("beforeend", `<span class="isaret yanlis" style="left:${x * 100}%;top:${y * 100}%">✗</span>`);
      d.api.ses.hata();
      setTimeout(() => { const s = el.querySelector(".isaret.yanlis"); if (s) s.remove(); }, 950);
    }
  }
  function bitir() {
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Keskin gözlü dedektif!" : "Son ayrıntıyı da buldun!") : "Doğru buldun!", son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.YAKINDAN_BOLUMLER = BOLUMLER;
  window.YAKINDAN_BOLGE = () => d && d.bolge;

  window.Uygulama.oyunEkle(40, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const b = BOLUMLER[d.idx];
      if (b.kip === "sec") return [{ el: d.cam }, { el: d.sahne.querySelector(`.yk-secenek[data-r="${b.resim}"]`) }];
      const el = d.sahne.querySelector(".yk-resim"); if (!el || !d.bolge) return [{ el: d.cam }];
      const rr = el.getBoundingClientRect();
      return [{ el: d.cam }, { el: { x: rr.left + d.bolge[0] * rr.width, y: rr.top + d.bolge[1] * rr.height } }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() { const s = R()[0].src; return `<div class="mini" aria-hidden="true" style="display:block;width:74px;height:74px;border-radius:50%;border:6px solid #5d6878;background:url('${s}') 40% 40% / 300% 300% no-repeat;box-sizing:border-box"></div>`; },
  });
})();
