---
description: "Extract design tokens from a stylesheet, a Tailwind or theme config, or a screenshot, then create or update design/tokens.json and report every added, changed, and removed token."
seoDescription: "/design-tokens extracts tokens from CSS, a theme config, or a screenshot into design/tokens.json and lists every added, changed, and removed token."
date: 2026-09-10
argument-hint: "[stylesheet, config, or image path]"
allowed-tools: "Read, Write, Glob, Grep"
title: "Design Tokens"
color: "purple"
topics: ["ai-at-work", "multimodal-ai", "coding-languages"]
audience: ["designers"]
featured: false
related: ["skill:design-token-extractor", "agent:design-systems-librarian", "glossary:design-tokens", "command:new-component", "guide:maintain-a-design-system-with-claude-code"]
summary: "A Claude Code slash command that reads the stylesheet, theme config, or screenshot you pass, extracts tokens as W3C DTCG-style JSON, and writes design/tokens.json. When that file already exists it diffs against it first and prints every added, changed, and removed token, so re-running it is reviewable rather than destructive."
---

Turn whatever holds your visual values right now into a token file, and keep that file honest as the design changes. This command runs the [design-token-extractor](/skills/design/design-token-extractor) skill over the source you name, then writes or updates `design/tokens.json`. The second run matters more than the first: it diffs the new extraction against the file already on disk and shows you what changed before anything is written.

## Scope

Interpret `$ARGUMENTS` in this order:

1. **A stylesheet or config path** (`.css`, `.scss`, `tailwind.config.*`, `theme.ts`, `tokens.css`): `Read` it. Values from a file are exact; use them as given.
2. **An image path** (`.png`, `.jpg`, `.webp`): `Read` it. Values from an image are estimates and every one is labeled as such in the notes.
3. **Several paths**: read all of them, extract once across the set, and record which file each token came from. Where two files disagree on a value, both are reported and neither is silently preferred.
4. **A directory**: `Glob` inside it for stylesheets and configs, list what you found, and proceed with those.
5. **Empty**: `Glob` for `tailwind.config.*`, `**/theme.{ts,js}`, `src/**/*.css`, and `styles/**/*.css`, list what you found, ask which to use, and stop.

If a path cannot be read, say so and continue with the rest.

> [!NOTE]
> The output is DTCG-*style*: it uses the [W3C Design Tokens Community Group](https://tr.designtokens.org/format/) format's `$value`, `$type`, and `$description` keys so token tooling can consume it, but this command does not validate against the specification and makes no conformance claim.

## Step 1 — Read the source and collect raw values

Read each source in full. For a stylesheet or config, use `Grep` to count how often each color, size, spacing value, radius, and shadow appears across the project, not just in the file you were given; frequency is what separates a token from a one-off. For an image, list only what you can distinguish and say where in the screen you looked.

## Step 2 — Cluster, scale, and name

Cluster near-identical colors into one token and say which values were merged. Sort font sizes and report the ratio between steps and how well it holds. Test spacing values against a 4px or 8px base and list the ones that do not fit rather than rounding them in. Name by role where usage makes the role clear (`color.action.primary`, `font.size.body`), by ramp step where it does not (`color.neutral.700`). Semantic tokens alias ramp tokens (`"$value": "{color.neutral.900}"`) so the ramp stays the single source.

## Step 3 — Diff against the existing file

`Glob` for `design/tokens.json`. If it exists, read it and compare, then print three lists before writing anything:

- **Added** — tokens in the new extraction that the file does not have.
- **Changed** — same token name, different `$value`, with both values shown.
- **Removed** — tokens in the file that the source no longer contains, listed as candidates only.

Never delete a token because the source you were given this run does not include it; that source may be one stylesheet out of five. Removals are reported and left in the file, marked with a `$description` note, unless the user says to drop them.

## Step 4 — Write the file

Write `design/tokens.json` with groups in the order `color`, `font`, `space`, `radius`, `shadow`, creating `design/` if needed. Preserve any `$description` a human wrote in the existing file; do not overwrite a curated description with a generated one. On a first run, write the file and say it is a starting point that needs a human pass over the names.

## Output

The three diff lists (or "new file" on the first run), the path written, the token count by group, and the ambiguities list: values estimated from an image, colors merged, values that missed the scale, and names that were guessed. Then a next-step line: run the [design-systems-librarian](/agents/design/design-systems-librarian) agent to find where the codebase still hardcodes values this file now names, and use the token names in [/new-component](/commands/scaffold/new-component) so new work starts on the system. Keeping the file current is covered in [Maintain a design system with Claude Code](/guides/design/maintain-a-design-system-with-claude-code), the rest of the designer set in [Claude skills for designers](/guides/design/claude-skills-for-designers), and the term itself in [design tokens](/glossary/design-tokens).
