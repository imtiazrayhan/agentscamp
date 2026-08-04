---
name: "runbook-writer"
description: "Write an operational runbook a half-asleep on-call engineer can execute at 3am — scoped to ONE alert, leading with how to confirm the problem, the copy-pasteable mitigation that stops user pain, then diagnosis, escalation, and verification. Use when an alert has no documented response, after an incident exposed a missing procedure, or when standing up on-call for a service."
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["devops-infra"]
related: ["skill:slo-definer", "skill:structured-logging-designer", "skill:github-actions-optimizer", "skill:load-test-designer"]
featured: false
summary: "A skill that writes a single-symptom operational runbook for a 3am responder: confirm the problem is real, mitigate to stop user pain (with the literal copy-pasteable command), then diagnose, escalate, and verify recovery. Every step is an imperative command with expected output and a link — no judgment calls, no hand-waving."
---

Write the document the on-call engineer opens when a pager fires at 3am — and can actually follow. The skill takes one alert or symptom and produces a runbook in the order a responder needs it: **confirm → mitigate → diagnose → escalate → verify**. It mines the repo for the real commands, dashboards, and service names, writes each step as a literal instruction with its expected output ("run X; if you see Y, do Z"), and front-loads the mitigation that stops user pain *before* any investigation. The result stops bleeding first and explains second.

## When to use this skill

- An alert fires with no documented response — the responder is reverse-engineering the system at the worst possible time.
- A postmortem found that recovery was slow because the procedure lived only in one person's head.
- You're onboarding on-call for a service and need a runbook per page-worthy alert before the rotation starts.
- An existing runbook is prose-heavy ("investigate the root cause") and unusable under stress.

## Instructions

1. **Scope to ONE symptom — refuse the generic doc.** A runbook answers exactly one page: `HighErrorRate on checkout-api`, `ReplicaLag > 30s`, `DiskUsage > 90% on db-primary`. If the user asks for an "operations runbook," push back and split it — one alert per file. Name it after the alert that links to it (`docs/runbooks/checkout-api-high-error-rate.md`), so the pager's "runbook" link lands here. Search existing alert rules (`grep -ri "alert\|expr:" prometheus*.yml *.rules.yml`) to use the alert's exact name.
2. **Open with the fast path, not background.** The first thing on the page is a one-line summary of what's broken and the user impact ("Checkout returns 500s — customers can't pay"), then a **TL;DR mitigation** block: the single command that most often stops the pain. The responder should be able to act from the top of the file without scrolling. Save architecture and theory for the bottom (or omit it).
3. **Step 1 is always CONFIRM — is this real?** Give the exact way to verify the alert isn't a flapping false positive: the literal dashboard URL, the PromQL/log query to paste, or the curl/CLI command, plus the expected output that means "yes, real." Mine the repo for these — read dashboard JSON, `*.rules.yml`, health-check endpoints, and `Makefile`/`justfile` targets — rather than inventing command names. Example: `kubectl -n prod get pods -l app=checkout-api` → "all should be `Running`; `CrashLoopBackOff` confirms the alert."
4. **Step 2 is MITIGATE — stop the bleeding before diagnosing.** This is the most important section and it comes *before* root-cause work. Give the copy-pasteable command to roll back, fail over, restart, scale up, or feature-flag-off — with real paths, namespaces, and service names from the repo. State what each command does and how to know it worked. Order options by safety and speed (rollback to last-good deploy usually beats live debugging). Never make the reader derive the command.
5. **Step 3 is DIAGNOSE — only now look for cause.** Numbered, branching steps in `run X → if you see Y → do Z` form. Every step is a literal command with expected output and the decision it drives. No step may say "investigate," "look into," "check if there's an issue," or any phrase that offloads a judgment call onto a stressed human — convert each into a concrete check with a concrete next action. Link the relevant logs query, trace view, and the service's SLO/error-budget dashboard.
6. **Write ESCALATE with names and triggers.** State exactly *when* to page the next person and *who*: "If mitigation hasn't restored success rate within 15 min, page the #payments on-call via PagerDuty service `checkout-api`." Include the secondary/owning team, any vendor support path, and the threshold (duration, error count, blast radius) that makes escalation mandatory rather than optional.
7. **End with VERIFY — confirm recovery, don't assume it.** Give the explicit check that service is restored: the same dashboard/query from step 1 showing healthy values, with the threshold to watch ("error rate back under 0.5% for 5 consecutive minutes"). Include any cleanup (re-enable the flag you turned off, scale back down) and a one-line prompt to capture timeline notes for the postmortem.
8. **Keep every command current and report assumptions.** Verify each command against the repo (binary names, namespaces, flags, env). Flag any command you could not confirm against a real file so the user tests it before relying on it. A command you guessed is worse than no command — it sends the responder down a dead end at 3am.

