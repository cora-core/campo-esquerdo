import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [{
      source: '/blog',
      destination: '/'
    }, {
      source: '/soundsystem',
      destination: '/'
    }, {
      source: '/sobre',
      destination: '/'
    }]
  }
};

export default nextConfig;
