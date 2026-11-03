// Minik Kodcular hesap işlemleri: kullanıcı adı + şifreyle kayıt ve giriş, e-postayla şifre sıfırlama.
// Supabase Auth e-posta ister; e-postası olmayan hesaplar için gönderilmeyen, kullanıcı adından türetilmiş bir adres kullanılır.
// Hesaplar sunucuda onaylı oluşturulur, bu yüzden kayıtta e-posta gönderilmez.
// Yayın: Supabase'de "hesap" adıyla, verify_jwt kapalı (fonksiyon kendi doğrulamasını yapar).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVIS = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const yonetici = createClient(URL_, SERVIS, { auth: { persistSession: false, autoRefreshToken: false } });
const anonim = () => createClient(URL_, ANON, { auth: { persistSession: false, autoRefreshToken: false } });

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const cevap = (govde: unknown, durum = 200) => new Response(JSON.stringify(govde), { status: durum, headers: { ...CORS, "Content-Type": "application/json" } });
const hata = (kod: string, durum = 400) => cevap({ hata: kod }, durum);

const KULLANICI = /^[\p{L}\p{N}._-]{3,20}$/u;
const EPOSTA = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const SENTETIK = "@hesap.minikkodcular.com";
// Kullanıcı adından (Türkçe harfler dahil) her zaman aynı, geçerli bir e-posta yerel kısmı
const sentetik = (ad: string) => "k" + Array.from(new TextEncoder().encode(ad.toLocaleLowerCase("tr"))).map((b) => b.toString(16).padStart(2, "0")).join("") + SENTETIK;
const oturum = (s: { access_token: string; refresh_token: string }) => ({ access_token: s.access_token, refresh_token: s.refresh_token });
const maskele = (e: string) => { const [a, b] = e.split("@"); return a.slice(0, 2) + "***@" + b; };

async function profilBul(ad: string) {
  const { data } = await yonetici.from("profiller").select("id, kullanici_adi, eposta").ilike("kullanici_adi", ad.replace(/[%_\\]/g, "\\$&")).maybeSingle();
  if (!data) return null;
  const { data: u } = await yonetici.auth.admin.getUserById(data.id);
  return u?.user ? { ...data, girisEposta: u.user.email! } : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return hata("yontem", 405);
  let g: Record<string, string>;
  try { g = await req.json(); } catch { return hata("gecersiz"); }
  const ad = String(g.kullanici || "").trim(), sifre = String(g.sifre || "");

  if (g.islem === "kayit") {
    if (!KULLANICI.test(ad)) return hata("kullanici_gecersiz");
    if (sifre.length < 6) return hata("sifre_kisa");
    const eposta = String(g.eposta || "").trim().toLowerCase();
    if (eposta && !EPOSTA.test(eposta)) return hata("eposta_gecersiz");
    if (await profilBul(ad)) return hata("kullanici_alinmis", 409);
    const { data, error } = await yonetici.auth.admin.createUser({ email: eposta || sentetik(ad), password: sifre, email_confirm: true, user_metadata: { kullanici_adi: ad } });
    if (error || !data.user) return hata(/already|registered|exists/i.test(error?.message || "") ? "eposta_alinmis" : "kayit_olmadi", 409);
    const { error: pe } = await yonetici.from("profiller").insert({ id: data.user.id, kullanici_adi: ad, eposta: eposta || null });
    if (pe) { await yonetici.auth.admin.deleteUser(data.user.id); return hata("kullanici_alinmis", 409); }
    const { data: s, error: se } = await anonim().auth.signInWithPassword({ email: data.user.email!, password: sifre });
    if (se || !s.session) return hata("giris_olmadi", 500);
    return cevap({ oturum: oturum(s.session), kullanici: ad });
  }

  if (g.islem === "giris") {
    const p = ad && (await profilBul(ad));
    if (!p || !sifre) return hata("bilgi_yanlis", 401);
    const { data: s, error } = await anonim().auth.signInWithPassword({ email: p.girisEposta, password: sifre });
    if (error || !s.session) return hata(/rate|too many/i.test(error?.message || "") ? "cok_deneme" : "bilgi_yanlis", 401);
    return cevap({ oturum: oturum(s.session), kullanici: p.kullanici_adi });
  }

  if (g.islem === "sifre_iste") {
    const p = ad && (await profilBul(ad));
    // Kullanıcı adının var olup olmadığı belli olmasın: e-postası olmayanlar için de aynı cevap
    if (!p || !p.eposta) return cevap({ gonderildi: false });
    const { error } = await anonim().auth.resetPasswordForEmail(p.girisEposta);
    if (error) return hata(/rate|seconds/i.test(error.message) ? "cok_deneme" : "gonderilemedi", 429);
    return cevap({ gonderildi: true, eposta: maskele(p.girisEposta) });
  }

  if (g.islem === "sifre_yenile") {
    const kod = String(g.kod || "").replace(/\s/g, "");
    if (sifre.length < 6) return hata("sifre_kisa");
    const p = ad && (await profilBul(ad));
    if (!p || !p.eposta || !/^\d{6,10}$/.test(kod)) return hata("kod_yanlis", 401);
    const a = anonim();
    const { data: v, error } = await a.auth.verifyOtp({ email: p.girisEposta, token: kod, type: "recovery" });
    if (error || !v.user) return hata("kod_yanlis", 401);
    const { error: ue } = await yonetici.auth.admin.updateUserById(v.user.id, { password: sifre });
    if (ue) return hata("sifre_kisa");
    const { data: s } = await anonim().auth.signInWithPassword({ email: p.girisEposta, password: sifre });
    return cevap({ oturum: s.session ? oturum(s.session) : null, kullanici: p.kullanici_adi });
  }

  return hata("islem");
});
