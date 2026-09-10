import {
  getContentByType,
  getByAudience,
  contentTypeList,
  audiences,
} from "@/lib/content";
import { site, network } from "@/lib/site";
import { toMarkdownFile, canonicalUrl } from "./artifact";
import { audienceCollection } from "./collections";

/**
 * /llms.txt + /llms-full.txt generators (the emerging llmstxt.org convention:
 * H1, blockquote summary, then H2 sections of `- [name](url): notes` links).
 * Both are generated from the data layer, so new content appears automatically.
 */

export function buildLlmsIndex(): string {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "Guides, a tool directory, and a glossary for anyone working with AI, plus agents, skills, and commands that are copy-paste/installable and format-validated for Claude Code. Each content page below has a clean Markdown twin at the same URL with a `.md` suffix.",
    "",
  ];

  for (const def of contentTypeList) {
    const items = getContentByType(def.id);
    if (!items.length) continue;
    lines.push(`## ${def.label}`, "");
    lines.push(`${def.description}`, "");
    for (const item of items) {
      lines.push(`- [${item.title}](${canonicalUrl(item)}.md): ${item.description}`);
    }
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
