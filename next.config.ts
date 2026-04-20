import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [ 40, 300, 750],
    qualities: [50, 75],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
