import { notFound } from 'next/navigation';
import { getExplorations } from '@/lib/content/exploration';
import { EntityExploration } from '@/app/components/history/EntityExploration';
export const dynamicParams = false;
type Props = { params: Promise<{ id: string }> };
const destinations = () => getExplorations().filter(d => d.entity.kind === 'competition');
export function generateStaticParams() { return destinations().map(d => ({ id: d.entity.id })); }
export async function generateMetadata({ params }: Props) {
  const { id } = await params; const d = destinations().find(d => d.entity.id === id); if (!d) notFound();
  return { title: `${d.entity.label} | Liverpool History | The Liverpool Brief`, description: `Explore ${d.entity.label} through Liverpool match reports and historical writing.`, alternates: { canonical: d.href } };
}
export default async function Page({ params }: Props) {
  const { id } = await params; const d = destinations().find(d => d.entity.id === id); if (!d) notFound();
  return <EntityExploration destination={d} />;
}
