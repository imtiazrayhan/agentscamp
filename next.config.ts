import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

/**
 * Build the redirect map from the Step-0 URL snapshot: any old agent URL whose
 * slug no longer exists (we curated 69 -> ~18) redirects to /agents. Surviving
 * agents keep their URLs 1:1. Derived from the filesystem so it stays correct.
 */
function agentRedirects() {
  const snapshot = path.join(process.cwd(), "migration", "old-urls.txt");
  if (!fs.existsSync(snapshot)) return [];
  const oldUrls = fs
    .readFileSync(snapshot, "utf8")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const agentsRoot = path.join(process.cwd(), "src", "content", "agents");
  const current = new Set<string>();
  if (fs.existsSync(agentsRoot)) {
    for (const cat of fs.readdirSync(agentsRoot)) {
      const dir = path.join(agentsRoot, cat);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith(".md")) current.add(`/agents/${cat}/${f.slice(0, -3)}`);
      }
    }
  }

  return oldUrls
    .filter((u) => !current.has(u))
    .map((source) => ({ source, destination: "/agents", permanent: true }));
}

const nextConfig: NextConfig = {
  experimental: { optimizePackageImports: ["lucide-react"] },
  trailingSlash: false,
  async redirects() {
    return agentRedirects();
  },
  // Pretty suffix URLs. ORDER MATTERS (first match wins): the agent-export
  // suffixes — several of which also end in `.md` — must precede the generic
  // `/:path*.md` twin rule, else e.g. `/a/b.agent.md` would match `.md` with
  // path*="a/b.agent" and 404. Export handler at /export/[...path] (last segment
  // = format id); the .md twin handler at /raw/[...path]. Both set their own
  // canonical header, preserved through the rewrite.
  async rewrites() {
    return [
      { source: "/:path*.agent.md", destination: "/export/:path*/copilot" },
      { source: "/:path*.cursor.mdc", destination: "/export/:path*/cursor" },
      { source: "/:path*.cline.md", destination: "/export/:path*/cline" },
      { source: "/:path*.windsurf.md", destination: "/export/:path*/windsurf" },
      { source: "/:path*.continue.md", destination: "/export/:path*/continue" },
      { source: "/:path*.md", destination: "/raw/:path*" },
    ];
  },
};

export default nextConfig;
