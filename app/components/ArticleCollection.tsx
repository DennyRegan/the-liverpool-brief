import Link from "next/link";

type ArticleSummary = { slug: string; title: string; category: string; date: string; excerpt: string; minutes: number };

export function ArticleCollection({ articles, home = false }: { articles: ArticleSummary[]; home?: boolean }) {
  const [featured, ...rest] = articles;
  return (
    <>
      <div className="collection-bar">
        <h1>{home ? "Latest writing" : "Articles"}</h1>
        {home && <Link href="/articles" className="read-link">All articles →</Link>}
      </div>
      <div aria-live="polite">
        {featured ? <>
          <article className="featured-article">
            <div className="feature-marker"><span className="eyebrow">The latest</span><span className="feature-number" aria-hidden="true">01</span></div>
            <div>
              <p className="article-meta"><span>{featured.category === "History" ? "Archive" : featured.category}</span><span>{featured.date}</span></p>
              <h2><Link href={`/articles/${featured.slug}`}>{featured.title}</Link></h2>
              <p className="standfirst">{featured.excerpt}</p>
              <div className="feature-bottom"><span>Denny Regan · {featured.minutes} min read</span><Link href={`/articles/${featured.slug}`} className="read-link">Read article <span aria-hidden="true">↗</span></Link></div>
            </div>
          </article>
          {rest.length > 0 && <section className="more-writing" aria-label="More articles"><p className="eyebrow">{home ? "Also recent" : "More writing"}</p><div className="article-grid">
            {rest.map(article => <article key={article.slug} className="article-card"><p className="article-meta"><span>{article.category === "History" ? "Archive" : article.category}</span><span>{article.date}</span></p><h2><Link href={`/articles/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><span className="reading-time">{article.minutes} min read</span></article>)}
          </div></section>}
        </> : <p className="empty-state">New writing will appear here.</p>}
      </div>
    </>
  );
}
