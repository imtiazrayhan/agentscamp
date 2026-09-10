import type { Metadata } from "next";
import { Suspense } from "react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { SearchResults } from "@/components/search/SearchResults";
import { PageHeader } from "@/components/content/PageHeader";

/**
 * URL-addressable search (?q=…) — the target of the WebSite SearchAction in
 * JSON-LD. noindex (search results pages shouldn't be indexed), but the action
 * itself is what answer engines consume. Same FlexSearch index as ⌘K.
 */
export const metadata: Metadata = buildPageMetadata({
  title: "Search",
  description:
    "Search every guide, tool, glossary term, agent, skill, and command on AgentsCamp.",
  path: "/search",
  noindex: true,
});

export default function Page() {
  return (
    <div>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <PageHeader
        title="Search"
        lead="Search every guide, tool, glossary term, agent, skill, and command on AgentsCamp."
      />
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
