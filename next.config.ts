import type { NextConfig } from "next";

const pagesBase = (process.env.PAGES_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: pagesBase || undefined,
  assetPrefix: pagesBase || undefined,
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  devIndicators: false,
};

export default nextConfig;
