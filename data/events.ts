export type AdmissionTicketType =
  | "standard"
  | "adult"
  | "concession"
  | "child"
  | "family";

/** Face value and booking fee for one ticket type. Amounts are GBP. */
export type AdmissionTicket = {
  type: AdmissionTicketType;
  /** Face value before the booking fee. 0 means this ticket type is free. */
  price: number;
  /** Unavoidable booking fee. Omit when there is no fee. */
  bookingFee?: number;
  /** Visitor-facing name when the type alone is not specific enough. */
  label?: string;
};

export type Admission =
  | { kind: "free"; registrationRequired?: boolean }
  | { kind: "paid"; tickets: [AdmissionTicket, ...AdmissionTicket[]] };

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
  /** Short line shown only on the all-events listing */
  listingNote?: string;
  /** Replaces the artist genre line on the all-events listing */
  listingSubtitle?: string;
  /** Longer copy for the individual event page */
  description?: string;
  descriptionLink?: {
    href: string;
    label: string;
    /** Full link text; defaults to “Find out more about {label}” */
    text?: string;
  };
  /** Optional heading override used only on the event detail page */
  pageTitle?: string;
  artistIds?: string[];
  image?: string;
  /** Overrides the photos shown on the events listing and event page */
  images?: string[];
  imagePosition?: "center" | "top" | "upper";
  imageCredit?: string;
  /** Headliner on the left, two support photos stacked on the right */
  imageLayout?: "featured-stack";
  /** Optional image used only on the individual event page */
  detailImage?: string;
  /** Ticket Tailor (or other) checkout URL; omit for free / unticketed events */
  ticketUrl?: string;
  admission: Admission;
  /** Opens the visitor’s email app with a short message already written */
  contactEmail?: {
    address: string;
    subject: string;
    body: string;
  };
};

