# Second commissioned ten biographies — 3 October 2026

Scope: exactly ten NEW researched manuscripts, unpublished on a dedicated branch. Denny explicitly requested Sol 6.1 for research and writing, overriding project model instructions. No publication, schedule or approval is authorised.

## Inventory inspection

Fetched all current remote branches. Inspected main 03391d3a9a8461688828e0e33551d5ecd82fd036, the previous biography batch 4bc4b97a72fb3620fa3375a5834096277b0a020b, biography migration, automatic-history and active match branches. Previous batch has 40 completed unpublished biographies; Phil Thompson is already published. The ten selected have no completed career biography in those inventories. Focused articles are not career biographies.

Main's later Brief update and publisher activation are reconciled into this branch without dispatching or altering the publisher. This batch does not merge to main.

## Selection before research

1. **alan-hansen** — Ball-playing defender and captain across eight league titles and three European Cups.
2. **terry-mcdermott** — Midfield scorer and major contributor to Liverpool’s first European supremacy.
3. **sami-hyypia** — Transformative defender, captain and foundation of the 2001 and 2005 teams.
4. **rafael-benitez** — Manager of Istanbul and the 2006 FA Cup winners, whose six-year rebuild reshaped Liverpool.
5. **jamie-carragher** — One-club defender, long-serving vice-captain and Liverpool’s second-highest appearance maker.
6. **jan-molby** — Distinctive midfield organiser whose Liverpool story spans the double and difficult later years.
7. **michael-owen** — Home-grown goalscorer, 2001 cup-final match winner and Ballon d’Or recipient.
8. **xabi-alonso** — Midfield architect central to Istanbul and the 2008–09 title challenge.
9. **pepe-reina** — Outstanding goalkeeper and durable contributor under Benítez and his successors.
10. **john-toshack** — Transformative Shankly signing and Keegan’s strike partner in the early 1970s.

Hansen, McDermott and Hyypiä are new production, not recovered originals. Original gap records are preserved verbatim in `biography-not-located-snapshot-2026-10-03.json`; previous migration/recovery reports and recovered research files remain unchanged. The authoritative rows will describe newly completed manuscripts.

Extended treatment: Rafael Benítez, Jamie Carragher and Alan Hansen; other subjects receive length appropriate to their Liverpool stories.

## Storage and boundaries

Manuscripts, new research records and separate factual audits: `docs/editorial/drafts/biographies/<person-id>{,-research-record,-factual-audit}.md`. Existing canonical person IDs, no public content files, no publication dates, null approvals and destinations, `ready_for_review` on completion. `history-calendar.json` remains the sole status authority. Automatic queue compatibility does not dispatch publication.

## First five checkpoint

Completed and separately author-audited: Alan Hansen, Jamie Carragher, Jan Mølby, Pepe Reina and Rafael Benítez. All five pass calendar/schema, canonical identity, unique subject/slug, complete research and audit URL-register, unpublished/null-approval and read-only automatic-queue compatibility checks. Narrative source links are confined to a single bottom Sources section; inline citation markers removed following Denny's explicit request.

Technical compatibility changes: biography authorship enum accepts actual Sol 6.1 alongside earlier Astra records; existing authorship is untouched. Missing-manuscript and publisher-pool tests now use state/fixtures rather than permanently excluding these three newly commissioned subjects. Synthetic Git transport fixture permits a 32 MiB calendar read after inventory growth crossed its default 1 MiB buffer. Publisher implementation/state is unchanged. Initial schema failure from overly long slugs was corrected to existing filename/slug conventions. Full final tests/lint/build and HTTP verification follow after all ten are complete.

Latest concurrent match branch 43250eea4c5fc3a1daf794c53669ef43350cac01 was fetched and its biography rows checked: no selected subject has a completed manuscript there. Its new match work stays on that branch; no other remote refs are moved.
