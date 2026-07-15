import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { ArrowUpRight } from "@/components/icons";
import { formatNewsDate } from "@/lib/news";
import { getPublishedNews, getSiteContent } from "@/lib/public-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Novice",
  description: "Novice, zgodbe in aktualno dogajanje Centra Vidim cilj.",
};

export default async function NewsArchivePage() {
  const [content, posts] = await Promise.all([getSiteContent(), getPublishedNews()]);

  return (
    <>
      <a className="skip-link" href="#novice-vsebina">Preskoči na novice</a>
      <Header email={content.contact.email} homePrefix="/" />
      <main className="news-archive" id="novice-vsebina">
        <header className="news-archive-hero">
          <div className="shell">
            <p className="eyebrow"><span /> {content.news.eyebrow}</p>
            <h1>{content.news.title}<br /><em>{content.news.accent}</em></h1>
            <p>{content.news.intro}</p>
          </div>
        </header>
        <section className="shell news-archive-grid" aria-label="Objavljene novice">
          {posts.length ? posts.map((post) => (
            <article className="news-archive-card" key={post.id}>
              <Link href={`/novice/${post.slug}`} aria-label={`Preberi novico ${post.title}`}>
                <div className="news-archive-image">
                  <Image
                    src={post.cover_image_url || "/images/hero-swim-guidance.webp"}
                    alt={post.cover_image_alt || "Ilustrativna športna fotografija."}
                    fill
                    unoptimized={Boolean(post.cover_image_url)}
                    sizes="(max-width: 760px) 100vw, 33vw"
                  />
                </div>
                <div className="news-archive-copy">
                  <div><span>{post.category}</span><time dateTime={post.published_at ?? undefined}>{formatNewsDate(post.published_at)}</time></div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <strong>Preberi zgodbo <ArrowUpRight /></strong>
                </div>
              </Link>
            </article>
          )) : (
            <div className="news-public-empty">
              <span>01</span><h2>Prve novice so na poti.</h2><p>Do takrat spremljajte aktualno dogajanje na naši Facebook strani.</p>
              <a className="button button-primary" href={content.contact.facebookUrl} target="_blank" rel="noreferrer">Odpri Facebook <ArrowUpRight /></a>
            </div>
          )}
        </section>
      </main>
      <footer className="news-simple-footer"><div className="shell"><Logo /><span>© {new Date().getFullYear()} Zavod Center Vidim cilj</span><Link href="/">Nazaj na naslovnico</Link></div></footer>
    </>
  );
}
