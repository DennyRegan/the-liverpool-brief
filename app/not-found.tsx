import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
export default function NotFound() {
  return <><SiteHeader active="articles" /><main id="main-content" className="reading-page"><p className="eyebrow">Page unavailable</p><h1>This page is no longer here.</h1><p className="standfirst">You can find Denny’s published writing on the articles page.</p><Link href="/" className="read-link">Browse articles →</Link></main></>;
}
