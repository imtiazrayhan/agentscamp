/**
 * Phase 3b: split the 547-item `developers` bucket into three engineering
 * sub-paths (`ai-engineers`, `devops`, `security`).
 *
 * `ai-engineers` CARVES — those items leave `developers`, because a general
 * Claude Code user is not the reader for `chunking-strategy-optimizer` or
 * `voyage-ai`. `devops` and `security` OVERLAY — they are cross-cutting
 * concerns a working developer still wants on their own path.
 *
 * Every file already carries an inline `audience: [...]` line (the whole
 * library was backfilled — see scripts/backfill-audience.ts), so this rewrites
 * that single line in place rather than inserting one. Idempotent: re-running
 * produces no diff.
 *
 *   npx tsx scripts/tag-audience.ts --dry-run  # preview only
 *   npx tsx scripts/tag-audience.ts            # write
 */
import fs from "node:fs";
import path from "node:path";

const dryRun = process.argv.includes("--dry-run");
const ROOT = path.join(process.cwd(), "src", "content");

/** Every .md under a content directory, as paths relative to src/content. */
function dir(...rels: string[]): string[] {
  const out: string[] = [];
  for (const rel of rels) {
    const full = path.join(ROOT, rel);
    for (const name of fs.readdirSync(full)) {
      if (name.endsWith(".md") && name !== "README.md")
        out.push(path.join(rel, name));
    }
  }
  return out;
}

/** Named slugs inside one directory; throws if a slug is missing. */
function pick(rel: string, ...slugs: string[]): string[] {
  return slugs.map((slug) => {
    const p = path.join(rel, `${slug}.md`);
    if (!fs.existsSync(path.join(ROOT, p))) throw new Error(`no such file: ${p}`);
    return p;
  });
}

/** Tool pages whose `category:` frontmatter is one of the given values. */
function toolsIn(...categories: string[]): string[] {
  const set = new Set(categories);
  return dir("tools").filter((rel) => {
    const m = fs
      .readFileSync(path.join(ROOT, rel), "utf8")
      .match(/^category:\s*"?([\w-]+)"?/m);
    return m ? set.has(m[1]) : false;
  });
}

// --- glossary sets -------------------------------------------------------
// Deep ML / AI-infra vocabulary: an AI engineer's, not a general developer's.
const GLOSSARY_AI_ONLY = pick(
  "glossary",
  "attention-mechanism", "batch-inference", "cosine-similarity", "distillation",
  "dpo", "embedding-dimension", "eval-dataset", "flash-attention",
  "hybrid-search", "kv-cache", "llm-as-judge", "lora", "mixture-of-experts",
  "needle-in-a-haystack", "open-weights", "perplexity", "quantization",
  "reranking", "rlhf", "semantic-caching", "semantic-search",
  "small-language-model", "speculative-decoding", "synthetic-data",
  "test-time-compute", "tokenization", "top-k", "top-p", "transformer",
);
// General AI vocabulary a working developer still gets asked about.
const GLOSSARY_AI_SHARED = pick(
  "glossary",
  "agent-engineering", "agent-harness", "agent-memory", "agentic-ai",
  "chain-of-thought", "chunking", "context-engineering", "context-window",
  "embedding", "extended-thinking", "fine-tuning", "function-calling",
  "grounding", "guardrails", "inference", "llmops", "model-context-protocol",
  "model-routing", "prompt-caching", "prompt-template", "rag", "react-agent",
  "reasoning-model", "structured-output", "subagent", "tracing",
  "vector-database", "vision-language-model",
);

interface Rule {
  what: string;
  files: string[];
  add: string[];
  remove?: string[];
}

