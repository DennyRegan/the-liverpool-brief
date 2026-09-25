# Fernando Torres — proposed publication metadata

Status: draft for Denny’s review; publication is not authorised.

Proposed destination: the existing History / Players collection, backed by `content/archive/liverpool/fernando-torres.md` and the canonical `/archive/fernando-torres` URL. No new content system or entity is required. Destination and authorship treatment require confirmation at publication.

Authorship: AI-written reference biography researched, written and fact-checked by explicitly configured `gpt-6-astra`, worker `/root/astra_torres`. Do not attribute it to Denny as original writing. The current Archive schema has no author field; do not invent one. Confirm how the existing page communicates reference authorship before publishing.

Current repository inspected on 25 September 2026: `DennyRegan/the-liverpool-brief`, initial main commit `6cbc5aae49b9bb12fd7bb42899fe99243f6b8032`. Reviewed `AGENTS.md`, `docs/editorial/README.md`, the authoritative calendar, `docs/this-week.md`, `docs/connected-history.md`, `docs/seasons-publishing.md`, `lib/content/types.ts`, Archive loader, History helper, entity catalogue and era catalogue.

Proposed fields:

```yaml
title: 'Fernando Torres: Liverpool’s number nine'
historicalPeriod: 2007–2011
historicalEventDate: '2007-07-04'
decade: 2000s
excerpt: Fernando Torres scored 81 goals in 142 Liverpool appearances, forming a productive
  partnership with Steven Gerrard before injuries and a move to Chelsea ended his
  Anfield career.
slug: fernando-torres
category: person
articleType: player
editorialMode: factual
historyEras:
- rafael-benitez
- roy-hodgson
- kenny-dalglish-2011-2012
playerIds:
- fernando-torres
- steven-gerrard
managerIds:
- rafael-benitez
competitionIds:
- premier-league
- european-cup
```

The exact historical date is Torres’s verified signing date, retained as the commissioning-calendar anchor. It is not the date of the whole career and not a publication date. No `season` is proposed: this is a career biography. Explicit era IDs cover all three Liverpool managers in his spell. `2000s` is the required single decade grouping for the principal period; the display period and era tags preserve the 2010–11 coverage. Gerrard and Benítez are substantial subjects; passing mentions are not tagged. `european-cup` is the existing canonical competition identity. All IDs were read from the current catalogues.

Do not add `date` until publication is specifically approved; it must then be the actual publication date. No `published`, `author`, `researchCutoff` or workflow-status frontmatter fields are supported by the inspected schema. Keep those notes here. Sources appear once at the bottom of the article body; no duplicate frontmatter source list or manually maintained related-article list.

Draft workflow: authoritative calendar row `fernando-torres-career-biography`, with signing-date anchor 4 July 2007 and corresponding Monday 29 June 2026. This is a directly requested career biography; it does not replace any selected weekly anniversary item. Initial claim confirmed remotely in commit `c20ca6ef0286ffab7115f9c2380576440ff814e8`.

Validation scope: repository fields, existing identities and era coverage inspected; draft metadata checked against these rules. Full repository tests, lint, production build and rendered-page/link checks have not been run for this unpublished delivery. Before publication, re-fetch main, reconcile the draft, confirm destination/authorship, supply the approved date, run the existing calendar/history validation, tests, lint and build, then inspect the rendered article and generated links.
