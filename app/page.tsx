import Link from "next/link";
import "./homepage.css";
import { getWriting } from "@/lib/content/writing";
import { getBrief } from "@/lib/content/briefs";
import { getArchiveFeatures } from "@/lib/content/archive";
import { getSeasons, seasonLabel } from "@/lib/content/seasons";
import { getHistoryEvents, getHistoryWindow, getLondonToday, getVisibleArticleWeek } from "@/lib/content/this-week";
import { selectHomeWriting, selectHomeHistory, selectSeasonSpotlight } from "@/lib/content/homepage";
import { formatLastUpdated, formatListDate, getArticleExcerpt, getExcerpt } from "@/lib/format";
import { SiteHeader } from "@/app/components/SiteHeader";

export const metadata = {
  description: "Independent Liverpool articles by Denny Regan, a concise news Brief, and the matches, people and seasons from the club’s history.",
  alternates: { canonical: "/" },
};
// Keep the homepage aligned with /this-week across London's Monday rollover.
export const dynamic = "force-dynamic";

export default function Home() {
  const brief = getBrief();
  const story = brief.stories[0];
  const { lead, more } = selectHomeWriting(getWriting());
  const archive = getArchiveFeatures();
  const factual = archive.filter(article => article.editorialMode === "factual");
  const featuredMatch = [...factual].filter(article => article.articleType === "match" && article.historicalEventDate)
    .sort((a, b) => (b.historicalEventDate ?? "").localeCompare(a.historicalEventDate ?? ""))[0];
  const seasons = getSeasons();
  const history = selectHomeHistory([
    ...factual.filter(article => article.articleType !== "season").map(article => ({
      href: `/archive/${article.slug}`, title: article.title, summary: article.excerpt,
      kind: article.articleType ?? "other", date: article.date,
      context: article.historicalEventDate ? formatListDate(article.historicalEventDate) : article.historicalPeriod,
    })),
  ]);
  const labels: Record<string, string> = { match: "Match", player: "Player", manager: "Manager", transfer: "Transfer", season: "Season", competition: "Competition", "club-event": "Club history", other: "History" };
  const now = new Date();
  const days = getHistoryWindow(getHistoryEvents(), now);
  const spotlight = selectSeasonSpotlight(seasons, days[0].iso);
  const candidates = getVisibleArticleWeek(factual, days, now).filter(day => day.iso === getLondonToday(now)).flatMap(day => day.articles.map(article => ({
    day, article,
    event: { year: article.historicalEventDate?.slice(0, 4) ?? article.historicalPeriod, title: article.title, summary: article.excerpt },
  })));
  const feature = candidates[0];
  const browse = [
    ...(factual.some(article => article.articleType === "match") ? [{ href: "/history/matches", title: "Matches", text: "The games worth remembering." }] : []),
    ...(factual.some(article => article.articleType === "player") ? [{ href: "/history/players", title: "Players", text: "The people who wore the shirt." }] : []),
    ...(seasons.length ? [{ href: "/history/seasons", title: "Seasons", text: "Liverpool’s story, season by season." }] : []),
    { href: "/history", title: "Managers & eras", text: "Follow the club through each manager’s reign." },
  ];

  return <>
    <SiteHeader active="home" />
    <main id="main-content" className="site-width home-page home-editorial">
      <section className="home-articles" aria-labelledby="home-articles-heading">
        <div className="home-section-heading"><h2 id="home-articles-heading" className="eyebrow">Featured writing</h2><Link className="read-link" href="/articles">All articles →</Link></div>
        {lead ? <div className="home-writing">
          <article className="home-lead">
            <p className="article-meta"><time dateTime={lead.date}>{formatListDate(lead.date)}</time><span>{lead.category}</span><span>By Denny Regan</span></p>
            <h1><Link href={lead.href}>{lead.title}</Link></h1>
            <p className="home-standfirst">{getArticleExcerpt(lead, 300)}</p>
            <Link className="read-link" href={lead.href}>Read article →</Link>
          </article>
          {more.length > 0 && <div className="home-more"><p className="home-aside-label">More to read</p>{more.map(article => <article key={article.href}>
            <p className="article-meta"><time dateTime={article.date}>{formatListDate(article.date)}</time><span>{article.category}</span></p>
            <h3><Link href={article.href}>{article.title}</Link></h3>
            <p className="home-summary">{getArticleExcerpt(article, 150)}</p>
          </article>)}</div>}
        </div> : <h1 className="home-empty-title">Independent Liverpool writing</h1>}
      </section>

      {featuredMatch && <section className="home-match-feature" aria-labelledby="home-match-feature-heading">
        <div className="home-match-feature-copy">
          <p className="home-match-feature-label">From the match archive</p>
          <h2 id="home-match-feature-heading"><Link href={`/archive/${featuredMatch.slug}`}>{featuredMatch.title}</Link></h2>
          <p className="home-match-feature-summary">{getExcerpt(featuredMatch.excerpt, 210)}</p>
          <Link className="home-match-feature-link" href={`/archive/${featuredMatch.slug}`}>Read the match report <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="home-match-feature-index">
          <p className="home-match-feature-label">Explore the collection</p>
          <p className="home-match-feature-date">{formatListDate(featuredMatch.historicalEventDate!)}</p>
          <nav aria-label="Explore Liverpool history"><Link href="/history/matches">Match reports <span aria-hidden="true">→</span></Link><Link href="/history/seasons">Season by season <span aria-hidden="true">→</span></Link><Link href="/history/players">People <span aria-hidden="true">→</span></Link></nav>
        </div>
      </section>}

      <section className="home-section home-explore" aria-labelledby="home-explore-heading">
        <div className="home-section-heading"><h2 id="home-explore-heading" className="eyebrow">Explore Liverpool history</h2></div>
        <div className="home-browse">{browse.map(item => <Link key={item.href} href={item.href}><h3>{item.title}<span aria-hidden="true">↗</span></h3><p>{item.text}</p></Link>)}</div>
      </section>

      <section className="home-brief" aria-labelledby="home-brief-heading">
        <div className="home-brief-label"><h2 id="home-brief-heading" className="eyebrow">The Brief</h2><p>Last updated<br /><time dateTime={brief.lastUpdated}>{formatLastUpdated(brief.lastUpdated)}</time></p></div>
        <div>{story ? <article><h3><Link href="/brief">{story.headline}</Link></h3><p className="home-summary">{getExcerpt(story.summary, 220)}</p></article> : <p className="home-summary">The next briefing will appear here when it is published.</p>}<Link className="read-link" href="/brief">Read the Brief →</Link></div>
      </section>

      {history.length > 0 && <section className="home-section" aria-labelledby="home-history-heading">
        <div className="home-section-heading"><h2 id="home-history-heading" className="eyebrow">Latest in History</h2><Link className="read-link" href="/history">Explore history →</Link></div>
        <div className="home-history-grid">{history.map(item => <article key={item.href}>
          <p className="article-meta"><span>{labels[item.kind]}</span><span>{item.context}</span></p>
          <h3><Link href={item.href}>{item.title}</Link></h3>
          <p className="home-summary">{getExcerpt(item.summary, 180)}</p>
          <Link className="read-link" href={item.href}>Read story →</Link>
        </article>)}</div>
      </section>}

      {(feature || spotlight) && <div className="home-weekly-features">
      {feature && <section className="home-week" aria-labelledby="home-week-heading">
        <div><h2 id="home-week-heading" className="eyebrow">This Week in History</h2><p className="home-week-date">{feature.day.label}<span>{feature.event.year}</span></p></div>
        <article><h3>{feature.article ? <Link href={`/archive/${feature.article.slug}`}>{feature.event.title}</Link> : feature.event.title}</h3><p className="home-summary">{feature.event.summary}</p><div className="home-links">{feature.article && <Link className="read-link" href={`/archive/${feature.article.slug}`}>Read the full story →</Link>}<Link className="read-link" href="/this-week">See the whole week →</Link></div></article>
      </section>}

      {spotlight && <section className="home-week home-season" aria-labelledby="home-season-heading">
        <div><h2 id="home-season-heading" className="eyebrow">Season spotlight</h2></div>
        <article><h3><Link href={`/history/seasons/${spotlight.season}`}>Liverpool {seasonLabel(spotlight.season)}</Link></h3><p className="home-summary">{spotlight.overview[0]}</p><div className="home-links"><Link className="read-link" href={`/history/seasons/${spotlight.season}`}>Explore this season →</Link></div></article>
      </section>}
      </div>}


    </main>
  </>;
}
