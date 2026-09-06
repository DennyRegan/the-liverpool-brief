import { getHistoryEvents } from '../lib/content/this-week.ts';
const events = getHistoryEvents();
console.log(`Validated ${events.length} history entries.`);
