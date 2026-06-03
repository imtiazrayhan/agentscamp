import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { contentTypes } from "@/lib/content/registry";

export const metadata: Metadata = {
  title: contentTypes.guide.label,
  description: contentTypes.guide.description,
  alternates: { canonical: "/guides" },
};

export default function Page() {
  return <TypeListing type="guide" />;
}
