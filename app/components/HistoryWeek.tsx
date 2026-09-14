import Link from "next/link";
import type { getArticleWeek } from "@/lib/content/this-week";

type Days = ReturnType<typeof getArticleWeek>;

// Intentionally text-only: all information is visible without opening a viewer.
export function HistoryWeek({ days }: { days: Days }) {
  return <div>
    {days.filter(day => day.articles.length > 0).map(day => <section key={day.iso} className="history-section" aria-labelledby={`day-${day.iso}`}>
      <h2 id={`day-${day.iso}`}>
        <time dateTime={day.iso}>{day.label}</time><span>{day.weekday}</span>
      </h2>
      {day.articles.map(article => <article className="history-entry" key={article.slug}>
        <p className="eyebrow">{article.historicalEventDate?.slice(0, 4) ?? article.historicalPeriod}</p>
        <h3><Link href={`/archive/${article.slug}`}>{article.title}</Link></h3>
        <p className="history-summary">{article.excerpt}</p>
        <div className="history-links">
          <Link href={`/archive/${article.slug}`}>Read the full story →</Link>
        </div>
      </article>)}
    </section>)}
  </div>;
}
