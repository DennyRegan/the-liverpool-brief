# The Liverpool Brief — Project Context

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
This file is the single source of project instructions. `AGENTS.md` only points here.

## Product
The Liverpool Brief publishes journalism personally developed by Denny Regan: Opinion, Analysis, investigations and historical writing. It is a simple, writing-led publication. Home leads with the latest Opinion or Analysis piece, lists recent articles and links to the full collection.

Articles is one collection at `/articles`, with filters for Opinion, Analysis and History that appear only when that category has published articles. Team News is also available within Articles, including before its first approved article is published. The public Archive label must not return. Legacy Archive collection routes (`/archive`, `/archive/matches`, `/archive/people`, `/archive/seasons`) redirect to `/articles`; individual retained story URLs such as `/archive/[slug]` stay permanent.

## Editorial reset — 19 October 2026
The Brief, History, This Week, Match Centre, Search, the AI drafting pipeline and all automated publishing were retired. Removed articles return 404. Everything removed is preserved in the tag `pre-editorial-reset-2026-10-19` and branch `archive/pre-editorial-reset`. Do not restore any of it without Denny's explicit instruction.

- Never research, write or publish articles independently, and never set up automated content production or publishing.
- Publish only articles Denny has developed and explicitly approved. Do not rewrite, summarise or alter published text without approval.
- The automatic History publishing authority of 1 October 2026 is revoked. The three scheduled GitHub workflows are disabled and must stay disabled.

## Navigation
Home | Articles | History | Football Observed. About is in the shared footer, including the bottom of the homepage. Maintain mobile layout.

Articles provides All, Opinion, Team News, History and Football Observed collections, with Analysis also available when published. Football Observed is Denny’s weekly general-football column, reached through the main navigation and Articles category navigation at its preserved `/regan-on-football` URL. It uses existing Opinion articles tagged exactly `regan-on-football`, with canonical `/articles/[slug]` URLs. Editions are organised automatically from approved content; there is no automated writing, scheduling or publishing. See `docs/regan-on-football.md` for the publishing contract.

## Architecture
Next.js App Router; local Markdown with YAML frontmatter validated by Zod.
- Articles: `content/articles/liverpool/*.md` → `/articles/[slug]`, `category: Opinion | Analysis | Team News`. Analysis supports GitHub-flavoured Markdown tables and images/charts under `public/`.
- Team News: factual Liverpool squad updates, injuries, suspensions, availability and pre-match selection news use `category: Team News` in the normal article frontmatter. They appear in All and `/articles?type=team-news`; shared cards and article pages display the category automatically. Keep headlines, publication dates, excerpts, slugs and all other metadata in the existing format. Do not reclassify existing articles or publish pending drafts without explicit editorial approval.
- Retained earlier pieces: `content/archive/liverpool/*.md` → `/archive/[slug]`. They list as Opinion (`editorialMode: opinion`) or History (`editorialMode: factual`).
- `content/history/liverpool/entities.json` and `eras.json` are internal reference data only, with no public pages. Article relationship fields (`playerIds`, `season`, `historyEras` and so on) are validated against them, so keep them.
- The newsletter (Sender) is shown only when its public configuration is present; see `docs/newsletter-signup.md`.
- Social previews are generated automatically from article metadata/body by the existing image routes. They use a shared 1200 × 630 editorial design and reuse suitable local photographs already approved for article/social publication, with a typography fallback. No per-article social graphic or new frontmatter is required. Preserve image rights and article canonicals; see `docs/social-previews.md`.

## Verification
Node 22.18+ or 24. Run `npm test`, `npm run lint`, `npm run build`.

## Working agreement
Explain important architecture choices. Do not deploy to production without Denny's explicit approval. About copy is provisional for Denny's review; do not rewrite it unprompted.

## Connected History development — 29 October 2026

Denny has explicitly authorised the local Connected History implementation described in `docs/connected-history.md` and `docs/seasons-publishing.md`. In this review checkout it adds History to the main navigation and establishes six destinations, series, verified anniversaries and historical search. This supersedes the earlier retired-feature/navigation restriction for this implementation only. It does not authorise deployment, merge, restoration of withdrawn content, new article publication or automatic publishing. The private 1987–88 review remains guarded and excluded from public search/sitemap/newsletter inputs. All earlier content and sending protections remain binding.

The subsequent historical-match restoration request authorises preparation of the complete preserved collection for local approval, including inventory, source checks and guarded readers. `docs/match-restoration-review.md` defines this extension. It still grants no authority to publish withdrawn articles or drafts, merge or deploy. Private preparation is not factual or editorial approval.

## Approved infrastructure release — 29 October 2026

Denny has explicitly authorised commit, push, PR, merge and deployment of the reviewed History infrastructure plus the limited public 1987–88 experience described in docs/seasons-publishing.md. This supersedes earlier local-only development and deployment restrictions for this release. Only the two existing factual match reports remain approved; all 558 other reports remain local and excluded from public source/output. The separate On This Day workstream is excluded. No automated publishing is authorised.

## Football Observed release approval — 30 October 2026

Denny explicitly approved committing and publishing the reviewed Football Observed feature, with Football Observed replacing About in the main navigation and About moving to the footer. This approval covers the feature and navigation only; it does not authorise publishing any forthcoming edition or changing approved prose. See `docs/football-observed-review.md` and `docs/regan-on-football.md`.
