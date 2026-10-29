import type { Metadata } from 'next';
import Link from 'next/link';
import { getHistoryView } from '@/lib/content/history-library-view';
import { ReadingList } from '@/app/components/history/ReadingList';
export const metadata: Metadata = { title: 'History | The Liverpool Brief', alternates: { canonical: '/history' } };
export default async function HistoryPage() {
  const library = await getHistoryView();
  const season = library.seasons.at(-1);
  return <main id="main-content" className="hl-main"><header className="hl-heading"><p className="hl-eyebrow">Liverpool, through the years</p><h1>The stories<br /><em>that stay with us.</em></h1><p className="hl-deck">Seasons, people and matches. A growing library of Liverpool history, with time to read and room to explore.</p></header>
    {season && <section className="hl-feature" aria-labelledby="season-feature"><div><p className="hl-eyebrow">The season file</p><p className="hl-big-year">{season.record.season.replace('-', '–')}</p><span className="hl-status">{season.review ? 'Season experience · Local review' : 'Season experience'}</span></div><div><h2 id="season-feature">{season.record.season === "1987-88" ? "The shape of a championship." : `Inside ${season.record.season.replace("-", "–")}.`}</h2><p>{season.record.overview[0]}</p><Link className="hl-button" href={`/history/seasons/${season.record.season}`}>Explore the season <span aria-hidden="true">→</span></Link></div></section>}
    <section className="hl-section"><div className="hl-section-heading"><h2>Start with a match.</h2><Link href="/history/matches">All classic matches →</Link></div><ReadingList articles={library.articles.filter(a => a.articleType === 'match').slice(0, 2)} /></section>
    <aside className="hl-series-teaser"><div><p className="hl-eyebrow">Long-form series · Planned</p><h2>Klopp’s Liverpool</h2><p>A planned series of approximately 21 chapters. Follow the writing here as it becomes available.</p></div><Link className="hl-text-link" href="/history/series/klopps-liverpool">View the series →</Link></aside>
  </main>;
}
