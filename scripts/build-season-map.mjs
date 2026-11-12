// Draws the vintage base map for the season maps (Looking Back > Seasons) once,
// from public-domain Natural Earth 1:50m data (the world-atlas package), and
// writes it to lib/season-map/base.json. The site only reads that file, so the
// page ships ready-made SVG paths and needs no map library or tile service.
//
// Run again only if the map area changes:  node scripts/build-season-map.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { geoGraticule, geoMercator, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";

const require = createRequire(import.meta.url);
const land = require("world-atlas/land-50m.json");
const countries = require("world-atlas/countries-50m.json");

// One square Mercator sheet, 1000 units a side, covering Europe from the
// Atlantic to the Black Sea's eastern shore (Trabzon). The Britain view is a
// 5x zoom into the same sheet, so one set of paths serves both views.
const SIZE = 1000;
const rad = Math.PI / 180;
const WEST = -12, EAST = 43;                 // degrees of longitude across the sheet
const scale = SIZE / ((EAST - WEST) * rad);  // units per radian
const yTop = 1.0 + SIZE / scale / 2;         // Mercator y of the top edge (sheet centred near 48°N)

const projection = geoMercator().scale(scale).center([0, 0]).translate([-scale * WEST * rad, scale * yTop])
  .clipExtent([[-12, -12], [SIZE + 12, SIZE + 12]]);

// Compact path text: one decimal place, relative moves ("l dx dy") after each "M".
function compact(d) {
  if (!d) return "";
  return d.split("M").filter(Boolean).map(ring => {
    const closed = ring.endsWith("Z");
    const points = ring.replace("Z", "").split("L").map(pair => pair.split(",").map(n => Math.round(Number(n) * 10)));
    let out = `M${points[0][0] / 10} ${points[0][1] / 10}`;
    let [px, py] = points[0];
    let kept = 1;
    for (const [x, y] of points.slice(1)) {
      if (x === px && y === py) continue;
      out += `l${(x - px) / 10} ${(y - py) / 10}`;
      px = x; py = y; kept += 1;
    }
    return kept > 2 || !closed ? out + (closed ? "z" : "") : "";
  }).join("");
}

const draw = geoPath(projection);
const base = {
  source: "Natural Earth 1:50m (public domain), via world-atlas",
  size: SIZE,
  projection: { west: WEST, yTop, scale },
  land: compact(draw(feature(land, land.objects.land))),
  borders: compact(draw(mesh(countries, countries.objects.countries, (a, b) => a !== b))),
  graticule: compact(draw(geoGraticule().step([5, 5])())),
};

const file = path.join(import.meta.dirname, "../lib/season-map/base.json");
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(base) + "\n");
console.log(`Wrote ${path.relative(process.cwd(), file)}: land ${(base.land.length / 1024).toFixed(0)} KB, borders ${(base.borders.length / 1024).toFixed(0)} KB, graticule ${(base.graticule.length / 1024).toFixed(1)} KB`);
