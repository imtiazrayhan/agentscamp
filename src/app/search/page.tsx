import type { Metadata } from "next";
import { Suspense } from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { SearchResults } from "@/components/search/SearchResults";

/**
 * URL-addressable search (?q=…) — the target of the WebSite SearchAction in
 * JSON-LD. noindex (search results pages shouldn't be indexed), but the action
 * itself is what answer engines consume. Same FlexSearch index as ⌘K.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Search",
  description:
    "Search every agent, skill, guide, tool, and command on AgentsCamp.",
  path: "/search",
  noindex: true,
});

export default function Page() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Search</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Search every agent, skill, guide, tool, and command on AgentsCamp.
        </p>
      </header>
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
