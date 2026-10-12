import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

/** Preserve porcelain status columns and literal paths, including whitespace. */
export function assertOnlyTableChanged(root, filename) {
  const status = execFileSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all'], { cwd: root, encoding: 'utf8' });
  const paths = status.split('\0').filter(Boolean).map(record => record.slice(3));
  assert.deepEqual(paths, [filename], 'Only the current Match Centre register may change');
}
