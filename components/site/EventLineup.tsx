import Link from "next/link";
import type { ProgrammeEvent } from "@/lib/programme";

type EventLineupProps = {
  event: ProgrammeEvent;
};

export function EventLineup({ event }: EventLineupProps) {
  const isGroupEvent = event.artists.length > 0;
  const isChoirEvent =
    isGroupEvent && event.artists.every((artist) => artist.genre === "Choir");
  const eventHref = `/events/${event.id}`;

  if (isGroupEvent && event.title) {
    return (
      <>
        <h3 className="mt-2 font-display text-2xl tracking-wide text-white">
          <Link href={eventHref} className="hover:text-festival-mint">
            {event.title}
          </Link>
        </h3>
        {isChoirEvent ? (
          <p className="mt-1 text-sm font-semibold text-white/80">Choir</p>
        ) : null}
        <ul className="mt-3 space-y-1">
          {event.artists.map((artist) => (
            <li key={artist.id}>
              <Link
                href={`/artists#${artist.id}`}
                className="festival-link text-sm font-semibold"
              >
                {artist.name}
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (isGroupEvent) {
    return (
      <ul className="mt-2 space-y-1">
        {event.artists.map((artist) => (
          <li key={artist.id}>
            <Link
              href={eventHref}
              className="festival-link font-display text-2xl tracking-wide"
            >
              {artist.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  const title =
    event.title ?? event.artist?.name ?? "Line-up to be announced";

  return (
    <>
      <h3 className="mt-2 font-display text-2xl tracking-wide text-white">
        <Link href={eventHref} className="hover:text-festival-mint">
          {title}
        </Link>
      </h3>
      {!event.title && event.artist?.genre && event.artist.genre !== "TBA" ? (
        <p className="mt-1 text-sm font-semibold text-white/80">
          {event.artist.genre}
        </p>
      ) : null}
      {event.title && !event.artist ? (
        <p className="mt-1 text-sm font-semibold text-white/80">
          {event.subtitle ?? "Details to be announced"}
        </p>
      ) : event.subtitle && !(event.title && !event.artist) ? (
        <p className="mt-1 text-sm font-semibold text-white/80">
          {event.subtitle}
        </p>
      ) : null}
      {!event.title && event.artist?.website ? (
        <a
          href={event.artist.website}
          target="_blank"
          rel="noopener noreferrer"
          className="festival-link mt-2 inline-block text-sm"
        >
          Artist website →
        </a>
      ) : null}
    </>
  );
}

export function getEventImage(event: ProgrammeEvent): string | undefined {
  return getEventImages(event)[0];
}

export function getEventImages(event: ProgrammeEvent): string[] {
  if (event.artists.length >= 2 && event.artists.length <= 3) {
    const billImages = event.artists
      .map((artist) => artist.image)
      .filter((image): image is string => Boolean(image));
    if (billImages.length === event.artists.length) {
      return billImages;
    }
  }

  const single =
    event.image ?? event.artist?.image ?? event.artists[0]?.image;
  return single ? [single] : [];
}
