import Link from 'next/link';
import { notFound } from 'next/navigation';
import { availableEntities, articleEntityIds, seasonEntityIds, type HistoryLibrary } from '@/lib/content/history-library';
import { ReadingList } from './ReadingList';
export function EntityReading({ id, library, person }: { id: string; library: HistoryLibrary; person: boolean }) {
  const entity = availableEntities(library).find(e => e.id === id && (person ? e.kind === 'person' : e.kind !== 'person'));
  if (!entity) notFound();
  const articles = library.articles.filter(a => articleEntityIds(a).includes(id)).sort((a,b) => (a.historicalEventDate ?? a.season ?? '').localeCompare(b.historicalEventDate ?? b.season ?? ''));
  const seasons = library.seasons.filter(s => seasonEntityIds(s.record).includes(id) || articles.some(a => a.season === s.record.season));
  const series = library.series.filter(s => s.personIds.includes(id) || s.articles.some(a => articleEntityIds(a).includes(id)));
  const chapters = library.series.flatMap(s => s.articles).filter(a => articleEntityIds(a).includes(id) && !articles.some(item => item.href === a.href));
  const roles = person ? [
    { title: 'As a player', matches: articles.filter(a => a.playerIds?.includes(id) && !a.managerIds?.includes(id)) },
    { title: 'As manager', matches: articles.filter(a => a.managerIds?.includes(id) && !a.playerIds?.includes(id)) },
    { title: 'As player and manager', matches: articles.filter(a => a.managerIds?.includes(id) && a.playerIds?.includes(id)) },
  ] : [{ title: 'Connected writing', matches: articles }];
  return <main id="main-content" className="hl-main"><header className="hl-heading"><p className="hl-eyebrow">{person ? 'People' : entity.kind} · Connected reading</p><h1>{entity.label}</h1><p className="hl-deck">Published writing and available season connections. This collection grows with the library.</p></header>
    {seasons.length > 0 && <section className="hl-section"><h2>In the season files</h2><ul className="hl-chips">{seasons.map(s => <li key={s.record.season}><Link href={`/history/seasons/${s.record.season}`}>{s.record.season.replace('-', '–')}{s.review ? ' · Local review' : ''}</Link></li>)}</ul></section>}
    {roles.filter(r => r.matches.length).map(role => <section className="hl-section" key={role.title}><h2>{role.title}</h2><ReadingList articles={role.matches} /></section>)}
    {!articles.length && <p className="hl-empty">No published article is currently connected to this subject. The available season or series provides the context for this page.</p>}
    {chapters.length > 0 && <section className="hl-section"><h2>Related series chapters</h2><ReadingList articles={chapters} /></section>}
    {series.length > 0 && <section className="hl-section"><h2>In the series</h2><ul className="hl-directory">{series.map(s => <li key={s.id}><h3><Link href={`/history/series/${s.id}`}>{s.title} →</Link></h3><p>{s.articles.length} chapters published · {s.plannedChapters} planned</p></li>)}</ul></section>}
    <Link className="hl-text-link" href={person ? '/history/people' : '/history/explore'}>← {person ? 'All people' : 'Explore History'}</Link>
  </main>;
}
