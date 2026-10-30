import Link from "next/link";
import { getEditionNeighbours, getReganOnFootballEditions, REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";

export function EditionNavigation({ slug }: { slug: string }) {
  const { newer, older } = getEditionNeighbours(getReganOnFootballEditions(), slug);
  return <nav className="edition-navigation" aria-label="Football Observed editions">
    <Link className="collection-link" href={REGAN_ON_FOOTBALL_PATH}>All Football Observed editions →</Link>
    {(newer || older) && <div>{[older, newer].map(edition => edition && <Link key={edition.slug} href={`/articles/${edition.slug}`}>
      <span className="eyebrow">{edition === older ? "Previous edition" : "Newer edition"}</span>
      <span>{edition.title}</span>
    </Link>)}</div>}
  </nav>;
}
