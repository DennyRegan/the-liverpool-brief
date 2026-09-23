// Prepare an editorial proposal only. Never edit the published Match Centre.
import fs from 'node:fs';
import path from 'node:path';
import { getMatchCentre } from '../lib/content/match-centre.ts';
import { prepareLeagueTable } from './lib/prepare-league-table.mjs';

const root = process.cwd();
const current = getMatchCentre(root);
const source = current.sources.find(item => item.id === 'table');
if (!source) throw new Error('Match Centre is missing its league table source');

try {
  const response = await fetch(source.url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'TheLiverpoolBrief/1.0 (editorial table review)' } });
  if (!response.ok) throw new Error(`Table source returned HTTP ${response.status}`);
  const { proposal, changes } = prepareLeagueTable(await response.text(), current);
  if (!changes.length) {
    console.log(`No standings changes. Source snapshot: ${proposal.table.asOf}; published snapshot: ${current.table.asOf}.`);
  } else {
    const out = path.join(root, 'docs/editorial/table-proposals', `${current.season}-${proposal.table.asOf.slice(0, 10)}.json`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    // Keep only the table in the proposal, so later fixture edits cannot be overwritten.
    fs.writeFileSync(out, JSON.stringify({ season: current.season, preparedAt: proposal.updatedAt, sourceUrl: source.url, sourceCheckedOn: proposal.sources.find(item => item.id === 'table').checkedOn, table: proposal.table }, null, 2) + '\n', { flag: 'wx' });
    const previous = current.table.rows.find(row => row.clubId === 'liverpool');
    const liverpool = proposal.table.rows.find(row => row.clubId === 'liverpool');
    console.log(`Proposal: ${path.relative(root, out)}\nSource: ${source.url}\nSnapshot: ${proposal.table.asOf}\nChanged clubs: ${changes.length}/20\nLiverpool: ${previous.position} → ${liverpool.position} place, ${previous.points} → ${liverpool.points} points.\nReview all 20 rows and recorded results before merging the proposed table into the published file. Nothing has been published.`);
  }
} catch (error) {
  console.error(`No table proposal created: ${error.message}`);
  process.exitCode = 1;
}
