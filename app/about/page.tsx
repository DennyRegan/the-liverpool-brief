import { SiteHeader } from "@/app/components/SiteHeader";

export const metadata = {
  title: "About | The Liverpool Brief",
  alternates: { canonical: "/about" },
  description: "An independent Liverpool FC publication covering opinion, analysis, history and the stories that matter around the club.",
};

export default function AboutPage() {
  return <><SiteHeader active="about" /><main id="main-content" className="reading-page about-page">
    <h1>About The Liverpool Brief</h1>
    <div className="article-body">
      <p>The Liverpool Brief is an independent Liverpool FC publication built around opinion, analysis, history and the stories that matter around the club.</p>
      <p>I’m Denny, a Liverpool supporter and the person behind the site.</p>
      <p>I started The Liverpool Brief because I wanted something different from the endless cycle of rumours, recycled stories and attention-grabbing headlines that dominate football coverage.</p>
      <p>The aim is simple: publish things worth reading.</p>
      <p>That might be an opinion piece on the current Liverpool side, a detailed tactical analysis of a match, or a look back at one of the great teams or players in the club’s history.</p>
      <p>I’m more interested in understanding why something is happening than simply repeating that it happened. Opinion should have an argument behind it. Analysis should help explain what happened and why. Historical pieces should make the past feel worth exploring.</p>
      <p>Whether you come here for today’s Liverpool, an opinion you agree or disagree with, or a match played fifty years ago, the aim is that you leave having read something worthwhile.</p>
      <h2>Looking Back</h2>
      <p>Looking Back pieces are researched and drafted with AI tools from published sources, then checked and edited before publication.</p>
    </div>
  </main></>;
}
