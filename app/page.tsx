import Link from 'next/link';
import './homepage.css';
import { SiteHeader } from '@/app/components/SiteHeader';
import { NewsletterInvitation } from '@/app/components/NewsletterInvitation';
import { ArticleMeta } from '@/app/components/ArticleMeta';
import { getWriting } from '@/lib/content/writing';
import { selectHomePage } from '@/lib/content/homepage';
import { getHomeLeadOverride } from '@/lib/content/homepage-config';
import { getNewsletterConfig } from '@/lib/newsletter-config';
import { getArticleExcerpt } from '@/lib/format';
import { FootballObservedHome } from '@/app/components/FootballObservedHome';
import { getReganOnFootballEditions } from '@/lib/content/regan-on-football';

export const metadata = {
  description: 'Independent Liverpool writing by Denny Regan.',
  alternates: { canonical: '/' },
};
// Selection is evaluated on every request, never frozen into a static build.
export const dynamic = 'force-dynamic';

export default function Home() {
  const writing = getWriting();
  const { lead, column, more, history } = selectHomePage(writing, new Date(), getHomeLeadOverride());
  const featuredEdition = getReganOnFootballEditions().find(article => `/articles/${article.slug}` === column?.href);
  return <>
    <SiteHeader active="home" />
    <main id="main-content" className="site-width home-page">
      {getNewsletterConfig() && <NewsletterInvitation />}
      <section aria-labelledby="home-articles-heading">
        <div className="home-section-heading"><h2 id="home-articles-heading" className="eyebrow">Latest writing</h2><Link className="collection-link" href="/articles">All articles</Link></div>
        {lead ? <div className="home-lead-block">
          <article className="home-lead">
            <ArticleMeta {...lead} />
            <h1><Link href={lead.href}>{lead.title}</Link></h1>
            <p className="preview-excerpt">{getArticleExcerpt(lead, 240)}</p>
            <Link className="read-link" href={lead.href} aria-label={`Read article: ${lead.title}`}>Read article</Link>
          </article>
        </div> : <><h1 className="home-empty-title">Independent Liverpool writing</h1><Link className="read-link" href="/articles">Browse articles →</Link></>}
      </section>
      {featuredEdition && <FootballObservedHome article={featuredEdition} />}
      {more.length > 0 && <section className="home-recent" aria-labelledby="home-recent-heading">
        <div className="home-section-heading"><h2 id="home-recent-heading" className="eyebrow">More articles</h2><Link className="collection-link" href="/articles">All articles</Link></div>
        <div className="article-grid">{more.map(article => <article className="article-card" key={article.href}>
            <ArticleMeta {...article} />
            <h3><Link href={article.href}>{article.title}</Link></h3>
            <p className="preview-excerpt">{getArticleExcerpt(article, 180)}</p>
            <Link className="read-link" href={article.href} aria-label={`Read article: ${article.title}`}>Read article</Link>
        </article>)}</div>
      </section>}
      {history && <section className="home-history" aria-labelledby="home-history-heading">
        <div className="home-section-heading"><h2 id="home-history-heading" className="eyebrow">From History</h2><Link className="collection-link" href="/history">Explore History</Link></div>
        <article className="article-card">
          <ArticleMeta {...history} />
          <h3><Link href={history.href}>{history.title}</Link></h3>
          <p className="preview-excerpt">{getArticleExcerpt(history, 180)}</p>
          <Link className="read-link" href={history.href} aria-label={`Read article: ${history.title}`}>Read article</Link>
        </article>
      </section>}
    </main>
  </>;
}
