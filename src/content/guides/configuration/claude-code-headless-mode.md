---
title: "Claude Code Headless Mode: Run claude -p in Scripts and CI"
seoTitle: "Claude Code Headless Mode (claude -p): Flags, Output, Permissions"
description: "How to run Claude Code headless with claude -p: output formats and JSON fields, --bare, permission defaults, auth, exit codes, sessions, and CI patterns."
author: "Imtiaz Rayhan"
date: 2026-11-11
reviewed: 2026-11-22
color: "green"
depth: standard
topics: ["workflow-prompting", "devops-infra"]
audience: ["developers", "devops"]
tags: ["claude-code", "headless", "non-interactive", "ci", "automation", "cli"]
keywords: ["Claude Code headless mode", "claude -p", "Claude Code non-interactive mode", "Claude Code output-format json", "Claude Code --bare", "Claude Code in CI"]
summary: "Headless mode is what Anthropic's docs call non-interactive mode: claude -p \"task\" runs the full agent loop, prints the result and exits. Pick text, json or stream-json output, use --bare in scripts, and pre-approve tools with --allowedTools, because since v2.1.302 a -p run with no mode set starts in Manual mode and denies anything that would prompt."
keyTakeaways:
  - "\"Headless mode\" and \"non-interactive mode\" are the same thing: claude -p. Anthropic's page for it is titled \"Run Claude Code programmatically\" and describes it as the Agent SDK driven from the CLI."
  - "With --output-format json, the headless docs name result, session_id, total_cost_usd and a per-model cost breakdown; --json-schema adds structured_output. Other fields come from the SDK type reference, so read them defensively."
  - "Since v2.1.302, a -p run with no permission mode starts in Manual (default) mode and denies anything that needs approval unless an allow rule, hook, callback or --permission-prompt-tool approves it."
  - "--bare is the recommended mode for scripts and skips hooks, skills, plugins, MCP servers, auto memory and CLAUDE.md. Without it, a -p run executes a project's hooks and .mcp.json servers with no trust dialog."
  - "Exit code 0 means success and non-zero means failure, but failures inside the run print to stdout as the result, so check both. SIGTERM exits with 143."
  - "Move to the Python or TypeScript Agent SDK when you need tool-approval callbacks or native message objects; from any other language, run claude -p with --output-format json as a subprocess."
howtoSteps:
  - name: "Prove the prompt with claude -p locally"
    text: "Run claude -p \"your task\" in the repository first. If the task needs a clarifying question to finish, rewrite the prompt until one run completes it."
  - name: "Choose an output format"
    text: "Keep the default text output for humans, use --output-format json to read result and session_id in a script, stream-json for live progress, or --json-schema when code consumes the answer."
  - name: "Switch to bare mode and supply credentials"
    text: "Add --bare so the run skips local hooks, plugins, MCP servers and CLAUDE.md, then set ANTHROPIC_API_KEY or an apiKeyHelper in --settings, because bare mode never reads OAuth credentials."
  - name: "Pre-approve exactly the tools the task needs"
    text: "Pass --allowedTools with narrow permission rules such as \"Bash(npm test)\" and set --permission-mode dontAsk so anything else is denied instead of waiting for a prompt."
  - name: "Bound the run"
    text: "Add --max-turns and, if you track spend, --max-budget-usd with headroom, since spend can pass the cap."
  - name: "Check the exit code and the result"
    text: "Treat a non-zero exit as failure, and also inspect the result text or JSON, because errors inside the run such as missing authentication are printed to stdout."
