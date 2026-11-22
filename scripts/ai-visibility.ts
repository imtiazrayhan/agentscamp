/**
 * AI answer tracker: does Claude / ChatGPT / Perplexity cite AgentsCamp?
 *
 * Asks each engine the reader questions in scripts/ai-visibility-questions.json
 * (web search on), then scores every answer deterministically — no LLM judging:
 *   mentioned  = "agentscamp" appears in the answer text
 *   cited      = a cited URL's host is agentscamp.com
 * Writes the raw run to docs/ai-visibility/<timestamp>.json (gitignored) and
 * prints per-engine counts, the AgentsCamp pages cited (the pages AI already
 * trusts), and the most-cited domains (where AI already looks).
 *
 *   npm run ai-visibility              # all questions, all engines with a key
 *   npm run ai-visibility -- --limit 2 # smoke run
 *
 * Keys come from .env.local: ANTHROPIC_API_KEY, OPENAI_API_KEY, PERPLEXITY_API_KEY.
 * An engine without a key is skipped (and says so). Exits 1 if any call failed
 * or no engine ran. API answers approximate, but are not identical to, what the
 * consumer apps (claude.ai, ChatGPT, Perplexity) show.
 */
import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

// Model choices, checked against each provider's docs on 2026-11-22.
const CLAUDE_MODEL = "claude-opus-5-5";
const OPENAI_MODEL = "gpt-6.2-astra"; // OpenAI's recommended model for the web_search tool
const PERPLEXITY_EFFORT = "fast"; // Agent API preset; the documented equivalent of `sonar`

const SITE_HOST = "agentscamp.com";
const OUT_DIR = path.join(process.cwd(), "docs", "ai-visibility");
const QUESTIONS_FILE = path.join(process.cwd(), "scripts", "ai-visibility-questions.json");

type Usage = { inputTokens: number; outputTokens: number; searches: number };
type Answer = { text: string; citedUrls: string[]; retrievedUrls: string[]; usage: Usage };
type Result = {
  engine: string;
  question: string;
  mentioned?: boolean;
  cited?: boolean;
  citedPages?: string[];
  citedUrls?: string[];
  retrievedUrls?: string[];
  usage?: Usage;
  answer?: string;
  error?: string;
};

/** Thrown for bad credentials: stops that engine instead of failing every question. */
class AuthError extends Error {}

if (fs.existsSync(".env.local")) process.loadEnvFile(".env.local");

const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg !== -1 ? Number(process.argv[limitArg + 1]) : Infinity;
const questions = (JSON.parse(fs.readFileSync(QUESTIONS_FILE, "utf8")) as string[]).slice(0, LIMIT);

const uniq = (xs: string[]) => [...new Set(xs)];
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};
const isSite = (url: string) => {
  const h = hostOf(url);
  return h === SITE_HOST || h.endsWith(`.${SITE_HOST}`);
};

// ---------- engines ----------

async function askClaude(question: string): Promise<Answer> {
  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: "user", content: question }];
  const content: Anthropic.Beta.BetaContentBlock[] = [];
  const usage: Usage = { inputTokens: 0, outputTokens: 0, searches: 0 };

  // Server-side web search can stop with pause_turn; resume by re-sending the turn.
  for (let turn = 0; turn < 4; turn++) {
    let res: Anthropic.Beta.BetaMessage;
    try {
      res = await client.beta.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }],
        messages,
      });
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
        throw new AuthError(e.message);
      }
      throw e;
    }
    content.push(...res.content);
    usage.inputTokens += res.usage.input_tokens;
    usage.outputTokens += res.usage.output_tokens;
    usage.searches += res.usage.server_tool_use?.web_search_requests ?? 0;

    if (res.stop_reason === "refusal") throw new Error(`refusal (${res.stop_details?.category ?? "no category"})`);
    if (res.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: res.content });
  }

  let text = "";
  const cited: string[] = [];
  const retrieved: string[] = [];
  for (const block of content) {
    if (block.type === "text") {
      text += block.text;
      for (const c of block.citations ?? []) {
        if (c.type === "web_search_result_location") cited.push(c.url);
      }
    } else if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
      // A list is results; an object is a server-tool error (no exception is raised).
      for (const r of block.content) retrieved.push(r.url);
    }
  }
  return { text, citedUrls: uniq(cited), retrievedUrls: uniq(retrieved), usage };
}

