import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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