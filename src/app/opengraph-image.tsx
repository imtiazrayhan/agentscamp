import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

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
          background: "#FAFAF9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#C9461E",
              color: "white",
              fontSize: 44,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            A
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, color: "#1A1A1A" }}>
            {site.name}
          </div>
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: "#1A1A1A",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Your hub for everything AI
        </div>
        <div style={{ fontSize: 30, color: "#52524F", marginTop: 24, maxWidth: 880 }}>
          Curated agents, skills, guides, tools & commands for building with AI
          coding agents.
        </div>
      </div>
    ),
    { ...size },
  );
}
