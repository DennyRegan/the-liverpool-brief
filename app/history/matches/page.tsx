import { HistoryBrowse } from "@/app/components/history/HistoryBrowse";

export const metadata = {
  title: "Liverpool Historical Matches | The Liverpool Brief",
  description: "Factual reports of Liverpool matches, with verified accounts of the goals, performances and historical context.",
  alternates: { canonical: "/history/matches" },
};

export default function HistoryMatchesPage() {
  return <HistoryBrowse section="matches" />;
}
