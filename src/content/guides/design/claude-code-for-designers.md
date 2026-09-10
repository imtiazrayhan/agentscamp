---
title: "Claude Code for Designers: Prototype in Code Without Becoming an Engineer"
description: "Why a designer opens a terminal agent, how to set it up safely, connecting Figma, a CLAUDE.md for a design-system repo, and three workflows with prompts."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "multimodal-ai", "coding-languages"]
audience: ["designers"]
tags: ["claude-code", "designers", "design-system", "figma", "design-tokens", "prototyping"]
featured: false
seoTitle: "Claude Code for Designers: Prototype in Code (2026)"
seoDescription: "A designer's setup for Claude Code: permissions in plain language, the Figma MCP server, a CLAUDE.md for a design-system repo, and three workflows with prompts."
keywords: ["claude code for designers", "design system claude code", "figma mcp claude code", "design tokens claude", "prototype in code"]
summary: "Claude Code reads and edits the files in a folder you point it at and runs commands from plain-English instructions. Designers open it for four jobs: live prototypes in the real stack, token and component work in the repo, critique against the built product rather than a mockup, and specs engineers can act on. Setup, Figma, a CLAUDE.md, and three workflows."
keyTakeaways:
  - "Claude Code works inside one folder, and that folder bounds what it can read or change. Start it in a design-system or web repo, never your home directory."
  - "It asks before edits and most commands in manual mode. Read the proposed diff before approving; that habit is the whole safety model."
  - "The Figma MCP server hands the agent the node tree, variants, and design tokens instead of pixels, which is why it beats pasting a screenshot."
  - "A CLAUDE.md at the repo root is your standing brief: where components live, which token file is canonical, and the rule that nothing new is invented."
  - "Three workflows cover most of it: screenshot to component, critique a built screen, and write the spec an engineer can implement without a meeting."
sources:
  - title: "Claude Code overview"
    url: "https://code.claude.com/docs/en/overview"
    publisher: "Anthropic"
  - title: "How Claude remembers your project (CLAUDE.md)"
    url: "https://code.claude.com/docs/en/memory"
    publisher: "Anthropic"
  - title: "Figma MCP server"
    url: "https://developers.figma.com/docs/figma-mcp-server/"
    publisher: "Figma"
  - title: "Guide to the Figma MCP server"
    url: "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server"
    publisher: "Figma"
  - title: "Claude Code commands reference"
    url: "https://code.claude.com/docs/en/commands"
    publisher: "Anthropic"
faq:
  - q: "Do I need to learn to code to use Claude Code as a designer?"
    a: "No, but you do need to read. You describe the job in plain language and approve the changes it proposes, and the skill that matters is looking at a diff and noticing that it touched a file it should not have. The desktop app removes the terminal entirely if the command line is the part that puts you off."
  - q: "Is Claude Code better than Claude Design for a designer?"
    a: "They do different jobs. Claude Design is the canvas where an idea becomes a clickable artifact fast, on your design system. Claude Code is where that artifact turns into changes inside the real repository, using the real components. Most designers use Design first and Claude Code when the output has to live in the product."
  - q: "Will it break the codebase?"
    a: "It can, which is why the folder boundary and the approval prompts exist. Work in a git repository so every change is reversible, ask it to commit after each task, and let engineers review anything you open as a pull request. Treat your changes as a proposal, not a merge."
  - q: "Do I need Figma's MCP server, or is a screenshot enough?"
    a: "A screenshot works and is often enough for a first pass, but it throws away structure the model then has to guess back: hierarchy, variants, constraints, and token values. Figma's remote MCP server is available on all seats and plans and passes the real design data instead, so use it whenever the design actually lives in Figma."
related: ["guide:claude-design-guide", "guide:figma-to-code-with-claude", "guide:maintain-a-design-system-with-claude-code", "guide:installing-claude-code", "guide:claude-code-for-non-developers", "tool:figma-mcp", "tool:claude-code", "agent:design-systems-librarian"]
---

Claude Code is a program that reads and edits the files in a folder you choose and runs commands from plain-English instructions. Anthropic describes it as "an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools." For a designer, the useful translation is this: the design system stops being a document you describe to engineers and becomes a folder you can change directly, with someone reading every change before it lands.

## Why a designer would open a terminal agent

Four jobs make it worth the setup, and they are all jobs where a static mockup loses information.

- **Live prototypes in the real stack.** Not a linked-screens prototype and not a lookalike, but the actual components at the actual breakpoints. Interaction, focus states, and text overflow behave the way they will in production, because they are the same code.
- **Token and component work in the repo.** Renaming a color, collapsing three near-identical button variants, finding every hard-coded hex that should be a token. These are find-and-replace jobs across dozens of files, which is what an agent in a folder is for.
- **Critique against the built product.** You can point it at the running app rather than at a screenshot of the design and ask what drifted.
- **Handoff that survives.** A spec written from the code, with real component names in it, does not go stale between the review and the sprint.

If none of those describe your week, stay on the canvas. [Claude Design](/guides/design/claude-design-guide) covers everything up to the handoff, and it is the faster tool for exploration, decks, and one-pagers.

## Setup, in plain language

Two routes: the desktop app, where you download it, sign in, and click the **Code** tab, or the terminal, where one install line is followed by typing `claude` inside a folder. Both need a paid subscription. The current install commands live in [Installing Claude Code](/guides/getting-started/installing-claude-code) and this guide will not repeat them.

