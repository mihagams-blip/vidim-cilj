"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/admin`;
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { access_type: "offline", prompt: "select_account" },
      },
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <button className="admin-google-button" type="button" onClick={signIn} disabled={loading}>
        <span aria-hidden="true">G</span>
        {loading ? "Odpiram Google …" : "Prijava z Googlom"}
      </button>
      {error ? <p className="admin-inline-error" role="alert">{error}</p> : null}
    </div>
  );
}
