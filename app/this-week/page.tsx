import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryEventCard } from "@/app/components/HistoryEventCard";
import { getHistoryEvents, getHistoryWindow } from "@/lib/content/this-week";

export const metadata = {
  title: "This Week in Liverpool History | The Liverpool Brief",
  description: "Seven days of Liverpool history, with verified sources and links to full Archive stories.",
};
// Render on each visit so a cached build cannot leave yesterday's window on screen.
export const dynamic = "force-dynamic";

export default function ThisWeekPage() {
  const days = getHistoryWindow(getHistoryEvents());
  return <><SiteHeader active="this-week" /><main id="main-content" className="reading-page history-page">
    <h1>This Week in Liverpool History</h1>
    <p className="history-range"><time dateTime={days[0].iso}>{days[0].label}</time> – <time dateTime={days[6].iso}>{days[6].label}</time></p>
    {days.map(day => <section key={day.iso} aria-labelledby={`day-${day.iso}`} className="history-section">
      <h2 id={`day-${day.iso}`}><time dateTime={day.iso}>{day.label}</time><span>{day.weekday}</span></h2>
      {day.events.length ? day.events.map(event => <HistoryEventCard key={event.slug} event={event} />) : <p className="history-empty">No entry yet</p>}
    </section>)}
  </main></>;
}
