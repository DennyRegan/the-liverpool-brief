import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { getExplorations, deriveExplorations, personSections, groupExplorationArticles, historicalOrder, personEras, explorationSeasons, articleExplorationLinks } from '../lib/content/exploration.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { getHistoryEntities } from '../lib/content/entities.ts';
import { getHistory } from '../lib/content/history.ts';
import { getSeasons } from '../lib/content/seasons.ts';
const entity = (id, kind = 'person') => ({ id, label: id, kind });
const article = (slug, extra = {}) => ({slug, title:slug, excerpt:slug, body:slug, date:'2026-09-01', historicalPeriod:'1977', decade:'1970s', category:'match', articleType:'match', editorialMode:'factual', playerIds:['person'], ...extra});

test('thresholds count unique factual articles, combine roles, exclude unknown kinds and thin entities', () => {
 const a = article('a'), b = article('b',{playerIds:[],managerIds:['person']}), c=article('c',{managerIds:['person']});
 assert.equal(deriveExplorations([a,b], [entity('person')]).length,0);
 const d=deriveExplorations([a,a,b,c,article('opinion',{editorialMode:'opinion'}),article('unreviewed',{editorialMode:undefined})], [entity('person'),entity('unused'),entity('person-theme','theme')]);
 assert.equal(d.length,1);assert.equal(d[0].articles.length,3);assert.ok(d[0].articles.includes(a));
 const sections=personSections(d[0]);assert.deepEqual(sections.map(s=>[s.id,s.articles.map(a=>a.slug)]),[['player',['a']],['manager',['b']],['both',['c']]]);
});

test('opposition and competition automatically qualify at five distinct articles',()=>{
 const articles=Array.from({length:5},(_,i)=>article('a'+i,{oppositionIds:['club'],competitionIds:['cup']}));
 const entities=[entity('club','opposition'),entity('cup','competition')];
 assert.equal(deriveExplorations(articles.slice(0,4),entities).length,0);
 assert.deepEqual(deriveExplorations(articles,entities).map(d=>[d.href,d.articles.length]),[['/history/opposition/club',5],['/history/competitions/cup',5]]);
});

test('historical chronology ignores publication order; no-season careers stay outside season groups',()=>{
 const late=article('late',{season:'1987-88',historicalEventDate:'1988-01-01',date:'2020-01-01'}),early=article('early',{season:'1987-88',historicalEventDate:'1987-09-01',date:'2026-01-01'}),career=article('career',{historicalEventDate:'1981-05-27'});
 assert.deepEqual([late,early].sort(historicalOrder).map(a=>a.slug),['early','late']);
 const groups=groupExplorationArticles([career,late,early]);assert.deepEqual(groups.map(g=>g.id),['1987-88','wider-history']);assert.equal(groups[1].articles[0],career);
 assert.ok(historicalOrder(article('old',{date:'2000-01-01'}),article('new'))<0);
});

test('only existing Season records link; canonical manager names resolve both Dalglish spells and joint tenures',()=>{
 const eras=getHistory().eras,entities=getHistoryEntities();
 assert.deepEqual(personEras(entities.find(e=>e.id==='kenny-dalglish'),eras).map(e=>e.id),['kenny-dalglish-1985-1991','kenny-dalglish-2011-2012']);
 assert.ok(personEras(entities.find(e=>e.id==='gerard-houllier'),eras).some(e=>e.id==='evans-houllier-1998'));
 assert.equal(personEras(entities.find(e=>e.id==='phil-thompson'),eras).length,0);
 const d={entity:entity('club','opposition'),articles:[article('a',{season:'1892-93'}),article('b',{season:'1987-88'})]};
 assert.deepEqual(explorationSeasons(d,getSeasons()).map(s=>s.season),['1987-88']);
});

test('article exploration returns at most five valid, unique destinations and excludes opinion',()=>{
 const destinations=getExplorations();for(const a of getArchiveFeatures()){
 const links=articleExplorationLinks(a,destinations);assert.ok(links.length<=5);assert.equal(new Set(links.map(l=>l.href)).size,links.length);
 for(const l of links)assert.ok(destinations.some(d=>d.href===l.href&&d.entity.label===l.label));
 if(a.editorialMode!=='factual')assert.deepEqual(links,[]);
 }
});

test('metadata-rich draft stays hidden and normal file-placement publication crosses threshold without code changes',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'history-v2-'));
 try{
 fs.cpSync('content',path.join(root,'content'),{recursive:true});fs.mkdirSync(path.join(root,'docs/editorial/drafts'),{recursive:true});
 const registry=path.join(root,'content/history/liverpool/entities.json');const entities=JSON.parse(fs.readFileSync(registry));entities.push(entity('fixture-person'));fs.writeFileSync(registry,JSON.stringify(entities));
 const directory=path.join(root,'content/archive/liverpool');
 const original=getArchiveFeatures(root)[0];const {body,...data}=original;
 for(let i=0;i<2;i++)fs.writeFileSync(path.join(directory,`fixture-${i}.md`),matter.stringify(body,{...data,slug:`fixture-${i}`,editorialMode:'factual',playerIds:['fixture-person'],managerIds:[]}));
 const draft=path.join(root,'docs/editorial/drafts/fixture-draft.md');fs.writeFileSync(draft,matter.stringify(body,{...data,slug:'fixture-draft',editorialMode:'factual',playerIds:['fixture-person'],managerIds:[]}));
 assert.ok(!getExplorations(root).some(d=>d.entity.id==='fixture-person'));
 assert.ok(!getExplorations(root).some(d=>d.articles.some(a=>a.slug==='fixture-draft')));
 fs.copyFileSync(draft,path.join(directory,'fixture-draft.md'));
 assert.equal(getExplorations(root).find(d=>d.entity.id==='fixture-person').articles.length,3);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('real collections exclude Torres and both opinion articles; original biographies remain canonical',()=>{
 const all=getExplorations();assert.ok(all.some(d=>d.entity.id==='kenny-dalglish'));assert.ok(all.some(d=>d.entity.id==='everton'));assert.ok(all.some(d=>d.entity.id==='european-cup'));
 for(const d of all)for(const a of d.articles)assert.ok(!['torres-goodison-derby-double-2008','liverpool-7-tottenham-0','liverpool-sold-their-best-player'].includes(a.slug));
 assert.ok(all.find(d=>d.entity.id==='phil-thompson').articles.some(a=>a.slug==='phil-thompson'&&!a.season));
});