/**
 * OpenAI's Responses API and Perplexity's Agent API share one output shape:
 * `message` items whose output_text parts carry `url_citation` annotations.
 * Retrieved sources differ: OpenAI lists them on web_search_call.action.sources,
 * Perplexity in `search_results` items.
 */
type ResponsesOutput = {
  output?: Array<{
    type: string;
    content?: Array<{ type: string; text?: string; annotations?: Array<{ type: string; url?: string }> }>;
    action?: { sources?: Array<{ url?: string }> };
    results?: Array<{ url?: string }>;
  }>;
  usage?: { input_tokens?: number; output_tokens?: number };
};

async function postResponses(url: string, key: string, body: unknown): Promise<Answer> {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (res.status === 401 || res.status === 403) throw new AuthError(`HTTP ${res.status}: ${await res.text()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
  const json = (await res.json()) as ResponsesOutput;

  let text = "";
  const cited: string[] = [];
  const retrieved: string[] = [];
  let searches = 0;
  for (const item of json.output ?? []) {
    if (item.type === "message") {
      for (const part of item.content ?? []) {
        if (part.type !== "output_text") continue;
        text += part.text ?? "";
        for (const a of part.annotations ?? []) if (a.type === "url_citation" && a.url) cited.push(a.url);
      }
    } else if (item.type === "web_search_call") {
      searches++;
      for (const s of item.action?.sources ?? []) if (s.url) retrieved.push(s.url);
    } else if (item.type === "search_results") {
      searches++;
      for (const r of item.results ?? []) if (r.url) retrieved.push(r.url);
    }
  }
  const usage = {
    inputTokens: json.usage?.input_tokens ?? 0,
    outputTokens: json.usage?.output_tokens ?? 0,
    searches,
  };
  return { text, citedUrls: uniq(cited), retrievedUrls: uniq(retrieved), usage };
}

const askOpenAI = (question: string) =>
  postResponses("https://api.openai.com/v1/responses", process.env.OPENAI_API_KEY!, {
    model: OPENAI_MODEL,
    tools: [{ type: "web_search" }],
    include: ["web_search_call.action.sources"],
    input: question,
  });

const askPerplexity = (question: string) =>
  postResponses("https://api.perplexity.ai/v1/agent", process.env.PERPLEXITY_API_KEY!, {
    effort: PERPLEXITY_EFFORT,
    input: question,
  });

const engines = [
  { name: "claude", key: process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN, envVar: "ANTHROPIC_API_KEY", ask: askClaude },
  { name: "openai", key: process.env.OPENAI_API_KEY, envVar: "OPENAI_API_KEY", ask: askOpenAI },
  { name: "perplexity", key: process.env.PERPLEXITY_API_KEY, envVar: "PERPLEXITY_API_KEY", ask: askPerplexity },
];

// ---------- run ----------

async function runEngine(engine: (typeof engines)[number]): Promise<Result[]> {
  const results: Result[] = [];
  for (const question of questions) {
    try {
      const a = await engine.ask(question);
      const citedPages = a.citedUrls.filter(isSite);
      results.push({
        engine: engine.name,
        question,
        mentioned: /agentscamp/i.test(a.text),
        cited: citedPages.length > 0,
        citedPages,
        citedUrls: a.citedUrls,
        retrievedUrls: a.retrievedUrls,
        usage: a.usage,
        answer: a.text,
      });
      process.stdout.write(".");
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      results.push({ engine: engine.name, question, error });
      process.stdout.write("x");
      if (e instanceof AuthError) {
        console.error(`\n[${engine.name}] authentication failed — stopping this engine: ${error.slice(0, 200)}`);
        break;
      }
    }
  }
  return results;
}

function latestPreviousRun(): Result[] | null {
  if (!fs.existsSync(OUT_DIR)) return null;
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".json")).sort();
  if (!files.length) return null;
  const prev = JSON.parse(fs.readFileSync(path.join(OUT_DIR, files[files.length - 1]), "utf8"));
  return prev.results as Result[];
}

function counts(results: Result[], engine: string) {
  const ok = results.filter((r) => r.engine === engine && !r.error);
  return {
    n: ok.length,
    mentioned: ok.filter((r) => r.mentioned).length,
    cited: ok.filter((r) => r.cited).length,
    errors: results.filter((r) => r.engine === engine && r.error).length,
  };
}

async function main() {
  const active = engines.filter((e) => e.key);
  const skipped = engines.filter((e) => !e.key);
  for (const e of skipped) console.warn(`[${e.name}] SKIPPED — ${e.envVar} is not set (.env.local).`);
  if (!active.length) {
    console.error("No engine has a key. Nothing measured.");
    process.exit(1);
  }

  console.log(`Asking ${questions.length} question(s) to: ${active.map((e) => e.name).join(", ")}`);
  const previous = latestPreviousRun();
  const results = (await Promise.all(active.map(runEngine))).flat();
  console.log("\n");

  const runAt = new Date().toISOString();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outFile = path.join(OUT_DIR, `${runAt.slice(0, 16).replace(":", "-")}.json`);
  fs.writeFileSync(
    outFile,
    JSON.stringify(
      { runAt, models: { claude: CLAUDE_MODEL, openai: OPENAI_MODEL, perplexity: PERPLEXITY_EFFORT }, questions, results },
      null,
      2,
    ),
  );

  console.log("Engine       mentioned   cited      errors   tokens in/out      searches   (previous run)");
  for (const e of active) {
    const c = counts(results, e.name);
    const mine = results.filter((r) => r.engine === e.name && r.usage);
    const sum = (k: keyof Usage) => mine.reduce((s, r) => s + (r.usage?.[k] ?? 0), 0);
    const p = previous ? counts(previous, e.name) : null;
    const prev = p && p.n ? `mentioned ${p.mentioned}/${p.n}, cited ${p.cited}/${p.n}` : "—";
    console.log(
      `${e.name.padEnd(12)} ${`${c.mentioned}/${c.n}`.padEnd(11)} ${`${c.cited}/${c.n}`.padEnd(10)} ${String(c.errors).padEnd(8)} ${`${sum("inputTokens")}/${sum("outputTokens")}`.padEnd(18)} ${String(sum("searches")).padEnd(10)} ${prev}`,
    );
  }

  const pages = new Map<string, number>();
  const domains = new Map<string, number>();
  for (const r of results) {
    for (const u of r.citedPages ?? []) pages.set(u, (pages.get(u) ?? 0) + 1);
    for (const h of uniq((r.citedUrls ?? []).map(hostOf).filter(Boolean))) domains.set(h, (domains.get(h) ?? 0) + 1);
  }
  const byCount = (m: Map<string, number>) => [...m].sort((a, b) => b[1] - a[1]);

  console.log("\nAgentsCamp pages cited (pages AI already trusts):");
  if (!pages.size) console.log("  none");
  for (const [u, n] of byCount(pages)) console.log(`  ${n}×  ${u}`);

  console.log("\nMost-cited domains across all answers (where AI already looks):");
  for (const [h, n] of byCount(domains).slice(0, 15)) console.log(`  ${String(n).padStart(3)}  ${h}`);

  console.log(`\nWrote ${path.relative(process.cwd(), outFile)}`);
  const errors = results.filter((r) => r.error).length;
  if (errors) {
    console.error(`${errors} call(s) failed — see "error" entries in the run file.`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
