/** Deliberately small browser payload. No authoring records or server loaders. */
export type Side = "subject" | "opposition";
export type CompactState = {
  phase: string;
  timeLabel: string;
  score: Record<Side, number>;
  substitutionsRemaining: Record<Side, number>;
  shootout: null | {
    score: Record<Side, number>;
    taken: Record<Side, number>;
    nextSide: Side | null;
    complete: boolean;
    winner: Side | null;
  };
  outcome: null | { winner: Side | null };
};
export type ExperienceControls = {
  id: string;
  teams: Record<Side, string>;
  moments: Array<{ id: string; title: string; boundary: string | null; state: CompactState }>;
  attempts: Array<{ id: string; side: Side; taker: string; result: string; state: CompactState }>;
  sourceIds: string[];
};
export type ExperienceSummary = {
  id: string;
  title: string;
  standfirst: string;
  historicalDate: string;
  publishedOn: string;
  href: string;
};

import type { MatchExperience, MatchState, Claim, EvidenceSource } from "./types";
export type ExperienceConnection = { id: string; title: string; href: string };
export type PublicClaim = Pick<Claim, "id" | "statement" | "kind" | "sourceRefs" | "temporalScope" | "displayTreatment">;
export type PublicSource = Pick<EvidenceSource, "id" | "title" | "publisher" | "url" | "publishedOn" | "retrievedOn" | "type" | "scope" | "locator" | "limitations">;
/** Server reading model; never pass this object to a client component. */
export type ExperienceDocumentModel = Pick<MatchExperience,
  "id" | "kind" | "title" | "standfirst" | "dateRange" | "relationships" | "chapters" | "moments" |
  "contexts" | "diagrams" | "statistics" | "match" | "events"
> & {
  names: Record<string, string>;
  teams: Record<Side, string>;
  states: Record<string, MatchState>;
  claims: PublicClaim[];
  sources: PublicSource[];
  momentEvidence: Record<string, string[]>;
  connections: {
    seasons: ExperienceConnection[];
    eras: ExperienceConnection[];
    articles: ExperienceConnection[];
    relatedArticles: Array<ExperienceConnection & { excerpt: string; reasons: string[] }>;
  };
  seasonFacts: Array<{ seasonId: string; field: string; label: string; value: string; source: { title: string; url: string; scope: string } }>;
  contentNotes: string[];
};
