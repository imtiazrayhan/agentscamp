---
title: "Effective Tool Use: Scoping an Agent's Toolset"
description: "How to scope tools and permissions so an agent reaches for the right one and can't do damage."
seoDescription: "How to scope an AI coding agent's tools and permissions so it reaches for the right tool and can't do damage — allowlists, scoping rules, and safe defaults."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["workflow-prompting"]
featured: false
related: ["writing-a-custom-agent", "building-an-mcp-server", "prompt-patterns", "claude-code-settings-permissions", "claude-code-hooks"]
summary: "An agent's toolset is its job description written in capabilities. Start from zero and grant the minimum; remove Edit/Write so a reviewer physically can't mutate code; pick one sharp tool per capability instead of three overlapping ones; name tools so the model routes correctly; scope MCP servers and credentials to least privilege; and gate the irreversible with hooks, not polite prompts."
keyTakeaways:
  - "Capability is the real boundary: a tool the agent doesn't have is the only constraint that can't be argued around — enforcement, not persuasion."
  - "Read-only by default, and not just for safety: capability shapes behavior — strip the write tools and the same prompt produces analysis instead of unreviewed 'helpful' edits."
  - "Bash in the allowlist is the full shell. The toolset alone doesn't make it read-only — that takes a PreToolUse hook on its commands, or a permission mode like plan."
  - "Overlapping tools breed inconsistency: give an agent three ways to search and it picks differently every run. One sharp tool per capability keeps behavior legible."
  - "For MCP, the credential defines the blast radius, not the prompt — connect only the servers each agent needs, on least-privilege, read-scoped tokens."
faq:
  - q: "How many tools should an agent have?"
    a: "The minimum a named task requires — start from zero and add deliberately. Every extra tool is another option weighed on every turn, another misfire path, and another way to do damage. A few sharp, non-overlapping tools produce more predictable behavior than a full toolbox."
  - q: "Does removing Edit and Write make an agent safe?"
    a: "It guarantees the agent cannot call those tools — no prompt injection or confusion conjures a tool outside the allowlist. But if the agent also holds Bash, it still has a full shell (including sed -i or rm). Pair the trimmed toolset with a PreToolUse hook that gates write-shaped shell commands for actual read-only enforcement."
  - q: "How do I make Bash read-only for an agent?"
    a: "You can't through the tools allowlist — Bash is all-or-nothing there. Enforce it one layer down: a PreToolUse hook that inspects each command and blocks writes, or run the agent in a read-only permission mode like plan. The toolset removes the editing tools; the hook constrains the shell."
  - q: "Which MCP servers should an agent get?"
    a: "Only the ones its job touches, with credentials scoped to that job — a release-notes agent gets GitHub read access, never the production database server. Many servers offer read-only modes or roles; use them. And treat MCP output as untrusted input: never wire an untrusted server to an agent holding write or deploy tools."
---

The fastest way to make an agent worse is to give it more tools. Every tool you add is another option the model has to consider on every turn, another way for it to misfire, and another path to a destructive mistake. The toolset is not a feature list — it's the agent's job description, written in capabilities. Get it wrong and the model wanders; get it right and a mediocre prompt still produces sharp, safe behavior.

This guide is about that decision: which tools to grant, how to name and describe them so the model reaches for the correct one, where MCP fits, and how to keep the blast radius small when something goes wrong.

## Start from the minimum toolset

The toolset budget is the foundation, and [writing a custom agent](/guides/getting-started/writing-a-custom-agent) covers the mechanics: a subagent inherits every tool from the main thread unless its `tools` field declares an explicit allowlist, so start from zero and add only what a named task requires. This guide assumes you've internalized that and goes further — into how naming, MCP scoping, credentials, and hooks shape what the toolset actually buys you.

The single highest-leverage constraint is removing write access entirely. Dropping `Edit` and `Write` from an agent's allowlist is safer for an obvious reason and sharper for a less obvious one.

Safer: with no `Edit` or `Write` tool, the agent *physically cannot* call them to mutate a file. No amount of prompt-injected instruction or model confusion conjures a tool that isn't in the allowlist. This is enforcement, not persuasion — far stronger than a system prompt that politely asks the agent not to write.

Sharper: capability shapes behavior. An agent that can edit code will, under pressure, start editing — it'll "helpfully" fix the bug it was asked to *describe*, and now you have an unreviewed change instead of a clean diagnosis. Strip the write tools and the same prompt produces analysis, because analysis is the only thing the agent *can* produce. The constraint does the work the prompt was struggling to.

> [!NOTE]
> `Bash` in the `tools` field is the **full shell** — the allowlist alone does *not* restrict it to read-only commands. Without an extra gate, an agent granted `Bash` can run *any* command, including `rm`, `git push`, or a shelled-out `sed -i`. What the restricted toolset *does* guarantee is that the agent cannot call the `Edit` or `Write` tools — so any file mutation has to go through the shell, if at all. To actually enforce read-only shell behavior, add a `PreToolUse` hook that inspects each `Bash` command and blocks write operations before they execute (or run the agent in a permission mode like `plan`). The toolset and the hook are different layers: one removes the editing tools, the other constrains the shell.

## A few sharp tools beat many overlapping ones

There's a temptation to hand an agent the whole toolbox so it's "capable of anything." In practice the opposite happens: overlapping tools create choice paralysis and inconsistent behavior. The clearest case is a single capability the agent can reach three different ways:

```text
Same job — "find every call site of deprecated_fn" — three tools that all do it:
  Grep(pattern)                  built-in, structured results
  Bash("rg deprecated_fn ...")   shelled-out ripgrep, raw output
  search_code(query)             an MCP search server
```

