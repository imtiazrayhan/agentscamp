---
title: "10 Best Claude Skills for Security Work"
description: "Compare Claude skills for secrets, dependencies, permissions, auth, RBAC, threats, headers, PII, data retention, and LLM guardrails."
author: "AgentsCamp"
date: 2026-08-04
color: "red"
topics: ["ai-safety-security", "review-qa"]
tags: ["claude-skills", "security", "privacy", "application-security", "llm-security"]
featured: true
seoTitle: "10 Best Claude Skills for Security Work"
seoDescription: "Find Claude skills for secret scanning, dependency risk, least privilege, auth review, RBAC, threat models, headers, PII, retention, and LLM guardrails."
summary: "A practical Claude security toolkit uses separate skills for exposure, access, design, and data lifecycle. Start with secret-scanner, dependency-audit, least-privilege-auditor, and auth-flow-reviewer; add threat modeling, RBAC, headers, PII redaction, retention, or LLM guardrails when those boundaries are in scope."
keyTakeaways:
  - "Keep security review read-only first; authorize remediation only after confirming evidence, scope, and side effects."
  - "Secrets, vulnerable packages, excessive permissions, and broken authorization are different failure classes that need different checks."
  - "Data-retention-auditor follows sensitive data beyond the primary database into logs, analytics, caches, backups, and vendors."
  - "LLM guardrails need layered input, tool, output, and monitoring controls rather than one prompt instruction."
  - "No skill certifies compliance or replaces qualified security, privacy, or legal review."
faq:
  - q: "What Claude security skills should I install first?"
    a: "Start with secret-scanner, dependency-audit, least-privilege-auditor, and auth-flow-reviewer. They cover accidental exposure, third-party risk, excessive access, and identity enforcement—the most common review surfaces."
  - q: "Can Claude automatically fix every security finding?"
    a: "It should not by default. Credential rotation, policy changes, dependency upgrades, and authentication edits can disrupt live systems. Review the evidence and approve a scoped remediation with verification and rollback."
  - q: "Does data-retention-auditor provide legal compliance advice?"
    a: "No. It maps actual technical data flows and controls against requirements you provide. Legal interpretation, jurisdiction, exemptions, and compliance certification remain with qualified professionals."
  - q: "Which skill should I use for an LLM application?"
    a: "Use llm-guardrails-designer for layered controls, prompt-pii-redactor for sensitive inputs, threat-model-builder for the full architecture, and least-privilege-auditor for agent tools and service credentials."
related: ["best-claude-skills-for-code-review", "data-retention-auditor", "least-privilege-auditor", "secret-scanner", "threat-model-builder", "llm-guardrails-designer"]
---

The best Claude security skills split review into specific trust questions. Did a secret escape? Can a dependency be exploited? Does a principal have more access than necessary? Can one identity act as another? Where does sensitive data persist? A single “security audit” prompt usually answers all of these too shallowly.

Use focused, evidence-first skills and keep mutation outside the initial review.

| Skill | Best for | Main output | Default posture |
| --- | --- | --- | --- |
| [secret-scanner](/skills/security/secret-scanner) | Exposed credentials | Findings and containment steps | Read-only |
| [dependency-audit](/skills/security/dependency-audit) | Package vulnerabilities | Prioritized remediation | Read-only |
| [least-privilege-auditor](/skills/security/least-privilege-auditor) | IAM and token scopes | Excess-access report | Read-only |
| [auth-flow-reviewer](/skills/security/auth-flow-reviewer) | Identity and sessions | Trust-boundary review | Read-only |
| [rbac-designer](/skills/security/rbac-designer) | Role and permission models | RBAC matrix | Design |
| [threat-model-builder](/skills/security/threat-model-builder) | Architecture risk | Threat model | Design |
| [security-headers-hardener](/skills/security/security-headers-hardener) | Browser response policy | Header changes | May edit |
| [prompt-pii-redactor](/skills/security/prompt-pii-redactor) | LLM-bound sensitive data | Redaction pipeline | May edit |
| [data-retention-auditor](/skills/security/data-retention-auditor) | Data lifecycle and deletion | Lineage and control gaps | Read-only |
| [llm-guardrails-designer](/skills/security/llm-guardrails-designer) | Agent and LLM controls | Layered guardrail design | Design |

