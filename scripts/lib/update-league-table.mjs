import fs from 'node:fs';
import path from 'node:path';
import { getMatchCentre, MatchCentreSchema } from '../../lib/content/match-centre.ts';
import { prepareLeagueTable, readLeagueTable } from './prepare-league-table.mjs';

export const tableUrl = 'https://www.skysports.com/premier-league-table';
const resultsBase = 'https://www.skysports.com/liverpool-scores-fixtures/';
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ukDay = date => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
const decode = text => text.replace(/&quot;/g, '"').replace(/&#(?:x([0-9a-f]+)|(\d+));/gi, (_, hex, dec) => String.fromCodePoint(parseInt(hex ?? dec, hex ? 16 : 10))).replace(/&amp;/g, '&');
const teamId = name => {
  if (typeof name !== 'string') throw new Error('Sky result team name missing');
  const slug = name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return ({ 'brighton-and-hove-albion': 'brighton-hove-albion', 'afc-bournemouth': 'bournemouth' })[slug] ?? slug;
};

/** Only explicitly finished Premier League scores, never a live score or elapsed kick-off. */
export function readLiverpoolResults(html, month) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Invalid result month');
  const entries = [...html.matchAll(/<div\b[^>]*data-component-name="ui-sport-match-score"[^>]*>/g)];
  if (!entries.length) throw new Error('Sky result markup is missing or changed');
  const results = [];
  for (const [tag] of entries) {
    const state = tag.match(/data-state="([^"]+)"/)?.[1];
    if (!state) throw new Error('Sky result state is missing');
    const data = JSON.parse(decode(state));
    if (data.competition?.name?.full !== 'Premier League') continue;
    if (data.matchState !== 'post' || data.isResult !== true || data.status !== 'FT' || data.isInPlay || data.isAbandoned || data.isSuspended || data.isCancelled || data.isPostponed) continue;
    const dateParts = data.start?.date?.match(/^\w+ (\d{1,2})(?:st|nd|rd|th) (\w+)$/);
    if (!dateParts || months[Number(month.slice(5)) - 1] !== dateParts[2]) throw new Error('Sky result date does not match requested month');
    const date = `${month}-${dateParts[1].padStart(2, '0')}`;
    if (new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error('Invalid Sky result date');
    const home = teamId(data.teams?.home?.name?.full), away = teamId(data.teams?.away?.name?.full);
    if ((home === 'liverpool') === (away === 'liverpool')) throw new Error('Sky result must contain Liverpool exactly once');
    const score = { home: data.teams.home.score?.current, away: data.teams.away.score?.current };
    if (Object.values(score).some(n => !Number.isSafeInteger(n) || n < 0 || n > 30)) throw new Error('Invalid Sky full-time score');
    results.push({ date, side: home === 'liverpool' ? 'home' : 'away', oppositionId: home === 'liverpool' ? away : home, score });
  }
  const keys = results.map(r => `${r.date}:${r.side}:${r.oppositionId}`);
  if (new Set(keys).size !== keys.length) throw new Error('Duplicate Sky results');
  return results;
}

export function validateWholeTable(rows) {
  const sum = key => rows.reduce((total, row) => total + row[key], 0);
  if (rows.some(r => r.played > 38 || r.goalsFor > 300 || r.goalsAgainst > 300 || !Object.values(r).filter(v => typeof v === 'number').every(Number.isSafeInteger))) throw new Error('Implausible Premier League values');
  if (sum('won') !== sum('lost') || sum('drawn') % 2 || sum('played') % 2 || sum('goalsFor') !== sum('goalsAgainst')) throw new Error('Whole-league totals do not reconcile; source may be mid-update');
  const ordered = [...rows].sort((a, b) => a.position - b.position);
  for (let i = 1; i < ordered.length; i++) {
    const a = ordered[i - 1], b = ordered[i];
    if (a.points < b.points || a.points === b.points && (a.goalsFor - a.goalsAgainst < b.goalsFor - b.goalsAgainst || a.goalsFor - a.goalsAgainst === b.goalsFor - b.goalsAgainst && a.goalsFor < b.goalsFor)) throw new Error('Sky positions disagree with points, goal difference or goals scored');
  }
}

