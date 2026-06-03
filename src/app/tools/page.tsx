import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { contentTypes } from "@/lib/content/registry";

export const metadata: Metadata = {
  title: contentTypes.tool.label,
  description: contentTypes.tool.description,
  alternates: { canonical: "/tools" },
};

export default function Page() {
  return <TypeListing type="tool" />;
}
