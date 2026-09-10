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
 *
 * NEVER add an `openGraph.images` key here. Next merges file-convention OG
 * images per segment and skips them the moment the segment's own metadata
 * declares `images` — doing so would silently kill all 7 per-item generators.
 */
export function buildMetadata(item: ContentItem): Metadata {
  const title = item.seoTitle ?? item.title;
  const description = item.seoDescription ?? item.description;
  const isArticle = item.type === "guide";
  const author = (item as GuideItem).author ?? site.name;
  const authorMetadata = {
    name: author,
    ...(author === site.name ? { url: "/about" } : {}),
  };

  return {
    title,
    description,
    // `alternates` replaces the layout's wholesale, so the RSS autodiscovery
    // link must be re-declared here or it only exists on `/`.
    alternates: {
      canonical: item.href,
      types: {
        "text/markdown": `${item.href}.md`,
        "application/rss+xml": `${site.url}${item.type === "guide" ? "/guides/feed.xml" : "/feed.xml"}`,
      },
    },
    ...(isArticle ? { authors: [authorMetadata] } : {}),
    // Next merges Metadata field-by-field but REPLACES object fields wholesale,
    // so we must re-declare the inherited siteName / twitter.card etc. here or
    // they are dropped from every page that uses this helper.
    openGraph: {
      title,
      description,
      url: item.href,
      siteName: site.name,
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * The site-wide OG card (src/app/opengraph-image.tsx). Collection pages have no
 * colocated generator, so without this they emit `twitter:card=summary_large_image`
 * with no image at all.
 */
const siteOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.tagline}`,
};

/** Generic Metadata for collection / landing pages (listings, categories, topics, facets). */
export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  /** RSS feed advertised for autodiscovery (defaults to the site-wide feed). */
  feed?: string;
  /**
   * Override the share card. Pass this ONLY on routes with no colocated
   * `opengraph-image.tsx` — declaring `images` makes Next skip that generator.
   */
  image?: string;
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: opts.path,
      types: { "application/rss+xml": `${site.url}${opts.feed ?? "/feed.xml"}` },
    },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.path,
      siteName: site.name,
      type: "website",
      images: [opts.image ? { url: opts.image, width: 1200, height: 630 } : siteOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
