import type { Metadata } from "next";
import { PageShell } from "@/components/site/PageShell";
import { VenueDetails } from "@/components/site/VenueDetails";
import { venues } from "@/data/venues";
import { festival } from "@/lib/festival";

export const metadata: Metadata = {
  title: `Venues | ${festival.name}`,
  description: "Venues hosting festival events.",
};

export default function VenuesPage() {
  return (
    <PageShell
      title="Venues"
      description="Where to find live music around Herne Hill."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {venues.map((venue) => (
          <li key={venue.id} className="festival-card p-5 sm:p-6">
            <VenueDetails venue={venue} prominentName />
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
