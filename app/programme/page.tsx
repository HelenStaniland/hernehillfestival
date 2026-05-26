import Link from "next/link";
import type { Metadata } from "next";
import { ProgrammeEventCard } from "@/components/programme/ProgrammeEventCard";
import { festival } from "@/lib/festival";
import { getProgramme, groupProgrammeByDate } from "@/lib/programme";

export const metadata: Metadata = {
  title: `Programme | ${festival.name}`,
  description: "Festival schedule — dates, artists, and venues.",
};

export default function ProgrammePage() {
  const days = groupProgrammeByDate(getProgramme());

  return (
    <div className="min-h-full bg-festival-bg text-festival-cream">
      <header className="border-b border-festival-cream/15 bg-festival-surface">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-festival-cream/70 transition-colors hover:text-festival-cream"
          >
            ← Festival home
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-festival-accent">
              {festival.name}
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Programme
            </h1>
            <p className="mt-2 max-w-2xl text-base text-festival-cream/75">
              Live music across the neighbourhood — all times local.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {days.length === 0 ? (
          <p className="text-center text-festival-cream/70">
            No events scheduled yet.
          </p>
        ) : (
          <div className="space-y-12">
            {days.map((day) => (
              <section key={day.date} aria-labelledby={`day-${day.date}`}>
                <h2
                  id={`day-${day.date}`}
                  className="font-display border-b border-festival-cream/20 pb-3 text-xl font-bold text-festival-cream sm:text-2xl"
                >
                  {day.label}
                </h2>

                <ul className="mt-6 space-y-4">
                  {day.events.map((event) => (
                    <li key={event.id}>
                      <ProgrammeEventCard event={event} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
