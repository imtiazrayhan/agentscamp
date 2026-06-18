---
name: "react-render-profiler"
description: "Find and fix wasteful React re-renders by classifying the cause — unstable prop/callback/object identities, context value churn, state lifted too high, expensive work in render, or unvirtualized lists — confirming it with a measurement, then applying the one targeted fix and re-measuring. Use when a React UI is janky, slow to type in, or re-renders far more than the data actually changed."
allowed-tools: "Read, Grep, Glob, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["coding-languages", "review-qa"]
related: ["bundle-analyzer", "dead-code-finder", "type-coverage-improver"]
featured: false
summary: "Slow React UIs are usually re-render problems, and the fix is rarely \"add useMemo everywhere.\" This skill classifies the actual cause, proves it with the Profiler or why-did-you-render before touching code, applies the one targeted fix — colocate state, stabilize identity, split context, memo, or virtualize — and re-measures to confirm the render count dropped."
---

A janky React UI is almost always re-rendering more than the data changed — and the reflex fix, wrapping everything in `useMemo`/`memo`, usually adds cost and complexity without helping, because it doesn't address *why* the component re-rendered. This skill makes the work diagnostic: name the cause class, prove it with a measurement, apply exactly one matching fix, and re-measure. No blind memoization.

## When to use this skill

- Typing in an input is laggy, or interacting with one widget visibly re-renders unrelated parts of the page.
- The React DevTools Profiler shows a component (or a whole subtree) committing on interactions that shouldn't touch it.
- A list or table with hundreds of rows stutters on scroll, filter, or keystroke.
- A `useEffect`/`useMemo` runs every render even though its inputs "look" the same.
- You're tempted to sprinkle `memo`/`useCallback` and want to confirm where they actually pay off first.

## Instructions

1. **Measure before you touch code.** Open React DevTools → Profiler, record the slow interaction, and read the flamegraph: which components committed, how many times, and why (enable "Record why each component rendered"). For a sharper signal on a specific component, wire up `@welldone-software/why-did-you-render` in dev and check the console for which prop/state changed identity. Do not edit anything until you have a named culprit and a render count.
2. **Classify the cause — pick exactly one per culprit.** (a) *Unstable identity*: an object/array/function literal created in the parent's render and passed as a prop, so a `memo`'d child or an effect dep changes every render. (b) *Context churn*: a context Provider whose `value={{...}}` is a fresh object each render, re-rendering every consumer. (c) *State too high*: state lives in an ancestor, so a localized change re-renders a large subtree. (d) *Expensive render work*: heavy compute (sorting/formatting/parsing) runs inline in render. (e) *Unvirtualized long list*: hundreds/thousands of DOM rows all committing.
3. **Fix (c) by moving state, not memoizing.** If a keystroke or toggle re-renders a big subtree, *colocate* the state into the smallest component that uses it, or *lift it down* into a child. Moving state is the cheapest, most durable fix and often deletes the need for any `memo` at all — try this before reaching for memoization.
4. **Fix (a) by stabilizing identity at the source.** Wrap callbacks passed to memoized children in `useCallback`, and derived objects/arrays in `useMemo`, with honest dependency arrays. This only helps if the *child is memoized* (`React.memo`) or the value is an *effect/memo dependency* — stabilizing a prop to an unmemoized child does nothing.
5. **Fix (b) by splitting or memoizing context.** Memoize the Provider `value` with `useMemo`, and split a single fat context into separate contexts (e.g. state vs. dispatch, or per-concern) so a consumer only re-renders when the slice it reads changes.
6. **Fix (d) by memoizing the computation or moving it out.** Wrap the expensive calculation in `useMemo` keyed on its real inputs, or hoist it out of render (precompute, server-side, or `useDeferredValue` for low-priority work). Memoize the *work*, not the component.
7. **Fix (e) by virtualizing.** Render only visible rows with `@tanstack/react-virtual` (or `react-window`); `memo` on the row component matters here because virtualization recycles rows.
8. **Re-measure and report the delta.** Re-record the same interaction in the Profiler and capture the new render count per culprit. If the count didn't drop, you classified the cause wrong — revert the change (don't leave a `memo` that bought nothing) and go back to step 2.

> [!WARNING]
> Blanket memoization is a regression, not a fix. `memo`/`useMemo`/`useCallback` each cost a comparison and retained memory every render, add dependency-array bugs, and break the moment one prop's identity still churns. Never add them without a Profiler reading showing they remove a real render — and when the true cause is class (c), *moving state deletes the problem* while memoization only masks it.

> [!NOTE]
> `React.memo` compares props shallowly, so it is *defeated* by a single unstable prop (an inline `style={{...}}`, `onClick={() => ...}`, or `data={[...]}`). A `memo`'d child that still re-renders on every parent commit is the signature of an unstable-identity prop (cause a) — not a reason to remove the `memo`.

## Output

Per culprit: the component name, the **measured** cause class with the evidence (Profiler "why it rendered" reason or why-did-you-render line), the single targeted fix as an `Edit` diff, and **before/after render counts** for the same recorded interaction. End with a one-line verdict per fix (kept / reverted-no-effect) so no no-op memoization is left behind.