import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolParams } from "@/lib/seo/params";
import { toolAlternativesCollection } from "@/lib/seo/collections";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CollectionView } from "@/components/content/CollectionView";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return toolParams();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = toolAlternativesCollection(slug);
  if (!c) return {};
  return buildPageMetadata({
    title: c.title,
    description: c.description,
    path: `/tools/${slug}/alternatives`,
    noindex: c.noindex,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const c = toolAlternativesCollection(slug);
  if (!c) notFound();
  return (
    <CollectionView
      title={c.title}
      description={c.description}
      path={`/tools/${slug}/alternatives`}
      items={c.items}
      crumbs={c.crumbs}
    />
  );
}
