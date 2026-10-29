import type { Metadata } from 'next';
import Link from 'next/link';
import { getHistoryLibrary } from '@/lib/content/history-library';
export const metadata: Metadata = { title: 'Series | The Liverpool Brief', alternates: { canonical: '/history/series' } };
export default function SeriesPage() {
  return <main id="main-content" className="hl-main"><header className="hl-heading"><p className="hl-eyebrow">Long-form history</p><h1>Space for the whole story.</h1><p className="hl-deck">Substantial writing, told in chapters. Start at the beginning or return to the next available instalment.</p></header><ol className="hl-directory">{getHistoryLibrary().series.map(s => <li key={s.id}><p className="hl-eyebrow">{s.articles.length ? 'In publication' : 'Planned series'}</p><h2><Link href={`/history/series/${s.id}`}>{s.title} →</Link></h2><p>{s.introduction}</p><p className="hl-muted">{s.articles.length} chapters published · {s.plannedChapters} planned</p></li>)}</ol></main>;
}
