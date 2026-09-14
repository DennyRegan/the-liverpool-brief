import { HistoryBrowse } from "@/app/components/history/HistoryBrowse";

export const metadata = {
  title: "Liverpool Players in History | The Liverpool Brief",
  description: "Factual Liverpool player biographies and historical accounts, exploring their careers and contributions to the club.",
  alternates: { canonical: "/history/players" },
};

export default function HistoryPlayersPage() {
  return <HistoryBrowse section="players" />;
}
