# Next ten biography production — selection record

Selected after checking current main, biography migration, match migration and disabled publisher branches, plus candidate paths across all fetched branches. Existing set: 30 completed unpublished biographies, Phil Thompson published, three NOT LOCATED. Candidate Shankly and Klopp event articles are not career manuscripts. All ten canonical person IDs already exist.

This is a selection/evidence note, not a second status inventory. Current status remains in history-calendar.json. New production, not recovered originals. No publication, schedule or approval.

| Subject | Inclusion reason | Astra worker |
| --- | --- | --- |
| Bill Shankly | The manager whose rebuilding established the foundations of modern Liverpool. | /root/shankly_hunt |
| Roger Hunt | A central scorer in the return to the First Division and the first Shankly honours. | /root/shankly_hunt |
| Jürgen Klopp | The manager who restored European and league success across a defining modern era. | /root/klopp_fagan |
| Joe Fagan | Boot Room continuity, the 1984 treble and a managerial career requiring careful Heysel context. | /root/klopp_fagan |
| Billy Liddell | A major pre-Shankly figure whose career connects post-war success with the Second Division years. | /root/liddell_stjohn |
| Ian St John | A transformative signing and central forward in the first Shankly team. | /root/liddell_stjohn |
| Ron Yeats | The captain and defensive foundation of Liverpool’s rise under Shankly. | /root/yeats_hughes |
| Emlyn Hughes | A major captain linking Shankly’s rebuilding to Paisley’s European champions. | /root/yeats_hughes |
| Tommy Smith | A long-serving defender whose career spans Liverpool’s transformation and first European Cup. | /root/smith_souness |
| Graeme Souness | A central midfielder and captain of the dominant European side, with a contrasting managerial return. | /root/smith_souness |

## First manuscript checkpoint

Completed: Bill Shankly, Billy Liddell, Joe Fagan, Ron Yeats and Tommy Smith. Each has a separate retrieved-source record and post-draft factual audit. Remaining subjects retain writing claims; no partial manuscript is labelled complete. All five are ready_for_review with null approval, null published destination and no publication date. The calendar and derived queue remain authoritative.

Technical checks at this checkpoint: calendar validation passed; full suite 200/200 passed; lint zero errors with the existing unused-variable warning in tests/interactive-history-rendering.test.mjs. Focused new-production queue test also passed. Production build and HTTP checks follow after the complete batch. Independent source spot-checking is ongoing and will be recorded separately.

Concurrency: latest main remains 1a76b302; both match production branches were fetched and their biography sets inspected. Neither introduces any of these ten subjects. Their ongoing match work remains on its own branches; this branch does not overwrite those refs. Direct Git push has no credentials in this environment, so checkpoint commits use the authenticated GitHub Git-data API, with non-forced ref updates and fetched tree verification.
