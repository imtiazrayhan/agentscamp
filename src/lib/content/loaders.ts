import {
  agentFrontmatter,
  skillFrontmatter,
  guideFrontmatter,
  toolFrontmatter,
  commandFrontmatter,
  glossaryFrontmatter,
} from "./schemas";
import {
  loadCategorized,
  loadFlat,
  readingTime,
  wordCount,
  toList,
  titleCase,
  isoDate,
  type RawDoc,
} from "./markdown";
import { hrefFor } from "./paths";
import type {
  AgentItem,
  SkillItem,
  GuideItem,
  ToolItem,
  CommandItem,
  GlossaryItem,
  ContentItem,
  FaqEntry,
  HowtoStep,
} from "./types";

/** Throw with file path + flattened zod issues for a clear build failure. */
function parseOrThrow<T>(
  schema: { safeParse: (d: unknown) => { success: boolean; data?: T; error?: { issues: { path: (string | number)[]; message: string }[] } } },
  doc: RawDoc,
): T {
  const res = schema.safeParse(doc.data);
  if (!res.success) {
    const issues = (res.error?.issues ?? [])
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${doc.file}:\n${issues}`);
  }
  return res.data as T;
}

const base = (doc: RawDoc, fm: Record<string, unknown>) => ({
  slug: doc.slug,
  tags: (fm.tags as string[]) ?? [],
  topics: (fm.topics as string[]) ?? [],
  featured: Boolean(fm.featured),
  related: (fm.related as string[]) ?? [],
  date: isoDate(fm.date),
  updated: isoDate(fm.updated),
  seoTitle: fm.seoTitle as string | undefined,
  seoDescription: fm.seoDescription as string | undefined,
  keywords: (fm.keywords as string[]) ?? [],
  image: fm.image as string | undefined,
  summary: fm.summary as string | undefined,
  keyTakeaways: (fm.keyTakeaways as string[]) ?? [],
  faq: (fm.faq as FaqEntry[]) ?? [],
});

export function loadAgents(): AgentItem[] {
  return loadCategorized("agents").map((doc) => {
    const fm = parseOrThrow<Record<string, unknown>>(agentFrontmatter, doc);
    return {
      type: "agent",
      category: doc.category,
      title: (fm.title as string) ?? titleCase(doc.slug),
      description: fm.description as string,
      color: fm.color as AgentItem["color"],
      model: fm.model as AgentItem["model"],
      tools: toList(fm.tools),
      href: hrefFor("agent", doc.category, doc.slug),
      body: doc.body,
      ...base(doc, fm),
    } satisfies AgentItem;
  });
}

export function loadSkills(): SkillItem[] {
  return loadCategorized("skills").map((doc) => {
    const fm = parseOrThrow<Record<string, unknown>>(skillFrontmatter, doc);
    return {
      type: "skill",
      category: doc.category,
      title: (fm.title as string) ?? titleCase(doc.slug),
      description: fm.description as string,
      color: fm.color as SkillItem["color"],
      allowedTools: toList(fm["allowed-tools"]),
      userInvocable: fm["user-invocable"] as boolean | undefined,
      version: fm.version as string | undefined,
      resources: fm.resources as SkillItem["resources"],
      multiFile: Boolean(fm.multiFile),
      href: hrefFor("skill", doc.category, doc.slug),
      body: doc.body,
      ...base(doc, fm),
    } satisfies SkillItem;
  });
}

export function loadGuides(): GuideItem[] {
  return loadCategorized("guides").map((doc) => {
    const fm = parseOrThrow<Record<string, unknown>>(guideFrontmatter, doc);
    return {
      type: "guide",
      category: doc.category,
      title: fm.title as string,
      description: fm.description as string,
      color: fm.color as GuideItem["color"],
      author: fm.author as string | undefined,
      depth: fm.depth as GuideItem["depth"],
      sources: (fm.sources as GuideItem["sources"]) ?? [],
      readingTime: readingTime(doc.body),
      wordCount: wordCount(doc.body),
      howtoSteps: (fm.howtoSteps as HowtoStep[]) ?? [],
      href: hrefFor("guide", doc.category, doc.slug),
      body: doc.body,
      ...base(doc, fm),
    } satisfies GuideItem;
  });
}

export function loadTools(): ToolItem[] {
  return loadFlat("tools").map((doc) => {
    const fm = parseOrThrow<Record<string, unknown>>(toolFrontmatter, doc);
    return {
      type: "tool",
      category: fm.category as string,
      title: (fm.title as string) ?? titleCase(doc.slug),
      description: fm.description as string,
      color: fm.color as ToolItem["color"],
      url: fm.url as string,
      pricing: fm.pricing as ToolItem["pricing"],
      logo: fm.logo as string | undefined,
      repo: fm.repo as string | undefined,
      os: (fm.os as ToolItem["os"]) ?? [],
      alternativeTo: (fm.alternativeTo as string[]) ?? [],
      license: fm.license as string | undefined,
      sameAs: (fm.sameAs as string[]) ?? [],
      href: hrefFor("tool", "", doc.slug),
      body: doc.body,
      ...base(doc, fm),
    } satisfies ToolItem;
  });
}

export function loadCommands(): CommandItem[] {
  return loadCategorized("commands").map((doc) => {
    const fm = parseOrThrow<Record<string, unknown>>(commandFrontmatter, doc);
    return {
      type: "command",
      category: doc.category,
      title: (fm.title as string) ?? titleCase(doc.slug),
      description: fm.description as string,
      color: fm.color as CommandItem["color"],
      argumentHint: fm["argument-hint"] as string | undefined,
      allowedTools: toList(fm["allowed-tools"]),
      model: fm.model as CommandItem["model"],
      href: hrefFor("command", doc.category, doc.slug),
      body: doc.body,
      ...base(doc, fm),
    } satisfies CommandItem;
  });
}

export function loadGlossary(): GlossaryItem[] {
  return loadFlat("glossary").map((doc) => {
    const fm = parseOrThrow<Record<string, unknown>>(glossaryFrontmatter, doc);
    const term = fm.term as string;
    return {
      type: "glossary",
      // Flat URL space; "term" is a constant pseudo-category so shared code
      // (chips, breadcrumb fallbacks) has something sensible to render.
      category: "term",
      term,
      title: (fm.title as string) ?? term,
      description: fm.description as string,
      color: fm.color as GlossaryItem["color"],
      href: hrefFor("glossary", "", doc.slug),
      body: doc.body,
      ...base(doc, fm),
    } satisfies GlossaryItem;
  });
}

export const loaders = {
  agent: loadAgents,
  skill: loadSkills,
  guide: loadGuides,
  tool: loadTools,
  command: loadCommands,
  glossary: loadGlossary,
} as const;

export function loadAllByType(): Record<string, ContentItem[]> {
  return {
    agent: loadAgents(),
    skill: loadSkills(),
    guide: loadGuides(),
    tool: loadTools(),
    command: loadCommands(),
    glossary: loadGlossary(),
  };
}
