import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/site/PageShell";
import { VenueDetails } from "@/components/site/VenueDetails";
import { festival } from "@/lib/festival";
import {
  formatEventTime,
  getEventPeriodLabel,
  getProgramme,
  groupProgrammeByDate,
} from "@/lib/programme";

export const metadata: Metadata = {
  title: `Events | ${festival.name}`,
  description: "Festival events, times and venues.",
};

export default function EventsPage() {
  const days = groupProgrammeByDate(getProgramme());

  return (
    <PageShell title="Events" description="All times local.">
      {days.length === 0 ? (
        <p className="festival-body">Events will be listed here soon.</p>
      ) : (
        <div className="space-y-10">
          {days.map((day) => (
            <section key={day.date} aria-labelledby={`day-${day.date}`}>
              <h2 id={`day-${day.date}`} className="festival-section-title">
                {day.label}
              </h2>

              <ul className="mt-4 space-y-4">
                {day.events.map((event) => {
                  const periodLabel = getEventPeriodLabel(event.id);

                  const image = event.artist?.image;

                  return (
                    <li key={event.id} className="festival-card overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {image ? (
                          <div className="relative aspect-[4/3] w-full shrink-0 bg-festival-blue-deep sm:aspect-auto sm:h-48 sm:w-48">
                            <Image
                              src={`/${image}`}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 192px"
                            />
                          </div>
                        ) : null}
                        <div className="p-5 sm:p-6">
                          {periodLabel ? (
                            <p className="festival-label">{periodLabel}</p>
                          ) : null}
                          <p className="font-display text-3xl text-festival-mint">
                            {formatEventTime(event.time)}
                          </p>
                          <h3 className="mt-2 font-display text-2xl tracking-wide text-white">
                            {event.artist?.name ?? "Line-up to be announced"}
                          </h3>
                          {event.artist?.genre &&
                          event.artist.genre !== "TBA" ? (
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
                          {event.venue ? (
                            <div className="mt-3">
                              <VenueDetails venue={event.venue} />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}
