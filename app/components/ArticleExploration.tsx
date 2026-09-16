import Link from 'next/link';
import { articleExplorationLinks, getExplorations } from '@/lib/content/exploration';
import type { ArchiveFeature } from '@/lib/content/types';

export function ArticleExploration({ article }: { article: ArchiveFeature }) {
  const links = articleExplorationLinks(article, getExplorations());
  if (!links.length) return null;
  return <nav aria-labelledby="explore-history-heading" className="mt-8 border-t border-gray-200 pt-6">
    <h2 id="explore-history-heading" className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Explore this history</h2>
    <ul className="flex flex-wrap gap-2" role="list">{links.map(link => <li key={link.href}><Link href={link.href} prefetch={false} className="inline-flex min-h-11 items-center rounded border border-gray-200 px-3 py-2 text-sm font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2">{link.label} <span aria-hidden="true" className="ml-2">→</span></Link></li>)}</ul>
  </nav>;
}
