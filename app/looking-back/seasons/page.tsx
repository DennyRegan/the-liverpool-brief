import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader, plural } from "@/app/components/HistoryHeader";
import { getSeasonNames, getSeasons, leagueFinish, seasonLabel, SEASONS_PATH } from "@/lib/content/seasons";
import { socialMetadata } from "@/lib/social-metadata";
import "../history.css";

export const revalidate = 3600;

export const metadata = socialMetadata("Seasons | Looking Back | The Liverpool Brief", "Liverpool season by season: league finish, trophies, top scorer and the story of each campaign.", SEASONS_PATH);

export default function SeasonsPage() {
  const seasons = getSeasons();
  const names = getSeasonNames();
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection history-index">
      <HistoryHeader title="Seasons" standfirst="Liverpool season by season, newest first." count={plural(seasons.length, "season")} />
      {seasons.length ? <ol className="history-list">
        {seasons.map(item => {
          const scorer = item.topScorers[0];
          return <li key={item.season}>
            <p className="history-list-meta">{leagueFinish(item.league.position)} · {names[item.league.competitionId]}{item.trophyIds.length > 1 && ` · ${plural(item.trophyIds.length, "trophy", "trophies")}`}</p>
            <h3><Link href={`${SEASONS_PATH}/${item.season}`}>{seasonLabel(item.season)}</Link></h3>
            <p className="history-list-excerpt">Top scorer: {names[scorer.personId]}, {plural(scorer.goals, "goal")}.</p>
          </li>;
        })}
      </ol> : <p className="empty-state">Seasons will appear here when published.</p>}
    </main>
  </>;
}
