import { artists } from "@/data/artists";
import { events } from "@/data/events";
import { venues } from "@/data/venues";

export type ProgrammeEvent = (typeof events)[number] & {
  artist: (typeof artists)[number] | undefined;
  venue: (typeof venues)[number] | undefined;
};

export type ProgrammeDay = {
  date: string;
  label: string;
  events: ProgrammeEvent[];
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
});

const periodLabels: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export function getEventPeriod(id: string) {
  const period = id.split("-").at(-1);
  return period && period in periodLabels ? period : null;
}

export function getEventPeriodLabel(id: string) {
  const period = getEventPeriod(id);
  return period ? periodLabels[period] : null;
}

export function formatEventTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(2000, 0, 1, hours, minutes);
  return timeFormatter.format(date);
}

export function formatEventDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return dateFormatter.format(new Date(year, month - 1, day));
}

export function getProgramme(): ProgrammeEvent[] {
  const artistById = new Map(artists.map((artist) => [artist.id, artist]));
  const venueById = new Map(venues.map((venue) => [venue.id, venue]));

  return [...events]
    .map((event) => ({
      ...event,
      artist: event.artistId ? artistById.get(event.artistId) : undefined,
      venue: venueById.get(event.venueId),
    }))
    .sort((a, b) => {
      const byDate = a.date.localeCompare(b.date);
      if (byDate !== 0) return byDate;
      return a.time.localeCompare(b.time);
    });
}

export function groupProgrammeByDate(
  programme: ProgrammeEvent[],
): ProgrammeDay[] {
  const days = new Map<string, ProgrammeEvent[]>();

  for (const event of programme) {
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
