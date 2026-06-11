import { ImageResponse } from "next/og";
import type { ContentItem, Accent } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { site } from "@/lib/site";

/**
 * Shared per-item OG image (1200x630). Reuses the site terminal aesthetic but
 * stamps the content type + title + description and tints with the per-type
 * accent. Each route's colocated `opengraph-image.tsx` calls this; because those
 * routes export `generateStaticParams` + `dynamic="force-static"`, every PNG is
 * rendered at build time (one per item), not on request.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ACCENT_HEX: Record<Accent, string> = {
  coral: "#fb7185",
  turquoise: "#2dd4bf",
  mint: "#4ade80",
  amber: "#fbbf24",
  violet: "#a78bfa",
  sky: "#38bdf8",
};

function markSvg(hex: string) {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='84' height='84'>
  <rect width='32' height='32' rx='6' fill='#111114'/>
  <rect x='0.75' y='0.75' width='30.5' height='30.5' rx='5.25' fill='none' stroke='#26262b' stroke-width='1'/>
  <g transform='translate(16.6 16) scale(1.06) translate(-16 -16)'>
    <path d='M7 8.5 L15.5 16 L7 23.5' fill='none' stroke='${hex}' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'/>
    <rect x='19' y='8.5' width='6' height='15' rx='0.5' fill='${hex}'/>
  </g>
</svg>`;
}

function clamp(s: string, max: number) {
  const t = s.trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

export function renderItemOg(item: ContentItem | undefined) {
  const def = item ? contentTypes[item.type] : undefined;
  const accent = def ? ACCENT_HEX[def.accent] : ACCENT_HEX.mint;
  const eyebrow = def ? def.singular.toUpperCase() : "AGENTSCAMP";
  const title = item ? clamp(item.title, 70) : site.name;
  const description = clamp(item?.summary ?? item?.description ?? site.description, 150);
  const markDataUri = `data:image/svg+xml,${encodeURIComponent(markSvg(accent))}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0a0b",
          backgroundImage: `radial-gradient(900px 420px at 18% -10%, ${accent}22, transparent 70%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) renders plain <img>; next/image is not applicable */}
          <img
            width={84}
            height={84}
            src={markDataUri}
            alt=""
            style={{ borderRadius: 18, boxShadow: `0 0 36px ${accent}47` }}
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <div
              style={{ fontSize: 30, fontWeight: 700, color: "#e6e6e9", letterSpacing: -0.5 }}
            >
              agentscamp
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 3,
                color: accent,
              }}
            >
              {eyebrow}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              color: "#e6e6e9",
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 27,
              color: "#9a9aa3",
              marginTop: 22,
              maxWidth: 1000,
              lineHeight: 1.35,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            color: "#71717a",
          }}
        >
          <span style={{ color: accent, fontWeight: 700 }}>&gt;</span>
          <span>agentscamp.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
