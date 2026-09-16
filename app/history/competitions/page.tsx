import { EntityIndex } from '@/app/components/history/EntityExploration';
export const metadata = { title: 'Competitions | Liverpool History | The Liverpool Brief', description: 'Explore Liverpool history through original writing.', alternates: { canonical: '/history/competitions' } };
export default function Page() { return <EntityIndex kind="competition" />; }
