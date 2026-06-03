import type { ContentItem } from "./content/types";
import { site } from "./site";

/**
 * Per-item structured data. Guides -> TechArticle, Tools -> SoftwareApplication,
 * agents/skills/commands -> CreativeWork (they are prompts/instructions, not apps,
 * so SoftwareApplication would risk structured-data spam flags).
 */
export function jsonLdFor(item: ContentItem): Record<string, unknown> {
  const base = {
    "@context": "https://schema.org",
    name: item.title,
    description: item.description,
    url: `${site.url}${item.href}`,
  };

  if (item.type === "guide") {
    return {
      ...base,
      "@type": "TechArticle",
      datePublished: item.date,
      dateModified: item.updated ?? item.date,
      ...(item.author
        ? { author: { "@type": "Organization", name: item.author } }
        : {}),
      publisher: { "@type": "Organization", name: site.name },
    };
  }

  if (item.type === "tool") {
    return {
      ...base,
      "@type": "SoftwareApplication",
      applicationCategory: "DeveloperApplication",
    };
  }

  return { ...base, "@type": "CreativeWork" };
}
