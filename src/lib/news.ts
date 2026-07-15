export type NewsPostStatus = "draft" | "published";

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  image_credit: string | null;
  status: NewsPostStatus;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const newsPostSelect =
  "id, slug, title, excerpt, body, category, cover_image_url, cover_image_alt, image_credit, status, featured, published_at, created_at, updated_at";

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatNewsDate(value: string | null) {
  if (!value) return "Osnutek";
  return new Intl.DateTimeFormat("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