faq:
  - q: "Is Claude Code headless mode the same as non-interactive mode?"
    a: "Yes. \"Headless mode\" is the common name; Anthropic's documentation calls it non-interactive mode and titles the page \"Run Claude Code programmatically.\" Both refer to running claude -p (--print), which runs the full agent loop, prints the response and exits instead of opening the interactive interface."
  - q: "What permission mode does claude -p use by default?"
    a: "In Claude Code v2.1.302 or later, a claude -p or Agent SDK run with no permission mode set starts in Manual mode, the new name for default. Calls that need approval are denied unless an allow rule, a hook, a canUseTool callback or --permission-prompt-tool approves them. Interactive terminal sessions start in auto mode instead, which is why a task that works interactively can be denied in a script."
  - q: "What does claude -p --output-format json return?"
    a: "The headless docs say the JSON includes the result, the session ID and metadata, including total_cost_usd and a per-model cost breakdown; with --json-schema it also carries structured_output. The cost figures are client-side estimates, not your bill. The Agent SDK's result type lists more fields, such as subtype, is_error and num_turns, but the docs don't state the CLI output matches it field for field."
  - q: "Does claude -p load CLAUDE.md, hooks and MCP servers?"
    a: "Yes, unless you pass --bare. A normal -p run loads your configuration and runs the hooks in a project's .claude/settings.json and the servers in its .mcp.json, even in a folder you've never trusted, with no trust dialog. --bare skips hooks, skills, custom commands, subagents, plugins, MCP servers, auto memory and CLAUDE.md, and is the recommended mode for scripts."
  - q: "How do I continue a headless Claude Code session?"
    a: "Capture the session ID from JSON output, for example with jq -r '.session_id', then pass it to --resume on the next claude -p call. --continue resumes the most recent conversation in the current directory and, with -p, includes earlier -p, SDK and /loop sessions. Add --fork-session to branch into a new session ID instead of extending the original."
sources:
  - title: "Run Claude Code programmatically"
    url: "https://code.claude.com/docs/en/headless"
    publisher: "Anthropic"
  - title: "CLI reference"
    url: "https://code.claude.com/docs/en/cli-reference"
    publisher: "Anthropic"
  - title: "Permission modes"
    url: "https://code.claude.com/docs/en/permission-modes"
    publisher: "Anthropic"
  - title: "Configure permissions"
    url: "https://code.claude.com/docs/en/permissions"
    publisher: "Anthropic"
  - title: "Authentication"
    url: "https://code.claude.com/docs/en/authentication"
    publisher: "Anthropic"
  - title: "Best practices for Claude Code"
    url: "https://code.claude.com/docs/en/best-practices"
    publisher: "Anthropic"
  - title: "Agent SDK overview"
    url: "https://code.claude.com/docs/en/agent-sdk/overview"
    publisher: "Anthropic"
  - title: "Agent SDK reference: TypeScript"
    url: "https://code.claude.com/docs/en/agent-sdk/typescript"
    publisher: "Anthropic"
  - title: "Claude Code changelog"
    url: "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md"
    publisher: "Anthropic"
related: ["guide:claude-code-ci-github-actions", "guide:claude-agent-sdk-tutorial", "tool:claude-agent-sdk", "guide:claude-code-settings-permissions", "guide:claude-code-subagents", "guide:claude-code-with-other-models", "command:setup-claude-ci", "tool:claude-code"]
---

"Headless mode" is what most people search for. Anthropic's documentation calls the same thing **non-interactive mode**, and the page that covers it is titled "Run Claude Code programmatically." The two names mean one thing: `claude -p "your task"` runs the full [Claude Code](/tools/claude-code) agent loop (reading files, editing, running commands under your permission rules), prints the result, and exits. The docs frame it as the Agent SDK driven from the command line: "This page covers using the Agent SDK via the CLI (`claude -p`)."

This page is a reference for that mode as of November 2026, when 2.1.330 is the latest Claude Code release and 2.1.323 is on the stable channel. It covers the flags, the output formats, which result fields you can rely on, how permissions behave when nobody is there to approve a prompt, and when to move to the SDK packages. For the GitHub Action built on top of it, see [Running Claude Code in CI](/guides/advanced/claude-code-ci-github-actions).

## The basic call

```bash
claude -p "Explain what src/auth/session.ts does"
```

`-p` is short for `--print`, which the CLI reference describes as "Print response without interactive mode." It composes like any Unix tool. The docs pipe data in and redirect the answer out:

