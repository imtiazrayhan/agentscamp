/**
 * Post-build gate for the external-link `rel` policy.
 *
 * Source-level linting can't prove what shipped, so this checks the RENDERED
 * static HTML in .next/server/app against sets derived from the real loaders
 * (no hardcoded URL lists, no drift).
 *
 * Policy (owner decision 2026-09-10):
 *   nofollow  - tool directory url/repo, owner-network cross-promo, share intents
 *   dofollow  - cited primary sources, in-body editorial links, first-party identity
 *   always    - noopener noreferrer on everything off-site
 *
 * The policy is per-SURFACE, not per-URL: the same destination can legitimately be
 * a nofollow directory listing on a tool page and a dofollow editorial mention in
 * prose. So the templated surfaces are checked as scoped existence assertions -
 * "the tool page carries a nofollow link to its own website", "the guide page
 * carries a dofollow link to each source it cites" - which catch a component
 * regression without flagging legitimate overlap.
 *
 * Runs before the IndexNow ping so a bad build is never announced.
 */
import fs from "node:fs";
import path from "node:path";
import { loadAllByType } from "../src/lib/content/loaders";
import { site, network } from "../src/lib/site";

const HTML_ROOT = ".next/server/app";
const INTERNAL_HOST = new URL(site.url).hostname;

/** Absolute self-links (https://agentscamp.com/llms.txt) are internal, not off-site. */
const isOffSite = (href: string) => {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).hostname !== INTERNAL_HOST;
  } catch {
    return false;
  }
};

/** Trailing-slash- and host-case-insensitive form, so href variants still match. */
const norm = (raw: string) => {
  try {
    const u = new URL(raw);
    const p = u.pathname.length > 1 ? u.pathname.replace(/\/$/, "") : "";
    return `${u.hostname.toLowerCase().replace(/^www\./, "")}${p}${u.search}`;
  } catch {
    return raw;
  }
};

// ---- Collect every off-site anchor, per page ------------------------------
const ANCHOR_RE = /<a\s([^>]*)>/gi;
const attr = (tag: string, name: string) =>
  new RegExp(`${name}="([^"]*)"`, "i").exec(tag)?.[1] ?? "";
const unescape = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'");

interface Anchor {
  href: string;
  rel: string;
  nofollow: boolean;
}

const htmlFiles: string[] = [];
const walk = (dir: string) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
};

if (!fs.existsSync(HTML_ROOT)) {
  console.error(`FAIL: ${HTML_ROOT} not found - run \`next build\` first.`);
  process.exit(1);
}
walk(HTML_ROOT);
if (htmlFiles.length === 0) {
  console.error(`FAIL: no .html files under ${HTML_ROOT}. Refusing to pass vacuously.`);
  process.exit(1);
}

/** page path (relative to HTML_ROOT, no .html) -> its off-site anchors */
const byPage = new Map<string, Anchor[]>();
let externalAnchors = 0;
let nofollowed = 0;

const problems: string[] = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const page = path.relative(HTML_ROOT, file).replace(/\.html$/, "");
  const anchors: Anchor[] = [];
  let m: RegExpExecArray | null;
  ANCHOR_RE.lastIndex = 0;
  while ((m = ANCHOR_RE.exec(html))) {
    const href = unescape(attr(m[1], "href"));
    if (!isOffSite(href)) continue;
    const rel = attr(m[1], "rel");
    anchors.push({ href, rel, nofollow: /\bnofollow\b/.test(rel) });
  }
  byPage.set(page, anchors);
  externalAnchors += anchors.length;
  nofollowed += anchors.filter((a) => a.nofollow).length;
}

const allAnchors = [...byPage.values()].flat();

// ---- 1. Universal: noopener + noreferrer on every off-site anchor ---------
{
  const bad = new Map<string, string>();
  for (const a of allAnchors) {
    if (!/\bnoopener\b/.test(a.rel) || !/\bnoreferrer\b/.test(a.rel)) {
      bad.set(a.href, a.rel);
    }
  }
  for (const [href, rel] of bad) {
    problems.push(`[missing noopener/noreferrer] ${href}  rel="${rel}"`);
  }
}

