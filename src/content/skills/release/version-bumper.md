---
name: "version-bumper"
title: "Version Bumper"
description: "Bump the project version everywhere it lives in one consistent pass — package.json, lockfile, nested/CLI package manifests, version constants, README badges, docs — then roll the changelog's Unreleased section under the new version and stage an annotated git tag. Use when you've already decided the new version (X.Y.Z or a pre-release like -rc.1) and need every artifact updated to the same value without drift, or before cutting a release."
allowed-tools: "Read, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["devops-infra"]
related: ["changelog-from-prs", "semver-advisor", "migration-writer"]
featured: false
summary: "A skill that bumps the version consistently across every artifact at once. It greps out all the places a version string hides — package.json, lockfile, nested CLI/submodule manifests, constants, badges, docs — sets them to one agreed value, moves the changelog's Unreleased entries under the new version and date, and stages (never runs unprompted) the annotated tag and release commit."
faq:
  - q: "Does this skill decide which version to bump to?"
    a: "No. You supply the target version (it already decided semver via /semver-advisor or your judgment). This skill's job is to apply that exact value everywhere consistently, not to pick it."
  - q: "Will it commit and push the tag for me?"
    a: "Only when you explicitly ask. By default it edits files and prints the exact `git commit` and `git tag -a` commands so you can review the diff first — tagging before the bump commit lands is a common, hard-to-undo mistake."
---

Bumping a version is rarely one line. The number hides in `package.json`, a lockfile, a nested CLI or submodule manifest, a `__version__` constant, a README badge, and a docs install snippet — and any one you miss ships as drift. This skill finds every occurrence, sets them all to a single agreed value, rolls the changelog, and stages the tag. It never picks the version for you and never publishes without your say-so.

## When to use this skill

- You've decided the new version (e.g. `2.4.0`, or a pre-release `2.4.0-rc.1`) and need every artifact updated to match in one pass.
- You're cutting a release and want the bump commit to be clean, atomic, and correctly tagged.
- A previous bump left drift — `package.json` says one version, the lockfile or a badge says another — and you want them reconciled.
- You maintain a monorepo or a repo with a bundled CLI sub-package whose versions and dependency ranges must move together.

> [!NOTE]
> This skill applies a version you've already chosen. If you haven't decided whether the change is major/minor/patch, run a semver analysis first (see `semver-advisor`) — getting the number right is out of scope here.

## Instructions

1. **Confirm the exact target version before touching anything.** Read the current version from the root `package.json` (or `pyproject.toml`, `Cargo.toml`, etc.). State the old → new transition explicitly and stop if the new value isn't strictly greater, or if it's malformed. A pre-release identifier (`-rc.1`, `-beta.2`, `-next.0`) is valid and must be carried verbatim into every artifact — do not silently drop it.

2. **Find every place the version lives.** Don't assume — grep. The number leaks into more files than you expect:

   ```bash
   OLD="1.2.3"   # current version, escaped if it contains dots
   grep -rnF "$OLD" \
     --include='*.json' --include='*.toml' --include='*.md' \
     --include='*.ts' --include='*.js' --include='*.py' --include='*.yml' --include='*.yaml' \
     --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist .
   ```

   Then triage each hit. Update version *declarations*; never blanket-replace — a `1.2.3` in changelog history or a test fixture must stay put.

3. **Update the canonical manifest(s).** Edit the `version` field in the root `package.json`. For nested packages (a `cli/package.json`, workspace packages, a submodule manifest), update each one to the same value unless they version independently — confirm which model the repo uses before assuming lockstep.

4. **Update the lockfile so it doesn't drift.** Editing `package.json` alone leaves `package-lock.json` (and the `packages[""].version` entry inside it) stale. Regenerate it deterministically rather than hand-editing:

   ```bash
   npm install --package-lock-only --ignore-scripts
   ```

   For `pnpm` use `pnpm install --lockfile-only`; for `yarn` run `yarn install --mode update-lockfile`.

5. **Update version constants and human-facing references.** Catch the non-manifest spots the grep surfaced: a `VERSION` / `__version__` constant in source, a README shields.io badge (`version-1.2.3-` → `version-2.4.0-`), install snippets pinning `pkg@1.2.3`, and any `docs/` page that names the current version. Skip historical mentions (changelog entries, migration notes about old releases).

6. **Roll the changelog.** Move everything under the `## [Unreleased]` heading into a new `## [X.Y.Z] — YYYY-MM-DD` section dated today, then leave `## [Unreleased]` empty above it. Update the link-reference footer if the changelog uses compare-URL refs (`[X.Y.Z]: …/compare/vOLD...vX.Y.Z` and a fresh `[Unreleased]: …/compare/vX.Y.Z...HEAD`).

7. **For monorepos, keep interdependent versions and ranges consistent.** When package A depends on package B and both bump, update A's dependency range on B (e.g. `"@scope/b": "^2.4.0"`) so a consumer doesn't resolve a mismatched pair. Verify no `workspace:*` range was accidentally pinned to a literal.

8. **Stage — do not run — the release commit and annotated tag.** Print the exact commands and wait for the user. The bump commit must land *before* the tag points at it; tag from the wrong commit and you've published a tag that doesn't match its tree.

   ```bash
   git add -A
   git commit -m "chore(release): vX.Y.Z"
   git tag -a vX.Y.Z -m "vX.Y.Z"
   # push only when asked:  git push origin HEAD vX.Y.Z
   ```

> [!WARNING]
> Never run `git tag` before the bump commit is committed — an annotated tag captures the commit it points to, so a premature tag will reference the *previous* state, and moving a published tag breaks anyone who already fetched it. Commit first, verify `git show HEAD --stat` contains the version edits, then tag.

> [!WARNING]
> A lockfile left at the old version is the single most common bump bug: CI installs, sees `package-lock.json` disagrees with `package.json`, and either fails or silently resolves the old version. Always regenerate the lockfile in the same commit as the manifest bump.

## Output

Two artifacts, both reviewable before anything is committed:

1. **A change table** of every file touched, old → new:

   | File | Old | New |
   | --- | --- | --- |
   | `package.json` | `1.2.3` | `2.4.0` |
   | `package-lock.json` | `1.2.3` | `2.4.0` |
   | `cli/package.json` | `1.2.3` | `2.4.0` |
   | `src/version.ts` | `1.2.3` | `2.4.0` |
   | `README.md` (badge) | `1.2.3` | `2.4.0` |
   | `CHANGELOG.md` | Unreleased | `## [2.4.0] — 2026-06-17` |

2. **The exact release commands**, ready to paste and run only on request:

   ```bash
   git add -A
   git commit -m "chore(release): v2.4.0"
   git tag -a v2.4.0 -m "v2.4.0"
   # git push origin HEAD v2.4.0
   ```

   Plus a one-line note of anything skipped on purpose (historical version mentions left untouched) or anything that needs a human decision (a sub-package that may version independently).