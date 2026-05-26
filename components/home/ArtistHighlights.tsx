import Image from "next/image";
import { SectionHeading } from "@/components/home/SectionHeading";
import { artists } from "@/data/artists";

export function ArtistHighlights() {
  return (
    <section className="border-y border-festival-cream/15 bg-festival-surface px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Line-up"
          title="Artist highlights"
          description="From Latin jazz to late-night speakeasy sets — meet the acts on this year’s bill."
        />

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {artists.map((artist) => (
            <li key={artist.id}>
              <article className="overflow-hidden rounded-2xl border border-festival-cream/20 bg-festival-card shadow-md shadow-festival-bg/25">
                {artist.image ? (
                  <div className="relative aspect-[5/3] w-full bg-festival-bg">
                    <Image
                      src={`/${artist.image}`}
                      alt=""
                      fill
                      className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-festival-card via-festival-card/20 to-transparent"
                      aria-hidden
                    />
                  </div>
                ) : null}

                <div className="p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-festival-accent">
                    {artist.genre}
                  </p>
                  <h3 className="font-display mt-2 text-2xl font-bold text-festival-cream">
                    {artist.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-festival-cream/70 sm:text-base">
                    {artist.bio}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
