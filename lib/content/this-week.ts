import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const HttpUrl = z.url().refine(value => /^https?:\/\//.test(value), "Use an http or https source URL");
export const HistoryEventSchema = z.object({
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  year: z.number().int().min(1).max(9999),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  source: HttpUrl,
  image: z.object({
    src: z.string().regex(/^\/images\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp|avif|gif)$/, "Use a local /images/ filename"),
    alt: z.string().trim().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).optional(),
  archiveSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use the Archive filename without .md").optional(),
}).strict().refine(event => {
  const date = new Date(`${String(event.year).padStart(4, "0")}-${String(event.month).padStart(2, "0")}-${String(event.day).padStart(2, "0")}T12:00:00Z`);
  return date.getUTCMonth() + 1 === event.month && date.getUTCDate() === event.day;
}, { message: "The historical year, month and day must form a real calendar date", path: ["day"] });

export type HistoryEvent = z.infer<typeof HistoryEventSchema> & { slug: string };

export function getHistoryEvents(root = process.cwd()): HistoryEvent[] {
  const dir = path.join(root, "content/this-week/liverpool");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(name => name.endsWith(".md")).sort().map(filename => {
    try {
      const { data, content } = matter(fs.readFileSync(path.join(dir, filename), "utf8"));
      // Short entries live wholly in frontmatter; a body risks duplicating an article.
      if (content.trim()) throw new Error("Put the short summary in frontmatter; full articles belong in Archive");
      const event = HistoryEventSchema.parse(data);
      if (event.archiveSlug && !fs.existsSync(path.join(root, "content/archive/liverpool", `${event.archiveSlug}.md`))) {
        throw new Error(`Archive article not found: ${event.archiveSlug}`);
      }
      if (event.image && !fs.existsSync(path.join(root, "public", event.image.src))) {
        throw new Error(`Image not found: ${event.image.src}`);
      }
      return { ...event, slug: filename.replace(/\.md$/, "") };
    } catch (error) {
      throw new Error(`Invalid history entry ${filename}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

export function getHistoryWindow(events: HistoryEvent[], now = new Date()) {
  // Use London's calendar day, then UTC calendar arithmetic (not 24-hour local jumps).
  // This keeps midnight and daylight-saving boundaries consistent on every server.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find(p => p.type === type)!.value;
  const today = new Date(`${part("year")}-${part("month")}-${part("day")}T12:00:00Z`);
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() + offset);
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return {
      iso: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "UTC" }),
      weekday: date.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" }),
      events: events.filter(event => event.month === month && event.day === day)
        .sort((a, b) => a.year - b.year || a.slug.localeCompare(b.slug)),
    };
  });
}
