import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

export interface RawDoc {
  /** Folder name for categorized collections; "" for flat collections. */
  category: string;
  /** Derived from the filename ONLY (never trust a frontmatter slug). */
  slug: string;
  /** Absolute path, used for precise validation error messages. */
  file: string;
  data: Record<string, unknown>;
  body: string;
}

function readDoc(file: string, category: string): RawDoc {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const slug = path.basename(file, ".md");
  return { category, slug, file, data, body: content.trim() };
}

function listMarkdown(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => path.join(dir, f));
}

/** Categorized collection: <root>/<category>/<slug>.md */
export function loadCategorized(rootName: string): RawDoc[] {
  const root = path.join(CONTENT_ROOT, rootName);
  if (!fs.existsSync(root)) return [];
  const docs: RawDoc[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    for (const file of listMarkdown(path.join(root, entry.name))) {
      docs.push(readDoc(file, entry.name));
    }
  }
  return docs;
}

/** Flat collection: <root>/<slug>.md (category comes from frontmatter). */
export function loadFlat(rootName: string): RawDoc[] {
  return listMarkdown(path.join(CONTENT_ROOT, rootName)).map((file) =>
    readDoc(file, ""),
  );
}

/** ~200 wpm reading-time estimate (minutes, min 1). */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Comma-string or YAML array -> trimmed string[]. */
export function toList(value: unknown): string[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim());
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Acronym-aware title casing (API, AI, SDK, ...) lives in the client-safe helper.
export { titleCaseLabel as titleCase } from "../format";

/** Normalize a Date|undefined to an ISO date string for serialization. */
export function isoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}
