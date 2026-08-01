# The Liverpool Brief — Project Context

## Product Promise
Open the app, understand today's important Liverpool news in 30-45 seconds, close the app.

## Version 1 Scope
Homepage, Daily Brief, Source Attribution, Editor's Note, Articles, About Page.
No database, auth, or automation. Manual content only.

## Key Architecture Decisions
- Decision 019: Permanent URLs for content from Version 1 (e.g. /brief/..., /articles/...)
- Decision 020: Content stored as local Markdown files with YAML frontmatter, validated against Zod schemas
- Decision 027: Version 1 uses a single editable "Current Brief" (content/briefs/liverpool/current.md), not per-date files. Archiving deferred to a later version.
- Decision 028: Content structure is club-scoped (e.g. content/briefs/liverpool/, content/articles/liverpool/) even though only Liverpool exists in Version 1. No multi-club logic yet.

## Editorial Philosophy
Accuracy before speed. Clear attribution to original sources. Calm, plain-English tone — explain, don't sensationalise.

## Working Agreement
- Claude should explain reasoning for structural/architectural decisions before implementing them, not just execute silently.
- Routine implementation (syntax, small fixes) can proceed quickly without explanation.
- Denny reviews every significant feature against this context before it's accepted as complete.