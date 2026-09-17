// Run against the local production build after npm run build.
import assert from 'node:assert/strict';
import { getExplorations, articleExplorationLinks, groupExplorationArticles, personSections, personEras } from '../lib/content/exploration.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { getHistory } from '../lib/content/history.ts';
const origin=process.env.BASE_URL ?? 'http://127.0.0.1:3152';
const mainOf=html=>html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]??'';
const links=html=>[...html.matchAll(/href="(\/[^"?#]+)"/g)].map(m=>m[1].replaceAll('&amp;','&'));
const destinations=getExplorations(), seen=new Set();
async function get(route,status=200){const r=await fetch(origin+route);assert.equal(r.status,status,route);return r.text();}
for(const d of destinations){
 const html=await get(d.href), main=mainOf(html);assert.equal((main.match(/<h1\b/g)??[]).length,1,d.href);
 assert.ok(html.includes(`href="https://theliverpoolbrief.com${d.href}"`),'canonical '+d.href);
 const actual=links(main).filter(h=>h.startsWith('/archive/'));
 const sections=d.entity.kind==='person'?personSections(d):[{articles:d.articles}];
 const expected=sections.flatMap(s=>groupExplorationArticles(s.articles).flatMap(g=>g.articles.map(a=>'/archive/'+a.slug)));
 assert.deepEqual(actual,expected,d.href+' exact article order and deduplication');assert.equal(new Set(actual).size,actual.length);
 assert.ok(!main.includes('/archive/torres-goodison-derby-double-2008'));
 for(const era of personEras(d.entity,getHistory().eras))assert.ok(links(main).includes('/history/'+era.id));
 for(const href of links(main))seen.add(href);
}
for(const a of getArchiveFeatures()){
 const main=mainOf(await get('/archive/'+a.slug));
 const panel=main.match(/<nav\b[^>]*aria-labelledby="explore-history-heading"[^>]*>([\s\S]*?)<\/nav>/)?.[1]??'';
 assert.deepEqual(links(panel),articleExplorationLinks(a,destinations).map(l=>l.href),a.slug);
 assert.ok(links(panel).length<=5);
}
for(const path of ['/history/players','/history/opposition','/history/competitions','/history'])for(const href of links(mainOf(await get(path))))seen.add(href);
for(const href of seen)await get(href);
for(const path of ['/history/people/unknown','/history/people/dixie-dean','/history/people/everton','/history/opposition/hull-city','/history/competitions/intercontinental-cup','/history/opposition/unknown','/history/competitions/unknown','/archive/torres-goodison-derby-double-2008'])await get(path,404);
console.log(`PASS ${destinations.length} entity destinations, ${getArchiveFeatures().length} article exploration panels, ${seen.size} linked routes, ordering, deduplication, canonical tags and eight excluded routes`);
