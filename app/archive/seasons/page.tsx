import { permanentRedirect } from "next/navigation";

// Seasons now live under Looking Back (12 November 2026).
export default function LegacyArchiveSeasons() {
  permanentRedirect("/looking-back/seasons");
}
