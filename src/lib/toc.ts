import GithubSlugger from "github-slugger";

export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

/** Extract h2/h3 headings + ids (matching rehype-slug's github-slugger ids). */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");
  const out: TocItem[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    // rehype-slug slugs the rendered text, where `[label](url)` is just `label`.
    const raw = m[2].replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1");
    const text = raw.replace(/[*_`]/g, "").trim();
    out.push({ depth: m[1].length, text, id: slugger.slug(raw) });
  }
  return out;
}