export function prepareAutomaticTable(tableHtml, resultPages, current, now = new Date()) {
  const snapshot = readLeagueTable(tableHtml, current, now);
  validateWholeTable(snapshot.rows);
  const candidate = structuredClone(current), updatedFixtures = [];
  for (const { month, html } of resultPages) {
    const sourceId = `sky-results-${month}`;
    let used = false;
    for (const result of readLiverpoolResults(html, month)) {
      if (result.date > snapshot.asOf.slice(0, 10)) continue;
      const matches = candidate.fixtures.filter(f => f.competitionId === 'premier-league' && f.date === result.date && f.side === result.side && f.oppositionId === result.oppositionId);
      if (matches.length !== 1) throw new Error(`Sky result has no unique existing fixture: ${result.date} ${result.oppositionId}; review the schedule`);
      const fixture = matches[0];
      if (fixture.kickoff && Date.parse(fixture.kickoff) > Date.parse(snapshot.asOf)) throw new Error('Result is newer than table snapshot');
      if (fixture.status === 'completed') {
        if (fixture.score.home !== result.score.home || fixture.score.away !== result.score.away) throw new Error(`Sky conflicts with recorded score: ${fixture.id}`);
      } else {
        if (fixture.status !== 'scheduled') throw new Error(`Review postponed/cancelled fixture: ${fixture.id}`);
        fixture.status = 'completed'; fixture.score = result.score;
        fixture.sourceIds = [...new Set([...fixture.sourceIds, sourceId])];
        updatedFixtures.push(fixture.id); used = true;
      }
    }
    if (used) {
      const source = { id: sourceId, label: `Liverpool league results — Sky Sports, ${month}`, url: `${resultsBase}${month}-01`, checkedOn: ukDay(now) };
      const index = candidate.sources.findIndex(s => s.id === sourceId);
      if (index === -1) candidate.sources.push(source); else candidate.sources[index] = source;
    }
  }
  const { proposal, changes } = prepareLeagueTable(tableHtml, candidate, now);
  MatchCentreSchema.parse(proposal);
  return { proposal, changes, updatedFixtures };
}

async function fetchHtml(url, fetcher) {
  const response = await fetcher(url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'TheLiverpoolBrief/1.0 (verified league table update)', 'Cache-Control': 'no-cache' } });
  if (!response.ok) throw new Error(`Sky returned HTTP ${response.status}: ${url}`);
  const html = await response.text();
  if (html.length > 5_000_000 || html.length < 100) throw new Error('Sky response size is invalid');
  return html;
}

/** No write until every source and the existing full register validator pass. */
export async function updateLeagueTable(root = process.cwd(), { fetcher = fetch, now = new Date(), write = false } = {}) {
  const current = getMatchCentre(root);
  const filename = path.join(root, 'content/match-centre/liverpool', `${current.season}.json`);
  const original = fs.readFileSync(filename, 'utf8');
  const tableHtml = await fetchHtml(tableUrl, fetcher);
  const snapshot = readLeagueTable(tableHtml, current, now);
  validateWholeTable(snapshot.rows);
  const previous = current.table.rows.find(r => r.clubId === 'liverpool');
  const next = snapshot.rows.find(r => r.clubId === 'liverpool');
  const resultPages = [];
  if (next.played > previous.played) {
    const pendingMonths = [...new Set(current.fixtures.filter(f => f.competitionId === 'premier-league' && f.status !== 'completed' && f.date && f.date <= snapshot.asOf.slice(0, 10)).map(f => f.date.slice(0, 7)))];
    for (const month of pendingMonths) resultPages.push({ month, html: await fetchHtml(`${resultsBase}${month}-01`, fetcher) });
  }
  const result = prepareAutomaticTable(tableHtml, resultPages, current, now);
  // No timestamp-only commits or source relabelling when standings have not changed.
  if (!result.changes.length) return { changed: false, ...result };
  if (write) {
    if (fs.readFileSync(filename, 'utf8') !== original) throw new Error('Register changed during fetch; retry against latest content');
    const temporary = `${filename}.table-update-${process.pid}.tmp`;
    try {
      fs.writeFileSync(temporary, JSON.stringify(result.proposal, null, 2) + '\n', { flag: 'wx' });
      // Run the unchanged loader against an isolated candidate, including report/entity checks.
      const validationRoot = fs.mkdtempSync(path.join(root, '.table-check-'));
      try {
        fs.cpSync(path.join(root, 'content'), path.join(validationRoot, 'content'), { recursive: true });
        fs.copyFileSync(temporary, path.join(validationRoot, path.relative(root, filename)));
        getMatchCentre(validationRoot);
      } finally { fs.rmSync(validationRoot, { recursive: true, force: true }); }
      if (fs.readFileSync(filename, 'utf8') !== original) throw new Error('Register changed during validation; retry');
      fs.renameSync(temporary, filename);
    } finally { fs.rmSync(temporary, { force: true }); }
  }
  return { changed: true, ...result };
}
