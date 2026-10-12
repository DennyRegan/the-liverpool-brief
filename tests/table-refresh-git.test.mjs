import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { assertOnlyTableChanged } from '../scripts/lib/table-refresh-git.mjs';

test('publication guard accepts actual unstaged/staged table changes and rejects unrelated files', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'table-git-guard-'));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
  const file = 'content/match-centre/liverpool/2026-27.json';
  try {
    git('init'); git('config', 'user.name', 'Table test'); git('config', 'user.email', 'table-test@example.invalid');
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), '{}\n'); fs.writeFileSync(path.join(root, 'other.txt'), 'original');
    git('add', '.'); git('commit', '-m', 'Test baseline');
    assert.throws(() => assertOnlyTableChanged(root, file), /Only the current/);
    fs.appendFileSync(path.join(root, file), '\n');
    assert.ok(git('status', '--porcelain').startsWith(' M content/'), 'Reproduce the leading space stripped by the former trim()');
    assert.doesNotThrow(() => assertOnlyTableChanged(root, file));
    git('add', '--', file); assert.doesNotThrow(() => assertOnlyTableChanged(root, file));
    fs.appendFileSync(path.join(root, file), '\n'); assert.doesNotThrow(() => assertOnlyTableChanged(root, file));
    fs.writeFileSync(path.join(root, 'untracked.txt'), 'unexpected');
    assert.throws(() => assertOnlyTableChanged(root, file), /Only the current/);
    fs.unlinkSync(path.join(root, 'untracked.txt')); fs.appendFileSync(path.join(root, 'other.txt'), 'changed');
    assert.throws(() => assertOnlyTableChanged(root, file), /Only the current/);
    git('checkout', '--', 'other.txt'); git('mv', 'other.txt', 'renamed.txt');
    assert.throws(() => assertOnlyTableChanged(root, file), /Only the current/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
