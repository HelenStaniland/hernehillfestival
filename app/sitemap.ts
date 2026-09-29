import type { MetadataRoute } from "next";
import { events } from "@/data/events";
import { festival } from "@/lib/festival";
import { getEventPath } from "@/lib/programme";

const staticPaths = ["/", "/news", "/artists", "/venues", "/events", "/sponsors"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map((path) => ({
      url: new URL(path, festival.url).href,
    })),
    ...events.map((event) => ({
      url: new URL(getEventPath(event.id), festival.url).href,
    })),
  ];
}
