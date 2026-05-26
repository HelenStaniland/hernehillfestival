"use client";

import dynamic from "next/dynamic";
import type { Venue } from "@/data/venues";

const VenueMap = dynamic(
  () => import("@/components/site/VenueMap").then((module) => module.VenueMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-80 w-full animate-pulse rounded-xl border border-white/20 bg-white/5 sm:h-[28rem]"
        aria-hidden
      />
    ),
  },
);

type VenueMapSectionProps = {
  venues: Venue[];
};

export function VenueMapSection({ venues }: VenueMapSectionProps) {
  return (
    <section aria-labelledby="venue-map-heading">
      <h2 id="venue-map-heading" className="festival-label">
        Map
      </h2>
      <p className="mt-2 festival-body">
        All festival venues are in and around Herne Hill. Tap a pin for details.
      </p>
      <div className="mt-4 overflow-hidden rounded-xl">
        <VenueMap venues={venues} />
      </div>
    </section>
  );
}
