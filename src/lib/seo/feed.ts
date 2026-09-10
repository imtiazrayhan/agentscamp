import { contentTypes } from "@/lib/content/registry";
import type { ContentItem } from "@/lib/content/types";
import { site } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS 2.0 response for a list of items (already sorted newest-first). Shared by
 * the site-wide feed and the guides-only feed so both stay byte-consistent.
 */
export function rssResponse({
  items,
  title,
  description,
  path,
}: {
  items: ContentItem[];
  title: string;
  description: string;
  path: string;
}): Response {
  const lastBuildDate = (
    items.find((i) => i.date)?.date
      ? new Date(items.find((i) => i.date)!.date!)
      : new Date()
  ).toUTCString();

  const entries = items
    .map((item) => {
      const link = `${site.url}${item.href}`;
      const pubDate = item.date ? new Date(item.date).toUTCString() : undefined;
      return [
        "    <item>",
        `      <title>${escapeXml(item.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <description>${escapeXml(item.description)}</description>`,
        `      <category>${escapeXml(contentTypes[item.type].singular)}</category>`,
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : null,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(site.url)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${site.url}${path}`)}" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