export const events: Event[] = [
  {
    id: "2026-10-09-evening",
    date: "2026-10-09",
    artistId: "freddie-benedict-quartet",
    description:
      "Jazz vocalist and trumpeter Freddie Benedict brings his quartet to The Half Moon Pub for an evening of warm baritone interpretations, jazz standards, Brazilian songbook favourites and original compositions.",
    venueId: "half-moon",
    time: "20:00",
    endTime: "22:00",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2350835",
    admission: {
      kind: "paid",
      tickets: [
        { type: "standard", price: 20, bookingFee: 1.25 },
        { type: "concession", price: 15, bookingFee: 1 },
      ],
    },
  },
  {
    id: "2026-10-10-morning",
    date: "2026-10-10",
    title: "Coffee morning concert",
    artistId: "calton-quintet",
    subtitle: "String quintet · light music",
    description:
      "Start your weekend at this relaxed event — sip tea and munch on cake while you chat and listen to the Calton string quintet playing music from Classical, through Tango and Ragtime, to the Beatles!\n\nEveryone welcome, including children.\n\nA collection will be taken, with all proceeds going to the Lambeth & Croydon Foodbank.",
    descriptionLink: {
      href: "https://lambethcroydon.foodbank.org.uk/home",
      label: "Lambeth & Croydon Foodbank",
    },
    image: "artists/calton-quintet2.png",
    venueId: "herne-hill-united-church",
    time: "10:30",
    endTime: "12:00",
    admission: { kind: "free" },
  },
  {
    id: "2026-10-10-afternoon",
    date: "2026-10-10",
    title: "Herne Hill Sings On",
    description:
      "The Cambria Choir, West Norwood Community Choir, Nunhead Community Choir and Note-Orious come together for a joyful celebration of community singing. Expect an afternoon of rich harmonies, infectious enthusiasm and a wonderfully varied repertoire, showcasing the breadth of choral music across South London.",
    artistIds: [
      "cambria-choir",
      "west-norwood-community-choir",
      "nunhead-community-choir",
      "note-orious",
    ],
    image: "artists/cambria-choir.jpg",
    detailImage: "events/herne-hill-sings-on-composite.jpg",
    venueId: "st-faiths",
    time: "14:00",
    endTime: "16:30",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2351776",
    admission: {
      kind: "paid",
      tickets: [
        { type: "standard", price: 7, bookingFee: 0.7 },
        { type: "concession", price: 5, bookingFee: 0.5 },
      ],
    },
  },
  {
    id: "2026-10-10-evening",
    date: "2026-10-10",
    artistId: "pop-up-jazz-club",
    subtitle: "Bring your own bottle",
    description:
      "Pop Up Jazz Club brings its signature speakeasy atmosphere and live jazz to Station Hall for a lively Saturday night at the festival. An open, welcoming evening of live vocal jazz — local singers, the house band and candlelit tables; there’s no bar, so bring your own wine, beer or other drinks and we’ll provide the glasses, ice, ice buckets, bottle openers and, naturally, a strategically placed bowl of crisps or two.",
    venueId: "station-hall",
    entryTime: "19:30",
    time: "20:00",
    endTime: "23:00",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2353289",
    admission: {
      kind: "paid",
      tickets: [{ type: "standard", price: 8, bookingFee: 1 }],
    },
  },
  {
    id: "2026-10-11-afternoon",
    date: "2026-10-11",
    artistIds: ["rita-tam", "tuomo-karjalainen"],
    images: ["artists/rita-tam.jpg", "artists/TuomoProjection.jpeg"],
    description:
      "South-East London singer-songwriter Rita Tam brings heartfelt folk pop shaped by her East-meets-West heritage, personal experiences and stories, including music from her album Flores, which explores hope, love and nature. She shares the afternoon with Finnish guitarist Tuomo Karjalainen, whose cinematic acoustic style weaves together classical, rock, world and soundtrack influences.\n\nFor this special performance, Tuomo takes his music into a captivating dimension with live visual projections that dynamically react and evolve in real time alongside his guitar playing. Sound and light intertwine to create a mesmerising, immersive audio-visual journey—a truly unique live experience you won’t want to miss.",
    descriptionLink: {
      href: "https://www.youtube.com/watch?v=wiKSnLP1aM0",
      label: "the dynamic projections",
      text: "Get a sneak peek of the dynamic projections in action",
    },
    venueId: "brockwell-barn",
    time: "15:00",
    endTime: "17:00",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2353294",
    admission: {
      kind: "paid",
      tickets: [{ type: "standard", price: 13, bookingFee: 1 }],
    },
  },
  {
    id: "2026-10-11-ruskin-park-afternoon",
    date: "2026-10-11",
    artistId: "south-london-jazz-orchestra",
    description:
      "South London Jazz Orchestra brings the exhilarating sound of a full big band to Ruskin Park, sharing its love of jazz with the community as part of the park’s Music at the Bandstand programme.",
    descriptionLink: {
      href: "https://www.friendsofruskinpark.org.uk/whats-on/",
      label: "Ruskin Park’s Music at the Bandstand programme",
    },
    venueId: "ruskin-park-bandstand",
    time: "15:00",
    endTime: "17:00",
    admission: { kind: "free" },
  },
  {
    id: "2026-10-11-evening",
    date: "2026-10-11",
    title: "Come and Sing Festival Evensong",
    listingNote:
      "Join the festival choir for a special Evensong at St Faith’s — rehearse from 6pm, with the service at 7pm. All singers welcome.",
    description:
      "Come and sing at a special Festival Evensong at St Faith’s Church in Herne Hill. Singers of all abilities are welcome to join the festival choir for an evening of beautiful choral music — simply come along for the rehearsal at 6pm, followed by the service at 7pm.\n\nRepertoire:\nIntroit — Peace I leave with you by Amy Beach\nCanticles — Canticles in C by Charles Villiers Stanford\nResponses — L’Estrange by Joanna Forbes\nAnthem — O thou the central orb by Charles Wood\n\nIf you’d like to attend this event, kindly register your interest with us at St Faith’s.",
    contactEmail: {
      address: "music@stfaithschurch.org",
      subject: "Come and Sing Evensong - Herne Hill Festival",
      body: "I would like to register my interest in attending the Come and Sing Evensong at the Herne Hill Festival on Sunday October 11th.\n\nThanks!",
    },
    image: "events/festival-evensong.jpg",
    venueId: "st-faiths",
    entryTime: "18:00",
    time: "19:00",
    endTime: "20:30",
    admission: { kind: "free", registrationRequired: true },
  },
  {
    id: "2026-10-12-evening",
    date: "2026-10-12",
    title: "Quantum Gong Bath Meditation",
    artistId: "alicia-ma-ri-atu-ma",
    listingNote:
      "A relaxing gong bath and sound meditation in Herne Hill, South London, where you lie down and bathe in the resonant sound waves and vibrations of a large metal gong.",
    description:
      "Experience a powerful gong bath in Herne Hill, South London, with musician and sonic artist Alicia Mâ Ri Atu Mâ. Her Hush Hour combines quantum gong baths, mystical guided meditation, light language, healing instruments, percussion and voice to create an intimate, immersive sound experience.\n\nNever tried a gong bath or sound bath before? Gong bathing is probably one of the easiest ways to get into a meditative state, without having to do anything other than show up, lie down, and relax (bathe) in the sound waves of a large metal gong.\n\nGongs can help to cleanse and clear the debris of the past both on a personal and ancestral level. Blocked emotions are often released, physical aches and pains can improve, and many find their sleep patterns enhanced too.\n\nBathing in sound can be relaxing, invigorating, an entertaining, immersive event, a deeeeep meditation experience, a physical sensation, or a spiritual awakener. The experience is unique for each person who comes.\n\nParticipants need to bring their own blankets, mats and cushions.",
    image: "artists/GongBath1.jpeg",
    detailImage: "artists/GongBath2.jpeg",
    imagePosition: "upper",
    venueId: "herne-hill-baptist-church",
    time: "19:00",
    endTime: "20:15",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2353866",
    admission: {
      kind: "paid",
      tickets: [{ type: "standard", price: 22, bookingFee: 1.25 }],
    },
  },
  {
    id: "2026-10-16-evening",
    date: "2026-10-16",
    artistIds: ["vincent-burke", "sascha-osborn"],
    description:
      "South London songwriter Vincent Burke brings his lyrical, melodic songs to The Half Moon Pub, joined by Sascha Osborn, whose reflective songs blend folk, jazz and retro-soul. A Friday night of heartfelt songwriting from two distinctive voices.",
    venueId: "half-moon",
    time: "20:00",
    endTime: "22:00",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2353878",
    admission: {
      kind: "paid",
      tickets: [
        { type: "standard", price: 20, bookingFee: 1.25 },
        { type: "concession", price: 15, bookingFee: 1.25 },
      ],
    },
  },
  {
    id: "2026-10-17-morning",
    date: "2026-10-17",
    artistId: "margaret-omoniyi",
    listingSubtitle: "Live music for little ones",
    listingNote:
      "Songs, stories, puppets and real live instruments in a joyful, interactive musical adventure for babies and children aged 0–7.",
    description:
      "Bring your little ones along for a joyful morning of live music, songs and stories! Margaret and friends lead an interactive musical adventure for babies and children aged 0–7, with puppets, colourful props and plenty of opportunities to join in — all accompanied by live musical instruments.",
    venueId: "herne-hill-united-church",
    time: "10:00",
    endTime: "11:30",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2353889",
    admission: {
      kind: "paid",
      tickets: [
        { type: "adult", price: 10.5, bookingFee: 1 },
        { type: "child", price: 6, bookingFee: 0.6 },
        {
          type: "family",
          label: "Family of Four",
          price: 25,
          bookingFee: 1.25,
        },
      ],
    },
  },
  {
    id: "2026-10-17-afternoon",
    date: "2026-10-17",
    artistId: "marama-cafe-band",
    description:
      "Marama Cafe Band brings an afternoon of vibrant Gypsy jazz to Brockwell Community Greenhouses, combining infectious rhythms with the relaxed atmosphere of this much-loved local venue.",
    venueId: "brockwell-greenhouses",
    time: "14:00",
    endTime: "16:00",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2353899",
    admission: {
      kind: "paid",
      tickets: [{ type: "standard", price: 13, bookingFee: 1 }],
    },
  },
  {
    id: "2026-10-17-evening",
    date: "2026-10-17",
    title: "John McClean and the Clan",
    artistIds: [
      "john-mcclean",
      "the-grove",
      "the-long-string-hawkers",
      "dj-swerve",
    ],
    pageTitle: "John McClean and the Clan",
    subtitle: "with The Grove and The Long String Hawkers",
    description:
      "John McClean and the Clan headline a fantastic lineup of live music at Effra Social which they've curated. They'll bring their distinctive blend of blues, soul, gospel and rock alongside The Grove and The Long String Hawkers.\n\nDoors open at 6:30pm. Ticketed live music runs from 7pm to 10pm, with London-based DJ Swerve on the decks from 10pm till late — free entry for the afterparty set.",
    image: "artists/john-mcclean3.jpeg",
    imageLayout: "featured-stack",
    venueId: "effra-social",
    entryTime: "18:30",
    time: "19:00",
    endTime: "22:00",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2353908",
    admission: {
      kind: "paid",
      tickets: [
        { type: "standard", price: 12, bookingFee: 0.9 },
        { type: "concession", price: 8, bookingFee: 0.7 },
      ],
    },
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
    imagePosition: "top",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2353914",
    admission: {
      kind: "paid",
      tickets: [
        { type: "standard", price: 15, bookingFee: 1 },
        { type: "concession", price: 11, bookingFee: 1 },
      ],
    },
  },
  {
    id: "2026-10-18-evening",
    date: "2026-10-18",
    artistId: "southwark-sinfonietta",
    description:
      "This Southwark Sinfonietta concert will take a relaxed approach to movement and noise, welcoming audience members who may usually find it difficult to attend concerts. This is why this year’s event will take place in the hall rather than the church.\n\nThe programme will be classical, with interesting works that are manageable in length, contrasting in style and featuring soloists and some audience participation. Introductions to each piece will guide the audience through descriptions and musical illustrations.\n\nThe concert is also planned to include an audience-facing musician who can mingle with guests and play some of the themes on their instrument. The conductor and soloists will be approachable too, making the music more accessible through narrative and demonstration.",
    venueId: "st-faiths-community-centre",
    time: "18:00",
    endTime: "20:00",
    ticketUrl: "https://buytickets.at/hernehillmusicfestival/2353931",
    admission: {
      kind: "paid",
      tickets: [
        { type: "adult", price: 10, bookingFee: 1 },
        { type: "child", price: 0 },
      ],
    },
  },
];
