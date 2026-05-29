"use client";

import type { Venue } from "@/data/venues";
import type { VenueEventSummary } from "@/lib/programme";
import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const markerIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:14px;height:14px;border-radius:50%;background:#72e0ca;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.45);"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -8],
});

type VenueMapProps = {
  venues: Venue[];
  venueEvents?: Record<string, VenueEventSummary[]>;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function VenueMap({ venues, venueEvents }: VenueMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || venues.length === 0 || mapRef.current) {
      return;
    }

    const bounds = L.latLngBounds(venues.map((venue) => [venue.lat, venue.lng]));
    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
    }).fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    for (const venue of venues) {
      const events = venueEvents?.[venue.id] ?? [];
      const eventsHtml = events.length
        ? `<ul style="margin:6px 0 0;padding-left:16px;">${events
            .map(
              (event) =>
                `<li>${escapeHtml(event.dateLabel)}, ${escapeHtml(
                  event.time,
                )} — ${escapeHtml(event.title)}</li>`,
            )
            .join("")}</ul>`
        : "";

      L.marker([venue.lat, venue.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${escapeHtml(venue.name)}</strong><br>${escapeHtml(
            venue.address,
          )}${eventsHtml}${
            venue.website
              ? `<br><a href="${venue.website}" target="_blank" rel="noopener noreferrer">Visit website</a>`
              : ""
          }`,
        );
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [venues, venueEvents]);

  return (
    <div
      ref={containerRef}
      className="h-80 w-full rounded-xl border border-white/20 sm:h-[28rem]"
      role="region"
      aria-label="Map of festival venues in Herne Hill"
    />
  );
}
