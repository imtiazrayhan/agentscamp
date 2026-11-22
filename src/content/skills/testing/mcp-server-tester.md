---
name: "mcp-server-tester"
title: "MCP Server Tester"
description: "Test an MCP server end to end. First detect its protocol era (stateless 2026-07-28, or a session-based 2025-era server with the initialize handshake), then drive it with the MCP Inspector v2 CLI using --format json and exit codes: tools/list with --strict schema checks, one safe tools/call, and an error-path call that must come back as isError. Then write automated tests with the official v2 SDK clients for TypeScript or Python. Use after changing a server's tools, before connecting a server to a client, or when adding MCP tests to CI."
version: "1.0.0"
allowed-tools: "Read, Grep, Glob, Write, Edit, Bash"
user-invocable: true
color: "cyan"
date: 2026-11-12
topics: ["mcp", "review-qa"]
audience: ["developers", "ai-engineers"]
tags: ["claude", "mcp", "mcp-inspector", "testing", "ci", "developers"]
featured: false
related: ["command:test-mcp-server", "tool:mcp-inspector", "skill:mcp-server-scaffolder", "agent:mcp-server-engineer", "agent:mcp-security-reviewer", "skill:mcp-config-auditor", "guide:building-an-mcp-server", "guide:best-claude-skills-for-mcp-development", "glossary:model-context-protocol"]
seoDescription: "A Claude skill that tests an MCP server with the Inspector v2 CLI and the v2 SDK clients, covering stateless 2026-07-28 servers and older session-based ones."
summary: "This skill tests an MCP server the way a client will use it. It works out whether the server speaks the stateless 2026-07-28 protocol or the older session-based one, runs Inspector v2 CLI checks whose exit codes mean pass or fail (tool listing, strict schema checks, a safe call, an error-path call), and turns them into TypeScript or Python tests for CI."
---

The [Model Context Protocol](/glossary/model-context-protocol) changed shape in 2026. The current revision, `2026-07-28`, is stateless: it removes the `initialize` handshake, protocol sessions and the `Mcp-Session-Id` header, drops `ping` and `logging/setLevel`, and adds a `server/discover` method that every server must implement. Servers built on the 2025 revisions still use sessions. The [MCP Inspector](/tools/mcp-inspector) moved to v2 with a scriptable CLI and stable exit codes, and both official SDKs shipped v2 clients. This skill tests a server in that world: it works out which era the server speaks, runs a fixed set of Inspector CLI checks, and then turns the same checks into tests that run in CI.

## When to use this skill

- You renamed a tool, rewrote its description, or changed its input schema, and want proof the server still lists and runs it.
- Before connecting a server to Claude Code or handing it to teammates.
- A client says a tool "fails" and you need to know whether it is a tool error or a protocol error.
- The server has no automated tests, or its tests use the v1 SDK and you are moving to v2.

## When NOT to use this skill

- Starting a server from nothing: the [mcp-server-scaffolder](/skills/api/mcp-server-scaffolder) skill.
- Reviewing tool descriptions and results for injection risk: the [mcp-security-reviewer](/agents/quality-security/mcp-security-reviewer) agent.
- Auditing which servers a project's config enables: the [mcp-config-auditor](/skills/security/mcp-config-auditor) skill.
- A quick pass or fail from inside a session, with no test files written: the [/test-mcp-server](/commands/testing/test-mcp-server) command.

## Instructions

1. **Find how the server starts and which SDK it uses.** For stdio, find the launch command (`node build/index.js`, a `bin` entry, `uv run server.py`). For a remote server, get the URL. Then read the manifest or lockfile:

   | Signal | SDK line | Era to expect |
   | --- | --- | --- |
   | `@modelcontextprotocol/server` 2.x | TypeScript SDK v2 | implements the 2026-07-28 spec |
   | `@modelcontextprotocol/sdk` 1.x | TypeScript SDK v1 (legacy, still patched) | 2025-era sessions |
   | Python `mcp` 2.x, `from mcp.server import MCPServer` | Python SDK v2 | confirm with the probe in step 2 |
   | Python `mcp` 1.x, `from mcp.server.fastmcp import FastMCP` | Python SDK v1 (legacy) | 2025-era sessions |

   Inspector v2 needs Node `^22.23.4 || ^24.22.1 || >=26.12.1`. Check `node --version` first; an older Node fails before any test runs.

