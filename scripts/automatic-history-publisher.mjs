import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash, randomInt } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { getEditorialReviewQueue } from './editorial-review-queue.mjs';
import { validateCalendar, calendarPath } from './validate-editorial-calendar.mjs';
import { allRows, publicationClasses, queues } from './automatic-history-state.mjs';
import { ArchiveFeatureSchema } from '../lib/content/types.ts';

export const sha256 = value => createHash('sha256').update(value).digest('hex');
export const readCalendar = root => JSON.parse(fs.readFileSync(path.join(root, calendarPath), 'utf8'));
export const saveCalendar = (root, calendar) => fs.writeFileSync(path.join(root, calendarPath), `${JSON.stringify(calendar, null, 2)}\n`);
export function londonParts(now) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit',
    weekday: 'short', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(now).map(p => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, weekday: parts.weekday, hour: Number(parts.hour) };
}
export function scheduledSlot(queue, now = new Date()) {
  assert.ok(queues.includes(queue), 'Unknown queue');
  const local = londonParts(now);
  // The early UTC opportunity in winter is ignored; delayed runs may start until 12:59.
  return local.weekday === (queue === 'biographies' ? 'Tue' : 'Fri') && local.hour >= 9 && local.hour <= 12
    ? `${queue}:${local.date}` : null;
}
const monday = date => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - (d.getUTCDay() + 6) % 7);
  return d.toISOString().slice(0, 10);
};

// Subjects that never publish automatically unless Denny has approved the piece by name.
// Only the piece's own headline fields are read (title, slug, excerpt, period, calendar id and event), so a biography
// that merely mentions a disaster, or a match played at the Hillsborough ground, is not caught.
const tragedyWord = 'disasters?|tragedy|tragedies|tragic|atrocity|atrocities|tributes?|memorials?|inquests?|justice|families|victims?|remembrance|vigil|anniversary|anniversaries|1989';
const sensitivePatterns = [
  ['Heysel', /\bheysel\b/],
  ['Hillsborough disaster', new RegExp(`\\bhillsborough\\b[^.\\n]{0,60}\\b(${tragedyWord}|ninety|96|97)\\b|\\b(${tragedyWord})\\b[^.\\n]{0,60}\\bhillsborough\\b`)],
  ['Munich air disaster', /\bmunich air (disaster|crash)\b|\bair crash\b/],
  ['Bradford fire or Ibrox disaster', /\bbradford (city )?(fire|disaster)\b|\bibrox (disaster|tragedy)\b/],
  ['Taylor Report', /\btaylor report\b/],
  ['loss of life', /\b(ninety[ -]six|ninety[ -]seven|thirty[ -]nine|96|97|39)\s+(liverpool\s+)?(fans|supporters|people|lives|victims|dead)\b|\bthe 96\b/],
  ['disaster or tragedy', /\b(disasters?|tragedy|tragedies|tragic|atrocity|atrocities)\b/],
];
export function sensitiveSubject(data = {}, row = {}) {
  const text = [data.title, data.slug, data.excerpt, data.historicalPeriod, row.id, row.event]
    .filter(value => typeof value === 'string').join(' . ').toLowerCase().replace(/[-_]+/g, ' ');
  return sensitivePatterns.find(([, pattern]) => pattern.test(text))?.[0] ?? null;
}
// "By name" means the shared calendar row carries Denny's recorded approval (the existing approval record).
export const approvedByDenny = row => row?.approval?.by === 'Denny' && Boolean(row.approval.recordedAt) && Boolean(row.approval.evidence);
// Returns why a draft must not publish automatically, or null when it may.
export function publicationBlock(data, row) {
  if (data.editorialMode === 'opinion') return 'Opinion is outside the automatic queue';
  if (data.editorialMode !== 'factual') return 'No editorial label: only drafts marked editorialMode "factual" can publish automatically';
  const topic = sensitiveSubject(data, row);
  if (topic && !approvedByDenny(row)) return `Sensitive subject (${topic}) needs Denny's approval by name in the calendar`;
  return null;
}

