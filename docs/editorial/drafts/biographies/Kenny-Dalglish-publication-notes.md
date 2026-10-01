# Kenny Dalglish — proposed publication metadata

Prepared 27 September 2026. This is an unpublished, AI-written factual reference biography commissioned by Denny. It must not be presented as Denny's original writing.

## Proposed destination

Existing History / Players browsing, using the existing canonical article store and URL convention. Proposed filename: `content/archive/liverpool/kenny-dalglish.md`; proposed canonical URL: `/archive/kenny-dalglish`. These are proposed destinations, not live links. No article has been added to the published collection.

The biography gives substantial attention to both playing and managerial work. `articleType: player` is proposed because the approved Players browser selects that article type; `managerIds` also records Dalglish's substantial managerial contribution using the same canonical person identity. Confirm placement and authorship treatment before publication. Do not create a second copy for managers.

## Proposed fields

```yaml
slug: "kenny-dalglish"
historicalPeriod: "Liverpool player, 1977–1990; manager, 1985–1991 and 2011–2012"
decade: "1980s"
category: "person"
articleType: "player"
editorialMode: "factual"
playerIds: [kenny-dalglish]
managerIds: [kenny-dalglish]
historyEras:
  - bob-paisley
  - joe-fagan
  - kenny-dalglish-1985-1991
  - kenny-dalglish-2011-2012
```

Use the delivered biography's final title. Suggested excerpt: "Kenny Dalglish's Liverpool career as a player and manager, his support for families after Hillsborough, and the lasting importance of his service to the club."

The publication agent must add the actual publication `date` only after approval. No principal `season` or `historicalEventDate` is proposed: this is a career biography, not an account of one campaign or an anniversary event. `decade` is the existing coarse display field and does not restrict the career's chronology. The era list covers the main playing and managerial periods, rather than every later ceremonial appearance. Only Dalglish is tagged as a substantial biographical subject. No guessed identities, duplicate person records, manually maintained related lists or season-record copies are needed.

The existing schema has no authorship field. Do not invent one. Confirm how the existing site will identify this AI-written reference biography before publication.

## Repository inspection

Inspected on 27 September 2026 at main commit `680589a1ce4879d2a88ddb39a49bd06bca72bac1`:

- `AGENTS.md`
- `docs/editorial/README.md`
- `docs/editorial/history-calendar.json`
- `docs/this-week.md`
- `docs/connected-history.md`
- `docs/seasons-publishing.md`
- `lib/content/types.ts`
- `content/history/liverpool/entities.json`
- `content/history/liverpool/eras.json`
- `scripts/validate-editorial-calendar.mjs`

Confidence: high for these retrieved repository facts. The person ID and four era IDs above exist. The player and manager fields both accept the same person ID. No full Kenny Dalglish career biography was found in the inspected main draft/public filename inventory or calendar; existing Dalglish match reports are distinct works. Refresh this check before publication to account for concurrent work.

## Workflow limitation

Automatic approval review rejected the proposed shared-calendar claim on the repository's main branch, stating that the article request did not authorise that shared-repository mutation and that its destination was not verified as trusted. The rejected action was not retried or routed through another write mechanism. Subsequent local inspection showed a clean checkout at the same commit. No remote claim, calendar update or repository draft save is claimed.

The expressly requested biography is therefore delivered as standalone review files. Reconcile it with the authoritative calendar and repository workflow before any later publication. Do not interpret these files or their factual classification as publication approval.

## Validation and publication gate

Proposed fields and identities were checked against the retrieved schema and catalogues. Application tests, lint, build, live-page checks and rendered-page checks were not run for this standalone draft. No site change was made.

After explicit approval of this specific biography, its destination and authorship treatment: refresh repository instructions and schemas; reconcile the existing calendar; set the actual publication date; run existing calendar/content validation, tests, lint and build; inspect the rendered article on mobile and desktop; check the source links, History placement and generated related links. Do not link to unpublished destinations.
