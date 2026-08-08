export type Venue = {
  id: string;
  name: string;
  address: string;
  website?: string;
  lat?: number;
  lng?: number;
  accessibility: string;
  accessibilityUrl?: string;
};

export const venues: Venue[] = [
  {
    id: "venue-tba",
    name: "Venue TBA",
    address: "",
    accessibility:
      "Accessibility details will be published when the venue is confirmed.",
  },
  {
    id: "half-moon",
    name: "The Half Moon Pub",
    address: "10 Half Moon Lane, Herne Hill, London SE24 9HU",
    website: "https://www.halfmoonhernehill.co.uk/",
    accessibility:
      "Step-free access, an accessible toilet and a listening system are available. There is no on-site parking; paid street parking is available nearby.",
    accessibilityUrl: "https://www.halfmoonhernehill.co.uk/",
    lat: 51.4530888,
    lng: -0.1010589,
  },
  {
    id: "station-hall",
    name: "Station Hall",
    address: "Herne Hill Station, Railton Road, London SE24 0JW",
    website: "https://www.stationhallhernehill.org/",
    accessibility:
      "Station Hall is accessed by several flights of stairs and currently has no lift or wheelchair access. There is no accessible toilet.",
    accessibilityUrl: "https://www.stationhallhernehill.org/vision",
    lat: 51.4532075,
    lng: -0.1016409,
  },
  {
    id: "herne-hill-united-church",
    name: "Herne Hill United Church",
    address: "Red Post Hill, Herne Hill, London SE24 9PW",
    website: "https://www.hhuc.co.uk/",
    accessibility:
      "Disabled access and an accessible toilet are available. Limited on-site parking is provided; contact the church about specific access or parking requirements.",
    accessibilityUrl: "https://www.hhuc.co.uk/rooms-for-hire/",
    lat: 51.459613,
    lng: -0.093352,
  },
  {
    id: "st-faiths",
    name: "St Faith’s Church",
    address: "62 Red Post Hill, London SE24 9JQ",
    website: "https://www.stfaithschurch.org/",
    accessibility:
      "A hearing loop and portable internal ramp are available. A small car park is reserved for mobility-impaired visitors. Please confirm entrance and toilet access with the church.",
    accessibilityUrl:
      "https://www.achurchnearyou.com/church/733/facilities/",
    lat: 51.4568125,
    lng: -0.0900625,
  },
  {
    id: "st-faiths-community-centre",
    name: "St Faith’s Community Centre",
    address: "Red Post Hill, London SE24 9JQ",
    website: "https://www.stfaithscentre.org/",
    accessibility:
      "Wheelchair-accessible toilets and an on-site car park are available. Contact the centre to confirm step-free routes and accessible parking.",
    accessibilityUrl: "https://www.stfaithscentre.org/weekend-event-hire",
    lat: 51.455339,
    lng: -0.089709,
  },
  {
    id: "brockwell-greenhouses",
    name: "Brockwell Community Greenhouses",
    address: "Brockwell Park, Dulwich Road, London SE24 0PA",
    website: "https://www.brockwellgreenhouses.org.uk/",
    accessibility:
      "Public buildings have step-free access, most grounds are wheelchair-accessible, and two accessible toilets are available. Some paths are narrow, uneven or surfaced with woodchip. Brockwell Park is hilly; avoid the steep Tulse Hill entrance if possible.",
    accessibilityUrl: "https://www.brockwellgreenhouses.org.uk/visit-us/",
    lat: 51.4499882,
    lng: -0.1091145,
  },
  {
    id: "herne-hill-baptist-church",
    name: "Herne Hill Baptist Church",
    address: "Half Moon Lane, London SE24 9HU",
    website: "https://hhbc.org.uk/",
    accessibility:
      "Wheelchair access is via the Winterbrook Road side entrance and should be arranged in advance. The Worship Hall is upstairs; lift, accessible-toilet and hearing-loop provision are unconfirmed.",
    accessibilityUrl:
      "https://dnd.u3asite.uk/u3a_venues/herne-hill-baptist-church/",
    lat: 51.4524646,
    lng: -0.0981548,
  },
  {
    id: "the-cuff-london",
    name: "The Cuff London",
    address: "Arch 648, 301-303 Railton Road, Herne Hill, London SE24 0JN",
    website: "https://www.thecufflondon.co.uk/",
    accessibility:
      "Directory information reports ground-level wheelchair access, but no accessible toilet or dedicated accessible parking. Some facilities are on a mezzanine with no lift; contact the venue to confirm your requirements.",
    accessibilityUrl:
      "https://www.tagvenue.com/rooms/london/99449/the-cuff-london-arch-golf/arch-golf",
    lat: 51.4529782,
    lng: -0.102118,
  },
  {
    id: "brockwell-hall",
    name: "Brockwell Hall",
    address: "Brockwell Park, London SE24 9BJ",
    website: "https://venue.lambeth.gov.uk/venues/brockwell-hall",
    accessibility:
      "Wheelchair access, accessible toilets, ramps and lifts are available. Two Blue Badge bays are beside the hall, reached by a step-free but uneven route approximately 800 metres inside the park. There is no designated drop-off point.",
    accessibilityUrl:
      "https://www.accessable.co.uk/london-borough-of-lambeth/access-guides/brockwell-park",
    lat: 51.4515818,
    lng: -0.1012349,
  },
  {
    id: "ruskin-park-bandstand",
    name: "Ruskin Park Bandstand",
    address: "Ruskin Park, Denmark Hill, London SE5 8EL",
    website: "https://www.friendsofruskinpark.org.uk/visit/",
    accessibility:
      "The park and audience area can be reached by step-free routes, although some surfaces are uneven. The bandstand platform itself has four steps with handrails and no step-free platform access. Accessible parking is limited.",
    accessibilityUrl:
      "https://www.accessable.co.uk/london-borough-of-lambeth/access-guides/ruskin-park",
    lat: 51.465707,
    lng: -0.09234,
  },
];
