import Link from "next/link";
import { getWriting } from "@/lib/content/writing";
import { getBrief } from "@/lib/content/briefs";
import { getArchiveFeatures } from "@/lib/content/archive";
import { getSeasons, seasonLabel } from "@/lib/content/seasons";
import { getHistoryEvents, getHistoryWindow, getWeekReading } from "@/lib/content/this-week";
import { selectHomeWriting, selectHomeHistory } from "@/lib/content/homepage";
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
  const seasons = getSeasons();
  const history = selectHomeHistory([
    ...factual.map(article => ({
      href: `/archive/${article.slug}`, title: article.title, summary: article.excerpt,
      kind: article.articleType ?? "other", date: article.date,
      context: article.historicalEventDate ? formatListDate(article.historicalEventDate) : article.historicalPeriod,
    })),
    ...seasons.map(season => ({
      href: `/history/seasons/${season.season}`, title: `Liverpool ${seasonLabel(season.season)}`,
      summary: season.overview[0], kind: "season", date: season.reviewedOn,
      context: `Reviewed ${formatListDate(season.reviewedOn)}`,
    })),
  ]);
  const labels: Record<string, string> = { match: "Match", player: "Player", manager: "Manager", transfer: "Transfer", season: "Season", competition: "Competition", "club-event": "Club history", other: "History" };
  const days = getHistoryWindow(getHistoryEvents());
  const weekReading = getWeekReading(archive, days);
  const candidates = days.flatMap(day => day.events.map(event => ({
    day, event,
    article: archive.find(article => article.slug === event.archiveSlug) ?? weekReading.find(article =>
      article.historicalEventDate === `${event.year}-${String(event.month).padStart(2, "0")}-${String(event.day).padStart(2, "0")}`),
  })));
  const feature = candidates.find(candidate => candidate.article) ?? candidates[0];
  const browse = [
    ...(factual.some(article => article.articleType === "match") ? [{ href: "/history/matches", title: "Matches", text: "The games worth remembering." }] : []),
    ...(factual.some(article => article.articleType === "player") ? [{ href: "/history/players", title: "Players", text: "The people who wore the shirt." }] : []),
    ...(seasons.length ? [{ href: "/history/seasons", title: "Seasons", text: "Liverpool’s story, season by season." }] : []),
    { href: "/history", title: "Managers & eras", text: "Follow the club through each manager’s reign." },
  ];

  return <>
    <SiteHeader active="home" />
    <main id="main-content" className="site-width home-page">
      <section className="home-articles" aria-labelledby="home-articles-heading">
        <div className="home-section-heading"><h2 id="home-articles-heading" className="eyebrow">Articles</h2><Link className="read-link" href="/articles">All articles →</Link></div>
        {lead ? <div className="home-writing">
          <article className="home-lead">
            <p className="article-meta"><time dateTime={lead.date}>{formatListDate(lead.date)}</time><span>By Denny Regan</span></p>
            <h1><Link href={lead.href}>{lead.title}</Link></h1>
            <p className="home-standfirst">{getArticleExcerpt(lead, 300)}</p>
            <Link className="read-link" href={lead.href}>Read article →</Link>
          </article>
          {more.length > 0 && <div className="home-more">{more.map(article => <article key={article.href}>
            <p className="article-meta"><time dateTime={article.date}>{formatListDate(article.date)}</time></p>
            <h3><Link href={article.href}>{article.title}</Link></h3>
            <p className="home-summary">{getArticleExcerpt(article, 150)}</p>
          </article>)}</div>}
        </div> : <h1 className="home-empty-title">Independent Liverpool writing</h1>}
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
          <Link className="read-link" href={item.href}>Read {item.kind === "season" ? "season" : "story"} →</Link>
        </article>)}</div>
      </section>}

      {feature && <section className="home-week" aria-labelledby="home-week-heading">
        <div><h2 id="home-week-heading" className="eyebrow">This Week in History</h2><p className="home-week-date">{feature.day.label}<span>{feature.event.year}</span></p></div>
        <article><h3>{feature.article ? <Link href={`/archive/${feature.article.slug}`}>{feature.event.title}</Link> : feature.event.title}</h3><p className="home-summary">{feature.event.summary}</p><div className="home-links">{feature.article && <Link className="read-link" href={`/archive/${feature.article.slug}`}>Read the full story →</Link>}<Link className="read-link" href="/this-week">See the whole week →</Link></div></article>
      </section>}

      <section className="home-section home-explore" aria-labelledby="home-explore-heading">
        <div className="home-section-heading"><h2 id="home-explore-heading" className="eyebrow">Explore Liverpool history</h2></div>
        <div className="home-browse">{browse.map(item => <Link key={item.href} href={item.href}><h3>{item.title}<span aria-hidden="true">↗</span></h3><p>{item.text}</p></Link>)}</div>
      </section>
    </main>
  </>;
}
