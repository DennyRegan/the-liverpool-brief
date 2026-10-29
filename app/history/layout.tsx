import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/SiteHeader';
import { HistoryNavigation } from '@/app/components/history/HistoryNavigation';
import { canViewHistoryPrototype } from '@/lib/history-prototype-access';
import './history.css';
export async function generateMetadata(): Promise<Metadata> {
  return await canViewHistoryPrototype() ? { robots: { index: false, follow: false } } : {};
}
export default async function HistoryLayout({ children }: { children: React.ReactNode }) {
  const review = await canViewHistoryPrototype();
  return <div className="hl-surface"><SiteHeader active="history" /><div className="site-width hl-wrap"><div className="hl-mast"><Link href="/history">The History Library</Link><Link href="/search">Search history <span aria-hidden="true">↗</span></Link></div><HistoryNavigation />{children}{review && <p className="hl-editor-tools"><Link href="/preview/history/newsletter">Editorial tools: Sunday Brief discovery →</Link></p>}</div></div>;
}
