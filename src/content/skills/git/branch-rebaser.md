---
name: "branch-rebaser"
description: "Rebase the current branch onto its base and walk every conflict methodically, resolving each by understanding both sides. Use when your feature branch has fallen behind main and you want a clean, linear history without clobbering changes."
date: 2026-06-03
allowed-tools: "Read, Bash, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["workflow-prompting"]
related: ["agent:git-github-expert", "command:sync-branch"]
featured: false
summary: "A skill that rebases the current branch onto its detected base and resolves every conflict methodically: it confirms a clean tree, fetches and identifies the real base, reconstructs each conflicted hunk so both sides' intent survives, then rebuilds and re-runs tests to prove behavior held — never force-pushing without explicit confirmation."
---

Bring the current branch up to date by rebasing it onto its base, replaying your commits one at a time on top of the latest upstream. The skill confirms the working tree is clean before touching anything, fetches the real base, then steps through conflicts deliberately — reading both versions of each hunk and reconstructing the intended result rather than blindly accepting one side — and finishes by rebuilding and re-running tests so you know the rebase preserved behavior, not just resolved markers.

## When to use this skill

- Your feature branch has fallen behind `main`/`master` and you want a linear history instead of a merge commit.
- A rebase is mid-flight with conflicts and you want each one resolved by intent, not by reflexively picking `--ours` or `--theirs`.
- You need the branch updated before opening or refreshing a PR, and CI must still pass afterward.

> [!NOTE]
> Rebasing rewrites commit SHAs. Only rebase branches you own. If others have based work on this branch or it is already shared, prefer a merge — or coordinate before rewriting history.

## Instructions

1. **Confirm a clean tree.** Run `git status --porcelain` and `git rev-parse --abbrev-ref HEAD`. If there are uncommitted changes, stop and have the user commit or stash them (`git stash push -u`) before proceeding — a rebase over a dirty tree loses work. Note the current branch name.
2. **Fetch the latest base.** Run `git fetch origin --prune` so you rebase onto what truly exists upstream, not a stale local ref.
3. **Identify the base — do not guess.** Detect it instead of assuming `main`:
   - Prefer the configured upstream: `git rev-parse --abbrev-ref @{upstream}` (e.g. `origin/main`).
   - Fall back to the repo's default branch: `git symbolic-ref refs/remotes/origin/HEAD` → strip to `origin/<branch>`.
   - Confirm the branch is actually behind: `git rev-list --left-right --count HEAD...origin/<base>`. If the right-hand count is `0`, it's already up to date — report that and stop.
4. **Start the rebase.** Run `git rebase origin/<base>`. If it completes with no conflicts, skip to step 7.
5. **Resolve each conflict by understanding both sides.** For every conflicted file (`git diff --name-only --diff-filter=U`):
   - Read the file and locate the `<<<<<<<` / `=======` / `>>>>>>>` markers. The top block (`HEAD`/`ours`) is the base's version; the bottom block (`theirs`) is *your* commit being replayed.
   - Inspect both versions in isolation when unclear: `git show :2:<file>` (ours) and `git show :3:<file>` (theirs).
   - Reconstruct the intended result so **both** changes survive — keep the upstream fix *and* your feature edit. Never delete a side just to clear the markers.
   - Edit the file to the merged result, remove all conflict markers, then `git add <file>`.
6. **Continue, and repeat per commit.** Run `git rebase --continue`. Conflicts surface one replayed commit at a time, so return to step 5 for each new batch. If a commit becomes empty after resolution, `git rebase --skip` it. Use `git rebase --abort` to return to the pre-rebase state if anything looks wrong.
7. **Verify by building and testing.** Resolved markers are not proof of correctness. Run the project's build and test commands (detect them — e.g. `npm run build && npm test`, `pytest`, `go build ./... && go test ./...`). Fix any breakage the rebase introduced.
8. **Report and flag gaps.** Summarize how many commits replayed, which files conflicted and how each was resolved, and whether build/tests pass. Surface anything that needs a human eye (semantic conflicts the test suite may not catch, skipped commits). Do **not** force-push unless explicitly told to (see warning).

> [!WARNING]
> Updating a remote branch after a rebase requires a force-push, which rewrites history others may have pulled. Always use `git push --force-with-lease` (never bare `--force`) so you fail safely if the remote moved. If the branch is shared or backs an open PR with other contributors, **confirm with the user first** before pushing.

## Examples

A conflict-resolution loop on a branch two commits behind `origin/main`:

```text
$ git status --porcelain          # clean tree, ok to proceed
$ git fetch origin --prune
$ git rev-list --left-right --count HEAD...origin/main
3       2                          # 3 local commits, 2 upstream → behind, rebase

$ git rebase origin/main
Auto-merging src/config.ts
CONFLICT (content): Merge conflict in src/config.ts
error: could not apply 1f4a2b9... feat(config): add retry option
```

`src/config.ts` shows both sides — upstream renamed the timeout field; your commit added a sibling key:

```ts
<<<<<<< HEAD                       # ours: upstream's rename
  requestTimeoutMs: 5_000,
=======                            # theirs: your new feature
  timeout: 5000,
  retries: 3,
>>>>>>> 1f4a2b9 (feat(config): add retry option)
```

Keep *both* intentions — adopt the upstream rename and carry your new key onto it:

```ts
  requestTimeoutMs: 5_000,
  retries: 3,
```

```text
$ git add src/config.ts
$ git rebase --continue
[detached HEAD 9c1d0e2] feat(config): add retry option
Successfully rebased and updated refs/heads/feat/retry.

$ npm run build && npm test        # verify behavior, not just markers
✓ build passed   ✓ 142 tests passed

$ git push --force-with-lease      # only after confirming the branch isn't shared
```

Reported: 3 commits replayed, 1 conflict in `src/config.ts` (resolved by adopting the upstream `requestTimeoutMs` rename while carrying `retries`), build and tests green.
