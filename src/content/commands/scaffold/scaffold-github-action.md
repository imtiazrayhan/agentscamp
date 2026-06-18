---
description: "Scaffold a hardened GitHub Actions workflow for a stated goal, wired to the project's real test/lint/build commands."
date: 2026-06-17
argument-hint: "<what the workflow should do — e.g. CI test on PR, lint, release/publish, nightly cron>"
allowed-tools: "Read, Write, Glob, Grep"
title: "Scaffold GitHub Action"
color: "purple"
topics: ["devops-infra"]
related: ["scaffold-dockerfile", "setup-claude-ci", "setup-precommit-hooks"]
featured: false
summary: "Turns $ARGUMENTS into a hardened GitHub Actions workflow: detects the package manager and test/lint/build scripts, then writes .github/workflows/<name>.yml with correct triggers, dependency caching, SHA-pinned actions, least-privilege GITHUB_TOKEN permissions, concurrency cancellation, and secrets.* references — reporting the secrets and permissions you must configure."
---

Scaffold a GitHub Actions workflow for this repository. Treat `$ARGUMENTS` as the goal of the workflow — what it should do and when it should run (e.g. `CI test on PR`, `lint + typecheck`, `publish to npm on tag`, `nightly dependency audit`). If `$ARGUMENTS` is empty, ask exactly one question: *"What should this workflow do, and on what event should it run (PR, push to main, tag, schedule)?"* — then proceed.

## Scope

Produce one file: `.github/workflows/<name>.yml`, where `<name>` is a short kebab-case slug derived from the goal (`ci`, `lint`, `release`, `nightly-audit`). The workflow must run the project's **real** commands, declare **least-privilege** `permissions`, **pin** every third-party action to a commit SHA, **cache** dependencies, and **cancel** superseded runs via `concurrency`. Reference all credentials through `secrets.*`.

> [!WARNING]
> If `.github/workflows/<name>.yml` already exists, do not overwrite it. Read it, then either propose targeted edits in your report or write the new file as `<name>.new.yml` and say so. Never clobber a workflow that may be gating merges or shipping releases.

## Step 1 — Map the goal to a trigger

Classify `$ARGUMENTS` into one of these and set `on:` accordingly — do not add triggers the goal does not call for:

- **CI / test / lint / typecheck** → `on: pull_request` (validate PRs) plus `push:` to the default branch only if post-merge runs are wanted. Gate jobs that touch credentials behind `pull_request`, not `pull_request_target`.
- **Release / publish** → `on: push: tags: ['v*']` or `on: release: types: [published]`. Publishing on every `main` push is almost never what you want — prefer a tag/release trigger.
- **Scheduled job** (audit, refresh, backup) → `on: schedule: - cron: '...'`. Cron runs in **UTC**; pick an off-peak minute (avoid `0 * * * *` — top-of-hour is heavily throttled and queued). Add `workflow_dispatch` so it can be run manually too.

Detect the repo's default branch by `Read`ing `.git/HEAD` or any existing workflow; default to `main` if unknown and note the assumption.

## Step 2 — Detect the stack and real commands

Never invent `npm test`. Find what the project actually runs with `Glob`/`Read`/`Grep`:

- **Node / Bun / Deno** — `package.json`: read `packageManager`, `engines.node`, and `scripts` (`test`, `lint`, `typecheck`, `build`). The lockfile picks the manager and the deterministic install + cache: `package-lock.json` → `npm ci`; `pnpm-lock.yaml` → `pnpm install --frozen-lockfile`; `yarn.lock` → `yarn install --immutable`; `bun.lockb` → `bun install --frozen-lockfile`.
- **Python** — `pyproject.toml` / `requirements.txt` / `uv.lock` / `poetry.lock`; commands like `pytest`, `ruff check`, `mypy`.
- **Go** — `go.mod`: `go test ./...`, `go vet ./...`, `go build ./...`; read the `go` directive for the version.
- **Rust** — `Cargo.toml`: `cargo test`, `cargo clippy -- -D warnings`, `cargo build --release`.

Record the **language + version**, **package manager + lockfile path**, and the **exact script names** that exist. If the goal asks for a step the project has no script for (e.g. no `lint`), say so in the report rather than fabricating one.

## Step 3 — Write the hardened workflow

Use the project's commands and the trigger from Step 1. The snippet below is illustrative for a Node CI workflow — adapt `setup-*`, the cache, and the run steps to the stack from Step 2.

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

# Least privilege: read-only by default; add scopes per job only as needed.
permissions:
  contents: read

# Cancel superseded runs for the same ref to save minutes.
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # Pin third-party actions to a full commit SHA, not a moving tag.
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
      - uses: actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af # v4.1.0
        with:
          node-version: 22
          cache: npm # built-in dependency cache keyed on the lockfile
      - run: npm ci
      - run: npm run lint --if-present
      - run: npm test
```

Rules for whatever stack and goal you target:

- **`permissions:` is least-privilege.** Set a top-level `permissions: contents: read` baseline, then grant the minimum each job needs: `pull-requests: write` to comment on PRs, `packages: write` to push images, `id-token: write` for OIDC publishing. Never use a blanket `permissions: write-all`.
- **Pin every third-party action to a 40-char commit SHA**, with a trailing `# vX.Y.Z` comment for readability. A moving tag like `@v4` lets a compromised or retagged release run arbitrary code with your token. First-party `actions/*` are still safer pinned.
- **Cache dependencies** — prefer the `cache:` option built into `setup-node`/`setup-go`/`setup-python` (keyed on the lockfile) over a hand-rolled `actions/cache` unless you need a custom path.
- **Reference secrets only as `${{ secrets.NAME }}`** — never paste a token literal, and never `echo` a secret. Pass them as `env:` on the single step that needs them, not workflow-wide.
- **Concurrency** — for CI, cancel superseded runs (`cancel-in-progress: true`). For a release/publish workflow, set `cancel-in-progress: false` so an in-flight publish is never killed mid-upload.

> [!WARNING]
> Do not use `pull_request_target` to "fix" a workflow that needs secrets on fork PRs. It runs with the base repo's write token **and** the fork's untrusted code/`with:` inputs in the same context — a classic token-exfiltration vector. If a fork PR genuinely needs a secret, split into a privileged `workflow_run` job that never checks out untrusted code.

> [!NOTE]
> For npm/PyPI publishing, prefer **OIDC trusted publishing** (`permissions: id-token: write`) over a long-lived `NPM_TOKEN`/`PYPI_TOKEN` secret — it removes the standing credential entirely. Fall back to a `secrets.*` token only if the registry does not support OIDC.

## Step 4 — Report

Deliver the result as your message:

- **File written** — `.github/workflows/<name>.yml` (or `<name>.new.yml` if you avoided overwriting), and the detected stack + package manager it targets.
- **Triggers** — the exact `on:` events and, for a schedule, the cron expression in plain English ("daily at 07:00 UTC").
- **Permissions** — the `GITHUB_TOKEN` scopes granted and why each is needed.
- **Secrets to configure** — every `secrets.*` referenced, where to add it (`Settings → Secrets and variables → Actions`, or an Environment for protected deploys), and whether OIDC could replace it.
- **Follow-ups** — any missing project script the goal assumed, and how to verify the pinned SHAs (e.g. `gh api repos/actions/checkout/git/refs/tags/v4.2.2` to confirm the SHA matches the tag) and re-pin them later with Dependabot's `package-ecosystem: github-actions`.