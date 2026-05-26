import { SectionHeading } from "@/components/home/SectionHeading";
import { venues } from "@/data/venues";

export function VenueHighlights() {
  return (
    <section
      id="venues"
      className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Locations"
          title="Venue highlights"
          description="Walkable spots around Herne Hill — each with its own character and sound."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {venues.map((venue, index) => (
            <li key={venue.id}>
              <article className="relative overflow-hidden rounded-2xl border border-festival-cream/20 bg-festival-card p-6 shadow-md shadow-festival-bg/25 sm:p-8">
                <span
                  className="font-display text-6xl font-bold leading-none text-festival-cream/10"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display relative mt-2 text-2xl font-bold text-festival-cream sm:text-3xl">
                  {venue.name}
                </h3>
                {venue.address ? (
                  <p className="relative mt-2 text-sm text-festival-cream/60 sm:text-base">
                    {venue.address}
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
