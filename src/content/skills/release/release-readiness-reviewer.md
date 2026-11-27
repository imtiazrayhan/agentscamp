---
name: "release-readiness-reviewer"
title: "Release Readiness Reviewer"
description: "Review whether a specific release is ready to ship by checking scope, tests, compatibility, migrations, configuration, observability, rollout, rollback, support, security, and ownership against explicit evidence. Use before a production deployment, major version, risky feature launch, migration, or go/no-go meeting."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "green"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["devops-infra", "review-qa"]
audience: ["developers", "devops"]
related: ["guide:best-claude-skills-for-release-management", "skill:canary-release-planner", "skill:rollback-plan-writer", "skill:migration-writer", "skill:changelog-from-prs", "skill:dependency-audit"]
featured: true
summary: "Produces an evidence-backed go, conditional-go, or no-go for one release. It pins the release commit, buckets the diff by risk, then checks CI on that exact commit, mixed-version compatibility, migrations, config, observability, rollout, and rollback, marking each item verified, claimed, or missing."
faq:
  - q: "What is the difference between release readiness and a release checklist?"
    a: "A checklist names required areas; a readiness review resolves each item against evidence for the specific release, exposes unknowns and blockers, and assigns a go/no-go recommendation with owners."
  - q: "Can a release be ready if rollback is impossible?"
    a: "Sometimes, but only with explicit recognition of the irreversible change, stronger rehearsal and rollout controls, a forward-recovery plan, narrower exposure, and accountable approval."
---

Judge one release from current evidence and name what remains unresolved. This is a read-only review: run inspection commands, never deploy, merge, tag, or change configuration.

Every readiness item ends in one of four evidence states:

| State | Meaning |
|---|---|
| `verified` | You saw the artifact: command output, a CI run on the release commit, a file and line, a linked dashboard or ticket |
| `claimed` | Someone says it is done, but nothing you can inspect backs it |
| `missing` | No evidence, or the evidence contradicts the claim |
| `n/a` | Does not apply to this release, with a one-line reason |

Only `verified` and `n/a` count toward a go.

## Workflow

1. **Pin the release identity.** Resolve the release to an immutable commit and find what it is being compared against. If the user names a branch, report against the resolved SHA and say so.

   ```bash
   git rev-parse --verify <release-ref>
   git describe --tags --abbrev=0 <release-ref>^      # previous release tag
   git log --oneline <prev-tag>..<release-ref>
   git diff --stat <prev-tag>..<release-ref>
   ```

   Record target environment, intended window, release owner, and on-call owner. If any of those are unknown, ask once; if they stay unknown they become `missing` rows, not assumptions.

2. **Bucket the diff and set the risk class.** Run `git diff --name-only <prev-tag>..<release-ref>` and sort every path into: schema or data migrations, configuration and environment, dependency manifests and lockfiles, CI and deploy definitions, API contracts (OpenAPI, protobuf, GraphQL schema, event schemas), feature-flag definitions, application code.

   - **High**: a migration that drops, renames, or retypes a column; any one-way data transformation; changes on auth, payment, or billing paths; a major-version dependency bump; infrastructure or network changes.
   - **Medium**: additive migrations, new environment variables or secrets, a new external dependency or outbound call, a flag-guarded feature.
   - **Low**: everything else.

   The risk class sets how much evidence steps 5 to 7 require. High risk needs a rehearsed migration and a tested recovery path; low risk does not.

3. **Check test evidence on the exact commit.** A green badge on an older commit is not evidence.

   ```bash
   gh run list --commit <sha> --json workflowName,conclusion,headSha
   gh pr checks <pr-number> --required
   ```

   List every check that is failing, skipped, cancelled, or still running. Search the diff for newly skipped tests (`.skip(`, `xit(`, `@pytest.mark.skip`, `t.Skip(`) and treat each as an open item. For each changed behavior, name the test that covers it or mark the row `missing`.

4. **Check compatibility across mixed versions.** During a rolling deploy the previous and new versions run at the same time against the new schema, and clients may lag by weeks. For each contract change answer: does the previous app version still work after this migration runs? Does the new version work before it runs? A removed or renamed column, field, enum value, or event property that the previous version still reads is a blocker unless the removal ships in a later release (expand, deploy, then contract). New required request fields and removed response fields are breaking for external clients.

5. **Check data and configuration.** For each migration record: additive or destructive, whether a down migration exists, whether it rewrites or locks a large table, and whether the backfill is separated from the schema change. For configuration, list every variable the diff newly reads (search added lines for `process.env.`, `os.environ`, `os.Getenv`, or the project's config loader) and confirm each exists in the target environment by name. Never print or copy a secret value.

6. **Confirm observability and support.** Name the dashboard, the alert, and the log or trace query that would show this release failing, plus the on-call owner for the rollout window. A new code path with no signal that separates success from failure is an open item. For user-visible changes, confirm support has release notes and known-symptom guidance.

7. **Review rollout and recovery.** Require stages with exposure percentages, a bake time per stage, and numeric abort thresholds (for example "abort if 5xx rate exceeds baseline by 1 percentage point for 5 minutes"). Then ask the two recovery questions: has the rollback mechanism been exercised for this service, and is rolled-back code compatible with data written by the new version? If rollback is impossible, require a written forward-recovery plan and a narrower first stage.

8. **Issue the decision.** Apply these rules in order.

   - **No-go** if any of these hold: required checks are not green on the release commit; a destructive or one-way migration has no rehearsed recovery; a breaking contract change has a known consumer that has not migrated; a required secret or config value is absent in the target; nobody is named as on-call for the rollout window.
   - **Conditional go** if every remaining `claimed` or `missing` row has an owner, a deadline that falls before the stage it protects, and a named piece of evidence that will close it.
   - **Go** only when every row is `verified` or `n/a`.

   Keep accepted risks separate from blockers, and name who accepted each one.

> [!WARNING]
> Do not turn unknowns into implicit acceptance. An unverified migration, missing owner, or untested rollback stays visible in the decision as `claimed` or `missing`.

## Output

Return the review in this shape (the values below are fictional):

```markdown
# Release readiness: checkout-api v4.12.0
Commit 3f9c2ab (compared with v4.11.3) · production · window 2026-12-02 14:00 UTC
Risk class: HIGH (retypes orders.total, new env var TAX_API_URL)
Decision: CONDITIONAL GO

| Area | State | Evidence |
|---|---|---|
| CI on release commit | verified | gh run list: 6/6 workflows success on 3f9c2ab |
| Migration 0147 | verified | additive column + separate backfill job; down migration present |
| Mixed-version compatibility | verified | v4.11.3 does not read orders.total_cents (grep: 0 hits) |
| TAX_API_URL in production | missing | not present in deploy/values-prod.yaml |
| Rollback | claimed | "tested last quarter", no run linked |
| Alerting | verified | alerts/checkout.yaml: 5xx burn-rate alert covers /v2/orders |

## Blockers
None.

## Conditions
1. Add TAX_API_URL to production config. Owner: Priya. Due before stage 1. Evidence: merged config PR.
2. Link a rollback rehearsal run. Owner: Marco. Due before stage 2 (25%).

## Accepted risks
- Backfill runs about 40 minutes at reduced priority. Accepted by: release owner.

## Post-deploy verification
- POST /v2/orders smoke test returns 201 with total_cents populated
- Abort if 5xx on /v2/orders exceeds 1% for 5 minutes, or p95 latency doubles against the pre-deploy hour
```

State which commands you ran and which evidence you could not access, so a reader can tell an unchecked area from a clean one.
