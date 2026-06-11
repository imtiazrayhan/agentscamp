---
name: "secret-scanner"
description: "Scan a repo or a diff for committed secrets — API keys, tokens, private keys, .env files, and high-entropy strings — then triage real leaks from fixtures. Use before pushing, in review, or when a credential may have leaked."
date: 2026-06-03
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["review-qa"]
featured: true
related: ["security-auditor", "dependency-audit"]
summary: "A skill that scans a repo, diff, or history for committed secrets — provider key prefixes, private keys, .env files, connection strings, and high-entropy values — then triages real leaks from fixtures and placeholders. For each true positive it prescribes rotating the credential first, then scrubbing history, since a pushed secret is compromised."
---

Find credentials that should never be in version control — provider API keys, OAuth tokens, private keys, database URLs, and `.env` files — across a whole repo or a single diff. The skill greps for known key shapes, flags high-entropy strings, then triages each hit: real leak vs. example/test fixture vs. placeholder. For confirmed leaks it tells you the only safe remediation — **rotate the credential and scrub history** — because a secret that reached `git` is already compromised the moment it was pushed.

## When to use this skill

- Before pushing a branch or opening a PR, to catch a credential that slipped into a commit.
- During review of a diff that touches config, CI, infrastructure, or `.env*` files.
- After a suspected leak, to find every place a key appears across the working tree and history.
- When onboarding a repo and you want a baseline audit of what secrets may already be committed.

> [!WARNING]
> Deleting a secret from the latest commit does **not** remove it from history — it stays in every prior commit, every clone, and every fork. Any matched real key must be treated as compromised: **rotate it first**, then scrub history. Deletion alone is not remediation.

## Instructions

1. **Define the scan target.** Decide between the working tree (`git ls-files`), a specific diff (`git diff main...HEAD`), or full history (`git log -p` / a dedicated history scanner). Diff scans are fast for PRs; full-tree scans catch already-committed leaks. Make the scope explicit in your report.
2. **Detect existing tooling and ignore rules — do not guess.** Check for `.gitleaks.toml`, `.trufflehog*`, `detect-secrets` baselines, or a `pre-commit` config. If a scanner is already configured, run it (`gitleaks detect`, `trufflehog filesystem .`) and honor its allowlist. Read `.gitignore` to see what *should* have been excluded but wasn't.
3. **Grep for known secret shapes.** Search for provider-specific prefixes and structural patterns rather than generic words: `AKIA`/`ASIA` (AWS), `ghp_`/`gho_`/`github_pat_` (GitHub), `sk-`/`sk-proj-` (OpenAI), `xox[baprs]-` (Slack), `AIza` (Google), `-----BEGIN .* PRIVATE KEY-----`, JWTs (`eyJ`), and connection strings (`postgres://`, `mongodb+srv://` with embedded credentials). Also glob for committed `.env`, `.env.*`, `*.pem`, `*.p12`, `id_rsa`, and `*.keystore` files.
4. **Flag high-entropy strings.** For assignments like `token = "..."`, `secret: ...`, `password=...`, score the value's Shannon entropy; long base64/hex strings with high entropy near a secret-ish identifier are candidates even without a known prefix.
5. **Triage every hit.** This is the core of the skill — separate true positives from noise: a value in `*.example`, `*.sample`, `fixtures/`, `test/`, or a docs snippet, or an obvious placeholder (`xxx`, `your-key-here`, `changeme`, `dummy`, all-zeros) is a **false positive**. A live-looking value in real config, source, or CI is a **true positive**. When unsure, mark it `review` rather than dismissing it.
6. **Verify the finding set.** Re-run your matches with `git grep -n` to attach exact `file:line` locations, and confirm each true positive is reachable in a tracked file (not just an ignored local file). For history claims, verify with `git log -p -S '<fragment>'`.
7. **Report and remediate.** Output a triaged findings table (file, line, type, verdict). For every true positive, give the two-step fix in order: **(1) rotate** the credential at the provider and invalidate the old one; **(2) scrub history** with `git filter-repo --replace-text` or BFG, then force-push and have collaborators re-clone. Flag any `review` items needing human judgment and recommend adding a pre-commit secret scanner to prevent recurrence.

> [!NOTE]
> Rotation comes before scrubbing. Scrubbing hides the secret going forward but cannot un-leak what was already pushed; only rotation makes the exposed value worthless.

## Examples

Triaged output for a branch diff:

```text
$ git diff main...HEAD | secret-scanner

Findings (4 matches, scope: diff main...HEAD)

| File                          | Line | Type                | Verdict        |
|-------------------------------|------|---------------------|----------------|
| src/config/aws.ts             | 12   | AWS access key (AKIA) | TRUE POSITIVE  |
| .env                          | 1    | committed .env file | TRUE POSITIVE  |
| test/fixtures/stripe.json     | 8    | Stripe TEST key (sk_test_) | false positive |
| README.md                     | 44   | placeholder API key | false positive |

2 true positives. ACTION REQUIRED.

src/config/aws.ts:12  AKIAIOSFODNN7EXAMPLE...
  -> ROTATE: deactivate this access key in IAM and issue a new one.
  -> SCRUB:  git filter-repo --replace-text <(echo 'AKIAIOSFODNN7EXAMPLE==>REMOVED')
            then force-push; ask collaborators to re-clone.

.env:1  contains DATABASE_URL with embedded password
  -> ROTATE: change the database password now.
  -> SCRUB:  git rm --cached .env && add `.env` to .gitignore, then filter-repo
            to purge it from history.

Recommendation: add gitleaks as a pre-commit hook to block future leaks.
```

> [!WARNING]
> The `sk_test_` Stripe key and the README placeholder are intentionally inert — flagging them as incidents wastes responder time and erodes trust in the scanner. Triage before you alarm.
