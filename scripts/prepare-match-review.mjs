// Explicit local preparation command. Never writes into public content.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';
import { ArchiveFeatureSchema } from '../lib/content/types.ts';
import { getHistoryEntities } from '../lib/content/entities.ts';

const root = process.cwd();
const ref = '535621fabdf86213aba98ab5e682ffd0934af5e5';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 40e6 }).trim();
const directory = path.join(root, 'prototype/match-review');
fs.mkdirSync(path.join(directory, 'reports'), { recursive: true });
const paths = git('ls-tree', '-r', '--name-only', ref).split('\n');
const versions = new Map();
for (const sourcePath of paths.filter(p => /^(content\/archive\/liverpool|docs\/editorial\/drafts)\//.test(p) && p.endsWith('.md'))) {
  const raw = execFileSync('git', ['show', `${ref}:${sourcePath}`], { encoding: 'utf8', maxBuffer: 5e6 });
  let parsed;
  try { parsed = matter(raw); } catch { continue; }
  if (parsed.data.articleType !== 'match' || !parsed.data.slug) continue;
  const list = versions.get(parsed.data.slug) ?? [];
  list.push({ sourcePath, raw, ...parsed });
  versions.set(parsed.data.slug, list);
}
const entities = new Map(getHistoryEntities(root).map(e => [e.id, e]));
const publicFiles = fs.readdirSync('content/archive/liverpool').filter(f => f.endsWith('.md'));
const publicBySlug = new Map(publicFiles.map(filename => {
  const raw = fs.readFileSync(`content/archive/liverpool/${filename}`, 'utf8');
  return [matter(raw).data.slug, { filename, raw }];
}));
const rows = [];
for (const [slug, copies] of versions) {
  const archived = copies.find(c => c.sourcePath.startsWith('content/'));
  const source = archived ?? copies[0];
  const publicFile = publicBySlug.get(slug);
  const prototypePath = `prototype/history/reports/${slug}.md`;
  const localPath = publicFile ? `content/archive/liverpool/${publicFile.filename}` : fs.existsSync(prototypePath) ? prototypePath : `prototype/match-review/reports/${slug}.md`;
  const raw = publicFile?.raw ?? (fs.existsSync(prototypePath) ? fs.readFileSync(prototypePath, 'utf8') : source.raw);
  if (localPath.startsWith('prototype/match-review/')) fs.writeFileSync(localPath, raw);
  const { data, content } = matter(raw);
  const issues = [];
  const parsed = ArchiveFeatureSchema.omit({ date: true }).safeParse({ ...data, body: content.trim() });
  if (!parsed.success) issues.push(...parsed.error.issues.map(i => `Schema: ${i.path.join('.')}: ${i.message}`));
  for (const field of ['season', 'historicalEventDate', 'oppositionIds', 'competitionIds', 'locationIds', 'managerIds', 'playerIds', 'sources']) {
    if (!data[field] || !data[field].length) issues.push(`Missing ${field}${field === 'managerIds' || field === 'playerIds' ? '; tag only substantial subjects after review' : ''}`);
  }
  for (const [field, kind] of Object.entries({ playerIds: 'person', managerIds: 'person', oppositionIds: 'opposition', competitionIds: 'competition', locationIds: 'location', themeIds: 'theme' })) {
    for (const id of data[field] ?? []) if (entities.get(id)?.kind !== kind) issues.push(`Unknown ${field} reference: ${id}`);
  }
  if (!data.date) issues.push('No publication date; expected for an unpublished draft, assign only at approval');
  const bodyUrls = [...content.matchAll(/https?:\/\/[^\s)>]+/g)].map(m => m[0].replace(/[.,;]+$/, ''));
  const sourceUrls = [...new Set([...(data.sources ?? []).flatMap(s => s.match(/https?:\/\/[^\s)>]+/g) ?? []), ...bodyUrls])];
  const protectedOpinion = publicFile && data.editorialMode === 'opinion';
  const contemporary = data.season === '2026-27';
  const status = publicFile ? protectedOpinion ? 'published-opinion' : 'published' : archived ? 'withdrawn' : 'draft';
  const priorPaths = copies.map(c => c.sourcePath);
  const editorialNotes = paths.filter(p => /docs\/(editorial|research)\//.test(p) && p.includes(slug) && !priorPaths.includes(p));
  rows.push({ slug, title: data.title, season: data.season, historicalEventDate: data.historicalEventDate, localPath,
    sourceRef: ref, sourcePath: source.sourcePath, sourceBlob: git('rev-parse', `${ref}:${source.sourcePath}`),
    sha256: crypto.createHash('sha256').update(raw).digest('hex'), status,
    included: !contemporary && !protectedOpinion, exclusion: contemporary ? 'Contemporary 2026–27 report, outside this historical restoration' : protectedOpinion ? 'Approved Opinion; retain existing classification and canonical URL' : null,
    versionPaths: priorPaths, editorialNotes, metadataIssues: issues, sourceUrls,
    sourceDomains: [...new Set(sourceUrls.map(url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return 'invalid'; } }))],
    wordCount: content.split(/^## Sources/m)[0].trim().split(/\s+/).length,
    assessment: { outcome: publicFile ? 'already-published' : 'verification-required', scope: 'Metadata/source inventory only; factual comparison pending.', findings: [] },
  });
}
rows.sort((a,b) => a.season.localeCompare(b.season) || a.historicalEventDate.localeCompare(b.historicalEventDate) || a.slug.localeCompare(b.slug));
const legacy = [
  { slug: '1977-saint-etienne-anfield-miracle', canonicalSlug: 'liverpool-saint-etienne-1977-fairclough-winner', reason: 'Earlier account of the same 16 March 1977 match; retained as provenance, not a second report entry.' },
  { slug: 'liverpool-7-0-tottenham-september-1978', canonicalSlug: 'liverpool-7-tottenham-0', reason: 'Earlier account; current canonical writing is approved Opinion and must not be reclassified.' },
  { slug: 'wembley-1965-liverpool-first-fa-cup', canonicalSlug: 'liverpool-leeds-1965-first-fa-cup', reason: 'Earlier account of 1 May 1965; newer researched draft selected. Old claim that the final was three days after the Rotterdam coin toss requires correction.' },
].map(item => { const p = `content/archive/liverpool/${item.slug}.md`; return { ...item, path: p, ref: git('log', '--all', '--diff-filter=AM', '--format=%H', '-1', '--', p) }; });
const manifest = { auditedOn: '2026-10-29', sourceRef: ref, currentMain: 'e03e9cbaad34860ac77152d95dcd16230b2aa143', scope: 'Preserved branch Archive and editorial draft manuscripts, all local Git Archive paths, and current approved public files. Current-season reports and approved Opinion are inventoried separately.', legacy, reports: rows };
fs.writeFileSync(path.join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ uniqueManuscripts: rows.length, collection: rows.filter(r => r.included).length, statuses: Object.fromEntries([...new Set(rows.map(r => r.status))].map(s => [s, rows.filter(r => r.status === s && r.included).length])), legacyVersions: legacy.length }, null, 2));
