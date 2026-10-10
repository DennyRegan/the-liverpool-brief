import Link from 'next/link';
import './homepage.css';
import { SiteHeader } from '@/app/components/SiteHeader';
import { getWriting } from '@/lib/content/writing';
import { getBrief } from '@/lib/content/briefs';
import { getFactualHistoryArticles } from '@/lib/content/archive';
import { getMatchCentre, fixtureTime } from '@/lib/content/match-centre';
import { selectHomeLead, selectHomeBrief, selectHomeCoverage } from '@/lib/content/homepage';
import { getHomeLeadOverride } from '@/lib/content/homepage-config';
import { formatLastUpdated, formatListDate, getArticleExcerpt, getExcerpt } from '@/lib/format';

export const metadata = {
  description: 'Independent Liverpool articles by Denny Regan, a concise news Brief, and timely match coverage.',
  alternates: { canonical: '/' },
};
// Selection is evaluated on every request, never frozen into a static build.
export const dynamic = 'force-dynamic';

export default function Home() {
  const now = new Date();
  const lead = selectHomeLead(getWriting(), now, getHomeLeadOverride());
  const brief = selectHomeBrief(getBrief(), now);
  const coverage = selectHomeCoverage(getMatchCentre(), getFactualHistoryArticles(), now);
  return <>
    <SiteHeader active="home" />
    <main id="main-content" className="site-width home-page home-concise">
      <section className="home-editorial-lead" aria-labelledby="home-lead-heading">
        {lead ? <article>
          <p className="article-meta"><span>{lead.category}</span><time dateTime={lead.date}>{formatListDate(lead.date)}</time><span>By Denny Regan</span></p>
          <h1 id="home-lead-heading"><Link href={lead.href}>{lead.title}</Link></h1>
          <p className="home-standfirst">{getExcerpt(getArticleExcerpt(lead), 240)}</p>
          <Link className="read-link" href={lead.href}>Read article →</Link>
        </article> : <><h1 id="home-lead-heading">Independent Liverpool writing</h1><Link className="read-link" href="/articles">Browse articles →</Link></>}
      </section>
      {coverage && <section className="home-coverage" aria-labelledby="home-coverage-heading">
        <p className="eyebrow">{coverage.kind === 'preview' ? 'Match preview' : 'Match report'}</p>
        <h2 id="home-coverage-heading"><Link href={coverage.href}>{coverage.title}</Link></h2>
        <p className="home-coverage-date"><time dateTime={coverage.fixture.kickoff ?? coverage.fixture.date}>{formatListDate(coverage.fixture.date!)}{coverage.kind === 'preview' ? ` · ${fixtureTime(coverage.fixture)}` : ''}</time></p>
        <Link className="read-link" href={coverage.href}>{coverage.kind === 'preview' ? 'Read match preview →' : 'Read match report →'}</Link>
      </section>}
      {brief && <section className="home-brief-compact" aria-labelledby="home-brief-heading">
        <h2 id="home-brief-heading" className="eyebrow">The Brief</h2>
        <p className="home-brief-updated">Updated <time dateTime={brief.lastUpdated}>{formatLastUpdated(brief.lastUpdated)}</time></p>
        <ul>{brief.stories.map(story => <li key={story.headline}>{story.headline}</li>)}</ul>
        <Link className="read-link" href="/brief">Read the Brief →</Link>
      </section>}
      <nav className="home-explore-line" aria-label="Explore more">
        <span>Explore more:</span>{' '}
        <Link href="/articles">Articles</Link>{' · '}
        <Link href="/articles?type=analysis">Analysis</Link>{' · '}
        <Link href="/history">History</Link>{' · '}
        <Link href="/match-centre">Match Centre</Link>
      </nav>
    </main>
  </>;
}
