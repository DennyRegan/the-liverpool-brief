import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { getSeasons, getSeasonEras, getSeasonArchiveArticles, seasonLabel, leagueFinish, type HistorySeason } from "@/lib/content/seasons";
import { getHistoryEntities } from "@/lib/content/entities";
import { getArchiveFeatures } from "@/lib/content/archive";
import { eraYears } from "@/lib/content/history";
import { formatListDate } from "@/lib/format";

type Props = { params: Promise<{ season: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return getSeasons().map(season => ({ season: season.season }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { season: id } = await params;
  const season = getSeasons().find(season => season.season === id);
  if (!season) notFound();
  return {
    title: `Liverpool ${seasonLabel(id)} | Seasons | The Liverpool Brief`,
    description: season.overview[0],
    alternates: { canonical: `/history/seasons/${id}` },
  };
}

function Transfers({ entries, direction, names }: {
  entries: HistorySeason["transfers"]["in"]; direction: "in" | "out"; names: Map<string, string>;
}) {
  return <section className="season-transfer-group" aria-labelledby={`transfers-${direction}`}>
    <h3 id={`transfers-${direction}`}>Transfers {direction}</h3>
    {entries.length ? <ul role="list">{entries.map(entry => <li key={`${entry.personId}-${entry.club}`}>
      <strong>{names.get(entry.personId)}</strong>
      <span>{entry.deal === "retired" ? entry.club : `${direction === "in" ? "From" : "To"} ${entry.club}`}</span>
      {entry.deal !== "retired" && <span className="season-transfer-deal">{({ permanent: "Permanent transfer", loan: "Loan", free: "Free transfer", released: "Released" })[entry.deal]}{entry.fee && ` · ${entry.fee}`}</span>}
      {entry.note && <p>{entry.note}</p>}
    </li>)}</ul> : <p className="hx-quiet">No significant senior {direction === "in" ? "arrivals" : "departures"} identified in the sources reviewed.</p>}
  </section>;
}

export default async function SeasonPage({ params }: Props) {
  const { season: id } = await params;
  const seasons = getSeasons();
  const index = seasons.findIndex(season => season.season === id);
  if (index === -1) notFound();
  const season = seasons[index];
  const names = new Map(getHistoryEntities().map(entity => [entity.id, entity.label]));
  const eras = getSeasonEras(id);
  const articles = getSeasonArchiveArticles(id, getArchiveFeatures());
  const previous = seasons[index - 1];
  const next = seasons[index + 1];

  return <>
    <SiteHeader active="history" />
    <main id="main-content" className="site-width hx-page season-detail">
      <HistoryNav active="seasons" />
      <Link href="/history/seasons" className="hx-back">← All seasons</Link>
      <header className="season-header">
        <p className="eyebrow">Liverpool · Season reference</p>
        <h1>{seasonLabel(id)}</h1>
        <p className="season-editorial-note">An AI-assisted historical reference entry. Original long-form writing appears in <Link href="/articles?category=archive">the Archive</Link>.</p>
      </header>
      <nav className="season-jump" aria-label="On this season page">
        <a href="#season-overview">Overview</a><a href="#season-transfers">Transfers</a><a href="#season-connections">Connections</a><a href="#season-sources">Sources</a>
      </nav>
      <dl className="season-facts">
        <div><dt>Manager{season.managerIds.length > 1 ? "s" : ""}</dt><dd>{season.managerIds.map(id => names.get(id)).join(" / ")}{season.managerNote && <small>{season.managerNote}</small>}</dd></div>
        <div><dt>League / division</dt><dd>{names.get(season.league.competitionId)}</dd></div>
        <div><dt>League finish</dt><dd>{leagueFinish(season.league.position)}</dd></div>
        <div><dt>Top scorer{season.topScorers.length > 1 ? "s" : ""}</dt><dd>{season.topScorers.map(scorer => <span className="season-scorer" key={scorer.personId}>{names.get(scorer.personId)} · {scorer.goals} goals</span>)}<small>All competitive first-team matches</small></dd></div>
        <div className="season-trophies"><dt>Trophies won</dt><dd>{season.trophyIds.length ? season.trophyIds.map(id => <span key={id}>{names.get(id)}{season.competitions.find(c => c.competitionId === id)?.result.toLowerCase().includes("shared") && " (shared)"}</span>) : "None"}</dd></div>
      </dl>
      <section className="season-section season-overview" aria-labelledby="season-overview">
        <h2 id="season-overview">Season overview</h2>
        {season.overview.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      </section>
      <div className="season-competitions">
        {([['domestic', 'Domestic cups'], ['europe', 'Europe'], ['other', 'Other major competitions']] as const).map(([kind, label]) => {
          const competitions = season.competitions.filter(competition => competition.kind === kind);
          return competitions.length > 0 && <section className="season-section" key={kind} aria-labelledby={`competition-${kind}`}>
            <h2 id={`competition-${kind}`}>{label}</h2>
            <dl>{competitions.map(competition => <div key={competition.competitionId}><dt>{names.get(competition.competitionId)}</dt><dd>{competition.result}</dd></div>)}</dl>
          </section>;
        })}
      </div>
      <section className="season-section" aria-labelledby="season-players">
        <h2 id="season-players">Key players</h2>
        <ul className="hx-players season-players" role="list">{season.keyPlayerIds.map(id => <li key={id}>{names.get(id)}</li>)}</ul>
      </section>
      <section className="season-section" aria-labelledby="season-transfers">
        <h2 id="season-transfers">Transfers</h2>
        <p className="hx-quiet">Significant senior moves. Fees are included only where established reliably; summer arrivals are grouped with the campaign they joined.</p>
        <div className="season-transfers"><Transfers entries={season.transfers.in} direction="in" names={names} /><Transfers entries={season.transfers.out} direction="out" names={names} /></div>
      </section>
      <section className="season-section" aria-labelledby="season-connections">
        <h2 id="season-connections">Important connections</h2>
        {season.events.length > 0 && <ul className="season-events" role="list">{season.events.map(event => <li key={event.id}>
          {event.date && <p className="hx-period"><time dateTime={event.date}>{formatListDate(event.date)}</time></p>}
          <h3>{event.title}</h3><p>{event.detail}</p>
        </li>)}</ul>}
        {eras.length > 0 && <div className="season-connections-links"><h3>In the History Explorer</h3>{eras.map(era => <Link key={era.id} href={`/history/${era.id}`}>{era.manager} · {eraYears(era)} <span aria-hidden="true">→</span></Link>)}</div>}
        {season.relatedSeasons.length > 0 && <div className="season-connections-links"><h3>Related seasons</h3>{season.relatedSeasons.map(id => <Link href={`/history/seasons/${id}`} key={id}>{seasonLabel(id)} <span aria-hidden="true">→</span></Link>)}</div>}
      </section>
      {articles.length > 0 && <section className="hx-reading" aria-labelledby="season-archive">
        <p className="eyebrow">Original writing · Denny Regan</p><h2 id="season-archive">Related Archive</h2>
        <ul className="hx-reading-list" role="list">{articles.map(article => <li key={article.slug}><article>
          <h3><Link href={`/archive/${article.slug}`} prefetch={false}>{article.title} <span aria-hidden="true">↗</span></Link></h3><p>{article.excerpt}</p>
        </article></li>)}</ul>
      </section>}
      <details className="hx-sources season-sources" id="season-sources">
        <summary>Sources &amp; historical notes</summary>
        <p>Researched and checked {formatListDate(season.reviewedOn)}. These sources support this season’s statistics, transfers and historical account. Key players are an editorial selection.</p>
        <ul role="list">{season.sources.map(source => <li key={source.id} id={`source-${source.id}`}>
          <a href={source.url}>{source.label} <span aria-hidden="true">↗</span></a><span>{source.claims}</span>
        </li>)}</ul>
        {season.researchNotes.length > 0 && <div className="season-research-notes"><h3>Notes on the record</h3>{season.researchNotes.map((note, i) => <p key={i}>{note}</p>)}</div>}
      </details>
      <nav className="hx-neighbours" aria-label="Explore neighbouring seasons">
        {previous && <Link href={`/history/seasons/${previous.season}`} rel="prev"><span className="eyebrow">← Previous season</span><span>{seasonLabel(previous.season)}</span></Link>}
        {next && <Link href={`/history/seasons/${next.season}`} rel="next"><span className="eyebrow">Next season →</span><span>{seasonLabel(next.season)}</span></Link>}
      </nav>
    </main>
  </>;
}
