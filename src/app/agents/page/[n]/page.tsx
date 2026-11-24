import type { Metadata } from "next";
import {
  TypeListing,
  listingPageMetadata,
  listingPageParams,
} from "@/components/content/TypeListing";

type Params = Promise<{ n: string }>;

// Pages 2..n of /agents; page 1 is /agents itself.
export const dynamicParams = false;

export function generateStaticParams() {
  return listingPageParams("agent");
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { n } = await params;
  return listingPageMetadata("agent", Number(n));
}

export default async function Page({ params }: { params: Params }) {
  const { n } = await params;
  return <TypeListing type="agent" page={Number(n)} />;
}
