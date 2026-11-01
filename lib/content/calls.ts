import { getArticles } from "./articles.ts";

export const CALLS_PATH = "/calls";

/** Every call from every article, newest article first, in the order each article lists them. */
export function getCalls(root = process.cwd()) {
  return getArticles(root).flatMap(article => (article.calls ?? []).map(call => ({
    ...call, date: article.date, title: article.title, href: `/articles/${article.slug}`,
  })));
}
