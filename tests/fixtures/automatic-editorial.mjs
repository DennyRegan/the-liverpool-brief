import fs from 'node:fs';
import path from 'node:path';
import { readCalendar, saveCalendar } from '../../scripts/automatic-history-publisher.mjs';
import { allRows } from '../../scripts/automatic-history-state.mjs';

// Reconstruct the preserved manuscript fixture after real automatic releases.
// Test fixtures must not eventually become empty merely because production succeeds.
export function restoreAutomaticStock(root) {
  const calendar = readCalendar(root);
  for (const run of calendar.automaticHistory?.runs ?? []) {
    if (!run.rowId) continue;
    const row = allRows(calendar).find(r => r.id === run.rowId);
    if (row.publishedDestination === `/archive/${run.slug}`) {
      fs.rmSync(path.join(root, `content/archive/liverpool/${run.slug}.md`), { force: true });
      row.publishedDestination = null;
      row.status = 'ready_for_review';
    }
  }
  if (calendar.automaticHistory) calendar.automaticHistory.runs = [];
  saveCalendar(root, calendar);
}
