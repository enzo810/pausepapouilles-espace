import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // authInterrupts: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "v94vppplyxbctvru.public.blob.vercel-storage.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
