import Link from "next/link";
import type { RelatedArchiveArticle } from "@/lib/content/discovery";
import type { ArchiveFeature } from "@/lib/content/types";

type Recommendation = RelatedArchiveArticle<ArchiveFeature>;

export function ArchiveDiscovery({ recommendations }: { recommendations: Recommendation[] }) {
  if (!recommendations.length) return null;
  return <section id="continue-exploring" className="archive-discovery" aria-labelledby="discovery-heading">
    <h2 id="discovery-heading" className="eyebrow">Continue exploring</h2>
    {recommendations.map(({ article, reasons }) => <article key={article.slug} className="article-card">
      <p className="article-meta"><span>Archive</span><span>{article.historicalPeriod}</span></p>
      <h3><Link href={`/archive/${article.slug}`}>{article.title} <span aria-hidden="true">↗</span></Link></h3>
      <p>{article.excerpt}</p>
      <p className="archive-discovery-reason">Connected by {reasons.join(" · ")}</p>
    </article>)}
  </section>;
}
