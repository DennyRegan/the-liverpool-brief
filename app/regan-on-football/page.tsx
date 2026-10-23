import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { ReganOnFootballMasthead } from "@/app/components/ReganOnFootballMasthead";
import { getReganOnFootballEditions, REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";
import { formatListDate, getArticleExcerpt } from "@/lib/format";
import { socialMetadata } from "@/lib/social-metadata";

export const metadata = socialMetadata(
  "Regan on Football | The Liverpool Brief",
  "A weekly football column by Denny Regan. Opinions, observations and commentary on football, published in The Liverpool Brief.",
  REGAN_ON_FOOTBALL_PATH,
);

export default function ReganOnFootballPage() {
  const [latest, ...previous] = getReganOnFootballEditions();
  return (
    <>
      <SiteHeader active="regan-on-football" />
      <main id="main-content" className="site-width column-page">
        <ReganOnFootballMasthead />
        {latest ? (
          <>
            <section className="column-latest" aria-labelledby="latest-edition">
              <p className="eyebrow">Latest edition</p>
              <article>
                <p className="article-meta"><span>{latest.category}</span><time dateTime={latest.date}>{formatListDate(latest.date)}</time></p>
                <h2 id="latest-edition"><Link href={`/articles/${latest.slug}`}>{latest.title}</Link></h2>
                <p className="standfirst">{getArticleExcerpt(latest, 300)}</p>
                <Link className="read-link" href={`/articles/${latest.slug}`}>Read the column →</Link>
              </article>
            </section>
            {previous.length > 0 && (
              <section className="column-previous" aria-labelledby="previous-editions">
                <h2 id="previous-editions" className="eyebrow">Previous editions</h2>
                <ol className="article-grid">
                  {previous.map(article => (
                    <li key={article.slug}>
                      <article className="article-card">
                        <p className="article-meta"><time dateTime={article.date}>{formatListDate(article.date)}</time></p>
                        <h3><Link href={`/articles/${article.slug}`}>{article.title}</Link></h3>
                        <p>{getArticleExcerpt(article, 220)}</p>
                      </article>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </>
        ) : (
          <div className="column-empty">
            <p>The first edition will appear here when published.</p>
            <Link className="read-link" href="/articles">Browse Denny’s articles →</Link>
          </div>
        )}
      </main>
    </>
  );
}
