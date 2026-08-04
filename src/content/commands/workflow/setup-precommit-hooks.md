---
description: "Set up fast pre-commit hooks that catch problems before they land — detect the repo's existing stack and hook mechanism, run lint/format/typecheck plus a secret scan on staged files only, keep the slow test suite in CI, and make the setup reproducible for the whole team."
allowed-tools: "Read, Write, Glob, Grep, Bash"
title: "Setup Pre-commit Hooks"
color: "purple"
date: 2026-06-17
topics: ["devops-infra"]
related: ["command:setup-claude-ci", "command:scaffold-dockerfile", "guide:claude-code-ci-github-actions", "command:security-scan"]
featured: false
summary: "A slash command that installs fast, staged-only pre-commit hooks: it detects the project's stack and existing hook mechanism (pre-commit framework, Husky + lint-staged, or a native git hook), wires lint/format/typecheck plus a secret scan over staged files, keeps the full test suite in CI, auto-fixes formatting, commits the config, and reports the one-time install command teammates run."
---

## Scope

No arguments. Your job: leave this repo with pre-commit hooks that run in **seconds**, only on **staged** content, blocking the cheap mistakes (lint errors, unformatted code, type breaks, committed secrets) before they enter history — while the full test suite stays in CI.

Match the tooling the repo already uses. Do not impose a new framework on a repo that has a working one, and do not introduce a second runner alongside an existing one.

> [!WARNING]
> Hooks that run the whole test suite on every commit are slow, so developers learn to type `--no-verify` and the hooks stop protecting anything. Keep the commit path under a few seconds. Slow, comprehensive checks belong in CI.

## Step 1 — Detect the stack and what already exists

Before writing anything, read the ground truth:

- **Existing hook mechanism** — `.pre-commit-config.yaml` (the pre-commit framework), `.husky/` + a `lint-staged` block in `package.json`, `lefthook.yml`, or a hand-rolled `.git/hooks/pre-commit`. Also check `git config core.hooksPath`.
- **Stack** — `package.json`, `pyproject.toml`/`requirements.txt`, `go.mod`, `Cargo.toml`, `Gemfile`.
- **Tools the repo already has** — linter (eslint, ruff, golangci-lint, clippy), formatter (prettier, ruff format/black, gofmt, rustfmt), type checker (tsc, mypy, pyright), and how the test suite is invoked.

Reuse those exact tools and their existing config. The hook should call the same `eslint`/`ruff`/`prettier` the team already runs, not a new one with different rules.

## Step 2 — Pick the mechanism (match, don't impose)

- A config already exists → **extend it**. Add missing checks to the current `.pre-commit-config.yaml` / `lint-staged` block.
- JS/TS repo, nothing yet → **Husky + lint-staged** (`lint-staged` already runs only on staged files — that's the whole point).
- Python or polyglot repo, nothing yet → **the `pre-commit` framework** (`.pre-commit-config.yaml`); it pins hook versions and handles staged-only runs.
- Tiny/no package manager → a **native `.git/hooks/pre-commit`** script. Note that native hooks aren't shared by git, so Step 5 must check it into the repo and add an install step.

State your choice and why in one line.

## Step 3 — Configure fast, staged-only checks

Wire these against **staged files only**, fastest-failing first:

1. **Secret scan** — block committed credentials with `gitleaks protect --staged` or pre-commit's `detect-secrets`. This is the one check worth running first; a leaked key can't be un-pushed.
2. **Format (auto-fix)** — run the formatter in write mode on staged files, then re-stage them (`prettier --write`, `ruff format`, `gofmt -w`). Auto-fixing beats rejecting the commit over whitespace.
3. **Lint** — only the staged files (`eslint`, `ruff check`, `golangci-lint run`); enable `--fix` where the linter's fixes are safe.
4. **Typecheck** — only if it's fast on the changed scope. `tsc` is whole-project and often too slow for the commit path; if so, leave it to CI rather than degrading the commit experience.

With `lint-staged`, the staged-file list is passed to each command automatically. With the `pre-commit` framework, set `pass_filenames: true` (the default) and scope with `files:`/`types:`.

> [!WARNING]
> The hook must operate on staged content only. If a tool reads the working tree instead of the index, a developer can stage a clean version, leave a broken version unstaged, and the hook passes on code that won't be what's committed. `lint-staged` and the `pre-commit` framework stash unstaged changes to avoid exactly this — a raw native hook does not, so handle it explicitly there.

## Step 4 — Keep the slow stuff in CI

Do **not** put the full test suite, full-repo typecheck, or a full build in the commit hook. Confirm those run in CI (check `.github/workflows/`); if a needed check is missing there, name the exact job that should run it (lint, typecheck, full tests on push/PR) and flag that it belongs in CI, not the commit path. A `pre-push` hook is the acceptable home for a fast smoke subset — never a substitute for CI.

## Step 5 — Make it reproducible for the team

A hook that only works on your machine is worthless. Ensure:

- The config file is **committed** (`.pre-commit-config.yaml`, the `lint-staged` block, `.husky/` scripts, or the checked-in native hook + an installer like `git config core.hooksPath .githooks`).
- There is **one install command** a teammate runs after cloning — `npx husky` (wired via the `prepare` script in `package.json` so `npm install` does it), or `pre-commit install`.
- Hook tool versions are **pinned** (pre-commit `rev:` tags; devDependencies for JS) so everyone runs identical checks.

Verify it actually fires: stage a deliberately broken file and confirm the commit is rejected, then fix and confirm it passes.

## Step 6 — Document the escape hatch

Note in the config or a short README line that `git commit --no-verify` skips hooks for genuine emergencies (hotfix, mid-rebase WIP). Don't hide it — but pair it with the reminder that CI still enforces the same checks, so bypassing locally only defers the failure.

## Report

End with:

- **Files written/changed** — config path(s) and any `package.json` script additions.
- **One-time install command** teammates run after cloning (exact command).
- **What runs on commit** vs. **what's left to CI**, and the bypass flag for emergencies.