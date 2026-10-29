/** Serializable view data shared by the chronological list, atlas and reading pages. */
export type AtlasMatch = {
  slug: string; href: string; title: string; excerpt: string; historicalEventDate: string;
  season: string; number: number; home: string; away: string; score: string;
  competition: string; locationId: string; playerIds: string[]; managerIds: string[];
};
export type AtlasVenue = {
  id: string; label: string; city: string; latitude: number; longitude: number;
  note: string; source: string; retrievedOn: string;
};
export type AtlasGround = AtlasVenue & { matches: AtlasMatch[] };

/** No season-specific branches: later selections can supply the same article relationships. */
export function groupMatchesByVenue(matches: AtlasMatch[], venues: AtlasVenue[]): AtlasGround[] {
  const locations = new Map(venues.map(venue => [venue.id, venue]));
  const groups = new Map<string, AtlasGround>();
  for (const match of matches) {
    const venue = locations.get(match.locationId);
    if (!venue) throw new Error(`No verified atlas location for ${match.locationId}`);
    const group = groups.get(venue.id) ?? { ...venue, matches: [] };
    group.matches.push(match);
    groups.set(venue.id, group);
  }
  return [...groups.values()];
}

// Equirectangular projection, standard parallel approximately 56° N.
// Both the coastline and stadium anchors use the same projection.
export function projectBritain(longitude: number, latitude: number): [number, number] {
  return [320 + (longitude + 3) * 28, 24 + (60.9 - latitude) * 50];
}

/** Group nearby grounds by city at this map scale, preserving each stadium record. */
export function groupAtlasLocations(grounds: AtlasGround[]) {
  const cities = new Map<string, AtlasGround[]>();
  for (const ground of grounds) {
    const group = cities.get(ground.city) ?? [];
    group.push(ground);
    cities.set(ground.city, group);
  }
  return [...cities.values()].map(group => ({
    // A view key, never a new canonical location ID.
    id: group.map(ground => ground.id).join("+"),
    label: group.length > 1 ? group[0].city : group[0].label,
    city: group[0].city,
    grounds: group,
    // The cluster anchor is derived from verified stadium positions.
    latitude: group.reduce((sum, ground) => sum + ground.latitude, 0) / group.length,
    longitude: group.reduce((sum, ground) => sum + ground.longitude, 0) / group.length,
    matches: group.flatMap(ground => ground.matches).sort((a, b) => a.historicalEventDate.localeCompare(b.historicalEventDate)),
  }));
}

export function historyDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export function matchLabel(match: Pick<AtlasMatch, "home" | "score" | "away">): string {
  return `${match.home} ${match.score} ${match.away}`;
}
