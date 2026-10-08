import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        pathname: "/gh/taruxnd/tarundixit-portfolio@main/public/**",
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
