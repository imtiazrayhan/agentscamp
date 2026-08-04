---
term: "Grounding"
description: "Grounding ties a model's output to verifiable sources — retrieved documents, tool results, citations — instead of training-data memory."
date: 2026-06-12
topics: ["rag-retrieval"]
tags: ["grounding", "rag", "reliability", "citations"]
related: ["glossary:rag", "glossary:hallucination", "guide:how-rag-works", "glossary:structured-output"]
faq:
  - q: "How do you ground an LLM's answers?"
    a: "Supply the evidence and constrain to it: retrieve relevant sources (RAG) or tool results into the prompt, instruct the model to answer only from that material with 'not in the context' as an allowed response, and require citations so every claim traces to a source. Grounding is architecture plus instructions — not instructions alone."
  - q: "Is grounding the same as RAG?"
    a: "RAG is the most common grounding mechanism, not the definition. Grounding is the property — output anchored to verifiable evidence — achievable via retrieval, tool calls (a database lookup grounds a number), search results, or provided documents. RAG is one way to deliver the evidence."
---

**Grounding is anchoring a model's output to verifiable evidence — retrieved documents, tool results, supplied sources — so answers come from checkable material rather than the model's training-data memory.**

It's the direct countermeasure to [hallucination](/glossary/hallucination): a model generating freely produces the most *plausible* continuation, while a grounded model is constrained to the most *supported* one. The mechanics have three parts — deliver evidence at query time ([RAG](/glossary/rag) being the workhorse delivery system), instruct the model to answer only from it (with "the sources don't say" as an explicitly allowed move), and make fidelity visible through citations, so an ungrounded claim is detectable rather than smooth.

Grounding quality is measurable — faithfulness metrics score whether answers follow from sources — which makes it an engineering property, not a vibe. The full pipeline that produces well-grounded answers is [How RAG Actually Works](/guides/concepts/how-rag-works); what breaks when answers float free of their sources is step four of the [RAG debugging checklist](/guides/troubleshooting/rag-debugging-checklist).
