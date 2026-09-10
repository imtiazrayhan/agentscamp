---
name: "design-token-extractor"
description: "Read a screenshot, a pasted stylesheet, or a written component description and produce a design token set as W3C DTCG-style JSON, with colors, a type scale, spacing, radii, and shadows grouped and named, followed by a notes list saying which values were read exactly, snapped to a scale, or estimated by eye. Use when a design exists only as pixels or ad-hoc CSS and you need a named token set to start from."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "multimodal-ai", "coding-languages"]
audience: ["designers"]
tags: ["claude", "designers", "design-tokens", "css", "cowork"]
featured: false
related: ["command:design-tokens", "glossary:design-tokens", "skill:component-spec-writer", "agent:design-systems-librarian", "tool:figma-mcp", "guide:claude-skills-for-designers"]
seoDescription: "A Claude skill that extracts colors, type scale, spacing, radii, and shadows from a screenshot or CSS into W3C DTCG-style JSON, with every ambiguity listed."
summary: "Give this skill a screenshot, a pasted stylesheet, or a component description and it returns tokens as W3C DTCG-style JSON: colors, type scale, spacing, radii, and shadows, grouped and named. An ambiguities list follows, saying which values were read exactly, snapped to a scale, or estimated from an image."
---

Most design systems start as a pile of values that already exist somewhere: a screenshot, a stylesheet nobody has pruned, or a paragraph describing what a button looks like. This skill turns any of those into a first token set. Colors, type, spacing, radii, and shadows come back grouped and named in JSON shaped like the [W3C Design Tokens Community Group](https://tr.designtokens.org/format/) format, with `$value` and `$type` on every token, and every judgment call listed rather than hidden. It needs only what you paste or attach, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork. In a project, [/design-tokens](/commands/design/design-tokens) runs it on a file and writes `design/tokens.json`.

## When to use this skill

- A design exists as a screenshot and engineering wants named values, not hex codes copied one at a time.
- A stylesheet has 40 grays and you want to see the actual palette before deciding which to keep.
- You are preparing input for the [design-systems-librarian](/agents/design/design-systems-librarian) agent, which needs a token file to compare code against.

> [!NOTE]
> The output is DTCG-*style*: it uses that format's `$value`, `$type`, and `$description` keys so most token tooling can read it, but this skill does not validate against the specification and does not claim conformance. Values read from an image are estimates. Anything measured by eye is labeled as such in the notes, and a token derived from one occurrence is never presented as a system-wide decision.

## Instructions

1. **Identify the input type** and say what it limits. A screenshot gives approximate colors (compression and screen profile shift them) and no state or motion values. A stylesheet gives exact values but no intent. A description gives intent but no numbers. State this in one line before the JSON.
2. **Collect raw values.** From CSS or a theme config, list every color, font size, weight, line height, spacing value, radius, and shadow with how many times each appears. From an image, list what you can distinguish and say where you looked. Frequency matters: a value used once is a candidate for removal, not a token.
3. **Cluster the colors.** Group near-identical values (`#111827` and `#111928` are one token, not two), then sort into brand, neutral ramp, and semantic roles (success, warning, danger, info) based on where they are used. Name by role where the usage is clear, by ramp step where it is not: `color.neutral.700`, not `color.dark-gray-ish`.
4. **Derive the type scale.** Sort the font sizes, look for a ratio between steps, and report the ratio you found and how well it holds. Name steps by role (`font.size.body`, `font.size.heading.lg`) when the usage is visible, by step number when it is not. Include weights and line heights as their own groups.
5. **Derive the spacing scale.** Sort the spacing values and test them against a base step, usually 4 or 8. Report which values fit the step and which do not; do not round an outlier into the scale silently. Off-scale values go to the notes as candidates for correction.
6. **Collect radii and shadows.** Radii as a small named set (`radius.sm`, `radius.md`, `radius.full`). Shadows as composite tokens with their offset, blur, spread, and color, named by elevation.
7. **Write the JSON.** One object, groups in this order: `color`, `font`, `space`, `radius`, `shadow`. Every token is `{ "$value": …, "$type": …, "$description": … }` where the description names where the value was found. Use aliases (`"$value": "{color.neutral.900}"`) for semantic tokens that point at a ramp step, so the ramp stays the single source.
8. **Write the ambiguities list.** One line each for: values estimated from an image, colors clustered and why, values that missed a scale, names you had to guess, and anything the input could not supply (dark mode, motion, states, breakpoints). This list is the point of the skill; do not compress it.
9. **Close with the next step:** which tokens need a human decision before committing.

## Output

A fenced JSON block with the token set, then the ambiguities list, then the next-step line. Save it as `design/tokens.json` and hand it to the [design-systems-librarian](/agents/design/design-systems-librarian) agent to find where the code still hardcodes those values, or to the [component-spec-writer](/skills/design/component-spec-writer) skill so a spec can reference token names instead of hex codes. The [design tokens](/glossary/design-tokens) entry defines the term.

## Example

Excerpt from a token set extracted from one dashboard screenshot:

```json
{
  "color": {
    "neutral": {
      "900": { "$value": "#111827", "$type": "color", "$description": "Heading text and top nav background" }
    },
    "action": {
      "primary": { "$value": "{color.brand.600}", "$type": "color", "$description": "Filled buttons and links" }
    }
  },
  "space": {
    "4": { "$value": "16px", "$type": "dimension", "$description": "Card padding; most common gap in the screen" }
  }
}
```

```markdown
## Ambiguities
- All colors are sampled from a PNG; treat them as within a few points of the real values.
- #111827 and #111928 were clustered as one token (used in the nav and in headings).
- Two spacing values (10px, 18px) do not fit the 4px step. Both appear once. Candidates for correction.
- No dark mode, hover, or focus values are visible in this screenshot.
```

Where this sits in the designer set is covered in [Claude skills for designers](/guides/design/claude-skills-for-designers); [Figma to code with Claude](/guides/design/figma-to-code-with-claude) covers the path when a [Figma MCP](/tools/figma-mcp) server is available instead of a screenshot.
