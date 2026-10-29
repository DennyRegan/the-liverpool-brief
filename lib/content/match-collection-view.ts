import { cache } from 'react';
import { canViewHistoryPrototype } from '../history-prototype-access';
import { getMatchCollection } from './match-collection';
export const getMatchCollectionView = cache(async () => {
  const review = await canViewHistoryPrototype();
  return { review, matches: getMatchCollection(process.cwd(), review) };
});
