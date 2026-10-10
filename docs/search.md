# Site-wide search

Search is reached through the small **Search** link beside the masthead byline. Main navigation and every existing canonical content URL stay intact. The labelled GET form at `/search` works with or without JavaScript, supports keyboard use and preserves the query in the URL. Empty queries show guidance; unmatched queries show a useful suggestion. Results show title, existing content type, historical period/publication date/season and a short source excerpt. Twenty results per page keep HTML responses small, with ordinary Previous/Next links.

## Content and publication boundaries

`lib/search/build-index.ts` derives a search projection only from existing public loaders:

- Articles: Opinion and Analysis at `/articles/<slug>`.
- Public Archive writing: factual historical matches, player/manager biographies, club history and other public Archive types at their existing `/archive/<slug>` URLs. Non-factual public Archive writing retains its Opinion placement.
- Published structured Season records, with overview, events, transfers and canonical people/competitions.
- Existing managerial eras.
- Eligible People, Opposition and Competition destinations, using the existing threshold selector.
- Published, reviewed Interactive History experiences when any exist; held/draft experiences remain excluded.

Brief headlines, fixture utilities and collection indexes are not duplicated as search documents. Editorial calendars, drafts, research records, sources' private review notes and unpublished interactive material are never indexed. Registry membership alone does not create a search destination. All results use existing canonical paths and are deduplicated by path; no prose, dates, relationships or classification changes are made to source content.

## Build, ranking and performance

`npm run build` validates the repository, then runs `scripts/build-search-index.mjs` before Next's build. The derived, ignored `.generated/search-index.json` is traced into the Search server route. Development startup builds the same index; after editing content during a dev session run `npm run search:build` and restart the server. Publication rebuilds it automatically.

The index stays on the server and is read once per server process. GET requests perform a small deterministic lexical search over hundreds of documents. No index, article body corpus or search scoring code is shipped in normal page client bundles. The masthead Search link has prefetch disabled. There is no new client component, database, external service, credential, runtime AI or vector index.

Matching normalises case, accents and punctuation, supports word prefixes of two or more characters, and requires each query word to match. Titles and names rank above structured metadata labels, which rank above passing body mentions. Exact title/phrase matches get extra weight; short name/destination titles get a modest preference over long headlines with the same term. Canonical tie breakers make results stable. The index resolves approved people, opposition, competition, location, theme and era IDs through existing labels, and includes full season boundary years without inventing an event date.

Queries are limited to 120 characters and eight distinct words. This is lexical search: there is no fuzzy spelling correction, synonym service, autocomplete or inferred relationship. Search results reflect content included in the latest deployed build. A career biography's historical-period context stays separate from publication dates. Search cannot expose an eligible destination before its existing public selector permits it.

At implementation the index contains **410 canonical destinations**, approximately **1.09 MB uncompressed on the server**; gzip size and deployed-file tracing are checked by the verifier. Normal pages receive only the small header link/CSS change. Search responses include at most twenty short result cards, not the corpus.

## Verification

```sh
npm run search:build
node --test tests/search.test.mjs
npm test
npm run lint
npm run build
npm start -- --hostname 127.0.0.1 --port 3155
BASE_URL=http://127.0.0.1:3155 node scripts/verify-search.mjs
```

The verifier checks all requested example terms, partial/case searches, result ordering, canonical links, no duplicates, empty/no-result states, pagination, shared Search links and server tracing. Tests verify title/entity/body ranking and absence of editorial drafts and held interactive content. Review at narrow mobile and desktop widths, tab through the Search form/results and confirm the league table scrolls within its own labelled region.

Optional browser checks use an isolated install of `playwright` and `@axe-core/playwright`; they are not production dependencies. Set `TABLE_SEARCH_BROWSER_TOOLS` to that directory, then run `BASE_URL=http://127.0.0.1:3155 node scripts/verify-table-search-browser.mjs`. Screenshots and results go to ignored `.table-search-checks`, or the directory specified by `TABLE_SEARCH_BROWSER_OUTPUT`. The script checks widths 320/390/768/1280, keyboard/table scrolling, visible statistics beside the pinned team column, form submission, empty/no-results and Search without JavaScript, with axe checks of the changed table region and Search main landmark. A wider Match Centre scan also found an existing heading-order gap in the fixture list; that unrelated markup is left outside this feature's scope.
