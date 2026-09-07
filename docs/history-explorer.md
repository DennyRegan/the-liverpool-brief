# Liverpool History Explorer V1

Implementation and review record, 7 September 2026. Branch: `feature/liverpool-history-explorer-v1`. Main has not been merged or deployed by this work.

The feature is implemented. Browser-based visual, responsive-overflow and keyboard verification remains outstanding because the supplied browser connection repeatedly timed out. Keep the pull request in draft until that review is complete. Automated checks below are distinct from those outstanding checks.

## Existing architecture and scope

The site uses Next.js App Router, React server components, local Markdown with YAML frontmatter, and Zod validation. `getArchiveFeatures()` reads `content/archive/liverpool/*.md`, returns the canonical articles, and sorts by publication date. Opinion uses `content/articles/liverpool/*.md`. At inspection there were two Archive articles and eleven Opinion articles.

The homepage already has a short introduction, one current Brief story, the latest Opinion and the latest Archive article. Its implementation and content are untouched. `/brief`, `/articles`, Opinion URLs at `/articles/[slug]`, Archive URLs at `/archive/[slug]`, the Archive filter and subcategories, and `/this-week` remain intact. History is added to the existing navigation. There is no second article collection, new database, CMS, dependency or external service.

## Routes and historical data

`/history` presents a vertical chronology. `/history/[era]` provides each era's concise overview, winning seasons, key players, original Archive writing, sources, and neighbouring eras. These pages are statically generated. Unknown era IDs return 404.

`content/history/liverpool/eras.json` is the only historical skeleton. Each era has:

- A stable, unique tenure `id`, manager name, start/end dates, optional tenure label, and initials.
- Short `summary` and `context` paragraphs.
- `honours` containing competition names and actual winning seasons/years. Displayed counts derive from these arrays. `otherHonours` holds the Second Division and Football League Super Cup separately.
- A deliberately small `keyPlayers` selection; the current era labels these as an early squad rather than a definitive retrospective.
- Optional illustration metadata: local path, descriptive alt text and dimensions.
- Source URLs, claims supported, confidence labels, and optional discrepancy notes. The top-level `verifiedOn` records the factual review date.

`lib/content/history.ts` validates the file with Zod, formats tenure years, selects canonical Archive objects, and resolves optional illustrations. IDs must be unique and chronological; dates must be valid, with only the final era open-ended. Overlaps other than shared handover dates are rejected.

The 16 entries include Ronnie Moran's 1991 caretaker spell and Evans/Houllier's 1998 joint tenure. Dalglish has two permanent IDs: `kenny-dalglish-1985-1991` and `kenny-dalglish-2011-2012`. His name is never used to infer a tenure. Houllier's overview explains Phil Thompson's deputy role during his illness. [The source audit](history-sources.md) records the current management and date discrepancies.

## Automatic Archive association

The existing schema already has `historicalEventDate` (an ISO event date), `historicalPeriod` (display prose), `date` (publication date), and an optional `manager` for a season facts panel. The new code reuses the event date and adds only **optional `historyEras: string[]`**. It does not add person, topic or season taxonomies.

Placement follows these rules:

1. If `historyEras` is present, its IDs are the complete explicit set of contexts. It overrides automatic date placement, allowing one article to appear in multiple eras.
2. Otherwise, `historicalEventDate` selects the tenure containing that day. Shared handover days belong to the incoming tenure. Gaps between appointments remain unassigned.
3. Publication dates, prose periods and manager names never guess a relationship. An undated broad piece needs explicit IDs.

The build rejects unknown era IDs, malformed or empty lists, duplicate IDs and invalid dates. Unassigned Archive articles produce an advisory build warning and remain published in Archive. A date before Shankly or during an appointment gap can legitimately be unassigned.

History passes the existing Archive objects through a selector, deduplicates by canonical slug, and orders them newest publication first. Every link points to `/archive/[slug]`. No article body is copied. Both existing articles work without frontmatter changes:

| Canonical article | Existing event date | Automatic era |
| --- | --- | --- |
| `/archive/liverpool-7-tottenham-0` | 1978-09-02 | Bob Paisley |
| `/archive/liverpool-9-crystal-palace-0` | 1989-09-12 | Kenny Dalglish, first tenure |

