# Seasons and Classic Matches — distinct discovery pages

Local approval preview, 29 October 2026. No publication, merge or deployment.

## Preview

- [Seasons](http://127.0.0.1:3147/history/seasons): the first developed experience, 1987–88, leads with its existing overview, principal people and an invitation to enter the story. Its canonical route, twelve connected reports and optional five-match atlas remain intact. Fifty-seven other years are explicitly report-only, in a secondary collapsed disclosure linking to Classic Matches. They are not presented as completed experiences.
- [Classic Matches](http://127.0.0.1:3147/history/matches): opens immediately into the actual report library, twelve per page, rather than a directory of years. All 560 reports remain accessible across 47 unfiltered pages. Season, decade, opponent and competition filters combine; preview also offers publication status. Historical dates determine chronology and decades.

## Content and approval boundaries

Both destinations retain the same canonical article URLs. Approved prose, title, date and metadata are unchanged. The original five prototype fixture identities are reused; explicit score-bearing article titles supply other available fixture/results. When a title lacks a result, the card uses known opponent labels and retains the original excerpt rather than extracting a potentially unrelated score from narrative prose. There is no new score database, duplicated manuscript, or fabricated metadata.

The existing flag and loopback-host guard remain mandatory for withdrawn and draft readers. The normal build shows only the two approved match reports. With no approved Season record yet, the public Seasons page honestly states that experiences are being developed and points to approved match stories. Search, homepage, Articles, sitemap and newsletter still exclude all 558 unapproved reports. No other History categories were redesigned.

## Verification

All 54 tests, lint, History/prototype/collection validation and both production build modes passed. HTTP verification checks all canonical readers, every unfiltered library page, all season reading lists, combined filters, decade boundaries, pagination, public feeds and foreign-host rejection. Browser checks cover desktop and mobile layouts, season filtering and entry into the preserved interactive map. These are focused accessibility/interaction checks, not a full accessibility audit.

Final HTTP totals, screenshots and logs are saved in the companion output folder. The existing non-blocking Node module-type warning remains.

Final production HTTP results: 758 collection checks and 143 existing History route checks passed in approval-preview mode; 573 collection checks and 38 existing History route checks passed in normal mode. All 558 unapproved readers returned 404 in normal mode. All 47 unfiltered library pages and every season’s chronological pages were traversed. The unchanged preview keeps all 12 reports for 1987–88.

Desktop screenshots and mobile captures (390-pixel Seasons and 320-pixel Classic Matches) are saved with the logs at [the review folder](../../output/history-distinction-review-2026-10-29/). Neither mobile layout had horizontal overflow. The browser confirmed the season entry link, native season filter and interactive map toggle. The approval server remains on port 3147; the normal verification server was stopped.

[Seasons screenshot](../../output/history-distinction-review-2026-10-29/seasons-desktop.jpg) · [Classic Matches screenshot](../../output/history-distinction-review-2026-10-29/matches-desktop.jpg).
