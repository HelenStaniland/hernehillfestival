export type Event = {
  id: string; // e.g. 2026-10-11-morning
  date: string; // YYYY-MM-DD
  venueId: string;
  time: string; // HH:MM — performance start (or main listed time)
  endTime?: string; // HH:MM
  entryTime?: string; // HH:MM — doors / entry from
  artistId?: string;
  title?: string;
  subtitle?: string;
  artistIds?: string[];
  image?: string;
};

export const events: Event[] = [
  {
    id: "2026-10-09-evening",
    date: "2026-10-09",
    artistId: "freddie-benedict-quartet",
    venueId: "half-moon",
    entryTime: "18:00",
    time: "20:00",
    endTime: "22:00",
  },
  {
    id: "2026-10-10-morning",
    date: "2026-10-10",
    title: "Coffee morning concert",
    subtitle: "String quintet · light music",
    image: "events/coffee-morning.jpg",
    venueId: "herne-hill-united-church",
    time: "10:30",
    endTime: "12:00",
  },
  {
    id: "2026-10-10-afternoon",
    date: "2026-10-10",
    title: "Herne Hill Sings On",
    artistIds: [
      "cambria-choir",
      "west-norwood-community-choir",
      "lambeth-ladies-choir",
      "nunhead-community-choir",
      "note-orious",
    ],
    image: "artists/cambria-choir.jpg",
    venueId: "st-faiths",
    time: "14:00",
    endTime: "16:30",
  },
  {
    id: "2026-10-10-evening",
    date: "2026-10-10",
    artistId: "pop-up-jazz-club",
    venueId: "station-hall",
    entryTime: "19:30",
    time: "20:15",
  },
  {
    id: "2026-10-11-afternoon",
    date: "2026-10-11",
    artistIds: ["rita-tam", "tuomo-karjalainen"],
    venueId: "brockwell-greenhouses",
    time: "15:00",
    endTime: "17:00",
  },
  {
    id: "2026-10-11-evening",
    date: "2026-10-11",
    title: "Come and Sing Festival Evensong",
    image: "events/festival-evensong.jpg",
    venueId: "st-faiths",
    time: "19:30",
    endTime: "20:30",
  },
  {
    id: "2026-10-12-evening",
    date: "2026-10-12",
    title: "Gong Bath",
    image: "events/gong-bath.jpg",
    venueId: "herne-hill-baptist-church",
    time: "19:00",
    endTime: "20:30",
  },
  {
    id: "2026-10-16-evening",
    date: "2026-10-16",
    artistId: "vincent-burke",
    venueId: "half-moon",
    entryTime: "18:00",
    time: "20:00",
    endTime: "22:00",
  },
  {
    id: "2026-10-17-morning",
    date: "2026-10-17",
    artistId: "margaret-omoniyi",
    venueId: "herne-hill-united-church",
    time: "10:00",
    endTime: "11:30",
  },
  {
    id: "2026-10-17-afternoon",
    date: "2026-10-17",
    artistId: "marama-cafe-band",
    venueId: "brockwell-greenhouses",
    time: "14:00",
    endTime: "16:00",
  },
  {
    id: "2026-10-17-evening",
    date: "2026-10-17",
    artistIds: ["kotoa", "hot-motel", "john-mcclean"],
    venueId: "venue-tba",
    time: "20:00",
    endTime: "22:30",
  },
  {
    id: "2026-10-18-afternoon",
    date: "2026-10-18",
    artistId: "mama-grande",
    venueId: "brockwell-hall",
    time: "14:00",
    endTime: "16:00",
    subtitle: "Bar Available",
  },
  {
    id: "2026-10-18-evening",
    date: "2026-10-18",
    artistId: "southwark-sinfonietta",
    venueId: "st-faiths",
    time: "18:00",
    endTime: "20:00",
  },
];
