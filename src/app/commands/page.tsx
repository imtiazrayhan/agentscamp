import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { contentTypes } from "@/lib/content/registry";

export const metadata: Metadata = {
  title: contentTypes.command.label,
  description: contentTypes.command.description,
  alternates: { canonical: "/commands" },
};

export default function Page() {
  return <TypeListing type="command" />;
}
