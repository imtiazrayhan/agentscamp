import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItem, getRelated } from "@/lib/content";
import { toolParams } from "@/lib/seo/params";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  toolAlternativesCollection,
  toolCategoryCollection,
  toolPricingCollection,
} from "@/lib/seo/collections";
import { DetailView } from "@/components/content/DetailView";

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
  const item = getItem("tool", "", slug);
  return item ? buildMetadata(item) : {};
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const item = getItem("tool", "", slug);
  if (!item) notFound();
  if (item.type !== "tool") notFound();
  const category = toolCategoryCollection(item.category);
  const pricing = toolPricingCollection(item.pricing);
  const alternatives = toolAlternativesCollection(item.slug);
  return (
    <DetailView
      item={item}
      related={getRelated(item)}
      toolCategoryHref={
        category && !category.noindex
          ? `/tools/category/${item.category}`
          : undefined
      }
      toolPricingHref={
        pricing && !pricing.noindex ? `/tools/pricing/${item.pricing}` : undefined
      }
      toolAlternativesHref={
        alternatives && !alternatives.noindex
          ? `${item.href}/alternatives`
          : undefined
      }
    />
  );
}
