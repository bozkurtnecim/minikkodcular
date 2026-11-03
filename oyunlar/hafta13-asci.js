/* 13. Hafta: Minik Aşçı (sıralama: tarifi adım adım uygulamak).
   Müşterinin resimli siparişine bak, malzemeleri tabağa alttan üste diz, zile bas.
   En üstteki kata dokununca geri alınır. Okuma gerektirmez.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12
   (çok zorun son 6'sında sipariş birkaç saniye görünür, sonra kapanır). */
(function () {
  const KAYIT = "asci";

  // ---------- Malzemeler: 200 genişlik, h yükseklik (yandan görünüş) ----------
  const M = {
    ekAlt: { h: 30, c: `<path d="M8 4 H192 Q196 4 194 12 Q186 30 100 30 Q14 30 6 12 Q4 4 8 4 Z" fill="#e0a95a"/><path d="M10 6 H190" stroke="#f2c27a" stroke-width="4" stroke-linecap="round"/>` },
    ekUst: { h: 52, c: `<path d="M6 50 Q2 6 100 4 Q198 6 194 50 Z" fill="#e8b062"/><path d="M30 20 Q100 2 170 20" stroke="#f6cf8e" stroke-width="6" fill="none" stroke-linecap="round"/>${[[50, 26], [80, 16], [110, 14], [140, 20], [66, 36], [126, 34], [96, 28]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.2" fill="#fff8e0" transform="rotate(20 ${x} ${y})"/>`).join("")}` },
    kofte: { h: 26, c: `<rect x="10" y="2" width="180" height="22" rx="11" fill="#7a4520"/>${[[40, 10], [80, 16], [120, 9], [160, 15], [60, 18], [140, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#5a3010"/>`).join("")}` },
    peynir: { h: 16, c: `<path d="M4 2 H196 V8 L176 8 L166 16 L156 8 L60 8 L50 16 L40 8 L4 8 Z" fill="#ffc928"/>` },
    domates: { h: 14, c: `<ellipse cx="58" cy="7" rx="50" ry="6" fill="#e8312f"/><ellipse cx="142" cy="7" rx="50" ry="6" fill="#e8312f"/><ellipse cx="58" cy="6" rx="34" ry="3" fill="#ff7a6a"/><ellipse cx="142" cy="6" rx="34" ry="3" fill="#ff7a6a"/>` },
    marul: { h: 16, c: `<path d="M2 8 Q12 0 22 8 T42 8 T62 8 T82 8 T102 8 T122 8 T142 8 T162 8 T182 8 T198 8 L196 14 H4 Z" fill="#5ac85a"/>` },
    sogan: { h: 12, c: `${[40, 90, 140].map((x) => `<ellipse cx="${x + 10}" cy="6" rx="26" ry="5" fill="none" stroke="#f2e6ff" stroke-width="4"/>`).join("")}` },
    tursu: { h: 12, c: `${[30, 75, 120, 165].map((x) => `<ellipse cx="${x}" cy="6" rx="18" ry="5" fill="#7fbf3a" stroke="#5a9a2a" stroke-width="2"/>`).join("")}` },
    tost: { h: 30, c: `<rect x="8" y="2" width="184" height="26" rx="8" fill="#c48a40"/><rect x="14" y="7" width="172" height="16" rx="5" fill="#f6dca6"/>` },
    yumurta: { h: 14, c: `<ellipse cx="100" cy="7" rx="88" ry="6" fill="#fff"/><ellipse cx="100" cy="7" rx="22" ry="5" fill="#ffc928"/>` },
    kekKat: { h: 30, c: `<rect x="14" y="2" width="172" height="26" rx="6" fill="#c9823c"/><path d="M14 10 H186" stroke="#d9944a" stroke-width="3"/>` },
    krema: { h: 14, c: `<path d="M10 6 Q20 14 30 6 T50 6 T70 6 T90 6 T110 6 T130 6 T150 6 T170 6 T190 6 V0 H10 Z" fill="#fff4f0"/><rect x="10" y="0" width="180" height="6" fill="#fff4f0"/>` },
    cilekKat: { h: 24, c: `<rect x="14" y="2" width="172" height="20" rx="6" fill="#ff8fb0"/>${[40, 80, 120, 160].map((x) => `<circle cx="${x}" cy="12" r="3" fill="#ff5d8f"/>`).join("")}` },
    cikKat: { h: 24, c: `<rect x="14" y="2" width="172" height="20" rx="6" fill="#6a3c20"/><path d="M14 8 H186" stroke="#8a5a33" stroke-width="3"/>` },
    cilekTepe: { h: 34, c: `<path d="M100 32 C82 24 76 12 80 6 C84 0 94 2 100 6 C106 2 116 0 120 6 C124 12 118 24 100 32 Z" fill="#ec3a3f"/><path d="M100 8 L90 0 H110 Z" fill="#3cae4f"/>${[[94, 14], [106, 16], [100, 22]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.5" ry="2.5" fill="#ffe27a"/>`).join("")}` },
    kulah: { h: 64, c: `<path d="M66 0 H134 L100 64 Z" fill="#e0a95a"/><path d="M74 8 L118 30 M86 4 L126 14 M80 22 L108 48 M120 8 L92 44" stroke="#c48a40" stroke-width="3"/>` },
    vanilya: { h: 40, c: `<path d="M60 36 Q56 4 100 2 Q144 4 140 36 Q130 30 120 36 Q110 30 100 36 Q90 30 80 36 Q70 30 60 36 Z" fill="#fff3d6"/>` },
    cikTop: { h: 40, c: `<path d="M60 36 Q56 4 100 2 Q144 4 140 36 Q130 30 120 36 Q110 30 100 36 Q90 30 80 36 Q70 30 60 36 Z" fill="#7a4520"/>` },
    cilekTop: { h: 40, c: `<path d="M60 36 Q56 4 100 2 Q144 4 140 36 Q130 30 120 36 Q110 30 100 36 Q90 30 80 36 Q70 30 60 36 Z" fill="#ff9bc2"/>` },
    kiraz: { h: 26, c: `<path d="M100 12 Q104 2 114 0" stroke="#3d8a33" stroke-width="3" fill="none"/><circle cx="100" cy="17" r="9" fill="#e8262b"/><circle cx="97" cy="14" r="2.5" fill="#fff" opacity=".7"/>` },
    pankek: { h: 20, c: `<rect x="16" y="2" width="168" height="16" rx="8" fill="#e8b062"/><path d="M24 6 H176" stroke="#f6cf8e" stroke-width="3" stroke-linecap="round"/>` },
    bal: { h: 14, c: `<path d="M20 2 H180 V6 Q170 14 164 6 Q140 12 120 6 Q100 14 86 6 Q60 12 40 6 Q30 14 20 6 Z" fill="#ffb21a"/>` },
    muz: { h: 12, c: `${[40, 80, 120, 160].map((x) => `<ellipse cx="${x}" cy="6" rx="16" ry="5" fill="#fff4b8" stroke="#ffd23f" stroke-width="2"/>`).join("")}` },
    tereyagi: { h: 16, c: `<rect x="80" y="2" width="40" height="12" rx="3" fill="#fff1a8" stroke="#f2d86a" stroke-width="2"/>` },
  };
  const ADI = { ekAlt: "alt ekmek", ekUst: "üst ekmek", kofte: "köfte", peynir: "peynir", domates: "domates", marul: "marul", sogan: "soğan", tursu: "turşu", tost: "ekmek dilimi", yumurta: "yumurta", kekKat: "kek", krema: "krema", cilekKat: "çilekli kat", cikKat: "çikolatalı kat", cilekTepe: "çilek", kulah: "külah", vanilya: "vanilya", cikTop: "çikolata", cilekTop: "çilekli top", kiraz: "kiraz", pankek: "pankek", bal: "bal", muz: "muz", tereyagi: "tereyağı" };
  // Raftaki simge: ince katlar okunabilsin diye dikeyde biraz kalınlaştırılır
  const simgeSvg = (id) => `<svg viewBox="0 0 200 ${M[id].h}" preserveAspectRatio="none" style="width:100%;height:${Math.max(34, Math.min(80, M[id].h * 1.6))}%" aria-hidden="true">${M[id].c}</svg>`;
  const katSvg = (id, w) => `<svg viewBox="0 0 200 ${M[id].h}" width="${w}" height="${(w * M[id].h) / 200}" aria-hidden="true">${M[id].c}</svg>`;

  // [siparis (alttan üste), şaşırtıcı malzemeler, müşteri]
  const B = (siparis, ek = [], musteri = "tavsan") => ({ siparis, ek, musteri });
  const BOLUMLER = [
    B(["ekAlt", "kofte", "ekUst"]),
    B(["kulah", "cilekTop", "kiraz"], [], "ayi"),
    B(["tost", "peynir", "tost"], [], "kedi"),

    B(["ekAlt", "kofte", "peynir", "ekUst"], ["domates"], "fil"),
    B(["pankek", "pankek", "bal", "muz"], ["tereyagi"], "kus"),
    B(["kekKat", "krema", "kekKat", "cilekTepe"], ["cikKat"], "civciv"),

    B(["ekAlt", "marul", "kofte", "peynir", "ekUst"], ["domates", "sogan"], "ayi"),
    B(["tost", "marul", "domates", "yumurta", "tost"], ["peynir", "tursu"], "tavsan"),
    B(["kulah", "cikTop", "cikTop", "vanilya", "kiraz"], ["cilekTop"], "kedi"),
    B(["kekKat", "cilekKat", "kekKat", "krema", "cilekTepe"], ["cikKat"], "kaplumbaga"),
    B(["pankek", "pankek", "pankek", "tereyagi", "bal"], ["muz", "cilekTepe"], "fil"),
    B(["ekAlt", "kofte", "domates", "marul", "ekUst"], ["peynir", "tursu"], "kus"),

    B(["ekAlt", "kofte", "peynir", "kofte", "peynir", "ekUst"], ["domates", "marul"], "ayi"),
    B(["tost", "peynir", "domates", "tost", "marul", "tost"], ["yumurta", "tursu"], "civciv"),
    B(["kekKat", "krema", "cilekKat", "krema", "kekKat", "cilekTepe"], ["cikKat"], "tavsan"),
    B(["kulah", "vanilya", "cilekTop", "cikTop", "bal", "kiraz"], ["muz"], "kedi"),
    B(["pankek", "muz", "pankek", "muz", "pankek", "bal"], ["tereyagi", "cilekTepe"], "fil"),
    B(["ekAlt", "marul", "domates", "kofte", "sogan", "ekUst"], ["peynir", "tursu"], "kaplumbaga"),

    B(["ekAlt", "kofte", "peynir", "domates", "marul", "sogan", "ekUst"], ["tursu", "yumurta", "kofte"], "ayi"),
    B(["kekKat", "krema", "cikKat", "krema", "cilekKat", "krema", "cilekTepe"], ["kekKat", "muz"], "civciv"),
    B(["tost", "yumurta", "peynir", "tost", "domates", "marul", "tost"], ["tursu", "sogan"], "kus"),
    B(["kulah", "cikTop", "vanilya", "cilekTop", "krema", "kiraz"], ["bal", "muz", "cikTop"], "tavsan"),
    B(["pankek", "tereyagi", "pankek", "bal", "pankek", "muz", "cilekTepe"], ["krema", "kiraz"], "kedi"),
    B(["ekAlt", "tursu", "kofte", "peynir", "kofte", "domates", "ekUst"], ["marul", "sogan", "yumurta"], "fil"),

    B(["ekAlt", "kofte", "domates", "ekUst"], ["peynir", "marul"], "kaplumbaga"),
    B(["kulah", "cilekTop", "vanilya", "kiraz"], ["cikTop", "bal"], "ayi"),
    B(["tost", "peynir", "marul", "domates", "tost"], ["yumurta", "tursu"], "tavsan"),
    B(["kekKat", "cikKat", "krema", "kekKat", "cilekTepe"], ["cilekKat", "muz"], "civciv"),
    B(["pankek", "bal", "pankek", "muz", "pankek", "cilekTepe"], ["tereyagi", "krema"], "kus"),
    B(["ekAlt", "marul", "kofte", "peynir", "domates", "sogan", "ekUst"], ["tursu", "yumurta", "kofte"], "kedi"),
  ].map((b, i) => ({ ...b, gizli: i >= 24, grup: Uygulama.seviye(i) }));

  const stil = `
  .as { position: absolute; inset: 0; display: flex; flex-direction: column; --renk: var(--mavi); }
  .as-sahne { --w: 220px; --p: 70px; position: relative; flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; gap: 20px; padding: 6px 16px 14px; overflow: hidden; touch-action: none; user-select: none; -webkit-user-select: none; }
  .as-sahne.dikey { flex-direction: column; gap: 10px; }
  .as-sahne.dikey .as-musteri { grid-auto-flow: column; align-items: end; gap: 12px; }
  .as-sahne.dikey .as-hayvan { width: calc(var(--w) * .38); height: calc(var(--w) * .38); }
  .as-musteri { display: grid; justify-items: center; gap: 6px; }
  .as-balon { position: relative; display: grid; justify-items: center; align-content: end; gap: 0; min-width: calc(var(--w) * .5); padding: 12px 14px; border-radius: 22px; background: var(--kagit); box-shadow: 0 6px 0 rgba(29,40,70,.1); }
  .as-balon::after { content: ""; position: absolute; bottom: -14px; left: 50%; margin-left: -10px; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 16px solid var(--kagit); }
  .as-balon .yigin { display: flex; flex-direction: column-reverse; align-items: center; }
  .as-balon .yigin svg { display: block; }
  .as-balon.kapali .yigin { visibility: hidden; }
  .as-balon .soru { display: none; position: absolute; inset: 0; place-items: center; font-family: var(--f-baslik); font-weight: 800; font-size: 3rem; color: var(--cizgi); }
  .as-balon.kapali .soru { display: grid; }
  .as-hayvan { width: calc(var(--w) * .5); height: calc(var(--w) * .5); transition: transform .3s; }
  .as-hayvan img { width: 100%; height: 100%; display: block; }
  .as-hayvan.mutlu { animation: as-zipla .5s 2; }
  .as-hayvan.uzgun { animation: as-salla .5s 2; }
  .as-goz { width: 54px; height: 54px; border: 0; border-radius: 50%; background: var(--mor); color: #fff; display: grid; place-items: center; cursor: pointer; box-shadow: 0 5px 0 rgba(29,40,70,.2); }
  .as-goz svg { width: 28px; height: 28px; }
  .as-mutfak { display: grid; justify-items: center; gap: 12px; min-width: 0; }
  .as-tezgah { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; width: calc(var(--w) * 1.25); min-height: calc(var(--w) * .9); padding-bottom: 4px; }
  .as-tabak { width: calc(var(--w) * 1.2); height: calc(var(--w) * .12); border-radius: 50%; background: #fff; box-shadow: inset 0 -6px 0 #dfe6ee, 0 4px 0 rgba(29,40,70,.12); flex: none; }
  .as-yigin { display: flex; flex-direction: column-reverse; align-items: center; margin-bottom: calc(var(--w) * -.04); }
  .as-kat { display: block; position: relative; animation: as-dus .3s cubic-bezier(.3,1.6,.5,1); }
  .as-kat svg { display: block; }
  .as-kat.ust { cursor: pointer; }
  .as-kat.dogru::after { content: "✓"; position: absolute; right: -30px; top: 50%; margin-top: -11px; width: 22px; height: 22px; border-radius: 50%; background: var(--yesil); color: #fff; font-size: 13px; font-weight: 900; display: grid; place-items: center; }
  .as-kat.yanlis { animation: as-salla .5s 2; filter: drop-shadow(0 0 6px var(--kirmizi)); }
  .as-tezgah.hedef .as-tabak { box-shadow: inset 0 -6px 0 #dfe6ee, 0 0 0 6px var(--mavi); }
  .as-raf { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px 14px; border-radius: 22px; border: 3px dashed var(--cizgi); background: var(--zemin-2); max-width: 100%; box-sizing: border-box; }
  .as-malzeme { width: calc(var(--p) * 1.3); height: var(--p); padding: 8px 6px; border: 0; border-radius: 16px; background: #fbe6c8; box-shadow: 0 5px 0 rgba(29,40,70,.14); display: grid; place-items: center; cursor: grab; touch-action: none; }
  .as-malzeme svg { display: block; pointer-events: none; }
  .as-tasinan { position: fixed; z-index: 50; pointer-events: none; transform: translate(-50%, -50%) scale(1.05); filter: drop-shadow(0 10px 8px rgba(29,40,70,.3)); }
  .as-tasinan svg { display: block; }
  .as-zil { display: inline-flex; align-items: center; gap: 10px; min-height: 60px; padding: 0 24px; border: 0; border-radius: 999px; background: var(--yesil); color: #fff; font-family: var(--f-baslik); font-weight: 800; font-size: 1.35rem; box-shadow: 0 7px 0 #1f8a4f; cursor: pointer; }
  .as-zil svg { width: 30px; height: 30px; }
  .as-zil:disabled { background: #b9c6d6; box-shadow: 0 7px 0 #98a6b8; cursor: default; }
  @keyframes as-dus { from { transform: translateY(-40px); opacity: 0; } }
  @keyframes as-salla { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
  @keyframes as-zipla { 50% { transform: translateY(-16px); } }
  `;

  const zilIkon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 18h16M6 18a6 6 0 0 1 12 0M12 9V7M10 7h4"/></svg>`;
  const gozIkon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const bekle = (ms) => new Promise((r) => setTimeout(r, ms));
  let d = null;

  function baslat(alan, api) {
    if (!document.getElementById("as-stil")) {
      const st = document.createElement("style"); st.id = "as-stil"; st.textContent = stil; document.head.appendChild(st);
    }
    const ilerleme = api.kayit.oku(KAYIT, { bitti: [], son: 0 });
    alan.innerHTML = `<div class="as"><nav class="nk-nav" aria-label="Bölümler"></nav><div class="as-sahne"></div></div>`;
    api.araclar.innerHTML = "";
    d = { alan, api, ilerleme, sahne: alan.querySelector(".as-sahne"), nav: alan.querySelector(".nk-nav"), idx: Math.min(ilerleme.son || 0, BOLUMLER.length - 1), uid: 0 };
    d.gozlemci = new ResizeObserver(() => boyutla());
    d.gozlemci.observe(d.sahne);
    yukle(d.idx);
  }

  function navCiz() {
    d.api.bolumNoktalari(d.nav, {
      etiketler: BOLUMLER.map((b) => b.grup), idx: d.idx, bitti: d.ilerleme.bitti,
      sec: (i) => { if (d.mesgul) return; d.api.ses.tik(); yukle(i); },
    });
  }

  function yukle(i) {
    const b = BOLUMLER[i];
    d.idx = i; d.uid++; d.mesgul = false;
    d.ilerleme.son = i; d.api.kayit.yaz(KAYIT, d.ilerleme);
    navCiz();
    d.yigin = [];
    // Rafta siparişteki ve şaşırtıcı malzemelerin her biri bir kez
    const raf = [...new Set([...b.siparis, ...b.ek])].map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
    d.sahne.innerHTML = `
      <div class="as-musteri">
        <div class="as-balon${b.gizli ? " kapali" : ""}"><div class="yigin"></div><div class="soru" aria-hidden="true">?</div></div>
        <div class="as-hayvan"><img src="${NESNELER[b.musteri].src}" alt="Müşteri"></div>
        ${b.gizli ? `<button class="as-goz" type="button" aria-label="Siparişe yeniden bak">${gozIkon}</button>` : ""}
      </div>
      <div class="as-mutfak">
        <div class="as-tezgah"><div class="as-yigin"></div><div class="as-tabak"></div></div>
        <div class="as-raf" aria-label="Malzemeler">${raf.map((m) => `<button class="as-malzeme" type="button" data-m="${m}" aria-label="${ADI[m]}">${simgeSvg(m)}</button>`).join("")}</div>
        <button class="as-zil" type="button" disabled>${zilIkon}<span>Servis et</span></button>
      </div>`;
    d.balon = d.sahne.querySelector(".as-balon");
    d.hayvan = d.sahne.querySelector(".as-hayvan");
    d.yiginEl = d.sahne.querySelector(".as-yigin");
    d.tezgah = d.sahne.querySelector(".as-tezgah");
    d.zil = d.sahne.querySelector(".as-zil");
    d.zil.onclick = servis;
    d.sahne.querySelectorAll(".as-malzeme").forEach(malzemeTasi);
    const goz = d.sahne.querySelector(".as-goz");
    if (goz) goz.onclick = siparisGoster;
    boyutla();
    if (b.gizli) siparisGoster();
  }

  // Gizli siparişler birkaç saniye görünür, sonra kapanır
  async function siparisGoster() {
    const benim = d.uid;
    d.balon.classList.remove("kapali");
    await bekle(2500 + BOLUMLER[d.idx].siparis.length * 350);
    if (!d || benim !== d.uid) return;
    d.balon.classList.add("kapali");
  }

  function boyutla() {
    if (!d || !d.balon) return;
    const b = BOLUMLER[d.idx];
    const W = d.sahne.clientWidth - 32, H = d.sahne.clientHeight - 20;
    if (W < 50 || H < 50) return;
    const dikey = W < H * 1.1;
    d.sahne.classList.toggle("dikey", dikey);
    const toplamH = b.siparis.reduce((t, m) => t + M[m].h, 0); // 200 genişlikte yığın yüksekliği
    const rafN = new Set([...b.siparis, ...b.ek]).size;
    let w;
    const rafSatir = dikey ? Math.ceil(rafN / Math.max(1, Math.floor((W - 30) / 96))) : Math.ceil(rafN / 4);
    if (dikey) {
      // müşteri satırı (balon yanında hayvan) + tabak + raf + zil
      const k = toplamH / 200;
      w = Math.min(W / 1.3, (H - 80 - rafSatir * 82 - 70 - 40) / (Math.max(0.5 * k + 0.15, 0.4) + k + 0.2));
    } else {
      w = Math.min(W / 2.2, (H - 100 - rafSatir * 82) / ((toplamH * 1.0) / 200 + 0.3), (H - 60) / ((0.5 * toplamH) / 200 + 0.7));
    }
    w = Math.max(110, Math.min(260, Math.floor(w)));
    const p = Math.max(56, Math.min(84, Math.floor((Math.min(W, dikey ? W : W - w * 0.8) - 30 - (rafN - 1) * 10) / rafN)));
    d.sahne.style.setProperty("--w", w + "px");
    d.sahne.style.setProperty("--p", p + "px");
    d.w = w;
    d.balon.querySelector(".yigin").innerHTML = b.siparis.map((m) => katSvg(m, w * 0.5)).join("");
    yiginCiz(false);
  }

  function yiginCiz(yeniEklendi = true) {
    d.yiginEl.innerHTML = d.yigin.map((m, j) => `<div class="as-kat${j === d.yigin.length - 1 ? " ust" : ""}" data-j="${j}" style="${yeniEklendi && j === d.yigin.length - 1 ? "" : "animation:none"}">${katSvg(m, d.w)}</div>`).join("");
    const ust = d.yiginEl.querySelector(".as-kat.ust");
    if (ust) ust.onclick = () => { if (d.mesgul) return; d.yigin.pop(); yiginCiz(false); d.api.ses.tik(); d.zil.disabled = !d.yigin.length; };
    d.zil.disabled = d.mesgul || !d.yigin.length;
  }

  function ekle(m) {
    if (d.mesgul || d.yigin.length >= 10) return;
    d.yigin.push(m);
    yiginCiz(true);
    d.api.ses.adim(d.yigin.length % 8);
  }

  function malzemeTasi(btn) {
    let bx, by, aktif = false, ucan = null, hedef = false;
    const m = btn.dataset.m;
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
        ucan.className = "as-tasinan";
        ucan.innerHTML = katSvg(m, d.w);
        document.body.appendChild(ucan);
      }
      ucan.style.left = e.clientX + "px"; ucan.style.top = e.clientY + "px";
      const alt = document.elementFromPoint(e.clientX, e.clientY);
      hedef = !!(alt && alt.closest(".as-tezgah"));
      d.tezgah.classList.toggle("hedef", hedef);
    });
    const birak = () => {
      if (!aktif) return;
      aktif = false;
      if (ucan) { ucan.remove(); ucan = null; d.tezgah.classList.remove("hedef"); if (hedef) ekle(m); hedef = false; }
      else ekle(m);
    };
    btn.addEventListener("pointerup", birak);
    btn.addEventListener("pointercancel", birak);
    btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ekle(m); } });
  }

  // Müşteri katları alttan üste kontrol eder
  async function servis() {
    if (d.mesgul || !d.yigin.length) return;
    d.mesgul = true; d.zil.disabled = true;
    const benim = d.uid, s = BOLUMLER[d.idx].siparis;
    d.api.ses.tik();
    const katlar = [...d.yiginEl.querySelectorAll(".as-kat")];
    let hata = -1;
    for (let j = 0; j < Math.max(s.length, d.yigin.length); j++) {
      await bekle(300);
      if (!d || benim !== d.uid) return;
      if (d.yigin[j] === s[j]) { katlar[j].classList.add("dogru"); d.api.ses.adim(j % 8); }
      else { hata = j; break; }
    }
    if (hata < 0) {
      d.hayvan.classList.add("mutlu");
      d.balon.classList.remove("kapali");
      d.api.ses.yerlesti();
      await bekle(1000);
      if (!d || benim !== d.uid) return;
      return bitir();
    }
    // Yanlış ya da eksik kat: o kat sallanır (eksikse en üst kat)
    const hedefKat = katlar[Math.min(hata, katlar.length - 1)];
    if (hedefKat) hedefKat.classList.add("yanlis");
    d.hayvan.classList.add("uzgun");
    d.api.ses.hata();
    await bekle(1300);
    if (!d || benim !== d.uid) return;
    d.hayvan.classList.remove("uzgun");
    katlar.forEach((k) => k.classList.remove("dogru", "yanlis"));
    d.mesgul = false; d.zil.disabled = !d.yigin.length;
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
      mesaj: son ? (herkes ? "Bütün siparişleri hazırladın, usta aşçı!" : "Son sipariş de hazır!") : "Afiyet olsun!",
      son,
      ileri: () => yukle(d.idx + 1),
      bastan: () => { d.ilerleme.bitti = []; yukle(0); },
    });
  }

  window.ASCI_BOLUMLER = BOLUMLER; // test için

  window.Uygulama.oyunEkle(13, {
    // Nasıl oynanır: elin göstereceği doğru hamle
    ipucu(tam) {
      if (!d) return [];
      const s = BOLUMLER[d.idx].siparis;
      return [...s.slice(0, tam ? undefined : 2).map((m) => ({ el: d.sahne.querySelector(`.as-malzeme[data-m="${m}"]`) })), { el: d.sahne.querySelector(".as-zil") }];
    },
    baslat,
    bitir() { if (d && d.gozlemci) d.gozlemci.disconnect(); if (d) d.uid++; d = null; },
    ilerleme() {
      let v; try { v = JSON.parse(localStorage.getItem("mk:" + KAYIT)); } catch (e) {}
      return { yapilan: v && v.bitti ? v.bitti.length : 0, toplam: BOLUMLER.length };
    },
    kapak() {
      return `<div class="mini mini-asci" aria-hidden="true">${["ekUst", "peynir", "kofte", "marul", "ekAlt"].map((m) => katSvg(m, 70)).join("")}</div>`;
    },
  });
})();
