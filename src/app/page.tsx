import Link from "next/link";
import {
  getCountsByType,
  getFeatured,
  getNewest,
  getByTopic,
  getByAudience,
  getAllContent,
  contentTypeList,
  topics,
  audiences,
} from "@/lib/content";
import type { ContentTypeId, ContentItem } from "@/lib/content/types";
import type { ContentTypeDef } from "@/lib/content/registry";
import { Hero } from "@/components/sections/Hero";
import { RoleStrip } from "@/components/sections/RoleStrip";
import { Section } from "@/components/sections/Section";
import { ContentGrid } from "@/components/content/ContentGrid";
import { ContentCard } from "@/components/content/ContentCard";
import { CopyButton } from "@/components/content/CopyButton";
import { getColorClasses, cn } from "@/lib/utils";

// The CLI is a secondary path — it lives in the strip at the bottom of the page.
const CLI_CMD = "npx agentscamp add skills/dependency-audit";

// 4-col bento in contentTypeList order; spans sum to full rows (4+1+1+2+2+2).
const SPANS: Record<ContentTypeId, string> = {
  guide: "sm:col-span-2 sm:row-span-2",
  tool: "sm:col-span-1",
  glossary: "sm:col-span-1",
  agent: "sm:col-span-2",
  skill: "sm:col-span-2",
  command: "sm:col-span-2",
};

function BentoTile({
  def,
  count,
  featured,
  span,
}: {
  def: ContentTypeDef;
  count: number;
  featured: ContentItem[];
  span: string;
}) {
  const Icon = def.icon;
  const accent = getColorClasses(def.id);
  const big = span.includes("row-span-2");
  return (
    <Link
      href={def.basePath}
      className={cn(
        "group relative flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/25",
        span,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2">
          <span
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-md",
              accent.chip,
            )}
          >
            <Icon className="size-4" />
          </span>
          <span className="text-sm font-semibold">{def.label}</span>
        </span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {count.toLocaleString()}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{def.tagline}</p>
      {big && featured.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
          {featured.map((f) => (
            <li key={f.href} className="truncate text-sm text-foreground/80">
              {f.title}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary">
        Browse
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}

export default function Home() {
  const counts = getCountsByType();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const latestGuides = getNewest(6, "guide");
  const topicEntries = topics
    .map((t) => ({ ...t, count: getByTopic(t.slug).length }))
    .filter((t) => t.count > 0)
    // Registry declaration order put a 2-item topic above a 60-item one.
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  // `startHere` refs are "type:slug" — same resolution the role pages use
  // (see audienceCollection in lib/seo/collections.ts).
  const byId = new Map(getAllContent().map((i) => [`${i.type}:${i.slug}`, i]));
  const roleEntries = audiences
    .map((a) => {
      const first = a.startHere[0];
      return {
        slug: a.slug,
        label: a.label,
        description: a.description,
        count: getByAudience(a.slug).length,
        firstStep: first ? byId.get(first)?.title : undefined,
      };
    })
    .filter((a) => a.count > 0);

  const stats = [
    `${total.toLocaleString()} resources`,
    `${counts.guide} guides`,
    `${counts.tool} tools`,
    `${counts.glossary} glossary terms`,
  ].join(" · ");

  const lanes = [
    {
      id: "new",
      question: "New to AI?",
      label: "Start with the glossary",
      href: "/glossary",
    },
    {
      id: "claude-code",
      question: "Building with Claude Code?",
      label: "Developer path",
      href: "/for/developers",
    },
    {
      id: "compare",
      question: "Comparing tools?",
      label: "Tool directory",
      href: "/tools",
    },
  ];

  return (
    <div>
      <Hero total={total} stats={stats} lanes={lanes} />

      {roleEntries.length > 0 && <RoleStrip roles={roleEntries} />}

      <Section
        title="Browse by type"
        description="Six kinds of resource, from long-form guides to installable Claude Code artifacts."
      >
        <div className="grid grid-cols-1 gap-3 sm:auto-rows-[1fr] sm:grid-cols-4">
          {contentTypeList.map((def) => (
            <BentoTile
              key={def.id}
              def={def}
              count={counts[def.id]}
              featured={getFeatured(def.id, 3)}
              span={SPANS[def.id]}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Browse by topic"
        browseHref="/topics"
        browseLabel="All topics"
      >
        <ul className="flex flex-wrap gap-2">
          {topicEntries.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/topics/${t.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-foreground/25"
              >
                {t.label}
                <span className="text-xs tabular-nums text-muted-foreground">
                  {t.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {latestGuides.length > 0 && (
        <Section
          title="Latest guides"
          description="New tutorials and deep-dives"
          browseHref="/guides"
          browseLabel="All guides"
        >
          <ContentGrid>
            {latestGuides.map((item) => (
              <ContentCard key={item.href} item={item} showType={false} />
            ))}
          </ContentGrid>
        </Section>
      )}

      {/* Secondary: the npm CLI, for readers who'd rather install from the terminal. */}
      <section className="mb-4 mt-10 flex flex-col gap-3 rounded-lg border border-border bg-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Prefer the terminal?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The <code className="font-mono text-foreground">agentscamp</code> npm
            package installs any agent, skill, or command into Claude Code.{" "}
            <Link
              href="/how-to-use#cli"
              className="font-medium text-primary hover:underline"
            >
              How it works →
            </Link>
          </p>
        </div>
        <div className="inline-flex max-w-full items-center gap-1 self-start rounded-md border border-input bg-background py-1.5 pl-3 pr-1.5">
          <code className="truncate font-mono text-xs">
            <span className="select-none text-primary">$ </span>
            {CLI_CMD}
          </code>
          <CopyButton
            text={CLI_CMD}
            iconOnly
            className="shrink-0 border-0 bg-transparent hover:bg-secondary"
            eventLabel="home_install"
          />
        </div>
      </section>
    </div>
  );
}
