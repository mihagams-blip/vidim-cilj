import { createClient as createPublicClient } from "@supabase/supabase-js";
import { defaultSiteContent, mergeSiteContent, type SiteContent } from "./site-content";
import { newsPostSelect, type NewsPost } from "./news";
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "./supabase/config";

function getPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createPublicClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = getPublicClient();
  if (!supabase) return structuredClone(defaultSiteContent);

  const { data, error } = await supabase
    .from("site_sections")
    .select("section_key, content")
    .eq("locale", "sl");

  if (error) {
    console.error("Vsebine ni bilo mogoče naložiti:", error.message);
    return structuredClone(defaultSiteContent);
  }

  return mergeSiteContent(data);
}

export async function getPublishedNews(limit?: number): Promise<NewsPost[]> {
  const supabase = getPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("posts")
    .select(newsPostSelect)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);
  const { data, error } = await query;

  if (error) {
    console.error("Novic ni bilo mogoče naložiti:", error.message);
    return [];
  }

  return (data ?? []) as NewsPost[];
}

export async function getPublishedNewsPost(slug: string): Promise<NewsPost | null> {
  const supabase = getPublicClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("posts")
    .select(newsPostSelect)
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  return (data as NewsPost | null) ?? null;
}
