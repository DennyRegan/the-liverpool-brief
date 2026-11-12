// The season map's one sheet and its two views. The sheet is a square Mercator
// drawing of Europe, 1000 units a side (scripts/build-season-map.mjs); the
// Britain view is a zoom into the same sheet. No file access here, so the
// browser component can use it too.

export const SHEET = 1000;

export type Projection = { west: number; yTop: number; scale: number };
export type Camera = { k: number; cx: number; cy: number };
export type Point = { x: number; y: number };

const rad = Math.PI / 180;

/** Latitude and longitude to sheet units, with the projection saved in base.json. */
export function project(p: Projection, lat: number, lng: number): Point {
  return {
    x: (lng - p.west) * rad * p.scale,
    y: (p.yTop - Math.log(Math.tan(Math.PI / 4 + (lat * rad) / 2))) * p.scale,
  };
}

/** Sheet units per kilometre along the parallel at this latitude. */
export function unitsPerKm(p: Projection, lat: number) {
  return p.scale / (6371 * Math.cos(lat * rad));
}

export const EUROPE: Camera = { k: 1, cx: SHEET / 2, cy: SHEET / 2 };

/** The British Isles from the Channel to the Scottish borders, Belfast and Dublin included. */
export function britainCamera(p: Projection): Camera {
  const centre = project(p, 53.3, -3.2);
  return { k: 5, cx: centre.x, cy: centre.y };
}

/** Whether a point sits comfortably inside a view (a small margin keeps pins off the frame). */
export function inView(camera: Camera, point: Point, margin = 30) {
  const half = (SHEET / 2 - margin) / camera.k;
  return Math.abs(point.x - camera.cx) <= half && Math.abs(point.y - camera.cy) <= half;
}
