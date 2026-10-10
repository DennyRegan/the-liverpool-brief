import { updateLeagueTable } from './lib/update-league-table.mjs';
const args = process.argv.slice(2);
if (args.some(arg => !['--write', '--check'].includes(arg)) || args.includes('--write') && args.includes('--check')) throw new Error('Use --check (default) or --write');
try {
  const result = await updateLeagueTable(process.cwd(), { write: args.includes('--write') });
  console.log(result.changed ? `${args.includes('--write') ? 'Updated' : 'Validated candidate for'} all 20 clubs (${result.changes.length} changed); ${result.updatedFixtures.length} verified Liverpool league results. Table as of ${result.proposal.table.asOf}.` : `No standings changes; stored data and timestamps retained.${result.note ? ` ${result.note}` : ''}`);
} catch (error) {
  console.error(`Table refresh stopped; stored data retained: ${error.message}`);
  process.exitCode = 1;
}
