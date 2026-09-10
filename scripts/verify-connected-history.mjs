// Run against an already running build: BASE_URL=http://127.0.0.1:3130 node scripts/verify-connected-history.mjs
// This script only reads content and HTTP responses; it never starts a server or changes articles.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { getHistory, getEraArticles } from '../lib/content/history.ts';
import { getHistoryEvents, getHistoryWindow, getWeekReading } from '../lib/content/this-week.ts';

const origin = process.env.BASE_URL || 'http://127.0.0.1:3130';
const articles = getArchiveFeatures();
const slugs = new Set(articles.map(article => article.slug));
const { eras } = getHistory();
const mainOf = html => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
const archiveLinks = html => [...html.matchAll(/href="\/archive\/([^"?#]+)"/g)].map(match => match[1]);
const textOf = html => html.replace(/<[^>]+>/g, '').trim();
const get = async route => {
  const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.match(html, /id="main-content"/, `${route}: existing main landmark`);
  return html;
};

let recommendationCount = 0;
for (const article of articles) {
  const route = `/archive/${article.slug}`;
  const main = mainOf(await get(route));
  assert.equal((main.match(/<h1\b/g) ?? []).length, 1, `${route}: one article heading`);
  assert.match(main, /class="article-body"/, `${route}: original Markdown article renders`);
  const sections = [...main.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)]
    .map(match => match[0]).filter(section => /class="[^"]*\barchive-discovery\b/.test(section));
  assert.ok(sections.length <= 1, `${route}: one discovery section`);
  if (!sections.length) continue;
  const section = sections[0];
  assert.match(section, /id="continue-exploring"/, `${route}: stable accessible discovery heading`);
  assert.match(section, /<h2\b[^>]*>Continue exploring<\/h2>/, `${route}: editorial heading`);
  assert.ok(main.indexOf(section) > main.indexOf('class="article-body"'), `${route}: related reading follows the article`);
  const cards = [...section.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
  assert.ok(cards.length >= 1 && cards.length <= 3, `${route}: a small number of recommendations`);
  const related = cards.map(card => {
    const links = archiveLinks(card);
    assert.equal(links.length, 1, `${route}: each card has one canonical Archive link`);
    assert.ok(slugs.has(links[0]), `${route}: recommendation resolves to an existing article`);
    assert.notEqual(links[0], article.slug, `${route}: never recommends itself`);
    assert.match(card, /<h3\b/, `${route}: recommendation title is a heading`);
    const reason = card.match(/<p\b[^>]*class="[^"]*\barchive-discovery-reason\b[^>]*>([\s\S]*?)<\/p>/)?.[1];
    assert.ok(reason && textOf(reason), `${route}: recommendation explains its relationship`);
    assert.doesNotMatch(textOf(reason), /\b(?:playerIds|managerIds|oppositionIds|competitionIds|locationIds|themeIds|historyEras)\b/, `${route}: reasons use editorial labels`);
    return links[0];
  });
  assert.equal(related.length, new Set(related).size, `${route}: no duplicate recommendations`);
  recommendationCount += cards.length;
  console.log(`PASS ${route}: ${cards.length} unique related articles with reasons`);
}
assert.ok(recommendationCount > 0, 'The migrated real articles expose meaningful related reading');

const history = mainOf(await get('/history'));
for (const era of eras) {
  assert.ok(history.includes(`href="/history/${era.id}"`), `History retains the ${era.id} destination`);
  const html = await get(`/history/${era.id}`);
  assert.equal((mainOf(html).match(/<h1\b/g) ?? []).length, 1, `${era.id}: one era heading`);
  assert.ok(html.includes(`href="https://theliverpoolbrief.com/history/${era.id}"`), `${era.id}: canonical History URL`);
  assert.deepEqual(archiveLinks(mainOf(html)), getEraArticles(articles, era.id, eras).map(article => article.slug), `${era.id}: existing canonical Archive selection, once each`);
}
console.log(`PASS History landing and all ${eras.length} existing era routes`);

const week = mainOf(await get('/this-week'));
const firstDay = week.match(/<time\b[^>]*datetime="(\d{4}-\d{2}-\d{2})"/i)?.[1];
assert.ok(firstDay, 'This Week renders its current calendar window');
assert.equal(new Date(`${firstDay}T12:00:00Z`).getUTCDay(), 1, 'This Week always starts on Monday');
// Match the rendered window itself, so a London midnight during verification cannot create a false failure.
const days = getHistoryWindow(getHistoryEvents(), new Date(`${firstDay}T12:00:00Z`));
assert.match(week, new RegExp(`datetime="${days[6].iso}"`, 'i'), 'This Week range ends on Sunday');
assert.doesNotMatch(week, /No event selected\./, 'No empty day cards');
const renderedDays = [...week.matchAll(/aria-labelledby="day-(\d{4}-\d{2}-\d{2})"/g)].map(match => match[1]);
assert.deepEqual(renderedDays, days.filter(day => day.events.length > 0).map(day => day.iso), 'Only populated dates inside the fixed week render');
const expectedWeekLinks = new Set([
  ...days.flatMap(day => day.events.flatMap(event => event.archiveSlug ? [event.archiveSlug] : [])),
  ...getWeekReading(articles, days).map(article => article.slug),
]);
const actualWeekLinks = new Set(archiveLinks(week));
assert.deepEqual(actualWeekLinks, expectedWeekLinks, 'This Week preserves its automatic and editorial Archive connections');
for (const slug of actualWeekLinks) assert.ok(slugs.has(slug), `This Week canonical article exists: ${slug}`);
console.log(`PASS This Week and ${actualWeekLinks.size} current Archive connections`);

const opinionSlugs = fs.readdirSync('content/articles/liverpool').filter(name => name.endsWith('.md')).map(name => name.slice(0, -3));
for (const slug of opinionSlugs) {
  const main = mainOf(await get(`/articles/${slug}`));
  assert.ok(!main.includes('archive-discovery'), `Opinion ${slug}: historical discovery stays within Archive`);
}
const routes = ['/', '/brief', '/articles', '/articles?category=archive', '/articles?category=opinion', '/archive', '/archive/matches', '/archive/people', '/archive/seasons', '/about'];
for (const route of routes) await get(route);
for (const route of ['/archive/connected-history-missing-fixture', '/history/connected-history-missing-fixture']) {
  const response = await fetch(new URL(route, origin), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 404, `${route}: unknown routes remain unavailable`);
}
console.log(`PASS all ${opinionSlugs.length} Opinion URLs, ${routes.length} existing collection/navigation routes and 2 missing routes`);
console.log(`PASS connected History HTTP regression against ${origin}`);
