import type { NextConfig } from "next";

const repo = "ershisishi";
const usingPages = process.env.GITHUB_ACTIONS === "true";
const pagesBase = usingPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: pagesBase,
  assetPrefix: pagesBase || undefined,
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  devIndicators: false,
};

export default nextConfig;
