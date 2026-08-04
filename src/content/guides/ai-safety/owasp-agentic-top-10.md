---
title: "Securing AI Agents: The OWASP Agentic Top 10 in Practice"
description: "Agents add risks LLM-app security misses — autonomy, tools, memory, multi-agent trust. The key OWASP agentic threats and how to mitigate each in practice."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["ai-safety-security"]
tags: ["ai-agents", "security", "owasp", "ai-safety", "guardrails"]
featured: false
summary: "An agent doesn't just generate text — it acts, with tools, memory, and autonomy, widening the attack surface beyond the OWASP LLM Top 10. OWASP's agentic resources catalog the new threats: memory poisoning, tool misuse, privilege compromise, goal manipulation, cascading failures, and rogue agents. The cross-cutting defenses are least privilege, human oversight, and audit."
keyTakeaways:
  - "Agentic security extends, not replaces, the OWASP Top 10 for LLM Applications — autonomy, tools, memory, and multi-agent interaction add threats an LLM-app threat model misses."
  - "Excessive agency (LLM06) is the root multiplier: the more an agent can do autonomously, the more any single compromise can do. Minimize tools, scopes, and autonomy."
  - "Memory poisoning, tool misuse, and goal manipulation (often via prompt injection) are the most common practical entry points — guard the inputs to memory, tools, and goals."
  - "Cascading failures and rogue agents make multi-agent systems fragile: one bad output or compromised agent propagates, so add verification checkpoints and inter-agent trust boundaries."
  - "Four cross-cutting controls cover most of the list: least privilege, human-in-the-loop for high-impact actions, full observability/audit of every action, and guardrails on inputs and outputs."
faq:
  - q: "What is the OWASP Agentic Top 10?"
    a: "OWASP's GenAI Security Project publishes two agentic resources: the 'Agentic AI — Threats and Mitigations' taxonomy (T1–T15) and the newer 'OWASP Top 10 for Agentic AI Applications' (ASI01–ASI10). Both catalog threats specific to agents — memory poisoning, tool misuse, privilege compromise, goal hijacking, cascading failures, identity spoofing, and more — that arise once an LLM can act autonomously with tools, memory, and other agents. They complement the OWASP Top 10 for LLM Applications, which covers LLM-app risks in general; the agentic lists focus on what changes when the model takes actions."
  - q: "How is securing an AI agent different from securing an LLM app?"
    a: "An LLM app generates text; an agent takes actions — it calls tools, persists memory, makes multi-step decisions, and sometimes coordinates with other agents. That autonomy turns vulnerabilities into consequences: a prompt injection in a chatbot produces a bad answer, but in an agent it can trigger a real action (sending data, spending money, deleting records). So agent security adds concerns the LLM Top 10 doesn't fully cover — tool misuse, memory poisoning, excessive agency, inter-agent trust, and the need to audit and approve actions — on top of the underlying LLM risks."
  - q: "What is excessive agency in AI agents?"
    a: "Excessive agency (LLM06 in the OWASP LLM Top 10) is when an agent has more capability, permission, or autonomy than its task requires — too many tools, overly broad credentials, or the ability to take high-impact actions without oversight. It's the root risk multiplier: every other compromise (injection, poisoned memory, a manipulated goal) does more damage when the agent it hijacks can do more. The mitigation is least privilege — minimal tools, narrowly scoped permissions, and human approval gates on consequential actions."
  - q: "How do I secure an AI agent in production?"
    a: "Apply four cross-cutting controls. Least privilege: give the agent the minimum tools, permissions, and autonomy for its task. Human-in-the-loop: require approval for high-impact or irreversible actions. Observability: log and trace every action, tool call, and memory write so the system is auditable and non-repudiable. Guardrails: validate inputs (against injection and poisoning) and outputs (against policy, leakage, and unsafe actions). Then map the specific agentic threats — memory poisoning, tool misuse, cascading failures, rogue agents — to your architecture and close the gaps."
related: ["guide:defending-prompt-injection", "agent:prompt-injection-auditor", "agent:agent-reliability-reviewer", "skill:human-in-the-loop-gate", "skill:llm-guardrails-designer", "tool:nemo-guardrails"]
---

The OWASP Top 10 for LLM Applications is the right starting point for LLM security — but it largely treats the LLM as something that *produces text*. An **agent** is different: it produces *actions*. It calls tools, writes to memory, plans across many steps, and sometimes works alongside other agents. That autonomy is exactly what makes agents useful and exactly what widens the attack surface. OWASP's **Agentic Security Initiative** (part of the GenAI Security Project) catalogs the threats that emerge once the model can act — and this guide walks the key ones with practical mitigations.

> [!NOTE]
> OWASP publishes **two** agentic resources, and this guide draws on both: the **"Agentic AI — Threats and Mitigations"** taxonomy (T1–T15, from the Agentic Security Initiative) and the newer **"OWASP Top 10 for Agentic AI Applications"** (ASI01–ASI10). The threats below are a **practitioner-selected set** from that work — the ones that bite most in practice — not a restatement of the official ASI01–ASI10 numbering. Use it as a working checklist, and consult OWASP's published lists for the canonical entries.

