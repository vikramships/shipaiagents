import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['shipaiagents.com'],
  },
  // Enable compression
  compress: true,
  // Optimize for production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
