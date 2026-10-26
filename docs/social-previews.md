# Automatic article social previews

Every approved article keeps its existing URL, schema and publishing workflow. The existing `/articles/[slug]/opengraph-image` and `/archive/[slug]/opengraph-image` endpoints now share one 1200 × 630 editorial design: charcoal, warm white Source Serif Display Bold, a small masthead and one restrained red rule. No article text, dates or website CSS are changed.

## Metadata and titles

`lib/social-metadata.ts` supplies explicit absolute image URLs to both Open Graph and X, with `summary_large_image`, matching titles/descriptions, dimensions and image alt text. It retains the canonical path and publication metadata. If `seoTitle` exists, the HTML page title still uses it; social metadata and the generated graphic use the actual editorial headline. Archive pieces use their existing canonical `/archive/` routes and reader-facing Opinion/History labels. Opinion articles with the exact existing `regan-on-football` tag display Football Observed on the image without changing their stored category.

`lib/social-card.ts` wraps and sizes the whole headline from measured widths of the bundled font. It never truncates or line-clamps the graphic. Normal and long titles, accents and long unbroken words are covered by tests. Very long headlines necessarily receive smaller type. The current English-language article set has been rendered and checked.

## Photography with no separate social configuration

The system reuses the first suitable **local raster photograph already embedded in the article's Markdown**. Use the normal approved article image syntax, for example `![Descriptive photo alt text](/images/approved-photo.jpg)`. There is no new frontmatter field, social-image upload or per-article graphic setting.

As with publishing the image in the article itself, the editor must already have permission to use that image, including in social previews. A local file or an alt label cannot prove a licence. Do not embed an image without those rights. The renderer never downloads third-party images, scrapes player photography, infers permission from search results or calls a paid image service.

The existing repository contains no usable article photographs, including for Yamal, so current cards use the typography-led design. Its one embedded SVG data chart is deliberately excluded. No real player image has been added.

`lib/social-photo.ts` accepts local JPEG, PNG, WebP and AVIF files below `public/`; skips remote links, SVGs, named charts/graphs/logos/icons, images below 600 × 400, extreme aspect ratios, corrupt/missing files, oversized sources and paths/symlinks outside `public/`. Limits are 8 MB and 20 million input pixels. A valid asset is oriented and cropped to the right-hand 430 × 630 panel using Sharp's attention strategy. It is never stretched. If there is no suitable photo, the headline uses the full canvas. Editorial suitability of an otherwise valid raster remains part of ordinary image approval.

Sharp 0.34.5 was already installed through Next.js; it is now declared directly so image validation/cropping does not depend on an undeclared transitive import. No new package/version was downloaded. The unmodified Source Serif font and its SIL Open Font License are bundled locally, with generated advance metrics; see `assets/social/README.md`. Image-route file tracing includes the local assets for deployment packaging.

## Grey text and platform caching

The previous generator painted `Independent Liverpool writing` and `theliverpoolbrief.com` in grey at the bottom of every PNG (`#605c56`). That footer is removed. The new raw images contain only the masthead, category and headline, plus an optional photograph. There is no title overlay, duplicate description or grey footer generated at the bottom.

The particular X overlay reported by Denny was not supplied as a screenshot or post URL, so its exact source cannot be conclusively attributed from this repository alone. If the grey wording is the article title or domain added by X outside/over the raw image, that presentation belongs to X; correct metadata is retained rather than blanking titles or descriptions to hide it. The generated PNG and the platform's card presentation are separate layers. The old X Cards documentation URL currently redirects to X's general developer overview, so it did not provide a reliable current rendering specification.

Both image metadata URLs carry `v=editorial-2` to distinguish this design from earlier cached images. Future article slugs have their own automatic endpoint. Platforms can retain the old page metadata or card until they recrawl; an image URL version cannot force a platform to refresh an already-cached page or existing post. Facebook's Sharing Debugger can request a fresh scrape after an approved deployment. X and WhatsApp presentation/caching must be checked on the actual public release; a local preview cannot update those caches. Do not change canonical article URLs to work around them.

## Validation

Run `npm test`, `npm run lint`, `npm run build`. The existing content loaders perform frontmatter validation; there is no separate content-validation command in current main. Social tests cover full-headline fitting, category/column recognition, metadata, matching absolute image URLs, invalid/unsafe media and automatic fallback. Normal and Archive image endpoints return 404 for unknown articles.

For design QA, request each article's image endpoint locally and inspect the PNG at 1200 × 630 and 375 × 197. Verify the rendered HTML as an unauthenticated crawler: `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`. Both image tags must identify the same public absolute URL. Also verify the build trace contains the font and local assets.

No production deployment or publication is authorised by this implementation document.
