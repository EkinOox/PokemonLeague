import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/pokemon/:id',
        destination: 'https://tyradex.vercel.app/api/v1/pokemon/:id',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/Yarkis01/TyraDex/images/**',
      },
      {
        protocol: 'https',
        hostname: 'tyradex.vercel.app',
      },
    ],
  },
};

export default nextConfig;