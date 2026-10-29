import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import matter from 'gray-matter';
import { getHistoryWindow, getArticleWeek, HistoryEventSchema } from '../lib/content/this-week.ts';
import { getHistoryLibrary } from '../lib/content/history-library.ts';
import { verifiedHistoryWeek, preparationWeeks, previousWeekEnd } from '../lib/content/weekly-history.ts';
const library = getHistoryLibrary();
test('restored week retains all seven days and already prepared later-week writing', () => {
  const expected = verifiedHistoryWeek(library, new Date('2026-04-13T12:00:00Z'));
  for (let day = 13; day <= 19; day++) assert.deepEqual(verifiedHistoryWeek(library, new Date(`2026-04-${day}T12:00:00Z`)), expected);
  assert.equal(expected[0].entries.length, 1);
  assert.equal(expected.at(-1).iso, '2026-04-19');
  assert.equal(verifiedHistoryWeek(library, new Date('2026-04-20T00:00:00Z')).flatMap(d => d.entries).length, 0);
});
test('Monday workflow covers the current week and three full following weeks', () => {
  assert.deepEqual(preparationWeeks(new Date('2026-10-29T12:00:00Z')), [
    {start:'2026-10-26',end:'2026-11-01'}, {start:'2026-11-02',end:'2026-11-08'},
    {start:'2026-11-09',end:'2026-11-15'}, {start:'2026-11-16',end:'2026-11-22'},
  ]);
  assert.equal(preparationWeeks(new Date('2026-12-31T12:00:00Z'))[1].start, '2027-01-04');
});
test('Sunday selection defaults to the previous complete UK week', () => {
  assert.equal(previousWeekEnd(new Date('2026-10-29T12:00:00Z')), '2026-10-25');
  assert.equal(previousWeekEnd(new Date('2026-11-01T23:59:59Z')), '2026-10-25');
  assert.equal(previousWeekEnd(new Date('2026-11-02T00:00:00Z')), '2026-11-01');
});
test('weekly rollover follows UK midnight in summer and winter; February 29 never moves', () => {
  for (const [instant,monday] of [['2026-09-06T22:59:59Z','2026-08-31'],['2026-09-06T23:00:00Z','2026-09-07'],['2026-01-04T23:59:59Z','2025-12-29'],['2026-01-05T00:00:00Z','2026-01-05']]) assert.equal(getHistoryWindow([],new Date(instant))[0].iso,monday);
  const event={month:2,day:29,year:2000,title:'Fixture',summary:'Test only',source:'https://example.com',slug:'fixture'};
  assert.equal(getHistoryWindow([event],new Date('2028-02-29T12:00:00Z')).flatMap(d=>d.events).length,1);
  assert.equal(getHistoryWindow([event],new Date('2027-03-01T12:00:00Z')).flatMap(d=>d.events).length,0);
  assert.equal(getHistoryWindow([event],new Date('1996-02-29T12:00:00Z')).flatMap(d=>d.events).length,0);
  assert.equal(HistoryEventSchema.safeParse({...event,slug:undefined,year:1900}).success,false);
});
test('legacy article recurrence deduplicates explicit associations and excludes future dates', () => {
  const article=library.articles[0];
  const events=[{month:4,day:13,year:1988,title:'Fixture',summary:'Test only',source:'https://example.com',slug:'fixture',archiveSlug:article.slug}];
  const dated={...article,historicalEventDate:'1988-04-13'};
  assert.equal(getArticleWeek([dated],getHistoryWindow(events,new Date('2026-04-14T12:00:00Z'))).flatMap(d=>d.articles).length,1);
  assert.equal(getArticleWeek([dated],getHistoryWindow(events,new Date('1987-04-13T12:00:00Z'))).flatMap(d=>d.articles).length,0);
});
test('annual birthday can reference approved career writing without forcing a biography event date', () => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'weekly-history-'));
  try {
    fs.cpSync('content',path.join(root,'content'),{recursive:true});
    const raw=matter(fs.readFileSync('content/archive/liverpool/liverpools-manager-scored-after-21-seconds-at-goodison.md','utf8'));
    const data={...raw.data,slug:'career-fixture',articleType:'player',category:'person'};delete data.historicalEventDate;delete data.season;
    fs.writeFileSync(path.join(root,'content/archive/liverpool/career-fixture.md'),matter.stringify(raw.content,data));
    const dir=path.join(root,'content/this-week/liverpool');fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir,'birthday-fixture.md'),matter.stringify('',{month:3,day:4,year:1951,title:'Birthday fixture',summary:'Prewritten test prose.',source:'https://example.com/birth-record',archiveSlug:'career-fixture'}));
    const verification=path.join(root,'content/history/liverpool/event-verifications.json');
    const records=JSON.parse(fs.readFileSync(verification));records.push({articleSlug:'career-fixture',eventSlug:'birthday-fixture',historicalEventDate:'1951-03-04',reviewedOn:'2026-10-29',sourceUrls:['https://example.com/birth-record'],scope:'Fixture only; not real research.'});fs.writeFileSync(verification,JSON.stringify(records));
    let value=getHistoryLibrary(root);assert.ok(value.events.some(e=>e.id==='event-birthday-fixture'));
    assert.equal(value.articles.find(a=>a.slug==='career-fixture').historicalEventDate,undefined);
    fs.unlinkSync(path.join(root,'content/archive/liverpool/career-fixture.md'));
    // Missing linked articles must fail closed, never restore withdrawn content.
    assert.equal(getHistoryLibrary(root).events.some(e=>e.id==='event-birthday-fixture'),false);
  } finally {fs.rmSync(root,{recursive:true,force:true});}
});
