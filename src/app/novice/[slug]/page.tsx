import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { ArrowUpRight } from "@/components/icons";
import { formatNewsDate } from "@/lib/news";
import { getPublishedNewsPost, getSiteContent } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedNewsPost(slug);
  if (!post) return { title: "Novica ni najdena" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [{ url: post.cover_image_url, alt: post.cover_image_alt ?? "" }] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [content, post] = await Promise.all([getSiteContent(), getPublishedNewsPost(slug)]);
  if (!post) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.cover_image_url || undefined,
    publisher: { "@type": "Organization", name: "Zavod Center Vidim cilj" },
  };
  const paragraphs = post.body.split(/\n\s*\n/).filter(Boolean);

  return (
    <>
      <a className="skip-link" href="#clanek">Preskoči na članek</a>
      <Header email={content.contact.email} homePrefix="/" />
      <main className="news-article" id="clanek">
        <header className="news-article-header shell">
          <Link href="/novice" className="news-back-link">← Vse novice</Link>
          <div className="news-article-meta"><span>{post.category}</span><time dateTime={post.published_at ?? undefined}>{formatNewsDate(post.published_at)}</time></div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </header>
        <div className="news-article-image shell">
          <Image
            src={post.cover_image_url || "/images/hero-swim-guidance.webp"}
            alt={post.cover_image_alt || "Ilustrativna športna fotografija."}
            fill
            priority
            unoptimized={Boolean(post.cover_image_url)}
            sizes="100vw"
          />
          {post.image_credit ? <small>{post.image_credit}</small> : null}
        </div>
        <article className="news-article-body">
          {paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>)}
        </article>
        <aside className="news-article-cta shell"><div><p className="eyebrow eyebrow-light"><span /> Ostanimo povezani</p><h2>Spremljajte naš naslednji korak.</h2></div><a className="button button-sun" href={content.contact.facebookUrl} target="_blank" rel="noreferrer">Facebook <ArrowUpRight /></a></aside>
      </main>
      <footer className="news-simple-footer"><div className="shell"><Logo /><span>© {new Date().getFullYear()} Zavod Center Vidim cilj</span><Link href="/novice">Vse novice</Link></div></footer>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
