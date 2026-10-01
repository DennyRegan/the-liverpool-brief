import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { ArchiveFeatureSchema } from '../lib/content/types.ts';
import { getArchiveFeatures } from '../lib/content/archive.ts';
import { getHistoryEntities } from '../lib/content/entities.ts';
import { validateCalendar, calendarPath } from './validate-editorial-calendar.mjs';
import { getMatchReportInventory } from './match-report-inventory.mjs';

// Locale-independent keys: the order needs neither a clock nor an AI decision.
export const orderingKey = value => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const biographyOrder = (a, b) => compare(orderingKey(a.subject), orderingKey(b.subject)) || compare(a.personId, b.personId);
const matchOrder = (a, b) => compare(a.historicalEventDate, b.historicalEventDate) || compare(a.slug, b.slug);

function draftBlockers(root, draftPath) {
  if (!draftPath) return ['NOT LOCATED: no completed manuscript path.'];
  const file = path.join(root, draftPath);
  if (!fs.existsSync(file)) return ['Canonical draft file is missing.'];
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const blockers = [];
  if (!ArchiveFeatureSchema.omit({ date: true, body: true }).safeParse(data).success) blockers.push('Draft metadata fails the Archive schema.');
  if (Object.hasOwn(data, 'date')) blockers.push('Unpublished draft contains a publication date.');
  if (!content.trim()) blockers.push('Draft body is empty.');
  return blockers;
}

// Pure read-only selection for future consumers. It does not approve, schedule,
// copy content, set a date, or publish. proposedOrder is only a relative rank.
export function nextApprovedUnpublished(entries) {
  return entries.filter(e => e.unpublished && !e.alreadyPublishedElsewhere && e.technicallyReady
    && e.status === 'approved' && e.approval?.by === 'Denny' && e.approval?.evidence
    && e.approval?.recordedAt && Number.isInteger(e.proposedOrder))
    .sort((a, b) => a.proposedOrder - b.proposedOrder)[0] ?? null;
}

export function getEditorialReviewQueue(kind, root = process.cwd()) {
  if (!['biographies', 'matches'].includes(kind)) throw new Error('Queue must be biographies or matches');
  const calendar = JSON.parse(fs.readFileSync(path.join(root, calendarPath), 'utf8'));
  // Fail closed on corrupt authoritative state, unknown IDs or inferred approval.
  const rows = validateCalendar(calendar, root);
  const entities = new Map(getHistoryEntities(root).map(e => [e.id, e]));
  let entries;
  if (kind === 'biographies') {
    const published = getArchiveFeatures(root);
    entries = rows.filter(r => r.migration && r.status !== 'published').map(r => {
      const personId = r.personId ?? r.migration.personId;
      const data = r.draftPath ? matter(fs.readFileSync(path.join(root, r.draftPath), 'utf8')).data : {};
      // A transfer/appointment or focused player article is not a career biography.
      // Reconcile exact slug/title and the calendar's explicit career destinations.
      const knownDestinations = rows.filter(x => (x.personId ?? x.migration?.personId) === personId)
        .map(x => x.publishedDestination).filter(Boolean);
      const publishedPaths = published.filter(a => a.slug === data.slug
        || (data.title && orderingKey(a.title) === orderingKey(data.title))
        || knownDestinations.includes(`/archive/${a.slug}`))
        .map(a => `content/archive/liverpool/${a.slug}.md`);
      return {
        id: r.id, personId, subject: entities.get(personId).label,
        articleType: data.articleType ?? null, title: data.title ?? r.event,
        slug: data.slug ?? null, canonicalDraftPath: r.draftPath, draftPath: r.draftPath,
        status: r.status, completed: r.migration.completed,
        unpublished: publishedPaths.length === 0, alreadyPublishedElsewhere: publishedPaths.length > 0,
        publishedPaths, approval: r.approval, blockers: [...r.migration.blockers,
          ...draftBlockers(root, r.draftPath), ...(publishedPaths.length ? ['Career biography already published in the repository.'] : [])],
        recoveryStatus: r.migration.completed ? 'RECOVERED' : 'NOT LOCATED',
      };
    }).sort(biographyOrder);
  } else {
    entries = getMatchReportInventory(root).reports.filter(r => r.unpublished).map(r => ({
      id: r.id, historicalEventDate: r.historicalEventDate, season: r.season,
      opposition: r.opposition, oppositionIds: r.oppositionIds,
      competition: r.competitions.join(' / '), competitionIds: r.competitionIds,
      score: r.score, matchLabel: r.matchLabel, title: r.title, slug: r.slug,
      canonicalDraftPath: r.articlePath, draftPath: r.articlePath, status: r.status,
      completed: r.completed, unpublished: true, alreadyPublishedElsewhere: false,
      publishedPaths: r.publishedPaths, approval: r.approval,
      recoveredFromWork: r.recoveredFromWork, newlyResearched: r.newlyResearched,
      calendarRowId: r.calendarRowId,
      blockers: [...r.blockers, ...draftBlockers(root, r.articlePath),
        ...(!r.oppositionIds.length ? ['Canonical opposition is missing.'] : []),
        ...(!r.competitionIds.length ? ['Canonical competition is missing.'] : [])],
    })).sort(matchOrder);
  }
  const slugCounts = new Map();
  for (const e of entries) if (e.slug) slugCounts.set(e.slug, (slugCounts.get(e.slug) ?? 0) + 1);
  let rank = 0;
  entries = entries.map(e => {
    const blockers = [...e.blockers];
    if (!e.completed) blockers.push('Completed manuscript is not recorded.');
    if (!['ready_for_review', 'approved'].includes(e.status)) blockers.push(`Editorial status is ${e.status}.`);
    if (slugCounts.get(e.slug) > 1) blockers.push('Duplicate unpublished slug.');
    const uniqueBlockers = [...new Set(blockers)];
    return { ...e, blockers: uniqueBlockers, technicallyReady: uniqueBlockers.length === 0,
      awaitingDennyReview: e.unpublished && e.status !== 'approved',
      proposedOrder: e.completed && e.canonicalDraftPath ? ++rank : null };
  });
  return {
    version: 1, kind, derived: true, source: calendarPath,
    ordering: kind === 'biographies' ? 'Canonical subject label alphabetically, accent-insensitive; person ID breaks ties.'
      : 'Historical match date ascending; slug breaks ties. Anniversary selections are not publication priority.',
    summary: { unpublished: entries.filter(e => e.unpublished).length,
      technicallyReady: entries.filter(e => e.technicallyReady).length,
      blocked: entries.filter(e => !e.technicallyReady).length,
      notLocated: kind === 'matches' ? (calendar.matchRecoveryGaps ?? []).length
        : entries.filter(e => e.recoveryStatus === 'NOT LOCATED').length },
    entries, nextApproved: nextApprovedUnpublished(entries),
    notLocated: kind === 'matches' ? calendar.matchRecoveryGaps ?? []
      : entries.filter(e => e.recoveryStatus === 'NOT LOCATED').map(e => ({ id: e.id, subject: e.subject, status: 'NOT LOCATED', draftPath: null, blockers: e.blockers })),
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  console.log(JSON.stringify(getEditorialReviewQueue(process.argv[2]), null, 2));
}
