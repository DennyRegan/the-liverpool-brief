import { getEditionContents } from "@/lib/edition-contents";

export function EditionContents({ body, title, href = "" }: {
  body: string; title: string; href?: string;
}) {
  const sections = getEditionContents(body, title);
  if (!sections.length) return null;
  return <nav className="edition-contents" aria-label="In this edition">
    <p className="eyebrow">In this edition</p>
    <ol>{sections.map(section => <li key={section.id}>
      <a href={`${href}#${section.id}`}>{section.title}</a>
    </li>)}</ol>
  </nav>;
}
