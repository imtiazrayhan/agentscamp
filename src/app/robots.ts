import type { MetadataRoute } from "next";
import { site, aiCrawlers } from "@/lib/site";

/**
 * Open by default. AI crawlers are explicitly welcomed (retrieval AND training)
 * so AI answers can cite AgentsCamp and the hub stays discoverable to agents —
 * only a known bad-actor scraper is blocked. The Markdown twins under /raw are
 * left crawlable on purpose (kept out of the index by an X-Robots-Tag header,
 * not by robots.txt) so retrieval bots can read clean source.
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
