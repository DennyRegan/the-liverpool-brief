import { getArticles } from "./articles.ts";
import { getArchiveFeatures } from "./archive.ts";
import { getLiveLookingBack, LOOKING_BACK_PATH } from "./looking-back.ts";
import { BIOGRAPHIES_PATH, getLiveBiographies, getLiveSeriesParts, getSeriesDefinitions, SERIES_PATH } from "./history.ts";
import { isReganOnFootball } from "./regan-on-football.ts";
import { isKnownPlayer, playerName } from "./player-names.ts";
import { opponentName } from "./opponents.ts";
import { getLondonToday } from "./homepage.ts";

// "Continue reading": the small connected-reading box at the foot of each piece
// (approved by Denny, 9 November 2026). A piece links up automatically from its
// connection tags, with no list of related pieces to maintain:
//   players    shared Liverpool players (content/players.json)   5 points each, up to 2
//   season     same season, history pieces only ("1985-86")        5 points
//   opponents  a shared opponent (content/opponents.json)          3 points
// Pieces that share nothing are never suggested. The top three show, highest
// score first, then newest. Live, published pieces only; Football Observed (the
// general-football column) and other parts of the same series are left out.

export type ConnectedPiece = {
  href: string; title: string; kind: string; date: string;
  players: string[]; opponents: string[]; season?: string;
  /** Archive and Looking Back pieces; season only connects these. */
  history: boolean;
  /** Series slug, so parts of one series don't suggest each other (they have previous/next). */
  series?: string;
};

export type RelatedPiece = { href: string; title: string; kind: string; reasons: string[] };

/** The football season a date falls in: July starts a new one. "1985-09-21" is "1985-86". */
export function seasonOf(iso: string) {
  const year = Number(iso.slice(0, 4));
  const start = Number(iso.slice(5, 7)) >= 7 ? year : year - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/** Every live piece with its connection tags. */
export function getConnectedPieces(now = new Date(), root = process.cwd()): ConnectedPiece[] {
  const today = getLondonToday(now);
  const definitions = getSeriesDefinitions(root);
  return [
    ...getArticles(root).filter(a => a.date <= today && !isReganOnFootball(a)).map(a => ({
      href: `/articles/${a.slug}`, title: a.title, kind: a.category, date: a.date,
      players: a.players ?? [], opponents: a.opponents ?? [], history: false,
    })),
    ...getArchiveFeatures(root).map(a => ({
      href: `/archive/${a.slug}`, title: a.title, kind: a.editorialMode === "factual" ? "Feature" : "Opinion", date: a.date,
      players: a.players ?? [], opponents: a.opponents ?? [], history: true,
      season: a.season ?? (a.historicalEventDate ? seasonOf(a.historicalEventDate) : undefined),
    })),
    ...getLiveLookingBack(now, root).map(p => ({
      href: `${LOOKING_BACK_PATH}/${p.slug}`, title: p.title, kind: "On This Day", date: p.date,
      players: p.players ?? [], opponents: p.opponents ?? [], history: true, season: seasonOf(p.eventDate),
    })),
    ...getLiveBiographies(now, root).map(b => ({
      href: `${BIOGRAPHIES_PATH}/${b.slug}`, title: b.title, kind: "Biography", date: b.date,
      players: [...new Set([...(isKnownPlayer(b.slug) ? [b.slug] : []), ...(b.players ?? [])])], opponents: [], history: true,
    })),
    ...getLiveSeriesParts(now, root).map(p => {
      const series = definitions.find(d => d.slug === p.seriesSlug)!;
      return {
        href: `${SERIES_PATH}/${p.seriesSlug}/${p.slug}`, title: p.title, kind: `${series.title} · Part ${p.partNumber}`, date: p.date,
        players: p.players ?? [], opponents: p.opponents ?? [], history: true, season: p.season, series: p.seriesSlug,
      };
    }),
  ];
}

const shared = (a: readonly string[], b: readonly string[]) => a.filter(x => b.includes(x));

/** Scores one candidate against the current piece; undefined when they share nothing. */
export function connection(current: ConnectedPiece, other: ConnectedPiece) {
  if (other.href === current.href || (current.series && other.series === current.series)) return undefined;
  const players = shared(current.players, other.players);
  const season = current.history && other.history && current.season && current.season === other.season ? current.season : undefined;
  const opponents = shared(current.opponents, other.opponents);
  const score = Math.min(players.length, 2) * 5 + (season ? 5 : 0) + (opponents.length ? 3 : 0);
  if (!score) return undefined;
  const reasons = [...players.map(playerName), ...(season ? [`${season.replace("-", "–")} season`] : []), ...opponents.map(o => `v ${opponentName(o)}`)];
  return { score, reasons };
}

/** Up to `limit` related pieces for the piece at `href`, best connection first, then newest. */
export function getRelatedPieces(href: string, now = new Date(), root = process.cwd(), limit = 3): RelatedPiece[] {
  const pieces = getConnectedPieces(now, root);
  const current = pieces.find(piece => piece.href === href);
  if (!current) return [];
  return pieces
    .map(piece => ({ piece, link: connection(current, piece) }))
    .filter((entry): entry is { piece: ConnectedPiece; link: { score: number; reasons: string[] } } => entry.link !== undefined)
    .sort((a, b) => b.link.score - a.link.score || b.piece.date.localeCompare(a.piece.date) || a.piece.title.localeCompare(b.piece.title))
    .slice(0, limit)
    .map(({ piece, link }) => ({ href: piece.href, title: piece.title, kind: piece.kind, reasons: link.reasons }));
}
