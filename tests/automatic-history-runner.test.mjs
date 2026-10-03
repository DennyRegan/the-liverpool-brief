import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readCalendar, saveCalendar, discoverCandidates, selectForSlot } from '../scripts/automatic-history-publisher.mjs';
import { calendarPath } from '../scripts/validate-editorial-calendar.mjs';
import { restoreAutomaticStock } from './fixtures/automatic-editorial.mjs';

const runnerURL = new URL('../scripts/run-automatic-history.mjs', import.meta.url).href;
// The canonical editorial inventory grows as completed manuscripts are added.
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }).trim();

test('actual Git transport keeps the same reserved item across failed checks, failed deployment and a successful retry', () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'publisher-git-'));
  const root = path.join(parent, 'initial'), remote = path.join(parent, 'remote.git');
  fs.mkdirSync(root);
  try {
    for (const dir of ['content', 'docs/editorial', 'pipeline/output/match']) fs.cpSync(dir, path.join(root, dir), { recursive: true });
    fs.copyFileSync('.gitignore', path.join(root, '.gitignore'));
    restoreAutomaticStock(root);
    const calendar = readCalendar(root);
    calendar.automaticHistory.enabled = true;
    const slot = 'biographies:2026-10-06';
    const selection = selectForSlot(calendar, 'biographies', slot, discoverCandidates('biographies', root), root, new Date('2026-10-06T08:17:00Z'), () => 0);
    saveCalendar(root, calendar);
    git(root, 'init', '-b', 'main');
    git(root, 'config', 'user.name', 'Synthetic publisher test');
    git(root, 'config', 'user.email', 'publisher-test@example.invalid');
    git(root, 'add', '.'); git(root, 'commit', '-m', 'Synthetic durable reservation');
    git(parent, 'clone', '--bare', root, remote);
    git(root, 'remote', 'add', 'origin', remote);
    const remoteCalendar = () => JSON.parse(git(parent, '--git-dir', remote, 'show', `main:${calendarPath}`));
    const run = (cwd, check, verify) => execFileSync(process.execPath, ['--input-type=module', '-e',
      `import {runPublisher} from ${JSON.stringify(runnerURL)};
       try { await runPublisher('biographies', process.cwd(), {check: ${check}, verify: ${verify}}); }
       catch(error) { console.log('EXPECTED STOP: '+error.message); process.exitCode=1; }`], {
      cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'DennyRegan/the-liverpool-brief',
        GITHUB_REF: 'refs/heads/main', GITHUB_EVENT_NAME: 'workflow_dispatch', HISTORY_RETRY_SLOT: slot,
        GITHUB_STEP_SUMMARY: '' },
    });
    const retryCheckout = name => {
      const checkout = path.join(parent, name);
      git(parent, 'clone', remote, checkout);
      git(checkout, 'config', 'user.name', 'Synthetic publisher test');
      git(checkout, 'config', 'user.email', 'publisher-test@example.invalid');
      return checkout;
    };
    assert.throws(() => run(root, "() => { throw Error('synthetic blocking check'); }", 'async () => { throw Error("must not deploy"); }'), error => error.stdout.includes('synthetic blocking check'));
    assert.deepEqual(remoteCalendar().automaticHistory.runs[0], selection);
    assert.throws(() => git(parent, '--git-dir', remote, 'show', `main:content/archive/liverpool/${selection.slug}.md`));

    const second = retryCheckout('retry-deployment');
    assert.throws(() => run(second, '() => {}', "async () => { throw Error('synthetic deployment failure'); }"), error => error.stdout.includes('synthetic deployment failure'));
    const pending = remoteCalendar().automaticHistory.runs[0];
    assert.equal(pending.state, 'publication_pending');
    assert.equal(pending.rowId, selection.rowId); assert.equal(pending.manuscriptSha256, selection.manuscriptSha256);
    assert.equal(pending.verifiedAt, null);
    assert.ok(git(parent, '--git-dir', remote, 'show', `main:content/archive/liverpool/${selection.slug}.md`));

    const third = retryCheckout('retry-verification');
    const result = run(third, '() => {}', 'async run => ({route: "https://theliverpoolbrief.com/archive/"+run.slug, attempts: 1})');
    assert.ok(result.includes('no longer eligible'));
    assert.equal(remoteCalendar().automaticHistory.runs[0].state, 'succeeded');
    assert.equal(git(parent, '--git-dir', remote, 'rev-list', '--count', 'main'), '3', 'Only reservation, one publication and one verification commit');
    const before = git(parent, '--git-dir', remote, 'rev-parse', 'main');
    run(third, '() => { throw Error("must not check again"); }', 'async () => { throw Error("must not verify again"); }');
    assert.equal(git(parent, '--git-dir', remote, 'rev-parse', 'main'), before, 'Duplicate completed retry has no writes');
  } finally { fs.rmSync(parent, { recursive: true, force: true }); }
});
