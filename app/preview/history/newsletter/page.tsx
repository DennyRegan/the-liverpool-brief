import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/SiteHeader';
import { canViewHistoryPrototype } from '@/lib/history-prototype-access';
import { getHistoryLibrary, newsletterDiscovery } from '@/lib/content/history-library';
import { EventList } from '@/app/components/history/EventList';
import { briefCopy, calendarLabel, eventWeek, FIRST_CALENDAR_DATE } from '@/lib/content/on-this-day';
import { previousWeekEnd, weekForDate, requestedWeek } from '@/lib/content/weekly-history';
import { CopyBriefEntry } from '@/app/components/history/CopyBriefEntry';
import '@/app/history/on-this-day/on-this-day.css';
import { ReadingList } from '@/app/components/history/ReadingList';
import '@/app/history/history.css';
export const metadata: Metadata = { title: 'Sunday Brief · Editorial discovery', robots: { index: false, follow: false } };
export default async function NewsletterDiscovery({ searchParams }: { searchParams: Promise<{ end?: string | string[]; pick?: string | string[] }> }) {
  if (!await canViewHistoryPrototype()) notFound();
  const { end: input, pick } = await searchParams;
  const { date: selectedDate, invalid } = requestedWeek(input ?? previousWeekEnd());
  const library = getHistoryLibrary();
  const end = weekForDate(library, selectedDate).at(-1)!.iso;
  const selection = newsletterDiscovery(library, end);
  const anniversaries = eventWeek(library.events, end);
  const chosen = typeof pick === 'string' ? anniversaries.find(item => item.event.id === pick) : undefined;
  return <div className="hl-surface"><SiteHeader /><main id="main-content" className="site-width hl-main"><header className="hl-heading"><p className="hl-eyebrow">Local editorial workspace</p><h1>For The Sunday Brief.</h1><p className="hl-deck">Choose the strongest approved story from the previous Monday–Sunday week, or select another week. Nothing is selected, sent or published automatically.</p></header><form className="hl-filters"><label>Choose a week (any date)<input type="date" name="end" required key={end} defaultValue={end} min={FIRST_CALENDAR_DATE} max="9999-12-26" /></label><button>Review the week</button></form>{invalid && <p role="status">Invalid date; showing the current calendar week.</p>}<p className="hl-muted">{selection.start} to {selection.end}, inclusive. Copy links and source references from the selections below into your editorial draft.</p>
    <section className="hl-section"><h2>Anniversaries from the week</h2>
      <p className="hl-muted">Choose the strongest entry for this edition. The default is the previous completed UK calendar week. Selection stays in this local preview’s URL; nothing is sent or published.</p>
      {anniversaries.length ? <ul className="otd-dates">{anniversaries.map(({ event, anniversary }) => <li key={event.id}>
        <div><time dateTime={anniversary}>{calendarLabel(anniversary)}</time><p>{event.title}</p></div>
        <Link href={`?end=${end}&pick=${encodeURIComponent(event.id)}#selected-entry`}>Choose this entry →</Link>
      </li>)}</ul> : <p className="hl-empty">No verified anniversaries in this window. There is no need to force an entry.</p>}
      {pick !== undefined && !chosen && <p role="status">That selection is unavailable in this calendar week. Choose an eligible entry above.</p>}
      {chosen && <section id="selected-entry" className="hl-section"><h2>Selected for your draft</h2><p className="hl-muted">Anniversary: {calendarLabel(chosen.anniversary)}. Review the wording before using it.</p>
        <EventList events={[chosen.event]} library={library} />
        <CopyBriefEntry key={`${end}-${chosen.event.id}`} text={briefCopy(chosen.event, chosen.anniversary)} />
        <Link className="hl-text-link" href={`?end=${end}`}>Clear selection</Link>
      </section>}
    </section>
    <section className="hl-section"><h2>Published biographies</h2><ReadingList articles={selection.biographies} /></section><section className="hl-section"><h2>New series chapters this week</h2><ReadingList articles={selection.chapters} /></section><section className="hl-section"><h2>Classic matches to revisit</h2><ReadingList articles={selection.matches} /></section><section className="hl-section"><h2>Season editions</h2><ul className="hl-chips">{selection.seasons.map(s => <li key={s.record.season}><Link href={`/history/seasons/${s.record.season}`}>{s.record.season.replace('-', '–')}</Link></li>)}</ul>{!selection.seasons.length && <p className="hl-empty">No approved season editions yet. The local 1987–88 review is excluded from newsletter suggestions.</p>}</section><Link className="hl-text-link" href="/history">Return to History →</Link></main></div>;
}
