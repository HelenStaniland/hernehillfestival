"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { EventLineup, getEventImage } from "@/components/site/EventLineup";
import { VenueDetails } from "@/components/site/VenueDetails";
import type { Venue } from "@/data/venues";
import { buildEventIcs, eventIcsFilename } from "@/lib/calendar";
import {
  formatEventDate,
  formatEventTime,
  getEventPeriodLabel,
  type ProgrammeEvent,
} from "@/lib/programme";

type EventsBrowserProps = {
  programme: ProgrammeEvent[];
  venues: Venue[];
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

const selectClassName =
  "rounded-lg border border-white/25 bg-white px-3 py-2 text-sm font-semibold text-festival-ink focus:outline-none focus:ring-2 focus:ring-festival-mint";

export function EventsBrowser({ programme, venues }: EventsBrowserProps) {
  const dayId = useId();
  const venueId = useId();
  const [dayFilter, setDayFilter] = useState("all");
  const [venueFilter, setVenueFilter] = useState("all");

  const dayOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const event of programme) {
      if (!seen.has(event.date)) {
        seen.set(event.date, formatEventDate(event.date));
      }
    }
    return [...seen.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, label]) => ({ value, label }));
  }, [programme]);

  const venueOptions = useMemo(() => {
    const present = new Set(programme.map((event) => event.venueId));
    return venues
      .filter((venue) => present.has(venue.id))
      .map((venue) => ({ value: venue.id, label: venue.name }));
  }, [programme, venues]);

  const days = useMemo(() => {
    const filtered = programme.filter((event) => {
      if (dayFilter !== "all" && event.date !== dayFilter) return false;
      if (venueFilter !== "all" && event.venueId !== venueFilter) return false;
      return true;
    });
    return groupByDate(filtered);
  }, [programme, dayFilter, venueFilter]);

  const total = days.reduce((sum, day) => sum + day.events.length, 0);
  const hasFilters = dayFilter !== "all" || venueFilter !== "all";

  return (
    <div className="space-y-8">
      <div className="festival-card flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:gap-6 sm:p-5">
        <div className="flex flex-col gap-1">
          <label htmlFor={dayId} className="festival-label">
            Day
          </label>
          <select
            id={dayId}
            value={dayFilter}
            onChange={(eventChange) => setDayFilter(eventChange.target.value)}
            className={selectClassName}
          >
            <option value="all">All days</option>
            {dayOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={venueId} className="festival-label">
            Venue
          </label>
          <select
            id={venueId}
            value={venueFilter}
            onChange={(eventChange) => setVenueFilter(eventChange.target.value)}
            className={selectClassName}
          >
            <option value="all">All venues</option>
            {venueOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 sm:justify-end">
          <p className="text-sm text-white/70">
            {total} {total === 1 ? "event" : "events"}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setDayFilter("all");
                setVenueFilter("all");
              }}
              className="festival-link text-sm"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {days.length === 0 ? (
        <p className="festival-body">No events match these filters.</p>
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
                    <li
                      key={event.id}
                      className="festival-card overflow-hidden"
                    >
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
                          <div className="mt-4">
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
      )}
    </div>
  );
}
