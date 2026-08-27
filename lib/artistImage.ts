export function getArtistImageClass(artist: {
  imagePosition?: string;
}) {
  if (artist.imagePosition === "top-left") {
    return "object-cover object-[28%_top]";
  }
  if (artist.imagePosition === "top") {
    return "object-cover object-top";
  }
  return "object-cover";
}
