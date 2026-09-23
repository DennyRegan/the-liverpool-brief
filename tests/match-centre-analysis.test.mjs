import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import matter from 'gray-matter';
import { MatchCentreSchema, FixtureSchema, getMatchCentre, selectMatches, fixtureTime, getCurrentSeasonReading } from '../lib/content/match-centre.ts';
import { ArticleSchema } from '../lib/content/types.ts';
import { getArticles } from '../lib/content/articles.ts';
import { getContextAnalysis, analysisConnections } from '../lib/content/analysis.ts';
import { getFactualHistoryArticles } from '../lib/content/archive.ts';
import { getExplorations } from '../lib/content/exploration.ts';
import { selectHomeWriting } from '../lib/content/homepage.ts';
import { getWriting } from '../lib/content/writing.ts';
const now = new Date('2026-09-17T12:00:00Z');
const fixture = (extra={}) => ({id:'fixture',oppositionId:'everton',competitionId:'premier-league',side:'home',date:'2026-09-20',kickoff:'2026-09-20T14:00:00+01:00',status:'scheduled',sourceIds:['schedule'],...extra});
function withContent(fn) { const root=fs.mkdtempSync(path.join(os.tmpdir(),'match-centre-test-')); try { fs.cpSync('content',path.join(root,'content'),{recursive:true}); return fn(root); } finally {fs.rmSync(root,{recursive:true,force:true});} }
const seasonFile=root=>path.join(root,'content/match-centre/liverpool/2026-27.json');
const saveCentre=(root,data)=>fs.writeFileSync(seasonFile(root),JSON.stringify(data));
const writeArticle=(root,a)=>{const {body,...meta}=a;fs.writeFileSync(path.join(root,'content/articles/liverpool',a.slug+'.md'),matter.stringify(body,meta));};
const analysis=(extra={})=>({title:'Test investigation',slug:'test-investigation',date:'2026-09-17',category:'Analysis',body:'Test fixture only.',...extra});

