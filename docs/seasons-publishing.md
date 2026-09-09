# Seasons publishing and research

Seasons lives inside History at `/history/seasons`. Existing History Explorer and era URLs remain in place. These are AI-assisted reference entries; the editor’s Archive remains the canonical home for original long-form writing.

## Data and relationships

Add one JSON file to `content/history/liverpool/seasons/`, named with the consecutive canonical season, for example `1969-70.json`. `lib/content/seasons.ts` defines the strict Zod schema and reads the records in chronological order. Routes and previous/next navigation are generated from available records; no placeholder pages or manually maintained index are needed. Run the validation, tests and build before publishing.

Person and competition IDs refer to the existing `content/history/liverpool/entities.json`. Check it before adding an identity: the same person uses one ID across manager and player roles. The season stores manager IDs explicitly, because an Explorer tenure may begin or end partway through a season. Era links derive from the existing Explorer’s tenure dates using July–June overlap; they do not create another era registry or infer a manager from a player’s name.

Each record has structured league position, all-competitive top scorers, competitions entered and their results, trophies, key people, incoming/outgoing transfers, narrative paragraphs, dated events and related seasons. Events expose people and competition relationships. Related seasons must have published records. Event IDs are local to a season; use the `(season, event.id)` pair as their stable identity.

Statistical facts, transfers and events carry source IDs resolving to the record’s source list. Each source includes its actual retrieved HTTPS URL, claim scope and internal high/medium/low confidence. Narrative and key-player selection are supported by those documented source scopes and the accompanying research audit. Confidence describes evidence quality; it is not an automated guarantee of correctness. Research notes preserve conflicts and exclusions, and appear in the expandable published sources section.

The UI uses server components and native links/disclosures, with no added database, API, client state or dependencies. Season pages are statically generated. An unknown or unpublished season returns 404. A new season becomes available after the normal build and reviewed publication process.

## Research convention

Research each season separately. Retrieve its match record, league table, scoring record and significant transfer ledger. Cross-check important facts against an independent official or specialist source. Check chronology, managerial changes, national cup entry, European stages, aggregate scores, goals across all competitions and the actual relevance of key players. Record discrepancies instead of quietly choosing a figure.

“Top scorer” means all competitive first-team matches, including the Charity Shield when played, and excluding friendlies. Shared Shields are explicitly labelled shared. List only competitions Liverpool entered; an absent competition is not an empty template field. Trophy IDs include league titles and shared/outright Shields, with the result field preserving that distinction.

Transfers are significant senior moves rather than every youth registration. Include an externally recruited young player when the move matters historically, even if first-team appearances follow later. Omit an uncertain fee; an undisclosed fee is not zero and is not a free transfer. Mark a free transfer only when established. Use the club name current at the time where practical.

Preparatory summer transfers belong with the incoming campaign, rather than mechanically copying a source’s ledger boundary. Ian St John’s 2 May 1961 signing is included in 1961–62: he joined the rebuild for the next campaign and made no competitive Liverpool appearance in 1960–61, although one league fixture remained on 3 May. Kevin Lewis’s June 1960 move belongs in 1960–61, Bert Slater’s June 1959 arrival in 1959–60, Dick White’s May 1962 exit in 1962–63 and Ray Clemence’s June 1967 arrival in 1967–68. A mid-season signing such as Phil Chisnall in April 1964 remains in 1963–64 even when the debut follows later. Record judgement calls so future batches do not duplicate moves.

## Archive integration

A season page selects existing Archive objects by their `season` metadata and links to their unchanged `/archive/{slug}` URLs. Common legacy spellings are normalised by the shared `seasonKey` helper. Do not copy Archive bodies or create a second article. No current Archive article covers these first ten seasons, so their Related Archive blocks are omitted. A future matching article appears automatically after the usual content build; no season-file change is needed. Matching and deduplication are covered with temporary fixtures and a real existing Archive example.

## Review and checks

Use `npm test`, `npm run lint`, `npm run build`, then `node scripts/verify-seasons.mjs` and the existing `node scripts/verify-history-explorer.mjs`. The route checks start and stop their own local production server. They do not publish anything.

For local editorial review after building, run `npm start -- --hostname 127.0.0.1 --port 3140` and open `http://127.0.0.1:3140/history/seasons`. Review the first season’s managerial note, promotion in 1961–62, the FA Cup/Europe account in 1964–65, the corrected scoring record in 1965–66, and the final 1968–69 entry. Check sources expanded on a narrow mobile screen and use both previous/next links and the History Explorer/Seasons switch.

Per-batch source audits are under `docs/research/`. No merge or deployment is authorised by this feature’s implementation brief: editorial review must happen first.
