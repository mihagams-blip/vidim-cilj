"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Facebook } from "./icons";

const DEFAULT_PAGE_URL = "https://www.facebook.com/profile.php?id=100064338805726";

export function FacebookFeed({ compact = false, pageUrl = DEFAULT_PAGE_URL }: { compact?: boolean; pageUrl?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(500);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resize = () => setWidth(Math.max(280, Math.min(500, Math.floor(container.clientWidth - 28))));
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const pluginUrl = useMemo(() => {
    const params = new URLSearchParams({
      href: pageUrl,
      tabs: "timeline",
      width: String(width),
      height: compact ? "430" : "650",
      small_header: "true",
      adapt_container_width: "true",
      hide_cover: "false",
      show_facepile: "false",
    });
    return `https://www.facebook.com/plugins/page.php?${params.toString()}`;
  }, [compact, pageUrl, width]);

  return (
    <div className={`facebook-feed${compact ? " facebook-feed-compact" : ""}`} ref={containerRef}>
      <div className="facebook-feed-top">
        <span><Facebook /> Aktualne objave</span>
        <a href={pageUrl} target="_blank" rel="noreferrer" aria-label="Odpri Vidim cilj na Facebooku">
          Odpri stran <ArrowUpRight />
        </a>
      </div>
      <iframe
        className="facebook-frame"
        title="Najnovejše objave Facebook strani Vidim cilj"
        src={pluginUrl}
        width={width}
        height={compact ? "430" : "650"}
        loading="eager"
        allow="encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
