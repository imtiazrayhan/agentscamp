import { getAllContent } from "@/lib/content";
import { toMarkdownFile, canonicalUrl } from "@/lib/seo/artifact";

/**
 * Markdown twin for every content page, served (via a `/:path*.md` rewrite in
 * next.config) at the HTML URL + ".md". Pure SSG: one static file per item.
 *
 * Duplicate-content handling: the twin is an equivalent alternate representation
 * of its HTML page, so it sends a single, non-contradictory signal — a
 * `Link: rel="canonical"` header pointing at the HTML URL. Google consolidates
 * the duplicate to the HTML page instead of indexing the .md separately, while
 * humans, LLMs, and AI agents stay free to fetch the clean Markdown. (We do NOT
 * also send X-Robots-Tag: noindex — combining noindex with a cross-URL canonical
 * is contradictory and can discourage the retrieval bots we want reading it.)
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllContent().map((i) => ({
    path: i.href.replace(/^\//, "").split("/"),
  }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const href = "/" + path.join("/");
  const item = getAllContent().find((i) => i.href === href);
  if (!item) return new Response("Not found", { status: 404 });

  return new Response(toMarkdownFile(item), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${canonicalUrl(item)}>; rel="canonical"`,
    },
  });
}