```bash
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

They also show a typo linter wired into `package.json`, built from `git diff main | claude -p` and a short instruction. A few rules apply to the prompt string:

- User-invoked skills and custom commands work: "Include `/skill-name` in the prompt string."
- "Built-in commands that only run in the terminal interface, such as `/login`, aren't available."
- Claude Code rejects `--bg` with `-p`, and rejects `--cloud` when you pass a task description.
- Piped stdin is capped at 10MB. Past the cap, Claude Code exits with an error and a non-zero status.

## Output formats

| `--output-format` | What you get | Use it for |
| --- | --- | --- |
| `text` (default) | The final response as plain text | Humans, redirecting to a file |
| `json` | "structured JSON with result, session ID, and metadata" | Scripts that need the answer, the cost estimate or the session ID |
| `stream-json` | "newline-delimited JSON for real-time streaming" | Live progress, long runs, CI logs |

The docs pair `stream-json` with `--verbose`. `--include-partial-messages` adds partial streaming events and requires `--print` with `stream-json`. For streaming input as well as output, the docs show `claude -p --input-format stream-json --output-format stream-json --verbose`.

### Result fields you can rely on

The headless page names these fields in JSON output:

- **`result`**: the final response text.
- **`session_id`**: the ID you pass to `--resume` later.
- **`total_cost_usd`** plus a per-model cost breakdown. When you continue a conversation with `--continue` or `--resume`, the run reports the whole conversation's total. "Both figures are client-side estimates and can differ from your actual bill."
- **`structured_output`**: present when you pass `--json-schema`. If the run ends without valid output there is no `structured_output` field, so check that it exists before you read it.

```bash
claude -p "List the exported functions in src/utils.ts" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}' \
  | jq '.structured_output // empty'
