import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const related = await import('../lib/content/related.ts');
const { opponentName, assertKnownTags } = await import('../lib/content/opponents.ts');
const now = new Date('2026-11-09T12:00:00Z');
const piece = (over) => ({ href: '/x', title: 'X', kind: 'Feature', date: '2026-01-01', players: [], opponents: [], history: true, ...over });

test('seasons run from July, so a date maps to the football season it falls in', () => {
  assert.equal(related.seasonOf('1985-09-21'), '1985-86');
  assert.equal(related.seasonOf('1986-05-10'), '1985-86');
  assert.equal(related.seasonOf('1999-07-01'), '1999-00');
});

test('pieces connect by shared players (5 each, up to 2), history season (5) and a shared opponent (3); nothing shared means no link', () => {
  const current = piece({ href: '/a', players: ['kenny-dalglish', 'john-barnes', 'peter-beardsley'], season: '1987-88', opponents: ['everton'] });
  assert.equal(related.connection(current, piece({ href: '/b', players: ['kenny-dalglish', 'john-barnes', 'peter-beardsley'] })).score, 10);
  assert.equal(related.connection(current, piece({ href: '/c', season: '1987-88' })).score, 5);
  assert.deepEqual(related.connection(current, piece({ href: '/d', opponents: ['everton'] })), { score: 3, reasons: ['v Everton'] });
  assert.equal(related.connection(current, piece({ href: '/e' })), undefined);
  assert.equal(related.connection(current, current), undefined);
  // Season only connects history pieces; current-day articles all share this season.
  assert.equal(related.connection(piece({ history: false, season: '2026-27' }), piece({ href: '/f', history: false, season: '2026-27' })), undefined);
  // Parts of one series never suggest each other: they already have previous and next.
  assert.equal(related.connection(piece({ series: 's', players: ['kenny-dalglish'] }), piece({ href: '/g', series: 's', players: ['kenny-dalglish'] })), undefined);
});

test('real example: the Dalglish Goodison feature links to the other Dalglish pieces and, across sections, to the Rush derby On This Day', () => {
  const items = related.getRelatedPieces('/archive/liverpools-manager-scored-after-21-seconds-at-goodison', now);
  assert.deepEqual(items.map(i => i.href), [
    '/archive/liverpool-sold-their-best-player',
    '/archive/liverpool-7-tottenham-0',
    '/looking-back/rush-scores-four-everton-1982',
  ]);
  assert.deepEqual(items[0].reasons, ['Kenny Dalglish']);
  assert.deepEqual(items[2], { href: '/looking-back/rush-scores-four-everton-1982', title: 'Rush scores four as Liverpool run riot at Goodison', kind: 'On This Day', reasons: ['v Everton'] });
  // And back again from the On This Day piece.
  assert.ok(related.getRelatedPieces('/looking-back/rush-scores-four-everton-1982', now).some(i => i.href === '/archive/liverpools-manager-scored-after-21-seconds-at-goodison'));
});

test('a biography counts its own subject automatically when its slug is a known player', () => {
  const pieces = related.getConnectedPieces(now);
  const trent = pieces.find(p => p.href === '/looking-back/biographies/trent-alexander-arnold');
  assert.deepEqual(trent.players, ['trent-alexander-arnold']);
  const tagged = pieces.find(p => p.href.startsWith('/articles/') && p.players.includes('trent-alexander-arnold'));
  assert.ok(related.getRelatedPieces(tagged.href, now).some(i => i.href === trent.href), 'the Trent article links to his biography');
});

test('only live, published pieces are suggested, and Football Observed is left out', () => {
  const hrefs = related.getConnectedPieces(now).map(p => p.href);
  assert.ok(!hrefs.some(h => h.includes('regan-on-football')));
  const early = related.getConnectedPieces(new Date('2026-11-02T12:00:00Z')).map(p => p.href);
  assert.ok(!early.includes('/looking-back/billy-liddell-equals-elisha-scott-record-1957'), 'next week is not suggested before its Monday');
});

test('unknown opponent or player tags fail the build', () => {
  assert.equal(opponentName('everton'), 'Everton');
  assert.throws(() => assertKnownTags({ opponents: ['not-a-club'] }), /content\/opponents\.json/);
  assert.throws(() => assertKnownTags({ players: ['not-a-player'] }), /content\/players\.json/);
});

test('every piece type shows Continue reading; Football Observed editions do not', () => {
  for (const file of ['app/looking-back/[slug]/page.tsx', 'app/looking-back/biographies/[slug]/page.tsx', 'app/looking-back/series/[series]/[slug]/page.tsx', 'app/archive/[slug]/page.tsx']) {
    assert.match(fs.readFileSync(file, 'utf8'), /related=\{getRelatedPieces\(/, file);
  }
  assert.match(fs.readFileSync('app/archive/[slug]/page.tsx', 'utf8'), /<ContinueReading items=\{getRelatedPieces\(/);
  assert.match(fs.readFileSync('app/articles/[slug]/page.tsx', 'utf8'), /\{!column && <ContinueReading items=\{getRelatedPieces\(/);
});
