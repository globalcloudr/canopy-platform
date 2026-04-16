import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  transpilePackages: ["@canopy/ui"],
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/",
        permanent: true,
      },
      {
        source: "/app/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
