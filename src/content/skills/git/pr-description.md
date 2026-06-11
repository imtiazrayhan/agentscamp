---
name: "pr-description"
description: "Draft a clear pull request description from the branch diff against its base. Use when you have a finished branch and want a reviewer-ready PR body before opening the PR."
date: 2026-06-03
allowed-tools: "Read, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["review-qa"]
related: ["changelog-from-prs", "review-pr", "create-pr"]
featured: true
summary: "A skill that drafts a reviewer-ready pull request description from the branch's real diff against its base: it computes the merge-base changeset, reads commits and key hunks, mirrors any PR template, and writes summary, what changed and why, implementation notes, testing, and risk/rollout sections — read-only text to paste, never opening the PR."
---

Turn the diff between your branch and its base into a reviewer-ready pull request description. The skill computes the real changeset with `git diff --merge-base`, reads the touched code and the commit log, and drafts a structured body: a one-line summary, what changed and *why*, notable implementation notes, how it was tested, and risk/rollout. It is strictly read-only — it produces text for you to paste, it does not open or modify the PR.

## When to use this skill

- You have a finished branch and want a clear PR body before opening the pull request.
- An existing PR description is thin ("misc fixes") and a reviewer needs the real story.
- You want the *why* and the test evidence written down, not just a list of file names.
- You are about to request review and want to front-load the context reviewers always ask for.

> [!NOTE]
> This drafts text only. It never runs `gh pr create`, pushes, or edits the PR — copy the output into your PR yourself (or hand it to the `create-pr` command). The "how it was tested" section reports what the diff and history *show*; confirm the claims match what you actually ran.

## Instructions

1. **Find the base and the diff.** Determine the branch's merge base and capture the full changeset. Prefer the merge-base form so unrelated changes already on `main` are excluded:
   ```bash
   git diff --merge-base origin/main
   ```
   Fall back in order if that fails: `git diff --merge-base main`, then `git merge-base HEAD origin/main` + `git diff <base>..HEAD`, then `git diff main...HEAD`. If you still cannot resolve a base, ask the user which branch to diff against rather than guessing.
2. **Detect the base branch — do not assume `main`.** Read `git remote show origin | grep "HEAD branch"` (or `git symbolic-ref refs/remotes/origin/HEAD`) to find the real default branch; many repos use `master`, `develop`, or `trunk`. Use that name everywhere below.
3. **Read the commit narrative.** Run `git log $(git merge-base HEAD origin/<base>)..HEAD --oneline` and `git diff --merge-base origin/<base> --stat` (substituting the real base name from step 2) to see the scope and the author's own framing. Skim the actual hunks of the largest or most behavior-changing files — the summary must describe intent, not just churn.
4. **Detect existing PR conventions.** Check for `.github/PULL_REQUEST_TEMPLATE.md` (or `docs/`) and mirror its headings, checklists, and required sections exactly. If the repo uses a template, fill it in rather than imposing your own structure.
5. **Draft the body** with these sections (or the template's equivalents):
   - **Summary** — one imperative line a reviewer could read in the merge log.
   - **What changed & why** — the motivation and the approach, grouped by concern, not a file dump. Explain *why* this approach over the obvious alternative when it is not self-evident.
   - **Implementation notes** — non-obvious decisions, new dependencies, migrations, follow-ups deliberately left out of scope.
   - **Testing** — what was added or run. Cite real signals: new test files in the diff, a CI config, or commands the user can reproduce. Do **not** claim a test ran if the diff shows no test.
   - **Risk & rollout** — blast radius, backward-compat or migration steps, feature flags, and how to roll back.
6. **Verify the draft against the diff.** Cross-check every claim: does each "added X" map to a real hunk? Are migration/`.env`/breaking changes mentioned if the diff touches schemas, configs, or public signatures? Re-run a focused `git diff --merge-base origin/<base> -- <path>` (using the real base from step 2) to confirm anything you are unsure about.
7. **Report and flag gaps.** Output the finished markdown body. Below it, flag what you could *not* infer — missing test coverage for changed files, an empty "why", or risky changes (deleted migrations, dependency bumps) the author should address before requesting review.

> [!WARNING]
> If the diff is empty, the branch is identical to its base — stop and tell the user (they likely have not committed, or are on the base branch itself). Never invent a changelog for a branch with no changes.

## Examples

Given a branch `feat/rate-limit` diffed with `git diff --merge-base origin/main --stat`:

```text
 src/middleware/rateLimit.ts   | 84 +++++++++++++++++++++
 src/middleware/rateLimit.test.ts | 52 ++++++++++++
 src/server.ts                 |  6 ++
 package.json                  |  1 +
 4 files changed, 142 insertions(+), 1 deletion(-)
```

The skill drafts this PR body:

```markdown
## Summary
Add a sliding-window rate limiter to the public API to absorb bursty clients.

## What changed & why
- New `rateLimit` middleware (`src/middleware/rateLimit.ts`) enforces 100 req/min
  per API key using a sliding window backed by the existing Redis client.
- Wired into the request pipeline in `src/server.ts`, ahead of route handlers so
  rejected requests never hit business logic.

Chosen sliding-window over a fixed-window counter to avoid the double-burst
problem at window boundaries; the Redis sorted-set approach reuses the
connection pool we already provision, so no new infra.

## Implementation notes
- Adds one dependency: `ms` for human-readable window config.
- Limit is read from `RATE_LIMIT_PER_MIN` (defaults to 100) — no migration.
- Per-route overrides are intentionally out of scope; tracked in #421.

## Testing
- `src/middleware/rateLimit.test.ts` covers under-limit, at-limit, over-limit,
  and window-expiry cases.
- Run locally: `npx vitest run src/middleware/rateLimit.test.ts`.

## Risk & rollout
- Low blast radius: middleware is fail-open — if Redis is unreachable it logs and
  allows the request, so an outage degrades to today's behavior.
- Rollback: revert this PR; no schema or data changes.
- Heads-up: set `RATE_LIMIT_PER_MIN` in prod before merge if 100 is too low.
```

Then it flags any gaps, e.g.: *`src/server.ts` changed but is not covered by a test — confirm the wiring manually, and document the new `RATE_LIMIT_PER_MIN` env var in the README.*
