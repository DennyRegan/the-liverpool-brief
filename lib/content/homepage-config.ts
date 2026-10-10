import fs from 'node:fs';
import path from 'node:path';
import { LeadOverrideSchema } from './homepage.ts';

export function getHomeLeadOverride(root = process.cwd()) {
  return LeadOverrideSchema.parse(JSON.parse(fs.readFileSync(path.join(root, 'lib/content/homepage-override.json'), 'utf8')));
}
