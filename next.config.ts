import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal browser QA origin; production hosting is unaffected.
  allowedDevOrigins: ["terminal.local"],
  // Local editorial drafts never belong in traced production server artifacts.
  outputFileTracingExcludes: { "/*": ["./docs/editorial/interactive-history/**/*"] },
};

export default nextConfig;
