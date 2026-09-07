import Link from "next/link";
import type { HistoryEvent } from "@/lib/content/this-week";
import { HistoryArtwork } from "./HistoryArtwork";

export function HistoryEventCard({ event, dateLabel, onOpen }: {
  event: HistoryEvent;
  dateLabel: string;
  onOpen: (button: HTMLButtonElement) => void;
}) {
  return <article className={`week-card ${event.image ? "week-card-illustrated" : "week-card-text"}`}
    aria-labelledby={`event-${event.slug}`}>
    <div className="week-card-poster">
      {event.image && <div className="week-card-art"><HistoryArtwork image={event.image} /></div>}
      <div className="week-card-shade" />
      <div className="week-card-copy">
        <p className="week-eyebrow">On this day <span aria-hidden="true" /></p>
        <p className="week-date"><span>{String(event.day).padStart(2, "0")}</span>
          <time dateTime={`${event.year}-${String(event.month).padStart(2, "0")}-${String(event.day).padStart(2, "0")}`}>
            {dateLabel.replace(/^\d+ /, "")} {event.year}
          </time>
        </p>
        <h3 id={`event-${event.slug}`}>{event.title}</h3>
      </div>
      {event.image?.kind === "illustration" && <span className="week-art-label">Illustration</span>}
      <button type="button" className="week-card-open" aria-haspopup="dialog" aria-controls="week-viewer"
        aria-label={`Open ${dateLabel}: ${event.title}`} onClick={e => onOpen(e.currentTarget)}>
        <span className="week-open-label">Open story <span aria-hidden="true">↗</span></span>
      </button>
    </div>
    <div className="week-card-details">
      <p className="history-summary">{event.summary}</p>
      <div className="history-links">
      {event.archiveSlug && <Link href={`/archive/${event.archiveSlug}`}>Read the full story →</Link>}
      <a href={event.source} target="_blank" rel="noopener noreferrer">Source ↗</a>
      </div>
    </div>
  </article>;
}
