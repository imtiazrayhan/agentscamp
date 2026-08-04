---
name: "Cody"
description: "Sourcegraph's AI coding assistant for the IDE, grounded in deep codebase context."
seoDescription: "Cody is Sourcegraph's AI coding assistant for the IDE, grounded in deep codebase context — features, pricing, and how it compares to alternatives."
date: 2026-06-03
url: "https://sourcegraph.com/cody"
pricing: "enterprise"
category: "extension"
color: "purple"
topics: ["coding-languages"]
tags: ["extension", "assistant", "codebase-context"]
featured: false
related: ["tool:amp", "tool:continue", "tool:tabnine"]
alternativeTo: ["continue", "tabnine", "github-copilot", "amp"]
summary: "Cody is Sourcegraph's AI coding assistant for the IDE, grounded in codebase-wide context: it uses Sourcegraph's Search API to fetch relevant definitions, references, and files — across many repos on Enterprise — so answers and edits reference how your code actually works. Now Enterprise-only; the Free and Pro tiers were discontinued in 2025."
faq:
  - q: "What is Cody?"
    a: "Cody is Sourcegraph's AI coding assistant that lives inside your editor and answers, completes, and edits code using context pulled from your whole codebase. Instead of seeing only the open file, it fetches relevant definitions, references, and files across the repository — and, on Enterprise, across many repositories — so responses are grounded in how your code actually works."
  - q: "Is Cody free?"
    a: "Not anymore. Cody is now part of the Sourcegraph Enterprise plan only: the Cody Free and Cody Pro tiers were discontinued on July 23, 2025, with new signups closed June 25, 2025. Enterprise pricing scales with team size and is quote-based."
  - q: "Cody vs Amp?"
    a: "Both are Sourcegraph products with different audiences. If you are an individual developer, Sourcegraph now points you to Amp (ampcode.com), its standalone agentic coding tool, while Cody continues as the IDE assistant bundled with Sourcegraph Enterprise."
---

Cody is Sourcegraph's AI coding assistant that lives inside your editor and answers, completes, and edits code using context pulled from your whole codebase. Its differentiator is Sourcegraph's code intelligence: instead of seeing only the open file, Cody fetches relevant definitions, references, and files across the repository (and, on Enterprise, across many repositories) so its responses are grounded in how your code actually works.

It is aimed at engineering teams working in large, multi-repo codebases where context is the bottleneck — where knowing which function to call, where a type is defined, or how a pattern is used elsewhere matters more than raw generation speed.

## Highlights

- **Codebase context** — Cody uses Sourcegraph's Search API to fetch relevant code as context, so chat and edits reference real definitions and usages rather than guessing from the open file alone.
- **Chat** — ask questions about your code, generate new code, and apply edits inline, with the conversation grounded in the files Cody retrieves.
- **Auto-edit** — contextual, multi-line suggestions that react to your cursor and recent changes as you type.
- **Prompts** — reusable, customizable prompt templates for recurring workflows like writing tests, explaining code, or documenting a function.
- **Context Filters** — admins can control which repositories are allowed to inform Cody's responses, keeping sensitive code out of context.
- **Editor reach** — VS Code, JetBrains IDEs, Visual Studio (experimental), the Sourcegraph web app, and a command-line interface (Cody CLI).

## In an AI-assisted workflow

Cody fits teams who already run Sourcegraph for code search. The strongest loop is asking questions that span files: instead of grepping for where a behavior lives, you ask Cody and it retrieves the relevant code as context before answering.

```text
@graphql/schema.ts How is the `User` type resolved, and where are
its resolvers registered? Then add a `lastSeenAt` field end to end.
```

> [!TIP]
> Because Cody's quality scales with the context it can reach, point it at the right repositories and lean on `@`-mentions and Context Filters so it grounds answers in the code that matters.

## Good to know

Cody is available in VS Code, JetBrains, Visual Studio (experimental), the web app, and via CLI. It is now part of the **Sourcegraph Enterprise** plan only: the Cody Free and Cody Pro tiers were discontinued on July 23, 2025 (new signups closed June 25, 2025).

> [!WARNING]
> If you are an individual developer, Cody is no longer the product to reach for — Sourcegraph now points solo users to **Amp** (ampcode.com), its standalone agentic coding tool, while Cody continues as the IDE assistant bundled with Sourcegraph Enterprise. Enterprise pricing scales with team size and is quote-based.
