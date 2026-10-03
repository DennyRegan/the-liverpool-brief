# Automatic weekly History publishing

**Enabled on main on 2 October 2026.** Commit `c7ab071` enabled the publisher,
and `0f668b0` merged it into main. The latest main `history-calendar.json` remains
authoritative for current enabled/paused state. Denny’s 3 October continuation
uploads completed, unpublished reports to this inventory and leaves release to
the existing weekly publisher; do not manually publish or dispatch a new release.
Non-main live dispatches are refused. The review workflow has read-only repository permissions.

## Authority and eligibility

Denny's instruction of 1 October 2026 authorises automatic publication of completed,
technically ready historical career biographies and factual historical match
reports in this specific queue, without individual manuscript approval. This
supersedes the earlier per-article review gate **only for these records after the
publisher is activated**. Technical checks do not constitute a new factual audit.
Preserve research evidence, authorship, prose, historical dates, slugs and entity IDs.

The existing shared calendar, canonical drafts, review queues and match inventory
remain the sources of truth. No second editorial database is created. A row must
explicitly carry `publicationClass: "automatic-history-biography"` or
`"automatic-history-match"`. Completed stock in the reviewed migration is opted
in using the current derived technical queue, not filename guesses or fixed counts.
Future manuscripts use the same existing row/evidence architecture and publication
class; no code or list of article names needs updating.

Eligibility also requires ready-for-review/approved status, completed evidence,
a genuine canonical manuscript, valid Archive metadata/relationships, no claim,
no blockers, no duplicate public coverage and no previous automatic selection.
Biographies must have a career identity and player/manager article type; matches
must have match type, historical date and principal season. Opinion metadata is
refused. At promotion, absent `editorialMode` becomes `factual` under this narrow
authority; individual `approval` is never invented or cleared.

Opinion, Analysis, current news/coverage, unfinished drafts, research notes,
blocked/NOT LOCATED records, season references and This Week entries are excluded.
No existing This Week selection/event/automation is changed. Public connections
continue deriving from existing metadata; other writing keeps its normal cadence.

## Cadence, selection and deployment

- Tuesday: one uniformly random eligible biography, including manager biographies.
- Friday: one uniformly random eligible historical match.
- Each workflow has UTC opportunities at **08:17 and 09:17** on its day.
  The script accepts starts between 09:00 and 12:59 Europe/London: ordinarily
  09:17 BST or GMT. GitHub may delay or drop schedules; this is a target, not a
  guaranteed exact delivery time. Winter's 08:17 trigger is ignored. In summer
  both opportunities map to the same durable queue/date slot, so only one releases.
- Node's cryptographic `randomInt(pool.length)` selects across the full eligible
  pool with equal opportunity. Review ordering and file/season order confer no
  selection preference. There is no AI selection or prose rewrite.
- A calendar run records the exact row, slug, draft path, SHA-256 and selection
  time in a committed, normally pushed reservation **before publication begins**.
- Promotion creates the existing `content/archive/liverpool/<slug>.md` and retains
  its `/archive/<slug>` URL. Metadata is serialised as compatible JSON/YAML; the
  Markdown body is copied byte-for-byte. Canonical drafts/provenance are retained
  as editorial evidence, never served as a second public article.
- The public `date` is the real London publication date. The run's `publishedAt`
  records the exact promotion timestamp; it is separate from historical dates.
- Calendar/history validation, the full tests, blocking lint and production build
  must pass before the publication commit/push. A normal main push uses the
  existing Vercel Git integration; no Vercel token/new host is introduced.
- The article/catalogue status is `publication_pending` until the live article,
  sitemap, History and This Week return 200, with the exact canonical URL in
  the article and sitemap. Local inventory must exclude the article. Verification
  polls up to 40 times at 15-second intervals, with each HTTP request bounded to
  10 seconds (under approximately 17 minutes including slow requests).
- Only verified completion sets `published`, `succeeded` and `verifiedAt` in a
  separate normally pushed calendar commit. Git history identifies publication
  commits; success is never inferred merely from pushing.

