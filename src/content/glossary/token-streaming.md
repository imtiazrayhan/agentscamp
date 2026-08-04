---
term: "Token Streaming"
description: "Token streaming delivers model output incrementally as it's generated — via SSE or websockets — so users see text immediately instead of waiting."
date: 2026-06-12
topics: ["llm-app-dev"]
tags: ["streaming", "sse", "latency", "ux"]
related: ["glossary:llm-token", "glossary:inference", "command:add-streaming-endpoint", "glossary:context-window"]
faq:
  - q: "Why stream tokens instead of waiting for the full response?"
    a: "Perceived latency. Generation takes as long as it takes, but streaming moves the user's wait from 'full response time' to 'time-to-first-token' — often 10x shorter. For chat and agents, watching text arrive is the difference between feeling instant and feeling broken; nothing about the total time changed, only when value starts arriving."
  - q: "What's tricky about consuming a token stream?"
    a: "Structure. Plain prose streams trivially; JSON and tool calls arrive as fragments that only parse when complete — so consumers buffer structured segments, parse incrementally, or use provider events that delimit them. Error handling changes too: a stream can fail mid-response, so handle partial output and aborts deliberately."
---

**Token streaming sends a model's response as it's generated — token by token over Server-Sent Events or websockets — so the consumer renders output immediately rather than waiting for completion.**

It exists because [inference](/glossary/inference) is sequential: the model produces one [token](/glossary/llm-token) at a time, and a long answer takes real seconds. Streaming doesn't make generation faster — it makes *waiting* obsolete by shifting the felt metric from total time to **time-to-first-token**, which is why every chat product streams and why TTFT is a first-class latency number alongside tokens-per-second.

Engineering-wise, the happy path is easy (providers ship SSE out of the box; [scaffolding the endpoint](/commands/scaffold/add-streaming-endpoint) is rote) and the edges are where care goes: structured output arrives in fragments (buffer or parse incrementally), tool calls stream as deltas, mid-stream errors leave partial responses to handle, and UI rendering wants throttling so token-rate doesn't thrash the DOM. In agent systems streaming compounds — each step's output streams into visibility, which is how long-running agents stay legible instead of silent.
