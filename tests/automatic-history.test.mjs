import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { filterCandidates, discoverCandidates, selectRandom, selectForSlot, scheduledSlot,
  londonParts, readCalendar, saveCalendar, dryRun, promoteSelection, completeSelection, verifyProduction,
  publicationBlock, sensitiveSubject, approvedByDenny } from '../scripts/automatic-history-publisher.mjs';
import { allRows, publicationClasses } from '../scripts/automatic-history-state.mjs';
import { validateCalendar, calendarPath } from '../scripts/validate-editorial-calendar.mjs';
import { restoreAutomaticStock } from './fixtures/automatic-editorial.mjs';
import { assertRemoteUnchanged } from '../scripts/run-automatic-history.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'automatic-history-'));
  for (const dir of ['content', 'docs/editorial', 'pipeline/output/match']) fs.cpSync(dir, path.join(root, dir), { recursive: true });
  restoreAutomaticStock(root);
  return { root, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}
const tuesday = new Date('2026-10-06T08:17:00Z');
const friday = new Date('2026-10-09T08:17:00Z');

test('explicit eligibility rejects published, blocked, missing, unfinished, claimed and other classes', () => {
  const row = { id: 'bio', publicationClass: publicationClasses.biographies, status: 'ready_for_review', draftPath: 'docs/editorial/drafts/bio.md', publishedDestination: null, claim: null };
  const entry = { id: row.id, canonicalDraftPath: row.draftPath, completed: true, technicallyReady: true, unpublished: true, alreadyPublishedElsewhere: false };
  assert.equal(filterCandidates('biographies', [entry], [row]).length, 1);
  for (const change of [{ status: 'published' }, { status: 'blocked' }, { status: 'planned' }, { status: 'writing' }, { draftPath: null },
    { publicationClass: undefined }, { publicationClass: publicationClasses.matches }, { claim: { token: 'other-owner' } }, { publishedDestination: '/archive/bio' }]) {
    assert.equal(filterCandidates('biographies', [entry], [{ ...row, ...change }]).length, 0);
  }
  for (const change of [{ completed: false }, { technicallyReady: false }, { unpublished: false }, { alreadyPublishedElsewhere: true }, { canonicalDraftPath: null }]) {
    assert.equal(filterCandidates('biographies', [{ ...entry, ...change }], [row]).length, 0);
  }
  assert.equal(filterCandidates('matches', [entry], [row]).length, 0);
  assert.equal(filterCandidates('biographies', [entry], [row], [{ rowId: row.id, state: 'selected' }]).length, 0);
});

test('random source is injected; every pool index has equal access and empty pools need no random call', () => {
  const candidates = [{ id: 'late' }, { id: 'early' }, { id: 'middle' }];
  for (let i = 0; i < candidates.length; i++) assert.equal(selectRandom(candidates, size => { assert.equal(size, candidates.length); return i; }), candidates[i]);
  assert.equal(selectRandom([], () => { throw Error('must not call'); }), null);
  assert.throws(() => selectRandom(candidates, () => candidates.length));
});

test('London schedule handles GMT, BST, both clock changes and delayed cron without crossing days', () => {
  for (const date of ['2026-03-24', '2026-03-31', '2026-10-20', '2026-10-27']) {
    const early = new Date(`${date}T08:17:00Z`), late = new Date(`${date}T09:17:00Z`);
    assert.equal(scheduledSlot('biographies', late), `biographies:${date}`);
    assert.equal(scheduledSlot('biographies', early), londonParts(early).hour >= 9 ? `biographies:${date}` : null);
  }
  for (const date of ['2026-03-27', '2026-04-03', '2026-10-23', '2026-10-30']) assert.equal(scheduledSlot('matches', new Date(`${date}T09:17:00Z`)), `matches:${date}`);
  assert.equal(scheduledSlot('biographies', friday), null);
  assert.equal(scheduledSlot('matches', tuesday), null);
  assert.equal(scheduledSlot('biographies', new Date('2026-10-06T12:00:00Z')), null);
  assert.equal(scheduledSlot('biographies', new Date('2026-10-06T11:59:00Z')), 'biographies:2026-10-06');
});

