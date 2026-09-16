# Istanbul Interactive History — local review handover

Publication update — 16 September 2026: Denny subsequently approved this experience and requested its release under History → Interactive History. The authoritative record is now `content/history/liverpool/interactive/istanbul-2005.json`; see [publication.md](./publication.md) for the approval and release checks. The original preview-stage audit below is retained as historical provenance.

This is an isolated feature implementation and a working editorial draft. The user explicitly requested implementation and local review, prohibited merging/publishing, and required the existing publication schedule to remain unchanged. No article or experience has been published, commissioned on the calendar, or deployed by this task.

## Repository reconciliation

- Specification v1.1 inspected `7c3fde673c01904d81cec930f66064bf7cf45565`.
- The original local checkout was older (`a2d0673`) and contained unrelated unfinished edits. It was read only; implementation uses an independent clone on `feature/istanbul-interactive-history`.
- Initial remote main matched the specification. A final fetch found newer About-page and Current Brief updates, ending at `2992d6813153b17f770b1975aca7bf6dc59e5097`. The feature is rebased onto that commit, preserving those updates.
- Current AGENTS.md, editorial README/calendar, connected-history, season and This Week guidance were read. There was no matching Istanbul calendar entry or open PR. The explicit instruction to leave the schedule untouched governs this feature draft.
- Historical transcription/writing was explicitly delegated to `gpt-6-astra`, `/root/astra_content`. Research provenance remains in `research.md` and the authoring record, outside reader projections.

## Run the local preview

Requires the repository's existing Node >=22.18 and installed dependencies:

```sh
INTERACTIVE_HISTORY_PREVIEW=istanbul-2005 npm run dev -- --hostname 127.0.0.1 --port 3145
```

Open <http://127.0.0.1:3145/preview/interactive-history/istanbul-2005>. Review shortcuts: `#half-time`, `#shootout-5`, `#champions` (the last reveals the result).

The loader checks development mode and the exact allowlist before reading the draft. Production returns 404 even with this environment setting present. Drafts are also excluded from production file traces. Public discovery remains absent until a reviewed record is explicitly promoted into the public collection with actual publication metadata.

## Architecture

`types.ts`, `schema.ts` and `state.ts` define strict authoring contracts, canonical-reference validation and immutable event replay. Scores, personnel, substitution counts and the result are derived from one ordered event record. Normal-time results, extra time and shoot-outs share the same match module; a clock-free context fixture proves the core separation.

`lib/content/interactive-history.ts` owns filesystem loading, publication eligibility and deliberate document/control projections. The server renderer handles prose, rosters, native evidence/context disclosures, SVG diagrams, statistics, source catalogue and canonical connections. Client components receive compact states and attempts or rendered server children. Local comparison selection never advances the historical cursor. The controller coordinates fragment/history behaviour and the sequential penalties.

History navigation, season/era connections, Matches and article links use the same published selector and existing factual-article ranking. There are no new production dependencies, runtime data/AI APIs, accounts or persistence. No existing article, calendar row or season record was rewritten. Required missing canonical identities were added once.

## Automated and browser checks

```sh
npm test
npm run lint
npm run build
node scripts/verify-seasons.mjs
node scripts/verify-history-explorer.mjs
node scripts/verify-interactive-history.mjs
```

The History verifier had stale homepage expectations from before the Articles unification. Only its assertions were reconciled with the current homepage; the homepage implementation was not changed.

Two optional repeatable Chromium scripts exercise interaction and accessibility against the running development preview. Browser tools are installed separately so they do not change production dependencies:

```sh
# In a separate tooling directory, install playwright and @axe-core/playwright,
# then run that installation's `playwright install chromium`.
INTERACTIVE_BROWSER_TOOLS=/absolute/path/to/browser-tools \
INTERACTIVE_BROWSER_OUTPUT=/absolute/path/to/check-results \
node scripts/verify-interactive-history-browser.mjs
INTERACTIVE_BROWSER_TOOLS=/absolute/path/to/browser-tools \
INTERACTIVE_BROWSER_OUTPUT=/absolute/path/to/check-results \
node scripts/verify-interactive-history-browser-edges.mjs
```

`INTERACTIVE_PREVIEW_URL` optionally overrides the localhost URL. The scripts cover exact states, penalty reveal/rewind/reset, Back/Forward, history entry counts, source/season return, local player/comparison state, clipboard fallback, passive scroll, hydration delay, mobile widths, keyboard actions, script-disabled reading, enlarged text/reflow and automated accessibility.

## Acceptance disposition

| Criteria | Evidence / disposition |
| --- | --- |
| A01–A08 | Continuous narrative; exact replay assertions for interval/restart, goal progression, rebound, later personnel and period-labelled statistics. |
| A09–A12 | Nine kicks, mathematical completion, one reveal per activation, stable controls, rewind/direct fragments/Back/Forward; contextual controls do not alter history. |
| A13–A17 | Baseline transcription, canonical identities, scoped schematic interpretation and source locators. Final editorial approval of prose/claims/diagrams is still pending. No invented dressing-room script, exact late timing, tracking data or golden-goal account. |
| A18–A20 | Chromium checks at 320/375/390/430/768/1280 CSS pixels; no page/bar overflow; no-JS record and delayed-hydration checks. |
| A21 | Keyboard, reduced motion, enlarged text, 400%-equivalent reflow and automated WCAG A/AA checks. Physical mobile VoiceOver and real-device/zoom review remain manual review tasks; automated checks do not certify WCAG compliance. |
| A22–A25, A29 | Strict negative fixtures and publication gates; synthetic different normal-time match rendered through ExperienceDocument; context-only replay; only historical events enter replay. |
| A26 | Compressed production feature chunks and control JSON measured within 50 KB/75 KB budgets. Local development lab timings are diagnostic only; no production/field Web Vitals claim. |
| A27 | Existing suite, all 67 seasons, 16 eras, existing route destinations and draft-isolation production checks. |
| A28 | Implementation and remaining editorial/device checks recorded here and in the task's review report. |
| A30–A32 | Passive replacement vs deliberate push, source/index controls, scoped restart cards, exact attempt restoration and neutral hydration shell. |
| A33–A34 | Reader projections omit editorial/confidence/model/approval internals. Production allowlist test returns 404; navigation/cards and server traces exclude drafts. |

## Remaining editorial work

All claim records remain `needs-review` and the experience remains a `working-draft`. The supplied historical baseline was transcribed and checked by Astra, but this is not Denny's approval of the final wording or tactical layouts. Review the 80 claim locators, short narrative, schematic positions/captions and central discovery subjects before promotion. `research.md` records precise scopes, conflicts and omissions.

Deliberately omitted: unverified 90-minute/comeback statistics, measured player coordinates, an exact minute for Gerrard's later role, exact Maldini seconds, exact Dudek-save minute, conflicting attendance, exact kick-off time, Milan's dressing-room psychology and broader post-final qualification claims. The supported coarse timing and attributed recollections remain explicit.
