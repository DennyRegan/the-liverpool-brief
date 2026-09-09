import Link from "next/link";
import { HistoryNav } from "@/app/components/history/HistoryNav";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { EraPortrait } from "@/app/components/history/EraPortrait";
import { EraFacts } from "@/app/components/history/EraFacts";
import { getArchiveFeatures } from "@/lib/content/archive";
import { eraYears, getEraArticles, getHistory } from "@/lib/content/history";
import { formatListDate } from "@/lib/format";

type Props = { params: Promise<{ era: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getHistory().eras.map(era => ({ era: era.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { era: id } = await params;
  const era = getHistory().eras.find(era => era.id === id);
  if (!era) notFound();
  return {
    title: `${era.manager}, ${eraYears(era)} | Liverpool History | The Liverpool Brief`,
    description: era.summary,
    alternates: { canonical: `/history/${era.id}` },
    openGraph: { title: `${era.manager} · ${eraYears(era)}`, description: era.summary },
  };
}

type Reading = ReturnType<typeof getArchiveFeatures>[number];

function ArchiveReading({ articles }: { articles: Reading[] }) {
  return <ul className="hx-reading-list" role="list">{articles.map(article => <li key={article.slug}>
    <article>
      <p className="hx-period">{article.historicalPeriod}</p>
      <h3><Link href={`/archive/${article.slug}`} prefetch={false}>{article.title}<span aria-hidden="true"> ↗</span></Link></h3>
      <p>{article.excerpt}</p>
    </article>
  </li>)}</ul>;
}

export default async function EraPage({ params }: Props) {
  const { era: id } = await params;
  const history = getHistory();
  const index = history.eras.findIndex(era => era.id === id);
  if (index === -1) notFound();
  const era = history.eras[index];
  const previous = history.eras[index - 1];
  const next = history.eras[index + 1];
  const articles = getEraArticles(getArchiveFeatures(), era.id, history.eras);

  return <>
    <SiteHeader active="history" />
    <main id="main-content" className="site-width hx-page hx-detail">
      <HistoryNav active="explorer" />
      <Link href={`/history#${era.id}`} className="hx-back"><span aria-hidden="true">←</span> All eras</Link>
      <header className="hx-detail-header">
        <EraPortrait era={era} large />
        <div>
          <p className="hx-period">{eraYears(era)}{era.tenureLabel && <span>{era.tenureLabel}</span>}</p>
          <h1>{era.manager}</h1>
        </div>
      </header>
      <p className="hx-standfirst">{era.summary}</p>
      <p className="hx-context">{era.context}</p>
      <EraFacts era={era} detailed />

      {articles.length > 0 && <section className="hx-reading" aria-labelledby="era-writing">
        <p className="eyebrow">Original writing · Denny Regan</p>
        <h2 id="era-writing">From the Archive</h2>
        <ArchiveReading articles={articles.slice(0, 3)} />
        {articles.length > 3 && <details className="hx-more-reading">
          <summary>More writing from this era</summary>
          <ArchiveReading articles={articles.slice(3)} />
        </details>}
      </section>}

      <details className="hx-sources">
        <summary>Sources &amp; historical notes</summary>
        <p>Facts checked {formatListDate(history.verifiedOn)}. Key players are an editorial selection{era.endDate ? "." : " from the early squad."}</p>
        {era.dateNote && <p>{era.dateNote}</p>}
        <p>{history.honoursNote}</p>
        <ul role="list">{era.sources.map(source => <li key={source.url}>
          <a href={source.url}>{source.label} <span aria-hidden="true">↗</span></a>
          <span>Confidence: {source.confidence}. {source.claims}</span>
        </li>)}</ul>
      </details>

      <nav className="hx-neighbours" aria-label="Explore neighbouring eras">
        {previous && <Link href={`/history/${previous.id}`} rel="prev">
          <span className="eyebrow">← Previous era</span><span>{previous.manager}</span><small>{eraYears(previous)}</small>
        </Link>}
        {next && <Link href={`/history/${next.id}`} rel="next">
          <span className="eyebrow">Next era →</span><span>{next.manager}</span><small>{eraYears(next)}</small>
        </Link>}
      </nav>
    </main>
  </>;
}
