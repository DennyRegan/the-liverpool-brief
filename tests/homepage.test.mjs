import test from 'node:test';
import assert from 'node:assert/strict';
import { selectHomeWriting, selectHomeHistory } from '../lib/content/homepage.ts';
const item = (kind, date, href) => ({ kind, date, href });

test('Articles selects across the complete writing collection without a category split', () => {
  const writing = [item('Opinion', '2026-09-12', '/opinion'), item('Archive', '2026-09-13', '/archive')];
  const before = [...writing];
  assert.deepEqual(selectHomeWriting(writing), { lead: writing[1], more: [writing[0]] });
  assert.deepEqual(writing, before);
  assert.deepEqual(selectHomeWriting([]), { lead: undefined, more: [] });
});

test('a season batch cannot fill every History place when other types exist', () => {
  const seasons = Array.from({ length: 10 }, (_, i) => item('season', '2026-09-14', `/season/${i}`));
  const match = item('match', '2026-09-13', '/match');
  const player = item('player', '2026-09-12', '/player');
  assert.deepEqual(selectHomeHistory([...seasons, match, player]), [seasons[0], match, player]);
});

test('History fills spare places and breaks same-date ties consistently', () => {
  const a = item('match', '2026-09-14', '/a');
  const b = item('match', '2026-09-14', '/b');
  const c = item('season', '2026-09-13', '/c');
  assert.deepEqual(selectHomeHistory([b, c, a]), [a, b, c]);
  assert.deepEqual(selectHomeHistory([]), []);
  assert.deepEqual(selectHomeHistory([a]), [a]);
});

import { selectSeasonSpotlight } from '../lib/content/homepage.ts';
import { getHistoryWindow } from '../lib/content/this-week.ts';
const seasons = [{ season: '1961-62' }, { season: '1959-60' }, { season: '1960-61' }];
const spotlightAt = iso => selectSeasonSpotlight(seasons, getHistoryWindow([], new Date(iso))[0].iso);

test('season spotlight stays fixed all week and advances at London Monday midnight', () => {
  const monday = spotlightAt('2026-09-13T23:00:00Z');
  assert.equal(monday.season, '1959-60');
  assert.equal(spotlightAt('2026-09-20T22:59:59Z'), monday);
  assert.equal(spotlightAt('2026-09-20T23:00:00Z').season, '1960-61');
});

test('season rotation visits every published season before repeating without mutating input', () => {
  const before = [...seasons];
  assert.equal(selectSeasonSpotlight(seasons, '2026-09-28').season, '1961-62');
  assert.equal(selectSeasonSpotlight(seasons, '2026-10-05').season, '1959-60');
  assert.deepEqual(seasons, before);
  assert.equal(selectSeasonSpotlight([], '2026-09-14'), undefined);
  assert.equal(selectSeasonSpotlight([seasons[0]], '2026-09-21'), seasons[0]);
});

test('spotlight respects the 25-hour autumn Sunday and year boundaries', () => {
  assert.equal(spotlightAt('2026-10-25T23:59:59Z'), spotlightAt('2026-10-19T00:00:00Z'));
  assert.notEqual(spotlightAt('2026-10-26T00:00:00Z'), spotlightAt('2026-10-25T23:59:59Z'));
  assert.equal(spotlightAt('2027-01-03T23:59:59Z'), spotlightAt('2026-12-28T00:00:00Z'));
  assert.notEqual(spotlightAt('2027-01-04T00:00:00Z'), spotlightAt('2027-01-03T23:59:59Z'));
});
