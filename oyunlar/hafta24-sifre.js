/* Şifreli Resim (kodlama: şifreyi çözüp resmi oluşturmak; bilgisayar resmi sayılarla saklar).
   Her satırın solunda şifresi var: "2 kırmızı, 1 boş, 2 kırmızı" gibi. Rengi seç, karelere dokun ya da
   parmağını sürükle. Satır şifreye uyunca ✓ çıkar; bütün satırlar uyunca gizli resim belirir.
   İlk bölümlerde şifre her kare için tek işarettir, sonra sayılar gelir, sonra iki-üç renk.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12. */
(function () {
  const KAYIT = "sifre";
  const RENK = { k: "#ff5a4e", s: "#ffc23a", m: "#2f86e0", y: "#2fb36a", t: "#a8693a", p: "#ff7ab8", z: "#2b2f3a", o: "#ff8a1f" };
  const RENK_AD = { k: "Kırmızı", s: "Sarı", m: "Mavi", y: "Yeşil", t: "Kahverengi", p: "Pembe", z: "Siyah", o: "Turuncu" };

  // [ad, resim satırları]; tekli: şifre her kare için tek işaret (sayısız)
  const R = (ad, satirlar, tekli = false) => ({ ad, satirlar, tekli });
  const BOLUMLER = [
    R("Artı", [".k.", "kkk", ".k."], true),
    R("Çarpı", ["m.m", ".m.", "m.m"], true),
    R("Çerçeve", ["yyy", "y.y", "yyy"], true),

    R("Kalp", [".k.k.", "kkkkk", "kkkkk", ".kkk.", "..k.."], true),
    R("Ev", [".mm.", "mmmm", "m..m", "m..m"], true),
    R("Ok", ["..y..", ".yyy.", "y.y.y", "..y..", "..y.."], true),

    R("Yıldız", ["..s..", "sssss", ".sss.", ".s.s.", "s...s"]),
    R("Kupa", ["m...m", "mmmmm", ".mmm.", "..m..", ".mmm."]),
    R("Gülen yüz", [".sss.", "s.s.s", "sssss", "s...s", ".sss."]),
    R("Mantar", [".kkk.", "kkkkk", "kkkkk", "..k..", "..k.."]),
    R("Kedi", ["k...k", "kk.kk", "kkkkk", "k.k.k", ".kkk."]),
    R("Çam ağacı", ["..y..", ".yyy.", "yyyyy", "..y..", "..y.."]),

    R("Elma", ["...y.", "..y..", ".kkk.", "kkkkk", ".kkk."]),
    R("Lale", [".k.k.", "kkkkk", ".kkk.", "..y..", ".yy.."]),
    R("Ağaç", ["..y..", ".yyy.", "yyyyy", "..t..", "..t.."]),
    R("Benekli mantar", [".kkk.", "kskks", "kkkkk", "..s..", "..s.."]),
    R("Balık", [".mm..m", "msmmmm", "mmmmmm", ".mm..m"]),
    R("Kırmızı çatılı ev", ["..kk..", ".kkkk.", "kkkkkk", ".m..m.", ".m..m.", ".mmmm."]),

    R("Kelebek", ["p.....p", "pp.z.pp", "ppzzzpp", "pp.z.pp", "p.....p"]),
    R("Dondurma", [".ppp.", "ppppp", "ppppp", "sssss", ".sss.", ".sss.", "..s.."]),
    R("Büyük kalp", [".kk.kk.", "kpkkkkk", "kkkkkkk", ".kkkkk.", "..kkk..", "...k..."]),
    R("Şemsiye", ["...k...", ".kkkkk.", "kkkkkkk", "k.k.k.k", "...t...", "...t...", "..tt..."]),
    R("Yelkenli", ["...k...", "...kk..", "...kkk.", "...z...", "mmmmmmm", ".mmmmm."]),
    R("Ördek", ["..ss...", ".szss..", ".sssso.", "ssssss.", ".ssss.."]),
    R("Roket", ["..k..", ".kmk.", ".mmm.", ".mzm.", ".mmm.", "mmmmm", "m.k.m", "..k.."]),
    R("Robot", [".m...m.", "..m.m..", ".mmmmm.", ".msmsm.", ".mmmmm.", ".mkkkm.", ".mmmmm."]),
    R("Araba", ["..mmmm..", ".msmsmm.", "mmmmmmmm", "mmmmmmmm", ".zz..zz."]),
    R("Kardan adam", ["..zzz..", ".zzzzz.", "..mmm..", "..mom..", "..mmm..", ".mmmmm.", ".mmmmm.", "..mmm.."]),
    R("Tavşan", [".p...p.", ".p...p.", ".pp.pp.", ".ppppp.", "ppzpzpp", "ppppppp", ".ppkpp.", "..ppp.."]),
    R("Kale", ["..s.....", "..ss....", "t.t.tt.t", "tttttttt", "tt.tt.tt", "tt.tt.tt", "tttttttt"]),
  ].map((b, i) => ({ ...b, grup: Uygulama.seviye(i), renkler: [...new Set(b.satirlar.join("").replace(/\./g, ""))] }));

  // Satır şifresi: art arda aynı olanların sayısı ve rengi ("." = boş)
  function sifre(satir) {
    const out = [];
    for (const ch of satir) { const son = out[out.length - 1]; if (son && son.r === ch) son.n++; else out.push({ r: ch, n: 1 }); }
    return out;
  }

  const stil = `
  .sf { position: absolute; inset: 0; display: flex; flex-direction: column; background: linear-gradient(#f6f1ff, #ebe4fb); }
  .sf-sahne { --k: 56px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 22px; padding: 8px 16px 16px; overflow: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .sf-sahne.dikey { flex-direction: column; gap: 12px; justify-content: safe center; }
  .sf-tablo { display: grid; grid-template-columns: auto auto; column-gap: 12px; row-gap: 4px; padding: 14px; border-radius: 24px; background: #fff; box-shadow: 0 8px 0 rgba(29,40,70,.12); }
  .sf-kod { display: flex; flex-wrap: wrap; align-items: center; align-content: center; justify-content: flex-end; gap: 3px 4px; min-height: var(--k); max-width: var(--kodW, none); }
  .sf-kod .hap { display: inline-flex; align-items: center; gap: 3px; padding: 3px 5px 3px 6px; border-radius: 999px; background: #f1f4f9; font-family: var(--f-baslik); font-weight: 800; font-size: max(13px, calc(var(--k) * .36)); color: #3b4458; line-height: 1; }
  .sf-kod .nokta { width: max(13px, calc(var(--k) * .36)); height: max(13px, calc(var(--k) * .36)); border-radius: 50%; flex: none; }
  .sf-kod .nokta.bos { background: #fff; border: 2px dashed #9aa7b8; box-sizing: border-box; }
  .sf-kod.tekli .hap { padding: 3px; }
  .sf-kod .tamam { width: calc(var(--k) * .42); height: calc(var(--k) * .42); border-radius: 50%; background: var(--yesil); color: #fff; display: grid; place-items: center; font-weight: 900; font-size: calc(var(--k) * .3); opacity: 0; transform: scale(.4); transition: .25s; }
  .sf-kod.dogru .tamam { opacity: 1; transform: none; }
  .sf-kod.dogru .hap { background: #d8f5e3; }
  .sf-satir { display: flex; gap: 4px; }
  .sf-kare { width: var(--k); height: var(--k); border-radius: 8px; background: #f4f6fa; box-shadow: inset 0 0 0 2px #e1e7f0; cursor: pointer; transition: background .12s, transform .12s; }
  .sf-kare.dolu { box-shadow: inset 0 -5px 0 rgba(0,0,0,.15); }
  .sf-kare.son { animation: sf-zipla .5s ease-out both; }
  @keyframes sf-zipla { 40% { transform: scale(1.18); } }
  .sf-yan { display: grid; justify-items: center; gap: 14px; }
  .sf-palet { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px; border-radius: 22px; background: rgba(255,255,255,.8); }
  .sf-renk { width: 64px; height: 64px; padding: 0; border: 0; border-radius: 50%; cursor: pointer; box-shadow: 0 5px 0 rgba(29,40,70,.16); display: grid; place-items: center; }
  .sf-renk svg { width: 60%; height: 60%; }
  .sf-renk.secili { outline: 5px solid var(--murekkep, #1d2846); outline-offset: 3px; transform: translateY(-3px); }
  .sf-onizleme { display: grid; gap: 2px; padding: 8px; border-radius: 14px; background: #fff; box-shadow: 0 4px 0 rgba(29,40,70,.1); }
  .sf-onizleme i { width: 12px; height: 12px; border-radius: 3px; background: #eef1f6; }
  .sf-ad { font-family: var(--f-baslik); font-weight: 800; font-size: 1.5rem; color: var(--mor); opacity: 0; transition: opacity .4s; }
  .sf-ad.goster { opacity: 1; }
  `;
  const silgi = `<svg viewBox="0 0 100 100" aria-hidden="true"><g transform="rotate(-30 50 50)"><rect x="18" y="34" width="64" height="32" rx="8" fill="#fff" stroke="#9aa7b8" stroke-width="4"/><rect x="18" y="34" width="26" height="32" rx="8" fill="#ff7ab8"/></g></svg>`;
  const bekle = (ms) => new Promise((res) => setTimeout(res, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("sf-stil")) { const st = document.createElement("style"); st.id = "sf-stil"; st.textContent = stil; document.head.appendChild(st); }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="sf"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="sf-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".sf-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }
  function navCiz() { d.api.bolumNoktalari(d.nav, { etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti, sec: (i) => { d.api.ses.tik(); yukle(i); } }); }

  function kodHtml(satir, tekli) {
    return sifre(satir).map(({ r, n }) => {
      const nokta = `<span class="nokta${r === "." ? " bos" : ""}" style="${r === "." ? "" : `background:${RENK[r]}`}"></span>`;
      if (tekli) return Array.from({ length: n }, () => `<span class="hap">${nokta}</span>`).join("");
      return `<span class="hap">${n}${nokta}</span>`;
    }).join("") + `<span class="tamam" aria-hidden="true">✓</span>`;
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.bitti = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.tuval = b.satirlar.map((s) => [...s].map(() => "."));
    d.secili = b.renkler[0];
    const C = b.satirlar[0].length;
    d.sahne.innerHTML = `
      <div class="sf-tablo">${b.satirlar.map((s, r) => `<div class="sf-kod${b.tekli ? " tekli" : ""}" data-r="${r}">${kodHtml(s, b.tekli)}</div><div class="sf-satir">${[...s].map((_, c) => `<div class="sf-kare" data-r="${r}" data-c="${c}"></div>`).join("")}</div>`).join("")}</div>
      <div class="sf-yan">
        <div class="sf-palet" aria-label="Renkler">${b.renkler.map((r) => `<button class="sf-renk" type="button" data-r="${r}" style="background:${RENK[r]}" aria-label="${RENK_AD[r]}"></button>`).join("")}<button class="sf-renk" type="button" data-r="." style="background:#fff" aria-label="Silgi">${silgi}</button></div>
        <div class="sf-onizleme" style="grid-template-columns:repeat(${C},12px)" aria-hidden="true">${b.satirlar.map((s) => [...s].map(() => "<i></i>").join("")).join("")}</div>
        <div class="sf-ad">${b.ad}</div>
      </div>`;
    d.sahne.querySelectorAll(".sf-renk").forEach((el) => (el.onclick = () => { d.secili = el.dataset.r; paletCiz(); d.api.ses.tik(); }));
    d.tablo = d.sahne.querySelector(".sf-tablo");
    d.tablo.addEventListener("pointerdown", boyaBasla);
    paletCiz();
    ciz();
    boyutla();
  }
  function paletCiz() { d.sahne.querySelectorAll(".sf-renk").forEach((el) => el.classList.toggle("secili", el.dataset.r === d.secili)); }
  const kare = (r, c) => d.tablo.querySelector(`.sf-kare[data-r="${r}"][data-c="${c}"]`);
  function ciz() {
    const b = BOLUMLER[d.idx];
    d.tuval.forEach((s, r) => {
      s.forEach((v, c) => { const el = kare(r, c); el.style.background = v === "." ? "" : RENK[v]; el.classList.toggle("dolu", v !== "."); });
      d.tablo.querySelector(`.sf-kod[data-r="${r}"]`).classList.toggle("dogru", s.join("") === b.satirlar[r]);
    });
    const on = d.sahne.querySelectorAll(".sf-onizleme i");
    let k = 0;
    d.tuval.forEach((s) => s.forEach((v) => { on[k++].style.background = v === "." ? "" : RENK[v]; }));
  }
  function boyutla() {
    if (!d || !d.tablo) return;
    const b = BOLUMLER[d.idx], R = b.satirlar.length, C = b.satirlar[0].length;
    const enCokHap = Math.max(...b.satirlar.map((s) => (b.tekli ? s.length : sifre(s).length)));
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 24;
    if (W < 50 || H < 50) return;
    const dikey = W < H;
    d.sahne.classList.toggle("dikey", dikey);
    // satır genişliği ≈ C kare + şifre (hap başına ~0.95 kare) + boşluklar
    const genBirim = C + enCokHap * (b.tekli ? 0.55 : 0.95) + 1.3;
    let k = dikey ? Math.min((W - 40) / genBirim, (H - 230) / (R * 1.08)) : Math.min((W - 300) / genBirim, (H - 40) / (R * 1.08));
    let kodW = "none";
    if (dikey && k < 34) {
      // Dar ekran: şifre en çok genişliğin %40'ını alır ve gerekirse iki satıra iner
      const ic = W - 40;
      k = Math.min((ic * 0.64) / C - 4, (H - 230) / (R * 1.6));
      kodW = Math.floor(ic * 0.36) + "px";
    }
    k = Math.max(22, Math.min(72, Math.floor(k)));
    d.sahne.style.setProperty("--k", k + "px");
    d.sahne.style.setProperty("--kodW", kodW);
  }

  // Boyama: dokunulan kare seçili renkteyse silinir (silgi modu), değilse boyanır; sürükleyince aynısı sürer
  function boyaBasla(e) {
    const el = e.target.closest(".sf-kare");
    if (!el || d.bitti) return;
    e.preventDefault();
    const r0 = +el.dataset.r, c0 = +el.dataset.c;
    const yeni = d.tuval[r0][c0] === d.secili ? "." : d.secili;
    const boya = (r, c) => { if (d.tuval[r][c] === yeni) return; d.tuval[r][c] = yeni; ciz(); d.api.ses.adim((r + c) % 8); };
    boya(r0, c0);
    const hareket = (ev) => {
      const alt = document.elementFromPoint(ev.clientX, ev.clientY), k = alt && alt.closest(".sf-kare");
      if (k && d.tablo.contains(k)) boya(+k.dataset.r, +k.dataset.c);
    };
    const birak = () => { window.removeEventListener("pointermove", hareket); window.removeEventListener("pointerup", birak); window.removeEventListener("pointercancel", birak); kontrol(); };
    window.addEventListener("pointermove", hareket); window.addEventListener("pointerup", birak); window.addEventListener("pointercancel", birak);
  }

  async function kontrol() {
    const b = BOLUMLER[d.idx];
    if (d.bitti || !d.tuval.every((s, r) => s.join("") === b.satirlar[r])) return;
    d.bitti = true;
    const benim = d.uid;
    d.api.ses.yerlesti();
    // Resim belirir: dolu kareler sırayla zıplar
    let k = 0;
    d.tuval.forEach((s, r) => s.forEach((v, c) => { if (v !== ".") { const el = kare(r, c); el.style.animationDelay = (k++ * 25) + "ms"; el.classList.add("son"); } }));
    d.sahne.querySelector(".sf-ad").classList.add("goster");
    await bekle(700 + k * 25);
    if (!d || benim !== d.uid) return;
    const son = d.idx === BOLUMLER.length - 1;
    if (!d.ilerleme.bitti.includes(d.idx)) d.ilerleme.bitti.push(d.idx);
    if (!son) d.ilerleme.son = d.idx + 1;
    d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    const herkes = d.ilerleme.bitti.length >= BOLUMLER.length;
    d.api.kutla(d.sahne, { mesaj: son ? (herkes ? "Bütün şifreleri çözdün, minik kodcu!" : "Son resim de çıktı!") : `Şifre çözüldü: ${b.ad}!`, son, ileri: () => yukle(d.idx + 1), bastan: () => { d.ilerleme.bitti = []; yukle(0); } });
  }

  window.SIFRE_BOLUMLER = BOLUMLER; // test için
  window.SIFRE_SIFRE = sifre;

  window.Uygulama.oyunEkle(24, {
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ipucu() {
      if (!d || d.bitti) return [];
      const b = BOLUMLER[d.idx];
      for (let r = 0; r < b.satirlar.length; r++) for (let c = 0; c < b.satirlar[r].length; c++) {
        const hedef = b.satirlar[r][c];
        if (d.tuval[r][c] !== hedef) {
          const renk = hedef === "." ? d.tuval[r][c] : hedef;
          return [{ el: d.sahne.querySelector(`.sf-kod[data-r="${r}"]`) }, { el: d.sahne.querySelector(`.sf-renk[data-r="${renk}"]`) }, { el: kare(r, c) }];
        }
      }
      return [];
    },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      const res = [".k.k.", "kkkkk", ".kkk.", "..k.."];
      return `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="0 0 60 30" style="width:56px"><g font-family="Baloo 2, sans-serif" font-weight="800" font-size="11" fill="#3b4458"><text x="2" y="12">1</text><circle cx="14" cy="8" r="4" fill="#ff5a4e"/><text x="22" y="12">2</text><circle cx="34" cy="8" r="4" fill="#fff" stroke="#9aa7b8" stroke-dasharray="2 2"/></g></svg><svg viewBox="0 0 50 40" style="width:50px">${res.map((s, r) => [...s].map((ch, c) => `<rect x="${c * 10}" y="${r * 10}" width="9" height="9" rx="2" fill="${ch === "." ? "#eef1f6" : "#ff5a4e"}"/>`).join("")).join("")}</svg></div>`;
    },
  });
})();