test('current repository pool is derived, opt-in only, and both dry runs are read only', () => {
  const before = fs.readFileSync(calendarPath);
  for (const queue of ['biographies', 'matches']) {
    const pool = discoverCandidates(queue);
    const result = dryRun(queue, process.cwd(), queue === 'biographies' ? tuesday : friday, () => 0);
    assert.equal(result.eligibleCount, pool.length);
    assert.equal(result.writes, 0);
    assert.equal(result.published, false);
    if (result.selected) assert.ok(!fs.existsSync(`content/archive/liverpool/${result.selected.slug}.md`));
    else assert.equal(pool.length, 0);
    for (const e of pool) assert.ok(e.completed && e.technicallyReady && e.unpublished);
  }
  assert.deepEqual(fs.readFileSync(calendarPath), before);
  const excludedIds = new Set(allRows(readCalendar(process.cwd())).filter(e => e.claim || !e.draftPath
    || !['ready_for_review', 'approved'].includes(e.status)).map(e => e.id));
  assert.ok(discoverCandidates('biographies').every(e => !excludedIds.has(e.id)));
});

test('durable selection survives process reload, duplicate slots, failure and subsequent weeks without rerolling', () => {
  const f = fixture();
  try {
    const calendar = readCalendar(f.root), pool = discoverCandidates('biographies', f.root);
    const run = selectForSlot(calendar, 'biographies', 'biographies:2026-10-06', pool, f.root, tuesday, () => 0);
    saveCalendar(f.root, calendar);
    const loaded = readCalendar(f.root);
    assert.deepEqual(selectForSlot(loaded, run.queue, run.slot, pool, f.root, tuesday, () => { throw Error('reroll'); }), run);
    assert.ok(!discoverCandidates(run.queue, f.root).some(e => e.id === run.rowId));
    assert.throws(() => selectForSlot(loaded, run.queue, 'biographies:2026-10-13', pool, f.root), /Outstanding failed selection/);
    assert.doesNotThrow(() => selectForSlot(loaded, 'matches', 'matches:2026-10-09', discoverCandidates('matches', f.root), f.root, friday, () => 0));
    fs.appendFileSync(path.join(f.root, run.draftPath), '\nChanged after selection.\n');
    assert.throws(() => promoteSelection(f.root, loaded, run), /manuscript changed/);
    assert.ok(!fs.existsSync(path.join(f.root, `content/archive/liverpool/${run.slug}.md`)));
    assert.deepEqual(readCalendar(f.root).automaticHistory.runs[0], run);
  } finally { f.cleanup(); }
});

test('both publication classes preserve body bytes, stay pending until verification, and never re-enter the queue', () => {
  const f = fixture();
  try {
    for (const [queue, now, slot] of [['biographies', tuesday, 'biographies:2026-10-06'], ['matches', friday, 'matches:2026-10-09']]) {
      const calendar = readCalendar(f.root), pool = discoverCandidates(queue, f.root);
      // Include a new-production report to exercise the existing batch and review architecture.
      const index = queue === 'matches' ? Math.max(0, pool.findIndex(e => e.newlyResearched)) : 0;
      const run = selectForSlot(calendar, queue, slot, pool, f.root, now, () => index);
      saveCalendar(f.root, calendar);
      const before = fs.readFileSync(path.join(f.root, run.draftPath), 'utf8');
      const plan = promoteSelection(f.root, calendar, run, now);
      const row = allRows(plan.calendar).find(r => r.id === run.rowId);
      assert.equal(row.status, 'publication_pending');
      assert.equal(row.approval, null, 'Narrow queue authority must not fabricate individual approval');
      assert.equal(plan.run.verifiedAt, null);
      assert.equal(matter(plan.publicText).content, matter(before).content);
      assert.equal(fs.readFileSync(path.join(f.root, run.draftPath), 'utf8'), before);
      assert.equal(matter(plan.publicText).data.editorialMode, 'factual');
      assert.equal(matter(plan.publicText).data.date, londonParts(now).date);
      assert.ok(!discoverCandidates(queue, f.root).some(e => e.slug === run.slug));
      assert.throws(() => promoteSelection(f.root, plan.calendar, plan.run), /recorded selection/);
      const completed = completeSelection(f.root, plan.calendar, plan.run, now);
      saveCalendar(f.root, completed);
      assert.equal(allRows(completed).find(r => r.id === run.rowId).status, 'published');
      assert.equal(discoverCandidates(queue, f.root).length, pool.length - 1);
      assert.equal(selectForSlot(completed, queue, slot, pool, f.root).state, 'succeeded');
      validateCalendar(completed, f.root);
    }
  } finally { f.cleanup(); }
});

