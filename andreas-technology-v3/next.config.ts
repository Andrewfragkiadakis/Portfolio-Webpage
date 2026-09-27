import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray lockfile in the parent folder otherwise
  // makes Turbopack infer the wrong root and emit a build warning.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // AVIF first (roughly a third smaller than WebP for these screenshots), WebP fallback.
    formats: ['image/avif', 'image/webp'],
    // Optimised variants are immutable per URL; keep them cached for a month.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: 'https', hostname: 'andreas.technology', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/thesis-presentation',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/thesis-presentation.html',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/thesis-presentation',
        destination: '/thesis-presentation.html',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