```

The Agent SDK's TypeScript reference documents a fuller result type: `subtype` (`success`, `error_max_turns`, `error_during_execution`, `error_max_budget_usd` or `error_max_structured_output_retries`), `is_error`, `num_turns`, `duration_ms`, `usage`, `modelUsage` and `permission_denials`, among others. The docs don't say the CLI's JSON object matches that type field for field, so read those fields defensively. If you do use them, note that `usage` covers the main agent loop only; the SDK docs recommend `modelUsage` for token and cost accounting.

With `stream-json`, the `system/init` event (first in the stream unless startup hook or plugin-install events precede it) carries `mcp_servers` and `mcp_server_errors` plus `plugins` and `plugin_errors`, "so a CI gate can fail on a non-empty array." `system/api_retry` events report retry progress, and "the last line of the stream is a `result` message with the final response text, cost, and session metadata."

## The flags that matter in scripts

| Flag | What it does |
| --- | --- |
| `--bare` | Skips auto-discovery of hooks, skills, custom commands, subagents, plugins, MCP servers, auto memory and CLAUDE.md |
| `--allowedTools` | Tools that run without a permission prompt, in permission-rule syntax such as `"Bash(git log *)"` |
| `--disallowedTools` | Deny rules. A bare tool name removes the tool from Claude's context; a scoped rule like `Bash(rm *)` denies only matching calls |
| `--tools` | Restricts which built-in tools exist at all: `""` disables all, `"default"` gives the default set |
| `--permission-mode` | `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`, or `manual` as an alias for `default` |
| `--max-turns` | Limits agentic turns (print mode only). No limit by default |
| `--max-budget-usd` | Stops the run once estimated API spend reaches the amount. "Spend can pass the cap, so leave headroom" |
| `--model`, `--fallback-model` | An alias (`sonnet`, `opus`, `haiku`, `fable`) or a full model name, plus fallbacks for when the primary is overloaded |
| `--append-system-prompt`, `--system-prompt` | Add to the default system prompt, or replace it. Replacing it also drops the git status snapshot |
| `--mcp-config`, `--strict-mcp-config` | Load MCP servers from JSON; the strict flag ignores `.mcp.json` and other configured servers |
| `--agents` | Define subagents as inline JSON; with `--print` it can be a path to a JSON file (v2.1.281 or later) |
| `--no-session-persistence` | Don't save the session to disk. It can't be resumed |

With `--mcp-config` and `-p`, Claude Code waits for servers that are still starting, up to `MCP_TIMEOUT` (30 seconds by default). Subagents defined with `--agents` behave as described in the [subagents reference](/guides/configuration/claude-code-subagents).

### Bare mode

The docs are direct about it: "`--bare` is the recommended mode for scripted and SDK calls, and will become the default for `-p` in a future release." A bare run still reads settings files and their permission rules but skips that auto-discovery, so you add back only what the job needs with `--settings`, `--mcp-config`, `--append-system-prompt` or `--agents`.

Bare mode changes authentication. "In bare mode, Claude Code never reads OAuth credentials or the system keychain." Set `ANTHROPIC_API_KEY`, or supply an `apiKeyHelper` in the `--settings` JSON. It also ignores `CLAUDE_CODE_OAUTH_TOKEN`.

The security reason matters more than the speed. Without `--bare`, "a `-p` session runs the hooks in a project's `.claude/settings.json` and connects the servers in its `.mcp.json`, even in a folder you've never trusted. A `-p` session shows no workspace trust dialog and no per-server approval prompt." If your pipeline checks out code you didn't write, that code's hooks and MCP servers run unless you pass `--bare`.

## Permissions when nobody can click "allow"

The permission-modes doc sets the default: "In Claude Code v2.1.302 or later, `claude -p` and Agent SDK runs with no permission mode set start in Manual mode… Calls needing approval are denied unless you approve them with an allow rule, hook, `canUseTool` callback, or `--permission-prompt-tool`." Manual is the new name for `default`. Interactive terminal sessions behave differently: since v2.1.283 they start in auto mode. A task that runs smoothly at your desk can therefore stall on denials in a script.

Pick a posture on purpose:

- **Locked-down CI.** `dontAsk` means "Claude Code denies every call that would otherwise prompt, which is useful for locked-down CI runs." The docs' CI example:

  ```bash
  claude -p "run the test suite" --permission-mode dontAsk --allowedTools "Bash(npm test)" "Read"
  ```

- **Scoped commits.** The docs' commit example pre-approves only the git commands it needs: `--allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"`.
- **Prompts nobody can answer.** `--permission-prompts` defaults to `host`; pass `none` (v2.1.259 or later) "when nobody can answer, and Claude Code denies them instead." Or name an MCP tool to handle prompts, such as `--permission-prompt-tool mcp__permissions__approve`.
- **Fully unattended.** `--dangerously-skip-permissions` equals `--permission-mode bypassPermissions`. The docs require "a container, VM, or the sandbox runtime" and say to run it as a non-root user.

One syntax trap from the docs: "`Bash(git diff *)` matches `git diff` with or without arguments. The space before `*` is important: without it, `Bash(git diff*)` would also match `git diff-index`." The older colon form still works: `Bash(ls:*)` matches the same commands as `Bash(ls *)`. The [settings and permissions guide](/guides/configuration/claude-code-settings-permissions) covers rule syntax in full.

## Authentication in scripts and CI

Claude Code picks credentials in this order: a cloud provider switch (`CLAUDE_CODE_USE_BEDROCK`, `_VERTEX`, `_FOUNDRY`), then `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY`, `apiKeyHelper`, `CLAUDE_CODE_OAUTH_TOKEN`, Anthropic profile or federation credentials, and finally `/login` subscription OAuth.

