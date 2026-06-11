---
name: "hook-writer"
description: "Turn a plain-language automation request — 'format every file Claude edits', 'block writes to migrations', 'notify me when input is needed' — into a working Claude Code hook: the right event, a safe tested script, and the settings.json registration at the right scope. Use when you want a hook but don't want to hand-write the matcher, stdin JSON parsing, and exit-code plumbing."
allowed-tools: "Read, Grep, Glob, Write, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-11
topics: ["workflow-prompting"]
related: ["claude-code-hooks", "claude-code-settings-permissions", "claude-settings-auditor", "plugin-scaffolder", "setup-claude-ci"]
featured: false
summary: "Describe the automation you want and this skill ships the hook: it picks the correct event (PreToolUse to gate, PostToolUse to react, UserPromptSubmit to validate, Notification/Stop for signals), writes a hardened script that parses the stdin JSON and uses exit codes correctly, registers it in the right settings file with a scoped matcher and timeout, and tells you exactly how to verify it fires."
---

Give this skill a sentence like "run prettier on every file Claude edits" or "never let Claude touch `.env` files, and tell it why" and it produces the complete hook: event choice, matcher, hardened script, settings registration, and a verification step. Hooks are the right tool for rules that must hold every time — this skill removes the plumbing tax of writing one.

## When to use this skill

- You want an automatic action around Claude Code's lifecycle: format after edits, run affected tests, log tool calls, send a desktop notification, enforce a freeze window.
- You want to **block** something deterministically: edits to protected paths, dangerous Bash patterns, prompts containing secrets.
- You have a hook that misbehaves and want it diagnosed and rewritten safely.

## When NOT to use this skill

- The rule is a judgment call ("prefer small functions") — that's a CLAUDE.md instruction, not a hook. See [Claude Code Hooks](/guides/configuration/claude-code-hooks) for the dividing line.
- You're gating *which tools may run at all* with static patterns — plain [permission rules](/guides/configuration/claude-code-settings-permissions) do that with zero code; hooks are for logic patterns can't express.
- You're bundling hooks for distribution to other repos — write them here, then package with [plugin-scaffolder](/skills/workflow/plugin-scaffolder).

## Instructions

1. **Restate the automation as event + condition + action.** Name the lifecycle moment (before a tool call? after? on prompt submit? when Claude finishes?), the condition (which tools, paths, or patterns), and the action (run, block, notify, log). If the user's request maps to two events, prefer the narrower one — gate with `PreToolUse`, react with `PostToolUse`.
2. **Choose blocking semantics deliberately.** Only some events can block (`PreToolUse`, `UserPromptSubmit`). For a blocking hook, decide fail-open vs fail-closed on script errors and say which you chose: formatters fail open (exit 0 on error), guardrails fail closed (exit 2 on any doubt). Blocking output goes to stderr so Claude learns *why* and adjusts.
3. **Write the script defensively.** Read the event JSON from stdin (`jq -r '.tool_input.file_path // empty'`), quote every expansion, handle missing fields, and keep it fast — hooks run inline with the session. Place it at `.claude/hooks/<name>.sh` and make it executable. Never interpolate model-controlled values into shell unquoted.
4. **Register it at the right scope.** Project-wide rules go in `.claude/settings.json` (team-shared); personal automation in `~/.claude/settings.json`; machine-local experiments in `.claude/settings.local.json`. Add the matcher (`Edit|Write`, `Bash`, `mcp__server__tool`, or `*`) and a `timeout`. Show the exact JSON block being added and merge it without clobbering existing hooks.
5. **Verify it fires.** Trigger the event once (e.g. have Claude edit a scratch file) and confirm the effect; run `/hooks` to confirm registration and source file. For a blocking hook, also verify the *allowed* path still works — overblocking is the most common hook bug.
6. **Hand over the off-switch.** Note how to disable it (remove the JSON block, or `"disableAllHooks": true` temporarily) and what its failure mode looks like in practice.

> [!WARNING]
> A hook is arbitrary code running with the user's credentials on every matching event. Keep secrets out of hook scripts, treat tool input as untrusted data, and never write a blocking hook whose error path silently allows what it was built to stop.

> [!TIP]
> When the user's rule is expressible as a permission pattern (`deny: ["Read(./.env)"]`), say so and offer the rule instead — fewer moving parts beats a script doing the same job.

## Output

The executable hook script at `.claude/hooks/<name>.sh`, the exact settings JSON registered (with scope stated and why), a one-command verification you ran or the user can run, and the disable/rollback instructions — everything needed to trust the hook or remove it.
