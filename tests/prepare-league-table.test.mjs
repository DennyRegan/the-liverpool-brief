import test from 'node:test';
import assert from 'node:assert/strict';
import { getMatchCentre } from '../lib/content/match-centre.ts';
import { prepareLeagueTable } from '../scripts/lib/prepare-league-table.mjs';

const current = getMatchCentre();
const checkedAt = new Date('2026-09-23T12:00:00Z');
const cell = (key, value) => `<td data-live-key="${key}"><span>${value}</span></td>`;
function skyHtml(rows = current.table.rows, updated = '21 September, 1:55pm') {
  return `<div class="sdc-site-table__last-updated">Last updated: <strong>${updated}</strong></div>
    <table class="sdc-site-table "><tbody>${rows.map(row => `<tr class="sdc-site-table__row">
      ${cell('pos', row.position)}
      <td data-live-key="team"><a href="/${row.clubId === 'brighton-hove-albion' ? 'brighton-and-hove-albion' : row.clubId}" aria-label="Club">Club</a></td>
      ${cell('pld', row.played)}${cell('w', row.won)}${cell('d', row.drawn)}${cell('l', row.lost)}
      ${cell('f', row.goalsFor)}${cell('a', row.goalsAgainst)}
      ${cell('gd', row.goalsFor - row.goalsAgainst)}
      ${cell('pts', row.points)}
    </tr>`).join('')}</tbody></table>`;
}

test('unchanged source does not invent an update; published Match Centre remains untouched', () => {
  const before = JSON.stringify(current);
  const { proposal, changes } = prepareLeagueTable(skyHtml(), current, checkedAt);
  assert.equal(changes.length, 0);
  assert.equal(proposal.table.asOf, '2026-09-21T12:55:00.000Z');
  assert.equal(JSON.stringify(current), before);
});

test('one newer result produces a complete but unpublished candidate', () => {
  const rows = structuredClone(current.table.rows);
  const arsenal = rows.find(row => row.clubId === 'arsenal');
  Object.assign(arsenal, { played: 6, drawn: 1, points: 13 });
  const { proposal, changes } = prepareLeagueTable(skyHtml(rows, '24 September, 1:55pm'), current, new Date('2026-09-25T12:00:00Z'));
  assert.deepEqual(changes.map(row => row.clubId), ['arsenal']);
  assert.equal(proposal.table.rows.find(row => row.clubId === 'arsenal').points, 13);
  assert.equal(current.table.rows.find(row => row.clubId === 'arsenal').points, 12);
  assert.equal(proposal.sources.find(source => source.id === 'table').checkedOn, '2026-09-25');
});

test('a stale snapshot, missing club, wrong columns, bad arithmetic and unrecorded Liverpool result all fail closed', () => {
  assert.throws(() => prepareLeagueTable(skyHtml(current.table.rows, '20 September, 1:55pm'), current, checkedAt), /older/);
  assert.throws(() => prepareLeagueTable(skyHtml(current.table.rows.slice(1)), current, checkedAt), /20 Premier League/);
  assert.throws(() => prepareLeagueTable(skyHtml().replace('data-live-key="pld"', 'data-live-key="unknown"'), current, checkedAt), /columns have changed/);
  assert.throws(() => prepareLeagueTable(skyHtml().replace('data-live-key="gd"><span>8', 'data-live-key="gd"><span>7'), current, checkedAt), /goal difference/);
  const rows = structuredClone(current.table.rows);
  rows.find(row => row.clubId === 'liverpool').played = 6;
  rows.find(row => row.clubId === 'liverpool').drawn = 4;
  rows.find(row => row.clubId === 'liverpool').points = 10;
  assert.throws(() => prepareLeagueTable(skyHtml(rows), current, checkedAt), /recorded league results/);
});
