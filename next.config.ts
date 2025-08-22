import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  env: {
    PORT: '3001'
  }
};

export default nextConfig;
