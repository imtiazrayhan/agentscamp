---
title: "Claude Code Hooks: Automate Formatting, Tests, and Guardrails"
description: "How Claude Code hooks work — the major hook events, the settings.json configuration shape, exit codes and JSON output, plus three hooks worth copying."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "hooks", "automation", "configuration", "guardrails"]
featured: true
summary: "Hooks are commands Claude Code runs automatically at lifecycle events — before a tool call, after an edit, when a session starts or ends. Unlike CLAUDE.md instructions, hooks execute deterministically every time: format after every edit, block writes to protected paths, get a notification when Claude needs input. You configure them per event under the hooks key in settings.json."
keyTakeaways:
  - "Hooks turn 'please always do X' into 'X happens every time' — they're deterministic commands, not instructions the model might forget."
  - "PreToolUse and UserPromptSubmit hooks can block: exit code 2 (or a deny decision in JSON output) stops the action and feeds your reason back to Claude."
  - "Hooks live under the hooks key in settings.json at user, project, or local scope; a matcher filters which tools trigger them."
  - "A hook receives full context as JSON on stdin (event, tool name, tool input) and can respond with JSON to allow/deny, inject context, or surface a message."
  - "Hooks run with your credentials — treat hook scripts like any code with access to your machine, and review what a repo's checked-in settings register before trusting them."
howtoSteps:
  - name: "Pick the event"
    text: "Decide when the hook should fire: PreToolUse to gate an action before it runs, PostToolUse to react after it succeeds, UserPromptSubmit to validate or enrich prompts, Notification or Stop for session-level signals."
  - name: "Write the script"
    text: "Create an executable script that reads the JSON event from stdin, does its work, and exits 0 to continue or 2 to block (for events that support blocking). Keep it fast — hooks run inline with the session."
  - name: "Register it in settings"
    text: "Add the hook under the hooks key in .claude/settings.json (project-wide, checked in) or ~/.claude/settings.json (personal), with a matcher for the tools it applies to and a timeout."
  - name: "Test it"
    text: "Trigger the event — ask Claude to edit a file, for example — and confirm the hook fired. Run /hooks to see what's registered, and check stderr if the hook misbehaves."
  - name: "Harden it"
    text: "Quote every variable, handle missing JSON fields, decide deliberately whether the hook fails open or closed, and keep secrets out of the script and its environment."
faq:
  - q: "What are Claude Code hooks?"
    a: "Hooks are user-defined commands that Claude Code runs automatically at specific lifecycle events — before a tool call (PreToolUse), after one succeeds (PostToolUse), when you submit a prompt, when a session starts or stops. They're configured in settings.json and execute deterministically, which makes them the right tool for rules that must always apply: formatting, guardrails, notifications, audit logs."
  - q: "Can a hook block Claude Code from running a command?"
    a: "Yes. A PreToolUse hook that exits with code 2 — or returns a JSON permissionDecision of \"deny\" — blocks the tool call before it executes, and the message you print to stderr (or the decision reason) is fed back to Claude so it can adjust course. UserPromptSubmit hooks can block a prompt the same way."
  - q: "Where do I configure Claude Code hooks?"
    a: "Under the hooks key in any settings file: ~/.claude/settings.json for all your projects, .claude/settings.json for a project (checked in, applies to the whole team), or .claude/settings.local.json for personal project-only hooks. Run /hooks inside a session to see what's currently registered and from where."
  - q: "What's the difference between a hook and a CLAUDE.md instruction?"
    a: "A CLAUDE.md instruction is context the model reads and usually follows — but it can be forgotten, deprioritized, or compacted away in a long session. A hook is code the harness executes every time its event fires, whether or not the model remembers anything. Use instructions for judgment calls and hooks for invariants."
  - q: "Do hooks work with MCP tools?"
    a: "Yes. MCP tools appear with names like mcp__github__create_issue, and hook matchers can target them the same way as built-in tools — so you can gate, log, or post-process MCP tool calls with the same machinery."
related: ["claude-code-settings-permissions", "hook-writer", "claude-settings-auditor", "claude-code-memory-context", "claude-code-tips", "claude-md-best-practices", "claude-code", "setup-claude-ci"]
---

Claude Code hooks are user-defined commands that run automatically at specific points in Claude Code's lifecycle — before a tool call, after a file edit, when you submit a prompt, when the session starts or ends. They are the difference between *asking* the agent to follow a rule and *enforcing* it.

## Instructions ask. Hooks guarantee.

You can write "always run prettier after editing a file" in [CLAUDE.md](/guides/configuration/claude-md-best-practices), and Claude will usually do it. But "usually" is doing real work in that sentence: instructions compete with everything else in context, and in a long session they can be deprioritized or compacted away. A hook removes the model from the loop entirely — the formatter runs after every edit because the harness runs it, not because the model remembered to.

That's the mental model for what belongs where:

- **Judgment calls** (naming, architecture, tone) → CLAUDE.md instructions.
- **Invariants** (formatting, protected files, notifications, audit logs) → hooks.

## What teams actually use hooks for

- **Auto-formatting** — run `prettier`, `ruff`, or `gofmt` on every file Claude edits.
- **Guardrails** — block edits to `.env` files, lockfiles, or migrations; gate dangerous Bash patterns beyond what [permission rules](/guides/configuration/claude-code-settings-permissions) express.
- **Feedback loops** — run the affected tests after an edit and feed failures straight back to Claude.
- **Notifications** — desktop ping when Claude needs input or finishes a long task.
- **Audit and compliance** — log every tool call with its input to a file your team can review.

