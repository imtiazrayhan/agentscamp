---
name: "agent-trajectory-evaluator"
description: "Evaluate a multi-step AI agent's whole run — tool calls, intermediate steps, and final result — not just final-answer correctness, so you can pinpoint WHERE it went wrong. Use when building or debugging a tool-using or multi-step agent, when final-answer-only evals can't explain failures, or when a prompt/model change quietly makes the agent less efficient or more error-prone even though the answer still looks right."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Agent Trajectory Evaluator"
date: 2026-06-17
topics: ["llm-evals", "ai-agents-systems"]
related: ["token-usage-profiler", "contract-test-designer", "mutation-test-runner"]
featured: false
summary: "Final-answer evals hide process failures — an agent can reach the right answer via a broken, expensive, or lucky path that breaks next input. This skill captures full trajectories and scores tool selection, argument correctness, step efficiency, error recovery, and goal completion, asserting checkable steps programmatically and reserving an LLM-judge for the subjective ones."
faq:
  - q: "Why not just grade the final answer?"
    a: "Because a correct final answer can come from a broken path — the agent called the wrong tool, looped twice, or recovered from a crash by luck. That path breaks on the next input. Grading the trajectory catches the regression while the answer still happens to be right."
  - q: "When should I use an LLM-judge versus a programmatic assertion?"
    a: "Assert anything checkable from the captured trajectory — exact tool names, argument values, step counts. Reserve the LLM-judge for genuinely subjective steps (was this reasoning sound? was this summary faithful?), and judge one step at a time, not the whole run, because a judge over a full trajectory is noisy."
---

Final-answer evals tell you the agent failed; they don't tell you *where*. An agent that returns the right number might have called the wrong tool first, looped on a flaky API, or stumbled into the answer through a path that collapses on the next input. This skill makes the agent's **process** inspectable: capture the full trajectory — every decision, tool call, argument, and result — then score it on the axes that actually predict failure, asserting what's checkable and judging only what isn't.

## When to use this skill
- You're building or debugging a tool-using / multi-step agent and a final-answer eval says "wrong" without saying why.
- A prompt or model change kept the answers correct but you suspect the agent got slower, looped more, or recovers worse — and you need to prove it.
- You're adding a new tool and want to confirm the agent selects it correctly instead of brute-forcing with the old one.
- Failures are intermittent and you can't tell whether the agent is fragile (lucky path) or robust (sound path).

## Instructions

1. **Capture the full trajectory as a structured, replayable log — one record per step.** Final-answer-only logging is the root cause of un-diagnosable failures. Each step records: the model's decision (the assistant turn, including thinking-block summaries if present), the tool called and its exact arguments, the raw tool result (success/error), and any externalized state (files written, working dir, retry count). Use a stable schema so two runs diff cleanly:
   ```json
   {"run_id": "...", "task_id": "...", "step": 3,
    "decision": "call search_orders to find the open order",
    "tool": "search_orders", "args": {"customer_id": "C-118", "status": "open"},
    "result": {"ok": true, "rows": 2}, "is_error": false,
    "latency_ms": 410, "state": {"retries": 0}}
   ```
   Pull this from your agent loop's tool-call records (or the Managed Agents event stream: `agent.tool_use` / `agent.tool_result` / `agent.custom_tool_use` events carry tool name, input, and result). Persist trajectories to disk so a baseline run is a diffable artifact, not a console scroll-by.

