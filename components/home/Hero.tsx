import { Button } from "@/components/ui/Button";
import { festival, getFestivalDateRange } from "@/lib/festival";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-32 h-64 w-64 rounded-full bg-festival-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-festival-copper/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-festival-accent">
          {getFestivalDateRange()}
        </p>

        <h1 className="font-display mt-5 max-w-3xl text-[2.75rem] font-bold leading-[1.05] tracking-tight text-festival-cream sm:text-6xl lg:text-7xl">
          {festival.name}
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-festival-cream/75 sm:text-xl">
          {festival.tagline}. Intimate gigs, neighbourhood venues, and nights
          that stay with you.
        </p>

        <dl className="mt-8 flex flex-col gap-3 text-sm sm:flex-row sm:gap-8 sm:text-base">
          <div>
            <dt className="sr-only">Dates</dt>
            <dd className="font-medium text-festival-cream">
              {getFestivalDateRange()}
            </dd>
          </div>
          <div className="hidden h-5 w-px bg-festival-cream/20 sm:block" aria-hidden />
          <div>
            <dt className="sr-only">Location</dt>
            <dd className="text-festival-cream/70">{festival.location}</dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href="/programme">View programme</Button>
          <Button href="#venues" variant="secondary">
            Explore venues
          </Button>
        </div>
      </div>
    </section>
  );
}
