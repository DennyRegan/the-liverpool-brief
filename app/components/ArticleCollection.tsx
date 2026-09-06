import Link from "next/link";

type ArticleSummary = { slug: string; href: string; title: string; category: string; archiveType?: "match" | "person" | "season"; date: string; excerpt: string; minutes: number };

export function ArticleCollection({ articles, home = false, filter = "All", archiveType = "all" }: {
  articles: ArticleSummary[]; home?: boolean; filter?: "All" | "Opinion" | "Archive"; archiveType?: "all" | "match" | "person";
}) {
  const visible = home || filter === "All" ? articles : articles.filter(article => article.category === filter &&
    (filter !== "Archive" || archiveType === "all" || article.archiveType === archiveType));
  const [featured, ...rest] = visible;
  return (
    <>
      <div className="collection-bar">
        <h1>{home ? "Latest writing" : "Articles"}</h1>
        {home && <Link href="/articles" className="read-link">All articles →</Link>}
      </div>
      {!home && <nav className="filters" aria-label="Article categories">
        {["All", "Opinion", "Archive"].map(label => (
          <Link key={label} href={label === "All" ? "/articles" : `/articles?category=${label.toLowerCase()}`}
            scroll={false} aria-current={filter === label ? "page" : undefined}>{label}</Link>
        ))}
      </nav>}
      {!home && filter === "Archive" && <nav className="archive-subcategories" aria-label="Archive subcategories">
        {([{ label: "All Archive", value: "all" }, { label: "Matches", value: "match" }, { label: "People", value: "person" }] as const).map(({ label, value }) => (
          <Link key={value} href={value === "all" ? "/articles?category=archive" : `/articles?category=archive&type=${value}`}
            scroll={false} aria-current={archiveType === value ? "page" : undefined}>{label}</Link>
        ))}
      </nav>}
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
        </> : <p className="empty-state">{filter === "Archive" ? archiveType === "match" ? "No match articles yet." : archiveType === "person" ? "No people articles yet." : "No archive articles yet." : "New writing will appear here."}</p>}
      </div>
    </>
  );
}
