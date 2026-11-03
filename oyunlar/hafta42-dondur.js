/* Döndür Yapboz (parça-bütün ve yön: dönük parçaları düzeltip resmi tamamlamak).
   Resim karelere bölünmüş, karelerin çoğu yan ya da ters dönmüş. Kareye dokununca çeyrek tur döner.
   Bütün kareler doğru yöne gelince resim birleşir. İlk bölümlerde yanda küçük örnek resim durur;
   çok zor bölümlerin sonunda örnek gizlenir. Resimler js/resimler.js içinden.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "dondur";
  const R = () => window.RESIMLER;
  const tohumlu = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  // [ızgara, dönük kare oranı, örnek resim görünür mü]
  const T = [
    [2, 0.5, 1], [2, 0.75, 1], [2, 1, 1],
    [3, 0.45, 1], [3, 0.55, 1], [3, 0.65, 1],
    [3, 0.75, 1], [3, 0.8, 1], [3, 0.9, 1], [4, 0.5, 1], [4, 0.6, 1], [4, 0.65, 1],
    [4, 0.7, 1], [4, 0.75, 1], [4, 0.8, 1], [4, 0.85, 1], [4, 0.9, 1], [4, 0.95, 1],
    [5, 0.55, 1], [5, 0.6, 1], [5, 0.65, 1], [5, 0.7, 1], [5, 0.75, 1], [5, 0.8, 1],
    [4, 0.85, 0], [4, 0.9, 0], [5, 0.7, 0], [5, 0.8, 0], [5, 0.85, 0], [5, 0.9, 0],
  ];
  const BOLUMLER = T.map(([g, oran, ornek], i) => {
    const r = tohumlu(9000 + i * 71), n = g * g, say = Math.max(1, Math.round(n * oran));
    const sec = [...Array(n).keys()].map((x) => [r(), x]).sort((a, b) => a[0] - b[0]).slice(0, say).map((x) => x[1]);
    const donus = Array(n).fill(0); sec.forEach((h) => (donus[h] = 1 + Math.floor(r() * 3)));
    return { g, ornek, resim: (i * 13 + 8) % 30, donus, grup: Uygulama.seviye(i) };
  });

  const stil = `
  .dy { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f3f0ff, #e8e2fb); }
  .dy-sahne { --r: 400px; --o: 120px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 28px; padding: 8px 16px 16px; overflow: auto; user-select: none; -webkit-user-select: none; }
  .dy-sahne.dikey { flex-direction: column; gap: 14px; justify-content: safe center; }
  .dy-tahta { display: grid; grid-template-columns: repeat(var(--g), 1fr); gap: 4px; width: var(--r); height: var(--r); padding: 6px; border-radius: 20px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.14); flex: none; box-sizing: content-box; }
  .dy-tahta.tamam { gap: 0; transition: gap .4s; }
  .dy-kare { position: relative; padding: 0; border: 0; border-radius: 6px; background-repeat: no-repeat; cursor: pointer; transition: transform .28s ease-in-out, border-radius .4s; box-shadow: 0 3px 0 rgba(29,40,70,.18); }
  .dy-tahta.tamam .dy-kare { border-radius: 0; box-shadow: none; }
  .dy-ornek { width: var(--o); height: var(--o); border-radius: 16px; background-size: cover; outline: 5px solid #fff; box-shadow: 0 6px 0 rgba(29,40,70,.14); flex: none; }
  `;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("dy-stil")) { const st = document.createElement("style"); st.id = "dy-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="dy"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="dy-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".dy-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
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
    // Açı birikerek tutulur (360'tan sonra da hep aynı yöne döner)
    d.aci = b.donus.map((x) => x * 90);
    const src = R()[b.resim].src, pos = 100 / (b.g - 1);
    d.sahne.innerHTML = `
      ${b.ornek ? `<div class="dy-ornek" style="background-image:url('${src}')" aria-label="Örnek resim"></div>` : ""}
      <div class="dy-tahta" style="--g:${b.g}">${d.aci.map((a, h) => `<button class="dy-kare" type="button" data-h="${h}" aria-label="Kare" style="background-image:url('${src}');background-size:${b.g * 100}% ${b.g * 100}%;background-position:${(h % b.g) * pos}% ${Math.floor(h / b.g) * pos}%;transform:rotate(${a}deg)"></button>`).join("")}</div>`;
    d.tahta = d.sahne.querySelector(".dy-tahta");
    d.tahta.querySelectorAll(".dy-kare").forEach((el) => (el.onclick = () => dondur(+el.dataset.h)));
    boyutla();
  }
  function boyutla() {
    if (!d || !d.tahta) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.05;
    d.sahne.classList.toggle("dikey", dikey);
    let r, o = 0;
    if (dikey) { o = b.ornek ? Math.min(W * 0.32, H * 0.18, 130) : 0; r = Math.min(W - 24, H - o - 40); }
    else { o = b.ornek ? Math.min(W * 0.18, H * 0.4, 180) : 0; r = Math.min(H - 24, W - o - 70); }
    d.sahne.style.setProperty("--r", Math.floor(Math.max(160, r)) + "px");
    d.sahne.style.setProperty("--o", Math.floor(o) + "px");
  }
  async function dondur(h) {
    if (d.bitti) return;
    const benim = d.uid;
    d.aci[h] += 90;
    d.tahta.querySelector(`.dy-kare[data-h="${h}"]`).style.transform = `rotate(${d.aci[h]}deg)`;
    const duz = d.aci[h] % 360 === 0;
    d.api.ses.ton(duz ? 784 : 523, 0.12);
    if (d.aci.every((a) => a % 360 === 0)) {
      d.bitti = true;
      await bekle(350); if (!d || benim !== d.uid) return;
      d.tahta.classList.add("tamam"); d.api.ses.yerlesti();
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
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün resimleri düzelttin!" : "Son resim de düzeldi!") : `${R()[BOLUMLER[d.idx].resim].ad} düzeldi!`, son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.DONDUR_BOLUMLER = BOLUMLER;
  window.DONDUR_DURUM = () => d && d.aci;

  window.Uygulama.oyunEkle(42, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d) return [];
      const h = d.aci.findIndex((a) => a % 360 !== 0);
      if (h < 0) return [];
      return [{ el: d.tahta.querySelector(`.dy-kare[data-h="${h}"]`), kez: (360 - (d.aci[h] % 360)) / 90 }];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const s = R()[5].src, pos = ["0 0", "100% 0", "0 100%", "100% 100%"], don = [0, 90, 180, 0];
      return `<div class="mini" aria-hidden="true">${pos.map((p, i) => `<span style="background-image:url('${s}');background-position:${p};transform:rotate(${don[i]}deg)"></span>`).join("")}</div>`;
    },
  });
})();
