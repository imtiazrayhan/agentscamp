---
name: "github-actions-optimizer"
description: "Make a GitHub Actions workflow faster, cheaper, and harder to attack — by profiling where wall-clock and billed minutes actually go, then adding content-keyed caching, matrix/job parallelism, run-cancellation, and path filters, and hardening the supply chain (SHA-pinned actions, least-privilege GITHUB_TOKEN, safe fork-PR handling). Use when CI is slow or queues, when a repo burns Actions minutes, or before trusting a workflow that runs on untrusted pull requests."
allowed-tools: "Read, Grep, Glob, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "GitHub Actions Optimizer"
date: 2026-06-17
topics: ["devops-infra"]
related: ["agent:devops-engineer", "agent:git-github-expert", "agent:sre-engineer", "skill:secret-scanner"]
featured: false
summary: "A slow, expensive, or unhardened CI pipeline is usually three problems wearing one trench coat. This skill profiles where the minutes go, then ships the highest-leverage fixes first — content-keyed caching, matrix parallelism, run cancellation, path filters — and closes the supply-chain holes: SHA-pinned actions, least-privilege tokens, and no secrets for fork PRs."
---

A workflow that takes 22 minutes and costs you a fortune in minutes is rarely slow for one reason — it's usually re-downloading dependencies every run, running serially what could run in parallel, and building branches no one is waiting on. And the same file is often a supply-chain liability: a third-party action pinned to `@v3` can be repointed under you, and a `write-all` token plus `pull_request_target` is one malicious fork PR away from leaking secrets. This skill measures before it touches anything, then ships fixes ordered by payoff — biggest time or security win first — as concrete YAML diffs.

## When to use this skill

- CI wall-clock is the bottleneck on every PR, runs queue behind each other, or the monthly Actions bill is climbing.
- A job re-installs the whole dependency tree or rebuilds from scratch on every run, with no cache or a cache that never hits.
- The workflow runs on `pull_request` / `pull_request_target` from forks and you haven't audited what secrets and permissions are exposed.
- You inherited a workflow that pins actions to floating tags (`@v4`, `@main`) and grants the default broad `GITHUB_TOKEN`.

## When NOT to use this skill

- The slowness is in your test suite itself (flaky retries, an N+1 in integration tests) rather than the CI plumbing — fix the tests; faster runners won't save a 9-minute test that should take 90 seconds.
- You need a workflow authored from scratch for a new stack — that's scaffolding work; this skill optimizes and hardens an *existing* `.github/workflows/*.yml`.

## Instructions

