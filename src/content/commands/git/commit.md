---
description: "Stage changes and write a Conventional Commits message describing them."
title: "Commit"
color: "purple"
topics: ["workflow-prompting"]
related: ["conventional-commits"]
---

Create a well-formed git commit for the current changes. Follow the steps below exactly, and only commit what the user intends.

## Scope

If `$ARGUMENTS` is provided, treat it as guidance for what to commit — for example specific paths to stage (`src/lib/auth.ts`), a hint about the change type (`fix`, `feat`), or a short description of intent. If `$ARGUMENTS` is empty, infer everything from the working tree.

## Step 1 — Inspect the working tree

Run these in parallel and read the output before doing anything else.

```bash
git status
git diff
git diff --staged
git log --oneline -10
```

- `git status` shows what is staged, unstaged, and untracked.
- `git diff` / `git diff --staged` reveal the actual content of the changes — read these to understand what happened, not just file names.
- `git log --oneline -10` shows the repository's existing message style. Match its tone and format where it does not conflict with the rules below.

## Step 2 — Stage the right files

Stage only files that belong in this commit.

```bash
# Stage specific paths derived from $ARGUMENTS or your analysis
git add src/lib/auth.ts src/lib/session.ts

# Or stage everything when all changes are part of one logical unit
git add -A
```

> [!WARNING]
> Do not blindly `git add -A` if the diff mixes unrelated work. Split unrelated changes into separate commits so history stays reviewable.

> [!NOTE]
> Never stage secrets, credentials, `.env` files, large build artifacts, or local-only config. If you see any in `git status`, stop and flag them to the user instead of committing.

## Step 3 — Write the message

Write a [Conventional Commits](https://www.conventionalcommits.org/) message:

```
<type>(<optional scope>): <short summary>

<optional body explaining what and why>

<optional footer: BREAKING CHANGE / issue refs>
```

### Rules for the subject line

- Use one of these `type` values:

| type | use for |
| --- | --- |
| `feat` | a new feature |
| `fix` | a bug fix |
| `docs` | documentation only |
| `style` | formatting, no logic change |
| `refactor` | code change that is neither a fix nor a feature |
| `perf` | performance improvement |
| `test` | adding or fixing tests |
| `build` | build system or dependencies |
| `ci` | CI configuration |
| `chore` | maintenance, tooling, misc |

- Keep the summary in the imperative mood ("add", not "added" or "adds").
- Lower-case the summary and omit the trailing period.
- Keep the subject line at or under 72 characters.

### Rules for the body

- Add a body only when the change needs explanation. Wrap lines at ~72 characters.
- Explain the *why* and the user-facing or behavioral impact — the diff already shows the *how*.
- For a breaking change, add a `BREAKING CHANGE:` footer describing the migration.

### Example

```
feat(auth): add refresh-token rotation

Issue short-lived refresh tokens and rotate them on every use to
limit the blast radius of a leaked token. Old tokens are revoked
on rotation.

Closes #142
```

## Step 4 — Commit and verify

Use a HEREDOC so multi-line messages render correctly.

```bash
git commit -m "$(cat <<'EOF'
feat(auth): add refresh-token rotation

Issue short-lived refresh tokens and rotate them on every use.

Closes #142
EOF
)"
```

Then confirm the result:

```bash
git status
git log -1 --stat
```

Report the final commit hash and subject line. Do not push unless the user explicitly asks.
