import { artists } from "@/data/artists";
import { sponsors, type SponsorTier } from "@/data/sponsors";

export type HomeGalleryArtist = {
  kind: "artist";
  id: string;
  name: string;
  image: string;
  href?: string;
};

export type HomeGallerySponsor = {
  kind: "sponsor";
  id: string;
  name: string;
  logo: string;
  href?: string;
};

const tierOrder: Record<SponsorTier, number> = {
  principal: 0,
  partner: 1,
  supporter: 2,
};

export function getHomeGalleryArtists(): HomeGalleryArtist[] {
  return artists
    .filter((artist): artist is (typeof artists)[number] & { image: string } =>
      Boolean(artist.image),
    )
    .map((artist) => ({
      kind: "artist" as const,
      id: artist.id,
      name: artist.name,
      image: artist.image,
      href: artist.website,
    }));
}

export function getHomeGallerySponsors(): HomeGallerySponsor[] {
  return sponsors
    .filter(
      (sponsor): sponsor is typeof sponsor & { logo: string } =>
        sponsor.showOnHome !== false && Boolean(sponsor.logo),
    )
    .sort((a, b) => {
      const aTier = a.tier ? tierOrder[a.tier] : tierOrder.supporter;
      const bTier = b.tier ? tierOrder[b.tier] : tierOrder.supporter;
      return aTier - bTier;
    })
    .map((sponsor) => ({
      kind: "sponsor" as const,
      id: sponsor.id,
      name: sponsor.name,
      logo: sponsor.logo,
      href: sponsor.website,
    }));
}
