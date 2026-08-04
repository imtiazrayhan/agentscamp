---
description: "Safely reverse the last Git operation in the current repo — pick the right tool (restore, reset --soft/--mixed, revert, or reflog recovery) based on what happened and whether it was already pushed, and confirm before anything destructive."
date: 2026-07-01
argument-hint: "<what to undo — e.g. 'last commit', 'unstage file X', 'the bad merge'; empty to detect>"
allowed-tools: "Read, Bash"
title: "Git Undo"
color: "purple"
topics: ["review-qa"]
related: ["command:resolve-conflict", "command:commit", "command:clean-branches"]
featured: false
summary: "A slash command that undoes the last Git action safely: it inspects the repo state and whether the change was pushed, then picks the right tool — restore to unstage or discard, reset --soft/--mixed to walk back a local commit while keeping the work, revert to reverse a pushed commit without rewriting history, or reflog to recover a lost commit — confirming before anything destructive."
---

Reverse the most recent Git operation without losing work you meant to keep and without rewriting history that others have already pulled. The right "undo" depends entirely on *what* happened and whether it was pushed — so this command diagnoses the state first, then chooses the safe tool.

## Scope

Interpret `$ARGUMENTS` as what to undo:

- **A description** like *"last commit"*, *"unstage config.ts"*, *"discard my changes to app.py"*, *"the merge I just did"*.
- **Empty** — inspect the repo and infer the most likely thing the user wants to undo (a just-made commit, a staged file, an in-progress merge), then confirm before acting.

Never guess destructively. If more than one interpretation is plausible, state them and ask which.

> [!WARNING]
> Some undos permanently discard work: `git reset --hard`, `git restore` (of unstaged changes), and `git clean` delete uncommitted content with no easy recovery. Never run these without an explicit confirmation, and never rewrite history (`reset`, `rebase`, `commit --amend`) on a commit that has already been pushed to a shared branch — use `git revert` instead.

## Step 1 — Diagnose the state

Read the repo state before deciding anything:

```bash
git status
git log --oneline -5
git reflog -8            # the safety net: where HEAD has recently been
```

Determine three things: what the last operation was, whether the affected commit has been **pushed** (`git status` ahead/behind, or `git branch -r --contains <sha>`), and whether there is **uncommitted work** that must be preserved.

## Step 2 — Pick the correct undo

Match the situation to the tool:

- **Unstage a file (keep the edits):** `git restore --staged <path>`.
- **Discard uncommitted changes to a file (destructive):** `git restore <path>` — confirm first; the edits are gone.
- **Undo the last commit, keep changes staged:** `git reset --soft HEAD~1`.
- **Undo the last commit, keep changes in the working tree unstaged:** `git reset --mixed HEAD~1` (the default).
- **Undo the last commit and its changes entirely (destructive, local only):** `git reset --hard HEAD~1` — confirm first.
- **Reverse a commit that was already pushed:** `git revert <sha>` — this adds a new commit that undoes it, preserving shared history. Do **not** reset a pushed commit.
- **Undo a bad merge:** if local and unpushed, `git reset --hard ORIG_HEAD`; if pushed, `git revert -m 1 <merge-sha>`.
- **Recover a "lost" commit or a deleted branch:** find it in `git reflog`, then `git checkout -b recovered <sha>` or `git reset --hard <sha>`.
- **Fix the last commit message or add a forgotten file (unpushed only):** `git commit --amend`.

## Step 3 — Confirm, then execute

State the exact command you intend to run and what it will do — especially whether any uncommitted work will be lost. For anything destructive or history-rewriting, get an explicit "yes" first. If work is at risk and the situation is ambiguous, offer to stash it (`git stash push -m "before undo"`) as a safety net before proceeding.

Run the chosen command.

## Step 4 — Verify

Confirm the repo landed where the user wanted:

```bash
git status
git log --oneline -5
```

Check that intended changes were preserved (still staged/in the working tree) or cleanly reversed, and that no unrelated work was touched.

## Report

Summarize concisely:

- **Diagnosis** — what the last operation was, and whether it had been pushed.
- **Action** — the exact command run and why it was the safe choice.
- **Preserved / discarded** — what work was kept versus intentionally removed.
- **Recovery** — if anything was reset, the `sha` from `reflog` (or the stash ref) that can restore it.
- **Caveats** — anything the user must still do (e.g. force-push implications, notify collaborators).
