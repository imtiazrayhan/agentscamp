import Link from "next/link";
import { Panel } from "@/components/ui/panel";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Toc } from "./Toc";
import { extractToc } from "@/lib/toc";
import { externalLinkProps } from "@/lib/utils";
import { formatDate, pageDates } from "@/lib/format";
import type { ContentItem } from "@/lib/content/types";

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");

const factLink = "font-medium text-primary hover:underline";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words text-foreground">{children}</dd>
    </div>
  );
}

function ToolFacts({
  item,
  categoryHref,
  pricingHref,
}: {
  item: Extract<ContentItem, { type: "tool" }>;
  categoryHref?: string;
  pricingHref?: string;
}) {
  const pricing = item.pricing.replace("-", " ");
  const links = item.sameAs.filter((u) => u !== item.url && u !== item.repo);
  return (
    <>
      <Fact label="Pricing">
        {pricingHref ? (
          <Link href={pricingHref} className={`capitalize ${factLink}`}>
            {pricing}
          </Link>
        ) : (
          <span className="capitalize">{pricing}</span>
        )}
      </Fact>
      <Fact label="Category">
        {categoryHref ? (
          <Link href={categoryHref} className={`capitalize ${factLink}`}>
            {item.category}
          </Link>
        ) : (
          <span className="capitalize">{item.category}</span>
        )}
      </Fact>
      {item.os.length > 0 && (
        <Fact label="Platforms">{item.os.join(", ")}</Fact>
      )}
      {item.license && <Fact label="License">{item.license}</Fact>}
      <Fact label="Website">
        <a href={item.url} {...externalLinkProps(item.url)} className={factLink}>
          {host(item.url)}
        </a>
      </Fact>
      {item.repo && (
        <Fact label="Source">
          <a
            href={item.repo}
            {...externalLinkProps(item.repo)}
            className={factLink}
          >
            {host(item.repo)}
          </a>
        </Fact>
      )}
      {links.length > 0 && (
        <Fact label="Links">
          <ul className="space-y-1">
            {links.map((u) => (
              <li key={u}>
                <a href={u} {...externalLinkProps(u)} className={factLink}>
                  {host(u)}
                </a>
              </li>
            ))}
          </ul>
        </Fact>
      )}
    </>
  );
}

const ToolNames = ({ names }: { names: string[] }) => (
  <span className="font-mono text-xs">{names.join(", ")}</span>
);

/** The frontmatter an installer cares about, per installable type. */
function InstallableFacts({ item }: { item: ContentItem }) {
  if (item.type === "agent") {
    return (
      <>
        <Fact label="Model">
          <span className="capitalize">{item.model}</span>
        </Fact>
        <Fact label="Tools">
          {item.tools?.length ? <ToolNames names={item.tools} /> : "All tools"}
        </Fact>
      </>
    );
  }
  if (item.type === "skill") {
    return (
      <>
        {item.userInvocable && (
          <Fact label="Invoke">
            <code className="font-mono text-xs">/{item.slug}</code>
          </Fact>
        )}
        {item.version && <Fact label="Version">v{item.version}</Fact>}
        {item.multiFile && <Fact label="Files">Multi-file</Fact>}
        {!!item.allowedTools?.length && (
          <Fact label="Tools">
            <ToolNames names={item.allowedTools} />
          </Fact>
        )}
      </>
    );
  }
  if (item.type === "command") {
    return (
      <>
        <Fact label="Command">
          <code className="font-mono text-xs">/{item.slug}</code>
        </Fact>
        {item.argumentHint && (
          <Fact label="Arguments">
            <code className="font-mono text-xs">{item.argumentHint}</code>
          </Fact>
        )}
        {item.model && (
          <Fact label="Model">
            <span className="capitalize">{item.model}</span>
          </Fact>
        )}
        {!!item.allowedTools?.length && (
          <Fact label="Tools">
            <ToolNames names={item.allowedTools} />
          </Fact>
        )}
      </>
    );
  }
  return null;
}

/**
 * The right rail on tool, agent, skill and command pages: the spec sheet for
 * the type, a tool's closest alternatives, and the page contents. On small
 * screens only the spec sheet shows, inline under the header.
 */
export function DetailRail({
  item,
  categoryHref,
  pricingHref,
  alternatives = [],
  alternativesHref,
}: {
  item: ContentItem;
  categoryHref?: string;
  pricingHref?: string;
  alternatives?: ContentItem[];
  alternativesHref?: string;
}) {
  const toc = item.body ? extractToc(item.body) : [];
  const dates = pageDates(item);

  return (
    <aside className="mb-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mb-0">
      <div className="space-y-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
        <Panel variant="recessed" padding="sm">
          <Eyebrow className="mb-3">At a glance</Eyebrow>
          <dl className="space-y-2 text-sm">
            {item.type === "tool" ? (
              <ToolFacts
                item={item}
                categoryHref={categoryHref}
                pricingHref={pricingHref}
              />
            ) : (
              <InstallableFacts item={item} />
            )}
            {dates.date && (
              <Fact label={dates.label}>
                <time dateTime={dates.date}>{formatDate(dates.date)}</time>
              </Fact>
            )}
            {dates.reviewed && (
              <Fact label="Reviewed">
                <time dateTime={dates.reviewed}>
                  {formatDate(dates.reviewed)}
                </time>
              </Fact>
            )}
          </dl>
        </Panel>

        {alternatives.length > 0 && (
          <nav aria-label="Alternatives" className="hidden text-sm lg:block">
            <Eyebrow className="mb-3">Alternatives</Eyebrow>
            <ul className="space-y-1.5">
              {alternatives.map((alt) => (
                <li key={alt.slug}>
                  <Link
                    href={alt.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {alt.title}
                  </Link>
                </li>
              ))}
            </ul>
            {alternativesHref && (
              <Link
                href={alternativesHref}
                className={`mt-3 inline-flex ${factLink}`}
              >
                Compare all alternatives
              </Link>
            )}
          </nav>
        )}

        {toc.length >= 2 && (
          <div className="hidden lg:block">
            <Toc items={toc} />
          </div>
        )}
      </div>
    </aside>
  );
}
