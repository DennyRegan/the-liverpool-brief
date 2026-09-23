# Preparing a Match Centre table update

Run `npm run table:prepare` in the repository after a Premier League matchweek. The command fetches the current Sky Sports table and prints the number of changed clubs and Liverpool’s old and proposed position and points.

If there are changes, it creates a dated proposal in `docs/editorial/table-proposals/`. That folder is **not read by the website**. The published table remains in `content/match-centre/liverpool/2026-27.json` until Denny has checked the proposal and approved publication. An existing proposal is never overwritten.

Before approval, compare all 20 rows with the linked source and confirm Liverpool’s recorded league results are up to date. If the command refuses to run because the source format has changed, a club is missing, the arithmetic fails, the snapshot is older, or a Liverpool result is unrecorded, investigate; do not bypass the check. Once approved, merge only the proposal’s `table` and table-source `checkedOn` into the current season file, set the file’s `updatedAt` to the approval time, run `npm test` and `npm run build`, then commit and deploy. Do not copy the proposal over the whole season file: that could erase subsequent fixture changes. A proposal from an earlier day may have become stale; check the source again before publishing it.

No background task runs this command, and it never edits the published season file itself.
