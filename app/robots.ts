import type { MetadataRoute } from "next";
import { festival } from "@/lib/festival";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", festival.url).href,
  };
}
