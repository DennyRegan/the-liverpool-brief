# This Week in Liverpool History

## What was built

`/this-week` shows today and the next six dates, in Europe/London time. Each date shows zero, one or multiple historical events. Empty dates have a small “No entry yet” line. No events have been invented or seeded into production.

Navigation is Home | Articles | This Week | Archive | About. Archive remains separate and currently empty; the withdrawn AI articles have not been restored. Existing Archive route templates, match/person/season behaviour and full-article URLs are retained for Denny’s future writing. The Brief remains at `/brief`, linked in the footer and About. Home keeps the latest three opinion articles and Articles keeps the full collection.

## Add an event

Create one `.md` file in `content/this-week/liverpool/`, using a descriptive unique filename such as `1989-09-12-crystal-palace.md`.

This is an illustrative template using the event supplied in the request, not a verified research entry. Replace the summary and source with your own verified content before publishing. The placeholder source is not evidence.

```yaml
---
month: 9
day: 12
year: 1989
title: "Liverpool 9–0 Crystal Palace"
summary: "Replace this with your short, verified summary."
source: "https://example.com/replace-with-verified-source"
---
```

All event text belongs between the `---` lines (the frontmatter). Do not put a full article underneath. The filename identifies the entry, so multiple files can share the same month and day. They appear oldest historical year first, then filename for ties.

Enter each event once. It is eligible every year on its month/day. There is no annual duplication, content generation or research service.

## Add an image

Place a JPG, PNG, WebP, AVIF or GIF in `public/images/history/`. Add this optional block inside the event frontmatter, with the actual image dimensions in pixels:

```yaml
image:
  src: "/images/history/palace-1989.jpg"
  alt: "Describe what the photograph actually shows."
  width: 1200
  height: 800
```

The `/images/` URL corresponds to the `public/images/` folder. Dimensions reserve space while the image loads; alternative text describes it for people using screen readers. Next.js handles responsive image delivery. With no image block, no image space is rendered. Remote images are not required and do not introduce an external service.

## Link an Archive article

Publish the full article normally in `content/archive/liverpool/`. For a file called `liverpool-9-0-crystal-palace-1989.md`, add:

```yaml
archiveSlug: "liverpool-9-0-crystal-palace-1989"
```

This renders “Read the full story →” linking to `/archive/liverpool-9-0-crystal-palace-1989`. The slug is the filename without `.md`. Only that reference is stored in the event; the full body stays in Archive. Omit archiveSlug when there is no article. A misspelled reference fails validation instead of publishing a broken link.

## Add historicalEventDate

Keep the existing Archive frontmatter format. Add one optional ISO date (year-month-day). Quote both dates so YAML treats them as strings:

```yaml
---
title: "Liverpool 9–0 Crystal Palace"
date: "2026-09-05"
historicalEventDate: "1989-09-12"
historicalPeriod: "September 1989"
decade: "1980s"
excerpt: "Replace this with your own article introduction."
category: "match"
---

Your complete article goes here, once.
```

`date` is the publication date already used by the site; it is not renamed. `historicalEventDate` records the historical event. Existing Archive articles without it are valid without editing. Match/person/season metadata remains unchanged.

## How the seven-day window works

The server obtains today’s calendar date in Europe/London. It then creates seven consecutive calendar dates, adding 0–6 days. UTC calendar arithmetic avoids daylight-saving time jumps. Month and year boundaries advance naturally. Events match only the displayed month/day; their historical year stays unchanged. A 29 February event appears in leap-year windows containing 29 February, not on another day in non-leap years.

The page renders on each request rather than being frozen at build time. Reloading or opening it on the next day shows the next window. A page left open overnight needs refreshing; there is no background polling.

## Validation and engineering decisions

Zod is the repository’s existing content validator. It checks required fields, numeric bounds, actual historical calendar dates, HTTP(S) sources, image fields and safe Archive slugs. The loader checks that referenced image and Archive files exist. Errors name the `.md` file. `npm run build` validates every event, including those outside the current window, before Next.js compiles. The existing Archive validator also checks the optional historicalEventDate.

Events use the same local Markdown/frontmatter pattern as the rest of the site. No database, CMS, accounts, extra dependencies or external history service is needed. The pure date-selection function accepts a supplied clock in tests, so dates can be tested without changing the system clock.

The optional historicalEventDate is enough for later month/day matching of Archive metadata. No automatic Archive scanning has been built. Manual references already use permanent Archive slugs, so full content will not need moving or duplicating later.

## Exact manual checks

1. Open the preview’s `/this-week` page. Expect the heading, today through six days later, and seven small dated sections.
2. Tap each navigation link on your phone. Expect Home, Articles, This Week, Archive and About to fit in one row. The Brief is in the footer.
3. On Home, expect three articles. On Articles, expect all nine original opinion pieces. Archive has no replacement articles until you publish them.
4. To verify an entry, add a verified `.md` file as shown above with a month/day inside the displayed window. Run `npm run build`; expect “Validated 1 history entries” and a successful build. Open the preview again and expect the short event under that date, with its original year and source link.
5. Add another entry file with the same month/day. Both should display under one date heading.
6. Without image or archiveSlug fields, expect no image box and no full-story link.
7. Add the actual image block and file. Expect a responsive image without distortion or horizontal scrolling.
8. Add a valid archiveSlug. Tap “Read the full story”; expect the standalone Archive article and its full body. The short event must not contain that body.
9. Keep one Archive article without historicalEventDate and another with it. Both should open normally. The first date remains publication metadata; the historical date does not change publication ordering.
10. Run `npm test`, `npm run lint`, and `npm run build`. Invalid dates or missing referenced files should produce an error naming the relevant content file.

These are checks you can use if you want to learn the workflow; the implementation and automated verification are handled by the engineer.


## Verification completed

- 10 Node tests pass: date movement, multiple/empty dates, annual recurrence, month/year boundaries, London midnight/DST, leap days, optional images/links, invalid content, Archive backward compatibility, missing-reference errors.
- ESLint and production build (including TypeScript) pass. All ten original Archive files also pass the new schema unchanged, without restoring them to the site.
- Chromium browser checks at 320, 390, 768 and 1440 pixels verified two same-day entries, image decoding, optional links, one-row navigation, and no horizontal overflow.
- Clicked the full-story link and opened Archive fixtures both with and without historicalEventDate.
- Checked Home, Articles, Archive, its existing subsections, About and Brief. Home has three articles; Articles retains nine. No browser page errors.
- Inspected phone and desktop screenshots. Test entries and images were temporary and removed before the final build.
- Physical iPhone/Safari testing was not performed; browser verification used Chromium at responsive viewport sizes.
