/**
 * Emits the public `awesome-agentscamp` mirror repo (mirror/) from the REAL
 * loaders + buildArtifact — the same single source of truth the site and npm
 * CLI use, so the mirror can never drift. Run `npm run mirror:build`, then push
 * the contents of mirror/ to the public GitHub repo.
 *
 * Layout (mirror/ becomes the public repo's working tree):
 *   README.md                  hero + install + counts + table of contents
 *   agents.md / skills.md / …  one catalog file per content type
 *   agents/<slug>.md           real, copy-pasteable installable artifacts
 *   skills/<slug>/SKILL.md
 *   commands/<slug>.md
 *   manifest.json              machine-readable index of every item
 *   LICENSE                    MIT
 *
 * Every entry links back to its canonical page on agentscamp.com (backlinks +
 * GEO citation surface); installables additionally carry their `npx agentscamp
 * add …` command and an in-repo file link.
 */
import fs from "node:fs";
import path from "node:path";
import { loadAllByType } from "../src/lib/content/loaders";
import { buildArtifact, artifactFilename } from "../src/lib/seo/artifact";
import { contentTypeList } from "../src/lib/content/registry";
import { titleCaseLabel } from "../src/lib/format";
import { site, network } from "../src/lib/site";
import type { ContentItem, ContentTypeId } from "../src/lib/content/types";

const OUT = path.join(process.cwd(), "mirror");
const PLURAL: Record<ContentTypeId, string> = {
  agent: "agents",
  skill: "skills",
  guide: "guides",
  tool: "tools",
  command: "commands",
  glossary: "glossary",
};
const INSTALLABLE: ContentTypeId[] = ["agent", "skill", "command"];

const canonical = (item: ContentItem) => `${site.url}${item.href}`;

/** Wipe generated output but preserve the mirror repo's own .git, if present. */
function resetOut() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const entry of fs.readdirSync(OUT)) {
    if (entry === ".git") continue;
    fs.rmSync(path.join(OUT, entry), { recursive: true, force: true });
  }
}

