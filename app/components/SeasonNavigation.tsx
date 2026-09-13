import Link from "next/link";
import { seasonLabel } from "../../lib/content/seasons.ts";

/** The loader supplies canonical published records in chronological order. */
export function SeasonNavigation({ season, seasons }: {
  season: string;
  seasons: { season: string }[];
}) {
  const index = seasons.findIndex(record => record.season === season);
  if (index === -1) return null;
  const previous = seasons[index - 1];
  const next = seasons[index + 1];
  if (!previous && !next) return null;
  return <nav className="hx-neighbours" aria-label="Explore neighbouring seasons">
    {previous && <Link href={`/history/seasons/${previous.season}`} rel="prev"><span className="eyebrow">← Previous season</span><span>{seasonLabel(previous.season)}</span></Link>}
    {next && <Link href={`/history/seasons/${next.season}`} rel="next"><span className="eyebrow">Next season →</span><span>{seasonLabel(next.season)}</span></Link>}
  </nav>;
}
