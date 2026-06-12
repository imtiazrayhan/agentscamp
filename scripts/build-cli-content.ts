/**
 * Emits the npm CLI package's bundled content (cli/content/) from the REAL
 * loaders + buildArtifact (no parallel parser -> no drift with the site's
 * Copy/Download output). The cli package's prepublishOnly re-runs this on
 * every publish, so the tarball can never ship stale or missing content.
 *
 * Layout: flat cli/content/<plural>/<slug>.md; the manifest's `installAs`
 * carries the on-disk install mapping (skills become <slug>/SKILL.md).
 */
import fs from "node:fs";
import path from "node:path";
import { loadAgents, loadSkills, loadCommands } from "../src/lib/content/loaders";
import { buildArtifact, artifactFilename } from "../src/lib/seo/artifact";
import { site } from "../src/lib/site";
import type { ContentItem } from "../src/lib/content/types";

// Mirrors ManifestItem in cli/src/manifest.ts — keep the two in sync
// (schemaVersion bumps on shape changes; verify-bundle.mjs checks counts).
interface ManifestItem {
  id: string; // "agents/prompt-engineer" (plural, matches site URLs)
  type: "agent" | "skill" | "command";
  slug: string;
  category: string;
  title: string;
  description: string;
  topics: string[];
  model?: string;
  file: string; // path inside cli/content/
  installAs: string; // path inside .claude/, forward slashes
  url: string; // canonical page on agentscamp.com
}

const OUT = path.join(process.cwd(), "cli", "content");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const collections: [plural: string, items: ContentItem[]][] = [
  ["agents", loadAgents()],
  ["skills", loadSkills()],
  ["commands", loadCommands()],
];

const items: ManifestItem[] = [];
const counts: Record<string, number> = {};
const seen = new Set<string>();

for (const [plural, collection] of collections) {
  if (collection.length === 0) {
    throw new Error(`No items loaded for ${plural} — refusing to build an empty bundle`);
  }
  fs.mkdirSync(path.join(OUT, plural), { recursive: true });
  for (const item of collection) {
    const id = `${plural}/${item.slug}`;
    const artifact = buildArtifact(item);
    if (!artifact) throw new Error(`buildArtifact returned null for ${id}`);
    if (!item.description) throw new Error(`Missing description for ${id}`);
    // The bundle is flat per type, so a cross-category slug collision would
    // silently overwrite a file. None exist today; fail hard if one appears.
    if (seen.has(id)) throw new Error(`Duplicate id ${id} (cross-category slug collision)`);
    seen.add(id);

    fs.writeFileSync(path.join(OUT, plural, `${item.slug}.md`), artifact);
    items.push({
      id,
      type: item.type as ManifestItem["type"],
      slug: item.slug,
      category: item.category,
      title: item.title,
      description: item.description,
      topics: item.topics,
      ...("model" in item && item.model ? { model: item.model } : {}),
      file: `${plural}/${item.slug}.md`,
      installAs: `${plural}/${artifactFilename(item)}`,
      url: `${site.url}${item.href}`,
    });
  }
  counts[plural] = collection.length;
}

items.sort((a, b) => a.id.localeCompare(b.id));

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  counts: {
    agents: counts.agents,
    skills: counts.skills,
    commands: counts.commands,
  },
  items,
};

// Written last: a crashed run leaves no manifest, which fails the publish gate.
const manifestFile = path.join(OUT, "manifest.json");
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
console.log(
  `cli/content: ${counts.agents} agents, ${counts.skills} skills, ${counts.commands} commands -> ${path.relative(process.cwd(), manifestFile)}`,
);
