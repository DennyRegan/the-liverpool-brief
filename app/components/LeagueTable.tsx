import type { MatchCentre } from '@/lib/content/match-centre';

export function LeagueTable({ table, season, label }: { table: MatchCentre['table']; season: string; label: (id: string) => string }) {
  const columns = [['P', 'Played'], ['W', 'Won'], ['D', 'Drawn'], ['L', 'Lost'], ['GF', 'Goals for'], ['GA', 'Goals against'], ['GD', 'Goal difference'], ['Pts', 'Points']];
  return <>
    <p id="league-table-help" className="mc-note">All 20 clubs. On smaller screens, scroll the table sideways to see every column.</p>
    <div className="mc-table-scroll" role="region" aria-label="Premier League standings" aria-describedby="league-table-help" tabIndex={0}>
      <table className="mc-table"><caption>Premier League standings, {season.replace('-', '–')}</caption>
        <thead><tr><th scope="col"><abbr title="Position">Pos</abbr></th><th scope="col">Team</th>{columns.map(([short, full]) => <th scope="col" key={short}><abbr title={full}>{short}</abbr></th>)}</tr></thead>
        <tbody>{[...table.rows].sort((a, b) => a.position - b.position).map(row => <tr key={row.clubId} className={row.clubId === 'liverpool' ? 'mc-liverpool' : undefined}>
          <td>{row.position}</td><th scope="row">{label(row.clubId)}{row.note && <small>{row.note}</small>}</th>
          <td>{row.played}</td><td>{row.won}</td><td>{row.drawn}</td><td>{row.lost}</td><td>{row.goalsFor}</td><td>{row.goalsAgainst}</td>
          <td>{row.goalsFor - row.goalsAgainst > 0 ? '+' : ''}{row.goalsFor - row.goalsAgainst}</td><td>{row.points}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </>;
}
