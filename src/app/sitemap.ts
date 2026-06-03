import type { MetadataRoute } from "next";
import { getAllContent, contentTypeList } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/how-to-use",
    "/feed.xml",
    ...contentTypeList.map((d) => d.basePath),
  ];

  const staticEntries = staticPaths.map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
  }));

  const contentEntries = getAllContent().map((i) => ({
    url: `${site.url}${i.href}`,
    lastModified: i.updated ? new Date(i.updated) : i.date ? new Date(i.date) : now,
  }));

  return [...staticEntries, ...contentEntries];
}
