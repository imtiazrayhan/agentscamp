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
} from "../src/lib/content/loaders";
import { getCategories } from "../src/lib/content/index";
import { topics, topicBySlug } from "../src/lib/content/registry";
import { graphFor, siteGraph, collectionGraph } from "../src/lib/seo/jsonld";
import {
  categoryCollection,
  topicCollection,
} from "../src/lib/seo/collections";
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
  } catch (e) {
    err((e as Error).message);
    return;
  }

  const all = Object.values(groups).flat();
  const slugs = new Map<string, string>();

  for (const [type, items] of Object.entries(groups)) {
    const seen = new Set<string>();
    for (const item of items) {
      if (seen.has(item.slug)) err(`duplicate ${type} slug: ${item.slug}`);
      seen.add(item.slug);
      slugs.set(item.slug, item.href);
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
    if (item.type === "guide" || item.type === "tool") {
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
  }

  // tool-specific: alternativeTo should resolve to a known tool slug
  const toolSlugs = new Set((groups.tool as ToolItem[]).map((t) => t.slug));
  for (const t of groups.tool as ToolItem[]) {
    for (const alt of t.alternativeTo)
      if (!toolSlugs.has(alt))
        warn(`tool/${t.slug}: alternativeTo "${alt}" is not a known tool`);
  }

  // related refs are advisory (warn only)
  for (const item of all) {
    for (const ref of item.related)
      if (!slugs.has(ref))
        warn(`${item.type}/${item.slug} -> unknown related: ${ref}`);
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
  ];
  for (const type of typeList) {
    const items = groups[type];
    const g = collectionGraph({
      path: `/${type === "agent" ? "agents" : type === "skill" ? "skills" : type === "guide" ? "guides" : type === "tool" ? "tools" : "commands"}`,
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
