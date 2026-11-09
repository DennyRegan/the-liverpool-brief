import type { MetadataRoute } from "next";
import { SITE_URL } from "../site.ts";
import { getArticles } from "./articles.ts";
import { getArchiveFeatures } from "./archive.ts";
import { getNewsletterConfig } from "../newsletter-config.ts";
import { getLiveLookingBack } from "./looking-back.ts";
import { getLiveBiographies, getLiveMatchRevisited, getLiveSeriesParts } from "./history.ts";
import { getPlayerPageSlugs } from "./players.ts";

function liveSeriesPaths(root: string) {
  const parts = getLiveSeriesParts(new Date(), root);
  return [...new Set(parts.map(part => part.seriesSlug))].map(slug => `/looking-back/series/${slug}`)
    .concat(parts.map(part => `/looking-back/series/${part.seriesSlug}/${part.slug}`));
}

/** Mirror public page selectors; never scan editorial folders for destinations. */
export function getPublicSitemap(root = process.cwd(), env = process.env): MetadataRoute.Sitemap {
  const paths = [
    "/", "/about", "/articles", "/regan-on-football", "/matchday", "/looking-back", "/looking-back/on-this-day", "/looking-back/on-this-day/previous", "/looking-back/biographies", "/looking-back/series", "/looking-back/match-revisited", "/looking-back/features", "/calls",
    // The newsletter pages are public only while signup is configured.
    ...(getNewsletterConfig(env) ? ["/newsletter", "/newsletter/privacy"] : []),
    ...getArticles(root).map(article => `/articles/${article.slug}`),
    // Retained Archive pieces keep their original canonical URLs.
    ...getArchiveFeatures(root).map(article => `/archive/${article.slug}`),
    // Only pieces whose date has arrived (Europe/London), on every environment.
    ...getLiveLookingBack(new Date(), root).map(piece => `/looking-back/${piece.slug}`),
    // Biographies and series (Looking Back): only pieces whose Monday has arrived; a series page exists once it has a live part.
    ...getLiveBiographies(new Date(), root).map(item => `/looking-back/biographies/${item.slug}`),
    ...getLiveMatchRevisited(new Date(), root).map(item => `/looking-back/match-revisited/${item.slug}`),
    ...liveSeriesPaths(root),
    ...getPlayerPageSlugs(root).map(slug => `/players/${slug}`),
  ];
  // Publication/event/review dates are not reliable page modification timestamps.
  // Omit lastModified rather than invent a fresh date on every generation.
  return [...new Set(paths)].map(path => ({ url: path === "/" ? SITE_URL : new URL(path, SITE_URL).href }));
}
