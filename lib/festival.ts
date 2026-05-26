import { events } from "@/data/events";
import { formatEventDate } from "@/lib/programme";

export const festival = {
  name: "Herne Hill Music Festival",
  location: "Herne Hill, London",
  tagline: "Live music in the heart of South London",
} as const;

function parseEventDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getFestivalDateRange(): string {
  const sorted = [...new Set(events.map((event) => event.date))].sort();
  if (sorted.length === 0) return "Dates coming soon";
  if (sorted.length === 1) return formatEventDate(sorted[0]);

  const start = parseEventDate(sorted[0]);
  const end = parseEventDate(sorted[sorted.length - 1]);
  const monthYear = end.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()}–${end.getDate()} ${monthYear}`;
  }

  return `${formatEventDate(sorted[0])} – ${formatEventDate(sorted[sorted.length - 1])}`;
}
