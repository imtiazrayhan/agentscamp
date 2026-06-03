---
description: "Investigate a reported symptom, form hypotheses, and locate the root cause."
argument-hint: "[symptom]"
title: "Find Bug"
color: "purple"
topics: ["review-qa"]
related: ["debugger"]
---

You are debugging a reported issue. The symptom to investigate is: **$ARGUMENTS**

Your goal is to find the *root cause* — not the first plausible explanation, and not a patch over the symptom. Work methodically through the phases below. Do not skip ahead to a fix until you can explain exactly why the bug happens.

## 1. Reproduce and characterize the symptom

Before touching the code, pin down what "$ARGUMENTS" actually means in concrete terms.

- Identify the **exact** observable failure: error message, stack trace, wrong output, crash, hang, or incorrect state.
- Determine **when** it happens: every time, intermittently, only with certain inputs, only in certain environments.
- Establish a reliable reproduction. If you cannot reproduce it, that is your first task — search logs, tests, and recent reports for clues.

> [!NOTE]
> A bug you cannot reproduce is a bug you cannot confidently fix. Invest here first; everything downstream depends on a stable repro.

Capture the failing signal directly when possible:

```bash
# Re-run the failing command/test and capture full output
<your test or repro command> 2>&1 | tee /tmp/find-bug.log
```

## 2. Gather evidence

Collect facts before forming theories. Read the actual error, don't paraphrase it.

- Read the **full** stack trace top to bottom; the deepest frame in *your* code is usually the most relevant.
- Grep for the error message, the failing symbol, and surrounding identifiers to locate candidate files.
- Check recent changes — a regression often points straight at the culprit.

```bash
# Find what changed recently around the suspect area
git log --oneline -20 -- <suspect_path>
git blame -L <start>,<end> <file>
```

## 3. Form hypotheses

List the **plausible** root causes as explicit, testable statements. Rank them by likelihood given the evidence.

Common categories to consider:

- **State / lifecycle** — stale cache, race condition, uninitialized or mutated shared state.
- **Boundary conditions** — null/empty/zero, off-by-one, overflow, timezone, encoding.
- **Contract mismatch** — API shape changed, wrong type, wrong units, optional treated as required.
- **Environment** — config, env vars, dependency version, build vs. runtime difference.

Write each hypothesis with the prediction it implies, e.g. *"If the cache is stale, then clearing it before the call will make the symptom disappear."*

## 4. Test each hypothesis

Confirm or eliminate hypotheses one at a time. Change **one** variable per experiment so the result is unambiguous.

- Add targeted logging or assertions at the boundary you suspect.
- Use a debugger or a minimal script to inspect actual values at the point of failure.
- Bisect when the cause is unclear and you have a known-good past state:

```bash
git bisect start
git bisect bad                 # current revision is broken
git bisect good <known_good>   # last revision known to work
# git replays commits; mark each: git bisect good | git bisect bad
git bisect reset               # when finished
```

> [!WARNING]
> Resist confirmation bias. Actively try to *disprove* your favorite hypothesis. If an experiment "kind of" supports it, treat that as a no until you have a clean, repeatable result.

## 5. Identify the root cause

You have found the root cause only when you can state, precisely:

- **Where** it is — the specific file, function, and line(s).
- **Why** it produces the symptom — the exact chain of cause and effect.
- **When** it triggers — the conditions required, which must match the reproduction from Step 1.

If your explanation does not fully account for the observed behavior (including any intermittency), you are not done — return to Step 3.

## 6. Report findings

Summarize concisely so the fix is obvious and safe:

- **Root cause:** one or two sentences naming the exact defect.
- **Evidence:** the experiments and observations that prove it.
- **Affected scope:** other call sites or inputs that hit the same defect.
- **Suggested fix:** the minimal change that addresses the cause, plus a test that would have caught it.

Do not apply the fix unless asked — your job here is to locate and explain the root cause. Hand off a clear, verifiable diagnosis.
