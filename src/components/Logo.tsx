export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand" aria-label="Vidim cilj">
      <svg className="brand-mark" viewBox="0 0 64 64" role="img" aria-label="Logotip Vidim cilj">
        <circle cx="32" cy="32" r="30" fill="#f4fbff" />
        <path d="M10 31C22 12 41 9 54 28" fill="none" stroke="#ffb51b" strokeWidth="6" strokeLinecap="round" />
        <circle cx="33" cy="27" r="7" fill="#178fd0" />
        <path d="M5 39c10-7 18-6 27 0s17 6 27-1c-8 13-19 18-31 13C18 47 13 44 5 46Z" fill="#0876bd" />
        <path d="M8 38c10-3 17-1 25 3 10 5 17 4 26-3" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {!compact && <span className="brand-name">Vidim cilj</span>}
    </span>
  );
}
