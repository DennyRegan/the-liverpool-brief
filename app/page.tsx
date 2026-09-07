import Link from "next/link";
import { getWriting } from "@/lib/content/writing";
import { getBrief } from "@/lib/content/briefs";
import { selectHomeWriting } from "@/lib/content/homepage";
import { formatLastUpdated, formatListDate, getArticleExcerpt } from "@/lib/format";
import { SiteHeader } from "@/app/components/SiteHeader";

export const metadata = {
  description: "A concise Liverpool news briefing, plus independent opinion and stories from the club's past by Denny Regan.",
  alternates: { canonical: "/" },
};

export default function Home() {
  const brief = getBrief();
  const story = brief.stories[0];
  const { opinion, archive } = selectHomeWriting(getWriting());

  return (
    <>
      <SiteHeader active="home" />
      <main id="main-content" className="site-width home-page">
        <div className="home-intro">
          <h1>Liverpool news, opinion and history.</h1>
          <p>The Brief brings you the key Liverpool news, with links to the sources. For a longer read, explore opinion and stories from the club’s past, written by Denny Regan.</p>
        </div>

        <section className="home-section home-brief" aria-labelledby="home-brief-heading">
          <h2 id="home-brief-heading" className="eyebrow">The Brief</h2>
          {story ? (
            <article>
              <p className="article-meta"><span>{story.category}</span><span>Last updated: <time dateTime={brief.lastUpdated}>{formatLastUpdated(brief.lastUpdated)}</time></span></p>
              <h3><Link href="/brief">{story.headline}</Link></h3>
              <p className="home-summary">{story.summary}</p>
            </article>
          ) : <p className="home-summary">The next briefing will appear here when it is published.</p>}
          <div className="home-links"><Link href="/brief" className="read-link">Read the full Brief <span aria-hidden="true">→</span></Link></div>
        </section>

        <div className="home-writing">
          {([
            { category: "Opinion", article: opinion, href: "/articles?category=opinion", label: "All opinion" },
            { category: "Archive", article: archive, href: "/articles?category=archive", label: "All archive articles" },
          ] as const).map(({ category, article, href, label }) => (
            <section key={category} className="home-section" aria-labelledby={`home-${category.toLowerCase()}-heading`}>
              <h2 id={`home-${category.toLowerCase()}-heading`} className="eyebrow">{category}</h2>
              {article ? (
                <>
                  <article>
                    <p className="article-meta"><time dateTime={article.date}>{formatListDate(article.date)}</time><span>{Math.max(1, Math.ceil(article.body.split(/\s+/).length / 220))} min read</span></p>
                    <h3><Link href={article.href}>{article.title}</Link></h3>
                    <p className="home-summary">{getArticleExcerpt(article, 220)}</p>
                  </article>
                  <div className="home-links">
                    <Link href={article.href} className="read-link">Read article <span aria-hidden="true">→</span></Link>
                    <Link href={href} className="read-link">{label} <span aria-hidden="true">→</span></Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="home-summary">A new {category.toLowerCase()} piece will appear here when it is published.</p>
                  <div className="home-links"><Link href={href} className="read-link">{label} <span aria-hidden="true">→</span></Link></div>
                </>
              )}
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
