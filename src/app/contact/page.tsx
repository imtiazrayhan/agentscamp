import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Panel } from "@/components/ui/panel";
import { PageHeader } from "@/components/content/PageHeader";
import { ContactForm } from "./ContactForm";

const title = "Contact";
const description =
  "Contact AgentsCamp with a correction, a tool listing or sponsorship request, a partnership idea, or a question about our AI guides, tools, and skills.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/contact",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${site.url}/contact#webpage`,
  url: `${site.url}/contact`,
  name: title,
  description,
  isPartOf: { "@id": `${site.url}/#website` },
  about: { "@id": `${site.url}/#organization` },
  inLanguage: "en",
};

export default function ContactPage() {
  return (
    <article className="mx-auto measure">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        eyebrow={<Eyebrow className="text-primary">Contact</Eyebrow>}
        title="Get in touch"
        lead="Send a correction, a tool listing or sponsorship request, a partnership idea, or a question about something you read here. Messages go straight to the AgentsCamp inbox, and we reply by email."
      />

      <Panel>
        <ContactForm />
      </Panel>

      <p className="mt-6 text-sm text-muted-foreground">
        Prefer email? Write to{" "}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          {site.contactEmail}
        </a>
        .
      </p>
    </article>
  );
}
