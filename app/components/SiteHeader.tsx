import Link from "next/link";

export function SiteHeader({ active }: { active?: "home" | "articles" | "about" }) {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="site-width">
        <Link href="/" className="masthead">The Liverpool<span> Brief</span><span className="masthead-dot">.</span></Link>
        <div className="header-bottom">
          <p>Independent Liverpool writing by Denny Regan.</p>
          <nav aria-label="Main navigation">
            {([{ href: "/", label: "Home", key: "home" }, { href: "/articles", label: "Articles", key: "articles" }, { href: "/about", label: "About", key: "about" }] as const).map(item => (
              <Link key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined}>{item.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
