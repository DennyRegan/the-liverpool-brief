# This Week in Liverpool History

## Text-only presentation — 8 September 2026

Denny requested removal of all illustrations in favour of clean text. This supersedes the earlier artwork approvals, illustration generation, kit-reference and image-preview workflows. Do not generate, upload, attach or restore illustrations. The scheduled Liverpool history task is text-only.

The page shows one fixed Monday-to-Sunday calendar week in Europe/London time. The range stays unchanged throughout that week and changes on the first visit after Monday midnight UK time. For example, every visit from 7 to 13 September 2026 shows 7–13 September, never 9–15 or 10–16 September. All already-published factual articles for the week are visible from Monday, including those with anniversaries later in the week. Dates without a published article are omitted, not rendered as empty cards. The homepage shows today's story when available, otherwise the next story this week, or the most recent story if none remain; its This Week section stays visible even when the week is empty. Drafts remain private. There are no image areas, poster cards or full-screen image viewer. Existing site typography and spacing are reused. Header, navigation, Articles, History Explorer and canonical article URLs are unchanged.

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

Events recur by month/day while retaining their historical year. Multiple worthwhile events can share a date. Choose the strongest by default; do not pad weak dates. The fixed calendar week handles month/year boundaries, leap years and UK daylight saving. Refresh a tab left open into a new week. If no published articles are available for the entire week, show one preparation message rather than seven empty day cards.

## Published articles

A factual article's optional `historicalEventDate` determines its anniversary date on This Week. Its `date` remains the publication date, so articles can be published in advance. Explicit event `archiveSlug` references also work and are deduplicated. All approved, published articles for the Monday-to-Sunday week appear together; no draft is revealed by a calendar row. Denny can add his weekly article through the existing Archive system; do not create a second article system or copy its body into This Week. There remains only one underlying article.

## Scheduled workflow

Read the latest main `docs/editorial/history-calendar.json` first and follow `docs/editorial/README.md`. This is the only shared commissioning calendar; if inaccessible, stop instead of creating another plan. Maintain the current full Monday–Sunday Europe/London week plus three weeks ahead, filling nearest genuine gaps first. Reconcile live selections, published articles, saved drafts and other branches. Claim each item visibly before drafting; preserve other writers' work, save every completed draft and update status, and reconcile concurrent changes before every save. Requested factual drafts are permitted and may continue without waiting for the previous article's approval. British English, text only, retrieved-source verification and confidence labels in editorial notes remain required. Explicit Denny approval is required before publishing any new article or reclassifying an existing one. The separate Archive Planner/supporting-article queues are superseded by this calendar. The single existing weekly task remains on Monday mornings; do not create another ongoing task.

## Article-only display

The calendar shows dated cards linking only to existing factual Archive articles, using historical dates and explicit event associations, with one card per canonical article and no separate Further reading list. Short annual event files remain preserved as editorial inputs; unpublished and unreviewed material does not become visible merely because a calendar row or draft exists. Empty dates are omitted and an entirely empty week has one honest preparation message. The fixed UK week is unchanged.

## Checks

Run `npm test`, `npm run lint` and `npm run build`. Content validation checks real dates, sources and canonical article references. The image schema remains backward-compatible, but the This Week renderer intentionally never displays images.

Open `/this-week` and check the Monday–Sunday range, all populated dates including later days, readable summaries and full-story links. Check that the homepage This Week section stays visible on a date without a story. On a phone, no empty day cards, image space or viewer controls should appear. Regression tests must cover all seven days returning the same week, Sunday-to-Monday rollover in UK summer and winter time, month/year boundaries, leap years and article links retained all week. Existing artwork remains recoverable through Git history.
