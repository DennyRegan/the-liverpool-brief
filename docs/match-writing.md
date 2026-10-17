# Match writing in Articles

Current match coverage belongs in the existing Articles collection, with All, Opinion, Analysis, Previews and Match reports views. Headlines lead each entry; a smaller line beneath identifies the fixture or result, competition and actual match date. There are no bare fixtures, result rows, scorecards or standings. A match enters the collection only through published writing.

## Ordinary manuscripts

New current previews/reports use `content/articles/liverpool/<slug>.md` and the existing `/articles/<slug>` route. Use `category: Preview` or `category: Match report`, plus explicit `season` and `fixtureId`. These two fields are required for those categories. Opinion and Analysis may also add the reference while retaining their original category. A reaction piece does not become a factual report simply because it discusses a match.

The Brentford article is classified as Match report at Denny’s explicit direction on 17 October 2026. Its title, dates, sources, prose and URL remain unchanged. Its match metadata is:

```yaml
category: "Match report"
season: "2026-27"
fixtureId: "2026-27-premier-league-brentford-away"
```

Use the stable fixture ID in the sourced register `content/match-centre/liverpool/<season>.json`. Do not infer an association from a headline, publication date or prose, and do not copy scores into frontmatter. Existing optional entity relationships use the same canonical registry IDs. Publication `date` stays separate from the match date; optional `historicalEventDate` must agree with the fixture when present. Optional opposition/competition relationships must include that fixture's actual entities.

A Match report requires a verified completed fixture with its recorded score. A Preview can remain readable after the match and continues to show fixture context rather than a retrospective score. Opinion/Analysis use the verified result when available. Home/away ordering, competition labels, penalties and extra time come from the original register. Unknown fixtures, missing seasons, mismatched dates/entities and reports of unfinished matches fail validation. Each article resolves its own season register, so later pointer changes do not break its reference.

Keep the existing manuscript/source conventions and approval process. Drafts belong outside public content folders. This application change authors or publishes no new article and changes no editorial queue or publication authority.

## Existing addresses and History

The saved preview/briefing prose stays in its existing register. Articles projects this writing into the collection and links to its original `/match-centre#…` destination; there is no duplicate manuscript or newly invented article URL. Its visible date is labelled **Updated**, using its actual update time, not an invented publication date. The original page remains available for old links and contains writing only. It has no permanent main-menu or homepage Explore entry. Do not automatically move or rewrite existing manuscripts.

Only factual current-season reports explicitly referenced by the current register also enter Articles. They retain their `/archive/<slug>` URL and existing History classification. Historical factual reports and biographies remain in History. No Archive schema, article body, entity eligibility, Season page, reverse list or original URL changes.

## Homepage and search

The editorial lead accepts Opinion, Analysis and ordinary Articles match reports. Historical factual content stays excluded from the lead. Timely coverage uses the selected next fixture's published Preview within the existing 48-hour window, or the latest completed match's available report within the existing matchday-plus-two-days window. Ordinary article links are preferred; stored preview/report destinations remain fallbacks. No writing means no coverage block. The same article cannot appear as both lead and coverage.

Headline, fixture/result and reading link appear together. Article filters use the existing native links and wrap on mobile. Search indexes ordinary match articles at their existing addresses and the preserved legacy writing once at `/match-centre`; it does not index fixture rows or drafts.

## Checks

Run calendar/content validation, `npm test`, `npm run lint`, `npm run build`, then `node scripts/verify-match-centre.mjs`, `node scripts/verify-homepage.mjs`, `node scripts/verify-seasons.mjs` and `node scripts/verify-history-explorer.mjs`. The existing Search/browser checks also cover Articles, headline/context order, five type filters, mobile widths, keyboard focus and draft exclusion. These are local checks and do not publish anything.
