import type { Metadata } from 'next';
import { getHistoryView } from '@/lib/content/history-library-view';
import { EntityReading } from '@/app/components/history/EntityReading';
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params; const e = (await getHistoryView()).entities.find(e => e.id === id && e.kind !== 'person');
  return e ? { title: `${e.label} | History | The Liverpool Brief`, alternates: { canonical: `/history/explore/${id}` } } : {};
}
export default async function EntityPage({ params }: Props) { return <EntityReading id={(await params).id} library={await getHistoryView()} person={false} />; }
