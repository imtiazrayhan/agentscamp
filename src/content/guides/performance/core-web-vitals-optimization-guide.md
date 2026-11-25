---
title: "Core Web Vitals Optimization Guide: Fix LCP, CLS, and INP From Field Data"
description: "Diagnose and fix Core Web Vitals (LCP, CLS, and INP) using real-user p75 field data, targeted root-cause fixes, and before/after verification."
author: "Imtiaz Rayhan"
date: 2026-11-25
color: "orange"
topics: ["devops-infra", "review-qa"]
audience: ["developers", "devops"]
tags: ["core-web-vitals", "lcp", "cls", "inp", "web-performance", "frontend"]
featured: false
summary: "Fixing Core Web Vitals starts with real-user field data at the 75th percentile (CrUX or RUM), not a single Lighthouse score on a fast laptop. Use field data to identify which metric fails on which route class, use lab traces only to pinpoint the offending image, layout shift, or main-thread handler, apply one targeted fix per metric, and lock the gain in with performance budgets."
keyTakeaways:
  - "Treat field p75 data (CrUX / RUM) as ground truth: a page passing Lighthouse at 98 on desktop Wi-Fi can still fail LCP or INP for mobile users."
  - "LCP failures break into four sub-parts — TTFB, resource load delay, resource load duration, and element render delay — fix the largest sub-part first instead of blindly compressing images."
  - "CLS is almost always caused by unsized images/embeds, late-injected banners or ads, or webfont swap shifts; reserve explicit dimensions before content arrives."
  - "INP measures the worst interaction latency across the full page lifecycle (input delay + processing + presentation); break up long main-thread tasks and eliminate unnecessary React re-renders."
  - "Verify every fix in lab profiles immediately, wait for field RUM/CrUX confirmation, and enforce regression limits in CI with performance budgets."
faq:
  - q: "What are the good thresholds for Core Web Vitals?"
    a: "At the 75th percentile of real page loads: Largest Contentful Paint (LCP) at or under 2.5 seconds, Cumulative Layout Shift (CLS) at or under 0.1, and Interaction to Next Paint (INP) at or under 200 milliseconds."
  - q: "Why does my Lighthouse score look great while Google Search Console reports poor Core Web Vitals?"
    a: "Lighthouse runs a single synthetic cold load on a simulated device and never clicks through interactive states after load, so it misses real mobile CPUs, third-party login cookies, geo-latency, and post-load INP interactions. Search Console uses 28-day CrUX real-user field data at p75."
  - q: "What is the fastest way to improve LCP?"
    a: "First identify the actual LCP element and break down its four timing phases. Never lazy-load the LCP hero image, add fetchpriority='high', ensure the image URL is discoverable in the initial HTML (not hidden behind client-side JS or CSS background-image), and fix slow server TTFB before chasing minor asset tweaks."
  - q: "How do I fix a high INP in a React or Next.js app?"
    a: "Record an interaction in Chrome DevTools Performance panel and inspect which sub-part dominates: long input delay means heavy hydration or third-party scripts blocked the main thread; long processing duration means expensive synchronous state updates or whole-tree re-renders. Defer non-urgent updates with startTransition, virtualize large lists, and audit wasteful re-renders."
related: ["skill:web-vitals-optimizer", "skill:bundle-analyzer", "skill:react-render-profiler", "guide:web-performance-budgets", "agent:performance-engineer", "command:set-perf-budget"]
howtoSteps:
  - name: "Start from p75 field data"
    text: "Inspect CrUX, Search Console, or RUM by route class and mobile vs desktop to find which vital fails and where traffic concentrates."
  - name: "Reproduce and isolate the at-fault element"
    text: "Use Chrome DevTools Performance traces or WebPageTest under mobile throttling to identify the exact LCP element, shifting DOM node, or slow interaction."
  - name: "Fix the dominant bottleneck per metric"
    text: "Attack the largest sub-part — TTFB and discoverability for LCP, reserved dimensions for CLS, main-thread long tasks for INP."
  - name: "Measure before and after"
    text: "Compare lab waterfalls immediately, then track p75 field metrics over real traffic to confirm the improvement reaches actual users."
  - name: "Lock the gain with CI budgets"
    text: "Translate the improved numbers into automated JavaScript, image, and vitals budgets so future PRs cannot silently regress them."
---

**Core Web Vitals measure three concrete aspects of user experience: how fast the main content appears (LCP), how stable the layout stays (CLS), and how quickly the page responds to taps and clicks (INP).** Teams waste weeks chasing Lighthouse points when the real fix is usually one un-prioritized hero image, one un-sized ad slot, or one 350 ms synchronous click handler.

The disciplined workflow always runs in the same order: **field data picks the target → lab trace names the culprit → one surgical fix removes it → budgets keep it fixed.**

## Start with p75 field data, not Lighthouse

Google evaluates Core Web Vitals at the **75th percentile (p75)** of real user visits over a rolling 28-day window, split between mobile and desktop:

| Metric | What it measures | Good (p75) | Needs improvement | Poor |
| --- | --- | --- | --- | --- |
| **LCP** (Largest Contentful Paint) | Loading speed of primary content | ≤ 2.5 s | 2.5 s – 4.0 s | > 4.0 s |
| **CLS** (Cumulative Layout Shift) | Unexpected visual movement | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |
| **INP** (Interaction to Next Paint) | Responsiveness across the whole visit | ≤ 200 ms | 200 ms – 500 ms | > 500 ms |

