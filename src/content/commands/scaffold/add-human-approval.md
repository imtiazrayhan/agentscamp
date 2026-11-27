---
description: "Scaffold a human-in-the-loop approval gate into an agent so it pauses before a consequential action and resumes after approval."
argument-hint: "<the action/tool to gate, or the agent file>"
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
model: "sonnet"
title: "Add Human Approval Step"
color: "purple"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["ai-agents-systems"]
audience: ["developers", "ai-engineers"]
related: ["skill:human-in-the-loop-gate", "agent:agent-reliability-reviewer", "guide:production-tool-calling"]
featured: false
summary: "Wraps one consequential agent action in a code-level approval gate. The agent pauses with the proposed action and arguments, a human approves, edits, or rejects, and the run resumes from a persisted checkpoint. It uses LangGraph's interrupt when present, otherwise a pause-persist-resume record, then adds tests for all three paths and a bypass check."
---

## Scope

Treat `$ARGUMENTS` as the action to gate ("the refund tool", "the deploy step") or the agent file to modify. Restate what you are gating in one sentence. If `$ARGUMENTS` is empty, list the agent's tools that write, send, pay, or delete, and ask which one to gate.

Goal: the agent **cannot perform the action until a human approves it**, enforced where the tool executes, not requested in the prompt.

> [!NOTE]
> A system-prompt line that says "ask first" is a suggestion the model can skip. A code path that refuses to run without an approval record is a guarantee.

## When to use

- The action moves money, deletes or overwrites data, sends something outside the company, deploys, or changes permissions.
- Not for cheap, reversible actions (reads, drafts, searches). Gating those trains reviewers to rubber-stamp. If the target is one of these, say so and ask before adding a gate.
- For the design questions (which actions, who approves, what timeout), use the [human-in-the-loop-gate](/skills/workflow/human-in-the-loop-gate) skill first. This command implements one gate.

## Step 1: Locate the action and the runtime

1. Find the function that performs the side effect, and every call site: `grep -rn "<function_name>(" --include="*.py" --include="*.ts" .` (use Grep). Every path to the side effect must go through the gate, so list them all.
2. Identify the framework from the manifest: `langgraph` in `pyproject.toml` / `package.json` means use its interrupt primitive (Step 2a). Anything else, or a hand-rolled loop, means Step 2b.
3. Find where agent state is persisted today (checkpointer, database table, queue). A gate needs durable state, because approval can arrive hours later and after a restart.

## Step 2a: LangGraph — interrupt inside the node

Call `interrupt()` with a JSON-serializable payload describing the proposed action. The graph pauses, the checkpointer saves state, and the value passed to `Command(resume=...)` becomes the return value of `interrupt()`.

```python
from langgraph.types import interrupt

def refund_node(state):
    decision = interrupt({
        "action": "issue_refund",
        "args": state["refund_args"],      # what will run, with what inputs
        "reason": state["refund_reason"],  # why the agent wants to
    })

    if decision["type"] == "reject":
        return {"refund_status": "rejected", "reject_reason": decision.get("reason")}

    args = decision.get("args", state["refund_args"])  # "edit" supplies new args
    receipt = issue_refund(**args)                     # side effect AFTER the interrupt
    return {"refund_status": "done", "receipt": receipt}
```

```python
from langgraph.types import Command

config = {"configurable": {"thread_id": "order-4821"}}  # same id to resume
graph.invoke(inputs, config=config)                      # runs until the interrupt
graph.invoke(Command(resume={"type": "approve"}), config=config)
```

Three rules from the LangGraph docs that the scaffold must respect:

- The graph needs a **checkpointer**. `InMemorySaver` is fine in tests; production needs a database-backed one, or a restart loses every pending approval.
- On resume the **node re-runs from its first line**, so anything before `interrupt()` executes again. Keep side effects after the interrupt, or make them idempotent.
- After a long pause, **re-read external state** (price, balance, inventory) before acting. The world the human approved may have changed.

## Step 2b: No interrupt primitive — pause, persist, resume

Split the action into "request" and "execute", joined by a stored approval record:

| Field | Purpose |
| --- | --- |
| `id` | Handle the approver and the resume call both use |
| `action`, `args` | Exactly what will run |
| `args_hash` | SHA-256 of the canonical args, so approved args cannot be swapped later |
| `context` | Why the agent proposed it (the triggering message or plan step) |
| `status` | `pending`, `approved`, `rejected`, `expired`, `executed` |
| `requested_at`, `expires_at` | Timeout window; pick the default with the user and state it |
| `approver`, `decided_at`, `decision_note` | Audit trail |

1. `request_<action>(args)` writes a `pending` record, notifies the approver through the project's existing channel, and returns the record id to the agent as the tool result ("awaiting approval, id ..."). It performs no side effect.
2. `execute_<action>(approval_id)` loads the record and runs the real function only if `status == "approved"`, `now < expires_at`, and the hash of the args about to run equals `args_hash`. It then sets `status = "executed"` in the same transaction, so a retry cannot run it twice.
3. Remove the original function from the model's tool list. Only the request tool is exposed.

## Step 3: Handle approve, edit, reject

- **Approve**: resume from the checkpoint and execute with the stored args.
- **Edit**: store the human's args (and a new `args_hash`), then execute with those. Record both versions.
- **Reject**: no side effect. Return the reason to the agent as the tool result so it can tell the user or try something else. Do not let it resubmit the same request in a loop: cap resubmissions (default 1).

## Step 4: Fail safe and audit

- Timeout, missing record, hash mismatch, unknown status, or an error reading the store all resolve to **not acting**. Mark timed-out records `expired`.
- Log one structured line per decision: approval id, action, args hash, approver, outcome, timestamps. Never log secrets from the args.

## Step 5: Verify

Write tests next to the project's existing ones, then run them with the project's test command (`pytest`, `npm test`):

1. Approve path: the side effect runs once, with the approved args.
2. Edit path: it runs with the edited args, not the original.
3. Reject path: the side-effect function is never called (assert on a mock or spy).
4. Timeout path: an expired record does not execute.
5. Replay: calling execute twice with one approval id runs the side effect once.

Then re-run the Step 1 grep. Every remaining call site of the raw function must be the gate itself or a test. Report any other caller as a bypass.

## Output

```markdown
## Approval gate: <action>
- Runtime: <LangGraph interrupt | pause-persist-resume>
- Gate enforced in: `path/to/file` (`function`)
- State persisted in: <checkpointer / table>
- Timeout: <duration>, resolves to no action
- Files changed: <list>
- Tests: <n> added, <pass/fail> (`<command>`)
- Call sites of the raw action outside the gate: <none | list>
- Still manual: <how the approver is notified and submits a decision, if not built here>
```

> [!WARNING]
> Gate by blast radius, not by default. If more than a handful of approvals a day reach one person, they stop reading them, and the gate is worth nothing.