// ---- 2. Sitewide chrome: owner network + share intents must be nofollow ----
// Single-surface, so a flat URL/shape check is exact here.
{
  const networkUrls = new Set(network.map((n) => norm(n.url)));
  const isShareIntent = (href: string) =>
    /^https?:\/\/(www\.)?x\.com\/intent\//i.test(href) ||
    /^https?:\/\/(www\.)?linkedin\.com\/sharing\//i.test(href);

  const bad = new Set<string>();
  for (const a of allAnchors) {
    if (a.nofollow) continue;
    if (networkUrls.has(norm(a.href)) || isShareIntent(a.href)) bad.add(a.href);
  }
  for (const href of bad) problems.push(`[should be nofollow] ${href}`);
}

// ---- 3+4. Templated content surfaces, scoped to their owning page ----------
const byType = loadAllByType();
const missingPages: string[] = [];

/** Anchors on the page that owns this item, or null if the page wasn't rendered. */
const anchorsForItem = (href: string) => {
  const page = href.replace(/^\//, "");
  return byPage.get(page) ?? byPage.get(`${page}/index`) ?? null;
};

let toolsChecked = 0;
for (const t of byType.tool) {
  const tool = t as typeof t & { url?: string; repo?: string };
  const anchors = anchorsForItem(tool.href);
  if (!anchors) {
    missingPages.push(tool.href);
    continue;
  }
  toolsChecked++;
  for (const [field, value] of [
    ["url", tool.url],
    ["repo", tool.repo],
  ] as const) {
    if (!value) continue;
    const hits = anchors.filter((a) => norm(a.href) === norm(value));
    if (hits.length === 0) {
      problems.push(`[tool ${field} not rendered] ${tool.href} -> ${value}`);
    } else if (!hits.some((a) => a.nofollow)) {
      problems.push(`[directory link should be nofollow] ${tool.href} -> ${value}`);
    }
  }
}

let sourcesChecked = 0;
for (const g of byType.guide) {
  const guide = g as typeof g & { sources?: { url: string }[] };
  if (!guide.sources?.length) continue;
  const anchors = anchorsForItem(guide.href);
  if (!anchors) {
    missingPages.push(guide.href);
    continue;
  }
  for (const s of guide.sources) {
    const hits = anchors.filter((a) => norm(a.href) === norm(s.url));
    if (hits.length === 0) {
      problems.push(`[cited source not rendered] ${guide.href} -> ${s.url}`);
    } else if (!hits.some((a) => !a.nofollow)) {
      problems.push(`[citation should stay dofollow] ${guide.href} -> ${s.url}`);
    }
    sourcesChecked++;
  }
}

// ---- 5. First-party identity links stay dofollow --------------------------
{
  const identity = new Set(site.sameAs.map(norm));
  const bad = new Set<string>();
  for (const a of allAnchors) {
    if (a.nofollow && identity.has(norm(a.href))) bad.add(a.href);
  }
  for (const href of bad) problems.push(`[identity link should stay dofollow] ${href}`);
}

// ---- Report ---------------------------------------------------------------
console.log(
  `external-link policy: ${htmlFiles.length} pages, ${externalAnchors} off-site anchors ` +
    `(${nofollowed} nofollow, ${externalAnchors - nofollowed} dofollow); ` +
    `checked ${toolsChecked} tool pages, ${sourcesChecked} citations`,
);

if (missingPages.length) {
  console.warn(`  note: ${missingPages.length} item page(s) had no static HTML, skipped`);
}

if (problems.length > 0) {
  console.error(`\nFAIL: ${problems.length} external-link policy violation(s):\n`);
  for (const p of problems.slice(0, 60)) console.error(`  ${p}`);
  if (problems.length > 60) console.error(`  ... +${problems.length - 60} more`);
  console.error("");
  process.exit(1);
}

console.log("OK: external-link policy holds");
