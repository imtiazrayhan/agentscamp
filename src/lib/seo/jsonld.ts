import type {
  ContentItem,
  GuideItem,
  ToolItem,
} from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { getContentByType } from "@/lib/content";
import { titleCaseLabel } from "@/lib/format";
import { site, locale } from "@/lib/site";
import { canonicalUrl, markdownUrl } from "./artifact";

/**
 * One @id-linked schema.org @graph per page. Every node references the shared
 * root #organization / #website nodes (rendered once in the layout), and within
 * a page WebPage -> BreadcrumbList -> primary entity are all wired by @id, so a
 * crawler reconciles one entity graph instead of disconnected islands.
 *
 * Driven entirely by ContentItem, so every current + future file gets correct
 * markup for free. Server-only (rendered in Server Components / routes).
 */

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const LOGO_ID = `${site.url}/#logo`;

type Node = Record<string, unknown>;

const abs = (path: string) => `${site.url}${path}`;
const pageId = (path: string) => `${abs(path)}#webpage`;
const crumbId = (path: string) => `${abs(path)}#breadcrumb`;
const entityId = (path: string, suffix: string) => `${abs(path)}#${suffix}`;

/** Root nodes for the site graph (layout). */
export function orgNode(): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: abs(site.logo),
      contentUrl: abs(site.logo),
    },
    image: { "@id": LOGO_ID },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": ORG_ID },
    inLanguage: locale,
  };
}

/** The whole-site graph rendered once in the root layout. */
export function siteGraph(): Node {
  return { "@context": "https://schema.org", "@graph": [orgNode(), websiteNode()] };
}

// --- breadcrumbs: single source feeding the visual <Breadcrumbs> AND JSON-LD ---

export interface Crumb {
  label: string;
  href?: string;
}

export function breadcrumbsFor(item: ContentItem): Crumb[] {
  const def = contentTypes[item.type];
  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: def.label, href: def.basePath },
  ];
  if (item.type === "tool") {
    // Only link the tool-category facet when it is indexable (>= 2 tools, matching
    // collections' MIN_INDEXABLE); otherwise an indexable page's breadcrumb would
    // point at a noindex facet. Single-tool categories simply drop the crumb.
    const count = getContentByType("tool").filter(
      (t) => t.category === item.category,
    ).length;
    if (count >= 2) {
      crumbs.push({
        label: titleCaseLabel(item.category),
        href: `/tools/category/${item.category}`,
      });
    }
  } else {
    crumbs.push({
      label: titleCaseLabel(item.category),
      href: `${def.basePath}/${item.category}`,
    });
  }
  crumbs.push({ label: item.title });
  return crumbs;
}

function breadcrumbNode(crumbs: Crumb[], id: string): Node {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: abs(c.href) } : {}),
    })),
  };
}

// --- helpers ---

/** Only emit dates that resolve (else Rich Results flags `datePublished: null`). */
function dateFields(item: ContentItem): Node {
  if (!item.date) return {};
  return { datePublished: item.date, dateModified: item.updated ?? item.date };
}

/** Org author today; Person seam for when real bylines exist (no fabricated credentials). */
function authorNode(item: ContentItem): Node {
  const author = (item as GuideItem).author;
  if (author && author !== site.name) return { "@type": "Person", name: author };
  return { "@id": ORG_ID };
}

