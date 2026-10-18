// Real fixture/report/Analysis rendering in a disposable local project.
// No test article ever enters the working content tree or production.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import matter from 'gray-matter';
import { getMatchCentre } from '../lib/content/match-centre.ts';
import { getFactualHistoryArticles } from '../lib/content/archive.ts';
import { excludeUnrelatedMatchArticles } from '../tests/fixtures/league-table.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'liverpool-match-centre-'));
for(const name of ['app','lib','content','public','scripts','package.json','package-lock.json','next.config.ts','tsconfig.json','postcss.config.mjs','next-env.d.ts'])fs.cpSync(name,path.join(root,name),{recursive:true});
fs.symlinkSync(path.join(process.cwd(),'node_modules'),path.join(root,'node_modules'),'dir');
const origin='http://127.0.0.1:3156';
const mainOf=html=>(html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]??'').replace(/<!--[\s\S]*?-->/g,'');
async function get(route,status=200){const r=await fetch(origin+route,{signal:AbortSignal.timeout(60000)});assert.equal(r.status,status,route);return mainOf(await r.text());}
let server;
try {
 const data=getMatchCentre(root);
 // Relative dates keep this fixture test useful after the seeded season ends.
 const now=new Date(); const year=now.getUTCMonth()<6?now.getUTCFullYear()-1:now.getUTCFullYear();
 const season=`${year}-${String(year+1).slice(-2)}`;const today=now.toISOString().slice(0,10);
 const matchDate=today;
 // Both fixture dates remain inside the season on rollover days. The upcoming
 // fixture has an unconfirmed time, so date-based selection remains testable.
 data.season=season;data.updatedAt=now.toISOString();data.table.asOf=now.toISOString();
 const completed={id:'qa-last',oppositionId:'tottenham-hotspur',competitionId:'league-cup',side:'home',venue:'Anfield',date:matchDate,status:'completed',score:{home:3,away:1},sourceIds:['scores'],reportSlug:'qa-current-report'};
 const upcoming={id:'qa-next',oppositionId:'bournemouth',competitionId:'premier-league',side:'away',venue:'Vitality Stadium',date:matchDate,status:'scheduled',sourceIds:['schedule'],briefing:{updatedAt:data.updatedAt,points:['Temporary verified briefing for integration QA.'],sourceIds:['september']}};
 upcoming.preview={title:'Temporary next-match preview',body:'## Team news\n\nVerified preview prose for integration QA.',updatedAt:data.updatedAt,sourceIds:['september']};
 completed.preview={title:'Earlier completed-match preview',body:'Preserved older preview prose.',updatedAt:data.updatedAt,sourceIds:['scores']};
 data.fixtures=[completed,upcoming];
 excludeUnrelatedMatchArticles(root,data);
 const own=data.table.rows.find(r=>r.clubId==='liverpool');Object.assign(own,{played:0,won:0,drawn:0,lost:0,goalsFor:0,goalsAgainst:0,points:0});
 fs.writeFileSync(path.join(root,'content/match-centre/liverpool/current.json'),JSON.stringify({season}));
 fs.writeFileSync(path.join(root,`content/match-centre/liverpool/${season}.json`),JSON.stringify(data));
 const report={title:'Temporary current match report',slug:'qa-current-report',date:today,season,historicalEventDate:matchDate,historicalPeriod:season,decade:`${Math.floor(year/10)*10}s`,category:'match',articleType:'match',editorialMode:'factual',excerpt:'Temporary verification fixture.',oppositionIds:['tottenham-hotspur'],competitionIds:['league-cup']};
 fs.writeFileSync(path.join(root,'content/archive/liverpool/qa-current-report.md'),matter.stringify('Temporary factual record for QA.',report));
 const match=getFactualHistoryArticles().find(a=>a.articleType==='match'&&a.season==='1987-88');
 for(const a of [{slug:'qa-analysis-history',title:'Temporary historical investigation',season:'1987-88',playerIds:['john-barnes'],managerIds:['kenny-dalglish'],competitionIds:['first-division'],relatedMatches:[match.slug]},{slug:'qa-analysis-current',title:'Temporary current investigation',season}])fs.writeFileSync(path.join(root,`content/articles/liverpool/${a.slug}.md`),matter.stringify('Temporary analysis for verification.',{...a,date:today,category:'Analysis'}));
 for(const [fixture,category,slug] of [[upcoming,'Preview','qa-article-preview'],[completed,'Match report','qa-article-report'],[completed,'Opinion','qa-article-opinion']]) {
   fs.writeFileSync(path.join(root,`content/articles/liverpool/${slug}.md`),matter.stringify('Preserved ordinary match article prose.',{title:`Temporary ${category} headline`,slug,date:today,season,category,fixtureId:fixture.id,historicalEventDate:fixture.date}));
 }
 server=spawn(process.execPath,['scripts/dev.mjs','--webpack','--hostname','127.0.0.1','--port','3156'],{cwd:root,stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Preview startup timed out')),20000);server.once('error',reject);server.once('exit',code=>reject(new Error(`Preview exited ${code}`)));server.stderr.on('data',d=>process.stderr.write(d));server.stdout.on('data',d=>{if(d.toString().includes('Ready')){clearTimeout(timeout);resolve();}});});
 const centre=await get('/match-centre');
 assert.match(centre, /<h1>Match writing<\/h1>/);
 assert.match(centre, /Temporary verified briefing/);
 assert.equal((centre.match(/href="\/archive\/qa-current-report"/g)??[]).length,1,'current reading keeps the canonical report once');
 assert.match(centre, /href="\/articles\/qa-analysis-current"/);
 assert.ok(!centre.includes('qa-analysis-history'));
 assert.doesNotMatch(centre, /<table\b|league-table|mc-fixture|mc-score|Fixtures &amp; Results|Last Match|Next Match|Fixture sources and update notes/);
 assert.match(centre,/href="#match-preview"/);assert.match(centre,/id="match-preview"/);assert.match(centre,/<h3>Team news<\/h3>/);assert.match(centre,/Verified preview prose for integration QA/);
 assert.match(centre, /Earlier completed-match preview/);assert.match(centre, /Preserved older preview prose/);
 assert.equal((centre.match(/Verified preview prose for integration QA/g)??[]).length,1,'each preview body rendered once');
 assert.ok(centre.indexOf('Temporary next-match preview') < centre.indexOf('Earlier completed-match preview'),'upcoming preview retains the homepage anchor');
 assert.match(centre, /Sources for this writing/);
 assert.match(await get('/archive/qa-current-report'),/Temporary factual record/);
 const historical=await get('/articles/qa-analysis-history');for(const href of ['/history/seasons/1987-88','/history/people/john-barnes','/history/people/kenny-dalglish','/history/competitions/first-division',`/archive/${match.slug}`])assert.ok(historical.includes(`href="${href}"`),href);
 for(const route of ['/history/seasons/1987-88','/history/people/john-barnes','/history/people/kenny-dalglish','/history/competitions/first-division','/history/kenny-dalglish-1985-1991',`/archive/${match.slug}`])assert.equal(((await get(route)).match(/href="\/articles\/qa-analysis-history"/g)??[]).length,1,route+' shows canonical Analysis once');
 const all=await get('/articles');
 for(const href of ['/articles/qa-article-preview','/articles/qa-article-report','/archive/qa-current-report','/match-centre#match-preview']) assert.ok(all.includes(`href="${href}"`),href);
 assert.equal(all.split(/<article\b/).slice(1).filter(segment=>segment.split('</article>')[0].includes('href="/archive/qa-current-report"')).length,1,'canonical report listed once');
 assert.doesNotMatch(all,/mc-fixture|mc-score|<table\b/);
 const previews=await get('/articles?type=preview');assert.match(previews,/qa-article-preview/);assert.ok(!previews.includes('qa-article-report'));
 const reports=await get('/articles?type=match-report');assert.match(reports,/qa-article-report/);assert.ok(!reports.includes('qa-article-preview'));
 for(const suffix of ['toString','__proto__','unknown','opinion&type=analysis']) await get(`/articles?type=${suffix}`);
 for(const slug of ['qa-article-preview','qa-article-report']) {const detail=await get(`/articles/${slug}`);assert.match(detail,/Preserved ordinary match article prose/);assert.match(detail,/article-match-context/);}
 const opinion=await get('/articles/qa-article-opinion');assert.match(opinion,/Opinion/);assert.doesNotMatch(opinion,/Follow .*in Match Centre/);
 const analysis=await get('/articles?type=analysis');assert.match(analysis,/qa-analysis-history/);assert.match(analysis,/qa-analysis-current/);assert.ok(!analysis.includes('why-are-liverpool-being-written-off'));
 assert.ok(!(await get('/articles?type=opinion')).includes('qa-analysis-'));
 assert.ok(!(await get('/history/matches')).includes('/archive/qa-analysis-'));
 await get('/archive/torres-goodison-derby-double-2008',404);
 delete upcoming.briefing;delete completed.reportSlug;fs.writeFileSync(path.join(root,`content/match-centre/liverpool/${season}.json`),JSON.stringify(data));
 // Article references require completed reports to stay completed; the legacy
 // stored preview/briefing removal must not remove ordinary article writing.
 delete upcoming.preview;delete completed.preview;fs.writeFileSync(path.join(root,`content/match-centre/liverpool/${season}.json`),JSON.stringify(data));
 const bare=await get('/match-centre');assert.ok(!bare.includes('Temporary verified briefing'));assert.ok(!bare.includes('id="match-preview"'));assert.match(bare,/Published match previews and briefings will appear here/);assert.match(bare,/This season’s writing/);
 console.log('PASS writing-first match page: upcoming and completed previews preserved once, briefings and sources, no fixtures/scores/table, Articles filters and typed match details, current reading, Analysis filters, canonical cross-links in six History contexts, no draft exposure.');
} finally {if(server&&server.exitCode===null){const exited=once(server,'exit');server.kill('SIGTERM');await exited;}fs.rmSync(root,{recursive:true,force:true});}
