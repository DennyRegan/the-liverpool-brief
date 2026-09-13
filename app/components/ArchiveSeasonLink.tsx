import Link from "next/link";
import { getPublishedArchiveSeason, seasonLabel } from "../../lib/content/seasons.ts";

export function ArchiveSeasonLink({ article, seasons }: {
  article: { season?: string };
  seasons: { season: string }[];
}) {
  const season = getPublishedArchiveSeason(article, seasons);
  if (!season) return null;
  return <p className="mt-8 text-sm">
    <Link href={`/history/seasons/${season.season}`} className="font-medium text-accent hover:text-accent-dark hover:underline">
      Explore {seasonLabel(season.season)} →
    </Link>
  </p>;
}
