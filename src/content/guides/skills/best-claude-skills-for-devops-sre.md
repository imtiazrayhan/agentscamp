---
title: "10 Best Claude Skills for DevOps and SRE"
description: "Use Claude skills for incidents, rollbacks, SLOs, alerts, dashboards, logs, traces, containers, CI, and safer releases."
author: "AgentsCamp"
date: 2026-08-04
color: "orange"
topics: ["devops-infra", "workflow-prompting"]
tags: ["claude-skills", "devops", "sre", "incident-response", "observability", "ci-cd"]
featured: true
seoTitle: "10 Best Claude Skills for DevOps and SRE"
seoDescription: "Compare Claude skills for incident postmortems, rollback plans, SLOs, alerts, dashboards, logging, tracing, Dockerfiles, CI, and canary releases."
summary: "A practical Claude SRE toolkit spans the full operational loop: define reliability with slo-definer, instrument logs and traces, tune alerts and dashboards, plan canaries and rollbacks, and turn incidents into corrective action with incident-postmortem-writer. Keep production mutations behind explicit human approval."
keyTakeaways:
  - "Use Claude skills to prepare and analyze operational work, but require explicit approval for production changes."
  - "SLOs should drive alerts and dashboards; otherwise observability becomes a collection of unrelated signals."
  - "Every risky release needs both a rollout plan and a rollback decision with measurable triggers."
  - "Incident-postmortem-writer separates evidence, impact, contributing conditions, and corrective actions without assigning blame."
  - "Logging and tracing skills are complementary: logs explain events while traces connect latency and failures across services."
faq:
  - q: "What is the best Claude skill for incident response?"
    a: "During an incident, use runbook-writer output and existing observability to guide approved actions. After stabilization, incident-postmortem-writer reconstructs the evidence-based timeline and corrective actions. It should not invent missing events."
  - q: "Can Claude safely make production changes?"
    a: "Production mutations carry high risk. Use these skills for analysis, plans, configuration drafts, and verification commands, then keep deployment, rollback, credential, and infrastructure changes behind explicit human authorization."
  - q: "Which skills should a small team install first?"
    a: "Start with slo-definer, structured-logging-designer, alerting-rules-tuner, rollback-plan-writer, and incident-postmortem-writer. Together they cover targets, evidence, detection, recovery, and learning."
  - q: "Is a canary plan the same as a rollback plan?"
    a: "No. A canary plan controls exposure and promotion; a rollback plan defines how to restore a known-safe state, including compatibility checks, triggers, commands, owners, and verification. Use both for risky changes."
related: ["guide:best-claude-skills-2026", "skill:incident-postmortem-writer", "skill:rollback-plan-writer", "skill:slo-definer", "skill:alerting-rules-tuner", "skill:canary-release-planner"]
---

The best Claude skills for DevOps and SRE support a cycle: set reliability targets, collect useful signals, detect actionable failures, release gradually, recover safely, and learn from incidents. Installing only a Docker or CI helper leaves most of that cycle uncovered.

The skills below produce plans and artifacts you can review. Production actions should remain explicit, scoped, and human-approved.

| Skill | Best for | Main output | Production mutation? |
| --- | --- | --- | --- |
| [incident-postmortem-writer](/skills/observability/incident-postmortem-writer) | Learning after incidents | Evidence-based postmortem | No |
| [rollback-plan-writer](/skills/release/rollback-plan-writer) | Safe recovery planning | Executable rollback plan | No |
| [slo-definer](/skills/observability/slo-definer) | Reliability targets | SLIs, objectives, and budgets | No |
| [alerting-rules-tuner](/skills/observability/alerting-rules-tuner) | Actionable paging | Tuned alert rules | Config draft |
| [dashboard-designer](/skills/observability/dashboard-designer) | Operational views | Dashboard specification | Config draft |
| [structured-logging-designer](/skills/observability/structured-logging-designer) | Searchable events | Logging schema and instrumentation | Code edits |
| [distributed-tracing-instrumenter](/skills/observability/distributed-tracing-instrumenter) | Cross-service latency | Trace instrumentation | Code edits |
| [dockerfile-optimizer](/skills/workflow/dockerfile-optimizer) | Smaller, safer images | Dockerfile improvements | File edits |
| [github-actions-optimizer](/skills/workflow/github-actions-optimizer) | Faster, safer CI | Workflow improvements | File edits |
| [canary-release-planner](/skills/release/canary-release-planner) | Controlled exposure | Staged rollout plan | No |

## 1. incident-postmortem-writer: learn from evidence

