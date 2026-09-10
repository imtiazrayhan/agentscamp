"use client";

import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { track } from "@/lib/analytics";
import { Section } from "@/components/sections/Section";

export interface RoleEntry {
  slug: string;
  label: string;
  description: string;
  count: number;
  /** Title of the role's first `startHere` item — far more orienting than a count. */
  firstStep?: string;
}

/** Homepage role picker → /for/<role>. Client component only for the GA4 event. */
export function RoleStrip({ roles }: { roles: RoleEntry[] }) {
  return (
    <Section
      title="Start where you are"
      description="Five curated paths through the hub — each opens with what to read first."
      browseHref="/for"
      browseLabel="All roles"
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/for/${r.slug}`}
              onClick={() => track("role_select", { role: r.slug })}
              className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/25"
            >
              <span className="font-semibold leading-snug group-hover:text-primary">
                {r.label}
              </span>
              <span className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                {r.description}
              </span>
              <span className="mt-auto pt-3 text-xs text-muted-foreground">
                {r.firstStep ? (
                  <>
                    Start with{" "}
                    <span className="text-foreground">{r.firstStep}</span>
                  </>
                ) : (
                  <>{r.count.toLocaleString()} resources</>
                )}
              </span>
            </Link>
          </li>
        ))}

        {/* 5 roles into a 3-col grid leaves a hole — fill it rather than dangle. */}
        <li>
          <Link
            href="/topics"
            className="group flex h-full flex-col justify-center rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
          >
            <span className="flex items-center gap-2 font-medium">
              <Compass className="size-4" />
              Not sure? Browse by topic
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-xs">
              All topics
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </li>
      </ul>
    </Section>
  );
}
