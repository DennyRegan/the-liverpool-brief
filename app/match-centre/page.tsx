import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { SiteHeader } from '@/app/components/SiteHeader';
import { getHistoryEntities } from '@/lib/content/entities';
import { getMatchCentre, selectMatches, fixtureTime, getCurrentSeasonReading, type Fixture, type MatchCentre } from '@/lib/content/match-centre';
import { formatLongDate, getArticleExcerpt } from '@/lib/format';
import './match-centre.css';

export const metadata = { title: 'Match Centre | The Liverpool Brief', description: 'Liverpool’s current season: results, fixtures, match briefings and the Premier League table.', alternates: { canonical: '/match-centre' } };
// A scheduled fixture must stop being advertised as upcoming after kick-off,
// even when no editor has recorded its result yet. Scores are never inferred.
export const dynamic = 'force-dynamic';
const dateLabel = (date: string) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00Z`));
const updatedLabel = (date: string) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(new Date(date));

function Sources({ data, ids }: { data: MatchCentre; ids: string[] }) {
  return <ol className="mc-sources">{ids.map(id => { const source = data.sources.find(s => s.id === id)!; return <li key={id}><a href={source.url} target="_blank" rel="noopener noreferrer" aria-label={`${source.label} (opens in a new tab)`}>{source.label} ↗</a></li>; })}</ol>;
}

export default function MatchCentrePage() {
  const data = getMatchCentre();
  const { last, next, ordered, waiting } = selectMatches(data);
  const entities = new Map(getHistoryEntities().map(e => [e.id, e.label]));
  const label = (id: string) => id === 'liverpool' ? 'Liverpool' : entities.get(id)!;
  const competition = (id: string) => id === 'european-cup' ? 'Champions League' : label(id);
  const row = data.table.rows.find(r => r.clubId === 'liverpool')!;
  const reading = getCurrentSeasonReading(data.season);
  const waitingIds = new Set(waiting.map(f => f.id));
  const months = [...new Set(ordered.map(f => f.date?.slice(0, 7) ?? 'tbc'))];
  function teams(f: Fixture) {
    const home = f.side === 'away' ? label(f.oppositionId) : 'Liverpool';
    const away = f.side === 'away' ? 'Liverpool' : label(f.oppositionId);
    return <>{home} <span className="mc-score">{f.score ? `${f.score.home}–${f.score.away}` : 'v'}</span> {away}</>;
  }
  function resultNote(f: Fixture) {
    return f.penalties ? `${f.afterExtraTime ? "After extra time; " : ""}penalties ${f.penalties.home}–${f.penalties.away} (home–away)` : f.afterExtraTime ? 'After extra time' : null;
  }
  function card(f: Fixture | undefined, title: string) {
    return <section className="mc-match" aria-label={title}><p className="eyebrow">{title}</p>{f ? <>
      <p className="mc-competition">{competition(f.competitionId)}{f.round && ` · ${f.round}`}</p>
      <h2>{teams(f)}</h2><p>{f.side === 'neutral' ? 'Neutral venue' : f.side === 'home' ? 'Home' : 'Away'}{f.venue && ` · ${f.venue}`}</p>
      <p>{f.date ? <time dateTime={f.date}>{dateLabel(f.date)}</time> : f.dateNote} · {fixtureTime(f)}</p>
      {resultNote(f) && <p>{resultNote(f)}</p>}
      {f.reportSlug && <Link className="read-link" href={`/archive/${f.reportSlug}`}>Read the match report <span aria-hidden="true">→</span></Link>}
      {title === 'Next Match' && f.preview && <a className="read-link" href="#match-preview">Read the match preview <span aria-hidden="true">→</span></a>}
      {title === 'Next Match' && f.briefing && <div className="mc-briefing"><h3>Match Briefing</h3><p className="mc-note">Updated {updatedLabel(f.briefing.updatedAt)}</p><ul>{f.briefing.points.map(point => <li key={point}>{point}</li>)}</ul><Sources data={data} ids={f.briefing.sourceIds} /></div>}
    </> : <p>{title === 'Last Match' ? 'No completed competitive matches have been recorded yet.' : 'The next fixture is awaiting confirmation.'}</p>}</section>;
  }
  return <><SiteHeader active="match-centre" /><main id="main-content" className="site-width mc-page">
    <header className="mc-intro"><p className="eyebrow">Liverpool · Men’s first team · {data.season.replace('-', '–')}</p><h1>Match Centre</h1><p className="mc-standfirst">The season, match by match.</p><p className="mc-note">Updated {updatedLabel(data.updatedAt)}. Editorial updates, not live scores. All kick-off times are UK time; fixtures may change.</p></header>
    <section className="mc-snapshot" aria-label="Premier League season snapshot"><h2>Premier League</h2><dl>{[['Position', row.position], ['Played', row.played], ['Won', row.won], ['Drawn', row.drawn], ['Lost', row.lost], ['Points', row.points]].map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl><p className="mc-note">Table as of {updatedLabel(data.table.asOf)}</p></section>
    {waiting.length > 0 && <p className="mc-update">Result awaiting an editorial update: {waiting.map(f => `${label(f.oppositionId)} (${dateLabel(f.date!)})`).join('; ')}. See Fixtures &amp; Results below.</p>}
    <div className="mc-match-pair">{card(last, 'Last Match')}{card(next, 'Next Match')}</div>
    {next?.preview && <article id="match-preview" className="mc-preview" aria-labelledby="match-preview-title" tabIndex={-1}>
      <p className="eyebrow">Next Match · Preview</p>
      <h2 id="match-preview-title">{next.preview.title}</h2>
      <p className="mc-note">Updated {updatedLabel(next.preview.updatedAt)}</p>
      <ReactMarkdown skipHtml components={{ h2: ({ children }) => <h3>{children}</h3> }}>{next.preview.body}</ReactMarkdown>
    </article>}
    <nav className="mc-jump" aria-label="Match Centre sections"><a href="#fixtures">Fixtures &amp; Results</a><a href="#league-table">League Table</a>{reading.length > 0 && <a href="#season-reading">This season’s writing</a>}</nav>
    <section className="mc-section" aria-labelledby="fixtures"><h2 id="fixtures">Fixtures &amp; Results</h2><p className="mc-note">All confirmed competitive fixtures. Further cup ties will be added after the draws.</p>
      {months.map(month => <section className="mc-month" key={month}><h3>{month === 'tbc' ? 'Date to be confirmed' : new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'Europe/London' }).format(new Date(`${month}-01T12:00:00Z`))}</h3><ul role="list">{ordered.filter(f => (f.date?.slice(0, 7) ?? 'tbc') === month).map(f => <li key={f.id} className="mc-fixture"><div className="mc-fixture-date">{f.date ? <time dateTime={f.date}>{dateLabel(f.date)}</time> : f.dateNote}<small>{f.status === 'completed' ? 'Full time' : f.status === 'postponed' ? 'Postponed' : f.status === 'cancelled' ? 'Cancelled' : waitingIds.has(f.id) ? 'Awaiting result' : fixtureTime(f)}</small></div><div><h4>{teams(f)}</h4><p>{competition(f.competitionId)} · {f.side === 'home' ? 'Home' : f.side === 'away' ? 'Away' : 'Neutral'}{f.round && ` · ${f.round}`}</p>{resultNote(f) && <p>{resultNote(f)}</p>}{f.date && f.dateNote && <p>{f.dateNote}</p>}{f.reportSlug && <Link href={`/archive/${f.reportSlug}`} className="read-link">Match report <span aria-hidden="true">→</span></Link>}</div></li>)}</ul></section>)}
    </section>
    <section className="mc-section" aria-labelledby="league-table"><h2 id="league-table">League Table</h2><table className="mc-table"><caption>Premier League · {data.season.replace('-', '–')}<br /><span className="mc-note">As of {updatedLabel(data.table.asOf)}</span></caption><thead><tr><th scope="col"><abbr title="Position">Pos</abbr></th><th scope="col">Club</th><th scope="col"><abbr title="Played">P</abbr></th><th scope="col"><abbr title="Goal difference">GD</abbr></th><th scope="col"><abbr title="Points">Pts</abbr></th></tr></thead><tbody>{[...data.table.rows].sort((a,b) => a.position-b.position).map(r => <tr key={r.clubId} className={r.clubId === 'liverpool' ? 'mc-liverpool' : undefined}><td>{r.position}</td><th scope="row">{label(r.clubId)}{r.note && <small>{r.note}</small>}</th><td>{r.played}</td><td>{r.goalsFor-r.goalsAgainst > 0 ? '+' : ''}{r.goalsFor-r.goalsAgainst}</td><td>{r.points}</td></tr>)}</tbody></table><Sources data={data} ids={data.table.sourceIds} /></section>
    {reading.length > 0 && <section className="mc-section" aria-labelledby="season-reading"><h2 id="season-reading">This season’s writing</h2><ul className="mc-reading" role="list">{reading.map(a => <li key={a.href}><p className="eyebrow">{a.category} · {formatLongDate(a.date)}</p><h3><Link href={a.href}>{a.title} <span aria-hidden="true">↗</span></Link></h3><p>{getArticleExcerpt(a)}</p></li>)}</ul></section>}
    <details className="mc-source-notes"><summary>Fixture sources and update notes</summary><p>Fixture information checked {dateLabel(data.updatedAt.slice(0,10))}. Published club fixture changes take precedence over the original schedule. Future dates and times remain subject to change.</p><Sources data={data} ids={data.sources.filter(s => !data.table.sourceIds.includes(s.id)).map(s => s.id)} /></details>
  </main></>;
}
