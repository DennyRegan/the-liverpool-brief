# Bundesliga analysis: publication edit, 16 October 2026

Denny supplied the completed `analysis/bundesliga/editor_ready/` package and asked for polishing and live publication with correct metadata. This authorises publication of this article. It is Analysis in the existing Articles collection, not a historical report or an automatic History queue item. The original package remains untouched.

## Editorial treatment

Preserved the headline, excerpt, canonical slug, central findings, four figures, their captions/alt text and the 16 October 2026 research cutoff. Tightened repeated wording, clarified that the sample was identified from reported transfers, and replaced broad judgements about players with the attacking rate actually measured. The cross-league comparison now explicitly restricts the arrival period rather than claiming a complete like-for-like comparison. The methods clarify ratios of group means, equal player weights, mid-season arrivals and the absence of a minimum-minutes threshold.

The small selected benchmark cannot establish equivalent leagues or a causal Bundesliga penalty. Expected/actual differences cannot allocate causes. Team scoring includes the player's own goals. Position tags are provider coding, not direct tactical observation. All these limits remain explicit.

## Metadata

- Title: The Bundesliga drop is real. Whether it is German is another matter
- Search title: Bundesliga tax: do expensive signings deliver in England?
- Canonical: `/articles/bundesliga-tax-premier-league-analysis`
- Publication date and research cutoff: 2026-10-16
- Category: Analysis
- Byline: Denny Regan, following the existing site's authorship convention
- Tags: Bundesliga, Premier League, Liverpool, Florian Wirtz
- Existing canonical people: `florian-wirtz`, `roberto-firmino`, `dominik-szoboszlai`
- Existing competition: `premier-league`

This is a multi-season transfer study, so no single season, match date or managerial era is assigned. No Archive-only category, article type or factual approval field is copied into the article. Optional validated `seoTitle`, `tags` and `researchCutoff` fields retain supplied metadata; legacy articles keep their existing title fallback. Article sharing includes the publication date, author and section. The site's existing generated article share image remains in use; no hero image was supplied or invented.

## Evidence and checks

The supporting CSVs and supplied methodology are preserved in `docs/research/bundesliga/`. `bundesliga-tax-publication-checks.json` records this edit's independently recomputed results: 199 positive-minute season goal-contribution rates and all 45 transfer pairs agree with raw goals, assists and minutes. The Bundesliga completed sample has 31 players, 24 declines, means 0.742330 and 0.525833, a 29.1646% fall. Excluding Malen gives 31.5051%; the 12-player benchmark gives 28.1381%. The expected-output subset and matched-period comparison were also recomputed.

Fresh external checks on 16 October:

- **High for provider counts:** [Opta career record](https://theanalyst.com/players/135/florian-wirtz/career) and [current profile](https://theanalyst.com/players/135/florian-wirtz) support Wirtz's 33 appearances, five goals and three assists in 2025/26 and six starts in 2026/27. The article's rates use Understat minutes; provider totals are not mixed.
- **High for dated events and attributed tactical interpretation:** [Premier League analysis, 23 January 2026](https://www.premierleague.com/en/news/4567464/talking-tactics-analysis-on-florian-wirtz-improving-form-at-liverpool) confirms the 16th-appearance assist, subsequent Wolves goal and range of positions. The original package's uncertainty over the page date is resolved.
- **High for appointment:** [Liverpool's 4 June 2026 announcement](https://www.liverpoolfc.com/news/liverpool-fc-appoint-andoni-iraola-new-head-coach) confirms Iraola succeeded Slot.
- **Medium for reported fees:** [Sky's Wirtz report](https://www.skysports.com/football/news/11095/13386015/florian-wirtz-transfer-news-liverpool-sign-bayer-leverkusen-playmaker-for-british-record-fee-of-116-5m) supports £100m plus £16.5m potential add-ons. [Sky's Malen report](https://www.skysports.com/football/news/11095/13288125/donyell-malen-transfer-aston-villa-complete-signing-of-dutch-forward-from-borussia-dortmund) supports a £27.7m potential package; the [BBC report](https://www.bbc.co.uk/sport/football/articles/cn4m2n1zl8jo) gives a lower package. The dispute and exclusion sensitivity remain visible.

This was a publication edit with targeted external checks and arithmetic reproduction, not a fresh independent census of every qualifying transfer or a new causal analysis. Supplied source-register retrieval claims remain supplied research provenance.

## Technical verification

All 248 repository tests passed. Full lint passed with the existing unused-variable warning in `tests/interactive-history-rendering.test.mjs`. The standard production build and its TypeScript check passed. An initial local build needed a real dependency directory rather than an external symlink; the sandboxed attempt then stalled, and the successful build used the required network access. No production configuration or dependency versions changed.

The production preview showed the full article, preserved headline/excerpt, Denny byline, Analysis label, publication date and visible research cutoff. DOM checks confirmed the exact production canonical URL, supplied description/search title/tags and article author/date/section metadata. At 1045px and 390px there was no horizontal page overflow; the 390px view selected the supplied mobile artwork, with 350px chart width and 19px body text. Desktop and mobile screenshots were inspected. The Analysis collection lists the article as its latest entry. All twelve image/data assets returned their exact original bytes, the generated article share image returned 200, and the sitemap includes the canonical article URL. `git diff --check` passed.

The fresh checkout has two unrelated pre-existing case-colliding biography research paths on macOS. They are excluded from the article commit. The supplied project checkout and its uncommitted work are untouched.
