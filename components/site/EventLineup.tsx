import Link from "next/link";
import type { ProgrammeEvent } from "@/lib/programme";

type EventLineupProps = {
  event: ProgrammeEvent;
};

export function EventLineup({ event }: EventLineupProps) {
  const title =
    event.title ??
    event.artist?.name ??
    "Line-up to be announced";

  const isGroupEvent = event.artists.length > 0;

  return (
    <>
      <h3 className="mt-2 font-display text-2xl tracking-wide text-white">
        {title}
      </h3>

      {isGroupEvent ? (
        <>
          <p className="mt-1 text-sm font-semibold text-white/80">Choir</p>
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
      ) : (
        <>
          {event.artist?.genre && event.artist.genre !== "TBA" ? (
            <p className="mt-1 text-sm font-semibold text-white/80">
              {event.artist.genre}
            </p>
          ) : null}
          {event.artist?.website ? (
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
      )}
    </>
  );
}

export function getEventImage(event: ProgrammeEvent): string | undefined {
  return event.image ?? event.artist?.image;
}
