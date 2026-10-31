import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getLookingBack, LOOKING_BACK_PATH } from "@/lib/content/looking-back";
import { socialMetadata } from "@/lib/social-metadata";
import "./looking-back.css";

export const metadata = socialMetadata(
  "Looking Back | The Liverpool Brief",
  "One short keepsake a week from Liverpool's past.",
  LOOKING_BACK_PATH,
);

export default function LookingBackPage() {
  const pieces = getLookingBack();
  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="site-width collection">
      <h1 className="collection-title">Looking Back</h1>
      {pieces.length ? <ol className="lb-list">
        {pieces.map(piece => <li key={piece.slug}>
          <p className="lb-list-dateline">{piece.dateline}</p>
          <h2><Link href={`${LOOKING_BACK_PATH}/${piece.slug}`}>{piece.title}</Link></h2>
          <p className="preview-excerpt">{piece.excerpt}</p>
        </li>)}
      </ol> : <p className="empty-state">The first keepsake will appear here when published.</p>}
    </main>
  </>;
}
