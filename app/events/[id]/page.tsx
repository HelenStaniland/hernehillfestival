import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtistDetails } from "@/components/site/ArtistDetails";
import { getEventImages } from "@/components/site/EventLineup";
import { EventPageActions } from "@/components/site/EventPageActions";
import { PageShell } from "@/components/site/PageShell";
import { VenueDetails } from "@/components/site/VenueDetails";
import { events } from "@/data/events";
import { festival } from "@/lib/festival";
import {
  formatEventDate,
  formatEventTime,
  formatEventTimeRange,
  getEventById,
  getEventPageTitle,
} from "@/lib/programme";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) {
    return { title: `Event | ${festival.name}` };
  }

  const title = getEventPageTitle(event);
  const when = `${formatEventDate(event.date)} · ${formatEventTimeRange(event)}`;
  const where = event.venue?.name ? ` at ${event.venue.name}` : "";

  return {
    title: `${title} | ${festival.name}`,
    description: `${title} — ${when}${where}. Part of ${festival.name}.`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) notFound();

  const title = getEventPageTitle(event);
  const images = event.detailImage
    ? [event.detailImage]
    : getEventImages(event);
  const imageCount = images.length;
  const lineupArtists =
    event.artists.length > 0
      ? event.artists
      : event.artist
        ? [event.artist]
        : [];

  return (
    <PageShell
      title={title}
      description={`${formatEventDate(event.date)} · ${formatEventTimeRange(event)}`}
    >
      <p className="mb-6">
        <Link href="/events" className="festival-link text-sm">
          ← All events
        </Link>
      </p>

      {images.length > 0 ? (
        <figure className="mb-8">
          <div
            className={`flex w-full overflow-hidden rounded-xl bg-festival-blue-deep ${
              imageCount === 3
                ? "aspect-[12/5] sm:aspect-[12/4]"
                : imageCount === 2
                  ? "aspect-[8/4] sm:aspect-[8/3]"
                  : "aspect-[16/9] sm:aspect-[21/9]"
            }`}
          >
            {images.map((image) => (
              <div key={image} className="relative min-h-0 min-w-0 flex-1">
                <Image
                  src={`/${image}`}
                  alt=""
                  fill
                  className={
                    event.imagePosition === "top"
                      ? "object-cover object-top"
                      : "object-cover"
                  }
                  sizes={
                    imageCount >= 2
                      ? `(max-width: 640px) ${Math.round(100 / imageCount)}vw, ${Math.round(1024 / imageCount)}px`
                      : "(max-width: 640px) 100vw, 1024px"
                  }
                  priority
                />
              </div>
            ))}
          </div>
          {event.imageCredit ? (
            <figcaption className="mt-2 text-right text-xs text-white/60">
              {event.imageCredit}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="festival-card p-5 sm:p-8">
        <p className="festival-label">{formatEventDate(event.date)}</p>
        <p className="font-display mt-1 text-3xl text-festival-mint sm:text-4xl">
          {formatEventTimeRange(event)}
        </p>
        {event.entryTime ? (
          <p className="mt-1 text-sm font-semibold text-white/80">
            Entry from {formatEventTime(event.entryTime)}
          </p>
        ) : null}
        {event.subtitle ? (
          <p className="mt-3 text-lg font-semibold text-white/90">
            {event.subtitle}
          </p>
        ) : null}
        {event.description ? (
          <p className="mt-4 max-w-2xl festival-body text-base leading-relaxed">
            {event.description}
          </p>
        ) : null}

        {event.venue ? (
          <section className="mt-8" aria-labelledby="event-venue-heading">
            <h2
              id="event-venue-heading"
              className="festival-section-title text-xl"
            >
              Venue
            </h2>
            <div className="mt-4">
              <VenueDetails
                venue={event.venue}
                prominentName
                linkToVenuePage
                showAddress
                showWebsite
                showAccessibility
              />
            </div>
          </section>
        ) : null}

        {lineupArtists.length > 0 ? (
          <section className="mt-8" aria-labelledby="event-lineup-heading">
            <h2
              id="event-lineup-heading"
              className="festival-section-title text-xl"
            >
              {lineupArtists.length === 1 ? "Artist" : "Line-up"}
            </h2>
            <ul className="mt-4 space-y-6">
              {lineupArtists.map((artist) => (
                <li key={artist.id}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {artist.image ? (
                      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-festival-blue-deep sm:aspect-square sm:h-28 sm:w-28">
                        <Image
                          src={`/${artist.image}`}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 112px"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <ArtistDetails artist={artist} prominentName />
                      {artist.id !== "artist-tba" ? (
                        <Link
                          href={`/artists#${artist.id}`}
                          className="festival-link mt-2 inline-block text-sm"
                        >
                          View on artists page →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <EventPageActions event={event} />
      </div>
    </PageShell>
  );
}
