import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    ignoreDuringBuilds: false,
  },
  
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
