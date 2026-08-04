---
term: "Model Routing"
description: "Model routing sends each request to the cheapest model that can handle it, escalating only hard cases to a stronger model — cutting cost and latency."
date: 2026-06-17
topics: ["llm-app-dev"]
tags: ["routing", "cost-optimization", "cascade", "model-selection", "latency"]
related: ["production-model-routing", "inference", "small-language-model", "model-router-designer", "provider-fallback-wrapper", "calling-any-model-gateways"]
faq:
  - q: "How does a model router decide where to send a request?"
    a: "The routing signal can be cheap heuristics (task type, input length, keywords), a lightweight classifier trained to predict difficulty, or a confidence-based cascade: try the small model first, validate its answer, and escalate only when the check fails. Heuristics are predictable and free; classifiers and cascades adapt to actual difficulty but add their own latency and need their own evals."
  - q: "What's the main risk of model routing?"
    a: "Routing too aggressively to the weak model. The cases that genuinely needed the strong one get silently downgraded, so quality drops on exactly the hard inputs that matter most — and the failure is invisible unless you measure it. Gate every routing rule with an eval set that includes hard cases, and watch the escalation rate: if almost nothing escalates, your router is probably too greedy."
---

**Model routing is sending each incoming request to the most appropriate model — usually the cheapest, fastest one that can handle it, escalating only the hard cases to a stronger model — to cut cost and latency without sacrificing output quality.**

The routing decision rides on a *signal*: the task type, the input length, a lightweight classifier that predicts difficulty, or a confidence/validation check that escalates when a cheap first attempt looks wrong (a **cascade**). A common shape is a [small language model](/glossary/small-language-model) as the default workhorse with a [frontier model](/glossary/frontier-model) held in reserve — the same tiering logic, automated per request.

The economics work because most production traffic is easy. If 80% of requests are simple classifications, extractions, or short answers, routing them to a model that costs a fraction as much slashes [inference](/glossary/inference) spend and tail latency while the hard 20% still gets full firepower. Gateways make this practical: a single API in front of many providers, where the router lives. See [Calling Any Model: Gateways](/guides/concepts/calling-any-model-gateways).

The caveat is the whole game: route too aggressively and you silently downgrade the cases that needed the strong model, degrading quality precisely where it counts. Gate every rule with an [eval set](/glossary/eval-dataset) that includes hard inputs, and pair routing with a [provider fallback wrapper](/skills/api/provider-fallback-wrapper) so an outage escalates rather than fails. Design the policy with a [model router designer](/skills/data/model-router-designer).
