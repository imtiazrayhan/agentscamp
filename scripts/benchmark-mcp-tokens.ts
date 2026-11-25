/**
 * Reproducible MCP Server Context-Token Overhead Benchmark.
 *
 * Connects to each real MCP server over stdio (npx/uvx) or Streamable HTTP,
 * performs the standard JSON-RPC 2.0 `initialize` -> `tools/list` handshake,
 * and measures exact tool counts, JSON payload bytes, and BPE token counts
 * (`o200k_base` and `cl100k_base` via Python `tiktoken`).
 *
 * Usage:
 *   npx tsx scripts/benchmark-mcp-tokens.ts
 */
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

interface McpTool {
  name: string;
  description?: string;
  inputSchema?: unknown;
}

interface ServerSpec {
  id: string;
  name: string;
  toolSlug?: string;
  category: string;
  transport: "stdio" | "http";
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  notes?: string;
}

interface BenchmarkRow {
  id: string;
  name: string;
  toolSlug?: string;
  category: string;
  transport: "stdio" | "http";
  serverName: string;
  serverVersion: string;
  toolCount: number;
  jsonBytes: number;
  o200kTokens: number;
  cl100kTokens: number;
  avgO200kPerTool: number;
  pctOf200k: number;
  largestTool: { name: string; o200kTokens: number };
  tools: { name: string; o200kTokens: number; bytes: number }[];
  notes?: string;
}

const SERVERS: ServerSpec[] = [
  {
    id: "playwright-mcp",
    name: "Playwright MCP",
    toolSlug: "playwright-mcp",
    category: "Browser Automation",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@playwright/mcp@latest"],
  },
  {
    id: "chrome-devtools-mcp",
    name: "Chrome DevTools MCP",
    toolSlug: "chrome-devtools-mcp",
    category: "Browser Automation",
    transport: "stdio",
    command: "npx",
    args: ["-y", "chrome-devtools-mcp@latest"],
  },
  {
    id: "desktop-commander",
    name: "Desktop Commander MCP",
    toolSlug: "desktop-commander",
    category: "Local System & Files",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@wonderwhy-er/desktop-commander@latest"],
  },
  {
    id: "context7",
    name: "Context7",
    toolSlug: "context7",
    category: "Docs & Code Context",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@upstash/context7-mcp@latest"],
  },
  {
    id: "repomix",
    name: "Repomix MCP",
    toolSlug: "repomix",
    category: "Docs & Code Context",
    transport: "stdio",
    command: "npx",
    args: ["-y", "repomix@latest", "--mcp"],
  },
  {
    id: "sequential-thinking-mcp",
    name: "Sequential Thinking MCP",
    toolSlug: "sequential-thinking-mcp",
    category: "Reasoning & Memory",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
  },
  {
    id: "filesystem-mcp",
    name: "Filesystem MCP (Reference)",
    category: "Local System & Files",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"],
  },
  {
    id: "memory-mcp",
    name: "Memory MCP (Reference)",
    category: "Reasoning & Memory",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-memory"],
  },
  {
    id: "github-mcp-reference",
    name: "GitHub MCP (npm reference)",
    toolSlug: "github-mcp-server",
    category: "Git & Code Hosting",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN:
        process.env.BENCH_GITHUB_TOKEN ?? "benchmark-placeholder-token",
    },
    notes: "Legacy @modelcontextprotocol/server-github npm package (26 tools); Go server exposes more depending on enabled toolsets.",
  },
  {
    id: "supabase-mcp",
    name: "Supabase MCP",
    toolSlug: "supabase-mcp",
    category: "Databases & Backend",
    transport: "stdio",
    command: "npx",
    args: [
      "-y",
      "@supabase/mcp-server-supabase@latest",
      `--access-token=${process.env.BENCH_SUPABASE_TOKEN ?? "benchmark-placeholder-token"}`,
    ],
  },
  {
    id: "ref-tools",
    name: "Ref Context MCP",
    toolSlug: "ref-tools",
    category: "Docs & Code Context",
    transport: "stdio",
    command: "npx",
    args: ["-y", "ref-tools-mcp@latest"],
    env: { REF_API_KEY: "benchmark_placeholder" },
  },
  {
    id: "claude-context",
    name: "Claude Context (Zilliz)",
    toolSlug: "claude-context",
    category: "Docs & Code Context",
    transport: "stdio",
    command: "npx",
    args: ["-y", "@zilliz/claude-context-mcp@latest"],
  },
  {
    id: "fetch-mcp",
    name: "Fetch MCP (Reference)",
    category: "Web & Search",
    transport: "stdio",
    command: "uvx",
    args: ["mcp-server-fetch"],
  },
  {
    id: "git-mcp-reference",
    name: "Git MCP (Reference)",
    category: "Git & Code Hosting",
    transport: "stdio",
    command: "uvx",
    args: ["mcp-server-git", "--repository", process.cwd()],
  },
  {
    id: "deepwiki-mcp",
    name: "DeepWiki MCP",
    toolSlug: "deepwiki-mcp",
    category: "Docs & Code Context",
    transport: "http",
    url: "https://mcp.deepwiki.com/mcp",
  },
  {
    id: "gitmcp",
    name: "GitMCP (generic /docs)",
    toolSlug: "gitmcp",
    category: "Docs & Code Context",
    transport: "http",
    url: "https://gitmcp.io/docs",
  },
  {
    id: "cloudflare-docs-mcp",
    name: "Cloudflare Docs MCP",
    toolSlug: "cloudflare-mcp",
    category: "Docs & Code Context",
    transport: "http",
    url: "https://docs.mcp.cloudflare.com/mcp",
  },
  {
    id: "exa-mcp",
    name: "Exa MCP",
    toolSlug: "exa",
    category: "Web & Search",
    transport: "http",
    url: "https://mcp.exa.ai/mcp",
  },
];

