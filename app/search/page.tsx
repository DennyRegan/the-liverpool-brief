import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/SiteHeader';
import { getHistoryLibrary, searchHistory } from '@/lib/content/history-library';
import '@/app/history/history.css';
export const metadata: Metadata = { title: 'Search History | The Liverpool Brief', robots: { index: false, follow: true } };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: input } = await searchParams; const q = typeof input === 'string' ? input.slice(0, 120) : '';
  const results = q.trim() ? searchHistory(getHistoryLibrary(), q) : [];
  return <div className="hl-surface"><SiteHeader active="history" /><main id="main-content" className="site-width hl-main"><Link className="hl-text-link" href="/history">← History</Link><header className="hl-heading"><p className="hl-eyebrow">The History Library</p><h1>Find a story.</h1><p className="hl-deck">Search published historical writing by title, season, player, manager, opponent or competition.</p></header><form className="hl-search" action="/search"><label htmlFor="history-query">Search history</label><div><input id="history-query" type="search" name="q" defaultValue={q} maxLength={120} placeholder="John Barnes, Forest, 1987–88…" /><button>Search</button></div></form>{q.trim() && <p className="hl-muted" role="status">{results.length} {results.length === 1 ? 'result' : 'results'} for “{q}”</p>}<ol className="hl-search-results">{results.map(r => <li key={r.href}><p className="hl-eyebrow">{r.type}</p><h2><Link href={r.href}>{r.title}</Link></h2><p>{r.excerpt}</p></li>)}</ol>{q.trim() && !results.length && <p className="hl-empty">No published material matches that search. Try a shorter name or another subject.</p>}</main></div>;
}
