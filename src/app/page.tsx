import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { FacebookFeed } from "@/components/FacebookFeed";
import { ArtPhoto } from "@/components/ArtPhoto";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import {
  ArrowDown,
  ArrowUpRight,
  Bike,
  Facebook,
  Mail,
  MapPin,
  Mountain,
  Movement,
  Spark,
  Waves,
} from "@/components/icons";
import { formatNewsDate } from "@/lib/news";
import { getPublishedNews, getSiteContent } from "@/lib/public-data";

const programVisuals = [
  { number: "01", icon: Waves, tone: "program-blue" },
  { number: "02", icon: Movement, tone: "program-sun" },
  { number: "03", icon: Mountain, tone: "program-sky" },
  { number: "04", icon: Bike, tone: "program-deep" },
];

const valueVisuals = [
  { image: "/images/hero-swim-guidance.webp", alt: "Mladi plavalec v bazenu sega proti trenerjevi roki.", position: "52% 50%", credit: "Ilustrativna fotografija" },
  { image: "/images/swim-kickboard.webp", alt: "Roki plavalca ob rumeni plavalni deski v bazenu.", position: "54% 50%", credit: "Ilustrativna fotografija" },
  { image: "/images/alen-marathon.webp", alt: "Alen Kobilica z vodnikom med udeleženci na štartu Ljubljanskega maratona.", position: "50% 46%", credit: "© osebni arhiv A. K." },
  { image: "/images/alen-tandem.webp", alt: "Alen Kobilica in vodnik med vožnjo s tandemskim kolesom.", position: "49% 50%", credit: "© osebni arhiv A. K." },
];

