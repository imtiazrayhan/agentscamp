---
title: "9 Best Claude Skills for Git"
description: "Compare Claude skills and commands for commit messages, undoing mistakes, PR descriptions, rebases, conflicts, commit splitting, blame, and changelogs."
author: "Imtiaz Rayhan"
date: "2026-09-11"
color: "green"
topics: ["workflow-prompting", "review-qa"]
audience: ["developers"]
tags: ["claude-skills", "git", "commits", "pull-requests", "version-control", "best-of"]
seoTitle: "9 Best Claude Skills for Git"
seoDescription: "The best Claude Code git skills and commands: Conventional Commits messages, safe undo, PR descriptions, rebasing, merge conflicts, git blame, and changelogs."
summary: "Start with conventional-commits for commit messages, the git-undo command for safe reversals, and pr-description for reviewer-ready PR bodies. Add branch-rebaser and resolve-conflict to keep branches current, commit-splitter before review, git-blame-investigator for history questions, clean-branches for hygiene, and changelog-from-prs at release time."
keyTakeaways:
  - "Pick git tooling by the moment in the workflow: committing, undoing, opening a PR, updating a branch, resolving conflicts, investigating history, or releasing."
  - "The right undo depends on whether the commit was pushed: reset rewrites local history, revert preserves shared history, and the reflog recovers lost commits."
  - "Resolve conflicts per hunk by intent; accepting ours or theirs for a whole file discards one side's change."
  - "Every commit in a split series should build and pass tests on its own, or bisect and single-commit reverts stop being useful."
  - "History rewrites and force-pushes need explicit confirmation, and --force-with-lease rather than --force."
faq:
  - q: "What is the best Claude Code commit skill?"
    a: "conventional-commits reads only what is already staged, picks the type and scope, writes an imperative subject of at most 72 characters, marks breaking changes, and commits after you confirm. If you also want Claude to choose what to stage, use the commit slash command, which stages the files for one logical change and then commits without pushing."
  - q: "Are there git skills for Claude Code beyond commit messages?"
    a: "Yes. The AgentsCamp library has skills for PR descriptions, rebasing, commit splitting, blame investigation, and changelogs, plus slash commands for undo, conflict resolution, PR creation, branch syncing, branch cleanup, and bisect. The git-github-expert agent handles larger history surgery and GitHub operations."
  - q: "Will these git skills force-push or rewrite shared history?"
    a: "Not without your confirmation. branch-rebaser and sync-branch never force-push unless you explicitly ask, and then use --force-with-lease; git-undo uses revert instead of reset for pushed commits; and clean-branches deletes only with the safe git branch -d."
  - q: "Should I use branch-rebaser or the sync-branch command?"
    a: "Both rebase onto the detected base, resolve conflicts by intent, and verify the build and tests. sync-branch accepts a base branch argument and will commit or stash a dirty tree itself, popping the stash afterward, while branch-rebaser stops and asks you to commit or stash first."
related: ["guide:best-claude-skills-2026", "guide:best-claude-skills-for-release-management", "skill:conventional-commits", "skill:pr-description", "skill:commit-splitter", "skill:branch-rebaser"]
---

The best Claude git skills handle the moments where git is easy to get wrong: writing a useful commit message, undoing the right thing, explaining a branch to reviewers, rebasing without dropping a change, and reading history before deleting code. Each pick below inspects repository state before it acts, and the ones that force-push or discard work stop for confirmation.

The list runs from the git tasks you do several times a day to the ones you do once per release. Six are skills; three are slash commands.

