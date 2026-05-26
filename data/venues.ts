export type Venue = {
  id: string;
  name: string;
  address: string;
  website?: string;
  lat: number;
  lng: number;
};

export const venues: Venue[] = [
  {
    id: "half-moon",
    name: "Half Moon",
    address: "10 Half Moon Lane, Herne Hill, London SE24 9HU",
    website: "https://www.halfmoonhernehill.co.uk/",
    lat: 51.4530888,
    lng: -0.1010589,
  },
  {
    id: "station-hall",
    name: "Station Hall",
    address: "Herne Hill Station, Railton Road, London SE24 0JW",
    website: "https://www.stationhallhernehill.org/",
    lat: 51.4532075,
    lng: -0.1016409,
  },
  {
    id: "herne-hill-united-church",
    name: "Herne Hill United Church",
    address: "Red Post Hill, Herne Hill, London SE24 9PW",
    website: "https://www.hhuc.co.uk/",
    lat: 51.459613,
    lng: -0.093352,
  },
  {
    id: "st-faiths",
    name: "St Faith’s Church",
    address: "62 Red Post Hill, London SE24 9JQ",
    website: "https://www.stfaithschurch.org/",
    lat: 51.4568125,
    lng: -0.0900625,
  },
  {
    id: "brockwell-greenhouses",
    name: "Brockwell Greenhouses",
    address: "Brockwell Park, Dulwich Road, London SE24 0PA",
    website: "https://www.brockwellgreenhouses.org.uk/",
    lat: 51.4499882,
    lng: -0.1091145,
  },
  {
    id: "carnegie-library",
    name: "Carnegie Library",
    address: "192 Herne Hill Road, London SE24 0AG",
    website: "https://libraries.lambeth.gov.uk/-/carnegie-library",
    lat: 51.460696,
    lng: -0.0964647,
  },
  {
    id: "the-cuff-london",
    name: "The Cuff London",
    address: "Arch 648, 301-303 Railton Road, Herne Hill, London SE24 0JN",
    website: "https://www.thecufflondon.co.uk/",
    lat: 51.4529782,
    lng: -0.102118,
  },
  {
    id: "st-pauls-church",
    name: "St Paul’s Church",
    address: "Herne Hill SE24 9LY",
    website: "https://hernehillparish.org.uk/church/",
    lat: 51.4554407,
    lng: -0.1001002,
  },
  {
    id: "brockwell-hall",
    name: "Brockwell Hall",
    address: "Brockwell Park, London SE24 9BJ",
    website: "https://venue.lambeth.gov.uk/venues/brockwell-hall",
    lat: 51.4515818,
    lng: -0.1012349,
  },
];