Two things matter more than the commands. First, you start Claude Code *inside a folder*, and that folder is the boundary of what it can see and change. Make it a repo: your design-system package, the marketing site, the web app. Never your home directory, never Desktop. Second, in manual mode it asks before every file edit and most commands, and the whole safety model is that you read the proposal before pressing Enter. The permission tiers, what the automatic modes actually allow, and the deny rules that hold regardless of what Claude decides are explained in plain language in the founders pillar, [Claude Code for Non-Developers](/guides/founders/claude-code-for-non-developers). Read that section before you turn anything off.

> [!TIP]
> Ask Claude to run `git init` on day one if the folder is not already a repository, and to commit after every task. Every change becomes reversible, and you get a readable history of what you did.

## Connecting Figma

If the design lives in Figma, do not paste a screenshot. Figma's official MCP server exists to give an agent "important design information and context" instead of pixels: the structured node tree, component variants, layout constraints, and the variables that hold your [design tokens](/glossary/design-tokens). Figma's own documentation recommends the remote server, which is "available on all seats and plans" at `https://mcp.figma.com/mcp`; the desktop server, which serves your live selection, needs a Dev or Full seat on a paid plan.

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Then authenticate with `/mcp` in a session. The way you point it at a specific design, per Figma's guide, is to select the layer, choose **Copy link to selection**, and paste that URL into your prompt; the agent reads the node ID from the link. The tool page is [Figma MCP](/tools/figma-mcp), and the full workflow, including what to do when Code Connect mappings exist, is [Figma to Code with Claude](/guides/design/figma-to-code-with-claude).

## A CLAUDE.md for a design-system repo

Every session starts with a fresh context window. `CLAUDE.md` is the file Claude Code reads at the start of every session, and Anthropic's guidance is to keep it under 200 lines and make instructions "concrete enough to verify." For a design-system repo that means the map plus the rules a new contractor would need on day one:

```markdown
# Acme design system

Components live in `src/components/<Name>/`. Every component has a
`.tsx`, a `.stories.tsx`, and a test. Tokens are in `tokens/core.json`
and are generated into `src/styles/tokens.css`. Never edit the CSS.

## Rules
- Never introduce a new color, spacing, or radius value. If a design
  needs one, stop and tell me which token is closest.
- Reuse an existing component before creating one. Search first.
- Every interactive element needs a visible focus state and an
  accessible name.
- Show me the plan before touching more than three files.
- Run `npm run storybook` when you finish a component so I can see it.
```

Run `/init` and Claude drafts a starting file from what is already in the folder; refine from there. For rules that only apply to part of the repo, `.claude/rules/` files with a `paths:` field load only when Claude touches matching files. It is context, not enforcement: anything that must never happen belongs in a permission rule instead. The developer-depth version is [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices).

## Workflow 1: screenshot to a real component

The point is not to generate markup that looks right. It is to generate markup that uses your components and your tokens.

```text
Here is a screenshot of the pricing card from the new marketing page.
First, use design-token-extractor on it and tell me which values map to
tokens in tokens/core.json and which do not exist yet. Then build it as
src/components/PricingCard/ using only existing components and tokens.
List anything you could not build without inventing a value.
```

[design-token-extractor](/skills/design/design-token-extractor) is the part that keeps this honest: it names the colors, spacing steps, and type sizes in the image and tells you which ones your system does not have, so a new hex gets a decision instead of slipping in. In the repo, [/design-tokens](/commands/design/design-tokens) does the same job across the whole codebase.

## Workflow 2: critique a screen you already built

Critique against the built page catches the drift a mockup review cannot, because the mockup is not the thing that shipped.

```text
/critique-screen src/app/settings/billing/page.tsx
Compare it against tokens/core.json and the Button and Card components.
Report every hard-coded value, every spacing step that is not on the
scale, and every state that has no styling: hover, focus, disabled,
loading, empty, error.
```

[/critique-screen](/commands/design/critique-screen) runs the structured pass; the same procedure works on an image if the screen is not in this repo. For a WCAG pass rather than a consistency pass, the [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent goes deeper than any design checklist should try to.

## Workflow 3: the spec engineers actually want

The handoff artifact that survives is a spec written from the code, not from the canvas.

```text
Use component-spec-writer on src/components/Modal/. Document props with
their defaults, every state, keyboard behavior, focus management, the
tokens it consumes, and the three cases we handle badly today. Write it
to docs/specs/modal.md and link the Storybook story.
```

[component-spec-writer](/skills/design/component-spec-writer) produces the measurements, states, interactions, and edge cases an engineer would otherwise ask you about in Slack three days later.

## Handing it back to engineers

Your changes are a proposal. Open them as a branch and a pull request, and say which parts you are confident about and which are questions. Before that, the [design-systems-librarian](/agents/design/design-systems-librarian) agent is worth one pass: it answers whether a component already exists, whether your variant duplicates one, and what breaks if a token changes.

The other direction matters too. When a design starts on the canvas, `/design-sync` uploads your repo's React design system to Claude Design so what it produces uses your real components, and a finished design comes back as a handoff bundle you pass to Claude Code with a single instruction. Keeping both sides in step over time is [Maintain a Design System with Claude Code](/guides/design/maintain-a-design-system-with-claude-code).

## Where to go next

Start with one component you know is inconsistent, in a branch, with `/critique-screen` first and a fix second. The skills used above, plus two more, are collected with upload steps in [Claude Skills for Designers](/guides/design/claude-skills-for-designers), and the canvas side of the workflow is the pillar, [Claude Design](/guides/design/claude-design-guide). Everything for your role is at the [designers hub](/for/designers).