const TIMEOUT_MS = 45_000;

async function probeStdio(spec: ServerSpec): Promise<{
  serverName: string;
  serverVersion: string;
  tools: McpTool[];
}> {
  return new Promise((resolve, reject) => {
    const child = spawn(spec.command!, spec.args ?? [], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ...(spec.env ?? {}) },
    });

    let buf = "";
    let stderr = "";
    let stage: "init" | "list" | "done" = "init";
    let serverName = spec.name;
    let serverVersion = "unknown";
    const allTools: McpTool[] = [];
    let nextId = 2;

    const cleanup = () => {
      clearTimeout(timer);
      try {
        child.kill("SIGTERM");
        setTimeout(() => {
          try {
            child.kill("SIGKILL");
          } catch {}
        }, 500);
      } catch {}
    };

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`timeout after ${TIMEOUT_MS}ms (stage=${stage}). stderr=${stderr.slice(-300)}`));
    }, TIMEOUT_MS);

    child.on("error", (e) => {
      cleanup();
      reject(e);
    });

    child.on("exit", (code) => {
      if (stage !== "done") {
        cleanup();
        reject(new Error(`exited code=${code} before tools/list. stderr=${stderr.slice(-300)}`));
      }
    });

    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    const send = (msg: unknown) => {
      child.stdin.write(JSON.stringify(msg) + "\n");
    };

    child.stdout.on("data", (chunk) => {
      buf += chunk.toString();
      let idx: number;
      while ((idx = buf.indexOf("\n")) !== -1) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);
        if (!line || !line.startsWith("{")) continue;
        let msg: Record<string, unknown>;
        try {
          msg = JSON.parse(line);
        } catch {
          continue;
        }
        if (msg.id === 1 && stage === "init") {
          if (msg.error) {
            cleanup();
            reject(new Error(`init error: ${JSON.stringify(msg.error)}`));
            return;
          }
          const res = (msg.result ?? {}) as Record<string, unknown>;
          const info = (res.serverInfo ?? {}) as Record<string, string>;
          if (info.name) serverName = info.name;
          if (info.version) serverVersion = info.version;
          stage = "list";
          send({ jsonrpc: "2.0", method: "notifications/initialized" });
          send({ jsonrpc: "2.0", id: nextId, method: "tools/list", params: {} });
        } else if (msg.id === nextId && stage === "list") {
          if (msg.error) {
            cleanup();
            reject(new Error(`tools/list error: ${JSON.stringify(msg.error)}`));
            return;
          }
          const res = (msg.result ?? {}) as { tools?: McpTool[]; nextCursor?: string };
          if (Array.isArray(res.tools)) allTools.push(...res.tools);
          if (res.nextCursor) {
            nextId++;
            send({
              jsonrpc: "2.0",
              id: nextId,
              method: "tools/list",
              params: { cursor: res.nextCursor },
            });
          } else {
            stage = "done";
            cleanup();
            resolve({ serverName, serverVersion, tools: allTools });
            return;
          }
        }
      }
    });

    send({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "agentscamp-mcp-benchmark", version: "1.0.0" },
      },
    });
  });
}

