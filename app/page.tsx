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
import { MatchRevisitedHome } from '@/app/components/MatchRevisitedHome';
import { HistoryLatest } from '@/app/components/HistoryLatest';
import { getFootballObservedPieces } from '@/lib/content/regan-on-football';
import { getLatestHistory } from '@/lib/content/history';
import { selectNewestLead } from '@/lib/content/home-lead';
import { formatListDate } from '@/lib/format';

export const metadata = {
  description: 'Independent Liverpool writing by Denny Regan.',
  alternates: { canonical: '/' },
};
// Selection is evaluated on every request, never frozen into a static build.
export const dynamic = 'force-dynamic';

export default function Home() {
  const writing = getWriting();
  const { lead: liverpoolLead, column } = selectHomePage(writing, new Date(), getHomeLeadOverride());
  const featuredEdition = getFootballObservedPieces().find(article => `/articles/${article.slug}` === column?.href);
  // One lead: the newest piece of any kind. Writing is listed first so it wins a tie on date.
  const history = getLatestHistory();
  const lead = selectNewestLead<{ kind: 'article'; article: NonNullable<typeof liverpoolLead> } | { kind: 'history'; item: (typeof history)[number] }>([
    ...(liverpoolLead ? [{ date: liverpoolLead.date, item: { kind: 'article' as const, article: liverpoolLead } }] : []),
    ...(column ? [{ date: column.date, item: { kind: 'article' as const, article: column } }] : []),
    ...history.map(item => ({ date: item.date, item: { kind: 'history' as const, item } })),
  ]);
  const leadHref = lead?.kind === 'article' ? lead.article.href : lead?.item.href;
  return <>
    <SiteHeader active="home" />
    <main id="main-content" className="site-width home-page">
      {getNewsletterConfig() && <NewsletterInvitation />}
      <section aria-labelledby="home-articles-heading">
        <div className="home-section-heading"><h2 id="home-articles-heading" className="eyebrow">Latest writing</h2><Link className="collection-link" href="/articles">All articles</Link></div>
        {lead ? <div className="home-lead-block">
          {lead.kind === 'article' ? <article className="home-lead">
            <ArticleMeta {...lead.article} />
            <h1><Link href={lead.article.href}>{lead.article.title}</Link></h1>
            <p className="preview-excerpt">{getArticleExcerpt(lead.article, 240)}</p>
            <Link className="read-link" href={lead.article.href} aria-label={`Read article: ${lead.article.title}`}>Read article</Link>
          </article> : <article className="home-lead">
            <p className="article-meta"><span className="article-type">{lead.item.label}</span><time dateTime={lead.item.date}>{formatListDate(lead.item.date)}</time></p>
            <h1><Link href={lead.item.href}>{lead.item.title}</Link></h1>
            <p className="preview-excerpt">{lead.item.excerpt}</p>
            <Link className="read-link" href={lead.item.href} aria-label={`Read: ${lead.item.title}`}>Read</Link>
          </article>}
        </div> : <><h1 className="home-empty-title">Independent Liverpool writing</h1><Link className="read-link" href="/articles">Browse articles →</Link></>}
      </section>
      {featuredEdition && column?.href !== leadHref && <FootballObservedHome article={featuredEdition} />}
      <MatchRevisitedHome />
      <HistoryLatest exclude={leadHref} />
    </main>
  </>;
}
