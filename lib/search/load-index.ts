import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { SearchDocument } from './search.ts';

let documents: SearchDocument[] | undefined;
export function loadSearchIndex(): SearchDocument[] {
  // Generated before next build; traced only into the Search server route.
  documents ??= JSON.parse(fs.readFileSync(path.join(process.cwd(), '.generated/search-index.json'), 'utf8'));
  return documents!;
}
