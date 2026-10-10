import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal browser QA origin; production hosting is unaffected.
  allowedDevOrigins: ["terminal.local"],
  // Timeline and Guided Journeys were removed; keep any old links working.
  async redirects() {
    return [
      { source: "/history/timeline", destination: "/history", permanent: true },
      { source: "/history/journeys", destination: "/history", permanent: true },
      { source: "/history/journeys/:path*", destination: "/history", permanent: true },
    ];
  },
  // Local editorial drafts never belong in traced production server artifacts.
  outputFileTracingExcludes: { "/*": ["./docs/editorial/interactive-history/**/*"] },
  outputFileTracingIncludes: { "/search": ["./.generated/search-index.json"] },
};

export default nextConfig;
