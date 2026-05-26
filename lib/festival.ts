export const festival = {
  name: "Herne Hill Music Festival",
  intro:
    "A vibrant local community music festival bringing live music to venues across Herne Hill over two weekends.",
  location: "Herne Hill, London",
  weekends: [
    {
      id: "weekend-1",
      label: "Weekend 1",
      dates: "Friday 10 October – Monday 12 October",
    },
    {
      id: "weekend-2",
      label: "Weekend 2",
      dates: "Friday 16 October – Sunday 18 October",
    },
  ],
} as const;

export const navLinks = [
  { href: "/news", label: "News" },
  { href: "/artists", label: "Artists" },
  { href: "/venues", label: "Venues" },
  { href: "/events", label: "Events" },
] as const;

export const homeFeatures = [
  {
    href: "/news",
    title: "Latest News",
    description: "Dates, announcements and festival updates.",
    accent: "coral" as const,
  },
  {
    href: "/artists",
    title: "Artists",
    description: "Who’s on the bill this year.",
    accent: "purple" as const,
  },
  {
    href: "/venues",
    title: "Venues",
    description: "Pubs and halls hosting live music.",
    accent: "gold" as const,
  },
  {
    href: "/events",
    title: "Events",
    description: "Times, line-up and where to go.",
    accent: "teal" as const,
  },
] as const;
