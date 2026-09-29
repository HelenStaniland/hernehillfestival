import Image from "next/image";
import Link from "next/link";
import { AdmissionDetails } from "@/components/site/AdmissionDetails";
import { getEventImages } from "@/components/site/EventLineup";
import { getArtistImageClass } from "@/lib/artistImage";
import {
  formatEventDate,
  formatEventTimeRange,
  getEventById,
  getEventPageTitle,
  getEventPath,
} from "@/lib/programme";

type FeaturedEventProps = {
  eventId: string;
};

function featuredImageClass(
  event: NonNullable<ReturnType<typeof getEventById>>,
  src: string,
) {
  if (event.imagePosition === "upper") return "object-cover object-[center_32%]";
  if (event.imagePosition === "top") return "object-cover object-top";

  const artist =
    event.artists.find((item) => item.image === src) ??
    (event.artist?.image === src ? event.artist : undefined);

  return artist ? getArtistImageClass(artist) : "object-cover";
}

export function FeaturedEvent({ eventId }: FeaturedEventProps) {
  const event = getEventById(eventId);
  if (!event) return null;

  const title = getEventPageTitle(event);
  const href = getEventPath(event.id);
  const image = event.detailImage ?? getEventImages(event)[0];
  const description =
    event.listingNote ?? event.description?.split("\n\n")[0]?.trim();

  return (
    <article className="festival-dates-card mt-6" aria-labelledby="featured-event-heading">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {image ? (
          <Link
            href={href}
            className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-festival-blue-deep sm:w-64"
            aria-label={`View ${title}`}
          >
            <Image
              src={`/${image}`}
              alt=""
              fill
              className={featuredImageClass(event, image)}
              sizes="(max-width: 640px) 100vw, 256px"
            />
          </Link>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="festival-label">Featured event</p>
          <h2
            id="featured-event-heading"
            className="font-display mt-2 text-3xl tracking-wide text-white sm:text-4xl"
          >
            <Link href={href} className="hover:text-festival-mint">
              {title}
            </Link>
          </h2>
          <p className="mt-2 text-sm font-semibold text-white/80">
            {formatEventDate(event.date)} · {formatEventTimeRange(event)}
          </p>
          {event.venue?.name ? (
            <p className="mt-1 font-semibold text-white">{event.venue.name}</p>
          ) : null}
          {description ? (
            <p className="mt-3 max-w-2xl festival-body">{description}</p>
          ) : null}
          <AdmissionDetails admission={event.admission} />
          <Link href={href} className="festival-link mt-4 inline-block">
            Find out more & book →
          </Link>
        </div>
      </div>
    </article>
  );
}
