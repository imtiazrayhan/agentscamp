---
description: "Diagnose an error message or stack trace and propose a fix."
seoDescription: "/explain-error is a Claude Code slash command that reads an error message or stack trace, finds the real root cause in your code, and proposes a concrete fix."
date: 2026-06-03
argument-hint: "<error message or stack trace>"
allowed-tools: "Read, Grep, Glob, Bash"
title: "Explain Error"
color: "purple"
topics: ["review-qa"]
related: ["debugger", "explain-code", "fix-failing-test"]
summary: "A slash command that diagnoses an error message, stack trace, or failing log output against the codebase: it locates the first in-repo frame, identifies the root cause one level beneath the message, confirms it with read-only checks, and reports a specific fix — or ranked candidates — without changing any files."
---

Diagnose the error in `$ARGUMENTS` against this codebase and propose a specific fix. Your job is to explain *why* it happens and *how* to fix it — not to restate the message back. Do not change any files; report your findings and the recommended fix.

## Scope

`$ARGUMENTS` is the raw error to diagnose — an exception message, a stack trace, a compiler/type error, or a chunk of failing log output. Parse it for the signal that matters:

- The **error type/class** and message (`TypeError`, `NullPointerException`, `ECONNREFUSED`, `error[E0382]`, ...).
- The **top in-repo frame** — the first stack frame pointing at a file *in this project*, not in `node_modules`, the standard library, or a vendored dependency. That frame is usually where the fix lives.
- Any **identifiers** in the message: variable names, function names, file paths, line numbers, error codes.

If `$ARGUMENTS` is empty, do not guess. Ask the user to paste the full error or stack trace, or point you at the failing command (e.g. `npm test`, `cargo build`) so you can reproduce it and capture the output yourself.

## Step 1 — Locate the originating code

Find the exact line the error blames, then read enough around it to understand the context.

```bash
# Jump to the file:line from the top in-repo stack frame
# e.g. "at src/lib/auth.ts:42" -> open that file around line 42
```

When the trace is minified, transpiled, or points at a build artifact, search for the symbols in the message instead:

```bash
# Find where the named function / variable / message string is defined
rg -n "functionFromTheTrace|the exact error string" src
```

> [!NOTE]
> Trust the *first in-repo frame*, not the last frame. The deepest frame is often inside a library doing exactly what it was told — the bug is usually at the boundary where your code called it with bad input.

## Step 2 — Identify the likely root cause

Explain in plain terms what actually went wrong, one level beneath the message. Map the error to its underlying condition rather than echoing the text:

| The message says | The real cause is usually |
| --- | --- |
| `Cannot read properties of undefined` | a value was never assigned, an async result wasn't awaited, or a lookup missed |
| `NullPointerException` / `nil` deref | an unchecked optional or a failed-but-ignored return |
| `ECONNREFUSED` / `connection refused` | wrong host/port, service not running, or env var unset |
| `Module not found` | missing dependency, bad import path, or stale build cache |
| type / borrow / lint error | a contract the compiler is enforcing — read it literally |

State the cause as a single clear sentence: *"`session` is `undefined` here because `getSession()` returns a Promise that the caller never awaits, so the `.user` access runs before it resolves."*

## Step 3 — Confirm before you commit to an answer

When practical, verify the hypothesis instead of asserting it. Use read-only checks only.

```bash
# Re-run the failing command to confirm the error and see the full trace
npm test 2>&1 | tail -40

# Inspect runtime conditions the trace implies (env, service, versions)
# prints key names only — omit `cut -d= -f1` if you need the values
printenv | cut -d= -f1 | rg -i 'DATABASE|API|PORT'
```

> [!NOTE]
> Reproduce or confirm the cause with a read-only command whenever it's cheap to do so — a confirmed diagnosis beats a plausible one.

> [!WARNING]
> Stay read-only. Do not run migrations, installs, formatters, or anything that mutates the repo, the database, or remote state to "test" a theory. Confirm by reading and by re-running the same failing command, nothing more.

## Step 4 — Report the diagnosis and fix

When the cause is clear, report it directly:

```markdown
## Error: <error type — one-line summary>

**Origin:** `path/to/file.ts:42` — <what this line was doing>

**Root cause:** <the plain-terms why, one level below the message>

**Fix:** <the specific change — code, not vibes>

    - const user = getSession().user;
    + const user = (await getSession()).user;

**Confidence:** High — reproduced via `npm test`; the trace points squarely here.
```

When the cause is **ambiguous**, list the top candidates ranked by likelihood, each with the evidence for it and the one-line check that would confirm or rule it out:

```markdown
**Most likely (≈70%):** <cause> — confirm with `<read-only check>`
**Possible (≈20%):** <cause> — confirm with `<read-only check>`
**Long shot (≈10%):** <cause> — confirm with `<read-only check>`
```

End with the single highest-value next step: the fix to apply, or the one check that collapses the remaining ambiguity.
