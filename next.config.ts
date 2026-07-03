import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.ocmko.ru" },
      { protocol: "https", hostname: "ocmko.ru" }
    ]
  }
};

export default nextConfig;
