import { SearchCommandBox } from "@/components/search/SearchCommandBox";
import { TriageLinks, type TriageLane } from "./TriageLinks";

/**
 * Server component. The boot animation that used to sit above the <h1> is gone:
 * it delayed the LCP element behind hydration for ~3.5s and told a marketer this
 * was a terminal tool. The h1 now paints with the document.
 *
 * The headline copy is deliberately unchanged — it is stable in search and the
 * redesign has no reason to spend that.
 *
 * Rank order is h1 -> search -> triage -> stats. It used to be h1 followed by
 * four consecutive muted lines at two sizes, with the stats line wedged between
 * the lead and the search box and a trailing "or pick your role" sentence that
 * duplicated the RoleStrip two hundred pixels below.
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
    <section className="pt-10 pb-7">
      <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
        The field guide to building with AI.
        <br />
        <span className="text-primary">Read. Build. Ship.</span>
      </h1>

      <p className="measure mt-5 text-pretty text-lg text-muted-foreground">
        In-depth guides, a curated AI tool directory, and a plain-language
        glossary for anyone working with AI — plus ready-to-use agents, skills,
        and commands if you build with Claude Code.
      </p>

      {/* Search IS the product on a 748-item reference site, so it ranks second
          and is the only element here carrying elevation. */}
      <SearchCommandBox total={total} className="mt-7" />

      <TriageLinks lanes={lanes} />

      <p className="mt-6 text-sm tabular-nums text-muted-foreground">{stats}</p>
    </section>
  );
}