2. **Build a fixed, version-controlled eval set of representative tasks — and deliberately include trap tasks.** A good set has three buckets: (a) routine tasks the agent should handle cleanly, (b) tasks that *require* tool use (the answer isn't in the prompt, so the agent must select and call the right tool), and (c) tasks engineered to trip a known failure mode — a tool that returns an error on the first call (does it recover?), an ambiguous request (does it loop?), a distractor tool that looks relevant but is wrong (does it mis-select?). Pin the set; an eval set that drifts can't catch regressions. Each task carries its expected trajectory assertions (next step).

3. **Score every trajectory on five axes, not one.** Final-answer correctness is necessary but insufficient. For each task, evaluate:
   - **Tool selection** — did it call the right tool for each sub-goal? (mis-selection often produces a right answer via a wrong, slow path)
   - **Argument correctness** — were the tool arguments right? (a `status: "open"` typo'd to `status: "all"` can still return the target row by luck)
   - **Step efficiency** — did it stay within a step budget, or did it repeat calls, loop, or take a needless detour? Measure against a per-task budget, not a global one.
   - **Error recovery** — when a tool returned an error, did the agent recover sensibly (retry once, switch approach) or thrash / give up?
   - **Goal completion** — did it actually finish the task, distinct from "the final text looks plausible"?

4. **Split scoring into programmatic assertions and a narrow LLM-judge — assert everything you can.** An LLM-judge over a whole trajectory is noisy and expensive, and it will rationalize a broken path. So check the deterministic axes with code: exact tool-name assertions, argument equality (or schema match), and step-count budgets are all plain comparisons against the trajectory you captured.
   ```python
   tools = [s["tool"] for s in trajectory]
   assert tools[0] == "search_orders", f"wrong first tool: {tools[0]}"
   assert trajectory[0]["args"]["status"] == "open"
   assert len(trajectory) <= task["step_budget"], f"{len(trajectory)} steps > budget"
   assert not any(s["is_error"] for s in trajectory[-2:]), "ended on an error"
   ```
   Reserve the LLM-judge for the genuinely subjective steps only — "was this reasoning step sound given the prior result?", "was this summary faithful to the tool output?" — and judge **one step at a time** with the step's inputs in context, not the entire run. Default both the agent-under-test and the judge to the latest, most capable Claude model (`claude-opus-4-8`); use a *different* sample or framing for the judge so it isn't grading its own twin, and keep the judge's rubric to one criterion per call.

5. **Diff every candidate trajectory against a stored baseline and report the regressions.** This is what catches the silent ones. After a prompt or model change, re-run the fixed eval set and compare trajectory-for-trajectory against the baseline: tools added/removed/reordered, argument changes, step-count delta, new error-recovery loops, latency delta. A change that keeps the final answer correct but adds two steps, introduces a retry loop, or swaps a precise tool for a brute-force one is a **regression** — surface it even though the answer still passes. Promote a candidate to the new baseline only when the diff is empty or every change is reviewed and intended.

> [!WARNING]
> Grading only the final answer hides process failures. An agent can reach the right answer through a path that is broken, expensive, or lucky — wrong tool, redundant loop, a crash it recovered from by chance — and that path will break on the very next input. The final answer being correct is *not* evidence the agent worked correctly.

> [!WARNING]
> An LLM-judge over a whole trajectory is noisy and tends to rationalize whatever path it sees. Assert the checkable steps — tool names, argument values, step counts — with code, and give the judge exactly one subjective step and one criterion at a time. A judge asked "was this whole run good?" will hand-wave; a judge asked "was *this* summary faithful to *this* tool output?" gives a usable signal.

## Output
- **Trajectory schema** — the per-step record (decision, tool, args, result, is_error, latency, state) and where each field comes from in your agent loop or event stream.
- **Per-axis rubric** — the five axes (tool selection, argument correctness, step efficiency, error recovery, goal completion) with the concrete check for each task.
- **Assertion-vs-judge split** — the deterministic assertions written as code, and the short list of subjective steps routed to a single-criterion LLM-judge (agent and judge both on `claude-opus-4-8`).
- **Baseline-diff regression report** — a per-task diff of the candidate run against the stored baseline (tools reordered/added/removed, arg changes, step-count and latency deltas, new recovery loops), flagging every regression even where the final answer still passes, plus a verdict on whether to promote the candidate to baseline.