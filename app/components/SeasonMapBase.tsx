import base from "@/lib/season-map/base.json";
import { project } from "@/lib/season-map/views";

// The printed sheet under the pins: coast, waterlines, borders, graticule and sea
// names, drawn once at build time (scripts/build-season-map.mjs) from Natural
// Earth data. A server component, so the paths ship as plain SVG, not JavaScript.

type SeaLabel = { name: string; lat: number; lng: number; view: "britain" | "europe" };

const SEAS: SeaLabel[] = [
  { name: "Irish Sea", lat: 53.75, lng: -4.85, view: "britain" },
  { name: "North Sea", lat: 54.9, lng: 0.95, view: "britain" },
  { name: "English Channel", lat: 50.1, lng: -1.4, view: "britain" },
  { name: "Atlantic Ocean", lat: 46.5, lng: -7.6, view: "europe" },
  { name: "North Sea", lat: 56.3, lng: 3.2, view: "europe" },
  { name: "Mediterranean Sea", lat: 35.0, lng: 18.5, view: "europe" },
  { name: "Black Sea", lat: 43.9, lng: 33.0, view: "europe" },
];

export function SeasonMapBase() {
  return <>
    <defs>
      <path id="sm-land" d={base.land} vectorEffect="non-scaling-stroke" />
    </defs>
    <path className="sm-graticule" d={base.graticule} vectorEffect="non-scaling-stroke" />
    {/* Engraved waterlines: three soft bands following the coast. */}
    <use href="#sm-land" className="sm-water sm-water-3" />
    <use href="#sm-land" className="sm-water sm-water-2" />
    <use href="#sm-land" className="sm-water sm-water-1" />
    <use href="#sm-land" className="sm-land" />
    <path className="sm-borders" d={base.borders} vectorEffect="non-scaling-stroke" />
    {SEAS.map(sea => {
      const { x, y } = project(base.projection, sea.lat, sea.lng);
      return <g key={`${sea.view}-${sea.name}`} className={`sm-fixed sm-sea sm-in-${sea.view}`} style={{ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(var(--sm-inv))` }}>
        {/* One word to a line, so a long name stays clear of the frame. */}
        <text textAnchor="middle">{sea.name.split(" ").map((word, line) => <tspan key={word} x="0" dy={line ? "1.25em" : 0}>{word}</tspan>)}</text>
      </g>;
    })}
  </>;
}
