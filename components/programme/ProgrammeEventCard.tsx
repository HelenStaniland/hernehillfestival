import Image from "next/image";
import {
  formatEventTime,
  type ProgrammeEvent,
} from "@/lib/programme";

export function ProgrammeEventCard({ event }: { event: ProgrammeEvent }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-festival-cream/20 bg-festival-card shadow-md shadow-festival-bg/30">
      <div className="flex flex-col sm:flex-row">
        {event.artist?.image ? (
          <div className="relative aspect-[16/10] w-full shrink-0 bg-festival-surface sm:aspect-auto sm:w-44 md:w-52">
            <Image
              src={`/${event.artist.image}`}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 208px"
            />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
          <div className="shrink-0 sm:w-24">
            <p className="font-display text-2xl font-bold tabular-nums tracking-tight text-festival-accent">
              {formatEventTime(event.time)}
            </p>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <h3 className="font-display text-lg font-semibold leading-snug text-festival-cream">
              {event.title}
            </h3>

            {event.artist ? (
              <p className="text-base text-festival-cream/90">
                <span className="font-medium">{event.artist.name}</span>
                {event.artist.genre ? (
                  <span className="text-festival-cream/65">
                    {" "}
                    · {event.artist.genre}
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="text-sm text-festival-cream/60">
                Artist details coming soon
              </p>
            )}

            {event.venue ? (
              <p className="text-sm text-festival-cream/75">
                <span className="font-medium text-festival-cream">
                  {event.venue.name}
                </span>
                {event.venue.address ? (
                  <span> — {event.venue.address}</span>
                ) : null}
              </p>
            ) : null}

            {event.artist?.bio ? (
              <p className="hidden text-sm leading-relaxed text-festival-cream/70 md:block">
                {event.artist.bio}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
