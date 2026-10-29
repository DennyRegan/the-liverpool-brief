# This Week in History / On This Day

## Scope

Denny commissioned the week beginning Monday 26 October 2026 and instructed its upload to the site. This release contains seven selected, freshly checked manuscripts and their annual associations. It does not approve any other preserved manuscript or activate automatic writing or publishing. It follows the separately approved Connected History release and preserves its public 1987–88 season and Forest-only atlas.

## Reused content model

The pre-reset `lib/content/this-week.ts` was inspected at `4a7e833^`. Its strict annual event schema, Monday–Sunday window and Archive connections are reused. Complete historical prose lives once in `content/archive/liverpool`, at the permanent `/archive/[slug]` URL. The annual association in `content/this-week/liverpool` holds `month`, `day`, `year`, `title`, `summary`, `source` and `archiveSlug`; it has no article body. Publication dates remain separate from historical dates. Restored pieces retain their original publication dates; previously unpublished drafts receive their actual publication date.

`content/history/liverpool/event-verifications.json` records checked dates, sources, review dates and the precise scope of verification. Optional `eventSlug` connects a verified annual association to its approved factual article. This also supports a birthday linked to a career biography without forcing the biography into a single season or historical event date. Missing, withdrawn and non-factual articles disappear from the calendar. Contradictory dates or unrecorded verification URLs fail validation. An old publication or calendar approval never restores content by itself.

## Reader behaviour

`/history/on-this-day` displays all eligible stored entries for the current UK Monday–Sunday week. `?week=YYYY-MM-DD` selects the week containing that date; `?date=YYYY-MM-DD` retains daily discovery. `/this-week` redirects to the weekly History destination. The homepage body is unchanged.

Selection happens on each request using Europe/London. An open default-week page refreshes within a minute of Monday or on return to a background tab. A deliberately selected historical week stays selected. February 29 anniversaries occur only on February 29, with no substitute date in ordinary years. Empty dates receive no invented stories; an empty week has one clear empty state. UK dates and UTC calendar arithmetic avoid daylight-saving and server-timezone drift.

There is no visitor-triggered writing, research, source fetching, paid API or content mutation. Newly approved writing requires an ordinary content release; annual recurrence and Monday rollover need no new build.

## Collection: 26 October–1 November 2026

| UK day | Historical event | Canonical manuscript |
| --- | --- | --- |
| Monday 26 October | Liverpool end Chelsea’s 86-match home league run, 2008 | `alonso-ends-chelsea-home-run-2008` |
| Tuesday 27 October | Tommy Lawrence’s debut, 1962 | `west-brom-liverpool-1962-lawrence-debut` |
| Wednesday 28 October | Liverpool 6–0 Manchester City, 1995 | `1995-10-28-liverpool-manchester-city` |
| Thursday 29 October | Ian Rush scores five against Luton, 1983 | `liverpool-luton-1983-rush-five` |
| Friday 30 October | Robbie Fowler’s first league hat-trick, 1993 | `liverpool-southampton-1993-fowler-hat-trick` |
| Saturday 31 October | Klopp’s first league win, Chelsea 1–3 Liverpool, 2015 | `chelsea-liverpool-2015-klopp-first-league-win` |
| Sunday 1 November | Barnes creates the derby breakthrough, 1987 | `liverpool-everton-1987-barnes-creates-derby-win` |

Existing manuscripts were reused after checking the historical records, contemporary reports and club sources listed in each article. Source footers and metadata now agree. Joe Fagan and Kenny Dalglish manager IDs and missing venues were checked against the registry and match records. The Southampton draft’s duplicate body headline was removed. An unconfirmed stepover detail was omitted from the Chelsea 2015 draft.

The Chelsea 2008 article explains a scoring-record distinction: league accreditation records Bosingwa’s own goal, while Liverpool credits Alonso. Fowler’s final goal follows the 85th minute in LFChistory; contemporary reports vary slightly in their minute descriptions. No new direct quotations were introduced. Verification notes identify their scope instead of claiming that a date check certifies an entire article.

The two previously approved factual reports remain unchanged. Their verified anniversaries, plus these seven entries, make nine verified events. The other 551 reports in the preserved inventory remain outside public content. The public atlas remains explicitly selected and does not expand merely because another report is published.

## Monday preparation workflow

Each Monday, maintain the current full calendar week and the following three full weeks. Start with `node scripts/prepare-history-week.mjs YYYY-MM-DD`: this is a read-only inventory, not a publisher. Inspect the current schemas, `connected-history.md`, `seasons-publishing.md`, approved content, existing manuscripts and canonical entity IDs before commissioning anything.

Reuse verified annual entries and completed manuscripts. Select significant matches, goals, birthdays, managerial events and other worthwhile anniversaries without a daily quota. Cross-check dates and important facts, trace quotations and omit unsupported detail. Write complete, engaging British-English historical prose; use the existing Archive schema and one final Sources section. Keep drafts and research private, without invented publication dates. Submit new writing for Denny’s approval before public placement or release. Never re-enable the three retired automatic GitHub publishers.

The original authoritative editorial calendar is absent from current main. The recurring Monday writer remains inactive until its preserved calendar is deliberately reconciled in an agreed private location. This finite, explicitly commissioned seven-story release does not silently restore that calendar, old approval fields, competing claims or automatic-publication authority. The public GitHub repository must not receive unpublished manuscripts. Once the private calendar is reconciled, claim existing rows before work and stop affected commissioning if ownership or the source cannot be established.

## Sunday Brief

The local-only `/preview/history/newsletter` defaults to the previous completed UK Monday–Sunday week. Editors can select another week, choose an eligible entry, inspect evidence and copy its existing excerpt, canonical link and sources into a draft. The selected ID is retained in the local URL and revalidated. Withdrawn or out-of-window choices are rejected. No email is sent. For this collection, Rush’s five-goal afternoon is a strong editorial candidate; selection remains the editor’s decision.

## Validation

The integrated release passed 61 tests, with 13 explicitly skipped because the private prototype pack is absent; content validation, lint and the standard production build passed. Earlier isolated implementation checks covered the complete private pack. Tests cover UK midnight and both DST transitions, Monday/Sunday and year boundaries, leap centuries, annual recurrence, future dates, invalid inputs, withdrawal, source drift and explicit biography associations.

The final local production build passed seven complete story checks, seven daily associations, 45 connected routes, weekly no-store caching, `/this-week` redirect, invalid-date and empty-week recovery, private-preview exclusion and sitemap checks. All 551 other unapproved report URLs returned 404. Production traces exclude editorial/private files and include the approved annual content. Desktop and 390px browser checks found no horizontal overflow and confirmed full writing and sources behind the weekly cards. Hosted preview and production checks are performed during the release and recorded in its PR/task; this document is not itself evidence of deployment.
