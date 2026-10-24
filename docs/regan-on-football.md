# Regan on Football

The permanent column home is `/regan-on-football`, presented as a collection within Articles. The primary navigation is Home / Articles / About; the Articles category row links to All, Opinion, History and Regan on Football. Analysis remains available when published. The category row is horizontally scrollable when needed and works without JavaScript. Editions remain Opinion articles in `content/articles/liverpool/`, at their existing `/articles/[slug]` URLs. There is no separate content store or article copy.

## Publishing an edition

1. Prepare Denny’s approved article using the normal Markdown/frontmatter format. Keep its own headline, publication `date` in `YYYY-MM-DD` format, and a concise approved `excerpt`. Set `category: Opinion` and include the exact `regan-on-football` value in its existing `tags` array, alongside any other appropriate tags:

   ```yaml
   category: Opinion
   tags: [regan-on-football]
   ```

2. Keep the article’s canonical slug and URL. Do not repeat the column masthead in the Markdown body. Section headings within a multi-subject edition use normal Markdown.
3. Run `npm test`, `npm run lint` and `npm run build`. Review the landing page, edition and mobile navigation in a local preview.
4. Obtain Denny’s explicit approval before publishing the article or deploying to production. Drafts stay outside the published content directories; adding a file there makes it public at the next approved deployment. A future date is not a scheduling mechanism.

The existing loader validates every edition. On the normal content build, qualifying Opinion articles automatically receive the compact masthead, join the column page newest first, and remain in Articles/Opinion and the normal homepage selection. Same-day editions sort by slug. Homepage lead rules and any existing temporary editorial override remain unchanged. Column articles shown on the homepage carry a linked column label. Analysis articles with this tag do not join the column.

The landing page has a truthful empty state until the first approved edition. Existing articles have not been retagged. The first edition requires editorial approval.

## Implementation and scope

`lib/content/regan-on-football.ts` defines the shared tag/predicate and selects from the validated article loader. `ArticlesNavigation`, `ArticleCollection` and `ArticleMeta` share the collection layout and metadata treatment with ordinary writing. The reusable `ReganOnFootballMasthead` component uses the publication’s existing Source Serif, palette and rules; its compact linked version sits above an edition’s separate headline. `app/editorial.css` holds the common responsive presentation scale. List excerpts are visually limited to three or four lines; stored excerpts and manuscripts stay intact. Social metadata uses the existing helper, and the landing page joins the existing public sitemap. Individual canonicals and article social images remain unchanged.

The current `CLAUDE.md` records the 19 October 2026 editorial reset. The older `docs/connected-history.md` and `docs/seasons-publishing.md` are absent from current main; they were inspected in the earlier local checkout as historical guidance only. This feature follows the current schemas and does not restore retired pages or publishing automation. The existing footer and conditional newsletter integration are retained.