const newsPreview = [
  {
    category: "Zgodbe iz vode",
    title: "Vsak zavesljaj je korak naprej.",
    text: "Utrinki s treningov, napredek in trenutki, ko otrok odkrije, da zmore nekaj novega.",
    image: "/images/hero-swim-guidance.webp",
    alt: "Mladi plavalec v bazenu sega proti trenerjevi roki.",
    position: "52% 50%",
  },
  {
    category: "Aktivnosti",
    title: "Vsak cilj ima svojo pot.",
    text: "Novice s programov, taborov in skupnih športnih doživetij.",
    image: "/images/ski-preparation.webp",
    alt: "Trener preverja smučarski čevelj pred aktivnostjo na snegu.",
    position: "50% 52%",
  },
  {
    category: "Skupnost",
    title: "Ko »zmorem« postane »zmoremo«.",
    text: "Dosežki, sodelovanja in zgodbe ljudi, ki skupaj premikajo meje mogočega.",
    image: "/images/alen-marathon.webp",
    alt: "Alen Kobilica z vodnikom med udeleženci športnega dogodka.",
    position: "50% 46%",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, publishedNews] = await Promise.all([getSiteContent(), getPublishedNews(3)]);
  const email = content.contact.email;
  const facebook = content.contact.facebookUrl;
  const supportMail = `mailto:${email}?subject=${encodeURIComponent("Želim podpreti Center Vidim cilj")}`;
  const joinMail = `mailto:${email}?subject=${encodeURIComponent("Zanimajo me programi Centra Vidim cilj")}`;
  const programs = content.programs.items.map((item, index) => ({ ...item, ...programVisuals[index] }));
  const values = content.mission.values.map((item, index) => ({ ...item, ...valueVisuals[index] }));
  const displayedNews = publishedNews.length
    ? publishedNews.map((post) => ({
        category: post.category,
        title: post.title,
        text: post.excerpt,
        image: post.cover_image_url || newsPreview[0].image,
        alt: post.cover_image_alt || "Naslovna fotografija novice.",
        position: "50% 50%",
        meta: formatNewsDate(post.published_at),
        href: `/novice/${post.slug}`,
      }))
    : newsPreview.map((item) => ({ ...item, meta: "Predogled vsebine", href: "" }));
  const schema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Zavod Center Vidim cilj",
    url: "https://vidimcilj.si",
    founder: { "@type": "Person", name: "Alen Kobilica" },
    address: {
      "@type": "PostalAddress",
      streetAddress: content.contact.addressLine1,
      addressLocality: content.contact.addressLine2,
      addressCountry: "SI",
    },
    email,
    sameAs: [facebook],
  };

  return (
    <>
      <a className="skip-link" href="#glavna-vsebina">Preskoči na glavno vsebino</a>
      <Header email={email} />
      <main id="glavna-vsebina">
        <section className="hero" id="vrh" aria-labelledby="hero-title">
          <div className="hero-stage">
            <Image
              className="hero-background hero-background-poster"
              src="/images/hero-pool-loop-poster-v1.png"
              alt="Mladi plavalec samozavestno plava ob trenerki na robu bazena."
              fill
              priority
              sizes="100vw"
            />
            <video
              className="hero-background hero-background-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/hero-pool-loop-poster-v1.png"
              aria-hidden="true"
            >
              <source src="/videos/hero-pool-loop-v1.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay" aria-hidden="true" />
            <div className="hero-tide" aria-hidden="true"><span /><span /></div>
            <div className="shell hero-content">
              <div className="hero-copy">
                <p className="eyebrow hero-eyebrow"><span /> {content.hero.eyebrow}</p>
                <h1 id="hero-title">{content.hero.title} <em>{content.hero.accent}</em></h1>
                <p className="hero-lead">{content.hero.lead}</p>
                <p className="hero-intro">{content.hero.intro}</p>
                <div className="hero-actions">
                  <a className="button button-sun" href="#programi">Spoznaj naše programe <ArrowDown width="19" /></a>
                  <a className="button hero-button-ghost" href={supportMail}>Podpri naš cilj <Mail width="19" /></a>
                </div>
              </div>
              <div className="hero-proof">
                <div className="hero-year"><span>od</span><strong>2011</strong><span>skupaj</span></div>
                <div className="hero-caption">
                  <Spark />
                  <p><strong>{content.hero.proofTitle}</strong><br />{content.hero.proofText}</p>
                </div>
                <small>Ilustrativna fotografija</small>
              </div>
            </div>
            <a className="scroll-cue" href="#zgodba"><span>Odkrij našo zgodbo</span><ArrowDown /></a>
          </div>
          <div className="shell hero-facebook" aria-labelledby="hero-facebook-title">
            <div className="hero-facebook-copy">
              <div className="social-icon"><Facebook /></div>
              <p className="eyebrow eyebrow-light"><span /> Aktualno na Facebooku</p>
              <h2 id="hero-facebook-title">Naše zgodbe se dogajajo <em>vsak dan.</em></h2>
              <p>Utrinke s treningov, taborov, tekmovanj in skupnih doživetij spremljajte neposredno na naši uradni strani.</p>
              <a className="button button-sun" href={facebook} target="_blank" rel="noreferrer">Odpri Facebook stran <ArrowUpRight width="19" /></a>
            </div>
            <FacebookFeed compact pageUrl={facebook} />
          </div>
        </section>

        <section className="story section" id="zgodba" aria-labelledby="story-title">
          <div className="shell story-grid">
            <Reveal className="story-visual">
              <ArtPhoto
                src="/images/alen-portrait.webp"
                alt="Alen Kobilica s športnimi sončnimi očali na prostem."
                label="Alen Kobilica"
                credit="© osebni arhiv A. K. / Turizem Ljubljana"
                objectPosition="48% 50%"
                sizes="(max-width: 760px) 100vw, 42vw"
              />
              <div className="story-quote">»{content.founder.quote}«</div>
            </Reveal>
            <Reveal className="story-copy" delay={120}>
              <p className="eyebrow"><span /> {content.founder.eyebrow}</p>
              <h2 id="story-title">{content.founder.title} <em>{content.founder.accent}</em></h2>
              <p className="story-lead">{content.founder.lead}</p>
              <p>{content.founder.body}</p>
              <div className="story-signature"><span>{content.founder.name}</span><small>{content.founder.role}</small></div>
            </Reveal>
          </div>
        </section>

        <div className="kinetic-strip" aria-hidden="true">
          <div>
            <span>Gibanje</span><i>•</i><span>Pogum</span><i>•</i><span>Pripadnost</span><i>•</i><span>Samostojnost</span><i>•</i><span>Vidim cilj</span><i>•</i>
            <span>Gibanje</span><i>•</i><span>Pogum</span><i>•</i><span>Pripadnost</span><i>•</i><span>Samostojnost</span><i>•</i><span>Vidim cilj</span><i>•</i>
          </div>
        </div>

        <section className="news section" id="novice" aria-labelledby="news-title">
          <div className="news-orbit" aria-hidden="true" />
          <div className="shell">
            <Reveal className="section-heading news-heading">
              <div>
                <p className="eyebrow"><span /> {content.news.eyebrow}</p>
                <h2 id="news-title">{content.news.title}<br /><em>{content.news.accent}</em></h2>
              </div>
              <div className="news-heading-copy">
                <span>{publishedNews.length ? "Najnovejše objave" : "Uredniški sistem v pripravi"}</span>
                <p>{content.news.intro}</p>
              </div>
            </Reveal>

            <div className="news-grid">
              {displayedNews.map((item, index) => (
                <Reveal key={item.title} delay={index * 90} className={`news-card news-card-${index + 1}`}>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes={index === 0 ? "(max-width: 760px) 100vw, 58vw" : "(max-width: 760px) 100vw, 30vw"}
                    style={{ objectPosition: item.position }}
                  />
                  <div className="news-card-shade" aria-hidden="true" />
                  <div className="news-card-copy">
                    <div className="news-card-meta"><span>{item.category}</span><small>{item.meta}</small></div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {item.href ? <Link className="news-card-link" href={item.href}>Preberi novico <ArrowUpRight /></Link> : null}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="news-follow">
              <div><Spark /><p>{content.news.facebookNote}</p></div>
              <a className="text-link" href={facebook} target="_blank" rel="noreferrer">Aktualno na Facebooku <ArrowUpRight /></a>
            </Reveal>
          </div>
        </section>

        <section className="mission section" id="poslanstvo" aria-labelledby="mission-title">
          <div className="shell">
            <Reveal className="section-heading split-heading">
              <div>
                <p className="eyebrow"><span /> {content.mission.eyebrow}</p>
                <h2 id="mission-title">{content.mission.title}<br /><em>{content.mission.accent}</em></h2>
              </div>
              <p className="heading-copy">{content.mission.intro}</p>
            </Reveal>

            <div className="values-grid">
              {values.map((value, index) => (
                <Reveal key={value.title} delay={index * 80} className={`value-card value-card-${index + 1}`}>
                  <ArtPhoto src={value.image} alt={value.alt} label={value.title} credit={value.credit} objectPosition={value.position} sizes="(max-width: 760px) 100vw, 44vw" />
                  <div className="value-card-top">
                    <span className="value-index">0{index + 1}</span>
                    <span className="value-kicker">{value.title}</span>
                  </div>
                  <div className="value-card-copy">
                    <strong>{value.statement}</strong>
                    <p>{value.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="manifesto">
              <span className="manifesto-mark" aria-hidden="true">“</span>
              <p>{content.mission.manifesto} <em>{content.mission.manifestoAccent}</em></p>
              <div className="manifesto-rings" aria-hidden="true" />
            </Reveal>
          </div>
        </section>

        <section className="programs section" id="programi" aria-labelledby="programs-title">
          <div className="shell">
            <Reveal className="section-heading programs-heading">
              <div>
                <p className="eyebrow eyebrow-light"><span /> {content.programs.eyebrow}</p>
                <h2 id="programs-title">{content.programs.title}<br /><em>{content.programs.accent}</em></h2>
              </div>
              <p>{content.programs.intro}</p>
            </Reveal>

            <div className="program-grid">
              {programs.map((program, index) => {
                const Icon = program.icon;
                return (
                  <Reveal key={program.title} delay={index * 90} className={`program-card ${program.tone}`}>
                    <div className="program-top"><span>{program.number}</span><Icon /></div>
                    <div>
                      <h3>{program.title}</h3>
                      <p>{program.text}</p>
                    </div>
                    <a href={joinMail} aria-label={`Povprašajte o programu ${program.title}`}>Povprašajte o programu <ArrowUpRight /></a>
                  </Reveal>
                );
              })}
            </div>
            <Reveal className="program-note">
              <Spark />
              <p>{content.programs.note}</p>
              <a href={joinMail}>Pogovorimo se <ArrowUpRight /></a>
            </Reveal>
          </div>
        </section>

        <section className="journey section" aria-labelledby="journey-title">
          <div className="journey-glow" aria-hidden="true" />
          <div className="shell journey-shell">
            <Reveal className="journey-intro">
              <div>
                <p className="eyebrow"><span /> {content.journey.eyebrow}</p>
                <h2 id="journey-title">{content.journey.title}<br /><em>{content.journey.accent}</em></h2>
              </div>
              <p>{content.journey.intro}</p>
            </Reveal>

            <div className="journey-board">
              <span className="journey-echo" aria-hidden="true">NAPREJ</span>
              <svg className="journey-path" viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden="true">
                <path className="journey-path-base" pathLength="1" d="M35 590 C185 530 205 285 405 330 C615 378 625 112 845 158 C1055 202 1000 520 1170 405" />
                <path className="journey-path-progress" pathLength="1" d="M35 590 C185 530 205 285 405 330 C615 378 625 112 845 158 C1055 202 1000 520 1170 405" />
              </svg>

              <Reveal className="journey-point journey-point-one">
                <span>01</span>
                <div><small>{content.journey.steps[0].label}</small><strong>{content.journey.steps[0].title}</strong></div>
              </Reveal>

              <Reveal className="journey-photo journey-photo-one" delay={90}>
                <ArtPhoto src="/images/swim-kickboard.webp" alt="Roki mladega plavalca ob rumeni plavalni deski v bazenu." label="Prvi zavesljaj" credit="Ilustrativna fotografija" objectPosition="54% 50%" sizes="(max-width: 760px) 100vw, 32vw" />
              </Reveal>

              <Reveal className="journey-point journey-point-two" delay={150}>
                <span>02</span>
                <div><small>{content.journey.steps[1].label}</small><strong>{content.journey.steps[1].title}</strong></div>
              </Reveal>

              <Reveal className="journey-photo journey-photo-two" delay={210}>
                <ArtPhoto src="/images/ski-preparation.webp" alt="Trener preverja zaponko modrega smučarskega čevlja pred aktivnostjo na snegu." label="Prvi zavoj" credit="Ilustrativna fotografija" objectPosition="50% 52%" sizes="(max-width: 760px) 100vw, 31vw" />
              </Reveal>

              <Reveal className="journey-point journey-point-three" delay={280}>
                <span>03</span>
                <div><small>{content.journey.steps[2].label}</small><strong>{content.journey.steps[2].title}</strong><p>{content.journey.steps[2].note}</p></div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="moments section" id="trenutki" aria-labelledby="moments-title">
          <div className="shell">
            <Reveal className="section-heading moments-heading">
              <div>
                <p className="eyebrow"><span /> {content.moments.eyebrow}</p>
                <h2 id="moments-title">{content.moments.title}<br /><em>{content.moments.accent}</em></h2>
              </div>
              <a className="text-link" href={facebook} target="_blank" rel="noreferrer">Več zgodb na Facebooku <ArrowUpRight /></a>
            </Reveal>
            <div className="gallery-grid">
              <Reveal className="gallery-a">
                <ArtPhoto src="/images/ski-preparation.webp" alt="Ilustrativni bližnji posnetek trenerja, ki preverja zaponko modrega smučarskega čevlja." label="Pripravljeni na prvi zavoj" credit="Ilustrativna fotografija" objectPosition="50% 52%" sizes="(max-width: 760px) 100vw, 48vw" />
              </Reveal>
              <Reveal className="gallery-b" delay={70}>
                <ArtPhoto src="/images/alen-marathon.webp" alt="Alen Kobilica z vodnikom med udeleženci na štartu Ljubljanskega maratona." label="Skupaj na štartu" credit="© osebni arhiv A. K. / Turizem Ljubljana" objectPosition="50% 46%" sizes="(max-width: 760px) 100vw, 50vw" />
              </Reveal>
              <Reveal className="gallery-c" delay={140}>
                <ArtPhoto src="/images/alen-tandem.webp" alt="Alen Kobilica in vodnik med tekmovalno vožnjo s tandemskim kolesom." label="En ritem. Ena smer." credit="© osebni arhiv A. K. / Turizem Ljubljana" objectPosition="49% 50%" sizes="(max-width: 760px) 50vw, 25vw" />
              </Reveal>
              <Reveal className="gallery-d" delay={210}>
                <ArtPhoto src="/images/swim-kickboard.webp" alt="Ilustrativni bližnji posnetek dveh rok ob rumeni plavalni deski v bazenu." label="Zaupanje v vodi" credit="Ilustrativna fotografija" objectPosition="54% 50%" sizes="(max-width: 760px) 50vw, 25vw" />
              </Reveal>
            </div>
            <p className="gallery-note">{content.moments.note}</p>
          </div>
        </section>

        <section className="support section" id="podpora" aria-labelledby="support-title">
          <div className="support-curve" aria-hidden="true" />
          <div className="shell support-grid">
            <Reveal>
              <p className="eyebrow eyebrow-light"><span /> {content.support.eyebrow}</p>
              <h2 id="support-title">{content.support.title} <em>{content.support.accent}</em></h2>
            </Reveal>
            <Reveal className="support-copy" delay={100}>
              <p>{content.support.text}</p>
              <a className="button button-sun" href={supportMail}>{content.support.button} <Mail width="19" /></a>
              <small>{content.support.note}</small>
            </Reveal>
          </div>
        </section>

        <section className="contact section" id="kontakt" aria-labelledby="contact-title">
          <div className="shell contact-grid">
            <Reveal>
              <p className="eyebrow"><span /> {content.contact.eyebrow}</p>
              <h2 id="contact-title">{content.contact.title}<br /><em>{content.contact.accent}</em></h2>
            </Reveal>
            <Reveal className="contact-details" delay={100}>
              <a href={`mailto:${email}`} className="contact-item"><span><Mail /></span><div><small>E-pošta</small><strong>{email}</strong></div><ArrowUpRight /></a>
              <div className="contact-item"><span><MapPin /></span><div><small>Naslov</small><strong>{content.contact.addressLine1}<br />{content.contact.addressLine2}</strong></div></div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-main">
          <div><Logo /><p>{content.footer.tagline}</p></div>
          <div className="footer-links"><strong>Raziščite</strong><a href="#zgodba">Naša zgodba</a><a href="#novice">Novice</a><a href="#poslanstvo">Poslanstvo</a><a href="#programi">Programi</a></div>
          <div className="footer-links"><strong>Povežimo se</strong><a href={`mailto:${email}`}>E-pošta</a><a href={facebook} target="_blank" rel="noreferrer">Facebook</a><a href="#podpora">Podpora</a></div>
          <div className="footer-partner"><small>{content.footer.partnerLabel}</small><strong>{content.footer.partnerName}</strong></div>
        </div>
        <div className="shell footer-bottom"><span>© {new Date().getFullYear()} Zavod Center Vidim cilj</span><div><a href="/zasebnost">Zasebnost</a><a href="/dostopnost">Dostopnost</a></div><a href="#vrh">Nazaj na vrh ↑</a></div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
