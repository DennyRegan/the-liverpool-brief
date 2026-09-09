import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

export const HistoryIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase kebab-case ID, e.g. john-barnes");
export const HistoryIdsSchema = z.array(HistoryIdSchema)
  .refine(ids => new Set(ids).size === ids.length, "Remove duplicate relationship IDs");

const EntitySchema = z.object({
  id: HistoryIdSchema,
  label: z.string().trim().min(1),
  // Player and manager references share a single person identity.
  kind: z.enum(["person", "opposition", "competition", "location", "theme"]),
}).strict();

export const HistoryEntitiesSchema = z.array(EntitySchema).superRefine((entities, ctx) => {
  const ids = new Set<string>();
  const labels = new Set<string>();
  entities.forEach((entity, index) => {
    const label = `${entity.kind}:${entity.label.toLowerCase().replace(/\s+/g, " ")}`;
    if (ids.has(entity.id)) ctx.addIssue({ code: "custom", path: [index, "id"], message: `Duplicate canonical entity ID: ${entity.id}` });
    if (labels.has(label)) ctx.addIssue({ code: "custom", path: [index, "label"], message: `Duplicate canonical ${entity.kind} label: ${entity.label}; reuse its existing ID` });
    ids.add(entity.id);
    labels.add(label);
  });
});

export type HistoryEntity = z.infer<typeof EntitySchema>;

export function getHistoryEntities(root = process.cwd()): HistoryEntity[] {
  const filename = path.join(root, "content/history/liverpool/entities.json");
  try {
    return HistoryEntitiesSchema.parse(JSON.parse(fs.readFileSync(filename, "utf8")));
  } catch (error) {
    throw new Error(`Invalid history entities.json: ${error instanceof Error ? error.message : String(error)}`);
  }
}
