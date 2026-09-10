import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { OG_ACCENT_INK, OG_SURFACE } from "@/lib/palette";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

// The `>▍` prompt-cursor mark, inlined as an SVG data URI (no filters, so it
// rasterizes reliably in the OG renderer). Colours come from src/lib/palette.ts,
// which npm run validate holds in step with globals.css.
const ACCENT = OG_ACCENT_INK.mint;
const markSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='96' height='96'>
  <rect width='32' height='32' rx='6' fill='${OG_SURFACE.card}'/>
  <rect x='0.75' y='0.75' width='30.5' height='30.5' rx='5.25' fill='none' stroke='${OG_SURFACE.border}' stroke-width='1'/>
  <g transform='translate(16.6 16) scale(1.06) translate(-16 -16)'>
    <path d='M7 8.5 L15.5 16 L7 23.5' fill='none' stroke='${ACCENT}' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'/>
    <rect x='19' y='8.5' width='6' height='15' rx='0.5' fill='${ACCENT}'/>
  </g>
</svg>`;
const markDataUri = `data:image/svg+xml,${encodeURIComponent(markSvg)}`;

export default function OpengraphImage() {
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
        <div style={{ display: "flex", width: 14, background: ACCENT }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "72px 80px",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 40 }}
          >
            <img width={96} height={96} src={markDataUri} alt="" style={{ borderRadius: 18 }} />
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: -1,
                color: OG_SURFACE.foreground,
              }}
            >
              agentscamp
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              fontSize: 74,
              fontWeight: 800,
              color: OG_SURFACE.foreground,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            <span>Your hub for everything&nbsp;</span>
            <span style={{ color: ACCENT }}>AI</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 29,
              color: OG_SURFACE.mutedForeground,
              marginTop: 26,
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Guides, an AI tool directory & a plain-language glossary — plus
            agents, skills & commands for Claude Code.
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 46,
              fontSize: 24,
              color: OG_SURFACE.faint,
            }}
          >
            developers · founders · marketers · designers · analysts
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
