import { getMatchCollectionView } from "@/lib/content/match-collection-view";
import { seasonMatchHref } from "@/lib/content/match-collection";
import type { ArchiveFeature } from "@/lib/content/types";
import Link from 'next/link';
import { getHistoryView } from '@/lib/content/history-library-view';
import { articleEntityIds, availableEntities, entityHref, relatedReading, seriesNeighbours } from '@/lib/content/history-library';
import '@/app/history/history.css';
export async function ArticleConnections({ href, reviewArticle }: { href: string; reviewArticle?: ArchiveFeature }) {
  const library = await getHistoryView(); const article = library.articles.find(a => a.href === href) ?? (reviewArticle ? { ...reviewArticle, href } : undefined);
  const series = library.series.find(s => s.articles.some(a => a.href === href));
  if (!article && !series) return null;
  const current = article ?? series?.articles.find(a => a.href === href);
  const season = current && library.seasons.find(s => s.record.season === current.season);
  const collection = await getMatchCollectionView();
  const match = collection.matches.find(a => a.href === href);
  const seasonUrl = match ? seasonMatchHref(match, collection.matches) : season ? `/history/seasons/${season.record.season}` : undefined;
  const available = availableEntities(library);
  const entities = current ? articleEntityIds(current).map(id => available.find(e => e.id === id)).filter(e => e !== undefined).slice(0, 5) : [];
  const related = article ? relatedReading(article, library) : [];
  const neighbours = series ? seriesNeighbours(series, href) : {};
  return <aside className="hl-connections" aria-label="Connected reading">{series && <section><p className="hl-eyebrow">Part of {series.title}</p><Link className="hl-text-link" href={`/history/series/${series.id}`}>Series contents →</Link><nav className="hl-adjacent" aria-label="Published series chapters">{neighbours.previous && <Link href={neighbours.previous.href}>← Previous available chapter: {neighbours.previous.title}</Link>}{neighbours.next && <Link href={neighbours.next.href}>Next available chapter: {neighbours.next.title} →</Link>}</nav></section>}
    {current && <section><h2>Explore this history</h2>{seasonUrl && <Link className="hl-text-link" href={seasonUrl}>Return to {current.season?.replace('-', '–')}{season?.review ? ' · Local season review' : ''} →</Link>}<ul className="hl-chips">{entities.map(e => <li key={e.id}><Link href={entityHref(e)}>{e.label}</Link></li>)}</ul></section>}
    {related.length > 0 && <section><h2>Continue reading</h2><ul className="hl-related">{related.map(({ article: a, reasons }) => <li key={a.href}><Link href={a.href}>{a.title} →</Link><small>{reasons.join(' · ')}</small></li>)}</ul></section>}
  </aside>;
}
