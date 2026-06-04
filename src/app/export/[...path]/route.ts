import { getAllContent } from "@/lib/content";
import { canonicalUrl } from "@/lib/seo/artifact";
import {
  AGENT_EXPORT_FORMATS,
  getAgentExportFormat,
} from "@/lib/export/agent-formats";
import type { AgentItem } from "@/lib/content/types";

// Source from the memoized getAllContent() (not the uncached getContentByType,
// which re-reads + re-parses every agent file on each call) so the ~N×formats
// static generations don't re-parse the whole agents tree hundreds of times.
const agentItems = () =>
  getAllContent().filter((i): i is AgentItem => i.type === "agent");

/**
 * Third-party export files for agents, served (via `/:path*.<ext>` rewrites in
 * next.config, ordered BEFORE the `/:path*.md` twin rule) at the agent's HTML URL
 * + a format suffix — e.g. /agents/<cat>/<slug>.agent.md (Copilot), .cursor.mdc.
 *
 * The trailing path segment is the format id (from the rewrite destination); the
 * rest is the agent href. Pure SSG, one file per agent×format. Like the .md twin,
 * a `Link: rel="canonical"` points at the HTML page so the export is fetchable by
 * humans/LLMs without competing with the canonical page for indexing.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return agentItems().flatMap((a) => {
    const base = a.href.replace(/^\//, "").split("/");
    return AGENT_EXPORT_FORMATS.map((f) => ({ path: [...base, f.id] }));
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const fmt = getAgentExportFormat(path[path.length - 1]);
  const href = "/" + path.slice(0, -1).join("/");
  const item = agentItems().find((i) => i.href === href);
  if (!fmt || !item) return new Response("Not found", { status: 404 });

  return new Response(fmt.build(item), {
    headers: {
      "Content-Type": fmt.contentType,
      "Cache-Control": "public, max-age=3600",
      Link: `<${canonicalUrl(item)}>; rel="canonical"`,
    },
  });
}
