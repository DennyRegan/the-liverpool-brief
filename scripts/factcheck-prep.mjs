#!/usr/bin/env node
// Prepares a series draft for the /factcheck command.
//
// Copies the draft to a fresh temporary folder outside the repository and removes
// any "Editorial research notes" section from the copy, so the fact-checker never
// sees the author's research. The original draft is only ever read, never written.
//
// Usage: node scripts/factcheck-prep.mjs <draft.md>
// Prints JSON: { draft, copy, original, part, report, branch, removedSections }

import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const NOTES = /editorial research notes/i;

// A Markdown heading ("## Editorial research notes") removes everything up to the
// next heading of the same or higher level. A bare or bold line ("**Editorial
// research notes**", "Editorial research notes:") has no level, so it removes
// everything to the end of the file.
export function stripResearchNotes(text) {
  const lines = text.split("\n");
  const out = [];
  let removing = false;
  let level = 0;
  let removedSections = 0;
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const heading = inFence ? null : line.match(/^(#{1,6})\s+(.*)$/);

    if (removing) {
      if (level > 0 && heading && heading[1].length <= level && !NOTES.test(heading[2])) {
        removing = false;
      } else {
        continue;
      }
    }

    if (!inFence && heading && NOTES.test(heading[2])) {
      removing = true;
      level = heading[1].length;
      removedSections += 1;
      continue;
    }
    if (!inFence && /^\s*(\*\*|__)?\s*editorial research notes\s*:?\s*(\*\*|__)?\s*:?\s*$/i.test(line)) {
      removing = true;
      level = 0;
      removedSections += 1;
      continue;
    }
    out.push(line);
  }

  const stripped = out.join("\n").replace(/\n{3,}$/, "\n");
  return { stripped, removedSections };
}

export function partNumberOf(path, text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  const fromFrontmatter = fm?.[1].match(/^partNumber:\s*"?(\d+)"?\s*$/m);
  if (fromFrontmatter) return Number(fromFrontmatter[1]);
  const fromName = basename(path).match(/part-(\d+)/i);
  if (fromName) return Number(fromName[1]);
  return null;
}

function fail(message) {
  console.error(`factcheck-prep: ${message}`);
  process.exit(1);
}

function main() {
  const arg = process.argv[2];
  if (!arg) fail("give the draft file, e.g. docs/series-drafts/part-2-the-arrival.md");

  let draft = resolve(arg);
  if (!existsSync(draft) && existsSync(resolve("docs/series-drafts", arg))) {
    draft = resolve("docs/series-drafts", arg);
  }
  if (!existsSync(draft)) fail(`no such file: ${arg}`);
  if (!draft.endsWith(".md")) fail("the draft must be a Markdown (.md) file");
  if (/-factcheck\.md$/.test(draft)) fail("that is a fact-check report, not a draft");

  const text = readFileSync(draft, "utf8");
  const part = partNumberOf(draft, text);
  if (part === null) fail("cannot tell the part number: add partNumber to the frontmatter or name the file part-N-….md");

  // The site parses every .md file under content/, so a report saved beside a
  // published article would break the build. Those reports go to the drafts folder.
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const inContent = draft.startsWith(join(repoRoot, "content") + "/");
  const reportDir = inContent ? join(repoRoot, "docs", "series-drafts") : dirname(draft);
  const report = join(reportDir, `part-${part}-factcheck.md`);
  if (report === draft) fail("report path would overwrite the draft");

  const { stripped, removedSections } = stripResearchNotes(text);
  if (NOTES.test(stripped)) {
    fail('"Editorial research notes" still appears after stripping; check the draft\'s headings by hand');
  }

  const dir = mkdtempSync(join(tmpdir(), "liverpool-brief-factcheck-"));
  const copy = join(dir, basename(draft));
  writeFileSync(copy, stripped);
  // Untouched copy, so the draft can be restored after switching to a branch cut from main.
  const original = join(dir, "original.md");
  writeFileSync(original, text);

  const branch = `series-part-${part}`;
  console.log(JSON.stringify({ draft, copy, original, part, report, branch, removedSections }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
