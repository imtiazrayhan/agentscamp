import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across agents, skills, guides, tools, and commands.",
  alternates: { canonical: "/search" },
};

export default function Page() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Search</h1>
      <SearchPageClient />
    </div>
  );
}
