This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Current site structure

The Liverpool Brief publishes Denny Regan's own writing. Navigation is Home | Articles | Football Observed, with About in the footer.

- **Home** (`/`) shows up to four journalism pieces, including the latest Football Observed edition, and links to the full collection.
- **Articles** (`/articles`) is the single collection. Filters (`?type=opinion|analysis|team-news|history`) appear for categories that have articles; History lists Denny's own historical pieces only.
- Articles live in `content/articles/liverpool/*.md` (`category: Opinion | Analysis | Team News`) at `/articles/[slug]`. Four earlier pieces stay in `content/archive/liverpool/` at their original `/archive/[slug]` URLs and are listed as Opinion or History according to their stored `editorialMode`.
- Analysis supports Markdown tables (GitHub-flavoured) and images/charts placed under `public/`.
- The newsletter signup is hidden until Sender is configured; see [docs/newsletter-signup.md](docs/newsletter-signup.md).

The Brief, History, This Week, Match Centre, Search and all automated History publishing were retired on 19 October 2026 (tag `pre-editorial-reset-2026-10-19`). History was briefly restored and then removed for good on 31 October 2026 (tag `pre-history-removal`); old `/history`, `/this-week` and `/search` links redirect to the homepage.

Use Node 22.18+ or 24, then `npm ci`, `npm test`, `npm run lint` and `npm run build`. Preview with `npm run dev`.
