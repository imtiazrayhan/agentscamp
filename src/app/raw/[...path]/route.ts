import { getAllContent } from "@/lib/content";
import { toMarkdownFile, canonicalUrl } from "@/lib/seo/artifact";

/**
 * Markdown twin for every content page, served (via a `/:path*.md` rewrite in
 * next.config) at the HTML URL + ".md". Pure SSG: one static file per item.
 *
 * Duplicate-content handling: a `Link: rel="canonical"` header consolidates the
 * twin to its HTML page, and `X-Robots-Tag: noindex` keeps the .md itself out of
 * the index — the twins are fetchable by humans/agents, not competing in search.
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
      "X-Robots-Tag": "noindex",
    },
  });
}
