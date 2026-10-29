import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHistoryView } from '@/lib/content/history-library-view';
import { availableEntities, entityHref } from '@/lib/content/history-library';
import { loadHistoryPrototype, loadPublishedHistoryAtlas } from '@/lib/content/history-prototype';
import { HistoryAtlas } from '@/app/components/history-prototype/HistoryAtlas';
import { ReadingList } from '@/app/components/history/ReadingList';
import { formatLongDate } from '@/lib/format';
import { getMatchCollectionView } from '@/lib/content/match-collection-view';
import { paginate, matchSeasons } from '@/lib/content/match-collection';
import { MatchReadingList, CollectionPagination, CollectionReviewNotice } from '@/app/components/history/MatchCollection';
import '@/app/components/history-prototype/history-prototype.css';
type Props = { params: Promise<{ season: string }>; searchParams: Promise<{ page?: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { season } = await params;
  const entry = (await getHistoryView()).seasons.find(s => s.record.season === season);
  const collection = await getMatchCollectionView();
  return entry || collection.matches.some(a => a.season === season) ? { title: `${season.replace('-', '–')} season | The Liverpool Brief`, alternates: { canonical: `/history/seasons/${season}` }, ...(entry?.review || collection.review ? { robots: { index: false, follow: false } } : {}) } : {};
}
export default async function SeasonPage({ params, searchParams }: Props) {
  const { season } = await params;
  const library = await getHistoryView();
  const index = library.seasons.findIndex(s => s.record.season === season);
  const collection = await getMatchCollectionView();
  const seasonMatches = collection.matches.filter(a => a.season === season);
  const page = paginate(seasonMatches, (await searchParams).page);
  if (index < 0) {
    if (!seasonMatches.length) notFound();
    const years = matchSeasons(collection.matches); const position = years.findIndex(s => s.season === season);
    return <main id="main-content" className="hl-main hl-season"><Link className="hl-text-link" href="/history/seasons">← All seasons</Link><header className="hl-heading"><p className="hl-eyebrow">The season file · Match collection</p><h1>{season.replace('-', '–')}</h1><p className="hl-deck">{seasonMatches.length} existing match reports, in historical date order.</p></header>
      {collection.review && <CollectionReviewNotice />}<p className="hl-coverage">{seasonMatches.filter(a => a.publication === 'published').length} published reports. This page brings together the existing reports; a full season introduction and reference record have not been approved.</p>
      <section id="collection" className="hl-section"><h2 id="matches">Read through the season.</h2><MatchReadingList matches={page.items} /><CollectionPagination {...page} base={`/history/seasons/${season}`} /></section>
      <nav className="hl-adjacent" aria-label="Available seasons">{years[position - 1] && <Link href={`/history/seasons/${years[position - 1].season}`}>← {years[position - 1].season.replace('-', '–')}</Link>}{years[position + 1] && <Link href={`/history/seasons/${years[position + 1].season}`}>{years[position + 1].season.replace('-', '–')} →</Link>}<Link href={`/history/matches?season=${season}`}>Classic Matches →</Link></nav>
    </main>;
  }
  const { record, review } = library.seasons[index];
  const published = library.articles.filter(a => a.season === season).sort((a,b) => (a.historicalEventDate ?? '').localeCompare(b.historicalEventDate ?? ''));
  const otherWriting = published.filter(a => a.articleType !== 'match');
  const chapters = library.series.flatMap(s => s.articles).filter(a => a.season === season && !published.some(item => item.href === a.href));
  const people = availableEntities(library);
  const label = (id: string) => library.entities.find(e => e.id === id)!.label;
  const person = (id: string) => { const entity = people.find(e => e.id === id); return entity ? <Link href={entityHref(entity)}>{entity.label}</Link> : label(id); };
  const prototype = review && season === '1987-88' ? loadHistoryPrototype() : undefined;
  const atlas = prototype ?? (season === '1987-88' ? loadPublishedHistoryAtlas() : undefined);

  const availableYears = [...new Set([...library.seasons.map(s => s.record.season), ...matchSeasons(collection.matches).map(s => s.season)])].sort();
  const yearIndex = availableYears.indexOf(season);
  const previous = availableYears[yearIndex - 1], next = availableYears[yearIndex + 1];
  return <main id="main-content" className="hl-main hl-season"><Link className="hl-text-link" href="/history/seasons">← All seasons</Link><header className="hl-season-hero"><div><p className="hl-eyebrow">The season file{review ? ' · Local editorial review' : ''}</p><h1>{season.replace('-', '–')}</h1><p className="hl-deck">{record.league.position === 1 ? `${label(record.league.competitionId)} champions` : `${label(record.league.competitionId)} · ${record.league.position} place`}</p></div><div className="hl-season-intro"><p>{record.overview[0]}</p><a className="hl-text-link" href="#matches">Read through the season ↓</a></div></header>
    <p className="hl-coverage">{published.length} published {published.length === 1 ? 'article' : 'articles'} connected to this season.{collection.review ? ` ${seasonMatches.filter(a => a.publication !== 'published').length} additional reports are available only in this local editorial preview.` : ''} This is a selected reading collection, not a complete fixture history.</p>
    <dl className="hl-facts"><div><dt>Manager</dt><dd>{record.managerIds.map(id => <span key={id}>{person(id)}</span>)}</dd></div><div><dt>Leading scorer</dt><dd>{record.topScorers.map(s => <span key={s.personId}>{person(s.personId)} · {s.goals}</span>)}<small>All competitive matches</small></dd></div>{record.competitions.map(c => <div key={c.competitionId}><dt>{label(c.competitionId)}</dt><dd>{c.result}</dd></div>)}</dl>
    <section className="hl-section hl-context"><h2>The season in context</h2>{record.overview.slice(1).map(p => <p key={p}>{p}</p>)}</section>
    <section id="collection" className="hl-section"><div className="hl-section-heading"><h2 id="matches">{prototype ? 'From Highbury to Wembley.' : 'Read through the season.'}</h2><span>In historical date order · {seasonMatches.length} {seasonMatches.length === 1 ? 'report' : 'reports'}</span></div><MatchReadingList matches={page.items} /><CollectionPagination {...page} base={`/history/seasons/${season}`} /></section>
    {otherWriting.length > 0 && <section className="hl-section"><h2>Related season writing</h2><ReadingList articles={otherWriting} /></section>}
    {chapters.length > 0 && <section className="hl-section"><h2>Related series chapters</h2><ReadingList articles={chapters} /></section>}
    {record.events.length > 0 && <section className="hl-section"><h2>Key events</h2><ol className="hl-event-list">{[...record.events].sort((a,b) => (a.date ?? '9999').localeCompare(b.date ?? '9999')).map(event => <li id={`event-${event.id}`} key={event.id}><p className="hl-eyebrow">{event.date ? formatLongDate(event.date) : 'Exact date not recorded'}</p><h3>{event.title}</h3><p>{event.detail}</p><p>{event.sourceIds.map(id => { const source = record.sources.find(s => s.id === id)!; return <a className="hl-text-link" href={source.url} key={id}>{source.label} ↗ </a>; })}</p></li>)}</ol></section>}
    <section className="hl-section"><h2>The people</h2><p className="hl-muted">Explore the season connections and published writing. A person’s reading page is not necessarily a full biography.</p><ul className="hl-chips">{[...new Set([...record.managerIds, ...record.keyPlayerIds])].map(id => <li key={id}>{person(id)}</li>)}</ul><details className="hl-details"><summary>Arrivals and departures</summary>{(['in', 'out'] as const).map(direction => <div key={direction}><h3>{direction === 'in' ? 'Arrivals' : 'Departures'}</h3><ul>{record.transfers[direction].map(t => <li key={t.personId}>{person(t.personId)} · {t.club}. {t.note}</li>)}</ul></div>)}</details></section>
    {atlas && <section className="hl-section" aria-label="Optional season map"><p className="hl-muted">{prototype ? 'The map retains the original five featured matches; all twelve reports are listed above. Four mapped reports remain withdrawn. London groups Highbury and Wembley.' : 'Explore the grounds connected to published match reports. More stories will appear as they are approved.'}</p><HistoryAtlas grounds={atlas.groups.map(g => ({ ...g, matches: g.matches.map(m => ({ ...m, href: `${m.href}?from=season` })) }))} coastline={atlas.coastline} /></section>}
    <details id="season-sources" className="hl-details"><summary>Sources and research notes</summary><p>Season reference reviewed {formatLongDate(record.reviewedOn)}. {review && 'Preserved material shown for local review; republication is not approved.'}</p><ul>{record.sources.map(s => <li key={s.id}><a href={s.url}>{s.label} ↗</a><p>{s.claims}</p></li>)}</ul>{record.researchNotes.map(note => <p key={note}>{note}</p>)}</details>
    <nav className="hl-adjacent" aria-label="Available seasons">{previous && <Link href={`/history/seasons/${previous}`}>← {previous.replace('-', '–')}</Link>}{next && <Link href={`/history/seasons/${next}`}>{next.replace('-', '–')} →</Link>}<Link href="/history">Back to History</Link></nav>
  </main>;
}
