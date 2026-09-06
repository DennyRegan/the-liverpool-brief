import Link from "next/link";

export function SiteHeader({ active }: { active: "home" | "articles" | "brief" | "about" }) {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="site-width">
        <div className="masthead-meta"><span>Independent Liverpool writing</span><Link href="/about">By Denny Regan</Link></div>
        <Link href="/" className="masthead">The Liverpool<span> Brief</span><span className="masthead-dot">.</span></Link>
        <div className="header-bottom">
          <p>Opinion and history from a Liverpool supporter.</p>
          <nav aria-label="Main navigation">
            {([{ href: "/", label: "Articles", key: "articles" }, { href: "/brief", label: "The Brief", key: "brief" }, { href: "/about", label: "About", key: "about" }] as const).map(item => (
              <Link key={item.key} href={item.href} aria-current={active === item.key || (active === "home" && item.key === "articles") ? "page" : undefined}>{item.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
