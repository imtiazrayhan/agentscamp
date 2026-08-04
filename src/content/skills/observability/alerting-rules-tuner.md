---
name: "alerting-rules-tuner"
description: "Cut alert noise and make every page mean something — rewrite alerting rules to fire on user-felt symptoms (error rate, latency SLO burn, failed requests) instead of causes (high CPU, full disk), with duration windows and severity routing so only urgent, actionable conditions reach a human. Use when on-call is fatigued by low-value pages, when real incidents get missed in the noise, or when alerts fire on causes rather than impact."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Alerting Rules Tuner"
date: 2026-06-17
topics: ["devops-infra"]
related: ["skill:slo-definer", "skill:structured-logging-designer"]
featured: false
summary: "Most alert fatigue comes from paging on causes (CPU, memory, disk) instead of symptoms the user feels. This skill audits your rules, moves cause-metrics to dashboards, rewrites paging alerts to fire on error rate / latency / SLO burn with duration windows, routes by severity, dedups related alerts into one notification, and attaches an owner and runbook to every page."
faq:
  - q: "Should I ever page on CPU or disk?"
    a: "Only when there is nothing more user-facing to measure and a human must act before the symptom hits. A disk that will fill in 4 hours is a ticket; a disk filling in 10 minutes that will drop writes is arguably a page — but the better page is on the write-failure symptom itself. CPU is almost never a page: high CPU with healthy latency is fine, and high CPU with bad latency is already caught by the latency alert."
  - q: "How do I pick the duration window?"
    a: "Long enough that a momentary blip clears on its own, short enough that real degradation pages before the SLO is meaningfully spent. For fast burn use a short window (e.g. 2-5m at a high error rate); for slow burn use a long window (e.g. 1h at a lower rate). Multi-window burn-rate alerts combine both so you catch sudden outages and slow leaks without flapping."
---

On-call exhaustion is rarely an "alert quantity" problem you fix by muting things — it's an *altitude* problem. Pages fire on causes (a node at 95% CPU, a disk at 80%, a saturated thread pool) that may or may not hurt anyone, instead of on symptoms the user actually feels. This skill audits every rule against one question — *does this fire only when a human must act now?* — then rewrites the survivors to alert on symptoms with duration windows and severity routing, and demotes the rest to dashboards or tickets.

## When to use this skill
- On-call is fatigued: frequent pages that resolve themselves or need no action, night pages for non-urgent conditions.
- Real incidents get missed because they're buried under low-value noise, or everyone has muted the channel.
- Alerts fire on causes (CPU, memory, disk, queue depth, pod restarts) rather than user impact.
- One incident generates a storm of 50 correlated pages instead of one.
- You have alerts with no owner and no runbook — nobody knows what to do when they fire.
- Standing up alerting for a new service and want to start symptom-first instead of bolting on host metrics.

## Instructions

1. **Inventory the rules and classify each as symptom or cause.** Grep the alerting config (`*.yml`/`*.yaml` Prometheus rules, Datadog monitor exports, Grafana alert JSON, Alertmanager routes) for every rule that pages a human. For each, label it: **symptom** (something the user experiences — request errors, latency, failed checkouts, SLO burn) or **cause** (a resource or internal metric — CPU, memory, disk, GC pause, replica lag, restart count). Causes belong on dashboards, not pagers.

2. **Audit every paging rule with the single question.** For each rule ask: *does this fire only when a human must act, right now, with a clear action?* If the honest answer is "no" — it self-heals, it's informational, there's nothing to do at 3am — it is not a page. Downgrade it to a ticket or a dashboard panel. Keep paging only what's both urgent and actionable.

3. **Define the symptom alert set at the user boundary.** Replace cause-pages with the symptoms they were trying to predict: request error rate (5xx / total), latency at a percentile that matters (p99 over SLO), failed business transactions (checkout/login failures), and SLO error-budget burn rate. Measure these where the user is — at the load balancer / ingress / API edge — not deep inside one component.

4. **Add a duration window to every threshold.** No paging alert fires on an instantaneous value. Require the condition to hold `for: 5m` (tune per alert) so a single scrape blip or a 10-second spike clears itself. For graceful detection of both sudden outages and slow leaks, prefer multi-window, multi-burn-rate alerts (e.g. fast: 14.4x burn over 5m + 1h; slow: 6x over 30m + 6h) over a single fixed threshold.

5. **Alert on rate-of-change / burn, not raw levels, where the level is naturally noisy.** "Disk is 80% full" pages constantly and means nothing; "disk will fill within 4 hours at the current fill rate" is actionable and rarely false. Same for error budgets: page on burn rate, not on a single bad minute.

6. **Assign exactly one severity per rule and route accordingly.** Use three tiers and wire each to a destination: **page** (human-impacting, urgent, actionable → PagerDuty/Opsgenie, wakes someone), **ticket** (needs attention this week, not now → issue tracker), **info** (awareness only → Slack/dashboard, never pages). The default for anything you're unsure about is *not* page.

7. **Deduplicate and group correlated alerts into one notification.** One incident must produce one page, not fifty. Group by incident dimension (service, cluster, region) in Alertmanager `group_by` / Datadog grouping, set `group_wait`/`group_interval` so the storm coalesces, and add inhibition rules so a parent symptom (whole service down) suppresses the child causes (every dependent check failing).

8. **Attach an owner and a runbook link to every surviving alert.** Each paging rule gets an owning team (label/tag) and a `runbook_url` annotation pointing at concrete steps — first checks, dashboards, mitigation, escalation. If you can't write a runbook because there's no clear response, that's the signal the alert shouldn't page.

> [!WARNING]
> Paging on causes — CPU, memory, disk, queue depth — instead of user-felt symptoms is the single largest source of alert fatigue. A box can run hot all day while users are perfectly happy; a box can look idle while requests fail. Page on the symptom; keep the cause on a dashboard for when you're already investigating.

> [!WARNING]
> An alert with no runbook and no action is noise by definition. If the response to a page is "ack it and watch," it should not have woken anyone. Thresholds without a duration window flap on every transient spike — never ship a paging rule without a `for:` window.

## Output

A revised alerting plan, ready to apply to the config:

- **Symptom alert set** — a table of paging alerts: name, signal (the user-facing metric), threshold + duration window (or burn-rate windows), and severity. Every row is urgent and actionable.
- **Demoted rules** — the cause-metrics removed from paging, each annotated with where it went (dashboard panel name, or ticket-severity monitor) and why it isn't a page.
- **Routing + dedup map** — severity → destination table, the `group_by` keys, and inhibition rules (parent symptom suppresses child causes).
- **Ownership/runbook mapping** — for each surviving alert: owning team + `runbook_url`, flagging any alert that lacks a runbook as a candidate for deletion.