1. **Inventory the workflows before changing one.** Glob `.github/workflows/*.{yml,yaml}` and read each. For every workflow note its triggers (`on:`), its jobs and their `needs:` graph, the runner labels (`ubuntu-latest` vs a larger/self-hosted runner — larger runners bill at a multiple), and the matrix dimensions. This is the map; you optimize against it, not against guesses.
2. **Profile where time actually goes — don't optimize from intuition.** Pull recent run timings with the CLI: `gh run list --workflow <file> -L 20 --json databaseId,conclusion,createdAt,updatedAt` for wall-clock per run, then `gh run view <id> --json jobs` to get per-job durations. The serial critical path is `needs:`-chained job durations summed; a 4-minute lint that gates a 12-minute test set adds 4 minutes to *everyone*. Rank jobs and steps by total billed minutes (duration × runs/day × runner multiplier). Fix the top one first.
3. **Add caching with a content-based key — or don't bother.** Cache the package manager's store, not `node_modules`/`.venv` (restoring a half-built tree is worse than a clean install). Key on a hash of the lockfile so the cache invalidates exactly when deps change: `key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json') }}` with a `restore-keys: ${{ runner.os }}-deps-` prefix fallback for partial hits. For language setup actions (`actions/setup-node`, `setup-python`, `setup-go`), prefer their built-in `cache:` input — it keys on the lockfile for you and handles the path. Confirm a hit after: the run log prints `Cache restored from key` (or `Cache not found`). A cache that never hits is pure overhead — it uploads on every run and restores nothing.
4. **Parallelize the critical path.** Convert serial variants (Node 18/20/22, OS targets, test shards) into a `strategy.matrix` so they run concurrently instead of in sequence. Split a single monster test job into shards with `matrix` + a test-splitting flag (`--shard ${{ matrix.shard }}/${{ matrix.total }}`). Drop unnecessary `needs:` edges — only gate a job on what it truly consumes; lint and unit tests rarely need to wait on each other. Set `fail-fast: false` only when you want all matrix legs to report; leave it `true` (default) to abort the matrix the moment one leg fails and stop burning minutes.
5. **Cancel superseded runs with `concurrency`.** Add a top-level `concurrency` group keyed on the ref so a new push cancels the in-flight run for that branch instead of running both: `concurrency: { group: ${{ github.workflow }}-${{ github.ref }}, cancel-in-progress: true }`. This alone can halve minutes on an active branch. Do NOT set `cancel-in-progress: true` on deploy/release workflows — cancelling a half-finished deploy mid-flight can leave the environment in a broken state.
6. **Skip work that can't be affected.** Add `paths:` / `paths-ignore:` filters so a docs-only change doesn't trigger the full build matrix, and `branches:` filters so feature pushes don't run release jobs. For required status checks, use a path filter plus a tiny "always-green" companion job (or `paths-filter` action with a downstream `if:`) so the required check still reports success on skipped paths — a hard `paths:` skip leaves a required check pending forever and blocks merges.
7. **Pin third-party actions to a full commit SHA.** Replace every `uses: owner/action@v4` (and especially `@main`) for *third-party* actions with the full 40-char commit SHA, keeping the version in a trailing comment: `uses: owner/action@a1b2c3...def # v4.1.2`. A floating tag is mutable — the owner (or an attacker who compromises them) can repoint it at code that exfiltrates your secrets, and your pinned-to-tag workflow will silently run it. First-party `actions/*` are lower risk but pinning them too is the consistent posture. Use `gh api repos/<owner>/<repo>/git/ref/tags/<tag>` to resolve a tag to its SHA.
8. **Set least-privilege `permissions` on `GITHUB_TOKEN`.** Add a top-level `permissions: { contents: read }` to default everything to read, then grant exactly what each job needs at the job level (`packages: write` to publish, `pull-requests: write` to comment, `id-token: write` for OIDC). The repo default is often `read-write` on everything; a token that can push to `contents` is a token a compromised dependency can use to push to your branches.
9. **Quarantine secrets from untrusted fork PRs.** Understand the split: `pull_request` from a fork runs with a read-only token and *no* repo secrets — safe but limited. `pull_request_target` runs in the context of the base repo *with* secrets and a writable token, while checking out the fork's code — this is the dangerous one. Never `checkout` and then build/run a fork's code under `pull_request_target`; that hands an attacker your secrets via a malicious build script or workflow. If you need a label-gated privileged step, split it into a separate `workflow_run`/manually-approved job that operates only on trusted artifacts, never on raw fork code.

> [!WARNING]
> An unkeyed or over-broad cache rots silently. If the key isn't tied to the lockfile, the cache never invalidates — CI keeps restoring stale dependencies, masking lockfile changes and producing "works in CI, broken locally" drift. If the key is too unique (includes `github.sha`), it never hits and you pay the upload cost every run for nothing. Verify "Cache restored from key" appears in real run logs before calling caching done.

> [!CAUTION]
> A third-party action pinned to a moving tag (`@v4`, `@main`) is remote code you don't control, running with your token and secrets. Tag mutation is the documented supply-chain attack (see the `tj-actions/changed-files` incident). Pin to a full commit SHA, and review the diff before bumping the SHA — never auto-update action SHAs without reading what changed.

> [!CAUTION]
> Secrets must never reach untrusted fork code. `pull_request_target` + checking out the PR head + running its scripts = secret exfiltration. Default to `pull_request` for fork CI, keep secrets out of those runs, and gate any privileged automation behind manual approval or a separate trusted workflow.

## Output

A prioritized remediation plan ordered by payoff — each item tagged TIME or SECURITY, with the measured cost it addresses (e.g. "SECURITY: 3 actions on floating tags"; "TIME: deps re-installed every run, ~90s × 40 runs/day") — followed by the concrete YAML diffs to apply, smallest-blast-radius wins first. Each diff is a minimal, reviewable change to a specific workflow file (added `concurrency` block, a cache step with its key, a matrix rewrite, SHA pins with version comments, a `permissions` block). The skill proposes edits via Edit and uses Bash only for read-only `gh`/`git` profiling and tag-to-SHA resolution; it does not push, re-run, or alter pipeline behavior beyond the diffs you approve.