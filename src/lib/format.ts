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
  graphql: "GraphQL",
  iot: "IoT",
  devops: "DevOps",
  js: "JS",
  ts: "TS",
  pr: "PR",
};

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
