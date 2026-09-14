# This Week in Liverpool History

## Text-only presentation — 8 September 2026

Denny requested removal of all illustrations in favour of clean text. This supersedes the earlier artwork approvals, illustration generation, kit-reference and image-preview workflows. Do not generate, upload, attach or restore illustrations. The scheduled Liverpool history task is text-only.

The page shows one fixed Monday-to-Sunday calendar week in Europe/London time. The range stays unchanged throughout that week and changes on the first visit after Monday midnight UK time. For example, every visit from 7 to 13 September 2026 shows 7–13 September, never 9–15 or 10–16 September. Each populated date has selected events, historical years, short summaries and direct source links. Dates without a selected event are omitted, not rendered as empty cards. There are no image areas, poster cards or full-screen image viewer. Existing site typography and spacing are reused. Header, navigation, Articles, History Explorer and canonical article URLs are unchanged.

## Adding content

Save one Markdown file per event in `content/this-week/liverpool/`. YAML and JSON frontmatter are supported:

```yaml
---
month: 9
day: 12
year: 1989
title: "Liverpool 9–0 Crystal Palace"
summary: "Replace with a concise, verified factual summary."
source: "https://example.com/replace-with-retrieved-source"
archiveSlug: "liverpool-9-crystal-palace-0"
---
```

Replace the example source with the actual retrieved URL. Do not add an image field. The optional `archiveSlug` links to an existing standalone Archive article; never duplicate its body here.

Events recur by month/day while retaining their historical year. Multiple worthwhile events can share a date. Choose the strongest by default; do not pad weak dates. The fixed calendar week handles month/year boundaries, leap years and UK daylight saving. Refresh a tab left open into a new week. If no events are available for the entire week, show one preparation message rather than seven empty day cards.

## Articles and Further reading

An Archive article's optional `historicalEventDate` controls when it appears under Further reading. Its `date` remains the publication date, so articles can be published in advance. Explicit event `archiveSlug` references also work and are deduplicated. The article stays linked for the whole Monday-to-Sunday week, including after its anniversary day passes. Denny can add his weekly article through the existing Archive system; do not create a second article system or copy its body into This Week. There remains only one underlying article.

## Scheduled workflow

Read the latest main `docs/editorial/history-calendar.json` first and follow `docs/editorial/README.md`. This is the only shared commissioning calendar; if inaccessible, stop instead of creating another plan. Maintain the current full Monday–Sunday Europe/London week plus three weeks ahead, filling nearest genuine gaps first. Reconcile live selections, published articles, saved drafts and other branches. Claim each item visibly before drafting; preserve other writers' work, save every completed draft and update status, and reconcile concurrent changes before every save. Requested factual drafts are permitted and may continue without waiting for the previous article's approval. British English, text only, retrieved-source verification and confidence labels in editorial notes remain required. Explicit Denny approval is required before publishing any new article or reclassifying an existing one. The separate Archive Planner/supporting-article queues are superseded by this calendar. The single existing weekly task remains on Monday mornings; do not create another ongoing task.

## Article-only display — review proposal, not a production claim

The separate display review branch prepares dated cards linking only to existing factual Archive articles, using historical dates and explicit event associations, with one card per canonical article and no separate Further reading list. Short annual event files remain preserved as editorial inputs; unpublished and unreviewed material does not become visible merely because a calendar row or draft exists. Empty dates are omitted and an entirely empty week has one honest preparation message. The fixed UK week is unchanged. Until the display PR is approved, merged and its release verified, the live site still uses the earlier short-entry/Further reading presentation described above. Calendar adoption alone does not release the display.

## Checks

Run `npm test`, `npm run lint` and `npm run build`. Content validation checks real dates, sources and canonical article references. The image schema remains backward-compatible, but the This Week renderer intentionally never displays images.

Open `/this-week` and check the Monday–Sunday range, populated dates only, readable summaries, source links, optional full-story links and Further reading. On a phone, no empty day cards, image space or viewer controls should appear. Regression tests must cover all seven days returning the same week, Sunday-to-Monday rollover in UK summer and winter time, month/year boundaries, leap years and article links retained all week. Existing artwork remains recoverable through Git history.
