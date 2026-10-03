# The Liverpool Brief — Project Context

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

This file is the single source of project instructions. `AGENTS.md` only points here.

## Product
Independent Liverpool writing by Denny Regan. Home leads with the latest article and two further reads from the combined Articles collection, then a featured match report and History browsing destinations. A compact Brief follows, then three factual History picks (excluding seasons), a linked event from the fixed current week and a weekly Season spotlight. Factual History cannot displace the Articles lead. Season spotlight rotates through the canonical published seasons in chronological order, anchored to Monday 14 September 2026. The shared Europe/London Monday-to-Sunday window determines the selection; no review date, AI call or scheduled deployment is needed.

Articles is one collection. Original writing belongs in Articles, with All / Opinion / Analysis views (`/articles?type=…`); there is no Archive tab or section and the public Archive label must not return. Factual reports and biographies live in History. Legacy Archive collection routes (`/archive`, `/archive/matches`, `/archive/people`, `/archive/seasons`) redirect to `/articles`, while individual story URLs such as `/archive/[slug]` stay permanent. This Week surfaces recurring events and a bottom Further reading collection, and sits under History. The Brief remains at /brief. History is merged and live: it explores managerial eras, matches, people, seasons and competitions, and links the same canonical Archive articles. Match Centre (`/match-centre`) is the current-season fixtures, results and table utility; see docs/match-centre.md.

## Navigation
Home | The Brief | Articles | Match Centre | History | About. This Week is part of History (its nav item highlights History). Maintain mobile layout.

## Editorial rules
Preserve Denny’s opinion writing and existing text/URLs. The ten withdrawn original AI Archive articles stay withdrawn. Requested factual articles may be drafted by editors/AI, with explicit Denny approval before publication. Read the latest main `docs/editorial/history-calendar.json` and follow `docs/editorial/README.md`: stop if inaccessible, claim visibly before writing, preserve existing drafts, save each result and reconcile concurrent changes. Maintain the current UK calendar week plus three weeks ahead, filling the nearest genuine gaps first and saving drafts outside the published collections. Never invent facts, dates, sources, draft paths or approval; use British English, text only and source confidence labels in editorial notes. Continue drafting without waiting for the previous draft's approval. No separate supporting-article plan governs this work.

## Architecture
Next.js App Router; local Markdown with YAML frontmatter validated by Zod. Opinion: content/articles/liverpool. Archive: content/archive/liverpool. Current brief: content/briefs/liverpool/current.md. Recurring events: content/this-week/liverpool.
Archive date remains publication date; optional historicalEventDate is the real event date. This Week matches month/day against the fixed current Monday-to-Sunday calendar week in Europe/London, never a rolling daily window. Keep all seven dates together for the whole week; omit empty day cards. It refers to Archive by archiveSlug, never copied body text. Archive historicalEventDate month/day automatically selects Further reading for that entire week; manual archiveSlug links also qualify, with one card per article. See docs/this-week.md for the publishing contract.

History skeleton: content/history/liverpool/eras.json. History uses historicalEventDate for automatic tenure placement, or optional historyEras arrays for explicit multiple contexts. Never infer a tenure from a manager name or prose period. Dalglish has two tenure IDs. Keep historical corrections in the data and preserve its sources. See docs/history-explorer.md and docs/history-sources.md.

## Verification
Node 22.18+ or 24 supports the built-in TypeScript test runner without new dependencies. Run npm test, npm run lint, npm run build. The build validates This Week entries and History eras/Archive associations before compiling. See docs/this-week.md and docs/history-explorer.md for workflows and verification. History is merged into main; browser verification limitations are recorded in docs/history-explorer.md.

## Working agreement
Explain important architecture choices. Keep the draft redesign reviewable before production release. About copy is provisional for Denny’s review.

## Narrow automatic History publication authority — 1 October 2026

Denny authorises completed, technically ready historical career biographies and factual historical match reports explicitly opted into the automatic queue to publish without individual manuscript approval after final activation. This exception supersedes older per-article approval language only for that queue; all other editorial boundaries remain. The shared calendar stays authoritative. Read [automatic History publishing](docs/editorial/automatic-history-publishing.md) before operating it. The publisher was enabled on main on 2 October 2026 (commit `c7ab071`); always check the latest main calendar (`automaticHistory.enabled` and `pausedQueues`) for its current enabled/paused state. Denny’s 3 October continuation stores completed reports in GitHub inventory and leaves release to that existing publisher; do not manually publish or dispatch a new release.
