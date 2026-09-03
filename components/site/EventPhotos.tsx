import Image from "next/image";
import { getArtistImageClass } from "@/lib/artistImage";
import type { ProgrammeEvent } from "@/lib/programme";

type EventPhotosProps = {
  event: ProgrammeEvent;
  images: string[];
  variant: "listing" | "hero";
  priority?: boolean;
};

function imageClassFor(event: ProgrammeEvent, src: string) {
  if (event.imagePosition === "upper") {
    return "object-cover object-[center_32%]";
  }
  if (event.imagePosition === "top") {
    return "object-cover object-top";
  }
  if (src === "artists/TuomoProjection.jpeg") {
    return getArtistImageClass({ imagePosition: "bottom-left" });
  }

  const artist =
    event.artists.find((item) => item.image === src) ??
    (event.artist?.image === src ? event.artist : undefined);

  if (artist) {
    return getArtistImageClass(artist);
  }

  return "object-cover";
}

function Photo({
  event,
  src,
  sizes,
  priority,
}: {
  event: ProgrammeEvent;
  src: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className="relative min-h-0 min-w-0 flex-1">
      <Image
        src={`/${src}`}
        alt=""
        fill
        className={imageClassFor(event, src)}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

export function EventPhotos({
  event,
  images,
  variant,
  priority = false,
}: EventPhotosProps) {
  const imageCount = images.length;
  const featuredStack =
    event.imageLayout === "featured-stack" && imageCount >= 3;
  const [featured, ...stacked] = images;

  const frameClass =
    variant === "listing"
      ? featuredStack
        ? "flex h-full w-full shrink-0 gap-px bg-festival-blue-deep aspect-[2/1] sm:aspect-auto sm:h-full sm:w-72 sm:min-h-48"
        : `flex h-full w-full shrink-0 bg-festival-blue-deep ${
            imageCount === 3
              ? "aspect-[12/3] sm:aspect-auto sm:h-full sm:w-96 sm:min-h-48"
              : imageCount === 2
                ? "aspect-[8/3] sm:aspect-auto sm:h-full sm:w-72 sm:min-h-48"
                : "aspect-[4/3] sm:aspect-auto sm:h-full sm:w-48 sm:min-h-48"
          }`
      : featuredStack
        ? "flex w-full gap-px overflow-hidden rounded-xl bg-festival-blue-deep aspect-[2/1] sm:aspect-[21/9]"
        : `flex w-full overflow-hidden rounded-xl bg-festival-blue-deep ${
            imageCount === 3
              ? "aspect-[12/5] sm:aspect-[12/4]"
              : imageCount === 2
                ? "aspect-[8/4] sm:aspect-[8/3]"
                : event.imagePosition === "upper"
                  ? "aspect-[16/9]"
                  : "aspect-[16/9] sm:aspect-[21/9]"
          }`;

  const featuredSizes =
    variant === "listing"
      ? "(max-width: 640px) 66vw, 192px"
      : "(max-width: 640px) 66vw, 680px";
  const stackedSizes =
    variant === "listing"
      ? "(max-width: 640px) 34vw, 96px"
      : "(max-width: 640px) 34vw, 340px";
  const rowSizes =
    variant === "listing"
      ? imageCount >= 2
        ? `(max-width: 640px) ${Math.round(100 / imageCount)}vw, ${Math.round(288 / imageCount)}px`
        : "(max-width: 640px) 100vw, 192px"
      : imageCount >= 2
        ? `(max-width: 640px) ${Math.round(100 / imageCount)}vw, ${Math.round(1024 / imageCount)}px`
        : "(max-width: 640px) 100vw, 1024px";

  return (
    <div className={frameClass}>
      {featuredStack ? (
        <>
          <div className="relative min-h-0 min-w-0 flex-[2]">
            <Image
              src={`/${featured}`}
              alt=""
              fill
              className={imageClassFor(event, featured)}
              sizes={featuredSizes}
              priority={priority}
            />
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-px">
            {stacked.slice(0, 2).map((src) => (
              <Photo
                key={src}
                event={event}
                src={src}
                sizes={stackedSizes}
                priority={priority}
              />
            ))}
          </div>
        </>
      ) : (
        images.map((src) => (
          <Photo
            key={src}
            event={event}
            src={src}
            sizes={rowSizes}
            priority={priority}
          />
        ))
      )}
    </div>
  );
}
