---
name: "component-spec-writer"
description: "Turn a component screenshot or written description into a developer handoff spec covering anatomy, variants, states, a props table with types and defaults, behavior, responsive rules, edge cases, accessibility notes for an auditor to verify, and open questions, keeping what the artifact shows separate from what was inferred and turning every gap into a question instead of a plausible default. Use when a component is going to engineering and the design file is the only documentation that exists."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "multimodal-ai", "coding-languages"]
audience: ["designers"]
tags: ["claude", "designers", "handoff", "component-spec", "cowork"]
featured: false
related: ["skill:design-token-extractor", "agent:design-systems-librarian", "command:new-component", "skill:design-brief-writer", "guide:figma-to-code-with-claude", "guide:claude-skills-for-designers"]
seoDescription: "A Claude skill that turns a component screenshot or description into a handoff spec: anatomy, variants, states, props table, responsive rules, open questions."
summary: "Hand this skill a component screenshot or description and it writes the handoff spec: anatomy, variants, states, a props table with types and defaults, behavior, responsive rules, edge cases, accessibility notes to verify, and open questions. Inferred lines are marked, and a missing value becomes a question rather than a default."
---

Most handoff arguments are about the thing the design did not show: what the button does while the request is in flight, what happens when the label is 60 characters, whether `size` is a prop or three separate components. This skill writes the spec that answers those in advance, from a screenshot you attach or a description you paste. It marks every line SHOWN (visible in the artifact), INFERRED (a reasonable reading, with the reason), or OPEN (nobody has decided). It needs only what you give it, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork. Anthropic's [design plugin](/guides/design/claude-design-plugin-guide) ships a `design-handoff` skill that produces a broad spec and can pull measurements from Figma; this one is narrower on purpose, built around a props table and an explicit open-questions list rather than a filled-in document.

## When to use this skill

- You are adding a component to a shared library and need variants and states written down first.
- A brief from the [design-brief-writer](/skills/design/design-brief-writer) skill named components that now need specifying.
- An engineer is about to run [/new-component](/commands/scaffold/new-component) and needs the props settled.

> [!NOTE]
> The spec never invents a default. If the artifact shows one size, the spec says one size and asks whether more are needed; it does not produce `sm | md | lg` because most systems have them. Accessibility notes here are a to-verify list (what needs a label, focus handling, an announced state), not a compliance claim. Measurement against WCAG belongs to the [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent once code exists.

## Instructions

1. **Name and classify the component.** Its name, what it is (control, container, feedback, navigation), and whether it is a new primitive, a variant of something the library has, or a one-off composition. If it looks like an existing component with different styling, say so first; that is the cheapest finding in the spec.
2. **Describe the anatomy.** A numbered list of parts in visual order, each required or optional: container, icon (optional, leading), label (required), counter (optional, trailing). Anything that might be slot-based rather than a prop is called out here.
3. **List the variants.** Only variants the artifact shows or the description names, each with what changes (fill, border, color role, size) and when to use it. Variants you suspect are missing go to open questions, not the table.
4. **List the states.** Walk this fixed set every time: default, hover, active, focus, disabled, loading, error, selected, read-only, empty. For each: shown in the artifact, specified here as INFERRED, or OPEN. A component with no specified focus state is always an open question.
5. **Write the props table.** Columns: Prop, Type, Default, Required, Description. Types are concrete (`"primary" | "secondary"`, `boolean`, `ReactNode`, `(e) => void`). A default is filled only when the artifact establishes one; otherwise the cell is `OPEN`. Include the event handlers the component needs and any `aria-*` pass-through.
6. **Specify behavior.** What happens on click, on submit, on error, on repeat clicks while loading; whether the component owns its state or is controlled; what it does when an async action fails. Name tokens where a value matters, using the set from the [design-token-extractor](/skills/design/design-token-extractor) skill rather than pasting hex codes.
7. **Write the responsive rules.** How the component behaves as its container narrows: wrap, truncate, stack, go full width, hide a part? Name the breakpoint if the source gives one; otherwise describe the behavior and leave the number OPEN.
8. **List the edge cases.** Longest and shortest content, a translated label roughly 30 percent longer, missing optional parts, a very long single word, zero and very large numbers, an icon with no label, slow networks, repeated rapid interaction.
9. **Write the accessibility notes to verify.** What the component must expose (role, accessible name, state) and what needs testing, phrased as checks for the [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent, which does the audit itself.
10. **Write the open questions,** each addressed to design or engineering and marked BLOCKING or NON-BLOCKING, then assemble the spec in order.

## Output

A Markdown spec with these sections: Component, Anatomy, Variants, States, Props, Behavior, Responsive, Edge cases, Accessibility to verify, Open questions. Save it as `design/specs/<component>.md`. The [design-systems-librarian](/agents/design/design-systems-librarian) agent reads specs like this to find components whose documentation has fallen behind them.

## Example

Excerpt from a spec written from one screenshot of a filled button:

```markdown
## States
| State | Source | Spec |
| --- | --- | --- |
| Default | SHOWN | Filled `{color.action.primary}`, radius `{radius.md}` |
| Focus | OPEN | Not shown. Needs a visible indicator distinct from hover. |
| Loading | INFERRED | Submits a form, so it needs one: spinner replaces the label, width held |

## Props
| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `"primary" \| "secondary"` | `"primary"` | no | Only two are shown in the artifact |
| `size` | OPEN | OPEN | — | One size shown. Are more needed? |

## Open questions
1. BLOCKING (design): focus state treatment.
2. NON-BLOCKING (engineering): is `size` a prop or does the container set it?
```

[Claude skills for designers](/guides/design/claude-skills-for-designers) covers the rest of the set; [Figma to code with Claude](/guides/design/figma-to-code-with-claude) covers what changes when a Figma connection supplies exact measurements.
