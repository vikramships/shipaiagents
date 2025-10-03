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
  // Exclude CLI package from build
  excludeDefaultMomentLocales: true,
  transpilePackages: [],
  // Add webpack config to ignore CLI package
  webpack: (config, { isServer }) => {
    // Exclude packages directory from client-side bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'packages/agent-cli': false,
        'fs-extra': false,
        'inquirer': false,
        'commander': false,
        'ora': false,
        'chalk': false,
        'table': false,
      };
    }
    return config;
  },
};

export default nextConfig;
