export function skyTable(rows, updated = '12 October, 1:55pm') {
  const cell = (key, value) => `<td data-live-key="${key}"><span>${value}</span></td>`;
  return `<div class="sdc-site-table__last-updated">Last updated: <strong>${updated}</strong></div><table class="sdc-site-table "><tbody>${rows.map(r => `<tr class="sdc-site-table__row">${cell('pos', r.position)}<td data-live-key="team"><a href="/${r.clubId === 'brighton-hove-albion' ? 'brighton-and-hove-albion' : r.clubId}">Club</a></td>${['played', 'won', 'drawn', 'lost', 'goalsFor', 'goalsAgainst', 'gd', 'points'].map((key, i) => cell(['pld', 'w', 'd', 'l', 'f', 'a', 'gd', 'pts'][i], key === 'gd' ? r.goalsFor - r.goalsAgainst : r[key])).join('')}</tr>`).join('')}</tbody></table>`;
}
export function skyResult({ date = 'Sunday 11th October', home = 'Liverpool', away = 'Manchester City', score = { home: 2, away: 1 }, status = 'FT', competition = 'Premier League', ...overrides } = {}) {
  const data = { start: { date }, competition: { name: { full: competition } }, teams: { home: { name: { full: home }, score: { current: score.home } }, away: { name: { full: away }, score: { current: score.away } } }, matchState: 'post', status, isResult: true, isInPlay: false, isAbandoned: false, ...overrides };
  return `<div data-component-name="ui-sport-match-score" data-state="${JSON.stringify(data).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"></div>`;
}
export function addedLiverpoolWin(current) {
  const rows = structuredClone(current.table.rows);
  const liverpool = rows.find(r => r.clubId === 'liverpool'), city = rows.find(r => r.clubId === 'manchester-city');
  Object.assign(liverpool, { played: liverpool.played + 1, won: liverpool.won + 1, goalsFor: liverpool.goalsFor + 2, goalsAgainst: liverpool.goalsAgainst + 1, points: liverpool.points + 3 });
  Object.assign(city, { played: city.played + 1, lost: city.lost + 1, goalsFor: city.goalsFor + 1, goalsAgainst: city.goalsAgainst + 2 });
  rows.sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst) || b.goalsFor - a.goalsFor);
  rows.forEach((r, i) => { r.position = i + 1; });
  return rows;
}
