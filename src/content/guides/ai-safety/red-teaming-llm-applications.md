---
title: "Red-Teaming LLM Applications: From Attack Cases to Regression Tests"
description: "Red-team an LLM application across prompts, RAG, tools, agents, and data boundaries — scope assets, generate attacks, score impact, fix, and retest in CI."
author: "AgentsCamp"
date: 2026-08-04
color: "red"
topics: ["ai-safety-security", "llm-evals"]
tags: ["red-teaming", "prompt-injection", "jailbreaks", "agent-security", "testing"]
featured: true
summary: "LLM red-teaming is structured adversarial testing of the complete application, not only the base model. A useful campaign maps assets, trust boundaries, tools, data, and high-impact actions; tests direct and indirect attacks; scores exploitability and impact; and converts confirmed failures into regression cases. The objective is to limit blast radius when a model is manipulated."
keyTakeaways:
  - "Test the application boundary—retrieval, tools, memory, identities, and side effects—not only whether the model says prohibited text."
  - "Start from assets and attacker goals, then map every untrusted input channel and privileged action across trust boundaries."
  - "Cover direct prompts, indirect content, multi-turn attacks, encoding and transformation, tool abuse, data exfiltration, and resource exhaustion."
  - "Score findings by reproducibility, required access, user interaction, privilege gained, and real-world impact rather than dramatic transcripts."
  - "Fix the system layer that owns the control, then preserve the attack as an automated regression with deterministic assertions where possible."
faq:
  - q: "What is LLM red-teaming?"
    a: "LLM red-teaming is authorized adversarial testing that tries to make a model-powered application violate its security, safety, privacy, or business requirements. It probes the whole system—including prompts, retrieval, tools, memory, permissions, and output handling—not just the foundation model."
  - q: "What is the difference between a jailbreak and prompt injection?"
    a: "A jailbreak tries to bypass the model's behavioral restrictions. Prompt injection places hostile instructions in user or external content so the application follows them instead of its intended task. Agentic applications must test both because injected instructions can reach tools and data even without prohibited model content."
  - q: "Can prompt injection be completely prevented?"
    a: "No general model-only defense eliminates prompt injection. Defend in depth: treat external content as untrusted data, minimize privileges, validate tool arguments and outputs, isolate secrets, require human approval for high-impact actions, and test continuously so a successful manipulation has limited consequences."
  - q: "Should red-team tests run in CI?"
    a: "Stable, reproducible attacks should become regression tests. Run deterministic policy and permission checks on every change, and run slower model-based attack suites on an appropriate schedule or release gate. Keep exploratory campaigns as a separate activity that discovers new cases for the automated suite."
related: ["glossary:red-teaming", "glossary:prompt-injection", "glossary:jailbreak", "guide:defending-prompt-injection", "guide:owasp-agentic-top-10", "command:red-team-llm", "agent:prompt-injection-auditor", "skill:llm-guardrails-designer", "tool:promptfoo"]
howtoSteps:
  - name: "Define scope and authorization"
    text: "Name the target environment, accounts, data, tools, allowed techniques, time window, stop conditions, and owners before sending adversarial inputs."
  - name: "Map assets and trust boundaries"
    text: "Inventory sensitive data, privileged actions, identities, retrieval sources, memory, and every channel through which untrusted content enters the system."
  - name: "Build the attack matrix"
    text: "Cross attacker goals with direct, indirect, multi-turn, transformed, tool-mediated, cross-tenant, and resource-exhaustion techniques."
  - name: "Execute and score evidence"
    text: "Record the exact setup and result, reproduce successful attacks, and prioritize by access required, reliability, privilege gained, and user impact."
  - name: "Mitigate and preserve regressions"
    text: "Fix the owning system control, prove the exploit no longer succeeds, and add the minimized case to automated security evaluation."
---

**LLM red-teaming is authorized adversarial testing of a model-powered application.** It asks whether an attacker can make the system disclose data, misuse a tool, cross a tenant boundary, evade policy, corrupt memory, consume excessive resources, or cause an unsafe external action.

The unit under test is the application, not the base model. A chatbot with no tools has a different blast radius from an agent that reads email, queries customer records, writes code, and can deploy it. The same model behavior can be a harmless refusal failure in one system and a critical security finding in another.

## Establish authorization and safety first

A red-team campaign needs written scope:

- target environment and versions
- test accounts, tenants, and credentials
- data that may and may not be accessed
- tools and external systems in bounds
- allowed attack techniques and traffic volume
- people to contact and conditions that stop testing
- how evidence will be stored and disclosed

Use a sandbox or staging environment with synthetic data whenever possible. Do not test destructive actions against production merely because the agent exposes them. For third-party models and services, stay within provider policies and the authorization your organization actually controls.

## Model the system before generating attacks

Inventory four things:

1. **Assets** — secrets, personal data, proprietary documents, payment authority, source code, and reputation.
2. **Untrusted channels** — user prompts, uploaded files, web pages, retrieved documents, tool results, email, tickets, images, and memory written by previous sessions.
3. **Privileged capabilities** — file writes, shell commands, database access, messages, purchases, deployments, account changes, and identity delegation.
4. **Trust boundaries** — where data or authority moves between users, tenants, services, plugins, tools, and execution environments.