2. **Detect the protocol era on the wire.** The Inspector's `initialize` method is a connect-only probe that returns `serverInfo`, `protocolVersion`, `capabilities`, and `instructions`:

   ```bash
   npx @modelcontextprotocol/inspector --cli node build/index.js --method initialize --format json \
     | jq '.result | {protocolVersion, serverInfo, capabilities}'
   ```

   `2026-07-28` means the stateless era. `2025-11-25`, `2025-06-18`, `2025-03-26`, or `2024-11-05` means the session-based era. If the probe and the code disagree, or the server is meant to serve both eras, pin each run with `--protocol-era modern` and again with `--protocol-era legacy` (`auto` is the third value) and test both. Record the era next to every result. What changes between them:

   | Behavior | 2026-07-28 (stateless) | 2025-era (sessions) |
   | --- | --- | --- |
   | Handshake | none; `server/discover` advertises versions, capabilities, and identity | `initialize`, then `notifications/initialized` |
   | Sessions | none; no `Mcp-Session-Id` header | `Mcp-Session-Id` on Streamable HTTP |
   | `ping`, `logging/setLevel` | removed: do not test them | present |
   | Resource not found | error `-32602` | error `-32002` |
   | `tools/list` order | servers SHOULD return a deterministic order | no rule |
   | Results | every result carries a required `resultType` field | no such field |

3. **List the tools and check the schemas.** The mode flag (`--cli`) must come first, right after the package name:

   ```bash
   npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/list --format json > tools.json; rc=$?
   echo "exit=$rc"
   jq -r '.result.tools[] | [.name, (.description // "MISSING")] | @tsv' tools.json
   jq -e '.result.tools | map(.name) | index("get_temp")' tools.json   # non-zero exit if absent
   npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/list --strict
   ```

   `--strict` reports tool-schema portability problems (path, issue, suggested fix) on stderr and exits `6` if any is error-severity; without it you get a one-line count. Then review each tool by hand: the name matches what clients expect, the description says when to use the tool, every argument the handler needs is in the schema's `required` list, and enum values match what the handler accepts. On a 2026-07-28 server, run `tools/list` twice and compare the name order; a difference is a warning against the spec's SHOULD.

   For a remote server, the transport is inferred from a URL path ending in `/mcp` or `/sse`; any other path needs `--transport http` or `--transport sse`, because there is no default:

   ```bash
   npx @modelcontextprotocol/inspector --cli https://mcp.example.com/mcp --method tools/list --format json
   npx @modelcontextprotocol/inspector --cli https://mcp.example.com/api --transport http \
     --method tools/list --header "X-API-Key: $MCP_TEST_KEY" --stored-auth-only
   ```

   `--stored-auth-only` never starts interactive OAuth, so it is the safe choice in CI. A stdio server that needs environment variables gets them with `-e KEY=value` (repeatable).

4. **Happy path: call one safe tool.** Pick a tool that is safe to call repeatedly: read-only, idempotent, and cheap. Never call a tool that sends, deletes, pays, or writes to real data; if every tool has side effects, run against a test instance or ask the user.

   ```bash
   npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/call \
     --tool-name get_temp --tool-args-json '{"city":"Paris","units":"C"}' --format json > call.json; rc=$?
   [ "$rc" -eq 0 ] && jq -e '.result.isError != true and (.result.content | length > 0)' call.json
   ```

   `--tool-arg key=value` is repeatable and JSON-parses values (`count=1` becomes a number); `--tool-args-json` passes the object verbatim. The two are mutually exclusive, so use `--tool-args-json` when types matter. If the tool returns `structuredContent`, check its fields as well.

5. **Error path: the failure must come back inside the result.** Call the same tool with arguments its schema rejects, such as a missing required field:

   ```bash
   npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/call \
     --tool-name get_temp --tool-args-json '{"units":"C"}' --format json > bad.json; rc=$?
   echo "exit=$rc"    # expect 5
   jq '.result.isError, .result.content' bad.json
   ```

   Expect exit `5` with `isError: true` and a message a model could act on. The spec says errors that originate from the tool, including invalid arguments, belong inside the result with `isError` set, "not as an MCP protocol-level error response. Otherwise, the LLM would not be able to see that an error occurred and self-correct." Any other non-zero exit means the call did not come back as a tool result; read the error envelope on stderr and report it as a finding. Then call a tool name that does not exist. The spec treats an unknown tool as a protocol error; the TypeScript SDK's `McpServer` returns that JSON-RPC error, while the Python SDK's `MCPServer` returns an `isError` result. The Inspector exits `5` for a tool that was not found, so accept both shapes.

   Capture exit codes with `rc=$?`, not `status=$?`: in zsh `status` is a read-only variable and the assignment fails.

