import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["react-mobile-app-button"],
};

export default nextConfig;
