import { formatListDate, getReadingTime } from "@/lib/format";
import { ReganOnFootballLabel } from "./ReganOnFootballLabel";

export function ArticleMeta({ category, date, body, tags, author = false, showColumn = true }: {
  category: string;
  date: string;
  body: string;
  tags?: string[];
  author?: boolean;
  showColumn?: boolean;
}) {
  return (
    <p className="article-meta">
      <span className="article-type">{category}</span>
      <time dateTime={date} aria-label={`Published ${formatListDate(date)}`}>{formatListDate(date)}</time>
      {author && <span className="article-author">By Denny Regan</span>}
      <span className="reading-time">{getReadingTime(body)} min read</span>
      {showColumn && <ReganOnFootballLabel article={{ category, tags }} />}
    </p>
  );
}
