# History infrastructure — final release review

Prepared 29 October 2026. **Ready for release approval; not released.** No commit, push, PR creation, merge, deployment, article restoration or publication was performed.

## Exact scope and previews

- [Public-mode release candidate](http://127.0.0.1:3148/history): clean source export with the entire local editorial pack absent.
- [Editorial preview](http://127.0.0.1:3147/history): the preserved 1987–88 experience and all 560 reports, with approval labels.
- [Public Classic Matches](http://127.0.0.1:3148/history/matches) and [editorial Classic Matches](http://127.0.0.1:3147/history/matches).

History includes Seasons, Classic Matches, People, Series, On This Day, Explore History, connected canonical article navigation and historical search. Seasons presents developed experiences separately from report-only years. Classic Matches retains compact filters, a single eligible featured article, twelve-item chronological pages and the complete local inventory. The 1987–88 experience, twelve-report list and original optional atlas remain intact locally.

## What will be public

| Destination | Content in this release |
| --- | --- |
| History / Classic Matches | Two existing approved factual reports: Forest 5–0, 13 April 1988; Dalglish at Goodison, 21 September 1985 |
| Featured matches | Forest 5–0 only, backed by existing identity/date/result verification and publication approval |
| Seasons | Honest experience-development message; approved report-only reading pages for 1985–86 and 1987–88 |
| People | Six existing connected-person destinations; no invented biographies |
| Series | Klopp’s Liverpool as a labelled plan: 21 planned, zero published chapters |
| On This Day | The existing verified Forest event on 13 April; honest empty states otherwise |
| Explore / Search | Approved article/entity connections and existing published content only |
| Existing site | All 31 approved article routes remain available, including Opinion and other existing writing |

**The full 1987–88 interactive experience is not part of public content approval.** Its preserved reference, map and withdrawn reports remain local. Publishing that experience or any of the 558 unapproved manuscripts needs a separate editorial decision. No article dates, prose, IDs or canonical URLs were changed. Homepage body, newsletter configuration and sending code are unchanged; the already-reviewed shared navigation includes History.

## Final review findings and fixes

All seven History destinations were inspected at desktop 1280px and mobile 390px in both modes: 28 views. No horizontal overflow or genuine visual defect was found. Typography, spacing, category navigation, distinct season/match roles and the compact filtering presentation were retained. Public search and date selection were exercised in the browser; the earlier final filter/map keyboard checks remain applicable because their code was not changed in this review. This is a focused visual/accessibility review, not a formal WCAG certification.

One deployment defect was corrected: dynamic filesystem loaders did not put approved content into serverless output traces. Explicit, narrow approved-content include patterns now package those files. Editorial folders are explicitly excluded. No redesign or new reader feature was introduced.

GitHub confirmed the repository is public. The proposed patch/source export therefore omits the complete `prototype/` editorial pack and keeps it Git-ignored. No private manuscript is required for a normal build. The local original pack remains available in the editorial workspace. This controls the proposed release; it does not purport to remove historical files already preserved in earlier Git history.

## Verification

| Check | Result |
| --- | --- |
| Full editorial checkout tests | 55 passed, zero failed, zero skipped |
| Clean source tests with no editorial pack | 43 passed, zero failed; 12 explicitly skipped local-pack integration checks |
| Lint | Passed in original and clean source export |
| History, prototype and 560-report validation | Passed in editorial checkout |
| Clean public History validation | Passed without prototype files |
| Normal production build | Passed |
| Local editorial production build | Passed |
| Independent clean source production build | Passed; existing Google Fonts downloads required network access |
| Editorial HTTP collection / History checks | 761 / 143 passed |
| Clean public HTTP collection / History checks | 575 / 38 passed |
| Existing approved articles | All 31 return 200 with unchanged canonical URLs |
| Unapproved readers | All 558 return 404 in clean public mode |
| Raw/private preview paths | 404 in clean public mode |
| Generated output | 38 deployment traces checked; approved runtime data present, private files absent |
| Private-text artifact scan | 648 emitted/public files checked against narrative sentinels for all 558 unapproved reports; no matches |
| Patch applicability | Applies cleanly to current main content |

Public search, sitemap, homepage, article feed, anniversary and newsletter discovery exclusions passed. Local flag + loopback-host checks remain, and hosting/CI environments reject the preview flag. The clean export has no private source pack at all. The existing Node module-type warning is non-blocking. Local Node was v26.5.0; the inspected Vercel project is configured for Node 24.x. No hosted deployment has been run, so the actual hosted build and post-release smoke checks remain part of the approved release procedure.

## Proposed pull request and release

- Repository: `DennyRegan/the-liverpool-brief`.
- Verified base: `main`, `e03e9cbaad34860ac77152d95dcd16230b2aa143`.
- Proposed branch (not created): `feat/connected-history-release`.
- Proposed title: **Add connected History infrastructure with approved-content boundaries**.
- Existing Vercel project: `the-liverpool-brief`, `prj_qvnDRxxbPRTexjpwQKurvcFjCQkl`, team `team_pTgiaZ9DerjBng68lwAkEAZH`; framework Next.js, Node 24.x. No project settings changed.
- `history-infrastructure.patch` contains only the implementation and documentation changes. The already-published Bradley article is present in the full source export but excluded from the patch; its blob matches current main (`9f0ef7258b11dc0c760408333f2d102ccd843fda`).
- The source archive and SHA-256 file manifest define the prepared release. Do not commit the build, node_modules, local artifacts or editorial pack.
- After explicit approval, recheck main for movement, apply the reviewed patch on the proposed branch, run the public checks, and open the infrastructure PR. No force push or merge is proposed without approval. A branch push may trigger Vercel's Git integration, so no remote branch was created during preparation.
- Use the ordinary production build (`npm run build`), never `prototype:build`; do not set the local prototype flag on hosting. Production builds must pass the output-safety check. Review the hosted build and approved routes before assigning production traffic. Keep the existing newsletter/environment settings unchanged.
- Roll back an approved release to the previously recorded production deployment if necessary; no database migration or content restoration is involved. Record that deployment ID at release time.

## Outstanding decisions

No known technical blocker remains in the locally tested candidate. The remaining decisions are approval of this infrastructure release and later, separate approval of historical content. Remote PR/CI and hosted deployment checks have intentionally not run because nothing was pushed or deployed. The public site will be sparse until further writing is approved; it will not silently substitute the local preview collection.

## Evidence

The companion folder contains the exact patch, source archive/manifest, proposed PR body, tests/build/HTTP logs, artifact-safety results, visual checks and desktop/mobile screenshots for every destination: `output/history-release-review-2026-10-29/` in the parent project workspace. The public and editorial servers are left running for review.
