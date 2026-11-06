---
description: Fact-check a series draft with an independent agent that never sees the research notes
argument-hint: <draft file, e.g. docs/series-drafts/part-2-the-arrival.md>
allowed-tools: Bash(node scripts/factcheck-prep.mjs:*), Read, Write, Agent
---

Fact-check the series draft `$ARGUMENTS`. Follow these steps exactly.

**Hard rules.** Never edit, move or rename the original draft. Never run `git add`, `git commit` or `git push`. Do not read any research notes, `docs/research/`, `Editorial Research/` or the original draft yourself: you only handle the stripped copy.

1. If `$ARGUMENTS` is empty, ask for the draft file name and stop.

2. Run:

   ```
   node scripts/factcheck-prep.mjs $ARGUMENTS
   ```

   It prints JSON with `copy` (stripped temporary copy, outside the repository), `part`, `report` (where the result goes) and `removedSections`. If it fails, show the error and stop. Note the time you started.

3. Read the file at `copy` with the Read tool. This is the only text that goes to the checker.

4. Launch the `fact-checker` agent with the Agent tool (subagent_type `fact-checker`, a fresh agent, never a fork). Its prompt is exactly:

   > Fact-check the article below. It is the complete text you will receive. Follow your instructions in full and return only the report.
   >
   > ----- ARTICLE START -----
   > [the full contents of the stripped copy, verbatim]
   > ----- ARTICLE END -----

   Add nothing else to the prompt: no background, no hints about what may be wrong, no sources, nothing from this conversation.

5. When the agent returns, write `report` with the Write tool. If that file already exists, read it first, then overwrite it. The file is:

   ```
   # Fact-check: part N, [title from the frontmatter]

   Draft: [draft path relative to the repository]
   Checked: [date and time, Europe/London]
   Research-notes sections removed before checking: [removedSections]
   Checker: independent fact-checker agent, web sources only, no access to research notes

   [the agent's report, verbatim]
   ```

6. Tell the user: where the report is saved, how long the check took, the verdict counts, and every WRONG and SOURCES CONFLICT row. Remind them that nothing was committed and the draft was not changed.
