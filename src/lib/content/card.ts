import type {
  AgentItem,
  SkillItem,
  GuideItem,
  ToolItem,
  CommandItem,
  GlossaryItem,
  ContentItem,
} from "./types";

/**
 * The projection a ContentCard actually renders.
 *
 * `TypeListing` hands its items to a client component, so everything on them is
 * serialized into the RSC payload. Stripping only `body` left `faq`,
 * `keyTakeaways`, `howtoSteps`, `sources`, `summary`, `seoDescription` and
 * `wordCount` on every item — ~5 KB each, so /guides shipped ~1.2 MB of HTML to
 * render nine cards.
 *
 * Each member is a `Pick` of a union member, so the `type` literal survives and
 * ContentCard's existing switch still narrows. ContentItem stays assignable to
 * CardItem, so server-rendered callers can keep passing full items.
 *
 * CLIENT-SAFE: no `fs`, no loaders.
 */
type Base =
  | "type"
  | "slug"
  | "href"
  | "title"
  | "description"
  | "category"
  | "tags"
  | "date"
  | "updated";

export type CardItem =
  | Pick<AgentItem, Base | "model" | "tools">
  | Pick<SkillItem, Base | "userInvocable" | "multiFile" | "version">
  | Pick<GuideItem, Base | "readingTime" | "author" | "depth">
  | Pick<ToolItem, Base | "pricing">
  | Pick<CommandItem, Base | "argumentHint">
  | Pick<GlossaryItem, Base>;

export function toCard(i: ContentItem): CardItem {
  const base = {
    type: i.type,
    slug: i.slug,
    href: i.href,
    title: i.title,
    description: i.description,
    category: i.category,
    tags: i.tags,
    date: i.date,
    updated: i.updated,
  };

  switch (i.type) {
    case "agent":
      return { ...base, type: "agent", model: i.model, tools: i.tools };
    case "skill":
      return {
        ...base,
        type: "skill",
        userInvocable: i.userInvocable,
        multiFile: i.multiFile,
        version: i.version,
      };
    case "guide":
      return {
        ...base,
        type: "guide",
        readingTime: i.readingTime,
        author: i.author,
        depth: i.depth,
      };
    case "tool":
      return { ...base, type: "tool", pricing: i.pricing };
    case "command":
      return { ...base, type: "command", argumentHint: i.argumentHint };
    case "glossary":
      return { ...base, type: "glossary" };
  }
}
