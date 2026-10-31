import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ArticlesNavigation } from "@/app/components/ArticlesNavigation";
import { ArticleMeta } from "@/app/components/ArticleMeta";
import { getArticleExcerpt } from "@/lib/format";
import { getArticles } from "@/lib/content/articles";
import { groupByFixture, MATCHDAY_PATH } from "@/lib/content/matchday";
import { socialMetadata } from "@/lib/social-metadata";

export const metadata = socialMetadata(
  "Matchday | The Liverpool Brief",
  "Previews, reports and opinion on Liverpool's matches by Denny Regan, grouped by fixture.",
  MATCHDAY_PATH,
);

export default function MatchdayPage() {
  const all = getArticles();
  const pieces = all.filter(article => article.category === "Matchday");
  const { fixtures, unassigned } = groupByFixture(pieces);
  const card = (article: (typeof pieces)[number]) => (
    <article key={article.slug} className="article-card">
      <ArticleMeta {...article} />
      <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>
      <p className="preview-excerpt">{getArticleExcerpt(article, 180)}</p>
      <Link className="read-link" href={`/articles/${article.slug}`} aria-label={`Read article: ${article.title}`}>Read article</Link>
    </article>
  );
  return <>
    <SiteHeader active="articles" />
    <main id="main-content" className="site-width collection">
      <h1 className="collection-title">Matchday</h1>
      <ArticlesNavigation selected="Matchday" hasAnalysis={all.some(article => article.category === "Analysis")} />
      {pieces.length === 0 && <p className="empty-state">Matchday pieces will appear here when published.</p>}
      {fixtures.map((fixture, index) => (
        <section key={fixture.heading} className="matchday-fixture" aria-labelledby={`fixture-${index}`}>
          <h2 id={`fixture-${index}`}>{fixture.heading}</h2>
          <div className="article-grid">{fixture.pieces.map(card)}</div>
        </section>
      ))}
      {unassigned.length > 0 && (
        <section className="matchday-fixture" aria-labelledby="fixture-other">
          <h2 id="fixture-other">Other Matchday pieces</h2>
          <div className="article-grid">{unassigned.map(card)}</div>
        </section>
      )}
    </main>
  </>;
}
