import { SiteHeader } from "@/app/components/SiteHeader";
import { ReganOnFootballMasthead } from "@/app/components/ReganOnFootballMasthead";
import { ArticlesNavigation } from "@/app/components/ArticlesNavigation";
import { ArticleCollection } from "@/app/components/ArticleCollection";
import { getReganOnFootballEditions, REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";
import { getWriting } from "@/lib/content/writing";
import { socialMetadata } from "@/lib/social-metadata";

export const metadata = socialMetadata(
  "Football Observed | The Liverpool Brief",
  "A weekly column by Denny Regan. Opinions, observations and commentary on football, published in The Liverpool Brief.",
  REGAN_ON_FOOTBALL_PATH,
);

export default function ReganOnFootballPage() {
  const editions = getReganOnFootballEditions().map(article => ({ ...article, href: `/articles/${article.slug}` }));
  return <>
    <SiteHeader active="articles" />
    <main id="main-content" className="site-width collection column-page">
      <ArticlesNavigation selected="Football Observed" hasAnalysis={getWriting().some(article => article.category === "Analysis")} />
      <ReganOnFootballMasthead />
      <ArticleCollection articles={editions} column emptyMessage="The first edition will appear here when published." />
    </main>
  </>;
}
