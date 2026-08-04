---
term: "Prompt Template"
description: "A prompt template is a parameterized prompt — fixed instructions with variable slots — turning prompts from strings into versioned, testable components."
date: 2026-06-12
topics: ["workflow-prompting"]
tags: ["prompts", "templates", "llmops", "engineering"]
related: ["glossary:system-prompt", "guide:prompt-patterns", "glossary:few-shot-prompting", "guide:write-llm-evals", "guide:langfuse-vs-langsmith"]
faq:
  - q: "Why use templates instead of building prompt strings inline?"
    a: "The same reasons you don't inline SQL: separation of concerns (prompt content evolves independently of code), versioning (which prompt produced this output?), testability (evals run against template versions), and safety (explicit slots make untrusted input visible instead of concatenated invisibly into instructions)."
  - q: "Where should prompt templates live?"
    a: "Somewhere versioned and visible: files in the repo (reviewable in PRs, deployed with code) for most teams, or a prompt-management platform (Langfuse, LangSmith) when non-engineers iterate on prompts or you need deploy-without-release. The anti-pattern is string fragments scattered through application code — unversioned, untested, unfindable."
---

**A prompt template is a reusable prompt with variable slots — fixed instructions, dynamic inputs (`{question}`, `{context}`, `{examples}`) — the unit that turns prompting from string-building into software engineering.**

Its value is everything that becomes possible once a prompt is an *artifact*: version it (and know which version produced a regression), test it ([eval suites](/guides/evaluation/write-llm-evals) run against template versions, catching the regression before users do), review it in PRs, and manage it — platforms like [Langfuse and LangSmith](/guides/comparisons/langfuse-vs-langsmith) ship prompt registries with versioning and deployment precisely because templates are the unit teams iterate on. In code, every serious framework treats templates as first-class, from simple f-string-style substitution to structured message builders.

One slot deserves special respect: **untrusted input**. A template makes the boundary between instructions and data explicit — which is the first, structural defense against [prompt injection](/glossary/prompt-injection): quote user and fetched content into clearly-delimited data slots, never splice it into instruction position. Combined with the [patterns](/guides/prompting/prompt-patterns) for what goes *in* the template — role, rules, [few-shot examples](/glossary/few-shot-prompting), output contracts — templates are where prompt craft becomes maintainable.
