# Mohamed Salah — proposed publication metadata

Prepared: 27 September 2026. Status: draft for Denny's review; publication not authorised.

## Destination and authorship

Proposed destination: the existing factual History → Players collection, using the existing Archive Markdown loader and canonical article route. Confirm destination and the site's approved AI reference authorship treatment before publication. This is an AI-written reference biography, not Denny's original writing. No new content system, author field or public destination has been created.

## Proposed fields

These fields use the schema and catalogues inspected on main at commit `cf7fbd53a040cb7bddf691205aa244dea07eb0d4`. They are a publication proposal, not an import-ready file or a publication instruction.

```yaml
title: "Mohamed Salah"
excerpt: "Mohamed Salah scored 257 goals across nine Liverpool seasons, helping the club win two league titles and the Champions League."
slug: "mohamed-salah"
historicalPeriod: "2017–2026"
decade: "2010s"
category: "person"
articleType: "player"
editorialMode: "factual"
playerIds: [mohamed-salah]
managerIds: [jurgen-klopp, arne-slot]
historyEras: [jurgen-klopp, arne-slot]
competitionIds: [premier-league, european-cup]
```

- `date`: required at publication; supply the actual publication date then. No historical date has been substituted.
- `season`: omit. This is a career biography, with no single principal campaign.
- `historicalEventDate`: omit. Neither the signing date nor birth date represents this full career.
- `decade`: the required single grouping field uses the decade of his Liverpool arrival; both managerial eras explicitly cover the full career. Review the grouping at publication.
- All relationship IDs above already exist. The catalogue calls the shared European Cup/Champions League competition `european-cup`; do not invent a duplicate `champions-league` ID.
- Mané, Firmino and opponents need no extra IDs merely because the prose mentions them. Salah is the principal player subject.
- Keep Sources once at the bottom of the rendered article, using the existing renderer convention. Do not duplicate the source list in both the body and a separately rendered frontmatter list.
- No `author`, `researchCutoff`, `published` or `status` fields have been added to the article schema. Keep editorial workflow data outside the public frontmatter.
- No related-article lists, season-record copies or links to unpublished destinations have been created.

## Repository inspection

Read the current `AGENTS.md`, `docs/editorial/README.md`, shared calendar, `docs/this-week.md`, `docs/connected-history.md`, `docs/seasons-publishing.md`, `lib/content/types.ts`, canonical entities and eras. Inspected main's complete file tree and the open pull-request collection. No existing Salah biography filename or competing open PR was found; the only Salah mention in the calendar concerned the 2019 Salzburg match.

The repository's calendar validator requires every entry and associated draft to carry one exact historical event date and a matching anniversary week. That format does not represent this undated career biography without assigning it an artificial principal event. The requested standalone biography is therefore delivered outside the repository, with proposed metadata. No calendar claim, queue, schema change or repository write is claimed. Resolve calendar handling through the existing editorial workflow before any repository integration; do not fabricate an event date to pass validation.

## Checks completed and remaining

Completed: read-only schema/catalogue inspection; canonical person/manager/era/competition IDs checked; duplicate filename and open-PR check; separate research and factual audit prepared with the article.

Not performed: repository validation commands, tests, lint, build, rendered-page inspection or deployed-link checks. There is no publication file or rendered page in this task. Before specifically approved publication, re-fetch current main, reconcile existing work, validate final frontmatter and authorship treatment, run the repository's existing validation/tests/lint/build, then inspect the rendered article, Sources and History links. Do not describe the proposed metadata as fully build-validated.

## Repository sources

All accessed 27 September 2026. Confidence: high for the repository state observed at retrieval, not for historical football claims.

- [Repository instructions](https://github.com/DennyRegan/the-liverpool-brief/blob/main/AGENTS.md)
- [Editorial workflow](https://github.com/DennyRegan/the-liverpool-brief/blob/main/docs/editorial/README.md)
- [Shared calendar](https://github.com/DennyRegan/the-liverpool-brief/blob/main/docs/editorial/history-calendar.json)
- [Connected History](https://github.com/DennyRegan/the-liverpool-brief/blob/main/docs/connected-history.md)
- [Seasons publishing](https://github.com/DennyRegan/the-liverpool-brief/blob/main/docs/seasons-publishing.md)
- [Content schema](https://github.com/DennyRegan/the-liverpool-brief/blob/main/lib/content/types.ts)
- [Entity catalogue](https://github.com/DennyRegan/the-liverpool-brief/blob/main/content/history/liverpool/entities.json)
- [Era catalogue](https://github.com/DennyRegan/the-liverpool-brief/blob/main/content/history/liverpool/eras.json)
- [Calendar validator](https://github.com/DennyRegan/the-liverpool-brief/blob/main/scripts/validate-editorial-calendar.mjs)
