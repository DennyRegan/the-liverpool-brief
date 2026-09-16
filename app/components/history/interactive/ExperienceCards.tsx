import Link from "next/link";
import { formatListDate } from "@/lib/format";
import type { ExperienceSummary } from "@/lib/interactive-history/models";

export function ExperienceCards({ experiences, headingId }: { experiences: ExperienceSummary[]; headingId: string }) {
  if (!experiences.length) return null;
  return <section className="hx-reading" aria-labelledby={headingId}>
    <p className="eyebrow">Interactive History</p>
    <h2 id={headingId}>Explore this history</h2>
    <ul className="hx-reading-list" role="list">{experiences.map(experience => <li key={experience.id}>
      <article>
        <p className="hx-period"><time dateTime={experience.historicalDate}>{formatListDate(experience.historicalDate)}</time></p>
        <h3><Link href={experience.href}>{experience.title} <span aria-hidden="true">→</span></Link></h3>
        <p>{experience.standfirst}</p>
      </article>
    </li>)}</ul>
  </section>;
}
