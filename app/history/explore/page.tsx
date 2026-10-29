import type { Metadata } from 'next';
import Link from 'next/link';
import { getHistoryView } from '@/lib/content/history-library-view';
import { availableEntities, entityHref } from '@/lib/content/history-library';
export const metadata: Metadata = { title: 'Explore History | The Liverpool Brief', alternates: { canonical: '/history/explore' } };
export default async function ExplorePage() {
  const library = await getHistoryView(); const entities = availableEntities(library);
  return <main id="main-content" className="hl-main"><header className="hl-heading"><p className="hl-eyebrow">Follow a connection</p><h1>One story leads to another.</h1><p className="hl-deck">Start with a person, an opponent or a competition. Every connection comes from the subjects of existing writing and season records.</p></header><form action="/search" className="hl-search"><label htmlFor="explore-query">Search the published library</label><div><input id="explore-query" name="q" type="search" maxLength={120} placeholder="Try John Barnes or 1987–88" /><button>Search</button></div></form>
    <div className="hl-explore-grid">{([['person', 'People'], ['opposition', 'Opposition'], ['competition', 'Competitions'], ['location', 'Places'], ['theme', 'Themes']] as const).map(([kind, title]) => <section key={kind} className="hl-section"><h2>{title}</h2><ul className="hl-chips">{entities.filter(e => e.kind === kind).map(e => <li key={e.id}><Link href={entityHref(e)}>{e.label}</Link></li>)}</ul>{!entities.some(e => e.kind === kind) && <p className="hl-empty">No available connections yet.</p>}</section>)}</div></main>;
}
