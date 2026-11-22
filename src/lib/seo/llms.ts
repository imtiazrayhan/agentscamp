import {
  getContentByType,
  getByAudience,
  getCategories,
  getFeatured,
  contentTypeList,
  audiences,
} from "@/lib/content";
import type { ContentItem, ContentTypeId } from "@/lib/content/types";
import { site, network } from "@/lib/site";
import { titleCaseLabel } from "@/lib/format";
import { toMarkdownFile, canonicalUrl } from "./artifact";
import { audienceCollection } from "./collections";

/**
 * /llms.txt, the per-type /<base>/llms.txt, and /llms-full.txt generators (the
 * llmstxt.org convention: H1, blockquote summary, then H2 sections of
 * `- [name](url): notes` links). /llms.txt stays small enough for one agent
 * fetch: per type it links the full per-type index plus a few featured items.
 * All are generated from the data layer, so new content appears automatically.
 */

const itemLine = (item: ContentItem) =>
  `- [${item.title}](${canonicalUrl(item)}.md): ${item.description}`;

/** URL of a type's full index, e.g. https://agentscamp.com/agents/llms.txt. */
const typeIndexUrl = (basePath: string) => `${site.url}${basePath}/llms.txt`;

export function buildLlmsIndex(): string {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "Guides, a tool directory, and a glossary for anyone working with AI, plus agents, skills, and commands that are copy-paste/installable and format-validated for Claude Code. Every content page has a clean Markdown twin: add `.md` to its URL, or request the page with `Accept: text/markdown`. Each section below links that type's full index.",
    "",
  ];

  for (const def of contentTypeList) {
    const items = getContentByType(def.id);
    if (!items.length) continue;
    lines.push(`## ${def.label}`, "");
    lines.push(`${def.description}`, "");
    lines.push(
      `- [Full ${def.label.toLowerCase()} index (${items.length} items)](${typeIndexUrl(def.basePath)}): every item with a one-line description, grouped by category`,
    );
    for (const item of getFeatured(def.id)) lines.push(itemLine(item));
    lines.push("");
  }

  const roles = audiences.filter((a) => getByAudience(a.slug).length > 0);
  if (roles.length) {
    lines.push("## By role", "");
    lines.push(
      "Curated reading orders per reader role, each followed by the tools, skills, and agents picked for that work.",
      "",
    );
    for (const a of roles) {
      lines.push(`- [${a.label}](${site.url}/for/${a.slug}): ${a.description}`);
    }
    lines.push("");
  }

  lines.push("## Network", "");
  for (const project of network) {
    lines.push(`- [${project.name}](${project.url}): ${project.tagline}`);
  }
  lines.push("");

  lines.push(
    "## Optional",
    "",
    `- [Full content](${site.url}/llms-full.txt): every page concatenated as Markdown`,
    `- [How to use](${site.url}/how-to-use): installing agents, skills, and commands`,
    `- [RSS feed](${site.url}/feed.xml): newest additions`,
    "",
  );

  return lines.join("\n");
}

/** Full index of one content type, grouped by category (largest first). */
export function buildLlmsTypeIndex(type: ContentTypeId): string {
  const def = contentTypeList.find((d) => d.id === type)!;
  const items = getContentByType(type);
  const lines: string[] = [
    `# ${site.name}: ${def.label}`,
    "",
    `> ${def.description}`,
    "",
    `All ${items.length} items. Each link is the item's Markdown twin; drop \`.md\` for the HTML page. Site index: ${site.url}/llms.txt`,
    "",
  ];
  const categories = getCategories(type);
  for (const { slug } of categories) {
    if (categories.length > 1) lines.push(`## ${titleCaseLabel(slug)}`, "");
    for (const item of items) if (item.category === slug) lines.push(itemLine(item));
    lines.push("");
  }
  return lines.join("\n");
}

export function buildLlmsFull(): string {
  const head = [
    `# ${site.name} — Full Content`,
    "",
    `> ${site.description}`,
    "",
    `Generated from ${site.url}. Each section is one page's Markdown twin.`,
    "",
  ];

  // The reading order per role. The full text below is unordered by design, so
  // this is the only place the curation itself is expressed. Resolved through
  // audienceCollection so it cannot drift from the /for/<role> pages.
  const roleSections: string[] = [];
  for (const a of audiences) {
    const c = audienceCollection(a.slug);
    if (!c?.startHere.length) continue;
    roleSections.push(`### ${a.label}`, "", a.description, "");
    c.startHere.forEach((i, n) =>
      roleSections.push(`${n + 1}. [${i.title}](${canonicalUrl(i)}.md)`),
    );
    roleSections.push("");
  }
  if (roleSections.length) {
    head.push("## By role", "", "Where each kind of reader should start.", "", ...roleSections);
  }

  const header = [...head, "---", ""].join("\n");

  const blocks: string[] = [];
  for (const def of contentTypeList) {
    for (const item of getContentByType(def.id)) {
      blocks.push(toMarkdownFile(item));
    }
  }

  return header + blocks.join("\n\n---\n\n") + "\n";
}
