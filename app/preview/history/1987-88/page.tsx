import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryAtlas } from "@/app/components/history-prototype/HistoryAtlas";
import { loadHistoryPrototype } from "@/lib/content/history-prototype";
import { canViewHistoryPrototype } from "@/lib/history-prototype-access";
import { historyDate, matchLabel } from "@/lib/history-atlas";
import "@/app/components/history-prototype/history-prototype.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "1987–88 · The season file | The Liverpool Brief",
  robots: { index: false, follow: false },
};

export default async function HistoryPrototypePage() {
  if (!await canViewHistoryPrototype()) notFound();
  const { season, matches, groups, coastline, manager, topScorer } = loadHistoryPrototype();
  return <div className="hp-surface"><SiteHeader />
    <main id="main-content" className="site-width hp-season">
      <div className="hp-edition"><span>History <span aria-hidden="true">/</span> The season file</span><span>Local preview · Unpublished</span></div>
      <header className="hp-hero">
        <div><p className="hp-kicker">Liverpool Football Club</p><h1 aria-label="1987–88 season">1987<span aria-hidden="true">—</span><span className="hp-year-end">88</span><span className="hp-sr-only"> season</span></h1><p className="hp-hero-caption">First Division champions</p></div>
        <div className="hp-introduction"><p className="hp-kicker">A season in five matches</p><h2>The shape of <br />a championship.</h2><p>{season.overview[0].split(/(?<=\.)\s+/).slice(0, 2).join(" ")}</p><a href="#season-sources" className="hp-source-link">Read the season sources ↗</a></div>
      </header>
      <dl className="hp-facts"><div><dt>Manager</dt><dd>{manager}</dd></div><div><dt>League finish</dt><dd>Champions</dd></div><div><dt>Leading scorer</dt><dd>{topScorer}<small>All competitive matches</small></dd></div><div><dt>FA Cup</dt><dd>{season.competitions.find(c => c.competitionId === "fa-cup")?.result}</dd></div></dl>
      <HistoryAtlas grounds={groups} coastline={coastline} />
      <section id="matches" className="hp-matches" aria-labelledby="match-heading">
        <div className="hp-section-heading"><div><p className="hp-kicker">The match reports</p><h2 id="match-heading">From Highbury to Wembley.</h2></div><p>Five moments, in match order.<br />Retrospective reports with sources.</p></div>
        <ol className="hp-match-list">{matches.map(match => <li key={match.slug} id={`article-${match.slug}`}>
          <span className="hp-match-number" aria-hidden="true">{String(match.number).padStart(2, "0")}</span>
          <div className="hp-match-facts"><time dateTime={match.historicalEventDate}>{historyDate(match.historicalEventDate)}</time><span>{match.competition}</span><span>{groups.find(g => g.id === match.locationId)!.label}</span><strong>{matchLabel(match)}</strong></div>
          <article><h3><Link href={match.href}>{match.title}</Link></h3><p>{match.excerpt}</p><Link className="hp-read-link" href={match.href}>Read the report <span aria-hidden="true">→</span><span className="hp-sr-only">: {matchLabel(match)}</span></Link></article>
        </li>)}</ol>
      </section>
      <details className="hp-season-sources" id="season-sources"><summary>Season sources &amp; historical notes</summary><p>The introduction and essential facts reuse the existing season reference, reviewed {historyDate(season.reviewedOn)}. Match reports retain their own source lists. These are retrospective accounts, not contemporary newspaper reproductions.</p><ul>{season.sources.map(source => <li key={source.id}><a href={source.url}>{source.label}</a><p>{source.claims}</p></li>)}</ul>{season.researchNotes.map(note => <p key={note}>{note}</p>)}</details>
      <div className="hp-endnote"><span>THE LIVERPOOL BRIEF <span aria-hidden="true">·</span> HISTORY</span><p>A season to explore. A story at every ground.</p><Link href="/articles">Return to Denny’s journalism →</Link></div>
    </main>
  </div>;
}
