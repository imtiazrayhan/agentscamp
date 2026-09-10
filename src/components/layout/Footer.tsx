import Link from "next/link";
import { Search, Kanban, Sparkles } from "lucide-react";
import { contentTypes, audiences } from "@/lib/content/registry";
import { getCountsByType, getByAudience } from "@/lib/content";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/container";
import { site, network } from "@/lib/site";
import { getColorClasses, cn, externalLinkProps } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";
import type { ContentTypeDef } from "@/lib/content/registry";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * Editorial sitemap footer. Plain SERVER component — no "use client", no hooks.
 * Counts come from the sync getCountsByType(); columns are driven from the
 * registry (never hardcoded). Copyright year is static per codebase convention.
 *
 * The search box that used to live here is gone: the nav search is sticky on
 * every page, so a second one 300 lines down was redundant chrome.
 */

/** Icon per network sibling, keyed by its `id` in the site registry. */
const networkIcons: Record<
  (typeof network)[number]["id"],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  optimizecamp: Search,
  gritship: Kanban,
  sureprompts: Sparkles,
};

const endpoints = [
  { href: "/llms.txt", label: "llms.txt" },
  { href: "/sitemap.xml", label: "Sitemap" },
  { href: "/feed.xml", label: "RSS" },
  { href: "/guides/feed.xml", label: "Guides feed" },
];

function TypeLink({ def, count }: { def: ContentTypeDef; count: number }) {
  const accent = getColorClasses(def.id);
  const Icon = def.icon;
  return (
    <li>
      <Link
        href={def.basePath}
        className="group flex items-baseline justify-between gap-3 py-1"
      >
        <span className="flex items-baseline gap-2">
          <Icon className={cn("size-3.5 shrink-0 translate-y-0.5", accent.text)} />
          <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
            {def.label}
          </span>
        </span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {count.toLocaleString()}
        </span>
      </Link>
    </li>
  );
}

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Eyebrow as="h3" className="mb-3 text-foreground">
        {title}
      </Eyebrow>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function TextLink({
  href,
  children,
  vouch,
}: {
  href: string;
  children: React.ReactNode;
  /** First-party identity link (our own profile/package) — keeps it dofollow. */
  vouch?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        {...externalLinkProps(href, { vouch })}
        className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  const counts = getCountsByType();
  const roles = audiences
    .map((a) => ({ ...a, count: getByAudience(a.slug).length }))
    .filter((a) => a.count > 0);

  return (
    <footer className="mt-24 border-t border-border">
      <Container className="py-12">
        <h2 className="sr-only">Site footer — browse AgentsCamp</h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          <Column title="Read">
            <TypeLink def={contentTypes.guide} count={counts.guide} />
            <TypeLink def={contentTypes.tool} count={counts.tool} />
            <TypeLink def={contentTypes.glossary} count={counts.glossary} />
            <TextLink href="/topics">Topics</TextLink>
          </Column>

          <Column title="For Claude Code">
            <TypeLink def={contentTypes.agent} count={counts.agent} />
            <TypeLink def={contentTypes.skill} count={counts.skill} />
            <TypeLink def={contentTypes.command} count={counts.command} />
            <TextLink href="/how-to-use">How to use</TextLink>
            <TextLink href="https://www.npmjs.com/package/agentscamp" vouch>
              npm: agentscamp
            </TextLink>
          </Column>

          <Column title="Start here">
            {roles.map((r) => (
              <TextLink key={r.slug} href={`/for/${r.slug}`}>
                {r.label}
              </TextLink>
            ))}
          </Column>

          <div>
            <Link href="/" aria-label="AgentsCamp home" className="text-base">
              <Logo />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
            <ul className="mt-3 space-y-0.5">
              <TextLink href="/about">About &amp; editorial standards</TextLink>
              <TextLink href="https://x.com/agentscamp" vouch>
                X
              </TextLink>
              <TextLink href="https://github.com/imtiazrayhan/agentscamp" vouch>
                GitHub
              </TextLink>
            </ul>
          </div>
        </div>

        {/* sibling products in the same network */}
        <div className="mt-12">
          <Eyebrow as="h3" className="mb-3 text-foreground">
            Our projects
          </Eyebrow>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {network.map((n) => {
              const Icon = networkIcons[n.id];
              return (
                <li key={n.id}>
                  <Link
                    href={n.url}
                    {...externalLinkProps(n.url)}
                    className="group flex items-start gap-2"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span>
                      <span className="block text-sm font-medium transition-colors group-hover:text-primary">
                        {n.name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {n.tagline}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AgentsCamp. All rights reserved.</p>
          <ul className="flex flex-wrap gap-4">
            {endpoints.map((e) => (
              <li key={e.href}>
                <Link
                  href={e.href}
                  target="_blank"
                  className="transition-colors hover:text-foreground"
                >
                  {e.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
