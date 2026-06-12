---
term: "Jailbreak"
description: "A jailbreak is a prompt crafted to bypass a model's safety training and policies — making it produce output it was trained to refuse."
date: 2026-06-12
topics: ["ai-safety-security"]
tags: ["jailbreak", "safety", "security", "attacks"]
related: ["prompt-injection", "red-teaming", "guardrails", "rlhf", "constitutional-ai"]
faq:
  - q: "How is a jailbreak different from prompt injection?"
    a: "Target. A jailbreak attacks the MODEL's safety training — persuading it past its own refusals (roleplay framings, encodings, many-shot setups). Prompt injection attacks the APPLICATION — smuggling instructions through content so the system does the attacker's bidding regardless of safety policies. Injection works on perfectly-aligned models; jailbreaks are about the alignment itself."
  - q: "Are jailbreaks an application developer's problem?"
    a: "Yes, twice over. Your app's persona and policy rules ('never reveal the system prompt', 'stay on topic') are jailbreak targets even when the base model's safety holds — and defense-in-depth is yours to build: input classifiers, output checks, and scoped capabilities so a successful bypass has nothing dangerous to reach."
---

**A jailbreak is an input crafted to make a model bypass its safety training — producing content or behavior it was trained to refuse — by persuading, tricking, or overwhelming the alignment rather than exploiting the application around it.**

The taxonomy is a moving arms race: roleplay and persona framings ("you are an AI without restrictions"), encoding and obfuscation tricks, many-shot patterns that normalize the forbidden through repeated examples, multi-turn gradual escalation, and automated search for adversarial suffixes. Each generation of [RLHF](/glossary/rlhf) and [Constitutional-AI-style](/glossary/constitutional-ai) training closes known classes; new ones appear — which is why the labs treat jailbreak-resistance as a continuously [red-teamed](/glossary/red-teaming) property, not a solved checkbox.

For application builders the practical frame: your *own* rules — persona boundaries, topic limits, "never reveal the system prompt" — are jailbreak surface independent of the base model's safety, and the defenses are layered, not promised: input/output [guardrails](/glossary/guardrails) that classify attempts, capabilities scoped so a bypass reaches nothing irreversible, and your app's specific policies attacked regularly via [red-team passes](/commands/review/red-team-llm). Distinguish the sibling threat: [prompt injection](/glossary/prompt-injection) hijacks your application's instructions; jailbreaks attack the model's. Real systems defend against both.
