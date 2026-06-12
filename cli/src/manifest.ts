import { readFileSync } from "node:fs";
import { CliError } from "./output";

export type ItemType = "agent" | "skill" | "command";

// Mirrors the ManifestItem emitted by scripts/build-cli-content.ts in the
// repo root — keep the two in sync (schemaVersion bumps on shape changes).
export interface ManifestItem {
  id: string; // "agents/prompt-engineer" (plural, matches site URLs)
  type: ItemType;
  slug: string;
  category: string;
  title: string;
  description: string;
  topics: string[];
  model?: string;
  file: string; // path inside content/
  installAs: string; // path inside .claude/, forward slashes
  url: string; // canonical page on agentscamp.com
}

export interface Manifest {
  schemaVersion: 1;
  generatedAt: string;
  counts: { agents: number; skills: number; commands: number };
  items: ManifestItem[];
}

// Resolved relative to the bundled dist/index.js, so paths work regardless of
// cwd, the npx cache location, or platform.
function bundlePath(rel: string): URL {
  return new URL(`../${rel}`, import.meta.url);
}

export function loadManifest(): Manifest {
  try {
    return JSON.parse(readFileSync(bundlePath("content/manifest.json"), "utf8")) as Manifest;
  } catch {
    throw new CliError(
      "Bundled content is missing — this package was built without content. " +
        "Please report this at https://github.com/imtiazrayhan/agentscamp/issues",
    );
  }
}

export function readContentFile(item: ManifestItem): string {
  return readFileSync(bundlePath(`content/${item.file}`), "utf8");
}

export function packageVersion(): string {
  const pkg = JSON.parse(readFileSync(bundlePath("package.json"), "utf8")) as {
    version: string;
  };
  return pkg.version;
}
