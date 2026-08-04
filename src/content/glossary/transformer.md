---
term: "Transformer"
description: "The neural-network architecture (Vaswani et al., 2017) that uses self-attention to process sequences in parallel — the basis of nearly all modern LLMs."
date: 2026-06-17
topics: ["data-ml"]
tags: ["transformer", "architecture", "attention", "llm", "deep-learning"]
related: ["glossary:tokenization", "glossary:inference", "glossary:context-window", "glossary:mixture-of-experts", "glossary:reasoning-model"]
faq:
  - q: "Why was the Transformer such a breakthrough?"
    a: "Earlier sequence models (RNNs, LSTMs) processed tokens one after another, which made training slow and hard to parallelize. The Transformer replaced that recurrence with self-attention, letting it look at every token in a sequence at once. That parallelism scales cleanly on GPUs, so models could be trained on far more data and parameters — and scaling the Transformer is exactly what produced today's large language models."
  - q: "Are all LLMs Transformers?"
    a: "Almost all of the well-known ones are. GPT, Claude, Gemini, and Llama are decoder-only Transformers; older models like BERT use the encoder variant. Some newer architectures (state-space models such as Mamba) explore alternatives, but the Transformer remains the dominant design for frontier LLMs as of 2026."
---

**A Transformer is a neural-network architecture, introduced by Vaswani et al. in the 2017 paper "Attention Is All You Need," that uses self-attention to process an entire sequence in parallel — and it underpins virtually every modern large language model.**

The key move was dropping recurrence. Earlier sequence models read tokens one at a time, which made training slow. The Transformer instead uses [self-attention](/glossary/attention-mechanism) so each [token](/glossary/tokenization) can directly weigh every other token in the input at once. That parallelism is the whole point: it scales efficiently on GPUs, which is what made it practical to train models on enormous datasets.

Architecturally, a Transformer stacks repeated blocks, each combining an attention layer with a feed-forward layer. Because attention itself is order-agnostic — it has no built-in sense of sequence — the model adds positional information so it knows which token came where.

Variants differ in how they consume text. Decoder-only models (the GPT- and Claude-style designs) predict the next token and power generative chat; encoder variants (like BERT) read the full input for understanding tasks. Crucially, "scaling the Transformer" — more parameters, more data, more compute — is what turned this 2017 architecture into modern LLMs. Its design also shapes practical limits you hit at [inference](/glossary/inference) time, including the model's [context window](/glossary/context-window).