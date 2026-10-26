import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';
import { fitHeadline, headlineWidth, socialSection } from '../lib/social-card.ts';
import { articlePhoto } from '../lib/social-photo.ts';

test('the full headline fits both panels without clipping, truncation or dropped words', () => {
  const titles = [
    'The Best Ever 19-Year-Old?',
    'Liverpool Squad Update: Barcola Available as Iraola Faces Brighton Selection Dilemma',
    'What Liverpool’s Next Generation Can Learn from Lamine Yamal, Lionel Messi and Cristiano Ronaldo as the Premier League Title Race Takes Another Unexpected Turn',
    'W'.repeat(180), 'Araújo, Muñoz & Groß — what happens next?',
  ];
  for (const title of titles) for (const width of [1088, 658]) {
    const fit = fitHeadline(title, width, 370, width === 658 ? 106 : 136);
    assert.ok(fit.lines.length * fit.lineHeight <= 370);
    assert.ok(fit.lines.every(line => headlineWidth(line, fit.fontSize) <= width));
    assert.equal(fit.lines.join('').replace(/\s/g, ''), title.replace(/\s/g, ''));
  }
});

test('Football Observed is recognised from existing metadata without reclassifying other categories', () => {
  assert.equal(socialSection({ category: 'Opinion', tags: ['regan-on-football'] }), 'Football Observed');
  for (const category of ['Opinion', 'Analysis', 'Team News', 'History']) {
    assert.equal(socialSection({ category }), category);
  }
  assert.equal(socialSection({ category: 'Analysis', tags: ['regan-on-football'] }), 'Analysis');
});

test('local article photography is cropped without distortion; unsafe or unusable assets fall back', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'social-photo-'));
  try {
    const publicRoot = path.join(root, 'public');
    await fs.mkdir(publicRoot);
    const photo = await sharp({ create: { width: 1200, height: 800, channels: 3, background: '#476657' } }).jpeg().toBuffer();
    await fs.writeFile(path.join(publicRoot, 'photo.jpg'), photo);
    await fs.writeFile(path.join(publicRoot, 'corrupt.jpg'), 'not a photo');
    await fs.writeFile(path.join(publicRoot, 'small.png'), await sharp(photo).resize(100, 100).png().toBuffer());
    await fs.writeFile(path.join(root, 'outside.jpg'), photo);
    await fs.symlink(path.join(root, 'outside.jpg'), path.join(publicRoot, 'outside-link.jpg'));
    const result = await articlePhoto('![An approved article photo](/photo.jpg)', root);
    assert.ok(result?.startsWith('data:image/jpeg;base64,'));
    const metadata = await sharp(Buffer.from(result.split(',')[1], 'base64')).metadata();
    assert.equal(metadata.width, 430); assert.equal(metadata.height, 630);
    for (const body of [
      '', '![Photo](https://example.com/photo.jpg)', '![Photo](/missing.jpg)',
      '![Photo](/corrupt.jpg)', '![Photo](/small.png)', '![Chart](/photo.jpg)',
      '![Photo](/chart.png)', '![Photo](/graphic.svg)', '![Photo](/../outside.jpg)',
      '![Photo](/%2e%2e/outside.jpg)', '![Photo](/outside-link.jpg)',
    ]) assert.equal(await articlePhoto(body, root), undefined, body);
    assert.ok(await articlePhoto('![Missing](/missing.jpg)\n![Second approved photo](/photo.jpg)', root));
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
