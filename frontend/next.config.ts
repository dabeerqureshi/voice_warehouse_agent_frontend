import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Turbopack configuration
  turbopack: {},
  
  // Optimize build performance
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  
  // Disable source maps in development for faster builds
  productionBrowserSourceMaps: false,
  
  // Remove webpack configuration since we're using Turbopack
  // webpack: (config) => {
  //   config.optimization.splitChunks = {
  //     chunks: "all",
  //     cacheGroups: {
  //       default: false,
  //     },
  //   };
  //   return config;
  // },
};

export default nextConfig;
