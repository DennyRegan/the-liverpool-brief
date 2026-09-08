# This Week in Liverpool History

## Text-only presentation — 8 September 2026

Denny requested removal of all illustrations in favour of clean text. This supersedes the earlier artwork approvals, illustration generation, kit-reference and image-preview workflows. Do not generate, upload, attach or restore illustrations. The scheduled Liverpool history task is text-only.

The page shows today plus six following dates in Europe/London time. Each date has its selected events, historical years, short summaries and direct source links. There are no image areas, poster cards or full-screen image viewer. Existing site typography and spacing are reused. Header, navigation, Articles, History Explorer and canonical article URLs are unchanged.

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

Events recur by month/day while retaining their historical year. Multiple worthwhile events can share a date. Choose the strongest by default and leave weak dates empty. The rolling window uses London's calendar date and handles month/year boundaries and leap years. Refresh a tab left open overnight.

## Articles and Further reading

An Archive article's optional `historicalEventDate` controls when it appears under Further reading. Its `date` remains the publication date, so articles can be published in advance. Explicit event `archiveSlug` references also work and are deduplicated. There remains only one underlying article.

## Scheduled workflow

Research today plus the next 13 days using retrieved reliable sources. Verify historical dates and facts, preserve Denny's writing, reuse annual entries and avoid duplicates. Publish verified text-only updates under the existing authorisation. Never create illustrations or illustration previews. Denny writes all long-form Opinion and Archive articles.

## Checks

Run `npm test`, `npm run lint` and `npm run build`. Content validation checks real dates, sources and canonical article references. The image schema remains backward-compatible, but the This Week renderer intentionally never displays images.

Open `/this-week` and check the seven dates, readable summaries, source links, optional full-story links, quiet dates and Further reading. On a phone, no image space or viewer controls should appear. Existing artwork remains recoverable through Git history.
