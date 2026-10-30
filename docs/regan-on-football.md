# Football Observed

The permanent column home is `/regan-on-football`, presented as a collection within Articles. The primary navigation is Home / Articles / History / Football Observed; the Articles category row links to All, Opinion, Team News, History and Football Observed. Analysis remains available when published. About is in the shared footer at the bottom of the homepage and every reader page. The category row is horizontally scrollable when needed and works without JavaScript. Editions remain Opinion articles in `content/articles/liverpool/`, at their existing `/articles/[slug]` URLs. There is no separate content store or article copy.

The public name is **Football Observed**, with the byline “A weekly column by Denny Regan”. The existing route, internal identifiers and exact `regan-on-football` tag are retained so published links and edition membership remain unchanged.

## Publishing an edition

1. Prepare Denny’s approved article using the normal Markdown/frontmatter format. Keep its own headline, publication `date` in `YYYY-MM-DD` format, and a concise approved `excerpt`. Set `category: Opinion` and include the exact `regan-on-football` value in its existing `tags` array, alongside any other appropriate tags:

   ```yaml
   category: Opinion
   tags: [regan-on-football]
   ```

2. Keep the article’s canonical slug and URL. Do not repeat the column masthead in the Markdown body. Section headings within a multi-subject edition use normal Markdown.
3. Run `npm test`, `npm run lint` and `npm run build`. Review the landing page, edition and mobile navigation in a local preview.
4. Obtain Denny’s explicit approval before publishing the article or deploying to production. Drafts stay outside the published content directories; adding a file there makes it public at the next approved deployment. A future date is not a scheduling mechanism.

The existing loader validates every edition. On the normal content build, qualifying Opinion articles automatically receive the compact masthead, join the column page newest first, and remain in Articles/Opinion and the normal homepage selection. Same-day editions sort by slug. Any valid temporary editorial override remains respected. The homepage otherwise selects its lead from non-column journalism, reserving the latest column for its own section. Column articles shown on the homepage carry a linked column label. Analysis articles with this tag do not join the column.

The public content contains the approved 23 October 2026 Carrick column and the 30 October 2026 edition, “Arteta should have kept it behind closed doors”, explicitly approved for publication by Denny. Other forthcoming editions require separate approval. If every edition is withdrawn, the landing page shows a truthful empty state and the homepage feature disappears. Existing articles have not been retagged.

## Presentation — 30 October 2026

The column page features the latest published edition, its original excerpt (or the existing body-derived fallback), publication date and reading time. A short introduction uses the existing column description. Previous editions appear newest first, with slug ordering for date ties, only when available.

The homepage presents up to four distinct journalism pieces, including the latest Football Observed edition, followed by at most one History piece. With sufficient published writing, the order is a non-column Opinion/Analysis lead, the latest column, two more Opinion/Analysis/Team News articles, then one story under From History. More recent History publication dates cannot fill journalism slots. All editions links to previous columns on the column page; older editions do not add extra homepage cards. A valid editorial override can still lead with a column, in which case its separate feature is omitted to avoid duplication. Thin collections show only available writing without filling gaps with extra History pieces. Homepage selections use the existing London publication-date boundary.

Contents navigation is optional by structure: it appears only when an edition has at least two subjects, derived from top-level Markdown H2 headings and any opening text. The opening item uses the unchanged article headline. Single-subject editions require no contents. The same Markdown parsing rules produce contents labels and heading IDs; duplicate headings receive unique suffixes, while code fences and quoted headings are excluded. Native anchor links work without client JavaScript. The article body is never rewritten. Editors can add headings to future manuscripts before approval; adding headings to approved prose still requires editorial approval.

Edition readers provide an All editions return link and previous/newer links derived solely from published edition order. Missing or withdrawn editions are skipped. No dates, edition numbers, subject summaries or placeholder editions are invented.

## Implementation and scope

`lib/content/regan-on-football.ts` defines the shared tag/predicate, selects from the validated article loader and derives edition neighbours. `FootballObservedFeature` shares the latest edition between the homepage and column page. `EditionContents` and `lib/edition-contents.ts` derive subject links. The Markdown parser packages already in the lockfile are now declared direct dependencies; no versions changed. All new components render on the server, with no new client state, service or account dependency. `ArticlesNavigation` and `ArticleMeta` retain the ordinary collection navigation and metadata. The reusable `ReganOnFootballMasthead` uses the publication’s existing Source Serif, palette and rules; its compact linked version sits above an edition’s separate headline. `app/editorial.css` holds the common responsive presentation scale. List excerpts are visually limited to three or four lines; stored excerpts and manuscripts stay intact. Social metadata uses the existing helper, and the landing page remains in the existing public sitemap. Individual canonicals and article social images remain unchanged.

The current `docs/connected-history.md` and `docs/seasons-publishing.md` remain authoritative for History and its approval boundaries, including the later approved infrastructure release. This feature changes no History schema, content, entity IDs, dates, relationships, public routes or preview guards. The existing footer and conditional newsletter integration are retained. Interactive analysis is outside this change. Denny approved committing and making this feature live on 30 October 2026, including replacing About with Football Observed in the main navigation and moving About into the footer. That approval does not publish any forthcoming edition. Future content and deployment approvals remain explicit.
