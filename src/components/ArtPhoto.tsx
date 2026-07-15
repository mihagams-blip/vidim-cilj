"use client";

import Image from "next/image";
import type { PointerEvent } from "react";

export function ArtPhoto({
  src,
  alt,
  label,
  credit,
  className = "",
  priority = false,
  objectPosition = "50% 50%",
  sizes = "(max-width: 760px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  label: string;
  credit: string;
  className?: string;
  priority?: boolean;
  objectPosition?: string;
  sizes?: string;
}) {
  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--photo-rx", `${y * -3.5}deg`);
    event.currentTarget.style.setProperty("--photo-ry", `${x * 4.5}deg`);
    event.currentTarget.style.setProperty("--photo-x", `${x * -9}px`);
    event.currentTarget.style.setProperty("--photo-y", `${y * -9}px`);
  };

  const reset = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--photo-rx", "0deg");
    event.currentTarget.style.setProperty("--photo-ry", "0deg");
    event.currentTarget.style.setProperty("--photo-x", "0px");
    event.currentTarget.style.setProperty("--photo-y", "0px");
  };

  return (
    <figure className={`art-photo ${className}`} onPointerMove={tilt} onPointerLeave={reset}>
      <div className="art-photo-media">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          style={{ objectPosition }}
        />
        <span className="art-photo-sheen" aria-hidden="true" />
      </div>
      <figcaption>
        <strong>{label}</strong>
        <small>{credit}</small>
      </figcaption>
    </figure>
  );
}
