import type { Metadata } from "next";
import { getEventImages } from "@/components/site/EventLineup";
import { absoluteUrl } from "@/lib/eventStructuredData";
import { festival } from "@/lib/festival";
import {
  formatEventDate,
  getEventPageTitle,
  getEventPath,
  type ProgrammeEvent,
} from "@/lib/programme";

const META_DESCRIPTION_LENGTH = 160;

function summarize(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= META_DESCRIPTION_LENGTH) return normalized;

  const slice = normalized.slice(0, META_DESCRIPTION_LENGTH + 1);
  const sentenceEnd = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
  );
  if (sentenceEnd >= 40) return normalized.slice(0, sentenceEnd + 1);

  const wordEnd = slice.lastIndexOf(" ");
  return normalized.slice(0, wordEnd > 0 ? wordEnd : META_DESCRIPTION_LENGTH);
}

export function eventMetaDescription(event: ProgrammeEvent) {
  const opening = event.description?.split(/\n\n/)[0];
  if (opening?.trim()) return summarize(opening);

  const title = getEventPageTitle(event);
  const when = formatEventDate(event.date);
  const where = event.venue?.name;
  return where ? `${title} on ${when} at ${where}.` : `${title} on ${when}.`;
}

export function eventPageMetadata(event: ProgrammeEvent): Metadata {
  const title = `${getEventPageTitle(event)} | ${festival.name}`;
  const description = eventMetaDescription(event);
  const path = getEventPath(event.id);
  const image = event.detailImage ?? getEventImages(event)[0];

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      siteName: festival.name,
      type: "website",
      ...(image
        ? {
            images: [{ url: absoluteUrl(image), alt: getEventPageTitle(event) }],
          }
        : {}),
    },
  };
}