function parseHttpRpcResponse(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);
  // SSE format: look for `data: {...}` lines
  const lines = trimmed.split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.startsWith("data:")) {
      const payload = line.slice(5).trim();
      if (payload.startsWith("{")) return JSON.parse(payload);
    }
  }
  throw new Error(`Unparseable HTTP MCP response: ${trimmed.slice(0, 200)}`);
}

async function probeHttp(spec: ServerSpec): Promise<{
  serverName: string;
  serverVersion: string;
  tools: McpTool[];
}> {
  const url = spec.url!;
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };

  const initRes = await fetch(url, {
    method: "POST",
    headers: baseHeaders,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "agentscamp-mcp-benchmark", version: "1.0.0" },
      },
    }),
  });
  if (!initRes.ok) {
    throw new Error(`HTTP ${initRes.status} on initialize`);
  }
  const sessionId = initRes.headers.get("mcp-session-id");
  const initMsg = parseHttpRpcResponse(await initRes.text());
  const initResult = (initMsg.result ?? {}) as Record<string, unknown>;
  const info = (initResult.serverInfo ?? {}) as Record<string, string>;
  const serverName = info.name ?? spec.name;
  const serverVersion = info.version ?? "unknown";

  const headers = sessionId ? { ...baseHeaders, "mcp-session-id": sessionId } : baseHeaders;
  await fetch(url, {
    method: "POST",
    headers,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
  }).catch(() => {});

  const allTools: McpTool[] = [];
  let cursor: string | undefined;
  let id = 2;
  for (let page = 0; page < 10; page++) {
    const listRes = await fetch(url, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: id++,
        method: "tools/list",
        params: cursor ? { cursor } : {},
      }),
    });
    if (!listRes.ok) throw new Error(`HTTP ${listRes.status} on tools/list`);
    const listMsg = parseHttpRpcResponse(await listRes.text());
    const res = (listMsg.result ?? {}) as { tools?: McpTool[]; nextCursor?: string };
    if (Array.isArray(res.tools)) allTools.push(...res.tools);
    if (!res.nextCursor) break;
    cursor = res.nextCursor;
  }

  return { serverName, serverVersion, tools: allTools };
}

/** Count exact o200k_base and cl100k_base BPE tokens for an array of strings via uvx + tiktoken. */
function countTokensBatch(strings: string[]): { o200k: number[]; cl100k: number[] } {
  const py = `
import json, sys, tiktoken
texts = json.loads(sys.stdin.read())
e200 = tiktoken.get_encoding("o200k_base")
e100 = tiktoken.get_encoding("cl100k_base")
out = {
  "o200k": [len(e200.encode(t, disallowed_special=())) for t in texts],
  "cl100k": [len(e100.encode(t, disallowed_special=())) for t in texts],
}
print(json.dumps(out))
`;
  const raw = execFileSync("uvx", ["--with", "tiktoken", "python3", "-c", py], {
    input: JSON.stringify(strings),
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  });
  return JSON.parse(raw);
}

