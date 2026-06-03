import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

// The `>▍` prompt-cursor mark, inlined as an SVG data URI (no filters, so it
// rasterizes reliably in the OG renderer — the glow is faked with boxShadow).
const markSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='112' height='112'>
  <rect width='32' height='32' rx='6' fill='#111114'/>
  <rect x='0.75' y='0.75' width='30.5' height='30.5' rx='5.25' fill='none' stroke='#26262b' stroke-width='1'/>
  <g transform='translate(16.6 16) scale(1.06) translate(-16 -16)'>
    <path d='M7 8.5 L15.5 16 L7 23.5' fill='none' stroke='#4ade80' stroke-width='3.4' stroke-linecap='round' stroke-linejoin='round'/>
    <rect x='19' y='8.5' width='6' height='15' rx='0.5' fill='#4ade80'/>
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
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0b",
          backgroundImage:
            "radial-gradient(900px 420px at 18% -10%, rgba(74,222,128,0.13), transparent 70%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 36 }}
        >
          <img
            width={112}
            height={112}
            src={markDataUri}
            alt=""
            style={{ borderRadius: 22, boxShadow: "0 0 44px rgba(74,222,128,0.28)" }}
          />
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: -1,
              color: "#e6e6e9",
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
            fontSize: 78,
            fontWeight: 800,
            color: "#e6e6e9",
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 960,
          }}
        >
          <span>Your hub for everything&nbsp;</span>
          <span style={{ color: "#4ade80" }}>AI</span>
        </div>
        <div
          style={{ fontSize: 29, color: "#9a9aa3", marginTop: 26, maxWidth: 900 }}
        >
          Curated agents, skills, guides, tools & commands for building with AI
          coding agents.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 46,
            fontSize: 24,
            color: "#71717a",
          }}
        >
          <span style={{ color: "#4ade80", fontWeight: 700 }}>&gt;</span>
          <span>agents · skills · guides · tools · commands</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
