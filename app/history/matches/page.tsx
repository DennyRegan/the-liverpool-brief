import type { Metadata } from 'next';
import Link from 'next/link';
import { getHistoryLibrary } from '@/lib/content/history-library';
import { getMatchCollectionView } from '@/lib/content/match-collection-view';
import { matchSeasons, matchDecade, paginate, getFeaturedMatches, matchFixture } from '@/lib/content/match-collection';
import { MatchReadingList, CollectionPagination } from '@/app/components/history/MatchCollection';
import { MatchFilters } from '@/app/components/history/MatchFilters';
import { formatLongDate } from '@/lib/format';
export const metadata: Metadata = { title: 'Classic Matches | The Liverpool Brief', alternates: { canonical: '/history/matches' } };
export default async function MatchesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const { matches, review } = await getMatchCollectionView();
  const library = getHistoryLibrary();
  const value = (key: string): string => typeof params[key] === 'string' ? params[key] : '';
  const fields = [{ name: 'season', label: 'Season', options: matchSeasons(matches).map(s => ({ id: s.season, label: `${s.season.replace('-', '–')} (${s.total})` })) },
    { name: 'decade', label: 'Decade', options: [...new Set(matches.map(matchDecade).filter(Boolean))].sort().map(d => ({ id: d, label: `${d}s` })) },
    ...([{ name: 'opposition', label: 'Opponent', field: 'oppositionIds' }, { name: 'competition', label: 'Competition', field: 'competitionIds' }] as const).map(f => ({ ...f, options: library.entities.filter(e => matches.some(a => a[f.field]?.includes(e.id))).sort((a,b) => a.label.localeCompare(b.label, 'en-GB')) })),
    ...(review ? [{ name: 'status', label: 'Publication status', options: [{ id: 'published', label: 'Published' }, { id: 'withdrawn', label: 'Withdrawn' }, { id: 'draft', label: 'Unpublished drafts' }] }] : [])];
  const invalid = fields.some(f => value(f.name) && !f.options.some(o => o.id === value(f.name)));
  const filtered = invalid ? [] : matches.filter(a => (!value('season') || a.season === value('season')) && (!value('decade') || matchDecade(a) === value('decade')) && (!value('opposition') || a.oppositionIds?.includes(value('opposition'))) && (!value('competition') || a.competitionIds?.includes(value('competition'))) && (!value('status') || a.publication === value('status')));
  const seasons = matchSeasons(filtered);
  const page = paginate(filtered, value('page'));
  const filters = Object.fromEntries(fields.map(f => [f.name, value(f.name)]));
  const active = fields.filter(f => value(f.name));
  const removeHref = (name: string) => {
    const query = new URLSearchParams(Object.entries(filters).filter(([key, val]) => key !== name && val));
    return `/history/matches${query.size ? `?${query}` : ''}#match-filters`;
  };
  // Discovery is for the first unfiltered page, never an interruption to filtered browsing.
  const featured = !active.length && page.page === 1 ? getFeaturedMatches(library) : [];
  const labels = new Map(library.entities.map(e => [e.id, e.label]));
  return <main id="main-content" className="hl-main hl-matches-page"><header className="hl-heading hl-matches-heading"><h1>Classic Matches</h1><p className="hl-deck">Liverpool&apos;s history, through its match stories.</p></header>
    {review && <details className="hl-preview-disclosure"><summary>Local approval preview · Unpublished reports included</summary><p>Withdrawn reports and drafts are labelled. They remain unavailable on the public site, search, latest articles and newsletter.</p></details>}
    {featured.length > 0 && <section className="hl-featured-matches" aria-labelledby="featured-matches-title"><h2 id="featured-matches-title">Featured Classic Matches</h2><ol>{featured.map(match => <li key={match.slug}><p className="hl-featured-date">{match.historicalEventDate && <time dateTime={match.historicalEventDate}>{formatLongDate(match.historicalEventDate)}</time>}</p><div><p className="hl-featured-fixture">{matchFixture(match, labels)}</p><h3><Link href={match.href}>{match.title} <span aria-hidden="true">→</span></Link></h3></div></li>)}</ol></section>}
    <div id="match-filters" className="hl-match-filter-area"><MatchFilters key={JSON.stringify(filters)} fields={fields} values={filters} activeCount={active.length} />
      {active.length > 0 && <nav className="hl-active-filters" aria-label="Active match filters">{active.map(f => <Link key={f.name} href={removeHref(f.name)} aria-label={`Remove ${f.label} filter: ${f.options.find(o => o.id === value(f.name))?.label ?? value(f.name)}`}>{f.label}: {f.options.find(o => o.id === value(f.name))?.label ?? value(f.name)} <span aria-hidden="true">×</span></Link>)}<Link href="/history/matches#match-filters">Clear all</Link></nav>}
    </div>
    {invalid && <p role="status" className="hl-empty">That filter is unavailable. Choose a listed option or reset the filters.</p>}
    <section id="collection" className="hl-section hl-match-results"><p className="hl-muted">{filtered.length} {filtered.length === 1 ? 'report' : 'reports'} across {seasons.length} {seasons.length === 1 ? 'season' : 'seasons'} · Historical date order{filtered.length ? ` · ${(page.page - 1) * 12 + 1}–${Math.min(page.page * 12, filtered.length)}` : ''}</p>
      {value('season') && !invalid && <p><Link className="hl-text-link" href={`/history/seasons/${value('season')}`}>Explore the {value('season').replace('-', '–')} season →</Link></p>}
      <MatchReadingList matches={page.items} entities={library.entities} showFixture />
      <CollectionPagination {...page} base="/history/matches" params={filters} />
    </section>
  </main>;
}
