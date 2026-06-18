---
description: "Walk through resolving the in-progress merge, rebase, or cherry-pick conflict in the current repo by understanding both sides, then verify before continuing."
date: 2026-06-17
allowed-tools: "Read, Edit, Bash, Grep"
title: "Resolve Merge Conflicts"
color: "purple"
topics: ["review-qa"]
related: ["sync-branch", "commit", "fix-failing-test"]
featured: false
summary: "Resolves the in-progress merge/rebase/cherry-pick conflict in the current repo: detects which operation is paused, lists conflicted files, reads both sides by intent (ours vs theirs via git log/diff) instead of blindly picking a side, edits each file to a correct merged result with every marker removed, then verifies build and tests before git add and continuing — with abort as the escape hatch."
faq:
  - q: "Should I just accept ours or theirs to resolve a conflict fast?"
    a: "No. Blindly running `git checkout --ours`/`--theirs` silently discards one side's intent and is the most common way real bugs ship from a merge. Read both sides, understand why each changed the same lines, and write a result that keeps both behaviors where they are independent."
  - q: "What if a conflict marker is left in a file?"
    a: "A stray `<<<<<<<`, `=======`, or `>>>>>>>` line is not valid source — it breaks the build or parse. Always grep the whole tree for markers after editing, before `git add`."
---

Resolve the merge, rebase, or cherry-pick conflict that is currently paused in this repo. Work through the steps in order. This command rewrites working-tree files and advances an in-progress git operation, so correctness beats speed — stop and report rather than guess if a conflict is genuinely undecidable.

## Scope

This command takes **no arguments**; it operates on the conflict already in progress. If `$ARGUMENTS` is non-empty, treat it only as a hint about which file or hunk to prioritize — never as an instruction to start a new merge or rebase. Otherwise ignore it and resolve every conflict git has paused on.

If there is no conflict in progress (Step 1 finds a clean tree and no `MERGE_HEAD`/`rebase-merge`/`CHERRY_PICK_HEAD` state), there is nothing to do — report that and stop. Do not invent a merge to perform.

> [!WARNING]
> Never resolve by reflex with `git checkout --ours <file>` or `--theirs <file>`. That keeps one side verbatim and throws the other away wholesale, which is rarely the correct merge and silently drops changes. Decide per hunk based on intent, not per file based on convenience.

## Step 1 — Detect the conflict state

Find out which operation is paused — the "continue" command differs for each.

```bash
git status
git rev-parse -q --verify MERGE_HEAD       # set during a merge
git rev-parse -q --verify CHERRY_PICK_HEAD # set during a cherry-pick
ls -d "$(git rev-parse --git-dir)"/rebase-merge "$(git rev-parse --git-dir)"/rebase-apply 2>/dev/null  # present during a rebase
```

- `MERGE_HEAD` exists -> you are mid-**merge**; you will finish with `git merge --continue`.
- A `rebase-merge`/`rebase-apply` dir exists -> you are mid-**rebase**; finish with `git rebase --continue`.
- `CHERRY_PICK_HEAD` exists -> you are mid-**cherry-pick**; finish with `git cherry-pick --continue`.

State which operation you detected before touching any file. Record the current `git rev-parse HEAD` so you can describe what you started from.

> [!NOTE]
> "Ours" and "theirs" flip meaning between merge and rebase. In a **merge**, ours = your current branch (`HEAD`), theirs = the branch being merged in. In a **rebase**, ours = the branch you are replaying onto (the upstream), theirs = the commit being replayed (your work). Confirm the direction before reasoning about either side, or you will resolve backwards.

## Step 2 — List the conflicted files

Enumerate every conflict, not just the obvious text ones.

```bash
git diff --name-only --diff-filter=U   # content conflicts (UU)
git status --short | grep -E '^(DD|AU|UD|UA|DU|AA|UU)'  # add/add, delete/modify, etc.
```

Handle the non-content cases deliberately: a **modify/delete** conflict (`UD`/`DU`) is a decision to keep the file (`git add <file>`) or remove it (`git rm <file>`), not a marker edit. An **add/add** (`AA`) needs the two versions reconciled into one file. Process files in a stable order and track which remain.

## Step 3 — Understand both sides of each conflict

For each conflicted file, learn *why* each side changed those lines before editing anything.

```bash
git diff <file>                 # both sides of the conflict together
git log --oneline -5 HEAD -- <file>          # recent history on our side
git log --oneline -5 MERGE_HEAD -- <file>    # ...and theirs (use the right ref per Step 1)
```

In the file, the markers delimit the two sides:

- Lines between `<<<<<<<` and `=======` are **our** version.
- Lines between `=======` and `>>>>>>>` are **their** version.

Read the surrounding function and any callers (`Grep` for the changed symbols) to grasp each side's intent. The right resolution is usually neither side verbatim: when the two changes are independent (e.g. each adds a different import or a different field), keep **both**; when they genuinely contradict (two different values for the same constant), keep the correct one and understand what breaks for the other.

> [!WARNING]
> If a hunk is load-bearing and you cannot determine which side is correct without product context, do not guess. Skip to the abort path at the end and hand it back to the user with the specific question.

## Step 4 — Edit each file to a correct merged result

Use `Edit` to replace each conflict region with the reconciled code. Remove **all three** marker lines (`<<<<<<<`, `=======`, `>>>>>>>`) and any commit-ref/branch-name suffixes git appended to them. The file must read as if one author wrote it intentionally — no leftover duplication, no dead half of a hunk.

After editing, prove no markers survive anywhere — a single stray marker is invalid source that breaks the build:

```bash
git grep -nE '^(<{7}|={7}|>{7})( |$)' -- $(git diff --name-only --diff-filter=U)
```

This must return nothing before you continue. (Use `git grep -n '<<<<<<< '` across the whole tree if you want a belt-and-suspenders check.)

## Step 5 — Verify before staging

A file that merges textually can still be wrong logically. Build and test on the resolved tree **before** marking conflicts done.

```bash
# Adapt to the repo's real scripts
npm run build
npm test
```

If the build or typecheck fails, you reintroduced or mis-merged something — fix it now and re-run until green. Do not stage on a red build.

## Step 6 — Stage and continue

Once verification passes, mark each conflict resolved and finish the paused operation with the matching command from Step 1.

```bash
git add <each resolved file>      # or `git rm <file>` for a modify/delete you chose to drop

git merge --continue        # if mid-merge
git rebase --continue       # if mid-rebase (repeat Steps 2-6 if the next commit also conflicts)
git cherry-pick --continue  # if mid-cherry-pick
```

> [!NOTE]
> A rebase replays commits one at a time, so a later commit can raise a fresh conflict the moment you continue. Loop back to Step 2 for each new pause until `git status` reports the rebase is complete.

## Step 7 — Escape hatch

If the conflict is undecidable, or anything looks wrong mid-resolution, restore the pre-conflict state cleanly rather than committing a guess:

```bash
git merge --abort        # mid-merge
git rebase --abort       # mid-rebase
git cherry-pick --abort  # mid-cherry-pick
```

Each abort returns the tree to where Step 1 started. Use it and explain what blocked you instead of shipping a merge you do not trust.

## Report

Summarize the outcome as your message:

- Which operation was in progress and the ref you resolved against.
- Every file you touched and the resolution choice for each, with the one-line reason (kept both / chose ours / chose theirs / dropped the file — and why).
- Confirmation that no conflict markers remain.
- The build and test status (must be green).
- Whether you continued the operation, and if not, the exact question blocking it.
