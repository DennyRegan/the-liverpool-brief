import { cache } from 'react';
import { canViewHistoryPrototype } from '../history-prototype-access';
import { loadHistoryPrototype } from './history-prototype';
import { getHistoryLibrary } from './history-library';

// Private review data is added only after the existing flag AND loopback checks.
export const getHistoryView = cache(async () => getHistoryLibrary(process.cwd(),
  await canViewHistoryPrototype() ? loadHistoryPrototype().season : undefined));
