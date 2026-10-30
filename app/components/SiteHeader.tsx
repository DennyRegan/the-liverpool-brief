import Link from "next/link";

export function SiteHeader({ active }: { active?: "home" | "articles" | "history" | "about" | "football-observed" }) {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="site-width">
        <Link href="/" className="masthead">The Liverpool<span> Brief</span><span className="masthead-dot">.</span></Link>
        <div className="header-bottom">
          <p>Independent Liverpool writing by Denny Regan.</p>
          <nav aria-label="Main navigation">
            {([{ href: "/", label: "Home", key: "home" }, { href: "/articles", label: "Articles", key: "articles" }, { href: "/history", label: "History", key: "history" }, { href: "/regan-on-football", label: "Football Observed", key: "football-observed" }] as const).map(item => (
              <Link key={item.key} href={item.href} aria-current={active === item.key ? "page" : undefined}>{item.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
