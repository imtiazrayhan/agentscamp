---
term: "AI Slop"
description: "AI slop is low-effort, mass-produced AI-generated content — fluent, generic, and unchecked — flooding feeds, search results, and codebases."
date: 2026-06-12
topics: ["workflow-prompting"]
tags: ["ai-slop", "content-quality", "culture"]
related: ["vibe-coding", "hallucination", "testing-ai-generated-code", "ai-code-review-workflow"]
faq:
  - q: "What makes something AI slop versus just AI-generated?"
    a: "Effort and verification, not origin. Slop is generation without judgment: unreviewed, generic, often subtly wrong, produced because output is cheap. AI-assisted work with real curation — checked facts, edited voice, tested code — isn't slop regardless of how much a model contributed. The term indicts the workflow, not the tool."
  - q: "Is there such a thing as code slop?"
    a: "Yes, and it's the costly kind: plausible, unreviewed AI code accumulating in repos — happy-path logic, duplicated patterns, hallucinated edge-case handling — that compiles today and bills the team at month six. The antidotes are the verification stack: tests as acceptance contracts, layered review, and treating generated code as a draft."
---

**AI slop is mass-produced, low-effort AI-generated content shipped without human judgment — fluent enough to fill space, generic enough to be worthless, and voluminous enough to degrade whatever it floods.**

The term earned dictionary-level currency in 2024–25 as generation costs hit zero and feeds, search results, image platforms, and inboxes filled with the result. Its diagnostic feature isn't AI involvement — it's the **missing verification step**: slop is what happens when "the model produced something" gets mistaken for "the work is done." That's also why the term matters to engineers, not just culture critics: *code slop* — unreviewed agent output accumulating in repos — is the same failure mode with compounding interest, and the entire [verification stack](/guides/testing/testing-ai-generated-code) exists to prevent it.

The deeper signal: as generation became free, **scarcity moved to judgment** — curation, taste, verification, accountability. The same shift shows up across this site's themes, from [vibe coding's guardrails](/glossary/vibe-coding) to [review workflows](/guides/workflow/ai-code-review-workflow): the craft is no longer producing the artifact; it's standing behind it.