> [!WARNING]
> A runbook full of "investigate the issue" or "check the logs and determine the cause" is useless at 3am — it just restates the panic. Every step must be a literal command with an expected output and an explicit next action. Equally, a runbook with a stale or never-executed command fails at the exact moment it's needed: treat unverified commands as bugs, and have someone dry-run the mitigation path in staging before trusting it.

## Output

A single Markdown file at `docs/runbooks/<alert-name>.md` for one symptom, ordered **confirm → mitigate → diagnose → escalate → verify**, with a TL;DR mitigation at the top, literal copy-pasteable commands, expected outputs, decision branches, and links to the dashboard / logs / trace view / SLO. The skill reports the file path and any command it could not verify against the repo.

```markdown
# Runbook: checkout-api — HighErrorRate

**Impact:** Checkout returns 500s — customers cannot complete payment.
**Alert:** `HighErrorRate{service="checkout-api"}` (fires at 5xx > 2% for 3m)
**Dashboard:** https://grafana.internal/d/checkout-api/overview

## TL;DR mitigation
Roll back to the last-good deploy — fixes ~80% of these pages:

    kubectl -n prod rollout undo deployment/checkout-api

Success rate should recover within ~2 min on the dashboard above.

## 1. Confirm it's real

    kubectl -n prod get pods -l app=checkout-api

Expect all `Running`. Any `CrashLoopBackOff`/`Error` confirms the alert.
Cross-check the 5xx panel: https://grafana.internal/d/checkout-api/overview

## 2. Mitigate (stop the bleeding)

1. If a deploy went out in the last hour → `kubectl -n prod rollout undo deployment/checkout-api`.
2. If pods are healthy but the DB is the source → fail over reads:
   `kubectl -n prod set env deployment/checkout-api READ_REPLICA=db-replica-2`
3. If a downstream dependency is down → disable checkout behind the flag:
   `curl -XPOST https://flags.internal/api/checkout_enabled -d '{"value":false}'`

Confirm recovery on the dashboard before moving on.

## 3. Diagnose

- Run `kubectl -n prod logs -l app=checkout-api --since=10m | grep -i error`.
  If you see `connection refused: payments-svc` → page payments (step 4).
  If you see `pq: too many connections` → scale the pool: `kubectl -n prod set env deployment/checkout-api DB_POOL_MAX=40`.
- Traces: https://tempo.internal/explore?service=checkout-api
- SLO / error budget: https://grafana.internal/d/checkout-api/slo

## 4. Escalate
If success rate is not restored within 15 min, page **#payments on-call**
via PagerDuty service `checkout-api`. For DB failover that won't recover,
page **#platform-db**. Vendor (Stripe) status: https://status.stripe.com

## 5. Verify
- 5xx rate back under 0.5% for 5 consecutive minutes on the dashboard.
- Re-enable any flag you toggled: `curl -XPOST .../checkout_enabled -d '{"value":true}'`.
- Note start/detect/mitigate/resolve timestamps for the postmortem.
```
