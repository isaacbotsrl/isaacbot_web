import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server in .next/standalone, copied into the runtime image by the Dockerfile.
  output: "standalone",
  poweredByHeader: false,
  // Images are served as-is from public/; the site has no image optimizer.
  images: { unoptimized: true },
};

export default nextConfig;
