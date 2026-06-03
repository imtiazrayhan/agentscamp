import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { topicParams } from "@/lib/seo/params";
import { topicCollection } from "@/lib/seo/collections";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CollectionView } from "@/components/content/CollectionView";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return topicParams();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = topicCollection(slug);
  if (!c) return {};
  return buildPageMetadata({
    title: c.title,
    description: c.description,
    path: `/topics/${slug}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const c = topicCollection(slug);
  if (!c) notFound();
  return (
    <CollectionView
      title={c.title}
      description={c.description}
      path={`/topics/${slug}`}
      items={c.items}
      crumbs={c.crumbs}
    />
  );
}
