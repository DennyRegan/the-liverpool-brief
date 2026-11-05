import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal browser QA origin; production hosting is unaffected.
  allowedDevOrigins: ["terminal.local"],
  // The old History section was removed on 31 October 2026. Its old links
  // (including shared ones) go to the homepage rather than a 404. A much smaller
  // History hub (/history, /history/biographies, /history/series) returned later,
  // so only the removed sub-sections are redirected.
  async redirects() {
    return [
      ...["matches", "seasons", "people", "explore", "on-this-day"].flatMap(section => [
        { source: `/history/${section}`, destination: "/", permanent: true },
        { source: `/history/${section}/:path*`, destination: "/", permanent: true },
      ]),
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
    "/*": ["./content/articles/liverpool/*.md", "./content/archive/liverpool/*.md", "./content/looking-back/*.md", "./content/biographies/*.md", "./content/series/**/*"],
    "/articles/**/opengraph-image": ["./assets/social/**/*", "./public/**/*.{jpg,jpeg,png,webp,avif}"],
    "/archive/**/opengraph-image": ["./assets/social/**/*", "./public/**/*.{jpg,jpeg,png,webp,avif}"],
    "/looking-back/**/opengraph-image": ["./assets/social/**/*", "./node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"],
  },
};

export default nextConfig;
