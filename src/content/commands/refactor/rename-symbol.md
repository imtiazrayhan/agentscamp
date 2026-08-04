---
description: "Safely rename a symbol project-wide, distinguishing the real symbol from coincidental substring matches."
date: 2026-06-17
argument-hint: "<oldName> <newName>"
allowed-tools: "Read, Grep, Glob, Edit, Bash"
title: "Rename Symbol"
color: "purple"
topics: ["coding-languages"]
related: ["command:extract-function", "command:refactor", "command:find-bug"]
featured: false
summary: "A slash command that renames a function, class, variable, type, or constant project-wide without collateral damage: it locates the definition, separates the real symbol from coincidental substring matches by scope and word boundary, updates every reference, import/export, test, comment, and name-encoding filename, then proves nothing broke with the project's typecheck, build, and tests."
faq:
  - q: "Why not just do a global find-and-replace?"
    a: "A blind search-and-replace matches substrings (`user` inside `username`, `currentUser`, `userId`) and unrelated symbols of the same name in other scopes or modules. It silently corrupts code that happens to share characters. This command anchors on word boundaries and the symbol's actual binding instead."
  - q: "Does it handle renaming the file too?"
    a: "Yes — Step 6 detects when the filename encodes the symbol (e.g. `UserService.ts` for class `UserService`), renames the file with `git mv`, and fixes every import path that referenced the old name."
---

Rename a code symbol — a function, class, method, variable, type, interface, enum, or constant — everywhere it appears, so the project compiles and behaves exactly as before under the new name. This is a precision refactor: the danger is not finding too few matches, it is changing too many.

## Scope

Parse `$ARGUMENTS` as exactly two tokens: the **old name** then the **new name**.

- `getUserById fetchUserById` → rename `getUserById` to `fetchUserById`.
- If only one token is given, or the two are identical, ask for the missing piece. Do not invent the target name.
- If `$ARGUMENTS` is empty, ask: *"Which symbol should I rename, and to what?"* and stop.

If the old name is **ambiguous** — it resolves to more than one distinct symbol (e.g. a local `id` in three unrelated functions, or a `Status` type and a `Status` enum) — list the candidates with their file and line and ask which one. Renaming the wrong binding is worse than renaming nothing.

> [!WARNING]
> This is behavior-preserving. Rename only — do not change the symbol's type, signature, value, or call order, and do not "improve" code you pass through. A rename that needs a test assertion changed is a rename that broke something.

## Step 1 — Find and read the definition

Locate where the symbol is **defined**, not just used. The definition tells you its kind (function/class/type/const), its scope (module-level, class member, block-local), and whether it is exported.

```bash
# Anchor on word boundaries so `getUser` does not match `getUserById`
rg -nw "getUserById" --type-add 'src:*.{ts,tsx,js,jsx,py,go,rs,java}' -tsrc

# Narrow to likely definition sites
rg -nw "(function|const|let|class|interface|type|enum|def|fn|public|private)\s+getUserById"
```

Read the definition and its immediate surroundings. Establish three facts before editing anything:

1. **Kind** — function, class, type, variable, etc. (affects where else the name can legally appear).
2. **Scope** — is this name unique in the project, or shadowed/reused in other scopes?
3. **Export surface** — is it exported? Re-exported through a barrel/index file? Part of the public API?

## Step 2 — Separate the real symbol from coincidental matches

This is the core of the command and where naive renames fail. A raw text match for the old name will hit three categories — you must keep only the first.

- **The symbol itself** — keep. Same binding, in scope.
- **A different symbol with the same name** — skip. A local `count` in another function, a `Status` from another module. Same characters, unrelated binding.
- **A substring of an unrelated identifier** — skip. `user` inside `username`, `userId`, `getUser`, `superuser`.

> [!WARNING]
> Never run an unanchored find-and-replace. `s/user/account/g` rewrites `username`, `currentUser`, and `userId` and is almost impossible to fully undo. Always match whole words (`rg -w`, `\b…\b`) and, when the name is common, confirm each hit resolves to the binding you read in Step 1 — by scope, import source, or the object/class it hangs off.

