---
description: "Run MCP Inspector CLI checks against an MCP server given as a launch command or URL: detect its protocol era, list tools with --strict, call one safe tool, call it with bad arguments, and report pass or fail per check with exit codes."
seoDescription: "/test-mcp-server runs MCP Inspector v2 CLI checks against a server command or URL and reports pass or fail per check, with exit codes and the protocol era."
date: 2026-11-13
argument-hint: "<server command or URL> [tool name]"
allowed-tools: "Read, Grep, Glob, Bash"
title: "Test MCP Server"
color: "purple"
topics: ["mcp", "review-qa"]
audience: ["developers", "ai-engineers"]
featured: false
related: ["skill:mcp-server-tester", "tool:mcp-inspector", "command:add-mcp-server", "agent:mcp-server-engineer", "guide:mcp-troubleshooting", "guide:best-claude-skills-for-mcp-development"]
summary: "A slash command that smoke-tests an MCP server from inside Claude Code with the MCP Inspector v2 CLI. It probes the protocol era, lists tools with --strict schema checks, calls one read-only tool, calls it again with bad arguments to confirm an isError result, and prints a pass or fail table keyed to the Inspector's exit codes. It changes no files."
---

Smoke-test the MCP server in `$ARGUMENTS` with the [MCP Inspector](/tools/mcp-inspector) v2 CLI and report pass or fail for each check. This is the quick, read-only version of the [mcp-server-tester](/skills/testing/mcp-server-tester) skill: it runs the same Inspector checks but writes no test files. Every verdict comes from an exit code or a field in the JSON output, not from reading the server's prose.

## Scope

Interpret `$ARGUMENTS` as follows:

1. A URL (`https://…`): a remote server. A path ending in `/mcp` or `/sse` sets the transport; any other path needs `--transport http` (or `sse`), so ask which if the URL does not say.
2. Anything else: the stdio launch command, for example `node build/index.js` or `uv run server.py`.
3. An optional last word naming a tool: use it for the call checks. Otherwise pick one in Step 4.
4. Empty: look for a launch command in `package.json` (`bin`, `start`), `pyproject.toml`, or the README. If you find none, stop and ask for the command or URL.

> [!WARNING]
> This command calls a real tool on a real server. Call only a tool that is safe to call repeatedly: read-only, idempotent, and cheap. If no listed tool is clearly read-only, stop after Step 3 and ask the user which tool to call, or whether to skip the call checks.

In every command below, `<target>` is the command or URL from `$ARGUMENTS`, and `--cli` must come first, right after the package name. Capture exit codes with `rc=$?` (not `status`, which is read-only in zsh). For a remote server in a non-interactive run, add `--stored-auth-only` so the Inspector never starts an OAuth browser flow.

## Step 1 — Preflight

Run `node --version`. Inspector v2 needs Node `^22.23.4 || ^24.22.1 || >=26.12.1`; on an older Node, stop and say so. Check that `jq` is available for parsing.

## Step 2 — Detect the protocol era

```bash
npx @modelcontextprotocol/inspector --cli <target> --method initialize --format json \
  | jq '.result | {protocolVersion, serverInfo, capabilities}'
```

`2026-07-28` is the stateless era (no `initialize` handshake, no sessions, no `ping` or `logging/setLevel`). A 2025 or 2024 date is the session-based era. Report the version and the advertised capabilities. Exit `4` means the server is unreachable and `3` means auth is required: stop and report either.

## Step 3 — List tools with strict schema checks

```bash
npx @modelcontextprotocol/inspector --cli <target> --method tools/list --format json > /tmp/mcp-tools.json; rc=$?
jq -r '.result.tools[] | [.name, (.description // "MISSING DESCRIPTION")] | @tsv' /tmp/mcp-tools.json
npx @modelcontextprotocol/inspector --cli <target> --method tools/list --strict; rc=$?
```

Pass: exit `0` and at least one tool. The `--strict` run exits `6` if a tool schema has an error-severity portability problem and prints the details on stderr; report each one. Flag any tool with no description.

## Step 4 — Happy-path call

Choose the tool named in `$ARGUMENTS`, or the most clearly read-only tool from Step 3 (names like `get_`, `list_`, `search_`, with no side effects described). Build valid arguments from its `inputSchema`, then:

```bash
npx @modelcontextprotocol/inspector --cli <target> --method tools/call \
  --tool-name <tool> --tool-args-json '<valid JSON object>' --format json > /tmp/mcp-call.json; rc=$?
jq '.result.isError, (.result.content | length)' /tmp/mcp-call.json
```

Pass: exit `0`, `isError` not true, and non-empty `content`.

## Step 5 — Error-path call

Call the same tool with arguments its schema rejects (drop a required field or use the wrong type):

```bash
npx @modelcontextprotocol/inspector --cli <target> --method tools/call \
  --tool-name <tool> --tool-args-json '<invalid JSON object>' --format json > /tmp/mcp-bad.json; rc=$?
```

Pass: exit `5` with `isError: true` in the result and a readable message. Exit `5` means the tool reported the failure inside its result, where a model can see it and correct itself. Any other non-zero exit is a finding: the failure came back as a protocol error instead. Quote the error envelope from stderr.

## Step 6 — Report

```markdown
## /test-mcp-server: node build/index.js

Era: 2026-07-28 (stateless) · capabilities: tools, resources
Tool used for calls: get_temp (read-only per its description)

| # | Check | Expected | Exit | Verdict |
| --- | --- | --- | --- | --- |
| 1 | initialize probe | exit 0 | 0 | PASS |
| 2 | tools/list | exit 0, ≥1 tool | 0 | PASS (3 tools) |
| 3 | tools/list --strict | exit 0 | 6 | FAIL: search_notes schema not portable (see stderr) |
| 4 | tools/call get_temp (valid) | exit 0, isError not true | 0 | PASS |
| 5 | tools/call get_temp (missing city) | exit 5, isError true | 5 | PASS |

Result: 4 of 5 passed.
Next: fix the schema problem in check 3; run the mcp-server-tester skill to turn these checks into CI tests.
```

Exit codes for reference: `0` success, `1` usage or unexpected error, `3` auth, `4` unreachable, `5` tool error or tool not found, `6` strict schema problem, `11` rate limited, `12` OAuth destination guard refusal, `130` interrupted `--load` run.

> [!NOTE]
> This command does not edit the server or write tests. To register a passing server with Claude Code, use [/add-mcp-server](/commands/workflow/add-mcp-server); when a check fails for a reason that is not obvious, [MCP troubleshooting](/guides/troubleshooting/mcp-troubleshooting) covers the common causes.
