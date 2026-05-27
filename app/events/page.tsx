import type { Metadata } from "next";
import Image from "next/image";
import { EventLineup, getEventImage } from "@/components/site/EventLineup";
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

                  const image = getEventImage(event);

                  return (
                    <li key={event.id} className="festival-card overflow-hidden">
                      <div className="flex flex-col sm:flex-row sm:items-stretch">
                        {image ? (
                          <div className="relative aspect-[4/3] w-full shrink-0 bg-festival-blue-deep sm:aspect-auto sm:w-48 sm:min-h-48 sm:self-stretch">
                            <Image
                              src={`/${image}`}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 192px"
                            />
                          </div>
                        ) : null}
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          {periodLabel ? (
                            <p className="festival-label">{periodLabel}</p>
                          ) : null}
                          <p className="font-display text-3xl text-festival-mint">
                            {formatEventTime(event.time)}
                          </p>
                          <EventLineup event={event} />
                          {event.venue ? (
                            <div className="mt-3">
                              <VenueDetails
                                venue={event.venue}
                                linkToVenuePage
                                showAddress={false}
                                showWebsite={false}
                              />
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
