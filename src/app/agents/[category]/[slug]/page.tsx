import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItem, getRelated } from "@/lib/content";
import { categorizedParams } from "@/lib/seo/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { ArtifactDetail } from "@/components/content/ArtifactDetail";

type Params = Promise<{ category: string; slug: string }>;

export function generateStaticParams() {
  return categorizedParams("agent");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const item = getItem("agent", category, slug);
  return item ? buildMetadata(item) : {};
}

export default async function Page({ params }: { params: Params }) {
  const { category, slug } = await params;
  const item = getItem("agent", category, slug);
  if (!item) notFound();
  return <ArtifactDetail item={item} related={getRelated(item)} />;
}
