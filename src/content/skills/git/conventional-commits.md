---
name: "conventional-commits"
description: "Generate clear Conventional Commits messages from staged changes. Use when committing code and you want a well-structured, consistent commit message."
date: 2026-06-03
allowed-tools: "Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["workflow-prompting"]
featured: true
summary: "A skill that turns staged changes into a spec-compliant Conventional Commits message: it reads the staged diff, picks the right type and scope, writes an imperative subject under 72 characters, adds a why-focused body for non-trivial changes, marks breaking changes with ! and a BREAKING CHANGE footer, then commits after the user confirms."
---

This skill inspects your staged changes and produces a commit message that follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. It picks the right type and scope, writes a concise imperative subject, adds a body explaining the *why* when the change is non-trivial, and flags breaking changes correctly — so your history stays readable and your tooling (changelogs, semantic-release) keeps working.

## When to use this skill

- You have changes staged with `git add` and want to commit them.
- You want a consistent, spec-compliant message instead of free-form text.
- You are unsure which type (`feat`, `fix`, `chore`, …) fits the change.
- Your repo uses semantic versioning or automated changelog generation that depends on commit conventions.

> [!NOTE]
> This skill only reads and commits what is **already staged**. Stage the exact hunks you want first (`git add -p`). It will not stage files for you.

## Instructions

1. Read the staged diff to understand what actually changed:
   ```bash
   git diff --cached
   ```
   If nothing is returned, stop and tell the user there are no staged changes to commit.
2. Check the staged file list for scope hints (directory or package names):
   ```bash
   git diff --cached --name-only
   ```
3. Choose the **type** from the staged changes:
   - `feat` — a new user-facing capability
   - `fix` — a bug fix
   - `docs` — documentation only
   - `style` — formatting, no logic change
   - `refactor` — code change that neither fixes a bug nor adds a feature
   - `perf` — performance improvement
   - `test` — adding or correcting tests
   - `build` / `ci` — build system or pipeline changes
   - `chore` — maintenance, deps, tooling
4. Derive an optional **scope** in parentheses from the affected area (e.g. `auth`, `api`, `parser`). Omit it if the change is broad.
5. Write the **subject** line: `type(scope): summary`
   - Imperative mood ("add", not "added" or "adds").
   - No trailing period; aim for 50 characters, hard limit 72.
6. If the change is non-trivial, add a blank line then a **body** explaining the motivation and any context the diff alone does not convey. Wrap at ~72 columns.
7. If the change breaks compatibility, mark it: append `!` after the type/scope (e.g. `feat(api)!:`) **and** add a `BREAKING CHANGE:` footer describing the migration.
8. Add footers for issue references when relevant (e.g. `Refs: #123`, `Closes: #456`).
9. Present the proposed message to the user for confirmation, then commit:
   ```bash
   git commit -m "feat(parser): add support for nested arrays" \
     -m "Handles arbitrarily deep nesting by recursing on bracket pairs." \
     -m "Closes: #128"
   ```

## Examples

Suppose `git diff --cached --name-only` shows `src/auth/session.ts` and the diff replaces a 1-hour token TTL with a configurable value, removing the old constant.

```text
feat(auth)!: make session token TTL configurable

Replace the hardcoded 1-hour TTL with SESSION_TTL_SECONDS so deployments
can tune session lifetime without a rebuild. Falls back to 3600 when the
variable is unset.

BREAKING CHANGE: the SESSION_MAX_AGE constant has been removed. Set the
SESSION_TTL_SECONDS environment variable instead.

Closes: #214
```

Commit it:

```bash
git commit \
  -m "feat(auth)!: make session token TTL configurable" \
  -m "Replace the hardcoded 1-hour TTL with SESSION_TTL_SECONDS so deployments can tune session lifetime without a rebuild. Falls back to 3600 when the variable is unset." \
  -m "BREAKING CHANGE: the SESSION_MAX_AGE constant has been removed. Set the SESSION_TTL_SECONDS environment variable instead." \
  -m "Closes: #214"
```
