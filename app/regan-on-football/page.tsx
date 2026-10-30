import { SiteHeader } from "@/app/components/SiteHeader";
import { ReganOnFootballMasthead } from "@/app/components/ReganOnFootballMasthead";
import { ArticlesNavigation } from "@/app/components/ArticlesNavigation";
import Link from "next/link";
import { FootballObservedFeature } from "@/app/components/FootballObservedFeature";
import { ArticleMeta } from "@/app/components/ArticleMeta";
import { getArticleExcerpt } from "@/lib/format";
import { getReganOnFootballEditions, REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";
import { getWriting } from "@/lib/content/writing";
import { socialMetadata } from "@/lib/social-metadata";

export const metadata = socialMetadata(
  "Football Observed | The Liverpool Brief",
  "A weekly column by Denny Regan. Opinions, observations and commentary on football, published in The Liverpool Brief.",
  REGAN_ON_FOOTBALL_PATH,
);

export default function ReganOnFootballPage() {
  const [latest, ...previous] = getReganOnFootballEditions();
  return <>
    <SiteHeader active="football-observed" />
    <main id="main-content" className="site-width collection column-page">
      <ArticlesNavigation selected="Football Observed" hasAnalysis={getWriting().some(article => article.category === "Analysis")} />
      <ReganOnFootballMasthead />
      <p className="observed-introduction">Opinions, observations and commentary on football.</p>
      {latest ? <FootballObservedFeature article={latest} />
        : <p className="empty-state">The first edition will appear here when published.</p>}
      {previous.length > 0 && <section className="observed-previous" aria-labelledby="previous-editions-heading">
        <h2 id="previous-editions-heading" className="eyebrow">Previous editions</h2>
        <div className="article-grid">{previous.map(article => <article key={article.slug} className="article-card">
          <ArticleMeta {...article} showColumn={false} />
          <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>
          <p className="preview-excerpt">{getArticleExcerpt(article, 180)}</p>
          <Link className="read-link" href={`/articles/${article.slug}`} aria-label={`Read edition: ${article.title}`}>Read the edition</Link>
        </article>)}</div>
      </section>}
    </main>
  </>;
}
