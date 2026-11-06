---
description: Fact-check a series draft with an independent agent, apply safe fixes on a new branch and open a pull request
argument-hint: <draft file, e.g. docs/series-drafts/part-3-slug.md>
allowed-tools: Bash(node scripts/factcheck-prep.mjs:*), Bash(git:*), Bash(gh pr create:*), Bash(gh pr view:*), Bash(npm test), Bash(npm run lint), Bash(npm run build), Bash(cp:*), Bash(grep:*), Read, Write, Edit, WebFetch, Agent
---

Fact-check the series draft `$ARGUMENTS`, fix what can safely be fixed, and open a pull request. Do the whole job in one go: do not stop to ask questions unless a step below says to stop.

**Hard rules for the whole run**
- Never merge, deploy, push to `main`, or enable auto-merge. The pull request is how Denny approves.
- Never read or use research notes: no "Editorial research notes" section in the article, no `docs/research/`, no `Editorial Research/`, no `analysis/`.
- Never add a fact from memory or from a search snippet alone. Every fact change needs a page that you opened yourself in this run.
- Commit only the article file and its fact-check report, staged by explicit path. Never `git add -A` or `git add .`.
- Never change `title`, `slug`, `date` or any other frontmatter, and never change the URL.

## Part A: independent check (unchanged)

1. If `$ARGUMENTS` is empty, ask for the draft file name and stop.

2. Note the start time. Run:

   ```
   node scripts/factcheck-prep.mjs $ARGUMENTS
   ```

   It prints JSON with `draft` (the article file), `copy` (stripped copy for the checker), `original` (untouched copy of the draft), `part`, `report` (where the report goes), `branch` (e.g. `series-part-3`) and `removedSections`. If it fails, show the error and stop.

3. Read the file at `copy` with the Read tool. This is the only text that goes to the checker.

4. Launch the `fact-checker` agent with the Agent tool (subagent_type `fact-checker`, a fresh agent, never a fork). If that agent type is not available, stop and say a new Claude Code session is needed. Its prompt is exactly:

   > Fact-check the article below. It is the complete text you will receive. Follow your instructions in full and return only the report.
   >
   > ----- ARTICLE START -----
   > [the full contents of the stripped copy, verbatim]
   > ----- ARTICLE END -----

   Add nothing else: no background, no hints, no sources, nothing from this conversation.

## Part B: branch

5. Run `git fetch origin main`. Create the branch from `origin/main`: `git switch -c <branch> origin/main`. If a branch with that name already exists locally or on origin, use `<branch>-2`, `-3` and so on. If the switch fails (for example, uncommitted changes would be overwritten), stop and say why.

6. If the file at `draft` is missing on the new branch, or differs from `original`, copy `original` back to `draft` with `cp`. Now the branch has the draft exactly as it was checked.

7. Write the report to `report` (read it first if it exists, then overwrite):

   ```
   # Fact-check: part N, [title from the frontmatter]

   Draft: [draft path relative to the repository]
   Checked: [date and time, Europe/London]
   Research-notes sections removed before checking: [removedSections]
   Checker: independent fact-checker agent, web sources only, no access to research notes

   [the agent's report, verbatim]
   ```

## Part C: apply fixes (a second fresh agent)

The fixes are made by a second fresh agent, not by this session, so that nothing this session has seen (a pasted research pack, earlier conversation) can leak into the article. Do not edit the article yourself.