test('real register contains all 38 league fixtures, eight European and two cup ties; snapshot reconciles',()=>{
 const data=getMatchCentre();assert.equal(data.fixtures.length,48);assert.equal(data.fixtures.filter(f=>f.competitionId==='premier-league').length,38);
 const selected=selectMatches(data,new Date('2026-09-23T12:00:00Z'));assert.equal(selected.last.oppositionId,'bournemouth');assert.deepEqual(selected.last.score,{home:0,away:1});assert.equal(selected.next.oppositionId,'manchester-city');assert.equal(selected.waiting.length,0);
 const liverpool=data.table.rows.find(r=>r.clubId==='liverpool');assert.deepEqual([liverpool.position,liverpool.played,liverpool.points],[6,5,9]);assert.equal(data.table.asOf,'2026-09-21T13:55:00+01:00');assert.equal(selected.ordered.at(-1).oppositionId,'chelsea');
 assert.deepEqual(selected.upcoming.slice(0,4).map(f=>f.oppositionId),['manchester-city','lask','brentford','villarreal']);
});
test('lifecycle advances only recorded results; passed kick-offs await editorial updates',()=>{
 const before=fixture(), completed=fixture({id:'previous',date:'2026-09-12',kickoff:undefined,status:'completed',score:{home:0,away:0}});
 const future=fixture({id:'next',date:'2026-10-01',kickoff:undefined});
 const result=selectMatches({fixtures:[future,before,completed]},new Date('2026-09-20T14:00:00Z'));
 assert.equal(result.last.id,'previous');assert.equal(result.next.id,'next');assert.deepEqual(result.waiting.map(f=>f.id),['fixture']);
 assert.equal(selectMatches({fixtures:[{...before,status:'completed',score:{home:2,away:1}},future]},new Date('2026-09-21')).last.id,'fixture');
 assert.deepEqual(result.upcoming.map(f=>f.id),['next']);
});
test('postponed, cancelled and undated fixtures never become next match',()=>{
 const fixtures=[fixture({status:'postponed'}),fixture({id:'cancelled',status:'cancelled'}),fixture({id:'undated',date:undefined,kickoff:undefined,dateNote:'Awaiting confirmation'})];
 assert.equal(selectMatches({fixtures},now).next,undefined);assert.equal(selectMatches({fixtures},now).ordered.length,3);
});
test('UK kick-offs handle BST/GMT and validate dates; missing times are explicit',()=>{
 assert.match(fixtureTime(fixture()),/14:00 BST/);assert.match(fixtureTime(fixture({kickoff:'2027-01-05T20:15:00Z'})),/20:15 GMT/);
 assert.equal(fixtureTime(fixture({kickoff:undefined})),'Kick-off TBC');
 assert.equal(FixtureSchema.safeParse(fixture({date:'2026-09-21'})).success,false);
 assert.equal(FixtureSchema.safeParse(fixture({date:undefined,kickoff:undefined})).success,false);
});
test('results cannot appear on unplayed games and completed games require scores',()=>{
 for(const f of [fixture({score:{home:1,away:0}}),fixture({status:'completed'}),fixture({reportSlug:'draft-report'}),fixture({status:'completed',score:{home:1,away:0},penalties:{home:4,away:3}})])assert.equal(FixtureSchema.safeParse(f).success,false);
 assert.equal(FixtureSchema.safeParse(fixture({status:'completed',score:{home:1,away:1},penalties:{home:4,away:3}})).success,true);
});
test('table arithmetic, duplicate positions, missing sources and future results fail validation',()=>{
 const mutations=[d=>d.table.rows[0].points++,d=>d.table.rows[0].position=2,d=>d.fixtures[0].sourceIds=['missing'],d=>d.fixtures[0].date='2027-01-01',d=>d.fixtures.push(d.fixtures[0])];
 for(const change of mutations){const data=structuredClone(getMatchCentre());change(data);assert.equal(MatchCentreSchema.safeParse(data).success,false);}
});
test('optional briefing supports sourced text and rejects missing or future evidence references',()=>{
 const data=getMatchCentre(), next=data.fixtures.find(f=>f.oppositionId==='manchester-city');
 next.briefing={updatedAt:data.updatedAt,points:['Verified test context.'],sourceIds:['september']};assert.equal(MatchCentreSchema.safeParse(data).success,true);
 next.briefing.sourceIds=['missing'];assert.equal(MatchCentreSchema.safeParse(data).success,false);
});
test('completed Bournemouth fixture links its approved report and leaves no outdated preview',()=>{
 const data=getMatchCentre();const next=selectMatches(data,new Date('2026-09-23T12:00:00Z')).next;
 assert.equal(next.oppositionId,'manchester-city');
 assert.equal(data.fixtures.filter(f=>f.preview).length,0);
 assert.equal(data.fixtures.find(f=>f.oppositionId==='bournemouth').preview,undefined);
 assert.equal(data.fixtures.find(f=>f.oppositionId==='bournemouth').reportSlug,'bournemouth-liverpool-2026-09-20');
 for(const status of ['postponed','cancelled','completed']){
  const changed=structuredClone(data);changed.fixtures.find(f=>f.id===next.id).status=status;
  assert.notEqual(selectMatches(changed,now).next?.id,next.id);
 }
});
test('preview requires non-empty prose, known sources and a non-future update',()=>{
 for(const change of [p=>p.body=' ',p=>p.title='',p=>p.sourceIds=['missing'],p=>p.updatedAt='2099-01-01T00:00:00Z']){
  const data=structuredClone(getMatchCentre());const f=data.fixtures.find(f=>f.oppositionId==='manchester-city');f.preview={title:'Upcoming match',body:'Verified match context.',updatedAt:data.updatedAt,sourceIds:['september']};change(f.preview);
  assert.equal(MatchCentreSchema.safeParse(data).success,false);
 }
 const data=structuredClone(getMatchCentre());
 assert.equal(MatchCentreSchema.safeParse(data).success,true);
});
test('report links require a published factual match with exact fixture relationships',()=>withContent(root=>{
 const data=getMatchCentre(root);data.fixtures[0].reportSlug='torres-goodison-derby-double-2008';saveCentre(root,data);assert.throws(()=>getMatchCentre(root),/published and match/);
 const original=getFactualHistoryArticles(root).find(a=>a.articleType==='match'),{body,...meta}=original;
 delete meta.historyEras;
 const f=data.fixtures[0]; const slug='test-current-match';
 fs.writeFileSync(path.join(root,'content/archive/liverpool',slug+'.md'),matter.stringify(body,{...meta,slug,season:data.season,historicalEventDate:f.date,oppositionIds:[f.oppositionId],competitionIds:[f.competitionId]}));
 f.reportSlug=slug;saveCentre(root,data);assert.equal(getMatchCentre(root).fixtures[0].reportSlug,slug);
 assert.ok(getCurrentSeasonReading(data.season,root).some(a=>a.href===`/archive/${slug}`&&a.category==='Match report'));
 f.competitionId='league-cup';saveCentre(root,data);assert.throws(()=>getMatchCentre(root),/published and match/);
}));
test('Analysis and Opinion are the only article categories, with shared canonical metadata validation',()=>{
 assert.equal(ArticleSchema.parse(analysis({category:undefined})).category,'Opinion');assert.equal(ArticleSchema.safeParse(analysis({category:'Tactical Analysis'})).success,false);
 assert.equal(ArticleSchema.safeParse(analysis({season:'1987/88'})).success,false);
 withContent(root=>{writeArticle(root,analysis({playerIds:['invented-person']}));assert.throws(()=>getArticles(root),/canonical person/);});
});
test('one historical Analysis reaches season, person, manager, competition, era and match without changing factual eligibility',()=>withContent(root=>{
 const before=getExplorations(root).map(d=>[d.href,d.articles.length]);
 const match=getFactualHistoryArticles(root).find(a=>a.articleType==='match'&&a.season==='1987-88');
 const a=analysis({season:'1987-88',playerIds:['john-barnes'],managerIds:['kenny-dalglish'],competitionIds:['first-division'],relatedMatches:[match.slug]});writeArticle(root,a);
 for(const context of [{season:'1987-88'},{entityId:'john-barnes'},{entityId:'kenny-dalglish'},{entityId:'first-division'},{eraId:'kenny-dalglish-1985-1991'},{matchSlug:match.slug}])assert.deepEqual(getContextAnalysis(context,root).map(a=>a.slug),[a.slug]);
 const links=analysisConnections(a,root);assert.ok(links.some(l=>l.href==='/history/people/john-barnes'));assert.ok(links.some(l=>l.href==='/history/seasons/1987-88'));assert.ok(links.some(l=>l.href===`/archive/${match.slug}`));assert.equal(new Set(links.map(l=>l.href)).size,links.length);
 assert.deepEqual(getExplorations(root).map(d=>[d.href,d.articles.length]),before);
 assert.equal(getWriting(root).filter(w=>w.slug===a.slug)[0].href,`/articles/${a.slug}`);
 assert.equal(selectHomeWriting(getWriting(root)).lead.slug,a.slug);
}));
test('current Analysis and Opinion use exact season metadata; drafts and unapproved reports stay hidden',()=>withContent(root=>{
 const a=analysis({season:'2026-27'});writeArticle(root,a);
 const reading=getCurrentSeasonReading('2026-27',root);assert.ok(reading.some(a=>a.category==='Analysis'));assert.ok(reading.some(a=>a.category==='Opinion'));assert.equal(new Set(reading.map(a=>a.href)).size,reading.length);
 const drafts=path.join(root,'docs/editorial/drafts');fs.mkdirSync(drafts,{recursive:true});fs.writeFileSync(path.join(drafts,'draft.md'),matter.stringify('Draft',analysis({slug:'draft',season:'2026-27'})));
 assert.ok(!getCurrentSeasonReading('2026-27',root).some(a=>a.slug==='draft'||a.slug.includes('torres-goodison')));
}));
test('ineligible person IDs stay unlinked; Opinion never masquerades as Analysis',()=>withContent(root=>{
 const a=analysis({playerIds:['alan-acourt']});writeArticle(root,a);assert.ok(!analysisConnections(a,root).some(l=>l.href==='/history/people/alan-acourt'));
 writeArticle(root,{...a,category:'Opinion'});assert.equal(getContextAnalysis({entityId:'alan-acourt'},root).length,0);assert.deepEqual(analysisConnections({...a,category:'Opinion'},root),[]);
}));
