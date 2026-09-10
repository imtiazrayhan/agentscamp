import { ImageResponse } from "next/og";
import type { ContentItem } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { site } from "@/lib/site";
import { OG_ACCENT_INK, OG_SURFACE } from "@/lib/palette";

/**
 * Shared per-item OG image (1200x630). Stamps the content type, title and
 * description, tinted with the per-type accent. Each route's colocated
 * `opengraph-image.tsx` calls this; because those routes export
 * `generateStaticParams` + `dynamic="force-static"`, every PNG is rendered at
 * build time (one per item), not on request.
 *
 * The card used to keep its own private accent map and the retired terminal
 * look — a near-black ground with a radial glow behind a glowing mark. The
 * colours come from src/lib/palette.ts now, which is gated against globals.css,
 * and the glow is gone: an accent rule down the left edge does the same job as
 * the type identity without the haze.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function markSvg(hex: string) {
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='72' height='72'>
  <rect width='32' height='32' rx='6' fill='${OG_SURFACE.card}'/>
  <rect x='0.75' y='0.75' width='30.5' height='30.5' rx='5.25' fill='none' stroke='${OG_SURFACE.border}' stroke-width='1'/>
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
  const accent = def ? OG_ACCENT_INK[def.accent] : OG_ACCENT_INK.mint;
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
          background: OG_SURFACE.background,
          fontFamily: "sans-serif",
        }}
      >
        {/* The type identity, as a rule rather than a glow. */}
        <div style={{ display: "flex", width: 14, background: accent }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "72px 80px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (Satori) renders plain <img>; next/image is not applicable */}
            <img width={72} height={72} src={markDataUri} alt="" style={{ borderRadius: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: OG_SURFACE.foreground,
                  letterSpacing: -0.5,
                }}
              >
                agentscamp
              </div>
              <div
                style={{
                  fontSize: 17,
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
                color: OG_SURFACE.foreground,
                lineHeight: 1.08,
                letterSpacing: -1.5,
                maxWidth: 1000,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 27,
                color: OG_SURFACE.mutedForeground,
                marginTop: 24,
                maxWidth: 960,
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
              fontSize: 22,
              color: OG_SURFACE.faint,
            }}
          >
            agentscamp.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
