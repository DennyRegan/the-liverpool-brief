import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { TimelineEntrySchema } = await import('../lib/content/types.ts');
const { getTimeline, getVisibleTimeline } = await import('../lib/content/timeline.ts');

const words = n => Array.from({ length: n }, (_, i) => `word${i}`).join(' ') + '.';
const main = {
  id: 'one', type: 'moment', priority: 'main', season: '2015-16', dateStart: '2015-10-08', precision: 'day', dateLabel: '8 October 2015',
  title: 'A short title', summary: words(30), links: [{ type: 'series-part', seriesSlug: 'klopps-liverpool', partNumber: 1 }],
};
const extended = { id: 'two', type: 'match', priority: 'extended', season: '2015-16', dateStart: '2015-11-01', precision: 'day', dateLabel: '1 November 2015', title: 'Another', summary: 'One short sentence.' };

function withFile(entries, fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'timeline-'));
  fs.mkdirSync(path.join(root, 'content/timeline'), { recursive: true });
  fs.writeFileSync(path.join(root, 'content/timeline/klopp.json'), JSON.stringify(entries));
  // Link targets come from the real content, so point the temporary root at it.
  for (const dir of ['series', 'biographies', 'articles']) fs.symlinkSync(path.resolve('content', dir), path.join(root, 'content', dir));
  try { return fn(root); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}

test('valid main and extended entries parse', () => {
  assert.equal(TimelineEntrySchema.parse(main).id, 'one');
  assert.deepEqual(TimelineEntrySchema.parse(extended).links, []);
});

test('schema enforces the spec rules', () => {
  const bad = patch => assert.throws(() => TimelineEntrySchema.parse({ ...main, ...patch }));
  bad({ summary: words(10) }); bad({ summary: words(60) });
  bad({ title: 'one two three four five six seven eight nine' });
  bad({ season: '2015-17' }); bad({ dateStart: '2015-02-30' });
  bad({ unknown: 1 }); bad({ announced: '2015-10-01' }); bad({ result: 'x' });
  bad({ dateEnd: '2015-10-01', precision: 'window', dateLabel: 'Autumn 2015' });
  assert.throws(() => TimelineEntrySchema.parse({ ...extended, summary: 'Two sentences. Here.' }));
});

test('a window or month entry can never carry a made-up day', () => {
  assert.throws(() => TimelineEntrySchema.parse({ ...main, precision: 'window', dateEnd: '2015-12-01', dateLabel: '1 October 2015' }));
  assert.throws(() => TimelineEntrySchema.parse({ ...main, precision: 'month', dateLabel: '8 October 2015' }));
  assert.equal(TimelineEntrySchema.parse({ ...main, precision: 'month', dateLabel: 'October 2015' }).precision, 'month');
});

test('the real timeline file loads and sorts by date', () => {
  const entries = getTimeline();
  const dates = entries.map(e => e.dateStart);
  assert.deepEqual(dates, [...dates].sort());
});

test('the build fails on a broken link, a missing parent, a cross-season parent and a linkless main entry', () => {
  withFile([main, extended], root => assert.equal(getTimeline(root).length, 2));
  withFile([{ ...main, links: [{ type: 'series-part', seriesSlug: 'klopps-liverpool', partNumber: 99 }] }], root => assert.throws(() => getTimeline(root), /does not exist/));
  withFile([{ ...main, links: [{ type: 'biography', slug: 'nobody' }] }], root => assert.throws(() => getTimeline(root), /does not exist/));
  withFile([{ ...main, links: [{ type: 'article', slug: 'no-such-article' }] }], root => assert.throws(() => getTimeline(root), /does not exist/));
  withFile([main, { ...extended, parent: 'ghost' }], root => assert.throws(() => getTimeline(root), /parent/));
  withFile([main, { ...extended, parent: 'one', season: '2016-17' }], root => assert.throws(() => getTimeline(root), /parent/));
  withFile([{ ...main, links: [] }], root => assert.throws(() => getTimeline(root), /at least one link/));
  withFile([main, main], root => assert.throws(() => getTimeline(root), /Duplicate/));
});

test('children nest under their parent and extended entries need no link', () => {
  withFile([main, { ...extended, parent: 'one' }], root => {
    const [card] = getVisibleTimeline(new Date(), {}, root);
    assert.equal(card.children.length, 1);
  });
});

test('on production a main entry whose links are not live is hidden', () => {
  const early = new Date('2026-01-01T12:00:00Z');
  withFile([main, extended], root => {
    assert.equal(getVisibleTimeline(early, { VERCEL_ENV: 'production' }, root).filter(c => c.priority === 'main').length, 0);
    assert.equal(getVisibleTimeline(early, {}, root).filter(c => c.priority === 'main').length, 1);
    assert.equal(getVisibleTimeline(new Date('2026-12-01T12:00:00Z'), { VERCEL_ENV: 'production' }, root).filter(c => c.priority === 'main').length, 1);
  });
});
