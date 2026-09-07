# This Week in Liverpool History

## Current behaviour

`/this-week` displays today plus six following dates in Europe/London time. The existing site header, navigation, homepage, History Explorer, article system and URLs are unchanged by the illustrated-card feature.

Each saved event appears on its month/day each year. Events are stored once in `content/this-week/liverpool/`. Multiple events on a date are ordered by historical year and filename. Empty dates have a small “No event selected” line and never become empty viewer slides.

The overview uses the approved red, black and off-white card style: two columns on larger screens, one on a phone. Tap the artwork to open its individual story. A native modal dialog fills the phone viewport, with scrollable artwork and readable webpage text. Swipes, Previous/Next buttons and keyboard arrows move between events. Close, Escape or the browser Back button return to the overview and restore the reader's position. Keyboard focus stays inside the open dialog and returns to the card on closing. There is no autoplay, timer, account or database.

Source links and optional full-article links remain accessible in both views. Further reading still appears beneath the week. The page references canonical Archive articles; it never copies their full text.

## Content format

Create a descriptive `.md` filename, for example `1989-09-12-crystal-palace.md`. All short-entry content belongs in frontmatter, with no article body beneath it. JSON frontmatter and YAML are both supported by the existing loader.

```yaml
---
month: 9
day: 12
year: 1989
title: "Liverpool 9–0 Crystal Palace"
summary: "Use a concise, verified factual summary."
source: "https://example.com/replace-with-the-retrieved-source"
archiveSlug: "liverpool-9-crystal-palace-0"
image:
  src: "/images/history/palace-1989.webp"
  alt: "Describe what this image actually shows."
  width: 1200
  height: 1600
  kind: "illustration"
---
```

This is a format example; replace the placeholder source with the verified source and add the actual image file. `image` and `archiveSlug` are optional. A text-only entry remains usable in both views without a blank image area. The full article must already exist at `content/archive/liverpool/<archiveSlug>.md`.

An Archive article's optional `historicalEventDate: "1989-09-12"` automatically surfaces it under Further reading when that month/day is displayed. `date` remains its publication date. Explicit `archiveSlug` references also work and are deduplicated under Further reading.

## Approved illustrations, 6–12 September 2026

Denny approved the supplied composite design and authorised publication on 7 September. Its approved artwork is saved in an optimised WebP at `public/images/history/approved-september-06-12.webp`. The six selected events use different windows onto this image, avoiding regenerated pictures or embedded poster wording. Their historical titles, dates, summaries and sources still come from the event files.

The optional `image.crop` specifies an original-pixel rectangle:

```yaml
image:
  src: "/images/history/approved-september-06-12.webp"
  alt: "Illustration of celebrating Liverpool players in late-1980s red kits."
  width: 1024
  height: 1536
  kind: "illustration"
  crop:
    x: 440
    y: 1122
    width: 567
    height: 343
```

`HistoryArtwork` renders that window using an SVG viewBox; the picture content stays unchanged. Next's image optimiser serves the shared image. New standalone illustrations do not need `crop`; the regular responsive Next Image component handles them. Use real dimensions and keep each crop inside its source image. `kind: illustration` displays an illustration label. Optional `kind: photograph` is for an actual photograph, with its provenance checked. Never present generated scenes as verified archival photographs.

The 6 September entry remains saved for its next annual appearance even after it leaves the rolling window. Do not freeze the live date range at 6–12 September merely to show the full concept board. The current seven-day date calculation continues normally.

## Future illustration workflow — mandatory editorial approval

1. Research the next dates using retrieved reliable sources; verify exact day, month and year. Choose the strongest event by default; add another only when independently worthwhile. Leave weak dates empty.
2. Reuse existing events and approved images whenever possible. Prepare a distinct illustration for a newly selected event using the approved design above. Use the image-generation capability for new artwork; do not invent historical facts, score text or source URLs in images.
3. Keep the reusable card and viewer layout unchanged. The new image should normally be portrait, with room for the subject when the card crops it. Add the image, its dimensions, descriptive alternative text and `kind: illustration` to the actual event frontmatter.
4. Save proposed new or changed illustrations on an isolated feature branch and draft pull request. Uploading this branch to create a Vercel preview is authorised.
5. Validate the content, build, and check both the overview and full-screen viewer on a phone-sized viewport. Give Denny the working website preview to review.
6. Wait for Denny's explicit approval of those future illustrations before merging or promoting them to production. Never enable automatic merging of illustration changes. Verified text-only event updates may continue under the existing publishing authorisation, without unapproved artwork.
7. If image generation or preview deployment is unavailable, report that limitation. Do not claim a preview or illustrations exist when they do not.

The existing “Liverpool history content” scheduled task contains this workflow. Denny writes all long-form Opinion and Archive articles; the task must not write or alter them.

## Engineering and checks

- `lib/content/this-week.ts` loads and validates local Markdown/frontmatter. Zod checks real dates, HTTP(S) sources, local image paths, positive dimensions, optional artwork crop bounds and safe article slugs. The loader verifies image and Archive files exist. Errors name the offending file.
- `getHistoryWindow` derives London's calendar day and then adds UTC calendar dates, avoiding daylight-saving drift. The month/day match preserves historical years. Leap-day entries only match an actual 29 February.
- The page renders on each request. Refresh an overnight tab to see the next window; there is no background polling.
- `HistoryWeek` contains viewer state and browser interactions. It receives serialisable events from the server; filesystem and validation code never enter the client bundle.
- `HistoryEventCard` is shared across all events. `HistoryArtwork` displays either a standalone image or the relevant approved artwork window.

Run `npm test`, `npm run lint` and `npm run build`. Run the production server with `npm start -- --port 3100`, then open `/this-week`.

Manual checks: open each illustrated event; swipe, use both arrows, close and reopen; press Escape and Back; use Tab to check focus remains inside the viewer; follow the Palace full-story link and return; scroll long text; check a text-only event; confirm empty dates are skipped and sources remain visible. On a phone, the viewer should fill the available screen, keep Close and arrows accessible, and avoid horizontal scrolling.
