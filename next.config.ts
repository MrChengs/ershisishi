import type { NextConfig } from "next";
import siteConfig from "./content/config.json";

const bookSlugAliases = siteConfig.bookSlugAliases ?? {};

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  devIndicators: false,
  async redirects() {
    return Object.entries(bookSlugAliases).flatMap(([from, to]) => [
      {
        source: `/histories/${from}`,
        destination: `/histories/${to}`,
        permanent: true,
      },
      {
        source: `/juan/${from}/:n`,
        destination: `/juan/${to}/:n`,
        permanent: true,
      },
    ]);
  },
};

export default nextConfig;
