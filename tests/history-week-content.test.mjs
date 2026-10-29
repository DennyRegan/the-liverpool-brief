import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { getHistoryLibrary } from '../lib/content/history-library.ts';
import { getHistoryEvents } from '../lib/content/this-week.ts';
import { verifiedHistoryWeek, weekForDate } from '../lib/content/weekly-history.ts';
const slugs = ['alonso-ends-chelsea-home-run-2008','west-brom-liverpool-1962-lawrence-debut','1995-10-28-liverpool-manchester-city','liverpool-luton-1983-rush-five','liverpool-southampton-1993-fowler-hat-trick','chelsea-liverpool-2015-klopp-first-league-win','liverpool-everton-1987-barnes-creates-derby-win'];
test('26 October–1 November contains the seven commissioned stories from Monday, with canonical full writing and recorded evidence', () => {
 const library=getHistoryLibrary(); const week=verifiedHistoryWeek(library,new Date('2026-10-26T00:00:00Z'));
 assert.deepEqual(week.flatMap(day=>day.entries).map(e=>e.href),slugs.map(s=>`/archive/${s}`));
 assert.deepEqual(week.map(d=>d.entries.length),[1,1,1,1,1,1,1]);
 assert.deepEqual(verifiedHistoryWeek(library,new Date('2026-11-01T23:59:59Z')),week);
 for(const slug of slugs){
  const article=library.articles.find(a=>a.slug===slug); const event=getHistoryEvents().find(e=>e.archiveSlug===slug);
  assert.equal(article.editorialMode,'factual'); assert.ok(article.body.split(/\s+/).length>170);
  assert.equal(event.summary,article.excerpt);assert.equal(article.historicalEventDate,`${event.year}-${String(event.month).padStart(2,'0')}-${String(event.day).padStart(2,'0')}`);
  assert.notEqual(article.date,article.historicalEventDate);
  assert.equal((article.body.match(/## Sources/g)||[]).length,1);
  for(const source of article.sources)assert.ok(article.body.includes(`](${source})`));
 }
});
test('stored annual entries recur next year and disappear automatically when an article is withdrawn',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'week-content-'));
 try {
  fs.cpSync('content',path.join(root,'content'),{recursive:true});
  const library=getHistoryLibrary(root);
  assert.ok(weekForDate(library,'2027-10-26').flatMap(d=>d.entries).some(e=>e.href.endsWith(slugs[0])));
  fs.unlinkSync(path.join(root,'content/archive/liverpool',slugs[0]+'.md'));
  assert.ok(!weekForDate(getHistoryLibrary(root),'2026-10-26').flatMap(d=>d.entries).some(e=>e.href.endsWith(slugs[0])));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
