import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

interface MdNode {
  type: string;
  depth?: number;
  value?: string;
  children?: MdNode[];
}

const parser = unified().use(remarkParse).use(remarkGfm);

// The heading's rendered text, as rehype-slug sees it (raw HTML is dropped).
const textOf = (node: MdNode): string =>
  node.type === "html" ? "" : (node.value ?? (node.children ?? []).map(textOf).join(""));

/**
 * h2/h3 headings + ids, read from the same markdown parse the page renders, so
 * code fences and inline links can't desync the TOC from the page. Every
 * heading is slugged in document order, as rehype-slug does, so duplicate-text
 * suffixes (-1, -2) line up too.
 */
export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const out: TocItem[] = [];
  const walk = (node: MdNode) => {
    if (node.type === "heading") {
      const text = textOf(node).trim();
      const id = slugger.slug(text);
      if (node.depth === 2 || node.depth === 3)
        out.push({ depth: node.depth, text, id });
      return;
    }
    node.children?.forEach(walk);
  };
  walk(parser.parse(markdown) as MdNode);
  return out;
}
