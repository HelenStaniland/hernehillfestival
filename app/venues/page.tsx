import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";
import { VenueDetails } from "@/components/site/VenueDetails";
import { VenueMapSection } from "@/components/site/VenueMapSection";
import { venues } from "@/data/venues";
import { festival } from "@/lib/festival";
import { getEventsByVenue } from "@/lib/programme";

export const metadata: Metadata = {
  title: `Venues | ${festival.name}`,
  description: "Venues hosting festival events.",
};

export default function VenuesPage() {
  const listedVenues = venues.filter((venue) => venue.id !== "venue-tba");
  const venueEvents = getEventsByVenue();
  const mapVenues = listedVenues.filter(
    (venue): venue is (typeof venues)[number] & { lat: number; lng: number } =>
      typeof venue.lat === "number" && typeof venue.lng === "number",
  );

  return (
    <PageShell
      title="Venues"
      description="Where to find live music around Herne Hill."
    >
      <div className="space-y-10">
        <VenueMapSection venues={mapVenues} venueEvents={venueEvents} />

        <section aria-labelledby="venue-list-heading">
          <h2 id="venue-list-heading" className="festival-label">
            All venues
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {listedVenues.map((venue) => (
              <li
                key={venue.id}
                id={venue.id}
                className="festival-card scroll-mt-28 p-5 sm:p-6"
              >
                <VenueDetails
                  venue={venue}
                  prominentName
                  showAccessibility
                  showCapacity
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
