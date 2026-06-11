---
name: "changelog-from-prs"
description: "Draft a release changelog by summarizing merged pull requests since the last tag. Use when preparing a release or writing release notes."
date: 2026-06-03
version: "1.0.0"
color: "cyan"
topics: ["workflow-prompting"]
summary: "A skill that drafts a release changelog from the pull requests merged since the last tag: it collects PRs via the GitHub CLI, classifies each into Keep a Changelog sections using labels and title prefixes, rewrites titles into reader-facing notes with PR numbers, leads with breaking changes, and suggests the version bump — publishing nothing."
---

Turn a range of merged pull requests into a clean, human-readable changelog. This skill collects the PRs merged since the previous release tag, groups them by change type (features, fixes, breaking changes, and more), and drafts release notes that are accurate, scannable, and ready to paste into a GitHub release or `CHANGELOG.md`.

## When to use this skill

- You are cutting a new release and need release notes that reflect what actually shipped.
- You want a first draft of a `CHANGELOG.md` entry that follows [Keep a Changelog](https://keepachangelog.com/) conventions.
- You need to summarize a noisy list of merge commits into something a human reader can understand.
- You are reviewing what changed between two tags before deciding on a version bump.

> [!NOTE]
> This skill drafts notes from real PR data. It does not push tags or publish releases. Always review the draft before publishing.

## Instructions

1. **Find the last release tag.** Use the most recent semantic-version tag as the lower bound. If no tag exists, fall back to the first commit.

   ```bash
   git describe --tags --abbrev=0
   ```

2. **Collect merged PRs in the range.** Prefer the GitHub CLI so you get titles, numbers, authors, and labels. Use the merge date of the last tag as the cutoff.

   ```bash
   LAST_TAG=$(git describe --tags --abbrev=0)
   SINCE=$(git log -1 --format=%cI "$LAST_TAG")
   gh pr list --state merged --base main --limit 200 \
     --search "merged:>$SINCE" \
     --json number,title,author,labels,mergedAt
   ```

3. **Classify each PR.** Map it to a changelog section using labels first, then the title prefix (Conventional Commits style), then a judgment call:
   - `feat` / `enhancement` -> **Added** or **Changed**
   - `fix` / `bug` -> **Fixed**
   - `breaking` / `!` in the title -> **Breaking Changes** (call these out at the top)
   - `deprecate` -> **Deprecated**
   - `security` -> **Security**
   - `docs`, `chore`, `ci`, `test`, dependency bumps -> omit unless user-facing.

4. **Rewrite titles into reader-facing notes.** Drop the type prefix, use the imperative-to-past or noun phrasing the section expects, and explain the user impact rather than the implementation. Keep the PR number for traceability.

5. **Order and group.** Lead with breaking changes, then Added, Changed, Deprecated, Removed, Fixed, Security. Within a section, order by importance, not PR number.

6. **Suggest the version bump.** Breaking changes -> major; new features -> minor; fixes only -> patch. State the recommendation but let the user confirm.

7. **Emit the draft.** Output Markdown ready to paste, with a version header and date. Note any PRs you could not confidently classify so the user can review them.

> [!WARNING]
> Do not invent changes. If a PR title is ambiguous, list it under an "Uncategorized — needs review" heading instead of guessing its impact.

## Examples

**Input** — three merged PRs since `v1.3.0`:

```
#142  feat: add --json output flag to export command   (label: enhancement)
#147  fix: prevent crash when config file is empty      (label: bug)
#151  feat!: rename `--token` to `--api-key`            (label: breaking)
```

**Output** — drafted changelog entry:

```markdown
## v1.4.0 — 2026-06-02

### Breaking Changes
- Renamed the `--token` flag to `--api-key` for clarity. Update scripts that pass `--token`. (#151)

### Added
- `export` now supports a `--json` flag for machine-readable output. (#142)

### Fixed
- Fixed a crash that occurred when the config file was empty. (#147)

> Recommended bump: minor → major (contains a breaking change). Suggested version: v2.0.0.
```
