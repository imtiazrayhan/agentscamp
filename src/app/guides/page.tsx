import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { getContentByType } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { listingSeo, listingDescription } from "@/lib/seo/listing";

export function generateMetadata(): Metadata {
  const count = getContentByType("guide").length;
  return buildPageMetadata({
    title: listingSeo.guide.seoTitle,
    description: listingDescription("guide", count),
    path: "/guides",
  });
}

export default function Page() {
  return <TypeListing type="guide" />;
}
