/* eslint-disable @next/next/no-img-element -- ImageResponse uses Satori image elements, not browser next/image. */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { fitHeadline, socialImageSize } from './social-card';
import { articlePhoto } from './social-photo';

export { socialImageSize } from './social-card';
let font: Promise<Buffer> | undefined;

/** One editorial system for every article; no network fonts or remote photographs. */
export async function socialImage(title: string, section: string, body = '') {
  const fontData = await (font ??= readFile(path.join(process.cwd(), 'assets/social/SourceSerif4Display-Bold.ttf')));
  const photo = await articlePhoto(body);
  const panelWidth = photo ? 770 : 1200;
  const headline = fitHeadline(title, panelWidth - 112, 370, photo ? 106 : 136);
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#181b1a', color: '#f6f1e8', fontFamily: 'Source Serif', fontWeight: 700 }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: panelWidth, height: 630, padding: '52px 56px 48px' }}>
        <div style={{ display: 'flex', fontSize: 27, letterSpacing: '1.5px' }}>THE LIVERPOOL BRIEF</div>
        <div style={{ display: 'flex', width: 64, height: 5, background: '#b52b3c', marginTop: 24 }} />
        <div style={{ display: 'flex', fontSize: 21, textTransform: 'uppercase', letterSpacing: '2px', color: '#d0c8bf', marginTop: 19 }}>{section}</div>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', marginTop: 18 }}>
          {headline.lines.map((line, index) => <div key={index} style={{ display: 'flex', whiteSpace: 'nowrap', fontSize: headline.fontSize, lineHeight: 1.08, height: headline.lineHeight, letterSpacing: '-1.6px' }}>{line}</div>)}
        </div>
      </div>
      {photo && <img src={photo} alt="" width={430} height={630} style={{ objectFit: 'cover' }} />}
    </div>,
    { ...socialImageSize, fonts: [{ name: 'Source Serif', data: fontData, weight: 700, style: 'normal' }] },
  );
}
