import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stripResearchNotes, partNumberOf } from "../scripts/factcheck-prep.mjs";

test("removes a heading section up to the next heading of the same level", () => {
  const text = "Intro\n\n## Editorial research notes\n\nSecret source\n\n### Sub\n\nMore secret\n\n## Next\n\nKept\n";
  const { stripped, removedSections } = stripResearchNotes(text);
  assert.equal(removedSections, 1);
  assert.doesNotMatch(stripped, /secret/i);
  assert.match(stripped, /## Next\n\nKept/);
});

test("a bold or bare marker removes everything to the end", () => {
  for (const marker of ["**Editorial research notes**", "Editorial research notes:", "**Editorial Research Notes:**"]) {
    const { stripped } = stripResearchNotes(`Body\n\n${marker}\n\n## Sources\n\nSecret\n`);
    assert.doesNotMatch(stripped, /secret|research notes/i, marker);
    assert.match(stripped, /Body/);
  }
});

test("text without notes is unchanged", () => {
  const text = "---\npartNumber: 1\n---\n\nBody\n";
  assert.deepEqual(stripResearchNotes(text), { stripped: text, removedSections: 0 });
});

test("part number comes from frontmatter, then file name", () => {
  assert.equal(partNumberOf("x.md", "---\npartNumber: 4\n---\n"), 4);
  assert.equal(partNumberOf("part-7-x.md", "no frontmatter"), 7);
  assert.equal(partNumberOf("x.md", "nothing"), null);
});

test("CLI writes a stripped copy elsewhere and leaves the draft untouched", () => {
  const dir = mkdtempSync(join(tmpdir(), "factcheck-test-"));
  const draft = join(dir, "part-3-test.md");
  const original = "Body\n\n## Editorial research notes\n\nSecret\n";
  writeFileSync(draft, original);
  const out = JSON.parse(execFileSync("node", ["scripts/factcheck-prep.mjs", draft], { encoding: "utf8" }));
  assert.equal(readFileSync(draft, "utf8"), original);
  assert.equal(out.report, join(dir, "part-3-factcheck.md"));
  assert.ok(!out.copy.startsWith(dir));
  assert.doesNotMatch(readFileSync(out.copy, "utf8"), /Secret/);
  assert.ok(!existsSync(out.report));
});
