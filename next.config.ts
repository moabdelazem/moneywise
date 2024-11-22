import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    output: "standalone",
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