8. Launch a fresh agent with the Agent tool (subagent_type `general-purpose`, never a fork). Its prompt is the block below, with the three paths filled in and nothing else added: no background, no sources, no opinion about the claims.

   > You are applying fact-check fixes to one article. You did not write it and you did not check it.
   >
   > Article: [draft, absolute path]
   > Fact-check report: [report, absolute path]
   > Branch: [branch]
   >
   > **Tools.** Read only those two files. Use Edit only on the article, and on the report only to append your change log. Use WebFetch only to open URLs cited in the report. Do not search the web, do not read any other file, and do not run shell commands.
   >
   > **Research notes.** If the article contains an "Editorial research notes" section, use Grep to find its line number and Read only the lines before it. Never read, use or edit that section.
   >
   > **Never** add a fact from memory or from a search snippet. **Never** change `title`, `slug`, `date` or other frontmatter, the headline, or anything the report does not name. Keep the article's voice, British spelling and sentence case. Make each edit as small as possible. No style edits.
   >
   > **What to fix.** Every WRONG, SOURCES CONFLICT and UNVERIFIED row, every item under "Cut or attribute more carefully" and every item under "Reads as hindsight". Leave CORRECT rows alone.
   >
   > | Finding | What to do |
   > |---|---|
   > | WRONG | Correct the fact **only if** the row's source is not marked snippet-only **and** you open that URL with WebFetch **and** the page clearly states the right answer. Use the report's corrected wording if it matches the page. Otherwise remove the wrong detail or cut the claim. |
   > | SOURCES CONFLICT | Do not pick a side. Attribute both ("X reported…; Y said…") or reduce the sentence to what all sources agree on. |
   > | UNVERIFIED | Cut it, or hedge it down to what the report does support. "Reportedly" only when the report shows someone reported it. An unverified quotation loses its quotation marks: paraphrase with attribution if the report found the substance, otherwise cut. |
   > | Private motives or thinking | Attribute to the source the report names ("according to…", "X later said…"), rewrite as what people did and said, or cut. |
   > | Hindsight | Make clear it is later knowledge ("Later accounts…", "In hindsight…"), or cut. Never leave it as if known at the time. |
   > | Heysel or Hillsborough | Do not edit those passages. List them under decisions. |
   >
   > After each cut, reread that paragraph and its neighbours. If a cut leaves a dangling reference ("both", "this", "that sentence"), make the smallest repair and list it under decisions.
   >
   > **When done**, append to the report:
   >
   > ```
   > ## Changes applied on branch [branch]
   >
   > | Row | Para | Before | After | Reason |
   > |---|---|---|---|---|
   >
   > ## Left for Denny
   > - [anything you could not settle under these rules, every connective repair, any Heysel or Hillsborough mention; or "Nothing."]
   > ```
   >
   > Then reply with three short lists: **Changed** (one line each: what and why, with row number), **Could not confirm** (one line each: the claim and how you handled it) and **Needs Denny's decision**.

9. When it returns, run `git status --short`. Apart from files that were already untracked before the run, only the article and the report may be new or changed. If anything else changed, stop and tell the user.

## Part D: verify, commit, pull request

10. Run `npm test`, `npm run lint` and `npm run build`. If any of them fails, **stop**. Do not commit or push. Tell the user which command failed and the relevant error lines, and that the branch has the uncommitted fixes.

11. Stage the article and the report by explicit path, and commit:

    ```
    Part N fact-check fixes: [title]

    Independent fact-check, with fixes applied under the /factcheck rules.
    Report: [report path]

    Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
    ```

    Push with `git push -u origin <branch>`.

12. Open a ready-for-review pull request (never `--draft`) with `gh pr create --base main`. Title: `Part N fact-check: [title]`. Keep the body short, in three parts:

    ```
    ## Changed
    - [one line per change: what changed and why (row #)]

    ## Could not confirm
    - [one line per claim: what it was and how it was handled (cut, hedged, attributed)]

    ## Needs your decision
    - [Heysel/Hillsborough mentions, connective repairs, anything left alone, or "Nothing."]

    Full report: [report path]. Not merged, not deployed.

    🤖 Generated with [Claude Code](https://claude.com/claude-code)
    ```

13. Tell the user: the pull request URL (on its own line as `<pr-created>URL</pr-created>`), how long the run took, the verdict counts, the number of changes applied, and the "Needs your decision" list. Say that nothing was merged or deployed.
