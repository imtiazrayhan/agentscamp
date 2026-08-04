---
description: "Extract a code region into a well-named function and update the call site."
seoDescription: "/extract-function pulls a code region into a well-named function and updates the call site without changing behavior — a Claude Code slash command."
date: 2026-06-03
argument-hint: "<file:lines or description>"
allowed-tools: "Read, Grep, Glob, Edit"
title: "Extract Function"
color: "purple"
topics: ["review-qa"]
related: ["command:refactor", "agent:refactoring-specialist"]
summary: "A slash command that extracts a code region into a single well-named function and replaces the original lines with a call: it pins down the span, works out inputs, outputs, mutations, and tricky early returns or closure captures, matches the file's conventions, then verifies callers, tests, lint, and types — strictly behavior-preserving."
---

Extract a region of code into a single, well-named function and replace the original code with a call to it. The result must behave exactly as before — this is a mechanical refactor, not a redesign.

## Scope

Interpret `$ARGUMENTS` as the region to extract:

- **`path/to/file.ts:40-72`** — extract those line numbers in that file.
- **A description** like *"the validation block in `createUser`"* — locate the matching region with `Grep`/`Glob` before touching anything.

If `$ARGUMENTS` is empty, ask which region to extract. Do not guess — extracting the wrong span produces a function nobody asked for.

> [!WARNING]
> This is behavior-preserving. Do not add features, change return values, fix bugs you notice along the way, or alter side effects. If you spot a real bug, stop and report it instead of folding a fix into the extraction.

## Step 1 — Locate and read the region

Read the file and pin down the exact span. Read enough surrounding context to see what comes before and after the region, not just the lines themselves.

```bash
# When $ARGUMENTS names a file
rg -n "createUser" path/to/file.ts

# Confirm the enclosing function and its boundaries
rg -n "^\s*(function|const|def|fn|public|private)" path/to/file.ts
```

Confirm the region is a coherent unit — one job, with a clear top and bottom. If the lines straddle two unrelated concerns, extract the smaller coherent piece and say so.

## Step 2 — Determine inputs and outputs

This is the part that breaks naive extractions. Work out exactly what the region consumes and what it produces.

- **Inputs (parameters):** every variable the region *reads* but does not itself define inside the region. These become parameters.
- **Outputs (return value):** variables defined inside the region that are *read after* it. One value → return it. Several → return a tuple/object, or keep the extraction smaller.
- **Mutations:** values the region mutates in place (array pushes, object field writes, mutated arguments). The caller must still observe these — pass the object through and mutate it, or return the new value and reassign at the call site.

> [!WARNING]
> Watch for **captured closure state** and **early returns**. A `return`/`break`/`continue`/`throw` inside the region changes control flow for the *enclosing* function — a plain extracted function cannot reproduce a `break` in the caller's loop, and an early `return` becomes a return from the new function, not the original. If the region contains either, model it explicitly (return a sentinel and branch at the call site, or leave the control-flow line outside the extraction) or report that the region is not cleanly extractable.

## Step 3 — Write the function

Create the function with a name that states what it does, not how. Place it sensibly: a module-level helper near related functions, or a private method on the same class if it uses instance state.

```ts
// Before — inline region inside createUser
const trimmed = input.email.trim().toLowerCase();
if (!trimmed.includes("@") || trimmed.length > 254) {
  throw new ValidationError("invalid email");
}
const email = trimmed;

// After — extracted, single responsibility, descriptive name
function normalizeEmail(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed.includes("@") || trimmed.length > 254) {
    throw new ValidationError("invalid email");
  }
  return trimmed;
}
```

Match the file's existing conventions — async/sync, error handling, naming style, and how other helpers in the file are declared and exported.

## Step 4 — Replace the original with a call

Swap the region for a call that wires up the same inputs and outputs. Keep the surrounding variable names identical so the rest of the function is untouched.

```ts
// Inside createUser
const email = normalizeEmail(input.email);
```

Preserve order of operations. If the region had side effects (logging, I/O, mutation) sequenced relative to its neighbors, the call must sit at the exact same point.

## Step 5 — Verify behavior is unchanged

Find and read every caller of the enclosing code path, then confirm the contract still holds.

```bash
# Find callers of the function you edited
rg -n "createUser\(" --type ts

# Run the tests covering this code
npm test            # or: pytest, go test ./..., cargo test
```

- The same arguments must flow in and the same value/mutations must flow out.
- Run the linter and type checker — a type error here usually means an input or output was mis-classified in Step 2.

> [!NOTE]
> If a test had to change to keep passing, behavior changed. Revert and re-examine the inputs/outputs — a correct extraction never requires touching assertions.

## Report

Summarize concisely:

- **Extracted** — the new function name, its signature, and where it now lives.
- **Call site** — the file and line where the region was replaced.
- **Inputs/outputs** — parameters in, value(s) out, and any mutations preserved.
- **Verification** — that callers, tests, lint, and types still pass.
- **Caveats** — any early-return or closure-capture handling, or anything you left out of scope.
