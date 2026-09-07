import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const NonEmpty = z.string().trim().min(1);
const HonourSchema = z.object({
  name: NonEmpty,
  years: z.array(NonEmpty).min(1),
}).strict();

export const EraSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  manager: NonEmpty,
  startDate: z.iso.date(),
  endDate: z.iso.date().nullable(),
  tenureLabel: NonEmpty.optional(),
  initials: NonEmpty,
  summary: NonEmpty,
  context: NonEmpty,
  honours: z.array(HonourSchema),
  otherHonours: z.array(HonourSchema).optional(),
  keyPlayers: z.array(NonEmpty).min(1).max(6),
  playersLabel: NonEmpty.optional(),
  dateNote: NonEmpty.optional(),
  image: z.object({
    src: z.string().regex(/^\/images\/history\/[a-zA-Z0-9/_-]+\.(webp|avif|png|jpg|jpeg)$/),
    alt: NonEmpty,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).strict().optional(),
  sources: z.array(z.object({
    label: NonEmpty,
    url: z.url().refine(url => url.startsWith("https://"), "Use an HTTPS source URL"),
    confidence: z.enum(["high", "medium"]),
    claims: NonEmpty,
  }).strict()).min(1),
}).strict().refine(era => !era.endDate || era.endDate >= era.startDate, {
  message: "An era cannot end before it begins", path: ["endDate"],
});

export const HistorySchema = z.object({
  verifiedOn: z.iso.date(),
  honoursNote: NonEmpty,
  eras: z.array(EraSchema).min(1),
}).strict().superRefine(({ eras, verifiedOn }, ctx) => {
  const ids = new Set<string>();
  eras.forEach((era, index) => {
    const issue = (message: string) => ctx.addIssue({ code: "custom", path: ["eras", index], message });
    if (ids.has(era.id)) issue(`Duplicate era ID: ${era.id}`);
    ids.add(era.id);
    if (index && era.startDate <= eras[index - 1].startDate) issue("Eras must be in chronological order");
    const previous = eras[index - 1];
    if (previous?.endDate && previous.endDate > era.startDate) issue("Era date ranges must not overlap (shared handover dates are allowed)");
    if (!era.endDate && index !== eras.length - 1) issue("Only the final era may be current");
    if (era.startDate > verifiedOn || (era.endDate && era.endDate > verifiedOn)) issue("Tenure dates cannot be later than the factual review date");
  });
});

export type HistoryEra = z.infer<typeof EraSchema>;

export function getHistory(root = process.cwd()) {
  const filename = path.join(root, "content/history/liverpool/eras.json");
  return HistorySchema.parse(JSON.parse(fs.readFileSync(filename, "utf8")));
}

export function eraYears(era: HistoryEra) {
  const start = era.startDate.slice(0, 4);
  const end = era.endDate?.slice(0, 4);
  return !end ? `${start}–present` : start === end ? start : `${start}–${end}`;
}

type ArchiveContext = {
  slug: string;
  date: string;
  historicalEventDate?: string;
  historyEras?: string[];
};

/** Explicit contexts win. Never infer a career from a person's name or prose date. */
export function getArticleEraIds(article: ArchiveContext, eras: HistoryEra[]): string[] {
  if (article.historyEras) {
    for (const id of article.historyEras) {
      if (!eras.some(era => era.id === id)) {
        throw new Error(`Archive article ${article.slug}: unknown historyEras ID "${id}"`);
      }
    }
    return [...new Set(article.historyEras)];
  }
  const date = article.historicalEventDate;
  if (!date) return [];
  // On a shared handover date the incoming tenure wins. Vacancies stay unassigned.
  const era = [...eras].reverse().find(era => date >= era.startDate && (!era.endDate || date <= era.endDate));
  return era ? [era.id] : [];
}

/** Select existing objects, once per canonical slug, without copying article bodies. */
export function getEraArticles<T extends ArchiveContext>(articles: T[], eraId: string, eras: HistoryEra[]): T[] {
  const seen = new Set<string>();
  return articles.filter(article => {
    if (!getArticleEraIds(article, eras).includes(eraId) || seen.has(article.slug)) return false;
    seen.add(article.slug);
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/** Omitted or missing local artwork always renders the shared decorative monogram. */
export function getEraImage(era: HistoryEra, root = process.cwd()) {
  return era.image && fs.existsSync(path.join(root, "public", era.image.src)) ? era.image : undefined;
}
