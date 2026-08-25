/**
 * Build-time content gate. Runs the REAL loaders (which zod-validate every
 * frontmatter), then checks cross-cutting invariants AND SEO/AEO/GEO hygiene so
 * quality is enforced at build time, not by a reviewer. Errors fail the build;
 * warnings are advisory. Because schemas are .strict() and this runs in
 * `prebuild`, every rule auto-applies to all current + future content.
 */
import {
  loadAgents,
  loadSkills,
  loadGuides,
  loadTools,
  loadCommands,
  loadGlossary,
} from "../src/lib/content/loaders";
import { getCategories } from "../src/lib/content/index";
import {
  contentTypes,
  topics,
  topicBySlug,
} from "../src/lib/content/registry";
import { graphFor, siteGraph, collectionGraph } from "../src/lib/seo/jsonld";
import {
  categoryCollection,
  topicCollection,
  toolAlternativesCollection,
} from "../src/lib/seo/collections";
import { unified } from "unified";
import remarkParse from "remark-parse";
import GithubSlugger from "github-slugger";
import fs from "node:fs";
import path from "node:path";
import type {
  ContentItem,
  ContentTypeId,
  GuideItem,
  ToolItem,
} from "../src/lib/content/types";

let errors = 0;
let warnings = 0;
const err = (m: string) => {
  console.error("  ✗ " + m);
  errors++;
};
const warn = (m: string) => {
  console.warn("  ! " + m);
  warnings++;
};

const validTopics = new Set(topics.map((t) => t.slug));
const contentId = (item: ContentItem) => `${item.type}:${item.slug}`;

interface MarkdownNode {
  type: string;
  value?: string;
  url?: string;
  children?: MarkdownNode[];
}

function nodeText(node: MarkdownNode): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  return (node.children ?? []).map(nodeText).join("");
}

function markdownLinksAndHeadings(body: string) {
  const tree = unified().use(remarkParse).parse(body) as MarkdownNode;
  const links: { url: string; text: string }[] = [];
  const headings = new Set<string>();
  const slugger = new GithubSlugger();
  const visit = (node: MarkdownNode) => {
    if (node.type === "link" && node.url) {
      links.push({ url: node.url, text: nodeText(node) });
    }
    if (node.type === "heading") headings.add(slugger.slug(nodeText(node)));
    for (const child of node.children ?? []) visit(child);
  };
  visit(tree);
  return { links, headings };
}

function internalUrl(raw: string, from: string): URL | null {
  if (/^(mailto:|tel:|data:|javascript:)/i.test(raw) || raw.startsWith("//")) {
    return null;
  }
  const url = new URL(raw, `https://agentscamp.local${from}`);
  if (
    url.hostname !== "agentscamp.local" &&
    url.hostname !== "agentscamp.com"
  ) {
    return null;
  }
  return url;
}

/** Recursively collect defined (@type+@id) vs pure-reference (@id only) ids. */
function walkIds(node: unknown, defined: Set<string>, referenced: Set<string>) {
  if (Array.isArray(node)) {
    for (const n of node) walkIds(n, defined, referenced);
    return;
  }
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const id = obj["@id"];
    if (typeof id === "string") {
      const keys = Object.keys(obj);
      if (obj["@type"]) defined.add(id);
      else if (keys.length === 1) referenced.add(id);
    }
    for (const k of Object.keys(obj)) walkIds(obj[k], defined, referenced);
  }
}

function checkClosedGraph(label: string, graph: unknown, siteIds: Set<string>) {
  const defined = new Set<string>(siteIds);
  const referenced = new Set<string>();
  walkIds(graph, defined, referenced);
  for (const ref of referenced) {
    if (!defined.has(ref)) err(`${label}: dangling @id reference ${ref}`);
  }
}

