import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // jsDelivr URLs are pinned to the commit being deployed (see src/lib/cdnAssets.ts).
    ASSET_REF: process.env.VERCEL_GIT_COMMIT_SHA || "main",
  },
  experimental: {
    // Guestbook photos arrive as base64 JPEGs (≤1 MB of image, ~1.4 MB encoded).
    serverActions: { bodySizeLimit: "2mb" },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/taruxnd/**",
      },
    ],
  },
  // Safari aggressively caches localhost CSS/JS; keep local always fresh.
  async headers() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, max-age=0",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
