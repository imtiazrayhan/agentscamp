---
name: "flamegraph-analyzer"
description: "Turn a CPU profile or flamegraph into a concrete optimization instead of guessing where the time goes: capture under a realistic workload with a sampling profiler, read the graph correctly (width = time, depth ≠ time), find the widest self-time leaves, ask if that work is necessary/redundant/algorithmically wrong, fix the biggest contributor, then re-profile. Use when code is CPU-bound and slow, a function is hot but you don't know which part, or you have a profile you can't interpret."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["review-qa"]
related: ["memory-leak-hunter", "react-render-profiler", "load-test-designer", "bundle-analyzer"]
featured: false
summary: "A flamegraph shows where the CPU actually is — if you read it right. This skill captures a profile under a realistic workload with the right sampling profiler, finds the widest self-time leaves, decides whether that work is unnecessary, redundant, or algorithmically wrong, fixes the biggest contributor, then re-profiles — because the bottleneck always moves after a fix."
---

When code is slow and CPU-bound, the most expensive thing you can do is guess. Intuition about "the slow part" is wrong often enough that optimizing it usually buys nothing while the real hotspot sits untouched. A flamegraph answers the question directly — *which frames are actually burning CPU* — but only if you capture it under a realistic workload and read it correctly. This skill does both: it gets a representative sampling profile, reads width as time and the y-axis as depth (not a timeline), pins the hotspot to the widest self-time leaves, classifies the work as unnecessary / redundant / algorithmically wrong, fixes the biggest contributor, and re-profiles — because the bottleneck always moves after a fix, and your intuition about the new one is just as unreliable.

## When to use this skill

- A request, job, or function is slow, CPU usage is high, and you don't know which part of the call tree is responsible.
- You have a profile or flamegraph SVG but can't tell where the time is going or whether you're reading it right.
- Something is "obviously" slow and you're about to optimize the part you suspect — stop and confirm it with a profile first.
- A hot path got optimized and got no faster, or only a little — the real bottleneck was elsewhere and you need to find it.
- You want to know whether the latency is *computation* (on-CPU) or *waiting* (I/O, locks) before you pick where to spend effort.

## Instructions

1. **Capture a profile under a realistic workload with a sampling profiler — don't reason from intuition.** Drive the code the way production does (representative input size, concurrency, warm caches/JIT), then sample it with the right tool: `perf record -F 99 -g` (Linux native), async-profiler (JVM), `py-spy record` (Python), `go tool pprof` (Go), or the browser/Node `--prof` / `--cpu-prof` / DevTools profiler. Prefer **sampling** over instrumenting — instrumentation distorts the very hot frames you care about. Profile a *steady* phase, not cold start, unless cold start is the thing you're optimizing.
2. **Render it as a flamegraph and read the axes correctly.** Collapse stacks and render (e.g. `perf script | stackcollapse-perf.pl | flamegraph.pl`, async-profiler's HTML, `go tool pprof -http`, speedscope). **Width = total time spent in a frame and everything it called; wide is expensive. The y-axis is call-stack depth, NOT time — it is not a timeline.** A tall, narrow tower is a deep-but-cheap call chain; a short, wide plateau is your hotspot. Frame ordering left-to-right is alphabetical/merge order, not chronological — never read it as "this ran, then that."
3. **Find the widest *leaf* frames — that's where the CPU actually is.** Look at the top edge of the graph: the plateaus at the *top* of the stacks are self-time leaves, the code actually executing when samples were taken. A wide frame deep in the middle is wide because of what it *calls*; the work itself lives in the wide things sitting on top of it. Use the profiler's "self/own time" sort to confirm. Rank hotspots by self-time, not by who's tallest.
4. **For each top hotspot, classify the work: unnecessary, redundant, or algorithmically wrong.** Read the wide leaf and ask: (a) **Unnecessary** — is this work needed at all, or is it logging/serialization/validation/copying in a hot loop that could be hoisted, batched, or dropped? (b) **Redundant** — is the same frame wide because it's *called too many times* (recomputed per item, re-parsed, re-allocated)? Cache, memoize, or lift it out of the loop. (c) **Algorithmically wrong** — a wide frame that grows with input is often an O(n²) hiding in plain sight (linear scan inside a loop, repeated string concat, a `Set` that's actually a list). Match the frame's width-vs-input behavior to the algorithm.
5. **Confirm the latency is on-CPU before optimizing CPU.** A CPU-sample flamegraph is *blind to time spent waiting* — it shows almost nothing for blocking I/O, lock contention, or sleeping threads, because those threads aren't on-CPU to be sampled. If the wall-clock latency is large but the on-CPU flamegraph is thin or idle, the time is being *waited*, not *computed* — capture an **off-CPU / wall-clock** profile instead (off-CPU flamegraph via `perf`/eBPF, async-profiler `wall` mode, py-spy without `--idle` filtering, a blocking/lock profiler). Optimizing CPU frames will do nothing for a workload that's actually waiting on a database or a mutex.
6. **Optimize the single biggest contributor, then RE-PROFILE.** Fix the widest hotspot first — it has the most time to give back. Then capture the *same* workload again from scratch. The bottleneck moves after every fix: the second-widest frame is now first, and the percentages you remember are stale. Do not chain optimizations from one profile; your intuition about the *new* top frame is exactly as unreliable as it was about the first. Stop when the remaining hotspots are narrow enough that the next fix isn't worth the complexity.

> [!WARNING]
> The y-axis is call-stack **depth, not time** — a flamegraph is not a timeline. A tall, narrow tower is a cheap deep call chain; a short, wide plateau is your hotspot. Read it as left-to-right time and you'll "optimize" the wrong frame and wonder why nothing got faster.

> [!NOTE]
> A CPU flamegraph is blind to waiting. If a request takes 800ms but the on-CPU graph is mostly idle, the time is spent blocked on I/O or a lock, not computing — switch to an off-CPU / wall-clock profile. Speeding up thin CPU frames can't fix latency that's actually spent waiting.

## Output

A short report with four parts: (1) the **capture conditions** — profiler used, workload/input that was profiled, and whether it's on-CPU or off-CPU/wall-clock; (2) the **identified hotspot(s)** read straight off the graph — each as `frame name + share of total samples + self-time vs. children` and *why* it's hot (unnecessary / redundant / algorithmically wrong); (3) the **targeted fix** for the biggest contributor as a concrete change (hoist out of loop, memoize, replace O(n²), or — if it's wait time — go profile off-CPU); and (4) the **re-profile plan** — rerun the identical workload, expected new top frame, and the stopping condition once hotspots are no longer worth chasing.
