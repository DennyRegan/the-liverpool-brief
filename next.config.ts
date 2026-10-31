import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal browser QA origin; production hosting is unaffected.
  allowedDevOrigins: ["terminal.local"],
  // History was removed on 31 October 2026. Old links (including shared ones)
  // go to the homepage rather than a 404.
  async redirects() {
    return [
      { source: "/history", destination: "/", permanent: true },
      { source: "/history/:path*", destination: "/", permanent: true },
      { source: "/this-week", destination: "/", permanent: true },
      { source: "/search", destination: "/", permanent: true },
      ...[
        "1995-10-28-liverpool-manchester-city", "alonso-ends-chelsea-home-run-2008",
        "chelsea-liverpool-2015-klopp-first-league-win", "liverpool-everton-1987-barnes-creates-derby-win",
        "liverpool-luton-1983-rush-five", "liverpool-southampton-1993-fowler-hat-trick",
        "west-brom-liverpool-1962-lawrence-debut",
      ].map(slug => ({ source: `/archive/${slug}`, destination: "/", permanent: true })),
    ];
  },
  // The image functions read the bundled font and already-published local photos.
  // Dynamic filesystem loaders need explicit approved content in serverless bundles.
  outputFileTracingExcludes: {
    "/*": ["./prototype/**/*", "./docs/editorial/**/*"],
  },
  outputFileTracingIncludes: {
    "/*": ["./content/articles/liverpool/*.md", "./content/archive/liverpool/*.md"],
    "/articles/**/opengraph-image": ["./assets/social/**/*", "./public/**/*.{jpg,jpeg,png,webp,avif}"],
    "/archive/**/opengraph-image": ["./assets/social/**/*", "./public/**/*.{jpg,jpeg,png,webp,avif}"],
  },
};

export default nextConfig;