| Skill | Best for | Typical artifact | Writes files? |
| --- | --- | --- | --- |
| [conventional-commits](/skills/git/conventional-commits) | Messages for staged changes | Conventional Commits message | Commits after you confirm |
| [git-undo](/commands/git/git-undo) (command) | Reversing the last operation | The safe undo, explained | Yes; destructive ones need a yes |
| [pr-description](/skills/git/pr-description) | Explaining a branch | PR body to paste | No |
| [branch-rebaser](/skills/git/branch-rebaser) | A branch behind main | Rebased branch, tests run | Yes |
| [resolve-conflict](/commands/git/resolve-conflict) (command) | A paused merge or rebase | Resolved files, operation continued | Yes |
| [commit-splitter](/skills/git/commit-splitter) | A fat, mixed change | Atomic commit series | Yes (commits) |
| [git-blame-investigator](/skills/git/git-blame-investigator) | Why a line exists | Origin commit and verdict | Only an ignore-revs file |
| [clean-branches](/commands/git/clean-branches) (command) | Merged and stale branches | Pruned refs, review list | Deletes merged branches |
| [changelog-from-prs](/skills/release/changelog-from-prs) | Release notes from PRs | Keep a Changelog draft | No |

## 1. conventional-commits: write the message for what you staged

[conventional-commits](/skills/git/conventional-commits) reads `git diff --cached` and the staged file list, then picks a type (`feat`, `fix`, `refactor`, `docs`, and so on) and a scope from the affected area. It writes an imperative subject (aim for 50 characters, hard limit 72), adds a body explaining why for non-trivial changes, and marks breaking changes with `!` plus a `BREAKING CHANGE:` footer so changelog and semantic-release tooling keep working.

It reads only what is already staged and will not stage files for you, so stage hunks deliberately with `git add -p` first. It commits only after you confirm the message. If you want Claude to decide what to stage as well, the [commit](/commands/git/commit) command reads status, diffs, and recent log, stages the files for one logical change, flags secrets and `.env` files instead of staging them, and commits without pushing.

## 2. git-undo: pick the right way back

[git-undo](/commands/git/git-undo) starts from `git status`, `git log`, and `git reflog` to establish what the last operation was, whether it was pushed, and whether uncommitted work is at risk. It then matches the situation to one tool: `git restore --staged` to unstage, `git reset --soft` or `--mixed` to walk back a local commit while keeping the work, `git revert` for a pushed commit, `git revert -m 1` for a pushed merge, and the reflog to recover a lost commit or deleted branch.

It states the exact command before running it, requires an explicit yes for anything destructive, and reports the reflog SHA or stash ref that can restore what it changed.

## 3. pr-description: explain the branch to reviewers

[pr-description](/skills/git/pr-description) detects the real default branch instead of assuming `main`, computes the changeset with `git diff --merge-base`, reads the commit log and the most behavior-changing hunks, and mirrors any `PULL_REQUEST_TEMPLATE.md`. The body covers a summary, what changed and why, implementation notes, testing, and risk and rollout.

It is strictly read-only: it drafts text and never runs `gh pr create`. It cross-checks each claim against a real hunk and will not claim a test ran if the diff shows none. When you want the PR opened too, [create-pr](/commands/git/create-pr) confirms the base branch, pushes with `git push -u origin HEAD`, and creates the PR through `gh` without merging.

## 4. branch-rebaser: bring a branch up to date

[branch-rebaser](/skills/git/branch-rebaser) confirms a clean tree, fetches, and detects the base from the configured upstream or the remote's default branch. It rebases, and for each conflicted hunk it reads both versions (`git show :2:<file>` and `:3:<file>`) and writes a result that keeps both intents, such as adopting an upstream rename while carrying your new key. It then builds and runs the tests, because resolved markers are not proof of correct behavior.

It never force-pushes unless you say so, and then only with `--force-with-lease`. The [sync-branch](/commands/git/sync-branch) command does the same job but accepts a base branch argument and will commit or stash a dirty tree itself, popping the stash afterward.

## 5. resolve-conflict: finish a paused merge, rebase, or cherry-pick

[resolve-conflict](/commands/git/resolve-conflict) detects which operation is paused from `MERGE_HEAD`, `CHERRY_PICK_HEAD`, or the rebase directories, and confirms what "ours" and "theirs" mean, since the meaning flips between merge and rebase. It lists every conflict, including modify/delete and add/add cases, and reads each side's recent history before editing.

It resolves per hunk rather than with `git checkout --ours` or `--theirs`, greps the files for leftover markers, and requires a green build and test run before `git add` and continue. When a hunk needs product context, it aborts cleanly and asks the specific question instead of guessing.

