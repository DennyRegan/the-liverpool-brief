import { cache } from "react";
import { getV3Context, deriveTimeline, getJourneys } from "./history-v3";
// Request/render-scoped reuse; only small view projections reach the reader.
export const getV3View = cache(() => {
  const context = getV3Context();
  return {
    context,
    timeline: deriveTimeline(context),
    journeys: getJourneys(process.cwd(), context),
  };
});
