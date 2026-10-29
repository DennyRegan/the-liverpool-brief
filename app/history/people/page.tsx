import type { Metadata } from 'next';
import Link from 'next/link';
import { getHistoryView } from '@/lib/content/history-library-view';
import { availableEntities, entityHref } from '@/lib/content/history-library';
import { ReadingList } from '@/app/components/history/ReadingList';
export const metadata: Metadata = { title: 'People | The Liverpool Brief', alternates: { canonical: '/history/people' } };
export default async function PeoplePage() {
  const library = await getHistoryView();
  const people = availableEntities(library).filter(e => e.kind === 'person');
  return <main id="main-content" className="hl-main"><header className="hl-heading"><p className="hl-eyebrow">Players &amp; managers</p><h1>The people in the story.</h1><p className="hl-deck">Follow a person through the seasons, matches and long-form writing connected to them.</p></header><ul className="hl-entity-grid">{people.map(e => <li key={e.id}><Link href={entityHref(e)}>{e.label}<span aria-hidden="true">↗</span></Link></li>)}</ul><section className="hl-section"><h2>Biographies &amp; profiles</h2><ReadingList articles={library.articles.filter(a => ['player', 'manager'].includes(a.articleType ?? ''))} empty="No approved biographies are currently published. The reading pages above bring together existing connections without inventing a profile." /></section></main>;
}