- **`ANTHROPIC_API_KEY`**: "In non-interactive mode (`-p`), the key is always used when present." Interactive sessions ask you to approve it once.
- **Subscription token**: `claude setup-token` generates a one-year OAuth token to set as `CLAUDE_CODE_OAUTH_TOKEN`. It requires a Pro, Max, Ultra, Team or Enterprise plan, and bare mode doesn't read it.
- **`apiKeyHelper`**: output is cached for five minutes by default (`CLAUDE_CODE_API_KEY_HELPER_TTL_MS`).
- **Cloud providers and gateways**: see [using Claude Code with other models and providers](/guides/configuration/claude-code-with-other-models).

If you are building a product on top of `-p`, note the Agent SDK rule: "Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products."

## Exit codes and failure handling

The documented contract is short: "Claude Code exits with code 0 on success and a non-zero code when the run fails." An invalid flag is reported on stderr before the run starts. "When a failure happens inside the run, such as missing authentication, Claude Code prints the failure as the result on stdout." Check the exit code and read the result. Other details:

- **SIGTERM** exits with code 143. To end the current turn instead, send SIGINT.
- **Turn limit**: a run that hits `--max-turns` exits with an error.
- **Background work**: the run waits for background subagents and commands, but "stops whatever is still running after 10 minutes of continuous idle waiting by default." Change it with `CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS` (`0` removes the ceiling).
- **Long subagent commands**: "a `claude -p` run can exit with code 0 before the command finishes." Raise `BASH_DEFAULT_TIMEOUT_MS` if a subagent runs slow commands.

No other exit codes are documented, so don't branch on specific non-zero values.

## Sessions: continue, resume, fork

```bash
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Now check the error handling" --resume "$session_id"
```

`--continue` loads the most recent conversation in the current directory, and "`claude -p --continue` includes `-p`, SDK, and `/loop` sessions" (interactive `--continue` skips them). `--resume` accepts an ID, a session name, or the absolute path to a session's `.jsonl` transcript. Add `--fork-session` to get a new session ID instead of extending the original. File checkpoints can also be restored from the CLI; the [checkpoints guide](/guides/getting-started/claude-code-checkpoints) shows the `--rewind-files` command.

## Patterns from the docs

The best-practices page has a fan-out loop for large migrations:

```bash
for file in $(cat files.txt); do
  claude --bare -p "Migrate $file to the new logger API and commit. Reply OK or FAIL." \
    --allowedTools "Read,Edit,Bash(git add *),Bash(git commit *)" \
    --permission-mode dontAsk \
    --max-turns 20
done
```

Its advice: "Try it on three files first, see what goes wrong, fix the prompt, then run the rest." To run sessions in parallel, use worktrees (`claude -w`) or `/batch`, and remember that "a `claude -p --worktree` run is one you clean up yourself, since it exits without asking." The [parallel worktrees guide](/guides/advanced/parallel-claude-code-worktrees) covers cleanup.

A security review step adapted from the headless page:

```bash
gh pr diff "$PR_NUMBER" | claude -p \
  --append-system-prompt "You are a security engineer. Review for vulnerabilities." \
  --output-format json
```

To run this from GitHub on pull requests, use the official action described in [Running Claude Code in CI](/guides/advanced/claude-code-ci-github-actions), or scaffold a workflow with the [Setup Claude CI](/commands/workflow/setup-claude-ci) command.

## When to move to the Agent SDK

`claude -p` already is the Agent SDK, driven through the CLI. The docs describe the SDK as "the same tools, agent loop, and context management that power Claude Code… available as a CLI for scripts and CI/CD, or as Python and TypeScript packages." The docs point to the packages for "structured outputs, tool approval callbacks, and native message objects," though the CLI already covers structured output with `--json-schema`. A `canUseTool` callback that decides each approval in code is the usual trigger. For languages other than Python or TypeScript, the docs' answer is to "run the CLI as a subprocess with the `-p` flag and `--output-format json`."

The SDK took its current name in v2.0.0 on September 29, 2025: "The Claude Code SDK is now the Claude Agent SDK." The [Claude Agent SDK tutorial](/guides/advanced/claude-agent-sdk-tutorial) picks up from here, and the [Claude Agent SDK](/tools/claude-agent-sdk) tool page summarizes the packages.
