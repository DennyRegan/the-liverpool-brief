import Link from "next/link";
import type { getHistoryWindow } from "@/lib/content/this-week";

type Days = ReturnType<typeof getHistoryWindow>;

// Intentionally text-only: all information is visible without opening a viewer.
export function HistoryWeek({ days }: { days: Days }) {
  return <div>
    {days.filter(day => day.events.length > 0).map(day => <section key={day.iso} className="history-section" aria-labelledby={`day-${day.iso}`}>
      <h2 id={`day-${day.iso}`}>
        <time dateTime={day.iso}>{day.label}</time><span>{day.weekday}</span>
      </h2>
      {day.events.map(event => <article className="history-entry" key={event.slug}>
        <p className="eyebrow">{event.year}</p>
        <h3>{event.title}</h3>
        <p className="history-summary">{event.summary}</p>
        <div className="history-links">
          {event.archiveSlug && <Link href={`/archive/${event.archiveSlug}`}>Read the full story →</Link>}
          <a href={event.source} target="_blank" rel="noopener noreferrer">Source ↗</a>
        </div>
      </article>)}
    </section>)}
  </div>;
}
