import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { getContentByType } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { listingSeo, listingDescription } from "@/lib/seo/listing";

export function generateMetadata(): Metadata {
  const count = getContentByType("skill").length;
  return buildPageMetadata({
    title: listingSeo.skill.seoTitle,
    description: listingDescription("skill", count),
    path: "/skills",
  });
}

export default function Page() {
  return <TypeListing type="skill" />;
}
