---
term: "Token (LLM)"
description: "A token is the unit LLMs read and write — a word fragment of roughly 3–4 characters in English. Models are priced, limited, and measured in tokens, not words."
date: 2026-06-11
topics: ["llm-app-dev"]
tags: ["tokens", "tokenization", "llm", "pricing"]
related: ["context-window", "inference", "prompt-caching", "llm-cost-latency-engineering"]
faq:
  - q: "How many tokens is a word?"
    a: "In English, roughly 0.75 words per token — about 100 tokens per 75 words. Common words are single tokens; rare words split into pieces; code, non-English text, and unusual formatting often cost more tokens per character. Exact counts come from the model's own tokenizer."
  - q: "Why are tokens what I pay for?"
    a: "Because tokens are what the model actually processes: each one costs compute on the way in (reading your prompt) and on the way out (generating the answer). That's why API pricing is per million input and output tokens, why output tokens cost more, and why trimming context is the most direct cost lever."
---

**A token is the basic unit a language model reads and writes — typically a word fragment averaging 3–4 characters of English text. Everything about LLMs is denominated in tokens: pricing, context limits, and speed.**

Models don't see letters or words; a *tokenizer* splits text into pieces from a fixed vocabulary, and the model predicts one token at a time. "Understanding" is a single token; "unfathomable" might be three. The practical conversions: ~100 tokens ≈ 75 English words; code and non-English text usually run denser.

Tokens matter because they're the meter on everything. API pricing is per million input and output tokens (output costing several times more — generation is sequential, reading is parallel). The [context window](/glossary/context-window) is a token budget. Throughput is tokens per second. So the everyday engineering moves — trimming prompts, [caching repeated prefixes](/glossary/prompt-caching), summarizing history — are all token economics; the full playbook is in [LLM Cost and Latency Engineering](/guides/advanced/llm-cost-latency-engineering).
