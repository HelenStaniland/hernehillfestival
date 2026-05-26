import type { artists } from "@/data/artists";

type Artist = (typeof artists)[number];

type ArtistDetailsProps = {
  artist: Artist;
  prominentName?: boolean;
  showBio?: boolean;
};

export function ArtistDetails({
  artist,
  prominentName = false,
  showBio = true,
}: ArtistDetailsProps) {
  return (
    <div>
      {artist.genre && artist.genre !== "TBA" ? (
        <p className="festival-label">{artist.genre}</p>
      ) : null}
      {prominentName ? (
        <h2 className="font-display mt-1 text-3xl tracking-wide text-white">
          {artist.name}
        </h2>
      ) : (
        <p className="font-semibold text-white">{artist.name}</p>
      )}
      {showBio && artist.bio ? (
        <p className="mt-3 festival-body">{artist.bio}</p>
      ) : null}
      {artist.website ? (
        <a
          href={artist.website}
          target="_blank"
          rel="noopener noreferrer"
          className="festival-link mt-2 inline-block text-sm"
        >
          Visit website →
        </a>
      ) : null}
    </div>
  );
}
