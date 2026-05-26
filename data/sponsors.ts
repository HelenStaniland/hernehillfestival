export type SponsorTier = "principal" | "partner" | "supporter";

export type Sponsor = {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  tier?: SponsorTier;
  showOnHome?: boolean;
};

export const sponsors: Sponsor[] = [
  {
    id: "lambeth-council",
    name: "Lambeth Council",
    logo: "sponsors/lambeth-council.svg",
    website: "https://www.lambeth.gov.uk/",
    tier: "principal",
  },
  {
    id: "southwark-council",
    name: "Southwark Council",
    logo: "sponsors/southwark-council.svg",
    website: "https://www.southwark.gov.uk/",
    tier: "principal",
  },
  {
    id: "herne-hill-school",
    name: "Herne Hill School",
    logo: "sponsors/herne-hill-school.svg",
    website: "https://hernehillschool.co.uk/",
    tier: "partner",
  },
  {
    id: "llewelyns",
    name: "Llewelyn's",
    logo: "sponsors/llewelyns.png",
    website: "https://www.llewelyns-restaurant.co.uk/",
    tier: "partner",
  },
  {
    id: "petermans",
    name: "Petermans",
    logo: "sponsors/petermans.png",
    website: "https://www.petermans.co.uk/",
    tier: "partner",
  },
  {
    id: "half-moon-dental-care",
    name: "Half Moon Dental Care",
    logo: "sponsors/half-moon-dental-care.png",
    website: "https://www.halfmoondental.com/",
    tier: "partner",
  },
  {
    id: "herne-hill-society",
    name: "Herne Hill Society",
    logo: "sponsors/herne-hill-society.png",
    website: "https://www.hernehillsociety.org.uk/",
    tier: "supporter",
  },
  {
    id: "herne-hill-forum",
    name: "Herne Hill Forum",
    logo: "sponsors/herne-hill-forum.png",
    website: "https://www.hernehillforum.org.uk/",
    tier: "supporter",
  },
];
