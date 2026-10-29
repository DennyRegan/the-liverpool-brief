// Read-only commissioning preflight: never writes manuscripts, claims or approvals.
import fs from 'node:fs';
import { getHistoryLibrary } from '../lib/content/history-library.ts';
import { preparationWeeks } from '../lib/content/weekly-history.ts';
import { calendarDate } from '../lib/content/on-this-day.ts';
const asOf = process.argv[2];
if (asOf !== undefined && calendarDate(asOf).invalid) throw new Error('Expected YYYY-MM-DD');
const now = asOf ? new Date(`${asOf}T12:00:00Z`) : new Date();
const weeks = preparationWeeks(now);
const library = getHistoryLibrary();
const calendarPath = 'docs/editorial/history-calendar.json';
const calendar = fs.existsSync(calendarPath) ? JSON.parse(fs.readFileSync(calendarPath, 'utf8')) : null;
if (calendar && (calendar.version !== 1 || calendar.timezone !== 'Europe/London' || !Array.isArray(calendar.entries))) throw new Error('Expected the existing v1 Europe/London editorial calendar');
const archiveFile = 'prototype/match-review/manifest.json';
const stock = fs.existsSync(archiveFile) ? JSON.parse(fs.readFileSync(archiveFile, 'utf8')).reports.filter(r => r.included) : [];
const dateInWeek = (historicalDate, week) => {
  for (let day = new Date(`${week.start}T12:00:00Z`); day.toISOString().slice(0, 10) <= week.end; day.setUTCDate(day.getUTCDate() + 1)) {
    const iso = day.toISOString().slice(0, 10);
    if (historicalDate <= iso && historicalDate.slice(5) === iso.slice(5)) return iso;
  }
};
console.log(JSON.stringify({
  mode: 'read-only preflight; no commissioning or publication',
  calendarPath,
  readyForResearch: false,
  blocker: calendar ? 'Confirm this is the approved canonical calendar and reconcile ownership against its current authoritative revision before claiming work.' : 'The canonical commissioning calendar is absent. Restore and reconcile it with explicit approval before research starts. Do not invent a replacement calendar.',
  weeks: weeks.map(week => ({ ...week,
    approvedWriting: library.events.filter(e => dateInWeek(e.date, week)).map(e => ({ id: e.id, anniversary: dateInWeek(e.date, week), href: e.href })),
    existingCalendarRows: (calendar?.entries ?? []).filter(e => e.historicalEventDate && dateInWeek(e.historicalEventDate, week)).map(e => ({ id: e.id, status: e.status, draftPath: e.draftPath, owner: e.owner, approval: e.approval ? 'recorded historically; recheck against reset and current approval' : null })),
    preservedMatchCandidates: stock.filter(e => dateInWeek(e.historicalEventDate, week)).map(e => ({ slug: e.slug, historicalEventDate: e.historicalEventDate, anniversary: dateInWeek(e.historicalEventDate, week), localPath: e.localPath, currentStatus: e.status, instruction: 'Inspect and reuse if suitable; not newly verified or approved. Do not rewrite an existing completed manuscript.' })),
  })),
  researchScope: ['significant matches and goals', 'birthdays', 'managerial events', 'other worthwhile Liverpool anniversaries'],
  publishing: 'Manual explicit approval only; automatic publication remains disabled.',
}, null, 2));
