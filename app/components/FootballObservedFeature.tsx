import Link from "next/link";
import type { Article } from "@/lib/content/types";
import { getArticleExcerpt } from "@/lib/format";
import { ArticleMeta } from "./ArticleMeta";
import { EditionContents } from "./EditionContents";

export function FootballObservedFeature({ article, home = false }: { article: Article; home?: boolean }) {
  const href = `/articles/${article.slug}`;
  const Heading = home ? "h3" : "h2";
  return <div className="observed-feature">
    <article className="observed-lead">
      <p className="eyebrow">Latest edition</p>
      <ArticleMeta {...article} showColumn={false} />
      <Heading><Link href={href}>{article.title}</Link></Heading>
      <p className="preview-excerpt">{getArticleExcerpt(article, 240)}</p>
      <Link href={href} className="read-link" aria-label={`Read edition: ${article.title}`}>Read the edition</Link>
    </article>
    <EditionContents body={article.body} title={article.title} href={href} />
  </div>;
}