const RULES: Rule[] = [
  // --- ai-engineers: carve out of developers ----------------------------
  {
    what: "ai-engineers (carve): AI-building guides, agents, skills",
    files: [
      ...dir("guides/concepts", "guides/evaluation", "guides/mlops", "guides/vision", "guides/voice"),
      ...dir("agents/data-ai", "skills/data"),
    ],
    add: ["ai-engineers"],
    remove: ["developers"],
  },
  {
    what: "ai-engineers (carve): AI-infrastructure tool pages",
    files: toolsIn("sdk", "platform", "evaluation", "voice", "observability"),
    add: ["ai-engineers"],
    remove: ["developers"],
  },
  {
    what: "ai-engineers (carve): deep-ML glossary",
    files: GLOSSARY_AI_ONLY,
    add: ["ai-engineers"],
    remove: ["developers"],
  },

  // --- ai-engineers: overlay (stays on the developer path too) ----------
  {
    what: "ai-engineers (overlay): shared guides, coding-agent tools, glossary",
    files: [
      ...dir("guides/advanced", "guides/mcp", "guides/prompting", "guides/api"),
      ...toolsIn("agent"),
      ...GLOSSARY_AI_SHARED,
      ...pick("commands/scaffold", "scaffold-rag-pipeline", "scaffold-vllm-config", "add-streaming-endpoint", "add-human-approval"),
      ...pick("commands/review", "benchmark-rerankers", "red-team-llm"),
      ...pick("skills/workflow", "agent-memory-designer", "prompt-optimizer", "human-in-the-loop-gate"),
      ...pick("skills/performance", "prompt-cache-optimizer"),
      // startHere anchors + model selection live with the onboarding guides.
      ...pick("guides/getting-started", "ai-engineer-roadmap-2026", "getting-started-with-agents", "choosing-the-right-model"),
    ],
    add: ["ai-engineers"],
  },

  // --- devops: overlay only ---------------------------------------------
  {
    what: "devops (overlay)",
    files: [
      ...dir("agents/infrastructure-devops", "skills/observability", "skills/release", "guides/observability", "guides/performance"),
      ...pick("skills/performance", "cold-start-optimizer", "load-test-designer", "cache-policy-designer", "memory-leak-hunter", "flamegraph-analyzer"),
      ...pick("skills/workflow", "github-actions-optimizer", "devcontainer-designer", "dockerfile-optimizer", "monorepo-boundary-auditor"),
      ...pick("skills/security", "secret-scanner", "least-privilege-auditor"),
      ...pick("commands/scaffold", "scaffold-dockerfile", "scaffold-github-action"),
      ...pick("commands/workflow", "setup-claude-ci"),
      ...pick("guides/advanced", "claude-code-ci-github-actions", "sandboxing-ai-generated-code", "parallel-claude-code-worktrees"),
      ...pick("guides/testing", "contract-testing-microservices"),
      ...pick("tools", "e2b", "daytona", "vercel-sandbox", "modal", "langsmith", "langfuse", "helicone", "arize-phoenix", "agentops"),
      ...pick("glossary", "tracing", "llmops"),
    ],
    add: ["devops"],
  },

  // --- security: overlay only -------------------------------------------
  {
    what: "security (overlay)",
    files: [
      ...dir("guides/ai-safety", "skills/security"),
      ...pick("agents/quality-security", "security-auditor", "prompt-injection-auditor"),
      ...pick("guides/advanced", "sandboxing-ai-generated-code"),
      ...pick("guides/mcp", "govern-mcp-servers"),
      ...pick("commands/review", "security-scan", "red-team-llm"),
      ...pick("skills/workflow", "claude-settings-auditor"),
      ...pick("tools", "llm-guard", "nemo-guardrails"),
      ...pick("glossary", "prompt-injection", "jailbreak", "red-teaming", "guardrails", "constitutional-ai", "human-in-the-loop"),
    ],
    add: ["security"],
  },
];

// --- apply ---------------------------------------------------------------
const AUDIENCE_RE = /^audience:\s*\[(.*)\]\s*$/m;
/** Registry declaration order, so a rewritten line reads the same everywhere. */
const ORDER = ["developers", "ai-engineers", "devops", "security", "founders", "marketers", "designers", "analysts"];

const pending = new Map<string, { add: Set<string>; remove: Set<string> }>();
for (const rule of RULES) {
  for (const rel of rule.files) {
    const entry = pending.get(rel) ?? { add: new Set(), remove: new Set() };
    for (const role of rule.add) entry.add.add(role);
    for (const role of rule.remove ?? []) entry.remove.add(role);
    pending.set(rel, entry);
  }
}

let changed = 0;
const problems: string[] = [];
/** Final audience set per touched file, so --dry-run can project real counts. */
const projected = new Map<string, string[]>();

for (const [rel, { add, remove }] of pending) {
  const full = path.join(ROOT, rel);
  const raw = fs.readFileSync(full, "utf8");
  const m = raw.match(AUDIENCE_RE);
  if (!m) {
    problems.push(`no inline audience line: ${rel}`);
    continue;
  }
  const current = [...m[1].matchAll(/"([\w-]+)"/g)].map((x) => x[1]);
  // A role that is being ADDED by another rule is never removed by this one —
  // `sandboxing-ai-generated-code` is both devops and security, and a carve
  // must not strip a tag a later overlay just granted.
  const next = new Set(current.filter((r) => !remove.has(r) || add.has(r)));
  for (const role of add) next.add(role);

  const ordered = ORDER.filter((r) => next.has(r));
  const unknown = [...next].filter((r) => !ORDER.includes(r));
  if (unknown.length) problems.push(`unknown role(s) ${unknown} in ${rel}`);

  const line = `audience: [${ordered.map((r) => `"${r}"`).join(", ")}]`;
  projected.set(rel, ordered);
  if (line === m[0]) continue;

  if (!dryRun) fs.writeFileSync(full, raw.replace(AUDIENCE_RE, line));
  changed++;
  if (dryRun) console.log(`  ${rel}\n    ${m[0]}\n -> ${line}`);
}

// --- report --------------------------------------------------------------
function walk(d: string): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.name.endsWith(".md") && e.name !== "README.md") out.push(full);
  }
  return out;
}

const tally = new Map<string, number>();
for (const full of walk(ROOT)) {
  const rel = path.relative(ROOT, full);
  let roles = projected.get(rel);
  if (!roles) {
    const m = fs.readFileSync(full, "utf8").match(AUDIENCE_RE);
    if (!m) continue;
    roles = [...m[1].matchAll(/"([\w-]+)"/g)].map((x) => x[1]);
  }
  for (const role of roles) tally.set(role, (tally.get(role) ?? 0) + 1);
}

console.log(
  `\n${dryRun ? "[dry-run] " : ""}${changed} file(s) ${dryRun ? "would change" : "changed"} of ${pending.size} matched`,
);
console.log(`\nprojected per-role counts:`);
for (const role of ORDER) console.log(`  ${role.padEnd(14)} ${tally.get(role) ?? 0}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log("  " + p);
  process.exitCode = 1;
}
