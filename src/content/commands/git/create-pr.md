---
description: "Push the current branch and open a GitHub pull request with a generated title and body."
date: 2026-06-03
argument-hint: "[base branch or notes]"
allowed-tools: "Bash"
title: "Create PR"
color: "purple"
topics: ["review-qa"]
featured: true
related: ["commit", "pr-description", "review-pr"]
---

Open a GitHub pull request for the current branch. Follow the steps below exactly. Push the branch if needed, but do not merge, and confirm the base branch before you create anything.

## Scope

If `$ARGUMENTS` is provided, treat it as the base branch to target (`develop`, `release/2.0`) and/or freeform notes to weave into the body — for example a hint about scope (`backend only`), an issue to close (`Closes #214`), or a reviewer to request. If `$ARGUMENTS` is empty, default the base to the repository's main branch and derive the entire title and body from the commits and diff.

## Step 1 — Inspect the branch and confirm the base

Run these in parallel and read the output before doing anything else.

```bash
# Current branch name and where HEAD sits relative to its upstream
git status -sb

# The repository's default branch (use as the base when none is given)
gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'

# Commits unique to this branch, oldest first
git log <base>..HEAD --oneline

# The full diff against the base
git diff <base>...HEAD --stat
git diff <base>...HEAD
```

Substitute the real base (`$ARGUMENTS` or the default branch) for `<base>`. The `...` (three-dot) range shows what this branch adds since it diverged, which is exactly what the PR will contain.

> [!NOTE]
> Confirm the base branch with the user before creating the PR. Targeting the wrong base (e.g. `main` instead of `develop`) is the most common and most disruptive mistake. If you defaulted to the repo's main branch, say so explicitly.

> [!WARNING]
> If `git log <base>..HEAD` is empty, the branch has no new commits and there is nothing to open a PR for. Stop and tell the user instead of creating an empty PR.

## Step 2 — Ensure the branch is pushed

The remote must have your commits before a PR can reference them.

```bash
# Push and set the upstream on first push; the branch name is inferred from HEAD
git push -u origin HEAD
```

> [!WARNING]
> Only push the current feature branch. Never force-push (`--force`) a shared branch or push to `main`/`develop` directly. If `git status -sb` shows the branch is already up to date with its upstream, skip this step.

## Step 3 — Derive the title and body

Read the commits and diff from Step 1, then synthesize the PR content. Do not just paste commit messages — describe the change as a whole.

**Title** — one concise, imperative line (matching the commit style), at or under ~72 characters. For a single-commit branch, the commit subject is usually a good title.

**Body** — fill in this structure, using your reading of the diff:

```markdown
## Summary
<1-3 sentences on what this PR does and why.>

## Changes
- <key change, grouped by area or concern>
- <another notable change>

## Testing
- <how it was verified: tests added/run, manual steps, or "not yet tested">

## Risk
- <blast radius, migrations, rollback notes, or "low — isolated change">
```

> [!WARNING]
> Do not include secrets, tokens, internal URLs, or customer data in the title or body — a PR description is public to everyone with repo access. Summarize sensitive context instead of pasting it.

## Step 4 — Create the pull request

Pass the body via a HEREDOC so multi-line Markdown renders correctly.

```bash
gh pr create \
  --base "<base>" \
  --head "$(git branch --show-current)" \
  --title "<generated title>" \
  --body "$(cat <<'EOF'
## Summary
<1-3 sentences on what this PR does and why.>

## Changes
- <key change, grouped by area or concern>
- <another notable change>

## Testing
- <how it was verified: tests added/run, manual steps, or "not yet tested">

## Risk
- <blast radius, migrations, rollback notes, or "low — isolated change">
EOF
)"
```

> [!NOTE]
> Add `--draft` if the work is not ready for review, and `--reviewer <user>` or `--label <label>` when the user asks. Do not merge the PR — opening it is the end of this command.

## Report

Print the URL that `gh pr create` returns, plus the resolved base branch and the number of commits included so the user can confirm the PR landed where they expected. If anything blocked creation (no commits, dirty tree, unconfirmed base), report that instead of forcing the PR open.
