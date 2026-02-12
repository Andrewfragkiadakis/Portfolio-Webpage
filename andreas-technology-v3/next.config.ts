import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'andreas.technology', pathname: '/**' },
    ],
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
