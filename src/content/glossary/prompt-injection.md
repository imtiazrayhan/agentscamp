---
term: "Prompt Injection"
description: "Prompt injection is an attack where untrusted content carries instructions an LLM then follows — overriding its task, leaking data, or triggering tool calls."
date: 2026-06-11
topics: ["ai-safety-security"]
tags: ["security", "prompt-injection", "llm", "attacks"]
related: ["defending-prompt-injection", "owasp-agentic-top-10", "prompt-injection-auditor", "guardrails", "red-team-llm"]
faq:
  - q: "What's the difference between direct and indirect prompt injection?"
    a: "Direct: the attacker is the user, typing instructions that override the system prompt ('ignore previous instructions…'). Indirect: the attack rides in content the model processes — a web page it fetches, an email it summarizes, a README it reads — so a completely benign user can trigger it. Indirect is the dangerous one for agents, which read untrusted content constantly."
  - q: "Can prompt injection be fully solved?"
    a: "Not at the model layer, today. Models can't reliably distinguish 'data to process' from 'instructions to follow' inside one context. Real defenses are architectural: least-privilege tools, deterministic permission gates outside the model, treating all fetched content as untrusted, and human approval on irreversible actions — defense in depth, not a magic prompt."
---

**Prompt injection is the attack of smuggling instructions into content an LLM processes, so the model follows the attacker's intent instead of its task — the LLM-era descendant of SQL injection, ranked the #1 LLM application risk by OWASP.**

The root cause is structural: a model's context mixes trusted instructions and untrusted data in the same medium (text), and the model has no hard boundary between them. **Direct** injection comes from a hostile user; the sharper threat is **indirect** injection, where instructions hide in things the system reads — a webpage, a document, an email, tool output. For [agents](/glossary/ai-agent) with tools, that escalates from wrong answers to wrong *actions*: exfiltrated secrets, malicious tool calls, poisoned memory.

Because the model layer can't fully solve it, defense is architectural: scope tools to least privilege, gate dangerous actions with [deterministic checks outside the model](/glossary/guardrails), treat every fetched byte as untrusted, and keep humans on irreversible operations. The working playbook is [Defending Against Prompt Injection](/guides/ai-safety/defending-prompt-injection); auditing an existing app for exposure is the [prompt-injection-auditor](/agents/quality-security/prompt-injection-auditor) agent's job.