// Explicit class, completed technical queue and canonical row must all agree.
export function filterCandidates(queue, entries, rows, runs = []) {
  assert.ok(queues.includes(queue), 'Unknown queue');
  const claimed = new Set(runs.filter(r => r.state !== 'empty').map(r => r.rowId));
  const byId = new Map(rows.map(r => [r.id, r]));
  return entries.filter(e => {
    const row = byId.get(e.calendarRowId ?? e.id);
    return row && row.publicationClass === publicationClasses[queue]
      && !claimed.has(row.id) && !row.claim && !row.publishedDestination
      && row.draftPath === e.canonicalDraftPath && e.completed && e.technicallyReady
      && e.unpublished && !e.alreadyPublishedElsewhere
      && ['ready_for_review', 'approved'].includes(row.status);
  });
}
export function discoverCandidates(queue, root = process.cwd()) {
  const calendar = readCalendar(root);
  const rows = validateCalendar(calendar, root);
  const byId = new Map(rows.map(r => [r.id, r]));
  return filterCandidates(queue, getEditorialReviewQueue(queue, root).entries, rows, calendar.automaticHistory?.runs).filter(e => {
    const { data } = matter(fs.readFileSync(path.join(root, e.canonicalDraftPath), 'utf8'));
    return publicationBlock(data, byId.get(e.calendarRowId ?? e.id)) === null && (queue === 'biographies'
      ? data.category === 'person' && ['player', 'manager'].includes(data.articleType)
      : data.category === 'match' && data.articleType === 'match' && Boolean(data.historicalEventDate && data.season));
  });
}
export function selectRandom(candidates, rng = randomInt) {
  if (!candidates.length) return null;
  const index = rng(candidates.length);
  assert.ok(Number.isInteger(index) && index >= 0 && index < candidates.length, 'Invalid random index');
  return candidates[index];
}
export function selectForSlot(calendar, queue, slot, candidates, root, now = new Date(), rng = randomInt) {
  assert.ok(slot.startsWith(`${queue}:`), 'Wrong slot queue');
  const runs = calendar.automaticHistory.runs;
  const existing = runs.find(r => r.slot === slot);
  if (existing) return existing; // Never roll again, even for a previously empty slot.
  assert.ok(!runs.some(r => r.queue === queue && ['selected', 'publication_pending'].includes(r.state)), 'Outstanding failed selection; retry that slot first');
  assert.ok(!runs.some(r => r.queue === queue && r.publishedAt && monday(londonParts(new Date(r.publishedAt)).date) === monday(slot.split(':')[1])), 'This queue already released an article this London week');
  const selected = selectRandom(candidates, rng);
  const run = { slot, queue, state: selected ? 'selected' : 'empty', selectedAt: now.toISOString(),
    rowId: selected ? selected.calendarRowId ?? selected.id : null, slug: selected?.slug ?? null,
    draftPath: selected?.canonicalDraftPath ?? null,
    manuscriptSha256: selected ? sha256(fs.readFileSync(path.join(root, selected.canonicalDraftPath))) : null,
    publishedAt: null, publicSha256: null, verifiedAt: null };
  runs.push(run);
  return run;
}

export function planPublication(root, calendar, run, now = new Date()) {
  assert.equal(run.state, 'selected', 'Only a recorded selection can be promoted');
  const row = allRows(calendar).find(r => r.id === run.rowId);
  assert.equal(row?.publicationClass, publicationClasses[run.queue], 'Article removed from automatic eligibility');
  assert.ok(!row.claim && !row.publishedDestination, 'Article claimed or already public');
  const queue = getEditorialReviewQueue(run.queue, root);
  const eligible = filterCandidates(run.queue, queue.entries, allRows(calendar), []);
  assert.ok(eligible.some(e => (e.calendarRowId ?? e.id) === run.rowId && e.slug === run.slug), 'Selected article is no longer technically eligible');
  const source = fs.readFileSync(path.join(root, run.draftPath), 'utf8');
  assert.equal(sha256(source), run.manuscriptSha256, 'Selected manuscript changed; review the recorded selection');
  assert.ok(source.startsWith('---\n') || source.startsWith('---\r\n'), 'Expected existing YAML frontmatter');
  const { data, content } = matter(source);
  assert.equal(data.slug, run.slug);
  assert.equal(publicationBlock(data, row), null, publicationBlock(data, row) ?? '');
  assert.ok(!Object.hasOwn(data, 'date'), 'Draft already has a publication date');
  if (run.queue === 'biographies') assert.ok(data.category === 'person' && ['player', 'manager'].includes(data.articleType), 'Not a career biography');
  else assert.ok(data.category === 'match' && data.articleType === 'match' && data.historicalEventDate && data.season, 'Not a historical match');
  assert.equal(row.draftPath, run.draftPath);
  const publishedAt = now.toISOString(), date = londonParts(now).date;
  ArchiveFeatureSchema.parse({ ...data, date, editorialMode: 'factual', body: content });
  const publicPath = `content/archive/liverpool/${run.slug}.md`;
  assert.ok(!fs.existsSync(path.join(root, publicPath)), 'Destination already exists');
  // JSON is valid YAML and supports both existing JSON and YAML headers.
  // Serialise metadata only; append the original body without trimming or rewriting.
  const publicText = `---\n${JSON.stringify({ ...data, date, editorialMode: 'factual' }, null, 2)}\n---\n${content}`;
  assert.equal(matter(publicText).content, content, 'Article prose changed');
  const updated = structuredClone(calendar);
  const updatedRun = updated.automaticHistory.runs.find(r => r.slot === run.slot);
  Object.assign(updatedRun, { state: 'publication_pending', publishedAt, publicSha256: sha256(publicText) });
  const updatedRow = allRows(updated).find(r => r.id === run.rowId);
  Object.assign(updatedRow, { status: 'publication_pending', publishedDestination: `/archive/${run.slug}` });
  return { publicPath, publicText, calendar: updated, run: updatedRun };
}
export function promoteSelection(root, calendar, run, now = new Date()) {
  const plan = planPublication(root, calendar, run, now);
  fs.writeFileSync(path.join(root, plan.publicPath), plan.publicText, { flag: 'wx' });
  saveCalendar(root, plan.calendar);
  validateCalendar(plan.calendar, root);
  return plan;
}
export function completeSelection(root, calendar, run, now = new Date()) {
  assert.equal(run.state, 'publication_pending');
  assert.equal(sha256(fs.readFileSync(path.join(root, `content/archive/liverpool/${run.slug}.md`))), run.publicSha256, 'Public manuscript changed before verification');
  assert.ok(!discoverCandidates(run.queue, root).some(e => e.slug === run.slug), 'Published article remains eligible');
  const updated = structuredClone(calendar);
  Object.assign(updated.automaticHistory.runs.find(r => r.slot === run.slot), { state: 'succeeded', verifiedAt: now.toISOString() });
  allRows(updated).find(r => r.id === run.rowId).status = 'published';
  validateCalendar(updated, root);
  return updated;
}

