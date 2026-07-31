---
description: "Drive git bisect to find the exact commit that introduced a regression."
seoDescription: "/git-bisect drives git bisect to find the exact commit that introduced a regression, testing and marking each step — a Claude Code slash command."
date: 2026-06-17
argument-hint: "<bug description; optional good and bad refs>"
allowed-tools: "Bash, Read"
title: "Git Bisect"
color: "purple"
topics: ["review-qa"]
related: ["find-bug", "fix-failing-test", "explain-error"]
featured: false
summary: "A slash command that pins the first bad commit with git bisect: it nails down a fast, deterministic reproduction, sets a known-bad ref (usually HEAD) and a known-good ref, then drives the search — preferably automated via git bisect run with a 0/non-0/125 exit contract — inspects the offending diff to explain the cause, and always runs git bisect reset to restore the tree."
---

Find the commit that introduced the regression described in `$ARGUMENTS` using `git bisect`. The binary search is only as trustworthy as the test you feed it, so the first job is a rock-solid reproduction — not running `git bisect start`.

## Scope

Parse `$ARGUMENTS` into three parts:

- **Bug description** — the observable regression (a failing test, a wrong output, a crash). Required.
- **Bad ref** — a commit where the bug is present. Defaults to `HEAD`.
- **Good ref** — a commit where the bug is absent (e.g. the last release tag `v2.3.0`, or `HEAD~200`). If not given, you will hunt for one in Step 3.

If `$ARGUMENTS` is empty, ask one question and stop: *"What is the regression, and do you know a commit/tag where it still worked?"* Do not invent a bug or guess refs — a wrong good/bad boundary makes bisect confidently point at the wrong commit.

> [!WARNING]
> Bisect checks out historical commits, which discards uncommitted work and may break the build. Before starting, run `git status` and confirm the tree is clean. If it is not, tell the user to commit or stash first — do not stash on their behalf.

## Step 1 — Build a fast, deterministic reproduction

This is the make-or-break step. Distill the bug into a single command that exits **0 when the code is good** and **non-zero when it is bad**.

- Prefer the narrowest, fastest signal: one unit test (`npm test -- path/to.test.ts -t "name"`, `pytest -k name -q`), a focused script, or a one-line `grep` over program output. Bisect runs this command ~log2(N) times, so a 2-minute build over 500 commits is ~18 minutes — trim it.
- Run the command on the **bad ref first** and confirm it fails. Then mentally verify it would pass on good code. If you cannot make it fail on the known-bad ref, you do not yet have a reproduction — stop and refine.

> [!WARNING]
> A flaky reproduction poisons the entire bisect. If the test passes and fails non-deterministically (timing, network, random seeds, shared state, leftover DB rows), bisect will mislabel commits and blame the wrong one. Pin seeds, isolate state, and run the repro 3-5 times on the bad ref — it must fail **every** time before you continue.

## Step 2 — Confirm the bad ref

By default `HEAD` is bad. Verify it:

```bash
git status                 # tree must be clean
git rev-parse HEAD         # record the bad ref so you can return to it
<your repro command>       # must exit non-zero (bug reproduces)
```

## Step 3 — Establish a good ref

You need a commit where the repro **passes**. If `$ARGUMENTS` named one, check it out and verify; otherwise walk backward to find one.

```bash
git checkout v2.3.0        # or a suspected-good tag / older commit
<your repro command>       # must exit 0 here
git checkout -             # return to the bad ref
```

If the candidate still fails, go further back (`HEAD~100`, then `HEAD~400`) until the repro passes. Pick the *most recent* known-good commit you can — a tighter `[good, bad]` window means fewer steps.

## Step 4 — Start the bisect

```bash
git bisect start
git bisect bad HEAD        # or your explicit bad ref
git bisect good v2.3.0     # the good ref you confirmed in Step 3
```

Git now checks out a commit roughly halfway between them and reports how many steps remain.

## Step 5 — Drive the search (prefer automation)

**Preferred — automate it.** Hand bisect the repro command and let it run unattended:

```bash
git bisect run <your repro command>
```

The exit-code contract `git bisect run` relies on:

| Exit code | Meaning to bisect |
| --- | --- |
| `0` | this commit is **good** |
| `1`–`124`, `126`, `127` | this commit is **bad** |
| `125` | **skip** — cannot be tested (won't build, deps changed) |

> [!NOTE]
> Use exit `125` for commits you cannot evaluate — e.g. a build failure unrelated to the bug. Wrap the repro in a script that builds first and `exit 125` on build failure, then runs the test: that keeps unbuildable commits from being misjudged as bad. Bisect will route around skipped commits and may report a small range instead of a single culprit.

**Manual fallback.** If the repro needs human judgment, evaluate each checked-out commit yourself and mark it:

```bash
git bisect good            # repro passed at this commit
git bisect bad             # repro failed at this commit
git bisect skip            # cannot test this one
```

Repeat until git prints `<sha> is the first bad commit`.

## Step 6 — Inspect the culprit and explain the cause

Once the first bad commit is identified, read it before declaring victory:

```bash
git show <sha>             # full diff + message
git show <sha> --stat      # files touched, for a quick map
```

Read the actual diff (use the Read tool to open the changed files at that revision if needed) and connect a specific line or hunk to the observed regression. Do not just report the SHA — explain *why* that change causes the bug.

## Step 7 — Always reset

Bisect leaves the repo on a detached historical commit. Restore the original state:

```bash
git bisect reset           # returns to the branch/ref you started from
git status                 # confirm the tree is back to normal
```

> [!WARNING]
> Never leave a bisect session open. If you stop early or hit an error, run `git bisect reset` before doing anything else, or the user will be stranded on a detached HEAD with a half-finished search log.

## Report

Deliver, as your message:

1. **First bad commit** — SHA, short message, author, and date.
2. **Root cause** — the specific change in that commit that introduced the regression, tied to the bug in `$ARGUMENTS`.
3. **Confidence** — note any `skip`ped commits or a returned range that widens the result.
4. **Reproduction used** — the exact command, so the finding is repeatable.
5. **Suggested fix or next step** — e.g. revert the commit, patch the offending hunk, or open an issue.

Confirm you ran `git bisect reset` and the working tree is clean before finishing.