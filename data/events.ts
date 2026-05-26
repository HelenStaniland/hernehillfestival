export type Event = {
  id: string; // e.g. 2026-10-11-morning
  date: string; // YYYY-MM-DD
  venueId: string;
  time: string; // HH:MM
  artistId?: string;
};

export const events: Event[] = [
  {
    id: "2026-10-09-evening",
    date: "2026-10-09",
    artistId: "artist-tba",
    venueId: "half-moon",
    time: "19:30",
  },
  {
    id: "2026-10-10-morning",
    date: "2026-10-10",
    artistId: "artist-tba",
    venueId: "herne-hill-united-church",
    time: "10:30",
  },
  {
    id: "2026-10-10-afternoon",
    date: "2026-10-10",
    artistId: "artist-tba",
    venueId: "st-faiths",
    time: "14:30",
  },
  {
    id: "2026-10-10-evening",
    date: "2026-10-10",
    artistId: "pop-up-jazz-club",
    venueId: "station-hall",
    time: "19:30",
  },
  {
    id: "2026-10-11-afternoon",
    date: "2026-10-11",
    artistId: "rita-tam",
    venueId: "brockwell-greenhouses",
    time: "14:30",
  },
  {
    id: "2026-10-12-morning",
    date: "2026-10-12",
    artistId: "artist-tba",
    venueId: "carnegie-library",
    time: "14:30",
  },
  {
    id: "2026-10-12-evening",
    date: "2026-10-12",
    artistId: "artist-tba",
    venueId: "the-cuff-london",
    time: "19   :30",
  },
  {
    id: "2026-10-17-morning",
    date: "2026-10-17",
    artistId: "artist-tba",
    venueId: "st-pauls-church",
    time: "10:30",
  },
  {
    id: "2026-10-17-afternoon",
    date: "2026-10-17",
    artistId: "marama-cafe-band",
    venueId: "brockwell-greenhouses",
    time: "14:30",
  },
  {
    id: "2026-10-17-evening",
    date: "2026-10-17",
    artistId: "artist-tba",
    venueId: "the-cuff-london",
    time: "19:30",
  },
  {
    id: "2026-10-18-afternoon",
    date: "2026-10-18",
    artistId: "mama-grande",
    venueId: "brockwell-hall",
    time: "14:30",
  },
  {
    id: "2026-10-18-evening",
    date: "2026-10-18",
    artistId: "southwark-sinfonietta",
    venueId: "st-faiths",
    time: "19:30",
  },
];
