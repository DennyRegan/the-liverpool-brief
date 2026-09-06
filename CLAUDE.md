# The Liverpool Brief — Project Context

## Product
An independent, article-led Liverpool publication by Denny Regan. The homepage showcases his writing; the news brief lives at /brief.

## Editorial rules
Preserve existing opinion articles and their /articles/[slug] URLs. Denny writes all new opinion and history articles. AI assists research, fact-checking and grammar; do not generate articles on his behalf. Old AI-written archive articles are withdrawn from the website.

## Architecture
Next.js App Router, local Markdown with YAML frontmatter validated with Zod. Articles in content/articles/liverpool; current brief in content/briefs/liverpool/current.md. Use category: History for Denny’s new historical articles. Homepage filters appear automatically for published categories. No database or authentication needed.

## Working agreement
Explain structural decisions, preserve Denny’s writing, and let Denny review significant design changes before production release. The About copy is provisional and should be reviewed by Denny.
