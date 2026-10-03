import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readCalendar, saveCalendar, londonParts } from './automatic-history-publisher.mjs';
import { allRows } from './automatic-history-state.mjs';
import { validateCalendar, calendarPath } from './validate-editorial-calendar.mjs';

// Take a piece that the automatic publisher released back offline, in one reviewable step.
// It makes the three edits together, runs the checks, and stops. It never commits or pushes.
// If any check fails it puts every file back exactly as it was.

const publicFile = slug => `content/archive/liverpool/${slug}.md`;

// Work out the edits without writing anything.
export function planTakeOffline(root, slug, reason, now = new Date()) {
  assert.ok(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? ''), 'Give the article slug, for example: alan-hansen');
  assert.ok(typeof reason === 'string' && reason.trim().length >= 3, 'Give a reason with --reason "..."');
  const calendar = readCalendar(root);
  const run = calendar.automaticHistory?.runs?.find(r => r.slug === slug);
  assert.ok(run, `The calendar has no automatic release of "${slug}". This command only handles pieces the automatic publisher released; a piece published another way needs a manual change.`);
  assert.ok(['succeeded', 'publication_pending'].includes(run.state), `The run ${run.slot} is "${run.state}", so nothing is public to take offline.`);
  assert.ok(allRows(calendar).some(r => r.id === run.rowId), `The calendar row ${run.rowId} is missing`);
  const updated = structuredClone(calendar);
  const updatedRun = updated.automaticHistory.runs.find(r => r.slot === run.slot);
  const row = allRows(updated).find(r => r.id === run.rowId);
  assert.equal(row.publishedDestination, `/archive/${slug}`, 'The calendar row does not point at this article');
  const date = londonParts(now).date;
  // An empty slot keeps the day used, so the publisher cannot choose a different piece in its place.
  Object.assign(updatedRun, { state: 'empty', rowId: null, slug: null, draftPath: null, manuscriptSha256: null, publishedAt: null, publicSha256: null, verifiedAt: null });
  // Removing the class keeps the piece out of every future draw. The draft itself is left alone.
  delete row.publicationClass;
  Object.assign(row, { publishedDestination: null, status: 'ready_for_review',
    notes: `${row.notes ? `${row.notes} ` : ''}Taken offline ${date}: ${reason.trim()}.` });
  return { slug, slot: run.slot, rowId: run.rowId, publicPath: publicFile(slug), calendar: updated,
    changes: [`delete ${publicFile(slug)}`,
      `${calendarPath}: run ${run.slot} becomes an empty slot`,
      `${calendarPath}: row ${run.rowId} is no longer published and loses its publicationClass`] };
}

// Write the edits, check them, and put everything back if a check fails. Never commits or pushes.
export function applyTakeOffline(root, slug, reason, { now = new Date(), check = () => {}, dryRun = false } = {}) {
  const plan = planTakeOffline(root, slug, reason, now);
  if (dryRun) return { ...plan, written: false };
  const calendarFile = path.join(root, calendarPath), articleFile = path.join(root, plan.publicPath);
  const originalCalendar = fs.readFileSync(calendarFile);
  const originalArticle = fs.existsSync(articleFile) ? fs.readFileSync(articleFile) : null;
  try {
    saveCalendar(root, plan.calendar);
    fs.rmSync(articleFile, { force: true });
    validateCalendar(readCalendar(root), root);
    check(root);
  } catch (error) {
    fs.writeFileSync(calendarFile, originalCalendar);
    if (originalArticle) fs.writeFileSync(articleFile, originalArticle);
    error.message = `${error.message}\nNothing was changed: the calendar and the article were put back exactly as they were.`;
    throw error;
  }
  return { ...plan, written: true };
}

const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'inherit' });
export function commandChecks(root, { quick = false } = {}) {
  console.log('\n→ Calendar check');
  run('npm', ['run', 'validate:calendar'], root);
  console.log('\n→ Build data check (the first step of the build)');
  run('node', ['scripts/validate-history.mjs'], root);
  if (quick) return;
  console.log('\n→ Tests'); run('npm', ['test'], root);
  console.log('\n→ Lint'); run('npm', ['run', 'lint'], root);
  console.log('\n→ Build'); run('npm', ['run', 'build'], root);
}
const git = (root, ...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();

function main(argv) {
  const args = argv.slice(2);
  const flag = name => args.includes(name);
  const reasonAt = args.indexOf('--reason');
  const reason = reasonAt >= 0 ? args[reasonAt + 1] : undefined;
  const slug = args.find((a, i) => !a.startsWith('--') && i !== (reasonAt >= 0 ? reasonAt + 1 : -1));
  const root = process.cwd();
  assert.ok(!process.env.GITHUB_ACTIONS, 'This is a hands-on command for your own computer, not for Actions');
  assert.ok(slug && reason, 'Usage: npm run history:take-offline -- <slug> --reason "why" [--dry-run] [--quick]');
  const branch = git(root, 'rev-parse', '--abbrev-ref', 'HEAD');
  const plan = planTakeOffline(root, slug, reason);
  const touched = [calendarPath, plan.publicPath];
  assert.equal(git(root, 'status', '--porcelain', '--', ...touched), '', `Uncommitted changes in ${touched.join(' or ')}. Commit or put them aside first.`);
  console.log(`Branch: ${branch}${branch === 'main' ? '' : '   (not main — the removal only goes live once this reaches main)'}`);
  console.log(`Taking "${slug}" offline (${plan.slot}). Planned changes:\n${plan.changes.map(c => `  - ${c}`).join('\n')}`);
  if (flag('--dry-run')) return console.log('\nDry run: nothing was written. Run again without --dry-run to make the changes.');
  applyTakeOffline(root, slug, reason, { check: () => commandChecks(root, { quick: flag('--quick') }) });
  console.log(`\n✔ Done and checked${flag('--quick') ? ' (quick: calendar and build data only; tests, lint and build skipped)' : ''}. NOTHING has been committed or pushed.\n`);
  console.log(git(root, 'status', '--short', '--', ...touched));
  console.log(`\nLook first:\n  git diff --stat\n  git diff -- ${calendarPath}\n`);
  console.log(`When you are happy:\n  git add ${touched.join(' ')}\n  git commit -m "Take ${slug} offline"\n  git push origin ${branch}\n`);
  console.log(`To undo this command instead:\n  git checkout -- ${touched.join(' ')}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try { main(process.argv); } catch (error) { console.error(`\n✖ ${error.message}`); process.exitCode = 1; }
}
