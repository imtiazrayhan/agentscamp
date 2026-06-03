import type { Metadata } from "next";
import type { ContentItem, GuideItem } from "@/lib/content/types";
import { titleCaseLabel } from "@/lib/format";
import { site } from "@/lib/site";

/**
 * THE single per-item Metadata builder — replaces 5 byte-duplicated
 * generateMetadata bodies. Sets canonical, the Markdown-twin alternate, and
 * OG/article tags. It deliberately does NOT set `keywords` (the HTML meta tag is
 * inert and a spam signal) and does NOT set OG images: the colocated
 * `opengraph-image.tsx` per route auto-injects og:image + twitter:image.
 */
export function buildMetadata(item: ContentItem): Metadata {
  const title = item.seoTitle ?? item.title;
  const description = item.seoDescription ?? item.description;
  const isArticle = item.type === "guide";
  const author = (item as GuideItem).author ?? site.name;

  return {
    title,
    description,
    alternates: {
      canonical: item.href,
      types: { "text/markdown": `${item.href}.md` },
    },
    ...(isArticle ? { authors: [{ name: author }] } : {}),
    openGraph: {
      title,
      description,
      url: item.href,
      type: isArticle ? "article" : "website",
      ...(isArticle
        ? {
            publishedTime: item.date,
            modifiedTime: item.updated ?? item.date,
            authors: [author],
            section: titleCaseLabel(item.category),
            tags: item.tags,
          }
        : {}),
    },
    twitter: { title, description },
  };
}

/** Generic Metadata for collection / landing pages (listings, categories, topics, facets). */
export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.path,
      type: "website",
    },
    twitter: { title: opts.title, description: opts.description },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
