import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { SiteHeader } from '@/app/components/SiteHeader';
import { socialMetadata } from '@/lib/social-metadata';
import { getHistoryEntities } from '@/lib/content/entities';
import { getMatchCentre, selectMatches, getCurrentSeasonReading, type Fixture, type MatchCentre } from '@/lib/content/match-centre';
import { formatLongDate, formatLastUpdated, getArticleExcerpt } from '@/lib/format';
import './match-centre.css';

// Keep the established address and homepage #match-preview links permanent.
export const metadata = socialMetadata('Match writing | The Liverpool Brief', 'Liverpool match previews, briefings, reports, Opinion and Analysis.', '/match-centre');
export const dynamic = 'force-dynamic';

function MatchWriting({ fixture, data, headingId, opposition }: {
  fixture: Fixture; data: MatchCentre; headingId: string; opposition: string;
}) {
  const sourceIds = new Set([...(fixture.preview?.sourceIds ?? []), ...(fixture.briefing?.sourceIds ?? [])]);
  return <article id={headingId} className="mc-preview" aria-labelledby={`${headingId}-title`} tabIndex={-1}>
    <p className="eyebrow">{fixture.preview ? 'Match preview' : 'Match briefing'}{fixture.date && <> · <time dateTime={fixture.date}>{formatLongDate(fixture.date)}</time></>}</p>
    <h2 id={`${headingId}-title`}>{fixture.preview?.title ?? `Liverpool v ${opposition}: match briefing`}</h2>
    {fixture.preview && <>
      <p className="mc-note">Updated {formatLastUpdated(fixture.preview.updatedAt)}</p>
      <ReactMarkdown skipHtml components={{ h1: ({ children }) => <h3>{children}</h3>, h2: ({ children }) => <h3>{children}</h3> }}>{fixture.preview.body}</ReactMarkdown>
    </>}
    {fixture.briefing && <section className="mc-briefing" aria-label="Match briefing">
      {fixture.preview && <h3>Match briefing</h3>}
      <p className="mc-note">Updated {formatLastUpdated(fixture.briefing.updatedAt)}</p>
      <ul>{fixture.briefing.points.map(point => <li key={point}>{point}</li>)}</ul>
    </section>}
    <details className="mc-source-notes"><summary>Sources for this writing</summary>
      <ol className="mc-sources">{data.sources.filter(source => sourceIds.has(source.id)).map(source => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`${source.label} (opens in a new tab)`}>{source.label} ↗</a></li>)}</ol>
    </details>
  </article>;
}

export default function MatchWritingPage() {
  const data = getMatchCentre();
  const { next } = selectMatches(data);
  const names = new Map(getHistoryEntities().map(entity => [entity.id, entity.label]));
  // An upcoming preview keeps the homepage anchor. Older writing remains readable
  // after kick-off instead of disappearing with the fixture's Next Match status.
  const writing = data.fixtures.filter(fixture => fixture.preview || fixture.briefing).sort((a, b) =>
    Number(b.id === next?.id) - Number(a.id === next?.id) ||
    (b.date ?? '').localeCompare(a.date ?? '') || a.id.localeCompare(b.id));
  const reading = getCurrentSeasonReading(data.season);
  return <><SiteHeader /><main id="main-content" className="site-width mc-page">
    <header className="mc-intro"><p className="eyebrow">Liverpool · {data.season.replace('-', '–')}</p><h1>Match writing</h1><p className="mc-standfirst">Previews, briefings and reading from this season.</p></header>
    {writing.length > 0 && <nav className="mc-jump" aria-label="Match writing sections"><a href="#match-preview">Previews and briefings</a>{reading.length > 0 && <a href="#season-reading">This season’s writing</a>}</nav>}
    {writing.map((fixture, index) => <MatchWriting key={fixture.id} fixture={fixture} data={data} headingId={index === 0 ? 'match-preview' : `writing-${fixture.id}`} opposition={names.get(fixture.oppositionId)!} />)}
    {writing.length === 0 && <p className="mc-note">Published match previews and briefings will appear here. Browse <Link href="/articles">Articles</Link> and <Link href="/history/matches">historical match reports</Link> for more reading.</p>}
    {reading.length > 0 && <section className="mc-section" aria-labelledby="season-reading"><h2 id="season-reading">This season’s writing</h2><ul className="mc-reading" role="list">{reading.map(article => <li key={article.href}><p className="eyebrow">{article.category} · {formatLongDate(article.date)}</p><h3><Link href={article.href}>{article.title} <span aria-hidden="true">↗</span></Link></h3><p>{getArticleExcerpt(article)}</p></li>)}</ul></section>}
  </main></>;
}
