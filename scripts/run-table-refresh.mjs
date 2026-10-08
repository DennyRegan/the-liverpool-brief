import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { updateLeagueTable } from './lib/update-league-table.mjs';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const summary = text => { console.log(text); if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n\n`); };
const write = process.argv.includes('--write');
try {
  assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Use npm run table:refresh locally');
  assert.equal(process.env.GITHUB_REPOSITORY, 'DennyRegan/the-liverpool-brief');
  assert.ok(['schedule', 'workflow_dispatch'].includes(process.env.GITHUB_EVENT_NAME));
  if (write) assert.equal(process.env.GITHUB_REF, 'refs/heads/main', 'Automatic writes require reviewed main');
  assert.equal(git('status', '--porcelain'), '', 'Use a clean checkout');
  const base = git('rev-parse', 'HEAD');
  const result = await updateLeagueTable(process.cwd(), { write });
  if (!result.changed) summary('League table unchanged. No commit or deployment.');
  else if (!write) summary(`Dry run: validated ${result.changes.length} changed clubs and ${result.updatedFixtures.length} sourced league results; no files, commits or deployments changed.`);
  else {
    for (const args of [['scripts/validate-history.mjs'], ['--test', 'tests/update-league-table.test.mjs', 'tests/prepare-league-table.test.mjs']]) execFileSync(process.execPath, args, { stdio: 'inherit' });
    for (const args of [['test'], ['run', 'lint'], ['run', 'build']]) execFileSync('npm', args, { stdio: 'inherit' });
    const file = `content/match-centre/liverpool/${result.proposal.season}.json`;
    const changes = git('status', '--porcelain', '--untracked-files=all').split('\n').filter(Boolean).map(line => line.slice(3));
    assert.deepEqual(changes, [file], 'Only the current Match Centre register may change');
    git('fetch', 'origin', 'main');
    assert.equal(git('rev-parse', 'origin/main'), base, 'Main changed during checks; retry next run, never overwrite it');
    git('add', '--', file);
    git('commit', '-m', `Match Centre: refresh verified Premier League table (${result.proposal.table.asOf})`);
    git('push', 'origin', 'HEAD:refs/heads/main');
    summary(`Committed ${git('rev-parse', 'HEAD')}: all 20 clubs; ${result.changes.length} changed, ${result.updatedFixtures.length} verified Liverpool league results. Existing Vercel Git integration handles the normal main deployment.`);
  }
} catch (error) {
  summary(`League table refresh STOPPED: ${error.message}. No invalid source is published; inspect this run and retry after the source/editorial mismatch is resolved.`);
  process.exitCode = 1;
}
