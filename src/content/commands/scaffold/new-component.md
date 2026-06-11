---
description: "Scaffold a new UI component matching the project conventions."
date: 2026-06-03
argument-hint: "<ComponentName> [props]"
allowed-tools: "Read, Grep, Glob, Write, Edit"
title: "New Component"
color: "purple"
topics: ["coding-languages"]
related: ["frontend-developer", "react-specialist", "write-tests"]
summary: "A slash command that scaffolds a new UI component matched to the repo's existing conventions: it studies the closest neighbor component for framework, file layout, styling, prop typing, and test/story patterns, generates the component plus only the supporting files neighbors have, then verifies with lint and typecheck and reports."
---

Scaffold a new UI component named in `$ARGUMENTS`, generated to match this repository's existing conventions exactly. Discover the conventions first by reading real neighbor components — never impose a structure the repo does not already use.

## Scope

Read `$ARGUMENTS` as `<ComponentName> [props]`:

- The first token is the component name in the project's casing (e.g. `UserCard`, `user-card`). Normalize it to whatever convention the codebase uses, not your own preference.
- Any remaining tokens are a rough prop list — `title:string variant?:primary|secondary count:number onSelect:fn`. Treat `?` as optional and `fn` as a callback. If props are vague, infer a minimal sensible interface and note your assumptions.

If `$ARGUMENTS` is empty, ask for the component name and its purpose before generating anything. Do not invent a component the user did not request.

## Step 1 — Detect the project's conventions

Before writing a single line, find a representative existing component and study how it is built. This is the most important step — everything downstream mirrors what you find here.

```bash
# Find existing components to mirror (adapt globs to the repo)
fd -e tsx -e jsx -e vue -e svelte . src/components src/app 2>/dev/null | head -30

# Inspect the manifest for framework, test runner, and styling deps
cat package.json
```

From a real neighbor file, extract and write down:

- **Framework & file type** — React `.tsx`, Vue SFC `.vue`, Svelte `.svelte`, Solid, Angular.
- **File layout** — one file per component vs. a folder (`Button/index.tsx`, `Button.tsx`, `Button.test.tsx`, `Button.stories.tsx`).
- **Styling** — Tailwind classes, CSS Modules, `styled-components`, vanilla-extract, plain CSS. Note any `cn()`/`clsx` helper and variant utility (`cva`, `tv`).
- **Prop typing** — `interface Props` vs. `type Props`, `React.FC` vs. plain function, `forwardRef`, default exports vs. named.
- **Test / story patterns** — the test framework (`vitest`, `jest`, `@testing-library`), and whether stories use CSF, MDX, or none.
- **Imports & aliases** — path aliases (`@/components`), import ordering, and how shared primitives are imported.

> [!NOTE]
> Pick the closest neighbor to what you are building (a card if scaffolding a card) and mirror it line for line — directory, naming, export style, and formatting. A component that looks hand-written by the team beats a "correct" one that fights the codebase.

## Step 2 — Generate the component

Create the component file at the location and with the naming the codebase uses. The block below is illustrative — match the framework and style you found in Step 1, not this snippet.

```tsx
import { cn } from "@/lib/utils";

interface UserCardProps {
  title: string;
  variant?: "primary" | "secondary";
  count: number;
  onSelect?: () => void;
}

export function UserCard({
  title,
  variant = "primary",
  count,
  onSelect,
}: UserCardProps) {
  return (
    <div
      className={cn("rounded-lg border p-4", variant === "primary" && "bg-card")}
      onClick={onSelect}
    >
      <h3>{title}</h3>
      <span>{count}</span>
    </div>
  );
}
```

- Reuse existing primitives and helpers (the local `cn()`, shared `Button`, design tokens) instead of reintroducing your own.
- Keep the public prop surface minimal and typed; derive optionality from the `?` markers in `$ARGUMENTS`.
- Match the neighbor's export style (named vs. default) so existing import patterns keep working.

> [!WARNING]
> Only create the files needed for this component. Do not edit unrelated files, restructure folders, add dependencies, or change shared config. If a missing helper or barrel export is required, flag it rather than silently introducing a new pattern.

## Step 3 — Add types, test, and story

Generate the supporting files that the neighbor component has — no more, no fewer. If the project keeps types inline, keep them inline; if it ships a `.test.tsx` and a `.stories.tsx` alongside each component, produce both in the same folder.

```tsx
// UserCard.test.tsx — mirror the project's test framework and queries
import { render, screen } from "@testing-library/react";
import { UserCard } from "./UserCard";

test("renders the title", () => {
  render(<UserCard title="Ada" count={3} />);
  expect(screen.getByText("Ada")).toBeInTheDocument();
});
```

- Put each file exactly where the codebase puts it, and use its import aliases.
- Cover the rendered output and one prop-driven branch in the test; do not over-test scaffolding.
- If the repo has no tests or no stories, skip that artifact — do not introduce a tool the project does not use.

> [!NOTE]
> If you add the component to a barrel file (`index.ts`) or registry, only do so when neighbors are exported the same way. Follow the existing export ordering.

## Step 4 — Verify and report

Confirm the generated files fit the project before handing back.

```bash
# Adapt to the repo's commands
npm run lint
npx tsc --noEmit   # or the project's typecheck/build command
# npm run build    # heavier fallback if you need a full bundle
```

Report concisely:

- **Files created** — each path, and the neighbor file each one was modeled on.
- **Props** — the resolved interface and any optionality or types you inferred.
- **Conventions followed** — framework, styling approach, export style, and test/story pattern matched.
- **Follow-ups** — anything intentionally skipped (no story because the repo has none) or a missing helper the user should wire up.