## The hook events

The core events, and whether they can block the action:

| Event | Fires | Can block? |
| --- | --- | --- |
| `SessionStart` | When a session begins or resumes | No |
| `UserPromptSubmit` | Before Claude processes your prompt | **Yes** |
| `PreToolUse` | Before any tool call executes | **Yes** |
| `PostToolUse` | After a tool call succeeds | No |
| `PostToolUseFailure` | After a tool call fails | No |
| `Notification` | When Claude Code sends a notification (e.g. waiting for input) | No |
| `Stop` | When Claude finishes responding | No |
| `SubagentStop` | When a subagent finishes | No |
| `PreCompact` | Before context compaction | No |
| `SessionEnd` | When the session terminates | No |

More specialized events exist — `PermissionRequest`, `FileChanged`, worktree and subagent lifecycle events, and others — and the list grows with the product; the docs' hooks reference is the source of truth for the full set. The two you'll use most are `PreToolUse` (gate things) and `PostToolUse` (react to things).

## Configuring a hook

Hooks live under the `hooks` key in any settings file — `~/.claude/settings.json` for every project, `.claude/settings.json` to share with your team, `.claude/settings.local.json` to keep personal. Each event maps to a list of matchers, and each matcher to a list of handlers:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/format-after-edit.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

- **`matcher`** filters which tool triggers the hook — an exact tool name (`Bash`), an alternation (`Edit|Write`), or `*` for everything. MCP tools match by their full name (`mcp__github__create_issue`).
- **`type: "command"`** is the workhorse. Other handler types exist — prompt and agent hooks that ask a model to evaluate a condition, HTTP hooks that POST the event to a URL — but start with commands.
- **`timeout`** caps how long the hook may run, in seconds.

Run `/hooks` in a session to see every registered hook and which settings file it came from, and set `"disableAllHooks": true` to switch them off temporarily.

## How a hook talks back

Every hook receives the event as JSON on stdin:

```json
{
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "hook_event_name": "PreToolUse",
  "tool_name": "Edit",
  "tool_input": { "file_path": "/path/to/project/src/index.ts" }
}
```

It answers with its exit code, and optionally with JSON on stdout:

- **Exit 0** — success. Stdout may contain JSON for fine-grained control.
- **Exit 2** — block, for events that support it. For `PreToolUse` the tool call never runs, and your stderr is shown to Claude as the reason.
- **Anything else** — non-blocking error; the session continues.

The JSON output unlocks the precise controls: a `PreToolUse` hook can return `"permissionDecision": "allow" | "ask" | "deny"` with a reason, any hook can add `"additionalContext"` for Claude or a `"systemMessage"` for you, and `"continue": false` stops the session outright.

## Three hooks worth copying

**1. Format after every edit** (`PostToolUse`, matcher `Edit|Write`):

```bash
#!/usr/bin/env bash
# .claude/hooks/format-after-edit.sh
file=$(jq -r '.tool_input.file_path // empty')
case "$file" in
  *.ts|*.tsx|*.js|*.jsx) npx prettier --write "$file" >/dev/null 2>&1 ;;
  *.py) ruff format "$file" >/dev/null 2>&1 ;;
esac
exit 0
```

**2. Protect paths Claude should never touch** (`PreToolUse`, matcher `Edit|Write`):

```bash
#!/usr/bin/env bash
# .claude/hooks/protect-paths.sh
file=$(jq -r '.tool_input.file_path // empty')
case "$file" in
  *.env*|*/secrets/*|*.pem|*package-lock.json|*pnpm-lock.yaml)
    echo "Blocked: $file is protected. Change it manually if it really must change." >&2
    exit 2 ;;
esac
exit 0
```

Exit code 2 blocks the edit, and the stderr line tells Claude *why*, so it routes around the restriction instead of retrying it.

**3. Desktop notification when Claude needs you** (`Notification`):

```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude needs input\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

(macOS; on Linux swap in `notify-send "Claude Code" "Claude needs input"`.) Kick off a long task, go do something else, and let the hook pull you back.

> [!TIP]
> Want a hook but don't want to hand-write the matcher, script, and JSON plumbing? The [hook-writer](/skills/workflow/hook-writer) skill turns "block edits to migrations and notify me when tests fail" into a tested hook config.

## Hooks run as you

A hook is arbitrary code executing with your credentials, inside your session. Treat the mechanism with respect:

- **Review third-party hooks.** A repo's checked-in `.claude/settings.json` can register hooks; read them before working in an untrusted repo, the same way you'd read a `postinstall` script.
- **Quote and validate.** Hook input contains model-chosen values (file paths, commands). Quote every variable and handle unexpected shapes — your protect-paths hook shouldn't be injectable through a weird filename.
- **Decide fail-open vs. fail-closed.** A formatter that errors should probably exit 0 (fail open); a compliance gate should exit 2 on any doubt (fail closed).
- **Keep them fast.** Hooks run inline; a slow `PreToolUse` hook taxes every single tool call.

Hooks are one of the three pillars that make Claude Code programmable — alongside [settings and permissions](/guides/configuration/claude-code-settings-permissions) and [memory](/guides/configuration/claude-code-memory-context). Wire all three and the agent stops being a chat window and starts being infrastructure: [running unattended in CI](/commands/workflow/setup-claude-ci) with the same guardrails you use locally.
