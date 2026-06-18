---
name: "extract-module"
description: "Split an overgrown file into cohesive, well-bounded modules — find the natural seams, design each new module's public interface before moving a line, then relocate one unit at a time keeping tests green. Use when a file has grown too large, mixes unrelated responsibilities, or every change to it forces unrelated diffs and merge conflicts."
title: "Extract Module"
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["coding-languages", "architecture"]
related: ["rename-symbol", "trace-data-flow", "dead-code-finder"]
featured: false
summary: "An overgrown file rarely needs to be one file. This skill splits it by cohesion, not line count: it maps which functions share state and purpose, designs the new module boundaries and their public interfaces first, then moves one cohesive unit at a time — updating imports and keeping the suite green after every step, and routing shared types to a leaf module so no cycle forms."
---

Carve a bloated, multi-responsibility file into a handful of focused modules without breaking a thing. The skill first maps what the file actually does and where the seams are — clusters of functions that share state, types, or a single reason to change — then designs each new module's public surface before touching code, and moves the clusters out one at a time so every intermediate state still compiles and passes tests.

## When to use this skill

- A single file has grown past what one person holds in their head, and unrelated edits keep colliding in it.
- One file mixes responsibilities — HTTP handling, business rules, and persistence; or parsing, validation, and formatting — that change for different reasons.
- The file is a chronic merge-conflict hotspot because every feature touches it.
- You need a *safe, incremental* split with a green build at each step, not a big-bang rewrite.

> [!WARNING]
> Do not split by line count. "This file is 1,200 lines, cut it in half" produces two arbitrarily-severed files that still share state and import each other constantly — worse than one. Split by **cohesion**: a module is a set of functions and types with one reason to change and a small interface to everything else. If a proposed boundary would expose more than a handful of symbols, the seam is in the wrong place.

## Instructions

1. **Map responsibilities before touching code.** Read the whole file and list every top-level function/class with its one-line purpose and what state it reads or mutates (module-level variables, shared config, a connection, a cache). Group symbols that touch the same state or serve the same purpose — those clusters are your candidate modules. A symbol that several clusters call but that owns no state is a shared utility; a type used across clusters is shared data.
2. **Find the natural seams.** A good boundary is where the call graph is *narrow*: cluster A calls cluster B through one or two functions, not fifteen. Use `Grep`/`Glob` to count cross-cluster references. Prefer seams that separate by reason-to-change (e.g. transport vs. domain logic) over seams that separate by noun. If two clusters are mutually entangled (each calls deep into the other), they are one module — do not force them apart.
3. **Design the public interface of each new module first — on paper, before moving anything.** For each module, write down: its name/path, the exact symbols it will export, and what it imports. Keep exports minimal — everything not in the list becomes module-private. This is the contract; if it looks awkward now, the seam is wrong and re-cutting a sketch is free.
4. **Extract shared types and pure utilities to a leaf module first.** Before moving any cluster, pull the types and zero-dependency helpers that multiple clusters share into a dependency-free leaf module (e.g. `types.ts`, `shared.ts`). Every other new module imports *from* it and it imports from none of them. This single move is what prevents the cycles that splitting otherwise creates.
5. **Move one cohesive unit at a time.** Cut one cluster into its new file, add the planned exports, and update every importer with `Edit`. Re-point the original file to re-export or import from the new module so external callers keep working. Then run the build and test suite. Never move two clusters before verifying — a failure must point at exactly one move.
6. **Check the dependency direction after each move.** After relocating a cluster, confirm the new module does not import (directly or transitively) anything that imports it back. If a cycle appears, the cause is almost always a symbol living in the wrong module — move that symbol to the leaf module from step 4, or invert the dependency by passing the value in as an argument instead of importing it.
7. **Collapse the husk last.** Once every cluster is out, the original file is either an empty re-export barrel or gone. Decide deliberately: keep it as a thin barrel if external callers depend on its path, or delete it and update the remaining importers. Verify the full suite one final time.

> [!NOTE]
> Keep the original file as a temporary re-export barrel (`export * from './new-module'`) during the move. External callers stay green while you extract internally, and you can delete the barrel in a final, isolated commit once nothing imports the old path — turning a scary refactor into a sequence of trivially-revertable steps.

## Output

1. **A module boundary map** — a table of each proposed module with its path, the symbols it owns (private), the symbols it exports (its interface), and what it imports. Shared types/utilities are listed as the leaf module everything depends on.

   | Module | Exports (public) | Imports | Owns (private) |
   | --- | --- | --- | --- |
   | `parser/types.ts` | `Token`, `AstNode`, `ParseError` | — (leaf) | — |
   | `parser/lex.ts` | `tokenize` | `types` | `scanIdent`, `scanNumber` |
   | `parser/parse.ts` | `parse` | `types`, `lex` | `parseExpr`, `parsePrimary` |
   | `parser/index.ts` | `parse`, `tokenize` (barrel) | `lex`, `parse` | — |

2. **An incremental move plan** — an ordered list of steps, each independently verifiable, e.g.:
   - Step 1: extract `parser/types.ts` (leaf), update in-file references → build + tests green.
   - Step 2: move lexer cluster to `parser/lex.ts`, re-export from original → green.
   - Step 3: move parser cluster to `parser/parse.ts` → green.
   - Step 4: replace original file with `parser/index.ts` barrel, delete dead path → green.

   Each step is one commit with the verifying command output, so any regression reverts to exactly one change.
