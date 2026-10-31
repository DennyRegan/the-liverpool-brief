# The Liverpool Brief — Project Context

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
This file is the single source of project instructions. `AGENTS.md` only points here.

## Product
The Liverpool Brief publishes journalism personally developed by Denny Regan: Opinion, Analysis, investigations and historical writing. It is a simple, writing-led publication. Home presents up to four journalism pieces including the latest Football Observed edition. It normally leads with non-column Opinion or Analysis, respects active editorial overrides and avoids duplicate cards. Previous column editions remain on the column page.

Articles is one collection at `/articles`, with filters for Opinion, Analysis and History that appear only when that category has published articles. The History filter and label cover only Denny's own retained Archive pieces (`editorialMode: factual`); they are not the History section. Team News is also available within Articles, including before its first approved article is published. The public Archive label must not return. Legacy Archive collection routes (`/archive`, `/archive/matches`, `/archive/people`, `/archive/seasons`) redirect to `/articles`; individual retained story URLs such as `/archive/[slug]` stay permanent.

## Editorial reset — 19 October 2026
The Brief, History, This Week, Match Centre, Search, the AI drafting pipeline and all automated publishing were retired. Removed articles return 404. Everything removed is preserved in the tag `pre-editorial-reset-2026-10-19` and branch `archive/pre-editorial-reset`. Do not restore any of it without Denny's explicit instruction.

- Never research, write or publish articles independently, and never set up automated content production or publishing.
- Publish only articles Denny has developed and explicitly approved. Do not rewrite, summarise or alter published text without approval.
- The automatic History publishing authority of 1 October 2026 is revoked. The three scheduled GitHub workflows are disabled and must stay disabled.

## Navigation
Home | Articles | Football Observed. About is in the shared footer, including the bottom of the homepage. Maintain mobile layout.

Articles provides All, Opinion, Team News, History and Football Observed collections, with Analysis also available when published. Football Observed is Denny’s weekly general-football column, reached through the main navigation and Articles category navigation at its preserved `/regan-on-football` URL. It uses existing Opinion articles tagged exactly `regan-on-football`, with canonical `/articles/[slug]` URLs. Editions are organised automatically from approved content; there is no automated writing, scheduling or publishing. See `docs/regan-on-football.md` for the publishing contract.

## Architecture
Next.js App Router; local Markdown with YAML frontmatter validated by Zod.
- Articles: `content/articles/liverpool/*.md` → `/articles/[slug]`, `category: Opinion | Analysis | Team News`. Analysis supports GitHub-flavoured Markdown tables and images/charts under `public/`.
- Team News: factual Liverpool squad updates, injuries, suspensions, availability and pre-match selection news use `category: Team News` in the normal article frontmatter. They appear in All and `/articles?type=team-news`; shared cards and article pages display the category automatically. Keep headlines, publication dates, excerpts, slugs and all other metadata in the existing format. Do not reclassify existing articles or publish pending drafts without explicit editorial approval.
- Retained earlier pieces: `content/archive/liverpool/*.md` → `/archive/[slug]`. They list as Opinion (`editorialMode: opinion`) or History (`editorialMode: factual`).
- Some article frontmatter still carries retired History relationship fields (`playerIds`, `season`, `relatedMatches` and so on). The schemas ignore them; do not add validation or features that use them.
- The newsletter (Sender) is shown only when its public configuration is present; see `docs/newsletter-signup.md`.
- Social previews are generated automatically from article metadata/body by the existing image routes. They use a shared 1200 × 630 editorial design and reuse suitable local photographs already approved for article/social publication, with a typography fallback. No per-article social graphic or new frontmatter is required. Preserve image rights and article canonicals; see `docs/social-previews.md`.

## Verification
Node 22.18+ or 24. Run `npm test`, `npm run lint`, `npm run build`.

## Working agreement
Explain important architecture choices. Do not deploy to production without Denny's explicit approval. About copy is provisional for Denny's review; do not rewrite it unprompted.

## Football Observed release approval — 30 October 2026

Denny explicitly approved committing and publishing the reviewed Football Observed feature, with Football Observed replacing About in the main navigation and About moving to the footer. This approval covers the feature and navigation only; it does not authorise publishing any forthcoming edition or changing approved prose. See `docs/football-observed-review.md` and `docs/regan-on-football.md`.

## History removed for good — 31 October 2026

Denny deliberately removed the History section. It was retired on 19 October, restored on 29 October (#80 Connected History release, #81 history week) and removed again on 31 October. **Do not rebuild, restore or re-add History, or any part of it, unless Denny asks for it by name.** The earlier "Connected History development" and "Approved infrastructure release" authorisations of 29 October are revoked.

Removed: all `/history` routes (home, matches, seasons, people, explore, series, on-this-day) and History search (`/search`); the `/this-week` redirect; the 1987–88 season atlas and preview pages; the History prototype and match-review readers; the Klopp's Liverpool series record; the History taxonomy (`content/history`: eras, entities, seasons, atlases, series, featured matches, event verifications) and its loaders and schemas; `content/this-week` and the seven history-week match reports published on 29 October; the homepage "From History" block; History in the main navigation and sitemap; History scripts, tests and documents. Old `/history/*`, `/this-week`, `/search` and the seven report URLs redirect permanently to the homepage. Everything is recoverable from tag `pre-history-removal`.

Kept: Denny's own four Archive pieces at their `/archive/` URLs, with their existing Opinion/History labels and the Articles History filter. `tests/crawlability.test.mjs` fails if History routes or content come back.
