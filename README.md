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


## Article-led redesign

The homepage and `/articles` show Denny’s writing. `/brief` contains the existing news brief. All nine existing opinion Markdown files and their URLs are preserved. The old AI-written archive routes and ten published content files are removed; they remain recoverable in Git history before this change (this repository is public, so Git history is not a private backup).

To publish Denny’s new history writing, place a Markdown file in `content/articles/liverpool/` with quoted `title` and `date` (YYYY-MM-DD), and `category: History` in its YAML frontmatter. Put his unchanged article below the closing frontmatter delimiter. The filename becomes `/articles/filename-without-md`. The History filter appears when a History article exists. Opinion uses `category: Opinion`. Publishing and notifications are not automated by this redesign.

The About page contains provisional third-person copy based on Denny’s stated direction. Review or replace with his own introduction before production release.

Verification: `npm ci`, `npm run lint`, `npm run build`. Preview with `npm run dev` and check desktop/mobile homepage, category filters, article/share links, About, and Brief. Withdrawn `/archive` URLs should return 404.
