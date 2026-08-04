---
name: "release-notes-writer"
title: "Release Notes Writer"
description: "Write user-facing release notes — the curated 'what's new and what it means for you' — by starting from the real changes (git log / merged PRs / the changelog since the last release) and translating developer-speak into user impact, grouped by what the user cares about with breaking changes and required actions surfaced first. Use when shipping a release to users or customers and the raw commit log isn't something a user should read, when you need a published GitHub-release / blog / in-app announcement, or when a breaking change must be made unmissable so upgrades don't break."
allowed-tools: "Read, Grep, Glob, Bash, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["devops-infra"]
related: ["skill:changelog-from-prs", "skill:semver-advisor", "skill:version-bumper", "skill:migration-writer"]
featured: false
summary: "Release notes are not a commit dump. This skill starts from the real changes since the last release, drops internal churn, and translates the rest into user-benefit language — grouped New / Improved / Fixed, with breaking changes and required migration steps surfaced first and unmissable, plus upgrade steps and doc links ready to publish."
---

A changelog records *what changed*; release notes explain *what it means for the person upgrading*. Pasting raw conventional-commit lines into a release fails users twice: it buries the two things they actually need under twenty refactors and dependency bumps, and it hides the one breaking change that will take down their integration on upgrade. This skill reads the real changes since the last release, throws away the churn users don't care about, translates the rest into impact-and-action language grouped the way a user thinks (New / Improved / Fixed), and puts breaking changes and required steps at the top where they cannot be missed.

## When to use this skill

- You are shipping a release to end users or API consumers and the commit log / changelog is not something they should read.
- You need a GitHub release body, a "what's new" blog post, or an in-app changelog entry — not an internal diff.
- A release contains a breaking change or a required migration and you need it surfaced first, with the exact action spelled out.
- You have a draft changelog (e.g. from `changelog-from-prs`) and need to convert it into something audience-appropriate and benefit-led.

## Instructions

1. **Start from the real changes, not memory.** Establish the range from the last released tag and pull the actual shipped work — never invent items or summarize from what you "think" landed.

   ```bash
   LAST_TAG=$(git describe --tags --abbrev=0)
   git log "$LAST_TAG"..HEAD --no-merges --pretty='%s'
   gh pr list --state merged --search "merged:>$(git log -1 --format=%cI "$LAST_TAG")" \
     --json number,title,labels,body --limit 200
   ```
   If a `CHANGELOG.md` already covers this range, read it as the source of record instead of re-deriving from commits.

2. **Identify the audience and pin the voice.** End users, API consumers, and self-hosting operators need different notes. Look at where this publishes (`README`, app store text, GitHub release, developer docs) and at past release notes for tone. API/SDK consumers need exact symbol/endpoint names and code; end users need plain-language benefit and a screenshot-level description, not the function that changed.

3. **Drop the churn.** Remove everything a user cannot observe: internal refactors, test-only changes, CI/build config, dependency bumps with no behavior change, lint/format, doc-internal edits. A 60-commit release is often 5 user-facing notes. Keep a dependency bump *only* if it fixes a user-visible bug or a known CVE the user is exposed to — and say which.

4. **Extract breaking changes and required actions first — this is the part that breaks systems if you get it wrong.** Scan PR bodies/commits for `BREAKING`, `!` in conventional-commit type, removed/renamed exports, flags, endpoints, config keys, changed defaults, and tightened validation. For each, write: what changed, who it affects, and the **exact action** the user must take to upgrade safely (the command, the renamed field, the config edit), with a link to a migration guide if one exists. Cross-check against the SemVer bump — a major bump with zero listed breaking changes means you missed one.

5. **Group the rest by what the user cares about, in benefit language.** Use **New** (capabilities they didn't have), **Improved** (things that got faster/better/clearer), **Fixed** (bugs that affected them). Rewrite each from implementation to impact: not "refactor `ExportService` to stream rows" but "Exports of large datasets no longer time out." For notable new features add a one-line *how to use it* (the flag, the menu, the endpoint). Order within each group by how many users it affects, not by PR number.

6. **Append upgrade instructions and links.** Give the concrete upgrade step for this project (`npm i pkg@2.0.0`, the container tag, the migration command) and link the full changelog, the migration guide, and relevant docs for new features. Keep PR/issue references only where a user might want the detail — don't litter end-user notes with `(#1423)`.

7. **Lead with a one-line summary and write the header.** Open with a single sentence a user can skim ("v2.0 adds scheduled exports and a JSON API; one breaking change to the auth header"). Then breaking/action-required, then New / Improved / Fixed, then upgrade steps. Emit it as Markdown ready to paste — publish nothing yourself.

> [!WARNING]
> Release notes are not a commit dump. Pasting raw conventional-commit lines (`feat:`, `chore(deps):`, `refactor:`) buries the few items users need under noise they cannot act on, and makes the notes look auto-generated and untrustworthy. Translate to impact and delete the rest.

> [!CAUTION]
> A breaking change hidden mid-list — or omitted because it "looked small" — is how you break your users' systems on upgrade. Every removed/renamed flag, changed default, tightened validation, or altered response shape goes in a **Breaking changes / action required** block at the very top, with the exact migration step. If the SemVer bump is major but you wrote no breaking items, stop and re-scan; you missed one.

## Output

Publishable release notes — breaking-first, benefit-led — ready to paste into a GitHub release, blog post, or in-app changelog:

```markdown
# v2.0.0 — 2026-06-17

Scheduled exports and a new JSON API. **One breaking change:** the API auth header was renamed — update integrations before upgrading.

## ⚠️ Breaking changes — action required
- **Auth header renamed `X-Token` → `Authorization: Bearer <key>`.** Requests using `X-Token` now return `401`. Update your client before upgrading. See the [migration guide](https://docs.example.com/migrate/v2).
- **`export` config key `format: csv` is no longer the default** — it now defaults to `json`. Add `format: csv` explicitly to keep the old behavior.

## New
- **Scheduled exports.** Set a cron in Settings → Exports to deliver reports automatically — no more manual runs.
- **JSON API for reports.** Pull report data programmatically via `GET /api/v2/reports`. See the [API docs](https://docs.example.com/api).

## Improved
- Exports of large datasets no longer time out — they now stream and complete in seconds.
- Faster dashboard load on accounts with many projects.

## Fixed
- Fixed a crash when a saved filter referenced a deleted field.
- Times now display in the account's timezone instead of UTC.

## Upgrade
1. Update auth headers per the breaking change above.
2. `npm i your-pkg@2.0.0` (or pull image tag `:2.0.0`).
3. Run `your-cli migrate` to apply the config default change.

[Full changelog](https://github.com/org/repo/compare/v1.6.0...v2.0.0)
```
