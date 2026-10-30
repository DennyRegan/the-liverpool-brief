import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Root, RootContent, PhrasingContent } from "mdast";

export const EDITION_OPENING_ID = "edition-opening";
export type EditionSection = { id: string; title: string };

function plainText(node: RootContent | PhrasingContent): string {
  if (node.type === "html") return "";
  if ("value" in node) return node.value;
  if ("alt" in node) return node.alt ?? "";
  if ("children" in node) return node.children.map(plainText).join("");
  return "";
}

// Both the contents and rendered headings use the same Markdown tree rules.
// Only top-level H2s are subjects; code fences and quoted headings are not.
function sectionsFromTree(tree: Root) {
  const used = new Set([EDITION_OPENING_ID]);
  return tree.children.flatMap(node => {
    if (node.type !== "heading" || node.depth !== 2) return [];
    const title = plainText(node).replace(/\s+/g, " ").trim();
    if (!title) return [];
    const base = `edition-${title.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "section"}`;
    let id = base;
    for (let suffix = 2; used.has(id); suffix++) id = `${base}-${suffix}`;
    used.add(id);
    return [{ node, id, title }];
  });
}

export function getEditionContents(body: string, title: string): EditionSection[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(body);
  const headings = sectionsFromTree(tree);
  if (!headings.length) return [];
  const opening = tree.children[0] !== headings[0].node
    ? [{ id: EDITION_OPENING_ID, title }] : [];
  const contents = [...opening, ...headings.map(({ id, title }) => ({ id, title }))];
  return contents.length > 1 ? contents : [];
}

export function remarkEditionHeadings() {
  return (tree: Root) => {
    for (const { node, id } of sectionsFromTree(tree)) {
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id, tabIndex: -1 } };
    }
  };
}
