import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItem, getRelated } from "@/lib/content";
import { glossaryParams } from "@/lib/seo/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { ArtifactDetail } from "@/components/content/ArtifactDetail";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return glossaryParams();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getItem("glossary", "", slug);
  return item ? buildMetadata(item) : {};
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const item = getItem("glossary", "", slug);
  if (!item) notFound();
  return <ArtifactDetail item={item} related={getRelated(item)} />;
}
