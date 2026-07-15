"use client";

import { createClient } from "@/lib/supabase/client";

export function AdminAccessDenied({ email }: { email: string }) {
  async function signOut() {
    await createClient().auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <main className="admin-state-page">
      <div className="admin-state-card">
        <span className="admin-state-mark">!</span>
        <p className="admin-kicker">Dostop ni odobren</p>
        <h1>Ta račun še ni urednik.</h1>
        <p>Račun <strong>{email}</strong> je uspešno prijavljen, vendar ga je treba dodati na seznam dovoljenih urednikov.</p>
        <button className="admin-primary-button" type="button" onClick={signOut}>Odjava</button>
      </div>
    </main>
  );
}
