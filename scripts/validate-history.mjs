import { getSeasons } from '../lib/content/seasons.ts';
import fs from 'node:fs';
import { validateCalendar, calendarPath } from './validate-editorial-calendar.mjs';
import { getHistoryEntities } from '../lib/content/entities.ts';
import { getHistoryEvents } from '../lib/content/this-week.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { getHistory, getArticleEraIds, getEraImage } from '../lib/content/history.ts';
const events = getHistoryEvents();
console.log(`Validated ${events.length} history entries.`);
const history = getHistory();
const entities = getHistoryEntities();
console.log(`Validated ${entities.length} canonical history entities.`);
const articles = getArchiveFeatures();
for (const article of articles) {
  const ids = getArticleEraIds(article, history.eras);
  if (!ids.length) console.warn(`History: ${article.slug} has no era association; add historyEras if it belongs in this guide.`);
}
for (const era of history.eras) {
  if (era.image && !getEraImage(era)) console.warn(`History: missing ${era.image.src}; using the monogram for ${era.id}.`);
}
console.log(`Validated ${history.eras.length} managerial eras and ${articles.length} canonical Archive associations.`);

console.log(`Validated ${getSeasons().length} structured season records.`);
console.log(`Validated ${validateCalendar(JSON.parse(fs.readFileSync(calendarPath, 'utf8'))).length} shared editorial calendar entries.`);

// The loader remains a server-only module; Node CLI validation has no browser graph.
await import("./register-server-only.mjs");
const { getPublishedExperiences } = await import("../lib/content/interactive-history.ts");
console.log(`Validated ${getPublishedExperiences().length} published interactive experiences.`);
