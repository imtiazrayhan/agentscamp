import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { getContentByType } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { listingSeo, listingDescription } from "@/lib/seo/listing";

export function generateMetadata(): Metadata {
  const count = getContentByType("tool").length;
  return buildPageMetadata({
    title: listingSeo.tool.seoTitle,
    description: listingDescription("tool", count),
    path: "/tools",
  });
}

export default function Page() {
  return <TypeListing type="tool" />;
}
