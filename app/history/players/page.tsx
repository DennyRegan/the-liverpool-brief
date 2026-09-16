import { HistoryBrowse } from "@/app/components/history/HistoryBrowse";

export const metadata = {
  title: "Liverpool People in History | The Liverpool Brief",
  description: "Explore Liverpool players and managers through original writing, alongside factual biographies and player features.",
  alternates: { canonical: "/history/players" },
};

export default function HistoryPlayersPage() {
  return <HistoryBrowse section="players" />;
}
