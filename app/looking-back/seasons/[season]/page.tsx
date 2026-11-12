import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader, plural } from "@/app/components/HistoryHeader";
import { getSeasonNames, getSeasons, leagueFinish, seasonLabel, SEASONS_PATH, type LookingBackSeason } from "@/lib/content/seasons";
import { getSeasonMapSeasons, seasonMapPath } from "@/lib/content/season-map";
import { socialMetadata } from "@/lib/social-metadata";
import "../../history.css";
import "./season.css";

export const dynamicParams = false;
export const revalidate = 3600;

type Params = { params: Promise<{ season: string }> };

export function generateStaticParams() {
  return getSeasons().map(item => ({ season: item.season }));
}

function summary(season: LookingBackSeason, names: Record<string, string>) {
  return `${seasonLabel(season.season)}: ${names[season.league.competitionId]} ${leagueFinish(season.league.position).toLowerCase()}, managed by ${season.managerIds.map(id => names[id]).join(" and ")}.`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { season } = await params;
  const item = getSeasons().find(s => s.season === season);
  if (!item) return {};
  return socialMetadata(`Liverpool ${seasonLabel(item.season)} | Seasons | The Liverpool Brief`, summary(item, getSeasonNames()), `${SEASONS_PATH}/${item.season}`);
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function SeasonPage({ params }: Params) {
  const all = getSeasons(); // newest first
  const { season: slug } = await params;
  const index = all.findIndex(s => s.season === slug);
  if (index < 0) notFound();
  const season = all[index];
  const newer = all[index - 1];
  const older = all[index + 1];
  const names = getSeasonNames();
  const name = (id: string) => names[id];
  const trophies = season.trophyIds.map(name);
  const hasMap = getSeasonMapSeasons().includes(season.season);
  const dealLabel = { permanent: "", loan: "loan", free: "free transfer", released: "released", retired: "retired" } as const;
  const transferLine = (t: LookingBackSeason["transfers"]["in"][number]) =>
    [name(t.personId), [t.club, dealLabel[t.deal], t.fee].filter(Boolean).join(", "), t.note].filter(Boolean).join(" — ");

  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection history-index season-page">
      <HistoryHeader
        title={`Liverpool ${seasonLabel(season.season)}`}
        dateline={`${name(season.league.competitionId)} · ${leagueFinish(season.league.position)}`}
        standfirst={`Managed by ${season.managerIds.map(name).join(" and ")}.${season.managerNote ? ` ${season.managerNote}` : ""}`}
      />

      {hasMap && <p className="season-map-link"><Link href={seasonMapPath(season.season)}>The season on a map, game by game <span aria-hidden="true">→</span></Link></p>}

      <section aria-labelledby="overview">
        <h2 id="overview" className="season-heading">The season</h2>
        {season.overview.map((paragraph, i) => <p key={i} className="season-text">{paragraph}</p>)}
      </section>

      <section aria-labelledby="record">
        <h2 id="record" className="season-heading">The record</h2>
        <dl className="season-facts">
          <div><dt>League</dt><dd>{name(season.league.competitionId)}: {leagueFinish(season.league.position)}</dd></div>
          <div><dt>{trophies.length === 1 ? "Trophy" : "Trophies"}</dt><dd>{trophies.length ? trophies.join(", ") : "None"}</dd></div>
          <div><dt>{season.topScorers.length === 1 ? "Top scorer" : "Top scorers"}</dt><dd>{season.topScorers.map(s => `${name(s.personId)} (${s.goals})`).join(", ")}</dd></div>
          <div><dt>Key players</dt><dd>{season.keyPlayerIds.map(name).join(", ")}</dd></div>
        </dl>
      </section>

      {season.competitions.length > 0 && <section aria-labelledby="competitions">
        <h2 id="competitions" className="season-heading">Competitions</h2>
        <ul className="season-list">
          {season.competitions.map(c => <li key={c.competitionId}><strong>{name(c.competitionId)}.</strong> {c.result}</li>)}
        </ul>
      </section>}

      {season.events.length > 0 && <section aria-labelledby="events">
        <h2 id="events" className="season-heading">Moments</h2>
        <ul className="season-list">
          {season.events.map(e => <li key={e.id}>
            <strong>{e.title}</strong>{e.date && <span className="season-date"> · {formatDate(e.date)}</span>}
            <span className="season-detail">{e.detail}</span>
          </li>)}
        </ul>
      </section>}

      {(season.transfers.in.length > 0 || season.transfers.out.length > 0) && <section aria-labelledby="transfers">
        <h2 id="transfers" className="season-heading">Transfers</h2>
        {season.transfers.in.length > 0 && <>
          <h3 className="season-subheading">In</h3>
          <ul className="season-list">{season.transfers.in.map(t => <li key={`${t.personId}-${t.club}`}>{transferLine(t)}</li>)}</ul>
        </>}
        {season.transfers.out.length > 0 && <>
          <h3 className="season-subheading">Out</h3>
          <ul className="season-list">{season.transfers.out.map(t => <li key={`${t.personId}-${t.club}`}>{transferLine(t)}</li>)}</ul>
        </>}
      </section>}

      <section aria-labelledby="sources">
        <h2 id="sources" className="season-heading">Sources</h2>
        <p className="season-note">{plural(season.sources.length, "source")}, last reviewed {formatDate(season.reviewedOn)}.</p>
        <ul className="season-list">
          {season.sources.map(s => <li key={s.id}><a href={s.url} rel="noopener noreferrer" target="_blank">{s.label}</a></li>)}
        </ul>
      </section>

      <nav className="season-nav" aria-label="Other seasons">
        {older ? <Link href={`${SEASONS_PATH}/${older.season}`}>← {seasonLabel(older.season)}</Link> : <span />}
        <Link href={SEASONS_PATH}>All seasons</Link>
        {newer ? <Link href={`${SEASONS_PATH}/${newer.season}`}>{seasonLabel(newer.season)} →</Link> : <span />}
      </nav>
    </main>
  </>;
}
