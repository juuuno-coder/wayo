import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.showala.com",
      },
      {
        protocol: "https",
        hostname: "www.mcst.go.kr",
      },
      {
        protocol: "https",
        hostname: "wayo.fly.dev",
      },
      {
        protocol: "https",
        hostname: "www.wayo.co.kr",
      },
      {
        protocol: "https",
        hostname: "wayo.co.kr",
      },
    ],
  },
};

export default nextConfig;
