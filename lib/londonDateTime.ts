/**
 * ISO-8601 wall time with the Europe/London offset that applies on that date.
 * The offset is resolved from the timezone database, including BST changes.
 */
export function formatLondonDateTime(date: string, time: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const guessedOffset = londonOffsetMinutes(wallAsUtc);
  const offsetMinutes = londonOffsetMinutes(wallAsUtc - guessedOffset * 60_000);
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const offsetMins = String(absolute % 60).padStart(2, "0");
  const hours = String(hour).padStart(2, "0");
  const minutes = String(minute).padStart(2, "0");

  return `${date}T${hours}:${minutes}:00${sign}${offsetHours}:${offsetMins}`;
}

function londonOffsetMinutes(utcMs: number): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  const londonAsUtc = Date.UTC(
    value("year"),
    value("month") - 1,
    value("day"),
    value("hour"),
    value("minute"),
    value("second"),
  );

  return Math.round((londonAsUtc - utcMs) / 60_000);
}