export function dryRun(queue, root = process.cwd(), now = new Date(), rng = randomInt) {
  const before = fs.readFileSync(path.join(root, calendarPath));
  const pool = discoverCandidates(queue, root), selected = selectRandom(pool, rng);
  let proposal = null;
  if (selected) {
    const calendar = readCalendar(root);
    const date = londonParts(now).date;
    // A synthetic slot is used only in memory, without schedule or activation gates.
    const run = { slot: `${queue}:${date}`, queue, state: 'selected', rowId: selected.calendarRowId ?? selected.id,
      slug: selected.slug, draftPath: selected.canonicalDraftPath,
      manuscriptSha256: sha256(fs.readFileSync(path.join(root, selected.canonicalDraftPath))),
      selectedAt: now.toISOString(), publishedAt: null, publicSha256: null, verifiedAt: null };
    calendar.automaticHistory.runs.push(run);
    const plan = planPublication(root, calendar, run, now);
    proposal = { title: selected.title, rowId: run.rowId, slug: run.slug, draftPath: run.draftPath,
      destination: `/archive/${run.slug}`, changes: [plan.publicPath, calendarPath],
      publicationDate: londonParts(now).date, publishedAt: plan.run.publishedAt,
      statusTransition: `${selected.status} → publication_pending → published after live verification`,
      manuscriptSha256: run.manuscriptSha256, prosePreserved: true };
  }
  assert.deepEqual(fs.readFileSync(path.join(root, calendarPath)), before);
  return { queue, dryRun: true, eligibleCount: pool.length, selected: proposal, writes: 0, published: false };
}

// Bounded production checks, using the existing public catalogue/sitemap contract.
export async function verifyProduction(run, { fetcher = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), attempts = 40, intervalMs = 15000 } = {}) {
  assert.equal(run.state, 'publication_pending');
  const origin = 'https://theliverpoolbrief.com', route = `/archive/${run.slug}`;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const responses = await Promise.all([route, '/sitemap.xml', '/history', '/this-week'].map(p => fetcher(`${origin}${p}`, { redirect: 'manual', signal: AbortSignal.timeout(10000), headers: { 'Cache-Control': 'no-cache' } })));
      assert.ok(responses.every(r => r.status === 200), 'Article, sitemap, History or This Week did not return 200');
      const [article, sitemap] = await Promise.all(responses.slice(0, 2).map(r => r.text()));
      assert.ok(article.includes(`${origin}${route}`), 'Article canonical URL missing');
      assert.ok(sitemap.includes(`<loc>${origin}${route}</loc>`), 'Article missing from public sitemap');
      return { route: `${origin}${route}`, attempts: attempt };
    } catch (error) { lastError = error; }
    if (attempt < attempts) await sleep(intervalMs);
  }
  throw new Error(`Production verification timed out for ${route}: ${lastError?.message}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const [mode, queue] = process.argv.slice(2);
  assert.ok(['pool', 'dry-run'].includes(mode), 'Use pool or dry-run; live runs use the guarded Actions runner');
  console.log(JSON.stringify(mode === 'pool' ? { queue, entries: discoverCandidates(queue) } : dryRun(queue), null, 2));
}
