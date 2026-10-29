'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { HISTORY_NAV } from '@/lib/history-navigation';
export function HistoryNavigation() {
  const pathname = usePathname();
  return <nav className="hl-navigation" aria-label="History categories">{HISTORY_NAV.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname.startsWith(href) ? 'page' : undefined}>{label}</Link>)}</nav>;
}