For methods and fields accessed via `.`, scope the match to the receiver's type. Renaming a `save` method on `OrderRepo` must not touch `save` on every other object in the codebase. Read the call to confirm the receiver before editing.

## Step 3 — Build the reference list

Sweep for every legitimate occurrence and group it by category so nothing is missed:

```bash
# All whole-word occurrences, with file:line for review
rg -nw "getUserById"

# Imports / exports / barrel re-exports that name it
rg -nw "getUserById" -g '*.{ts,js}' -g '!**/*.test.*' | rg "import|export|require|from"

# Tests, fixtures, and snapshots referencing it
rg -nw "getUserById" -g '*{test,spec}*' -g '*__snapshots__*'

# Docs, comments, and string literals (rename only if the string is the identifier, e.g. a DI token or route name)
rg -nw "getUserById" -g '*.{md,mdx}'
```

Decide string-literal cases deliberately: a DI token, event name, GraphQL field, or serialized key that must stay wire-compatible should usually **not** change even if it spells the old name — changing it is a behavior change, not a rename. Comments and docstrings that describe the symbol **should** change.

## Step 4 — Prefer language tooling, then verify by hand

If the project has language-server rename available, use it — it understands scope and won't touch substrings:

```bash
# TypeScript / JS via ts-morph or the language server's rename
# Rust:    cargo fix is not a rename; use rust-analyzer rename in-editor
# Go:      gopls rename -w 'path/file.go:#offset' 'newName'
# Python:  rope / pyright rename
gopls rename -w "./internal/user/service.go:#1423" "fetchUserById"
```

> [!NOTE]
> Language tooling is the safe default, but it is not the final word. After any automated rename, run the Step 2 grep sweep again for the **old** name — stray hits in comments, generated files, string templates, or tooling-excluded paths are exactly what the language server skips.

If no rename tool fits, apply edits with `Edit` one occurrence at a time from your Step 3 list, never with `replace_all` on a bare word that could appear in other scopes.

## Step 5 — Apply the edits

Edit each occurrence from the reference list. Keep edits surgical: change only the identifier token, leave surrounding whitespace, types, and arguments untouched. Update declaration, every call/reference, imports, exports/barrels, tests, and descriptive comments together so the tree never sits half-renamed.

## Step 6 — Rename the file if it encodes the name

If the symbol's name is baked into a filename — `UserService.ts` for `class UserService`, `use_auth.py` for `use_auth` — rename the file and fix the import paths:

```bash
git mv src/services/UserService.ts src/services/AccountService.ts
# then update every importer
rg -nw "services/UserService"
```

Leave the filename alone if it doesn't track the symbol (e.g. a `utils.ts` that merely contains the function) — renaming it is scope creep.

## Step 7 — Prove nothing broke

The compiler is your strongest oracle that the rename is complete and correct. Run the project's checks and confirm a clean tree:

```bash
# Use whatever the project actually uses
npm run typecheck && npm run build && npm test
# or: tsc --noEmit / cargo check && cargo test / go build ./... && go test ./... / pytest
```

- A "cannot find name `getUserById`" error means a reference was missed — find and fix it.
- A duplicate-identifier or shadowing error means the new name collides with an existing symbol in that scope — stop and report; the new name is unsafe.
- Final sweep: `rg -nw "getUserById"` should return **zero** code hits (intentional wire-compatible string literals aside).

> [!NOTE]
> If a test assertion had to change to pass, the rename altered behavior — most often a serialized key or public-API string you should have left alone. Revert that edit and reclassify it as a string literal to preserve.

## Report

Summarize concisely:

- **Renamed** — `oldName` → `newName`, its kind and where it is defined.
- **Touched** — count and grouping of edits: definition, references, imports/exports, tests, comments, and any renamed file.
- **Skipped** — coincidental substring matches and same-name symbols in other scopes you deliberately left alone, plus any wire-compatible string literals preserved.
- **Verification** — typecheck, build, and tests pass; final grep for the old name is clean.
- **Caveats** — anything ambiguous you resolved by asking, or any public-API/string surface left unchanged on purpose.