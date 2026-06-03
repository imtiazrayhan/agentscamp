/** Client-safe label helpers (no fs). */

// Tokens that should render as known acronyms / casings rather than Titlecase.
const ACRONYMS: Record<string, string> = {
  api: "API",
  ai: "AI",
  ml: "ML",
  llm: "LLM",
  cli: "CLI",
  sdk: "SDK",
  ide: "IDE",
  mcp: "MCP",
  ui: "UI",
  ux: "UX",
  css: "CSS",
  html: "HTML",
  sql: "SQL",
  qa: "QA",
  dx: "DX",
  sre: "SRE",
  ci: "CI",
  cd: "CD",
  os: "OS",
  io: "IO",
  http: "HTTP",
  json: "JSON",
  yaml: "YAML",
  oauth: "OAuth",
  openapi: "OpenAPI",
  graphql: "GraphQL",
  iot: "IoT",
  devops: "DevOps",
  js: "JS",
  ts: "TS",
  pr: "PR",
  prs: "PRs",
};

/** Human-friendly date, e.g. "Jun 3, 2026". Pass an ISO yyyy-mm-dd string. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function titleCaseLabel(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(
      (w) =>
        ACRONYMS[w.toLowerCase()] ?? w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}
