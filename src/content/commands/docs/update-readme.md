---
description: "Update the README to reflect the current scripts, structure, and features of the repo."
date: 2026-06-03
argument-hint: "[section or focus]"
allowed-tools: "Read, Grep, Glob, Bash, Edit, Write"
title: "Update README"
color: "purple"
topics: ["workflow-prompting"]
related: ["explain-code", "readme-generator"]
featured: false
summary: "A slash command that brings a README back in sync with the code: it inventories every claim (scripts, paths, ports, env vars), ground-truths each against the real repo, then surgically fixes stale entries, adds missing ones, and removes phantom features — preserving structure and touching only lines that drifted."
---

Bring the README back in sync with the code. Your job is to find where the README has drifted from reality and correct only those parts — not to rewrite the document. Every claim you keep or add must be backed by something in the repository.

## Scope

`$ARGUMENTS` narrows what you audit.

- A section name (`Installation`, `Scripts`, `Configuration`) means review and fix that section only, leaving the rest untouched.
- A focus area (`scripts`, `env vars`, `project structure`, `badges`) means reconcile that aspect across the whole README.
- A path hint (`packages/api`) means update the README that governs that subtree.

If `$ARGUMENTS` is empty, audit the entire top-level README end to end.

> [!NOTE]
> Do not invent commands, scripts, env vars, or features that are not present in the repo. The README must describe what the code actually does today, not what it should do or once did.

## Step 1 — Read the current README

Find and read every README before changing anything.

```bash
# Top-level and nested READMEs
ls README* 2>/dev/null
find . -iname 'readme*' -not -path '*/node_modules/*' -not -path '*/.git/*'
```

Read the target README in full. Note its existing headings, ordering, tone, and formatting conventions — you will preserve all of them. Inventory every concrete claim it makes: commands, file paths, ports, env vars, requirements, badges, and links.

## Step 2 — Read the real repo

Ground-truth each claim against the actual project. Pull the facts from the source of truth, not from memory.

```bash
# Scripts and metadata — the canonical list of commands
cat package.json        # or pyproject.toml / Cargo.toml / go.mod / Makefile

# Top-level structure the README describes
ls -la
find . -maxdepth 2 -type d -not -path '*/node_modules/*' -not -path '*/.git/*'

# Entry points, config, and declared env vars
ls .env.example 2>/dev/null && cat .env.example
```

Read the `scripts` block (or `Makefile` targets / task runner) line by line — those are the only commands the README may document. Identify the real entry points (`main`, `bin`, framework config) and any required tooling versions (`engines`, `.nvmrc`, `.python-version`, `rust-toolchain`).

> [!TIP]
> When a README example references a config file, port, or flag, open that file and confirm the value. A stale port or renamed flag is the most common drift, and the cheapest to verify.

## Step 3 — Diff claims against reality

Build a mental (or written) list of mismatches before editing. Sort each README claim into one of:

- **Stale** — documented but wrong now (renamed script, changed port, moved path, dead link).
- **Missing** — real and important but undocumented (a new script, a new env var, a new top-level dir).
- **Phantom** — documented but no longer exists in the code (removed feature, deleted command).
- **Correct** — matches the code; leave it exactly as is.

> [!WARNING]
> Resist scope creep. Do not reformat correct sections, reorder existing content, or restyle prose that is already accurate. Touch a line only because the code behind it changed.

## Step 4 — Update only what changed

Edit the README surgically, matching its existing voice and structure.

- Fix **stale** claims to the verified value (correct script name, current port, real path).
- Add **missing** items into the section where they belong, following the formatting of neighboring entries.
- Remove **phantom** claims, plus any examples, badges, or links that depended on them.
- Keep headings, ordering, code-fence languages, and tone identical to the original.

```bash
# Sanity-check that documented commands actually resolve
npm run            # lists the real scripts to compare against the README
```

If the README documents a quickstart, walk the steps in order and confirm each command exists in `package.json` (or the relevant manifest). Replace any command that does not resolve with the real one — never with a guess.

> [!NOTE]
> If a section is so far out of date that fixing it would mean rewriting it wholesale, flag that section in your report and ask before doing a full rewrite. This command corrects drift; it does not regenerate the README from scratch.

## Report

Summarize the edits as a tight changelog the author can scan:

```markdown
## README update — <section or "full audit">

### Changed
- `Scripts`: `npm run serve` → `npm run start` (renamed in package.json)
- `Quickstart`: dev port 3000 → 3001 (from package.json)

### Added
- `Scripts`: documented `npm run validate` (was missing)
- `Configuration`: `DATABASE_URL` from .env.example

### Removed
- `Features`: dropped "GraphQL playground" — no longer in the codebase

### Left as-is
- Installation, License (verified accurate)
```

For every line, name the file that justified the change so the author can verify it. Do not commit or push — leave the working tree for the author to review.
