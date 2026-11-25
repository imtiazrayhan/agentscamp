import type { ContentItem } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { titleCaseLabel } from "@/lib/format";
import { site } from "@/lib/site";

/**
 * IMPORT-PURE module (no `fs`): safe for client components AND server routes.
 * It must NEVER import from `@/lib/content/index` — it operates on already-loaded
 * items. Two outputs:
 *   - buildArtifact(item): the copy-paste/installable file (site-only keys stripped).
 *   - toMarkdownFile(item): the clean Markdown "twin" served at /<path>.md for
 *     LLMs/agents. For installable types this IS the artifact; for guides/tools
 *     it is a readable document.
 */

function yamlLine(key: string, value?: string | string[]): string | null {
  if (value == null) return null;
  const v = Array.isArray(value) ? value.join(", ") : value;
  if (!v) return null;
  return `${key}: ${JSON.stringify(v)}`;
}

/** Reconstruct the install-ready artifact file from a fixed key allowlist. */
export function buildArtifact(item: ContentItem): string | null {
  const lines: (string | null)[] = ["---"];
  if (item.type === "agent") {
    lines.push(
      yamlLine("name", item.slug),
      yamlLine("description", item.description),
      `model: ${item.model}`,
      item.color ? `color: ${item.color}` : null,
      yamlLine("tools", item.tools),
    );
  } else if (item.type === "skill") {
    lines.push(
      yamlLine("name", item.slug),
      yamlLine("description", item.description),
      yamlLine("allowed-tools", item.allowedTools),
      item.version ? `version: ${item.version}` : null,
    );
  } else if (item.type === "command") {
    lines.push(
      yamlLine("description", item.description),
      item.argumentHint ? yamlLine("argument-hint", item.argumentHint) : null,
      yamlLine("allowed-tools", item.allowedTools),
      item.model ? `model: ${item.model}` : null,
    );
  } else {
    return null;
  }
  lines.push("---", "", item.body ?? "");
  return lines.filter((l) => l !== null).join("\n");
}

/** Suggested on-disk filename for the installable artifact. */
export function artifactFilename(item: ContentItem): string {
  return item.type === "skill" ? `${item.slug}/SKILL.md` : `${item.slug}.md`;
}

/** The `npx agentscamp` install command for an installable item (agent/skill/command). */
export function cliInstallCommand(item: ContentItem): string {
  return `npx agentscamp add ${contentTypes[item.type].basePath.slice(1)}/${item.slug}`;
}

/** The canonical absolute HTML URL for an item. */
export function canonicalUrl(item: ContentItem): string {
  return `${site.url}${item.href}`;
}

/** The Markdown-twin URL (advertised via alternates + served by /raw). */
export function markdownUrl(item: ContentItem): string {
  return `${site.url}${item.href}.md`;
}

/**
 * Clean Markdown representation served at /<path>.md. Installable types return
 * their artifact verbatim (directly droppable into ~/.claude); guides/tools
 * return a readable doc. A trailing source line keeps the twin self-describing.
 */
export function toMarkdownFile(item: ContentItem): string {
  const source = `\n\n---\n\n_Source: ${canonicalUrl(item)} — ${contentTypes[item.type].singular} on ${site.name}._\n`;

  const artifact = buildArtifact(item);
  if (artifact) {
    const install = `_Install: \`${cliInstallCommand(item)}\` (project .claude/; add -g for ~/.claude/)._\n`;
    return artifact + source + install;
  }

  const parts: string[] = [`# ${item.title}`, "", `> ${item.description}`];

  const meta: string[] = [];
  if (item.type === "guide" && item.author) meta.push(`Author: ${item.author}`);
  if (item.date) meta.push(`Published: ${item.date}`);
  if (item.updated) meta.push(`Updated: ${item.updated}`);
  if (item.reviewed) meta.push(`Reviewed: ${item.reviewed}`);
  if (meta.length) parts.push("", meta.join(" | "));

  if (item.type === "tool") {
    const toolMeta: string[] = [
      `Category: ${titleCaseLabel(item.category)}`,
      `Pricing: ${titleCaseLabel(item.pricing)}`,
      `Website: ${item.url}`,
    ];
    if (item.repo) toolMeta.push(`Repository: ${item.repo}`);
    if (item.license) toolMeta.push(`License: ${item.license}`);
    parts.push("", toolMeta.join(" | "));
  }

  if (item.summary) parts.push("", item.summary);

  if (item.keyTakeaways.length) {
    parts.push("", "## Key takeaways", "");
    for (const point of item.keyTakeaways) parts.push(`- ${point}`);
  }

  if (item.type === "guide" && item.howtoSteps.length) {
    parts.push("", "## Steps at a glance", "");
    item.howtoSteps.forEach((step, idx) => {
      parts.push(`${idx + 1}. **${step.name}:** ${step.text}`);
    });
  }

  if (item.body) parts.push("", item.body);

  if (item.faq.length) {
    parts.push("", "## Frequently asked questions");
    for (const entry of item.faq) {
      parts.push("", `### ${entry.q}`, "", entry.a);
    }
  }

  if (item.type === "guide" && item.sources.length) {
    parts.push("", "## Sources and further reading", "");
    for (const sourceItem of item.sources) {
      parts.push(`- [${sourceItem.title}](${sourceItem.url}) — ${sourceItem.publisher}`);
    }
  }
  return parts.join("\n") + source;
}
