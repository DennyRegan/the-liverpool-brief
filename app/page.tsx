import Link from "next/link";
import { getBrief } from "@/lib/content/briefs";
import { getArticles } from "@/lib/content/articles";
import { getArchiveFeatures } from "@/lib/content/archive";
import { formatListDate, getArticleExcerpt } from "@/lib/format";
import { SiteHeader } from "@/app/components/SiteHeader";

export default function Home() {
  const story = getBrief().stories[0];
  // Both loaders return newest publication first, regardless of historical date.
  const opinion = getArticles()[0];
  const archive = getArchiveFeatures()[0];

  return <>
    <SiteHeader active="home" />
    <main id="main-content" className="site-width collection homepage">
      <h1 className="sr-only">The Liverpool Brief</h1>
      <div className="home-intro">
        <p>The Liverpool Brief brings together the day&apos;s important Liverpool news, original opinion and stories from the club&apos;s history.</p>
        <p>Read the Brief for a quick update, or go deeper with my latest articles.</p>
      </div>
      <section className="featured-article" aria-labelledby="brief-heading">
        <div className="feature-marker"><h2 id="brief-heading" className="eyebrow">The Brief</h2></div>
        <div>
          {story ? <>
            <p className="article-meta"><span>{story.category}</span></p>
            <h3 className="home-headline"><Link href="/brief">{story.headline}</Link></h3>
            <p className="standfirst">{story.summary}</p>
          </> : <p className="standfirst">The next Brief will appear here soon.</p>}
          <div className="feature-bottom"><Link href="/brief" className="read-link">Read the full Brief →</Link></div>
        </div>
      </section>
      <div className="article-grid home-writing">
        <section className="article-card" aria-labelledby="opinion-heading">
          <h2 id="opinion-heading" className="eyebrow home-section-title">Latest Opinion</h2>
          {opinion ? <>
            <p className="article-meta"><span>Opinion</span><time dateTime={opinion.date}>{formatListDate(opinion.date)}</time></p>
            <h3 className="home-headline"><Link href={`/articles/${opinion.slug}`}>{opinion.title}</Link></h3>
            <p>{getArticleExcerpt(opinion, 220)}</p>
            <div className="feature-bottom">
              <span>{Math.max(1, Math.ceil(opinion.body.split(/\s+/).length / 220))} min read</span>
              <Link href={`/articles/${opinion.slug}`} className="read-link">Read article →</Link>
            </div>
          </> : <p>No opinion articles yet.</p>}
        </section>
        <section className="article-card" aria-labelledby="archive-heading">
          <h2 id="archive-heading" className="eyebrow home-section-title">From the Archive</h2>
          {archive ? <>
            <p className="article-meta"><span>Archive</span>
              {archive.category !== "season" && <span>{archive.category === "match" ? "Match" : "Person"}</span>}
              <span>{archive.historicalEventDate ? <time dateTime={archive.historicalEventDate}>{formatListDate(archive.historicalEventDate)} · </time> : null}{archive.historicalPeriod}</span>
            </p>
            <h3 className="home-headline"><Link href={`/archive/${archive.slug}`}>{archive.title}</Link></h3>
            <p>{getArticleExcerpt(archive, 220)}</p>
            <div className="feature-bottom"><Link href={`/archive/${archive.slug}`} className="read-link">Read article →</Link></div>
          </> : <p>Stories from the club&apos;s history will appear here.</p>}
        </section>
      </div>
    </main>
  </>;
}