## Publishing a new Archive article

Write the article once in `content/archive/liverpool/<slug>.md`, using the existing required frontmatter and body. `date` remains its publication date. For a piece about a specific historical event, include the existing ISO event-date field. The following is a metadata example, not production article copy:

```yaml
---
title: "Your approved article title"
slug: "your-approved-article-slug"
date: "2026-09-07"
historicalPeriod: "27 May 1981"
historicalEventDate: "1981-05-27"
decade: "1980s"
category: "match"
excerpt: "Your approved short description."
---
Your original article.
```

That date automatically places the article in the Paisley era. It also remains eligible for the existing This Week date matching. Do not change the publication date to the historical date.

For a career, season or comparison spanning eras, add only the relevant IDs:

```yaml
historyEras:
  - bob-paisley
  - kenny-dalglish-1985-1991
```

Use the IDs in `eras.json` or the source-audit table. Leave `historicalEventDate` out if no single event date is appropriate; explicit IDs are sufficient. If both are supplied, the explicit list determines History placement while This Week continues using the event date.

Run `npm test`, `npm run lint`, and `npm run build`; then follow the existing branch/review/deployment workflow. The application regenerates the listings and History pages from the file. There is no manual Archive card or History link to maintain. This is build-time publication, not a live CMS upload.

## Mobile design, accessibility and performance

The design uses the site's existing cream, red and ink palette, serif headings, body type, page width and spacing. On phones, each era is a single vertical card with a small framed monogram, years, concise description, honours and players. A native “Choose an era” disclosure jumps to anchors. Dedicated era pages keep further context short; the first three Archive articles are visible, with additional writing in a native disclosure. The landing card shows at most two article links. Zero-article eras simply show the complete historical reference.

History links have large 48px exploration targets; mobile main navigation uses two rows of three links, at least 44px high. Detail portraits shrink further below 375px to leave room for long names. At wider sizes, card identity and facts expand into columns. There is no horizontal timeline, drag gesture, animation or dependency on motion.

Pages use semantic headings, lists, definition lists and labelled navigation. Native links/details work without bespoke client state. Existing skip-link and visible-focus styles are preserved. Initials are decorative and hidden from assistive technology; real artwork requires alt text. The CSS uses shrinkable columns and wrapping text rather than concealing overflow. These measures have been code-reviewed; actual keyboard behaviour and rendered overflow still need browser verification.

All three era components are server components. History data stays on the server and is not added to the normal article loader. History styles are imported by its route layout. No new package is installed. Landing-page era and article links disable eager route prefetching. There are no image downloads in V1.

## Illustration workflow

V1 ships with consistent framed initials, as permitted by the brief. No scraped photographs or generated likenesses are included. To replace a placeholder, put an approved, optimised portrait under `public/images/history/`, ideally a 4:5 WebP or AVIF, then set the era's image metadata:

```json
"image": {
  "src": "/images/history/bob-paisley.webp",
  "alt": "Editorial illustration of Bob Paisley",
  "width": 600,
  "height": 750
}
```

The shared component uses Next Image, responsive `sizes`, reserved dimensions and lazy loading. It does not require manager-specific presentation code. A missing file raises a build warning and renders the same monogram fallback. The two Dalglish eras may share an asset or use separate approved illustrations. External image URLs and traversal paths are rejected by the schema.

## Verification record

Use Node 22.18+ or 24 and `npm ci`. No test framework dependency was added.

