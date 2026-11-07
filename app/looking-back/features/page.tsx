import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { HistoryHeader, plural } from "@/app/components/HistoryHeader";
import { getFeatures } from "@/lib/content/history";
import { FEATURES_PATH } from "@/lib/content/looking-back";
import { formatListDate } from "@/lib/format";
import { socialMetadata } from "@/lib/social-metadata";
import "../history.css";

export const metadata = socialMetadata("Features | Looking Back | The Liverpool Brief", "Longer historical pieces from The Liverpool Brief.", FEATURES_PATH);

// Denny's retained factual Archive pieces. Their URLs stay at /archive/[slug].
export default function FeaturesPage() {
  const features = getFeatures();
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection history-index">
      <HistoryHeader title="Features" standfirst="Longer historical pieces." count={plural(features.length, "feature")} />
      {features.length ? <ol className="history-list">
        {features.map(article => <li key={article.slug}>
          <p className="history-list-meta">{article.historicalPeriod}</p>
          <h3><Link href={`/archive/${article.slug}`}>{article.title}</Link></h3>
          <p className="history-list-excerpt">{article.excerpt}</p>
          <p className="history-list-date">Published {formatListDate(article.date)}</p>
        </li>)}
      </ol> : <p className="empty-state">The first feature will appear here when published.</p>}
    </main>
  </>;
}
