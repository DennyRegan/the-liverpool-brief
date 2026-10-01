# Repository and metadata validation

Reference repository: DennyRegan/the-liverpool-brief, main `19e574009339fde92bb6863fd5e6f65789ffe9a1`.

- Baseline repository: all 169 tests passed before inserting this batch.
- Actual `ArchiveFeatureSchema`: all 62 draft records passed with a test publication date injected in memory. Saved articles remain undated.
- Canonical registry checks: IDs, entity kinds, season boundaries, historical dates, decades, filenames, unique slugs and managerial-era placement passed.
- Duplicate check: no new article duplicates a published match date or canonical filename in the inspected main repository.
- Full historical validation: passed with all 62 articles inserted into an isolated local copy. It loaded 291 Archive articles and retained zero published interactive experiences.
- Production build: passed with the complete batch, generating 540 pages. No deployment occurred.
- Existing unmodified tests with the enlarged catalogue: 166 passed and three failed because they assumed the previous catalogue/recommendation set. These were test assumptions, not malformed article records.
- Included test-only compatibility patch: all 169 tests passed. It is saved for the future uploading agent; nothing was committed or pushed.
- Lint: no errors; one pre-existing unused-import warning in `tests/interactive-history-rendering.test.mjs`.

The first build attempt failed because the temporary dependency directory was symlinked outside the build root. Replacing that temporary symlink with a local dependency copy resolved it without application changes.

These checks validate structure and site integration. Historical source assessment is documented separately by the Astra researchers and independent editorial reviewer. A successful check does not constitute Denny's publication approval.
