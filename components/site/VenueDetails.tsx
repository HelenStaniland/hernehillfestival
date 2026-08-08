import Link from "next/link";
import type { venues } from "@/data/venues";

type Venue = (typeof venues)[number];

type VenueDetailsProps = {
  venue: Venue;
  prominentName?: boolean;
  showAddress?: boolean;
  showWebsite?: boolean;
  showAccessibility?: boolean;
  linkToVenuePage?: boolean;
};

function VenueName({
  venue,
  prominentName,
  linkToVenuePage,
}: {
  venue: Venue;
  prominentName: boolean;
  linkToVenuePage: boolean;
}) {
  const className = prominentName
    ? "font-display text-2xl tracking-wide text-white sm:text-3xl"
    : "font-semibold text-white";

  if (linkToVenuePage && venue.id !== "venue-tba") {
    return (
      <Link
        href={`/venues#${venue.id}`}
        className={`festival-link ${className}`}
      >
        {venue.name}
      </Link>
    );
  }

  if (prominentName) {
    return <h2 className={className}>{venue.name}</h2>;
  }

  return <p className={className}>{venue.name}</p>;
}

export function VenueDetails({
  venue,
  prominentName = false,
  showAddress = true,
  showWebsite = true,
  showAccessibility = false,
  linkToVenuePage = false,
}: VenueDetailsProps) {
  return (
    <div>
      <VenueName
        venue={venue}
        prominentName={prominentName}
        linkToVenuePage={linkToVenuePage}
      />
      {showAddress && venue.address ? (
        <p className="mt-2 festival-body">{venue.address}</p>
      ) : null}
      {showWebsite && venue.website ? (
        <a
          href={venue.website}
          target="_blank"
          rel="noopener noreferrer"
          className="festival-link mt-2 inline-block text-sm"
        >
          Visit website →
        </a>
      ) : null}
      {showAccessibility ? (
        <div className="mt-4 rounded-lg border border-white/15 bg-white/5 p-4">
          <p className="festival-label">Accessibility</p>
          <p className="mt-2 festival-body text-sm">{venue.accessibility}</p>
          {venue.accessibilityUrl ? (
            <a
              href={venue.accessibilityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="festival-link mt-2 inline-block text-sm"
            >
              Accessibility source →
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
