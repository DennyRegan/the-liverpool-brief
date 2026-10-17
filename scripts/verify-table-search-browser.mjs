// Optional tools installed outside production dependencies; see docs/search.md.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require = createRequire(path.join(process.env.TABLE_SEARCH_BROWSER_TOOLS ?? process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const base = process.env.BASE_URL ?? 'http://127.0.0.1:3155';
const output = path.resolve(process.env.TABLE_SEARCH_BROWSER_OUTPUT ?? '.table-search-checks');
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [], checks = [];
try {
  for (const width of [320, 390, 768, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    await context.route(`${base}/_vercel/insights/script.js*`, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
    const page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/match-centre');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Match Centre page overflow at ${width}`);
    assert.equal(await page.locator('h1').innerText(), 'Match writing');
    assert.equal(await page.locator('.mc-table, .mc-fixture, .mc-score, #league-table').count(), 0);
    assert.equal(await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Match Centre', exact: true }).count(), 0);
    await page.screenshot({ path: path.join(output, `match-writing-${width}.png`), fullPage: true });
    let violations = (await new AxeBuilder({ page }).include('main').analyze()).violations;
    assert.deepEqual(violations.map(v => v.id), [], `Match writing accessibility ${width}`);
    await page.goto(base + '/articles');
    assert.equal(await page.getByRole('navigation', { name: 'Article types', exact: true }).getByRole('link').count(), 5);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Articles page overflow at ${width}`);
    assert.equal(await page.locator('.mc-fixture, .mc-score, #league-table').count(), 0);
    const featured = page.locator('.featured-article');
    assert.ok(await featured.evaluate(element => {
      const heading = element.querySelector('h2'), context = element.querySelector('.article-match-context');
      return !context || Boolean(heading.compareDocumentPosition(context) & Node.DOCUMENT_POSITION_FOLLOWING);
    }), 'Headline precedes match context');
    await page.screenshot({ path: path.join(output, `articles-top-${width}.png`) });
    violations = (await new AxeBuilder({ page }).include('main').analyze()).violations;
    assert.deepEqual(violations.map(v => v.id), [], `Articles accessibility ${width}`);
    await page.getByRole('navigation', { name: 'Article types', exact: true }).getByRole('link', { name: 'Previews', exact: true }).click();
    assert.match(await page.locator('main').innerText(), /Liverpool face unbeaten Brentford/);
    await page.goto(base + '/');
    assert.equal(await page.getByRole('navigation', { name: 'Explore more', exact: true }).getByRole('link', { name: 'Match writing', exact: true }).count(), 0);
    await page.screenshot({ path: path.join(output, `home-top-${width}.png`) });
    await page.locator('.masthead-tools').getByRole('link' , { name: 'Search', exact: true }).click();
    await page.getByRole('searchbox', { name: 'Search the site' }).fill('Bob Paisley');
    await page.getByRole('searchbox').press('Enter'); await page.waitForURL(/q=Bob/);
    assert.match(await page.locator('.search-results').innerText(), /Bob Paisley/);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Search page overflow at ${width}`);
    await page.screenshot({ path: path.join(output, `search-${width}.png`), fullPage: true });
    violations = (await new AxeBuilder({ page }).include('main').analyze()).violations;
    assert.deepEqual(violations.map(v => v.id), [], `Search accessibility ${width}`);
    await page.getByRole('searchbox').focus(); await page.keyboard.press('Tab');
    assert.equal(await page.getByRole('button', { name: 'Search', exact: true }).evaluate(e => e === document.activeElement), true);
    await page.getByRole('searchbox').fill('zzqnomatchzzq'); await page.getByRole('searchbox').press('Enter'); await page.waitForURL(/q=zzq/);
    assert.match(await page.locator('main').innerText(), /No results/);
    checks.push({ width, dataWidgets: 0, noPageOverflow: true, keyboard: true, accessibilityViolations: 0 });
    await context.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage(); await page.goto(base + '/search');
  await page.getByRole('searchbox').fill('European Cup'); await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.waitForURL(/q=European/); assert.match(await page.locator('.search-results').innerText(), /European Cup/);
  await context.close(); assert.deepEqual(errors, [], 'No browser runtime errors');
  fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify({ checks, noJavaScriptSearch: true, errors }, null, 2));
  console.log('PASS desktop/mobile 320/390/768/1280: match writing without data widgets, keyboard, Search/results/no-results, no-JavaScript search, zero Articles/match-writing/Search axe violations and no runtime errors.');
} finally { await browser.close(); }
