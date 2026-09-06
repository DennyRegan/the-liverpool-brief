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

Home shows the latest three opinion articles; Articles holds the complete collection. Archive remains a separate standalone history section, currently empty after withdrawal of the AI-written articles. This Week presents today plus six days of recurring historical events. The Brief is at `/brief` and linked from the footer. All nine opinion content files and their URLs are preserved.

## This Week

See [the This Week guide](docs/this-week.md) for content examples, image and Archive links, date behaviour, validation and exact checks. No production events or replacement Archive articles have been invented.

Use Node 22.18+ or 24, then `npm ci`, `npm test`, `npm run lint`, and `npm run build`. Tests use Node’s built-in runner; no new dependencies were introduced. The build validates history entries before compiling. Preview with `npm run dev`.

The About page is provisional and needs Denny’s wording review before production release. Removed content remains recoverable in the public Git history; that is not a private backup.
