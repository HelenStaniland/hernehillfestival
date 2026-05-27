import { FeatureCard } from "@/components/site/FeatureCard";
import { HomeGallery } from "@/components/site/HomeGallery";
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
            <h1 className="font-display mt-2 text-[2.75rem] leading-tight tracking-tight text-festival-mint sm:text-6xl lg:text-7xl">
              {festival.name}
            </h1>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">
          <div className="max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
            <p>{festival.intro}</p>
          </div>

          <section
            className="festival-dates-card mt-10"
            aria-labelledby="festival-dates-heading"
          >
            <h2
              id="festival-dates-heading"
              className="font-display text-3xl tracking-wide text-festival-mint sm:text-4xl"
            >
              Festival dates 2026
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {festival.weekends.map((weekend) => (
                <li
                  key={weekend.id}
                  className="rounded-lg border border-festival-mint/25 bg-white/10 p-4 sm:p-5"
                >
                  <p className="festival-label">{weekend.label}</p>
                  <p className="font-display mt-1 text-2xl leading-tight tracking-wide text-white sm:text-3xl">
                    {weekend.dates}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <HomeGallery />

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
