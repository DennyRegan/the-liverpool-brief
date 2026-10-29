import Link from 'next/link';
import { formatLongDate } from '@/lib/format';
export type ReadingItem = { href: string; title: string; excerpt?: string; historicalEventDate?: string; historicalPeriod?: string; season?: string; part?: number };
export function ReadingList({ articles, empty = 'There is no published writing in this selection yet.' }: { articles: ReadingItem[]; empty?: string }) {
  if (!articles.length) return <p className="hl-empty">{empty}</p>;
  return <ol className="hl-reading">{articles.map(a => <li key={a.href} id={`article-${a.href.split('/').pop()}`}><div className="hl-reading-date">{a.historicalEventDate ? <time dateTime={a.historicalEventDate}>{formatLongDate(a.historicalEventDate)}</time> : a.historicalPeriod ?? (a.season?.replace('-', '–') || 'Long-form reading')}{a.part !== undefined && <span>Chapter {a.part}</span>}</div><article><h3><Link href={a.href}>{a.title}</Link></h3>{a.excerpt && <p>{a.excerpt}</p>}<Link className="hl-text-link" href={a.href}>Read the article <span aria-hidden="true">→</span><span className="hl-sr">: {a.title}</span></Link></article></li>)}</ol>;
}
