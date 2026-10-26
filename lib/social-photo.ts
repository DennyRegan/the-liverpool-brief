import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/** Reuse an already-published local article photograph, never fetch remote media. */
export async function articlePhoto(body: string, root = process.cwd()): Promise<string | undefined> {
  const publicRoot = await realpath(path.join(root, 'public')).catch(() => undefined);
  if (!publicRoot) return;
  for (const match of body.matchAll(/!\[([^\]]*)\]\(\s*(\/[^\s)]+)(?:\s+["'][^"']*["'])?\s*\)/g)) {
    const [, alt, source] = match;
    if (!/\.(jpe?g|png|webp|avif)$/i.test(source)) continue;
    if (/(?:^|[\s/_-])(?:charts?|graphs?|diagrams?|plots?|logos?|icons?|sprites?|badges?)(?:[\s/_.-]|$)/i.test(`${alt} ${source}`)) continue;
    try {
      const filename = await realpath(path.join(publicRoot, decodeURIComponent(source)));
      if (!filename.startsWith(publicRoot + path.sep)) continue;
      if ((await stat(filename)).size > 8 * 1024 * 1024) continue;
      const bytes = await readFile(filename);
      const { width = 0, height = 0 } = await sharp(bytes, { limitInputPixels: 20_000_000 }).metadata();
      if (width < 600 || height < 400 || width / height < .5 || width / height > 2.4) continue;
      const crop = await sharp(bytes, { limitInputPixels: 20_000_000 }).rotate()
        .resize(430, 630, { fit: 'cover', position: 'attention' }).jpeg({ quality: 86 }).toBuffer();
      return `data:image/jpeg;base64,${crop.toString('base64')}`;
    } catch {
      // Missing, corrupt, unsuitable or inaccessible media uses the same text card.
    }
  }
}
