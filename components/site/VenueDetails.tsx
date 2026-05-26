import type { venues } from "@/data/venues";

type Venue = (typeof venues)[number];

type VenueDetailsProps = {
  venue: Venue;
  prominentName?: boolean;
};

export function VenueDetails({
  venue,
  prominentName = false,
}: VenueDetailsProps) {
  return (
    <div>
      {prominentName ? (
        <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
          {venue.name}
        </h2>
      ) : (
        <p className="font-semibold text-white">{venue.name}</p>
      )}
      {venue.address ? (
        <p className="mt-2 festival-body">{venue.address}</p>
      ) : null}
      {venue.website ? (
        <a
          href={venue.website}
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
