# Historical match collection — preparation and approval review

Prepared locally on 29 October 2026. Nothing committed, merged, deployed or published. Existing article prose, canonical URLs, historical entity IDs, the homepage, approved article feed and newsletter sending remain unchanged.

## What was found

**560 historical reports across 58 seasons are available in the local approval preview:** 2 currently published, 224 withdrawn and 334 unapproved draft manuscripts. This is the complete deduplicated historical report selection found in the inspected Git trees, not a new editorial shortlist.

The original preserved Archive contains **237 match-tagged files**: 228 historical items and nine contemporary 2026–27 reports. Of the 228 historical items, two are approved Opinion pieces and retain their existing classification; the remaining 226 comprise the two published factual reports and 224 withdrawn reports. The separate draft tree adds 334 canonical manuscripts. Three older report URLs are superseded accounts of already represented matches and are recorded as provenance, not restored as duplicates. Istanbul's later revised draft retains its earlier canonical URL and is counted with drafts.

GitHub independently confirmed current main at `e03e9cbaad34860ac77152d95dcd16230b2aa143` and `archive/pre-editorial-reset` at `535621fabdf86213aba98ab5e682ffd0934af5e5`. The current local checkout already contained the main delta (the approved Bradley article). The inventory scanned the preserved Archive and all editorial draft Markdown files, then checked all local Git-history Archive paths and the 1,312 draft paths ever present. The extra deleted draft path added no new match manuscript. This is a repository audit; it is not a claim to have searched every unrelated Mac folder or private cloud source. Previously prepared local 1987–88 research remains separate, unapproved editorial material.

**Already published factual reports**, confirmed against current main and live HTTP 200 responses:

