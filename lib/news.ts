export type NewsItem = {
  id: string;
  title: string;
  body: string;
  link?: { href: string; label: string };
};

export function getNewsItems(): NewsItem[] {
  return [
    {
      id: "festival-returns",
      title: "Herne Hill Music Festival returns this October",
      body: "Herne Hill Music Festival returns from 9–18 October, with two weekends of live music and community events across Herne Hill.\n\nThis year’s programme brings together jazz, classical music, community choirs, folk, Latin music, family events, sound meditation and more at venues across the neighbourhood.",
      link: { href: "/events", label: "Explore the full programme" },
    },
    {
      id: "tickets-on-sale",
      title: "Tickets are now on sale",
      body: "Tickets are available now for this year’s festival events. Some venues have limited capacity, so we’d recommend booking ahead for anything you particularly want to see.",
      link: { href: "/events", label: "View events & book tickets" },
    },
  ];
}
