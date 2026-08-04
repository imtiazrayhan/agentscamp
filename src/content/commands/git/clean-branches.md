---
description: "Safely prune merged and stale Git branches: drop dead remote-tracking refs, list merged candidates for review, then delete with the safe -d variant."
date: 2026-06-17
allowed-tools: "Bash, Read"
title: "Clean Branches"
color: "purple"
topics: ["review-qa"]
related: ["command:sync-branch", "command:commit", "command:git-bisect", "command:resolve-conflict"]
featured: false
summary: "A slash command that prunes Git branches without losing work: it prunes dead remote-tracking refs, identifies local branches already merged into the main branch (excluding current, main/master/develop, and protected branches), surfaces unmerged branches for manual review, shows the full deletion plan, then deletes only with the safe git branch -d — never blind -D."
---

This command takes no arguments. It prunes branches that are demonstrably safe to remove and hands everything else back for a human decision. The default posture is to delete nothing you cannot prove is merged.

## Scope

Ignore `$ARGUMENTS` — this command takes no input. Operate on the current repository only.

> [!WARNING]
> Deleting a branch can destroy unmerged commits. Only `git branch -d` (lowercase) is allowed here; it refuses to delete a branch with commits not reachable from its upstream or HEAD. Never run `git branch -D` (force) in this command. If `-d` refuses a branch, that refusal is correct — surface it, do not override it.

## Step 1 — Establish where you are and what is protected

You must know the current branch and the main branch before deciding anything.

```bash
# Current branch — NEVER a deletion candidate
git rev-parse --abbrev-ref HEAD

# The repo's default/main branch (used as the merge target)
git remote show origin 2>/dev/null | sed -n 's/.*HEAD branch: //p'

# Fall back to whichever exists locally if there is no remote
git branch --list main master develop
```

Resolve the main branch in this priority order: the remote's `HEAD branch` → `main` → `master`. Build the protected set as: the **current** branch, `main`, `master`, `develop`, plus any release/long-lived branches you can see (`release/*`, `hotfix/*`, anything the user names in `CLAUDE.md` or branch protection). A branch in the protected set is never deleted, even if merged.

## Step 2 — Prune dead remote-tracking refs

Drop the local `origin/*` refs whose upstream branch was deleted on the remote. This touches **only** remote-tracking refs, never your local branches or anything on the server.

```bash
git fetch --prune
```

Report which `origin/*` refs were pruned (the command prints `[deleted]` lines). This is the safest step and never destroys local work.

> [!NOTE]
> `--prune` only removes refs that point at the configured remote. It does not delete any local branch, and it does not push deletions to the remote. If a teammate re-pushes a branch, the ref simply comes back on the next fetch.

## Step 3 — Identify merged candidates (safe to delete)

List local branches whose tip is already reachable from the resolved main branch — these contain no unique commits relative to main.

```bash
# Replace <main> with the branch resolved in Step 1
git branch --merged <main> --format='%(refname:short)'
```

From that output, build the **candidate list** by removing every protected branch from Step 1 (current, main/master/develop, release branches). For each remaining candidate, show what removing it discards so the user can sanity-check before anything is deleted:

```bash
# For each candidate <b>: confirm it has no commits ahead of <main> (should print nothing)
git log --oneline <main>..<b>

# Last commit on the branch, for context
git log -1 --format='%h %ci %s' <b>
```

Present the candidate list as a table: branch name, last commit date, last commit subject. Do not delete yet.

> [!WARNING]
> "Merged" is measured against the branch you check, and only via the default fast-forward reachability test. A branch that was **squash-merged** or **rebase-merged** (e.g. via a squashing PR merge) will NOT appear in `git branch --merged` even though its work shipped — its commits were rewritten, so reachability cannot see them. If a branch you know was squash-merged is missing from the candidate list, that is expected, not a bug: confirm its work landed on `<main>` by content (diff or PR), then treat it as the user's manual call in Step 5 — never auto-delete it just because you believe it merged.

## Step 4 — Surface unmerged branches (never auto-delete)

List local branches that are NOT merged into main. These may hold real, un-shipped work.

```bash
git branch --no-merged <main> --format='%(refname:short)'
```

For each, show how far ahead it is so the user can judge whether it is abandoned or live:

```bash
# Commits on <b> not yet in <main>
git log --oneline <main>..<b>
```

Report these separately as **"left for manual review."** Do not delete any of them, do not suggest `-D` to clear them, and flag any whose last commit is recent or whose author is not the current user — those are most likely someone else's active work.

> [!WARNING]
> Never delete a branch someone else may still be using, even if it looks merged locally. A remote-tracking branch can lag; another contributor may have unpushed commits on a branch of the same name. When in doubt, leave it for review.

## Step 5 — Delete merged candidates with the safe variant

Only now, and only for the Step 3 candidate list, delete using the safe lowercase `-d`:

```bash
# Run per branch from the candidate list — <main> already excluded
git branch -d <candidate>
```

If `-d` refuses a branch ("not fully merged"), stop on that branch: it has commits not reachable from main or its upstream. Do not escalate to `-D`. Move it into the manual-review bucket from Step 4 and explain why it was refused.

> [!NOTE]
> A `-d` deletion is recoverable for a while: the commit stays in the reflog (`git reflog`) and is reachable by hash until garbage collection runs. A `-D` force-delete of unmerged work has no such safety net once the reflog entry expires — another reason this command refuses it.

## Report

Deliver a summary as your message:

- The main branch you resolved and the full protected set you excluded.
- Remote-tracking refs pruned in Step 2.
- Each merged branch deleted in Step 5 (name + last commit).
- Each unmerged branch left for manual review, with how many commits it is ahead and whether it looks like someone else's active work.
- Any branch `-d` refused, and why.

End with the single recommended next action — typically: review the unmerged list and decide explicitly which, if any, to drop.