Hand an agent all three and it picks differently from run to run — `Grep` once, a shelled `rg` the next time, the MCP server after that. The results format changes, the edge cases differ, and you lose the predictability that makes an agent worth trusting. Pick the one tool that fits the job, drop the rest, and the agent's behavior becomes legible: there's only one way to do the thing, so it does it that way every time.

The same logic scales up to whole jobs. Don't merge a reviewer and a refactorer into one "code agent" with the union of both toolsets — a single agent that can both review and refactor will blur the line every time, reviewing a little and editing a little, and you'll never be sure which mode you got. Two focused agents with two focused toolsets stay legible. ([Writing a custom agent](/guides/getting-started/writing-a-custom-agent) walks through the per-job toolset choices.)

## Name and describe tools so the model picks right

When you build your own tools — via MCP, or as documented capabilities in a prompt — the name and description are the routing signal. The model chooses a tool by matching the user's intent against tool descriptions, exactly the way it routes tasks to subagents. Vague names produce wrong picks.

Make each tool's purpose unmistakable, and make overlapping tools clearly *non*-overlapping:

```text
Bad — the model has to guess which one:
  get_data(query)        "Fetches data."
  fetch_records(query)   "Gets records from the database."

Good — disjoint, with the boundary stated:
  search_orders(customer_id, status)
    "Find a customer's orders by status. Use for order history
     and fulfillment questions. Does NOT return payment details."
  get_invoice(invoice_id)
    "Fetch one invoice's line items and totals by exact ID.
     Use when you already have the invoice ID, not to search."
```

Three rules that consistently improve selection:

- **Name the action and the object.** `search_orders` beats `get_data`. The model maps verbs and nouns to intent.
- **Say when to use it — and when not to.** A one-line "Use for X, not Y" prevents the most common misfires.
- **State the cost and the boundary.** If a tool is slow, paginated, or write-capable, put that in the description so the model weighs it correctly.

> [!TIP]
> Treat tool descriptions like the `description` field on a subagent: they're read at decision time, not as documentation. The clearest signal of a bad description is the model reaching for the wrong tool — fix the words before you touch the logic.

## MCP tools: power and surface area

The Model Context Protocol lets you connect external tool servers — a database, GitHub, a search index, an internal API — so the agent can act on systems beyond the local repo. This is genuinely powerful and the place where toolset discipline matters most, because MCP tools reach outside your machine.

Two principles carry over directly, with higher stakes:

- **Connect only the servers a given agent needs.** An agent that drafts release notes needs the GitHub MCP server, not the production-database one. Wiring up every server you own to every agent is the MCP version of granting all tools — maximum surface area, minimum reason.
- **Prefer narrow, read-scoped servers.** Many MCP servers expose both read and write operations. If the agent only reports, connect a read-only configuration or one whose credentials can't mutate state. A reporting agent with database *write* access through MCP is a production incident waiting for a confused turn.

```text
Reporting agent  → GitHub MCP (read), Postgres MCP (read-only role)
Deploy agent     → GitHub MCP (write), CI MCP (trigger only)
```

The credentials behind an MCP server define the real blast radius — not the prompt, not the model. A server connected with an admin token can do admin things regardless of how carefully you instruct the agent. Scope the credential, not just the instruction.

> [!WARNING]
> MCP tool descriptions and returned content enter the model's context and can carry instructions. A malicious or compromised server can attempt prompt injection through its tool output. Only connect servers you trust, give them least-privilege credentials, and never wire an untrusted MCP server to an agent that holds write or deploy tools.

## Minimize the blast radius

Blast radius is the worst thing an agent can do in a single bad turn. Your goal is to make that worst case boring. The toolset is your primary lever, but a few habits compound it:

- **Default to read-only; escalate per task.** Most agents should never hold write or destructive tools. Grant them to the one agent whose job is to make the change, and nowhere else.
- **Separate observe from act.** Keep investigation in read-only agents and mutation in a separate, narrowly-scoped agent. The handoff (a diff, a plan, a summary) becomes a natural review checkpoint.
- **Gate the irreversible.** Force-push, `DROP`, `rm -rf`, deploy, and anything that spends money or touches customers ideally shouldn't be reachable from a routine agent's toolset at all. Where the agent still needs a shell, gate the dangerous commands with a `PreToolUse` hook — a prompt that *asks* the agent to confirm first is persuasion the model can talk itself out of; a hook that blocks the command is enforcement it can't.
- **Scope `Bash` deliberately.** `Bash` is the widest tool there is — granting it hands the agent the full shell, not a curated subset. If an agent has it, lean on dedicated tools (`Read`, `Grep`, `Glob`, `Edit`) for everything those already cover so `Bash` isn't the path of least resistance, and use a `PreToolUse` hook to allow- or deny-list the commands it may actually run. The `tools` allowlist alone won't do that for you.

```yaml
# Read-only investigator: observes everything, changes nothing.
tools: Read, Grep, Glob, Bash

# Surgical fixer: can change code, but holds no deploy or network tools.
tools: Read, Grep, Glob, Edit, Bash
```

The pattern underneath all of this: capability is the real boundary, and a tool the agent doesn't have is the only constraint that can't be argued around.

## Putting it together

Design the toolset before you polish the prompt — it does more to determine behavior than any wording will. Start from zero, add only what a named task requires, keep the agent read-only unless its job is to change things, and split overlapping responsibilities into separate agents with separate, sharp toolsets. Name and describe each tool so its purpose and boundary are unmistakable, scope MCP servers and their credentials to least privilege, and keep anything irreversible out of routine reach. A few sharp tools, granted on purpose, beat a full toolbox every time.
