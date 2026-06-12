---
term: "Red-Teaming (AI)"
description: "AI red-teaming is adversarial testing — attacking your model or agent with jailbreaks, injections, and misuse scenarios to find failures before users do."
date: 2026-06-12
topics: ["ai-safety-security"]
tags: ["red-teaming", "security", "safety", "testing"]
related: ["red-team-llm", "jailbreak", "prompt-injection", "defending-prompt-injection", "owasp-agentic-top-10", "guardrails"]
faq:
  - q: "What does red-teaming an LLM app actually involve?"
    a: "Systematically playing the attacker against your own system: jailbreak attempts against its policies, prompt injection through every content channel it reads, data-exfiltration probes, tool-abuse scenarios for agents, and domain-specific misuse. Findings become fixes (guardrails, scoping, gates) and then regression tests, so the same hole can't reopen."
  - q: "How is red-teaming different from normal evals?"
    a: "Evals measure expected behavior on representative inputs; red-teaming hunts unexpected behavior under adversarial ones. An app can score perfectly on its eval suite and fall to the first 'ignore previous instructions' — the two are complements: evals for quality, red-teaming for resilience."
---

**AI red-teaming is adversarial testing: deliberately attacking your own model or agent — jailbreaks, injections, exfiltration, tool abuse — to surface failures before attackers and users find them in production.**

Borrowed from security practice, it became standard at two levels. **Model-level** red-teaming (the labs' discipline) probes frontier models for dangerous capabilities and policy bypasses pre-release. **Application-level** red-teaming — the kind every team shipping LLM features owns — attacks the *system*: can [prompt injection](/glossary/prompt-injection) ride in through retrieved documents or fetched pages? Can a [jailbreak](/glossary/jailbreak) defeat the persona? Can an agent's tools be steered into exfiltration or destructive calls — the scenarios the [OWASP agentic top 10](/guides/ai-safety/owasp-agentic-top-10) catalogs?

The discipline that separates it from poking around: coverage across every untrusted input channel, escalation from obvious to creative attacks, and **findings → fixes → regression tests** so resilience compounds instead of resetting. Tooling automates the grind (promptfoo's adversarial suites, scanners like LLM Guard for the runtime side), and the [red-team-llm](/commands/review/red-team-llm) command packages the workflow for any app in reach.