test('empty slots persist safely and cannot refill or select on a rerun', () => {
  const c = { automaticHistory: { runs: [] } };
  const run = selectForSlot(c, 'matches', 'matches:2026-10-09', [], process.cwd(), friday);
  assert.equal(run.state, 'empty');
  assert.equal(run.slug, null);
  assert.equal(selectForSlot(c, 'matches', run.slot, [{ id: 'unexpected' }], process.cwd(), friday, () => { throw Error('reroll'); }), run);
});

test('a draft with no editorial label is never published; only editorialMode "factual" is accepted', () => {
  assert.equal(publicationBlock({ editorialMode: 'factual', title: 'A match' }, {}), null);
  assert.match(publicationBlock({ title: 'A match' }, {}), /No editorial label/);
  assert.match(publicationBlock({ editorialMode: '', title: 'A match' }, {}), /No editorial label/);
  assert.match(publicationBlock({ editorialMode: 'draft', title: 'A match' }, {}), /No editorial label/);
  assert.match(publicationBlock({ editorialMode: 'opinion', title: 'A match' }, {}), /Opinion/);
  const f = fixture();
  try {
    const [first] = discoverCandidates('biographies', f.root);
    const draft = path.join(f.root, first.canonicalDraftPath);
    const { data, content } = matter(fs.readFileSync(draft, 'utf8'));
    assert.equal(data.editorialMode, 'factual');
    delete data.editorialMode;
    fs.writeFileSync(draft, matter.stringify(content, data));
    assert.ok(!discoverCandidates('biographies', f.root).some(e => e.slug === first.slug), 'Unlabelled draft stayed in the pool');
    // Even a selection recorded earlier cannot promote an unlabelled draft.
    const calendar = readCalendar(f.root);
    const run = selectForSlot(calendar, 'biographies', 'biographies:2026-10-06', [first], f.root, tuesday, () => 0);
    assert.throws(() => promoteSelection(f.root, calendar, run, tuesday), /No editorial label/);
    assert.ok(!fs.existsSync(path.join(f.root, `content/archive/liverpool/${first.slug}.md`)));
  } finally { f.cleanup(); }
});

test('sensitive subjects are detected from the headline fields and not from venues, places or passing mentions', () => {
  for (const data of [
    { title: 'Heysel 1985: the European Cup final' },
    { slug: 'anfield-hillsborough-tribute-united-2012', title: 'Liverpool 1–2 Manchester United' },
    { title: 'Hillsborough tributes precede a ten-man Anfield defeat' },
    { excerpt: 'The first game after the Hillsborough disaster.' },
    { title: 'Munich air disaster and the 1958 season' },
    { excerpt: 'Ninety-seven supporters died in 1989.' },
    { historicalPeriod: 'The Taylor Report era' },
    { title: 'A tragedy at the ground' },
  ]) assert.ok(sensitiveSubject(data), `Should be sensitive: ${JSON.stringify(data)}`);
  for (const data of [
    { title: 'Owen’s first league hat-trick rescues Liverpool at Hillsborough', slug: 'sheffield-wednesday-liverpool-1998-owen-hat-trick' },
    { slug: 'leicester-liverpool-1963-fa-cup-semi-final', excerpt: 'The semi-final was played at Hillsborough.' },
    { slug: 'liverpool-tsv-munich-1967-eight-goals' },
    { slug: 'bradford-liverpool-2000-final-day-defeat', title: 'Bradford City 1–0 Liverpool' },
    { title: 'Fowler’s four goals against Middlesbrough' },
  ]) assert.equal(sensitiveSubject(data), null, `Should not be sensitive: ${JSON.stringify(data)}`);
  assert.equal(sensitiveSubject(), null);
});

