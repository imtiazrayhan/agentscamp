"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { Section } from "@/components/sections/Section";

export interface RoleEntry {
  slug: string;
  label: string;
  description: string;
  count: number;
}

/** Homepage role picker → /for/<role>. Client component only for the GA4 event. */
export function RoleStrip({ roles }: { roles: RoleEntry[] }) {
  return (
    <Section
      title="Who are you?"
      description="Pick a role for a curated path through the hub"
      browseHref="/for"
      browseLabel="All roles"
      className="py-0"
    >
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/for/${r.slug}`}
              onClick={() => track("role_select", { role: r.slug })}
              className="group flex h-full flex-col rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <span className="font-semibold leading-snug group-hover:text-primary">
                {r.label}
              </span>
              <span className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                {r.description}
              </span>
              <span className="mt-auto inline-flex items-center gap-1 pt-3 font-mono text-xs text-primary">
                {r.count} resources
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
