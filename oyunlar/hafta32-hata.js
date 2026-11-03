/* 32. Hafta: Hata Avcısı (hata ayıklama: bozuk programı bul ve düzelt; döngü yok).
   Bahçıvan robot çiçek tarhı ekiyor. Program hazır gelir ama bozuktur (🔧): önce çalıştırıp
   tarhın örnekten nerede ayrıldığını gör, sonra yanlış çiçeğe dokunup doğrusunu koy.
   30 bölüm: çok kolay 3, kolay 3, orta 6, zor 6, çok zor 12 (son bölümlerde iki hata). */
(function () {
  const M = window.DonguMotoru;
  const RENK = { k: ["#ff5a4e", "Kırmızı lale"], m: ["#2f86e0", "Mavi çiçek"], s: ["#ffc23a", "Sarı papatya"], p: ["#ff7ab8", "Pembe gül"] };
  const J = {};
  for (const [t, [r, ad]] of Object.entries(RENK)) J[t] = { ad, svg: `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="0" y="0" width="100" height="100" rx="14" fill="#c9a06b"/><path d="M50 52 V88" stroke="#3d9a3d" stroke-width="7"/><ellipse cx="36" cy="74" rx="11" ry="5" fill="#4fb04a" transform="rotate(-30 36 74)"/>${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="50" cy="22" rx="10" ry="15" fill="${r}" transform="rotate(${a} 50 38)"/>`).join("")}<circle cx="50" cy="38" r="9" fill="${t === "s" ? "#ff8a1f" : "#ffd23f"}"/></svg>` };
  J.c = { ad: "Çimen", svg: `<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="0" y="0" width="100" height="100" rx="14" fill="#8fd36a"/><path d="M20 80 l6 -24 l6 24 M44 80 l6 -30 l6 30 M68 80 l6 -22 l6 22" fill="#4fb04a"/></svg>` };

  const r = M.tohum(3232);
  const sec = (a) => a[Math.floor(r() * a.length)];
  const karistir = (a) => a.map((x) => [r(), x]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
  const Y = { t: "y" }, D = (n, ic, sabit, bas) => ({ t: "d", n, sabit, bas, ic });
  const tum = Object.keys(J);

  // Döngüsüz: program düz bir çiçek dizisidir. Doğru diziyi kur, sonra "hata" kadar yeri bozuk yap.
  function bolum({ uzunluk, hata, cesit, sutun }) {
    const kume = karistir(tum).slice(0, cesit);
    const cozum = Array.from({ length: uzunluk }, () => sec(kume));
    const hazir = [...cozum];
    karistir(cozum.map((_, k) => k)).slice(0, hata).forEach((k) => { hazir[k] = sec(kume.filter((t) => t !== cozum[k])); });
    const yapi = cozum.map(() => Y);
    return { yapi, cozum, hazir, hedef: [...cozum], palet: karistir(kume), sutun: sutun || Math.min(uzunluk, 6) };
  }
  // [uzunluk, hata sayısı, çiçek çeşidi]
  const T = [
    [3, 1, 2], [3, 1, 2], [4, 1, 2],
    [4, 1, 3], [5, 1, 3], [5, 1, 3],
    [5, 1, 3], [6, 1, 3], [6, 1, 3], [6, 2, 3], [7, 1, 4], [7, 2, 3],
    [7, 2, 4], [8, 1, 4], [8, 2, 4], [8, 2, 4], [9, 2, 4], [9, 2, 4],
    [8, 2, 5], [9, 2, 5], [9, 3, 4], [10, 2, 5], [10, 3, 4], [10, 3, 5],
    [10, 2, 5], [11, 3, 5], [11, 3, 5], [12, 2, 5], [12, 3, 5], [12, 3, 5],
  ].map(([uzunluk, hata, cesit]) => ({ uzunluk, hata, cesit }));
  const BOLUMLER = T.map((t, i) => ({ ...bolum(t), grup: Uygulama.seviye(i) }));

  M.olustur({
    no: 32, kayit: "hata", bolumler: BOLUMLER, jetonlar: J, cikti: "desen", hiz: 300,
    arkaPlan: "linear-gradient(#f0faec, #e2f3da)",
    mesaj: "Hatayı buldun, tarh düzeldi!", mesajSon: "Son hata da düzeldi!", mesajHepsi: "Bütün hataları avladın, minik hata avcısı!",
    kapak: () => `<div class="mini mini-ari" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-4 4-2.3-2.3a4 4 0 0 0-5-5L4 17.4 6.6 20 2 20l0-4.6z" fill="#5d6878"/></svg>${J.k.svg}${J.m.svg}${J.k.svg}</div>`,
  });
})();
