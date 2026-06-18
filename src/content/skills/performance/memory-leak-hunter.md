---
name: "memory-leak-hunter"
description: "Find and fix a memory leak in a running app: confirm it's a real leak under steady load, diff two heap snapshots to name the growing object and its retention path, cut the root reference that blocks collection, and re-run to confirm memory plateaus. Use when RSS climbs until OOM/restart, heap grows unbounded across a steady workload, or GC pauses worsen the longer the process runs."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["review-qa"]
related: ["connection-pool-tuner", "structured-logging-designer", "add-caching"]
featured: false
summary: "Memory that grows is not automatically a leak — caches and warmup grow too. This skill confirms a real leak by watching memory across a steady workload, diffs two heap snapshots under load to name the growing object and its retainer, fixes the root that blocks collection (eviction, unsubscribe, clear timers, weak refs), and re-runs to prove a plateau."
---

A process whose memory only goes up will eventually OOM, get killed, or grind to a halt in GC — but "memory went up" is not the same as "there is a leak." A warming cache, a JIT, a connection pool filling, and a steadily growing legitimate working set all climb too. This skill refuses to guess: it first *confirms* the leak against a steady workload, then *locates* it with a heap diff rather than a single snapshot, traces the *retention path* to the one reference that blocks collection, fixes that root, and re-runs to prove the curve flattens.

## When to use this skill

- RSS climbs monotonically until the process OOMs, gets OOM-killed, or hits a scheduled restart that "fixes" it for a while.
- Heap usage trends up across a steady, repeating workload and never returns to baseline after a GC.
- GC pauses (or full-GC frequency) get worse the longer the process stays up — a classic sign the live set is growing.
- A load test or soak test shows memory that doesn't plateau even after the request rate is constant.
- After a deploy, memory behavior changed and you need to know whether it's a real leak or a bigger-but-bounded cache.

## Instructions

1. **Confirm it's a leak before hunting one.** Drive a *steady, repeating* workload (constant request rate or a fixed loop) and record memory over time — RSS and heap-used at, say, 30s intervals. Force a GC between samples where you can (`global.gc()` with `--expose-gc` in Node, `System.gc()`/`jcmd <pid> GC.run` on the JVM, `gc.collect()` in Python). A leak is memory that trends **up** under constant load and **does not recover** after GC. Memory that rises during warmup and then *plateaus*, or that drops back after GC, is not a leak — stop here and look at cache sizing or normal working set instead.
2. **Capture two heap snapshots under load, spaced apart.** Take snapshot A once warmup has settled, keep the same workload running, then take snapshot B after memory has visibly grown (Node: `--inspect` + DevTools/`heapdump`/`v8.writeHeapSnapshot()`; JVM: `jmap -dump:live,format=b,file=… <pid>` or a JFR `OldObjectSample`; Python: `tracemalloc.take_snapshot()` ×2, or `objgraph`/`guppy`). One snapshot tells you what's big *now*, which is useless — you need both ends of the growth.
3. **Diff the two snapshots — read what GREW, not what's biggest.** Use the comparison view (DevTools "Comparison" between A and B, `tracemalloc.compare_to`, MAT's dominator/histogram delta). Sort by *delta in retained size and object count*. The leak is the object type whose instance count and retained size climb monotonically across the diff and never get freed — not necessarily the single largest object, which is often a legitimately big-but-stable buffer.
4. **Trace the retention path to the root that blocks collection.** For the growing object, follow the *retainers / paths-to-GC-root* (DevTools "Retainers", MAT "Path to GC Roots: exclude weak/soft"). The fix lives at the *root* end of that chain — the live reference that keeps the whole subtree alive. Match it to the usual suspects: an unbounded cache/`Map`/dict keyed by something ever-growing (request id, user id); an event listener / observable / pub-sub subscription added but never removed; a closure captured by a long-lived callback that drags a large scope with it; a `setInterval`/timer/scheduled task never cleared; a module-level array/list that's only ever appended to; or — in native or manual-memory code — an allocation with no matching free (check with `valgrind --leak-check=full` / ASan / a heap profiler).
5. **Fix by bounding the lifetime at the root.** Don't trim symptoms — cut the retaining reference: put a size cap and eviction (LRU) or TTL on the cache; `removeEventListener` / `unsubscribe` / `dispose` in the matching teardown; `clearInterval`/`clearTimeout` and cancel scheduled work on shutdown/unmount; replace a cache keyed by short-lived objects with a `WeakMap`/`WeakRef` so entries are collectible; bound or drain the module-level collection; add the missing `free`/`delete`/`close`. Prefer the change that makes the lifetime *correct* over one that just makes the leak slower.
6. **Re-run the same workload and confirm a plateau.** Repeat step 1's steady workload with the fix in place and capture the same memory-over-time trace. The fix is verified only when memory rises during warmup and then *flattens* (and recovers after GC) across a window long enough to have leaked before. If it still trends up, the diff pointed at one of several retainers — go back to step 3 and trace the next-largest grower.

> [!WARNING]
> A single heap snapshot proves nothing about a leak — every running process holds a lot of live memory legitimately. Only the **diff of two snapshots under sustained load** distinguishes "growing and never freed" from "big but stable." Never conclude a leak (or a fix) from one snapshot or one memory number.

> [!NOTE]
> "Memory went up" during warmup, JIT, or cache fill is expected, not a leak — a leak is unbounded growth that never plateaus under *constant* load. Before touching code, confirm the curve never flattens and never recovers after a forced GC; otherwise you'll "fix" a cache that was working as designed and make the app slower.

## Output

A short report with four parts: (1) the **confirmation evidence** — the memory-over-time trace under steady load showing growth that doesn't recover after GC; (2) the **leaking object and retention path** from the heap diff (type, delta count/retained size, and the path-to-GC-root naming the retaining root); (3) the **root-cause fix** as a concrete diff at that root (eviction/TTL, unsubscribe, cleared timer, weak reference, or missing free); and (4) the **post-fix plateau** — the same workload's memory trace now flattening — or a note that another retainer remains and which one to chase next.