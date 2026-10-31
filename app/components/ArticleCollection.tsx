import Link from "next/link";
import { getArticleExcerpt } from "@/lib/format";
import { ArticleMeta } from "./ArticleMeta";

type CollectionArticle = {
  slug: string; href: string; title: string; category: string; matchType?: string;
  date: string; body: string; excerpt?: string; tags?: string[];
};

export function ArticleCollection({ articles, column = false, emptyMessage }: {
  articles: CollectionArticle[];
  column?: boolean;
  emptyMessage?: string;
}) {
  const [featured, ...rest] = articles;
  const Heading = column ? "h3" : "h2";
  return (
    <div className={column ? "article-collection article-collection--column" : "article-collection"} aria-live="polite">
      {featured ? (
        <>
          <article className="featured-article">
            <ArticleMeta {...featured} showColumn={!column} />
            <h2><Link href={featured.href}>{featured.title}</Link></h2>
            <p className="preview-excerpt">{getArticleExcerpt(featured, 240)}</p>
            <Link href={featured.href} className="read-link" aria-label={`Read article: ${featured.title}`}>Read article</Link>
          </article>
          {rest.length > 0 && (
            <section className="more-writing" aria-label={column ? "Previous editions" : "More articles"}>
              {column && <h2 className="eyebrow">Previous editions</h2>}
              <div className="article-grid">
                {rest.map(article => (
                  <article key={article.href} className="article-card">
                    <ArticleMeta {...article} showColumn={!column} />
                    <Heading><Link href={article.href}>{article.title}</Link></Heading>
                    <p className="preview-excerpt">{getArticleExcerpt(article, 180)}</p>
                    <Link href={article.href} className="read-link" aria-label={`Read article: ${article.title}`}>Read article</Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      ) : <p className="empty-state">{emptyMessage ?? "New writing will appear here."}</p>}
    </div>
  );
}
