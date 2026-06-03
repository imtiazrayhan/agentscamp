---
description: "Fetch and rebase the current branch onto its base, resolving conflicts and verifying the build."
date: 2026-06-03
argument-hint: "[base branch]"
allowed-tools: "Bash, Read, Edit"
title: "Sync Branch"
color: "purple"
topics: ["workflow-prompting"]
related: ["commit", "branch-rebaser"]
featured: false
---

Bring the current feature branch up to date by rebasing it onto its base. Follow the steps below in order. Stop and report rather than improvise if anything is ambiguous — a rebase rewrites history, so correctness matters more than speed.

## Scope

If `$ARGUMENTS` is provided, treat it as the name of the base branch to rebase onto — supply a bare branch name without a remote prefix (for example `main`, `develop`, or `release-2.0`). If `$ARGUMENTS` is empty, auto-detect the base: prefer the remote's default branch, falling back to `main`, then `master`. Never assume the base — confirm which one you resolved before rebasing.

## Step 1 — Confirm a clean working tree

A rebase must start from a clean tree. Check first.

```bash
git status --short
git rev-parse --abbrev-ref HEAD
```

- If `git status --short` prints nothing, the tree is clean — continue.
- If there are uncommitted changes, do **not** proceed silently. Either commit them first (use the `commit` workflow) or stash them, and tell the user which you did:

```bash
git stash push -u -m "sync-branch: pre-rebase stash"
```

> [!WARNING]
> If you stash, you must `git stash pop` after the rebase completes (Step 5). Leaving work stashed is a silent way to lose changes. If popping the stash itself conflicts, stop and hand it back to the user.

> [!NOTE]
> Confirm you are not on the base branch itself. Rebasing `main` onto `main` is a no-op at best; if `HEAD` equals the resolved base, stop and report — there is nothing to sync.

## Step 2 — Fetch the latest base

Update remote refs so you rebase onto current upstream, not a stale local copy.

```bash
git fetch --all --prune
```

Now resolve the base branch and record where you started, so you can recover if anything goes wrong.

```bash
# The remote's default branch, used when $ARGUMENTS is empty
git remote show origin | sed -n 's/.*HEAD branch: //p'

# Where HEAD is right now — note this hash for recovery
git rev-parse HEAD
```

Pick the base in this priority order: `$ARGUMENTS` → remote default branch → `main` → `master`. State the chosen base explicitly before continuing.

## Step 3 — Rebase onto the base

Rebase the current branch onto the **remote-tracking** ref so you incorporate the freshly fetched commits.

```bash
# Replace <base> with the branch resolved in Step 2
git rebase origin/<base>
```

> [!NOTE]
> Normalize the ref before substituting. If the resolved base already begins with a remote name such as `origin/`, use it verbatim; otherwise prefix `origin/`. This avoids producing an invalid ref like `origin/origin/<base>`.

If the rebase applies cleanly, skip to Step 4. If it stops on a conflict, move to conflict resolution below.

### Resolving conflicts

For each conflicted file, understand **both** sides before editing — do not blindly accept one.

```bash
# See which files are conflicted (covers all conflict types: UU, AA, DD, AU, etc.)
git diff --name-only --diff-filter=U

# Inspect a specific conflict, both sides at once
git diff <file>
```

- `<<<<<<< HEAD` is the version from the base you are rebasing onto.
- `>>>>>>> <commit>` is the change from the commit currently being replayed.

Read the surrounding code to grasp intent on each side, then write a resolution that preserves *both* behaviors where they are independent, or the correct one where they genuinely conflict. After editing a file to a coherent state:

```bash
git add <file>
git rebase --continue
```

Repeat until the rebase finishes. If a conflict is genuinely undecidable without product context, abort cleanly and hand it back rather than guessing:

```bash
git rebase --abort   # restores the pre-rebase state from Step 2
```

> [!WARNING]
> Never resolve a conflict by deleting code you do not understand. If a hunk looks load-bearing and you cannot determine which side is correct, stop and ask the user.

## Step 4 — Verify the build and tests

A rebase can produce code that merges textually but breaks logically. Prove the branch still works.

```bash
# Adapt to the repo's actual scripts
npm run build
npm test
```

If the build or tests fail, the failure was introduced by the rebase — investigate and fix it now, then re-run until green. Do not report success on a red build.

## Step 5 — Restore and report

If you stashed in Step 1, restore that work now:

```bash
git stash pop
```

Then summarize the outcome:

- The base branch you rebased onto and how many commits it pulled in.
- How many of your commits were replayed.
- Every conflict you resolved and the reasoning for each resolution.
- The build/test status (must be green).
- Whether a stash was used and successfully popped.

> [!WARNING]
> Rebasing rewrites commit hashes, so the local branch and its remote now disagree. Do **not** force-push a shared branch without the user's explicit confirmation. When they confirm, prefer the safe form:
>
> ```bash
> git push --force-with-lease
> ```
>
> `--force-with-lease` refuses to overwrite work someone else pushed while you were rebasing; a bare `--force` does not. Never push at all unless the user asks.

> [!NOTE]
> If the completed rebase turns out wrong (it finished, but the result is semantically broken), recover with `git reset --hard <the HEAD hash recorded in Step 2>`. This is distinct from `git rebase --abort`, which only works while a rebase is still in progress.
