# The Liverpool Brief — Project Context

## Product
Independent Liverpool writing by Denny Regan. Home shows the latest three opinion articles. Articles holds all opinion pieces. Archive remains the standalone home for full historical articles. This Week surfaces short recurring historical events and manually links to Archive. The Brief remains at /brief, linked from the footer and About.

## Navigation
Home | Articles | This Week | Archive | About. Maintain mobile layout.

## Editorial rules
Preserve Denny’s existing opinion text and URLs. The ten original AI-written Archive articles remain withdrawn. All new articles are written by Denny; AI assists research, fact-checking and grammar only. Do not generate or fetch historical entries automatically.

## Architecture
Next.js App Router; local Markdown with YAML frontmatter validated by Zod. Opinion: content/articles/liverpool. Archive: content/archive/liverpool. Current brief: content/briefs/liverpool/current.md. Recurring events: content/this-week/liverpool.
Archive date remains publication date; optional historicalEventDate is the real event date. This Week matches month/day against today plus six days in Europe/London, and refers to Archive by archiveSlug, never copied body text. No automatic Archive scanning.

## Verification
Node 22.18+ or 24 supports the built-in TypeScript test runner without new dependencies. Run npm test, npm run lint, npm run build. The build validates This Week entries before compiling. See docs/this-week.md for the editorial workflow and verification.

## Working agreement
Explain important architecture choices. Keep the draft redesign reviewable before production release. About copy is provisional for Denny’s review.
