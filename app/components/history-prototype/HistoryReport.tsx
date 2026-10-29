import { getMatchCollection } from "@/lib/content/match-collection";
import { ReviewSummary } from "@/app/components/history/MatchCollection";
import { getArchiveFeatures } from "@/lib/content/archive";
import { ArticleConnections } from "@/app/components/history/ArticleConnections";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/app/components/SiteHeader";
import { loadHistoryPrototype, PROTOTYPE_SEASON_URL } from "@/lib/content/history-prototype";
import { historyDate, matchLabel } from "@/lib/history-atlas";
import "./history-prototype.css";

export function HistoryReport({ slug, integrated = false }: { slug: string; integrated?: boolean }) {
  const { articles, matches, venues } = loadHistoryPrototype();
  const index = matches.findIndex(match => match.slug === slug);
  const article = articles[index];
  const published = getArchiveFeatures().some(a => a.slug === slug);
  const review = getMatchCollection(process.cwd(), true).find(a => a.slug === slug)?.review;
  const match = matches[index];
  const venue = venues.find(venue => venue.id === match.locationId)!;
  const seasonUrl = integrated ? "/history/seasons/1987-88" : PROTOTYPE_SEASON_URL;
  const reportHref = (href: string) => integrated ? `${href}?from=season` : href;
  const next = matches[index + 1];
  const previous = matches[index - 1];
  return <div className="hp-surface"><SiteHeader active="history" />
    <main className="hp-report" id="main-content">
      <div className="hp-report-top"><Link href={`${seasonUrl}#article-${slug}`}>← The 1987–88 season</Link><span>{published ? "Published report · Local presentation preview" : "Withdrawn report · Local review only"}</span></div>
      <header className="hp-report-header">
        <div className="hp-report-edition"><span>The match file</span><span>1987–88 <span aria-hidden="true">/</span> {String(match.number).padStart(2, "0")} of 05</span></div>
        <p className="hp-report-context"><time dateTime={match.historicalEventDate}>{historyDate(match.historicalEventDate)}</time><span aria-hidden="true">·</span>{venue.label}<span aria-hidden="true">·</span>{match.competition}</p>
        <h1>{article.title}</h1>
        <p className="hp-report-standfirst">{article.excerpt}</p>
        <div className="hp-scoreline" aria-label={matchLabel(match)}><span>{match.home}</span><strong>{match.score}</strong><span>{match.away}</span></div>
        <div className="hp-report-credit"><span>Historical match report</span><span>Retrospective account · {Math.max(1, Math.ceil(article.body.split(/\s+/).length / 220))} min read</span></div>
      </header>
      {review && <ReviewSummary review={review} />}
      <div className="hp-report-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown></div>
      <p className="hp-publication-note">Match played {historyDate(match.historicalEventDate)}. Original website publication: {historyDate(article.date)}. Preserved report; historical presentation under review.</p>
      <nav className="hp-report-navigation" aria-label="Read through the season">
        {previous && <Link href={reportHref(previous.href)}><span>← Previous match</span><strong>{matchLabel(previous)}</strong></Link>}
        {next && <Link href={reportHref(next.href)}><span>Next match →</span><strong>{matchLabel(next)}</strong></Link>}
        {!next && <Link href={seasonUrl}><span>Return to the season →</span><strong>Explore 1987–88</strong></Link>}
      </nav>
      <ArticleConnections href={`/archive/${slug}`} reviewArticle={article} />
      <Link className="hp-all-matches" href={`${seasonUrl}#matches`}>{integrated ? "All season match reports" : "All five featured reports"}</Link>
    </main>
  </div>;
}
