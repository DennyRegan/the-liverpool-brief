# The Liverpool Brief — Project Context

## Product
Independent Liverpool writing by Denny Regan. Home has a short introduction, one current Brief story, the latest Opinion and the latest Archive article. Articles combines writing with All / Opinion / Archive filters. Existing Archive article URLs remain permanent. This Week surfaces recurring events and a bottom Further reading collection. The Brief remains at /brief. History explores managerial eras and links the same canonical Archive articles.

## Navigation
Home | The Brief | Articles | History | This Week | About. Maintain mobile layout.

## Editorial rules
Preserve Denny’s existing opinion text and URLs. The ten original AI-written Archive articles remain withdrawn. All new articles are written by Denny; AI assists research, fact-checking and grammar only. Denny has authorised scheduled research and upload of short, source-verified historical entries. Never invent facts or dates. Long-form articles remain written by Denny.

## Architecture
Next.js App Router; local Markdown with YAML frontmatter validated by Zod. Opinion: content/articles/liverpool. Archive: content/archive/liverpool. Current brief: content/briefs/liverpool/current.md. Recurring events: content/this-week/liverpool.
Archive date remains publication date; optional historicalEventDate is the real event date. This Week matches month/day against today plus six days in Europe/London, and refers to Archive by archiveSlug, never copied body text. Archive historicalEventDate month/day automatically selects Further reading; manual archiveSlug links also qualify, with one card per article.

History skeleton: content/history/liverpool/eras.json. History uses historicalEventDate for automatic tenure placement, or optional historyEras arrays for explicit multiple contexts. Never infer a tenure from a manager name or prose period. Dalglish has two tenure IDs. Keep historical corrections in the data and preserve its sources. See docs/history-explorer.md and docs/history-sources.md.

## Verification
Node 22.18+ or 24 supports the built-in TypeScript test runner without new dependencies. Run npm test, npm run lint, npm run build. The build validates This Week entries and History eras/Archive associations before compiling. See docs/this-week.md and docs/history-explorer.md for workflows and verification. History V1 remains on its feature branch pending review; browser verification limitations are recorded in its guide.

## Working agreement
Explain important architecture choices. Keep the draft redesign reviewable before production release. About copy is provisional for Denny’s review.
