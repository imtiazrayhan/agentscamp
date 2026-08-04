---
name: "commit-splitter"
title: "Commit Splitter"
description: "Split one big, mixed-up change into a series of small, atomic commits — each a single logical change that builds and passes tests on its own — by grouping hunks by intent and staging them piecemeal. Use when a working tree or a fat commit mixes a feature, a refactor, a bug fix, and formatting, or before opening a PR you want reviewers to actually read."
date: 2026-06-17
allowed-tools: "Read, Grep, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["review-qa"]
related: ["skill:conventional-commits", "skill:branch-rebaser", "skill:pr-description"]
featured: false
summary: "Turns one fat, mixed change into a series of atomic commits a reviewer can actually read. It inventories the diff, groups hunks by intent (feature, refactor, fix, formatting), stages each group with git add -p, orders them so every commit builds and passes tests independently, and writes a focused conventional message per commit."
---

A 600-line diff that mixes a feature, a drive-by refactor, a bug fix, and a formatter run is unreviewable — reviewers skim it and approve on faith. This skill decomposes that change into a sequence of small commits, each one a single logical intent that compiles and passes tests on its own. It groups the diff by purpose, stages one group at a time with `git add -p`, orders them so prerequisites land first, and gives each commit a focused message — so reviewers read the story instead of guessing at it, and `git bisect`/`git revert` stay meaningful.

## When to use this skill

- An uncommitted working tree mixes concerns — a new feature, an unrelated refactor, a bug fix, and whitespace/formatting churn all tangled together.
- A single fat commit (yours, not yet pushed) bundles several logical changes and you want to split it before review.
- You're about to open a PR and want the commit series to read as a deliberate narrative, not a `wip` dump.

> [!WARNING]
> Splitting only pays off if **each** commit independently builds and passes tests. A series where intermediate commits are broken defeats `git bisect` and makes any single-commit `revert` land a non-working tree — worse than one honest fat commit. Verify every commit, not just the tip.

## Instructions

1. **Inventory what changed.** Run `git status --porcelain` and `git diff --stat` (add `--cached` for staged hunks; `git show --stat HEAD` if splitting an existing commit). Read the actual hunks with `git diff` so you reason about real code, not filenames. Note any new/deleted/renamed files — those move as whole units, not per-hunk.
2. **Group hunks by logical intent.** Assign every hunk to exactly one group. Typical buckets, in dependency order:
   - **Prerequisite refactor** — renames, extractions, signature changes the feature depends on (no behavior change).
   - **Bug fix** — a self-contained correctness fix, ideally with its own test.
   - **Feature** — the new behavior, built on the refactor above.
   - **Formatting / lint** — pure whitespace, import sorting, autoformatter noise. Isolate this; mixed-in formatting is what makes diffs unreadable.
   - **Unrelated cleanup** — dead code, typo, comment. Its own commit (or a separate PR).
   Watch for **hidden coupling**: a feature that won't compile without the refactor must come *after* it, never before.
3. **Stage one group at a time.** Use `git add -p <files>` and answer per hunk: `y` to stage, `n` to skip, `s` to split a hunk into smaller pieces. When a single hunk mixes two intents that `s` can't separate (e.g. a logic change and a reformat on adjacent lines), use `git add -e` (or `e` at the prompt) to hand-edit the staged patch — delete the `+`/`-` lines that belong to the other group, keep context lines intact. Stage exactly one group, then go to step 4.
4. **Verify the staged group in isolation, then commit.** Before committing, prove the staged subset stands alone: `git stash push --keep-index` parks everything *not* staged, leaving only this group in the tree. Run the project's build + tests (detect them — `npm run build && npm test`, `pytest`, `go build ./... && go test ./...`). If it builds and passes, commit (step 6); then `git stash pop` to restore the rest and return to step 3 for the next group. If it fails, you mis-grouped — a prerequisite is in a later group; re-order and re-stage.
5. **For an already-committed mess, rewrite local history.** Two routes:
   - **Re-stage the whole commit:** `git reset HEAD~1` (soft-ish — keeps changes in the working tree, unstaged), then proceed from step 2 to rebuild it as several commits.
   - **Surgical split inside a series:** `git rebase -i <base>`, mark the offending commit `edit`. When the rebase stops on it, `git reset HEAD~1` to unstage its contents, then split via steps 3–6, and `git rebase --continue`. Use `git rebase --abort` to bail back to the original state if anything looks wrong.
6. **Write a focused conventional message per commit.** One intent per subject line: `refactor(parser): extract tokenizer`, `fix(auth): reject expired tokens`, `feat(auth): add SSO login`, `style: apply formatter`. The subject names the *single* thing this commit does; if you need "and" or a bullet list of unrelated items, the commit is still mixed — split further.
7. **Confirm the series reads as a story and every commit is green.** Run `git log --oneline <base>..HEAD` to read the sequence top-to-bottom: prerequisites → fix → feature → cleanup. Then verify *each* commit independently — `git rebase --exec '<build && test>' <base>` replays the series running your command after every commit, failing on the first that breaks. This is the proof that the split is bisect-safe.

> [!WARNING]
> Rewriting history that's already pushed or shared (`reset`, `rebase -i`) forces every collaborator to recover their local copy and can orphan their work. Only reshape **local, unpushed** history. If the commits are already on a shared branch, coordinate first — or leave history alone and split going forward.

## Output

- **Commit breakdown** — an ordered table: each proposed commit's purpose (its single intent), the files/hunks it claims, and its dependency on earlier commits.
- **Exact reproduction steps** — the concrete `git add -p` / `git add -e` sequence (or the `rebase -i` + `reset HEAD~1` plan) that produces that breakdown, including the per-group `stash push --keep-index` → build/test → commit → `stash pop` loop.
- **Recommended commit messages** — one conventional-commit subject (and body where it earns it) per commit, in apply order.
- **Verification result** — confirmation that `git rebase --exec` ran the build+tests after every commit and the whole series is green, with any commit that needed re-grouping called out.

Example breakdown for a tangled working tree:

| # | Commit | Hunks / files | Depends on |
|---|--------|---------------|------------|
| 1 | `refactor(parser): extract Tokenizer class` | `parser.ts` (lines 12–88), new `tokenizer.ts` | — |
| 2 | `fix(parser): handle empty input` | `parser.ts` (lines 140–152), `parser.test.ts` (new case) | 1 |
| 3 | `feat(parser): support inline comments` | `tokenizer.ts` (lines 40–72), `parser.ts` (lines 95–110) | 1 |
| 4 | `style: apply prettier` | whitespace-only across 6 files | — |