6. **Resources and prompts, if the server advertises them.** Check `capabilities` from step 2, then run `--method resources/list`, `--method resources/read --uri <uri>`, `--method prompts/list`, and `--method prompts/get --prompt-name <name> --prompt-args key=value`. Read a URI that does not exist and check the error on stderr: `-32602` is correct for a 2026-07-28 server, and `-32002` was the 2025-era code. A 2026-07-28 server still returning `-32002` is a finding.

7. **Read the exit code before the output.**

   | Exit | Meaning |
   | --- | --- |
   | 0 | success |
   | 1 | usage or unexpected error |
   | 3 | auth failed or required |
   | 4 | server unreachable |
   | 5 | tool error: `tools/call` returned `isError: true`, or the tool was not found |
   | 6 | `--strict` found an error-severity schema problem |
   | 11 | rate limited (HTTP 429) |
   | 12 | OAuth destination guard refusal |
   | 130 | a `--load` run interrupted (Ctrl+C or SIGTERM) |

   Codes 2, 7 to 9, and 10 belong to `--app-info`, `--verify`, and `--load`. On any non-zero exit the CLI also writes one JSON line to stderr, the error envelope `{"error":{"code":…,"message":…}}`.

8. **Write automated tests with the v2 SDK clients.** TypeScript servers built on `@modelcontextprotocol/server` can be tested in-process: `createMcpHandler` serves requests through `handler.fetch`, which is the in-process path for 2026-07-28 coverage (`InMemoryTransport.createLinkedPair()` connects 2025-era instances only):

   ```ts
   // test/mcp.test.ts: node:test with node:assert; swap in your runner's expect if you prefer
   import { test, after } from 'node:test';
   import assert from 'node:assert/strict';
   import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
   import { createMcpHandler } from '@modelcontextprotocol/server';
   import { createServer } from '../src/server.js'; // the factory you deploy

   const handler = createMcpHandler(createServer);
   const client = new Client({ name: 'test-harness', version: '1.0.0' }, { versionNegotiation: { mode: 'auto' } });
   await client.connect(new StreamableHTTPClientTransport(new URL('http://test.local/mcp'), {
     fetch: (url, init) => handler.fetch(new Request(url, init)),
   }));
   after(async () => { await client.close(); await handler.close(); });

   test('tools/list exposes get_temp with a required city', async () => {
     const { tools } = await client.listTools();
     const tool = tools.find((t) => t.name === 'get_temp');
     assert.ok(tool?.description);
     assert.deepEqual(tool.inputSchema.required, ['city']);
   });

   test('happy path returns a result, not an error', async () => {
     const result = await client.callTool({ name: 'get_temp', arguments: { city: 'Paris', units: 'C' } });
     assert.notEqual(result.isError, true);
   });

   test('schema-rejected arguments come back as isError, not a throw', async () => {
     const failed = await client.callTool({ name: 'get_temp', arguments: { units: 'C' } });
     assert.equal(failed.isError, true);
   });
   ```

   To test the built binary instead, connect over stdio with `StdioClientTransport` from `@modelcontextprotocol/client/stdio`: `await client.connect(new StdioClientTransport({ command: 'node', args: ['dist/server.js'] }))`.

   Python servers on `mcp` 2.x connect in-process by passing the server object to `Client`:

   ```python
   # tests/test_mcp.py  (uv add --dev pytest)
   import pytest
   from mcp import Client

   from server import mcp  # your MCPServer instance


   @pytest.fixture
   def anyio_backend():
       return "asyncio"


   @pytest.fixture
   async def client():
       async with Client(mcp, raise_exceptions=True) as c:
           yield c


   @pytest.mark.anyio
   async def test_lists_get_temp(client: Client):
       tools = (await client.list_tools()).tools
       tool = next(t for t in tools if t.name == "get_temp")
       assert tool.description
       assert tool.input_schema["required"] == ["city"]


   @pytest.mark.anyio
   async def test_happy_path(client: Client):
       result = await client.call_tool("get_temp", {"city": "Paris", "units": "C"})
       assert not result.is_error


   @pytest.mark.anyio
   async def test_bad_arguments_and_unknown_tool_return_is_error(client: Client):
       assert (await client.call_tool("get_temp", {"units": "C"})).is_error
       assert (await client.call_tool("does_not_exist", {})).is_error
   ```

   A tool that raises comes back as a result with `is_error=True`; a `Client` method raises `MCPError` only when the server answers with a JSON-RPC error. `Client(mcp)` is era-neutral in-process. Against a running server, `Client("http://localhost:8000/mcp")` uses the default `mode="auto"`, which probes `server/discover` and falls back to the initialize handshake; pass `mode="2026-07-28"` or `mode="legacy"` to test one era on purpose, and drop `raise_exceptions=True` when you pin `legacy`.

   **Legacy v1 code, labelled as such.** Repos still pinned to `@modelcontextprotocol/sdk` 1.x (patched for at least six months after the v2 release on 2026-07-27) use the old import paths. Keep them only until you migrate:

   ```ts
   // LEGACY v1 API (@modelcontextprotocol/sdk 1.x). New tests use @modelcontextprotocol/client.
   import { Client } from '@modelcontextprotocol/sdk/client/index.js';
   import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
   const transport = new StdioClientTransport({ command: 'node', args: ['build/index.js'] });
   const client = new Client({ name: 'my-client', version: '1.0.0' });
   await client.connect(transport);
   ```

   In Python, v1 tests built on `ClientSession` with `stdio_client`, or on `mcp.server.fastmcp`, are legacy too: v2 renamed `FastMCP` to `MCPServer` and removed `streamablehttp_client` (use `streamable_http_client`).

