import "server-only";
import fs from "node:fs";
import path from "node:path";
import { getHistoryEntities } from "./entities.ts";
import { getHistory, eraYears } from "./history.ts";
import { getSeasons, seasonLabel, leagueFinish } from "./seasons.ts";
import { getFactualHistoryArticles } from "./archive.ts";
import { getRelatedArchiveArticles } from "./discovery.ts";
import { validateExperience } from "../interactive-history/schema.ts";
import { compileMatchStates } from "../interactive-history/state.ts";
import type { Block, MatchExperience, MatchState, ReferenceResolvers } from "../interactive-history/types.ts";
import type { CompactState, ExperienceControls, ExperienceDocumentModel, ExperienceSummary } from "../interactive-history/models.ts";

const validId = (id: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
const publicDirectory = "content/history/liverpool/interactive";

type Environment = { NODE_ENV?: string; INTERACTIVE_HISTORY_PREVIEW?: string };

function referenceStores(root: string) {
  const entities = getHistoryEntities(root);
  const eras = getHistory(root).eras;
  const seasons = getSeasons(root);
  const articles = getFactualHistoryArticles(root);
  const refs: ReferenceResolvers = {
    entity: (id, kind) => entities.some(entity => entity.id === id && entity.kind === kind),
    era: id => eras.some(era => era.id === id),
    season: id => seasons.some(season => season.season === id),
    article: slug => articles.some(article => article.slug === slug),
    seasonEvent: (seasonId, eventId) => seasons.some(season => season.season === seasonId && season.events.some(event => event.id === eventId)),
    seasonFact: (seasonId, field, sourceIndex) => {
      const season = seasons.find(season => season.season === seasonId);
      const source = season?.sources[sourceIndex];
      if (!season || !source) return false;
      if (field === "managers") return true;
      if (field === "leaguePosition") return season.league.sourceIds.includes(source.id);
      if (field === "competitionSummary") return season.competitions.some(competition => competition.sourceIds.includes(source.id));
      return false;
    },
  };
  return { entities, eras, seasons, articles, refs };
}

/** Validate canonical stores as well as the pure schema before any projection. */
export function validateExperienceReferences(value: unknown, root = process.cwd()): MatchExperience {
  const experience = validateExperience(value, referenceStores(root).refs);
  if (experience.kind !== "match") throw new Error("Context fixtures are not reader experiences");
  return experience;
}

function readExperience(filename: string, expectedId: string, root: string): MatchExperience {
  try {
    const experience = validateExperienceReferences(JSON.parse(fs.readFileSync(filename, "utf8")), root);
    if (experience.id !== expectedId) throw new Error("Experience ID must match its filename and route slug");
    return experience;
  } catch (error) {
    throw new Error(`Invalid interactive experience ${expectedId}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** The only selector used for public routes, navigation and reverse discovery. */
export function getPublishedExperiences(root = process.cwd()): MatchExperience[] {
  const directory = path.join(root, publicDirectory);
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter(filename => filename.endsWith(".json")).sort().flatMap(filename => {
    const id = filename.slice(0, -5);
    if (!validId(id)) throw new Error(`Invalid interactive experience filename: ${filename}`);
    // A draft misplaced in the public directory still cannot become a public record.
    const raw: unknown = JSON.parse(fs.readFileSync(path.join(directory, filename), "utf8"));
    if (typeof raw === "object" && raw !== null && "publication" in raw &&
      typeof raw.publication === "object" && raw.publication !== null && "status" in raw.publication && raw.publication.status === "draft") return [];
    const experience = validateExperienceReferences(raw, root);
    if (experience.id !== id) throw new Error(`Invalid interactive experience ${filename}: ID must match filename`);
    if (experience.publication.status !== "published") return [];
    if (experience.editorial.status !== "reviewed" || experience.editorial.unresolvedIssues.some(issue => issue.blocking)) {
      throw new Error(`Interactive experience ${id} is not eligible for publication: editorial review is incomplete`);
    }
    return [experience];
  }).sort((a, b) => {
    const aDate = a.publication.status === "published" ? a.publication.publishedOn : "";
    const bDate = b.publication.status === "published" ? b.publication.publishedOn : "";
    return bDate.localeCompare(aDate) || a.id.localeCompare(b.id);
  });
}

export function getPublishedExperience(slug: string, root = process.cwd()) {
  return validId(slug) ? getPublishedExperiences(root).find(experience => experience.id === slug) : undefined;
}

/** Both gates run before any draft-path existence check or filesystem read. */
export function getPreviewExperience(slug: string, environment: Environment = process.env, root = process.cwd()) {
  if (environment.NODE_ENV !== "development" || !validId(slug) || environment.INTERACTIVE_HISTORY_PREVIEW !== slug) return undefined;
  const filename = path.join(root, "docs/editorial/interactive-history", slug, "experience.json");
  if (!fs.existsSync(filename)) return undefined;
  return readExperience(filename, slug, root);
}

export function getSeasonExperiences(seasonId: string, root = process.cwd()) {
  return getPublishedExperiences(root).filter(experience => experience.relationships.seasonIds.includes(seasonId));
}
export function getEraExperiences(eraId: string, root = process.cwd()) {
  return getPublishedExperiences(root).filter(experience => experience.relationships.eraIds.includes(eraId));
}
export function getArticleExperiences(slug: string, root = process.cwd()) {
  return getPublishedExperiences(root).filter(experience => experience.relationships.articleSlugs.includes(slug));
}
export function toExperienceSummary(experience: MatchExperience): ExperienceSummary {
  return {
    id: experience.id, title: experience.title, standfirst: experience.standfirst,
    historicalDate: experience.dateRange.start,
    publishedOn: experience.publication.status === "published" ? experience.publication.publishedOn : "",
    href: `/history/interactive/${experience.id}`,
  };
}

export function compactState(state: MatchState): CompactState {
  const extraTime = ["extra-time-first", "extra-time-interval", "extra-time-second", "end-extra-time", "shootout"].includes(state.phase);
  const limit = state.rules.substitutionLimit + (extraTime ? state.rules.extraTimeSubstitutionBonus : 0);
  return {
    phase: state.phase, timeLabel: state.clock.label,
    score: { subject: state.score.subject, opposition: state.score.opposition },
    substitutionsRemaining: { subject: limit - state.substitutionsUsed.subject, opposition: limit - state.substitutionsUsed.opposition },
    shootout: state.shootout ? {
      score: { subject: state.shootout.score.subject, opposition: state.shootout.score.opposition },
      taken: { subject: state.shootout.attemptsTaken.subject, opposition: state.shootout.attemptsTaken.opposition },
      nextSide: state.shootout.nextSide, complete: state.shootout.complete, winner: state.shootout.winner,
    } : null,
    outcome: state.outcome ? { winner: state.outcome.winner } : null,
  };
}

export function toExperienceControls(experience: MatchExperience, root = process.cwd(), options: { preview?: boolean } = {}): ExperienceControls {
  if (experience.publication.status === "draft" && !options.preview) throw new Error("A draft requires an explicit preview projection");
  const entities = getHistoryEntities(root);
  const name = (id: string) => entities.find(entity => entity.id === id)!.label;
  const states = compileMatchStates(experience.match, experience.events);
  const attempts = experience.events.filter(event => event.type === "shootout-attempt");
  return {
    id: experience.id,
    teams: { subject: "Liverpool", opposition: name(experience.match.oppositionId) },
    moments: experience.moments.map(moment => ({ id: moment.id, title: moment.title, boundary: moment.afterEventId, state: compactState(states[moment.afterEventId ?? "$initial"]) })),
    attempts: attempts.map((event, index) => ({ id: `shootout-${index + 1}`, side: event.payload.side, taker: name(event.payload.takerId), result: event.payload.description ?? event.payload.result, state: compactState(states[event.id]) })),
    sourceIds: [...new Set(experience.claims.filter(claim => claim.status === "approved" || (options.preview && experience.publication.status === "draft" && claim.status === "needs-review")).flatMap(claim => claim.sourceRefs.map(ref => ref.sourceId)))],
  };
}

/** Resolve reference-owned evidence; authors never maintain a second moment list. */
function evidenceForBlocks(blocks: Block[], experience: MatchExperience, visited = new Set<string>()): string[] {
  return blocks.flatMap(block => {
    if (block.type === "paragraph") return block.claimIds;
    if (block.type === "list") return block.items.flatMap(item => item.claimIds);
    if (block.type === "context") {
      if (visited.has(block.contextId)) return [];
      visited.add(block.contextId);
      return evidenceForBlocks(experience.contexts.find(context => context.id === block.contextId)?.blocks ?? [], experience, visited);
    }
    if (block.type === "diagram") {
      const diagram = experience.diagrams.find(diagram => diagram.id === block.diagramId)!;
      return [...diagram.claimIds, ...diagram.players.flatMap(player => player.claimIds), ...(diagram.arrows ?? []).flatMap(arrow => arrow.claimIds)];
    }
    if (block.type === "statistics") return experience.statistics.find(statistics => statistics.id === block.statisticsId)!.observations.map(observation => observation.claimId);
    if (block.type === "comparison") return block.views.flatMap(view => evidenceForBlocks([{ id: block.id, type: "diagram", diagramId: view.diagramId }], experience));
    if (block.type === "shootout") return experience.events.filter(event => event.type === "shootout-start" || event.type === "shootout-attempt").flatMap(event => event.claimIds);
    // Team lists are derived from the source-backed configuration and event prefix.
    const boundaryIndex = block.boundary === null ? -1 : experience.events.findIndex(event => event.id === block.boundary);
    return [...experience.match.rules.claimIds, ...experience.events.slice(0, boundaryIndex + 1).filter(event => event.type === "substitution" || event.type === "dismissal").flatMap(event => event.claimIds)];
  });
}

export function toExperienceDocument(experience: MatchExperience, root = process.cwd(), options: { preview?: boolean } = {}): ExperienceDocumentModel {
  if (experience.publication.status === "draft" && !options.preview) throw new Error("A draft requires an explicit preview projection");
  const { entities, eras, seasons, articles } = referenceStores(root);
  const preview = Boolean(options.preview && experience.publication.status === "draft");
  const approved = new Set(experience.claims.filter(claim => claim.status === "approved" || (preview && claim.status === "needs-review")).map(claim => claim.id));
  const contentNotes: string[] = preview ? ["This local draft presents the researched historical baseline for review. Narrative, claim locators and schematic interpretations still require editorial approval."] : [];
  const permitted = (ids: string[]) => ids.every(id => approved.has(id));
  const projectBlocks = (blocks: Block[]): Block[] => blocks.flatMap(block => {
    if (!permitted(evidenceForBlocks([block], experience))) {
      contentNotes.push("A supporting passage or module is awaiting evidence review and has been omitted from this preview.");
      return [];
    }
    return [structuredClone(block)];
  });
  const moments = experience.moments.map(moment => ({ id: moment.id, chapterId: moment.chapterId, title: moment.title, afterEventId: moment.afterEventId, blocks: projectBlocks(moment.blocks), presentation: moment.presentation }));
  const contexts = experience.contexts.map(context => ({ id: context.id, title: context.title, scope: structuredClone(context.scope), blocks: projectBlocks(context.blocks) as typeof context.blocks }));
  const momentEvidence: Record<string, string[]> = {};
  let previousIndex = -1;
  for (const moment of moments) {
    const end = moment.afterEventId === null ? -1 : experience.events.findIndex(event => event.id === moment.afterEventId);
    const eventClaims = experience.events.slice(Math.min(previousIndex + 1, end), end + 1).flatMap(event => event.claimIds);
    momentEvidence[moment.id] = [...new Set([...evidenceForBlocks(moment.blocks, experience), ...eventClaims])].filter(id => approved.has(id));
    previousIndex = Math.max(previousIndex, end);
  }
  const claimIds = new Set(Object.values(momentEvidence).flat());
  const claims = experience.claims.filter(claim => approved.has(claim.id) && claimIds.has(claim.id)).map(claim => ({
    id: claim.id, statement: claim.statement, kind: claim.kind,
    sourceRefs: claim.sourceRefs.map(ref => ({ sourceId: ref.sourceId, locator: ref.locator, relation: ref.relation })),
    temporalScope: claim.temporalScope, displayTreatment: claim.displayTreatment,
  }));
  const sourceIds = new Set(claims.flatMap(claim => claim.sourceRefs.map(ref => ref.sourceId)));
  const sources = experience.sources.filter(source => sourceIds.has(source.id)).map(source => ({
    id: source.id, title: source.title, publisher: source.publisher, url: source.url,
    publishedOn: source.publishedOn, retrievedOn: source.retrievedOn, type: source.type, scope: source.scope,
    ...(source.locator ? { locator: source.locator } : {}), limitations: [...source.limitations],
  }));
  const relatedArticles = getRelatedArchiveArticles({
    slug: `interactive:${experience.id}`, date: experience.publication.status === "published" ? experience.publication.publishedOn : experience.dateRange.end,
    historicalEventDate: experience.dateRange.start, historyEras: experience.relationships.eraIds,
    season: experience.relationships.seasonIds[0], playerIds: experience.relationships.playerIds,
    managerIds: experience.relationships.managerIds, oppositionIds: experience.relationships.oppositionIds,
    competitionIds: experience.relationships.competitionIds, locationIds: experience.relationships.locationIds,
  }, articles, eras, entities);
  const referencedNames = new Set([
    experience.match.oppositionId,
    ...Object.values(experience.match.rosters).flatMap(roster => [...roster.starters, ...roster.substitutes].map(person => person.personId)),
    ...experience.relationships.playerIds, ...experience.relationships.managerIds, ...experience.relationships.oppositionIds,
    ...experience.relationships.competitionIds, ...experience.relationships.locationIds,
  ]);
  return {
    id: experience.id, kind: experience.kind, title: experience.title, standfirst: experience.standfirst,
    dateRange: { start: experience.dateRange.start, end: experience.dateRange.end },
    relationships: structuredClone(experience.relationships), chapters: experience.chapters.map(chapter => ({ id: chapter.id, title: chapter.title })),
    moments, contexts,
    diagrams: experience.diagrams.filter(diagram => permitted([...diagram.claimIds, ...diagram.players.flatMap(player => player.claimIds)])).map(diagram => structuredClone(diagram)),
    statistics: experience.statistics.filter(statistics => permitted(statistics.observations.map(observation => observation.claimId))).map(statistics => structuredClone(statistics)),
    match: structuredClone(experience.match), events: structuredClone(experience.events),
    names: Object.fromEntries(entities.filter(entity => referencedNames.has(entity.id)).map(entity => [entity.id, entity.label])),
    teams: { subject: "Liverpool", opposition: entities.find(entity => entity.id === experience.match.oppositionId)!.label },
    states: compileMatchStates(experience.match, experience.events), claims, sources, momentEvidence,
    connections: {
      seasons: seasons.filter(season => experience.relationships.seasonIds.includes(season.season)).map(season => ({ id: season.season, title: seasonLabel(season.season), href: `/history/seasons/${season.season}` })),
      eras: eras.filter(era => experience.relationships.eraIds.includes(era.id)).map(era => ({ id: era.id, title: `${era.manager} · ${eraYears(era)}`, href: `/history/${era.id}` })),
      articles: articles.filter(article => experience.relationships.articleSlugs.includes(article.slug)).map(article => ({ id: article.slug, title: article.title, href: `/archive/${article.slug}` })),
      relatedArticles: relatedArticles.map(({ article, reasons }) => ({ id: article.slug, title: article.title, href: `/archive/${article.slug}`, excerpt: article.excerpt, reasons })),
    },
    seasonFacts: (experience.relationships.seasonFactRefs ?? []).map(ref => {
      const season = seasons.find(season => season.season === ref.seasonId)!;
      const source = season.sources[ref.sourceIndex];
      const value = ref.field === "managers" ? season.managerIds.map(id => entities.find(entity => entity.id === id)!.label).join(" / ") : ref.field === "leaguePosition" ? leagueFinish(season.league.position) : season.competitions.filter(competition => competition.sourceIds.includes(source.id)).map(competition => `${entities.find(entity => entity.id === competition.competitionId)!.label}: ${competition.result}`).join("; ");
      return { seasonId: ref.seasonId, field: ref.field, label: ref.field === "managers" ? "Season managers" : ref.field === "leaguePosition" ? "Final league position" : "Season competition summary", value, source: { title: source.label, url: source.url, scope: source.claims } };
    }),
    contentNotes: [...new Set(contentNotes)],
  };
}
