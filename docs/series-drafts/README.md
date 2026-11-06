# Series drafts

Unapproved drafts of series parts (Klopp's Liverpool and any later series). The site never reads this folder, so nothing here publishes.

Name drafts `part-N-slug.md` (for example `part-2-the-arrival.md`), or keep `partNumber: N` in the frontmatter. The fact-check report is saved beside the draft as `part-N-factcheck.md`.

## Fact-checking a draft

In Claude Code, from the repository root:

```
/factcheck docs/series-drafts/part-2-the-arrival.md
```

What happens, in one go:

1. `scripts/factcheck-prep.mjs` copies the draft to a temporary folder outside the repository and removes any "Editorial research notes" section from the copy.
2. A fresh `fact-checker` agent (`.claude/agents/fact-checker.md`) receives only that stripped text. It has no file access and finds its own sources on the web.
3. A branch `series-part-N` is cut from `main`, and the full report is saved as `part-N-factcheck.md` next to the draft (or here, if the article is already in `content/`).
4. A second fresh agent applies fixes under strict rules: cut, soften, attribute, or correct a fact only from a page it opened itself. Hindsight and unattributed motives are softened or attributed. It never uses research notes, memory or snippets.
5. Tests, lint and the build run. If any fails, the run stops before committing.
6. The article and report are committed and a ready-for-review pull request is opened, listing what changed, what could not be confirmed and what needs Denny's decision. Nothing is merged or deployed.

The report is a checking aid, not a verdict. Check the pull request's changes against the report before merging.

When a part is approved, move it to `content/series/[seriesSlug]/[slug].md`. Fact-check reports stay here and are never published.
