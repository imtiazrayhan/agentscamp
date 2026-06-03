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
    const text = m[2].replace(/[*_`]/g, "").trim();
    out.push({ depth: m[1].length, text, id: slugger.slug(m[2]) });
  }
  return out;
}
