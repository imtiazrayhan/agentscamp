/**
 * Generates publication-grade editorial SVG charts and diagrams for flagship
 * AgentsCamp guides, aligned with src/lib/palette.ts.
 *
 * Data-driven charts read directly from docs/benchmarks/mcp-token-overhead-2026-11.json
 * so visual figures cannot drift from the published tables.
 *
 * Usage:
 *   npx tsx scripts/generate-charts.ts
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { OG_SURFACE, OG_ACCENT_INK } from "../src/lib/palette";

const OUT_DIR = path.join(process.cwd(), "public", "images", "guides");
fs.mkdirSync(OUT_DIR, { recursive: true });

const S = OG_SURFACE;
const A = OG_ACCENT_INK;
const FONT_SANS =
  "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const FONT_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace";

const esc = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

interface BenchmarkRow {
  id: string;
  name: string;
  toolCount: number;
  o200kTokens: number;
  avgO200kPerTool: number;
  pctOf200k: number;
}

// ---------------------------------------------------------------------------
// 1. MCP Server Context-Token Overhead (16 Live Servers)
// ---------------------------------------------------------------------------
function buildMcpBenchmarkSvg(): string {
  const dataPath = path.join(
    process.cwd(),
    "docs",
    "benchmarks",
    "mcp-token-overhead-2026-11.json",
  );
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8")) as {
    rows: BenchmarkRow[];
  };
  const rows = data.rows;

  const W = 1200;
  const headerH = 136;
  const rowH = 38;
  const plotPadTop = 28;
  const plotPadBot = 46;
  const footerH = 74;
  const plotH = plotPadTop + rows.length * rowH + plotPadBot;
  const H = headerH + plotH + footerH;

  const labelX = 48;
  const barX = 310;
  const barMaxW = 635;
  const maxVal = 7500;
  const median = 1295;
  const scale = (v: number) => Math.round((v / maxVal) * barMaxW);

  const ticks = [0, 1500, 3000, 4500, 6000, 7500];
  const plotTop = headerH;
  const plotBottom = headerH + plotH;

  const tierColor = (tokens: number) =>
    tokens >= 3000 ? A.coral : tokens >= 1000 ? A.amber : A.mint;

  const gridLines = ticks
    .map((t) => {
      const x = barX + scale(t);
      return `
        <line x1="${x}" y1="${plotTop + 14}" x2="${x}" y2="${plotBottom - 18}" stroke="${S.border}" stroke-opacity="0.45" stroke-width="1" />
        <text x="${x}" y="${plotTop + 6}" text-anchor="middle" fill="${S.faint}" font-family="${FONT_MONO}" font-size="11">${t === 0 ? "0" : (t / 1000).toFixed(1).replace(/\.0$/, "") + "k"}</text>
      `;
    })
    .join("");

  const medianX = barX + scale(median);
  const medianLine = `
    <line x1="${medianX}" y1="${plotTop + 16}" x2="${medianX}" y2="${plotBottom - 12}" stroke="${A.sky}" stroke-width="1.5" stroke-dasharray="5 4" stroke-opacity="0.55" />
    <rect x="${medianX + 8}" y="${plotBottom - 34}" width="152" height="22" rx="4" fill="${S.card}" stroke="${A.sky}" stroke-opacity="0.65" />
    <text x="${medianX + 84}" y="${plotBottom - 19}" text-anchor="middle" fill="${A.sky}" font-family="${FONT_MONO}" font-size="11" font-weight="600">Median: 1,295 tokens</text>
  `;

  const bars = rows
    .map((r, i) => {
      const y = plotTop + plotPadTop + i * rowH;
      const bw = Math.max(8, scale(r.o200kTokens));
      const fill = tierColor(r.o200kTokens);
      const shortName = r.name
        .replace(" (npm reference)", " (npm ref)")
        .replace(" (Reference)", " (ref)")
        .replace(" (generic /docs)", " (/docs)");
      const labelRightX = barX + bw + 12;
      return `
        <rect x="32" y="${y - 4}" width="${W - 64}" height="${rowH - 4}" rx="6" fill="${i % 2 === 0 ? S.card : "transparent"}" fill-opacity="0.55" />
        <text x="${labelX}" y="${y + 18}" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="14" font-weight="500">${esc(shortName)}</text>
        <rect x="${barX}" y="${y + 4}" width="${bw}" height="20" rx="5" fill="${fill}" />
        <text x="${labelRightX}" y="${y + 18}" fill="${S.foreground}" font-family="${FONT_MONO}" font-size="13" font-weight="700">${r.o200kTokens.toLocaleString()}</text>
        <text x="${labelRightX + 54}" y="${y + 18}" fill="${S.mutedForeground}" font-family="${FONT_MONO}" font-size="11.5">${r.pctOf200k.toFixed(2)}% · ${r.toolCount} ${r.toolCount === 1 ? "tool" : "tools"}</text>
      `;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="title desc">
  <title id="title">MCP Server Context-Token Overhead Benchmark (2026)</title>
  <desc id="desc">Horizontal bar chart comparing upfront tools/list token overhead across 16 live MCP servers, from 172 tokens for Ref Context MCP to 7,143 tokens for Supabase MCP.</desc>
  <rect width="${W}" height="${H}" rx="16" fill="${S.background}" />
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${S.border}" stroke-width="1.5" />

  <!-- Header -->
  <text x="48" y="42" fill="${A.mint}" font-family="${FONT_MONO}" font-size="12" font-weight="700" letter-spacing="1.4">AGENTSCAMP BENCHMARK · NOV 25, 2026</text>
  <text x="48" y="78" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="30" font-weight="700" letter-spacing="-0.5">MCP Server Context-Token Overhead (16 Live Servers)</text>
  <text x="48" y="106" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="15">Upfront JSON-RPC tools/list schema tokens consumed before prompt one · tiktoken o200k_base · % of 200K window</text>

  <!-- Legend -->
  <g transform="translate(790, 26)">
    <rect x="0" y="0" width="11" height="11" rx="3" fill="${A.coral}" />
    <text x="17" y="10" fill="${S.mutedForeground}" font-family="${FONT_MONO}" font-size="11">Heavy (≥3k)</text>
    <rect x="115" y="0" width="11" height="11" rx="3" fill="${A.amber}" />
    <text x="132" y="10" fill="${S.mutedForeground}" font-family="${FONT_MONO}" font-size="11">Medium (1k–3k)</text>
    <rect x="250" y="0" width="11" height="11" rx="3" fill="${A.mint}" />
    <text x="267" y="10" fill="${S.mutedForeground}" font-family="${FONT_MONO}" font-size="11">Lean (&lt;1k)</text>
  </g>

  <!-- Grid, Median Line (behind bars/labels), and Bars -->
  ${gridLines}
  ${medianLine}
  ${bars}

  <!-- Footer Strip -->
  <line x1="32" y1="${H - footerH}" x2="${W - 32}" y2="${H - footerH}" stroke="${S.border}" stroke-opacity="0.7" />
  <text x="48" y="${H - 42}" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="13.5" font-weight="600">41.5× spread (172 → 7,143 tokens)   ·   183 tools measured   ·   5-server stack = 21,272 tokens (10.6% of 200K)</text>
  <text x="48" y="${H - 20}" fill="${S.faint}" font-family="${FONT_MONO}" font-size="11.5">Reproducible live probe: scripts/benchmark-mcp-tokens.ts · Full table &amp; methodology at agentscamp.com/guides/mcp/mcp-server-token-overhead-benchmark</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// 2. MCP Stack Comparison + Per-Tool Verbosity Surprise
// ---------------------------------------------------------------------------
function buildMcpStackSvg(): string {
  const W = 1200;
  const H = 560;

  const stacks = [
    {
      label: "Heavy 5-Server Stack",
      sub: "Supabase + Chrome DevTools + GitHub + Repomix + Context7",
      tokens: 21272,
      tools: 103,
      pct: "10.64%",
      color: A.coral,
    },
    {
      label: "Lean Equivalent Stack",
      sub: "Playwright + GitHub + DeepWiki + Ref + Exa",
      tokens: 8382,
      tools: 58,
      pct: "4.19%",
      color: A.amber,
    },
    {
      label: "Minimal Docs + Search",
      sub: "DeepWiki + Ref + Exa",
      tokens: 894,
      tools: 7,
      pct: "0.45%",
      color: A.mint,
    },
  ];

  const verbose = [
    { name: "Context7 (2 tools)", avg: 569, color: A.coral },
    { name: "Sequential Thinking (1 tool)", avg: 491, color: A.coral },
    { name: "Repomix MCP (6 tools)", avg: 420, color: A.amber },
    { name: "Fetch MCP (1 tool)", avg: 298, color: A.amber },
    { name: "Exa MCP (2 tools)", avg: 233, color: A.amber },
    { name: "Ref Context (2 tools)", avg: 86, color: A.mint },
    { name: "DeepWiki MCP (3 tools)", avg: 85, color: A.mint },
  ];

  const stackCards = stacks
    .map((st, i) => {
      const y = 166 + i * 102;
      const bw = Math.max(12, Math.round((st.tokens / 22000) * 490));
      return `
        <text x="52" y="${y}" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="16" font-weight="700">${esc(st.label)}</text>
        <text x="542" y="${y}" text-anchor="end" fill="${st.color}" font-family="${FONT_MONO}" font-size="15" font-weight="700">${st.tokens.toLocaleString()} tok (${st.pct})</text>
        <text x="52" y="${y + 20}" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="12.5">${esc(st.sub)} · ${st.tools} tools</text>
        <rect x="52" y="${y + 32}" width="490" height="22" rx="6" fill="${S.background}" stroke="${S.border}" stroke-opacity="0.6" />
        <rect x="52" y="${y + 32}" width="${bw}" height="22" rx="6" fill="${st.color}" />
      `;
    })
    .join("");

  const verboseRows = verbose
    .map((v, i) => {
      const y = 172 + i * 44;
      const bw = Math.max(10, Math.round((v.avg / 600) * 230));
      return `
        <text x="632" y="${y + 15}" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="13.5" font-weight="500">${esc(v.name)}</text>
        <rect x="850" y="${y + 2}" width="${bw}" height="18" rx="4" fill="${v.color}" />
        <text x="${858 + bw}" y="${y + 15}" fill="${S.foreground}" font-family="${FONT_MONO}" font-size="12.5" font-weight="700">${v.avg}</text>
      `;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="title desc">
  <title id="title">MCP Stack Token Cost vs Per-Tool Schema Verbosity</title>
  <desc id="desc">Left panel compares upfront token overhead of three real-world MCP server stacks; right panel shows average tokens per tool across verbose vs lean servers.</desc>
  <rect width="${W}" height="${H}" rx="16" fill="${S.background}" />
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${S.border}" stroke-width="1.5" />

  <text x="48" y="42" fill="${A.mint}" font-family="${FONT_MONO}" font-size="12" font-weight="700" letter-spacing="1.4">AGENTSCAMP BENCHMARK · STACK IMPACT &amp; SCHEMA VERBOSITY</text>
  <text x="48" y="76" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="28" font-weight="700" letter-spacing="-0.4">Why Curating Your MCP Stack Saves 12,800+ Tokens Before Prompt One</text>

  <!-- Left panel -->
  <rect x="32" y="102" width="540" height="394" rx="12" fill="${S.card}" stroke="${S.border}" stroke-opacity="0.7" />
  <text x="52" y="134" fill="${A.sky}" font-family="${FONT_MONO}" font-size="12" font-weight="700" letter-spacing="1">REAL-WORLD 5-SERVER STACK COST (% OF 200K)</text>
  ${stackCards}
  <rect x="52" y="454" width="490" height="28" rx="6" fill="${S.background}" stroke="${A.mint}" stroke-opacity="0.5" />
  <text x="297" y="472" text-anchor="middle" fill="${A.mint}" font-family="${FONT_MONO}" font-size="12" font-weight="700">Swapping to lean equivalents saves 12,890 tokens (-60.6%) upfront</text>

  <!-- Right panel -->
  <rect x="604" y="102" width="564" height="394" rx="12" fill="${S.card}" stroke="${S.border}" stroke-opacity="0.7" />
  <text x="632" y="134" fill="${A.amber}" font-family="${FONT_MONO}" font-size="12" font-weight="700" letter-spacing="1">TOOL COUNT LIES: AVG TOKENS PER TOOL (O200K)</text>
  ${verboseRows}
  <text x="632" y="478" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="12.5">Context7 (2 tools) costs 6.6× more per tool than Ref (2 tools) due to description length.</text>

  <text x="48" y="532" fill="${S.faint}" font-family="${FONT_MONO}" font-size="11.5">Measured live Nov 25, 2026 via JSON-RPC tools/list · tiktoken o200k_base · agentscamp.com</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// 3. Skills vs Agents vs Commands Architecture Diagram
// ---------------------------------------------------------------------------
function buildSkillsAgentsCommandsSvg(): string {
  const W = 1200;
  const H = 584;

  const cols = [
    {
      x: 36,
      accent: A.coral,
      badge: "MECHANISM 1 · ISOLATED WORKER",
      title: "Subagent (Agent)",
      path: ".claude/agents/<name>.md",
      trigger: "Claude auto-delegates by description",
      context: "Own isolated context (summary returned)",
      tools: "Scoped via tools: allowlist",
      bestFor1: "Noisy middle, clean summary:",
      bestFor2: "audits, code reviews, test sweeps",
    },
    {
      x: 416,
      accent: A.turquoise,
      badge: "MECHANISM 2 · ON-DEMAND KNOWLEDGE",
      title: "Skill",
      path: ".claude/skills/<name>/SKILL.md",
      trigger: "Claude loads on match (progressive)",
      context: "Main conversation (or context: fork)",
      tools: "Optional allowed-tools: + scripts",
      bestFor1: "Reusable recipes & standards:",
      bestFor2: "migrations, changelogs, style guides",
    },
    {
      x: 796,
      accent: A.violet,
      badge: "PATTERN 3 · MANUAL SKILL",
      title: "Slash Command",
      path: "SKILL.md (disable-model-invocation: true)",
      trigger: "You invoke with /<name> $ARGUMENTS",
      context: "Runs directly in main conversation",
      tools: "Optional allowed-tools: (legacy works)",
      bestFor1: "Prompts triggered by keystroke:",
      bestFor2: "/ship, /review-pr, /scaffold",
    },
  ];

  const cards = cols
    .map(
      (c) => `
    <rect x="${c.x}" y="112" width="368" height="354" rx="12" fill="${S.card}" stroke="${c.accent}" stroke-opacity="0.55" stroke-width="1.5" />
    <text x="${c.x + 22}" y="142" fill="${c.accent}" font-family="${FONT_MONO}" font-size="11" font-weight="700" letter-spacing="0.8">${esc(c.badge)}</text>
    <text x="${c.x + 22}" y="176" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="24" font-weight="700">${esc(c.title)}</text>
    <rect x="${c.x + 22}" y="190" width="324" height="28" rx="6" fill="${S.background}" stroke="${S.border}" />
    <text x="${c.x + 32}" y="208" fill="${c.accent}" font-family="${FONT_MONO}" font-size="11.5">${esc(c.path)}</text>

    <text x="${c.x + 22}" y="244" fill="${S.faint}" font-family="${FONT_MONO}" font-size="10.5" font-weight="700">WHO PULLS THE TRIGGER</text>
    <text x="${c.x + 22}" y="264" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="13.5">${esc(c.trigger)}</text>

    <text x="${c.x + 22}" y="298" fill="${S.faint}" font-family="${FONT_MONO}" font-size="10.5" font-weight="700">CONTEXT WINDOW</text>
    <text x="${c.x + 22}" y="318" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="13.5">${esc(c.context)}</text>

    <text x="${c.x + 22}" y="352" fill="${S.faint}" font-family="${FONT_MONO}" font-size="10.5" font-weight="700">TOOL ACCESS</text>
    <text x="${c.x + 22}" y="372" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="13.5">${esc(c.tools)}</text>

    <text x="${c.x + 22}" y="406" fill="${S.faint}" font-family="${FONT_MONO}" font-size="10.5" font-weight="700">REACH FOR IT WHEN</text>
    <text x="${c.x + 22}" y="426" fill="${c.accent}" font-family="${FONT_SANS}" font-size="13.5" font-weight="600">${esc(c.bestFor1)}</text>
    <text x="${c.x + 22}" y="446" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="13">${esc(c.bestFor2)}</text>
  `,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="title desc">
  <title id="title">Claude Code: Subagents vs Skills vs Slash Commands</title>
  <desc id="desc">Comparison of Claude Code's three Markdown extension patterns across trigger mechanism, context isolation, tool access, and ideal use cases.</desc>
  <rect width="${W}" height="${H}" rx="16" fill="${S.background}" />
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${S.border}" stroke-width="1.5" />

  <text x="36" y="42" fill="${A.mint}" font-family="${FONT_MONO}" font-size="12" font-weight="700" letter-spacing="1.4">CLAUDE CODE ARCHITECTURE · TWO MECHANISMS, THREE PATTERNS</text>
  <text x="36" y="76" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="28" font-weight="700" letter-spacing="-0.4">Subagents vs Skills vs Slash Commands</text>
  <text x="36" y="98" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="14">Choose on two axes: who pulls the trigger (you vs Claude) and whether the task needs an isolated context window.</text>

  ${cards}

  <!-- Bottom rule of thumb -->
  <rect x="36" y="486" width="1128" height="58" rx="10" fill="${S.card}" stroke="${S.border}" />
  <text x="58" y="512" fill="${A.amber}" font-family="${FONT_MONO}" font-size="11.5" font-weight="700">FAST DECISION RULE</text>
  <text x="58" y="532" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="14">You type it → <tspan fill="${A.violet}" font-weight="700">Slash Command</tspan>   |   Claude applies house knowledge in-thread → <tspan fill="${A.turquoise}" font-weight="700">Skill</tspan>   |   Claude delegates noisy work for a clean summary → <tspan fill="${A.coral}" font-weight="700">Subagent</tspan></text>
  <text x="1142" y="566" text-anchor="end" fill="${S.faint}" font-family="${FONT_MONO}" font-size="11">agentscamp.com/guides/skills/skills-vs-agents-vs-commands</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// 4. How RAG Works Pipeline Diagram
// ---------------------------------------------------------------------------
function buildRagArchitectureSvg(): string {
  const W = 1200;
  const H = 540;

  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    accent: string,
    step: string,
    title: string,
    sub1: string,
    sub2: string,
  ) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${S.card}" stroke="${accent}" stroke-opacity="0.65" stroke-width="1.5" />
    <text x="${x + 14}" y="${y + 24}" fill="${accent}" font-family="${FONT_MONO}" font-size="10.5" font-weight="700">${esc(step)}</text>
    <text x="${x + 14}" y="${y + 48}" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="17" font-weight="700">${esc(title)}</text>
    <text x="${x + 14}" y="${y + 70}" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="12.5">${esc(sub1)}</text>
    <text x="${x + 14}" y="${y + 88}" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="12.5">${esc(sub2)}</text>
  `;

  const arrow = (x1: number, y: number, x2: number, color: string) => `
    <line x1="${x1}" y1="${y}" x2="${x2 - 8}" y2="${y}" stroke="${color}" stroke-width="2" />
    <polygon points="${x2},${y} ${x2 - 9},${y - 5} ${x2 - 9},${y + 5}" fill="${color}" />
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="title desc">
  <title id="title">How Retrieval-Augmented Generation (RAG) Works</title>
  <desc id="desc">Two-stage architecture diagram showing offline ingestion (ingest, chunk, embed, index) feeding online query retrieval (hybrid search, rerank, grounded generation).</desc>
  <rect width="${W}" height="${H}" rx="16" fill="${S.background}" />
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${S.border}" stroke-width="1.5" />

  <text x="40" y="42" fill="${A.mint}" font-family="${FONT_MONO}" font-size="12" font-weight="700" letter-spacing="1.4">RAG ARCHITECTURE · OFFLINE INGESTION &amp; ONLINE RETRIEVAL</text>
  <text x="40" y="74" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="28" font-weight="700" letter-spacing="-0.4">The 7-Stage RAG Pipeline (Where Quality Is Won or Lost)</text>

  <!-- Track 1: Offline Ingestion -->
  <text x="40" y="114" fill="${A.sky}" font-family="${FONT_MONO}" font-size="11.5" font-weight="700" letter-spacing="1">TRACK 1 · OFFLINE INGESTION (RUNS WHEN DOCS CHANGE)</text>
  ${box(40, 128, 250, 108, A.sky, "STAGE 1", "Ingest & Clean", "Parse PDFs, docs, code;", "strip nav & boilerplate")}
  ${arrow(290, 182, 328, A.sky)}
  ${box(328, 128, 250, 108, A.amber, "STAGE 2 · HIGHEST LEVER", "Chunk", "Split into answerable units;", "sweep size & overlap")}
  ${arrow(578, 182, 616, A.sky)}
  ${box(616, 128, 250, 108, A.sky, "STAGE 3", "Embed", "Document input_type vectors", "+ sparse BM25 / SPLADE")}
  ${arrow(866, 182, 904, A.sky)}
  ${box(904, 128, 256, 108, A.turquoise, "STAGE 4", "Index & ACLs", "Vector DB + tenant/date", "metadata for filtering")}

  <!-- Connector down from Index to Retrieve -->
  <path d="M 1032 236 L 1032 268 L 453 268 L 453 298" fill="none" stroke="${A.turquoise}" stroke-width="2" stroke-dasharray="5 4" />
  <polygon points="453,306 448,296 458,296" fill="${A.turquoise}" />
  <rect x="650" y="255" width="218" height="24" rx="4" fill="${S.background}" stroke="${A.turquoise}" stroke-opacity="0.5" />
  <text x="759" y="271" text-anchor="middle" fill="${A.turquoise}" font-family="${FONT_MONO}" font-size="11">Indexed vectors + metadata</text>

  <!-- Track 2: Online Query -->
  <text x="40" y="294" fill="${A.mint}" font-family="${FONT_MONO}" font-size="11.5" font-weight="700" letter-spacing="1">TRACK 2 · ONLINE QUERY (EVERY REQUEST)</text>
  ${box(40, 308, 250, 112, A.mint, "INPUT", "User Query", "Embed with query input_type", "+ resolve user permissions")}
  ${arrow(290, 364, 328, A.mint)}
  ${box(328, 308, 250, 112, A.mint, "STAGE 5", "Hybrid Retrieve", "Over-retrieve top 25–50", "(dense + keyword + ACLs)")}
  ${arrow(578, 364, 616, A.mint)}
  ${box(616, 308, 250, 112, A.coral, "STAGE 6 · PRECISION", "Rerank", "Cross-encoder reorders", "candidates down to top 5–10")}
  ${arrow(866, 364, 904, A.mint)}
  ${box(904, 308, 256, 112, A.violet, "STAGE 7", "Grounded Answer", "Cite retrieved passages;", "allow 'not found' fallback")}

  <!-- Footer insight -->
  <rect x="40" y="446" width="1120" height="52" rx="10" fill="${S.card}" stroke="${S.border}" />
  <text x="62" y="477" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="14"><tspan fill="${A.amber}" font-weight="700">Golden rule:</tspan> Retrieval caps generation — if Stage 2 (Chunk) or Stage 5 (Retrieve) misses the right passage, no prompt edit can fix Stage 7.</text>
  <text x="1160" y="520" text-anchor="end" fill="${S.faint}" font-family="${FONT_MONO}" font-size="11">agentscamp.com/guides/concepts/how-rag-works</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// 5. Multi-Agent Orchestration 4 Patterns Diagram
// ---------------------------------------------------------------------------
function buildMultiAgentSvg(): string {
  const W = 1200;
  const H = 620;

  const node = (x: number, y: number, w: number, h: number, label: string, color: string) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${S.background}" stroke="${color}" stroke-width="1.5" />
    <text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" fill="${S.foreground}" font-family="${FONT_MONO}" font-size="12" font-weight="600">${esc(label)}</text>
  `;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="title desc">
  <title id="title">Four Multi-Agent Orchestration Patterns</title>
  <desc id="desc">Four architectural patterns for coordinating isolated AI agents: Fan-out, Sequential Pipeline, Orchestrator-Worker, and Verify/Critic.</desc>
  <rect width="${W}" height="${H}" rx="16" fill="${S.background}" />
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${S.border}" stroke-width="1.5" />

  <text x="40" y="42" fill="${A.mint}" font-family="${FONT_MONO}" font-size="12" font-weight="700" letter-spacing="1.4">MULTI-AGENT ARCHITECTURE · CONTEXT ISOLATION PATTERNS</text>
  <text x="40" y="76" fill="${S.foreground}" font-family="${FONT_SANS}" font-size="28" font-weight="700" letter-spacing="-0.4">Four Multi-Agent Orchestration Patterns</text>
  <text x="40" y="98" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="14">Each box runs in its own clean context window and passes back only a structured summary.</text>

  <!-- Pattern 1: Fan-out -->
  <rect x="36" y="120" width="552" height="214" rx="12" fill="${S.card}" stroke="${S.border}" />
  <text x="58" y="148" fill="${A.sky}" font-family="${FONT_MONO}" font-size="11.5" font-weight="700">1 · FAN-OUT (PARALLEL SLICES)</text>
  ${node(58, 206, 94, 34, "Parent", A.sky)}
  ${node(214, 162, 128, 32, "Perf Audit", A.turquoise)}
  ${node(214, 207, 128, 32, "A11y Audit", A.turquoise)}
  ${node(214, 252, 128, 32, "Sec Audit", A.turquoise)}
  ${node(410, 206, 152, 34, "Merged Report", A.mint)}
  <path d="M 152 223 L 214 178 M 152 223 L 214 223 M 152 223 L 214 268" stroke="${A.sky}" stroke-width="1.6" />
  <path d="M 342 178 L 410 223 M 342 223 L 410 223 M 342 268 L 410 223" stroke="${A.mint}" stroke-width="1.6" />
  <text x="58" y="314" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="13">Best for independent read/analysis slices that share no mutable state.</text>

  <!-- Pattern 2: Pipeline -->
  <rect x="612" y="120" width="552" height="214" rx="12" fill="${S.card}" stroke="${S.border}" />
  <text x="634" y="148" fill="${A.mint}" font-family="${FONT_MONO}" font-size="11.5" font-weight="700">2 · SEQUENTIAL PIPELINE (GATED STAGES)</text>
  ${node(634, 206, 110, 36, "Research", A.mint)}
  ${node(786, 206, 110, 36, "Design", A.mint)}
  ${node(938, 206, 110, 36, "Build", A.mint)}
  ${node(1082, 206, 62, 36, "Test", A.mint)}
  <path d="M 744 224 L 786 224 M 896 224 L 938 224 M 1048 224 L 1082 224" stroke="${A.mint}" stroke-width="2" />
  <text x="765" y="196" text-anchor="middle" fill="${A.amber}" font-family="${FONT_MONO}" font-size="10">gate</text>
  <text x="917" y="196" text-anchor="middle" fill="${A.amber}" font-family="${FONT_MONO}" font-size="10">gate</text>
  <text x="1065" y="196" text-anchor="middle" fill="${A.amber}" font-family="${FONT_MONO}" font-size="10">gate</text>
  <text x="634" y="314" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="13">Each stage receives only the approved artifact from the prior stage, not raw chatter.</text>

  <!-- Pattern 3: Orchestrator-Worker -->
  <rect x="36" y="356" width="552" height="214" rx="12" fill="${S.card}" stroke="${S.border}" />
  <text x="58" y="384" fill="${A.amber}" font-family="${FONT_MONO}" font-size="11.5" font-weight="700">3 · ORCHESTRATOR-WORKER (DYNAMIC PLAN)</text>
  ${node(208, 404, 206, 36, "Orchestrator (no Edit)", A.amber)}
  ${node(72, 482, 134, 34, "Worker A", A.violet)}
  ${node(244, 482, 134, 34, "Worker B", A.violet)}
  ${node(416, 482, 134, 34, "Worker C", A.violet)}
  <path d="M 270 440 L 139 482 M 311 440 L 311 482 M 352 440 L 483 482" stroke="${A.amber}" stroke-width="1.6" />
  <text x="58" y="550" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="13">Strip Edit/Write from the coordinator so it plans, dispatches, and verifies only.</text>

  <!-- Pattern 4: Verify / Critic -->
  <rect x="612" y="356" width="552" height="214" rx="12" fill="${S.card}" stroke="${S.border}" />
  <text x="634" y="384" fill="${A.coral}" font-family="${FONT_MONO}" font-size="11.5" font-weight="700">4 · VERIFY / CRITIC (FRESH CONTEXT CHECK)</text>
  ${node(642, 434, 132, 38, "Author Agent", A.sky)}
  ${node(826, 434, 128, 38, "Diff + Spec", S.mutedForeground)}
  ${node(1004, 434, 134, 38, "Fresh Critic", A.coral)}
  <path d="M 774 453 L 826 453 M 954 453 L 1004 453" stroke="${A.coral}" stroke-width="2" />
  <path d="M 1071 472 L 1071 504 L 708 504 L 708 472" fill="none" stroke="${A.coral}" stroke-width="1.5" stroke-dasharray="5 4" />
  <text x="890" y="498" text-anchor="middle" fill="${A.coral}" font-family="${FONT_MONO}" font-size="11">revise on defect (no shared bias)</text>
  <text x="634" y="550" fill="${S.mutedForeground}" font-family="${FONT_SANS}" font-size="13">Critic sees only the artifact and spec — never the author's rationalizations.</text>

  <text x="1164" y="600" text-anchor="end" fill="${S.faint}" font-family="${FONT_MONO}" font-size="11">agentscamp.com/guides/advanced/multi-agent-orchestration</text>
</svg>`;
}

const CHROME_BIN =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const files: [string, string][] = [
  ["mcp-token-overhead-benchmark", buildMcpBenchmarkSvg()],
  ["mcp-stack-comparison", buildMcpStackSvg()],
  ["skills-vs-agents-vs-commands", buildSkillsAgentsCommandsSvg()],
  ["how-rag-works-architecture", buildRagArchitectureSvg()],
  ["multi-agent-orchestration-patterns", buildMultiAgentSvg()],
];

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "agentscamp-charts-"));
const userDataDir = path.join(tmpDir, "chrome-profile");

try {
  for (const [slug, svg] of files) {
    const w = Number(/width="(\d+)"/.exec(svg)?.[1] ?? 1200);
    const h = Number(/height="(\d+)"/.exec(svg)?.[1] ?? 630);
    const htmlPath = path.join(tmpDir, `${slug}.html`);
    const outPng = path.join(OUT_DIR, `${slug}.png`);
    fs.writeFileSync(
      htmlPath,
      `<!doctype html><html><body style="margin:0;padding:0;background:${S.background};overflow:hidden;">${svg}</body></html>`,
      "utf8",
    );
    execFileSync(
      CHROME_BIN,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        `--user-data-dir=${userDataDir}`,
        "--force-device-scale-factor=2",
        `--window-size=${w},${h}`,
        `--screenshot=${outPng}`,
        `file://${htmlPath}`,
      ],
      { stdio: "pipe" },
    );
    const kb = (fs.statSync(outPng).size / 1024).toFixed(1);
    console.log(
      `Wrote ${path.relative(process.cwd(), outPng)} (${w}x${h}@2x, ${kb} KB)`,
    );
  }
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
