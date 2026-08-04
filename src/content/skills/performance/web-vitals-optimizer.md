---
name: "web-vitals-optimizer"
description: "Diagnose and fix Core Web Vitals — LCP, CLS, and INP — by treating real-user field data at p75 as the source of truth, using Lighthouse/WebPageTest only to find the at-fault element, script, or shift, then applying the one targeted fix per metric and re-measuring. Use when a page feels slow, scores poorly on PageSpeed/Lighthouse, or fails CWV in CrUX/RUM field data."
allowed-tools: "Read, Grep, Glob, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["coding-languages"]
related: ["web-performance-budgets", "bundle-analyzer", "react-render-profiler", "cold-start-optimizer"]
featured: false
summary: "A green Lighthouse score with failing field data is the most common Web Vitals trap. This skill anchors on p75 real-user CrUX/RUM data, uses lab tools only to pinpoint the at-fault element/script/shift, and fixes each of LCP, CLS, and INP by its actual cause — then re-measures against the field target."
---

A page can score 98 in Lighthouse and still fail Core Web Vitals for real users — because Lighthouse measures one throttled load on your machine, while Google ranks you on p75 of *field* data from real devices and networks. This skill refuses to optimize the lab number. It pulls the field metrics first, uses lab tools only to find the specific element, script, or shift at fault, applies the one fix that addresses *that* cause, and re-measures against the field target — not the audit.

## When to use this skill

- A page is flagged "Needs improvement" or "Poor" for LCP, CLS, or INP in Search Console / CrUX / your RUM, even if Lighthouse looks fine.
- The hero or main content visibly pops in late, or the page jumps as images, ads, fonts, or banners load.
- Tapping a button, opening a menu, or typing feels laggy after the page looks ready.
- You're about to "fix performance" by chasing a higher Lighthouse score and want to target what real users actually feel.

## Instructions

1. **Get the field data first — it is the only source of truth.** Pull p75 LCP, CLS, and INP from CrUX (PageSpeed Insights field section, the CrUX API, or BigQuery) for the specific URL or origin, segmented by phone vs. desktop. If you have RUM (`web-vitals` library, your analytics), prefer it — it's per-page and current. Thresholds: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms, all at **p75**. Write down the failing metric(s) and the gap to target before opening a single file.
2. **Use lab tools only to find the culprit, never as the goal.** Run Lighthouse / WebPageTest / a local trace to *locate* what's at fault — the LCP element, the layout-shift sources, the long tasks blocking interaction. The lab gives you the "what and where"; the field data decides whether you've actually won. A green lab score does not close a failing field metric.
3. **LCP — find the LCP element, then speed its delivery.** Read the Lighthouse "Largest Contentful Paint element" (usually the hero image or a large heading/text block). If it's an image: ensure it is **not** `loading="lazy"`, add `fetchpriority="high"`, `<link rel="preload" as="image">` it (with `imagesrcset`), serve a right-sized AVIF/WebP at the displayed dimensions, and host it on a fast/CDN origin. If it's blocked by render-blocking CSS/JS, inline critical CSS and `defer`/async the rest. If TTFB itself is slow (>800ms), fix the server/cache before touching the front end — you can't paint what hasn't arrived.
4. **CLS — reserve space and stop late insertions.** For every image/video/iframe/ad/embed, set explicit `width`/`height` or `aspect-ratio` so the browser reserves the box before content loads. Never inject content *above* existing content after load (cookie/consent banners, late-arriving ads, "you have a new message" bars) — reserve their slot or render them in a fixed overlay. For font swap, `<link rel="preload">` the font and use `font-display: optional` or a `size-adjust`/`ascent-override` `@font-face` to match fallback metrics so the swap doesn't reflow text.
5. **INP — shorten the work between tap and paint.** Find the slow interaction in a performance trace and read the long tasks (>50ms) on the main thread. Break long JS into chunks and `yield` to the main thread (`await scheduler.yield()` or `setTimeout(0)`) so input can be handled; defer or remove unnecessary hydration and heavy third-party scripts (analytics, chat, A/B tools) that monopolize the thread; keep event handlers cheap — do the visual update first, then debounce/queue the expensive work. Don't run layout-thrashing reads/writes inside the handler.
6. **Change one thing, then re-measure against the field metric.** After each fix, re-run the lab trace to confirm the mechanism (LCP element now preloaded, shift gone, long task split). But only the **p75 field metric** trending back under threshold confirms a real win — and field data lags 28 days in CrUX, so verify with RUM for fast feedback. If the field metric doesn't move, you fixed the wrong cause; go back to the trace.

> [!WARNING]
> Optimizing the Lighthouse lab score while p75 field data still fails is optimizing the wrong number. Lighthouse is one throttled synthetic load; CrUX is the 75th percentile of real devices and networks, and that is what ranks. Ship for the field metric — a 100 lab score with "Poor" field LCP is still a failing page.

> [!NOTE]
> A blanket `loading="lazy"` on every image directly regresses LCP when it lands on the hero/above-the-fold image — the browser delays the very request that defines your LCP. Lazy-load only below-the-fold media; the LCP image must be eager and, ideally, preloaded with `fetchpriority="high"`.

## Output

Per failing metric: the **specific culprit** (the named LCP element, the elements/sources causing each shift, or the long-task script/handler), the **single targeted fix** as an `Edit` diff (preload tag, `width/height`, `defer`, yield, etc.), and the **p75 field target** to confirm against (LCP ≤ 2.5s / CLS ≤ 0.1 / INP ≤ 200ms) with a note on how to verify it (RUM now, CrUX after the 28-day window). End with the lab mechanism check plus the field metric as the real pass/fail gate.
