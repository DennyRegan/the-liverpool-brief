import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";

export const metadata = { title: "About | The Liverpool Brief", description: "Liverpool opinion and history by Denny Regan." };

export default function AboutPage() {
  return <><SiteHeader active="about" /><main id="main-content" className="reading-page about-page">
    <p className="eyebrow">The writer behind the site</p>
    <h1>Denny Regan</h1>
    <p className="standfirst">Liverpool opinion and history, with a supporter’s perspective.</p>
    <div className="article-body">
      <p>The Liverpool Brief is Denny Regan’s independent Liverpool publication, bringing together his opinion articles and writing about the club’s history.</p>
      <h2>The writing</h2>
      <p>Original articles are the heart of the site. Denny writes the articles himself, with AI assistance for research, fact-checking and grammar. The views and words are his own.</p>
      <h2>The brief</h2>
      <p>The site began as a short Liverpool news briefing. That feature now has <Link href="/brief">its own section</Link>, while the homepage puts Denny’s writing first.</p>
      <h2>Get in touch</h2>
      <p><a href="mailto:theliverpoolbrief@gmail.com">theliverpoolbrief@gmail.com</a></p>
    </div>
  </main></>;
}
