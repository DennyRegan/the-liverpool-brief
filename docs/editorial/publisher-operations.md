# Publisher operations — plain-English guide

Written 3 October 2026 for Denny. It covers three jobs: taking a published piece
offline, checking the live site on a release morning, and running a safe dry run.
Background and rules are in [automatic History publishing](automatic-history-publishing.md).

## 1. Take a published piece offline

**Why it is not just "delete the file".** The calendar remembers every release.
If the article file disappears but the calendar still says it is published, the
calendar check fails, the build fails, and the old site (with the piece still on
it) stays live. The calendar must be changed in the same commit. These steps were
tried on a throwaway copy of the repository for both a biography and a match
report, and passed the calendar check, the build checks and the pool check.

### Step A — stop a second release (about a minute)

1. On GitHub open **Actions**, open "Weekly History biographies" and "Weekly History
   matches", and use **… → Disable workflow** on each. This stops a new piece
   being chosen while you fix this one. (Disabling is only a pause. Switch them on
   again when you are happy.)

### Step B — first aid on the live site (optional, a few minutes)

2. In Vercel open the project's **Deployments**, find the last deployment from
   *before* the commit called `History: publish <slug> for <slot>`, and promote it
   to production ("Instant Rollback" where your plan offers it). The site goes back
   to how it was without the article.
3. This is only a stopgap. The next push to `main` would put the article back, and
   Vercel may stop auto-publishing new deployments until you re-enable it. Do Step C.

### Step C — remove it properly (one commit to `main`)

Do this on your computer, with the latest `main`:

4. Find the slug and the slot (for example `biographies:2026-10-06`). They are in the
   commit message `History: publish <slug> for <slot>`, and in
   `automaticHistory.runs` in `docs/editorial/history-calendar.json`.
5. Delete the public file: `content/archive/liverpool/<slug>.md`. Leave the draft
   under `docs/editorial/drafts/` alone; it is the evidence copy.
6. Edit `docs/editorial/history-calendar.json`:
   - In `automaticHistory.runs`, find the entry with that slug. Change `"state"` to
     `"empty"` and set `rowId`, `slug`, `draftPath`, `manuscriptSha256`,
     `publishedAt`, `publicSha256` and `verifiedAt` to `null`. Keep `slot`,
     `queue` and `selectedAt`. **Do not delete the entry**: an empty slot stops the
     publisher choosing a different piece that day.
   - Find the row whose `id` was that run's `rowId`. Set `"publishedDestination"` to
     `null`, set `"status"` to `"ready_for_review"`, **delete its
     `"publicationClass"` line** (this is what keeps it out of future draws), and
     add a note such as "Taken offline <date>: <reason>" to `notes`.
   - Do not use status `blocked` for match reports: it fails the 1960s season check.
7. Check before pushing: `npm run validate:calendar`, then `npm test` and
   `npm run build`. If any fails, fix it before pushing; a failing build leaves the
   piece live.
8. Commit ("Take <slug> offline") and push to `main`. Vercel redeploys in a minute or two.
9. Confirm: `https://theliverpoolbrief.com/archive/<slug>` shows "This page is no
   longer here" (not the article); the title is gone from `/history`, `/this-week`
   and the home page. `/sitemap.xml` is cached for up to an hour, so it may
   still list the address for a while. If Google has it, use Search Console's
   removal tool.
10. To bring it back later: restore the file, set the row's `publicationClass` again
    (and status), and let the next release or a reviewed change handle it.

## 2. Release morning checklist

**When.** Biographies on Tuesdays, match reports on Fridays. The workflow starts at
about 09:17 UK time (it may be delayed; it will not start after 12:59). The checks
and deployment take roughly 15–30 minutes, and the live check can wait up to
about 17 minutes more. Expect the piece live within about an hour of the start; if it is not, check the run.

**In GitHub (Actions tab).** Open the day's "Weekly History …" run.
1. It should end green. The summary says, in order: a reserved slot, then
   `<slot>: publication commit <id>; awaiting production verification.`, then a
   verified message.
2. A red run says `Publication STOPPED: <reason>. … No substitute selected.` Nothing
   is replaced or rerolled; see "Failures" in the publishing guide.
3. On the `main` commit list you should see three commits, in this order:
   `History: reserve <slot> (<slug>) [skip ci]`, `History: publish <slug> for <slot>`,
   `History: verify <slot> live [skip ci]`. Only two means it is still pending or failed.

**On the live site** (theliverpoolbrief.com), using the slug from the commit message:
1. `/archive/<slug>`: the article loads, the title and text read properly, and the
   date is today's UK date.
2. It is not sensitive (Hillsborough, Heysel or similar), and nothing looks wrong
   (broken headings, a missing sources list, odd characters).
3. `/history` and `/this-week` load (they must return 200) and the piece appears
   where you would expect (match reports under Matches, biographies under Players).
4. `/sitemap.xml` includes the address (it can take up to an hour to refresh).
5. The home page still loads and leads with your latest article, not the new piece.
6. `automaticHistory.runs` in the calendar on `main` shows the run as `succeeded`.

If anything is wrong, use section 1.

## 3. A safe dry run

A dry run picks a piece and prints what it would do. It writes nothing, saves
nothing and publishes nothing.

**On your computer**, in the project folder with dependencies installed
(`npm ci`):

```sh
npm run history:dry-run -- biographies
npm run history:dry-run -- matches
npm run history:pool -- matches      # the full list of eligible pieces
git status --porcelain               # must print nothing new
```

**What to look for in the result:**
- `"dryRun": true`, `"writes": 0` and `"published": false`.
- `eligibleCount`: the size of the pool. On 3 October 2026 it was 60 biographies and
  314 matches. A big drop means something has been excluded (check why).
  A sudden jump means something new was tagged.
- `selected`: the piece it chose. Read the `title`, the `slug` and the `draftPath`.
  Is it a piece you are happy to see go out, and not a sensitive one? The pick is
  random, so a second run shows a different piece; the real run picks again.
- `destination` is `/archive/<slug>`, `publicationDate` is today, and
  `prosePreserved` is `true`.
- `selected` is `null` with a count of 0 means an empty pool: the real run would record
  an empty week and publish nothing.

**What a dry run does not prove:** that the Actions bot may push to `main`, that
Vercel deploys a bot commit, or that the live check works. Those have still never
been exercised. It also ignores the weekday/time rule and the on/off switch in the
calendar, so it will run even while the publisher is paused.

**In GitHub.** Disabled workflows cannot be started by hand. The "History
publisher review (no publication)" workflow runs both dry runs automatically on
any pull request that touches `scripts/`, `tests/`, `docs/editorial/` or
`package.json`. It has read-only permissions and checks that nothing changed.
