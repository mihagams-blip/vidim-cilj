import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleLoginButton } from "@/components/admin/GoogleLoginButton";
import { Logo } from "@/components/Logo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import "../admin.css";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const configured = isSupabaseConfigured();
  const params = await searchParams;

  if (configured) {
    const supabase = await createClient();
    const { data } = (await supabase?.auth.getClaims()) ?? { data: null };
    if (data?.claims) redirect("/admin");
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="login-title">
        <Link href="/" className="admin-login-brand"><Logo /></Link>
        <p className="admin-kicker">Uredništvo Vidim cilj</p>
        <h1 id="login-title">Dobrodošli nazaj.</h1>
        <p className="admin-login-intro">
          Prijavite se z odobrenim Google računom za urejanje spletne strani in objavo novic.
        </p>
        {params.error ? <p className="admin-inline-error" role="alert">{params.error}</p> : null}
        {configured ? (
          <GoogleLoginButton />
        ) : (
          <div className="admin-setup-notice">
            <strong>Supabase še ni povezan</strong>
            <p>Administracija je pripravljena za predogled. Po dodatku ključev se tukaj vključi Google prijava.</p>
            <Link href="/admin">Odpri predogled administracije</Link>
          </div>
        )}
        <Link className="admin-back-link" href="/">← Nazaj na spletno stran</Link>
      </section>
      <aside className="admin-login-art" aria-hidden="true">
        <span>UREJAJ.</span><span>OBJAVI.</span><span>PREMAKNI.</span>
      </aside>
    </main>
  );
}
