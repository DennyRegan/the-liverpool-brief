import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SiteHeader } from '@/app/components/SiteHeader';
import { ReviewSummary } from './MatchCollection';
import { seasonMatchHref, type CollectionMatch } from '@/lib/content/match-collection';
import { formatLongDate } from '@/lib/format';
import '@/app/history/history.css';
export function MatchReviewReport({ article, matches }: { article: CollectionMatch; matches: CollectionMatch[] }) {
  const season = matches.filter(a => a.season === article.season);
  const index = season.findIndex(a => a.slug === article.slug);
  return <div className="hl-surface"><SiteHeader active="history" /><main id="main-content" className="reading-page">
    <div className="reading-tools"><Link className="back-link" href={seasonMatchHref(article, matches)}>← {article.season?.replace('-', '–')} season</Link><Link href={`/history/matches?season=${article.season}`}>Classic Matches</Link></div>
    <p className="hl-coverage">{article.publication === 'withdrawn' ? 'Withdrawn report' : 'Unpublished draft'} · Local editorial review only. Publication is not approved.</p>
    <h1 className="article-title">{article.title}</h1><p className="historical-date">Match date: {article.historicalEventDate ? formatLongDate(article.historicalEventDate) : article.historicalPeriod}</p><p className="hl-deck">{article.excerpt}</p>
    {article.review && <ReviewSummary review={article.review} />}
    <div className="article-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body.replace(/^# [^\n]+\n+/, '')}</ReactMarkdown></div>
    <p className="hl-muted">{article.date ? `Preserved manuscript date: ${formatLongDate(article.date)}. This does not establish current publication or approval.` : 'No publication date has been assigned to this draft.'} Original prose and canonical article URL are preserved.</p>
    <nav className="hl-adjacent" aria-label="Read through the season">{season[index - 1] && <Link href={season[index - 1].href}>← Previous report: {season[index - 1].title}</Link>}{season[index + 1] && <Link href={season[index + 1].href}>Next report: {season[index + 1].title} →</Link>}<Link href={seasonMatchHref(article, matches)}>Return to this match in the season →</Link></nav>
  </main></div>;
}
