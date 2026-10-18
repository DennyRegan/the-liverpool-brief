import { getWriting } from './writing.ts';
import { getFactualHistoryArticles } from './archive.ts';
import { getHistoryEntities } from './entities.ts';
import { getMatchCentre, getMatchRegister, selectMatches, fixtureTime, type Fixture } from './match-centre.ts';
import { getLondonToday } from './this-week.ts';
import { formatLongDate } from '../format.ts';

export type WritingItem = {
  slug: string; href: string; title: string; category: string; date: string;
  body: string; excerpt?: string; season?: string; fixtureId?: string;
  editorialMode?: string; byline?: string; matchContext?: string; dateLabel?: string;
};

/** Context comes from the referenced sourced fixture, never a parsed headline. */
export function matchContext(fixture: Fixture, showResult: boolean, root = process.cwd()) {
  const names = new Map(getHistoryEntities(root).map(entity => [entity.id, entity.label]));
  const opposition = names.get(fixture.oppositionId)!;
  const home = fixture.side === 'away' ? opposition : 'Liverpool';
  const away = fixture.side === 'away' ? 'Liverpool' : opposition;
  const score = showResult && fixture.status === 'completed' ? fixture.score : undefined;
  const match = `${home} ${score ? `${score.home}–${score.away}` : 'v'} ${away}`;
  const resultNote = score && fixture.penalties
    ? `${fixture.afterExtraTime ? 'After extra time; ' : ''}${fixture.penalties.home}–${fixture.penalties.away} on penalties (home–away)`
    : score && fixture.afterExtraTime ? 'After extra time' : undefined;
  const competition = fixture.competitionId === 'european-cup' ? 'Champions League' : names.get(fixture.competitionId)!;
  return [match, resultNote, competition, fixture.date ? formatLongDate(fixture.date) : fixture.dateNote,
    !showResult && fixture.status === 'scheduled' ? fixtureTime(fixture) : undefined,
    fixture.status === 'postponed' ? 'Postponed' : fixture.status === 'cancelled' ? 'Cancelled' : undefined,
  ].filter(Boolean).join(' · ');
}

export function articleMatchContext(article: { season?: string; fixtureId?: string; category: string }, root = process.cwd()) {
  if (!article.season || !article.fixtureId) return undefined;
  const fixture = getMatchRegister(article.season, root).fixtures.find(item => item.id === article.fixtureId);
  return fixture ? matchContext(fixture, article.category !== 'Preview', root) : undefined;
}

/** A projection of already-public prose, with no copied article or new URL. */
export function getLegacyMatchWriting(root = process.cwd()): WritingItem[] {
  const data = getMatchCentre(root);
  const { next } = selectMatches(data);
  const fixtures = data.fixtures.filter(f => f.preview || f.briefing).sort((a, b) =>
    Number(b.id === next?.id) - Number(a.id === next?.id) || (b.date ?? '').localeCompare(a.date ?? '') || a.id.localeCompare(b.id));
  return fixtures.map((fixture, index) => {
    const updatedAt = fixture.preview?.updatedAt ?? fixture.briefing!.updatedAt;
    return {
      slug: fixture.id, href: `/match-centre#${index === 0 ? 'match-preview' : `writing-${fixture.id}`}`,
      title: fixture.preview?.title ?? 'Liverpool match briefing', category: fixture.preview ? 'Preview' : 'Match briefing',
      date: getLondonToday(new Date(updatedAt)), dateLabel: 'Updated', season: data.season, fixtureId: fixture.id,
      body: [fixture.preview?.body, ...(fixture.briefing?.points ?? [])].filter(Boolean).join('\n\n'),
      matchContext: matchContext(fixture, false, root),
    };
  });
}

export function getArticleCollection(root = process.cwd()): WritingItem[] {
  const writing: WritingItem[] = getWriting(root).map(article => ({
    ...article, byline: 'Denny Regan', matchContext: articleMatchContext(article, root),
  }));
  const data = getMatchCentre(root);
  const reports = new Map(getFactualHistoryArticles(root).map(article => [article.slug, article]));
  // Only explicit current-register report links enter Articles. Historical
  // matches and biographies keep their existing History-only collections.
  const currentReports = data.fixtures.flatMap(fixture => {
    const report = fixture.reportSlug ? reports.get(fixture.reportSlug) : undefined;
    return report ? [{ ...report, href: `/archive/${report.slug}`, category: 'Match report',
      fixtureId: fixture.id, matchContext: matchContext(fixture, true, root) }] : [];
  });
  return [...new Map([...writing, ...getLegacyMatchWriting(root), ...currentReports].map(article => [article.href, article])).values()]
    .sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href));
}

export function getCurrentSeasonReading(season: string, root = process.cwd()) {
  const writing = getWriting(root).filter(article => article.season === season);
  const reports = getFactualHistoryArticles(root).filter(article => article.season === season && article.articleType === 'match')
    .map(article => ({ ...article, category: 'Match report', href: `/archive/${article.slug}` }));
  return [...new Map([...writing, ...reports].map(article => [article.href, article])).values()]
    .sort((a, b) => b.date.localeCompare(a.date) || a.href.localeCompare(b.href));
}

export function getCurrentReportFixture(slug: string, root = process.cwd()) {
  return getMatchCentre(root).fixtures.find(fixture => fixture.reportSlug === slug);
}