## 1. secret-scanner: contain exposed credentials

[secret-scanner](/skills/security/secret-scanner) inspects tracked files and relevant history for keys, tokens, passwords, and high-entropy values. A confirmed secret requires revocation or rotation before repository cleanup; deleting the string does not invalidate a credential already copied elsewhere.

## 2. dependency-audit: prioritize third-party risk

[dependency-audit](/skills/security/dependency-audit) turns scanner output and manifests into a risk-ranked upgrade plan. It considers reachability, exploitability, runtime exposure, fix availability, and breaking-change cost instead of treating every advisory as equally urgent.

## 3. least-privilege-auditor: reduce excessive access

[least-privilege-auditor](/skills/security/least-privilege-auditor) traces principals, actions, resources, conditions, inheritance, and credential paths across IAM, CI workflows, service accounts, Kubernetes RBAC, and application tokens. It proposes a narrower policy only after identifying what the workload actually performs.

## 4. auth-flow-reviewer: follow identity end to end

[auth-flow-reviewer](/skills/security/auth-flow-reviewer) reviews credential entry, session creation, token validation, identity propagation, authorization checks, refresh, logout, recovery, and account linking. Use it whenever authentication middleware or a privileged user journey changes.

## 5. rbac-designer: make authorization understandable

[rbac-designer](/skills/security/rbac-designer) maps resources and actions to roles while avoiding role explosion and hidden privilege inheritance. It is strongest before implementation or when an existing permissions model has become impossible to explain.

## 6. threat-model-builder: find missing controls early

[threat-model-builder](/skills/security/threat-model-builder) identifies assets, actors, entry points, trust boundaries, data flows, threats, existing mitigations, and residual risk. It focuses effort on realistic abuse paths rather than producing a generic threat checklist.

## 7. security-headers-hardener: protect browser boundaries

[security-headers-hardener](/skills/security/security-headers-hardener) reviews Content Security Policy, transport security, framing, MIME sniffing, referrer behavior, browser capabilities, and cross-origin isolation. Roll out restrictive policies with reporting and compatibility checks rather than breaking production integrations at once.

## 8. prompt-pii-redactor: minimize LLM exposure

[prompt-pii-redactor](/skills/security/prompt-pii-redactor) identifies sensitive values before they reach model providers, logs, traces, or eval datasets. It defines detection, replacement, reversibility, false-positive handling, and safe observability around the redaction step.

## 9. data-retention-auditor: trace every copy

[data-retention-auditor](/skills/security/data-retention-auditor) follows sensitive fields through databases, object stores, queues, logs, analytics, search indexes, caches, exports, backups, and vendors. It compares actual TTL, deletion, and restoration behavior with the supplied policy without pretending to provide legal certification.

## 10. llm-guardrails-designer: layer model controls

[llm-guardrails-designer](/skills/security/llm-guardrails-designer) designs controls around input classification, retrieval, prompt injection, tool authorization, output validation, content policy, rate limits, human approval, and monitoring. No single model instruction should be the only boundary protecting a privileged action.

## Recommended security stack

Install the four broad review skills first, then add specialists based on architecture:

```bash
npx agentscamp add skills/secret-scanner
npx agentscamp add skills/dependency-audit
npx agentscamp add skills/least-privilege-auditor
npx agentscamp add skills/auth-flow-reviewer
```

Require each report to include evidence location, impact, exploit or failure preconditions, confidence, remediation, and verification. A finding without a reproducible path should remain a hypothesis, not become an urgent production change.
