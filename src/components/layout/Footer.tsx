import Link from "next/link";
import {
  BookOpen,
  Map as SitemapIcon,
  Rss,
  Hash,
  FileText,
  Search,
  Kanban,
  Sparkles,
} from "lucide-react";
import { contentTypeList } from "@/lib/content/registry";
import { getCountsByType } from "@/lib/content";
import { Logo } from "@/components/brand/Logo";
import { SearchCommandBox } from "@/components/search/SearchCommandBox";
import { site, network } from "@/lib/site";
import type { ComponentType, SVGProps } from "react";

/**
 * Site footer, styled as the tail of a terminal session. A prompt header with
 * a live `[ NN ok ]` status chip, a hero-matched `$ search` command box, the
 * content types rendered as a directory listing (label + route + tagline +
 * live count), a `man`/`cat`-flavored resources block, and a closing prompt
 * sign-off with the signature blinking cursor.
 *
 * Plain SERVER component — no "use client", no hooks. Counts come from the sync
 * getCountsByType(); the content nav is driven entirely from contentTypeList
 * (never hardcoded). Copyright year is static per codebase convention.
 */

const pad = (n: number) => String(n).padStart(2, "0");

const resources = [
  {
    href: "/how-to-use",
    label: "How to use",
    cmd: "man how-to-use",
    icon: BookOpen,
    external: false,
  },
  {
    href: "/topics",
    label: "Topics",
    cmd: "ls topics",
    icon: Hash,
    external: false,
  },
  {
    href: "/llms.txt",
    label: "llms.txt",
    cmd: "cat llms.txt",
    icon: FileText,
    external: true,
  },
  {
    href: "/sitemap.xml",
    label: "Sitemap",
    cmd: "cat sitemap.xml",
    icon: SitemapIcon,
    external: true,
  },
  {
    href: "/feed.xml",
    label: "RSS feed",
    cmd: "curl feed.xml",
    icon: Rss,
    external: true,
  },
] as const;

/** Icon per network sibling, keyed by its `id` in the site registry. */
const networkIcons: Record<
  (typeof network)[number]["id"],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  optimizecamp: Search,
  gritship: Kanban,
  sureprompts: Sparkles,
};

export function Footer() {
  const counts = getCountsByType();
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-card/40">
      {/* faint terminal grid — decorative only */}
      <div
        aria-hidden
        className="grid-pattern pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <h2 className="sr-only">Site footer — browse AgentsCamp</h2>

        {/* ── prompt header: brand + path + live status chip ──────────── */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm">
          <Link
            href="/"
            aria-label={`${site.name} home`}
            className="inline-flex items-center rounded-sm text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Logo className="text-base" markClassName="text-glow" blink />
          </Link>
          <span className="text-muted-foreground">~/agentscamp</span>
          <span
            className="ml-auto inline-flex items-center rounded-sm border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs tabular-nums text-primary"
            aria-label={`${total} resources in the hub`}
          >
            [ {pad(total)} ok ]
          </span>
        </div>

        {/* ── primary action: a hero-matched search command box ───────── */}
        <SearchCommandBox total={total} className="mt-6" />

        {/* ── content types as a directory listing ────────────────────── */}
        <nav aria-label="Browse the hub" className="mt-10">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {"// browse the hub"}
          </h3>
          <ul className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {contentTypeList.map((def) => {
              const Icon = def.icon;
              const count = counts[def.id] ?? 0;
              return (
                <li key={def.id}>
                  <Link
                    href={def.basePath}
                    className="group flex items-center gap-3 rounded-sm border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon
                      className="size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="flex items-baseline gap-2">
                        <span className="font-mono text-sm text-foreground transition-colors group-hover:text-primary">
                          {def.label}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {def.basePath}
                        </span>
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {def.tagline}
                      </span>
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-xs tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
                      {pad(count)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── resources + projects + about ────────────────────────────── */}
        <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-3">
          <nav aria-label="Resources">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {"// resources"}
            </h3>
            <ul className="mt-4 space-y-1">
              {resources.map((r) => {
                const Icon = r.icon;
                const inner = (
                  <>
                    <Icon
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="font-mono text-sm text-foreground transition-colors group-hover:text-primary">
                        {r.label}
                      </span>
                      <span className="truncate font-mono text-xs text-muted-foreground">
                        <span className="text-primary">$</span> {r.cmd}
                      </span>
                    </span>
                  </>
                );
                const cls =
                  "group -mx-2 flex items-start gap-3 rounded-sm px-2 py-1.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
                return (
                  <li key={r.href}>
                    {r.external ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cls}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={r.href} className={cls}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <nav aria-label="Our other projects">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {"// our projects"}
            </h3>
            <ul className="mt-4 space-y-1">
              {network.map((p) => {
                const Icon = networkIcons[p.id];
                return (
                  <li key={p.id}>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group -mx-2 flex items-start gap-3 rounded-sm px-2 py-1.5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                        aria-hidden
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="font-mono text-sm text-foreground transition-colors group-hover:text-primary">
                          {p.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {p.tagline}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {"// about"}
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
          </div>
        </div>

        {/* ── sign-off prompt + copyright ─────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2">
            <span className="text-muted-foreground">~/agentscamp</span>
            <span className="text-primary text-glow">$</span>
            <span className="text-foreground">{site.tagline.toLowerCase()}</span>
            <span className="cursor-blink text-primary" aria-hidden>
              ▍
            </span>
          </p>
          <p>© 2026 {site.name}. all rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
