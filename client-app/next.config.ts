import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    SSE_CONNECTION: process.env.SSE_CONNECTION,
  },
};

export default nextConfig;
