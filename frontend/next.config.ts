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
    ],
  },
};

export default nextConfig;