Pull route-level field data from Search Console, the CrUX API, or your Real User Monitoring (RUM) library (`web-vitals` JS) first. Mobile traffic almost always fails before desktop because mid-tier Android CPUs execute JavaScript 3–5× slower than a developer's laptop. Only open Lighthouse or Chrome DevTools *after* field data tells you which route class and metric actually need help.

## Fixing LCP: break it into four sub-parts

Treating LCP as one opaque number leads to blind guesses (like shaving 15 KB off an image when server TTFB is 1.9 seconds). Every LCP breaks into four additive phases:

1. **Time to First Byte (TTFB):** server latency, uncached dynamic SSR queries, or missing CDN edge caching. Fix with static generation / ISR, CDN caching, early hints, or trimming slow server queries before touching frontend assets.
2. **Resource load delay:** the gap between TTFB and when the browser *starts* downloading the LCP image. Common culprits: `loading="lazy"` on an above-the-fold hero image, images triggered only after client-side JS fetches JSON, or CSS `background-image` URLs buried in external stylesheets. Put the `<img>` in the initial HTML with `fetchpriority="high"` and zero lazy loading.
3. **Resource load duration:** transfer time of the LCP asset itself. Serve AVIF/WebP, size responsive `srcset` properly so mobile devices do not download 2400 px desktop banners, and serve from the same origin or a preconnected CDN.
4. **Element render delay:** the image finished downloading, yet the browser could not paint it because render-blocking CSS, synchronous `<script>` tags, or massive client hydration stalled the main thread. Inline critical styles, defer non-critical scripts, and trim unused bundle weight with the [Bundle Analyzer](/skills/performance/bundle-analyzer).

```html
<!-- Good LCP hero pattern: discoverable in HTML, eager, high priority, explicit dimensions -->
<img
  src="/images/hero-1200.avif"
  srcset="/images/hero-640.avif 640w, /images/hero-1200.avif 1200w"
  sizes="(max-width: 768px) 100vw, 1200px"
  width="1200"
  height="630"
  fetchpriority="high"
  decoding="async"
  alt="Dashboard overview"
/>
```

## Fixing CLS: reserve space before pixels arrive

Layout shifts happen when visible elements move unexpectedly after initial paint (shifts within 500 ms of a user click are excluded). Nearly every CLS issue comes from four root causes:

- **Images, videos, and iframes without dimensions:** always declare `width` and `height` attributes (or CSS `aspect-ratio`) so the browser reserves the exact box before the asset downloads.
- **Late-injected banners, cookie bars, and embeds:** reserve a `min-height` placeholder container, or anchor consent banners as fixed overlays (`position: fixed`) rather than pushing document flow down.
- **Webfont swap jumps:** use `next/font` (or CSS `size-adjust` / metric overrides) so the fallback system font matches the webfont's line height and character width before swap.
- **Animating layout properties:** animate `transform` and `opacity` instead of `top`, `left`, `height`, or `margin`, which trigger layout recalculation every frame.

## Fixing INP: cut main-thread blocking on real interactions

INP tracks the latency from a user's tap, click, or keypress until the browser paints the next visual frame — taking the near-worst interaction across the entire session. It has three sub-parts:

1. **Input delay:** the user clicked while the main thread was busy hydrating the page, running analytics scripts, or executing another long task (>50 ms). Cut initial JS bundle size, defer third-party tags, and break up initialization work.
2. **Processing duration:** your event handler ran expensive synchronous logic — filtering thousands of rows, parsing huge JSON blobs, or re-rendering an entire React tree on every keystroke. Use `startTransition` for non-urgent state updates, debounce expensive searches, virtualize long lists, and fix unnecessary component churn with the [React Render Profiler](/skills/performance/react-render-profiler).
3. **Presentation delay:** the DOM update finished, but huge DOM size (>1,500–2,000 nodes) or forced synchronous layout (`offsetHeight` read right after style mutation) stalled style/layout/paint. Keep DOM trees lean and apply `content-visibility: auto` to off-screen sections.

When an event handler must run heavy non-visual work after updating UI state, yield back to the browser so the visual feedback paints first (`scheduler.yield()` where supported, falling back to `setTimeout(0)`).

## Lock the win with performance budgets

One-off performance sprints decay within two quarters as new dependencies, hero videos, and marketing tags ship. Once your routes pass p75 LCP, CLS, and INP, codify the resource ceilings in CI using [Web Performance Budgets](/guides/performance/web-performance-budgets) and [Set Perf Budget](/commands/perf/set-perf-budget) so regressions fail pull requests instead of showing up in Search Console a month later.

> [!TIP]
> Fix one metric at a time and keep a change log with deploy timestamps alongside your RUM chart. Bundling five unrelated optimizations in one release makes it impossible to tell which change actually moved p75 — or which one quietly hurt another vital.

Use the [Web Vitals Optimizer](/skills/performance/web-vitals-optimizer) skill to walk a specific failing route through field diagnosis, trace inspection, and targeted verification.

## Continue exploring

- [Web Performance Budgets: Turn Speed Into a Release Gate](/guides/performance/web-performance-budgets) — Turn your target vitals and asset limits into automated CI enforcement.
- [performance-engineer](/agents/quality-security/performance-engineer) — Profile bottlenecks, trim bundles, and optimize frontend and backend latency systematically.
