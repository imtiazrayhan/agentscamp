---
term: "Constitutional AI"
description: "Constitutional AI trains models against written principles — the model critiques and revises its own outputs by them, reducing reliance on human labels."
date: 2026-06-12
topics: ["ai-safety-security"]
tags: ["constitutional-ai", "alignment", "anthropic", "safety"]
related: ["glossary:rlhf", "glossary:dpo", "glossary:guardrails", "glossary:jailbreak", "glossary:frontier-model"]
faq:
  - q: "How does Constitutional AI work?"
    a: "Two phases, both anchored to an explicit list of principles. First, the model generates responses, critiques them against the constitution, and revises — producing self-improved training data. Second, preference optimization uses AI feedback (which response better follows the principles?) instead of armies of human raters — RLAIF. The constitution makes the values inspectable text rather than implicit rater behavior."
  - q: "Why does it matter that the principles are written down?"
    a: "Transparency and scalability. RLHF's values live implicitly in thousands of rater judgments — unauditable and expensive. A constitution is a document: you can read what the model is being aligned to, debate it, and revise it. Anthropic later extended the idea with Collective Constitutional AI, drafting principles with public input."
---

**Constitutional AI (CAI) is Anthropic's alignment technique: instead of relying purely on human raters, the model is trained against an explicit written constitution — critiquing and revising its own outputs by those principles, then optimized with AI feedback on which responses follow them best.**

It answered two problems in classic [RLHF](/glossary/rlhf) at once. **Scale**: human preference labels are expensive and inconsistent; CAI substitutes AI-generated feedback (RLAIF) guided by principles, multiplying alignment data cheaply. **Transparency**: RLHF encodes values implicitly in rater behavior; a constitution states them as text anyone can read — principles drawing on sources from the UN Declaration of Human Rights to practical harmlessness criteria — making "what is this model aligned to?" an answerable question. The technique shaped Claude's character and influenced industry-wide adoption of AI-feedback methods.

For builders, CAI matters as background and as pattern: background, because it explains behavioral texture in the models you use; pattern, because *principles-as-explicit-text* recurs at the application layer — rules engines like NeMo Guardrails and policy-based [guardrails](/glossary/guardrails) are the same move at runtime, and writing your app's "constitution" (what it must never do, stated plainly) is the first step of every serious safety review.
