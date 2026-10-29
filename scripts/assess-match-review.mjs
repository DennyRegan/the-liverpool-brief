// Apply reproducible, limited-scope audit evidence. Does not grant publication authority.
import fs from 'node:fs';
import path from 'node:path';
const directory = 'prototype/match-review';
const evidence = path.resolve('../output/match-restoration-review-2026-10-29');
const manifest = JSON.parse(fs.readFileSync(`${directory}/manifest.json`, 'utf8'));
const manual = JSON.parse(fs.readFileSync(`${directory}/manual-findings.json`, 'utf8'));
const retrievals = ['source-retrievals.json', 'supplement-source-retrievals.json', 'remaining-source-retrievals.json'].flatMap(name => JSON.parse(fs.readFileSync(path.join(evidence,name),'utf8')));
const byUrl = new Map(retrievals.map(r => [r.url, r]));
for (const report of manifest.reports) {
 if (!report.included) continue;
 const sources = report.sourceUrls.map(url => byUrl.get(url)).filter(Boolean);
 const records = sources.flatMap(source => (source.records ?? []).filter(r => r.startDate?.slice(0,10) === report.historicalEventDate).map(record => ({ url: source.url, name: record.name, date: record.startDate, venue: record.location?.name })));
 const inaccessible = sources.filter(s => s.status !== 200 || s.error);
 const broken = sources.filter(s => [404,410].includes(s.status));
 const redirects = sources.filter(s => { try { return new URL(s.url).hostname.replace(/^www\./,'') !== new URL(s.finalUrl).hostname.replace(/^www\./,''); } catch { return false; } });
 const findings = [];
 if (records.length) findings.push(`Independently retrieved match record agrees with the stored event date: ${records[0].name}, ${records[0].date}. This confirms the cited record's identity/date; it does not certify every goal, assist, quotation or contextual claim in the article.`);
 else findings.push('No exact-date structured match record was confirmed in this pass. Other cited material was requested; complete the date/result comparison against its actual text before approval.');
 if (broken.length) findings.push(`${broken.length} cited links returned 404/410. Repair or replace those references without rewriting supported prose automatically.`);
 const restricted = inaccessible.length - broken.length;
 if (restricted > 0) findings.push(`${restricted} further cited links were blocked, timed out, exceeded the retrieval size limit or returned another access error. That is an access limitation, not evidence that the historical claim is false.`);
 if (redirects.length) findings.push(`${redirects.length} source links redirect to a different host. Check the destination's relevance; HTTP 200 is not evidence of source quality.`);
 if (report.sourceDomains.length < 2) findings.push('Recorded sources come from one domain. Review independence and claim coverage; several links on one site are not several independent confirmations.');
 if (report.wordCount < 180) findings.push(`Brief treatment: ${report.wordCount} narrative words. Review whether this supplies enough context for the collection; length alone does not establish poor quality.`);
 if (report.status !== 'published') findings.push('Full narrative verification remains required unless the targeted review below explicitly clears this report. Previous factual labels and old publication dates are not current approval.');
 const review = manual.reports[report.slug];
 if (review?.findings) findings.push(...review.findings);
 if (review?.outcome === 'ready-for-approval') {
  const i = findings.findIndex(f => f.startsWith('Full narrative verification')); if (i >= 0) findings.splice(i,1);
 }
 report.assessment = { outcome: report.status === 'published' ? 'already-published' : review?.outcome ?? 'verification-required',
   scope: review?.scope ?? 'Independent event-record comparison, source-access and metadata triage. This is not a full claim-by-claim factual or editorial sign-off.',
   findings, coreRecords: records, checkedSourceCount: sources.length,
   sourceAccessIssues: inaccessible.map(s => ({ url: s.url, status: s.status, error: s.error ?? null })),
   redirectedSources: redirects.map(s => ({ url: s.url, destination: s.finalUrl })),
   targetedEvidence: review?.sourceUrls ?? [], reviewedOn: '2026-10-29' };
}
manifest.auditMethod = 'All included source URLs requested; structured event dates compared independently where available. Metadata validated against current canonical IDs. Targeted close reading is separately recorded. No automated check is publication approval.';
fs.writeFileSync(`${directory}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({ reports:manifest.reports.filter(r=>r.included).length, sourceUrls:byUrl.size, exactDateRecord:manifest.reports.filter(r=>r.included&&r.assessment.coreRecords?.length).length, readyForApproval:manifest.reports.filter(r=>r.assessment.outcome==='ready-for-approval').map(r=>r.slug) },null,2));
