import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { audienceParams } from "@/lib/seo/params";
import { audienceCollection } from "@/lib/seo/collections";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CollectionView } from "@/components/content/CollectionView";
import { RolePath } from "@/components/content/RolePath";

type Params = Promise<{ role: string }>;

export function generateStaticParams() {
  return audienceParams();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { role } = await params;
  const c = audienceCollection(role);
  if (!c) return {};
  return buildPageMetadata({
    title: c.title,
    description: c.description,
    path: `/for/${role}`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { role } = await params;
  const c = audienceCollection(role);
  if (!c) notFound();
  return (
    <CollectionView
      title={c.title}
      description={c.description}
      path={`/for/${role}`}
      items={c.items}
      crumbs={c.crumbs}
      list={<RolePath startHere={c.startHere} groups={c.groups} />}
    />
  );
}
