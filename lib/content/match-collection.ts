import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import { z } from 'zod';
import { ArchiveFeatureSchema } from './types.ts';
import { prototypeMatchIdentity } from './history-prototype.ts';
import { getHistoryLibrary, type HistoryLibrary } from './history-library.ts';

// Drafts deliberately have no invented publication date or factual approval.
const ReviewArticleSchema = ArchiveFeatureSchema.omit({ date: true }).extend({ date: z.iso.date().optional() });
const ReviewEntrySchema = z.object({
  slug: z.string(), title: z.string(), season: z.string(), historicalEventDate: z.iso.date(),
  localPath: z.string(), sourceRef: z.string(), sourcePath: z.string(), sourceBlob: z.string(), sha256: z.string(),
  status: z.enum(['published', 'published-opinion', 'withdrawn', 'draft']), included: z.boolean(),
  exclusion: z.string().nullable(), versionPaths: z.array(z.string()), editorialNotes: z.array(z.string()),
  metadataIssues: z.array(z.string()), sourceUrls: z.array(z.string()), sourceDomains: z.array(z.string()), wordCount: z.number(),
  assessment: z.object({ outcome: z.string(), scope: z.string(), findings: z.array(z.string()),
    coreRecords: z.array(z.object({ url: z.string(), name: z.string(), date: z.string(), venue: z.string().optional() })).optional(),
    sourceAccessIssues: z.array(z.object({ url: z.string(), status: z.number(), error: z.string().nullable() })).optional(),
  }).passthrough(),
}).passthrough();
const ManifestSchema = z.object({ auditedOn: z.iso.date(), sourceRef: z.string(), currentMain: z.string(), reports: z.array(ReviewEntrySchema) }).passthrough();
export type MatchReview = z.infer<typeof ReviewEntrySchema>;
export type CollectionMatch = z.infer<typeof ReviewArticleSchema> & { href: string; publication: 'published' | 'withdrawn' | 'draft'; review?: MatchReview };
export const MATCH_PAGE_SIZE = 12;
export function readMatchManifest(root = process.cwd()) {
  return ManifestSchema.parse(JSON.parse(fs.readFileSync(path.join(root, 'prototype/match-review/manifest.json'), 'utf8')));
}
export function getMatchCollection(root = process.cwd(), review = false): CollectionMatch[] {
  const published = getHistoryLibrary(root).articles.filter(a => a.articleType === 'match').sort((a,b) => (a.historicalEventDate ?? '').localeCompare(b.historicalEventDate ?? '') || a.slug.localeCompare(b.slug));
  if (!review) return published.map(a => ({ ...a, publication: 'published' }));
  const manifest = readMatchManifest(root);
  const entries = manifest.reports.filter(r => r.included);
  if (new Set(entries.map(r => r.slug)).size !== entries.length) throw new Error('Duplicate canonical report in review manifest');
  const reports: CollectionMatch[] = entries.map(entry => {
    if (!/^(prototype\/(match-review|history)\/reports|content\/archive\/liverpool)\/[a-z0-9-]+\.md$/.test(entry.localPath)) throw new Error(`Unsafe report path: ${entry.slug}`);
    const raw = fs.readFileSync(path.join(root, entry.localPath), 'utf8');
    if (crypto.createHash('sha256').update(raw).digest('hex') !== entry.sha256) throw new Error(`Review evidence is stale: ${entry.slug}; re-review changes before updating its hash`);
    const { data, content } = matter(raw);
    const article = ReviewArticleSchema.parse({ ...data, body: content.trim() });
    if (article.slug !== entry.slug || article.season !== entry.season || article.historicalEventDate !== entry.historicalEventDate || article.articleType !== 'match') throw new Error(`Review identity mismatch: ${entry.slug}`);
    const live = published.find(a => a.slug === article.slug);
    if ((entry.status === 'published') !== Boolean(live)) throw new Error(`Publication state changed: ${entry.slug}; review the manifest`);
    if (entry.status === 'published-opinion') throw new Error('Opinion cannot enter the factual match collection');
    return { ...article, href: `/archive/${article.slug}`, publication: entry.status, review: entry };
  });
  // Newly approved articles remain discoverable without maintaining a reverse list.
  for (const article of published) if (!reports.some(r => r.slug === article.slug)) reports.push({ ...article, publication: 'published' });
  return reports.sort((a,b) => (a.historicalEventDate ?? '').localeCompare(b.historicalEventDate ?? '') || a.slug.localeCompare(b.slug));
}
export function matchSeasons(matches: CollectionMatch[]) {
  return [...new Set(matches.flatMap(a => a.season ? [a.season] : []))].sort().map(season => {
    const reports = matches.filter(a => a.season === season);
    return { season, total: reports.length, published: reports.filter(a => a.publication === 'published').length,
      withdrawn: reports.filter(a => a.publication === 'withdrawn').length, draft: reports.filter(a => a.publication === 'draft').length };
  });
}
export function paginate<T>(items: T[], requested?: string, size = MATCH_PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const parsed = requested && /^\d+$/.test(requested) ? Number(requested) : 1;
  const page = Math.max(1, Math.min(Number.isSafeInteger(parsed) ? parsed : 1, pages));
  return { items: items.slice((page - 1) * size, page * size), page, pages, total: items.length };
}
export function seasonMatchHref(match: CollectionMatch, matches: CollectionMatch[]) {
  if (!match.season) return '/history/matches';
  const reports = matches.filter(a => a.season === match.season);
  const index = reports.findIndex(a => a.slug === match.slug);
  const page = Math.floor(Math.max(0, index) / MATCH_PAGE_SIZE) + 1;
  return `/history/seasons/${match.season}${page > 1 ? `?page=${page}` : ''}#article-${match.slug}`;
}

/** Decades refer to the match date, including seasons that span a decade boundary. */
export function matchDecade(match: CollectionMatch): string {
  return match.historicalEventDate ? `${match.historicalEventDate.slice(0, 3)}0` : '';
}
/** Reuse explicit title wording only; never infer home/away or a score from prose. */
export function matchFixture(match: CollectionMatch, labels: Map<string, string>): string | undefined {
  const selected = prototypeMatchIdentity(match.slug);
  if (selected) return `${selected.home} ${selected.score} ${selected.away}`;
  const prefix = match.title.split(':')[0].trim();
  if (/^[\p{L} .’'&()–-]+ \d{1,2}[–-]\d{1,2} [\p{L} .’'&()–-]+$/u.test(prefix) && prefix.includes('Liverpool')) return prefix;
  const opponents = (match.oppositionIds ?? []).map(id => labels.get(id)).filter(Boolean);
  return opponents.length ? `Liverpool against ${opponents.join(' / ')}` : undefined;
}

// Editorial order only. Approval and verification remain in their existing sources of truth.
export function getFeaturedMatches(library: HistoryLibrary, root = process.cwd()) {
  const file = path.join(root, 'content/history/liverpool/featured-matches.json');
  const slugs = z.array(z.string().regex(/^[a-z0-9-]+$/)).max(3)
    .refine(ids => new Set(ids).size === ids.length, 'Duplicate featured match')
    .parse(fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []);
  return slugs.flatMap(slug => {
    const article = library.articles.find(a => a.slug === slug && a.articleType === 'match');
    const verified = library.events.some(e => e.id === `article-${slug}` && e.date === article?.historicalEventDate && e.href === article?.href);
    return article && verified ? [{ ...article, publication: 'published' as const }] : [];
  });
}