| Check | Result / coverage |
| --- | --- |
| `npm test` | 29 passing: 18 existing tests plus 11 History tests. Covers all tenure IDs, both real Archive associations, new publication, explicit multiple eras, both Dalglish spells, handovers and gaps, sorting/deduplication, invalid metadata and optional/missing artwork. |
| `npm run lint` | Passing. |
| `npm run build` | Passing production compilation, TypeScript and static route generation; validates existing This Week entries, era data and all Archive relationships. |
| `node scripts/verify-history-explorer.mjs` | Production HTTP checks: History landing, all 16 eras, canonical URLs, sources, neighbouring links, zero/one article sections, two invalid URLs returning 404, and 24 existing routes including every current Archive and Opinion URL. Also checks the homepage still has precisely Brief, Opinion and Archive sections. |
| `node scripts/verify-homepage.mjs` | Existing homepage-specific regression check passes. |
| `node scripts/verify-history-publishing.mjs` | Temporary real Markdown fixtures exercise publication through actual loaders and rendered pages: date placement, explicit placement, multiple contexts, four articles with the fourth disclosed, capped landing links, one-article era, canonical article bodies and missing illustration fallback. Runs in a disposable copy; fixtures never modify the working article tree. |
| Accessibility source checks | One main heading per era; labelled chronology/navigation; native controls; decorative placeholders; mandatory illustration alt text; existing skip/focus styles. Calculated History text contrast against the cream background ranges from 5.20:1 to 14.27:1. |
| Browser, mobile, desktop, keyboard and overflow | **Outstanding.** The supervised app preview started, but the browser connection timed out before a page could be inspected. No visual pass, iPhone test, console pass, automated accessibility scan or performance benchmark is claimed. |

Before merging, inspect `/history` and the era pages at 320px, 390px, 768px and 1440px. Include the long Evans/Houllier name, both Dalglish pages, a zero-article era and the two real article links. Check the era index, previous/next links, focus order, main navigation, horizontal overflow and existing homepage/Brief/article filters in a working browser. This is completion of the requested V1 verification, not additional feature work.

## Files created

| File | Purpose |
| --- | --- |
| `content/history/liverpool/eras.json` | Verified chronology, honours, players, sources and portrait metadata support. |
| `lib/content/history.ts` | Schema, history loader, article selection and portrait resolution. |
| `app/components/history/EraCard.tsx` | Reusable chronology card. |
| `app/components/history/EraFacts.tsx` | Reusable honours/player facts. |
| `app/components/history/EraPortrait.tsx` | Shared Next Image and decorative fallback. |
| `app/history/layout.tsx` | History style boundary. |
| `app/history/page.tsx` | Chronology landing page. |
| `app/history/[era]/page.tsx` | Static era detail routes and metadata. |
| `app/history/history.css` | Responsive editorial History styles. |
| `tests/history-explorer.test.mjs` | Data, placement and fallback regression tests. |
| `scripts/verify-history-explorer.mjs` | Production route and existing-site checks. |
| `scripts/verify-history-publishing.mjs` | Real Markdown publication integration test. |
| `scripts/dev.mjs` | Forwards development arguments to Next and translates the supervised preview's host/strict-port flags. |
| `docs/history-explorer.md` | This implementation, publishing and verification guide. |
| `docs/history-sources.md` | Historical audit and date/count discrepancies. |

## Files modified

| File | Change |
| --- | --- |
| `app/components/SiteHeader.tsx` | Adds History and its active-navigation state. |
| `app/globals.css` | Fits the six navigation links into accessible mobile rows. |
| `lib/content/types.ts` | Adds only optional, validated `historyEras` to Archive frontmatter. |
| `lib/content/archive.ts` | Uses an explicit `.ts` type-module import so native Node verification can use the real loader. Article loading/sorting behaviour is unchanged. |
| `tsconfig.json` | Allows that explicit TypeScript import extension with the existing `noEmit` setting. |
| `scripts/validate-history.mjs` | Retains This Week validation and adds era, association and missing-artwork checks. |
| `package.json` | Runs the small development argument adapter; dependencies and production scripts are unchanged. |
| `next.config.ts` | Permits the internal browser origin for development only. Production hosting is unchanged. |
| `README.md` | Corrects the stale site-structure description and links this guide. |
| `CLAUDE.md` | Aligns project navigation/context with the inspected site and documents History's single-article architecture. |

## Remaining limitations

The outstanding browser verification and placeholder artwork are explicit above. No known automated test failure remains. Historical facts require editorial maintenance when a new honour or management change occurs; Archive article discovery is automatic, historical fact gathering is not. Appointment gaps are deliberate and broad pieces can use explicit era IDs. The feature branch must be reviewed before any merge into main.
