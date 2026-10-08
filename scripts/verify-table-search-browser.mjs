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
    assert.equal(await page.locator('.mc-table tbody tr').count(), 20);
    assert.deepEqual(await page.locator('.mc-table thead th').allTextContents(), ['Pos', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts']);
    const region = page.getByRole('region', { name: 'Premier League standings', exact: true });
    await region.focus(); assert.equal(await region.evaluate(e => e === document.activeElement), true);
    await page.keyboard.press('ArrowRight');
    if (width < 768) await page.waitForFunction(() => document.querySelector('.mc-table-scroll')?.scrollLeft > 0, null, { timeout: 2000 });
    // Allow the native scroll animation to finish before resetting for capture.
    await page.waitForTimeout(600);
    if (width < 768) {
      assert.ok(await page.locator('.mc-table thead th').nth(1).evaluate(e => e.getBoundingClientRect().width <= 180), 'Pinned team column leaves statistics visible');
      await region.evaluate(e => { e.scrollLeft = e.scrollWidth; });
      assert.ok(await page.locator('.mc-table thead th').last().evaluate(e => e.getBoundingClientRect().right <= innerWidth), 'Points column reachable by scrolling');
      await region.screenshot({ path: path.join(output, `table-scrolled-${width}.png`) });
    }
    await region.evaluate(e => { e.scrollLeft = 0; });
    await page.locator('section[aria-labelledby="league-table"]').screenshot({ path: path.join(output, `table-${width}.png`) });
    let violations = (await new AxeBuilder({ page }).include('section[aria-labelledby="league-table"]').analyze()).violations;
    assert.deepEqual(violations.map(v => v.id), [], `Table accessibility ${width}`);
    await page.locator('.masthead-tools').getByRole('link', { name: 'Search', exact: true }).click();
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
    checks.push({ width, tableRows: 20, noPageOverflow: true, keyboard: true, accessibilityViolations: 0 });
    await context.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await context.newPage(); await page.goto(base + '/search');
  await page.getByRole('searchbox').fill('European Cup'); await page.getByRole('button', { name: 'Search', exact: true }).click();
  await page.waitForURL(/q=European/); assert.match(await page.locator('.search-results').innerText(), /European Cup/);
  await context.close(); assert.deepEqual(errors, [], 'No browser runtime errors');
  fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify({ checks, noJavaScriptSearch: true, errors }, null, 2));
  console.log('PASS desktop/mobile 320/390/768/1280: complete table, contained scrolling, keyboard, Search/results/no-results, no-JavaScript search, zero table/Search axe violations and no runtime errors.');
} finally { await browser.close(); }
