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
