import type { MetadataRoute } from "next";
import { getPublicSitemap } from "../lib/content/sitemap.ts";

// Generated from the same content as public pages, refreshed after each deployment
// and at most hourly without needing a manually maintained XML file.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  return getPublicSitemap();
}