## 6. commit-splitter: turn one fat change into reviewable commits

[commit-splitter](/skills/git/commit-splitter) inventories a mixed diff and assigns each hunk to one intent: prerequisite refactor, bug fix, feature, formatting, or unrelated cleanup. It stages one group at a time, parks the rest with `git stash push --keep-index`, builds and tests that subset alone, and commits it with a focused conventional message.

For an existing fat commit that is not yet pushed, it uses `git reset HEAD~1` or an `edit` stop in an interactive rebase. It confirms the whole series with `git rebase --exec` so every commit builds, which keeps `git bisect` and single-commit reverts meaningful. It reshapes only local, unpushed history.

## 7. git-blame-investigator: find the commit that introduced the logic

`git blame` names the last commit that touched a line, which is often a formatter run. [git-blame-investigator](/skills/git/git-blame-investigator) sees through that with `--ignore-rev` and a `.git-blame-ignore-revs` file, follows moved code with `-C -C -M` and renames with `git log --follow`, and uses `git log -L` and the pickaxe (`-S`, `-G`) to date when a string appeared. It reads the full commit, the PR, and neighboring commits, then returns safe to remove, do not touch, or needs a test first.

For regressions, the [debugging list](/guides/skills/best-claude-skills-for-debugging) pairs it with the [git-bisect](/commands/git/git-bisect) command, which pins the first bad commit.

## 8. clean-branches: prune without losing work

[clean-branches](/commands/git/clean-branches) takes no arguments. It resolves the main branch, protects the current, main, master, develop, and release branches, runs `git fetch --prune`, and lists branches already merged into main with their last commit for review. Unmerged branches go to a manual-review list showing how far ahead each is.

It deletes only with `git branch -d`, never `-D`, and notes that squash-merged branches will not show as merged, so those stay your call.

## 9. changelog-from-prs: draft release notes from merged PRs

[changelog-from-prs](/skills/release/changelog-from-prs) finds the last tag, collects PRs merged since then with `gh pr list`, and classifies each into Keep a Changelog sections by label, then by Conventional Commits prefix. It rewrites titles into reader-facing notes with PR numbers, leads with breaking changes, suggests the version bump, and lists ambiguous PRs under a needs-review heading rather than guessing. It publishes nothing; the output is Markdown to paste. The [release management list](/guides/skills/best-claude-skills-for-release-management) covers the rest of the release workflow.

## A git agent for bigger surgery

For interactive rebases, reflog recovery, or GitHub Actions workflow fixes, the [git-github-expert](/agents/developer-tools/git-github-expert) subagent creates a backup branch before any history rewrite, checks the result against it with `git range-diff` where feasible, and ends every mutating step with the exact undo command.

## Recommended git stacks

For daily work, install the message, undo, review, and branch-update tools:

```bash
npx agentscamp add skills/conventional-commits
npx agentscamp add commands/git-undo
npx agentscamp add skills/pr-description
npx agentscamp add skills/branch-rebaser
npx agentscamp add commands/resolve-conflict
```

Maintainers who curate history and cut releases can add:

```bash
npx agentscamp add skills/commit-splitter
npx agentscamp add skills/git-blame-investigator
npx agentscamp add skills/changelog-from-prs
```

Before approving any step that rewrites history or deletes branches, ask Claude to state what was pushed, what could be lost, and the command that undoes it. git-undo and the git-github-expert agent report all three; with the other picks, make sure the answers appear before the command runs.

## Continue exploring

- [The Best Claude Skills to Install in 2026](/guides/skills/best-claude-skills-2026) — A skills-only tour of the AgentsCamp library, organized by the job each skill does.
- [How to Install Claude Skills](/guides/skills/how-to-install-claude-skills) — Every install path: manual copy, the agentscamp CLI, GitHub repos, plugins, and team distribution.
- [Parallel Claude Code Sessions with Git Worktrees](/guides/advanced/parallel-claude-code-worktrees) — Run several Claude Code sessions at once without edits colliding.
