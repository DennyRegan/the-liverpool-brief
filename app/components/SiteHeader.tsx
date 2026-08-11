import Link from "next/link";

const navLinkBase = "text-sm font-medium pb-1";
const navLinkActive = `${navLinkBase} text-accent border-b-2 border-accent`;
const navLinkInactive = `${navLinkBase} text-gray-500 hover:text-accent`;

export function SiteHeader({ active }: { active: "home" | "articles" | "archive" | "about" }) {
  return (
    <header className="border-b border-gray-200 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900">The Liverpool Brief</h1>
        <p className="text-gray-600 mt-2">Today's important Liverpool FC news</p>
        <nav className="mt-4 flex gap-6">
          <Link href="/" className={active === "home" ? navLinkActive : navLinkInactive}>
            Home
          </Link>
          <Link href="/articles" className={active === "articles" ? navLinkActive : navLinkInactive}>
            Articles
          </Link>
          <Link href="/archive" className={active === "archive" ? navLinkActive : navLinkInactive}>
            The Liverpool Archive
          </Link>
          <Link href="/about" className={active === "about" ? navLinkActive : navLinkInactive}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
