"use client";
import { useState } from "react";
import Link from "next/link";

type ArticleSummary = { slug: string; href: string; title: string; category: string; date: string; excerpt: string; minutes: number };

export function ArticleCollection({ articles, home = false }: { articles: ArticleSummary[]; home?: boolean }) {
  const [filter, setFilter] = useState("All");
  const visible = home || filter === "All" ? articles : articles.filter(article => article.category === filter);
  const [featured, ...rest] = visible;
  return (
    <>
      <div className="collection-bar">
        <h1>{home ? "Latest writing" : "Articles"}</h1>
        {home && <Link href="/articles" className="read-link">All articles →</Link>}
      </div>
      {!home && <div className="filters" aria-label="Article categories">{["All", "Opinion", "Archive"].map(label => <button key={label} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}</div>}
      <div aria-live="polite">
        {featured ? <>
          <article className="featured-article">
            <div className="feature-marker"><span className="eyebrow">The latest</span><span className="feature-number" aria-hidden="true">01</span></div>
            <div>
              <p className="article-meta"><span>{featured.category === "History" ? "Archive" : featured.category}</span><span>{featured.date}</span></p>
              <h2><Link href={featured.href}>{featured.title}</Link></h2>
              <p className="standfirst">{featured.excerpt}</p>
              <div className="feature-bottom"><span>Denny Regan · {featured.minutes} min read</span><Link href={featured.href} className="read-link">Read article <span aria-hidden="true">↗</span></Link></div>
            </div>
          </article>
          {rest.length > 0 && <section className="more-writing" aria-label="More articles"><p className="eyebrow">{home ? "Also recent" : "More writing"}</p><div className="article-grid">
            {rest.map(article => <article key={article.href} className="article-card"><p className="article-meta"><span>{article.category === "History" ? "Archive" : article.category}</span><span>{article.date}</span></p><h2><Link href={article.href}>{article.title}</Link></h2><p>{article.excerpt}</p><span className="reading-time">{article.minutes} min read</span></article>)}
          </div></section>}
        </> : <p className="empty-state">New writing will appear here.</p>}
      </div>
    </>
  );
}
