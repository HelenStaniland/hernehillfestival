import { events } from "@/data/events";
import { festival } from "@/lib/festival";

export type NewsItem = {
  id: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
};

export function getNewsItems(): NewsItem[] {
  const items: NewsItem[] = [
    {
      id: "festival-dates",
      title: "Save the dates",
      body: `${festival.name} returns across two weekends: ${festival.weekends.map((w) => w.dates).join("; ")}.`,
    },
  ];

  if (events.length > 0) {
    items.push({
      id: "events-live",
      title: "Events on the programme",
      body: `${events.length} ${events.length === 1 ? "gig" : "gigs"} listed so far — more to come.`,
      link: { href: "/events", label: "View events" },
    });
  }

  return items;
}