async function main() {
  const measured: {
    spec: ServerSpec;
    serverName: string;
    serverVersion: string;
    tools: McpTool[];
  }[] = [];
  const failures: { id: string; error: string }[] = [];

  for (const spec of SERVERS) {
    process.stdout.write(`Probing ${spec.id} (${spec.transport})... `);
    try {
      const res = spec.transport === "http" ? await probeHttp(spec) : await probeStdio(spec);
      if (res.tools.length === 0) {
        console.log("0 tools (skipping)");
        failures.push({ id: spec.id, error: "returned 0 tools" });
        continue;
      }
      console.log(`OK — ${res.tools.length} tools (${res.serverName} v${res.serverVersion})`);
      measured.push({ spec, ...res });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`FAILED — ${msg.slice(0, 140)}`);
      failures.push({ id: spec.id, error: msg });
    }
  }

  // Batch-tokenize every server's full tool list + each individual tool schema.
  const strings: string[] = [];
  const serverIndices: number[] = [];
  const toolSlices: { start: number; count: number }[] = [];

  for (const m of measured) {
    // Normalize each tool to standard MCP tool definition fields sent to LLMs.
    const cleanTools = m.tools.map((t) => ({
      name: t.name,
      description: t.description ?? "",
      inputSchema: t.inputSchema ?? {},
    }));
    serverIndices.push(strings.length);
    strings.push(JSON.stringify(cleanTools));
    const start = strings.length;
    for (const ct of cleanTools) strings.push(JSON.stringify(ct));
    toolSlices.push({ start, count: cleanTools.length });
  }

  console.log(`\nTokenizing ${strings.length} payloads with tiktoken (o200k_base + cl100k_base)...`);
  const counts = countTokensBatch(strings);

  const rows: BenchmarkRow[] = measured.map((m, idx) => {
    const sIdx = serverIndices[idx];
    const slice = toolSlices[idx];
    const jsonStr = strings[sIdx];
    const o200kTokens = counts.o200k[sIdx];
    const cl100kTokens = counts.cl100k[sIdx];
    const perTool = m.tools.map((t, ti) => ({
      name: t.name,
      o200kTokens: counts.o200k[slice.start + ti],
      bytes: Buffer.byteLength(strings[slice.start + ti], "utf8"),
    }));
    const largest = [...perTool].sort((a, b) => b.o200kTokens - a.o200kTokens)[0];
    return {
      id: m.spec.id,
      name: m.spec.name,
      toolSlug: m.spec.toolSlug,
      category: m.spec.category,
      transport: m.spec.transport,
      serverName: m.serverName,
      serverVersion: m.serverVersion,
      toolCount: m.tools.length,
      jsonBytes: Buffer.byteLength(jsonStr, "utf8"),
      o200kTokens,
      cl100kTokens,
      avgO200kPerTool: Math.round(o200kTokens / m.tools.length),
      pctOf200k: Number(((o200kTokens / 200_000) * 100).toFixed(2)),
      largestTool: { name: largest.name, o200kTokens: largest.o200kTokens },
      tools: perTool.sort((a, b) => b.o200kTokens - a.o200kTokens),
      notes: m.spec.notes,
    };
  });

  rows.sort((a, b) => b.o200kTokens - a.o200kTokens);

  const outDir = path.join(process.cwd(), "docs", "benchmarks");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "mcp-token-overhead-2026-11.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        measuredAt: new Date().toISOString(),
        tokenizer: "tiktoken (o200k_base & cl100k_base)",
        contextWindowBaseline: 200_000,
        serverCount: rows.length,
        rows,
        failures,
      },
      null,
      2,
    ) + "\n",
  );

  console.log(`\nWrote ${outPath}\n`);
  console.log("| Server | Version | Tools | o200k Tokens | cl100k Tokens | Avg/Tool | % of 200K | Heaviest Tool |");
  console.log("| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |");
  for (const r of rows) {
    console.log(
      `| ${r.name} | ${r.serverVersion} | ${r.toolCount} | ${r.o200kTokens.toLocaleString()} | ${r.cl100kTokens.toLocaleString()} | ${r.avgO200kPerTool} | ${r.pctOf200k}% | \`${r.largestTool.name}\` (${r.largestTool.o200kTokens}) |`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
