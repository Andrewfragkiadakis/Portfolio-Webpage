import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The site is one page with ~12 KB of CSS: inlining it removes the render-blocking
  // stylesheet request, which was most of a phone's first-paint time on slow networks.
  experimental: {
    inlineCss: true,
    // app/[lang] is the only root layout, so a URL that matches no route gets the branded
    // app/global-not-found.tsx instead of Next's default page.
    globalNotFound: true,
  },
  // Pin the workspace root: a stray lockfile in the parent folder otherwise
  // makes Turbopack infer the wrong root and emit a build warning.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        // Baseline hardening. No enforcing CSP: the inline head script, JSON-LD and Next's
        // bootstrap would need nonces, and nonces force every page to render dynamically.
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        ],
      },
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
      // English lives at "/", so its internal route never shows in the address bar.
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/work', destination: '/work', permanent: true },
      { source: '/en/work/:slug', destination: '/work/:slug', permanent: true },
    ]
  },
  async rewrites() {
    // One page per language under app/[lang]: "/" serves English, "/el" Greek.
    return [
      { source: '/', destination: '/en' },
      { source: '/work', destination: '/en/work' },
      { source: '/work/:slug', destination: '/en/work/:slug' },
    ]
  },
};

export default nextConfig;
