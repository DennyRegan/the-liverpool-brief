# Steven Gerrard — proposed publication metadata

Status: editorial draft; not approved for publication.
Research cut-off: 27 September 2026.
Repository inspected: DennyRegan/the-liverpool-brief, main at cf7fbd53a040cb7bddf691205aa244dea07eb0d4.
Canonical calendar claim confirmed on main at 19e0ebadde3cefba2f7396a4d7c259e636dfc80a.
Historical research, writing and factual audit: explicitly configured gpt-6-astra, worker /root/astra_gerrard.

## Proposed existing destination

History → Players, using the existing file content/archive/liverpool/steven-gerrard.md and canonical URL /archive/steven-gerrard. This is a proposal, not publication approval. No new content system or related-article list is required.

The editorial draft belongs at docs/editorial/drafts/steven-gerrard.md, outside published loaders.

## Draft frontmatter

```json
{
  "title": "Steven Gerrard",
  "historicalPeriod": "1998–2015",
  "historicalEventDate": "1998-11-29",
  "decade": "2000s",
  "excerpt": "Steven Gerrard’s Liverpool career, from his emergence under Gérard Houllier to Istanbul, Cardiff, his partnership with Fernando Torres and the pursuit of the league title.",
  "slug": "steven-gerrard",
  "category": "person",
  "articleType": "player",
  "editorialMode": "factual",
  "historyEras": [
    "gerard-houllier",
    "rafael-benitez",
    "roy-hodgson",
    "kenny-dalglish-2011-2012",
    "brendan-rodgers"
  ],
  "playerIds": [
    "steven-gerrard",
    "fernando-torres"
  ],
  "managerIds": [
    "gerard-houllier",
    "rafael-benitez",
    "brendan-rodgers"
  ],
  "competitionIds": [
    "european-cup",
    "fa-cup",
    "premier-league"
  ]
}
```

## Editorial decisions

- This is a career biography, so no principal season is assigned.
- The historical period is the senior Liverpool playing career. Brief later-career material is an epilogue, not a separate managerial biography.
- The five historyEras cover the senior Liverpool career. Houllier's sole tenure had begun before the first-team debut; the preceding joint-management era is not tagged.
- The historicalEventDate is the verified competitive debut, used as a factual anchor by the current commissioning calendar. It is not the publication date or a claim that the biography covers one match.
- The decade is the main playing decade, 2000s. The historicalPeriod preserves the full span.
- All proposed relationship IDs were checked against the retrieved canonical entity and era catalogues. Champions League history uses the existing european-cup identity.
- Gerrard and Torres receive player tags because their partnership is a substantial subject. Passing mentions do not receive tags.
- Sources appear once at the foot of the biography. Confidence labels, provenance and factual audit stay in editorial notes.
- Do not assign a Denny byline. Treat this as an AI-written factual reference biography. Confirm the destination and public authorship treatment before publishing.
- No publication date, inferred approval or unsupported author field has been added.

## Checks and remaining publication gate

Read: AGENTS.md; docs/editorial/README.md; latest main docs/editorial/history-calendar.json; docs/connected-history.md; docs/seasons-publishing.md; docs/this-week.md; lib/content/types.ts; lib/content/archive.ts; canonical entities and eras; editorial calendar validator.

Checked: proposed field names and types against the retrieved schema; canonical entity kinds and era IDs; absence of a Gerrard article/draft filename in the main inventory and a Gerrard commissioning row before the claim; existing branches and open PR inventory; preservation of existing calendar rows. These are editorial metadata checks, not a claim that the repository test suite passed.

Not run for this unpublished writing task: application tests, lint, build or rendered-page/link checks. Before specifically authorised publication, refresh repository state, obtain actual publication date and approval, run existing validation, tests, lint and build, and inspect the rendered article and its History connections. Do not publish research notes or confidence labels in the article body.

