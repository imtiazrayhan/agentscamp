---
name: "incident-postmortem-writer"
title: "Incident Postmortem Writer"
description: "Turn incident notes, alerts, chat logs, deploy history, and traces into a blameless, evidence-backed postmortem with impact, timeline, contributing conditions, detection and response gaps, and owned corrective actions. Use after a production incident, failed deployment, security event, or near miss when the team needs a durable learning document rather than a root-cause guess."
allowed-tools: "Read, Grep, Glob, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
topics: ["devops-infra", "review-qa"]
related: ["best-claude-skills-for-devops-sre", "runbook-writer", "slo-definer", "distributed-tracing-instrumenter", "alerting-rules-tuner", "incident-responder"]
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

1. **Establish the incident window.** Collect detection, start, mitigation, recovery, and full-resolution times. Normalize timestamps to one timezone while preserving source links.
2. **Build the factual timeline.** Merge alerts, deploys, logs, traces, tickets, and responder notes. Separate observed facts from inference. Resolve contradictions or list them explicitly.
3. **Quantify impact.** Record affected users, regions, tenants, requests, data, duration, revenue or operational impact, and SLO/error-budget consumption. State measurement gaps.
4. **Explain system behavior.** Describe the trigger, contributing technical and organizational conditions, failed or absent safeguards, and why the impact propagated. Avoid stopping at the first human action or component failure.
5. **Evaluate detection and response.** Explain what detected the incident, what should have, time to acknowledge and mitigate, which runbooks or tools helped, and where responders lacked information or safe controls.
6. **Record what went well.** Preserve defenses, decisions, automation, and coordination worth repeating—not as praise filler, but as operational knowledge.
7. **Create corrective actions.** Each action needs a specific change, owner, priority, due date, and verification method. Balance prevention, detection, containment, recovery, and learning; avoid “be more careful” and “add monitoring” without a defined signal.
8. **Review sensitive detail.** Remove secrets and unnecessary personal data. Coordinate disclosure for security, legal, or customer-facing facts without erasing engineering evidence from the controlled internal record.
9. **Track closure.** Link actions to tickets and define who verifies completion and effectiveness. A merged change is not complete until the intended risk reduction is tested.

> [!WARNING]
> Do not convert an unknown into a root cause to make the document feel complete. Label uncertainty, preserve competing hypotheses, and assign an investigation action with evidence needed to resolve it.

## Output

Create one Markdown postmortem containing:

- executive summary and quantified impact
- incident and response timeline with evidence links
- trigger, contributing conditions, and safeguard analysis
- detection, mitigation, recovery, and communication assessment
- what worked and what increased impact
- corrective-action table with owner, priority, due date, and verification
- open questions and explicitly labeled unknowns
- follow-up review date for action effectiveness
