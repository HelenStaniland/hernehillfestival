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
  /** Longer copy for the individual event page */
  description?: string;
  /** Optional heading override used only on the event detail page */
  pageTitle?: string;
  artistIds?: string[];
  image?: string;
  imagePosition?: "center" | "top";
  imageCredit?: string;
  /** Optional image used only on the individual event page */
  detailImage?: string;
};

export const events: Event[] = [
  {
    id: "2026-10-09-evening",
    date: "2026-10-09",
    artistId: "freddie-benedict-quartet",
    description:
      "Jazz vocalist and trumpeter Freddie Benedict brings his quartet to the Half Moon for an evening of warm baritone interpretations, jazz standards, Brazilian songbook favourites and original compositions.",
    venueId: "half-moon",
    time: "20:00",
    endTime: "22:00",
  },
  {
    id: "2026-10-10-morning",
    date: "2026-10-10",
    title: "Coffee morning concert",
    artistId: "calton-string-quartet",
    subtitle: "String quartet · light music",
    description:
      "The Calton String Quartet makes a welcome return to the festival for a relaxed morning of light music and coffee at Herne Hill United Church.",
    image: "events/coffee-morning.jpg",
    venueId: "herne-hill-united-church",
    time: "10:30",
    endTime: "12:00",
  },
  {
    id: "2026-10-10-afternoon",
    date: "2026-10-10",
    title: "Herne Hill Sings On",
    description:
      "The Cambria Choir, West Norwood Community Choir, Lambeth Ladies Choir, Nunhead Community Choir and Note-Orious come together for a joyful celebration of community singing. Expect an afternoon of rich harmonies, infectious enthusiasm and a wonderfully varied repertoire, showcasing the breadth of choral music across South London.",
    artistIds: [
      "cambria-choir",
      "west-norwood-community-choir",
      "lambeth-ladies-choir",
      "nunhead-community-choir",
      "note-orious",
    ],
    image: "artists/cambria-choir.jpg",
    detailImage: "events/herne-hill-sings-on.jpg",
    venueId: "st-faiths",
    time: "14:00",
    endTime: "16:30",
  },
  {
    id: "2026-10-10-evening",
    date: "2026-10-10",
    artistId: "pop-up-jazz-club",
    description:
      "Pop Up Jazz Club brings its signature speakeasy atmosphere and live jazz to Station Hall for a lively Saturday night at the festival.",
    venueId: "station-hall",
    entryTime: "19:30",
    time: "20:15",
  },
  {
    id: "2026-10-11-afternoon",
    date: "2026-10-11",
    artistIds: ["rita-tam", "tuomo-karjalainen"],
    description:
      "Rita Tam and Finnish guitarist Tuomo Karjalainen share an afternoon of live music at Brockwell Greenhouses, including Tuomo’s cinematic blend of classical, rock, world and soundtrack influences.",
    venueId: "brockwell-greenhouses",
    time: "15:00",
    endTime: "17:00",
  },
  {
    id: "2026-10-11-evening",
    date: "2026-10-11",
    title: "Come and Sing Festival Evensong",
    description:
      "Come together at St Faith’s Church for a special festival evensong, bringing voices and community together in this beautiful local setting.",
    image: "events/festival-evensong.jpg",
    venueId: "st-faiths",
    time: "19:30",
    endTime: "20:30",
  },
  {
    id: "2026-10-12-evening",
    date: "2026-10-12",
    title: "Gong Bath",
    artistId: "alicia-ma-ri-atu-ma",
    description:
      "With powerful quantum gong baths, mystical guided meditation, light language and more, Alicia Mâ Ri Atu Mâ’s Hush Hour is all about making time for you. A musician, sonic artist, nature lover and creative all-rounder, Alicia’s live festival session is as much an intimate performance as a transformative, immersive soundscape combining healing instruments, quantum technology, percussion and voice.",
    image: "artists/alicia-ma-ri-atu-ma.jpg",
    imagePosition: "top",
    imageCredit: "Photo: Adrian Flower",
    venueId: "herne-hill-baptist-church",
    time: "19:00",
    endTime: "20:30",
  },
  {
    id: "2026-10-16-evening",
    date: "2026-10-16",
    artistId: "vincent-burke",
    description:
      "South London songwriter, guitarist and vocalist Vincent Burke brings his lyrical, melodic songs to the Half Moon for the festival’s second Friday night.",
    venueId: "half-moon",
    time: "20:00",
    endTime: "22:00",
  },
  {
    id: "2026-10-17-morning",
    date: "2026-10-17",
    artistId: "margaret-omoniyi",
    description:
      "Community music leader Margaret Omoniyi leads a welcoming children’s workshop designed to help young people explore music, build confidence and enjoy making music together.",
    venueId: "herne-hill-united-church",
    time: "10:00",
    endTime: "11:30",
  },
  {
    id: "2026-10-17-afternoon",
    date: "2026-10-17",
    artistId: "marama-cafe-band",
    description:
      "Marama Cafe Band brings an afternoon of vibrant Latin jazz to Brockwell Greenhouses, combining infectious rhythms with the relaxed atmosphere of this much-loved local venue.",
    venueId: "brockwell-greenhouses",
    time: "14:00",
    endTime: "16:00",
  },
  {
    id: "2026-10-17-evening",
    date: "2026-10-17",
    artistIds: ["john-mcclean", "kotoa", "hot-motel"],
    pageTitle: "John McClean and the Clan",
    description:
      "John McClean and the Clan headline a powerful evening of live music, bringing their distinctive blend of blues, soul, gospel and rock alongside Kotoa and Hot Motel.",
    venueId: "venue-tba",
    time: "20:00",
    endTime: "22:30",
  },
  {
    id: "2026-10-18-afternoon",
    date: "2026-10-18",
    artistId: "mama-grande",
    description:
      "Mama Grande brings vibrant Latin music and live performance to Brockwell Hall for a celebratory Sunday afternoon, with a bar available throughout the event.",
    venueId: "brockwell-hall",
    time: "14:00",
    endTime: "16:00",
    subtitle: "Bar Available",
  },
  {
    id: "2026-10-18-evening",
    date: "2026-10-18",
    artistId: "southwark-sinfonietta",
    description:
      "Southwark Sinfonietta closes the festival with an evening of orchestral music, performed by this South London ensemble for its local audience.",
    venueId: "st-faiths-community-centre",
    time: "18:00",
    endTime: "20:00",
  },
];
