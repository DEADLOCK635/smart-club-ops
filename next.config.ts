import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ops",
        destination: "/admin",
      },
      {
        source: "/ops/login",
        destination: "/admin/login",
      },
      {
        source: "/ops/:path*",
        destination: "/admin/:path*",
      },
    ];
  },
};

export default nextConfig;

