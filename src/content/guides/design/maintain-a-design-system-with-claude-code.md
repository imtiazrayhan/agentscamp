---
title: "Maintaining a Design System with Claude Code"
description: "Tokens, components, docs, and the Figma file drift apart within weeks. A repo layout, CLAUDE.md rules, and three Claude Code jobs that catch it every week."
seoTitle: "Maintaining a Design System with Claude Code"
seoDescription: "Stop design-system drift: a repo layout Claude can navigate, CLAUDE.md rules, a drift report, tokens generated from Figma variables, and per-component specs."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "multimodal-ai", "coding-languages"]
audience: ["designers"]
tags: ["design-system", "design-tokens", "claude-code", "figma", "documentation", "claude-md"]
featured: false
keywords: ["maintain design system Claude Code", "design system drift", "design tokens from Figma", "component documentation AI", "design system audit"]
summary: "A design system drifts across four surfaces at once: Figma variables, the token file, the components, and the docs. Claude Code is good at exactly this kind of comparison work. Put the four surfaces in one repo, write the rules into CLAUDE.md, generate tokens from Figma variables rather than typing them, and run a drift report on a schedule."
keyTakeaways:
  - "Drift is a comparison problem across four surfaces: Figma variables, the token file, component code, and the docs. Comparison is what an agent is good at."
  - "Generated tokens beat maintained tokens. Export Figma variables with get_variable_defs, generate the token file from them, and ban hand edits."
  - "A raw hex or px value inside a component is the single highest-signal drift marker; make it a rule in CLAUDE.md and grep for it."
  - "Every component folder gets a spec file with variants, states, props, accessibility notes, and the Figma node URL it implements."
  - "Run the drift report on a schedule and treat its output as issues, not edits. An agent fixing drift unattended will happily delete a token something still uses."
  - "Path-scoped rules in .claude/rules keep system rules out of context until Claude opens a file in the component folder."
faq:
  - q: "Why does a design system drift even when everyone is careful?"
    a: "Because the same fact is stored in four places that update on different schedules. A designer renames a variable in Figma, an engineer ships a one-off hex under deadline, a component gains a variant nobody documents, and the docs site keeps describing last quarter's props. No single change is wrong; the gap between them accumulates. Detecting it means reading all four surfaces at once and comparing, which is tedious for a person and cheap for an agent."
  - q: "Should Claude fix the drift it finds?"
    a: "Not automatically. Let it produce a report and open the fixes as separate, reviewable changes. Deleting an unused token is safe until it turns out a marketing page imports it; renaming a component prop is safe until an app outside the repo consumes it. Generating tokens from an export is the one step worth automating, because the source of truth is unambiguous and the output is regenerated rather than edited."
  - q: "Do I need the Figma MCP server for this?"
    a: "Not strictly, but it removes the transcription step. get_variable_defs returns the variables and styles behind a selection, so your token file can be generated from the design file instead of retyped from it. Without the server you can still export variables by hand and run the same comparison, you just repeat the export manually. The remote server is available on all seats and plans."
  - q: "How much of this belongs in CLAUDE.md versus a rules file?"
    a: "Put the short, always-true rules in CLAUDE.md: where tokens come from, that components may only use token classes, that every component has a spec. Anthropic recommends keeping each CLAUDE.md under about 200 lines. Anything longer and file-specific, such as the full component authoring checklist, belongs in .claude/rules with a paths field so it loads only when Claude opens a file in the component folder."
related: ["guide:claude-design-guide", "guide:figma-to-code-with-claude", "guide:claude-code-for-designers", "agent:design-systems-librarian", "command:design-tokens", "skill:component-spec-writer", "tool:figma-mcp", "glossary:design-tokens"]
sources:
  - title: "How Claude remembers your project (CLAUDE.md, .claude/rules, path-scoped rules)"
    url: "https://code.claude.com/docs/en/memory"
    publisher: "Anthropic"
  - title: "Figma MCP server: tools and prompts"
    url: "https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/"
    publisher: "Figma"
  - title: "Guide to the Figma MCP server"
    url: "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server"
    publisher: "Figma"
---

A design system does not break, it drifts. The Figma variables, the token file, the component code, and the documentation describe the same system on four different dates, and by the time someone notices, nobody can say which one is right. Claude Code is well suited to this because drift is a comparison problem, and comparison across four surfaces is tedious for a person and cheap for an agent.

This is the maintenance half of design work. Getting a frame into code is covered in [Figma to code with Claude Code](/guides/design/figma-to-code-with-claude); the wider picture is in the pillar, [Claude for design work](/guides/design/claude-design-guide). Definitions live in the glossary under [design tokens](/glossary/design-tokens).

## The four surfaces that disagree

| Surface | Drifts when | Symptom |
|---|---|---|
| Figma variables | A collection is renamed or a value nudged | Code has a token Figma no longer defines |
| Token file | Someone adds a value by hand | A token exists that no design ever used |
| Component code | A hex is pasted under deadline | Two buttons that look alike are not alike |
| Docs and specs | A variant ships without documentation | Engineers copy an existing component instead |

