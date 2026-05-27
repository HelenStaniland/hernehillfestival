export const festival = {
  name: "Herne Hill Music Festival",
  intro:
    "Herne Hill comes alive over two weekends of live music, performances, and community events across the neighbourhood. From jazz and Latin rhythms to choirs, family concerts, and late-night sessions, the festival brings together artists, audiences, pubs, halls, churches and community spaces in celebration of local music and culture.",
  location: "Herne Hill, London",
  homeEyebrow: "Live in South London",
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
  { href: "/sponsors", label: "Sponsors" },
] as const;

export const pastFestivalsLink = {
  href: "/archive/hernehillfestival.org/home.html",
  label: "Past festivals",
} as const;

export const homeFeatures = [
  {
    href: "/news",
    title: "Latest News",
    description: "Dates, announcements and festival updates.",
    accent: "mint" as const,
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
    accent: "mint" as const,
  },
  {
    href: "/events",
    title: "Events",
    description: "Times, line-up and where to go.",
    accent: "teal" as const,
  },
] as const;
