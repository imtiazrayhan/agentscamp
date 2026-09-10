import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getCountsByType,
  getFeatured,
  getNewest,
  getByTopic,
  getByAudience,
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
import { cn } from "@/lib/utils";

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
  const big = span.includes("row-span-2");
  return (
    <Link
      href={def.basePath}
      className={cn(
        "group relative flex flex-col rounded-md border border-border bg-card p-5 transition-colors hover:border-primary/50",
        span,
      )}
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Icon className="size-4 text-primary" />
          {def.label}
        </span>
        <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{def.tagline}</p>
      {big && featured.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {featured.map((f) => (
            <li
              key={f.href}
              className="truncate font-mono text-sm text-foreground/80"
            >
              <span className="text-primary">→</span> {f.title}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-auto inline-flex items-center gap-1 pt-5 font-mono text-sm text-primary">
        browse
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
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
    .filter((t) => t.count > 0);
  const roleEntries = audiences
    .map((a) => ({
      slug: a.slug,
      label: a.label,
      description: a.description,
      count: getByAudience(a.slug).length,
    }))
    .filter((a) => a.count > 0);

  const bootLines = contentTypeList.map((d) => ({
    label: d.label.toLowerCase(),
    count: counts[d.id],
  }));

  return (
    <div className="space-y-10">
      <Hero lines={bootLines} total={total} />

      {roleEntries.length > 0 && <RoleStrip roles={roleEntries} />}

      {latestGuides.length > 0 && (
        <Section
          title="Latest guides"
          description="New tutorials and deep-dives"
          browseHref="/guides"
          browseLabel="All guides"
        >
          <ContentGrid>
            {latestGuides.map((item) => (
              <ContentCard key={item.href} item={item} />
            ))}
          </ContentGrid>
        </Section>
      )}

      <section className="grid grid-cols-1 gap-3 sm:auto-rows-[1fr] sm:grid-cols-4">
        {contentTypeList.map((def) => (
          <BentoTile
            key={def.id}
            def={def}
            count={counts[def.id]}
            featured={getFeatured(def.id, 3)}
            span={SPANS[def.id]}
          />
        ))}
      </section>

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
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10"
              >
                {t.label}
                <span className="font-mono text-xs text-muted-foreground">
                  {t.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Secondary: the npm CLI, for readers who'd rather install from the terminal. */}
      <section className="flex flex-col gap-3 rounded-md border border-border bg-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            // also available as a CLI
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prefer the terminal? The{" "}
            <code className="font-mono text-foreground">agentscamp</code> npm
            package installs any agent, skill, or command into Claude Code.{" "}
            <Link
              href="/how-to-use#cli"
              className="font-mono text-primary hover:underline"
            >
              how it works →
            </Link>
          </p>
        </div>
        <div className="inline-flex max-w-full items-center gap-1 self-start rounded-md border border-border bg-background py-1.5 pl-3 pr-1.5">
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
