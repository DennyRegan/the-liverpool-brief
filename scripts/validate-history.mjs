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
