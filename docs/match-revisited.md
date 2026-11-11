# Match Revisited

A weekly long-form write-up of one classic Liverpool match, published on Mondays. Only Denny-approved pieces are published; nothing here writes or publishes automatically.

## Files

- Planning list (never read by the site): `content/series/match-revisited-list.md`. Fields: date, opponent, score, competition, reason, era, status (`unused` / `written` / `published`) and `needs-approval`. Entries marked `needs-approval: yes` must be approved by Denny by name before anything is written.
- Pieces: `content/match-revisited/[slug].md`, validated by the strict `MatchRevisitedSchema` (`lib/content/types.ts`): `title`, `slug`, `date`, `eventDate` (the match), `opponent`, `scoreline`, `competition`, `decade`, `excerpt`, optional connection tags `players` and `opponents` (slugs from `content/players.json` and `content/opponents.json`), body. The season comes from `eventDate`. Pieces link into "Continue reading" with biographies, series, On This Day and articles automatically through `lib/content/related.ts`; tag a piece and nothing else is needed. The retired History taxonomy (entities, eras, relatedMatches) is not used.
- Pages: `/looking-back/match-revisited` (library, newest first) and `/looking-back/match-revisited/[slug]`, using the shared `HistoryArticle` template. Slug `match-revisited` is reserved under `/looking-back`.

## When a piece goes live

The shared Looking Back rule (`lib/content/go-live.ts`), but at 17:00 Europe/London rather than midnight (`MATCH_REVISITED_LIVE_HOUR`, Denny, 10 November 2026). Date a piece on a Monday and it appears at 5pm that Monday. Until then it is hidden on production from the library, its page (404), the sitemap and `getLatestMatchRevisited`; previews and local show it flagged "Scheduled for". Match Revisited pages revalidate every 10 minutes, so no redeploy is needed (a piece appears between 17:00 and about 17:10). The weekly queue is simply the dated files in `content/match-revisited/`; figure lists sit in `docs/match-revisited-notes/`.

`getLatestMatchRevisited()` returns the newest live piece; it stays the newest until a later piece goes live, so a missed week leaves the last one up. The homepage does not use it yet (awaiting Denny's decision on placement).