The attack plan should connect an attacker-controlled channel to an asset or capability across a boundary. Random collections of clever prompts generate entertaining transcripts but weak coverage.

## Build an attack matrix

Test each important attacker goal through several delivery mechanisms:

| Goal | Direct | Indirect | Multi-turn | Tool or state mediated |
| --- | --- | --- | --- | --- |
| Override instructions | User prompt | Retrieved page or document | Gradual role or context manipulation | Tool output containing hostile instructions |
| Exfiltrate data | Ask for hidden context | Poisoned source requests disclosure | Establish false authorization | Query or export tool abuse |
| Cause an action | Explicit malicious request | Instructions embedded in content | Build trust before requesting action | Manipulated arguments or confused identity |
| Cross boundaries | Claim another role or tenant | Document references another user's data | Session-state confusion | Missing object-level authorization in tools |
| Exhaust resources | Huge or recursive input | Retrieval expansion | Repeated retry pressure | Tool loops, fork bombs, or unbounded browsing |

Vary transformations: quoting, translation, encoding, markup, images, code blocks, and structured fields. Test conflicting instructions at different positions and from different sources. The purpose is not to discover a magic phrase; it is to see which trust boundaries the system fails to preserve when instructions arrive in unexpected forms.

## Cover the application-specific failure classes

### Direct jailbreaks

Probe whether users can bypass behavioral policy through framing, roleplay, obfuscation, repeated examples, or multi-turn escalation. Score the result against the application's actual policy, not an undefined sense of harmfulness.

### Indirect prompt injection

Place hostile instructions inside content the system retrieves or reads: documents, issue bodies, web pages, tool responses, and metadata. Verify the application keeps trusted task instructions separate from untrusted content and does not treat retrieved text as authority.

### Tool and agent abuse

Attempt to make the model select a tool outside the user's intent, invent or alter arguments, repeat a side effect, bypass approval, or chain individually safe tools into a harmful result. Validate authorization at the tool boundary; a prompt is not an access-control system.

### Data leakage and tenant isolation

Test system prompts, secrets in context, other users' memory, cross-tenant identifiers, cached responses, trace viewers, and retrieval filters. Include object-level authorization cases where a valid user substitutes another resource ID.

### RAG and memory poisoning

Insert misleading, conflicting, stale, or hostile documents and observe source selection, citation, and downstream actions. Test whether untrusted content can persist into memory and influence later sessions after the original attack input is gone.

### Availability and cost

Probe oversized context, recursive tool use, repeated fallback, broad retrieval, expensive fan-out, and non-terminating plans. Set step, token, time, cost, and concurrency budgets so the system fails closed before one request becomes an incident.

## Record reproducible evidence

For every finding, capture:

- target version and configuration
- attacker access and prerequisites
- exact input sequence and relevant external content
- model, route, tools, and permissions active
- expected control and observed violation
- trace or logs with sensitive data redacted
- reproduction frequency across repeated attempts
- concrete asset, privilege, or user impact

A one-off odd response is a lead. A reproducible path from untrusted input to unauthorized impact is a finding.

## Prioritize the consequence, not the spectacle

Score findings using factors such as:

- access required: anonymous, ordinary user, privileged user, internal source
- user interaction required
- reliability and repeatability
- data sensitivity or action privilege reached
- scope: one session, one tenant, many tenants, or system-wide
- detectability and recovery

An agent saying offensive text may be a serious product-policy failure. An ordinary user causing a hidden cross-tenant export is a critical security failure. Keep those taxonomies related but distinct so remediation lands with the right owner.

## Fix controls at the layer that owns them

Common mitigations include:

- keep secrets out of model-visible context
- label and isolate untrusted content
- minimize tool availability and credential scope
- enforce authentication and authorization in tool handlers
- validate arguments against server-side state
- make side effects idempotent
- require human confirmation for high-impact actions
- sandbox code and file operations
- constrain retrieval by tenant and source trust
- cap steps, tokens, time, and spend
- validate outputs before they reach downstream systems

Guardrails and classifiers can catch known attacks, but they do not replace privilege boundaries. Assume some adversarial prompts will reach the model and design the rest of the system so model manipulation buys little.

## Convert findings into regression tests

Minimize each successful attack while preserving the failure, then add it to a versioned security eval dataset. Prefer deterministic assertions for authorization, tool selection, argument validation, secrets, and side-effect counts. Use model-based grading for policy or semantic failures, calibrated against human labels.

Run cheap deterministic controls in normal CI. Run slower adversarial suites on releases or a schedule. Track pass rate by attack class and criticality; never let a higher average hide a reopened critical path.

Exploratory red-teaming should continue outside CI because attackers change technique and new product capabilities create new boundaries. The automated suite is institutional memory, not the end of discovery.

> [!WARNING]
> A filter that blocks the test phrase without closing the underlying permission path is not a fix. Retest semantic variants and verify the privileged action or data access is impossible at the system boundary.

Start with [Defending Prompt Injection](/guides/ai-safety/defending-prompt-injection) for architecture, use the [Red Team LLM](/commands/review/red-team-llm) command for a structured campaign, and apply the [Prompt Injection Auditor](/agents/quality-security/prompt-injection-auditor) to map trust boundaries before active testing.