- [Liverpool 5–0 Nottingham Forest, 13 April 1988](https://theliverpoolbrief.com/archive/liverpool-nottingham-forest-1988-five-at-anfield).
- [Liverpool’s Manager Scored After 21 Seconds at Goodison, 21 September 1985](https://theliverpoolbrief.com/archive/liverpools-manager-scored-after-21-seconds-at-goodison).

The two additional retained Archive URLs are approved Opinion (`liverpool-7-tottenham-0` and `liverpool-sold-their-best-player`), also returning HTTP 200. They were not reclassified or duplicated into factual Classic Matches. Eight sampled withdrawn URLs returned 404. Unsampled production URLs are classified from current main's actual content and route boundary, not from old publication dates or search-engine caches.

## How to review the collection

[Classic Matches](http://127.0.0.1:3147/history/matches) now starts with season groups, with 16 season entries per directory page. Choose a season, opponent, competition or publication status. A selected season lists at most 12 reports per page, in historical date order. Source and editorial flags are disclosed on each report card and reader.

[Seasons](http://127.0.0.1:3147/history/seasons) uses the same collection, with a decade selector and bounded pages. A season without an approved reference record is honestly labelled a **match collection**; no historical overview, statistics or transfers were invented to fill it. Both destinations reference the same `/archive/<slug>` article. Draft-only slugs reuse the previously proposed canonical paths. A reader's return link includes the correct season page number and match anchor.

The [1987–88 season](http://127.0.0.1:3147/history/seasons/1987-88) retains its existing introduction, reference facts, people, sources and optional interactive map. Its reading list now includes all **12** existing reports: one published and eleven withdrawn. The map remains the original five featured matches, explicitly labelled as a subset. No title-clincher or other new report was drafted or added.

## Factual review: evidence and limits

All **1,908 distinct cited URLs** across the 560 reports were requested with bounded concurrency, time and file-size limits. Results: 1,451 HTTP 200, 271 HTTP 404, 179 HTTP 403, and seven other statuses (including timeouts, authentication and gateway responses). Twelve requests reported an incomplete transfer or retrieval-limit error, sometimes alongside HTTP 200. A successful HTTP response is not a factual sign-off, and a blocked response is not proof of a false claim.

Fresh structured event-record comparison corroborated the stored event date for **552 reports**. Eight require a manual exact-date comparison against their retrieved narrative sources. Record names/results and URLs are preserved in each assessment. Event-date agreement is deliberately distinguished from verifying every scorer, assist, quotation, table calculation, injury detail or interpretation.

**264 reports have at least one source returning 404; 389 have some source-access issue.** These can overlap with otherwise supported accounts. Repair dead references or establish an adequate replacement before publication. Nine reports cite only one source domain. Multiple URLs on one domain are not independent confirmations. Official retrospectives, contemporary press, specialist statistical records and archive transcriptions serve different purposes; none is treated as automatically authoritative for every claim.

The collection contains about **148,280 narrative words**. This pass is a comprehensive inventory, source-access check and record/metadata triage, plus explicitly recorded targeted close reading. **It is not a new claim-by-claim editorial certification of all 560 manuscripts.** Earlier independent-review documents were identified and retained as evidence of past work, not relabelled as work repeated now.

### Ready for editorial approval

One withdrawn report is a supported candidate for approval as a concise account: [Liverpool 2–1 Everton, 3 February 1990](http://127.0.0.1:3147/archive/liverpool-everton-1990-barnes-beardsley-derby-double). Its complete 125-word narrative was read and compared with [LFChistory's match record](https://www.lfchistory.net/games/1724) and [Everton Results' season record](https://www.evertonresults.com/198990.htm). No material factual discrepancy was found within that text. Two supplementary sources were blocked; the factual checks rely on the two retrieved sources named here. Its brevity is an editorial decision, not a reason to generate padding. It remains withdrawn until Denny approves it.

**The other 557 unapproved reports still require further verification or editorial review.** Their presence in the local browser does not constitute approval. The two existing public reports retain their publication status; their presence is not presented as a fresh full-narrative certification.

### Specific flags

- Nicol at Newcastle in 1987: earlier evidence disagrees over a final-goal provider. The fresh record check does not resolve recollection versus match-account evidence.
- QPR in 1987: the relevant contemporary clipping is reportedly inside a PDF named for a later match. HTTP availability alone does not verify the clipping visually; minute conventions remain to check.
- Newcastle at Anfield in December 1987 and Manchester United in April 1988: earlier contemporary-source retrieval gaps and detailed incident/assist questions remain identified.
- Forest in April 1988: retain the approved wording that omits the disputed third-goal assist; do not silently add title arithmetic or an attribution from one source.
- Wimbledon in 1988: distinguish the first saved FA Cup final penalty from the first missed penalty.
- Paisley's 1983 Villa farewell: current match records corroborate the penalty-retake sequence but use differing 75/76-minute conventions. The manuscript's approximate wording avoids that false precision; official farewell/photo references and exact incident description still need review.
- Gerrard's 2012 derby: a linked LFChistory record is about the 1935 comparison, not the 2012 fixture. It is contextual evidence, not proof that the article's event date is wrong. The separately retrieved UEFA account supports the hat-trick/result.
- The superseded 1965 final account contains the claim that the final was three days after the Rotterdam coin toss. That conflicts with the [24 March quarter-final record](https://www.lfchistory.net/games/280) versus the May final. The older account is not reintroduced as another report.
- Thirty manuscripts contain fewer than 180 narrative words. They are flagged for an editorial depth decision; word count alone does not establish inaccuracy or poor writing.

## Metadata needing attention

All 560 included files parse using the existing Archive schema with publication date optional only in the private draft adapter. All supplied entity IDs resolve to the current registry; **no unknown IDs were found or invented**. Every included report has a canonical season and exact event-date field. Missing fields are reported, not inferred from prose or Season records:

| Field | Reports missing a populated field | Meaning |
| --- | ---: | --- |
| managerIds | 165 | Review whether the manager is a substantial subject; not mandatory tagging of every manager |
| locationIds | 71 | Venue browsing incomplete until an appropriate existing ID is confirmed |
| playerIds | 24 | Review substantial subjects; do not tag every lineup member |
| oppositionIds | 3 | Opponent filter cannot identify these until confirmed |
| competitionIds | 1 | Competition filter incomplete for this report |
| sources frontmatter | 53 | URLs exist in the prose; structured source metadata is incomplete |
| publication date | 334 | Expected for unpublished drafts; no date was manufactured |

## Implementation and publishing boundary

This extends the existing History routes and styling; it does not replace them. A private collection adapter reads one preserved manuscript per canonical slug and a review manifest only after the existing explicit local flag and loopback-host guard pass. Existing prototype files and current approved content are reused in place. New preserved files remain under `prototype/match-review/`, outside all public content loaders. SHA-256 checks invalidate stale review evidence if a manuscript changes.

Normal builds expose only the two approved factual reports, with derived match-only Season pages for their years. The rich private 1987–88 reference, all withdrawn readers and all drafts stay unavailable outside review mode. Public search, homepage, latest Articles, sitemap, anniversaries and Sunday Brief selection continue to use approved content only. No email, subscription or scheduling code was changed. No new dependencies were introduced.

A later publication needs explicit per-report editorial approval and a deliberate release plan. This preparation does not contain an auto-promotion or bulk-copy command. Existing public-directory placement would affect Articles, so feed treatment must be settled in that approval/release change rather than silently flooding the feed. No reverse article lists or alternate article URLs were added.

## Season counts

| Season | Total | Published | Withdrawn | Unapproved drafts |
| --- | ---: | ---: | ---: | ---: |
| 1925-26 | 1 | 0 | 1 | 0 |
| 1960-61 | 5 | 0 | 0 | 5 |
| 1961-62 | 6 | 0 | 0 | 6 |
| 1962-63 | 8 | 0 | 0 | 8 |
| 1963-64 | 9 | 0 | 0 | 9 |
| 1964-65 | 13 | 0 | 1 | 12 |
| 1965-66 | 12 | 0 | 0 | 12 |
| 1966-67 | 10 | 0 | 0 | 10 |
| 1967-68 | 11 | 0 | 0 | 11 |
| 1968-69 | 12 | 0 | 0 | 12 |
| 1969-70 | 13 | 0 | 0 | 13 |
| 1970-71 | 7 | 0 | 7 | 0 |
| 1971-72 | 6 | 0 | 6 | 0 |
| 1972-73 | 13 | 0 | 13 | 0 |
| 1973-74 | 9 | 0 | 9 | 0 |
| 1974-75 | 7 | 0 | 7 | 0 |
| 1975-76 | 12 | 0 | 12 | 0 |
| 1976-77 | 13 | 0 | 13 | 0 |
| 1977-78 | 12 | 0 | 12 | 0 |
| 1978-79 | 9 | 0 | 9 | 0 |
| 1979-80 | 11 | 0 | 11 | 0 |
| 1980-81 | 10 | 0 | 10 | 0 |
| 1981-82 | 10 | 0 | 10 | 0 |
| 1982-83 | 9 | 0 | 9 | 0 |
| 1983-84 | 12 | 0 | 12 | 0 |
| 1984-85 | 8 | 0 | 8 | 0 |
| 1985-86 | 11 | 1 | 10 | 0 |
| 1986-87 | 8 | 0 | 8 | 0 |
| 1987-88 | 12 | 1 | 11 | 0 |
| 1988-89 | 9 | 0 | 9 | 0 |
| 1989-90 | 9 | 0 | 9 | 0 |
| 1990-91 | 6 | 0 | 6 | 0 |
| 1991-92 | 9 | 0 | 1 | 8 |
| 1993-94 | 9 | 0 | 2 | 7 |
| 1994-95 | 9 | 0 | 0 | 9 |
| 1995-96 | 11 | 0 | 11 | 0 |
| 1996-97 | 12 | 0 | 0 | 12 |
| 1997-98 | 4 | 0 | 0 | 4 |
| 1998-99 | 5 | 0 | 0 | 5 |
| 1999-00 | 5 | 0 | 0 | 5 |
| 2000-01 | 9 | 0 | 0 | 9 |
| 2001-02 | 7 | 0 | 1 | 6 |
| 2002-03 | 6 | 0 | 0 | 6 |
| 2003-04 | 5 | 0 | 0 | 5 |
| 2004-05 | 9 | 0 | 1 | 8 |
| 2005-06 | 7 | 0 | 0 | 7 |
| 2006-07 | 8 | 0 | 1 | 7 |
| 2007-08 | 14 | 0 | 1 | 13 |
| 2008-09 | 13 | 0 | 0 | 13 |
| 2009-10 | 9 | 0 | 1 | 8 |
| 2010-11 | 12 | 0 | 0 | 12 |
| 2011-12 | 15 | 0 | 0 | 15 |
| 2012-13 | 9 | 0 | 0 | 9 |
| 2013-14 | 19 | 0 | 0 | 19 |
| 2014-15 | 13 | 0 | 0 | 13 |
| 2015-16 | 24 | 0 | 0 | 24 |
| 2016-17 | 13 | 0 | 1 | 12 |
| 2019-20 | 1 | 0 | 1 | 0 |

## Evidence and repeatable checks

- [Complete per-report inventory](../../output/match-restoration-review-2026-10-29/complete-report-inventory.md), [CSV](../../output/match-restoration-review-2026-10-29/complete-report-inventory.csv) and [season totals](../../output/match-restoration-review-2026-10-29/season-counts.csv).
- `prototype/match-review/manifest.json`: source commit/blob, preserved-file hash, status, source URLs, retrieval issues and individual findings.
- `prototype/match-review/manual-findings.json`: explicit scope and evidence for targeted reviews.
- `output/match-restoration-review-2026-10-29/`: retrieval records, live-site checks, final test/build logs and screenshots (under the parent project workspace).

Run `npm run validate:matches`, `npm run validate:history`, `npm run validate:prototype`, `npm test`, `npm run lint`, both build modes, and `npm run verify:matches` / `npm run verify:history` against review and normal servers. `scripts/prepare-match-review.mjs` is a deliberate local extraction tool, not a publishing job; rerunning it resets the assessments and requires rerunning/reviewing the audit evidence. The assessment script consumes the saved evidence files and never changes manuscript prose.

### Final verification — 29 October 2026

- All 53 tests passed; lint passed.
- History, prototype and full match-collection validation passed, including preserved manuscript bytes, known entity IDs and publication boundaries.
- Normal and local-prototype production builds passed.
- Local-review production server: 842 match-collection HTTP checks and 108 existing History route checks passed. Every one of the 560 canonical readers was checked, along with season directories and pagination.
- Normal production server: 573 match-collection HTTP checks and 38 existing History route checks passed. All 558 unapproved readers returned 404; only the two approved factual reports appeared.
- Browser checks covered desktop, 390-pixel mobile navigation and return-to-match pagination, and a final 320-pixel layout check with no horizontal overflow. The final desktop preview recorded no browser console errors. These are focused interaction checks, not a complete accessibility audit.
- The existing Node module-type warning remains non-blocking. No dependencies were added to suppress it.

The local approval server remains at [Classic Matches](http://127.0.0.1:3147/history/matches). The separate normal-build verification server was stopped after its checks.

[Desktop preview](../../output/match-restoration-review-2026-10-29/classic-matches-desktop.jpg) · [Mobile preview](../../output/match-restoration-review-2026-10-29/classic-matches-mobile.jpg). Final logs are saved beside the inventory.
