---
name: "incident-postmortem-writer"
title: "Incident Postmortem Writer"
description: "Turn incident notes, alerts, chat logs, deploy history, and traces into a blameless, evidence-backed postmortem with impact, timeline, contributing conditions, detection and response gaps, and owned corrective actions. Use after a production incident, failed deployment, security event, or near miss when the team needs a durable learning document rather than a root-cause guess."
allowed-tools: "Read, Grep, Glob, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["devops-infra", "review-qa"]
audience: ["developers", "devops"]
related: ["guide:best-claude-skills-for-devops-sre", "skill:runbook-writer", "skill:slo-definer", "skill:distributed-tracing-instrumenter", "skill:alerting-rules-tuner", "agent:incident-responder"]
featured: true
summary: "Builds a blameless postmortem from evidence: normalizes the timeline, quantifies customer and SLO impact, distinguishes trigger from contributing conditions, evaluates detection and mitigation, and writes corrective actions with owner, priority, due date, and verification. Unknowns remain labeled instead of becoming a confident single-root-cause story."
faq:
  - q: "What makes a postmortem blameless?"
    a: "It explains how system design, information, incentives, tooling, and safeguards made each action reasonable at the time. Blameless does not mean consequence-free or vague; it replaces individual blame with specific system conditions and accountable improvements."
  - q: "Should a postmortem identify one root cause?"
    a: "Usually not. Incidents emerge from a trigger interacting with latent conditions and failed safeguards. A single root-cause label often hides the detection, rollback, capacity, testing, and coordination changes that would prevent recurrence."
---

Write a learning document grounded in evidence. Preserve uncertainty and avoid blame, invented precision, and action items that cannot be verified.

## Workflow

1. **Establish the incident window.** Collect five timestamps and normalize them to UTC, keeping a link to the source of each: impact start, detection (first alert or report), acknowledgement, mitigation (impact stops growing or ends), and full resolution. Derive the intervals from them and never estimate one that the evidence does not support:

   | Interval | From | To |
   |---|---|---|
   | Time to detect | impact start | detection |
   | Time to acknowledge | detection | acknowledgement |
   | Time to mitigate | impact start | mitigation |
   | Time to resolve | impact start | full resolution |

   If impact start is known only as a range, report the range.

2. **Build the factual timeline.** Merge alerts, deploys, logs, traces, tickets, and responder notes into one table with columns `Time (UTC) | Event | Source | Kind`, where kind is `observed` (an artifact shows it) or `inferred` (reasoned from other entries). Refer to people by role ("on-call engineer", "incident commander") unless the team's convention is to use names. Resolve contradictions between sources or list both versions.

3. **Quantify impact.** Record affected users, regions, tenants, requests, data, duration, revenue or operational impact, and SLO or error-budget consumption. Show the arithmetic so a reader can check it: failed requests divided by total requests in the window, with the query or dashboard it came from. Where a number is unavailable, write "not measured" and say what instrumentation would have provided it.

4. **Explain system behavior.** Describe the trigger, contributing technical and organizational conditions, failed or absent safeguards, and why the impact propagated. For each decision a responder or author made, state what information they had at the time and why the action was reasonable given it. Do not stop at the first human action or component failure: keep asking what allowed that step to cause harm until you reach a condition the team can change.

5. **Evaluate detection and response.** Explain what detected the incident, what should have, the intervals from step 1, which runbooks or tools helped, and where responders lacked information or safe controls. If a customer report arrived before an alert, say so plainly.

6. **Record what went well.** Preserve defenses, decisions, automation, and coordination worth repeating as operational knowledge, with the same evidence standard as the failures.

7. **Create corrective actions.** Each action needs a specific change, owner, priority, due date, and verification method. Cover at least one action each for prevention, detection, and mitigation speed, or state why a category has none. Reject actions that cannot be verified and rewrite them:

   | Too vague | Verifiable |
   |---|---|
   | "Be more careful with config changes" | "Config changes to the payment service require a passing validation job in CI; verified by a deliberately invalid change being blocked" |
   | "Add monitoring" | "Page when checkout 5xx rate exceeds 2% for 5 minutes; verified by replaying the incident traffic in staging" |
   | "Improve the runbook" | "Add the connection-pool rollback steps to the database runbook; verified by an engineer outside the team completing it in a game day" |

8. **Review sensitive detail.** Remove secrets and unnecessary personal data. Coordinate disclosure for security, legal, or customer-facing facts without erasing engineering evidence from the controlled internal record.

9. **Track closure.** Link actions to tickets and define who verifies completion and effectiveness. A merged change is not complete until the intended risk reduction is tested.

Write the document to the repository's existing postmortem directory if one exists (search for `postmortem`, `incident`, or `rca` in docs); otherwise ask where it should go. Name the file with the incident date and a short slug, for example `2026-11-14-checkout-5xx.md`.

> [!WARNING]
> Do not convert an unknown into a root cause to make the document feel complete. Label uncertainty, preserve competing hypotheses, and assign an investigation action with evidence needed to resolve it.

## Output

Create one Markdown postmortem with this skeleton. The content shown is fictional; delete any section you cannot support and say why in Open questions.

```markdown
# Postmortem: Checkout errors, 2026-11-14

Status: draft · Severity: SEV-2 · Author: (role) · Review date: 2026-11-21

## Summary
For 47 minutes, about 18% of checkout requests returned 5xx after a connection-pool
setting was lowered in a routine deploy. Mitigated by rollback.

## Impact
- 14:02 to 14:49 UTC (47 minutes)
- 12,940 of 71,800 checkout requests failed (18.0%); source: gateway dashboard, query linked
- Error budget: 61% of the 30-day budget consumed
- Revenue impact: not measured (no order-attempt to order-completion join exists)

## Timeline (UTC)
| Time | Event | Source | Kind |
|---|---|---|---|
| 13:58 | Deploy 8841 lowers pool size from 50 to 10 | deploy log | observed |
| 14:02 | 5xx rate rises above 1% | gateway metrics | observed |
| 14:19 | First customer report | support ticket | observed |
| 14:23 | Latency alert pages on-call | alert history | observed |
| 14:26 | On-call acknowledges the page | alert history | observed |
| 14:41 | Pool exhaustion identified as cause | incident channel | inferred |
| 14:49 | Rollback complete, 5xx back to baseline | deploy log, metrics | observed |

Time to detect 17 min (customer report; first alert at 21 min) · acknowledge 7 min · mitigate 47 min

## What happened
Trigger, contributing conditions, safeguards that failed or were absent.

## Detection and response
What detected it, what should have, what slowed mitigation.

## What went well

## Corrective actions
| Action | Category | Owner | Priority | Due | Verification | Ticket |
|---|---|---|---|---|---|---|

## Open questions
- Why did the 5xx alert not fire at 14:02? Hypotheses: threshold too high; alert scoped to the old route. Owner and evidence needed.

## Follow-up review
Date and person who checks that actions reduced the risk.
```
