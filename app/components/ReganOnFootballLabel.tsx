import Link from "next/link";
import { isReganOnFootball, REGAN_ON_FOOTBALL_PATH } from "@/lib/content/regan-on-football";

export function ReganOnFootballLabel({ article }: { article: { category: string; tags?: readonly string[] } }) {
  return isReganOnFootball(article)
    ? <Link className="column-label" href={REGAN_ON_FOOTBALL_PATH}>Football Observed</Link>
    : null;
}
