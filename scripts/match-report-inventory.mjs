import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { getHistoryEntities } from '../lib/content/entities.ts';
import { validateCalendar, calendarPath } from './validate-editorial-calendar.mjs';

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const isMatch = a => a.editorialMode !== 'opinion' && (a.articleType === 'match' || (a.category === 'match' && !a.articleType));

// Read-only projection. Article metadata and the shared calendar remain authoritative.
export function getMatchReportInventory(root = process.cwd()) {
  const calendar = JSON.parse(fs.readFileSync(path.join(root, calendarPath), 'utf8'));
  const rows = validateCalendar(calendar, root);
  const entities = new Map(getHistoryEntities(root).map(e => [e.id, e]));
  const published = getArchiveFeatures(root).filter(isMatch).map(a => ({
    data: a, articlePath: `content/archive/liverpool/${a.slug}.md`, published: true,
  }));
  const drafts = walk(path.join(root, 'docs/editorial/drafts')).filter(f => f.endsWith('.md')).flatMap(f => {
    const { data } = matter(fs.readFileSync(f, 'utf8'));
    return isMatch(data) ? [{ data, articlePath: path.relative(root, f), published: false }] : [];
  });
  const byDate = new Map();
  for (const article of [...published, ...drafts]) {
    assert.ok(article.data.historicalEventDate, `${article.articlePath}: missing match date`);
    const key = article.data.historicalEventDate;
    const group = byDate.get(key) ?? []; group.push(article); byDate.set(key, group);
  }
  const reports = [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, group]) => {
    const publicArticles = group.filter(a => a.published);
    const row = rows.find(r => r.matchRecovery && r.historicalEventDate === date)
      ?? rows.find(r => r.historicalEventDate === date && group.some(a =>
        r.draftPath === a.articlePath || r.publishedDestination === `/archive/${a.data.slug}`));
    const preferred = publicArticles.find(a => row?.publishedDestination === `/archive/${a.data.slug}`)
      ?? publicArticles.find(a => a.data.editorialMode === 'factual') ?? publicArticles[0]
      ?? group.find(a => a.articlePath === row?.draftPath) ?? group[0];
    const a = preferred.data, recovered = row?.matchRecovery ?? null;
    const blockers = [...(recovered?.blockers ?? [])];
    if (publicArticles.length > 1) blockers.push('Multiple pre-existing public reports share this match date; none removed by migration.');
    if (!a.oppositionIds?.length && !recovered) blockers.push('Opposition metadata requires review.');
    if (!a.season) blockers.push('Principal season metadata requires review.');
    return {
      id: `match-${date}`, historicalEventDate: date, season: a.season ?? null,
      opposition: recovered?.opposition ?? a.oppositionIds?.map(id => entities.get(id).label).join(' / ') ?? null,
      oppositionIds: a.oppositionIds ?? [], competitionIds: a.competitionIds ?? [],
      competitions: (a.competitionIds ?? []).map(id => entities.get(id).label),
      matchLabel: recovered?.matchLabel ?? a.title, score: recovered?.score ?? null,
      slug: a.slug, title: a.title, articlePath: preferred.articlePath,
      draftPaths: group.filter(a => !a.published).map(a => a.articlePath),
      publishedPaths: publicArticles.map(a => a.articlePath),
      completed: recovered?.completed ?? (['ready_for_review', 'approved', 'published'].includes(row?.status) || preferred.published),
      published: preferred.published, unpublished: !preferred.published,
      status: preferred.published ? 'published' : row?.status ?? 'untracked',
      awaitingDennyReview: !preferred.published && (row?.status === 'ready_for_review' || row?.status === 'blocked'),
      approvedForFuturePublication: !preferred.published && row?.status === 'approved' && Boolean(row?.approval) && blockers.length === 0,
      approval: row?.approval ?? null,
      // featuredWeek selects an anniversary; it is never a release schedule.
      scheduled: false, scheduledAt: null, calendarRowId: row?.id ?? null,
      featuredWeek: row?.featuredWeek ?? null, selection: row?.selection ?? null,
      recoveredFromWork: Boolean(recovered), recovery: recovered, blockers,
    };
  });
  return { version: 1, source: calendarPath, derived: true, reports, notLocated: calendar.matchRecoveryGaps ?? [] };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  console.log(JSON.stringify(getMatchReportInventory(), null, 2));
}
