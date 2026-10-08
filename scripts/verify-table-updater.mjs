// Deterministic safety checks; the live fetch is a separate explicit manual check.
import { execFileSync } from 'node:child_process';
execFileSync(process.execPath, ['--test', 'tests/update-league-table.test.mjs', 'tests/prepare-league-table.test.mjs'], { stdio: 'inherit' });
console.log('PASS table updater: complete candidates, result/table agreement, safe failures and atomic replacement. To inspect the current public source without writing: npm run table:refresh -- --check');