function run() {
  const groups: Record<string, ContentItem[]> = {};
  try {
    groups.agent = loadAgents();
    groups.skill = loadSkills();
    groups.guide = loadGuides();
    groups.tool = loadTools();
    groups.command = loadCommands();
    groups.glossary = loadGlossary();
  } catch (e) {
    err((e as Error).message);
    return;
  }

  const all = Object.values(groups).flat();
  const ids = new Map<string, string>();

  for (const [type, items] of Object.entries(groups)) {
    const seen = new Set<string>();
    for (const item of items) {
      if (seen.has(item.slug)) err(`duplicate ${type} slug: ${item.slug}`);
      seen.add(item.slug);
      const id = contentId(item);
      if (ids.has(id)) err(`duplicate content ID: ${id}`);
      ids.set(id, item.href);
      if (!item.href || !item.href.startsWith("/"))
        err(`bad href for ${type}/${item.slug}: ${item.href}`);
    }
    console.log(`  ✓ ${type}: ${items.length}`);
  }

  // --- per-item SEO/AEO/GEO hygiene ---
  for (const item of all) {
    const id = `${item.type}/${item.slug}`;

    // Description hygiene applies to the EDITORIAL types only. For
    // agent/skill/command the `description` is the installable artifact field
    // Claude Code uses for delegation (legitimately long); `seoDescription` is
    // the SEO escape hatch there.
    if (
      item.type === "guide" ||
      item.type === "tool" ||
      item.type === "glossary"
    ) {
      const dlen = (item.seoDescription ?? item.description).length;
      if (dlen > 320) err(`${id}: description too long (${dlen} > 320)`);
      else if (dlen > 160)
        warn(`${id}: description ${dlen} chars (may truncate in SERP)`);
      else if (dlen < 70)
        warn(`${id}: description ${dlen} chars (thin for SERP)`);
    }

    // dates are required (backfilled for existing; author-supplied for new)
    if (!item.date) err(`${id}: missing a resolvable date`);

    // topics must be part of the shared taxonomy
    for (const t of item.topics)
      if (!validTopics.has(t)) err(`${id}: unknown topic "${t}"`);

    // FAQ render-parity: entries must be non-empty (they render + are marked up)
    item.faq.forEach((f, i) => {
      if (!f.q.trim() || !f.a.trim()) err(`${id}: faq[${i}] has empty q/a`);
    });

    // answer-first summary should stay snippet-sized
    if (item.summary && item.summary.split(/\s+/).length > 70)
      warn(`${id}: summary is long (>70 words) for answer extraction`);

    // custom image must be a real path
    if (item.image && !/^(\/|https?:\/\/)/.test(item.image))
      warn(`${id}: image "${item.image}" is not an absolute path or URL`);
  }

  // guide-specific
  for (const g of groups.guide as GuideItem[]) {
    g.howtoSteps.forEach((s, i) => {
      if (!s.name.trim() || !s.text.trim())
        err(`guide/${g.slug}: howtoSteps[${i}] has empty name/text`);
    });
    const sourceUrls = new Set(g.sources.map((source) => source.url));
    if (sourceUrls.size !== g.sources.length)
      err(`guide/${g.slug}: duplicate source URL`);
    if (g.depth === "cornerstone") {
      if (g.wordCount < 2000)
        err(`guide/${g.slug}: cornerstone guide is ${g.wordCount} words (< 2000)`);
      if (g.sources.length < 5)
        err(`guide/${g.slug}: cornerstone guide needs at least 5 primary sources`);
      if (!g.updated)
        err(`guide/${g.slug}: cornerstone guide needs an updated date`);
      if (g.keyTakeaways.length < 4)
        err(`guide/${g.slug}: cornerstone guide needs at least 4 key takeaways`);
      if (g.faq.length < 3)
        err(`guide/${g.slug}: cornerstone guide needs at least 3 FAQs`);
      if (markdownLinksAndHeadings(g.body ?? "").headings.size < 8)
        err(`guide/${g.slug}: cornerstone guide needs at least 8 descriptive headings`);
    }
  }

  // tool-specific: alternativeTo should resolve to a known tool slug
  const toolSlugs = new Set((groups.tool as ToolItem[]).map((t) => t.slug));
  for (const t of groups.tool as ToolItem[]) {
    for (const alt of t.alternativeTo)
      if (!toolSlugs.has(alt))
        warn(`tool/${t.slug}: alternativeTo "${alt}" is not a known tool`);
  }

  // Related refs are typed and strict: a missing edge is a broken visible link.
  for (const item of all) {
    const seen = new Set<string>();
    for (const ref of item.related) {
      if (!ids.has(ref)) err(`${contentId(item)} -> unknown related: ${ref}`);
      if (ref === contentId(item)) err(`${contentId(item)} has a self-related ref`);
      if (seen.has(ref)) err(`${contentId(item)} repeats related ref: ${ref}`);
      seen.add(ref);
    }
  }

  // --- rendered Markdown link integrity ---
  const validRoutes = new Set<string>([
    "/",
    "/how-to-use",
    "/topics",
    "/search",
    "/llms.txt",
    "/llms-full.txt",
    "/feed.xml",
    "/sitemap.xml",
  ]);
  for (const def of Object.values(contentTypes)) validRoutes.add(def.basePath);
  for (const item of all) validRoutes.add(item.href);
  for (const type of ["agent", "skill", "guide", "command"] as ContentTypeId[]) {
    const def = contentTypes[type];
    for (const category of getCategories(type)) {
      validRoutes.add(`${def.basePath}/${category.slug}`);
    }
  }
  for (const category of getCategories("tool")) {
    validRoutes.add(`/tools/category/${category.slug}`);
  }
  for (const topic of topics) {
    if (topicCollection(topic.slug)) validRoutes.add(`/topics/${topic.slug}`);
  }
  for (const tool of groups.tool as ToolItem[]) {
    validRoutes.add(`/tools/pricing/${tool.pricing}`);
    if (toolAlternativesCollection(tool.slug)) {
      validRoutes.add(`${tool.href}/alternatives`);
    }
  }

  const markdown = new Map(
    all.map((item) => [item.href, markdownLinksAndHeadings(item.body ?? "")]),
  );
  const contentHrefs = new Set(all.map((item) => item.href));
  const contextualIncoming = new Map(
    all.map((item) => [item.href, new Set<string>()]),
  );
  const oldUrlSnapshot = path.join(process.cwd(), "migration", "old-urls.txt");
  const redirects = new Set<string>();
  if (fs.existsSync(oldUrlSnapshot)) {
    for (const oldUrl of fs.readFileSync(oldUrlSnapshot, "utf8").split("\n")) {
      const route = oldUrl.trim();
      if (route && !validRoutes.has(route)) redirects.add(route);
    }
  }

  const exportSuffix = /\.(?:md|agent\.md|cursor\.mdc|cline\.md|windsurf\.md|continue\.md)$/;
  for (const item of all) {
    for (const link of markdown.get(item.href)?.links ?? []) {
      let url: URL | null;
      try {
        url = internalUrl(link.url, item.href);
      } catch {
        err(`${contentId(item)} has malformed link "${link.url}"`);
        continue;
      }
      if (!url) continue;
      const route = url.pathname.replace(/\/$/, "") || "/";
      if (redirects.has(route)) {
        err(`${contentId(item)} links through a redirect: ${link.url}`);
      } else if (!validRoutes.has(route) && !exportSuffix.test(route)) {
        err(`${contentId(item)} has broken internal link: ${link.url}`);
        continue;
      }
      if (contentHrefs.has(route) && route !== item.href) {
        contextualIncoming.get(route)?.add(item.href);
      }
      if (url.hash && markdown.has(route)) {
        let fragment: string;
        try {
          fragment = decodeURIComponent(url.hash.slice(1));
        } catch {
          err(`${contentId(item)} has malformed fragment: ${link.url}`);
          continue;
        }
        if (!markdown.get(route)?.headings.has(fragment)) {
          err(`${contentId(item)} has missing heading fragment: ${link.url}`);
        }
      }
    }
  }
  for (const item of all) {
    if (contextualIncoming.get(item.href)?.size === 0) {
      err(`${contentId(item)} has no contextual inbound link from other content`);
    }
  }

  // --- structured-data closed-graph check (no dangling @id) ---
  const siteIds = new Set<string>();
  walkIds(siteGraph(), siteIds, new Set());
  for (const item of all)
    checkClosedGraph(`${item.type}/${item.slug} graph`, graphFor(item), siteIds);

  // listing-page collection graphs
  const typeList: ContentTypeId[] = [
    "agent",
    "skill",
    "guide",
    "tool",
    "command",
    "glossary",
  ];
  for (const type of typeList) {
    const items = groups[type];
    const g = collectionGraph({
      path: `/${type === "agent" ? "agents" : type === "skill" ? "skills" : type === "guide" ? "guides" : type === "tool" ? "tools" : type === "glossary" ? "glossary" : "commands"}`,
      name: type,
      description: "x",
      items,
      crumbs: [{ label: "Home", href: "/" }, { label: type }],
    });
    checkClosedGraph(`${type} listing graph`, g, siteIds);
  }

  // --- canonical coverage: every generated landing param renders (no 404) ---
  for (const type of ["agent", "skill", "guide", "command"] as ContentTypeId[]) {
    for (const c of getCategories(type)) {
      if (!categoryCollection(type, c.slug))
        err(`category route ${type}/${c.slug} resolves to nothing`);
    }
  }
  for (const t of topics) {
    if (topicBySlug.get(t.slug) && t.slug) {
      const col = topicCollection(t.slug);
      if (!col) warn(`topic "${t.slug}" has no content yet (no landing page)`);
    }
  }

  console.log(`  total: ${all.length}`);
}

console.log("Validating content...");
run();
if (errors > 0) {
  console.error(`\nContent validation FAILED with ${errors} error(s), ${warnings} warning(s).`);
  process.exit(1);
}
console.log(`Content valid. ${warnings} warning(s).\n`);
