import { contentTypeList, getContentByType } from "@/lib/content";
import { buildLlmsTypeIndex } from "@/lib/seo/llms";

/**
 * Per-type llms.txt, served (via a `/<base>/llms.txt` rewrite in next.config)
 * at e.g. /agents/llms.txt. Param = the type's URL segment. Pure SSG.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return contentTypeList
    .filter((def) => getContentByType(def.id).length > 0)
    .map((def) => ({ type: def.basePath.slice(1) }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const def = contentTypeList.find((d) => d.basePath === `/${type}`);
  if (!def) return new Response("Not found", { status: 404 });

  return new Response(buildLlmsTypeIndex(def.id), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
