import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const { LookingBackSchema } = await import('../lib/content/types.ts');
const { getLookingBack, LOOKING_BACK_BYLINE, isLive, liveFrom, weekStartingMonday, isProduction, getVisibleLookingBack, getLiveLookingBack, groupByWeek, weekEndingSunday, formatDayDate } = await import('../lib/content/looking-back.ts');

const valid = {
  title: 'Rush scores four as Liverpool run riot at Goodison', slug: 'rush-scores-four-everton-1982',
  date: '2026-11-01', eventDate: '1982-11-06', dateline: 'Goodison Park · Saturday 6 November 1982 · First Division',
  scoreline: 'Everton 0 Liverpool 5', excerpt: "Ian Rush's four goals in a 5–0 win at Goodison Park.", body: 'Body.',
};

test('a complete keepsake parses; the scoreline is optional', () => {
  assert.equal(LookingBackSchema.parse(valid).slug, valid.slug);
  const noScore = { ...valid }; delete noScore.scoreline;
  assert.equal(LookingBackSchema.parse(noScore).scoreline, undefined);
});

test('the schema rejects missing fields, bad dates, extra fields and multi-sentence excerpts', () => {
  for (const field of ['title', 'slug', 'date', 'eventDate', 'dateline', 'excerpt']) {
    const rest = { ...valid }; delete rest[field];
    assert.throws(() => LookingBackSchema.parse(rest), undefined, `missing ${field}`);
  }
  assert.throws(() => LookingBackSchema.parse({ ...valid, date: '1 November 2026' }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, eventDate: '1982-11-31' }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, eventDate: '2026-11-02' }), /eventDate/);
  assert.throws(() => LookingBackSchema.parse({ ...valid, sources: ['https://example.com'] }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, excerpt: 'One sentence. And another.' }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, excerpt: 'No closing punctuation' }));
  assert.throws(() => LookingBackSchema.parse({ ...valid, slug: 'Not A Slug' }));
});

