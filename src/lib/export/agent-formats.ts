import type { AgentItem } from "@/lib/content/types";
import { site } from "@/lib/site";

/**
 * IMPORT-PURE module (no `fs`): safe for the client `InstallActions` dropdown AND
 * the server `/export` route. Transforms an already-loaded AgentItem into another
 * tool's REAL, ingestible config file.
 *
 * Anti-slop contract:
 *   - The system prompt (item.body) passes through VERBATIM. We never reshape or
 *     decompose it (which is why CrewAI role/goal/backstory is intentionally absent).
 *   - We only emit a format when a Claude Code subagent maps onto it deterministically.
 *   - Where a format can't carry the agent's tools/model, we say so in a frontmatter
 *     `#` comment (kept OUT of the prompt body) and label fidelity in the UI.
 *
 * Formats verified against official 2026 docs:
 *   copilot  → .github/agents/<slug>.agent.md   (code.visualstudio.com custom agents)
 *   cursor   → .cursor/rules/<slug>.mdc         (cursor.com/docs/rules)
 *   cline    → .clinerules/<slug>.md            (docs.cline.bot cline-rules)
 *   windsurf → .windsurf/rules/<slug>.md        (Windsurf/Devin Cascade rules)
 *   continue → .continue/rules/<slug>.md        (docs.continue.dev rules)
 */

export type AgentExportId =
  | "copilot"
  | "cursor"
  | "cline"
  | "windsurf"
  | "continue";

export interface AgentExportFormat {
  id: AgentExportId;
  label: string;
  /** Unique public URL suffix: `<href>.<routeExt>`. */
  routeExt: string;
  /** Suggested on-disk filename when downloaded. */
  saveAs: (slug: string) => string;
  /** Where the user drops the file (shown in the UI). */
  installPath: string;
  /** "full" = carries tools (Copilot); "rule" = prompt-only (rules systems). */
  fidelity: "full" | "rule";
  /** What this format can't carry, for the UI sub-label (rule formats only). */
  drops?: string;
  contentType: string;
  build: (item: AgentItem) => string;
}

const url = (item: AgentItem) => `${site.url}${item.href}`;

/** Double-quoted YAML scalar (a JSON string is a valid YAML flow scalar). */
const yamlStr = (v: string) => JSON.stringify(v);

// --- GitHub Copilot custom agent (.agent.md) — the one full-fidelity target ---
//
// Tool IDs are Copilot's namespaced toolset names (verified against
// code.visualstudio.com/docs/copilot/customization/custom-agents), NOT Claude
// Code's. Only confidently-corresponding toolsets are mapped; anything else is
// omitted and disclosed, never invented. `model` is intentionally dropped: it
// takes versioned strings ('Claude Opus 4.5') that don't map from our
// sonnet/opus/haiku enum and would age into a wrong assertion.
const COPILOT_TOOL_MAP: Record<string, string> = {
  Read: "search",
  Grep: "search",
  Glob: "search",
  Edit: "edit",
  Write: "edit",
  MultiEdit: "edit",
  NotebookEdit: "edit",
  WebFetch: "web/fetch",
};

function mapCopilotTools(tools?: string[]): {
  mapped: string[];
  unmapped: string[];
} {
  const mapped = new Set<string>();
  const unmapped: string[] = [];
  for (const t of tools ?? []) {
    const m = COPILOT_TOOL_MAP[t];
    if (m) mapped.add(m);
    else unmapped.push(t);
  }
  return { mapped: [...mapped], unmapped };
}

function buildCopilot(item: AgentItem): string {
  const { mapped, unmapped } = mapCopilotTools(item.tools);
  const fm: string[] = [
    "---",
    `name: ${yamlStr(item.slug)}`,
    `description: ${yamlStr(item.description)}`,
  ];
  if (mapped.length) {
    fm.push(`tools: [${mapped.map((t) => `'${t}'`).join(", ")}]`);
  }
  fm.push(`# Exported from AgentsCamp — ${url(item)}`);
  if (unmapped.length) {
    fm.push(
      `# Claude Code tools with no Copilot toolset equivalent (omitted): ${unmapped.join(", ")}`,
    );
  }
  fm.push("# Model not carried; Copilot uses your selected model.", "---", "");
  return fm.join("\n") + (item.body ?? "") + "\n";
}

