# Season integration and approval

## Approved release adjustment — 29 October 2026

Denny explicitly approved the infrastructure release and the limited public 1987–88 adjustment. This supersedes earlier local-only release/season statements below. The existing season reference is now approved at `content/history/liverpool/seasons/1987-88.json`; its legacy adjacent-season list is empty because navigation is derived. No article prose or metadata was changed.

The public experience uses only approved canonical reports. Its atlas reads the preserved Anfield coordinates and coastline from `content/history/liverpool/atlases/1987-88.json`, and derives cards from public factual articles. It currently contains one Forest report at Anfield. Withdrawing that report removes the map. It never reads local manuscripts. The guarded local experience still shows twelve reports and the original five-match map. All 558 unapproved reports remain excluded from release source and output.

The separate On This Day / This Week workstream is not included. This adjustment adds no season anniversary events and changes none of that workstream's files or behaviour. People pages add only season connections, not biographies.


Development contract for the Connected History review, 29 October 2026. No publishing authority is granted.

The existing strict `SeasonSchema` remains the source of truth. Public Season records, when explicitly approved, belong in `content/history/liverpool/seasons/YYYY-YY.json`. The loader validates canonical season identity, filename, source references, people and competitions. No records have been restored into that directory in this development task.

The preserved 1987–88 JSON remains byte-for-byte unchanged in `prototype/history/1987-88.json`. The local request view adds it only after the existing prototype environment flag and loopback Host checks. The integrated canonical destination is `/history/seasons/1987-88`; normal production mode shows only a match collection derived from approved reports at that URL until a Season record is approved. The immersive reference and map remain private. Search, sitemap and newsletter selection always use the public library without that review record.

The local experience reuses the five original prototype selections, exact report prose, sources, chronological order and optional atlas. One report is retained publicly; four remain withdrawn and are explicitly labelled local review. They are not moved into public content. The later collection-preparation task exposes all twelve preserved reports only within the local editorial reading list, reusing their canonical URLs; the atlas still has five selections. Existing research/drafts remain editorial source material. The page explicitly describes incomplete coverage.

After explicit editorial approval of a Season record, the application derives its writing from each article’s canonical `season` metadata and its people from validated references. An approved biography or match appears on the next build without editing a season article list. Future same-season series chapters remain normal articles and appear in a separate related reading section. Do not maintain reverse article lists. Do not store previous/next relationships: adjacent navigation is computed from available chronological records and skips missing years. The legacy `relatedSeasons` field remains in the schema for compatibility but is unused by this presentation; do not populate it to manage adjacency.

Publication dates never stand in for historical event dates. Undefined event dates are explicitly labelled and never used for On This Day. Top-scorer scope remains all competitive matches; transfer and source conventions remain those recorded in the preserved research. Do not infer a missing article manager ID from a Season’s manager. Reuse canonical IDs; never force a multi-season biography into one season.

A release must be reviewed separately from the implementation. Before any approved publication, validate content and run tests, lint, builds and HTTP/browser checks in `connected-history.md`. Keep canonical `/archive/[slug]` URLs and prose intact. No automatic publishing workflows may be re-enabled.

## Match collection expansion — 29 October 2026

The restoration-preparation task adds match-only Season destinations derived from canonical report metadata. These do not require or fabricate a `SeasonSchema` record. Normal mode lists only approved articles; local review may also list staged withdrawn reports and drafts after the existing flag/loopback checks. Directories use 16 seasons per page and match lists use 12 reports per page; return links carry the corresponding page and match fragment.

The original 1987–88 Season record and five-match atlas remain unchanged. Its integrated chronological list now has all twelve preserved reports (one published, eleven withdrawn). Other years receive honest match collections until their full reference records are separately approved. No reverse report lists, new entity IDs or publication dates are added. This supersedes the earlier five-report-only description, not the prohibition on automatic restoration/publication.

## Distinct discovery pages — 29 October 2026 refinement

Seasons now showcases developed Season records as story-led experiences. The guarded 1987–88 experience is the first local example; normal mode has no published experience yet and says so. Report-only years are secondary, explicitly labelled, and link into Classic Matches from a collapsed disclosure. Their existing canonical Season reading pages and article connections remain available.

Classic Matches opens directly into individual reports, with 12 stories per page in historical date order. Season, event-date decade, opponent and competition filters combine and persist through pagination; review mode additionally has publication status. A decade follows the match date, not the opening year of a season spanning two decades. Fixture/result text reuses the five existing prototype identities or an explicit score-bearing title; otherwise only known opponent labels are shown without inventing home/away order or a result. Full titles, excerpts, competition labels and event dates come from the existing canonical manuscripts and registry. No prose, entity IDs or publication boundaries changed.

Verification for this refinement is recorded in `docs/history-discovery-refinement.md`.
