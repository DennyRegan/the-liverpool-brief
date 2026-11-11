# The Liverpool Brief — Project Context

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
This file is the single source of project instructions. `AGENTS.md` only points here.

## Product
The Liverpool Brief publishes journalism personally developed by Denny Regan: Opinion, Analysis, investigations and historical writing. It is a simple, writing-led publication. Home runs in this order: newsletter signup, Latest writing (one piece only, the newest the site has of any kind: a Liverpool Opinion/Analysis article, the newest Football Observed piece, or the newest biography or series part; the More articles list was removed and the lead widened on 11 November 2026 at Denny's request because an older Liverpool article above newer pieces made the site look stale), then Football Observed and From Looking Back as before, each skipped when it is already the lead so no piece appears twice. An editorial override still pins a Liverpool piece as the Liverpool candidate, but the newest piece overall wins the lead. Previous column editions remain on the column page.

Articles is one collection at `/articles`, with filters for Opinion, Analysis and Features that appear only when that category has published articles. Features (stored internally as category "History", shown to readers as "Feature"/"Features" since 6 November 2026) cover only Denny's own retained Archive pieces (`editorialMode: factual`); the old `?type=history` link still works. They are also listed at `/looking-back/features`. There is no Team News category: team news pieces go in the Matchday category. The public Archive label must not return. Legacy Archive collection routes (`/archive`, `/archive/matches`, `/archive/people`, `/archive/seasons`) redirect to `/articles`; individual retained story URLs such as `/archive/[slug]` stay permanent.

## Editorial reset — 19 October 2026
The Brief, History, This Week, Match Centre, Search, the AI drafting pipeline and all automated publishing were retired. Removed articles return 404. Everything removed is preserved in the tag `pre-editorial-reset-2026-10-19` and branch `archive/pre-editorial-reset`. Do not restore any of it without Denny's explicit instruction.

- Never research, write or publish articles independently, and never set up automated content production or publishing.
- Publish only articles Denny has developed and explicitly approved. Do not rewrite, summarise or alter published text without approval.
- The automatic History publishing authority of 1 October 2026 is revoked. The three scheduled GitHub workflows are disabled and must stay disabled.

## Navigation
Home | Articles | Football Observed | Looking Back. About is in the shared footer, including the bottom of the homepage. Maintain mobile layout.

Articles provides All, Opinion, Matchday, Features and Football Observed collections, with Analysis also available when published. Football Observed is Denny’s weekly general-football column, reached through the main navigation and Articles category navigation (the category row leaves out its own Football Observed tab on the Football Observed page) at its preserved `/regan-on-football` URL. It uses existing Opinion articles tagged exactly `regan-on-football`, with canonical `/articles/[slug]` URLs. Editions are organised automatically from approved content; there is no automated writing, scheduling or publishing. Occasional opinion pieces also sit on that page, tagged `football-observed-opinion` as well; they are not weekly editions. See `docs/regan-on-football.md` for the publishing contract.

## Architecture
Next.js App Router; local Markdown with YAML frontmatter validated by Zod.
- Articles: `content/articles/liverpool/*.md` → `/articles/[slug]`, `category: Opinion | Analysis | Matchday`. Analysis supports GitHub-flavoured Markdown tables and images/charts under `public/`.
- Team news: factual Liverpool squad updates, injuries, suspensions, availability and pre-match selection news go in the Matchday category (`category: Matchday`, ideally with `matchType` and `fixture` as in `docs/matchday.md`). **There is no Team News category**; the schema rejects it and the build fails if any article uses it. Do not reclassify other existing articles or publish pending drafts without explicit editorial approval.
- Matchday: pieces tied to one fixture use `category: Matchday` with `matchType` (Preview, Report, Opinion on a match) and a `fixture` (opponent, date, competition, venue). `/matchday` groups them by fixture. Opinion is unchanged. See `docs/matchday.md`.
- Retained earlier pieces: `content/archive/liverpool/*.md` → `/archive/[slug]`. They list as Opinion (`editorialMode: opinion`) or History (`editorialMode: factual`).
- Calls: articles may carry an optional `calls` list of predictions, each with `claim` (one sentence quoted word for word from the article; the build fails otherwise, ignoring only bold/italic markers), `status` (`open`, `right` or `wrong`) and an optional one-sentence `note` explaining the verdict. `/calls` collects them automatically, newest article first, and is linked in the footer. Only Denny decides a call's status.
- Player tags: articles and retained Archive pieces use an optional `players` list of slugs for the Liverpool players a piece is mainly about (not every name mentioned). Display names live in `content/players.json`; an unknown slug fails the build. Tag every new article. `/players/[slug]` lists a player's articles newest first and exists only once a player has 3 or more tagged articles; tags show at the foot of each article, linked when the player has a page. This is not the retired History `playerIds` field and has no History pages.
- Continue reading (approved by Denny, 9 November 2026): a small box at the foot of every article, retained Archive piece, On This Day piece, biography and series part links up to three other live pieces automatically from connection tags (`lib/content/related.ts`). Tags: `players` (as above; a biography's own slug counts when it is in `content/players.json`), `opponents` (slugs from `content/opponents.json`; an unknown slug fails the build) and `season` ("1985-86"; Archive pieces and series parts; On This Day takes it from `eventDate`). Season links only history pieces. Scoring: 5 per shared player (up to 2), 5 for the same season, 3 for a shared opponent; ties go to the newest. Football Observed editions neither show the box nor appear in it, and parts of the same series don't suggest each other. To link a new piece, tag it; nothing else to maintain. No `/history` pages, eras or registry come back with it.
- Other retired History relationship fields (`playerIds`, `relatedMatches`, `competitionIds` and so on) are still ignored; do not add validation or features that use them.
- The newsletter (Sender) is shown only when its public configuration is present; see `docs/newsletter-signup.md`.
- Social previews are generated automatically from article metadata/body by the existing image routes. They use a shared 1200 × 630 editorial design and reuse suitable local photographs already approved for article/social publication, with a typography fallback. No per-article social graphic or new frontmatter is required. Preserve image rights and article canonicals; see `docs/social-previews.md`.

## Headlines
All headlines (`title` fields) are sentence case: capitalise only the first word of each sentence and proper nouns (player, club, competition and place names, plus nicknames such as "Big Ron" or "Reds" and abbreviations such as "FSG"). When correcting a headline, change the `title` field only, never the slug or URL.

## Verification
Node 22.18+ or 24. Run `npm test`, `npm run lint`, `npm run build`.

## Working agreement
Explain important architecture choices. Do not deploy to production without Denny's explicit approval. About copy is provisional for Denny's review; do not rewrite it unprompted.

## Football Observed release approval — 30 October 2026

Denny explicitly approved committing and publishing the reviewed Football Observed feature, with Football Observed replacing About in the main navigation and About moving to the footer. This approval covers the feature and navigation only; it does not authorise publishing any forthcoming edition or changing approved prose. See `docs/football-observed-review.md` and `docs/regan-on-football.md`.

## History removed for good — 31 October 2026

Denny deliberately removed the History section. It was retired on 19 October, restored on 29 October (#80 Connected History release, #81 history week) and removed again on 31 October. **Do not rebuild, restore or re-add History, or any part of it, unless Denny asks for it by name.** The earlier "Connected History development" and "Approved infrastructure release" authorisations of 29 October are revoked.

Removed: all `/history` routes (home, matches, seasons, people, explore, series, on-this-day) and History search (`/search`); the `/this-week` redirect; the 1987–88 season atlas and preview pages; the History prototype and match-review readers; the Klopp's Liverpool series record; the History taxonomy (`content/history`: eras, entities, seasons, atlases, series, featured matches, event verifications) and its loaders and schemas; `content/this-week` and the seven history-week match reports published on 29 October; the homepage "From History" block; History in the main navigation and sitemap; History scripts, tests and documents. Old `/history/*`, `/this-week`, `/search` and the seven report URLs redirect permanently to the homepage. Everything is recoverable from tag `pre-history-removal`.

Kept: Denny's own four Archive pieces at their `/archive/` URLs, with their existing Opinion/History labels and the Articles History filter. `tests/crawlability.test.mjs` fails if History routes or content come back.

## Looking Back — 1 November 2026

Looking Back (`/looking-back`) is a series of short keepsakes, each about 150–250 words, chosen by Denny, written from checked sources with a figure list, and approved by Denny before publishing.

- `date` is the anniversary of the event in the current year; the week it falls in goes live together on the Monday. There is no quota; days without a strong story have nothing.
- Pieces are approved once a week, a week in advance. Approved pieces go in `content/looking-back/[slug].md`; merging the pull request is Denny's approval. Each file is validated by the strict `LookingBackSchema` (no sources field; attribution stays in the prose).
- A piece goes live by itself at midnight Europe/London on the Monday of the Monday–Sunday week its `date` (its anniversary) falls in, so the whole week appears together on the Monday (changed 5 November 2026 at Denny's request; before that each piece waited for its own date), and stays on the site permanently. No new deploy is needed: the pages, image route and sitemap revalidate hourly, and keepsake pages use `dynamicParams` so a newly live piece renders on request. On production, pieces not yet live appear nowhere (list, page, image or sitemap) and their URLs return 404. On previews and locally they show with a "Scheduled for [the Monday its week goes live]" banner for review.
- `/looking-back` groups live pieces by the Monday–Sunday week their `date` falls in ("Week ending Sunday …"), newest week first, earliest piece first within a week. Each keeps its permanent `/looking-back/[slug]` URL. The Sunday newsletter rounds up the week's pieces.
- This date-gated display of already-approved files is the only scheduled publishing on the site. Do not add workflows, cron jobs, AI writing or any other automated publishing.
- Unapproved drafts live in `docs/looking-back-drafts/`, which the site never reads.

Keepsakes carry the byline "The Liverpool Brief", never Denny's name. The AI disclosure lives on the About page only; never add it to keepsakes, their template or their image.

Looking Back is **not History** and must not grow into History: no eras, seasons, people, series, taxonomy, collections beyond the weekly list, This Week, calendars or automated writing. Any piece touching Heysel or Hillsborough needs Denny's approval of that piece by name.

## History hub — 5 November 2026

A product decision by Denny, made after the 31 October removal and **overriding its "do not rebuild" rule for this smaller version only**. The old History section stays removed: the biography and match-report publishers, the backdated match-report library, the History taxonomy (`content/history`, eras, entities, seasons, atlases), the 1987–88 atlas, This Week, Search and every old sub-route. Old `/history/matches`, `/seasons`, `/people`, `/explore` and `/on-this-day` URLs, `/this-week` and `/search` still redirect permanently to the homepage. Tag `pre-history-hub` marks the commit before this work. Do not rebuild anything else from History without Denny asking by name.

What exists now:
- `/history` is a hub linking to three homes: Looking Back (unchanged, with its newspaper-style look), Biographies and Series. History sits next to Looking Back in the main navigation, which keeps Looking Back for now.
- Biographies: `content/biographies/[slug].md` → `/history/biographies` (index grouped by decade, oldest first) and `/history/biographies/[slug]`. Strict `BiographySchema`: `title`, `slug`, `date` (publication date), `historicalPeriod` (the years, e.g. "1938–1961"), `decade` (e.g. "1950s"), `excerpt`, optional `role` (shown in the header dateline) and body. No sources field: attribution stays inline in the text.
- Series: `content/series/series.json` lists each series (`slug`, `title`, `totalParts`; the first is "Klopp's Liverpool", 13 parts); each part is `content/series/[seriesSlug]/[slug].md` with strict `SeriesPartSchema` (`seriesSlug`, `partNumber`, `title`, `slug`, `date`, `excerpt`, body). Pages are generated from the files: `/history/series`, `/history/series/[series]`, `/history/series/[series]/[slug]` ("Part N of 13", previous and next links). A new part needs only a new file; a new series needs one entry in `series.json`.
- Homepage and hub show the newest live biography and newest live series part: a "From History" block at the bottom of the homepage (after Football Observed, outside the four-piece limit) and "Latest in History" on `/history`. Both come from `getLatestHistory` (live pieces only) and render nothing until something is live. Requested by Denny on 5 November 2026.
- One shared header (`HistoryHeader`: masthead, dateline, headline) on every Looking Back index page. Individual pieces use the shared history article template (see "History article template — 7 November 2026" below).
- Going live uses the Looking Back rule, in one shared module (`lib/content/go-live.ts`): a piece goes live at midnight Europe/London on the Monday of its week and stays visible. On production, pieces not yet live appear nowhere (indexes, pages, sitemap); previews and local show them with a "Scheduled for" banner. Pages revalidate hourly. This is the only timing in History; nothing publishes on a timer.
- The scheduled History publishers (the three GitHub workflows) stay disabled. Do not add workflows, cron jobs, AI writing or automated publishing to History.
- Content is only what Denny pastes and approves. Never invent a biography or series part or add placeholder content. Test data lives in `tests/fixtures/history/` and is never read by the site.

## Looking Back hub — 6 November 2026

At Denny's request History was merged into Looking Back. **Readers never see "History" as a section name.** Looking Back is the one top-menu item (in History's old position) and is active on every page inside it. Content files did not move; only routes and labels changed.

- `/looking-back` is the hub: three tappable rows only, Series, On This Day and Biographies (redesigned 7 November 2026 at Denny's request). Each row has a large serif title, one small grey uppercase line beneath ("1 series · 5 parts", "This week · 2–8 November", "7 lives") and a grey arrow, with hairline dividers. A small red dot sits next to Series when a part was published in the last 7 days. Every line is counted from the content files, live pieces only (`getLookingBackHub`), so previews match production. No descriptions, Latest list or Features line: Features are reached through Articles > Features. Each series page lists every part from Part 1, with "Start reading" (Part 1) and "Latest: Part X".
- Subsections: `/looking-back/on-this-day`, `/looking-back/biographies`, `/looking-back/series` and `/looking-back/features` (the factual Archive pieces, whose URLs stay at `/archive/[slug]`).
- **On This Day** is the reader-facing name of the short weekly pieces (renamed from "Keepsakes" on 7 November 2026; content stays in `content/looking-back/`). `/looking-back/on-this-day` shows only pieces whose `date` (the anniversary) falls in the current Monday–Sunday week, Europe/London, in date order, with "Previous weeks →" to `/looking-back/on-this-day/previous` (every earlier week, newest week first). Previews and local also list later weeks under "Coming up (preview only)". `/looking-back/keepsakes` 301s to `/looking-back/on-this-day`. Individual pieces keep `/looking-back/[slug]`; their slugs may not be `on-this-day`, `keepsakes`, `biographies`, `series` or `features`.
- Old `/history`, `/history/biographies[/slug]` and `/history/series[/series[/slug]]` URLs 301 to their `/looking-back/...` equivalents; any other `/history/*` goes to the hub, except the removed old sub-sections, which still go home.
- The series length lives in one place: `totalParts` in `content/series/series.json` (Klopp's Liverpool: 13). Every "Part N of X" label reads it.
- The homepage block is "From Looking Back" with "All of Looking Back".
- The sections above ("History hub — 5 November 2026") still describe the content types and go-live rule; read their `/history/...` paths as `/looking-back/...`.

## History article template — 7 November 2026

At Denny's request every Looking Back piece uses one shared template, `HistoryArticle` (`app/components/HistoryArticle.tsx` with `history-article.css`): On This Day pieces (`/looking-back/[slug]`), Biographies, Series parts and the factual Archive pieces (Features, at `/archive/[slug]`; Archive opinion pieces keep the modern article layout). Football Observed, Opinion and every current-day article keep the modern style and never use it.

- A classic "on this day" newspaper article in the site's red, as a cream "sheet" (`#f4ecda` with a faint dot grain, small shadow) lying on the site's charcoal background. Inspired by The Back Pages project, but with **no blackletter, masthead, date line, price line or volume number**.
- **Typefaces (7 November 2026, at Denny's request):** every Looking Back page, from the hub through the index pages to each piece, uses The Back Pages fonts: Old Standard TT bold for headlines, IM Fell English for text and its true small caps for labels (`app/components/history-fonts.ts`). They load only on Looking Back: through `app/looking-back/layout.tsx` and `HistoryArticle` (for Features at `/archive/[slug]`). The site header, Football Observed and every current-day article keep Source Serif and Geist.
- **Colour scheme (11 November 2026, at Denny's request; replaces the earlier "cream paper on every Looking Back page"):** the whole site is warm charcoal (`--background: #1e1c1a`, text `#ece6d8`, tokens in `app/globals.css`, all AA contrast or better; `color-scheme: dark` and a charcoal `themeColor`). Looking Back index pages (hub, lists) are charcoal like everything else and differ only by their vintage typefaces. The pieces themselves (`.ha-page`: On This Day, Match Revisited, Biographies, Series parts, Features) are cream sheets: `.ha-page` restores the original light tokens inside the sheet, so shared components inside it need no special styling. Never put a cream or white page background back on the body; use the sheet. The Sender inline signup form keeps a light card because its embed is styled for light.

- Top to bottom, in a centred 640px column: back link between hairlines ("Back to this week's On This Day →", "Back to Biographies →", "Back to [series] →", "Back to Features →"); red kicker; centred serif headline; On This Day scoreline when present; the excerpt as an italic standfirst; byline where one already existed ("By The Liverpool Brief" on On This Day, "By Denny Regan" on Features); dateline between hairlines (event date where one exists · type · read time at 225 words a minute); left-aligned body, no hyphenation, old-style numerals, one red three-line drop cap on the first paragraph and no other ornaments.
- Kickers come from existing frontmatter (`lib/content/history-article.ts`): On This Day, the competition from the end of `dateline` up to the first comma, plus the `eventDate` year; Biography, "Biography · `decade`"; Series, "[title] · Part N of X"; Features, `decade` (the Archive schema reads it).
- Foot: a hairline, then On This Day "← Previous" / "Next →" (by anniversary date) and "Previous weeks →"; Series "← Part N" / "Part N →" (hidden when absent) and "All parts →"; Biographies and Features a link back to their list. The share button, Features player tags and the On This Day "Download image" link stay.
- Change the look in the template only; never style these pages file by file.


## Match Revisited — 9 November 2026

A weekly long-form write-up of one classic Liverpool match, under Looking Back at `/looking-back/match-revisited`. Plumbing only: no pieces are written or published without Denny. Master list at `content/series/match-revisited-list.md` (planning only, never read by the site); pieces in `content/match-revisited/[slug].md` with strict `MatchRevisitedSchema`; same go-live rule as the other Looking Back types. It does not use the retired History taxonomy. See `docs/match-revisited.md`.
