import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { TimelineSections } from "@/app/components/history/V3Exploration";
import { getV3View } from "@/lib/content/history-v3-view";
import { filterTimeline, timelineOptions } from "@/lib/content/history-v3";
export const metadata = {
  title: "Liverpool History Timeline | The Liverpool Brief",
  alternates: { canonical: "/history/timeline" },
};
type Query = { decade?: string | string[]; season?: string | string[] };
export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;
  const { timeline } = getV3View();
  const options = timelineOptions(timeline);
  const decade =
    typeof query.decade === "string" && options.decades.includes(query.decade)
      ? query.decade
      : undefined;
  const season =
    typeof query.season === "string" && options.seasons.includes(query.season)
      ? query.season
      : undefined;
  const invalid = Boolean(
    (query.decade && !decade) || (query.season && !season),
  );
  return (
    <>
      <SiteHeader active="history" />
      <main id="main-content" className="site-width hx-page v3-page">
        <HistoryNav active="timeline" />
        <header className="hx-intro">
          <p className="eyebrow">Explore Liverpool history</p>
          <h1>Timeline</h1>
          <p className="hx-standfirst">Explore Liverpool season by season.</p>
          <p>
            Browse by decade or choose a season. Open a Season for its team,
            trophies and connected articles, or follow the writing and events
            through their historical dates. Coverage reflects the available library.
          </p>
        </header>
        <form className="v3-filters" action="/history/timeline" method="get">
          <div>
            <label htmlFor="timeline-decade">Decade</label>
            <select
              id="timeline-decade"
              name="decade"
              defaultValue={decade ?? ""}
            >
              <option value="">All decades</option>
              {options.decades.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="timeline-season">Season</label>
            <select
              id="timeline-season"
              name="season"
              defaultValue={season ?? ""}
            >
              <option value="">All seasons</option>
              {options.seasons.map((s) => (
                <option key={s} value={s}>
                  {s.replace("-", "–")}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Explore</button>
          <Link href="/history/timeline">Reset filters</Link>
        </form>
        {invalid && (
          <p role="status">
            That period is not available. Showing the valid selection below.
          </p>
        )}
        <p className="v3-selection">
          {season ? season.replace("-", "–") : "All seasons"} ·{" "}
          {decade ?? "All decades"}
        </p>
        <TimelineSections
          sections={filterTimeline(timeline, { decade, season })}
        />
        <nav className="v3-continue" aria-label="More ways to explore">
          <h2>Choose your next route</h2>
          <Link href="/history/journeys">Follow a guided journey →</Link>
          <Link href="/history/my-years">Your Liverpool Years →</Link>
        </nav>
      </main>
    </>
  );
}
