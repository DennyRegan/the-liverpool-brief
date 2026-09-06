import Image from "next/image";
import Link from "next/link";
import type { HistoryEvent } from "@/lib/content/this-week";

export function HistoryEventCard({ event }: { event: HistoryEvent }) {
  return <article className="history-entry">
    <p className="eyebrow">{event.year}</p>
    <h3>{event.title}</h3>
    {event.image && <Image className="history-image" src={event.image.src} alt={event.image.alt}
      width={event.image.width} height={event.image.height} sizes="(max-width: 700px) calc(100vw - 40px), 560px" />}
    <p className="history-summary">{event.summary}</p>
    <div className="history-links">
      {event.archiveSlug && <Link href={`/archive/${event.archiveSlug}`}>Read the full story →</Link>}
      <a href={event.source} target="_blank" rel="noopener noreferrer">Source ↗</a>
    </div>
  </article>;
}