/** Group a type's items by category, categories sorted by descending count. */
function byCategory(items: ContentItem[]): [string, ContentItem[]][] {
  const map = new Map<string, ContentItem[]>();
  for (const item of items) {
    const arr = map.get(item.category) ?? [];
    arr.push(item);
    map.set(item.category, arr);
  }
  return [...map.entries()]
    .map(([cat, list]) => {
      list.sort((a, b) => a.title.localeCompare(b.title));
      return [cat, list] as [string, ContentItem[]];
    })
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

interface ManifestItem {
  id: string;
  type: ContentTypeId;
  slug: string;
  category: string;
  title: string;
  description: string;
  topics: string[];
  url: string;
  file?: string;
  install?: string;
}

resetOut();

const byType = loadAllByType() as Record<ContentTypeId, ContentItem[]>;
const manifest: ManifestItem[] = [];
const counts: Record<string, number> = {};
const seen = new Set<string>();

// 1. Write installable artifact files + record manifest entries for everything.
for (const def of contentTypeList) {
  const type = def.id;
  const plural = PLURAL[type];
  const collection = byType[type];
  if (!collection || collection.length === 0) {
    throw new Error(`No items loaded for ${plural} — refusing to build an empty mirror`);
  }
  counts[plural] = collection.length;

  for (const item of collection) {
    const id = `${plural}/${item.slug}`;
    if (!item.description) throw new Error(`Missing description for ${id}`);

    const entry: ManifestItem = {
      id,
      type,
      slug: item.slug,
      category: item.category,
      title: item.title,
      description: item.description,
      topics: item.topics,
      url: canonical(item),
    };

    if (INSTALLABLE.includes(type)) {
      const artifact = buildArtifact(item);
      if (!artifact) throw new Error(`buildArtifact returned null for ${id}`);
      // Flat per type, matching the CLI's install id — a cross-category slug
      // collision would silently overwrite a file. None exist today; fail hard.
      if (seen.has(id)) throw new Error(`Duplicate id ${id} (cross-category slug collision)`);
      seen.add(id);

      const rel = `${plural}/${artifactFilename(item)}`;
      const dest = path.join(OUT, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, artifact.endsWith("\n") ? artifact : artifact + "\n");
      entry.file = rel;
      entry.install = `npx agentscamp add ${id}`;
    }

    manifest.push(entry);
  }
}

manifest.sort((a, b) => a.id.localeCompare(b.id));

// 2. Per-type catalog files.
function catalogEntry(item: ManifestItem): string {
  const desc = item.description.replace(/\s+/g, " ").trim();
  if (item.file) {
    return `- **[${item.title}](${item.file})** — ${desc}\n  [↗ Page](${item.url}) · \`${item.install}\``;
  }
  return `- **[${item.title}](${item.url})** — ${desc}`;
}

for (const def of contentTypeList) {
  const type = def.id;
  const plural = PLURAL[type];
  const items = manifest.filter((m) => m.type === type);
  const installable = INSTALLABLE.includes(type);

  const lines: string[] = [
    `# ${def.label}`,
    "",
    `> ${def.description}`,
    "",
    installable
      ? `Install any of these with the [\`agentscamp\`](https://www.npmjs.com/package/agentscamp) CLI (\`-g\` installs to \`~/.claude/\` instead of the current project), or open the linked file and copy it into your \`.claude/${plural}/\` directory. Each entry links to its full page on [${site.name}](${site.url}).`
      : `Browse the full directory on [${site.name}](${site.url}${def.basePath}). Each entry links to its canonical page.`,
    "",
    `**${items.length} ${items.length === 1 ? def.singular.toLowerCase() : def.label.toLowerCase()}** · [← Back to README](README.md)`,
    "",
  ];

  for (const [cat, list] of byCategory(byType[type])) {
    lines.push(`## ${titleCaseLabel(cat)}`, "");
    const ids = new Set(list.map((i) => `${plural}/${i.slug}`));
    for (const m of items.filter((m) => ids.has(m.id))) lines.push(catalogEntry(m));
    lines.push("");
  }

  fs.writeFileSync(path.join(OUT, `${plural}.md`), lines.join("\n").trimEnd() + "\n");
}

// 3. README.
const total = Object.values(counts).reduce((a, b) => a + b, 0);
const countRows = contentTypeList
  .map((d) => `| [${d.label}](${PLURAL[d.id]}.md) | ${counts[PLURAL[d.id]]} | ${d.tagline} |`)
  .join("\n");

const readme = `# awesome-agentscamp

> A curated, copy-paste-ready library of AI coding **agents, skills, commands, guides, tools, and glossary terms** — the installable mirror of **[${site.name}](${site.url})**.

Everything here is generated from [${site.name}](${site.url}) and kept in sync. The agents, skills, and commands are real Claude Code artifacts you can drop straight into \`.claude/\` — browse the file, copy it, or install it with one command.

## Install

\`\`\`bash
# install into the current project's .claude/
npx agentscamp add agents/<slug>

# …or globally into ~/.claude/
npx agentscamp add agents/<slug> -g
\`\`\`

Replace \`agents/<slug>\` with any id from the catalogs below (e.g. \`skills/<slug>\`, \`commands/<slug>\`). See the [\`agentscamp\` package on npm](https://www.npmjs.com/package/agentscamp).

## What's inside

| Type | Count | About |
| --- | --- | --- |
${countRows}

**${total} items**, all linking back to their canonical pages on [${site.name}](${site.url}).

## Catalogs

${contentTypeList.map((d) => `- **[${d.label}](${PLURAL[d.id]}.md)** — ${d.tagline}`).join("\n")}

## About

[${site.name}](${site.url}) is ${site.description.charAt(0).toLowerCase() + site.description.slice(1)} Browse, search, and read the full guides on the site — this repo mirrors the installable library for git-native distribution.

Part of a small network of maker tools:
${network.map((n) => `- [${n.name}](${n.url}) — ${n.tagline}`).join("\n")}

## Contributing

Content lives on [${site.name}](${site.url}); this repo is generated, so please open issues or suggestions there. Pull requests against generated files will be overwritten on the next sync.

## License

[MIT](LICENSE) — the installable artifacts are free to use, copy, and adapt.
`;

fs.writeFileSync(path.join(OUT, "README.md"), readme);

// 4. LICENSE (MIT) + manifest.
const license = `MIT License

Copyright (c) ${site.name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
fs.writeFileSync(path.join(OUT, "LICENSE"), license);

fs.writeFileSync(
  path.join(OUT, "manifest.json"),
  JSON.stringify(
    {
      schemaVersion: 1,
      source: site.url,
      counts: { ...counts, total },
      items: manifest,
    },
    null,
    2,
  ) + "\n",
);

const installableCount = manifest.filter((m) => m.file).length;
console.log(
  `mirror/: ${total} items (${installableCount} installable) across ${contentTypeList.length} types -> ${path.relative(process.cwd(), OUT)}`,
);
