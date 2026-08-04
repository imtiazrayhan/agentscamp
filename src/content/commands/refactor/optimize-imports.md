---
description: "Remove unused imports and organize the rest in a file or directory per the project's conventions — preferring the project's own import tool where one is configured — without changing behavior."
date: 2026-07-01
argument-hint: "<file, directory, or empty for the current changed files>"
allowed-tools: "Read, Grep, Glob, Edit, Bash"
title: "Optimize Imports"
color: "purple"
topics: ["review-qa"]
related: ["command:extract-function", "command:rename-symbol", "command:refactor"]
featured: false
summary: "A slash command that cleans up imports without changing behavior: it prefers the project's configured import tool (eslint plugin, ruff, goimports, isort) and runs that, or otherwise removes genuinely-unused imports and groups the rest per convention — carefully preserving side-effect-only, type-only, and dynamically-referenced imports — then verifies with the build, linter, and tests."
---

Remove unused imports and put the remaining ones in the project's conventional order, in one file or across a directory — a purely mechanical cleanup that must not change what the code does.

## Scope

Interpret `$ARGUMENTS` as the target:

- **A file** (`src/app/page.tsx`) — clean just that file.
- **A directory** (`src/lib/`) — clean each source file under it.
- **Empty** — clean the files with uncommitted changes (`git diff --name-only` plus staged), so the command tidies what you're actively working on.

> [!WARNING]
> This is behavior-preserving. Do not remove **side-effect imports** (`import "./styles.css"`, polyfills, module registration, `import "reflect-metadata"`) even though nothing references a binding from them — deleting these changes behavior. Also preserve **type-only** imports still used in annotations, names used only in **JSX**/decorators/templates, and anything referenced by string in dynamic loaders.

## Step 1 — Prefer the project's own tool

Check for a configured importer and run it instead of hand-editing — it already encodes the project's conventions:

```bash
# Detect what's configured
rg -l "import/order|simple-import-sort|organize-imports" .eslintrc* eslint.config.* 2>/dev/null
rg -n "\[tool\.(ruff|isort)\]" pyproject.toml setup.cfg 2>/dev/null
```

- **JS/TS:** `eslint --fix` when an import-sorting/no-unused plugin is present; or the editor's "organize imports" TS server command.
- **Python:** `ruff check --select I,F401 --fix` (import sort + unused), or `isort` + the unused-import rule.
- **Go:** `goimports -w` (removes unused, groups stdlib vs external).
- **Rust:** `cargo fix` for unused imports; `rustfmt` for grouping.

If a tool runs cleanly, let it do the work and skip to verification.

## Step 2 — Otherwise, edit carefully

When no tool is configured, do it by hand per file:

1. List the imported bindings, then confirm each is actually referenced in the file with `Grep` — accounting for JSX usage, type positions, and re-exports.
2. Remove only the genuinely-unused bindings. If an import statement has both used and unused names, trim the names, don't delete the line.
3. Keep every side-effect-only import exactly as-is.
4. Group and order per the file's existing convention — typically standard library, then third-party, then local/relative — with the same blank-line grouping the rest of the codebase uses.

## Step 3 — Verify behavior is unchanged

Run the project's checks over the touched files:

```bash
# whichever the project uses
npm run typecheck && npm run lint        # or: tsc --noEmit / eslint
pytest -q                                # or: ruff check + the test runner
go build ./... && go test ./...
```

A type error or a newly-failing test after this command almost always means a "used only in types," dynamic, or side-effect import was removed — restore it and re-check.

## Report

Summarize concisely:

- **Scope** — files touched.
- **Removed** — the unused imports deleted, per file.
- **Reordered** — whether grouping/sorting changed, and by which tool or convention.
- **Preserved** — any side-effect/type-only/dynamic imports deliberately kept despite looking unused.
- **Verification** — the build/type/lint/test commands run and their results.