test('a sensitive piece publishes only when the calendar row carries Denny’s recorded approval by name', () => {
  const approval = { by: 'Denny', recordedAt: '2026-10-04T09:00:00.000Z', evidence: 'Approved by name in this test.' };
  const sensitive = { editorialMode: 'factual', title: 'Heysel 1985' };
  assert.ok(approvedByDenny({ approval }));
  for (const bad of [null, undefined, {}, { by: 'Someone else', recordedAt: approval.recordedAt, evidence: 'x' },
    { by: 'Denny', evidence: 'x' }, { by: 'Denny', recordedAt: approval.recordedAt }]) assert.ok(!approvedByDenny({ approval: bad }));
  assert.match(publicationBlock(sensitive, { approval: null }), /Sensitive subject.*approval by name/);
  assert.match(publicationBlock(sensitive, {}), /Sensitive subject/);
  assert.match(publicationBlock(sensitive, { approval: { by: 'Someone else', recordedAt: approval.recordedAt, evidence: 'x' } }), /Sensitive subject/);
  assert.equal(publicationBlock(sensitive, { approval }), null);
  assert.equal(publicationBlock({ editorialMode: 'factual', title: 'An ordinary match' }, { approval: null }), null);

  const f = fixture();
  try {
    const [first] = discoverCandidates('biographies', f.root);
    const draft = path.join(f.root, first.canonicalDraftPath);
    const { data, content } = matter(fs.readFileSync(draft, 'utf8'));
    fs.writeFileSync(draft, matter.stringify(content, { ...data, title: `${data.title} and Heysel` }));
    assert.ok(!discoverCandidates('biographies', f.root).some(e => e.slug === first.slug), 'Sensitive draft stayed in the pool without approval');
    const calendar = readCalendar(f.root);
    const run = selectForSlot(calendar, 'biographies', 'biographies:2026-10-06', [first], f.root, tuesday, () => 0);
    assert.throws(() => promoteSelection(f.root, calendar, run, tuesday), /Sensitive subject/);
    assert.ok(!fs.existsSync(path.join(f.root, `content/archive/liverpool/${first.slug}.md`)));

    // Recording Denny's approval on the shared calendar row (the existing approval record) lets it through.
    const approved = readCalendar(f.root);
    Object.assign(allRows(approved).find(r => r.id === (first.calendarRowId ?? first.id)), { status: 'approved', approval });
    saveCalendar(f.root, approved);
    assert.ok(discoverCandidates('biographies', f.root).some(e => e.slug === first.slug), 'Approved sensitive draft should be eligible');
    const approvedRun = selectForSlot(approved, 'biographies', 'biographies:2026-10-13', [first], f.root, tuesday, () => 0);
    assert.doesNotThrow(() => promoteSelection(f.root, approved, approvedRun, tuesday));
  } finally { f.cleanup(); }
});

test('live verifier bounds retries, requires exact URL and sitemap, and never declares a failure successful', async () => {
  const run = { state: 'publication_pending', slug: 'synthetic-test' };
  let calls = 0, sleeps = 0;
  const fetcher = async url => {
    calls++;
    const article = 'https://theliverpoolbrief.com/archive/synthetic-test';
    return { status: calls <= 4 ? 404 : 200, text: async () => url.endsWith('/sitemap.xml') ? `<loc>${article}</loc>` : article };
  };
  const result = await verifyProduction(run, { fetcher, attempts: 3, sleep: async () => { sleeps++; }, intervalMs: 1 });
  assert.equal(result.attempts, 2); assert.equal(sleeps, 1);
  await assert.rejects(verifyProduction(run, { attempts: 2, sleep: async () => {}, fetcher: async () => ({ status: 200, text: async () => 'wrong sitemap/canonical' }) }), /timed out/);
  assert.equal(run.state, 'publication_pending');
});

test('concurrent remote writes fail closed without force push or overwriting editorial work', () => {
  assert.doesNotThrow(() => assertRemoteUnchanged('same-sha', 'same-sha'));
  assert.throws(() => assertRemoteUnchanged('tested-sha', 'new-editorial-sha'), /Main changed concurrently/);
});

test('publication date is London calendar date even when UTC date differs', () => {
  assert.equal(londonParts(new Date('2026-07-06T23:30:00Z')).date, '2026-07-07');
});
