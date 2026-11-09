# Match Revisited

A weekly long-form write-up of one classic Liverpool match, published on Mondays. Only Denny-approved pieces are published; nothing here writes or publishes automatically.

## Files

- Planning list (never read by the site): `content/series/match-revisited-list.md`. Fields: date, opponent, score, competition, reason, era, status (`unused` / `written` / `published`) and `needs-approval`. Entries marked `needs-approval: yes` must be approved by Denny by name before anything is written.
- Pieces: `content/match-revisited/[slug].md`, validated by the strict `MatchRevisitedSchema` (`lib/content/types.ts`): `title`, `slug`, `date`, `eventDate` (the match), `opponent`, `scoreline`, `competition`, `decade`, `excerpt`, optional `players` (slugs from `content/players.json`), body. The retired History taxonomy (season, entities, eras, relatedMatches) is not used.
- Pages: `/looking-back/match-revisited` (library, newest first) and `/looking-back/match-revisited/[slug]`, using the shared `HistoryArticle` template. Slug `match-revisited` is reserved under `/looking-back`.

## When a piece goes live

The shared Looking Back rule (`lib/content/go-live.ts`): midnight Europe/London on the Monday of the piece's week. Date a piece on a Monday and it appears that Monday. Until then it is hidden on production from the library, its page (404), the sitemap and `getLatestMatchRevisited`; previews and local show it flagged "Scheduled for". Pages revalidate hourly, so no redeploy is needed (a piece can appear up to an hour after midnight).

`getLatestMatchRevisited()` returns the newest live piece; it stays the newest until a later piece goes live, so a missed week leaves the last one up. The homepage does not use it yet (awaiting Denny's decision on placement).
