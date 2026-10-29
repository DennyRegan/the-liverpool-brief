import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Separate local prototype output so its opt-in build cannot replace the ordinary build.
  distDir: process.env.LIVERPOOL_HISTORY_PROTOTYPE === "1" && !process.env.VERCEL && !process.env.CI
    ? ".next-history-prototype" : ".next",
  // Internal browser QA origin; production hosting is unaffected.
  allowedDevOrigins: ["terminal.local"],
  // The image functions read the bundled font and already-published local photos.
  // Dynamic filesystem loaders need explicit approved content in serverless bundles.
  outputFileTracingExcludes: {
    "/*": ["./prototype/**/*", "./docs/editorial/**/*", "./.next-history-prototype/**/*"],
  },
  outputFileTracingIncludes: {
    "/*": ["./content/articles/liverpool/*.md", "./content/archive/liverpool/*.md", "./content/history/liverpool/**/*.json", "./content/this-week/liverpool/*.md"],
    "/articles/**/opengraph-image": ["./assets/social/**/*", "./public/**/*.{jpg,jpeg,png,webp,avif}"],
    "/archive/**/opengraph-image": ["./assets/social/**/*", "./public/**/*.{jpg,jpeg,png,webp,avif}"],
  },
};

export default nextConfig;
