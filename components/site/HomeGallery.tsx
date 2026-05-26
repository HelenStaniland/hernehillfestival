import Image from "next/image";
import Link from "next/link";
import { SponsorCarousel } from "@/components/site/SponsorCarousel";
import {
  getHomeGalleryArtists,
  getHomeGallerySponsors,
  type HomeGalleryArtist,
} from "@/lib/homeGallery";

function repeatForMarquee<T>(items: T[], minCount = 6): T[] {
  if (items.length === 0) {
    return [];
  }

  const result: T[] = [];

  while (result.length < minCount) {
    result.push(...items);
  }

  return result;
}

function GalleryTile({ item }: { item: HomeGalleryArtist }) {
  const content = (
    <div className="relative h-44 w-64 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-festival-blue-deep">
      <Image
        src={`/${item.image}`}
        alt={item.name}
        fill
        className="object-cover"
        sizes="256px"
      />
      <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-festival-blue-deep/95 to-transparent px-3 pb-3 pt-8 font-display text-xl tracking-wide">
        {item.name}
      </p>
    </div>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 transition-opacity hover:opacity-90"
      >
        {content}
      </Link>
    );
  }

  return content;
}

function GalleryStrip({
  title,
  items,
  durationSeconds,
}: {
  title: string;
  items: HomeGalleryArtist[];
  durationSeconds: number;
}) {
  if (items.length === 0) {
    return null;
  }

  const useMarquee = items.length >= 4;
  const track = useMarquee ? repeatForMarquee(items) : items;
  const loop = useMarquee ? [...track, ...track] : track;

  return (
    <div className="mt-8 first:mt-0">
      <h3 className="festival-label">{title}</h3>
      <div
        className={
          useMarquee
            ? "festival-gallery-mask mt-3"
            : "mt-3 overflow-x-auto pb-1"
        }
        aria-label={`${title} gallery`}
      >
        <ul
          className={`flex w-max gap-4 ${useMarquee ? "festival-gallery-track" : ""}`}
          style={useMarquee ? { animationDuration: `${durationSeconds}s` } : undefined}
        >
          {loop.map((item, index) => (
            <li key={`${item.id}-${index}`} className="shrink-0">
              <GalleryTile item={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function HomeGallery() {
  const artists = getHomeGalleryArtists();
  const sponsors = getHomeGallerySponsors();

  if (artists.length === 0 && sponsors.length === 0) {
    return null;
  }

  return (
    <section
      className="festival-card mt-10 overflow-hidden p-5 sm:p-6"
      aria-labelledby="home-gallery-heading"
    >
      <h2
        id="home-gallery-heading"
        className="font-display text-3xl tracking-wide text-festival-mint sm:text-4xl"
      >
        This year&apos;s festival
      </h2>
      <GalleryStrip title="On the bill" items={artists} durationSeconds={45} />
      <SponsorCarousel sponsors={sponsors} />
    </section>
  );
}
