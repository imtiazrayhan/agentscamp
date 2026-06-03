import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { contentTypes } from "@/lib/content/registry";

export const metadata: Metadata = {
  title: contentTypes.agent.label,
  description: contentTypes.agent.description,
  alternates: { canonical: "/agents" },
};

export default function Page() {
  return <TypeListing type="agent" />;
}