test('the loader fails the build on a mismatched slug and lists newest first', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'looking-back-'));
  const dir = path.join(root, 'content/looking-back');
  const write = (file, data) => fs.writeFileSync(path.join(dir, file), `---\n${Object.entries(data).map(([k, v]) => `${k}: "${v}"`).join('\n')}\n---\nBody.\n`);
  try {
    fs.mkdirSync(dir, { recursive: true });
    const front = { ...valid }; delete front.body;
    write('older.md', { ...front, slug: 'older', date: '2026-10-25' });
    write('newer.md', { ...front, slug: 'newer', date: '2026-11-01' });
    assert.deepEqual(getLookingBack(root).map(p => p.slug), ['newer', 'older']);
    write('wrong.md', { ...front, slug: 'different' });
    assert.throws(() => getLookingBack(root), /wrong\.md.*must match filename/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('Arsenal 5-5 is dated 1 November and Rush is scheduled for its 6 November anniversary', () => {
  const pieces = getLookingBack();
  assert.equal(pieces.find(p => p.slug === 'liverpool-arsenal-5-5-2019').date, '2026-11-01');
  assert.equal(pieces.find(p => p.slug === 'rush-scores-four-everton-1982').date, '2026-11-06');
  assert.deepEqual(fs.readdirSync('docs/looking-back-drafts').filter(f => f !== 'README.md'), []);
});

const at = iso => new Date(iso);
const production = { VERCEL_ENV: 'production' };
const preview = { VERCEL_ENV: 'preview' };

test('a piece goes live on the Monday of its week, is hidden before that on production and shown with a banner on preview', () => {
  // Rush is dated Friday 6 November, so it goes live on Monday 2 November.
  assert.equal(liveFrom({ date: '2026-11-06' }), '2026-11-02');
  const sunday = at('2026-11-01T12:00:00Z'), monday = at('2026-11-02T12:00:00Z');
  assert.equal(isProduction(production), true);
  for (const env of [preview, {}, { VERCEL_ENV: 'development' }]) assert.equal(isProduction(env), false);
  assert.ok(!getVisibleLookingBack(sunday, production).some(p => p.slug === 'rush-scores-four-everton-1982'));
  assert.ok(!getLiveLookingBack(sunday).some(p => p.slug === 'rush-scores-four-everton-1982'));
  for (const env of [preview, {}]) {
    const rush = getVisibleLookingBack(sunday, env).find(p => p.slug === 'rush-scores-four-everton-1982');
    assert.equal(rush.scheduled, true);
    assert.equal(rush.liveFrom, '2026-11-02');
  }
  assert.ok(getVisibleLookingBack(monday, production).some(p => p.slug === 'rush-scores-four-everton-1982' && !p.scheduled));
  // Every piece in a week goes live together, before its own anniversary.
  assert.equal(isLive({ date: '2026-11-08' }, monday), true);
  assert.equal(isLive({ date: '2026-11-09' }, monday), false);
  // Arsenal (Sunday 1 November) went live on Monday 26 October.
  assert.equal(liveFrom({ date: '2026-11-01' }), '2026-10-26');
  assert.ok(getVisibleLookingBack(at('2026-10-26T00:00:00Z'), production).some(p => p.slug === 'liverpool-arsenal-5-5-2019'));
  assert.ok(!getVisibleLookingBack(at('2026-10-25T23:59:59Z'), production).some(p => p.slug === 'liverpool-arsenal-5-5-2019'));
});

test('once live, a piece stays live permanently', () => {
  for (const later of ['2026-11-09T00:00:00Z', '2027-06-01T12:00:00Z', '2035-01-01T00:00:00Z']) {
    assert.equal(isLive({ date: '2026-11-06' }, at(later)), true);
    assert.ok(getVisibleLookingBack(at(later), production).some(p => p.slug === 'rush-scores-four-everton-1982'));
  }
});

test('Monday midnight is UK time: 23:00 UTC on Sunday in British Summer Time, 00:00 UTC in GMT', () => {
  assert.equal(weekStartingMonday('2026-10-22'), '2026-10-19');
  // BST (UTC+1): a piece dated Thursday 22 October 2026 goes live at Monday 19 October 00:00 BST.
  assert.equal(isLive({ date: '2026-10-22' }, at('2026-10-18T22:59:59Z')), false);
  assert.equal(isLive({ date: '2026-10-22' }, at('2026-10-18T23:00:00Z')), true);
  // The clocks go back on Sunday 25 October; that day still belongs to the week whose Monday was in BST.
  assert.equal(liveFrom({ date: '2026-10-25' }), '2026-10-19');
  assert.equal(isLive({ date: '2026-10-25' }, at('2026-10-18T22:59:59Z')), false);
  assert.equal(isLive({ date: '2026-10-25' }, at('2026-10-18T23:00:00Z')), true);
  // GMT (UTC+0): the next Monday, 26 October, starts at 00:00 UTC.
  assert.equal(isLive({ date: '2026-10-30' }, at('2026-10-25T23:59:59Z')), false);
  assert.equal(isLive({ date: '2026-10-30' }, at('2026-10-26T00:00:00Z')), true);
  // The clocks go forward on Sunday 28 March 2027: that week's Monday (22 March) is GMT...
  assert.equal(liveFrom({ date: '2027-03-28' }), '2027-03-22');
  assert.equal(isLive({ date: '2027-03-28' }, at('2027-03-21T23:59:59Z')), false);
  assert.equal(isLive({ date: '2027-03-28' }, at('2027-03-22T00:00:00Z')), true);
  // ...and the following Monday, 29 March, is the first in BST: 23:00 UTC on Sunday 28 March.
  assert.equal(isLive({ date: '2027-03-31' }, at('2027-03-28T22:59:59Z')), false);
  assert.equal(isLive({ date: '2027-03-31' }, at('2027-03-28T23:00:00Z')), true);
});

test('the week is worked out from the date: Monday to Sunday, labelled by its Sunday', () => {
  assert.equal(weekEndingSunday('2026-11-02'), '2026-11-08'); // Monday
  assert.equal(weekEndingSunday('2026-11-06'), '2026-11-08'); // Friday
  assert.equal(weekEndingSunday('2026-11-08'), '2026-11-08'); // Sunday
  assert.equal(weekEndingSunday('2026-11-09'), '2026-11-15'); // next Monday
  assert.equal(weekEndingSunday('2026-10-29'), '2026-11-01'); // Thursday in a week that crosses into November
  assert.equal(weekEndingSunday('2026-12-30'), '2027-01-03'); // and into a new year
  assert.equal(formatDayDate('2026-11-08'), 'Sunday 8 November 2026');
});

test('a Friday and a Sunday piece share a week; a Monday piece starts a new one', () => {
  const weeks = groupByWeek([
    { slug: 'sunday', date: '2026-11-08' }, { slug: 'monday', date: '2026-11-09' },
    { slug: 'friday', date: '2026-11-06' }, { slug: 'friday-b', date: '2026-11-06' }, { slug: 'friday-a', date: '2026-11-06' },
  ]);
  assert.deepEqual(weeks.map(w => w.heading), ['Week ending Sunday 15 November 2026', 'Week ending Sunday 8 November 2026']);
  assert.deepEqual(weeks[0].pieces.map(p => p.slug), ['monday']);
  // Earliest first within a week; several pieces can share a day.
  assert.deepEqual(weeks[1].pieces.map(p => p.slug), ['friday', 'friday-a', 'friday-b', 'sunday']);
});

test('a week crossing into a new month is labelled by its Sunday', () => {
  const weeks = groupByWeek([{ slug: 'oct-27', date: '2026-10-27' }, { slug: 'nov-01', date: '2026-11-01' }, { slug: 'oct-30', date: '2026-10-30' }]);
  assert.deepEqual(weeks.map(w => w.heading), ['Week ending Sunday 1 November 2026']);
  assert.deepEqual(weeks[0].pieces.map(p => p.slug), ['oct-27', 'oct-30', 'nov-01']);
});

test('the published pieces group as expected once both are live', () => {
  const weeks = groupByWeek(getVisibleLookingBack(at('2026-11-06T12:00:00Z'), production));
  assert.deepEqual(weeks.map(w => [w.heading, w.pieces.map(p => p.slug)]), [
    ['Week ending Sunday 8 November 2026', ['rush-scores-four-everton-1982']],
    ['Week ending Sunday 1 November 2026', ['liverpool-arsenal-5-5-2019']],
  ]);
});

test('future-dated pages and images can appear later without a rebuild', () => {
  for (const file of ['app/looking-back/[slug]/page.tsx', 'app/looking-back/[slug]/opengraph-image.tsx']) {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /export const dynamicParams = true/, file);
    assert.match(source, /export const revalidate = 3600/, file);
    assert.match(source, /getVisibleLookingBack/, file);
  }
  assert.match(fs.readFileSync('app/looking-back/page.tsx', 'utf8'), /export const revalidate = 3600/);
  assert.match(fs.readFileSync('app/sitemap.ts', 'utf8'), /export const revalidate = 3600/);
});

test('keepsakes carry the publication byline and no AI disclosure; the disclosure is on About', () => {
  assert.equal(LOOKING_BACK_BYLINE, 'The Liverpool Brief');
  const disclosure = /Written with AI|drafted with AI/;
  for (const file of ['app/looking-back/[slug]/page.tsx', 'app/looking-back/[slug]/opengraph-image.tsx', 'lib/content/looking-back.ts']) {
    const source = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(source, disclosure, file);
    assert.doesNotMatch(source, /Denny Regan/, file);
  }
  assert.match(fs.readFileSync('app/looking-back/[slug]/page.tsx', 'utf8'), /By \{LOOKING_BACK_BYLINE\}/);
  assert.match(fs.readFileSync('app/looking-back/[slug]/opengraph-image.tsx', 'utf8'), /By \{LOOKING_BACK_BYLINE\}/);
  for (const file of fs.readdirSync('content/looking-back')) assert.doesNotMatch(fs.readFileSync(path.join('content/looking-back', file), 'utf8'), disclosure);
  assert.match(fs.readFileSync('app/about/page.tsx', 'utf8'), /Looking Back pieces are researched and drafted with AI tools from published sources, then checked and edited before publication\./);
});

test('Looking Back is in the main navigation after Football Observed, and History has not returned', () => {
  const header = fs.readFileSync('app/components/SiteHeader.tsx', 'utf8');
  assert.ok(header.indexOf('"Football Observed"') < header.indexOf('"Looking Back"'));
  for (const dir of ['app/history', 'app/this-week', 'content/history', 'content/this-week']) assert.equal(fs.existsSync(dir), false);
});
