export function getArtistImageClass(artist: {
  imagePosition?: string;
}) {
  if (artist.imagePosition === "center-right") {
    return "object-contain origin-right scale-[1.2]";
  }
  if (artist.imagePosition === "top-left") {
    return "object-cover object-[28%_top]";
  }
  if (artist.imagePosition === "top") {
    return "object-cover object-top";
  }
  if (artist.imagePosition === "bottom-left") {
    return "object-cover object-[18%_85%]";
  }
  return "object-cover";
}
