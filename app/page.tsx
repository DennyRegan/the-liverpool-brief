import Link from 'next/link';
import './homepage.css';
import { SiteHeader } from '@/app/components/SiteHeader';
import { NewsletterInvitation } from '@/app/components/NewsletterInvitation';
import { getWriting } from '@/lib/content/writing';
import { selectHomeLead } from '@/lib/content/homepage';
import { getHomeLeadOverride } from '@/lib/content/homepage-config';
import { getNewsletterConfig } from '@/lib/newsletter-config';
import { formatListDate, getArticleExcerpt } from '@/lib/format';

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
        <div className="home-section-heading"><h2 id="home-articles-heading" className="eyebrow">Latest writing</h2><Link className="read-link" href="/articles">All articles →</Link></div>
        {lead ? <div className="home-writing">
          <article className="home-lead">
            <p className="article-meta"><span>{lead.category}</span><time dateTime={lead.date}>{formatListDate(lead.date)}</time><span>By Denny Regan</span></p>
            <h1><Link href={lead.href}>{lead.title}</Link></h1>
            <p className="home-standfirst">{getArticleExcerpt(lead, 300)}</p>
            <Link className="read-link" href={lead.href}>Read article →</Link>
          </article>
          {more.length > 0 && <div className="home-more"><p className="eyebrow">More to read</p>{more.map(article => <article key={article.href}>
            <p className="article-meta"><span>{article.category}</span><time dateTime={article.date}>{formatListDate(article.date)}</time></p>
            <h3><Link href={article.href}>{article.title}</Link></h3>
            <p className="home-summary">{getArticleExcerpt(article, 150)}</p>
          </article>)}</div>}
        </div> : <><h1 className="home-empty-title">Independent Liverpool writing</h1><Link className="read-link" href="/articles">Browse articles →</Link></>}
      </section>
      {getNewsletterConfig() && <NewsletterInvitation />}
    </main>
  </>;
}
