import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";

export const metadata = { title: "About | The Liverpool Brief", description: "Liverpool opinion and history by Denny Regan." };

export default function AboutPage() {
  return <><SiteHeader active="about" /><main id="main-content" className="reading-page about-page">
    <h1>About</h1>
    <p className="standfirst">Liverpool opinion and history, with a supporter’s perspective.</p>
    <div className="article-body">
      <p>I’m Denny, a Liverpool supporter. The Liverpool Brief is where I share my opinions and write about the club’s history.</p>
      <h2>The writing</h2>
      <p>I write every article myself, from my views on the team today to the matches, players and moments from Liverpool’s past.</p>
      <h2>The brief</h2>
      <p>I started the site as a short Liverpool news briefing. You can still find that in <Link href="/brief">its own section</Link>, but my articles are now the main focus.</p>
      <h2>Get in touch</h2>
      <p><a href="mailto:theliverpoolbrief@gmail.com">theliverpoolbrief@gmail.com</a></p>
    </div>
  </main></>;
}
