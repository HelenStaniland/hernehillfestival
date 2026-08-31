"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EventLineup, getEventImages } from "@/components/site/EventLineup";
import { EventPhotos } from "@/components/site/EventPhotos";
import { BuyTicketsButton } from "@/components/site/BuyTicketsButton";
import { VenueDetails } from "@/components/site/VenueDetails";
import { buildEventIcs, eventIcsFilename } from "@/lib/calendar";
import {
  formatEventDate,
  formatEventTime,
  formatEventTimeRange,
  getEventPath,
  getEventPeriodLabel,
  type ProgrammeEvent,
} from "@/lib/programme";

type EventsBrowserProps = {
  programme: ProgrammeEvent[];
};

type DayGroup = {
  date: string;
  label: string;
  events: ProgrammeEvent[];
};

function groupByDate(events: ProgrammeEvent[]): DayGroup[] {
  const days = new Map<string, ProgrammeEvent[]>();

  for (const event of events) {
    const existing = days.get(event.date) ?? [];
    existing.push(event);
    days.set(event.date, existing);
  }

  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayEvents]) => ({
      date,
      label: formatEventDate(date),
      events: dayEvents,
    }));
}

function downloadIcs(event: ProgrammeEvent) {
  const blob = new Blob([buildEventIcs(event)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = eventIcsFilename(event);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function EventsBrowser({ programme }: EventsBrowserProps) {
  const days = useMemo(() => groupByDate(programme), [programme]);

  return (
    <div className="space-y-10">
      {days.map((day) => (
        <section key={day.date} aria-labelledby={`day-${day.date}`}>
          <h2 id={`day-${day.date}`} className="festival-section-title">
            {day.label}
          </h2>

          <ul className="mt-4 space-y-4">
            {day.events.map((event) => {
              const periodLabel = getEventPeriodLabel(event.id);
              const images = getEventImages(event);
              const eventHref = getEventPath(event.id);

              return (
                <li key={event.id} className="festival-card overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-stretch">
                    {images.length > 0 ? (
                      <Link
                        href={eventHref}
                        className="block w-full shrink-0 sm:flex sm:w-auto sm:self-stretch"
                        aria-label="View event details"
                      >
                        <EventPhotos
                          event={event}
                          images={images}
                          variant="listing"
                        />
                      </Link>
                    ) : null}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      {periodLabel ? (
                        <p className="festival-label">{periodLabel}</p>
                      ) : null}
                      <p className="font-display text-3xl text-festival-mint">
                        {formatEventTimeRange(event)}
                      </p>
                      {event.entryTime ? (
                        <p className="mt-1 text-sm font-semibold text-white/80">
                          Entry from {formatEventTime(event.entryTime)}
                        </p>
                      ) : null}
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
                      <div className="mt-4 flex flex-wrap gap-3">
                        {event.ticketUrl ? (
                          <BuyTicketsButton href={event.ticketUrl} />
                        ) : null}
                        <Link
                          href={eventHref}
                          className="inline-flex items-center gap-2 rounded-lg border border-festival-mint/50 px-3 py-1.5 text-sm font-semibold text-festival-mint hover:bg-festival-mint/10"
                        >
                          Event details →
                        </Link>
                        <button
                          type="button"
                          onClick={() => downloadIcs(event)}
                          className="inline-flex items-center gap-2 rounded-lg border border-festival-mint/50 px-3 py-1.5 text-sm font-semibold text-festival-mint hover:bg-festival-mint/10"
                        >
                          Add to calendar
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
