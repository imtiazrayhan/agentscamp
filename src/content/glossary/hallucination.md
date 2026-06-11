---
term: "Hallucination"
description: "A hallucination is fluent, confident output that is factually wrong or fabricated — plausible text unsupported by any source, the signature LLM failure mode."
date: 2026-06-11
topics: ["llm-evals"]
tags: ["hallucination", "reliability", "grounding", "llm"]
related: ["rag", "write-llm-evals", "llm-as-judge", "structured-output-2026", "how-rag-works"]
faq:
  - q: "Why do LLMs hallucinate?"
    a: "Because they generate the most plausible next token, not verified facts — plausibility and truth usually align on well-represented knowledge and diverge at the edges: niche details, fresh events, exact citations, anything underrepresented in training. The model has no built-in mechanism that distinguishes 'I know this' from 'this sounds right.'"
  - q: "How do you reduce hallucinations in practice?"
    a: "Ground and verify. Grounding supplies the facts at query time (RAG over your data) and instructs the model to answer only from them, with 'say you don't know' as an explicit option. Verification catches what slips through: schema validation for structured claims, retrieval-backed citation checks, and eval suites that measure faithfulness so regressions surface before users do."
---

**A hallucination is model output that reads confident and coherent but is factually wrong or invented — a fabricated API, a nonexistent citation, a wrong number stated smoothly.**

It's not a bug to patch but a property of how generation works: an LLM produces the most *plausible* continuation, and plausibility tracks truth only where training data was dense. The failure concentrates exactly where users least expect it — specifics. Names, versions, citations, niche APIs: the model fills gaps with statistically likely inventions, delivered in the same confident tone as real knowledge.

Mitigation is an engineering stack, not a setting. **Grounding** narrows the gap between plausible and true: [RAG](/glossary/rag) puts real sources in the prompt and confines answers to them. **Constraints** shrink the surface: [structured outputs](/guides/concepts/structured-output-2026) can't hallucinate fields that fail validation. **Measurement** keeps you honest: faithfulness metrics and [LLM-as-judge](/glossary/llm-as-judge) scoring inside a real [eval suite](/guides/evaluation/write-llm-evals) turn "it seems to hallucinate less" into a number you can gate releases on.
