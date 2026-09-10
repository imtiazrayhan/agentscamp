import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchCommandBox } from "@/components/search/SearchCommandBox";
import { TriageLinks, type TriageLane } from "./TriageLinks";

/**
 * Server component. The boot animation that used to sit above the <h1> is gone:
 * it delayed the LCP element behind hydration for ~3.5s and told a marketer this
 * was a terminal tool. The h1 now paints with the document.
 *
 * The headline copy is deliberately unchanged — it is stable in search and the
 * redesign has no reason to spend that.
 */
export function Hero({
  total,
  stats,
  lanes,
}: {
  total: number;
  stats: string;
  lanes: TriageLane[];
}) {
  return (
    <section className="py-10 sm:py-16">
      <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
        The field guide to building with AI.
        <br />
        <span className="text-primary">Read. Build. Ship.</span>
      </h1>

      <p className="mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
        In-depth guides, a curated AI tool directory, and a plain-language
        glossary for anyone working with AI — plus ready-to-use agents, skills,
        and commands if you build with Claude Code.
      </p>

      <p className="mt-3 text-sm tabular-nums text-muted-foreground">{stats}</p>

      <SearchCommandBox total={total} className="mt-7" />

      <TriageLinks lanes={lanes} />

      <p className="mt-4 text-sm text-muted-foreground">
        Or{" "}
        <Link
          href="/for"
          className="inline-flex items-center gap-1 font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          pick your role
          <ArrowRight className="size-3.5" />
        </Link>{" "}
        for a curated path through the hub.
      </p>
    </section>
  );
}
