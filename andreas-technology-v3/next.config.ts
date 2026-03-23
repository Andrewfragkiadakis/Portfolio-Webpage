import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
