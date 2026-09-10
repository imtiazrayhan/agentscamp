import { getNewest, contentTypes } from "@/lib/content";
import { rssResponse } from "@/lib/seo/feed";
import { site } from "@/lib/site";

// Guides-only feed: the site-wide feed is dominated by installables and
// glossary entries, so readers who want new articles subscribe here.
export const dynamic = "force-static";

export function GET() {
  return rssResponse({
    items: getNewest(50, "guide"),
    title: `${site.name} — Guides`,
    description: contentTypes.guide.description,
    path: "/guides/feed.xml",
  });
}
