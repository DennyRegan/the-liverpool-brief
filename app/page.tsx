import Link from 'next/link';
import './homepage.css';
import { SiteHeader } from '@/app/components/SiteHeader';
import { NewsletterInvitation } from '@/app/components/NewsletterInvitation';
import { ArticleMeta } from '@/app/components/ArticleMeta';
import { getWriting } from '@/lib/content/writing';
import { selectHomeLead } from '@/lib/content/homepage';
import { getHomeLeadOverride } from '@/lib/content/homepage-config';
import { getNewsletterConfig } from '@/lib/newsletter-config';
import { getArticleExcerpt } from '@/lib/format';

export const metadata = {
  description: 'Independent Liverpool writing by Denny Regan.',
  alternates: { canonical: '/' },
};
// Selection is evaluated on every request, never frozen into a static build.
export const dynamic = 'force-dynamic';

export default function Home() {
  const writing = getWriting();
  const lead = selectHomeLead(writing, new Date(), getHomeLeadOverride());
  const more = writing.filter(article => article.href !== lead?.href).slice(0, 4);
  return <>
    <SiteHeader active="home" />
    <main id="main-content" className="site-width home-page">
      <section aria-labelledby="home-articles-heading">
        <div className="home-section-heading"><h2 id="home-articles-heading" className="eyebrow">Latest writing</h2><Link className="collection-link" href="/articles">All articles</Link></div>
        {lead ? <div className="home-writing">
          <article className="home-lead">
            <ArticleMeta {...lead} />
            <h1><Link href={lead.href}>{lead.title}</Link></h1>
            <p className="preview-excerpt">{getArticleExcerpt(lead, 240)}</p>
            <Link className="read-link" href={lead.href} aria-label={`Read article: ${lead.title}`}>Read article</Link>
          </article>
          {more.length > 0 && <div className="home-more"><p className="eyebrow">More to read</p>{more.map(article => <article key={article.href}>
            <ArticleMeta {...article} />
            <h2><Link href={article.href}>{article.title}</Link></h2>
            <p className="preview-excerpt">{getArticleExcerpt(article, 180)}</p>
            <Link className="read-link" href={article.href} aria-label={`Read article: ${article.title}`}>Read article</Link>
          </article>)}</div>}
        </div> : <><h1 className="home-empty-title">Independent Liverpool writing</h1><Link className="read-link" href="/articles">Browse articles →</Link></>}
      </section>
      {getNewsletterConfig() && <NewsletterInvitation />}
    </main>
  </>;
}
