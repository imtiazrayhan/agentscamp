---
description: "Scan the current diff or given paths for security vulnerabilities."
date: 2026-06-03
argument-hint: "[paths]"
allowed-tools: "Read, Grep, Glob, Bash"
title: "Security Scan"
color: "purple"
topics: ["review-qa"]
related: ["review-pr", "find-bug", "security-auditor"]
featured: false
---

Audit code for security vulnerabilities and report what you find by severity. This command is **read-only** — investigate and report, but do not edit code, rewrite history, or "fix it while you're in there." Work through the steps below and trace every finding to a concrete line.

## Scope

Decide what to audit before reading a single file:

- If `$ARGUMENTS` is provided, treat it as the set of paths or globs to scan (`src/api`, `app/**/*.ts`, `lib/auth.ts`). Restrict the audit to those files and the code they directly call.
- If `$ARGUMENTS` is empty, scan the **current diff** — the uncommitted and recently committed changes — so the review matches what is about to ship.

```bash
# No arguments → derive the scope from the diff
git diff --name-only HEAD          # unstaged + staged changes vs. HEAD
git diff --name-only origin/main...HEAD   # everything on this branch
```

> [!NOTE]
> Default to the diff, not the whole repository. A focused review of what changed is far more useful than a shallow pass over the entire codebase. Only widen scope when `$ARGUMENTS` tells you to.

## Step 1 — Map untrusted input

Vulnerabilities live where untrusted data crosses a trust boundary. Before pattern-matching, identify every entry point in scope: HTTP handlers, request bodies, query/path params, headers, cookies, file uploads, webhook payloads, message-queue consumers, CLI args, and env-driven config.

```bash
# Common request/entry-point surfaces (adapt to the stack)
grep -rnE 'req\.(body|query|params|headers|cookies)|request\.(get|args|json)|process\.argv' <scope>
```

Trace each tainted value from entry point to where it is used. The checks below all reduce to one question: *does untrusted input reach a dangerous sink without being neutralized?*

## Step 2 — Injection (SQL, command, template)

Look for untrusted input concatenated or interpolated into an interpreter instead of parameterized.

```bash
# SQL built with string concatenation/interpolation instead of bound params
grep -rnE "(query|execute|raw)\(.*(\+|\$\{|%s|f\"|f')" <scope>

# Shell execution with interpolated input
grep -rnE 'exec\(|execSync|spawn\(|os\.system|subprocess\.(run|call|Popen)|child_process' <scope>

# Server-side template rendering from user input (SSTI)
grep -rnE 'render(_template_string|String)?\(|Template\(|\$\{[^}]*req' <scope>
```

- **SQL:** flag anything that is not a parameterized query / prepared statement. ORMs are safe only until someone reaches for `.raw()`.
- **Command:** flag any shell string built from input; the fix is an `exec`-family call with an argument array and no shell, or an allowlist.
- **Template:** flag user data passed as the *template* rather than as *data* bound into a fixed template.

## Step 3 — Missing authorization (and authentication)

Authentication asks *who are you*; authorization asks *are you allowed to touch this object*. The second is the one people forget. For every state-changing or data-returning handler, confirm there is an explicit ownership/role check.

- Find endpoints that take an object id (`/users/:id`, `/orders/:id`) and verify the handler checks the object belongs to the caller — not just that the caller is logged in. Missing that check is **IDOR / broken object-level authorization**.
- Watch for checks done in the UI or middleware but **not** re-enforced on the server.
- Flag admin/privileged routes that rely only on a hidden URL or a client-supplied role.

> [!WARNING]
> "The user can't reach this page" is not authorization. Anyone can call the endpoint directly. Every protected action needs a server-side check at the point it mutates or returns data.

## Step 4 — Hardcoded secrets

Scan for credentials committed to the repo. Report file and line — **never paste the secret value into your output**, even partially.

```bash
grep -rnEi '(api[_-]?key|secret|token|passwd|password|client[_-]?secret|aws_[a-z_]*key)\s*[:=]\s*["'\''][^"'\'' ]{8,}' <scope>
grep -rnE 'BEGIN [A-Z ]*PRIVATE KEY' <scope>
```

If you find a live credential, treat it as a **Critical** finding: it must be rotated, not just deleted, because it is already in git history.

## Step 5 — SSRF, path traversal, and unsafe deserialization

```bash
# SSRF: server-side fetch where the URL/host comes from input
grep -rnE '(fetch|axios|requests\.(get|post)|http\.(get|request)|urlopen)\(' <scope>

# Path traversal: filesystem paths built from input
grep -rnE '(readFile|open|sendFile|createReadStream|path\.join)\(.*(req|input|params|argv)' <scope>

# Unsafe deserialization
grep -rnE 'pickle\.loads|yaml\.load\(|unserialize|Marshal\.load|ObjectInputStream' <scope>
```

- **SSRF:** a user-controlled URL fed to a server-side request lets an attacker hit internal services and cloud metadata (`169.254.169.254`). Require an allowlist of hosts/schemes; blocklists leak.
- **Path traversal:** input reaching a file path enables `../../etc/passwd`. Require canonicalization plus a check that the resolved path stays inside the intended root.
- **Deserialization:** `pickle.loads`, `yaml.load` (without `SafeLoader`), and PHP `unserialize` on untrusted bytes are remote code execution. Require safe loaders or a strict schema.

## Step 6 — Missing input validation

Even where there's no obvious sink, unvalidated input causes downstream damage: oversized payloads, type confusion, mass assignment, and bypassed business rules.

- Check that request bodies are validated against a schema (zod, pydantic, JSON Schema) before use — not trusted by shape.
- Flag **mass assignment**: spreading a request body straight into a DB write (`User.create({ ...req.body })`) lets a caller set `isAdmin`. Require an explicit allowlist of writable fields.
- Confirm numeric/length/enum bounds, and that file uploads are checked for type and size.

## Step 7 — Report findings

Rank by **severity**, give each finding a concrete fix, and state your **confidence**.

```markdown
## Security scan — <diff or scope>

**Summary:** <1–2 sentences: N findings, highest severity, overall posture.>

### Confirmed
- **[Critical] SQL injection** — `src/api/search.ts:48`
  - Untrusted `req.query.q` is concatenated into the SQL string.
  - **Fix:** use a parameterized query (`db.query(sql, [q])`).
  - **Confidence:** high — input flows directly to the sink with no escaping.

### To double-check
- **[Medium] Possible SSRF** — `src/lib/fetchImage.ts:21`
  - `url` comes from the request; host allowlisting may exist upstream — verify the caller.
  - **Fix:** enforce a scheme + host allowlist at this function.
  - **Confidence:** medium — needs the call site confirmed.
```

Severity guide: **Critical** (RCE, auth bypass, live secret) · **High** (injection, SSRF, IDOR on sensitive data) · **Medium** (missing validation, traversal behind a guard) · **Low** (defense-in-depth, hardening).

> [!NOTE]
> Separate **confirmed** issues — where you traced tainted input to a dangerous sink — from things **to double-check** that depend on context you could not verify (an upstream guard, a framework default, a sanitizer elsewhere). Honest confidence is more useful than false certainty in either direction.

End with the single highest-priority issue to address first. Do not modify any files — this command only reports.
