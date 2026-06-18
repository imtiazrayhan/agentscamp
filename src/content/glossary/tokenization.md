---
term: "Tokenization"
description: "Tokenization splits text into tokens — the sub-word units a model reads and writes — and maps each to an integer ID the model processes."
date: 2026-06-17
topics: ["data-ml"]
tags: ["tokenization", "tokens", "bpe", "preprocessing", "llm"]
related: ["llm-token", "context-window", "embedding", "inference", "llm-api-pricing-2026"]
faq:
  - q: "Why don't character counts equal token counts?"
    a: "Because a tokenizer groups characters into sub-word units, not single letters. A common word like 'the' is one token; a rare word splits into several. On average one token is about 3–4 characters or 0.75 words of English, so the same text maps to far fewer tokens than characters — and the ratio shifts with the content."
  - q: "Are token counts the same across providers?"
    a: "No. Each model family ships its own tokenizer with its own vocabulary, so the same string yields different token counts on different models. You can't compare prices or context limits across providers by raw token numbers — count with the specific model's tokenizer."
---

**Tokenization is the process of splitting text into tokens — the sub-word units a model actually reads and generates — and mapping each one to an integer ID.**

Before a language model sees your prompt, a tokenizer breaks it into pieces drawn from a fixed vocabulary, usually with a scheme like byte-pair encoding (BPE) that merges frequent character sequences into single units. Common words become one [token](/glossary/llm-token); rare words, names, and made-up strings split into several. Each unit maps to an integer ID, and those IDs — not the raw characters — are what the model embeds and predicts. On average one token is roughly three-quarters of an English word.

This is why character counts never equal token counts, and why pricing and [context window](/glossary/context-window) limits are measured in tokens rather than words. Some inputs tokenize less efficiently: code, rare or non-English words, and unusual whitespace all pack more tokens per character, quietly inflating cost and length.

A key caveat: each model family has its own tokenizer, so token counts are not comparable across providers. Always count against the model you actually call — see the [LLM API pricing guide](/guides/advanced/llm-api-pricing-2026) for what that means for your bill.