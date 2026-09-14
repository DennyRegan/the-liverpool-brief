# The Liverpool Brief — Project Context

## Product
Independent Liverpool writing by Denny Regan. Home leads with the latest article and two further reads from the combined Articles collection. A compact Brief follows, then three factual History picks (excluding seasons), a linked event from the fixed current week alongside a weekly Season spotlight, and populated History browsing destinations. Factual History cannot displace the Articles lead. Season spotlight rotates through the canonical published seasons in chronological order, anchored to Monday 14 September 2026. The shared Europe/London Monday-to-Sunday window determines the selection; no review date, AI call or scheduled deployment is needed. Articles combines writing with All / Opinion / Archive filters. Existing Archive article URLs remain permanent. This Week surfaces recurring events and a bottom Further reading collection. The Brief remains at /brief. History explores managerial eras and links the same canonical Archive articles.

## Navigation
Home | The Brief | Articles | History | This Week | About. Maintain mobile layout.

## Editorial rules
Preserve Denny’s opinion writing and existing text/URLs. The ten withdrawn original AI Archive articles stay withdrawn. Requested factual articles may be drafted by editors/AI, with explicit Denny approval before publication. Read the latest main `docs/editorial/history-calendar.json` and follow `docs/editorial/README.md`: stop if inaccessible, claim visibly before writing, preserve existing drafts, save each result and reconcile concurrent changes. Maintain the current UK calendar week plus three weeks ahead. Never invent facts, dates, sources, draft paths or approval; use British English, text only and source confidence labels in editorial notes. Continue drafting without waiting for the previous draft's approval. No separate supporting-article plan governs this work.

## Architecture
Next.js App Router; local Markdown with YAML frontmatter validated by Zod. Opinion: content/articles/liverpool. Archive: content/archive/liverpool. Current brief: content/briefs/liverpool/current.md. Recurring events: content/this-week/liverpool.
Archive date remains publication date; optional historicalEventDate is the real event date. This Week matches month/day against the fixed current Monday-to-Sunday calendar week in Europe/London, never a rolling daily window. Keep all seven dates together for the whole week; omit empty day cards. It refers to Archive by archiveSlug, never copied body text. Archive historicalEventDate month/day automatically selects Further reading for that entire week; manual archiveSlug links also qualify, with one card per article. See docs/this-week.md for the publishing contract.

History skeleton: content/history/liverpool/eras.json. History uses historicalEventDate for automatic tenure placement, or optional historyEras arrays for explicit multiple contexts. Never infer a tenure from a manager name or prose period. Dalglish has two tenure IDs. Keep historical corrections in the data and preserve its sources. See docs/history-explorer.md and docs/history-sources.md.

## Verification
Node 22.18+ or 24 supports the built-in TypeScript test runner without new dependencies. Run npm test, npm run lint, npm run build. The build validates This Week entries and History eras/Archive associations before compiling. See docs/this-week.md and docs/history-explorer.md for workflows and verification. History V1 remains on its feature branch pending review; browser verification limitations are recorded in its guide.

## Working agreement
Explain important architecture choices. Keep the draft redesign reviewable before production release. About copy is provisional for Denny’s review.
