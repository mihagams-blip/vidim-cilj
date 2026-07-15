"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Mail } from "./icons";

const links = [
  ["Naša zgodba", "#zgodba"],
  ["Novice", "#novice"],
  ["Poslanstvo", "#poslanstvo"],
  ["Programi", "#programi"],
];

export function Header({ email = "alen.kobilica@vidimcilj.si", homePrefix = "" }: { email?: string; homePrefix?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="site-header">
      <div className="shell nav-wrap">
        <a href={`${homePrefix}#vrh`} className="logo-link"><Logo /></a>
        <nav id="mobile-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label="Glavna navigacija">
          {links.map(([label, href]) => <a key={href} href={`${homePrefix}${href}`} onClick={() => setOpen(false)}>{label}</a>)}
          <a className="nav-contact" href={`mailto:${email}?subject=Podpora%20Centru%20Vidim%20cilj`}>
            <Mail width="18" /> Pišite nam
          </a>
        </nav>
        <button
          className={`menu-button ${open ? "is-open" : ""}`}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Zapri meni" : "Odpri meni"}
          onClick={() => setOpen(!open)}
        >
          <span /><span />
        </button>
      </div>
      <span className="sr-only" aria-live="polite">{open ? "Meni je odprt" : ""}</span>
    </header>
  );
}
