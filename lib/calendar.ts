import { festival } from "@/lib/festival";
import { getEventTitle, type ProgrammeEvent } from "@/lib/programme";

const DEFAULT_DURATION_HOURS = 2;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toLocalStamp(date: Date) {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  );
}

function toUtcStamp(date: Date) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
      date.getUTCDate(),
    )}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(
      date.getUTCSeconds(),
    )}Z`
  );
}

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function buildEventIcs(event: ProgrammeEvent): string {
  const [year, month, day] = event.date.split("-").map(Number);
  const [hours, minutes] = event.time.split(":").map(Number);
  const start = new Date(year, month - 1, day, hours, minutes);
  const end = new Date(
    start.getTime() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000,
  );

  const title = getEventTitle(event);
  const summary = `${title} — ${festival.name}`;
  const location = event.venue
    ? [event.venue.name, event.venue.address].filter(Boolean).join(", ")
    : festival.location;
  const descriptionParts = [
    event.venue ? `At ${event.venue.name}` : null,
    event.venue?.website ?? null,
  ].filter((part): part is string => Boolean(part));

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Herne Hill Music Festival//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@hernehillfestival`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toLocalStamp(start)}`,
    `DTEND:${toLocalStamp(end)}`,
    `SUMMARY:${escapeText(summary)}`,
    `LOCATION:${escapeText(location)}`,
    descriptionParts.length
      ? `DESCRIPTION:${escapeText(descriptionParts.join("\n"))}`
      : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter((line): line is string => line !== null);

  return lines.join("\r\n");
}

export function eventIcsFilename(event: ProgrammeEvent): string {
  const slug = getEventTitle(event)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${event.date}-${slug || "event"}.ics`;
}
