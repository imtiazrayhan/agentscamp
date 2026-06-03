import type { Metadata } from "next";
import { TypeListing } from "@/components/content/TypeListing";
import { contentTypes } from "@/lib/content/registry";

export const metadata: Metadata = {
  title: contentTypes.skill.label,
  description: contentTypes.skill.description,
  alternates: { canonical: "/skills" },
};

export default function Page() {
  return <TypeListing type="skill" />;
}