## The root multiplier: excessive agency

Before the specific threats, the one that amplifies all of them: **excessive agency** (LLM06). An agent with more tools, broader credentials, or more autonomy than its task needs turns every other vulnerability into a bigger blast radius. A prompt injection against a read-only agent is annoying; against an agent that can wire money it's a breach. **Minimize what the agent can do** — fewest tools, tightest scopes, least autonomy — and most of the list below shrinks with it.

## The threats that matter in practice

### 1. Memory poisoning

An agent's persistent memory is an input like any other — and a durable one. If untrusted content gets written into long-term memory, it influences every future decision. **Mitigate:** validate and scope what enters memory, track provenance, isolate memory per user/session, and don't let retrieved or tool content silently become trusted memory.

### 2. Tool misuse

The agent is induced — often via injection — to call a legitimate tool in a harmful way (exfiltrate via a "send" tool, destructive parameters on a "delete"). **Mitigate:** least-privilege tools, strict argument validation and bounds, and human approval for dangerous or irreversible tool calls.

### 3. Privilege compromise

The agent's credentials or permissions are broader than needed, or can be escalated. **Mitigate:** scope every credential to the minimum, separate read from write, use per-task/just-in-time permissions, and never hand the agent a god-mode token.

### 4. Goal manipulation & intent breaking

The agent's objective is subverted — via prompt injection, poisoned context, or crafted inputs — so it pursues the attacker's goal instead of yours. **Mitigate:** trust boundaries on all external content (see [Defending Against Prompt Injection](/guides/ai-safety/defending-prompt-injection)), input guardrails, and verifying that actions still serve the original task.

### 5. Cascading failures

In multi-step or multi-agent flows, one bad output (a hallucination, a wrong tool result) feeds the next step and compounds. **Mitigate:** verification checkpoints between steps, bounded retries, and human review at high-stakes junctions so errors don't silently snowball.

### 6. Identity spoofing & impersonation

An attacker (or a rogue agent) impersonates a user, service, or another agent to gain trust or access. **Mitigate:** strong authentication between agents and services, signed/verified inter-agent messages, and not granting trust based on a claimed identity alone.

### 7. Resource overload (denial of wallet / service)

An agent is driven into runaway loops, huge tool fan-out, or unbounded token/compute spend — a denial-of-wallet or denial-of-service. **Mitigate:** rate limits, step/iteration caps, token and cost budgets, and timeouts on tools and the overall run.

### 8. Repudiation & weak observability

If you can't see what the agent did, you can't detect abuse, debug an incident, or prove what happened. **Mitigate:** log and trace **every** action, tool call, and memory write with the caller, arguments, and result — make the agent's behavior fully auditable and non-repudiable.

### 9. Overwhelming human-in-the-loop

A defense that asks a human to approve *everything* fails differently: reviewers fatigue and rubber-stamp, so the oversight becomes theater. **Mitigate:** risk-tier the actions — auto-allow the safe ones, require approval only for high-impact ones — so human attention lands where it matters.

### 10. Rogue & compromised agents (multi-agent)

In multi-agent systems, a single compromised or malicious agent can poison shared state, mislead peers, or escalate across the system. **Mitigate:** trust boundaries between agents, sandboxing, validation of inter-agent messages, and not treating another agent's output as inherently trustworthy.

## The four controls that cover most of it

Notice the mitigations rhyme. Four cross-cutting controls address the bulk of the list:

- **Least privilege** — minimal tools, scopes, and autonomy (shrinks excessive agency, tool misuse, privilege compromise, rogue-agent damage).
- **Human-in-the-loop** for high-impact, risk-tiered actions (cascading failures, tool misuse, goal manipulation) — see the [human-in-the-loop-gate](/skills/workflow/human-in-the-loop-gate) skill.
- **Observability & audit** of every action (repudiation, detection, incident response).
- **Guardrails** on inputs and outputs (injection, memory poisoning, leakage) — see the [llm-guardrails-designer](/skills/security/llm-guardrails-designer) skill.

## Putting it together

Secure an agent by first **reducing what it can do** (least privilege), then layering human approval on high-impact actions, full audit on every action, and guardrails on every input and output — and finally walking the agentic threat list against your specific architecture (memory, tools, goals, multi-agent links) to find the gaps. The [agent-reliability-reviewer](/agents/meta-orchestration/agent-reliability-reviewer) hardens the reliability side of this, and the [prompt-injection-auditor](/agents/quality-security/prompt-injection-auditor) audits the injection-and-blast-radius side.

## Continue exploring

- [Agentic AI](/glossary/agentic-ai) — Agentic AI is the class of AI systems that act toward goals — planning, calling tools, and iterating on results — rather than only generating content.