[incident-postmortem-writer](/skills/observability/incident-postmortem-writer) assembles alerts, logs, tickets, chat timestamps, deploy events, and mitigation records into one timeline. It separates confirmed facts from inference, quantifies impact where possible, identifies contributing conditions, and assigns corrective actions with owners and verification.

Use it after the service is stable. The postmortem is not a live-response substitute and should never fill timeline gaps with invented certainty.

## 2. rollback-plan-writer: prepare recovery before release

[rollback-plan-writer](/skills/release/rollback-plan-writer) identifies the last known-safe state, compatibility constraints, rollback triggers, responsible owner, exact actions, and post-rollback checks. It explicitly handles changes that cannot be reversed by redeploying an old artifact, including schema migrations and one-way data transformations.

## 3. slo-definer: decide what reliability means

[slo-definer](/skills/observability/slo-definer) translates a user journey into a measurable service-level indicator, target, window, and error budget. Good SLOs create a shared basis for alert thresholds and release decisions; they are not vanity uptime numbers detached from user experience.

## 4. alerting-rules-tuner: make pages actionable

[alerting-rules-tuner](/skills/observability/alerting-rules-tuner) reviews noisy or late alerts against impact and operator action. It adjusts windows, thresholds, grouping, and routing while preserving the signal that indicates an SLO is at risk.

## 5. dashboard-designer: show decisions, not every metric

[dashboard-designer](/skills/observability/dashboard-designer) organizes panels around questions: Is the user journey healthy? Where is the failure? What changed? Is the mitigation working? It defines each query, unit, aggregation, time range, and drill-down instead of producing a wall of charts.

## 6. structured-logging-designer: standardize operational events

[structured-logging-designer](/skills/observability/structured-logging-designer) creates consistent event names and fields, correlation identifiers, severity rules, and redaction boundaries. It improves searchability without encouraging sensitive payload dumps or uncontrolled high-cardinality fields.

## 7. distributed-tracing-instrumenter: connect service boundaries

[distributed-tracing-instrumenter](/skills/observability/distributed-tracing-instrumenter) adds spans at meaningful boundaries and propagates context across HTTP, queues, jobs, and database calls. It focuses attributes on diagnosis while avoiding secrets and unbounded dimensions.

## 8. dockerfile-optimizer: improve build and runtime images

[dockerfile-optimizer](/skills/workflow/dockerfile-optimizer) examines build context, cache layers, multi-stage builds, package installation, user privileges, and runtime contents. It validates the built image instead of assuming a shorter Dockerfile is automatically better.

## 9. github-actions-optimizer: tighten CI

[github-actions-optimizer](/skills/workflow/github-actions-optimizer) targets duplicated work, ineffective caches, broad token permissions, unpinned actions, and weak concurrency controls. Use it after measuring which jobs dominate feedback time or when a workflow gains new privileges.

## 10. canary-release-planner: limit blast radius

[canary-release-planner](/skills/release/canary-release-planner) defines stages, cohorts, observation windows, health signals, promotion criteria, stop conditions, and ownership. Pair it with `rollback-plan-writer`: a controlled rollout still needs a tested way back.

## A small-team SRE stack

Start with one skill for each stage: `slo-definer`, `structured-logging-designer`, `alerting-rules-tuner`, `rollback-plan-writer`, and `incident-postmortem-writer`.

```bash
npx agentscamp add skills/slo-definer
npx agentscamp add skills/structured-logging-designer
npx agentscamp add skills/alerting-rules-tuner
npx agentscamp add skills/rollback-plan-writer
npx agentscamp add skills/incident-postmortem-writer
```

Before using any generated operational command, verify the environment, target, credentials, expected blast radius, abort condition, and recovery path. Claude can make the procedure clearer; authorization still belongs to the operator.

## Continue exploring

- [cloud-architect](/agents/infrastructure-devops/cloud-architect) — Use this agent to design a cloud architecture on AWS, GCP, or Azure — compute, networking, data stores, IAM, and cost trade-offs.
- [kubernetes-specialist](/agents/infrastructure-devops/kubernetes-specialist) — Use this agent for Kubernetes — manifests, Helm, troubleshooting, scaling, and resource tuning.
- [Background Job Reliability Auditor](/skills/observability/background-job-reliability-auditor) — Audit scheduled jobs, queue consumers, workers, and asynchronous workflows for delivery assumptions, idempotency, retries, poison messages, concurrency, timeouts, checkpoints,…
- [9 Best Claude Skills for Release Management](/guides/skills/best-claude-skills-for-release-management) — Use Claude skills for readiness reviews, canaries, rollbacks, API deprecations, migrations, versioning, changelogs, and release notes.
