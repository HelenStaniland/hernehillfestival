import { FeatureCard } from "@/components/site/FeatureCard";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { festival, homeFeatures } from "@/lib/festival";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="festival-main pb-10 sm:pb-14">
        <section className="px-4 pt-10 sm:px-6 sm:pt-14">
          <div className="mx-auto max-w-5xl">
            <p className="festival-label">{festival.location}</p>
            <h1 className="font-display mt-2 text-[3.25rem] leading-[0.9] tracking-wide sm:text-7xl lg:text-8xl">
              {festival.name}
            </h1>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">
          <p className="max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            {festival.intro}
          </p>

          <section
            className="festival-card mt-8 p-5 sm:p-6"
            aria-labelledby="festival-dates-heading"
          >
            <h2
              id="festival-dates-heading"
              className="font-display text-2xl tracking-wide sm:text-3xl"
            >
              Festival dates
            </h2>
            <ul className="mt-4 space-y-3">
              {festival.weekends.map((weekend) => (
                <li
                  key={weekend.id}
                  className="border-l-4 border-festival-gold pl-4"
                >
                  <p className="festival-label">{weekend.label}</p>
                  <p className="mt-0.5 text-base font-semibold sm:text-lg">
                    {weekend.dates}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="explore-heading">
            <h2 id="explore-heading" className="sr-only">
              Explore the festival
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {homeFeatures.map((feature) => (
                <li key={feature.href}>
                  <FeatureCard {...feature} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
