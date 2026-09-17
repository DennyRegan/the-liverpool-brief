// Optional local browser checks: see the implementation handover for isolated tool setup.
import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(path.join(process.env.INTERACTIVE_BROWSER_TOOLS ?? process.cwd(), 'package.json'));
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
import assert from 'node:assert/strict';
import fs from 'node:fs';
const artifactDirectory = path.resolve(process.env.INTERACTIVE_BROWSER_OUTPUT ?? '.interactive-history-checks');
fs.mkdirSync(artifactDirectory, { recursive: true });
const artifact = name => path.join(artifactDirectory, name);
const base = process.env.INTERACTIVE_PREVIEW_URL ?? 'http://127.0.0.1:3145/preview/interactive-history/istanbul-2005';
const browser=await chromium.launch();const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();const results=[];
const pass=s=>{results.push(s);console.log('PASS '+s)};
const ready=async(hash='')=>{await page.goto(base+hash);await page.locator('[data-enhanced="true"]').waitFor();await page.waitForTimeout(150)};
try{
await ready();await page.getByRole('link',{name:'Go to half-time',exact:true}).click();assert.equal(await page.evaluate(()=>location.hash),'#half-time');pass('Introduction shortcut reaches half-time');await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
// Passive scroll follows history only in the existing full-story reading mode.
await page.getByRole('button',{name:'Read the full story',exact:true}).click();
let length=await page.evaluate(()=>history.length);
await page.locator('#gerrard').evaluate(e=>window.scrollTo(0,window.scrollY+e.getBoundingClientRect().top-90));await page.waitForFunction(()=>location.hash==='#gerrard');assert.equal(await page.evaluate(()=>history.length),length);pass('Passive skipped-heading scroll replaces fragment without history entry');
await ready('#shootout-5');await page.getByRole('button',{name:'Read the full story',exact:true}).click();await page.locator('#half-time').evaluate(e=>window.scrollTo(0,window.scrollY+e.getBoundingClientRect().top-90));await page.waitForFunction(()=>location.hash==='#half-time');
await page.locator('#shootout').evaluate(e=>window.scrollTo(0,window.scrollY+e.getBoundingClientRect().top-90));await page.waitForFunction(()=>location.hash==='#shootout-5');assert.equal(await page.locator('.ih-shootout-enhancement .ih-attempts li').count(),5);pass('Passive penalty re-entry retains fifth attempt');
await page.locator('[data-state-bar]').getByRole('link',{name:'Moments'}).click();await page.locator('#moment-index').getByRole('link',{name:'The shoot-out',exact:true}).last().click();assert.equal(await page.locator('.ih-shootout-enhancement .ih-attempts li').count(),0);pass('Explicit penalty entry resets retained cursor');
await page.locator('[data-outcome-disclosure] > summary').click();const before=await page.evaluate(()=>history.length);await page.locator('#champions').evaluate(e=>window.scrollTo(0,window.scrollY+e.getBoundingClientRect().top-90));await page.waitForTimeout(100);assert.notEqual(await page.evaluate(()=>location.hash),'#champions');assert.equal(await page.evaluate(()=>history.length),before);assert.equal(await page.locator('.ih-shootout-enhancement .ih-attempts li').count(),0);pass('Opening and scrolling early aftermath never concludes the shoot-out');
await ready('#shootout-9');await page.locator('[data-state-bar]').getByRole('link',{name:'Moments'}).click();await page.locator('#moment-index').getByRole('link',{name:'The shoot-out',exact:true}).last().click();assert.doesNotMatch(await page.locator('.ih-shootout-enhancement [role="status"]').textContent(),/win|complete/i);pass('Reset removes stale winner announcement');
await ready('#half-time');const name=await page.evaluate(()=>document.activeElement?.id);await page.setViewportSize({width:768,height:850});assert.equal(await page.evaluate(()=>location.hash),'#half-time');assert.equal(await page.evaluate(()=>document.activeElement?.id),name);pass('Resize preserves moment and focus');
await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('clipboard unavailable'))},configurable:true}));await page.getByRole('button',{name:'Copy link to this moment'}).click();assert.match(await page.locator('.ih-copy-status > span').innerText(),/#half-time$/);pass('Clipboard failure shows selectable complete moment URL');await page.getByRole('button',{name:'Dismiss link message'}).click();
await ready('#not-a-moment');assert.equal(await page.evaluate(()=>location.hash),'');assert.match(await page.locator('[data-state-bar]').textContent(),/0–0/);pass('Unknown fragment recovers at introduction');
await ready('#source-s2');assert.equal(await page.locator('[data-state-bar]').evaluate(e=>getComputedStyle(e).visibility),'hidden');assert.equal(await page.locator('.ih-source-catalogue details').getAttribute('open'),'');pass('Fresh source deep link resolves without historical jump');
await ready('#half-time');await page.setViewportSize({width:390,height:844});
let axe=await new AxeBuilder({page}).include('.ih-experience').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();assert.equal(axe.violations.length,0,JSON.stringify(axe.violations.map(v=>v.id)));pass('Axe WCAG A/AA scan has no violations');
await page.getByRole('button',{name:'At the restart',exact:true}).click();const comparison=page.locator('.ih-comparison').filter({has:page.getByRole('button',{name:'At the restart',exact:true})});await comparison.scrollIntoViewIfNeeded();await page.screenshot({path:artifact('istanbul-restart-comparison-mobile.png')});
await ready('#shootout-5');await page.screenshot({path:artifact('istanbul-penalties-mobile.png')});
for(const hash of ['#half-time','#shootout-5']){
const slow=await browser.newContext({viewport:{width:390,height:844}});const p=await slow.newPage();let release;const gate=new Promise(r=>release=r);
await p.route('**/_next/**/*.js',async route=>{await gate;await route.continue()});await p.goto(base+hash,{waitUntil:'commit'});await p.locator('#shootout-5').waitFor({state:'attached'});
assert.equal(await p.locator('[data-enhanced="false"]').count(),1);assert.match(await p.locator('[data-state-bar]').innerText(),/Explore the match/i);assert.equal(await p.locator('.ih-full-record').getAttribute('open'),null);assert.equal(await p.locator('.ih-shootout-enhancement').isVisible(),false);release();await p.locator('[data-enhanced="true"]').waitFor();await p.waitForTimeout(100);assert.equal(await p.evaluate(()=>location.hash),hash);await slow.close();
}pass('Delayed hydration shows neutral state and no premature penalty record');
const perf=await browser.newContext({viewport:{width:390,height:844}});const perfPage=await perf.newPage();await perfPage.addInitScript(()=>{window.__metrics={cls:0,lcp:null,events:[]};new PerformanceObserver(list=>{for(const e of list.getEntries()) if(!e.hadRecentInput) window.__metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{window.__metrics.lcp=list.getEntries().at(-1)?.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{window.__metrics.events.push(...list.getEntries().filter(e=>e.interactionId).map(e=>({name:e.name,duration:e.duration})))}).observe({type:'event',buffered:true,durationThreshold:16});});
await perfPage.goto(base);await perfPage.locator('[data-enhanced="true"]').waitFor();await perfPage.waitForTimeout(400);let loadMetrics=await perfPage.evaluate(()=>window.__metrics);
await perfPage.getByRole('link',{name:'Go to half-time',exact:true}).click();await perfPage.getByRole('button',{name:'At the restart',exact:true}).click();await perfPage.locator('[data-state-bar]').getByRole('link',{name:'Moments'}).click();await perfPage.locator('#moment-index').getByRole('link',{name:'The shoot-out',exact:true}).last().click();await perfPage.locator('.ih-penalty-controls > button').click();await perfPage.waitForTimeout(100);const metrics=await perfPage.evaluate(()=>window.__metrics);await perf.close();
console.log('METRICS '+JSON.stringify({loadMetrics,metrics}));fs.writeFileSync(artifact('browser-edge-results.json'),JSON.stringify({checks:results,axeViolations:[],performance:{environment:'Warm local development preview, Chromium, 390x844; no mobile CPU/network throttle; not field INP or production LCP',loadMetrics,metrics}},null,2));
}finally{await browser.close()}
