import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/SiteHeader';
import { canViewHistoryPrototype } from '@/lib/history-prototype-access';
import { getHistoryLibrary, londonDate, newsletterDiscovery, validDate } from '@/lib/content/history-library';
import { EventList } from '@/app/components/history/EventList';
import { ReadingList } from '@/app/components/history/ReadingList';
import '@/app/history/history.css';
export const metadata: Metadata = { title: 'Sunday Brief · Editorial discovery', robots: { index: false, follow: false } };
export default async function NewsletterDiscovery({ searchParams }: { searchParams: Promise<{ end?: string }> }) {
  if (!await canViewHistoryPrototype()) notFound();
  const { end: input } = await searchParams; const invalid = input !== undefined && (typeof input !== 'string' || !validDate(input));
  const end = !invalid && input ? input : londonDate(); const library = getHistoryLibrary(); const selection = newsletterDiscovery(library, end);
  return <div className="hl-surface"><SiteHeader /><main id="main-content" className="site-width hl-main"><header className="hl-heading"><p className="hl-eyebrow">Local editorial workspace</p><h1>For The Sunday Brief.</h1><p className="hl-deck">Published reading and verified anniversaries to consider for a curated edition. Nothing is selected, sent or published automatically.</p></header><form className="hl-filters"><label>Seven-day period ending<input type="date" name="end" required defaultValue={end} /></label><button>Review the week</button></form>{invalid && <p role="status">Invalid date; showing the seven days ending today.</p>}<p className="hl-muted">{selection.start} to {selection.end}, inclusive. Copy links and source references from the selections below into your editorial draft.</p>
    <section className="hl-section"><h2>Anniversaries from the week</h2><p className="hl-muted">Choose the most worthwhile event for the edition; no automatic “strongest” ranking.</p>{selection.anniversaries.length ? <EventList events={selection.anniversaries.map(a => a.event)} library={library} /> : <p className="hl-empty">No verified anniversaries in this window.</p>}</section>
    <section className="hl-section"><h2>Published biographies</h2><ReadingList articles={selection.biographies} /></section><section className="hl-section"><h2>New series chapters this week</h2><ReadingList articles={selection.chapters} /></section><section className="hl-section"><h2>Classic matches to revisit</h2><ReadingList articles={selection.matches} /></section><section className="hl-section"><h2>Season editions</h2><ul className="hl-chips">{selection.seasons.map(s => <li key={s.record.season}><Link href={`/history/seasons/${s.record.season}`}>{s.record.season.replace('-', '–')}</Link></li>)}</ul>{!selection.seasons.length && <p className="hl-empty">No approved season editions yet. The local 1987–88 review is excluded from newsletter suggestions.</p>}</section><Link className="hl-text-link" href="/history">Return to History →</Link></main></div>;
}
