"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomeGallerySponsor } from "@/lib/homeGallery";

const INTERVAL_MS = 4000;

function SponsorSlide({ item }: { item: HomeGallerySponsor }) {
  const content = (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-20 w-64 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 sm:h-24 sm:w-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/${item.logo}`}
          alt=""
          className="max-h-full max-w-full object-contain object-center"
        />
      </div>
      <p className="max-w-72 text-sm font-semibold text-white/90">{item.name}</p>
    </div>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-90"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function SponsorCarousel({ sponsors }: { sponsors: HomeGallerySponsor[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (sponsors.length <= 1 || paused || reduceMotion) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % sponsors.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [sponsors.length, paused, reduceMotion]);

  if (sponsors.length === 0) {
    return null;
  }

  if (reduceMotion) {
    return (
      <div className="mt-8">
        <h3 className="festival-label">Supported by</h3>
        <ul className="mt-3 flex flex-wrap justify-center gap-4">
          {sponsors.map((sponsor) => (
            <li key={sponsor.id}>
              <SponsorSlide item={sponsor} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const active = sponsors[index];

  return (
    <div className="mt-8">
      <h3 className="festival-label">Supported by</h3>
      <div
        className="relative mt-3 flex h-40 items-center justify-center sm:h-44"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-live="polite"
        aria-label={`Supported by ${active.name}`}
      >
        {sponsors.map((sponsor, sponsorIndex) => (
          <div
            key={sponsor.id}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              sponsorIndex === index
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            aria-hidden={sponsorIndex !== index}
          >
            <SponsorSlide item={sponsor} />
          </div>
        ))}
      </div>
      {sponsors.length > 1 ? (
        <div
          className="mt-3 flex justify-center gap-1.5"
          role="tablist"
          aria-label="Sponsors"
        >
          {sponsors.map((sponsor, sponsorIndex) => (
            <button
              key={sponsor.id}
              type="button"
              role="tab"
              aria-selected={sponsorIndex === index}
              aria-label={sponsor.name}
              className={`h-1.5 rounded-full transition-all ${
                sponsorIndex === index
                  ? "w-5 bg-festival-mint"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => setIndex(sponsorIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
