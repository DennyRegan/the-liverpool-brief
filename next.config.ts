import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal browser QA origin; production hosting is unaffected.
  allowedDevOrigins: ["terminal.local"],
  // The image functions read the bundled font and already-published local photos.
  outputFileTracingIncludes: {
    "/articles/**/opengraph-image": ["./assets/social/**/*", "./public/**/*.{jpg,jpeg,png,webp,avif}"],
    "/archive/**/opengraph-image": ["./assets/social/**/*", "./public/**/*.{jpg,jpeg,png,webp,avif}"],
  },
};

export default nextConfig;
