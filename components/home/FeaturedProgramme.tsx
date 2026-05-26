import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/home/SectionHeading";
import {
  formatEventDate,
  formatEventTime,
  getProgramme,
  type ProgrammeEvent,
} from "@/lib/programme";

const PREVIEW_COUNT = 3;

function ProgrammePreviewCard({ event }: { event: ProgrammeEvent }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-festival-cream/20 bg-festival-card shadow-md shadow-festival-bg/25 transition-colors hover:border-festival-accent/50">
      <div className="border-b border-festival-cream/15 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-festival-accent">
          {formatEventDate(event.date)}
        </p>
        <p className="mt-1 font-display text-2xl font-bold text-festival-cream">
          {formatEventTime(event.time)}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-5 py-5">
        <h3 className="font-display text-xl font-semibold text-festival-cream">
          {event.artist?.name ?? event.title}
        </h3>
        {event.artist?.genre ? (
          <p className="text-sm text-festival-cream/60">{event.artist.genre}</p>
        ) : null}
        {event.venue ? (
          <p className="mt-auto pt-3 text-sm text-festival-cream/70">
            <span className="text-festival-cream">{event.venue.name}</span>
            {event.venue.address ? (
              <span className="block text-festival-cream/50">
                {event.venue.address}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function FeaturedProgramme() {
  const preview = getProgramme().slice(0, PREVIEW_COUNT);

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Programme"
            title="Coming up"
            description="A taste of what’s on — full listings, times, and venues on the programme page."
          />
          <Link
            href="/programme"
            className="shrink-0 text-sm font-semibold text-festival-accent underline-offset-4 hover:underline"
          >
            See full programme →
          </Link>
        </div>

        {preview.length > 0 ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((event) => (
              <li key={event.id}>
                <ProgrammePreviewCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-festival-cream/60">
            Programme details coming soon.
          </p>
        )}

        <div className="mt-10 flex justify-center sm:justify-start">
          <Button href="/programme" variant="secondary">
            View programme
          </Button>
        </div>
      </div>
    </section>
  );
}
