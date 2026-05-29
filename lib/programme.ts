import { artists } from "@/data/artists";
import { events } from "@/data/events";
import { venues } from "@/data/venues";

export type ProgrammeEvent = (typeof events)[number] & {
  artist: (typeof artists)[number] | undefined;
  artists: (typeof artists)[number][];
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

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
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

export function formatEventDateShort(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return shortDateFormatter.format(new Date(year, month - 1, day));
}

export function getEventTitle(event: ProgrammeEvent) {
  return event.title ?? event.artist?.name ?? "Line-up to be announced";
}

export function getProgramme(): ProgrammeEvent[] {
  const artistById = new Map(artists.map((artist) => [artist.id, artist]));
  const venueById = new Map(venues.map((venue) => [venue.id, venue]));

  return [...events]
    .map((event) => ({
      ...event,
      artist: event.artistId ? artistById.get(event.artistId) : undefined,
      artists: (event.artistIds ?? [])
        .map((id) => artistById.get(id))
        .filter(
          (artist): artist is (typeof artists)[number] => artist !== undefined,
        ),
      venue: venueById.get(event.venueId),
    }))
    .sort((a, b) => {
      const byDate = a.date.localeCompare(b.date);
      if (byDate !== 0) return byDate;
      return a.time.localeCompare(b.time);
    });
}

export type VenueEventSummary = {
  id: string;
  dateLabel: string;
  time: string;
  title: string;
};

export function getEventsByVenue(): Record<string, VenueEventSummary[]> {
  const result: Record<string, VenueEventSummary[]> = {};

  for (const event of getProgramme()) {
    if (!event.venue) continue;
    (result[event.venue.id] ??= []).push({
      id: event.id,
      dateLabel: formatEventDateShort(event.date),
      time: formatEventTime(event.time),
      title: getEventTitle(event),
    });
  }

  return result;
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
