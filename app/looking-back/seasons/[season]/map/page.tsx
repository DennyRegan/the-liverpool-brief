import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SeasonMap } from "@/app/components/SeasonMap";
import { SeasonMapBase } from "@/app/components/SeasonMapBase";
import { getSeasonMap, getSeasonMapSeasons, seasonMapPath } from "@/lib/content/season-map";
import { seasonLabel, SEASONS_PATH } from "@/lib/content/seasons";
import { socialMetadata } from "@/lib/social-metadata";
import "@/app/components/history-article.css";

// One season on a vintage map, game by game. A season has this page only when
// it has a folder in content/looking-back/season-maps.

export const dynamicParams = false;
// A Match Revisited link appears by itself once that piece goes live.
export const revalidate = 3600;

type Params = { params: Promise<{ season: string }> };

export function generateStaticParams() {
  return getSeasonMapSeasons().map(season => ({ season }));
}

function describe(count: number, label: string) {
  return `All ${count} games of Liverpool's ${label} season on one map, in the order they were played.`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { season } = await params;
  const map = getSeasonMap(season);
  if (!map) return {};
  const label = seasonLabel(season);
  return socialMetadata(`Liverpool ${label}: the season on a map | The Liverpool Brief`, describe(map.games.length, label), seasonMapPath(season));
}

export default async function SeasonMapPage({ params }: Params) {
  const { season } = await params;
  const map = getSeasonMap(season);
  if (!map) notFound();
  const label = seasonLabel(season);
  const first = map.games[0];
  const last = map.games[map.games.length - 1];
  const keyGames = map.games.filter(game => game.key).length;

  // Long write-ups are rendered here, on the server, and handed to the map ready-made.
  const writeUps: Record<number, ReactNode> = {};
  for (const game of map.games) {
    if (game.writeUp) writeUps[game.number] = <ReactMarkdown remarkPlugins={[remarkGfm]}>{game.writeUp.body}</ReactMarkdown>;
  }
  // The map itself needs only each write-up's title; the text travels once, as rendered above.
  const data = { ...map, games: map.games.map(game => (game.writeUp ? { ...game, writeUp: { title: game.writeUp.title, body: "" } } : game)) };

  return <>
    <SiteHeader active="looking-back" />
    <main id="main-content" className="ha-page sm-sheet">
      <p className="ha-backline"><Link href={`${SEASONS_PATH}/${season}`}>Back to {label} <span aria-hidden="true">→</span></Link></p>
      <header className="ha-head">
        <p className="ha-kicker">Seasons · The map</p>
        <h1 className="ha-headline">Liverpool {label}, game by game</h1>
        <p className="ha-standfirst">{describe(map.games.length, label)}</p>
        <p className="ha-dateline">{map.games.length} games · {first.date.replace(/^\S+ /, "")} to {last.date.replace(/^\S+ /, "")}{keyGames > 0 && ` · ${keyGames} key games`}</p>
      </header>
      <SeasonMap data={data} seasonLabel={label} writeUps={writeUps}>
        <SeasonMapBase />
      </SeasonMap>
      <footer className="ha-foot">
        <p className="ha-links">
          <Link href={`${SEASONS_PATH}/${season}`}>Liverpool {label} <span aria-hidden="true">→</span></Link>
          <Link href={SEASONS_PATH}>All seasons <span aria-hidden="true">→</span></Link>
        </p>
      </footer>
    </main>
  </>;
}