// --- Rules systems: prompt-only. Provenance/fidelity notes go in frontmatter `#`
//     comments (or a leading HTML comment where there is no frontmatter) so the
//     prompt body stays verbatim. ---

function buildCursor(item: AgentItem): string {
  return (
    [
      "---",
      `description: ${yamlStr(item.description)}`,
      "alwaysApply: false",
      `# Exported from AgentsCamp — ${url(item)}. Cursor rules carry no tool or`,
      "# model scoping; this is the agent's system prompt as a rule.",
      "---",
      "",
    ].join("\n") +
    (item.body ?? "") +
    "\n"
  );
}

function buildContinue(item: AgentItem): string {
  return (
    [
      "---",
      `name: ${yamlStr(item.title)}`,
      `description: ${yamlStr(item.description)}`,
      "alwaysApply: false",
      `# Exported from AgentsCamp — ${url(item)}. Continue rules carry no tool/model scoping.`,
      "---",
      "",
    ].join("\n") +
    (item.body ?? "") +
    "\n"
  );
}

function buildWindsurf(item: AgentItem): string {
  const body = item.body ?? "";
  const fm = [
    "---",
    "trigger: model_decision",
    `description: ${yamlStr(item.description)}`,
    `# Exported from AgentsCamp — ${url(item)}. Windsurf rules carry no tool/model scoping.`,
  ];
  // Windsurf caps a single rule at ~12k chars — surface it, never truncate.
  // Count Unicode code points ([...body].length), not UTF-16 units (body.length),
  // so the reported number matches what "chars" means.
  const charCount = [...body].length;
  if (charCount > 12000) {
    fm.push(
      `# NOTE: ${charCount} chars exceeds Windsurf's ~12000-char per-rule limit; split if needed.`,
    );
  }
  fm.push("---", "");
  return fm.join("\n") + body + "\n";
}

function buildCline(item: AgentItem): string {
  return (
    `<!-- Exported from AgentsCamp — ${url(item)}. Cline rules carry no tool/model ` +
    `scoping; this is the agent's system prompt as a rule. -->\n\n` +
    (item.body ?? "") +
    "\n"
  );
}

export const AGENT_EXPORT_FORMATS: AgentExportFormat[] = [
  {
    id: "copilot",
    label: "GitHub Copilot",
    routeExt: "agent.md",
    saveAs: (s) => `${s}.agent.md`,
    installPath: ".github/agents/<slug>.agent.md",
    fidelity: "full",
    contentType: "text/markdown; charset=utf-8",
    build: buildCopilot,
  },
  {
    id: "cursor",
    label: "Cursor",
    routeExt: "cursor.mdc",
    saveAs: (s) => `${s}.mdc`,
    installPath: ".cursor/rules/<slug>.mdc",
    fidelity: "rule",
    drops: "tools, model",
    contentType: "text/markdown; charset=utf-8",
    build: buildCursor,
  },
  {
    id: "cline",
    label: "Cline",
    routeExt: "cline.md",
    saveAs: (s) => `${s}.cline.md`,
    installPath: ".clinerules/<slug>.md",
    fidelity: "rule",
    drops: "tools, model",
    contentType: "text/markdown; charset=utf-8",
    build: buildCline,
  },
  {
    id: "windsurf",
    label: "Windsurf",
    routeExt: "windsurf.md",
    saveAs: (s) => `${s}.windsurf.md`,
    installPath: ".windsurf/rules/<slug>.md",
    fidelity: "rule",
    drops: "tools, model",
    contentType: "text/markdown; charset=utf-8",
    build: buildWindsurf,
  },
  {
    id: "continue",
    label: "Continue",
    routeExt: "continue.md",
    saveAs: (s) => `${s}.continue.md`,
    installPath: ".continue/rules/<slug>.md",
    fidelity: "rule",
    drops: "tools, model",
    contentType: "text/markdown; charset=utf-8",
    build: buildContinue,
  },
];

export function getAgentExportFormat(
  id: string,
): AgentExportFormat | undefined {
  return AGENT_EXPORT_FORMATS.find((f) => f.id === id);
}
