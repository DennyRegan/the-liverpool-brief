# The Liverpool Brief — Project Context

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
This file is the single source of project instructions. `AGENTS.md` only points here.

## Product
The Liverpool Brief publishes journalism personally developed by Denny Regan: Opinion, Analysis, investigations and historical writing. It is a simple, writing-led publication. Home leads with the latest Opinion or Analysis piece, lists recent articles and links to the full collection.

Articles is one collection at `/articles`, with filters for Opinion, Analysis and History that appear only when that category has published articles. The public Archive label must not return. Legacy Archive collection routes (`/archive`, `/archive/matches`, `/archive/people`, `/archive/seasons`) redirect to `/articles`; individual retained story URLs such as `/archive/[slug]` stay permanent.

## Editorial reset — 19 October 2026
The Brief, History, This Week, Match Centre, Search, the AI drafting pipeline and all automated publishing were retired. Removed articles return 404. Everything removed is preserved in the tag `pre-editorial-reset-2026-10-19` and branch `archive/pre-editorial-reset`. Do not restore any of it without Denny's explicit instruction.

- Never research, write or publish articles independently, and never set up automated content production or publishing.
- Publish only articles Denny has developed and explicitly approved. Do not rewrite, summarise or alter published text without approval.
- The automatic History publishing authority of 1 October 2026 is revoked. The three scheduled GitHub workflows are disabled and must stay disabled.

## Navigation
Home | Articles | About. Maintain mobile layout.

## Architecture
Next.js App Router; local Markdown with YAML frontmatter validated by Zod.
- Articles: `content/articles/liverpool/*.md` → `/articles/[slug]`, `category: Opinion | Analysis`. Analysis supports GitHub-flavoured Markdown tables and images/charts under `public/`.
- Retained earlier pieces: `content/archive/liverpool/*.md` → `/archive/[slug]`. They list as Opinion (`editorialMode: opinion`) or History (`editorialMode: factual`).
- `content/history/liverpool/entities.json` and `eras.json` are internal reference data only, with no public pages. Article relationship fields (`playerIds`, `season`, `historyEras` and so on) are validated against them, so keep them.
- The newsletter (Sender) is shown only when its public configuration is present; see `docs/newsletter-signup.md`.

## Verification
Node 22.18+ or 24. Run `npm test`, `npm run lint`, `npm run build`.

## Working agreement
Explain important architecture choices. Do not deploy to production without Denny's explicit approval. About copy is provisional for Denny's review; do not rewrite it unprompted.
