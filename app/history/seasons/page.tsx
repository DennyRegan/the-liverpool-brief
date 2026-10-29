import type { Metadata } from 'next';
import Link from 'next/link';
import { getHistoryView } from '@/lib/content/history-library-view';
import { getMatchCollectionView } from '@/lib/content/match-collection-view';
import { matchSeasons } from '@/lib/content/match-collection';
export const metadata: Metadata = { title: 'Seasons | The Liverpool Brief', alternates: { canonical: '/history/seasons' } };
export default async function SeasonsPage() {
  const [{ seasons, entities }, { matches, review }] = await Promise.all([getHistoryView(), getMatchCollectionView()]);
  const reportOnly = matchSeasons(matches).filter(s => !seasons.some(e => e.record.season === s.season));
  const label = (id: string) => entities.find(e => e.id === id)?.label;
  return <main id="main-content" className="hl-main"><header className="hl-heading"><p className="hl-eyebrow">Seasons</p><h1>Experience Liverpool’s<br /><em>history, a season at a time.</em></h1><p className="hl-deck">Follow the people, defining moments and match stories that shaped a Liverpool season.</p></header>
    <section aria-label="Developed season experiences" className="hl-season-experiences">
      {seasons.map(({ record, review: local }) => <article className="hl-feature hl-season-experience" key={record.season}>
        <div><p className="hl-eyebrow">{local ? 'Interactive season · Approval preview' : 'Season experience'}</p><h2 className="hl-experience-year">{record.season.replace('-', '–')}</h2><p className="hl-experience-result">{record.league.position === 1 ? `${label(record.league.competitionId)} champions` : label(record.league.competitionId)}</p><Link className="hl-button" href={`/history/seasons/${record.season}`}>Explore the season <span aria-hidden="true">→</span></Link></div>
        <div><p>{record.overview[0]}</p><div className="hl-experience-details"><p className="hl-eyebrow">The people at its heart</p><p>{[...new Set([...record.managerIds, ...record.keyPlayerIds.slice(0, 3)])].map(label).filter(Boolean).join(' · ')}</p></div><ul className="hl-experience-contents"><li>Season story and context</li><li>Connected match reports</li><li>Players and arrivals</li>{record.events.length > 0 && <li>Timeline of key events</li>}{local && record.season === '1987-88' && <li>Optional interactive ground map</li>}</ul>{local && <p className="hl-status">Developed for local review. This season experience and its unapproved reports are not published.</p>}</div>
      </article>)}
      {!seasons.length && <div className="hl-empty"><h2>Season experiences are being developed.</h2><p>Explore the approved match stories in Classic Matches while the first season experience awaits publication.</p><Link className="hl-button" href="/history/matches">Discover classic matches →</Link></div>}
    </section>
    {reportOnly.length > 0 && <aside className="hl-section hl-report-only"><p className="hl-eyebrow">More years, more stories</p><h2>Match reports, with more of the season still to tell.</h2><p>{reportOnly.length} other {reportOnly.length === 1 ? 'season has' : 'seasons have'} match reports available{review ? ' in this approval preview' : ''}, but no developed season experience. Discover those individual stories in Classic Matches.</p><Link className="hl-text-link" href="/history/matches">Browse the match-report library →</Link><details className="hl-details"><summary>Find reports from another season</summary><ul className="hl-season-report-links">{reportOnly.map(s => <li key={s.season}><Link href={`/history/matches?season=${s.season}`}>{s.season.replace('-', '–')} <span>{s.total} {s.total === 1 ? 'report' : 'reports'}</span></Link></li>)}</ul></details></aside>}
  </main>;
}
