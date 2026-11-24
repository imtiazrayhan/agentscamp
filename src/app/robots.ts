import type { MetadataRoute } from "next";
import { site, aiCrawlers } from "@/lib/site";

/**
 * Open by default. AI crawlers are explicitly welcomed (retrieval AND training)
 * so AI answers can cite AgentsCamp and the hub stays discoverable to agents —
 * only a known bad-actor scraper is blocked. The Markdown twins (/*.md, served
 * by /raw) are left crawlable on purpose so retrieval bots can read clean
 * source; each response sends `Link: rel="canonical"` to its HTML page, which
 * keeps the twin from competing with it in the index.
 */
export default function robots(): MetadataRoute.Robots {
  const welcomed = [...aiCrawlers.retrieval, ...aiCrawlers.training];
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...welcomed.map((ua) => ({ userAgent: ua, allow: "/" })),
      { userAgent: [...aiCrawlers.blocked], disallow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
