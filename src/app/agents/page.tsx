import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { getContentByType } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { listingSeo, listingDescription } from "@/lib/seo/listing";

export function generateMetadata(): Metadata {
  const count = getContentByType("agent").length;
  return buildPageMetadata({
    title: listingSeo.agent.seoTitle,
    description: listingDescription("agent", count),
    path: "/agents",
  });
}

export default function Page() {
  return <TypeListing type="agent" />;
}
