> The prototype has since been integrated into the local connected History experience. See [the connected History review](connected-history-review.md) for the current navigation, content boundaries and validation. The original prototype notes below describe the earlier baseline.

# Local history prototype — review notes

Built on 28 October 2026 from main `56e5b2f65265d098d65b37902fff56e4601ab2b8`, in an isolated checkout on branch `prototype/interactive-history-1987-88`. No publication, deployment, merge, push or commit was performed.

## Preview

From this checkout run `npm run prototype`, then open <http://127.0.0.1:3147/preview/history/1987-88>. Stop with Ctrl+C. Port 3147 is bound to loopback only.

For a production-mode local preview, run `npm run prototype:build` and then `npm run prototype:start`. Stop an existing preview before switching modes. Normal `npm run build` / `npm start` do not enable the prototype. The prototype uses its own `.next-history-prototype` output directory.

This checkout currently reuses the adjacent `social-previews/node_modules` via a local symlink. The lockfile and dependencies are unchanged. A standalone copy should use `npm ci` with the repository's supported Node version.

## What was reused

- Current masthead, navigation, fonts, footer, Markdown renderer and content/entity validation.
- The existing Season schema and sourced 1987–88 record. The introduction quotes its first two sentences; the record is unchanged. Old `relatedSeasons` metadata is preserved as source material but unused: no previous/next season relationships are created.
- Four withdrawn reports recovered byte-for-byte from `535621fabdf86213aba98ab5e682ffd0934af5e5`, outside public content in `prototype/history/reports`. The Forest report is read from its existing public file without a second copy. SHA-256 provenance verifies all five reports and the season record.
- Original canonical `/archive/[slug]` URLs, exact prose, source sections, event dates and original website publication dates.
- Canonical location, player, manager, competition and opposition IDs. No new subject IDs were invented.

The current `CLAUDE.md` governs live behavior. The retired `docs/connected-history.md` and `docs/seasons-publishing.md` were read from the preserved `writing-first` checkout because current main no longer contains them. Their relationship and season conventions inform this prototype; their old publishing machinery was not restored.

## Architecture and boundary

The season page, map, chronological list and report navigation share one validated selection from `lib/content/history-prototype.ts`. `groupMatchesByVenue` accepts arbitrary match selections, allowing future season/person views without implementing them now. Four venues contain five matches; Anfield contains both QPR and Forest.

The atlas is closed initially. Native buttons support keyboard activation and 44 × 44 pixel marker targets. The map uses locally stored Natural Earth geometry and sourced stadium coordinates. A London marker groups Highbury and old Wembley, with each stadium clearly named beside its report in the panel. The cluster anchor is the mean of their verified coordinates; individual stadium records remain unchanged. There are no map service calls, database, new packages or publishing jobs.

Preview access requires an explicit environment flag and a loopback Host; Vercel and CI environments disable it. The launcher binds to 127.0.0.1. This is a local-preview guard, not a substitute for authentication if someone later changes the server binding or proxies it publicly.

Preview pages carry noindex/nofollow. Existing public loaders, article collections and sitemap never read `prototype/`. Normal mode returns 404 for the season and four withdrawn reports. Forest keeps its normal reading page. The Home / Articles / About navigation and legacy collection redirects are unchanged.

## Historical review still needed

- Arsenal, QPR, Forest and Wimbledon retain empty article-level `managerIds`; Nicol has `kenny-dalglish`. Season manager metadata is present. Do not silently infer missing article relationships before editorial review.
- Report prose is preserved, not newly certified claim by claim. In particular, the QPR report's Sunday Times source is inside a PDF named for the later Luton match; its link label already discloses that mismatch. Verify the actual clipping before wider publication.
- Existing source links and retrospective descriptions remain in the reports. Attribution/provenance and any future republication remain editorial decisions; the prototype does not label these as contemporary newspaper originals or add a Denny Regan byline.
- Essential season facts reuse the sourced record. Aldridge's 29 goals were cross-checked against Liverpool FC's [30-goal club article](https://www.liverpoolfc.com/news/announcements/290701-lfc-s-30-goal-club-john-aldridge). The record cites RSSSF, Liverpool FC and LFChistory for the title, manager, unbeaten run and cup result.
- Venue coordinate source URLs and retrieval dates are in `prototype/history/venues.json`. Wembley refers to the original stadium. The atlas is deliberately schematic: no street detail, pan or zoom. Natural Earth geometry is public domain, with attribution in the map and source file.

## Verification

- `npm run validate:prototype`: passed; schemas, relationships, preserved hashes and public-content isolation.
- `npm test`: 39 passed, zero failed. Includes reusable grouping, the Anfield pair, canonical dates, coordinates, London grouping with preserved stadium identities, fail-closed flags and public sitemap isolation.
- `npm run lint`: passed.
- `npm run build -- --webpack`: passed, including TypeScript and static generation.
- `npm run prototype:build`: passed after the mobile correction.
- HTTP: all five prototype reports and season return 200 with noindex; foreign Host requests return 404; disabled mode returns 404 for withdrawn reports and season; Forest and journalism return 200; `/archive` still redirects to `/articles`; sitemap excludes the prototype and withdrawn reports.
- Journalism article main HTML is identical between normal and prototype modes. No existing content files, global styles, shared masthead or layout were edited.
- Browser review: desktop, 390-pixel and 320-pixel mobile layouts; no horizontal overflow at 320; all marker targets 44 × 44; Highbury, Newcastle, Anfield and Wembley selection; keyboard Tab/Enter activation; Anfield's two reports; atlas-to-report, next-match and return-to-season navigation. No captured browser warnings/errors. This is focused manual accessibility checking, not a comprehensive screen-reader audit.

Initial sandbox-only attempts could not bind localhost or download existing Google Fonts; permitted local/network retries succeeded. The existing Node module-type warning remains non-blocking. No final check is failing.

Screenshots and a comparison gallery are in the adjacent task output directory `../output/history-prototype-review-2026-10-28/`. The visible local production preview may already be running on port 3147; use it before starting another process.

## Design decisions for review

History uses warmer paper, red scorelines, thin newspaper rules, centred report headings and a modest initial drop cap. Reading remains a single column with an 18–19 pixel serif body. Journalism retains its current cleaner presentation and personal byline. Mobile stacks the atlas panel below the map; the reading list works with the map closed. Sources are collapsed on the season page to keep its introduction short.

Review the atmosphere, mobile amount of introductory material, London grouping and distinction between historical reports and Denny's journalism before extending the archive. No additional seasons, players, managers or publishing workflow are implemented.
