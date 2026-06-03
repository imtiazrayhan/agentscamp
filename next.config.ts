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
  // Expose every page's Markdown twin at `<path>.md`. The handler lives at
  // /raw/[...path] and sets its own canonical + noindex headers (preserved
  // through the rewrite). Lets `alternates.types` advertise the clean .md URL.
  async rewrites() {
    return [{ source: "/:path*.md", destination: "/raw/:path*" }];
  },
};

export default nextConfig;
