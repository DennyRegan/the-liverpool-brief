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
 data.fixtures=[completed,upcoming];
 const own=data.table.rows.find(r=>r.clubId==='liverpool');Object.assign(own,{played:0,won:0,drawn:0,lost:0,goalsFor:0,goalsAgainst:0,points:0});
 fs.writeFileSync(path.join(root,'content/match-centre/liverpool/current.json'),JSON.stringify({season}));
 fs.writeFileSync(path.join(root,`content/match-centre/liverpool/${season}.json`),JSON.stringify(data));
 const report={title:'Temporary current match report',slug:'qa-current-report',date:today,season,historicalEventDate:matchDate,historicalPeriod:season,decade:`${Math.floor(year/10)*10}s`,category:'match',articleType:'match',editorialMode:'factual',excerpt:'Temporary verification fixture.',oppositionIds:['tottenham-hotspur'],competitionIds:['league-cup']};
 fs.writeFileSync(path.join(root,'content/archive/liverpool/qa-current-report.md'),matter.stringify('Temporary factual record for QA.',report));
 const match=getFactualHistoryArticles().find(a=>a.articleType==='match'&&a.season==='1987-88');
 for(const a of [{slug:'qa-analysis-history',title:'Temporary historical investigation',season:'1987-88',playerIds:['john-barnes'],managerIds:['kenny-dalglish'],competitionIds:['first-division'],relatedMatches:[match.slug]},{slug:'qa-analysis-current',title:'Temporary current investigation',season}])fs.writeFileSync(path.join(root,`content/articles/liverpool/${a.slug}.md`),matter.stringify('Temporary analysis for verification.',{...a,date:today,category:'Analysis'}));
 server=spawn(process.execPath,['scripts/dev.mjs','--webpack','--hostname','127.0.0.1','--port','3156'],{cwd:root,stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Preview startup timed out')),20000);server.once('error',reject);server.once('exit',code=>reject(new Error(`Preview exited ${code}`)));server.stderr.on('data',d=>process.stderr.write(d));server.stdout.on('data',d=>{if(d.toString().includes('Ready')){clearTimeout(timeout);resolve();}});});
 const centre=await get('/match-centre');assert.match(centre,/Temporary verified briefing/);assert.match(centre,/Read the match report/);assert.equal((centre.match(/href="\/archive\/qa-current-report"/g)??[]).length,3,'last match, fixture and reading share the same canonical report');assert.match(centre,/href="\/articles\/qa-analysis-current"/);assert.ok(!centre.includes('qa-analysis-history'));assert.match(centre,/Match Briefing/);
 assert.match(centre,/<summary>Show all fixtures and results/);assert.match(centre,/<summary><h2 id="league-table">League Table<\/h2>/);
 assert.equal((centre.split('<details class="mc-disclosure">')[0].match(/class="mc-fixture"/g)??[]).length,1,'only the next fixture is initially visible');
 assert.match(centre,/href="#match-preview"/);assert.match(centre,/id="match-preview"/);assert.match(centre,/<h3>Team news<\/h3>/);assert.match(centre,/Verified preview prose for integration QA/);
 assert.match(await get('/archive/qa-current-report'),/Temporary factual record/);
 const historical=await get('/articles/qa-analysis-history');for(const href of ['/history/seasons/1987-88','/history/people/john-barnes','/history/people/kenny-dalglish','/history/competitions/first-division',`/archive/${match.slug}`])assert.ok(historical.includes(`href="${href}"`),href);
 for(const route of ['/history/seasons/1987-88','/history/people/john-barnes','/history/people/kenny-dalglish','/history/competitions/first-division','/history/kenny-dalglish-1985-1991',`/archive/${match.slug}`])assert.equal(((await get(route)).match(/href="\/articles\/qa-analysis-history"/g)??[]).length,1,route+' shows canonical Analysis once');
 const analysis=await get('/articles?type=analysis');assert.match(analysis,/qa-analysis-history/);assert.match(analysis,/qa-analysis-current/);assert.ok(!analysis.includes('why-are-liverpool-being-written-off'));
 assert.ok(!(await get('/articles?type=opinion')).includes('qa-analysis-'));
 assert.ok(!(await get('/history/matches')).includes('/archive/qa-analysis-'));
 await get('/archive/torres-goodison-derby-double-2008',404);
 delete upcoming.briefing;delete completed.reportSlug;fs.writeFileSync(path.join(root,`content/match-centre/liverpool/${season}.json`),JSON.stringify(data));
 delete upcoming.preview;fs.writeFileSync(path.join(root,`content/match-centre/liverpool/${season}.json`),JSON.stringify(data));
 const bare=await get('/match-centre');assert.ok(!bare.includes('Match Briefing'));assert.ok(!bare.includes('Read the match report'));assert.match(bare,/Next Match/);assert.ok(!bare.includes('id="match-preview"'));assert.ok(!bare.includes('Read the match preview'));
 console.log('PASS Match Centre: real report and briefing, optional absence, current reading, Analysis filters, canonical cross-links in six History contexts, no draft exposure.');
} finally {if(server&&server.exitCode===null){const exited=once(server,'exit');server.kill('SIGTERM');await exited;}fs.rmSync(root,{recursive:true,force:true});}
