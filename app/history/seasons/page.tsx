import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { getSeasons, seasonLabel, leagueFinish } from "@/lib/content/seasons";
import { getHistoryEntities } from "@/lib/content/entities";

export const metadata = {
  title: "Seasons | Liverpool History | The Liverpool Brief",
  description: "From Bill Shankly’s first season to the present day, follow Liverpool’s story season by season.",
  alternates: { canonical: "/history/seasons" },
};

export default function SeasonsPage() {
  const seasons = getSeasons();
  const names = new Map(getHistoryEntities().map(entity => [entity.id, entity.label]));
  return <>
    <SiteHeader active="history" />
    <main id="main-content" className="site-width hx-page seasons-page">
      <HistoryNav active="seasons" />
      <header className="hx-intro">
        <p className="eyebrow">Liverpool history · Season by season</p>
        <h1>Seasons</h1>
        <p className="hx-standfirst">From Bill Shankly&apos;s first season to the present day, follow Liverpool&apos;s story season by season.</p>
        <p className="season-editorial-note">Historical reference entries. For the editor&apos;s original long-form writing, visit <Link href="/articles?category=archive">the Archive</Link>.</p>
      </header>
      {seasons.length ? <>
        <p className="season-available">Available now: {seasonLabel(seasons[0].season)} to {seasonLabel(seasons.at(-1)!.season)} · {seasons.length} seasons</p>
        <ol className="season-list" aria-label="Seasons in chronological order">
          {seasons.map(season => <li key={season.season}>
            <Link href={`/history/seasons/${season.season}`} prefetch={false}>
              <span className="season-list-year">{seasonLabel(season.season)}</span>
              <span className="season-list-context"><span>{names.get(season.league.competitionId)} · {leagueFinish(season.league.position)}</span>
                <small>{season.managerIds.map(id => names.get(id)).join(" / ")}</small>
              </span>
              <span className="season-list-arrow" aria-hidden="true">→</span>
            </Link>
          </li>)}
        </ol>
      </> : <p className="empty-state">Researched seasons will appear here.</p>}
    </main>
  </>;
}
