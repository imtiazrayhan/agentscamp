import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { getContentByType } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { listingSeo, listingDescription } from "@/lib/seo/listing";

export function generateMetadata(): Metadata {
  const count = getContentByType("command").length;
  return buildPageMetadata({
    title: listingSeo.command.seoTitle,
    description: listingDescription("command", count),
    path: "/commands",
  });
}

export default function Page() {
  return <TypeListing type="command" />;
}
