---
name: "promptfoo"
title: "promptfoo"
description: "An open-source CLI for testing, comparing, and red-teaming LLM prompts, models, and apps."
url: "https://www.promptfoo.dev"
date: 2026-06-03
pricing: "open-source"
category: "evaluation"
repo: "https://github.com/promptfoo/promptfoo"
license: "MIT"
sameAs: ["https://github.com/promptfoo/promptfoo", "https://www.promptfoo.dev/docs"]
color: "red"
topics: ["llm-evals", "ai-safety-security"]
tags: ["evals", "testing", "red-teaming", "security", "open-source", "cli"]
featured: false
alternativeTo: ["deepeval"]
summary: "promptfoo is an open-source, config-driven CLI for evaluating and comparing LLM prompts and models side by side, plus a red-teaming mode that probes apps for prompt injection, jailbreaks, and unsafe output. Declarative YAML test cases make it CI-friendly and provider-agnostic."
related: ["best-llm-eval-tools-2026", "deepeval", "llm-evaluation-engineer", "defending-prompt-injection", "red-team-llm"]
---

promptfoo is an open-source, developer-first tool for evaluating LLM outputs. You declare test cases and assertions in a YAML config, point it at one or more prompts, models, or providers, and it runs a side-by-side matrix so you can see — quantitatively — which combination wins. It also ships a **red-teaming** mode that automatically probes an app for vulnerabilities like prompt injection and jailbreaks.

It is aimed at engineers who want eval to feel like a fast, config-driven CLI step rather than a platform. Because tests are declarative and provider-agnostic, promptfoo drops cleanly into CI and works across OpenAI, Anthropic, open models, and custom endpoints.

## Highlights

- **Side-by-side matrix** — compare prompts × models × providers on the same cases and view results in a web UI or CI output.
- **Declarative tests** — assertions in YAML (exact match, similarity, LLM-as-judge, JSON schema, custom), kept in version control.
- **Red teaming** — automated adversarial probes for prompt injection, jailbreaks, PII leakage, and unsafe content.
- **Provider-agnostic** — works with hosted APIs, local models, and custom HTTP endpoints.
- **CI-native** — run headlessly and fail the build on a regression or a failed safety probe.

## In an AI-assisted workflow

```yaml
# promptfooconfig.yaml
prompts: [file://prompt_a.txt, file://prompt_b.txt]
providers: [anthropic:claude, openai:gpt]
tests:
  - vars: { question: "How do I rotate API keys?" }
    assert:
      - type: llm-rubric
        value: "answers accurately and cites the docs"
```

```bash
npx promptfoo@latest eval && npx promptfoo@latest view
```

> [!TIP]
> promptfoo straddles evaluation and security: use the eval matrix to pick prompts/models, and the red-team mode as a pre-ship safety gate against prompt injection.

## Good to know

promptfoo is free and open source (MIT); judge-based assertions and red-team probes call an LLM, so they incur token cost. For a Python, pytest-style framework instead of a YAML CLI, compare [DeepEval](/tools/deepeval); for the broader landscape see [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026).