function faqNode(item: ContentItem, path: string): Node | null {
  if (!item.faq.length) return null;
  return {
    "@type": "FAQPage",
    "@id": entityId(path, "faqpage"),
    isPartOf: { "@id": pageId(path) },
    mainEntity: item.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function howtoNode(item: ContentItem, path: string): Node | null {
  if (item.type !== "guide" || !item.howtoSteps.length) return null;
  return {
    "@type": "HowTo",
    "@id": entityId(path, "howto"),
    name: item.title,
    description: item.description,
    step: item.howtoSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** The primary entity node for an item (its real-world "thing"). */
function primaryEntity(item: ContentItem, path: string): Node {
  const url = canonicalUrl(item);
  const common: Node = {
    name: item.title,
    description: item.description,
    mainEntityOfPage: { "@id": pageId(path) },
    ...(item.keywords.length ? { keywords: item.keywords.join(", ") } : {}),
  };

  if (item.type === "guide") {
    const g = item as GuideItem;
    return {
      "@type": "TechArticle",
      "@id": entityId(path, "article"),
      url,
      headline: item.title.slice(0, 110),
      ...common,
      ...dateFields(item),
      author: authorNode(item),
      publisher: { "@id": ORG_ID },
      inLanguage: locale,
      wordCount: g.wordCount,
      articleSection: titleCaseLabel(item.category),
      ...(item.image ? { image: abs(item.image) } : {}),
    };
  }

  if (item.type === "tool") {
    const t = item as ToolItem;
    const sameAs = [t.repo, ...t.sameAs].filter(Boolean) as string[];
    return {
      "@type": "SoftwareApplication",
      "@id": entityId(path, "software"),
      ...common,
      url: t.url, // the official external site
      applicationCategory: "DeveloperApplication",
      ...(t.os.length ? { operatingSystem: t.os.join(", ") } : {}),
      ...(sameAs.length ? { sameAs } : {}),
      ...(t.license ? { license: t.license } : {}),
      // Truthful only: a genuinely free tool. Never open-source (which has cost
      // models), never a fabricated aggregateRating (manual-action risk).
      ...(t.pricing === "free"
        ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }
        : {}),
    };
  }

  // agent / skill / command -> installable source artifact.
  return {
    "@type": "SoftwareSourceCode",
    "@id": entityId(path, "code"),
    url,
    ...common,
    codeRepository: markdownUrl(item),
    downloadUrl: markdownUrl(item),
    programmingLanguage: { "@type": "ComputerLanguage", name: "Markdown" },
    author: { "@id": ORG_ID },
    ...dateFields(item),
  };
}

/** Full @graph for a detail page. */
export function graphFor(item: ContentItem): Node {
  const path = item.href;
  const entity = primaryEntity(item, path);
  const webpage: Node = {
    "@type": "WebPage",
    "@id": pageId(path),
    url: canonicalUrl(item),
    name: item.title,
    description: item.description,
    isPartOf: { "@id": SITE_ID },
    breadcrumb: { "@id": crumbId(path) },
    mainEntity: { "@id": entity["@id"] },
    inLanguage: locale,
    ...dateFields(item),
  };

  const nodes: Node[] = [
    webpage,
    breadcrumbNode(breadcrumbsFor(item), crumbId(path)),
    entity,
  ];
  const faq = faqNode(item, path);
  if (faq) nodes.push(faq);
  const howto = howtoNode(item, path);
  if (howto) nodes.push(howto);

  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Full @graph for a listing / category / topic collection page. */
export function collectionGraph(opts: {
  path: string;
  name: string;
  description: string;
  items: ContentItem[];
  crumbs: Crumb[];
  lastModified?: string;
  faq?: { q: string; a: string }[];
}): Node {
  const { path, name, description, items, crumbs, lastModified, faq } = opts;
  const listId = entityId(path, "list");
  const collectionPage: Node = {
    "@type": "CollectionPage",
    "@id": pageId(path),
    url: abs(path),
    name,
    description,
    isPartOf: { "@id": SITE_ID },
    breadcrumb: { "@id": crumbId(path) },
    mainEntity: { "@id": listId },
    inLanguage: locale,
    ...(lastModified ? { dateModified: lastModified } : {}),
  };
  const itemList: Node = {
    "@type": "ItemList",
    "@id": listId,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: canonicalUrl(it),
      name: it.title,
    })),
  };
  const nodes: Node[] = [
    collectionPage,
    breadcrumbNode(crumbs, crumbId(path)),
    itemList,
  ];
  // Tie the visible listing FAQ into the same connected graph (AEO/GEO). Only
  // emitted alongside the rendered <FaqSection>, never hidden-only markup.
  if (faq?.length) {
    nodes.push({
      "@type": "FAQPage",
      "@id": entityId(path, "faqpage"),
      isPartOf: { "@id": pageId(path) },
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Standalone FAQPage graph (for static pages like /how-to-use). */
export function faqPageGraph(
  path: string,
  faq: { q: string; a: string }[],
): Node {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": entityId(path, "faqpage"),
        url: abs(path),
        isPartOf: { "@id": SITE_ID },
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
