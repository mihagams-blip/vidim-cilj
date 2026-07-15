import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminApp } from "@/components/admin/AdminApp";
import { newsPostSelect, type NewsPost } from "@/lib/news";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { defaultSiteContent, mergeSiteContent } from "@/lib/site-content";
import "./admin.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Uredništvo", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return <AdminApp initialContent={structuredClone(defaultSiteContent)} initialPosts={[]} configured={false} userEmail="predogled@vidimcilj.si" userRole="setup" />;
  }

  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const { data: claimData } = await supabase.auth.getClaims();
  const email = String(claimData?.claims?.email ?? "");
  if (!email) redirect("/admin/login");

  const { data: access } = await supabase
    .from("admin_users")
    .select("email, role, active")
    .ilike("email", email)
    .eq("active", true)
    .maybeSingle();

  if (!access) return <AdminAccessDenied email={email} />;

  const [{ data: sectionRows }, { data: postRows }] = await Promise.all([
    supabase.from("site_sections").select("section_key, content").eq("locale", "sl"),
    supabase.from("posts").select(newsPostSelect).order("updated_at", { ascending: false }),
  ]);

  return (
    <AdminApp
      initialContent={mergeSiteContent(sectionRows)}
      initialPosts={(postRows ?? []) as NewsPost[]}
      configured
      userEmail={email}
      userRole={access.role === "admin" ? "admin" : "editor"}
    />
  );
}
