export const site = {
  name: "AgentsCamp",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://agentscamp.com",
  tagline: "Your hub for everything AI",
  description:
    "A curated hub for everything AI — agents, skills, guides, tools, and commands for building with AI coding agents.",
  twitter: "@agentscamp",
  /** Square brand mark used for schema.org Organization.logo (served at /icon.svg). */
  logo: "/icon.svg",
  /** Authoritative profiles for schema.org `sameAs` (entity reconciliation / E-E-A-T). */
  sameAs: ["https://x.com/agentscamp"] as string[],
} as const;

export const locale = "en";

/**
 * AI-crawler policy, surfaced in robots.ts. AgentsCamp is an open hub whose moat
 * is distribution, and its audience is AI-agent builders — so we WELCOME both
 * retrieval/search bots (so AI answers can cite us) and training bots, and block
 * only the bad actor. Training ingestion is irreversible; this is a deliberate
 * product decision, not a reversible config tweak.
 */
export const aiCrawlers = {
  /** Live-retrieval / search assistants — allowing these earns answer-engine citations. */
  retrieval: [
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
    "Perplexity-User",
    "Claude-SearchBot",
    "Claude-User",
    "Google-Extended",
    "Applebot-Extended",
    "Amazonbot",
    "DuckAssistBot",
  ],
  /** Model-training crawlers — allowed for this open hub. */
  training: ["GPTBot", "ClaudeBot", "CCBot", "Meta-ExternalAgent", "cohere-ai"],
  /** Explicitly disallowed (aggressive / non-compliant scraper). */
  blocked: ["Bytespider"],
} as const;
