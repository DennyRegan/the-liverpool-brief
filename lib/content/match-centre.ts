import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { HistoryIdSchema, HistoryIdsSchema, getHistoryEntities } from './entities.ts';
import { SeasonIdSchema } from './history.ts';
import { getFactualHistoryArticles } from './archive.ts';
import { getWriting } from './writing.ts';

const Text = z.string().trim().min(1);
const Count = z.number().int().nonnegative();
const Sources = HistoryIdsSchema.min(1);
const Score = z.object({ home: Count, away: Count }).strict();
export const FixtureSchema = z.object({
  // Stable ID survives postponements; never derive identity from the latest date.
  id: HistoryIdSchema, oppositionId: HistoryIdSchema, competitionId: HistoryIdSchema,
  side: z.enum(['home', 'away', 'neutral']), venue: Text.optional(), round: Text.optional(),
  date: z.iso.date().optional(), kickoff: z.iso.datetime({ offset: true }).optional(),
  dateNote: Text.optional(), status: z.enum(['scheduled', 'completed', 'postponed', 'cancelled']),
  score: Score.optional(), penalties: Score.optional(), afterExtraTime: z.boolean().optional(),
  reportSlug: HistoryIdSchema.optional(), sourceIds: Sources,
  preview: z.object({ title: Text, body: Text, updatedAt: z.iso.datetime({ offset: true }), sourceIds: Sources }).strict().optional(),
  briefing: z.object({ updatedAt: z.iso.datetime({ offset: true }), points: z.array(Text).min(1).max(6), sourceIds: Sources }).strict().optional(),
}).strict().superRefine((f, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
  if (f.status === 'completed' && (!f.date || !f.score)) fail('Completed fixtures require a date and score');
  if (f.status !== 'completed' && (f.score || f.penalties || f.afterExtraTime || f.reportSlug)) fail('Only completed fixtures may have a result or match report');
  if (!f.date && !f.dateNote) fail('An unconfirmed date requires an explicit date note');
  if (f.kickoff && new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/London', year:'numeric', month:'2-digit',day:'2-digit'}).format(new Date(f.kickoff)) !== f.date) fail('Kick-off must agree with the UK match date');
  if (f.penalties && (f.score?.home !== f.score?.away || f.penalties.home === f.penalties.away)) fail('Penalties require a drawn score and a shootout winner');
});
const TableRow = z.object({ position: z.number().int().min(1).max(20), clubId: HistoryIdSchema, played: Count, won: Count, drawn: Count, lost: Count, goalsFor: Count, goalsAgainst: Count, points: z.number().int(), adjustment: z.number().int().default(0), note: Text.optional() }).strict().superRefine((r, ctx) => {
  if (r.played !== r.won + r.drawn + r.lost || r.points !== r.won * 3 + r.drawn + r.adjustment) ctx.addIssue({code:'custom',message:'Table totals do not reconcile'});
  if (r.adjustment && !r.note) ctx.addIssue({code:'custom',message:'A points adjustment needs an explanation'});
});
export const MatchCentreSchema = z.object({
  season: SeasonIdSchema, updatedAt: z.iso.datetime({offset:true}),
  fixtures: z.array(FixtureSchema),
  table: z.object({ asOf: z.iso.datetime({offset:true}), sourceIds: Sources, rows: z.array(TableRow).length(20) }).strict(),
  sources: z.array(z.object({id:HistoryIdSchema,label:Text,url:z.url().refine(url=>url.startsWith('https://')),checkedOn:z.iso.date()}).strict()).min(1),
}).strict().superRefine((data,ctx)=>{
  const fail=(message:string)=>ctx.addIssue({code:'custom',message});
  for(const ids of [data.fixtures.map(f=>f.id),data.sources.map(s=>s.id),data.table.rows.map(r=>r.clubId),data.table.rows.map(r=>r.position)]) if(new Set<string | number>(ids).size !== ids.length) fail('Duplicate fixture, source, club or position');
  if(data.table.rows.filter(r=>r.clubId==='liverpool').length!==1) fail('Table must include Liverpool exactly once');
  if(Date.parse(data.table.asOf)>Date.parse(data.updatedAt)) fail('Table cannot be newer than the overall update');
  const sourceIds=new Set(data.sources.map(s=>s.id));
  for(const id of [...data.table.sourceIds,...data.fixtures.flatMap(f=>[...f.sourceIds,...(f.briefing?.sourceIds??[]),...(f.preview?.sourceIds??[])])]) if(!sourceIds.has(id)) fail(`Unknown source: ${id}`);
  const start=data.season.slice(0,4), end=String(Number(start)+1);
  for(const f of data.fixtures){
    if(f.date && (f.date<`${start}-07-01` || f.date>`${end}-06-30`)) fail(`Fixture ${f.id} is outside its season`);
    if(f.status==='completed' && f.date! > data.updatedAt.slice(0,10)) fail(`Future result: ${f.id}`);
    if(f.briefing && Date.parse(f.briefing.updatedAt)>Date.parse(data.updatedAt)) fail(`Future briefing: ${f.id}`);
    if(f.preview && Date.parse(f.preview.updatedAt)>Date.parse(data.updatedAt)) fail(`Future preview: ${f.id}`);
  }
});
export type Fixture = z.infer<typeof FixtureSchema>;
export type MatchCentre = z.infer<typeof MatchCentreSchema>;

export function getMatchCentre(root = process.cwd()) {
  const dir=path.join(root,'content/match-centre/liverpool');
  const season=SeasonIdSchema.parse(JSON.parse(fs.readFileSync(path.join(dir,'current.json'),'utf8')).season);
  const data=MatchCentreSchema.parse(JSON.parse(fs.readFileSync(path.join(dir,`${season}.json`),'utf8')));
  if(data.season!==season) throw new Error('Match Centre filename must match season');
  const entities=new Map(getHistoryEntities(root).map(e=>[e.id,e]));
  const reports=new Map(getFactualHistoryArticles(root).map(a=>[a.slug,a]));
  const usedReports=new Set<string>();
  for(const f of data.fixtures){
    if(entities.get(f.oppositionId)?.kind!=='opposition' || entities.get(f.competitionId)?.kind!=='competition') throw new Error(`Invalid fixture entity: ${f.id}`);
    if(f.reportSlug){
      const report=reports.get(f.reportSlug);
      if(!report || report.articleType!=='match' || report.season!==season || report.historicalEventDate!==f.date || !report.oppositionIds?.includes(f.oppositionId) || !report.competitionIds?.includes(f.competitionId)) throw new Error(`Match report must be published and match fixture metadata: ${f.id}`);
      if(usedReports.has(f.reportSlug)) throw new Error('A match report cannot describe two fixtures');
      usedReports.add(f.reportSlug);
    }
  }
  for(const row of data.table.rows) if(row.clubId!=='liverpool' && entities.get(row.clubId)?.kind!=='opposition') throw new Error(`Unknown table club: ${row.clubId}`);
  // The snapshot uses the same Liverpool row as the table; cross-check its dated results.
  const liverpool=data.table.rows.find(r=>r.clubId==='liverpool')!;
  const league=data.fixtures.filter(f=>f.competitionId==='premier-league' && f.status==='completed' && f.date!<=data.table.asOf.slice(0,10));
  const totals={played:league.length,won:0,drawn:0,lost:0,goalsFor:0,goalsAgainst:0};
  for(const f of league){const own=f.side==='away'?f.score!.away:f.score!.home, other=f.side==='away'?f.score!.home:f.score!.away;totals.goalsFor+=own;totals.goalsAgainst+=other;totals[own>other?'won':own===other?'drawn':'lost']++;}
  for(const key of Object.keys(totals) as (keyof typeof totals)[]) if(totals[key]!==liverpool[key]) throw new Error(`Liverpool table ${key} disagrees with recorded league results`);
  return data;
}
export function selectMatches(data: Pick<MatchCentre,'fixtures'>, now = new Date()) {
  const ordered=[...data.fixtures].sort((a,b)=>(a.kickoff??a.date??'9999').localeCompare(b.kickoff??b.date??'9999')||a.id.localeCompare(b.id));
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  const waiting=ordered.filter(f=>f.status==='scheduled' && f.date && (f.kickoff?Date.parse(f.kickoff)<=now.getTime():f.date<today));
  const upcoming=ordered.filter(f=>f.status==='scheduled' && f.date && (f.kickoff?Date.parse(f.kickoff)>now.getTime():f.date>=today));
  return {
    ordered,
    last:ordered.filter(f=>f.status==='completed').at(-1),
    next:upcoming[0],
    upcoming,
    waiting,
  };
}
export function fixtureTime(f: Fixture) {
  if(!f.kickoff) return 'Kick-off TBC';
  return new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(new Date(f.kickoff));
}
export function getCurrentSeasonReading(season: string, root = process.cwd()) {
  const writing=getWriting(root).filter(a=>a.season===season);
  const reports=getFactualHistoryArticles(root).filter(a=>a.season===season && a.articleType==='match').map(a=>({...a,category:'Match report',href:`/archive/${a.slug}`}));
  return [...new Map([...writing,...reports].map(a=>[a.href,a])).values()].sort((a,b)=>b.date.localeCompare(a.date)||a.href.localeCompare(b.href));
}