None of those four events is a mistake in isolation. The cost is the gap between them, and the gap is invisible until you read all four at once.

## A repo layout an agent can navigate

Put the surfaces in one repository, and name things so a file's job is obvious from its path:

```text
design-system/
├── tokens/
│   ├── figma-variables.json     # raw export, never hand-edited
│   └── tokens.css               # generated from the export
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.spec.md       # the human-readable contract
│       └── Button.test.tsx
├── docs/
│   └── patterns/
└── .claude/
    └── rules/
        └── components.md
```

Two things matter here. The token file is *generated*, so a diff on it is meaningful rather than a mix of intent and typos. And each component folder carries its own spec beside the code, so documentation drift shows up in the same pull request as the change that caused it.

## Rules the system enforces on itself

`CLAUDE.md` at the repo root is read at the start of every session, so it is where the non-negotiables go:

```markdown
## Design system rules

- Tokens are generated. Re-run the export to change `tokens/figma-variables.json`;
  never hand-edit `tokens/tokens.css`.
- Components may only use token classes. A raw hex, rgb, or px value under
  `components/**` is a bug, not a style choice.
- Every component folder has a `.spec.md` listing variants, states, props,
  accessibility notes, and the Figma node URL it implements.
- New variants are added to the spec first, the component second.
- Deprecations are additive: keep the old export, mark it deprecated, and add a
  migration line to the spec.
```

Keep that file short. Anthropic's guidance is to target under 200 lines per `CLAUDE.md`, because long files consume context and reduce how reliably instructions are followed; [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices) goes further. Longer, file-specific material belongs in `.claude/rules/`, where a `paths` field scopes it to matching files:

```markdown
---
paths:
  - "components/**/*.tsx"
---

# Component authoring

- Props are typed, no `any`. One component per file, named export.
- Every interactive element has a visible focus style and an accessible name.
- Loading, empty, disabled, and error states are implemented, not left to callers.
```

That rule only enters context when Claude opens a component file, so the rest of your sessions are not paying for it.

## The weekly drift report

Give the audit to a subagent so the file reading it does stays out of your main session and comes back as a report. The [design-systems-librarian](/agents/design/design-systems-librarian) agent is built for this: it reads the token file, the components, and the specs, and returns a list rather than a set of edits.

A useful report answers five questions:

1. Which token classes are defined but referenced nowhere?
2. Which components contain a raw color, spacing, or radius value?
3. Which components have variants or states the spec does not mention, or a spec entry the code does not implement?
4. Which two components are close enough to be duplicates?
5. Which specs point at a Figma node URL that no longer resolves?

Run it on a schedule and open the findings as issues. Resist the temptation to let an agent fix drift unattended: an unused token is unused until a marketing page imports it, and a prop rename is safe until something outside the repo consumes it. The exception is the token file itself, which is regenerated rather than edited.

## Regenerating tokens instead of maintaining them

The Figma MCP server exposes `get_variable_defs`, which returns the variables and styles behind a selection: colors, spacing, typography. Export that to `tokens/figma-variables.json`, then run the [design-tokens](/commands/design/design-tokens) command to regenerate `tokens.css` from it and print a diff of what changed. Setup for the server is in [Figma to code with Claude Code](/guides/design/figma-to-code-with-claude), and its tools are listed on the [Figma MCP](/tools/figma-mcp) tool page.

Two more tools matter once the system is real. `get_code_connect_map` resolves Figma node IDs to the code components they represent, and `add_code_connect_map` records new mappings, which is what stops an agent from re-implementing a button that already exists. Figma also ships a `create_design_system_rules` prompt that generates a rules file for aligning generated code with your system; treat its output as a first draft of the rules above rather than a finished policy.

> [!WARNING]
> Regenerating tokens will happily rename or drop a token that code still imports. Run the generation and the drift report in the same session, and read the removals before merging.

## Documentation that survives the next change

Specs rot because writing them is nobody's favorite hour. Hand the first draft to the [component-spec-writer](/skills/design/component-spec-writer) skill: it reads the component and produces a spec with variants, states, props, accessibility notes, and usage guidance in a fixed shape, which you then correct. A wrong draft you edit in five minutes beats a blank file that stays blank for a quarter.

Then make the spec load-bearing. If the rule is that new variants go into the spec first, the spec stops being a description of the past and becomes the thing the next change is written against.

## The review checklist

Before a component change merges, run through this. Claude can check every item except the last two.

- Every color, spacing, and radius value resolves to a token; nothing raw.
- Variants and states in the code match the spec, in both directions.
- Loading, empty, disabled, and error states exist and are reachable.
- Focus is visible, targets are large enough, and contrast holds in both themes. The [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent covers this properly against WCAG.
- The spec's Figma node URL still resolves to the frame the code implements.
- No near-duplicate of an existing component was introduced.
- A human looked at the rendered component, not just the diff.

If your team also wants critique, handoff specs, and UX copy inside the same setup, Anthropic's plugin covers that side and is walked through in [Anthropic's design plugin](/guides/design/claude-design-plugin-guide). For the terminal groundwork behind all of it, start at [Claude Code for designers](/guides/design/claude-code-for-designers).
