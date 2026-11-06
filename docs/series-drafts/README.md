# Series drafts

Unapproved drafts of series parts (Klopp's Liverpool and any later series). The site never reads this folder, so nothing here publishes.

Name drafts `part-N-slug.md` (for example `part-2-the-arrival.md`), or keep `partNumber: N` in the frontmatter. The fact-check report is saved beside the draft as `part-N-factcheck.md`.

## Fact-checking a draft

In Claude Code, from the repository root:

```
/factcheck docs/series-drafts/part-2-the-arrival.md
```

What happens:

1. `scripts/factcheck-prep.mjs` copies the draft to a temporary folder outside the repository and removes any "Editorial research notes" section from the copy. The original draft is never changed.
2. A fresh `fact-checker` agent (`.claude/agents/fact-checker.md`) receives only that stripped text. It has no file access: it cannot read the draft folder, research notes or anything else in the repository, and must find its own sources on the web.
3. Its report (one table row per claim, with verdicts) is saved as `part-N-factcheck.md` next to the draft. Nothing is committed or pushed.

The report is a checking aid, not a verdict. Check every WRONG and SOURCES CONFLICT row against the cited source yourself before changing the text.

When a part is approved, move it to `content/series/[seriesSlug]/[slug].md`. Fact-check reports stay here and are never published.
