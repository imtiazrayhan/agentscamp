---
description: "Add or improve docstrings for the public API of a file or symbol."
seoDescription: "/add-docstrings writes or improves docstrings for a file or symbol's public API — a Claude Code slash command that matches your project's doc style."
date: 2026-06-03
argument-hint: "<file or symbol>"
allowed-tools: "Read, Grep, Glob, Edit"
title: "Add Docstrings"
color: "purple"
topics: ["workflow-prompting"]
related: ["command:explain-code", "agent:documentation-engineer", "command:update-readme", "skill:readme-generator"]
featured: false
summary: "A slash command that adds or improves docstrings for the public API of a file or symbol: it reads the real implementation, identifies exported symbols, matches the language's docstring convention (TSDoc, Google-style Python, Go doc comments), and documents parameters, returns, errors, and side effects — never editing logic."
---

Add or improve docstrings for the code identified by `$ARGUMENTS`. Document the public surface so a caller can use it correctly without reading the implementation. Edit only the documentation — never the logic.

## Scope

Resolve `$ARGUMENTS` before writing anything.

- If it is a path (e.g. `src/auth/session.ts`), document the public symbols exported from that file.
- If it is a symbol (e.g. `validateToken` or `class UserStore`), search the codebase to find its definition, then document that one symbol and its members.
- If it is a path with a range (e.g. `parser.go:40-120`), document the public symbols defined in that range.
- If `$ARGUMENTS` is empty, ask which file or symbol to document. Do not document the whole repository on a guess.

## Step 1 — Read the target

Read the full definition before drafting a single line.

```bash
# Find a symbol's definition if only a name was given
rg -n "validateToken" src/
```

Use `Grep`/`Glob` to locate the symbol, then `Read` the file. You must understand the real behavior — parameters consumed, values returned, state mutated, and errors raised — before describing it.

> [!WARNING]
> Read the implementation, not the existing comments. A stale or wrong docstring is worse than none; verify every claim against the code.

## Step 2 — Identify the public surface

Document only what callers depend on. Skip everything else.

- **Document:** exported functions, classes, methods, and constants; anything `public`; the module/package itself if it has no header.
- **Leave alone:** private helpers (`_helper`, `#field`, lowercase Go identifiers, unexported members), local variables, and obvious one-liners — unless `$ARGUMENTS` explicitly asks for internals.
- List the symbols you will document and confirm the set looks right before editing.

> [!NOTE]
> If a public function is missing a docstring, add one. If it has a weak or outdated one, improve it in place. Do not touch symbols that are already well documented.

## Step 3 — Detect the language convention

Match the docstring style the language and file already use. Do not invent a format.

| Language | Convention | Marker |
| --- | --- | --- |
| TypeScript / JavaScript | TSDoc / JSDoc | `/** ... */` with `@param`, `@returns`, `@throws` |
| Python | Google or NumPy style | triple-quoted `"""..."""` with `Args:` / `Returns:` / `Raises:` |
| Go | Doc comments | `// FuncName ...` sentence starting with the symbol name |
| Java / Kotlin | Javadoc / KDoc | `/** ... */` with `@param`, `@return`, `@throws` |
| Rust | Rustdoc | `///` with `# Examples`, `# Errors`, `# Panics`, `# Safety`; document parameters in prose (no formal `# Arguments` section per stdlib convention) |

> [!NOTE]
> Match the existing style already present in the file over any default. If neighboring functions use NumPy-style Python or omit `@returns` on void functions, follow that local convention so the file stays consistent.

## Step 4 — Write the docstrings

Describe behavior and contract — not the code line by line.

- Open with one sentence on **what** the symbol does and **why** a caller would use it.
- Document each **parameter**: its meaning, accepted range or shape, and what an empty/null value means.
- Document the **return value**: type, meaning, and what is returned in the empty or not-found case.
- Document **thrown errors**: every exception or error path a caller must handle, and the condition that triggers it.
- Note **side effects** that aren't obvious from the signature: I/O, mutation of arguments, network calls, caching.

```ts
/**
 * Rotates the refresh token for a session, revoking the previous one.
 *
 * @param sessionId - ID of an active session; must not be expired.
 * @param now - Clock used for expiry checks; defaults to `Date.now()`.
 * @returns The newly issued token, or `null` if the session was already revoked.
 * @throws {SessionExpiredError} If the session's TTL has elapsed.
 */
```

> [!WARNING]
> Do not restate the code. `// increments i by one` adds nothing. Document the contract a caller needs — preconditions, guarantees, and failure modes that aren't visible in the signature.

> [!WARNING]
> This command documents only. Change comments and docstrings, never executable code, signatures, or imports. If you spot a bug while reading, note it in your report but make no functional edit.

## Step 5 — Report

Summarize what changed:

- The symbols you documented, with their `file:line`.
- The convention you followed and why (matched the file / language default).
- Any public symbol you intentionally skipped, and the reason.
- Any contradiction you found between a name and its real behavior, flagged for the user to fix.
