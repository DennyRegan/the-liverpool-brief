import Link from "next/link";
import { eraYears, type HistoryEra } from "@/lib/content/history";
import { EraPortrait } from "./EraPortrait";
import { EraFacts } from "./EraFacts";

type Reading = { slug: string; title: string };

export function EraCard({ era, articles }: { era: HistoryEra; articles: Reading[] }) {
  return (
    <article className="hx-era" id={era.id} aria-labelledby={`${era.id}-name`}>
      <div className="hx-era-heading">
        <EraPortrait era={era} />
        <div>
          <p className="hx-period">{eraYears(era)}{era.tenureLabel && <span>{era.tenureLabel}</span>}</p>
          <h2 id={`${era.id}-name`}><Link href={`/history/${era.id}`} prefetch={false}>{era.manager}</Link></h2>
        </div>
      </div>
      <div className="hx-era-body">
        <p className="hx-summary">{era.summary}</p>
        <EraFacts era={era} />
        {articles.length > 0 && <aside className="hx-card-reading" aria-label={`Archive writing from ${era.manager}, ${eraYears(era)}`}>
          <h3 className="eyebrow">From the Archive</h3>
          <ul role="list">{articles.slice(0, 2).map(article => <li key={article.slug}>
            <Link href={`/archive/${article.slug}`} prefetch={false}>{article.title}<span aria-hidden="true"> ↗</span></Link>
          </li>)}</ul>
        </aside>}
        <Link className="hx-explore" href={`/history/${era.id}`} prefetch={false}>
          Explore this era<span className="sr-only">: {era.manager}, {eraYears(era)}</span><span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
