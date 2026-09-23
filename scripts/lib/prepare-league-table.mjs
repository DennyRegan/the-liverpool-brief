import { MatchCentreSchema } from '../../lib/content/match-centre.ts';

const monthNumbers = new Map(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => [month, index]));
const skyClubAliases = { 'brighton-and-hove-albion': 'brighton-hove-albion' };
const requiredCells = ['pos', 'team', 'pld', 'w', 'd', 'l', 'f', 'a', 'gd', 'pts'];

function ukDay(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function sourceTimestamp(html, season, now) {
  const raw = html.match(/Last updated:\s*<strong>\s*(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December),\s*(\d{1,2}):(\d{2})(am|pm)\s*<\/strong>/i);
  if (!raw) throw new Error('Sky update time is missing or has changed format');
  const [, dayText, monthText, hourText, minuteText, meridianText] = raw;
  const month = monthNumbers.get(monthText[0].toUpperCase() + monthText.slice(1).toLowerCase());
  const day = Number(dayText), hour = Number(hourText) % 12 + (meridianText.toLowerCase() === 'pm' ? 12 : 0), minute = Number(minuteText);
  if (day < 1 || day > 31 || Number(hourText) < 1 || Number(hourText) > 12 || minute > 59) throw new Error('Invalid Sky update time');
  const startYear = Number(season.slice(0, 4));
  const possible = [startYear, startYear + 1].flatMap(year => {
    const noon = new Date(Date.UTC(year, month, day, 12));
    if (noon.getUTCMonth() !== month || noon.getUTCDate() !== day) return [];
    const zone = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', timeZoneName: 'shortOffset' }).formatToParts(noon).find(part => part.type === 'timeZoneName')?.value ?? '';
    const zoneMatch = zone.match(/^GMT(?:\+(\d))?$/);
    if (!zoneMatch) throw new Error('Cannot determine the UK offset for the Sky update time');
    const offset = Number(zoneMatch[1] ?? 0);
    const instant = new Date(Date.UTC(year, month, day, hour - offset, minute));
    const local = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return ukDay(instant) === local && local >= `${startYear}-07-01` && local <= `${startYear + 1}-06-30` && instant <= now ? [instant] : [];
  });
  if (possible.length !== 1) throw new Error('Sky update time is outside the current season or in the future');
  return possible[0].toISOString();
}

function numberCell(html, key) {
  const cell = html.match(new RegExp(`<td\\b[^>]*data-live-key="${key}"[^>]*>([\\s\\S]*?)<\\/td>`))?.[1];
  const text = cell?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  if (!text || !/^\d+$/.test(text)) throw new Error(`Sky ${key} column is missing or invalid`);
  return Number(text);
}

function skyRows(html) {
  const heading = html.indexOf('sdc-site-table__last-updated');
  if (heading < 0) throw new Error('Sky league table was not found');
  const start = html.indexOf('<table class="sdc-site-table ', heading);
  const end = html.indexOf('</table>', start);
  if (start < 0 || end < 0) throw new Error('Sky league table markup has changed');
  const table = html.slice(start, end);
  const body = table.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1];
  if (!body) throw new Error('Sky league table has no rows');
  const rows = [...body.matchAll(/<tr\b[^>]*class="sdc-site-table__row"[^>]*>([\s\S]*?)<\/tr>/g)].map(([, markup]) => {
    const keys = [...markup.matchAll(/<td\b[^>]*data-live-key="([^"]+)"/g)].map(match => match[1]);
    if (requiredCells.some(key => !keys.includes(key))) throw new Error('Sky league table columns have changed');
    const club = markup.match(/<td\b[^>]*data-live-key="team"[^>]*>[\s\S]*?<a href="\/([^"]+)"[^>]*>/)?.[1];
    if (!club) throw new Error('Sky club identifier is missing');
    const clubId = skyClubAliases[club] ?? club;
    const [position, played, won, drawn, lost, goalsFor, goalsAgainst, goalDifference, points] =
      ['pos', 'pld', 'w', 'd', 'l', 'f', 'a', 'gd', 'pts'].map(key => {
        if (key !== 'gd') return numberCell(markup, key);
        const cell = markup.match(/<td\b[^>]*data-live-key="gd"[^>]*>([\s\S]*?)<\/td>/)?.[1];
        const text = cell?.replace(/<[^>]*>/g, '').trim();
        if (!text || !/^[+-]?\d+$/.test(text)) throw new Error('Sky goal difference is missing or invalid');
        return Number(text);
      });
    if (goalsFor - goalsAgainst !== goalDifference) throw new Error(`Sky goal difference does not reconcile for ${clubId}`);
    if (points !== won * 3 + drawn) throw new Error(`Sky points adjustment for ${clubId} needs human review`);
    return { position, clubId, played, won, drawn, lost, goalsFor, goalsAgainst, points };
  });
  if (rows.length !== 20) throw new Error(`Expected 20 Premier League clubs; Sky returned ${rows.length}`);
  return rows;
}

export function prepareLeagueTable(html, current, now = new Date()) {
  const asOf = sourceTimestamp(html, current.season, now);
  if (Date.parse(asOf) < Date.parse(current.table.asOf)) throw new Error('Sky snapshot is older than the published table');
  const rows = skyRows(html);
  const existing = new Set(current.table.rows.map(row => row.clubId));
  if (rows.some(row => !existing.has(row.clubId)) || new Set(rows.map(row => row.clubId)).size !== existing.size) throw new Error('Sky clubs differ from the current season; review club mapping');
  for (const row of rows) {
    const previous = current.table.rows.find(item => item.clubId === row.clubId);
    if (row.played < previous.played) throw new Error(`Sky has fewer matches than the published table for ${row.clubId}`);
  }
  const liverpool = rows.find(row => row.clubId === 'liverpool');
  const recorded = current.fixtures.filter(f => f.competitionId === 'premier-league' && f.status === 'completed' && f.date <= asOf.slice(0, 10));
  const totals = { played: recorded.length, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0 };
  for (const fixture of recorded) {
    const own = fixture.side === 'away' ? fixture.score.away : fixture.score.home;
    const against = fixture.side === 'away' ? fixture.score.home : fixture.score.away;
    totals.goalsFor += own; totals.goalsAgainst += against;
    totals[own > against ? 'won' : own === against ? 'drawn' : 'lost']++;
  }
  for (const [key, value] of Object.entries(totals)) if (liverpool[key] !== value) throw new Error(`Update Liverpool's recorded league results before preparing the table: ${key} differs`);
  const proposal = structuredClone(current);
  proposal.updatedAt = now.toISOString();
  proposal.table = { ...proposal.table, asOf, rows };
  const source = proposal.sources.find(item => item.id === 'table');
  if (!source || source.url !== 'https://www.skysports.com/premier-league-table') throw new Error('Expected Sky table source is missing');
  source.checkedOn = ukDay(now);
  MatchCentreSchema.parse(proposal);
  const changes = rows.filter(row => {
    const old = current.table.rows.find(item => item.clubId === row.clubId);
    return Object.entries(row).some(([key, value]) => old[key] !== value);
  });
  return { proposal, changes };
}
