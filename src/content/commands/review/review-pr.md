---
description: "Review a pull request for correctness, security, and style, and summarize findings."
date: 2026-06-03
argument-hint: "[PR number]"
title: "Review PR"
color: "purple"
topics: ["review-qa"]
featured: true
related: ["code-reviewer"]
---

Review pull request **#$ARGUMENTS** end to end. Produce a focused, actionable review that a maintainer can act on immediately. Do not approve or merge the PR — your job is to analyze and report.

## Gather context

Pull the PR metadata and the full diff before forming any opinion. Use the GitHub CLI so you read the same state reviewers see.

```bash
# Title, body, author, branches, labels, and CI status
gh pr view $ARGUMENTS

# Full diff for the PR
gh pr diff $ARGUMENTS

# Files changed with additions/deletions
gh pr view $ARGUMENTS --json files --jq '.files[] | "\(.path) +\(.additions) -\(.deletions)"'

# CI / check results
gh pr checks $ARGUMENTS
```

Read the PR description and any linked issues to understand the *intended* behavior. Then check out the branch locally so you can inspect surrounding code, run the test suite, and verify claims.

```bash
gh pr checkout $ARGUMENTS
```

> [!NOTE]
> Review the change against its stated goal. A technically clean diff that does not solve the problem described in the PR is still a problem worth flagging.

## What to evaluate

### Correctness

Trace the changed logic against the intended behavior. Look for off-by-one errors, incorrect conditionals, unhandled `null`/`undefined`, broken edge cases, race conditions, and resource leaks. Confirm new behavior is covered by tests and that existing tests still pass.

```bash
# Run the project's test suite (adapt to the repo)
npm test
```

### Security

Inspect every place untrusted input enters the system. Flag injection risks (SQL, shell, template), missing authentication or authorization checks, unsafe deserialization, path traversal, and secrets committed to the repo.

```bash
# Scan the diff for accidentally committed secrets
gh pr diff $ARGUMENTS | grep -nEi '(api[_-]?key|secret|token|password|BEGIN [A-Z ]*PRIVATE KEY)'
```

> [!WARNING]
> Never echo a real secret you discover into the review. Report the file and line, recommend rotation, and ask the author to remove it from history.

### Style and maintainability

Check naming, dead code, duplicated logic, oversized functions, and adherence to the project's lint rules and conventions. Prefer the codebase's existing patterns over personal preference.

```bash
npm run lint
```

## Classify each finding

Tag every finding by severity so the author knows what blocks merge:

- **Blocker** — must fix before merge (bugs, security holes, broken tests).
- **Should-fix** — important but not strictly blocking.
- **Nit** — minor style or polish; optional.

For each finding, cite the exact `file:line`, explain *why* it matters, and propose a concrete fix or a suggested diff.

## Output format

Summarize the review in this structure:

```markdown
## Review of PR #$ARGUMENTS — <title>

**Verdict:** Approve / Request changes / Comment

### Summary
<2-3 sentences on what the PR does and overall quality.>

### Blockers
- `path/to/file.ts:42` — <issue and fix>

### Should-fix
- `path/to/file.ts:88` — <issue and fix>

### Nits
- `path/to/file.ts:101` — <issue and fix>

### What looks good
- <notable strengths worth calling out>
```

Keep feedback specific and respectful. End with a clear recommendation and the single most important next step for the author.