## Failures and concurrency

Both workflows share one non-cancelling Actions writer lock. Calendar slot/row
uniqueness and one outstanding selection per queue provide durable idempotency.
Every push fetches main and compares it with the tested base; a concurrent update
or rejected push stops without force-pushing, rebasing untested publication files,
or discarding anyone's work. A fresh retry reads latest main and revalidates.

Any validation/test/build/commit/push/deployment failure stops. There is no
substitute, factual repair or reroll. A pre-publication failure leaves the remotely
reserved `selected` run. A deployment/verification/completion-save failure leaves
`publication_pending`; the article may already be live, but the run has not been
reported successful. Logs and the Actions job summary identify the slot and failure.
If the reservation push itself loses a race, no publication was attempted and the
selection never became authoritative; inspect logs before retrying.

A failed queue blocks new selections in that queue; it does not block the other
queue after the shared writer lock is released. A later scheduled week does not
catch up a missed release or roll past a failed selection. Resolve old selections
through explicit retry. A retry that actually releases an article during a later
London week consumes that queue's release for that week, preventing a second
catch-up publication. Empty slots are saved and stay empty on rerun.

## Operating commands

Inspect eligible inventory without changing it:

```sh
npm run --silent history:pool -- biographies
npm run --silent history:pool -- matches
```

Read-only local/manual testing:

```sh
npm run history:dry-run -- biographies
npm run history:dry-run -- matches
npm run validate:calendar
npm run test:publisher
npm test
npm run lint
npm run build
```

Both weekly Actions workflows default manual dispatch to `dry_run: true`. The
review workflow runs all checks and both dry runs on the review branch, verifies
unchanged Git state and checks that unpublished routes remain inaccessible. Local
dry runs perform candidate/schema/metadata/duplicate checks in memory and print
selected identity, proposed paths, date/status changes and manuscript digest.
They do not move/write content, reserve, commit, push or deploy. Run the full
checks above alongside local dry runs.

Inspect `automaticHistory.runs` in the calendar on **main** and the failed job
summary/logs. For a saved failure, dispatch that queue's workflow **on main** with
`dry_run: false` and its exact existing `retry_slot`, e.g.
`biographies:2026-10-06`. Live manual execution only retries a previously recorded
selection, including an already completed no-op; it cannot select a new article.
An unchanged manuscript is required. Pending deployments retry verification without
creating another public article. Do not delete, reset or change the selected run
to get another random item. Resolve metadata/blockers before retrying; changed
selected prose requires editorial investigation rather than automatic repair.

Pause all queues by setting `automaticHistory.enabled: false` in a reviewed main
calendar commit (or disable the two workflows in GitHub). Pause one by adding
`biographies` or `matches` to `pausedQueues`; the other continues. Resume by
removing the pause after addressing any saved failure. Remove an unselected article
by removing its `publicationClass` or setting its existing status to `blocked`
with a real blocker. Removing the class from a selected item halts promotion while
retaining its reservation; do not use it to skip to a replacement.

## Original activation checkpoint (completed 2 October 2026)

The original activation requirements below are retained as implementation history.
The completed merge and enabled calendar do not establish that a scheduled public
release has already succeeded; consult the saved run and verification evidence.

1. Review the branch, migration incorporation, CI and recorded dry-run results.
2. Denny explicitly approves the final main merge and activation. Merge with
   `enabled: false` first if additional review/configuration is needed.
3. Confirm GitHub Actions may write main under the repository's protection rules,
   and Vercel's existing Git integration accepts the Actions bot publication commit.
   This is a public repository; standard Vercel integration normally accepts bot
   authors. Neither a production bot push nor its deployment has been tested by
   this implementation task. If branch protection rejects writes, authorise the
   appropriate existing automation identity; do not bypass protection or invent
   credentials. No extra secret is otherwise required by this implementation.
4. After approval, set `automaticHistory.enabled: true` through a reviewed main
   calendar change. The next eligible Tuesday/Friday opportunity publishes one.

Scheduling reference: [GitHub scheduled events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
Deployment reference: [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github).