9. **Gate CI on the exit codes.** A smoke script that fails the job on any unexpected code:

   ```bash
   #!/usr/bin/env bash
   # scripts/mcp-smoke.sh: run after the server is built
   set -u
   inspect() { npx -y @modelcontextprotocol/inspector --cli node build/index.js "$@" --format json; }

   inspect --method tools/list --strict > /dev/null || { echo "FAIL tools/list (exit $?)"; exit 1; }
   inspect --method tools/call --tool-name get_temp --tool-args-json '{"city":"Paris","units":"C"}' > /dev/null \
     || { echo "FAIL happy path (exit $?)"; exit 1; }
   inspect --method tools/call --tool-name get_temp --tool-args-json '{"units":"C"}' > /dev/null; rc=$?
   [ "$rc" -eq 5 ] || { echo "FAIL error path: expected exit 5, got $rc"; exit 1; }
   echo "MCP smoke checks passed"
   ```

> [!WARNING]
> Do not assert on `initialize`, `ping`, `logging/setLevel`, or `Mcp-Session-Id` for a 2026-07-28 server; those exist only in the 2025-era protocol. A test suite written against the old handshake passes against old servers and fails, or tests nothing, against current ones. Write down the era you tested.

> [!NOTE]
> The Inspector's `--protocol-era` flag sets which era an ad-hoc run negotiates. A server that claims to serve both eras needs both runs in CI, or one of them is untested.

## Output

The test report, the new or updated test files, and the smoke script. The report states the era, then one row per check:

```markdown
## MCP server test: weather-server (stdio: node build/index.js)
Era tested: 2026-07-28 (probe protocolVersion; @modelcontextprotocol/server 2.x)

| Check | Expected | Got | Verdict |
| --- | --- | --- | --- |
| tools/list --strict | exit 0, get_temp listed | exit 0, 3 tools | PASS |
| tools/list order (x2) | same order | same order | PASS |
| tools/call get_temp (valid) | exit 0, isError not true | exit 0 | PASS |
| tools/call get_temp (missing city) | exit 5, isError true | exit 1, error envelope on stderr | FAIL: tool error reported as a protocol error |
| tools/call does_not_exist | exit 5 | exit 5 | PASS |
| resources/read (missing URI) | -32602 | -32002 | FAIL: 2025-era error code |

Tests written: test/mcp.test.ts (3 tests, passing), scripts/mcp-smoke.sh
```

For the server-building side, the [mcp-server-engineer](/agents/developer-tools/mcp-server-engineer) agent and [Building an MCP server](/guides/advanced/building-an-mcp-server) cover the fixes these findings usually lead to; the [MCP development skills roundup](/guides/skills/best-claude-skills-for-mcp-development) shows where testing sits in the full build.
