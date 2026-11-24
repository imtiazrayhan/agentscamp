import type { Metadata } from "next";
import {
  TypeListing,
  listingPageMetadata,
  listingPageParams,
} from "@/components/content/TypeListing";

type Params = Promise<{ n: string }>;

// Pages 2..n of /skills; page 1 is /skills itself.
export const dynamicParams = false;

export function generateStaticParams() {
  return listingPageParams("skill");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { n } = await params;
  return listingPageMetadata("skill", Number(n));
}

export default async function Page({ params }: { params: Params }) {
  const { n } = await params;
  return <TypeListing type="skill" page={Number(n)} />;
}
