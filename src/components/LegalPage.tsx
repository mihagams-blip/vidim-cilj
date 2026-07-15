import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ArrowUpRight } from "./icons";

export function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#pravna-vsebina">Preskoči na vsebino</a>
      <header className="legal-header">
        <div className="shell legal-nav">
          <Link href="/" aria-label="Nazaj na naslovnico"><Logo /></Link>
          <Link href="/" className="text-link">Nazaj na naslovnico <ArrowUpRight /></Link>
        </div>
      </header>
      <main id="pravna-vsebina" className="legal-main">
        <div className="shell legal-grid">
          <div className="legal-title">
            <p className="eyebrow"><span /> {eyebrow}</p>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
          <article className="legal-copy">{children}</article>
        </div>
      </main>
      <footer className="legal-footer"><div className="shell">© {new Date().getFullYear()} Zavod Center Vidim cilj</div></footer>
    </>
  );
}
