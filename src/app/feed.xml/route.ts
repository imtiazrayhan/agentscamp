import { getNewest } from "@/lib/content";
import { rssResponse } from "@/lib/seo/feed";
import { site } from "@/lib/site";

// Pure SSG: render the feed once at build time, same as the rest of the site.
export const dynamic = "force-static";

export function GET() {
  return rssResponse({
    items: getNewest(50),
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    path: "/feed.xml",
  });
}
