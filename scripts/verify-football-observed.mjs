import assert from 'node:assert/strict';
import { getReganOnFootballEditions, REGAN_ON_FOOTBALL_PATH } from '../lib/content/regan-on-football.ts';
import { getEditionContents } from '../lib/edition-contents.ts';
import { getArticles } from '../lib/content/articles.ts';
import { getWriting } from '../lib/content/writing.ts';
import { selectHomePage } from '../lib/content/homepage.ts';
import { getHomeLeadOverride } from '../lib/content/homepage-config.ts';
import { SITE_URL } from '../lib/site.ts';
const base = process.env.BASE_URL || 'http://127.0.0.1:3159';
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
async function page(route) {
  const response = await fetch(new URL(route, base), { redirect: 'manual' });
  assert.equal(response.status, 200, route);
  return (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
}
const editions = getReganOnFootballEditions();
const home = await page('/');
const landing = await page(REGAN_ON_FOOTBALL_PATH);
const all = await page('/articles');
const mainNavigation = home.match(/<nav aria-label="Main navigation">([\s\S]*?)<\/nav>/)?.[1] ?? '';
assert.ok(mainNavigation.includes('href="/regan-on-football"'));
assert.ok(!mainNavigation.includes('href="/about"'));
assert.ok(/<footer\b[\s\S]*href="\/about"/.test(home));
await page('/about');
assert.match(all, /href="\/regan-on-football"/);
assert.ok(/<a\b(?=[^>]*href="\/regan-on-football")(?=[^>]*aria-current="page")[^>]*>/.test(landing), 'Column category is selected');
const { lead, column, more } = selectHomePage(getWriting(), new Date(), getHomeLeadOverride());
if (lead) assert.ok(home.includes(`<h1><a href="${lead.href}">${escape(lead.title)}</a></h1>`));
const expectedCards = [lead, column, ...more].filter(Boolean);
const renderedCards = [...home.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]);
assert.equal(renderedCards.length, expectedCards.length);
assert.ok(renderedCards.length <= 4);
assert.ok(!home.includes('href="/history'), 'Homepage has no History links');
for (const article of expectedCards) assert.equal(renderedCards.filter(card => card.includes(`href="${article.href}"`)).length, 1, `Homepage card count for ${article.href}`);
if (editions.length) {
  assert.equal(home.includes('class="home-observed"'), Boolean(column));
  if (lead && column) assert.ok(home.indexOf('class="home-lead"') < home.indexOf('class="home-observed"'));
  if (column && more.length) assert.ok(home.indexOf('class="home-observed"') < home.indexOf('class="home-recent"'));
  assert.ok(landing.includes(escape(editions[0].title)));
  assert.equal(landing.includes('id="previous-editions-heading"'), editions.length > 1);
  const recent = home.split('class="home-recent"')[1] || '';
  assert.ok(!recent.includes(`/articles/${editions[0].slug}`));
} else {
  assert.ok(!home.includes('class="home-observed"'));
  assert.match(landing, /The first edition will appear here when published/);
}
let checked = 4;
for (const edition of editions) {
  const route = `/articles/${edition.slug}`;
  const html = await page(route);
  checked++;
  assert.ok(html.includes(`rel="canonical" href="${SITE_URL}${route}"`));
  assert.ok(html.includes('aria-label="Football Observed editions"'));
  for (const section of getEditionContents(edition.body, edition.title)) {
    assert.ok(html.includes(`href="#${section.id}"`), `Missing contents link ${section.id}`);
    assert.ok(html.includes(`id="${section.id}"`), `Missing target ${section.id}`);
    assert.ok(landing.includes(`href="${route}#${section.id}"`) || edition !== editions[0]);
  }
}
const ordinary = getArticles().find(a => !editions.some(e => e.slug === a.slug));
if (ordinary) {
  const html = await page(`/articles/${ordinary.slug}`);
  assert.ok(!html.includes('aria-label="In this edition"'));
  assert.ok(!html.includes('aria-label="Football Observed editions"'));
  checked++;
}
console.log(`PASS: ${checked} routes; homepage journalism without duplicate cards or History links, Articles membership, published editions, contents targets, canonical URLs, ordinary article isolation.`);
