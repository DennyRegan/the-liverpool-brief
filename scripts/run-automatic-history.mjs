import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { calendarPath, validateCalendar } from './validate-editorial-calendar.mjs';
import { allRows, queues } from './automatic-history-state.mjs';
import { readCalendar, saveCalendar, scheduledSlot, discoverCandidates, selectForSlot, promoteSelection,
  completeSelection, verifyProduction, sha256 } from './automatic-history-publisher.mjs';

export function assertRemoteUnchanged(base, remote) {
  assert.equal(remote, base, 'Main changed concurrently. No push attempted; retry from latest main and the recorded selection.');
}
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trimEnd();
export function checks() {
  for (const args of [['run', 'validate:calendar'], ['test'], ['run', 'lint'], ['run', 'build']]) {
    execFileSync('npm', args, { stdio: 'inherit' });
  }
}
// Optimistic concurrency: require the exact fetched base, then a normal push.
// A race after this check is rejected by Git itself; never rebase an article after tests.
function commitAndPush(base, paths, message) {
  git('fetch', 'origin', 'main');
  assertRemoteUnchanged(base, git('rev-parse', 'origin/main'));
  const changed = git('status', '--porcelain', '--untracked-files=all').split('\n').filter(Boolean).map(line => line.slice(3));
  assert.ok(changed.every(file => paths.includes(file)), 'Unrelated working changes; refusing publication commit');
  git('add', '--', ...paths);
  git('commit', '-m', message);
  git('push', 'origin', 'HEAD:refs/heads/main');
  const commit = git('rev-parse', 'HEAD');
  git('fetch', 'origin', 'main');
  assert.equal(git('merge-base', '--is-ancestor', commit, 'origin/main'), '', 'Publication commit is not on main');
  return commit;
}
function summary(message) {
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n\n`);
}

export async function runPublisher(queue, root = process.cwd(), { check = checks, verify = verifyProduction } = {}) {
  assert.ok(queues.includes(queue));
  assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Live publishing is restricted to GitHub Actions');
  assert.equal(process.env.GITHUB_REPOSITORY, 'DennyRegan/the-liverpool-brief');
  assert.equal(process.env.GITHUB_REF, 'refs/heads/main', 'Live publishing only runs from reviewed main');
  assert.ok(['schedule', 'workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME));
  assert.equal(git('status', '--porcelain'), '', 'Use a clean checkout');
  git('fetch', 'origin', 'main');
  assertRemoteUnchanged(git('rev-parse', 'HEAD'), git('rev-parse', 'origin/main'));
  let base = git('rev-parse', 'HEAD'), calendar = readCalendar(root);
  validateCalendar(calendar, root);
  const config = calendar.automaticHistory;
  assert.ok(config, 'Automatic policy missing');
  if (!config.enabled || config.pausedQueues.includes(queue)) { summary(`${queue}: paused; no selection or publication.`); return; }
  let slot;
  if (process.env.GITHUB_EVENT_NAME === 'workflow_dispatch') {
    // Live dispatch can ONLY retry a previously durable selection, never release a new random item.
    slot = process.env.HISTORY_RETRY_SLOT;
    assert.ok(config.runs.some(r => r.slot === slot && r.queue === queue && ['selected', 'publication_pending', 'succeeded'].includes(r.state)), 'Choose an existing selection slot for retry');
  } else slot = scheduledSlot(queue);
  if (!slot) { summary(`${queue}: outside the Europe/London publication window.`); return; }
  let run = config.runs.find(r => r.slot === slot);
  if (!run) {
    // Technical validation precedes selection; article-specific full checks follow the durable reservation.
    run = selectForSlot(calendar, queue, slot, discoverCandidates(queue, root), root);
    saveCalendar(root, calendar);
    validateCalendar(calendar, root);
    base = commitAndPush(base, [calendarPath], `History: reserve ${slot} (${run.slug ?? 'empty queue'}) [skip ci]`);
    summary(`${slot}: durable selection ${run.slug ?? 'empty queue'}.`);
  }
  if (['succeeded', 'empty'].includes(run.state)) { summary(`${slot}: already ${run.state}; no new publication.`); return; }
  if (run.state === 'selected') {
    const plan = promoteSelection(root, calendar, run);
    // A failure leaves only the remotely saved reservation, with no public article push.
    check();
    base = commitAndPush(base, [calendarPath, plan.publicPath], `History: publish ${run.slug} for ${slot}`);
    calendar = readCalendar(root); run = calendar.automaticHistory.runs.find(r => r.slot === slot);
    summary(`${slot}: publication commit ${base}; awaiting production verification.`);
  } else {
    assert.equal(sha256(fs.readFileSync(`content/archive/liverpool/${run.slug}.md`)), run.publicSha256, 'Pending public article changed');
    check();
  }
  const verified = await verify(run);
  const completed = completeSelection(root, calendar, run);
  saveCalendar(root, completed);
  validateCalendar(completed, root);
  commitAndPush(base, [calendarPath], `History: verify ${slot} live [skip ci]`);
  assert.equal(allRows(completed).find(r => r.id === run.rowId).status, 'published');
  summary(`${slot}: verified ${verified.route}; no longer eligible. No second article selected.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try { await runPublisher(process.argv[2]); }
  catch (error) { summary(`Publication STOPPED: ${error.message}. Inspect the calendar run and logs; retry the same slot. No substitute selected.`); process.exitCode = 1; }
}
