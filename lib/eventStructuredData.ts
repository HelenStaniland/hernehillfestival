import { getEventImages } from "@/components/site/EventLineup";
import { festival } from "@/lib/festival";
import { formatLondonDateTime } from "@/lib/londonDateTime";
import {
  getEventPageTitle,
  getEventPath,
  type ProgrammeEvent,
} from "@/lib/programme";

const UK_POSTCODE = /\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\s*$/i;

type PostalAddress = {
  "@type": "PostalAddress";
  streetAddress?: string;
  addressLocality?: string;
  postalCode?: string;
  addressCountry: "GB";
};

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, festival.url).href;
}

export function parsePostalAddress(address: string): PostalAddress | undefined {
  const trimmed = address.trim();
  if (!trimmed) return undefined;

  const postcodeMatch = trimmed.match(UK_POSTCODE);
  const postalCode = postcodeMatch
    ? `${postcodeMatch[1].toUpperCase()} ${postcodeMatch[2].toUpperCase()}`
    : undefined;
  const withoutPostcode = postcodeMatch
    ? trimmed.slice(0, postcodeMatch.index).replace(/[,\s]+$/, "")
    : trimmed;
  const parts = withoutPostcode
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  let addressLocality: string | undefined;
  if (parts.length > 1 && parts[parts.length - 1].toLowerCase() === "london") {
    parts.pop();
    addressLocality = "London";
  }

  const streetAddress = parts.join(", ");
  if (!streetAddress && !addressLocality && !postalCode) return undefined;

  return {
    "@type": "PostalAddress",
    ...(streetAddress ? { streetAddress } : {}),
    ...(addressLocality ? { addressLocality } : {}),
    ...(postalCode ? { postalCode } : {}),
    addressCountry: "GB",
  };
}

function eventCopy(event: ProgrammeEvent) {
  const text = event.description ?? event.listingNote;
  return text?.replace(/\s+/g, " ").trim();
}

function eventImageUrls(event: ProgrammeEvent) {
  const paths = [
    ...(event.detailImage ? [event.detailImage] : []),
    ...getEventImages(event),
  ];
  const urls = [...new Set(paths.map((path) => absoluteUrl(path)))];
  return urls.length > 0 ? urls : undefined;
}

function performers(event: ProgrammeEvent) {
  const billed = [...(event.artist ? [event.artist] : []), ...event.artists];
  const unique = billed.filter(
    (artist, index) =>
      artist.id !== "artist-tba" &&
      billed.findIndex((item) => item.id === artist.id) === index,
  );
  if (unique.length === 0) return undefined;

  const mapped = unique.map((artist) => ({
    "@type": "PerformingGroup" as const,
    name: artist.name,
    ...("website" in artist && artist.website ? { url: artist.website } : {}),
  }));

  return mapped.length === 1 ? mapped[0] : mapped;
}

function offers(event: ProgrammeEvent) {
  if (!event.ticketUrl) return undefined;
  return {
    "@type": "Offer" as const,
    url: event.ticketUrl,
  };
}

export function buildEventJsonLd(event: ProgrammeEvent) {
  const venue =
    event.venue && event.venue.id !== "venue-tba" ? event.venue : undefined;
  const address = venue ? parsePostalAddress(venue.address) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: getEventPageTitle(event),
    ...(eventCopy(event) ? { description: eventCopy(event) } : {}),
    startDate: formatLondonDateTime(event.date, event.time),
    ...(event.endTime
      ? { endDate: formatLondonDateTime(event.date, event.endTime) }
      : {}),
    ...(event.entryTime
      ? { doorTime: formatLondonDateTime(event.date, event.entryTime) }
      : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(eventImageUrls(event) ? { image: eventImageUrls(event) } : {}),
    url: absoluteUrl(getEventPath(event.id)),
    ...(venue
      ? {
          location: {
            "@type": "Place",
            name: venue.name,
            ...(address ? { address } : {}),
          },
        }
      : {}),
    organizer: {
      "@type": "Organization",
      name: festival.name,
      url: festival.url,
    },
    ...(performers(event) ? { performer: performers(event) } : {}),
    ...(offers(event) ? { offers: offers(event) } : {}),
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
